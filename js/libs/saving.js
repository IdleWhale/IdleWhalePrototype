// THE saving library, by Nyan Cat 2020
// Note: Make sure your saving variable is defined by VAR and not LET, otherwise it won't work
// You need the full version of Lodash for this to work https://lodash.com/
// And please, just please make sure you change the stuff below to suit your code, otherwise it will burst on fire
const saveName = "IWSave"
const initPlayerFunctionName = "getDefaultPlayer"
const playerVarName = "player" // DO NOT USE THE WORD "SAVE"
const importDangerAlertText = "Your imported save seems to be missing some values, which means importing this save might be destructive, if you have made a backup of your current save and are sure about importing this save please press OK, if not, press cancel and the save will not be imported."
const versionTagName = "version"
const decimalLibraryVarName = "Decimal" // MAKE SURE YOU CHANGE THIS IF YOU ARE USING OTHER DECIMAL LIBRARIES
const arrayTypes = {
  // For EACH array in your player variable, put a key/value to define its type like I did below
  storeProgramsBought: "String"
}
const hardResetConfirmText = [ // You can add more strings if you want multi time confirmation
  "Are you sure about doing this? YOU WILL LOSE EVERYTHING YOU HAVE WITHOUT ANY REWARDS!"
];

const importPrompt = "Paste your exported save below:"

function onImportError() {
  alert("Error: Imported save is in invalid format, please make sure you've copied the save correctly and isn't just typing gibberish.")
}

function onLoadError() {
  console.log("The save didn't load? Oh fuck.")
}

function onImportSuccess() {
  console.log("Save imported successfully.")
}

function onLoad() { // Put your savefile updating codes here
  
}

// This will be called when the savefile cannot be parsed into JSON at all, after this function is called, the game will do a hard reset automatically, so allow the player to backup if you wish!
function handleBrokenSave() { 
  alert("Your save is corrupted, which means you will be forced to do a hard reset before proceeding, sorry!")
  if (confirm("Would you like to export the save for backup? THIS IS THE ONLY CHANCE TO KEEP THE OLD SAVE")) exportGame()
  alert("Now we will perform a hard reset, if you decide to export before doing it, REFRESH NOW AND CHOOSE YES IN THE PREVIOUS PROMPT!")
}

// Only change things above to fit your game UNLESS you know what you're doing
function exportSave() {
  copyStringToClipboard(btoa(JSON.stringify(window[playerVarName])))
  onExportSuccess()
}

function importSave() {
  let save = prompt(importPrompt, "")
  if (save == "" || save == null) return false
  loadGame(save, true)
}

function hardReset() {
  for (let confirmText of hardResetConfirmText) {
    if (!confirm(confirmText)) return false;
  }
  window[playerVarName] = window[initPlayerFunctionName]();
  saveGame();
  location.reload();
}

Array.prototype.diff = function (a) {
  return this.filter(function (i) {
    return a.indexOf(i) < 0;
  });
};

function saveGame() {
  localStorage.setItem(saveName, btoa(JSON.stringify(window[playerVarName])))
}

function loadGame(save, imported = false) {
  try {
    if (save === undefined) save = localStorage.getItem(saveName)
    if (save === null) {
      console.log("No savefile in localstorage, creating new savefile...")
      return
    }

    var save = JSON.parse(atob(save))
    let reference = window[initPlayerFunctionName]()
    let refLists = listItems(reference)
    let saveLists = listItems(save)
    let missingItem = refLists[0].diff(saveLists[0])
    if (missingItem.includes("save")) {
      handleBrokenSave()
      return
    }
    if (missingItem.length != 0 && imported) {
      if (!confirm(importDangerAlertText)) {
        return
      }
    }

    missingItem.forEach(function (value) {
      if (value != versionTagName) _.set(save, value, _.get(reference, value))
    })

    let decimalList = [...new Set(saveLists[1].diff(refLists[1]).concat(findOmegaNumVars(saveLists[2])))]
    decimalList.forEach(function (value) {
      _.set(save, value, new window[decimalLibraryVarName](_.get(save, value)))
    })

    saveLists[2].forEach(function (value) {
      let arrayType = findArrayType(value)
      if (arrayType != "String") _.set(save, value, _.get(save, value).map(getMapFunc(arrayType)))
    })

    window[playerVarName] = save
    onLoad()
    _.set(save, versionTagName, _.get(reference, versionTagName))
    if (imported) onImportSuccess()
  } catch (err) {
    if (imported) {
      console.log(err)
      onImportError()
      return
    } else {
      console.log(err)
      onLoadError()
      return
    }
  }
}

function findOmegaNumVars(arrayList) {
  let ret = []
  for (let varName of arrayList) {
    if (varName.endsWith(".array")) {
      ret.push(varName.slice(0, -6))
    }
  }
  return ret
}

function getMapFunc(type) {
  switch (type) {
  case "Decimal":
    return x => new window[decimalLibraryVarName](x)
  case "Number":
    return x => Number(x)
  default:
    return x => x
  }
}

function findArrayType(index) {
  let definedType = arrayTypes[index]
  if (definedType === undefined) return "String"
  return definedType
}

function listItems(data, nestIndex = "") {
  let itemList = []
  let stringList = []
  let arrayList = []
  Object.keys(data).forEach(function (index) {
    let value = data[index]
    let thisIndex = nestIndex + (nestIndex === "" ? "" : ".") + index
    itemList.push(thisIndex)
    switch (typeof value) {
    case "object":
      if (value instanceof Array) {
        arrayList.push(thisIndex)
      } else if (!(value instanceof window[decimalLibraryVarName])) {
        let temp = listItems(value, thisIndex)
        itemList = itemList.concat(temp[0])
        stringList = stringList.concat(temp[1])
        arrayList = arrayList.concat(temp[2])
      }
      break;
    case "string":
      stringList.push(thisIndex)
      break;
    }
  });
  return [itemList, stringList, arrayList]
};
