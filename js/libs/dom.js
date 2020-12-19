var ge = document.getElementById.bind(document)

function updateElement(elm, text, html = false) {
  ge(elm)[html ? "innerHTML" : "innerText"] = text
}
var ue = updateElement

function showElement(elm, display = "") {
  ge(elm).style.display = display
}
var se = showElement

function decideElement(elm, bool, showStyle = "", onTrue = function() {}) {
  se(elm, bool ? showStyle : "none")
  if (bool) onTrue()
}
var de = decideElement

function hideElement(elm) {
  se(elm, "none")
}
var he = hideElement