class Task {
  constructor (id, desc, goal, req, progress, inc, type) {
    this.Id = id
    this.Desc = desc
    this.Goal = new Decimal(goal)
    this.Req = req || []
    
    if (_.isFunction(progress)) {
      Object.defineProperty(this, {
        "Progress": {
          "get": progress
        }
      })
    } else {
      this.Progress = new Decimal(progress)
    }

    if (_.isFunction(inc)) {
      Object.defineProperty(this, {
        "Inc": {
          "get": inc
        }
      })
    } else {
      this.Inc = new Decimal(inc)
    }

    this.Type = type
  }

  get Available() {
    for (let reqFunc of this.Req) {
      if (!reqFunc()) return false
    }

    return true
  }
}
window.Task = Task

const taskTypes = ["Drowning", "Game"]
function getTaskStub() {
  var ret = {}
  for (let taskType of taskTypes) {
    ret[taskType] = []
  }
  return ret
}
var tasks = getTaskStub()
var taskGatherLists = getTaskStub()
var tasksShown = getTaskStub()

function gatherTasks() {
  tasks = getTaskStub()
  for (let taskType of taskTypes) {
    for (let taskList of taskGatherLists[taskType]) {
      tasks[taskType] = tasks[taskType].concat(window[taskList])
    }
  }
}

function hideTask(taskType, taskId) {
  tasksShown[taskType].remove(taskId)
  ge(taskId).remove()
}

function updateTasks() {
  for (let taskType of taskTypes) {
    for (let task of tasks[taskType]) {
      if (player.ongoingTasks.hasOwnProperty(task.Id)) updateOngoingTask(task)
      else if (tasksShown[taskType].includes(task.Id)) {
        if (!task.Available) hideTask(taskType, task.Id)
      } else if (task.Available) {
        switch (taskType) {
          case "Drowning":
            showDrowningTask(task)
            break
        }
      }
    }
  }
}

function updateOngoingTask(task) {
  var shownText = `${task.ProgressText} ${getFinalProgressBar(player.ongoingTasks[task.Id].Progress, task.Goal, task.Inc)}`

  var elm = ge(task.Id)
  elm.classList.add("taskProgress")
  elm.innerText = shownText
}

function startTask(task) {
  if (player.ongoingTasks.hasOwnProperty(task.Id) || !task.Available) return false
  player.ongoingTasks[task.Id] = task
}

function processOngoingTasks(diff) {
  for (let task of Object.values(player.ongoingTasks)) {
    if (task.tick(diff)) finishTask(task)
  }
}

function finishTask(task) {
  hideTask(task.Type, task.Id)
  if (!player.finishedTasks.hasOwnProperty(task.Id)) player.finishedTasks[task.Id] = new Decimal(0)
  player.finishedTasks[task.Id] = player.finishedTasks[task.Id].plus(1)
  
  delete player.ongoingTasks[task.Id]
}