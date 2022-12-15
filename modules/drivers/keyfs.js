// A Key based filesystem (Known as KeyFS), replacing the testing IHFS found in some rc2 versions
import * as Storage from '../extern/idb-keyval.js';

// Internal Path Helper
class FSCommon {
  static expandFlatOBJ(object) {
    let tmpOBJ = {};
    for (let key in object) {
      const keys = key.split("/");
      keys.shift(); // 

      keys.reduce((acc, value, index) => {
          return acc[value] || (acc[value] = keys.length - 1 === index ? object[key] : {})
      }, tmpOBJ);
    }

    return tmpOBJ;
  }
}

// Class
class KeyFSInstance {
  keyFSVersion = '1.0';
  constructor() {
    this.fs = {}; // FS in memory
    this.changes = {}; // Changes that need to be saved (imagine git-sorta)
    this.__DEBUG_STORAGE = Storage; // Debug Storage API (Don't access normally)

    this.__refresh(); // Storage.entries() ...
  }

  change(path, data) {
    if (path.charAt(0) !== '/') path = "/" + path;
    let arr = path.split('/');
		arr.shift();

		let fileName = arr[arr.length - 1];
		arr.pop();

		path = arr.join('/');
		path = '/' + path;
		path = path + '/';
    //console.log(arr, path, fileName); // Debug Info

    // Add to changed arr
    let changeArr = {};
    changeArr[path + fileName] = data;
    Object.assign(this.changes, changeArr);

    // Add to fs arr
    changeArr = FSCommon.expandFlatOBJ(changeArr);
    Object.assign(this.fs, changeArr);
  } // Add to fs in memory

  write() {
    const scope = this;
    const keys = Object.keys(scope.changes)
    const values = Object.values(scope.changes)
    for (let i = 0, ln = keys.length; i < ln; i++) {
      Storage.set(keys[i], values[i]);
    }

    this.changes = {}; // Reset changes so we don't dupe writes
  } // Write Changes in memory (iterate through object)

  read(path, onFetch) {
    if (path.charAt(0) !== '/') path = "/" + path;
    let arr = path.split('/');
		arr.shift();

    let fileName = arr[arr.length - 1];
		arr.pop();

		path = arr.join('/');
		path = '/' + path;
		path = path + '/';

    const s = this;
    if (s.fs[arr][fileName]) {
      onFetch(s.fs[arr][fileName]);
    } else {
      Storage.get(path + fileName).then((val) => onFetch(val));
    }
  } // Read from FS (To-do: Read from FSCache)

  __refresh() {
    Storage.entries().then((entries) => {
      //console.log(entries); // Debug if you need to check entries in keyval format
      // Build flattened object
      let flattenedFS = {};
      for (let i = 0, ln = entries.length; i < ln; i++) {
        flattenedFS[entries[i][0]] = entries[i][1];
      }

      // Populate the Filesystem
      this.fs = FSCommon.expandFlatOBJ(flattenedFS);
    })  
  } // Refresh FS Database (Populates this.fs)
}

// Exports
export { KeyFSInstance }