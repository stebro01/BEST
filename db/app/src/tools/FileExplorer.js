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
      this.availableDrives = this.detectDrives();
      this.currentPath = this.availableDrives[0]; //this.currentPath = "/";
      this.hideHiddenFiles = true;
  
    }
  
    // Set the current path
    // Example: explorer.setCurrentPath('/Users/ste/MyProjects/BEST/db/app')
    setCurrentPath(folderPath) {
      this.currentPath = folderPath;
    }

    async checkPath(folderPath) {
        return this.fs.existsSync(folderPath)
    }
  
    // Get the current path
    // Example: explorer.getCurrentPath()
    getCurrentPath() {
      return this.currentPath;
    }
  
    // Get the directory contents
    // Example: explorer.getDirectoryContents()
    async getDirectoryContents() {
      const directoryPath = this.currentPath;
      try {
        const files = await this.fs.readdirSync(directoryPath);
        var directoryContents = []
        for (let file of files) {
            // check if first string of file is a dot
            if (!this.hideHiddenFiles || (file[0] !== '.' && file[0] !== '~' && file[0] !== '$')) {
                let filePath = this.path.join(directoryPath, file);
            var isDirectory = false
            // NEED TO DO THIS WORKOROUND TO CHECK IF IT IS A DIRECTORY
            try {
                let tmp = await this.fs.readdirSync(filePath) //if no error occurs, it is a directory
                isDirectory = true
            } catch (err) {
                // console.error(err)
            }
            if (isDirectory) directoryContents.push(filePath)
            }
        }
        return directoryContents;
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

      if (this.fs.existsSync('/')) drives.push('/')
  
      return drives;
    }
  
    // Get info about the file explorer
    // Example: explorer.info()
    async info() {
      const currentPath = this.currentPath;
      const availableDrives = this.availableDrives;
      const directoryContents = await this.getDirectoryContents();
  
      return {
        currentPath,
        availableDrives,
        directoryContents,
      };
    }
  }
  