var getDefaultPlayer = () => ({
  lastUpdate: new Date().getTime(),
  finishedTasks: {},
  ongoingTasks: {},
  loreStage: 0
})
var player = getDefaultPlayer()
var diff = 0
var diffMultiplier = 1
let gameLoopIntervalId = 0

function updateDisplay() {
  updateTasks()
  updateLore()
}

function gameLoop(diff) {
  // 1 diff = 0.001 seconds
  var thisUpdate = new Date().getTime()
  diff = (diff || Math.min(thisUpdate - player.lastUpdate, 21600000)) * diffMultiplier
  //if (diffMultiplier > 1) console.log("SHAME")
  //else if (diffMultiplier < 1) console.log("SLOWMOTION")

  checkLore()
  processOngoingTasks(diff)

  updateDisplay()
  player.lastUpdate = thisUpdate
}

function startGame() {
  // Some init job
  gatherTasks()
  startInterval()
}

function startInterval() {
  gameLoopIntervalId = setInterval(gameLoop, 33)
}
