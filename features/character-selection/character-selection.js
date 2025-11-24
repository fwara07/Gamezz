import { PLAYER_ONE, PLAYER_TWO } from "../../constants/player.js";
import { fetchCharacters } from "../../services/character-api.js";
import { strongestToWeakest } from "../../utils/character-sorters.js";
import { populateStats, PLAYER_STORAGE_KEY } from "../../utils/shared.js";
/* ====================================================================
   SECTION: Player Selection
==================================================================== */
/// CONSTANTS
const MIN_AGE = 16;
// stats
const RESILIENCE_VALUES = [1.1, 1.2, 1.3, 1.4, 1.5, 1.6];
const EXAUSTION_VALUES = [0.6, 0.7, 0.8, 0.9, 1, 1.1];
const DEFENSE_VALUES = [2, 3, 4, 5, 6];
// error msg into object after feedback
const ERROR_MESSAGES = {
  NO_PLAYER_CHOSEN: "A player must be chosen",
  NO_GUEST_NAME: "A guest name is required",
  NO_AGE: "Guest age must be chosen",
  MIN_AGE: `Guest age must be ${MIN_AGE} or over`,
  NO_IMAGE: "A guest image must be chosen",
  NO_RESILIENCE: "A guest resilience stat must be chosen",
  NO_EXHAUSTION: "A guest exhaustion stat must be chosen",
  NO_DEFENSE: "A guest defense stat must be chosen",
};

// Get all players
let players = document.querySelectorAll(".player");

/// CONSTANTS
// Get the form
const form = document.querySelector("#fighterForm");
// Error element to show error
const errorElement = document.querySelector("#formErrors");

// Guest input elements
const guestName = document.querySelector("#guestName");
const guestAge = document.querySelector("#guestAge");
const guestImg = document.querySelector("#guestImage");
const guestResilience = document.querySelector("#resilience");
const guestExhaustion = document.querySelector("#exhaustion");
const guestDefense = document.querySelector("#defense");

/// VARIABLES
let sortedPlayers = [];

/// METHODS

// Create a player object for each character from the api
function renderCharacter(player) {
  const playerTemplate = document.createElement("div");
  playerTemplate.innerHTML = `
    <div class="player" role="button" tabindex="0" data-player="${player.id}">
      <div class="avatar-tile"><img class="avatar" src="${player.imageSource}" alt="${player.name}"></div>
      <div class="divider"></div>
      <div class="name">${player.name}</div>
      <div class="stats-title">STATS</div>
    </div>
  `;
  // add the stats
  populateStats(
    playerTemplate,
    player.stats.resilience,
    player.stats.exhaustion,
    player.stats.defense
  );
  // return the element
  return playerTemplate;
}

// fetch and sort the playerrs
async function addAdditionalPlayers() {
  const fetchedPlayers = await fetchCharacters();
  if (fetchedPlayers) {
    console.log(fetchedPlayers);
    sortedPlayers = fetchedPlayers.sort(strongestToWeakest);
    // add every player to the areana
    $("#arena").append(sortedPlayers.map(renderCharacter));
  } else {
    // we know there is an error with fetching so display error message
    $("#arena").html("<p>Couldn’t load characters.</p>");
  }
}

// add them
addAdditionalPlayers();
console.log(players);

// Select the player
function selectPlayer(element) {
  // Deselect all players
  document.querySelectorAll(".player").forEach((player) => {
    // remove the class that the css is selected for
    player.classList.remove("is-selected");
  });
  // Add is selected to the element that we want
  element.classList.add("is-selected");
}

function createOption(text, value = "") {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = text;
  return option;
}

// Create the an option with a specific value and
function addOption(input, value) {
  const option = createOption(value, value);
  input.appendChild(option);
}

function prePopulatePlayers() {
  console.log(players);
  players.forEach((player) => {
    const dataPlayer = player.getAttribute("data-player");
    console.log(dataPlayer);
    // Since the only thing that changes is the player object, we can store
    // it once and use that player object instead of the repeating all the code
    // for each player
    let playerObj;
    if (dataPlayer == "p1") {
      // player 1
      playerObj = PLAYER_ONE;
    } else if (dataPlayer == "p2") {
      // player 2
      playerObj = PLAYER_TWO;
    }
    // only for p1 or p2
    if (playerObj) {
      // Check for the name element only within the player element
      const playerName = player.querySelector(".name");
      // change the text content to be the name
      playerName.textContent = playerObj.name;
      // Get the player's image
      const playerImg = player.querySelector(".avatar");
      // set the player's src
      playerImg.src = playerObj.imageSource;

      // Add the list of stats to the player
      populateStats(
        player,
        playerObj.stats.resilience,
        playerObj.stats.exhaustion,
        playerObj.stats.defense
      );
    }
  });
}

