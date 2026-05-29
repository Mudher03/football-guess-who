/**
 * Multi-source photo fetcher for remaining 43 players.
 * Sources tried in order for each player:
 *   1. Wikidata SPARQL  → direct Wikimedia Commons image
 *   2. TheSportsDB      → strThumb (with varied name forms)
 *   3. Wikipedia REST   → thumbnail.source
 *   4. Wikipedia pageimages action API
 */
const https  = require('https');
const http   = require('http');
const fs     = require('fs');
const path   = require('path');
const { ALL_PLAYERS: PLAYERS } = require('../server/players');

const photosFile = path.join(__dirname, '..', 'server', 'data', 'player-photos.json');
const existing   = JSON.parse(fs.readFileSync(photosFile, 'utf8'));
const missing    = PLAYERS.filter(p => !existing[p.id]);

// ── helpers ──────────────────────────────────────────────────────────────────
function get(hostname, urlPath, followRedirects = 0) {
  return new Promise((resolve) => {
    const mod = hostname.startsWith('http://') ? http : https;
    const actualHostname = hostname.replace(/^https?:\/\//, '');
    const opts = {
      hostname: actualHostname,
      path: urlPath,
      method: 'GET',
      headers: { 'User-Agent': 'FootballGuessWho/1.0 (open-source game)', Accept: 'application/json' },
    };
    const req = (hostname.startsWith('http://') ? http : https).request(opts, (res) => {
      if (followRedirects > 0 && (res.statusCode === 301 || res.statusCode === 302)) {
        const loc = res.headers.location;
        if (loc) {
          const u = new URL(loc, `https://${actualHostname}`);
          return resolve(get(u.origin, u.pathname + u.search, followRedirects - 1));
        }
      }
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve(null); } });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(10000, () => { req.destroy(); resolve(null); });
    req.end();
  });
}

function upscale(url, px = 240) {
  if (!url) return null;
  return url.replace(/\/\d+px-([^/]+)$/, `/${px}px-$1`);
}

function isPlaceholder(url) {
  if (!url) return true;
  const bad = ['No-Free', 'No_image', 'Question_mark', 'Replace_this', 'Silhouette', 'Blank', 'Default'];
  return bad.some(b => url.includes(b));
}

// ── Source 1: Wikidata SPARQL ─────────────────────────────────────────────────
// Returns Wikimedia Commons File: name, then builds a usable URL via Special:FilePath
async function wikidataSPARQL(playerName) {
  const sparql = `
SELECT ?image WHERE {
  ?athlete wdt:P31 wd:Q5 .
  ?athlete wdt:P106 ?occ .
  VALUES ?occ { wd:Q937857 wd:Q11303721 wd:Q18536342 }
  ?athlete rdfs:label "${playerName}"@en .
  ?athlete wdt:P18 ?image .
}
LIMIT 1`.trim();

  const enc  = encodeURIComponent(sparql);
  const data = await get('https://query.wikidata.org', `/sparql?query=${enc}&format=json`);
  const bindings = data?.results?.bindings;
  if (!bindings?.length) return null;
  const imageUri = bindings[0]?.image?.value; // e.g. http://commons.wikimedia.org/wiki/Special:FilePath/Romelu_Lukaku_2021.jpg
  if (!imageUri || isPlaceholder(imageUri)) return null;

  // Convert to a direct thumbnail URL via Wikimedia Commons API
  const filename = decodeURIComponent(imageUri.split('/').pop()).replace(/ /g, '_');
  const apiData = await get('https://commons.wikimedia.org',
    `/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&iiurlwidth=240&format=json`);
  const pages = apiData?.query?.pages || {};
  const page  = Object.values(pages)[0];
  const thumb = page?.imageinfo?.[0]?.thumburl;
  if (thumb && !isPlaceholder(thumb)) return thumb;

  // Fallback: construct URL directly from Wikimedia CDN
  const md5  = require('crypto').createHash('md5').update(filename).digest('hex');
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${md5[0]}/${md5[0]}${md5[1]}/${encodeURIComponent(filename)}/240px-${encodeURIComponent(filename)}`;
}

// ── Source 2: TheSportsDB ─────────────────────────────────────────────────────
async function theSportsDB(playerName) {
  // Try several name variants
  const variants = [
    playerName,
    playerName.normalize('NFD').replace(/[̀-ͯ]/g, ''), // strip accents
    playerName.split(' ').reverse().join(' '),                    // reverse order
  ];
  for (const v of variants) {
    const enc  = encodeURIComponent(v);
    const data = await get('https://www.thesportsdb.com', `/api/v1/json/3/searchplayers.php?p=${enc}`);
    const players = data?.player;
    if (!players?.length) continue;
    const exact = players.find(p => p.strPlayer?.toLowerCase() === v.toLowerCase());
    const best  = exact || players[0];
    const thumb = best?.strThumb;
    if (thumb && !isPlaceholder(thumb)) return thumb;
  }
  return null;
}

// ── Source 3: Wikipedia REST summary ─────────────────────────────────────────
const WP_OVERRIDES = {
  'Jan Oblak':             'Jan_Oblak',
  'Julian Alvarez':        'Julián_Álvarez',
  'Conor Gallagher':       'Conor_Gallagher_(footballer)',
  'Nico Williams':         'Nico_Williams_(Spanish_footballer)',
  'Dayot Upamecano':       'Dayot_Upamecano',
  'Leroy Sane':            'Leroy_Sané',
  'Kingsley Coman':        'Kingsley_Coman',
  'Kim Min-jae':           'Kim_Min-jae',
  'Julian Brandt':         'Julian_Brandt',
  'Karim Adeyemi':         'Karim_Adeyemi',
  'Niclas Fullkrug':       'Niclas_Füllkrug',
  'Granit Xhaka':          'Granit_Xhaka',
  'Victor Boniface':       'Victor_Boniface',
  'Lois Openda':           'Loïs_Openda',
  'Andre Silva':           'André_Silva_(footballer,_born_1995)',
  'Nicolo Barella':        'Nicolò_Barella',
  'Lautaro Martinez':      'Lautaro_Martínez',
  'Dusan Vlahovic':        'Dušan_Vlahović',
  'Mike Maignan':          'Mike_Maignan',
  'Theo Hernandez':        'Theo_Hernández',
  'Rafael Leao':           'Rafael_Leão',
  'Romelu Lukaku':         'Romelu_Lukaku',
  'Gianluigi Donnarumma':  'Gianluigi_Donnarumma',
  'Marquinhos':            'Marquinhos_(footballer,_born_1994)',
  'Fabian Ruiz':           'Fabián_Ruiz',
  'Vitinha':               'Vitor_Ferreira_(footballer)',
  'Bradley Barcola':       'Bradley_Barcola',
  'Warren Zaire-Emery':    'Warren_Zaïre-Emery',
  'Nuno Mendes':           'Nuno_Mendes_(Portuguese_footballer)',
  'Aleksandr Golovin':     'Aleksandr_Golovin_(footballer)',
  'Pierre-Emerick Aubameyang': 'Pierre-Emerick_Aubameyang',
  'Alexandre Lacazette':   'Alexandre_Lacazette',
  'Rayan Cherki':          'Rayan_Cherki',
  'Neymar':                'Neymar',
  'Marco Verratti':        'Marco_Verratti',
  'Giorgio Chiellini':     'Giorgio_Chiellini',
  'Cody Gakpo':            'Cody_Gakpo',
  'Thomas Partey':         'Thomas_Partey',
  'Wout Faes':             'Wout_Faes',
  'Kevin Trapp':           'Kevin_Trapp',
  'Albert Gudmundsson':    'Albert_Guðmundsson',
  'Ruslan Malinovskyi':    'Ruslan_Malinovskyi',
  'Wahbi Khazri':          'Wahbi_Khazri',
};

async function wikipediaREST(playerName) {
  const title = WP_OVERRIDES[playerName] || playerName.replace(/ /g, '_');
  const data  = await get('https://en.wikipedia.org', `/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
  const src   = data?.thumbnail?.source;
  if (!src || isPlaceholder(src)) return null;
  return upscale(src, 240);
}

