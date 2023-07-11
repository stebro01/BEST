/**
 * FileExplorer class
 * @description This class is used to explore the file system
 * @example // Run the tests with:
 * npm run test:unit test/jest/__tests__/FileExplorer.test.js
 * @param {*} pathModule
 * @param {*} fsModule
 * @returns {FileExplorer}
 */
export class FileExplorer {
    constructor(pathModule, fsModule) {
      this.path = pathModule;
      this.fs = fsModule;
      this.currentPath = "/";
      this.availableDrives = this.detectDrives();
  
      if (process.platform === "win32" && this.availableDrives.length > 0) {
        this.currentPath = this.availableDrives[0];
      }
    }
  
    // Set the current path
    // Example: explorer.setCurrentPath('/Users/ste/MyProjects/BEST/db/app')
    setCurrentPath(folderPath) {
      this.currentPath = folderPath;
    }
  
    // Get the current path
    // Example: explorer.getCurrentPath()
    getCurrentPath() {
      return this.currentPath;
    }
  
    // Get the directory contents
    // Example: explorer.getDirectoryContents()
    getDirectoryContents() {
      const directoryPath = this.currentPath;
  
      try {
        const files = this.fs.readdirSync(directoryPath);
        const directoryContents = files.map((file) => {
          const filePath = this.path.join(directoryPath, file);
          const isDirectory = this.fs.lstatSync(filePath).isDirectory();
          return {
            name: file,
            path: filePath,
            isDirectory,
          };
        });
        const result = [];
        directoryContents.forEach((content) => {
          if (content.isDirectory) result.push(content.path);
        });
  
        return result;
      } catch (err) {
        console.error("Error reading directory:", err);
        return [];
      }
    }
  
    // Go up one level in the directory
    // Example: explorer.goUpOneLevel()
    goUpOneLevel() {
      this.currentPath = this.path.dirname(this.currentPath);
    }
  
    // Detect available drives
    // Example: explorer.detectDrives()
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
  
    // Get info about the file explorer
    // Example: explorer.info()
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
  