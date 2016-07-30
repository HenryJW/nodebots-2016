function onInput(callback) {
  setTimeout(() => callback(':00050?'), 2000)
}

module.exports = {
  onInput: onInput
}