// Sort comparison
export function strongestToWeakest(playerA, playerB) {
  // fovor the stronger one
  return score(playerB) - score(playerA);
}
function score(player) {
  // make sure the stats object is there
  let stats = {}
  if (player.stats) {
    stats = player.stats
  }
  // set the defense to 0 if not there
  let defense = 0
  if (stats.defense) {
    defense = stats.defense
  }
  // set the resilience to 0 if not there
  let resilience = 0
  if (stats.resilience) {
    resilience = stats.resilience
  }
  // set the exhaustion to 0 if not there
  let exhaustion = 0
  if (stats.exhaustion) {
    exhaustion = stats.exhaustion
  }
  // weight to caculate the score
  const defenseWeight = 100;
  const resilienceWeight = 20;
  const exhaustionWeight = 10;
  // Favor higher defense & resilience and lower exhaustion:
  return defense * defenseWeight + resilience * resilienceWeight - exhaustion * exhaustionWeight;
}
