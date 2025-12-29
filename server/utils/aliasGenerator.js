const adjectives = [
  "Silent",
  "Funny",
  "Stoic",
  "Radiant",
  "Mystic",
  "Salty",
  "Brave",
  "Chill",
  "Wild",
  "Clever",
  "Clumsy",
  "Eager",
  "Fancy",
  "Jolly",
  "Lazy",
];

const animals = [
  "Panda",
  "Rhino",
  "Owl",
  "Tiger",
  "Rabbit",
  "Fox",
  "Otter",
  "Lion",
  "Wolf",
  "Eagle",
  "Capybara",
  "Koala",
  "Dolphin",
  "Shark",
  "Cat",
];

const generateAlias = () => {
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  return `${randomAdj} ${randomAnimal}`;
};

module.exports = generateAlias;