// ── Source 4: Wikipedia pageimages action API ─────────────────────────────────
async function wikipediaPageImages(playerName) {
  const title = WP_OVERRIDES[playerName] || playerName.replace(/ /g, '_');
  const data  = await get('https://en.wikipedia.org',
    `/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=400&redirects=1`);
  const page  = Object.values(data?.query?.pages || {})[0];
  const src   = page?.thumbnail?.source;
  if (!src || isPlaceholder(src)) return null;
  return upscale(src, 240);
}

// ── Main ──────────────────────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchPlayer(player) {
  const name = player.name;

  // Try all 4 sources in parallel, take first success
  const [wd, sdb, wpRest, wpPi] = await Promise.all([
    wikidataSPARQL(name).catch(() => null),
    theSportsDB(name).catch(() => null),
    wikipediaREST(name).catch(() => null),
    wikipediaPageImages(name).catch(() => null),
  ]);

  const result = wd || sdb || wpRest || wpPi || null;
  const src = wd ? 'Wikidata' : sdb ? 'SportsDB' : wpRest ? 'WP-REST' : wpPi ? 'WP-API' : '✗';
  return { photo: result, src };
}

async function main() {
  console.log(`Fetching photos for ${missing.length} missing players (4 sources in parallel)…\n`);
  let fixed = 0;

  // Process in batches of 5 to avoid overwhelming APIs
  const BATCH = 5;
  for (let i = 0; i < missing.length; i += BATCH) {
    const batch = missing.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(p => fetchPlayer(p)));

    for (let j = 0; j < batch.length; j++) {
      const player = batch[j];
      const { photo, src } = results[j];
      existing[player.id] = photo || null;
      const mark = photo ? `✓ [${src}]` : '✗';
      console.log(`  ${mark.padEnd(16)} [${player.id}] ${player.name}`);
      if (photo) fixed++;
    }

    if (i + BATCH < missing.length) await sleep(400); // brief pause between batches
  }

  fs.writeFileSync(photosFile, JSON.stringify(existing, null, 2));
  const total = Object.values(existing).filter(Boolean).length;
  console.log(`\nFixed ${fixed}/${missing.length} previously missing`);
  console.log(`Total coverage: ${total}/${PLAYERS.length} (${Math.round(total/PLAYERS.length*100)}%)`);
}

main().catch(err => { console.error(err); process.exit(1); });
