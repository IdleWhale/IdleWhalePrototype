class GameTask extends window.Task {
  constructor (id, desc, goal, progress, req, inc) {
    super(id, desc, goal, progress, req, inc, "Game")
  }

  tick() {
    return this.Progress.gte(this.Goal)
  }
}
window.GameTask = GameTask