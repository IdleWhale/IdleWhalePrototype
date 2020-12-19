var lores = [
  [[x => player.finishedTasks.hasOwnProperty("Intro1")], "You found this game called 'Idle Whale' that appears to have great gameplay and graphics. You decide to give it a look."],
  [[x => player.finishedTasks.hasOwnProperty("Intro2")], "That didn't take so long. Now time to try the game out!"],
  [[x => player.finishedTasks.hasOwnProperty("Intro3")], "Oh, hey, it comes with a tutorial. You should follow it."]
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