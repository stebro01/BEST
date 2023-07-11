const { contextBridge } = require("electron");

const path = require("path");
const fs = require("fs");
const dbman = require('../src/tools/dbman')
const os = require('os');


contextBridge.exposeInMainWorld("electron", {
  doAThing: () => {},
  readFile: fs.readFileSync,
  writeFile: fs.writeFileSync,
  exists: fs.existsSync,
  path: path,
  dbman: dbman,
  homedir: os.homedir(),
  publicFolder: path.resolve(__dirname, process.env.QUASAR_PUBLIC_FOLDER)
});
