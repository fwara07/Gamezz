import { populateStats, PLAYER_STORAGE_KEY } from "../../utils/shared.js";
/* ====================================================================
   SECTION: Absolute Monopoly Game
==================================================================== */

// Default game state
// Its okay to have magic numbers here since they are constants and it is the only
// place where you can change them and where they are defined
export const DEFAULT_STATE = {
  funds: 25,
  inventory: 0,
  demand: 50, // percent
  price: 1,
  ips: 0, // items per second
  raw: 100,
  factories: 0,
  factoryCost: 50,
  rawCost: 10,
  rawPerPurchase: 100,
  lastTick: Date.now(),
  sellProgress: 0,
};

/// CONSTANTS
const GAME_STATE_KEY = "absmonopoly_game_state";

// Milestone messages
const MILESTONE_MESSAGES = [
  { threshold: 10, message: "Wow, 10 items? Try harder." },
  { threshold: 50, message: "50 items? Not bad, but can you keep up?" },
  { threshold: 100, message: "100 items! You're getting the hang of it." },
  { threshold: 500, message: "500 items? Okay, that's impressive." },
  { threshold: 1000, message: "1000 items! You're a true tycoon." },
  { threshold: 5000, message: "5000 items?! Capitalism would be proud." },
  {
    threshold: 10000,
    message: "10,000 items. You win. Sassy NPC is speechless.",
  },
];
// Minimum items to show as boxes emoji instead of count
const MIN_ITEMS_FOR_BOXES = 50;
// Maximum demand
const MAX_DEMAND = 100;
// for every increase in price by 1, demand drops by 10
const DEMAND_PER_PRICE_INCREASE = 10;
// Cost increase factor for purchasing a new factory
const PURCHASE_FACOTRY_COST_INCREASE = 1.25;
// number of miliseconds in a second
const MS_IN_SECS = 1000;

export function getStoredPlayer() {
  try {
    // try to parse the item from localstorage
    const raw_ls = localStorage.getItem(PLAYER_STORAGE_KEY);
    return raw_ls ? JSON.parse(raw_ls) : null;
  } catch {
    // return null
    return null;
  }
}

const storedPlayer = getStoredPlayer();
console.log(storedPlayer)
// make sure name, image and stats are there
if (
  !storedPlayer ||
  !storedPlayer.name ||
  !storedPlayer.imageSource ||
  !storedPlayer.stats
) {
  window.location.href = "player-selection.html";
}

// Get player info from local storage
const { name, imageSource, stats } = storedPlayer;
// make sure resilience, exhaustion and defense
if (!stats.resilience || !stats.exhaustion || !stats.defense) {
  window.location.href = "player-selection.html";
}
// we can use this since we are 100% sure it exists
const { resilience, exhaustion, defense } = stats;

// Action elements
const fundsElement = document.querySelector("#funds");
const inventoryElement = document.querySelector("#inventory");
const demandElement = document.querySelector("#demand");
const priceMinusElement = document.querySelector(".pill-decrease");
const pricePlusElement = document.querySelector(".pill-increase");
const makeItemBtn = document.querySelector(".btn");
const itemsPerSecondElement = document.querySelector("#ips");
const RemainingRawMaterialElement = document.querySelector("#raw");
const factoryPurchaseLinksElement = document.querySelectorAll(".purchase.mono");
const factoriesElement = document.querySelector("#factories");
const priceValueElement = document.querySelector("#priceValue");
const playerItemsElement = document.querySelector("#playerItems");
const npcBubbleElement = document.querySelector("#npcBubble");

function prePopulateSelectedPlayer() {
  // Get the player name element
  const playerNameElement = document.querySelector("#playerTitle");
  // Set the text content to be the player's name
  playerNameElement.textContent = name;
  // Get the player image element
  const playerImgElement = document.querySelector(".avatar");
  // Set the src to be the player's image
  playerImgElement.src = imageSource;
  // Get the player stats element
  const playerStatsElement = document.querySelector(".playerStats");
  // Add the stats to the player stats element
  populateStats(playerStatsElement, resilience, exhaustion, defense);
}

// Game Logic
let lastMilestone = 0; // default to 0
// get the state from local storage or use default
let state = loadState();

// Load state from localStorage or use default
function loadState() {
  // get the sate from local storage
  const saved = localStorage.getItem(GAME_STATE_KEY);
  // if the state is present (meaning we have played before)
  if (saved) {
    // try to parse the json, if it fails then return the default state
    try {
      // spread operator to copy all properties from DEFAULT_STATE or add other properties
      return { ...DEFAULT_STATE, ...JSON.parse(saved) };
    } catch {
      return { ...DEFAULT_STATE };
    }
  }
  // if no saved state then return the default state
  return { ...DEFAULT_STATE };
}

// Update all UI
function updateUI() {
  // Update all the elements based on the state
  fundsElement.textContent = state.funds.toString();
  inventoryElement.textContent = state.inventory.toString();
  demandElement.textContent = state.demand;
  itemsPerSecondElement.textContent = state.ips;
  RemainingRawMaterialElement.textContent = state.raw;
  factoriesElement.textContent = state.factories;

  if (priceValueElement) {
    // update the price value
    priceValueElement.textContent = `$${state.price}`;
  }
  // Show items visually in player box as box emoji (no pun intended)
  if (playerItemsElement) {
    // Show up to 50 items as box emoji, then show count
    if (state.inventory === 0) {
      playerItemsElement.textContent = "(none)";
    } else if (state.inventory <= MIN_ITEMS_FOR_BOXES) {
      let items = "";
      for (let i = 0; i < state.inventory; i++) {
        items += "📦";
      }
      playerItemsElement.textContent = items;
    } else {
      playerItemsElement.textContent = `📦 x${state.inventory}`;
    }
  }
  // Update purchase links
  if (factoryPurchaseLinksElement[0]) {
    // Purchase raw material
    factoryPurchaseLinksElement[0].textContent = `Purchase ($${state.rawCost})`;
  }
  if (factoryPurchaseLinksElement[1]) {
    // Purchase factory
    factoryPurchaseLinksElement[1].textContent = `Purchase ($${state.factoryCost})`;
  }
}

