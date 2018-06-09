export const setDocumentTitle = (title) => {
  document.title = title
  if (window.Env.isIos) {
    var i = document.createElement('iframe')
    i.src = '/favicon.ico'
    i.style.display = 'none'
    i.onload = () => {
      setTimeout(() => {
        i.remove()
      }, 10)
    }
    setTimeout(() => {
      document.body.appendChild(i)
    }, 500)
  }
}
