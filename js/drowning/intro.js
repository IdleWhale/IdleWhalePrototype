var introTasks = [
  new window.DrowningTask("Intro1", "You are bored.", "Find a game", "Finding a game...", 10, 1, [x => player.loreStage == 0]),
  new window.DrowningTask("Intro2", "You need a game account to play the game.", "Register an account.", "Making up a good username...", 15, 1, [x => player.loreStage == 1]),
  new window.DrowningTask("Intro3", "", "Start the game.", "Reticulating splines...", 5, 1, [x => player.loreStage == 2])
]
drowningTaskGatherList.push("introTasks")