// Save state to localStorage
function saveState(state) {
  // save state to localstorage
  localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
}

// Check for milestone and update NPC
function checkMilestone() {
  MILESTONE_MESSAGES.forEach((milestone) => {
    // if inventory is more than or equal to the threshold
    // AND last milestone is less than the threshold (higher threshold than last time)
    if (
      state.inventory >= milestone.threshold &&
      lastMilestone < milestone.threshold
    ) {
      // if npcBubbleElement exists
      if (npcBubbleElement) {
        // udapte the npc bubble text content
        npcBubbleElement.textContent = milestone.message;
      }
      // update the last milestone
      lastMilestone = milestone.threshold;
    }
  });
}

// Make one item manually
function makeItem() {
  // Only make item if we have raw material
  if (state.raw > 0) {
    // removes one raw material
    state.raw -= 1;
    // adds an item
    state.inventory += 1;
    // save state and update UI
    saveState(state);
    updateUI();
  }
}

// Adjust price
function changePrice(priceChange) {
  // priceChange is either +1 or -1
  // Ensure price does not go below 1
  state.price = Math.max(1, state.price + priceChange);
  // demand can never be below 0 or above 100
  // the smaller the price the higher the demand
  // eg: if price is 1 then demand is 100
  // if price is 2 then demand is 90
  // if price is 3 then demand is 80
  // for every increase in price by 1, demand drops by 10
  state.demand = Math.max(
    0,
    Math.min(
      MAX_DEMAND,
      MAX_DEMAND - (state.price - 1) * DEMAND_PER_PRICE_INCREASE
    )
  );
  // save state and update UI
  saveState(state);
  updateUI();
}

// Purchase raw material
function purchaseRaw() {
  if (state.funds >= state.rawCost) {
    state.funds -= state.rawCost;
    state.raw += state.rawPerPurchase;
    // save state and update UI
    saveState(state);
    updateUI();
  }
}

// Purchase factory
function purchaseFactory() {
  if (state.funds >= state.factoryCost) {
    state.funds -= state.factoryCost;
    state.factories += 1;
    state.ips = state.factories; // 1 item/sec per factory
    // Increase cost for next factory
    state.factoryCost = Math.round(
      state.factoryCost * PURCHASE_FACOTRY_COST_INCREASE
    );
    // save state and update UI
    saveState(state);
    updateUI();
  }
}

// Sell items based on demand
function sellItems(timePassedInMs) {
  if (state.inventory <= 0 || state.demand <= 0) return;

  // Items-per-second from demand
  const sellPotentialPerSec = state.demand / 100;

  // Build progress over the time slice
  const sellPotential = sellPotentialPerSec * (timePassedInMs / 1000);

  // Accumulate fractional selling progress
  state.sellProgress += sellPotential;

  // Convert whole progress to sales, capped by available inventory
  const toSell = Math.min(state.inventory, Math.floor(state.sellProgress));
  if (toSell > 0) {
    state.inventory -= toSell;
    state.funds += toSell * state.price;
    state.sellProgress -= toSell;
  }
}


// Auto-manufacture items
function autoManufacture(timePassedInMs) {
  // Manufacture items based on items per second (ips) and available raw material
  const itemsToMake = Math.min(
    state.ips * (timePassedInMs / MS_IN_SECS),
    state.raw
  );
  const made = Math.floor(itemsToMake); // only whole items
  // if we made items then update the state
  if (made > 0) {
    state.raw -= made;
    state.inventory += made;
  }
}

// Main game loop
function gameLoop() {
  const now = Date.now();
  // calculate time passed since last tick
  const timePassedInMs = now - state.lastTick;
  state.lastTick = now;
  autoManufacture(timePassedInMs);
  sellItems(timePassedInMs);
  saveState(state);
  updateUI();
  checkMilestone();
  requestAnimationFrame(gameLoop);
}

// Code specific to absolute-monopoly.html
// If any of the values are null then redirect to player selection page
if (!name || !imageSource || !resilience || !exhaustion || !defense) {
  // redirect to player selection page
  window.location.href = "player-selection.html";
}
// populate the selected player info
// name, image, stats
prePopulateSelectedPlayer();

// Event listeners
// Make an item
if (makeItemBtn) {
  makeItemBtn.addEventListener("click", makeItem);
}
// Decrease the price of 1 item
if (priceMinusElement) {
  priceMinusElement.addEventListener("click", () => changePrice(-1));
}
// increase the price of 1 item
if (pricePlusElement) {
  pricePlusElement.addEventListener("click", () => changePrice(1));
}
// Purchase raw material
if (factoryPurchaseLinksElement[0]) {
  factoryPurchaseLinksElement[0].addEventListener("click", function (e) {
    e.preventDefault(); // prevent the default link behavior of going to href
    purchaseRaw();
  });
}
// Purchase factory
if (factoryPurchaseLinksElement[1]) {
  factoryPurchaseLinksElement[1].addEventListener("click", function (e) {
    e.preventDefault(); // prevent the default link behavior of going to href
    purchaseFactory();
  });
}

// Initial UI
updateUI();
// Start game loop
state.lastTick = Date.now();
// Apparently this is standard to make sure that everything runs smoothly
// instead of just running gameLoop() directly
// since we are also keeping track of time passed it is better to use this
// to avoid constantly running gameLoop() in case of lag
requestAnimationFrame(gameLoop);
