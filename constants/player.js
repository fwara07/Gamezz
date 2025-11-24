export const PLAYER_ONE = {
    name: "Player 1",
    id: 1,
    username: "player1",
    email: "player1@gmail.com",
    totalScore: 0,
    totalHealth: 100,
    stats: {
        resilience: 1.5,
        exhaustion: 0.9,
        defense: 3
    },
    imageSource: "https://i5.walmartimages.com/asr/8adcbe36-0982-4221-b820-9b598bd9e4e2.81796cb90a319fdc9c7cb0c5dac4a3e2.jpeg",
    // ---- methods ----
    // update the score
    updateScore(numPoints) {
        // Make sure we don't go below 0
        if (this.totalScore + numPoints <= 0) {
            this.totalHealth = 0
        } else {
            // As long this won't equal to 0 or go below then add the points
            // We can have an infinite positive number of points but not negative
            this.totalScore += numPoints
        }
        // return the totalscore
        return this.totalScore
    },
    // lose health based on a attack amount
    loseHealth(attackAmount) {
        // Calculate the formula before hand
        let loseHealthFormula = (attackAmount * this.stats.exhaustion - this.stats.defense) / this.stats.resilience
        // check if the total will be less than or equal to 0
        if (this.totalHealth - loseHealthFormula <= 0) {
            // if so then keep the totalHealth to 0
            this.totalHealth = 0
        } else {
            // So the formula won't make the health drop in the negative so we can decrease it 
            // from total health
            this.totalHealth -= loseHealthFormula
        }
    },
    // gain health based on a healing amount
    gainHealth(healingAmount) {
        // Calculate the formula before hand
        let gainHealthFormula = (healingAmount * this.stats.resilience) / this.stats.exhaustion
        // check if the total will be more than 100 or equal to 100
        if (this.totalHealth + gainHealthFormula >= 100) {
            // if so then keep the totalHealth at 100
            this.totalHealth = 100
        } else {
            // So the formula won't make the health go beyond 100 so we increase it
            // from total health
            this.totalHealth += gainHealthFormula
        }
    }
}

export const PLAYER_TWO = {
    name: "Player 2",
    id: 2,
    username: "player2",
    email: "player2@gmail.com",
    totalScore: 0,
    totalHealth: 100,
    stats: {
        resilience: 1.5,
        exhaustion: 0.9,
        defense: 3
    },
    imageSource: "https://i5.walmartimages.com/asr/4336ada2-cd1d-461c-8f2e-793ce243d123_1.61088e3ca5b716e89924f3fb12aca826.jpeg",
    // ---- methods ----
    // update the score
    updateScore(numPoints) {
        // Make sure we don't go below 0
        if (this.totalScore + numPoints <= 0) {
            this.totalHealth = 0
        } else {
            // As long this won't equal to 0 or go below then add the points
            // We can have an infinite positive number of points but not negative
            this.totalScore += numPoints
        }
        // return the totalscore
        return this.totalScore
    },
    // lose health based on a attack amount
    loseHealth(attackAmount) {
        // Calculate the formula before hand
        let loseHealthFormula = (attackAmount * this.stats.exhaustion - this.stats.defense) / this.stats.resilience
        // check if the total will be less than or equal to 0
        if (this.totalHealth - loseHealthFormula <= 0) {
            // if so then keep the totalHealth to 0
            this.totalHealth = 0
        } else {
            // So the formula won't make the health drop in the negative so we can decrease it 
            // from total health
            this.totalHealth -= loseHealthFormula
        }
    },
    // gain health based on a healing amount
    gainHealth(healingAmount) {
        // Calculate the formula before hand
        let gainHealthFormula = (healingAmount * this.stats.resilience) / this.stats.exhaustion
        // check if the total will be more than 100 or equal to 100
        if (this.totalHealth + gainHealthFormula >= 100) {
            // if so then keep the totalHealth at 100
            this.totalHealth = 100
        } else {
            // So the formula won't make the health go beyond 100 so we increase it
            // from total health
            this.totalHealth += gainHealthFormula
        }
    }
}