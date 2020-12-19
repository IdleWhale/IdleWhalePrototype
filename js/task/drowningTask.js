class DrowningTask extends window.Task {
  constructor (id, desc, actionText, progressText, goal, inc, req) {
    super(id, desc, goal, req, 0, inc, "Drowning")

    this.ActionText = actionText
    this.ProgressText = progressText
  }

  tick(diff) {
    this.Progress = Decimal.min(this.Goal, this.Progress.plus(this.Inc.divide(1000).times(diff)))
    return this.Progress.gte(this.Goal)
  }
}
window.DrowningTask = DrowningTask

function showDrowningTask(task) {
  var taskDiv = document.createElement("div")
  taskDiv.id = task.Id

  var descSpan = document.createElement("span")
  descSpan.innerText = task.Desc
  taskDiv.appendChild(descSpan)

  var actionBtn = document.createElement("button")
  actionBtn.innerText = task.ActionText
  actionBtn.addEventListener("click", startTask.bind(window, task))
  taskDiv.appendChild(actionBtn)

  ge("drowning").appendChild(taskDiv)
  tasksShown.Drowning.push(task.Id)
}