export function log(payload) {
  var text = ''
    if (payload.message !== undefined) text += payload.message
    if (payload.error !== undefined) text += 'ERROR! '+payload.error
    if (payload.data !== undefined)  text += `\ndata: ${payload.data}`

    console.log(text)
    // return true if error was not defined, false otherwise
    return (payload.error !== undefined)
  }