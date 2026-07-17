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
    categories: [
      {
        name: 'Office Life',
        clues: [
          { q: 'This "brief" gathering famously could have been an email.', type: 'text', answer: 'A meeting', value: 100 },
          { q: 'True or False: The office thermostat pleases everyone.', type: 'tf', answer: false, value: 200 },
          { q: 'Which of these is the universal signal that a meeting is over?', type: 'mc', choices: ['Someone stands up', '"Well…"', 'Laptops close', 'All of the above'], answer: 3, value: 300 },
          { q: 'This kitchen appliance is the #1 suspect in office fish-smell crimes.', type: 'text', answer: 'The microwave', value: 400 },
          { q: 'Which phrase means "I stopped listening five minutes ago"?', type: 'mc', choices: ['"Circle back"', '"Great point"', '"Per my last email"', '"Let\'s take this offline"'], answer: 1, value: 500 },
        ],
      },
      {
        name: 'Pop Culture',
        clues: [
          { q: 'True or False: A group of superhero movies sharing one storyline is called a "cinematic universe."', type: 'tf', answer: true, value: 100 },
          { q: 'Which app is famous for 15-second dance trends?', type: 'mc', choices: ['LinkedIn', 'TikTok', 'Excel', 'Zoom'], answer: 1, value: 200 },
          { q: 'This streaming habit means watching an entire season in one sitting.', type: 'text', answer: 'Binge-watching', value: 300 },
          { q: 'Which of these is NOT a real award show?', type: 'mc', choices: ['The Oscars', 'The Grammys', 'The Streamies', 'The Emmys'], answer: 2, value: 400 },
          { q: 'True or False: The floss started as a dental hygiene technique.', type: 'tf', answer: false, value: 500 },
        ],
      },
      {
        name: 'Food & Drink',
        clues: [
          { q: 'This Italian dish is the most popular delivery food on Earth.', type: 'text', answer: 'Pizza', value: 100 },
          { q: 'True or False: Espresso has more caffeine per cup than drip coffee.', type: 'tf', answer: false, value: 200 },
          { q: 'Which of these is NOT traditionally in guacamole?', type: 'mc', choices: ['Avocado', 'Lime', 'Mayonnaise', 'Cilantro'], answer: 2, value: 300 },
          { q: 'This "boba" drink originated in Taiwan.', type: 'text', answer: 'Bubble tea', value: 400 },
          { q: 'Which country consumes the most coffee per person?', type: 'mc', choices: ['USA', 'Italy', 'Finland', 'Brazil'], answer: 2, value: 500 },
        ],
      },
      {
        name: 'World Facts',
        clues: [
          { q: 'This is the largest ocean on Earth.', type: 'text', answer: 'The Pacific', value: 100 },
          { q: 'True or False: Australia is wider than the Moon.', type: 'tf', answer: true, value: 200 },
          { q: 'Which country has the most people?', type: 'mc', choices: ['China', 'India', 'USA', 'Indonesia'], answer: 1, value: 300 },
          { q: 'This many time zones span Russia.', type: 'mc', choices: ['5', '7', '9', '11'], answer: 3, value: 400 },
          { q: 'True or False: There are more possible chess games than atoms in the observable universe.', type: 'tf', answer: true, value: 500 },
        ],
      },
      {
        name: 'Tech & Gadgets',
        clues: [
          { q: 'This fruit-named company makes the iPhone.', type: 'text', answer: 'Apple', value: 100 },
          { q: 'True or False: "Wi-Fi" is short for "Wireless Fidelity."', type: 'tf', answer: false, value: 200 },
          { q: 'What does "CC" mean on an email?', type: 'mc', choices: ['Carbon copy', 'Courtesy copy', 'Copy confirm', 'Cool colleague'], answer: 0, value: 300 },
          { q: 'This key combo is the universal "undo."', type: 'text', answer: 'Ctrl+Z (Cmd+Z)', value: 400 },
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
};
