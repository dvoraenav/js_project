
function getStats() {
  const data = localStorage.getItem("snakeStats");
  return data
    ? JSON.parse(data)
    : { scores: [], highScore: 0 };
}

function saveStats(stats) {
  localStorage.setItem("snakeStats", JSON.stringify(stats));
}

function saveScore(score) {
  const stats = getStats();

  stats.scores.unshift(score);
  if (stats.scores.length > 3) {
    stats.scores.pop();
  }

  if (score > stats.highScore) {
    stats.highScore = score;
  }

  saveStats(stats);
}

function resetStats() {
  localStorage.removeItem("snakeStats");
}