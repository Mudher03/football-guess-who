// One-time script: fetch Wikipedia thumbnail URLs for every player
// Run with: node scripts/fetch-photos.js
// Output: server/data/player-photos.json

const https = require('https');
const fs    = require('fs');
const path  = require('path');

// Inline the player list so we don't need require('./server/players') quirks
const { ALL_PLAYERS: PLAYERS } = require('../server/players');

// Some players need a different Wikipedia article title
const OVERRIDES = {
  'Vinicius Jr':            'Vinícius_Júnior',
  'Rodrygo':                'Rodrygo_(footballer)',
  'Pedri':                  'Pedri',
  'Gavi':                   'Gavi_(footballer)',
  'Rodri':                  'Rodri_(footballer)',
  'Ederson':                'Ederson_(footballer,_born_1993)',
  'Casemiro':               'Casemiro',
  'Marquinhos':             'Marquinhos_(footballer)',
  'Vitinha':                'Vitinha_(footballer)',
  'Andre Silva':            'André_Silva_(Portuguese_footballer)',
  'Lois Openda':            'Lois_Openda',
  'Xavi Simons':            'Xavi_Simons',
  'Nicolo Barella':         'Nicolò_Barella',
  'Randal Kolo Muani':      'Randal_Kolo_Muani',
  'Ousmane Dembele':        'Ousmane_Dembélé',
  'Achraf Hakimi':          'Achraf_Hakimi',
  'Nuno Mendes':            'Nuno_Mendes_(footballer)',
  'Aurelien Tchouameni':    'Aurélien_Tchouaméni',
  'Eduardo Camavinga':      'Eduardo_Camavinga',
  'Jules Kounde':           'Jules_Koundé',
  'Eder Militao':           'Éder_Militão',
  'Vinicius Jr':            'Vinícius_Júnior',
  'Alejandro Balde':        'Alejandro_Baldé',
  'Nico Schlotterbeck':     'Nico_Schlotterbeck',
  'Kenan Yildiz':           'Kenan_Yıldız',
  'Hakan Calhanoglu':       'Hakan_Çalhanoğlu',
  'Khvicha Kvaratskhelia':  'Khvicha_Kvaratskhelia',
  'Riccardo Calafiori':     'Riccardo_Calafiori',
  'Thibaut Courtois':       'Thibaut_Courtois',
  'Florian Wirtz':          'Florian_Wirtz',
  'Albert Gudmundsson':     'Albert_Guðmundsson',
  'Ruslan Malinovskyi':     'Ruslan_Malinovsky',
  'Lamine Yamal':           'Lamine_Yamal',
  'Nico Williams':          'Nico_Williams',
  'Jan Oblak':              'Jan_Oblak',
  'Gregor Kobel':           'Gregor_Kobel',
  'Kim Min-jae':            'Kim_Min-jae',
  'Son Heung-min':          'Son_Heung-min',
  'Bradley Barcola':        'Bradley_Barcola',
  'Warren Zaire-Emery':     'Warren_Zaïre-Emery',
  'Mikel Oyarzabal':        'Mikel_Oyarzabal',
  'Aleksandr Golovin':      'Aleksandr_Golovin_(footballer)',
  'Dani Olmo':              'Dani_Olmo',
  'Fabian Ruiz':            'Fabián_Ruiz',
  'Pierre-Emerick Aubameyang': 'Pierre-Emerick_Aubameyang',
  'Gianluca Scamacca':      'Gianluca_Scamacca',
  'Arnaud Kalimuendo':      'Arnaud_Kalimuendo',
  'Niclas Fullkrug':        'Niclas_Füllkrug',
  'Ciro Immobile':          'Ciro_Immobile',
  'Memphis Depay':          'Memphis_Depay',
  'Frenkie de Jong':        'Frenkie_de_Jong',
  'Thomas Muller':          'Thomas_Müller',
  'Marc-Andre ter Stegen':  'Marc-André_ter_Stegen',
  'Alvaro Morata':          'Álvaro_Morata',
  'Leon Bailey':            'Leon_Bailey',
};

function fetchWikipedia(name) {
  const articleTitle = OVERRIDES[name] || name.replace(/ /g, '_');
  const urlPath = `/api/rest_v1/page/summary/${encodeURIComponent(articleTitle)}`;

  return new Promise((resolve) => {
    const options = {
      hostname: 'en.wikipedia.org',
      path: urlPath,
      method: 'GET',
      headers: {
        'User-Agent': 'FootballGuessWhoGame/1.0 (educational project)',
        'Accept': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const thumb = json.thumbnail?.source;
          if (thumb) {
            // Upscale: replace the pixel-width segment with 240px
            const bigger = thumb.replace(/\/\d+px-([^/]+)$/, '/240px-$1');
            resolve(bigger);
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.setTimeout(8000, () => { req.destroy(); resolve(null); });
    req.end();
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log(`Fetching photos for ${PLAYERS.length} players…\n`);
  const photos = {};
  let found = 0;

  for (const player of PLAYERS) {
    const photo = await fetchWikipedia(player.name);
    photos[player.id] = photo || null;
    const mark = photo ? '✓' : '✗';
    console.log(`  ${mark}  [${player.id}] ${player.name}`);
    if (photo) found++;
    await sleep(150); // be polite to Wikipedia
  }

  const outDir  = path.join(__dirname, '..', 'server', 'data');
  const outFile = path.join(outDir, 'player-photos.json');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(photos, null, 2));

  console.log(`\nDone! ${found}/${PLAYERS.length} photos found.`);
  console.log(`Saved → server/data/player-photos.json`);
}

main().catch(err => { console.error(err); process.exit(1); });
