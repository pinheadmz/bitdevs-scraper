#! /usr/bin/env node

'use strict';

const {JSDOM} = require('jsdom');
const https = require('https');
const fs = require('fs');
const path = require('path');
require('dns').setDefaultResultOrder('ipv4first');

const argv = process.argv;
if (argv.length !== 4) {
  console.error(
    '\nUSAGE: ' +
    'node scrape.js <start date> <path/to/output/directory>\n'
  );
  process.exit(0);
}

const start = new Date(argv[2]);
// Get that entire first day
start.setUTCHours(0);
start.setUTCMinutes(0);

const end = new Date();
end.setUTCHours(23);
end.setUTCMinutes(59);

let template = fs.readFileSync(path.join(__dirname, '_template.md'), 'utf-8');

(async () => {
  //              section        indent  function               args
  await tryCatch('delving',           0, getDelving,            start);
  await tryCatch('bitcoin_dev',       0, getGoogleML,           start, 'bitcoindev');
  await tryCatch('review_club',       4, getReviewClub,         start);
  await tryCatch('irc_meetings',      4, getCoreDevIRCMeeting,  start);
  await tryCatch('optech',            0, getOptech,             start);
  await tryCatch('bitcoin_core_prs',  0, getPRs,                'bitcoin', 'bitcoin', start);
  await tryCatch('bdk_prs',           0, getPRs,                'bitcoindevkit', 'bdk', start);
  await tryCatch('hwi_prs',           0, getPRs,                'bitcoin-core', 'HWI', start);
  await tryCatch('rust_prs',          0, getPRs,                'rust-bitcoin', 'rust-bitcoin', start);
  await tryCatch('secp_prs',          0, getPRs,                'bitcoin-core', 'secp256k1', start);
  await tryCatch('zkp_prs',           0, getPRs,                'ElementsProject', 'secp256k1-zkp', start);
  await tryCatch('dlc_prs',           0, getPRs,                'discreetlogcontracts', 'dlcspecs', start);
  await tryCatch('cln_prs',           0, getPRs,                'ElementsProject', 'lightning', start);
  await tryCatch('eclair_prs',        0, getPRs,                'ACINQ', 'eclair', start);
  await tryCatch('ldk_prs',           0, getPRs,                'lightningdevkit', 'rust-lightning', start, 'main');
  await tryCatch('lnd_prs',           0, getPRs,                'lightningnetwork', 'lnd', start);
  await tryCatch('bips_prs',          0, getPRs,                'bitcoin', 'bips', start);
  await tryCatch('blips_prs',         0, getPRs,                'lightning', 'blips', start);
  await tryCatch('lnrfc_prs',         0, getPRs,                'lightningnetwork', 'lightning-rfc', start);

  // Finalize
  let eventDate = 'EVENTDATE';
  let eventTitle = 'EVENTTITLE';

  try {
    console.log('Fetching Meetup information');
    const icalUrl = 'https://www.meetup.com/bitdevsnyc/events/ical/';

    const response = await fetchURL(icalUrl);
    const events = response.split('BEGIN:VEVENT');

    if (events.length < 2) {
      throw new Error('No events found in the calendar.');
    }

    // The first event block (skip the calendar header part)
    const firstEventBlock = events[1];

    const getValue = (key) => {
      const match = firstEventBlock.match(new RegExp(`${key}[:;](.+)`));
      return match ? match[1].trim() : null;
    };

    const summary = getValue('SUMMARY');
    eventTitle = 'Socratic Seminar ' + summary.split(' ').pop();

    const dtstart = getValue('DTSTART');
    const date = dtstart.split(':').pop();
    eventDate =
      date.substr(0,4) +
      '-' +
      date.substr(4,2) +
      '-' +
      date.substr(6,2);

    const url = getValue('URL');
    const eventLink = url.split('URI:').pop();

    template = template.replace('{{event_title}}', eventTitle);
    template = template.replace('{{event_link}}', eventLink);
  } catch (e) {
    console.log('Unable to get meetup details:' + e.message);
  }

  const filename =
    eventDate +
    '-' +
    eventTitle.toLowerCase().replaceAll(' ', '-') + '.md';
  const filepath = path.join(argv[3], filename);
  console.log(`Writing file: ${filepath}`);
  fs.writeFileSync(filepath, template);
  console.log('Done!\n\n');
})().catch((err) => {
  console.error('Error: ' + err.message);
  process.exit(1);
});

async function tryCatch(section, indent, fn, ...args) {
  try {
    const links = await fn(...args);
    fillSection(section, indent, links);
  } catch (e) {
    console.log(e.message);
    fillSection(section, 0, []);
  }
}

