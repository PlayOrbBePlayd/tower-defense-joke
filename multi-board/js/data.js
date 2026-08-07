/* data.js — Game Show Roundup MULTI-BOARD edition.
 * 5 pre-built Jeopardy boards + 5 pre-built Family Feud boards, tuned for
 * corporate crowds (harder than the party set). Everything is editable in
 * the Editor; boards are switched from Host Control.
 */
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

  const clone = (o) => JSON.parse(JSON.stringify(o));

  window.FF_BANKS = { jeop: JEOP_BANKS, feud: FEUD_BANKS };

  // Active-board defaults consumed by store.js — board 1 of each game.
  window.FF_DEFAULT_QUESTIONS = {
    main: clone(FEUD_BANKS[0].questions),
    fast: [],
    jeopardy: clone({ categories: JEOP_BANKS[0].categories, final: JEOP_BANKS[0].final }),
  };
})();
