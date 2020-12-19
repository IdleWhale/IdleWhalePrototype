class DrowningTask {
  constructor (id, desc, actionText, progressText, cost, inc, req) {
    if (!(this instanceof DrowningTask)) throw new Error("Constructor called as a function");

    this.Id = id
    this.Desc = desc
    this.ActionText = actionText
    this.ProgressText = progressText
    this.Cost = new Decimal(cost)
    if (_.isFunction(inc)) {
      Object.defineProperty(this, {
        "Inc": {
          "get": inc
        }
      })
    } else {
      this.Inc = new Decimal(inc)
    }
    
    this.Req = req || []
    this.Progress = new Decimal(0)
  }

  get Available() {
    for (let reqFunc of this.Req) {
      if (!reqFunc()) return false
    }

    return true
  }

  tick(diff) {
    this.Progress = Decimal.min(this.Cost, this.Progress.plus(this.Inc.divide(1000).times(diff)))
    return this.Progress.eq(this.Cost)
  }
}
window.DrowningTask = DrowningTask

var drowningTasks = []
var drowningTaskGatherList = []
var drowningTasksShown = []

function gatherDrowningTasks() {
  drowningTasks = []
  for (let taskList of drowningTaskGatherList) {
    drowningTasks = drowningTasks.concat(window[taskList])
  }
}

function createDrowningTask(task) {
  var taskDiv = document.createElement("div")
  taskDiv.id = task.Id

  var descSpan = document.createElement("span")
  descSpan.innerText = task.Desc
  taskDiv.appendChild(descSpan)

  var actionBtn = document.createElement("button")
  actionBtn.innerText = task.ActionText
  actionBtn.addEventListener("click", startDrowningTask.bind(window, task))
  taskDiv.appendChild(actionBtn)

  ge("drowning").appendChild(taskDiv)
  drowningTasksShown.push(task.Id)
}

function updateOngoingTask(task) {
  var shownText = `${task.ProgressText} ${getFinalProgressBar(player.ongoingTasks[task.Id].Progress, task.Cost, task.Inc)}`

  var elm = ge(task.Id)
  elm.classList.add("taskProgress")
  elm.innerText = shownText
}

function updateDrowningTasks() {
  for (let task of drowningTasks) {
    if (player.ongoingTasks.hasOwnProperty(task.Id)) updateOngoingTask(task)
    else if (!drowningTasksShown.includes(task.Id) && task.Available) createDrowningTask(task)
  }
}

function startDrowningTask(task) {
  if (player.ongoingTasks.hasOwnProperty(task.Id) || !task.Available) return false
  player.ongoingTasks[task.Id] = task
}

function finishTask(task) {
  drowningTasksShown.remove(task.Id)
  ge(task.Id).remove()
  if (!player.finishedTasks.hasOwnProperty(task.Id)) player.finishedTasks[task.Id] = new Decimal(0)
  player.finishedTasks[task.Id] = player.finishedTasks[task.Id].plus(1)
  
  delete player.ongoingTasks[task.Id]
}

function processOngoingTasks(diff) {
  for (let task of Object.values(player.ongoingTasks)) {
    if (task.tick(diff)) finishTask(task)
  }
}