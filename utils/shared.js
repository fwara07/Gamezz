/* ====================================================================
   SECTION: Shared Methods
==================================================================== */

export function populateStats(player, resilience, exhaustion, defense) {
  // Create the unordered list element container
  const statsList = document.createElement("ul");
  // add the classname bullets so that my styling affects it
  statsList.classList.add("bullets");
  // Create the resilience list element
  let resilienceStat = document.createElement("li");
  // change the text to be what we want
  resilienceStat.textContent = `Resilience: ${resilience}`;
  player.setAttribute("resilience", resilience);
  // Create the exaustion list element
  let exhaustionStat = document.createElement("li");
  // change the text to be what we want
  exhaustionStat.textContent = `Exhaustion: ${exhaustion}`;
  player.setAttribute("exhaustion", exhaustion);
  // Create the defense list element
  let defenseStat = document.createElement("li");
  // change the text to be what we want
  defenseStat.textContent = `Defense: ${defense}`;
  player.setAttribute("defense", defense);

  // Add all the stats bullet to the unordered list element we created
  statsList.appendChild(resilienceStat);
  statsList.appendChild(exhaustionStat);
  statsList.appendChild(defenseStat);
  // appends the stats list to the player element
  player.appendChild(statsList);
}

// storage key for the player
export const PLAYER_STORAGE_KEY = "absmonopoly_player";