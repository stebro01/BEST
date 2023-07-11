/**
 * FileExplorer class
 * @description This class is used to explore the file system
 * @example //Aufrufen des tests mit:
 * npm run test:unit test/jest/__tests__/FileExplorer.test.js
 * @param {*} pathModule
 * @param {*} fsModule
 * @returns {FileExplorer}
 */
export class FileExplorer {
  // constructor
  // example: const explorer = new FileExplorer(path, fs);
  constructor(pathModule, fsModule) {
    this.path = pathModule;
    this.fs = fsModule;
    this.currentPath = "/";
    this.availableDrives = this.detectDrives();
  }

  // methods

  // setCurrentPath, example: explorer.setCurrentPath('/Users/ste/MyProjects/BEST/db/app')
  setCurrentPath(folderPath) {
    this.currentPath = folderPath;
  }

  // getCurrentPath, example: explorer.getCurrentPath()
  getCurrentPath() {
    return this.currentPath;
  }

  // getDirectoryContents, example: explorer.getDirectoryContents()
  getDirectoryContents() {
    const directoryPath = this.currentPath;

    try {
      const files = this.fs.readdirSync(directoryPath);
      const contents = files.map((file) => {
        const filePath = this.path.join(directoryPath, file);
        const isDirectory = this.fs.lstatSync(filePath).isDirectory();
        return {
          name: file,
          path: filePath,
          isDirectory,
        };
      });
      const RESULT = [];
      contents.forEach((c) => {
        if (c.isDirectory) RESULT.push(c.path);
      });

      return RESULT;
    } catch (err) {
      console.error("Error reading directory:", err);
      return [];
    }
  }

  // goUpOneLevel, example: explorer.goUpOneLevel()
  goUpOneLevel() {
    const currentPath = this.currentPath;
    const parentDirectory = this.path.dirname(currentPath);
    this.currentPath = parentDirectory;
  }

  // detectDrives, example: explorer.detectDrives()
  detectDrives() {
    const drives = [];
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (const letter of letters) {
      const drivePath = `${letter}:\\`;
      if (this.fs.existsSync(drivePath)) {
        drives.push(drivePath);
      }
    }

    return drives;
  }

  // info, example: explorer.info()
  info() {
    const currentPath = this.currentPath;
    const availableDrives = this.availableDrives;
    const directoryContents = this.getDirectoryContents();

    return {
      currentPath,
      availableDrives,
      directoryContents,
    };
  }
}
