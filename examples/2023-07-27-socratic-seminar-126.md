---
layout: post
type: socratic
title: "Socratic Seminar 126"
meetup: "https://www.meetup.com/bitdevsnyc/events/294791294/"
---

## Announcements
Please join us for our next Socratic Seminar. A special thank you to our sponsors [CardCoins](https://cardcoins.co), [Chaincode Labs](https://chaincode.com) and [Wolf NYC](https://wolfnyc.com) for food, refreshments and event space.

If you can't make it to the main event please join us at PUBKEY around 9:30PM. **Learn about this awesome new establishment [here](https://ny.eater.com/2022/12/13/23494423/pubkey-opening-manhattan-bitcoin-bar).**

## Presentation
-

## Mailing Lists, Meetings and Bitcoin Optech
### Mailing Lists
#### [bitcoin-dev](https://lists.linuxfoundation.org/pipermail/bitcoin-dev)
{{bitcoin_dev}}

#### [lightning-dev](https://lists.linuxfoundation.org/pipermail/lightning-dev)
{{lightning_dev}}

#### [dlc-dev](https://mailmanlists.org/pipermail/dlc-dev)
{{dlc_dev}}

### Meetings
- [Bitcoin PR Review Club](https://bitcoincore.reviews)
{{review_club}}
- Bitcoin Core general developer meetings
{{irc_meetings}}
- Lightning Specification meeting
    - <!--- TODO replace: [December 5th](https://github.com/lightning/bolts/issues/1046) --->
- Core Lightning Developer Call
    - <!--- TODO replace: [September 20th](https://diyhpl.us/wiki/transcripts/c-lightning/2021-09-20-developer-call/) --->
- dlc-specs meetings
    - <!--- TODO replace: [October 5th](https://github.com/discreetlogcontracts/dlcspecs/pull/175) --->
- Lightning specification meetings
    - <!--- TODO replace: [October 11th](https://github.com/lightningnetwork/lightning-rfc/issues/920) --->
- Bitcoin Contracting Primitives Working Group
	- <!--- TODO replace: [April 18th](https://github.com/ariard/bitcoin-contracting-primitives-wg/blob/main/meetings/meetings-18-04.md) --->

### Optech
{{optech}}

## Network Data
-

## CVEs and Research
### Research
-

### InfoSec
-

## Pull Requests and repo updates
### [Bitcoin Core](https://github.com/bitcoin/bitcoin)
- [test: remove unused code in `wallet_fundrawtransaction`](https://github.com/bitcoin/bitcoin/pull/28164)
- [ci: document that -Wreturn-type has been fixed upstream (mingw-w64)](https://github.com/bitcoin/bitcoin/pull/28092)
- [refactor: Remove C-style const-violating cast, Use reinterpret_cast](https://github.com/bitcoin/bitcoin/pull/28127)
- [test: create wallet specific for test_locked_wallet case](https://github.com/bitcoin/bitcoin/pull/28139)
- [test: Avoid intermittent issues due to async events in validationinterface_tests](https://github.com/bitcoin/bitcoin/pull/28150)
- [suppressions: note that `type:ClassName::MethodName` should be used](https://github.com/bitcoin/bitcoin/pull/28147)
- [test: fix `feature_addrman.py` on big-endian systems](https://github.com/bitcoin/bitcoin/pull/27529)
- [valgrind: add suppression for bug 472219](https://github.com/bitcoin/bitcoin/pull/28145)
- [test: Ignore UTF-8 errors in assert_debug_log](https://github.com/bitcoin/bitcoin/pull/28035)
- [util: Don't derive secure_allocator from std::allocator](https://github.com/bitcoin/bitcoin/pull/27930)
- [kernel: Remove UniValue from kernel library](https://github.com/bitcoin/bitcoin/pull/28113)
- [fuzz: Re-enable symbolize=1 in ASAN_OPTIONS](https://github.com/bitcoin/bitcoin/pull/28124)
- [net processing, refactor: Decouple PeerManager from gArgs](https://github.com/bitcoin/bitcoin/pull/27499)
- [test: Add missing `set -ex` to ci/lint/06_script.sh](https://github.com/bitcoin/bitcoin/pull/28103)
- [doc: correct Fedora systemtap dep](https://github.com/bitcoin/bitcoin/pull/28110)
- [test: fix intermittent failure in wallet_resendwallettransactions.py](https://github.com/bitcoin/bitcoin/pull/28108)
- [descriptors: do not return top-level only funcs as sub descriptors](https://github.com/bitcoin/bitcoin/pull/28067)
- [test: miner: add coverage for `-blockmintxfee` setting](https://github.com/bitcoin/bitcoin/pull/27620)
- [util: Show descriptive error messages when FileCommit fails](https://github.com/bitcoin/bitcoin/pull/26654)
- [contrib: move user32.dll from bitcoind.exe libs](https://github.com/bitcoin/bitcoin/pull/28099)
- [fuzz: Generate process_message targets individually](https://github.com/bitcoin/bitcoin/pull/28066)
- [bumpfee: Allow the user to choose which output is change](https://github.com/bitcoin/bitcoin/pull/26467)
- [test: Add more tests for the BIP21 implementation](https://github.com/bitcoin/bitcoin/pull/27928)
- [refactor: use Span for SipHash::Write](https://github.com/bitcoin/bitcoin/pull/28085)
- [depends: xcb-proto 1.15.2](https://github.com/bitcoin/bitcoin/pull/28097)
- [test: remove race in the user-agent reception check](https://github.com/bitcoin/bitcoin/pull/27986)
- [test: move remaining rand code from util/setup_common to util/random](https://github.com/bitcoin/bitcoin/pull/27425)
- [ci: Use DOCKER_BUILDKIT for lint image](https://github.com/bitcoin/bitcoin/pull/28083)
- [validation: use noexcept instead of deprecated throw()](https://github.com/bitcoin/bitcoin/pull/28090)
- [Descriptors: rule out unspendable miniscript descriptors](https://github.com/bitcoin/bitcoin/pull/27997)
- [test: indexes, fix on error infinite loop](https://github.com/bitcoin/bitcoin/pull/28044)
- [index: make startup more efficient](https://github.com/bitcoin/bitcoin/pull/27607)
- [test: make assumeUTXO test capture the expected fatal error](https://github.com/bitcoin/bitcoin/pull/28050)
- [wallet: address book migration bug fixes](https://github.com/bitcoin/bitcoin/pull/28038)
- [rpc: doc: Added `longpollid` and `data` params to `template_request`](https://github.com/bitcoin/bitcoin/pull/28056)
- [subtree: update libsecp256k1 to latest master](https://github.com/bitcoin/bitcoin/pull/28093)
- [Make poly1305 support incremental computation + modernize](https://github.com/bitcoin/bitcoin/pull/27993)
- [test: Disable known broken USDT test](https://github.com/bitcoin/bitcoin/pull/28088)
- [guix: Remove librt usage from release binaries](https://github.com/bitcoin/bitcoin/pull/28069)
- [fuzz: Flatten all FUZZ_TARGET macros into one](https://github.com/bitcoin/bitcoin/pull/28065)
- [doc: update windows `-fstack-clash-protection` doc](https://github.com/bitcoin/bitcoin/pull/28084)
- [fuzz: Bump FuzzedDataProvider.h](https://github.com/bitcoin/bitcoin/pull/28086)
- [kernel: Remove StartShutdown calls from validation code](https://github.com/bitcoin/bitcoin/pull/28048)
- [ci: Add missing -O2 to valgrind tasks](https://github.com/bitcoin/bitcoin/pull/28071)
- [fuzz: addrman, add coverage for `network` field in `Select()`, `Size()` and `GetAddr()`](https://github.com/bitcoin/bitcoin/pull/27549)
- [p2p: Restrict self-advertisements with privacy networks to avoid fingerprinting](https://github.com/bitcoin/bitcoin/pull/27411)
- [Add support for RFC8439 variant of ChaCha20](https://github.com/bitcoin/bitcoin/pull/27985)
- [test: refactor: deduplicate legacy ECDSA signing for tx inputs](https://github.com/bitcoin/bitcoin/pull/28025)
- [refactor: Move stopafterblockimport option out of blockstorage](https://github.com/bitcoin/bitcoin/pull/28053)
- [test: Check expected_stderr after stop](https://github.com/bitcoin/bitcoin/pull/28028)
- [wallet: don't include bdb files from our headers](https://github.com/bitcoin/bitcoin/pull/28039)
- [fuzz: Generate rpc fuzz targets individually](https://github.com/bitcoin/bitcoin/pull/28015)
- [util: Allow FastRandomContext::randbytes for std::byte, Allow std::byte serialization](https://github.com/bitcoin/bitcoin/pull/28012)
- [test: Restore unlimited timeout in IndexWaitSynced](https://github.com/bitcoin/bitcoin/pull/28036)
- [wallet: sqlite: don't include sqlite files from our headers](https://github.com/bitcoin/bitcoin/pull/28040)
- [kernel: Rm ShutdownRequested and AbortNode from validation code.](https://github.com/bitcoin/bitcoin/pull/27861)
- [ci: Print full lscpu output](https://github.com/bitcoin/bitcoin/pull/28034)
- [wallet: Give deprecation warning when loading a legacy wallet](https://github.com/bitcoin/bitcoin/pull/27869)
- [ci: Remove deprecated container.greedy](https://github.com/bitcoin/bitcoin/pull/28024)
- [wallet: bugfix, always use apostrophe for spkm descriptor ID](https://github.com/bitcoin/bitcoin/pull/27920)
- [docs: fixup honggfuzz fuzz patch](https://github.com/bitcoin/bitcoin/pull/28021)
- [test: add python implementation of Elligator swift](https://github.com/bitcoin/bitcoin/pull/24005)
- [addrman: select addresses by network follow-up](https://github.com/bitcoin/bitcoin/pull/27745)
- [contrib: add macOS test for fixup_chains usage](https://github.com/bitcoin/bitcoin/pull/27999)
- [script, test: python typing and linter updates](https://github.com/bitcoin/bitcoin/pull/28009)
- [ci: re-enable gui tests for s390x](https://github.com/bitcoin/bitcoin/pull/28014)
- [test: Rename EncodeDecimal to serialization_fallback](https://github.com/bitcoin/bitcoin/pull/28011)
- [doc: Fix verify-binaries link in contrib README](https://github.com/bitcoin/bitcoin/pull/28013)
- [doc: i2p documentation updates](https://github.com/bitcoin/bitcoin/pull/27937)
- [test: Use same timeout for all index sync](https://github.com/bitcoin/bitcoin/pull/27988)
- [refactor: remove in-code warning suppression](https://github.com/bitcoin/bitcoin/pull/28002)
- [net: do not `break` when `addr` is not from a distinct network group](https://github.com/bitcoin/bitcoin/pull/27863)
- [refactor: Drop unsafe AsBytePtr function](https://github.com/bitcoin/bitcoin/pull/27978)
- [ci: filter all subtrees from tidy output](https://github.com/bitcoin/bitcoin/pull/27996)
- [test: Fuzz on macOS](https://github.com/bitcoin/bitcoin/pull/27932)
- [guix: Clean up manifest](https://github.com/bitcoin/bitcoin/pull/27811)
- [Remove now-unnecessary poll, fcntl includes from net(base).cpp](https://github.com/bitcoin/bitcoin/pull/27530)
- [test: Use TestNode datadir_path or chain_path where possible](https://github.com/bitcoin/bitcoin/pull/27884)


### [BDK](https://github.com/bitcoindevkit/bdk)
{{bdk_prs}}

### [HWI](https://github.com/bitcoin-core/HWI)
{{hwi_prs}}

### [rust-bitcoin](https://github.com/rust-bitcoin/rust-bitcoin)
{{rust_prs}}

### [libsecp](https://github.com/bitcoin-core/secp256k1)
{{secp_prs}}

### [secp256k1-zkp](https://github.com/ElementsProject/secp256k1-zkp)
{{zkp_prs}}

### [dlcspecs](https://github.com/discreetlogcontracts/dlcspecs)
{{dlc_prs}}

### [Core Lightning](https://github.com/ElementsProject/lightning)
{{cln_prs}}

### [eclair](https://github.com/ACINQ/eclair/)
{{eclair_prs}}

### [LDK](https://github.com/lightningdevkit/rust-lightning)
{{ldk_prs}}

### [lnd](https://github.com/lightningnetwork/lnd)
{{lnd_prs}}

### [BIPs](https://github.com/bitcoin/bips)
{{bips_prs}}

### [BLIPs](https://github.com/lightning/blips)
{{blips_prs}}

### [BOLTs](https://github.com/lightningnetwork/lightning-rfc)
{{lnrfc_prs}}

## New Releases
-

## Events and Podcasts
-

## Mining
-

## Miscellaneous
-
