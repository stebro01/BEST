const { contextBridge, ipcRenderer } = require('electron')
const fs = require('fs')
const path = require('path')
const dbman = require('./dbman')

var publicFolder = __dirname
if (process.env.QUASAR_PUBLIC_FOLDER) publicFolder = path.resolve(publicFolder, process.env.QUASAR_PUBLIC_FOLDER)

contextBridge.exposeInMainWorld(
  'electron',
  {
    doThing: () => {
        ipcRenderer.send('do-a-thing')
    },
    readFile: fs.readFileSync,
    exists: fs.existsSync,
    path: path,
    dbman: dbman,
    publicFolder: publicFolder
  }
)