async function fetchURL(url) {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      {headers: {'User-Agent': 'bitdevs-scraper'}},
      (res) => {
        const data = [];
        res.on('data', (chunk) => {
          data.push(chunk);
        });
        res.on('end', () => {
          resolve(Buffer.concat(data).toString());
        });
      });
  });
}

// ALL DEPRECATED
async function getML(start, name, _url) {
  const links = [];
  const tempd = new Date(start);
  const titles = new Set();

  for (;;) {
    const url = (_url ? _url : `https://lists.linuxfoundation.org/pipermail/${name}/`) +
                tempd.getUTCFullYear() +
                '-' +
                tempd.toLocaleString('UTC', {month: 'long'}) +
                '/thread.html';

    let dom;
    try {
      console.log(`Fetching ${url}`);
      dom = await JSDOM.fromURL(url);
    } catch (e) {
      console.log(`Error getting page, aborting: ${e.message}`);
      break;
    }
    const doc = dom.window.document;
    const items =
      doc.querySelectorAll('body > ul:nth-of-type(2) > li > a[href]');

    for (const i of items) {
      let title = i.innerHTML;

      title = title.replace('\n', '');
      title = title.replace('\t', ' ');
      title = title.replace(/\[.*\] /g, '');

      if (titles.has(title)) {
        console.log(` Already have title: "${title}"`);
        continue;
      } else {
        titles.add(title);
      }

      const href = i.href;

      if (!(await checkMLPostDate(href))) {
        console.log(` Posted before start date: "${title}"`);
        continue;
      }
      links.push(new Link(title, href));
    }

    tempd.setUTCMonth(tempd.getUTCMonth() + 1);
  }

  return links;
}

// ALL DEPRECATED
async function checkMLPostDate(href) {
  let dom;
  try {
    dom = await JSDOM.fromURL(href);
  } catch (e) {
    console.log(`Error getting ML post to check date, aborting: ${e.message}`);
    return true; // err on the side of "sure..."
  }
  const doc = dom.window.document;
  const date = doc.querySelectorAll('i')[0].innerHTML;
  return new Date(date) > start;
}

async function getGoogleML(start, group) {
  const base = `https://groups.google.com/g/${group}`;
  // https://groups.google.com/g/bitcoindev/search?q=after%3A2024-04-01%20before%3A2024-04-29
  const url = base + `/search?q=after%3A${start.toISOString().split('T')[0]}%20before%3A${end.toISOString().split('T')[0]}`;

  console.log(`Fetching ${url}`);

  const dom = await JSDOM.fromURL(url);
  const doc = dom.window.document;
  const convos = doc.querySelectorAll('a');
  const set = new Set();
  convos.forEach((convo) => {
    const href = convo.href;
    if (href.indexOf(base) !== -1
      && href.indexOf('/c/') !== -1
      && !set.has(href)) {
      set.add(href);
    }
  });

  const links = [];
  for (const href of set.values()) {
    const link = href.split('/m/')[0];
    console.log(`  fetching ${link}`);

    const dom = await JSDOM.fromURL(link);
    const title = dom.window.document.title;
    links.push(new Link(title, link));
  };
  return links;
}

async function getReviewClub(start) {
  const url = 'https://bitcoincore.reviews/meetings/';

  console.log(`Fetching ${url}`);
  const links = [];

  const tempd = new Date(start);

  for (;;) {
    const abbr = tempd.toLocaleString('UTC', {month: 'long'}).substr(0, 3);
    console.log(` Month: ${abbr}`);
    const id = abbr + tempd.getUTCFullYear();

    const dom = await JSDOM.fromURL(url);
    const doc = dom.window.document;
    const items = doc.querySelectorAll(`#${id} .Home-posts-post`);
    if (items.length === 0 && tempd > end) {
      console.log(' No more review club meetings found, aborting');
      break;
    }

    items.forEach((i) => {
      const date = new Date(i.querySelector('.Home-posts-post-date').innerHTML);

      if (date < start) {
        console.log(' Meeting is before start date, skipping');
        return; // next item
      }

      if (date > end) {
        console.log(' Meeting is in future, skipping');
        return; // next item
      }

      const link = i.querySelector('.Home-posts-post-title');

      const title = link.innerHTML;
      const href = link.href;
      links.push(new Link(title, href));
    });

    tempd.setUTCMonth(tempd.getUTCMonth() + 1);
  }

  return links;
}

