// Fetch player photos from TheSportsDB (free, no key, sports-specific)
// Uses strThumb for the main photo (portrait/action shot)
const https   = require('https');
const fs      = require('fs');
const path    = require('path');
const { ALL_PLAYERS: PLAYERS } = require('../server/players');

// Some players need a different search name on TheSportsDB
const SEARCH_OVERRIDES = {
  'Vinicius Jr':            'Vinicius Junior',
  'Ederson':                'Ederson Moraes',
  'Casemiro':               'Carlos Casemiro',
  'Rodri':                  'Rodrigo Hernandez',
  'Aurelien Tchouameni':    'Aurelien Tchouameni',
  'Eduardo Camavinga':      'Eduardo Camavinga',
  'Eder Militao':           'Eder Militao',
  'Alejandro Balde':        'Alejandro Balde',
  'Jules Kounde':           'Jules Kounde',
  'Thomas Muller':          'Thomas Muller',
  'Marc-Andre ter Stegen':  'Marc ter Stegen',
  'Nicolo Barella':         'Nicolo Barella',
  'Hakan Calhanoglu':       'Hakan Calhanoglu',
  'Lautaro Martinez':       'Lautaro Martinez',
  'Dusan Vlahovic':         'Dusan Vlahovic',
  'Niclas Fullkrug':        'Niclas Fullkrug',
  'Gianluigi Donnarumma':   'Gianluigi Donnarumma',
  'Khvicha Kvaratskhelia':  'Khvicha Kvaratskhelia',
  'Warren Zaire-Emery':     'Warren Zaire Emery',
  'Pierre-Emerick Aubameyang': 'Pierre-Emerick Aubameyang',
  'Randal Kolo Muani':      'Randal Kolo Muani',
  'Albert Gudmundsson':     'Albert Gudmundsson',
  'Ruslan Malinovskyi':     'Ruslan Malinovskyi',
  'Ousmane Dembele':        'Ousmane Dembele',
  'Fabian Ruiz':            'Fabian Ruiz',
  'Julian Alvarez':         'Julian Alvarez',
  'Alvaro Morata':          'Alvaro Morata',
  'Rafael Leao':            'Rafael Leao',
  'Theo Hernandez':         'Theo Hernandez',
  'Leroy Sane':             'Leroy Sane',
  'Son Heung-min':          'Heungmin Son',
  'Kim Min-jae':            'Minjae Kim',
  'Andre Silva':            'Andre Silva',
  'Lois Openda':            'Lois Openda',
  'Ruben Dias':             'Ruben Dias',
  'Rodrygo':                'Rodrygo',
  'Mikel Oyarzabal':        'Mikel Oyarzabal',
  'Nico Williams':          'Nico Williams',
  'Luis Diaz':              'Luis Diaz',
};

function get(urlPath) {
  return new Promise((resolve) => {
    const opts = {
      hostname: 'www.thesportsdb.com',
      path: urlPath,
      method: 'GET',
      headers: { 'User-Agent': 'FootballGuessWhoGame/1.0' },
    };
    const req = https.request(opts, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve(null); } });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(8000, () => { req.destroy(); resolve(null); });
    req.end();
  });
}

async function fetchSportsDB(name) {
  const searchName = SEARCH_OVERRIDES[name] || name;
  const enc  = encodeURIComponent(searchName);
  const data = await get(`/api/v1/json/3/searchplayers.php?p=${enc}`);
  const players = data?.player;
  if (!players?.length) return null;

  // Pick best match: prefer exact name match, then first result
  const exact = players.find(p =>
    p.strPlayer?.toLowerCase() === searchName.toLowerCase()
  );
  const best = exact || players[0];
  const thumb = best?.strThumb;
  if (!thumb || thumb.includes('No_image') || thumb === '') return null;
  return thumb;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  // Load existing Wikipedia photos as a fallback base
  const photosFile = path.join(__dirname, '..', 'server', 'data', 'player-photos.json');
  const wikiPhotos = fs.existsSync(photosFile)
    ? JSON.parse(fs.readFileSync(photosFile, 'utf8'))
    : {};

  console.log(`Fetching TheSportsDB photos for ${PLAYERS.length} players…\n`);
  const result = {};
  let found = 0;

  for (const player of PLAYERS) {
    const photo = await fetchSportsDB(player.name);
    // Prefer TheSportsDB, fall back to Wikipedia
    result[player.id] = photo || wikiPhotos[player.id] || null;
    const src = photo ? 'SDB' : (wikiPhotos[player.id] ? 'WP' : '✗');
    const mark = result[player.id] ? `✓ [${src}]` : '✗';
    console.log(`  ${mark}  [${player.id}] ${player.name}`);
    if (result[player.id]) found++;
    await sleep(200);
  }

  fs.writeFileSync(photosFile, JSON.stringify(result, null, 2));
  console.log(`\nTotal: ${found}/${PLAYERS.length} photos`);
  console.log(`Saved → server/data/player-photos.json`);
}

main().catch(err => { console.error(err); process.exit(1); });
