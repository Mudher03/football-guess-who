// ── Comprehensive football player pool (~155 players) ───────────────────────
// position: Forward | Midfielder | Defender | Goalkeeper
// ageRange: 'under25' | '25to30' | 'over30'  (relative to 2025-26)
// foot: 'left' | 'right'
// isCaptain: national team captain
// hasTrophies: { ucl: bool, worldCup: bool }

const ALL_PLAYERS = [
  // ── PREMIER LEAGUE ─────────────────────────────────────────────────────────
  // Liverpool
  { id: 1,  name: 'Alisson Becker',         nationality: 'Brazil',       league: 'Premier League', club: 'Liverpool',         position: 'Goalkeeper', ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 2,  name: 'Virgil van Dijk',         nationality: 'Netherlands',  league: 'Premier League', club: 'Liverpool',         position: 'Defender',   ageRange: 'over30',  foot: 'right', isCaptain: true,  hasTrophies: { ucl: true,  worldCup: false } },
  { id: 3,  name: 'Trent Alexander-Arnold', nationality: 'England',      league: 'Premier League', club: 'Liverpool',         position: 'Defender',   ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 4,  name: 'Mohamed Salah',           nationality: 'Egypt',        league: 'Premier League', club: 'Liverpool',         position: 'Forward',    ageRange: 'over30',  foot: 'left',  isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 5,  name: 'Darwin Nunez',            nationality: 'Uruguay',      league: 'Premier League', club: 'Liverpool',         position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 6,  name: 'Luis Diaz',               nationality: 'Colombia',     league: 'Premier League', club: 'Liverpool',         position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 7,  name: 'Dominik Szoboszlai',      nationality: 'Hungary',      league: 'Premier League', club: 'Liverpool',         position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: true,  hasTrophies: { ucl: false, worldCup: false } },
  { id: 8,  name: 'Alexis Mac Allister',     nationality: 'Argentina',    league: 'Premier League', club: 'Liverpool',         position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: true  } },
  // Arsenal
  { id: 9,  name: 'David Raya',              nationality: 'Spain',        league: 'Premier League', club: 'Arsenal',           position: 'Goalkeeper', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 10, name: 'William Saliba',          nationality: 'France',       league: 'Premier League', club: 'Arsenal',           position: 'Defender',   ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 11, name: 'Martin Odegaard',         nationality: 'Norway',       league: 'Premier League', club: 'Arsenal',           position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: true,  hasTrophies: { ucl: false, worldCup: false } },
  { id: 12, name: 'Declan Rice',             nationality: 'England',      league: 'Premier League', club: 'Arsenal',           position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 13, name: 'Bukayo Saka',             nationality: 'England',      league: 'Premier League', club: 'Arsenal',           position: 'Forward',    ageRange: '25to30',  foot: 'left',  isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 14, name: 'Gabriel Martinelli',      nationality: 'Brazil',       league: 'Premier League', club: 'Arsenal',           position: 'Forward',    ageRange: '25to30',  foot: 'left',  isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 15, name: 'Kai Havertz',             nationality: 'Germany',      league: 'Premier League', club: 'Arsenal',           position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 16, name: 'Leandro Trossard',        nationality: 'Belgium',      league: 'Premier League', club: 'Arsenal',           position: 'Forward',    ageRange: 'over30',  foot: 'left',  isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  // Manchester City
  { id: 17, name: 'Ederson',                 nationality: 'Brazil',       league: 'Premier League', club: 'Manchester City',   position: 'Goalkeeper', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 18, name: 'Ruben Dias',              nationality: 'Portugal',     league: 'Premier League', club: 'Manchester City',   position: 'Defender',   ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 19, name: 'Kevin De Bruyne',         nationality: 'Belgium',      league: 'Premier League', club: 'Manchester City',   position: 'Midfielder', ageRange: 'over30',  foot: 'right', isCaptain: true,  hasTrophies: { ucl: true,  worldCup: false } },
  { id: 20, name: 'Erling Haaland',          nationality: 'Norway',       league: 'Premier League', club: 'Manchester City',   position: 'Forward',    ageRange: '25to30',  foot: 'left',  isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 21, name: 'Phil Foden',              nationality: 'England',      league: 'Premier League', club: 'Manchester City',   position: 'Midfielder', ageRange: '25to30',  foot: 'left',  isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 22, name: 'Bernardo Silva',          nationality: 'Portugal',     league: 'Premier League', club: 'Manchester City',   position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 23, name: 'Rodri',                   nationality: 'Spain',        league: 'Premier League', club: 'Manchester City',   position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  // Manchester United
  { id: 24, name: 'Andre Onana',             nationality: 'Cameroon',     league: 'Premier League', club: 'Manchester United', position: 'Goalkeeper', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 25, name: 'Bruno Fernandes',         nationality: 'Portugal',     league: 'Premier League', club: 'Manchester United', position: 'Midfielder', ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 26, name: 'Casemiro',                nationality: 'Brazil',       league: 'Premier League', club: 'Manchester United', position: 'Midfielder', ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 27, name: 'Marcus Rashford',         nationality: 'England',      league: 'Premier League', club: 'Manchester United', position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  // Chelsea
  { id: 28, name: 'Reece James',             nationality: 'England',      league: 'Premier League', club: 'Chelsea',           position: 'Defender',   ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 29, name: 'Cole Palmer',             nationality: 'England',      league: 'Premier League', club: 'Chelsea',           position: 'Midfielder', ageRange: 'under25', foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 30, name: 'Enzo Fernandez',          nationality: 'Argentina',    league: 'Premier League', club: 'Chelsea',           position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: true  } },
  { id: 31, name: 'Nicolas Jackson',         nationality: 'Senegal',      league: 'Premier League', club: 'Chelsea',           position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  // Tottenham
  { id: 32, name: 'Son Heung-min',           nationality: 'South Korea',  league: 'Premier League', club: 'Tottenham',         position: 'Forward',    ageRange: 'over30',  foot: 'left',  isCaptain: true,  hasTrophies: { ucl: false, worldCup: false } },
  { id: 33, name: 'James Maddison',          nationality: 'England',      league: 'Premier League', club: 'Tottenham',         position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 34, name: 'Richarlison',             nationality: 'Brazil',       league: 'Premier League', club: 'Tottenham',         position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  // Newcastle
  { id: 35, name: 'Alexander Isak',          nationality: 'Sweden',       league: 'Premier League', club: 'Newcastle United',  position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 36, name: 'Bruno Guimaraes',         nationality: 'Brazil',       league: 'Premier League', club: 'Newcastle United',  position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 37, name: 'Kieran Trippier',         nationality: 'England',      league: 'Premier League', club: 'Newcastle United',  position: 'Defender',   ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  // Aston Villa
  { id: 38, name: 'Emiliano Martinez',       nationality: 'Argentina',    league: 'Premier League', club: 'Aston Villa',       position: 'Goalkeeper', ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: true  } },
  { id: 39, name: 'Ollie Watkins',           nationality: 'England',      league: 'Premier League', club: 'Aston Villa',       position: 'Forward',    ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 40, name: 'Leon Bailey',             nationality: 'Jamaica',      league: 'Premier League', club: 'Aston Villa',       position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },

  // ── LA LIGA ────────────────────────────────────────────────────────────────
  // Real Madrid
  { id: 41, name: 'Thibaut Courtois',        nationality: 'Belgium',      league: 'La Liga',        club: 'Real Madrid',       position: 'Goalkeeper', ageRange: 'over30',  foot: 'left',  isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 42, name: 'Dani Carvajal',           nationality: 'Spain',        league: 'La Liga',        club: 'Real Madrid',       position: 'Defender',   ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 43, name: 'Eder Militao',            nationality: 'Brazil',       league: 'La Liga',        club: 'Real Madrid',       position: 'Defender',   ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 44, name: 'Antonio Rudiger',         nationality: 'Germany',      league: 'La Liga',        club: 'Real Madrid',       position: 'Defender',   ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 45, name: 'Federico Valverde',       nationality: 'Uruguay',      league: 'La Liga',        club: 'Real Madrid',       position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 46, name: 'Jude Bellingham',         nationality: 'England',      league: 'La Liga',        club: 'Real Madrid',       position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 47, name: 'Luka Modric',             nationality: 'Croatia',      league: 'La Liga',        club: 'Real Madrid',       position: 'Midfielder', ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 48, name: 'Toni Kroos',              nationality: 'Germany',      league: 'La Liga',        club: 'Real Madrid',       position: 'Midfielder', ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: true  } },
  { id: 49, name: 'Vinicius Jr',             nationality: 'Brazil',       league: 'La Liga',        club: 'Real Madrid',       position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 50, name: 'Rodrygo',                 nationality: 'Brazil',       league: 'La Liga',        club: 'Real Madrid',       position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 51, name: 'Kylian Mbappe',           nationality: 'France',       league: 'La Liga',        club: 'Real Madrid',       position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: true,  hasTrophies: { ucl: true,  worldCup: true  } },
  { id: 52, name: 'Eduardo Camavinga',       nationality: 'France',       league: 'La Liga',        club: 'Real Madrid',       position: 'Midfielder', ageRange: 'under25', foot: 'left',  isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 53, name: 'Aurelien Tchouameni',     nationality: 'France',       league: 'La Liga',        club: 'Real Madrid',       position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  // Barcelona
  { id: 54, name: 'Marc-Andre ter Stegen',   nationality: 'Germany',      league: 'La Liga',        club: 'Barcelona',         position: 'Goalkeeper', ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 55, name: 'Alejandro Balde',         nationality: 'Spain',        league: 'La Liga',        club: 'Barcelona',         position: 'Defender',   ageRange: 'under25', foot: 'left',  isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 56, name: 'Jules Kounde',            nationality: 'France',       league: 'La Liga',        club: 'Barcelona',         position: 'Defender',   ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 57, name: 'Pedri',                   nationality: 'Spain',        league: 'La Liga',        club: 'Barcelona',         position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 58, name: 'Gavi',                    nationality: 'Spain',        league: 'La Liga',        club: 'Barcelona',         position: 'Midfielder', ageRange: 'under25', foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 59, name: 'Lamine Yamal',            nationality: 'Spain',        league: 'La Liga',        club: 'Barcelona',         position: 'Forward',    ageRange: 'under25', foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 60, name: 'Raphinha',                nationality: 'Brazil',       league: 'La Liga',        club: 'Barcelona',         position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 61, name: 'Robert Lewandowski',      nationality: 'Poland',       league: 'La Liga',        club: 'Barcelona',         position: 'Forward',    ageRange: 'over30',  foot: 'right', isCaptain: true,  hasTrophies: { ucl: false, worldCup: false } },
  { id: 62, name: 'Ferran Torres',           nationality: 'Spain',        league: 'La Liga',        club: 'Barcelona',         position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 63, name: 'Dani Olmo',               nationality: 'Spain',        league: 'La Liga',        club: 'Barcelona',         position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  // Atletico Madrid
  { id: 64, name: 'Jan Oblak',               nationality: 'Slovenia',     league: 'La Liga',        club: 'Atletico Madrid',   position: 'Goalkeeper', ageRange: 'over30',  foot: 'right', isCaptain: true,  hasTrophies: { ucl: false, worldCup: false } },
  { id: 65, name: 'Antoine Griezmann',       nationality: 'France',       league: 'La Liga',        club: 'Atletico Madrid',   position: 'Forward',    ageRange: 'over30',  foot: 'left',  isCaptain: false, hasTrophies: { ucl: false, worldCup: true  } },
  { id: 66, name: 'Julian Alvarez',          nationality: 'Argentina',    league: 'La Liga',        club: 'Atletico Madrid',   position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: true  } },
  { id: 67, name: 'Rodrigo De Paul',         nationality: 'Argentina',    league: 'La Liga',        club: 'Atletico Madrid',   position: 'Midfielder', ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: true  } },
  { id: 68, name: 'Conor Gallagher',         nationality: 'England',      league: 'La Liga',        club: 'Atletico Madrid',   position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  // Other La Liga
  { id: 69, name: 'Mikel Oyarzabal',         nationality: 'Spain',        league: 'La Liga',        club: 'Real Sociedad',     position: 'Forward',    ageRange: '25to30',  foot: 'left',  isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 70, name: 'Nico Williams',           nationality: 'Spain',        league: 'La Liga',        club: 'Athletic Club',     position: 'Forward',    ageRange: 'under25', foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 71, name: 'Alvaro Morata',           nationality: 'Spain',        league: 'La Liga',        club: 'Atletico Madrid',   position: 'Forward',    ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },

  // ── BUNDESLIGA ─────────────────────────────────────────────────────────────
  // Bayern Munich
  { id: 72, name: 'Manuel Neuer',            nationality: 'Germany',      league: 'Bundesliga',     club: 'Bayern Munich',     position: 'Goalkeeper', ageRange: 'over30',  foot: 'right', isCaptain: true,  hasTrophies: { ucl: true,  worldCup: true  } },
  { id: 73, name: 'Alphonso Davies',         nationality: 'Canada',       league: 'Bundesliga',     club: 'Bayern Munich',     position: 'Defender',   ageRange: '25to30',  foot: 'left',  isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 74, name: 'Dayot Upamecano',         nationality: 'France',       league: 'Bundesliga',     club: 'Bayern Munich',     position: 'Defender',   ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 75, name: 'Joshua Kimmich',          nationality: 'Germany',      league: 'Bundesliga',     club: 'Bayern Munich',     position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 76, name: 'Jamal Musiala',           nationality: 'Germany',      league: 'Bundesliga',     club: 'Bayern Munich',     position: 'Midfielder', ageRange: 'under25', foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 77, name: 'Leroy Sane',              nationality: 'Germany',      league: 'Bundesliga',     club: 'Bayern Munich',     position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 78, name: 'Harry Kane',              nationality: 'England',      league: 'Bundesliga',     club: 'Bayern Munich',     position: 'Forward',    ageRange: 'over30',  foot: 'right', isCaptain: true,  hasTrophies: { ucl: false, worldCup: false } },
  { id: 79, name: 'Thomas Muller',           nationality: 'Germany',      league: 'Bundesliga',     club: 'Bayern Munich',     position: 'Forward',    ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: true  } },
  { id: 80, name: 'Kingsley Coman',          nationality: 'France',       league: 'Bundesliga',     club: 'Bayern Munich',     position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: true  } },
  { id: 81, name: 'Kim Min-jae',             nationality: 'South Korea',  league: 'Bundesliga',     club: 'Bayern Munich',     position: 'Defender',   ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  // Borussia Dortmund
  { id: 82, name: 'Gregor Kobel',            nationality: 'Switzerland',  league: 'Bundesliga',     club: 'Dortmund',          position: 'Goalkeeper', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 83, name: 'Nico Schlotterbeck',      nationality: 'Germany',      league: 'Bundesliga',     club: 'Dortmund',          position: 'Defender',   ageRange: '25to30',  foot: 'left',  isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 84, name: 'Julian Brandt',           nationality: 'Germany',      league: 'Bundesliga',     club: 'Dortmund',          position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 85, name: 'Karim Adeyemi',           nationality: 'Germany',      league: 'Bundesliga',     club: 'Dortmund',          position: 'Forward',    ageRange: 'under25', foot: 'left',  isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 86, name: 'Niclas Fullkrug',         nationality: 'Germany',      league: 'Bundesliga',     club: 'Dortmund',          position: 'Forward',    ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  // Bayer Leverkusen
  { id: 87, name: 'Granit Xhaka',            nationality: 'Switzerland',  league: 'Bundesliga',     club: 'Bayer Leverkusen',  position: 'Midfielder', ageRange: 'over30',  foot: 'left',  isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 88, name: 'Florian Wirtz',           nationality: 'Germany',      league: 'Bundesliga',     club: 'Bayer Leverkusen',  position: 'Midfielder', ageRange: 'under25', foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 89, name: 'Victor Boniface',         nationality: 'Nigeria',      league: 'Bundesliga',     club: 'Bayer Leverkusen',  position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 90, name: 'Jonathan Tah',            nationality: 'Germany',      league: 'Bundesliga',     club: 'Bayer Leverkusen',  position: 'Defender',   ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  // RB Leipzig
  { id: 91, name: 'Xavi Simons',             nationality: 'Netherlands',  league: 'Bundesliga',     club: 'RB Leipzig',        position: 'Midfielder', ageRange: 'under25', foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 92, name: 'Lois Openda',             nationality: 'Belgium',      league: 'Bundesliga',     club: 'RB Leipzig',        position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 93, name: 'Andre Silva',             nationality: 'Portugal',     league: 'Bundesliga',     club: 'RB Leipzig',        position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },

  // ── SERIE A ────────────────────────────────────────────────────────────────
  // Inter Milan
  { id: 94, name: 'Yann Sommer',             nationality: 'Switzerland',  league: 'Serie A',        club: 'Inter Milan',       position: 'Goalkeeper', ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 95, name: 'Alessandro Bastoni',      nationality: 'Italy',        league: 'Serie A',        club: 'Inter Milan',       position: 'Defender',   ageRange: '25to30',  foot: 'left',  isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 96, name: 'Denzel Dumfries',         nationality: 'Netherlands',  league: 'Serie A',        club: 'Inter Milan',       position: 'Defender',   ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 97, name: 'Nicolo Barella',          nationality: 'Italy',        league: 'Serie A',        club: 'Inter Milan',       position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 98, name: 'Hakan Calhanoglu',        nationality: 'Turkey',       league: 'Serie A',        club: 'Inter Milan',       position: 'Midfielder', ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 99, name: 'Marcus Thuram',           nationality: 'France',       league: 'Serie A',        club: 'Inter Milan',       position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 100, name: 'Lautaro Martinez',       nationality: 'Argentina',    league: 'Serie A',        club: 'Inter Milan',       position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: true,  hasTrophies: { ucl: false, worldCup: true  } },
  // Juventus
  { id: 101, name: 'Dusan Vlahovic',         nationality: 'Serbia',       league: 'Serie A',        club: 'Juventus',          position: 'Forward',    ageRange: '25to30',  foot: 'left',  isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 102, name: 'Kenan Yildiz',           nationality: 'Turkey',       league: 'Serie A',        club: 'Juventus',          position: 'Forward',    ageRange: 'under25', foot: 'left',  isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 103, name: 'Manuel Locatelli',       nationality: 'Italy',        league: 'Serie A',        club: 'Juventus',          position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  // AC Milan
  { id: 104, name: 'Mike Maignan',           nationality: 'France',       league: 'Serie A',        club: 'AC Milan',          position: 'Goalkeeper', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 105, name: 'Theo Hernandez',         nationality: 'France',       league: 'Serie A',        club: 'AC Milan',          position: 'Defender',   ageRange: '25to30',  foot: 'left',  isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 106, name: 'Rafael Leao',            nationality: 'Portugal',     league: 'Serie A',        club: 'AC Milan',          position: 'Forward',    ageRange: '25to30',  foot: 'left',  isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 107, name: 'Christian Pulisic',      nationality: 'United States',league: 'Serie A',        club: 'AC Milan',          position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 108, name: 'Tijjani Reijnders',      nationality: 'Netherlands',  league: 'Serie A',        club: 'AC Milan',          position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  // Napoli
  { id: 109, name: 'Alex Meret',             nationality: 'Italy',        league: 'Serie A',        club: 'Napoli',            position: 'Goalkeeper', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 110, name: 'Giovanni Di Lorenzo',    nationality: 'Italy',        league: 'Serie A',        club: 'Napoli',            position: 'Defender',   ageRange: 'over30',  foot: 'right', isCaptain: true,  hasTrophies: { ucl: false, worldCup: false } },
  { id: 111, name: 'Stanislav Lobotka',      nationality: 'Slovakia',     league: 'Serie A',        club: 'Napoli',            position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: true,  hasTrophies: { ucl: false, worldCup: false } },
  { id: 112, name: 'Romelu Lukaku',          nationality: 'Belgium',      league: 'Serie A',        club: 'Napoli',            position: 'Forward',    ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  // Roma
  { id: 113, name: 'Lorenzo Pellegrini',     nationality: 'Italy',        league: 'Serie A',        club: 'Roma',              position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: true,  hasTrophies: { ucl: false, worldCup: false } },
  // Atalanta
  { id: 114, name: 'Ademola Lookman',        nationality: 'Nigeria',      league: 'Serie A',        club: 'Atalanta',          position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 115, name: 'Marten de Roon',         nationality: 'Netherlands',  league: 'Serie A',        club: 'Atalanta',          position: 'Midfielder', ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 116, name: 'Gianluca Scamacca',      nationality: 'Italy',        league: 'Serie A',        club: 'Atalanta',          position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  // Bologna
  { id: 117, name: 'Riccardo Calafiori',     nationality: 'Italy',        league: 'Serie A',        club: 'Bologna',           position: 'Defender',   ageRange: 'under25', foot: 'left',  isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },

  // ── LIGUE 1 ────────────────────────────────────────────────────────────────
  // PSG
  { id: 118, name: 'Gianluigi Donnarumma',   nationality: 'Italy',        league: 'Ligue 1',        club: 'PSG',               position: 'Goalkeeper', ageRange: '25to30',  foot: 'right', isCaptain: true,  hasTrophies: { ucl: false, worldCup: false } },
  { id: 119, name: 'Marquinhos',             nationality: 'Brazil',       league: 'Ligue 1',        club: 'PSG',               position: 'Defender',   ageRange: '25to30',  foot: 'right', isCaptain: true,  hasTrophies: { ucl: false, worldCup: false } },
  { id: 120, name: 'Achraf Hakimi',          nationality: 'Morocco',      league: 'Ligue 1',        club: 'PSG',               position: 'Defender',   ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 121, name: 'Ousmane Dembele',        nationality: 'France',       league: 'Ligue 1',        club: 'PSG',               position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: true  } },
  { id: 122, name: 'Fabian Ruiz',            nationality: 'Spain',        league: 'Ligue 1',        club: 'PSG',               position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 123, name: 'Vitinha',                nationality: 'Portugal',     league: 'Ligue 1',        club: 'PSG',               position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 124, name: 'Bradley Barcola',        nationality: 'France',       league: 'Ligue 1',        club: 'PSG',               position: 'Forward',    ageRange: 'under25', foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 125, name: 'Khvicha Kvaratskhelia',  nationality: 'Georgia',      league: 'Ligue 1',        club: 'PSG',               position: 'Forward',    ageRange: 'under25', foot: 'left',  isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 126, name: 'Warren Zaire-Emery',     nationality: 'France',       league: 'Ligue 1',        club: 'PSG',               position: 'Midfielder', ageRange: 'under25', foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 127, name: 'Nuno Mendes',            nationality: 'Portugal',     league: 'Ligue 1',        club: 'PSG',               position: 'Defender',   ageRange: 'under25', foot: 'left',  isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  // Monaco
  { id: 128, name: 'Aleksandr Golovin',      nationality: 'Russia',       league: 'Ligue 1',        club: 'Monaco',            position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 129, name: 'Breel Embolo',           nationality: 'Switzerland',  league: 'Ligue 1',        club: 'Monaco',            position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  // Marseille
  { id: 130, name: 'Pierre-Emerick Aubameyang',nationality: 'Gabon',      league: 'Ligue 1',        club: 'Marseille',         position: 'Forward',    ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  // Lyon
  { id: 131, name: 'Alexandre Lacazette',    nationality: 'France',       league: 'Ligue 1',        club: 'Lyon',              position: 'Forward',    ageRange: 'over30',  foot: 'right', isCaptain: true,  hasTrophies: { ucl: false, worldCup: false } },
  { id: 132, name: 'Rayan Cherki',           nationality: 'France',       league: 'Ligue 1',        club: 'Lyon',              position: 'Midfielder', ageRange: 'under25', foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  // Nice
  { id: 133, name: 'Terem Moffi',            nationality: 'Nigeria',      league: 'Ligue 1',        club: 'Nice',              position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  // Rennes
  { id: 134, name: 'Arnaud Kalimuendo',      nationality: 'France',       league: 'Ligue 1',        club: 'Rennes',            position: 'Forward',    ageRange: 'under25', foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  // Lille
  { id: 135, name: 'Jonathan David',         nationality: 'Canada',       league: 'Ligue 1',        club: 'Lille',             position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },

  // ── SUPPLEMENTAL (legendary + nation coverage) ─────────────────────────────
  { id: 136, name: 'Lionel Messi',           nationality: 'Argentina',    league: 'Other',          club: 'Inter Miami',       position: 'Forward',    ageRange: 'over30',  foot: 'left',  isCaptain: true,  hasTrophies: { ucl: true,  worldCup: true  } },
  { id: 137, name: 'Cristiano Ronaldo',      nationality: 'Portugal',     league: 'Other',          club: 'Al Nassr',          position: 'Forward',    ageRange: 'over30',  foot: 'right', isCaptain: true,  hasTrophies: { ucl: true,  worldCup: false } },
  { id: 138, name: 'Neymar',                 nationality: 'Brazil',       league: 'Other',          club: 'Al-Hilal',          position: 'Forward',    ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 139, name: 'Paulo Dybala',           nationality: 'Argentina',    league: 'Serie A',        club: 'Roma',              position: 'Forward',    ageRange: 'over30',  foot: 'left',  isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 140, name: 'Ciro Immobile',          nationality: 'Italy',        league: 'Serie A',        club: 'Lazio',             position: 'Forward',    ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 141, name: 'Marco Verratti',         nationality: 'Italy',        league: 'Other',          club: 'Al-Arabi',          position: 'Midfielder', ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 142, name: 'Giorgio Chiellini',      nationality: 'Italy',        league: 'Other',          club: 'Retired',           position: 'Defender',   ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 143, name: 'Ilkay Gundogan',         nationality: 'Germany',      league: 'La Liga',        club: 'Barcelona',         position: 'Midfielder', ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 144, name: 'Serge Aurier',           nationality: 'Ivory Coast',  league: 'Other',          club: 'Free Agent',        position: 'Defender',   ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },

  { id: 146, name: 'Memphis Depay',          nationality: 'Netherlands',  league: 'Other',          club: 'Corinthians',       position: 'Forward',    ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 147, name: 'Frenkie de Jong',        nationality: 'Netherlands',  league: 'La Liga',        club: 'Barcelona',         position: 'Midfielder', ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 148, name: 'Cody Gakpo',             nationality: 'Netherlands',  league: 'Premier League', club: 'Liverpool',         position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 149, name: 'Thomas Partey',          nationality: 'Ghana',        league: 'Premier League', club: 'Arsenal',           position: 'Midfielder', ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 150, name: 'Wout Faes',              nationality: 'Belgium',      league: 'Premier League', club: 'Leicester City',    position: 'Defender',   ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 151, name: 'Kevin Trapp',            nationality: 'Germany',      league: 'Bundesliga',     club: 'Frankfurt',         position: 'Goalkeeper', ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
  { id: 152, name: 'Randal Kolo Muani',      nationality: 'France',       league: 'Bundesliga',     club: 'Frankfurt',         position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: true  } },
  { id: 153, name: 'Albert Gudmundsson',     nationality: 'Iceland',      league: 'Serie A',        club: 'Fiorentina',        position: 'Forward',    ageRange: '25to30',  foot: 'right', isCaptain: true,  hasTrophies: { ucl: false, worldCup: false } },
  { id: 154, name: 'Ruslan Malinovskyi',     nationality: 'Ukraine',      league: 'Serie A',        club: 'Atalanta',          position: 'Midfielder', ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: true,  worldCup: false } },
  { id: 155, name: 'Wahbi Khazri',           nationality: 'Tunisia',      league: 'Other',          club: 'Free Agent',        position: 'Forward',    ageRange: 'over30',  foot: 'right', isCaptain: false, hasTrophies: { ucl: false, worldCup: false } },
];

// Deduplicate by lowercase name (safety net for future additions)
const _seen = new Set();
const PLAYERS_RAW = ALL_PLAYERS.filter(p => {
  const key = p.name.toLowerCase();
  if (_seen.has(key)) return false;
  _seen.add(key);
  return true;
});

// Merge in pre-fetched player photos
const _photosPath = require('path').join(__dirname, 'data', 'player-photos.json');
let _photos = {};
try { _photos = require(_photosPath); } catch {}

const PLAYERS = PLAYERS_RAW.map(p => ({
  ...p,
  photo: _photos[p.id] || null,
}));

const TOP_NATIONS = ['Brazil','France','England','Spain','Germany','Argentina','Portugal','Italy','Netherlands','Belgium'];
const TOP_LEAGUES = ['Premier League','La Liga','Bundesliga','Serie A','Ligue 1'];

function buildPool(settings = {}) {
  const { selectedNations = [], selectedLeagues = [] } = settings;
  if (!selectedNations.length && !selectedLeagues.length) return PLAYERS;
  return PLAYERS.filter(p => {
    const nationOk = selectedNations.length ? selectedNations.includes(p.nationality) : false;
    const leagueOk = selectedLeagues.length ? selectedLeagues.includes(p.league) : false;
    return nationOk || leagueOk;
  });
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickSecrets(pool) {
  const s = shuffle(pool);
  return [s[0], s[1]];
}

module.exports = { ALL_PLAYERS: PLAYERS, TOP_NATIONS, TOP_LEAGUES, buildPool, pickSecrets };