async function getCoreDevIRCMeeting(start) {
  function getURL(date) {
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth() + 1;
    const d = date.getUTCDate();
    return 'https://www.erisian.com.au/bitcoin-core-dev/log-' +
            y +
            '-' +
            String(m).padStart(2, 0) +
            '-' +
            String(d).padStart(2, 0) +
            '.html';
  }

  const links = [];
  const tempd = new Date(start);

  while (tempd <= end) {
    const url = getURL(tempd);
    console.log(`Fetching ${url}`);
    let dom;
    try {
      dom = await JSDOM.fromURL(url);

      const doc = dom.window.document;
      const items = doc.querySelectorAll('.nt');
      items.forEach((i) => {
        if (i.nextSibling.data
          && i.nextSibling.data.indexOf('#startmeeting') !== -1
        ) {
          const href = i.previousSibling.previousSibling.href;
          const title = tempd.toLocaleString('UTC', {month: 'long'})
                        + ' '
                        + tempd.getUTCDate();
          links.push(new Link(title, href));
        }
      });
    } catch (e) {
      console.log(e.message);
    }

    tempd.setUTCDate(tempd.getUTCDate() + 1);
  }

  return links;
}

async function getOptech(start) {
  const links = [];

  for (const url of ['https://bitcoinops.org/en/newsletters/',
                     'https://bitcoinops.org/en/podcast/']) {
    console.log(`Fetching ${url}`);

    const dom = await JSDOM.fromURL(url);
    const doc = dom.window.document;
    const items = doc.querySelectorAll('.post-link');

    items.forEach((i) => {
      const postDate = i.parentNode.previousSibling.previousSibling.innerHTML;
      if (new Date(postDate) >= start) {
        console.log(`pushing: ${i.innerHTML.trim()}`);
        const title = i.innerHTML.trim();
        const href = i.href.trim();
        links.push(new Link(title, href));
      }
    });
  }

  return links;
}

async function getPRs(org, repo, start, branch='master') {
  let out = [];
  for (let page = 1; page < 10; page++) {
    const url = `https://api.github.com/repos/${org}/${repo}/pulls?state=closed&base=${branch}&sort=updated&direction=desc&per_page=100&page=${page}`;

    console.log(`Fetching ${url}`);

    const links = [];
    let prs = JSON.parse(await fetchURL(url));

    if (prs.message === 'Moved Permanently') {
      console.log(`Redirected to: ${prs.url}`);
      prs = JSON.parse(await fetchURL(prs.url));
    }

    if (prs.length === 0) {
      console.log('  No more PRs');
      break;
    }
    for (const number in Object.keys(prs)) {
      const pr = prs[number];
      if (!pr) {
        // should not happen
        console.log(`  No PR found at index ${number}`);
        continue;
      }
      if (pr.merged_at == null) {
        console.log(`  PR #${pr.number} not merged`);
        continue;
      }
      if (pr.base.ref !== branch) {
        // should not happen
        console.log(`  PR #${pr.number} not merged into ${branch}`);
        continue;
      }

      const mergeDate = new Date(pr.merged_at);
      if (mergeDate < start) {
        console.log(`  PR #${pr.number} merged before start date`);
        continue;
      }

      console.log(`  Adding PR #${pr.number}, merged on ${pr.merged_at}`);
      links.push({merged: pr.merged_at, title: pr.title, href: pr.html_url});
    }

    if (links.length === 0) {
      console.log('  No links to add from this page, aborting');
      break;
    }

    links.sort((a, b) => {
      return (new Date(b.merged) - new Date(a.merged));
    });
    const filtered = links.map(l => new Link(l.title, l.href));
    out = out.concat(filtered);
  }
  return out;
}

async function getDelving(start) {
  const out = [];

outer:
  for (let page = 0; page < 9; page++) {
    const url = `https://delvingbitcoin.org/latest.json?page=${page}`;

    console.log(`Fetching ${url}`);

    const res = JSON.parse(await fetchURL(url));
    const topics = res['topic_list']['topics'];
    topics.sort((a, b) => b.id - a.id);

    for (const topic of topics) {
      const postDate = new Date(topic['created_at']);
      if (postDate < start) {
        console.log(`  Topic "${topic['title']}" posted before start date`);
        break outer;
      }

      out.push(new Link(topic.title, `https://delvingbitcoin.org/t/${topic.slug}`));
    }
  }

  return out;
}

function fillSection(section, indent, links) {
  let list = '';
  for (const link of links) {
    list += ' '.repeat(indent);
    list += link.toString();
  }
  template = template.replace(`{{${section}}}`, list);
}

class Link {
  constructor(title, href) {
    this.title = title;
    this.href = href;
  }

  toString() {
    return `- [${this.title.replace('[','(').replace(']',')')}](${this.href.replace('(','[').replace(')',']')})\n`;
  }
}