function prePopulateGuestStatsOptions() {
  // Resilience options
  const resilienceSelectInput = document.querySelector("#resilience");
  // Exaustion options
  const exhaustionSelectInput = document.querySelector("#exhaustion");
  // Defense options
  const defenseSelectInput = document.querySelector("#defense");

  // Add the instruction option to each select
  exhaustionSelectInput.appendChild(createOption("Select Exhaustion"));
  resilienceSelectInput.appendChild(createOption("Select Resilience"));
  defenseSelectInput.appendChild(createOption("Select Defense"));

  // Go through resilience values
  RESILIENCE_VALUES.forEach((value) => {
    addOption(resilienceSelectInput, value);
  });

  // Go through exaustion values
  EXAUSTION_VALUES.forEach((value) => {
    addOption(exhaustionSelectInput, value);
  });

  // Go through defense values
  DEFENSE_VALUES.forEach((value) => {
    addOption(defenseSelectInput, value);
  });
}

function setError(hideError, errorMsg) {
  // set the text to be the error message
  errorElement.textContent = errorMsg;
  // Make the element visible
  errorElement.hidden = hideError;
}

function validateAndSubmit(e) {
  // remove any previous errors
  setError(true, "");
  // get the first player with .is-selected in case someone added .is selected
  // to 2 elements at the same time
  const trueChosenPlayer = document.querySelector(".is-selected");
  // If we have a chosen player
  if (trueChosenPlayer) {
    console.log(trueChosenPlayer);
    const dataPlayer = trueChosenPlayer.getAttribute("data-player");
    console.log(dataPlayer);

    // get the player's info

    if (dataPlayer == "p1" || dataPlayer == "p2") {
      // get the player info from the object
      const basePlayer = dataPlayer === "p1" ? PLAYER_ONE : PLAYER_TWO;
      // save the new player object to localstorage
      localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(basePlayer));
    } else if (dataPlayer == "guest") {
      console.log("HERE");
      // make sure guest name is not null
      if (guestName.value == "") {
        e.preventDefault();
        setError(false, ERROR_MESSAGES.NO_GUEST_NAME);
      } else if (!localStorage.getItem("playerImg")) {
        e.preventDefault();
        setError(false, ERROR_MESSAGES.NO_IMAGE);
      } else if (guestAge.value < MIN_AGE) {
        // make sure age is smaller than min age
        e.preventDefault();
        setError(false, ERROR_MESSAGES.MIN_AGE);
      } else if (guestResilience.value == "") {
        // make sure resilience is not empty
        e.preventDefault();
        setError(false, ERROR_MESSAGES.NO_RESILIENCE);
      } else if (guestExhaustion.value == "") {
        // make sure exhaustion is not empty
        e.preventDefault();
        setError(false, ERROR_MESSAGES.NO_EXHAUSTION);
      } else if (guestDefense.value == "") {
        // make sure defense is not empty
        e.preventDefault();
        setError(false, ERROR_MESSAGES.NO_DEFENSE);
      } else {
        const playerToSave = {
          name: guestName.value,
          imageSource: localStorage.getItem("playerImg"), // set by FileReader
          stats: {
            resilience: parseFloat(guestResilience.value),
            exhaustion: parseFloat(guestExhaustion.value),
            defense: parseFloat(guestDefense.value),
          },
        };
        // save the new player object to localstorage
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(playerToSave));
      }
    } else {
      let additionalPlayer = sortedPlayers.find(
        (player) => player.id == dataPlayer
      );
      if (additionalPlayer) {
        localStorage.setItem(
          PLAYER_STORAGE_KEY,
          JSON.stringify(additionalPlayer)
        );
      } else {
        e.preventDefault();
        setError(false, ERROR_MESSAGES.NO_PLAYER_CHOSEN);
      }
    }
  } else {
    // ERROR
    // So that it does not do the form action
    e.preventDefault();
    // Show error
    setError(false, ERROR_MESSAGES.NO_PLAYER_CHOSEN);
  }
}

// if we are on player-selection.html then we clear the local storage
// so that previous player info does not persist
localStorage.clear();
// Code specific to player-selection.html
// populate information
prePopulatePlayers();
prePopulateGuestStatsOptions();

/// Listeners
// Store guest image as Data URL in localStorage when uploaded immediately
guestImg.addEventListener("change", function (e) {
  const file = e.target.files && e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      localStorage.setItem("playerImg", event.target.result);
    };
    reader.readAsDataURL(file);
  }
});

// For every player in the arena add an event listener
document.querySelector("#arena").addEventListener("click", (e) => {
  const playerEl = e.target.closest(".player");
  if (!playerEl) return;
  selectPlayer(playerEl);
});
form.addEventListener("submit", validateAndSubmit);
