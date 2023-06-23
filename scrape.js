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
start.setUTCHours(23);
start.setUTCMinutes(59);

let template = fs.readFileSync(path.join(__dirname, '_template.md'), 'utf-8');

(async () => {
  await tryCatch('bitcoin_dev',       0, getML, start, 'bitcoin-dev');
  await tryCatch('lightning_dev',     0, getML, start, 'lightning-dev');
  await tryCatch('dlc_dev',           0, getML, start, 'dlc-dev', 'https://mailmanlists.org/pipermail/dlc-dev/');
  await tryCatch('review_club',       4, getReviewClub, start);
  await tryCatch('irc_meetings',      4,  getCoreDevIRCMeeting, start);
  await tryCatch('optech',            0,  getOptech, start);
  await tryCatch('bitcoin_core_prs',  0,  getPRs, 'bitcoin', 'bitcoin', start);

  // Finalize
  console.log('Fetching Meetup information');
  const events = JSON.parse(await fetchURL('https://api.meetup.com/BitDevsNYC/events'));
  let event;
  for (event of events) {
    if (event.name.indexOf('Socratic Seminar') !== -1)
      break;
  }

  template = template.replace('{{event_title}}', event.name);
  template = template.replace('{{event_link}}', event.link);
  const eventDate = event.local_date;
  const eventTitle = event.name.toLowerCase().replaceAll(' ', '-');
  const filename = eventDate + '-' + eventTitle + '.md';
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

async function getML(start, name, _url) {
  const url = (_url ? _url : `https://lists.linuxfoundation.org/pipermail/${name}/`) +
              start.getUTCFullYear() +
              '-' +
              start.toLocaleString('UTC', {month: 'long'}) +
              '/thread.html';

  console.log(`Fetching ${url}`);

  const dom = await JSDOM.fromURL(url);
  const doc = dom.window.document;
  const items = doc.querySelectorAll('body > ul:nth-of-type(2) > li > a[href]');
  const links = [];
  items.forEach((i) => {
    let title = i.innerHTML;
    title = title.replace('\n', '');
    title = title.replace('\t', ' ');
    title = title.replace(/\[.*\] /g, '');
    const href = i.href;
    links.push(new Link(title, href));
  });
  return links;
}

async function getReviewClub(start) {
  const url = 'https://bitcoincore.reviews/meetings/';

  console.log(`Fetching ${url}`);

  const id = start.toLocaleString('UTC', {month: 'long'}).substr(0, 3) +
             start.getUTCFullYear();

  const dom = await JSDOM.fromURL(url);
  const doc = dom.window.document;
  const items = doc.querySelectorAll(`#${id} .Home-posts-post-title`);
  const links = [];
  items.forEach((i) => {
    const title = i.innerHTML;
    const href = i.href;
    links.push(new Link(title, href));
  });
  return links;
}

async function getCoreDevIRCMeeting(start) {
  const year = start.getUTCFullYear();
  const month = start.getUTCMonth() + 1;
  function getURL(y, m, d) {
    return 'https://www.erisian.com.au/bitcoin-core-dev/log-' +
            y +
            '-' +
            String(m).padStart(2, 0) +
            '-' +
            String(d).padStart(2, 0) +
            '.html';
  }

  const links = [];
  for (let date = 1; date <= 31; date++) {
    const url = getURL(year, month, date);
    console.log(`Fetching ${url}`);
    let dom;
    try {
      dom = await JSDOM.fromURL(url);
    } catch (e) {
      console.log(e.message);
      continue;
    }

    const doc = dom.window.document;
    const items = doc.querySelectorAll('.nt');
    items.forEach((i) => {
      if (i.nextSibling.data
        && i.nextSibling.data.indexOf('#startmeeting') !== -1
      ) {
        const lineno = i.previousSibling.previousSibling.innerHTML.trim();
        const title = start.toLocaleString('UTC', {month: 'long'})
                      + ' '
                      + date;
        const href = url + '#l-' + lineno;
        links.push(new Link(title, href));
      }
    });
  }
  return links;
}

async function getOptech(start) {
  const url = 'https://bitcoinops.org/en/newsletters/';

  console.log(`Fetching ${url}`);

  const dom = await JSDOM.fromURL(url);
  const doc = dom.window.document;
  const items = doc.querySelectorAll('.post-link');
  const links = [];
  items.forEach((i) => {
    const postDate = i.parentNode.previousSibling.previousSibling.innerHTML;
    if (new Date(postDate) >= start) {
      const title = i.innerHTML.trim();
      const href = i.href.trim();
      links.push(new Link(title, href));
    }
  });
  return links;
}

async function getPRs(org, repo, start) {
  let out = [];
  for (let page = 1; page < 100; page++) {
    const url = `https://api.github.com/repos/${org}/${repo}/pulls?state=closed&sort=closed&direction=desc&per_page=100&page=${page}`;

    console.log(`Fetching ${url}`);

    const links = [];
    const prs = JSON.parse(await fetchURL(url));
    if (prs.length === 0)
      break;
    for (const number in Object.keys(prs)) {
      const pr = prs[number];
      if (pr.merged_at == null || pr.base.ref !== 'master')
        continue;

      const mergeDate = new Date(pr.merged_at);
      if (mergeDate < start) {
        page = Infinity;
        break;
      }

      links.push({merged: pr.merged_at, title: pr.title, href: pr.html_url});
    }
    links.sort((a, b) => {
      return (new Date(b.merged) - new Date(a.merged));
    });
    const filtered = links.map(l => new Link(l.title, l.href));
    out = out.concat(filtered);
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
    return `- [${this.title}](${this.href})\n`;
  }
}
