import { INSULT_MESSAGES } from "../constants/game-logic.js";

function getHardcodedInsult() {
  const randomIndex = Math.floor(Math.random() * INSULT_MESSAGES.length);
  return INSULT_MESSAGES[randomIndex];
}

// fetch insults
// even if there is an error the user will always get an insult
export async function fetchInsult(name) {
  return await fetch(
    `https://insult.mattbas.org/api/en/insult.json?who=${name}`
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      // if the api did not work
      if (data.error) {
        // return a random milestone message instead
        return getHardcodedInsult();
      }
      // return the insult
      return data.insult;
    })
    .catch((error) => {
      console.log(error);
      // return a random milestone message instead
      return getHardcodedInsult();
    });
}
