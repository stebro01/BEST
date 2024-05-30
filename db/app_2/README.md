# dbBEST (by @sb)

Electron-App mit sqliteDB Anbindung

## Install the dependencies
```bash
npm install
```

### Starte App zum Entwickeln
```bash
npm run dev
```

### Build the app for production
```bash
npm run build
```

#### for macOS:
- quasar.conf.js >> muss auf "packager" gestellt sein!!
- ```npm run build```
- ```npm run build_sign```   (dafuer muss XCODE installiert sein und ein Develp. Account angemeldet)
- ```npm run build_dmg```

#### for windows:
- quasar.conf.js >> muss auf "builder" gestellt sein!!
- appdmg muss deinstalliert sein (```npm remove appdmg```)
- ```npm run build4win```

### Cypress starten
```bash
npm run cy
```

### JSDOC - Dokumentation erstellen (in ./docs/index.html)
```bash
npm run doc
```

## Fehlerbehebung

### Fehler: appdmg on windows 
Fehler: electron-packager auf win32 mit appdmg installiert bringt einen Fehler
Lösung: npm remove appdmg

### Fehler: code ELIFECYCLE; errno 1
Fehler:
```
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! dbbest@0.0.1 dev: `quasar dev -m electron -t mat`
npm ERR! Exit status 1
```

Lösung:
```
npm cache clean --force
rm package-lock.json
rm -rf node_modules  
npm install
```


