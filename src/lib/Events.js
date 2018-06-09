export function load(text) {
  eventEmit('load', text)
}
export function loaded(show, text, time) {
  eventEmit('loaded', show, text, time)
}
export function toast(text, time) {
  eventEmit('toast', text, time)
}
export function fail(text, time) {
  eventEmit('fail', text, time)
}
export function offline(text, time) {
  eventEmit('offline', text, time)
}

function emit(...values) {
  if(window.appEvent) window.appEvent.emit(...values)
}