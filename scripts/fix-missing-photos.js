// Final pass: robust fetch using pageimages API
const https   = require('https');
const fs      = require('fs');
const path    = require('path');
const { ALL_PLAYERS: PLAYERS } = require('../server/players');

const photosFile = path.join(__dirname, '..', 'server', 'data', 'player-photos.json');
const existing   = JSON.parse(fs.readFileSync(photosFile, 'utf8'));

// Try these titles in order until we get a photo
const TITLE_ATTEMPTS = {
  'Luis Diaz':              ['Luis_Díaz_(Colombian_footballer)', 'Luis_Díaz'],
  'Bruno Fernandes':        ['Bruno_Fernandes_(midfielder)', 'Bruno_Fernandes_(Portuguese_footballer)'],
  'Reece James':            ['Reece_James_(footballer,_born_2000)', 'Reece_James'],
  'Alexander Isak':         ['Alexander_Isak'],
  'Rodrygo':                ['Rodrygo_Goes', 'Rodrygo'],
  'Ferran Torres':          ['Ferran_Torres_(footballer)', 'Ferran_Torres'],
  'Jan Oblak':              ['Jan_Oblak'],
  'Julian Alvarez':         ['Julián_Álvarez_(footballer)', 'Julián_Álvarez'],
  'Conor Gallagher':        ['Conor_Gallagher_(English_footballer)', 'Conor_Gallagher'],
  'Nico Williams':          ['Nico_Williams_(Spanish_footballer)', 'Nico_Williams'],
  'Dayot Upamecano':        ['Dayot_Upamecano'],
  'Leroy Sane':             ['Leroy_Sané'],
  'Kingsley Coman':         ['Kingsley_Coman'],
  'Kim Min-jae':            ['Kim_Min-jae', 'Kim_Min-jae_(South_Korean_footballer)'],
  'Julian Brandt':          ['Julian_Brandt'],
  'Karim Adeyemi':          ['Karim_Adeyemi'],
  'Niclas Fullkrug':        ['Niclas_Füllkrug'],
  'Granit Xhaka':           ['Granit_Xhaka'],
  'Victor Boniface':        ['Victor_Boniface_(footballer)', 'Victor_Boniface'],
  'Lois Openda':            ['Loïs_Openda'],
  'Andre Silva':            ['André_Silva_(Portuguese_footballer,_born_1995)', 'André_Silva_(Portuguese_footballer)'],
  'Nicolo Barella':         ['Nicolò_Barella'],
  'Lautaro Martinez':       ['Lautaro_Martínez'],
  'Dusan Vlahovic':         ['Dušan_Vlahović'],
  'Mike Maignan':           ['Mike_Maignan'],
  'Theo Hernandez':         ['Theo_Hernández'],
  'Rafael Leao':            ['Rafael_Leão'],
  'Romelu Lukaku':          ['Romelu_Lukaku'],
  'Gianluigi Donnarumma':   ['Gianluigi_Donnarumma'],
  'Marquinhos':             ['Marquinhos_(Brazilian_footballer)', 'Marquinhos_(footballer)'],
  'Fabian Ruiz':            ['Fabián_Ruiz'],
  'Vitinha':                ['Vitor_Ferreira_(footballer)', 'Vitinha_(Portuguese_footballer)'],
  'Bradley Barcola':        ['Bradley_Barcola'],
  'Warren Zaire-Emery':     ['Warren_Zaïre-Emery'],
  'Nuno Mendes':            ['Nuno_Mendes_(Portuguese_footballer)', 'Nuno_Mendes_(footballer,_born_2002)'],
  'Aleksandr Golovin':      ['Aleksandr_Golovin_(Russian_footballer)', 'Aleksandr_Golovin'],
  'Pierre-Emerick Aubameyang': ['Pierre-Emerick_Aubameyang'],
  'Alexandre Lacazette':    ['Alexandre_Lacazette'],
  'Rayan Cherki':           ['Rayan_Cherki'],
  'Neymar':                 ['Neymar'],
  'Marco Verratti':         ['Marco_Verratti'],
  'Giorgio Chiellini':      ['Giorgio_Chiellini'],
  'Cody Gakpo':             ['Cody_Gakpo'],
  'Thomas Partey':          ['Thomas_Partey'],
  'Wout Faes':              ['Wout_Faes'],
  'Kevin Trapp':            ['Kevin_Trapp'],
  'Albert Gudmundsson':     ['Albert_Guðmundsson', 'Albert_Guðmundsson_(Icelandic_footballer)'],
  'Ruslan Malinovskyi':     ['Ruslan_Malinovskyi', 'Ruslan_Malinowskyj'],
  'Wahbi Khazri':           ['Wahbi_Khazri'],
};

function get(urlPath) {
  return new Promise((resolve) => {
    const opts = {
      hostname: 'en.wikipedia.org',
      path: urlPath,
      method: 'GET',
      headers: { 'User-Agent': 'FootballGuessWhoGame/1.0', Accept: 'application/json' },
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

async function fetchPhoto(title) {
  const enc  = encodeURIComponent(title);
  const data = await get(`/w/api.php?action=query&titles=${enc}&prop=pageimages&format=json&pithumbsize=320&redirects=1`);
  if (!data) return null;
  const page = Object.values(data?.query?.pages || {})[0];
  const src  = page?.thumbnail?.source;
  // Filter out "No image" placeholders
  if (!src || src.includes('No-Free') || src.includes('No_image') || src.includes('Question_mark')) return null;
  // Upscale to 240px
  return src.replace(/\/\d+px-([^/]+)$/, '/240px-$1');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const missing = PLAYERS.filter(p => !existing[p.id]);
  console.log(`Fixing ${missing.length} missing players…\n`);
  let fixed = 0;

  for (const player of missing) {
    const attempts = TITLE_ATTEMPTS[player.name] || [player.name.replace(/ /g, '_')];
    let photo = null;
    for (const title of attempts) {
      photo = await fetchPhoto(title);
      if (photo) break;
      await sleep(100);
    }
    existing[player.id] = photo || null;
    console.log(`  ${photo ? '✓' : '✗'}  [${player.id}] ${player.name}`);
    if (photo) fixed++;
    await sleep(150);
  }

  fs.writeFileSync(photosFile, JSON.stringify(existing, null, 2));
  const total = Object.values(existing).filter(Boolean).length;
  console.log(`\nFixed ${fixed}/${missing.length}. Total: ${total}/${PLAYERS.length}`);
}

main().catch(err => { console.error(err); process.exit(1); });
