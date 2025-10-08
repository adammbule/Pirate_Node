import mongoose from "mongoose";
import User from "../models/user.js";

// --- CHARACTER POOLS ---
const characters = {
  harryPotter: [
    "harry", "hermione", "ron", "draco", "snape", "voldemort",
    "dumbledore", "hagrid", "sirius", "luna", "bellatrix"
  ],
  starWars: [
    "vader", "luke", "leia", "yoda", "obiwan", "anakin", "palpatine",
    "kylo", "rey", "maul", "r2d2"
  ],
  got: [
    "jon", "daenerys", "arya", "tyrion", "cersei", "jaime",
    "sansa", "bran", "theon", "melisandre", "hound"
  ],
  marvel: [
    "stark", "rogers", "thor", "banner", "natasha", "tchalla",
    "peter", "wanda", "strange", "thanos", "loki"
  ],
  dc: [
    "batman", "superman", "wonderwoman", "flash", "aquaman",
    "joker", "harley", "bane", "cyborg", "riddler"
  ],
  breakingBad: [
    "walter", "jesse", "saul", "gus", "hank", "skyler",
    "mike", "todd", "tuco", "lalo"
  ],
  avatar: [
    "aang", "katara", "zuko", "toph", "sokka",
    "neytiri", "jake", "quaritch", "eywa"
  ],
  lotr: [
    "frodo", "sam", "gandalf", "aragorn", "legolas", "gimli",
    "sauron", "boromir", "elrond", "galadriel"
  ]
};

// --- LOCATION / DORM POOLS ---
const locations = [
  "gryffindor", "slytherin", "ravenclaw", "hufflepuff",
  "tatooine", "naboo", "hoth", "coruscant",
  "winterfell", "kingslanding", "valyria",
  "asgard", "wakanda", "xandar", "gotham", "metropolis",
  "albuquerque", "pandora", "baSingSe", "shire", "mordor", "rivendell"
];

// --- RANDOM HELPERS ---
const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];
const randomYear = () => Math.floor(Math.random() * (2025 - 1899 + 1)) + 1899;

// --- USERNAME BUILDER ---
const generateUsername = () => {
  const allCharacters = Object.values(characters).flat();
  const char = randomItem(allCharacters);
  const loc = randomItem(locations);
  const year = randomYear();
  return `${char}_${loc}_${year}`;
};

// --- CHECK DB FOR UNIQUENESS ---
async function generateUniqueUsernames(count = 5) {
  const uniqueUsernames = new Set();

  while (uniqueUsernames.size < count) {
    const candidate = generateUsername();
    const exists = await User.findOne({ username: candidate });
    if (!exists) uniqueUsernames.add(candidate);
  }

  return Array.from(uniqueUsernames);
}

// --- EXPORT FUNCTION ---
export async function suggestUsernames(req, res) {
  try {
    const suggestions = await generateUniqueUsernames(5);
    res.json({ success: true, suggestions });
  } catch (err) {
    console.error("Error generating usernames:", err);
    res.status(500).json({ success: false, error: "Failed to generate usernames" });
  }
}

export default { suggestUsernames };