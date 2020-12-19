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
  }

  get Available() {
    for (let reqFunc of this.Req) {
      if (!reqFunc()) return false
    }

    return true
  }
}
window.DrowningTask = DrowningTask

var drowningTasks = []
var drowningTaskGatherList = []
function gatherDrowningTasks() {
  drowningTasks = []
  for (let taskList of drowningTaskGatherList) {
    drowningTasks = drowningTasks.concat(window[taskList])
  }
}

var drowningTasksShown = []
function updateDrowningTasks() {
  for (let task of drowningTasks) {
    if (drowningTasksShown.includes(task.Id) || !task.Available) continue
    var taskDiv = document.createElement("div")

    var descSpan = document.createElement("span")
    descSpan.innerText = task.Desc
    taskDiv.appendChild(descSpan)

    var actionBtn = document.createElement("button")
    actionBtn.innerText = task.ActionText
    taskDiv.appendChild(actionBtn)

    ge("drowning").appendChild(taskDiv)
    drowningTasksShown.push(task.Id)
  }
}