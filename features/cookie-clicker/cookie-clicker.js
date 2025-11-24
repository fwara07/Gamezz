import { PLAYER_ONE, PLAYER_TWO } from '../../constants/player.js';

/// Constants
const BAKE_AMOUNT = 3;
const SMACK_AMOUNT = 5;
const CONSUME_AMOUNT = 5;
const MAX_HEALTH = 100;
const MIN_THRESHOLD_SCORE = 10;
const PLAYER_ONE_SUFFIX = 'p1'
const PLAYER_TWO_SUFFIX = 'p2'

/// Define elements

// Button Elements
// P1: Player 1
// P2: Player 2
const bakeBtnP1 = document.querySelector('#bake-p1')
const bakeBtnP2 = document.querySelector('#bake-p2')
const statsBtnP1 = document.querySelector('#stats-player-1')
const statsBtnP2 = document.querySelector('#stats-player-2')
const smackBtnP1 = document.querySelector('#smack-p1')
const smackBtnP2 = document.querySelector('#smack-p2')
const consumeBtnP1 = document.querySelector('#consume-p1')
const consumeBtnP2 = document.querySelector('#consume-p2')
// Health elements
const scoreCountP1 = document.querySelector('#score-count-p1')
const scoreCountP2 = document.querySelector('#score-count-p2')
// Health Bar
const progressHealthP1 = document.querySelector('#progress-health-p1')
const progressHealthP2 = document.querySelector('#progress-health-p2')

const progressDamageP1 = document.querySelector('#progress-damage-p1')
const progressDamageP2 = document.querySelector('#progress-damage-p2')

// Booleans to keep track of which player lose
let playerOneLost = false;
let playerTwoLost = false

/// Methods
function doesGameEnd() {
    // If the player 1 health is lower than 0 or equal to 0
    if (PLAYER_ONE.totalHealth <= 0) {
        // Player 1 lost
        playerOneLost = true
    }
    // If the player 2 health is lower than 0 or equal to 0
    if (PLAYER_TWO.totalHealth <= 0) {
        // Player 2 lost
        playerTwoLost = true
    }

    // If player 1 score is more than tripple player 2 score
    // AND both player a minimum score so that it doesn't auto lose when we increase 
    // one score and not the other (ex: 0 - 5 where player 2 score is 5 which is tripple
    // but he didn't even start yet) 
    if (PLAYER_ONE.totalScore > PLAYER_TWO.totalScore * 3 && PLAYER_ONE.totalScore > MIN_THRESHOLD_SCORE && PLAYER_TWO.totalScore > MIN_THRESHOLD_SCORE) {
        // Player 2 lost
        playerTwoLost = true
    } 
    // If player 2 score is more than tripple player 1 score
    // AND both player a minimum score
    else if (PLAYER_TWO.totalScore > PLAYER_ONE.totalScore * 3) {
        // Player 1 lost
        playerOneLost = true
    }
}
// Function render to be able to update the health and the progress bar
// after each action
function render() {
    // Update score
    scoreCountP1.textContent = PLAYER_ONE.totalScore
    scoreCountP2.textContent = PLAYER_TWO.totalScore
    // Update health bar
    // Green part which is just the health score
    progressHealthP1.style.width = PLAYER_ONE.totalHealth + "%"
    progressHealthP2.style.width = PLAYER_TWO.totalHealth + "%"
    // Red part which is 100 - whatever the health is
    progressDamageP1.style.width = (MAX_HEALTH - PLAYER_ONE.totalHealth) + "%"
    progressDamageP2.style.width = (MAX_HEALTH - PLAYER_TWO.totalHealth) + "%"
    // After every render check if someone lost
    doesGameEnd()
    // My customer player end which just alers who lost
    if (playerOneLost) {
        alert("PLAYER 1 LOST")
    }
    if (playerTwoLost) {
        alert("PLAYER 2 LOST")
    }
}
function bake(player) {
    // Increase the player's score
    player.updateScore(BAKE_AMOUNT)
    render() // rerender the health bar + content
}
function smack(player) {
    // Decrease the player health
    player.loseHealth(SMACK_AMOUNT)
    render() // rerender the health bar + content
}

function consume(player) {
    // increase health by constant consume amount
    player.gainHealth(CONSUME_AMOUNT)
    // use -1 to decrease the score
    player.updateScore(-1 * CONSUME_AMOUNT)
    render() // rerender the health bar + content
}

function displayStats(player, playerSuffix) {
    // Toggle the hidden container on and off
    const statsContainer = document.querySelector(`#stats-${playerSuffix}`)
    statsContainer.hidden = !statsContainer.hidden
    // Resilience
    const resilienceStat = document.querySelector(`#resilience-${playerSuffix}`)
    resilienceStat.textContent = statsContainer.hidden ? '' : `Resilience: ${player.stats.resilience}`
    // Exhaustion
    const exhaustionStat = document.querySelector(`#exhaustion-${playerSuffix}`)
    exhaustionStat.textContent = statsContainer.hidden ? '' : `Exhaustion: ${player.stats.exhaustion}`
    // Defense
    const defenseStat = document.querySelector(`#defense-${playerSuffix}`)
    defenseStat.textContent = statsContainer.hidden ? '' : `Defense: ${player.stats.defense}`
}

/// Events
// Listen for click bake events
bakeBtnP1.addEventListener('click', () => bake(PLAYER_ONE))
bakeBtnP2.addEventListener('click', () => bake(PLAYER_TWO))
// listen for click stats events
statsBtnP1.addEventListener('click', () => displayStats(PLAYER_ONE, PLAYER_ONE_SUFFIX))
statsBtnP2.addEventListener('click', () => displayStats(PLAYER_TWO, PLAYER_TWO_SUFFIX))
// listen for click smack events
smackBtnP1.addEventListener('click', () => smack(PLAYER_TWO))
smackBtnP2.addEventListener('click', () => smack(PLAYER_ONE))
// listen for click consume events
consumeBtnP1.addEventListener('click', () => consume(PLAYER_ONE))
consumeBtnP2.addEventListener('click', () => consume(PLAYER_TWO))

// Render once when page loads to load the default data
render()