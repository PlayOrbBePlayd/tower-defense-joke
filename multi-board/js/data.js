/* Default question library — 10 main-game questions + 8 speed-round (Fast
 * Money) questions. These are fun, general-audience starters: edit, reorder,
 * or replace ALL of them per client in the in-app Editor (editor.html), or
 * swap whole sets via Import/Export JSON. Points should ideally sum near 100
 * for each main question (survey style), but the app does not enforce it. */
window.FF_DEFAULT_QUESTIONS = {
  /* Jeopardy-style opener board. Structure:
   *   categories: [{ name, clues: [{ q, type, choices?, answer, value }] }]
   *   type 'mc'   -> choices: 4 strings, answer: correct index (0-3)
   *   type 'tf'   -> answer: true | false
   *   type 'text' -> answer: string (host judges typed/spoken responses)
   * Categories and clues-per-category are fully editable in the Editor. */
  jeopardy: {
    // Final Jeopardy: one dramatic clue — teams lock in secret wagers first.
    final: {
      category: 'Everyday Mysteries',
      q: 'Surveys say this is the #1 thing people would grab first in a house fire — after people and pets.',
      type: 'mc',
      choices: ['Their phone', 'Photo albums', 'Their wallet', 'Their laptop'],
      answer: 0,
    },
    categories: [
      {
        name: 'Office Life',
        clues: [
          { q: 'This "brief" gathering famously could have been an email.', type: 'mc', choices: ['A meeting', 'A birthday party', 'A fire drill', 'A team lunch'], answer: 0, value: 100 },
          { q: 'The #1 office battleground:', type: 'mc', choices: ['The thermostat', 'Stapler ownership', 'Chair heights', 'Desk plants'], answer: 0, value: 200 },
          { q: 'Which of these is the universal signal that a meeting is over?', type: 'mc', choices: ['Someone stands up', '"Well…"', 'Laptops close', 'All of the above'], answer: 3, value: 300 },
          { q: 'The prime suspect in office fish-smell crimes:', type: 'mc', choices: ['The microwave', 'The printer', 'The fridge', 'The elevator'], answer: 0, value: 400 },
          { q: 'Which phrase means "I stopped listening five minutes ago"?', type: 'mc', choices: ['"Circle back"', '"Great point"', '"Per my last email"', '"Let\'s take this offline"'], answer: 1, value: 500 },
        ],
      },
      {
        name: 'Pop Culture',
        clues: [
          { q: 'A group of superhero movies sharing one storyline is called this.', type: 'mc', choices: ['A cinematic universe', 'A franchise sandwich', 'A hero cluster', 'A mega-saga'], answer: 0, value: 100 },
          { q: 'Which app is famous for 15-second dance trends?', type: 'mc', choices: ['LinkedIn', 'TikTok', 'Excel', 'Zoom'], answer: 1, value: 200 },
          { q: 'Watching an entire season in one sitting is called this.', type: 'mc', choices: ['Binge-watching', 'Speed-viewing', 'Marathon-mode', 'Screen-camping'], answer: 0, value: 300 },
          { q: 'Which of these is NOT a real award show?', type: 'mc', choices: ['The Oscars', 'The Grammys', 'The Streamies', 'The Emmys'], answer: 2, value: 400 },
          { q: 'The "floss" dance was popularized by a viral kid known as:', type: 'mc', choices: ['Backpack Kid', 'Fortnite Fred', 'Dance Dan', 'TikTok Tim'], answer: 0, value: 500 },
        ],
      },
      {
        name: 'Food & Drink',
        clues: [
          { q: 'The most popular delivery food on Earth:', type: 'mc', choices: ['Pizza', 'Sushi', 'Tacos', 'Salad'], answer: 0, value: 100 },
          { q: 'Which drink has the most caffeine per full cup?', type: 'mc', choices: ['Drip coffee', 'An espresso shot', 'Green tea', 'Cola'], answer: 0, value: 200 },
          { q: 'Which of these is NOT traditionally in guacamole?', type: 'mc', choices: ['Avocado', 'Lime', 'Mayonnaise', 'Cilantro'], answer: 2, value: 300 },
          { q: 'This bubbly "boba" drink originated in Taiwan.', type: 'mc', choices: ['Bubble tea', 'Kombucha', 'Root beer', 'Horchata'], answer: 0, value: 400 },
          { q: 'Which country drinks the most coffee per person?', type: 'mc', choices: ['USA', 'Italy', 'Finland', 'Brazil'], answer: 2, value: 500 },
        ],
      },
      {
        name: 'World Facts',
        clues: [
          { q: 'The largest ocean on Earth:', type: 'mc', choices: ['The Pacific', 'The Atlantic', 'The Indian', 'The Arctic'], answer: 0, value: 100 },
          { q: 'Which is wider?', type: 'mc', choices: ['Australia', 'The Moon', 'They\'re the same', 'Depends on the season'], answer: 0, value: 200 },
          { q: 'Which country has the most people?', type: 'mc', choices: ['China', 'India', 'USA', 'Indonesia'], answer: 1, value: 300 },
          { q: 'This many time zones span Russia.', type: 'mc', choices: ['5', '7', '9', '11'], answer: 3, value: 400 },
          { q: 'There are more of these than atoms in the observable universe.', type: 'mc', choices: ['Possible chess games', 'Grains of sand', 'Stars in the sky', 'Selfies ever taken'], answer: 0, value: 500 },
        ],
      },
      {
        name: 'Tech & Gadgets',
        clues: [
          { q: 'This fruit-named company makes the iPhone.', type: 'mc', choices: ['Apple', 'Blackberry', 'Mango', 'Peach'], answer: 0, value: 100 },
          { q: '"Wi-Fi" is actually short for:', type: 'mc', choices: ['Nothing — it\'s just a name', 'Wireless Fidelity', 'Wide Field', 'Wave Frequency'], answer: 0, value: 200 },
          { q: 'What does "CC" mean on an email?', type: 'mc', choices: ['Carbon copy', 'Courtesy copy', 'Copy confirm', 'Cool colleague'], answer: 0, value: 300 },
          { q: 'The universal "undo" keyboard shortcut:', type: 'mc', choices: ['Ctrl+Z', 'Ctrl+U', 'Alt+F4', 'Ctrl+P'], answer: 0, value: 400 },
          { q: 'Which came first?', type: 'mc', choices: ['Google', 'Facebook', 'The DVD', 'The iPod'], answer: 2, value: 500 },
        ],
      },
    ],
  },
  main: [
    {
      q: "Name something people do the moment they wake up in the morning.",
      answers: [
        { text: "Check their phone", points: 34 },
        { text: "Use the bathroom", points: 24 },
        { text: "Hit snooze / go back to sleep", points: 15 },
        { text: "Stretch / yawn", points: 11 },
        { text: "Drink water or coffee", points: 9 },
        { text: "Turn off the alarm", points: 7 },
      ],
    },
    {
      q: "Name something people do in a boring meeting.",
      answers: [
        { text: "Check their phone", points: 32 },
        { text: "Doodle", points: 22 },
        { text: "Daydream / zone out", points: 18 },
        { text: "Answer emails", points: 13 },
        { text: "Snack", points: 8 },
        { text: "Fall asleep", points: 7 },
      ],
    },
    {
      q: "Name something everyone 'borrows' from the office and never returns.",
      answers: [
        { text: "Pens", points: 35 },
        { text: "Notepads / sticky notes", points: 21 },
        { text: "A charger", points: 16 },
        { text: "A stapler", points: 12 },
        { text: "Coffee mugs", points: 9 },
        { text: "Scissors", points: 7 },
      ],
    },
    {
      q: "Name a reason you might be late to work.",
      answers: [
        { text: "Traffic", points: 38 },
        { text: "Overslept", points: 27 },
        { text: "Weather", points: 12 },
        { text: "Kids / family", points: 10 },
        { text: "Couldn't find something", points: 8 },
        { text: "Car trouble", points: 5 },
      ],
    },
    {
      q: "Name something people say they'd buy if they won the lottery.",
      answers: [
        { text: "A house / mansion", points: 33 },
        { text: "A car", points: 25 },
        { text: "A vacation / travel", points: 18 },
        { text: "A boat / yacht", points: 9 },
        { text: "An island", points: 8 },
        { text: "A private jet", points: 7 },
      ],
    },
    {
      q: "Name something people pretend to like to be polite.",
      answers: [
        { text: "A bad gift", points: 29 },
        { text: "Someone's cooking", points: 26 },
        { text: "A boring story", points: 18 },
        { text: "An ugly baby / pet", points: 12 },
        { text: "A coworker's idea", points: 9 },
        { text: "A haircut", points: 6 },
      ],
    },
    {
      q: "Name something people forget when leaving the house.",
      answers: [
        { text: "Phone", points: 30 },
        { text: "Keys", points: 26 },
        { text: "Wallet / purse", points: 19 },
        { text: "To lock the door", points: 10 },
        { text: "Lunch", points: 8 },
        { text: "Umbrella", points: 7 },
      ],
    },
    {
      q: "Name a skill people claim on their resume but don't really have.",
      answers: [
        { text: "Excel / spreadsheets", points: 28 },
        { text: "A foreign language", points: 24 },
        { text: "Leadership", points: 17 },
        { text: "'Detail-oriented'", points: 13 },
        { text: "Public speaking", points: 10 },
        { text: "Photoshop", points: 8 },
      ],
    },
    {
      q: "Name a food people are embarrassed to admit they love.",
      answers: [
        { text: "Fast food", points: 30 },
        { text: "Pineapple on pizza", points: 22 },
        { text: "Instant ramen", points: 17 },
        { text: "Canned / boxed mac & cheese", points: 13 },
        { text: "Gas station snacks", points: 10 },
        { text: "Ketchup on everything", points: 8 },
      ],
    },
    {
      q: "Name a place people say they'll visit 'someday' but never do.",
      answers: [
        { text: "Paris / Europe", points: 31 },
        { text: "Hawaii", points: 23 },
        { text: "The gym", points: 18 },
        { text: "Grandma's house", points: 11 },
        { text: "The dentist", points: 9 },
        { text: "The Grand Canyon", points: 8 },
      ],
    },
  ],
  fast: [
    {
      q: "Name a fruit that is yellow.",
      answers: [
        { text: "Banana", points: 45 }, { text: "Lemon", points: 30 },
        { text: "Pineapple", points: 12 }, { text: "Mango", points: 8 }, { text: "Star fruit", points: 5 },
      ],
    },
    {
      q: "How many hours a day do people spend on their phone?",
      answers: [
        { text: "4 hours", points: 33 }, { text: "2 hours", points: 24 },
        { text: "6 hours", points: 20 }, { text: "8 hours", points: 15 }, { text: "1 hour", points: 8 },
      ],
    },
    {
      q: "Name a place you don't want to run out of gas.",
      answers: [
        { text: "The highway", points: 40 }, { text: "The desert", points: 25 },
        { text: "A bridge", points: 18 }, { text: "The middle of nowhere", points: 12 }, { text: "A bad neighborhood", points: 5 },
      ],
    },
    {
      q: "Name something a dog does that a cat would never do.",
      answers: [
        { text: "Fetch", points: 38 }, { text: "Come when called", points: 26 },
        { text: "Wag its tail", points: 20 }, { text: "Take a walk on a leash", points: 11 }, { text: "Slobber", points: 5 },
      ],
    },
    {
      q: "At what age do people stop having birthday parties?",
      answers: [
        { text: "30", points: 30 }, { text: "18", points: 26 },
        { text: "21", points: 22 }, { text: "40", points: 14 }, { text: "13", points: 8 },
      ],
    },
    {
      q: "Name a food you eat with your hands.",
      answers: [
        { text: "Pizza", points: 38 }, { text: "Burgers", points: 26 },
        { text: "Tacos", points: 17 }, { text: "Wings", points: 12 }, { text: "Fries", points: 7 },
      ],
    },
    {
      q: "Name something that flies.",
      answers: [
        { text: "A bird", points: 41 }, { text: "An airplane", points: 29 },
        { text: "Time", points: 13 }, { text: "A kite", points: 10 }, { text: "A bee", points: 7 },
      ],
    },
    {
      q: "Name an excuse people give for missing a meeting.",
      answers: [
        { text: "Stuck in traffic", points: 31 }, { text: "Felt sick", points: 25 },
        { text: "Forgot / didn't see the invite", points: 20 }, { text: "Double-booked", points: 15 }, { text: "Internet was down", points: 9 },
      ],
    },
  ],

  // ---- Wheel of Fortune bonus game: customizable puzzles ----
  wheel: [
    { category: 'PHRASE', phrase: 'TEAMWORK MAKES THE DREAM WORK' },
    { category: 'EVENT', phrase: 'QUARTERLY BUSINESS REVIEW' },
    { category: 'THING', phrase: 'ICE BREAKER ACTIVITY' },
    { category: 'PHRASE', phrase: 'THINK OUTSIDE THE BOX' },
    { category: 'AROUND THE OFFICE', phrase: 'RELUCTANT RETURN TO OFFICE' },
    { category: 'PHRASE', phrase: 'LET US CIRCLE BACK ON THAT' },
    { category: 'OCCASION', phrase: 'COMPANY HOLIDAY PARTY' },
    { category: 'THING', phrase: 'END OF YEAR BONUS' },
    { category: 'PHRASE', phrase: 'YOU ARE STILL ON MUTE' },
    { category: 'PLACE', phrase: 'CORPORATE TEAM BUILDING RETREAT' },
  ],
};

