import { PLAYER_ONE, PLAYER_TWO } from "../constants/player.js";

// contants
const CHARACTER_LIMIT = 20;
const RESILIENCE_VALUES = [1.1, 1.2, 1.3, 1.4, 1.5, 1.6];
const EXHAUSTION_VALUES = [1.1, 1.0, 0.9, 0.8, 0.7, 0.6];
const DEFENSE_VALUES = [2, 3, 4, 5, 6];
const AVATAR_IMG = "/public/avatar.png";
const DEFAULT_NAME = "Unknown";

// fetch characters
export async function fetchCharacters(limit = CHARACTER_LIMIT) {
  // Make sure the limit is valid
  let batchSize = limit;
  if (batchSize > CHARACTER_LIMIT || batchSize < 0) {
    batchSize = 1;
  }

  return await fetch("https://rickandmortyapi.com/api/character?page=1")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      // Make sure we have a valid results
      let results = [];
      if (data && data.results) {
        results = data.results;
      }
      // Only get the 20 we need
      const sliced = results.slice(0, batchSize);
      let players = [];
      // for player that we get from the api,
      // create a player
      sliced.forEach((element) => {
        players.push(createPlayer(element));
      });
      // return the list of created players
      return players;
    })
    .catch((error) => {
      console.log(error)
      // just return a list of the players I already have
      return [PLAYER_ONE, PLAYER_TWO];
    });
}

function createPlayer(c) {
  const playerId = Number(c.id) || 0;
  // get random resilience
  const resilience =
    RESILIENCE_VALUES[Math.floor(Math.random() * RESILIENCE_VALUES.length)];
  // get random exhaustion
  const exhaustion =
    EXHAUSTION_VALUES[Math.floor(Math.random() * EXHAUSTION_VALUES.length)];
  // get random defense
  const defense =
    DEFENSE_VALUES[Math.floor(Math.random() * DEFENSE_VALUES.length)];
  // get the name and the image
  // or set default
  const name = c.name || DEFAULT_NAME;
  const img = c.image || AVATAR_IMG;

  // same object as my player object
  return {
    name: name,
    id: playerId,
    username: name.toLowerCase(),
    email: name.toLowerCase() + "@randomemailthing.com",
    totalScore: 0,
    totalHealth: 100,
    stats: { resilience: resilience, exhaustion: exhaustion, defense: defense },
    imageSource: img,

    // ---- methods ----
    // update the score
    updateScore(numPoints) {
      // Make sure we don't go below 0
      if (this.totalScore + numPoints <= 0) {
        this.totalHealth = 0;
      } else {
        // As long this won't equal to 0 or go below then add the points
        // We can have an infinite positive number of points but not negative
        this.totalScore += numPoints;
      }
      // return the totalscore
      return this.totalScore;
    },
    // lose health based on a attack amount
    loseHealth(attackAmount) {
      // Calculate the formula before hand
      let loseHealthFormula =
        (attackAmount * this.stats.exhaustion - this.stats.defense) /
        this.stats.resilience;
      // check if the total will be less than or equal to 0
      if (this.totalHealth - loseHealthFormula <= 0) {
        // if so then keep the totalHealth to 0
        this.totalHealth = 0;
      } else {
        // So the formula won't make the health drop in the negative so we can decrease it
        // from total health
        this.totalHealth -= loseHealthFormula;
      }
    },
    // gain health based on a healing amount
    gainHealth(healingAmount) {
      // Calculate the formula before hand
      let gainHealthFormula =
        (healingAmount * this.stats.resilience) / this.stats.exhaustion;
      // check if the total will be more than 100 or equal to 100
      if (this.totalHealth + gainHealthFormula >= 100) {
        // if so then keep the totalHealth at 100
        this.totalHealth = 100;
      } else {
        // So the formula won't make the health go beyond 100 so we increase it
        // from total health
        this.totalHealth += gainHealthFormula;
      }
    },
  };
}
