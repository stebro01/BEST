const { contextBridge } = require("electron");

const path = require("path");
const fs = require("fs");
const dbman = require('../src/tools/dbman')

contextBridge.exposeInMainWorld("electron", {
  doAThing: () => {},
  readFile: fs.readFileSync,
  exists: fs.existsSync,
  path: path,
  dbman: dbman,
});
