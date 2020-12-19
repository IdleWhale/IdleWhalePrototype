var lores = [
  [[x => player.finishedTasks.hasOwnProperty("Intro1")], "You found this game called 'Idle Whale' that appears to have great gameplay and graphics. You decided to give it a look."]
]

var loresShown = 0

function checkLore() {
  if (lores.length <= player.loreStage) return false
  for (reqFunc of lores[player.loreStage][0]) {
    if (!reqFunc()) return false
  }

  player.loreStage++
  return true
}

function updateLore() {
  while (loresShown < player.loreStage) {
    var loreDiv = document.createElement("div")
    loreDiv.innerText = lores[loresShown][1]
    ge("lore").appendChild(loreDiv)
    loresShown++
  }
}