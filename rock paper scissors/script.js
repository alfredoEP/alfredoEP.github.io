// script.js
const buttons = document.querySelectorAll("#buttons button");
const userScoreSpan = document.getElementById("user-score");
const computerScoreSpan = document.getElementById("computer-score");
const historyLog = document.getElementById("history-log");
const resetButton = document.getElementById("reset");

let userScore = 0;
let computerScore = 0;
let drawScore = 0;
let lastUserChoice = null;
let userWinCount = 0; // Track the number of user wins since the last computer win

// Conditional probability tracking
const choices = ["rock", "paper", "scissors"];
const probabilities = {
  rock: { rock: 0, paper: 0, scissors: 0 },
  paper: { rock: 0, paper: 0, scissors: 0 },
  scissors: { rock: 0, paper: 0, scissors: 0 },
};

// Add move to probabilities
function trackUserChoice(lastChoice, currentChoice) {
  if (lastChoice) {
    probabilities[lastChoice][currentChoice]++;
  }
}

// Predict user's next move
function predictUserMove(lastChoice) {
  if (!lastChoice) return choices[Math.floor(Math.random() * 3)];
  const counts = probabilities[lastChoice];
  const maxCount = Math.max(...Object.values(counts));
  const likelyChoices = Object.keys(counts).filter(
    (choice) => counts[choice] === maxCount
  );
  return likelyChoices[Math.floor(Math.random() * likelyChoices.length)];
}

// Computer's move to beat user's predicted move
function computerMove(userPrediction) {
  if (userPrediction === "rock") return "paper";
  if (userPrediction === "paper") return "scissors";
  return "rock";
}

// Play a round
function playRound(userChoice) {
  const userPrediction = predictUserMove(lastUserChoice);
  const computerChoice = computerMove(userPrediction);

  trackUserChoice(lastUserChoice, userChoice);
  lastUserChoice = userChoice;

  // Determine the winner
  let result;
  if (userChoice === computerChoice) {
    result = "It's a tie!";
    drawScore++;
  } else if (
    (userChoice === "rock" && computerChoice === "scissors") ||
    (userChoice === "paper" && computerChoice === "rock") ||
    (userChoice === "scissors" && computerChoice === "paper")
  ) {
    result = "You win!";
    userScore++;
    userWinCount++;
  } else {
    result = "I win!";
    computerScore++;
    userWinCount = 0; // Reset the user win count
  }

  // Update scores and history
  userScoreSpan.textContent = userScore;
  computerScoreSpan.textContent = computerScore;
  document.getElementById("draw-score").textContent = drawScore;

  // Unbold previous entries
  const previousEntries = historyLog.querySelectorAll("p");
  previousEntries.forEach(entry => entry.classList.remove("bold"));

  // Add new entry
  let newEntry = `<p class="bold">You chose ${userChoice}, I chose ${computerChoice}. ${result}</p>`;
  historyLog.innerHTML = newEntry + historyLog.innerHTML;

  if (userWinCount >= 3) {
    let strategyChangeMessage = `<p class="red">--- Changing strategy detected. Resetting parameters. ---</p>`;
    historyLog.innerHTML = strategyChangeMessage + historyLog.innerHTML;
    userWinCount = 0; // Reset the user win count after changing strategy
    for (const key in probabilities) {
      for (const subKey in probabilities[key]) {
        probabilities[key][subKey] = 0;
      }
    }
  }
}

// Add event listeners to buttons
buttons.forEach((button) => {
  button.addEventListener("click", () => playRound(button.id));
});

// Reset the game
resetButton.addEventListener("click", () => {
  userScore = 0;
  computerScore = 0;
  drawScore = 0;
  lastUserChoice = null;
  userWinCount = 0; // Reset the user win count
  for (const key in probabilities) {
    for (const subKey in probabilities[key]) {
      probabilities[key][subKey] = 0;
    }
  }
  userScoreSpan.textContent = "0";
  computerScoreSpan.textContent = "0";
  document.getElementById("draw-score").textContent = "0";
  historyLog.innerHTML = "";
});