// Wheel wedges: label, point value (null = hazard), wedge color.
window.FF_WHEEL_WEDGES = [
  { label: '500', v: 500, c: '#e23b3b' },
  { label: 'BANKRUPT', v: null, c: '#14161f' },
  { label: '650', v: 650, c: '#2f7de1' },
  { label: '700', v: 700, c: '#f0a11c' },
  { label: '600', v: 600, c: '#7d3fe1' },
  { label: '800', v: 800, c: '#2fb56b' },
  { label: 'LOSE A TURN', v: null, c: '#8a8f9c' },
  { label: '650', v: 650, c: '#e2703b' },
  { label: '550', v: 550, c: '#3bc4e2' },
  { label: '900', v: 900, c: '#d13be2' },
  { label: '600', v: 600, c: '#95c11c' },
  { label: '2500', v: 2500, c: '#ffd75e' },
];
(function () {
  'use strict';

  // clue helper: value, question, 4 choices, index of the right one, daily-double flag
  const mc = (value, q, choices, answer, dd) => ({ value, type: 'mc', q, choices, answer, dd: !!dd });
  const C = (name, clues) => ({ name, clues });

  /* ===================== JEOPARDY BOARDS (5) ===================== */

  const JEOP_BANKS = [
    {
      name: 'Board 1 · Boardroom Fundamentals',
      categories: [
        C('BUSINESS HISTORY', [
          mc(100, 'This company was founded in 1976 in a California garage by two men named Steve.', ['Apple', 'Microsoft', 'Hewlett-Packard', 'Atari'], 0),
          mc(200, 'This tech giant has been nicknamed "Big Blue" for decades.', ['Intel', 'IBM', 'Boeing', 'GE'], 1),
          mc(300, 'Founded in 1602, it is widely considered the first publicly traded company.', ['Hudson’s Bay Company', 'British East India Company', 'Dutch East India Company', 'Bank of England'], 2),
          mc(400, 'Henry Ford launched the moving assembly line for the Model T in this year.', ['1903', '1913', '1923', '1898'], 1, true),
          mc(500, 'In 2018 this became the first U.S. company to reach a $1 trillion market cap.', ['Amazon', 'Microsoft', 'ExxonMobil', 'Apple'], 3),
        ]),
        C('BUSINESS JARGON', [
          mc(100, '"Low-hanging fruit" refers to goals that are this.', ['Long-term', 'Easiest to achieve', 'Overripe', 'Confidential'], 1),
          mc(200, 'In every dashboard meeting, KPI stands for this.', ['Key Performance Indicator', 'Known Process Issue', 'Key Personnel Index', 'Kept Private Information'], 0),
          mc(300, '"Boiling the ocean" means attempting a task that is this.', ['Highly profitable', 'Impossibly broad', 'Environmentally risky', 'Quick and easy'], 1),
          mc(400, 'A startup "unicorn" is privately valued at more than this.', ['$100 million', '$500 million', '$1 billion', '$10 billion'], 2),
          mc(500, 'The original "Skunk Works" was a secret projects division at this company.', ['Lockheed', 'DuPont', 'Kodak', 'RAND Corporation'], 0),
        ]),
        C('FAMOUS LEADERS', [
          mc(100, 'The long-time Berkshire Hathaway chief known as the "Oracle of Omaha."', ['Charlie Munger', 'Warren Buffett', 'Carl Icahn', 'George Soros'], 1),
          mc(200, 'He grew Starbucks from a handful of Seattle stores into a global chain.', ['Howard Schultz', 'Ray Kroc', 'Fred Smith', 'Phil Knight'], 0),
          mc(300, 'GE’s famously tough CEO from 1981 to 2001, nicknamed "Neutron Jack."', ['Jack Dorsey', 'Jack Welch', 'Jack Ma', 'Jack Bogle'], 1),
          mc(400, 'In 2014 she became the first woman to lead a major global automaker.', ['Ginni Rometty', 'Meg Whitman', 'Mary Barra', 'Sheryl Sandberg'], 2),
          mc(500, 'IBM’s Watson computer is named for this long-serving IBM leader.', ['James Watson', 'Thomas J. Watson', 'Emma Watson', 'Alexander Watson'], 1, true),
        ]),
        C('ECONOMICS 101', [
          mc(100, 'GDP stands for this.', ['Gross Domestic Product', 'General Dividend Payout', 'Gross Deposit Percentage', 'Global Development Plan'], 0),
          mc(200, 'A sustained rise in the general price level is called this.', ['Deflation', 'Stagnation', 'Inflation', 'Appreciation'], 2),
          mc(300, 'The "invisible hand" of the market comes from this economist.', ['John Maynard Keynes', 'Adam Smith', 'Milton Friedman', 'David Ricardo'], 1),
          mc(400, 'A market dominated by just a few large firms is called this.', ['Monopoly', 'Oligopoly', 'Duopoly', 'Cartel'], 1),
          mc(500, 'The Phillips curve describes a trade-off between inflation and this.', ['Interest rates', 'Unemployment', 'Exports', 'Productivity'], 1),
        ]),
        C('BRAND ORIGINS', [
          mc(100, 'The "swoosh" logo, designed for $35 in 1971, belongs to this brand.', ['Adidas', 'Puma', 'Nike', 'Reebok'], 2),
          mc(200, 'Google’s name is a play on this mathematical term.', ['Googol', 'Gigabit', 'Goggle', 'Algorithm'], 0),
          mc(300, 'LEGO comes from the Danish phrase "leg godt," meaning this.', ['Little blocks', 'Play well', 'Build fast', 'Good fun'], 1),
          mc(400, 'When it launched in 1995, Amazon sold only this product.', ['CDs', 'Toys', 'Books', 'Electronics'], 2),
          mc(500, 'Before phones, Nokia started in 1865 as this kind of business.', ['A rubber-boot maker', 'A paper mill', 'A fishing company', 'A shipyard'], 1),
        ]),
      ],
      final: {
        category: 'CORPORATE MILESTONES', type: 'mc',
        q: 'In 1956 trucker Malcom McLean introduced this standardized innovation that slashed the cost of global freight.',
        choices: ['The forklift', 'The shipping container', 'The barcode', 'Air freight'], answer: 1,
      },
    },

    {
      name: 'Board 2 · Global Commerce',
      categories: [
        C('WORLD CURRENCIES', [
          mc(100, 'Japan pays in this currency.', ['Won', 'Yuan', 'Yen', 'Ringgit'], 2),
          mc(200, 'The franc is still the official currency of this European country.', ['France', 'Belgium', 'Switzerland', 'Luxembourg'], 2),
          mc(300, 'India’s currency is this.', ['Rupiah', 'Rupee', 'Riyal', 'Baht'], 1),
          mc(400, 'South Africa’s currency is this.', ['Pound', 'Rand', 'Krona', 'Peso'], 1),
          mc(500, 'Poland kept this currency instead of adopting the euro.', ['Złoty', 'Forint', 'Koruna', 'Lev'], 0),
        ]),
        C('CAPITALS OF COMMERCE', [
          mc(100, 'Wall Street anchors the financial district of this city.', ['Chicago', 'Boston', 'New York', 'Philadelphia'], 2),
          mc(200, 'Canary Wharf is a banking hub in this capital.', ['Dublin', 'London', 'Edinburgh', 'Amsterdam'], 1),
          mc(300, 'The Nikkei 225 index tracks stocks traded in this city.', ['Seoul', 'Shanghai', 'Tokyo', 'Singapore'], 2),
          mc(400, 'Europe’s largest seaport is in this Dutch city.', ['Antwerp', 'Hamburg', 'Rotterdam', 'Amsterdam'], 2, true),
          mc(500, 'The European Central Bank is headquartered in this German city.', ['Berlin', 'Munich', 'Frankfurt', 'Bonn'], 2),
        ]),
        C('GLOBAL BRANDS', [
          mc(100, 'IKEA’s flat-pack empire began in this country.', ['Denmark', 'Norway', 'Sweden', 'Finland'], 2),
          mc(200, 'Samsung is the largest conglomerate of this country.', ['Japan', 'South Korea', 'Taiwan', 'China'], 1),
          mc(300, 'Nestlé, the world’s largest food company, is based in this country.', ['Germany', 'France', 'Austria', 'Switzerland'], 3),
          mc(400, 'The Tata Group — cars, steel, tea and IT — hails from this country.', ['Indonesia', 'India', 'Bangladesh', 'UAE'], 1),
          mc(500, 'Discount grocer Aldi and software giant SAP are both from this country.', ['Netherlands', 'Austria', 'Germany', 'Denmark'], 2),
        ]),
        C('TRADE & TREATIES', [
          mc(100, 'The EU’s shared currency, in circulation as cash since 2002.', ['The ecu', 'The euro', 'The eurodollar', 'The florin'], 1),
          mc(200, 'In 2020, NAFTA was replaced by this agreement.', ['USMCA', 'CAFTA', 'TPP', 'GATT'], 0),
          mc(300, 'The World Trade Organization is headquartered in this Swiss city.', ['Zurich', 'Bern', 'Geneva', 'Basel'], 2),
          mc(400, 'OPEC coordinates the production of this commodity.', ['Natural gas', 'Gold', 'Oil', 'Grain'], 2),
          mc(500, 'The four "Asian Tiger" economies: Hong Kong, Singapore, Taiwan and this country.', ['Japan', 'Malaysia', 'South Korea', 'Thailand'], 2, true),
        ]),
        C('TIME ZONES & TRAVEL', [
          mc(100, 'GMT stands for this.', ['Global Mean Time', 'Greenwich Mean Time', 'General Meridian Time', 'Grand Metric Time'], 1),
          mc(200, 'The world’s busiest airport by passengers, Hartsfield-Jackson, serves this city.', ['Dallas', 'Chicago', 'Atlanta', 'Denver'], 2),
          mc(300, 'The International Date Line roughly follows this meridian.', ['The equator', 'The 90th meridian', 'The 180th meridian', 'The prime meridian'], 2),
          mc(400, 'Counting overseas territories, this country spans the most time zones (12).', ['Russia', 'United States', 'France', 'United Kingdom'], 2),
          mc(500, 'UTC+9 covers Tokyo and this other capital city.', ['Beijing', 'Seoul', 'Bangkok', 'Manila'], 1),
        ]),
      ],
      final: {
        category: 'THE GLOBAL ECONOMY', type: 'mc',
        q: 'After the United States, this country has the world’s largest economy by nominal GDP.',
        choices: ['Japan', 'Germany', 'China', 'India'], answer: 2,
      },
    },

    {
      name: 'Board 3 · Science & Innovation',
      categories: [
        C('GREAT INVENTIONS', [
          mc(100, 'Alexander Graham Bell patented this device in 1876.', ['The phonograph', 'The telegraph', 'The telephone', 'The radio'], 2),
          mc(200, 'Johannes Gutenberg revolutionized Europe with this invention around 1440.', ['The compass', 'The printing press', 'The mechanical clock', 'Eyeglasses'], 1),
          mc(300, 'Alfred Nobel funded his prizes with the fortune from inventing this.', ['The rifle', 'Dynamite', 'The match', 'Gunpowder'], 1),
          mc(400, 'In 1989 Tim Berners-Lee proposed this while working at CERN.', ['E-mail', 'The microprocessor', 'The World Wide Web', 'Wi-Fi'], 2),
          mc(500, 'The transistor — arguably the 20th century’s biggest invention — came out of this lab in 1947.', ['MIT Lincoln Lab', 'Bell Labs', 'Xerox PARC', 'Los Alamos'], 1, true),
        ]),
        C('TECH MILESTONES', [
          mc(100, 'Steve Jobs unveiled the first iPhone in this year.', ['2005', '2007', '2009', '2010'], 1),
          mc(200, 'ENIAC, completed in 1945, was an early example of this.', ['A jet engine', 'A general-purpose computer', 'A satellite', 'A photocopier'], 1),
          mc(300, 'Moore’s Law observed that this doubles roughly every two years.', ['Internet speed', 'Battery life', 'Transistor count on a chip', 'Screen resolution'], 2),
          mc(400, 'Ray Tomlinson sent the first networked one of these in 1971, picking the @ symbol.', ['Fax', 'Text message', 'E-mail', 'Tweet'], 2),
          mc(500, 'In 1997 IBM’s Deep Blue defeated this world chess champion.', ['Bobby Fischer', 'Garry Kasparov', 'Anatoly Karpov', 'Magnus Carlsen'], 1),
        ]),
        C('SPACE RACE', [
          mc(100, 'The first human to walk on the Moon.', ['Buzz Aldrin', 'Neil Armstrong', 'John Glenn', 'Alan Shepard'], 1),
          mc(200, 'The Soviet satellite that started the space race in 1957.', ['Vostok', 'Soyuz', 'Sputnik', 'Mir'], 2),
          mc(300, 'In 1962 he became the first American to orbit the Earth.', ['Alan Shepard', 'Gus Grissom', 'John Glenn', 'Gordon Cooper'], 2),
          mc(400, 'The Hubble Space Telescope launched in this decade.', ['1970s', '1980s', '1990s', '2000s'], 2),
          mc(500, 'The first woman in space, in 1963.', ['Sally Ride', 'Valentina Tereshkova', 'Mae Jemison', 'Svetlana Savitskaya'], 1, true),
        ]),
        C('EVERYDAY SCIENCE', [
          mc(100, 'Table salt is the common name for this compound.', ['Potassium chloride', 'Sodium chloride', 'Calcium carbonate', 'Sodium bicarbonate'], 1),
          mc(200, 'The speed of light is roughly this.', ['300,000 km per second', '30,000 km per second', '3 million km per second', '300 km per second'], 0),
          mc(300, 'This organelle is famously "the powerhouse of the cell."', ['Ribosome', 'Nucleus', 'Mitochondrion', 'Golgi apparatus'], 2),
          mc(400, 'On the pH scale, 7 means a solution is this.', ['Acidic', 'Basic', 'Neutral', 'Saturated'], 2),
          mc(500, 'Absolute zero is approximately this temperature in Celsius.', ['-100°C', '-173°C', '-273°C', '-373°C'], 2),
        ]),
        C('MEDICAL BREAKTHROUGHS', [
          mc(100, 'He discovered penicillin in a messy lab in 1928.', ['Louis Pasteur', 'Alexander Fleming', 'Joseph Lister', 'Robert Koch'], 1),
          mc(200, 'Jonas Salk developed the first effective vaccine against this disease.', ['Smallpox', 'Measles', 'Polio', 'Tuberculosis'], 2),
          mc(300, 'Wilhelm Röntgen won the first Nobel Prize in Physics for discovering these.', ['Radio waves', 'X-rays', 'Electrons', 'Gamma rays'], 1),
          mc(400, 'Dr. Christiaan Barnard performed the world’s first of these in 1967.', ['Kidney transplant', 'Open-heart bypass', 'Heart transplant', 'Hip replacement'], 2),
          mc(500, 'Watson and Crick described the structure of DNA as this.', ['A triple spiral', 'A double helix', 'A folded lattice', 'A single strand'], 1),
        ]),
      ],
      final: {
        category: 'INNOVATION', type: 'mc',
        q: 'Pioneered at Xerox PARC in 1973 and made famous by the Macintosh, this changed how everyone uses computers.',
        choices: ['The graphical user interface', 'The trackpad', 'The laser printer', 'The spreadsheet'], answer: 0,
      },
    },

    {
      name: 'Board 4 · Words & Numbers',
      categories: [
        C('LATIN LIVES ON', [
          mc(100, '"Et cetera" literally means this.', ['And so on forever', 'And the rest', 'Among others', 'For example'], 1),
          mc(200, '"Per capita" measures something per this.', ['Household', 'Year', 'Person', 'Company'], 2),
          mc(300, '"Caveat emptor" warns that this party should beware.', ['The seller', 'The buyer', 'The lawyer', 'The banker'], 1),
          mc(400, '"Quid pro quo" translates closest to this.', ['Cash only', 'Something for something', 'Take it or leave it', 'Buyer’s remorse'], 1),
          mc(500, 'A "sine qua non" is this kind of condition.', ['Optional', 'Temporary', 'Essential', 'Illegal'], 2),
        ]),
        C('ACRONYM SOUP', [
          mc(100, 'The E in CEO stands for this.', ['Executive', 'Economic', 'Enterprise', 'Elected'], 0),
          mc(200, 'ROI — the acronym every budget meeting loves — stands for this.', ['Rate of Inflation', 'Return on Investment', 'Risk of Insolvency', 'Revenue over Income'], 1),
          mc(300, 'SCUBA is actually an acronym; the U stands for this.', ['Universal', 'Underwater', 'Utility', 'Unassisted'], 1),
          mc(400, 'The first A in NASA stands for this.', ['American', 'Aeronautics', 'Astronomical', 'Aerospace'], 1),
          mc(500, 'RADAR began as an acronym for "radio detection and" this.', ['Reconnaissance', 'Ranging', 'Reporting', 'Reflection'], 1, true),
        ]),
        C('WORD ORIGINS', [
          mc(100, '"Salary" comes from the Latin word for this commodity once used as pay.', ['Grain', 'Silver', 'Salt', 'Wine'], 2),
          mc(200, '"Robot" entered English from a Czech word meaning this.', ['Metal man', 'Forced labor', 'Machine', 'Servant'], 1),
          mc(300, '"Quarantine" comes from the Italian for this number of days.', ['Seven', 'Fourteen', 'Thirty', 'Forty'], 3),
          mc(400, '"Ketchup" likely traces back to a fermented fish sauce from this part of the world.', ['Southern China', 'India', 'Mexico', 'The Middle East'], 0),
          mc(500, '"Sabotage" is popularly linked to this French item — the "sabot."', ['A hammer', 'A wooden shoe', 'A rail spike', 'A wine cork'], 1),
        ]),
        C('BY THE NUMBERS', [
          mc(100, 'A "gross" equals a dozen dozen, which is this many.', ['100', '120', '144', '160'], 2),
          mc(200, 'The Roman numeral M stands for this.', ['50', '100', '500', '1000'], 3),
          mc(300, '"Four score and seven years" is this many years.', ['47', '74', '87', '94'], 2),
          mc(400, 'Binary 1010 equals this in decimal.', ['4', '8', '10', '12'], 2),
          mc(500, 'The only even prime number.', ['0', '1', '2', '4'], 2),
        ]),
        C('GRAMMAR POLICE', [
          mc(100, 'The ampersand (&) replaces this word.', ['At', 'And', 'Also', 'Plus'], 1),
          mc(200, 'Their, there and they’re are examples of these.', ['Synonyms', 'Antonyms', 'Homophones', 'Palindromes'], 2),
          mc(300, 'The Oxford comma appears immediately before this.', ['The first item in a list', 'The final conjunction', 'A quotation', 'A semicolon'], 1),
          mc(400, 'A word reading the same backward and forward, like "level."', ['Anagram', 'Palindrome', 'Acrostic', 'Pangram'], 1),
          mc(500, 'Unlike "i.e.", the abbreviation "e.g." means this.', ['That is', 'In conclusion', 'For example', 'And others'], 2, true),
        ]),
      ],
      final: {
        category: 'LANGUAGE', type: 'mc',
        q: 'By number of native speakers, this is the most spoken language in the world.',
        choices: ['English', 'Hindi', 'Spanish', 'Mandarin Chinese'], answer: 3,
      },
    },

    {
      name: 'Board 5 · History & Culture',
      categories: [
        C('WORLD HISTORY', [
          mc(100, 'This wall came down in November 1989.', ['The Great Wall', 'Hadrian’s Wall', 'The Berlin Wall', 'The Iron Curtain'], 2),
          mc(200, 'King John sealed the Magna Carta in this year.', ['1066', '1215', '1315', '1492'], 1),
          mc(300, 'The first Roman emperor.', ['Julius Caesar', 'Nero', 'Augustus', 'Marcus Aurelius'], 2),
          mc(400, 'The Meiji Restoration of 1868 rapidly modernized this country.', ['China', 'Korea', 'Japan', 'Thailand'], 2),
          mc(500, 'The Wars of the Roses were fought for the throne of this country.', ['France', 'Spain', 'Scotland', 'England'], 3),
        ]),
        C('ART & ARTISTS', [
          mc(100, 'The Mona Lisa was painted by this Renaissance master.', ['Michelangelo', 'Raphael', 'Leonardo da Vinci', 'Titian'], 2),
          mc(200, '"The Starry Night" swirls came from this Dutch painter.', ['Rembrandt', 'Vermeer', 'Van Gogh', 'Mondrian'], 2),
          mc(300, 'Picasso’s "Guernica" responded to a bombing in this country.', ['France', 'Spain', 'Italy', 'Portugal'], 1),
          mc(400, 'He spent four years painting the Sistine Chapel ceiling.', ['Donatello', 'Botticelli', 'Michelangelo', 'Caravaggio'], 2),
          mc(500, 'This American became famous for his "drip" paintings.', ['Andy Warhol', 'Jackson Pollock', 'Mark Rothko', 'Roy Lichtenstein'], 1, true),
        ]),
        C('LITERATURE', [
          mc(100, '"Romeo and Juliet" is set in this Italian city.', ['Venice', 'Florence', 'Verona', 'Rome'], 2),
          mc(200, '"Big Brother is watching you" comes from this novel.', ['Brave New World', 'Fahrenheit 451', '1984', 'Animal Farm'], 2),
          mc(300, '"Moby-Dick" opens with this three-word line.', ['It was midnight', 'Call me Ishmael', 'The whale surfaced', 'I am born'], 1),
          mc(400, '"One Hundred Years of Solitude" was written by this Colombian Nobel laureate.', ['Pablo Neruda', 'Jorge Luis Borges', 'Gabriel García Márquez', 'Mario Vargas Llosa'], 2),
          mc(500, 'The Odyssey and the Iliad are attributed to this poet.', ['Virgil', 'Sophocles', 'Ovid', 'Homer'], 3),
        ]),
        C('GEOGRAPHY', [
          mc(100, 'Traditionally cited as the longest river in the world.', ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], 1),
          mc(200, 'The smallest country in the world by area.', ['Monaco', 'San Marino', 'Vatican City', 'Liechtenstein'], 2),
          mc(300, 'Mount Kilimanjaro rises in this country.', ['Kenya', 'Tanzania', 'Uganda', 'Ethiopia'], 1),
          mc(400, 'The Bosphorus strait splits this city across two continents.', ['Cairo', 'Athens', 'Istanbul', 'Dubai'], 2),
          mc(500, 'The Atacama, Earth’s driest non-polar desert, is on this continent.', ['Africa', 'Australia', 'Asia', 'South America'], 3),
        ]),
        C('THE 20TH CENTURY', [
          mc(100, 'The "unsinkable" Titanic sank in this year.', ['1905', '1912', '1918', '1923'], 1),
          mc(200, 'The famous music festival held on a New York dairy farm in 1969.', ['Monterey Pop', 'Woodstock', 'Altamont', 'Isle of Wight'], 1),
          mc(300, 'The Marshall Plan financed the post-war rebuilding of this continent.', ['Asia', 'South America', 'Europe', 'Africa'], 2),
          mc(400, 'The 1956 crisis over this canal reshaped Middle East politics.', ['Panama Canal', 'Suez Canal', 'Kiel Canal', 'Corinth Canal'], 1, true),
          mc(500, 'The first Secretary-General of the United Nations.', ['Dag Hammarskjöld', 'U Thant', 'Trygve Lie', 'Kurt Waldheim'], 2),
        ]),
      ],
      final: {
        category: 'MODERN HISTORY', type: 'mc',
        q: 'This 1944 New Hampshire conference created the IMF and the World Bank.',
        choices: ['Yalta', 'Bretton Woods', 'Potsdam', 'Dumbarton Oaks'], answer: 1,
      },
    },
  ];

  /* ===================== FAMILY FEUD BOARDS (5) ===================== */

  const Q = (q, answers) => ({ q, answers: answers.map(([text, points]) => ({ text, points })) });

  const FEUD_BANKS = [
    {
      name: 'Board 1 · Office Life',
      questions: [
        Q('Name something people do in their first 10 minutes at work.', [['Get coffee', 32], ['Check email', 28], ['Chat with coworkers', 15], ['Review calendar', 12], ['Organize desk', 8], ['Snooze at desk', 5]]),
        Q('Name a reason a meeting runs long.', [['Off-topic tangents', 30], ['Tech problems', 24], ['People arriving late', 16], ['No agenda', 14], ['One long talker', 11], ['Too many questions', 5]]),
        Q('Name something you’d find in every conference room.', [['Table & chairs', 28], ['TV or screen', 24], ['Whiteboard', 18], ['Speakerphone', 14], ['Dried-out markers', 10], ['Tangled cables', 6]]),
        Q('Name an excuse people give for missing a deadline.', [['Waiting on someone else', 29], ['Too many meetings', 23], ['Got sick', 17], ['Scope changed', 14], ['Computer problems', 11], ['Forgot', 6]]),
        Q('Name something people do on a video call but never admit.', [['Check their phone', 31], ['Answer emails', 26], ['Eat', 16], ['Online shopping', 12], ['Mute & talk to family', 9], ['Doze off', 6]]),
        Q('Name a word that often follows "team."', [['Work', 30], ['Building', 25], ['Player', 18], ['Meeting', 12], ['Leader', 9], ['Spirit', 6]]),
        Q('Name something that disappears fast from the office kitchen.', [['Free food / donuts', 33], ['Coffee', 27], ['Good mugs', 14], ['Snacks', 12], ['Milk & creamer', 8], ['Spoons', 6]]),
        Q('Name a thing people fight over in the office.', [['The thermostat', 30], ['Parking spots', 22], ['Meeting rooms', 17], ['Credit for work', 14], ['The good chair', 10], ['Fridge space', 7]]),
        Q('Name a buzzword you hear in every corporate presentation.', [['Synergy', 29], ['Pivot', 20], ['Alignment', 17], ['Bandwidth', 14], ['Circle back', 12], ['Deep dive', 8]]),
        Q('Name something people bring to a job interview.', [['Resume', 34], ['Nerves', 22], ['Portfolio', 15], ['Water bottle', 11], ['Notepad & pen', 10], ['References', 8]]),
      ],
    },
    {
      name: 'Board 2 · Money & Business',
      questions: [
        Q('Name something people budget for every month.', [['Rent / mortgage', 30], ['Groceries', 25], ['Utilities', 16], ['Transportation', 12], ['Subscriptions', 10], ['Eating out', 7]]),
        Q('Name a famous billionaire.', [['Elon Musk', 30], ['Jeff Bezos', 25], ['Bill Gates', 20], ['Warren Buffett', 12], ['Mark Zuckerberg', 8], ['Oprah', 5]]),
        Q('Name a company you recognize by its logo alone.', [['McDonald’s', 28], ['Nike', 24], ['Apple', 20], ['Starbucks', 12], ['Coca-Cola', 9], ['Amazon', 7]]),
        Q('Name something a company cuts when money is tight.', [['Staff', 29], ['Travel', 22], ['Free perks & snacks', 18], ['Marketing budget', 14], ['Holiday party', 10], ['Training', 7]]),
        Q('Name a way people pay for things besides cash.', [['Credit card', 31], ['Phone / tap to pay', 26], ['Debit card', 19], ['Online transfer', 12], ['Check', 7], ['Gift card', 5]]),
        Q('Name something people invest in.', [['Stocks', 31], ['Real estate', 26], ['Retirement fund / 401k', 17], ['Crypto', 12], ['Gold', 8], ['Their education', 6]]),
        Q('Name a business that’s open 24 hours.', [['Gas station', 28], ['Convenience store', 23], ['Pharmacy', 17], ['Diner', 14], ['Gym', 11], ['Airport', 7]]),
        Q('Name something that gets more expensive every year.', [['Housing / rent', 28], ['Groceries', 24], ['Insurance', 17], ['College tuition', 13], ['Concert tickets', 11], ['Streaming services', 7]]),
        Q('Name a job where people earn commission.', [['Real estate agent', 31], ['Car salesperson', 26], ['Insurance agent', 16], ['Recruiter', 12], ['Financial advisor', 9], ['Retail sales', 6]]),
        Q('Name something a CEO does all day (according to employees).', [['Meetings', 33], ['Emails', 22], ['Travel', 15], ['Golf', 12], ['Give speeches', 11], ['Make decisions', 7]]),
      ],
    },
    {
      name: 'Board 3 · Around the World',
      questions: [
        Q('Name a country famous for its food.', [['Italy', 30], ['Mexico', 22], ['Japan', 18], ['France', 14], ['Thailand', 9], ['India', 7]]),
        Q('Name a landmark everyone wants a photo with.', [['Eiffel Tower', 30], ['Statue of Liberty', 22], ['Big Ben', 15], ['Great Wall of China', 13], ['Colosseum', 11], ['Taj Mahal', 9]]),
        Q('Name a country where they drive on the left.', [['United Kingdom', 33], ['Japan', 24], ['Australia', 19], ['India', 12], ['Ireland', 7], ['South Africa', 5]]),
        Q('Name a language spoken by more than 100 million people.', [['English', 27], ['Mandarin', 24], ['Spanish', 19], ['Hindi', 13], ['Arabic', 9], ['Portuguese', 8]]),
        Q('Name something you must have to travel internationally.', [['Passport', 38], ['Money', 20], ['Plane ticket', 16], ['Visa', 12], ['Luggage', 8], ['Power adapter', 6]]),
        Q('Name a city that never seems to sleep.', [['New York', 32], ['Las Vegas', 26], ['Tokyo', 16], ['London', 11], ['Miami', 8], ['Bangkok', 7]]),
        Q('Name a country in the G7.', [['United States', 26], ['Japan', 19], ['Germany', 17], ['United Kingdom', 14], ['France', 12], ['Canada', 12]]),
        Q('Name something that’s different when you travel abroad.', [['Language', 28], ['Currency', 24], ['Food', 18], ['Power outlets', 12], ['Driving side', 10], ['Time zone', 8]]),
        Q('Name a famous canal or strait.', [['Panama Canal', 33], ['Suez Canal', 27], ['Strait of Gibraltar', 15], ['Bosphorus', 10], ['English Channel', 9], ['Bering Strait', 6]]),
        Q('Name a country with a red-and-white flag.', [['Canada', 30], ['Japan', 24], ['Switzerland', 18], ['Poland', 11], ['Denmark', 9], ['Turkey', 8]]),
      ],
    },
    {
      name: 'Board 4 · Science & Tech',
      questions: [
        Q('Name an app people check before getting out of bed.', [['Messages / texts', 27], ['Email', 23], ['Instagram', 18], ['News', 12], ['Weather', 11], ['TikTok', 9]]),
        Q('Name a famous scientist — living or dead.', [['Einstein', 33], ['Newton', 21], ['Marie Curie', 16], ['Stephen Hawking', 12], ['Darwin', 10], ['Tesla', 8]]),
        Q('Name something in your house that connects to Wi-Fi.', [['Phone', 26], ['TV', 23], ['Laptop', 18], ['Smart speaker', 13], ['Thermostat', 10], ['Doorbell camera', 10]]),
        Q('Name a unit of measurement used in science.', [['Meter', 26], ['Kilogram', 22], ['Liter', 17], ['Second', 13], ['Degree / Kelvin', 12], ['Mole', 10]]),
        Q('Name something that was "the future" 20 years ago and is normal now.', [['Video calls', 28], ['Electric cars', 23], ['Smartphones', 19], ['Voice assistants', 12], ['Streaming', 10], ['Robot vacuums', 8]]),
        Q('Name a planet other than Earth people can actually name.', [['Mars', 28], ['Jupiter', 21], ['Saturn', 18], ['Venus', 13], ['Mercury', 10], ['Neptune', 10]]),
        Q('Name a password mistake everyone makes.', [['Reusing the same one', 32], ['Using "123456"', 24], ['Pet’s name', 16], ['Their birthday', 12], ['Sticky note on monitor', 10], ['Never changing it', 6]]),
        Q('Name something your smartphone replaced.', [['Camera', 26], ['Alarm clock', 21], ['Maps / GPS unit', 18], ['Calculator', 13], ['MP3 player', 12], ['Flashlight', 10]]),
        Q('Name a metal everyone has heard of.', [['Gold', 28], ['Iron', 22], ['Silver', 19], ['Copper', 13], ['Aluminum', 11], ['Titanium', 7]]),
        Q('Name a reason the IT department gets a call.', [['Forgot password', 34], ['Computer won’t start', 22], ['Printer problems', 18], ['Wi-Fi is down', 13], ['Email issues', 8], ['Blue screen', 5]]),
      ],
    },
    {
      name: 'Board 5 · Culture & Leisure',
      questions: [
        Q('Name a movie franchise with more than five films.', [['Star Wars', 26], ['Marvel / Avengers', 24], ['Fast & Furious', 18], ['Harry Potter', 14], ['James Bond', 11], ['Mission: Impossible', 7]]),
        Q('Name a board game that ruins friendships.', [['Monopoly', 40], ['Risk', 19], ['Uno', 15], ['Catan', 12], ['Chess', 8], ['Scrabble', 6]]),
        Q('Name a sport watched by billions worldwide.', [['Soccer / football', 34], ['Cricket', 20], ['Basketball', 16], ['Tennis', 12], ['Formula 1', 10], ['The Olympics', 8]]),
        Q('Name a musician known by just one name.', [['Beyoncé', 26], ['Madonna', 21], ['Adele', 18], ['Prince', 14], ['Rihanna', 12], ['Drake', 9]]),
        Q('Name something people collect.', [['Coins', 25], ['Stamps', 20], ['Sneakers', 17], ['Vinyl records', 15], ['Trading cards', 13], ['Art', 10]]),
        Q('Name a book almost everyone was assigned in school.', [['To Kill a Mockingbird', 28], ['Romeo & Juliet', 23], ['The Great Gatsby', 19], ['1984', 13], ['Of Mice and Men', 10], ['Lord of the Flies', 7]]),
        Q('Name something people do on a long flight.', [['Sleep', 30], ['Watch movies', 26], ['Read', 16], ['Listen to music', 12], ['Eat', 9], ['Work', 7]]),
        Q('Name a hobby people pick up and quickly abandon.', [['Gym / working out', 28], ['Learning a language', 22], ['Playing guitar', 18], ['Knitting', 12], ['Journaling', 11], ['Sourdough baking', 9]]),
        Q('Name a TV show everyone has seen at least one episode of.', [['Friends', 28], ['The Office', 25], ['Game of Thrones', 16], ['Seinfeld', 12], ['The Simpsons', 11], ['Stranger Things', 8]]),
        Q('Name something found at every wedding.', [['Cake', 28], ['Dancing', 23], ['Flowers', 17], ['Toasts & speeches', 13], ['Open bar', 12], ['Awkward relatives', 7]]),
      ],
    },
  ];


  /* ============ FUN JEOPARDY BOARDS (10) — corporate comedy edition ============ */

  const FUN_BANKS = [
    {
      name: 'Fun 1 · Meetings That Could’ve Been Emails',
      categories: [
        C('MEETING BINGO', [
          mc(100, 'The first five minutes of every video call are dedicated to this ritual.', ['“Can everyone hear me?”', 'Reviewing the agenda', 'Silent meditation', 'Introductions'], 0),
          mc(200, 'A “hard stop at 3:00” scientifically means the meeting ends at this time.', ['2:55', '3:00 sharp', '3:20-ish', 'Sunset'], 2),
          mc(300, '“Let’s take this offline” is corporate for this.', ['We will never speak of it again', 'Meet at the printer', 'Switch to fax', 'Go outside'], 0),
          mc(400, 'The universally understood signal that a meeting is finally over.', ['Someone says “Welp…” and slaps their knees', 'The fire alarm', 'Polite applause', 'The lights dim'], 0, true),
          mc(500, 'Researchers agree the ideal number of meeting attendees is this.', ['Two', 'About five', 'Fifteen', 'Everyone, plus their managers, plus a consultant'], 1),
        ]),
        C('REPLY-ALL DISASTERS', [
          mc(100, 'The single most dangerous button in corporate life.', ['Reply All', 'Caps Lock', 'Print', 'Delete'], 0),
          mc(200, '“Per my last email” politely translates to this.', ['“As I already told you…”', '“I admire your work”', '“Please call me”', '“New information!”'], 0),
          mc(300, 'A “gentle reminder” is actually this.', ['A threat in business casual', 'A compliment', 'A calendar invite', 'Junk mail'], 0),
          mc(400, 'By an unbreakable law of nature, the attachment you mentioned is this.', ['Not attached', 'Corrupted', 'A cat photo', 'In Comic Sans'], 0),
          mc(500, 'Signing an angry email with “Best,” means this.', ['Nothing here is best. Nothing.', 'Warm wishes', 'You lost the argument', 'Truce'], 0),
        ]),
        C('CALENDAR TETRIS', [
          mc(100, 'The meeting slot no one will ever accept.', ['Tuesday 10 am', 'Friday at 4:30 pm', 'Wednesday noon', 'Monday 11 am'], 1),
          mc(200, 'When you’re double-booked, the professional move is this.', ['Attend neither and hope', 'Split-screen both', 'Send a cardboard cutout', 'All of these have been attempted'], 3),
          mc(300, 'A 30-minute meeting that “might run a few minutes over” will last this long.', ['The full hour, minimum', '31 minutes', '29 minutes', 'Three days'], 0),
          mc(400, 'Blocking your calendar as “Focus Time” guarantees this.', ['Someone books over it immediately', 'Deep focus', 'Respect', 'A nap'], 0),
          mc(500, 'The rarest event in corporate history.', ['A meeting that ends early', 'Free parking', 'A quiet Monday', 'Extra budget'], 0, true),
        ]),
        C('BUZZWORD TRANSLATOR', [
          mc(100, '“Synergy” means this.', ['Working together, but fancier', 'A yoga pose', 'An energy drink', 'New software'], 0),
          mc(200, '“Let’s circle back” means the topic will return at this time.', ['Never', 'Tomorrow at 9', 'After lunch', 'Q4'], 0),
          mc(300, 'When someone “doesn’t have the bandwidth,” they lack this.', ['Time and will to live', 'Internet speed', 'Upper-body strength', 'A laptop'], 0),
          mc(400, '“Low-hanging fruit” refers to this.', ['The easy wins', 'The snack bowl', 'The intern’s tasks', 'Casual Friday'], 0),
          mc(500, '“Let’s not boil the ocean” is a warning against this.', ['Doing far too much at once', 'Overcooking seafood', 'Long lunches', 'Hot takes'], 0),
        ]),
        C('EMOJI AT WORK', [
          mc(100, 'A bare thumbs-up 👍 from your boss means this.', ['Approved', 'Seen and ignored', 'Passive aggression', 'Science cannot say'], 3),
          mc(200, 'Ending a chat message with a period reads as this.', ['Deadly serious.', 'Cheerful', 'Formal poetry', 'A typo'], 0),
          mc(300, 'The 🙂 emoji in a work chat secretly signals this.', ['“I am smiling through the pain”', 'Genuine joy', 'Lunchtime', 'Approval'], 0),
          mc(400, 'Reacting 👀 to a company announcement means this.', ['“This is about to get interesting”', '“I need glasses”', '“Look left”', '“Approved”'], 0),
          mc(500, 'The only universally safe emoji to send your CEO.', ['👍', '😘', '💃', '🫠'], 0),
        ]),
      ],
      final: {
        category: 'MEETING MATH', type: 'mc',
        q: 'An hour-long meeting with 8 attendees consumes this many total work-hours.',
        choices: ['One', 'Four', 'Eight', 'Zero — meetings aren’t work'], answer: 2,
      },
    },
    {
      name: 'Fun 2 · Office Survival Skills',
      categories: [
        C('COFFEE SCIENCE', [
          mc(100, 'The office coffee pot exists permanently in this state.', ['Empty, with three ceremonial drops left', 'Full and fresh', 'Sparkling clean', 'Missing'], 0),
          mc(200, 'Drinking decaf at the office is widely considered this.', ['A prank', 'A lifestyle', 'Brave', 'All of the above'], 3),
          mc(300, 'The correct time to brew a new pot is whenever this happens.', ['Someone ELSE does it', '9 am', 'The moon is full', 'HR says so'], 0),
          mc(400, 'Scientifically speaking, cold brew is just this.', ['Patient coffee', 'Iced tea', 'Diluted espresso', 'Bean soup'], 0),
          mc(500, 'The fifth coffee of the day is officially classified as this.', ['A personality trait', 'Hydration', 'Lunch', 'A cry for help'], 3, true),
        ]),
        C('PRINTER PROBLEMS', [
          mc(100, 'The office printer’s famously unhelpful error message.', ['PC LOAD LETTER', 'Have a nice day', 'Try again Tuesday', 'Out of vibes'], 0),
          mc(200, 'The printer works flawlessly only under this condition.', ['When someone from IT is physically watching it', 'On Mondays', 'When unplugged', 'Never, ever'], 0),
          mc(300, 'The paper jam is always located in this place.', ['A tray that does not exist', 'Tray 1', 'The ceiling', 'Your imagination'], 0),
          mc(400, 'Printing a single page requires this many attempts.', ['Three, minimum', 'One', 'Two, exactly', 'A sacrifice'], 0),
          mc(500, 'The office printer’s true cosmic purpose.', ['Testing human patience', 'Printing', 'Scanning', 'Warmth'], 0),
        ]),
        C('SNACK ECONOMICS', [
          mc(100, '“Free food in the kitchen!” — its expected survival time.', ['About four minutes', 'A full day', 'A week', 'Until 5 pm'], 0),
          mc(200, 'The last donut in the box is protected only by this force.', ['Collective guilt', 'Plastic wrap', 'HR policy', 'Gravity'], 0),
          mc(300, 'A clearly labeled lunch in the shared fridge is this.', ['Still not safe', 'Legally protected', 'Sacred', 'Invisible'], 0),
          mc(400, 'Birthday cake in the break room reliably triggers this.', ['A polite stampede', 'A meeting', 'A song', 'Silence'], 0),
          mc(500, 'The vending machine’s signature move.', ['Leaving your chips dangling on the spiral', 'Free snacks', 'Making change', 'Playing music'], 0, true),
        ]),
        C('DESK LIFE', [
          mc(100, 'The office chair everyone secretly covets.', ['The good one from the empty desk', 'A beanbag', 'A throne', 'Literally any chair'], 0),
          mc(200, 'A standing desk gets used for standing during this period.', ['The first week only', 'Forever', 'Never', 'Performance reviews'], 0),
          mc(300, 'Every desk contains one of these.', ['A junk drawer of mystery cables', 'A snack vault', 'Nothing', 'A secret passage'], 0),
          mc(400, 'Office desk plants survive exclusively on this.', ['Neglect and fluorescent light', 'Daily watering', 'Sunlight', 'Encouragement'], 0),
          mc(500, 'Out of the twelve pens on your desk, this many actually write.', ['One — and it’s someone else’s', 'All twelve', 'Six', 'Zero'], 0),
        ]),
        C('THERMOSTAT WARS', [
          mc(100, 'The office temperature is comfortable for exactly this many people.', ['Zero', 'Everyone', 'Half the office', 'Only Greg'], 0),
          mc(200, 'The identity of who controls the thermostat is this.', ['A mystery, like Bigfoot', 'Posted on the wall', 'The CEO', 'You'], 0),
          mc(300, 'Surviving summer office air conditioning requires this.', ['A winter coat at your desk', 'Sunscreen', 'Shorts', 'Hydration'], 0),
          mc(400, 'In most offices, the wall thermostat is actually this.', ['A decoy connected to nothing', 'Precise', 'Voice-activated', 'Haunted'], 0),
          mc(500, 'The scientifically perfect office temperature.', ['A myth', '72°F', '68°F', 'Whatever Greg wants'], 0),
        ]),
      ],
      final: {
        category: 'UNWRITTEN OFFICE LAW', type: 'mc',
        q: 'By sacred tradition, whoever takes the last cup of coffee must do this.',
        choices: ['Brew the next pot', 'Confess to HR', 'Buy everyone donuts', 'Flee the building'], answer: 0,
      },
    },
    {
      name: 'Fun 3 · Corporate Buzzword Bingo',
      categories: [
        C('LINKEDIN POETRY', [
          mc(100, '“I’m humbled to announce…” actually means this.', ['“I’m extremely proud and telling everyone”', '“I feel shy”', '“I lost a bet”', '“I’m resigning”'], 0),
          mc(200, 'A “thought leader” is this.', ['Someone with opinions and Wi-Fi', 'A licensed profession', 'A mind reader', 'A team captain'], 0),
          mc(300, 'The word “journey” on LinkedIn describes this.', ['Literally any sequence of events', 'Actual travel', 'A cruise', 'A promotion'], 0),
          mc(400, '“Open to work” but make it mysterious:', ['“Exploring new opportunities”', '“Unemployed”', '“On sabbatical”', '“Freelancing”'], 0),
          mc(500, 'The correct number of rocket-ship emojis in a funding announcement.', ['There is no upper limit', 'One', 'Zero', 'Three'], 0),
        ]),
        C('STARTUP SPEAK', [
          mc(100, 'When a startup completely changes its business, it’s called this.', ['A pivot', 'A panic', 'A relaunch', 'A whoopsie'], 0),
          mc(200, 'A “unicorn” is a startup worth this.', ['$1 billion', 'One good idea', '$1 million', 'Whatever investors feel'], 0),
          mc(300, 'Every startup claims to be doing this to its industry.', ['Disrupting it', 'Politely improving it', 'Observing it', 'Avoiding it'], 0),
          mc(400, '“Burn rate” measures how fast a startup does this.', ['Spends money', 'Ships features', 'Loses founders', 'Makes coffee'], 0),
          mc(500, 'MVP in startup land stands for this.', ['Minimum Viable Product', 'Most Valuable Player', 'Maximum Venture Potential', 'My Very Prototype'], 0, true),
        ]),
        C('MOTIVATIONAL POSTER WISDOM', [
          mc(100, 'The poster with the cat says “Hang in ____.”', ['There', 'Loose', 'Ten', 'Style'], 0),
          mc(200, '“There is no I in TEAM,” but there is this.', ['A “me,” if you rearrange it', 'A trophy', 'An E and an A', 'Free pizza'], 0),
          mc(300, 'Every motivational poster requires this backdrop.', ['An eagle, a summit, or a sunset', 'A spreadsheet', 'An office', 'Rain'], 0),
          mc(400, '“The only bad workout is the one…”', ['You didn’t do', 'Before lunch', 'On leg day', 'In jeans'], 0),
          mc(500, '“Teamwork makes the ____ work.”', ['Dream', 'Team', 'Scheme', 'Steam'], 0),
        ]),
        C('ACRONYM CHAOS', [
          mc(100, 'EOD officially means “end of day” — which is actually this time.', ['11:59 pm in the sender’s imagination', '5 pm sharp', 'Noon', '3 am'], 0),
          mc(200, 'OOO stands for this.', ['Out Of Office', 'Oh, Okay, Obviously', 'Out On Orders', 'Officially Offline'], 0),
          mc(300, 'TL;DR means this.', ['Too long; didn’t read', 'Total loss; deep regret', 'Try later; door’s locked', 'Team lead; direct report'], 0),
          mc(400, 'ASAP technically means “as soon as possible,” which everyone reads as this.', ['RIGHT NOW', 'Whenever', 'By Friday', 'Next sprint'], 0),
          mc(500, 'FYI at the start of an email means this.', ['“No action needed — but you should worry”', 'For your inspiration', 'Fix your inbox', 'Reply immediately'], 0),
        ]),
        C('CONSULTANT TO ENGLISH', [
          mc(100, '“Leverage” is consultant for this simple word.', ['Use', 'Lift', 'Borrow', 'Sell'], 0),
          mc(200, 'A “deep dive” is this.', ['Reading about something for more than five minutes', 'Scuba certification', 'A pool party', 'An audit'], 0),
          mc(300, 'A “deck” is consultant for this.', ['A slideshow', 'A boat part', 'A patio', 'A card game'], 0),
          mc(400, '“Value-add” describes this.', ['Anything, if you say it confidently', 'Basic math', 'A tax', 'Free shipping'], 0),
          mc(500, '“Let’s socialize this idea” means this.', ['Tell people until they stop objecting', 'Throw a party', 'Post it online', 'Vote on it'], 0, true),
        ]),
      ],
      final: {
        category: 'THE ULTIMATE BUZZWORD', type: 'mc',
        q: 'Complete the legendary corporate sentence: “Let’s leverage our synergies to move the ____.”',
        choices: ['Needle', 'Office', 'Goalposts', 'Printer'], answer: 0,
      },
    },
    {
      name: 'Fun 4 · Working From Home',
      categories: [
        C('PAJAMA PROFESSIONAL', [
          mc(100, 'The official WFH uniform.', ['Business on top, pajamas below', 'A full suit', 'Athleisure head to toe', 'A bathrobe'], 0),
          mc(200, '“Camera-ready” at home means this.', ['Brushed hair, visible half only', 'Full makeup and lighting rig', 'A tie', 'Standing up'], 0),
          mc(300, 'Hard pants are worn at home on this occasion.', ['In-person meetings only', 'Daily', 'Never', 'Laundry day'], 0),
          mc(400, 'The blazer hanging on your chair exists for this.', ['Emergency video calls', 'Decoration', 'Warmth', 'Good posture'], 0),
          mc(500, 'Slippers at the home office are this.', ['Mandatory equipment', 'Unprofessional', 'A safety hazard', 'Tax deductible'], 0),
        ]),
        C('PETS & OTHER COWORKERS', [
          mc(100, 'The cat’s favorite place during your video call.', ['Directly on the keyboard', 'Another room', 'Its bed', 'The window'], 0),
          mc(200, 'The dog barks at this precise moment.', ['The exact second you unmute', 'Never', 'Lunchtime', 'After the call'], 0, true),
          mc(300, 'A toddler entering the frame mid-call is now considered this.', ['A beloved tradition', 'A fireable offense', 'Rare', 'A distraction'], 0),
          mc(400, 'Your pet’s official job title.', ['Chief Morale Officer', 'Intern', 'Security', 'Unemployed'], 0),
          mc(500, 'The doorbell + delivery + dog combo happens during this.', ['Your most important presentation', 'Lunch', 'A quiet afternoon', 'Fridays only'], 0),
        ]),
        C('WI-FI ROULETTE', [
          mc(100, '“You’re frozen” means your Wi-Fi chose this moment to die.', ['Mid-sentence, mid-blink', 'After the call', 'Overnight', 'Never'], 0),
          mc(200, 'The universal Wi-Fi fix.', ['Turning the router off and on', 'Yelling', 'A new provider', 'Moving houses'], 0),
          mc(300, 'The strongest Wi-Fi signal in any home is located here.', ['Directly next to the router, standing awkwardly', 'The office', 'The couch', 'Everywhere'], 0),
          mc(400, '“Can you repeat that? You cut out” is sometimes used for this.', ['Buying time to think', 'Actual audio issues', 'Politeness', 'All three, strategically'], 3),
          mc(500, 'When the video freezes, your face is always doing this.', ['Something deeply unflattering', 'Smiling nicely', 'Nothing', 'Blinking'], 0),
        ]),
        C('THE HOME OFFICE', [
          mc(100, 'The most common home office location.', ['The kitchen table', 'A dedicated study', 'A soundproof pod', 'The garage'], 0),
          mc(200, 'The ergonomic setup of a laptop on the couch is rated this.', ['A chiropractor’s business plan', 'Excellent', 'Adequate', 'Award-winning'], 0),
          mc(300, 'Your video background bookshelf is arranged for this.', ['Looking smart on camera', 'Reading', 'Alphabetization', 'Dust collection'], 0),
          mc(400, 'The commute from bed to desk measures this.', ['Twelve steps, eight seconds', 'One hour', 'Half a mile', 'Two flights'], 0),
          mc(500, 'The ring light was purchased for this.', ['One meeting, used once, worth it', 'Daily use', 'Photography', 'Reading'], 0),
        ]),
        C('GLITCHES & EXCUSES', [
          mc(100, 'The 2020s catchphrase heard in every call.', ['“You’re on mute”', '“Good morning”', '“Nice weather”', '“Let’s begin”'], 0),
          mc(200, '“Sorry, I was on mute” sometimes means this.', ['“I wasn’t ready and needed a second”', 'The mic broke', 'Nothing', 'The cat did it'], 0),
          mc(300, '“My calendar didn’t show this meeting” translates to this.', ['It absolutely did', 'A sync error', 'A time-zone issue', 'New phone'], 0),
          mc(400, 'The virtual background glitch famously turns you into this.', ['A floating head with no ears', 'A potato', 'A ghost', 'All of these, gloriously'], 3, true),
          mc(500, '“I think there’s a delay” is announced after this.', ['Two people talk over each other for the fourth time', 'Silence', 'The meeting ends', 'A joke lands'], 0),
        ]),
      ],
      final: {
        category: 'REMOTE LEGENDS', type: 'mc',
        q: 'In 2021 a Texas lawyer made history by telling a judge this on Zoom.',
        choices: ['“I am not a cat”', '“You’re on mute”', '“My dog ate the evidence”', '“Objection, bad Wi-Fi”'], answer: 0,
      },
    },
    {
      name: 'Fun 5 · The Office Party',
      categories: [
        C('HOLIDAY PARTY HALL OF FAME', [
          mc(100, 'The office holiday party photo everyone regrets involves this.', ['The photo booth props', 'The salad bar', 'The parking lot', 'Name tags'], 0),
          mc(200, 'The person who says “I’m only staying 20 minutes” leaves at this time.', ['Last, after helping stack chairs', '20 minutes exactly', 'Before it starts', 'Midnight'], 0),
          mc(300, 'The ugly-sweater contest is always won by this person.', ['Someone who bought theirs at full price', 'The intern', 'The CEO', 'A knitting expert'], 0),
          mc(400, 'The DJ at every office party plays this exactly once.', ['The Cha Cha Slide', 'Opera', 'Silence', 'A podcast'], 0),
          mc(500, 'The office party’s most dangerous phrase.', ['“The CEO is doing karaoke next”', '“Food’s here”', '“Speeches first”', '“One more hour”'], 0),
        ]),
        C('KARAOKE COURAGE', [
          mc(100, 'The song that instantly summons a group scream-along.', ['“Don’t Stop Believin’”', 'A lullaby', 'Jazz odyssey', 'The national anthem'], 0),
          mc(200, '“Bohemian Rhapsody” at karaoke is this.', ['A six-minute commitment everyone regrets by minute two', 'Always flawless', 'A duet', 'Short'], 0, true),
          mc(300, 'The coworker who “doesn’t sing” does this by song three.', ['Takes the mic and never returns it', 'Leaves', 'Sleeps', 'Judges silently'], 0),
          mc(400, 'The air guitar solo appears during this song.', ['“Sweet Child O’ Mine”', 'A ballad', 'Classical', 'Anything by Adele'], 0),
          mc(500, 'Karaoke scoring machines rate performances based on this.', ['Chaos, apparently', 'Pitch accuracy', 'Volume', 'Fashion'], 0),
        ]),
        C('POTLUCK POLITICS', [
          mc(100, 'The store-bought item presented as homemade.', ['Cookies still in the tray', 'A casserole', 'Punch', 'Napkins'], 0),
          mc(200, 'The potluck signup sheet fills up first with this.', ['Chips and drinks', 'Main dishes', 'Homemade desserts', 'Salads'], 0),
          mc(300, 'The mystery crockpot dish is identified by this method.', ['Bravery', 'The label', 'Asking', 'Science'], 0),
          mc(400, 'The coworker who signs up for “plates” has contributed this.', ['The bare legal minimum', 'Generously', 'Elegance', 'Leadership'], 0),
          mc(500, 'The one dish that vanishes first at every potluck.', ['The mac and cheese', 'The salad', 'The bread', 'The fruit tray'], 0),
        ]),
        C('HAPPY HOUR HISTORY', [
          mc(100, '“Just one drink” at happy hour lasts until this time.', ['Closing', 'One drink', '6 pm', '5:15'], 0),
          mc(200, 'The topic everyone promises not to discuss at happy hour.', ['Work — discussed within 90 seconds', 'Sports', 'Weather', 'Pets'], 0),
          mc(300, 'The boss offering to buy a round causes this.', ['Sudden universal thirst', 'Polite refusal', 'Applause', 'Confusion'], 0),
          mc(400, 'Happy hour “apps for the table” means this many mozzarella sticks per person.', ['0.7', 'Five', 'Twelve', 'Unlimited'], 0),
          mc(500, 'The Monday-after rule of happy hour stories.', ['What happened at happy hour stays there', 'Full recap emails', 'Slideshows', 'A podcast'], 0, true),
        ]),
        C('TEAM-BUILDING CLASSICS', [
          mc(100, 'The trust fall tests trust and also this.', ['Reflexes and friendships', 'Gravity', 'Insurance', 'Balance'], 0),
          mc(200, 'Escape rooms reveal this about your team.', ['Who panics and who takes charge', 'Nothing', 'Puzzle skills', 'Who reads instructions'], 0),
          mc(300, 'The three-legged race is a metaphor for this.', ['Cross-functional collaboration', 'Fitness', 'Speed', 'HR liability'], 0),
          mc(400, 'The scavenger hunt team that wins always includes this person.', ['The hyper-competitive one who ran', 'The CEO', 'An intern', 'A skeptic'], 0),
          mc(500, 'The best team-building activity, according to every survey ever.', ['Game shows, obviously', 'Trust falls', 'Long lectures', 'More meetings'], 0),
        ]),
      ],
      final: {
        category: 'PARTY PHYSICS', type: 'mc',
        q: 'The office party officially becomes legendary the moment this happens.',
        choices: ['The quiet one from accounting hits the dance floor', 'The food runs out', 'The lights come on', 'Someone leaves early'], answer: 0,
      },
    },
    {
      name: 'Fun 6 · Pop Culture Punch Clock',
      categories: [
        C('THE OFFICE (U.S.)', [
          mc(100, 'Dunder Mifflin sells this thrilling product.', ['Paper', 'Beets', 'Staplers', 'Insurance'], 0),
          mc(200, 'The branch everyone works at is in this Pennsylvania city.', ['Scranton', 'Philadelphia', 'Pittsburgh', 'Utica'], 0),
          mc(300, 'Jim famously encased Dwight’s stapler in this.', ['Jell-O', 'Concrete', 'Ice', 'A vending machine'], 0),
          mc(400, 'Michael Scott’s beloved catchphrase.', ['“That’s what she said”', '“You’re fired”', '“Bears. Beets.”', '“I’m the boss”'], 0),
          mc(500, 'Dwight’s farm grows this crop.', ['Beets', 'Corn', 'Paper trees', 'Mushrooms'], 0, true),
        ]),
        C('WORK MOVIES', [
          mc(100, 'In “Office Space,” the red object of obsession is this.', ['A stapler', 'A tie', 'A mug', 'A chair'], 0),
          mc(200, 'Dolly Parton, Jane Fonda and Lily Tomlin star in this workplace classic.', ['9 to 5', 'Working Girl', 'Big', 'Baby Boom'], 0),
          mc(300, '“The Devil Wears Prada” is set at this kind of company.', ['A fashion magazine', 'A law firm', 'A bank', 'A startup'], 0),
          mc(400, '“The Wolf of Wall Street” chronicles excess in this industry.', ['Stock trading', 'Publishing', 'Tech', 'Real estate'], 0),
          mc(500, 'In “Monsters, Inc.” the factory’s original power source is this.', ['Children’s screams', 'Laughter', 'Coffee', 'Solar'], 0),
        ]),
        C('TV BOSSES', [
          mc(100, 'The “World’s Best Boss” mug belongs to this manager.', ['Michael Scott', 'Leslie Knope', 'Mr. Burns', 'Jack Donaghy'], 0),
          mc(200, 'Miranda Priestly terrifies assistants in this film.', ['The Devil Wears Prada', 'Legally Blonde', 'Clueless', 'Morning Glory'], 0),
          mc(300, 'The nuclear plant owner who says “Excellent…” while steepling his fingers.', ['Mr. Burns', 'Homer', 'Ned Flanders', 'Moe'], 0),
          mc(400, 'Parks and Rec’s waffle-loving overachiever.', ['Leslie Knope', 'April Ludgate', 'Ann Perkins', 'Donna Meagle'], 0),
          mc(500, 'The Roy family fights over this media empire on “Succession.”', ['Waystar Royco', 'Initech', 'Hooli', 'Pied Piper'], 0),
        ]),
        C('SONGS ABOUT WORK', [
          mc(100, 'Dolly Parton’s anthem about office hours.', ['“9 to 5”', '“Jolene”', '“Overtime”', '“Coat of Many Colors”'], 0),
          mc(200, '“Takin’ Care of Business” was recorded by this band.', ['Bachman-Turner Overdrive', 'AC/DC', 'Queen', 'The Eagles'], 0),
          mc(300, 'Loverboy is “Working for the ____.”', ['Weekend', 'Money', 'Man', 'Raise'], 0),
          mc(400, 'Rihanna’s hit that repeats this word about ten times per chorus.', ['“Work”', '“Money”', '“Shine”', '“Boss”'], 0, true),
          mc(500, 'Donna Summer “works hard for” this.', ['The money', 'The weekend', 'Respect', 'The team'], 0),
        ]),
        C('MEME HISTORY', [
          mc(100, 'The cartoon dog sipping coffee in a burning room says this.', ['“This is fine”', '“Help”', '“TGIF”', '“Sync up”'], 0),
          mc(200, 'The “Distracted Boyfriend” meme features this many people.', ['Three', 'Two', 'Four', 'One'], 0),
          mc(300, 'Success Kid is celebrating with this gesture.', ['A fist pump', 'A thumbs up', 'A salute', 'Jazz hands'], 0),
          mc(400, 'The Galaxy-Brain meme escalates through stages of this.', ['Increasingly absurd enlightenment', 'Anger', 'Sleep', 'Wealth'], 0),
          mc(500, 'Grumpy Cat’s legal first name.', ['Tardar Sauce', 'Whiskers', 'Karen', 'Mittens'], 0),
        ]),
      ],
      final: {
        category: 'PRINTER JUSTICE', type: 'mc',
        q: 'In “Office Space,” the team takes this machine to a field for a legendary beatdown.',
        choices: ['The printer', 'The copier', 'A laptop', 'The fax machine'], answer: 0,
      },
    },
    {
      name: 'Fun 7 · Money, Perks & Paychecks',
      categories: [
        C('PAYDAY SCIENCE', [
          mc(100, 'Payday money feels infinite for exactly this long.', ['48 hours', 'A month', 'An hour', 'Two weeks'], 0),
          mc(200, 'The order of operations on payday.', ['Bills, groceries, one questionable treat', 'Savings only', 'Vacation first', 'Panic'], 0),
          mc(300, '“Treat yourself” purchases are justified by this logic.', ['“I work hard”', 'Math', 'A budget', 'Coupons'], 0),
          mc(400, 'The day before payday, lunch becomes this.', ['Whatever is in the pantry', 'Steak', 'Delivery', 'A buffet'], 0),
          mc(500, 'Direct deposit hitting at 12:01 am causes this.', ['A tiny 3 am shopping spree', 'Sleep', 'Nothing', 'Savings'], 0),
        ]),
        C('EXPENSE REPORT DRAMA', [
          mc(100, 'The receipt you need most is always this.', ['Missing', 'Filed neatly', 'Laminated', 'Emailed'], 0),
          mc(200, 'A $12.03 expense gets rejected because of this.', ['A missing itemized receipt', 'Generosity', 'Taxes', 'Rounding'], 0),
          mc(300, '“Client entertainment” on an expense report usually means this.', ['Dinner and awkward small talk', 'A yacht', 'Movies', 'Golf, always golf'], 0),
          mc(400, 'The corporate card’s most feared phrase.', ['“Declined”', '“Approved”', '“Chip read error”', '“Cash only”'], 0, true),
          mc(500, 'Expense reports are submitted at this frequency.', ['The night before the deadline, in a panic', 'Daily', 'Weekly, calmly', 'Never'], 0),
        ]),
        C('PERKS & BENEFITS', [
          mc(100, 'The office perk that actually matters most.', ['Good coffee', 'Ping-pong tables', 'Beanbags', 'A slide'], 0),
          mc(200, '“Unlimited PTO” often results in this.', ['People taking less vacation', 'Endless beach photos', 'Chaos', 'More vacation'], 0),
          mc(300, 'The gym membership benefit gets used this often.', ['January, then never', 'Daily', 'Weekends', 'Twice a day'], 0),
          mc(400, '“Casual Friday” pushes the dress code to this level.', ['Jeans, worn responsibly', 'Pajamas', 'Costumes', 'Swimwear'], 0),
          mc(500, 'The true purpose of the office ping-pong table.', ['Holding boxes and old monitors', 'Tournaments', 'Exercise', 'Recruiting photos'], 0),
        ]),
        C('SIDE HUSTLE NATION', [
          mc(100, 'Every side hustle begins with this phrase.', ['“I could totally sell these”', '“I quit”', '“Loan me $5k”', '“Trust me”'], 0),
          mc(200, 'The most common first side hustle.', ['Selling stuff online', 'Opening a bank', 'Mining gold', 'Consulting'], 0),
          mc(300, 'A podcast side hustle requires this many microphones before episode one.', ['Two very expensive ones', 'Zero', 'One', 'A studio'], 0),
          mc(400, 'The sourdough starter side hustle peaked in this year.', ['2020', '1999', '2015', '2023'], 0),
          mc(500, 'The Etsy shop’s first and only customer is this person.', ['Your mom', 'A stranger', 'A celebrity', 'Your boss'], 0),
        ]),
        C('RETIREMENT DREAMS', [
          mc(100, 'The universal retirement fantasy.', ['A beach with zero emails', 'More meetings', 'A second job', 'Commuting'], 0),
          mc(200, 'A 401(k) match is essentially this.', ['Free money — take it', 'A scam', 'A lottery', 'Optional'], 0),
          mc(300, 'The retirement countdown clock starts at this age.', ['The first bad Monday', '64', '30', '50'], 0),
          mc(400, '“I’ll retire early” plans are usually revised after this.', ['Checking the actual math', 'A promotion', 'Lunch', 'A nap'], 0, true),
          mc(500, 'Retired coworkers return to visit and always say this.', ['“I’ve never been busier!”', '“I miss the meetings”', '“Rehire me”', '“What’s new?”'], 0),
        ]),
      ],
      final: {
        category: 'COMPOUND INTEREST', type: 'mc',
        q: 'Einstein allegedly called this "the eighth wonder of the world."',
        choices: ['Compound interest', 'The printer', 'Free lunch', 'The stock market'], answer: 0,
      },
    },
    {
      name: 'Fun 8 · HR Would Like a Word',
      categories: [
        C('DRESS CODE DECODED', [
          mc(100, '“Business casual” means this.', ['Nobody knows, and never will', 'Suits', 'Swimwear', 'Uniforms'], 0),
          mc(200, '“Smart casual” adds this to business casual.', ['Confusion', 'A blazer', 'Sneakers', 'A hat'], 0),
          mc(300, 'Flip-flops at the office trigger this.', ['An all-staff email about footwear', 'Applause', 'A raise', 'Nothing'], 0),
          mc(400, 'The “dress for the job you want” loophole leads to this.', ['Someone in a cape', 'Promotions', 'Suits', 'Better meetings'], 0),
          mc(500, '“Festive attire” on an invitation means this.', ['Panic-shopping at 6 pm', 'A tux', 'Jeans', 'Sequins mandatory'], 0),
        ]),
        C('ICEBREAKER HORRORS', [
          mc(100, 'The icebreaker everyone claims to hate but secretly prepares for.', ['Two truths and a lie', 'Handshakes', 'Rock paper scissors', 'Bingo'], 0),
          mc(200, '“Tell us a fun fact about yourself” causes this.', ['Instant memory loss of your entire life', 'Joy', 'Applause', 'Networking'], 0, true),
          mc(300, 'The “what animal would you be” question is secretly this.', ['A personality test with no right answer', 'Zoology', 'A trap', 'Fun'], 0),
          mc(400, 'The human-bingo icebreaker requires finding someone who has done this.', ['“Traveled to three continents”', 'Filed taxes', 'Slept', 'Eaten lunch'], 0),
          mc(500, 'The correct maximum length for icebreakers.', ['Seven minutes, and not one second more', 'Two hours', 'A full day', 'Unlimited'], 0),
        ]),
        C('PERFORMANCE REVIEW BINGO', [
          mc(100, '“Meets expectations” secretly means this.', ['You did your job — congrats', 'Failure', 'Promotion incoming', 'Legend status'], 0),
          mc(200, '“Areas for growth” is HR for this.', ['The stuff you’re bad at', 'A garden', 'Opportunity', 'Nothing'], 0),
          mc(300, 'Self-evaluations require rating yourself, which everyone finds this.', ['Excruciating', 'Easy', 'Fun', 'Fast'], 0),
          mc(400, '“Takes initiative” on a review means this.', ['Did things without being asked twice', 'Arrives early', 'Asks questions', 'Sends memes'], 0),
          mc(500, 'The review phrase “exceeds expectations” unlocks this.', ['A slightly larger pizza party', 'A yacht', 'Stock options', 'Fame'], 0),
        ]),
        C('MANDATORY FUN', [
          mc(100, 'The phrase “mandatory fun” is officially this.', ['A contradiction', 'Motivating', 'Legal', 'Rare'], 0),
          mc(200, 'The team offsite agenda always includes this.', ['“Alignment” and trust exercises', 'Napping', 'Free time', 'Skydiving'], 0),
          mc(300, 'Wearing the company t-shirt to the company picnic is this.', ['Strongly encouraged', 'Banned', 'Optional, truly', 'A crime'], 0),
          mc(400, 'The office birthday celebration requires this song performance.', ['An awkward, off-key “Happy Birthday”', 'Opera', 'A rap', 'Silence'], 0),
          mc(500, 'The company summer picnic is scheduled on this day.', ['The hottest day recorded that year', 'A cool day', 'A weekend', 'A holiday'], 0, true),
        ]),
        C('THE FINE PRINT', [
          mc(100, 'The employee handbook is read by this many employees.', ['Approximately zero', 'Everyone', 'Half', 'Managers only'], 0),
          mc(200, '“Other duties as assigned” in a job description means this.', ['Literally anything can happen', 'Nothing extra', 'Overtime', 'Travel'], 0),
          mc(300, 'The onboarding videos are watched at this speed.', ['Muted, at 2x, while doing other things', '1x with notes', 'Twice', 'In a group'], 0),
          mc(400, 'Compliance training deadlines inspire this.', ['A company-wide last-minute sprint', 'Early completion', 'Joy', 'Reflection'], 0),
          mc(500, '“Per company policy” is the corporate version of this.', ['“Because I said so”', '“Please”', '“Good luck”', '“We checked”'], 0),
        ]),
      ],
      final: {
        category: 'HR CLASSICS', type: 'mc',
        q: 'The phrase HR uses when a coworker has mysteriously vanished from the org chart.',
        choices: ['“They’ve left to pursue other opportunities”', '“They were abducted”', '“No comment”', '“Ask IT”'], answer: 0,
      },
    },
    {
      name: 'Fun 9 · IT Has Entered the Chat',
      categories: [
        C('PASSWORD PURGATORY', [
          mc(100, 'The world’s most common password is famously this.', ['123456', 'password2024', 'letmein', 'qwerty'], 0),
          mc(200, '“Your password must contain…” ends with this.', ['A hieroglyph and a blood oath', 'Six letters', 'Your name', 'A smile'], 0),
          mc(300, 'The password you can never remember protects this.', ['The account you need RIGHT now', 'Nothing', 'Old email', 'A game'], 0),
          mc(400, 'Changing your password every 90 days results in this.', ['The same password plus a number', 'Security', 'Peace', 'Memory growth'], 0, true),
          mc(500, 'The sticky note under the keyboard contains this.', ['Every password you own', 'A grocery list', 'Nothing', 'A doodle'], 0),
        ]),
        C('HAVE YOU TRIED RESTARTING?', [
          mc(100, 'IT’s first question, every single time.', ['“Have you tried turning it off and on?”', '“What’s your name?”', '“Is it plugged in?”', '“Why?”'], 0),
          mc(200, 'The fix works this often.', ['A humiliating 90% of the time', 'Never', 'Half the time', 'Only Tuesdays'], 0),
          mc(300, 'The computer that misbehaved all morning does this when IT arrives.', ['Works perfectly', 'Explodes', 'Updates', 'Nothing'], 0),
          mc(400, 'The IT ticket marked “urgent” is resolved in this timeframe.', ['3–5 business weeks', 'Minutes', 'Same day', 'One hour'], 0),
          mc(500, '“It’s probably a caching issue” is IT for this.', ['“I have no idea yet”', 'A real diagnosis', '“You broke it”', '“Easy fix”'], 0),
        ]),
        C('ANCIENT TECHNOLOGY', [
          mc(100, 'The save icon in every app depicts this fossil.', ['A floppy disk', 'A vault', 'A cloud', 'A book'], 0),
          mc(200, 'Dial-up internet greeted users with this.', ['Screeching robot sounds', 'Music', 'Silence', 'A voice'], 0),
          mc(300, 'The fax machine survives exclusively in these industries.', ['Medicine and law', 'Gaming', 'Fashion', 'Food'], 0),
          mc(400, 'Rewinding a VHS tape before returning it was this.', ['Common courtesy', 'Optional', 'Illegal', 'Impossible'], 0),
          mc(500, 'The Y2K bug threatened computers because years were stored with this many digits.', ['Two', 'Four', 'One', 'Ten'], 0, true),
        ]),
        C('UPDATE O’CLOCK', [
          mc(100, 'Windows updates begin at this moment.', ['The start of your presentation', 'Midnight', 'Weekends', 'When convenient'], 0),
          mc(200, '“Remind me tomorrow” has been clicked this many times.', ['847 and counting', 'Once', 'Never', 'Twice'], 0),
          mc(300, '“Update and restart” takes this long.', ['Between 2 minutes and 4 hours — no way to know', '30 seconds', 'Exactly 10 minutes', 'A week'], 0),
          mc(400, 'The progress bar hits 99% and then does this.', ['Lives there permanently', 'Finishes', 'Reverses', 'Sings'], 0),
          mc(500, 'After the update, this setting has mysteriously changed.', ['All of them', 'None', 'The wallpaper', 'The clock'], 0),
        ]),
        C('HELP DESK HEROES', [
          mc(100, 'The help desk’s unofficial motto.', ['“Did you submit a ticket?”', '“We fix everything”', '“Call anytime”', '“No questions”'], 0),
          mc(200, 'Describing your issue as “it’s broken” gives IT this much to work with.', ['Nothing. Absolutely nothing.', 'Plenty', 'A full report', 'Coordinates'], 0),
          mc(300, 'The monitor “not working” is usually caused by this.', ['It’s not turned on', 'A virus', 'Hackers', 'Weather'], 0),
          mc(400, 'IT’s reaction to “I clicked the link in the weird email.”', ['A deep, haunted sigh', 'Joy', 'A high five', 'Promotion'], 0),
          mc(500, 'The cable IT needs is always in this location.', ['A bin of 400 identical cables', 'Labeled neatly', 'The store', 'On the desk'], 0),
        ]),
      ],
      final: {
        category: 'TECH SUPPORT WISDOM', type: 'mc',
        q: 'The IT classic: 90% of "computer problems" exist between the keyboard and this.',
        choices: ['The chair', 'The mouse', 'The monitor', 'The router'], answer: 0,
      },
    },
    {
      name: 'Fun 10 · Mondays, Fridays & In Between',
      categories: [
        C('MONDAY MOOD', [
          mc(100, 'The first phrase spoken at every Monday meeting.', ['“How was everyone’s weekend?”', '“Let’s begin”', '“Good news!”', '“Quiz time”'], 0),
          mc(200, 'The Monday alarm snooze count.', ['Three, minimum', 'Zero', 'One', 'Two'], 0),
          mc(300, '“Sunday scaries” describes this.', ['Pre-Monday dread starting around 4 pm Sunday', 'A horror movie', 'A cereal', 'Sunday sports'], 0),
          mc(400, 'The Monday coffee order compared to Friday’s.', ['A size larger with an extra shot', 'The same', 'Smaller', 'Decaf'], 0),
          mc(500, 'Garfield the cat built an entire brand on hating this.', ['Mondays', 'Lasagna', 'Naps', 'Dogs'], 0, true),
        ]),
        C('THE COMMUTE', [
          mc(100, 'The lane you switch into immediately does this.', ['Stops moving forever', 'Speeds up', 'Disappears', 'Merges'], 0),
          mc(200, '“Leaving 10 minutes earlier” to beat traffic results in this.', ['The same arrival time, mysteriously', 'Arriving early', 'A parade', 'Less stress'], 0),
          mc(300, 'The train is delayed on this specific day.', ['The day of your big presentation', 'Never', 'Weekends', 'Holidays'], 0),
          mc(400, 'The podcast queue for the commute contains this many unplayed episodes.', ['214', 'Three', 'Zero', 'Ten'], 0),
          mc(500, 'The parking spot situation at 9:02 am.', ['The far lot, obviously', 'Front row', 'Valet', 'Empty'], 0),
        ]),
        C('LUNCH HOUR', [
          mc(100, 'The daily noon conversation.', ['“What should we get for lunch?” (40 minutes, no decision)', 'Stock tips', 'Sports', 'Silence'], 0),
          mc(200, '“Sad desk lunch” consists of this.', ['Leftovers eaten while answering email', 'A picnic', 'Sushi', 'A feast'], 0),
          mc(300, 'Microwaving fish in the office kitchen is this.', ['An act of war', 'Fine', 'Encouraged', 'Healthy'], 0, true),
          mc(400, 'The lunch “hour” actually lasts this long.', ['22 minutes', 'An hour', '90 minutes', 'All afternoon'], 0),
          mc(500, 'The coworker who “isn’t hungry” does this to your fries.', ['Eats half of them', 'Nothing', 'Photographs them', 'Salts them'], 0),
        ]),
        C('FRIDAY FEELING', [
          mc(100, 'Work productivity on Friday at 3 pm.', ['Scientifically zero', 'Peak', 'Average', 'Rising'], 0),
          mc(200, '“Quick question” on a Friday afternoon is actually this.', ['A three-hour project in disguise', 'Quick', 'A compliment', 'Rhetorical'], 0),
          mc(300, 'The Friday afternoon email that ruins weekends begins with this.', ['“Before you head out…”', '“Congrats!”', '“FYI”', '“Happy Friday!”'], 0),
          mc(400, '“TGIF” officially stands for this.', ['Thank Goodness It’s Friday', 'The Grind Is Forever', 'Two Grande Iced Frappes', 'Time To Go, It’s Friday'], 0),
          mc(500, 'Friday’s calendar should legally contain this many meetings.', ['Zero', 'Five', 'Two', 'One, at 4:30'], 0),
        ]),
        C('OUT OF OFFICE', [
          mc(100, 'The perfect out-of-office reply includes this.', ['A hint of smugness', 'Apologies', 'Your location', 'A poem'], 0),
          mc(200, 'Checking email on vacation is this.', ['Forbidden — and done by everyone anyway', 'Required', 'Impossible', 'Relaxing'], 0),
          mc(300, 'The first day back from vacation features this inbox count.', ['A number that causes physical pain', 'Zero', 'Ten', 'Manageable'], 0),
          mc(400, 'The vacation responder’s bold promise: “I will respond when I return” means this.', ['Some emails will never be answered — and that’s okay', 'Instant replies', 'A phone call', 'A newsletter'], 0),
          mc(500, 'The souvenir brought back for the team.', ['Airport chocolates purchased at the gate', 'Handmade gifts', 'Nothing', 'Postcards'], 0, true),
        ]),
      ],
      final: {
        category: 'THE WORK WEEK', type: 'mc',
        q: 'Complete the office proverb: “Nothing good has ever come from a meeting scheduled at this time.”',
        choices: ['Friday, 4:30 pm', 'Tuesday, 10 am', 'Wednesday noon', 'Thursday, 2 pm'], answer: 0,
      },
    },
  ];

  const clone = (o) => JSON.parse(JSON.stringify(o));

  // 15 Jeopardy boards (5 classic + 10 fun) and 5 Feud boards.
  window.FF_BANKS = { jeop: JEOP_BANKS.concat(FUN_BANKS), feud: FEUD_BANKS };

  // The active boards default to board 1 of each bank. Fast Money questions
  // and Wheel puzzles come from the base library above and stay as-is.
  window.FF_DEFAULT_QUESTIONS.main = clone(FEUD_BANKS[0].questions);
  window.FF_DEFAULT_QUESTIONS.jeopardy = clone({ categories: JEOP_BANKS[0].categories, final: JEOP_BANKS[0].final });
})();
