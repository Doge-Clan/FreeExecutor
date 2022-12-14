// A Key based filesystem (Known as KeyFS), replacing the testing IHFS found in some rc2 versions
import * as Storage from '../extern/idb-keyval.js';

// Class
class KeyFSInstance {
  constructor() {
    this.fs = {}; // FS in memory
    this.changes = {}; // Changes that need to be saved (imagine git-sorta)
    this.__DEBUG_STORAGE = Storage; // Debug Storage API (Don't access normally)

    Storage.entries().then((entries) => {
      //console.log(entries); // Debug if you need to check entries in keyval format
      // Build flattened object
      let flattenedFS = {};
      for (let i = 0, ln = entries.length; i < ln; i++) {
        flattenedFS[entries[i][0]] = entries[i][1];
      }

      // Now expand object
      let fullOBJ = {}; // Unflattened FS
      for (let key in flattenedFS) {
        const keys = key.split("/");
        keys.shift(); // 

        keys.reduce((acc, value, index) => {
            return acc[value] || (acc[value] = keys.length - 1 === index ? flattenedFS[key] : {})
        }, fullOBJ)
      }
      
      // Populate the Filesystem
      this.fs = fullOBJ;
    })  
  }

  addChange() {} // Add

  saveChanges() {}
}

// Exports
export { KeyFSInstance }