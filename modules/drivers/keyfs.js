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

// Populate (was __refresh) is now a hidden method over here
const entries = await Promise.resolve(Storage.entries()); // Holy shit, it is sync! Thank god for top-level await!
function __populate() {
  //console.log(entries); // Debug if you need to check entries in keyval format
  // Build flattened object
  let flattenedFS = {};
  for (let i = 0, ln = entries.length; i < ln; i++) {
    flattenedFS[entries[i][0]] = entries[i][1];
  }

  // Return Populated OBJ 
  return FSCommon.expandFlatOBJ(flattenedFS);
}

// Class
class KeyFSInstance {
  keyFSVersion = '1.0';
  constructor(options = {}) {
    this.fs = {}; // FS in memory
    this.changes = {}; // Changes that need to be saved (imagine git-sorta)
    this.options = options;
    this.__DEBUG_STORAGE = Storage; // Debug Storage API (Don't access normally)
    if (this.options.syncOperationsOnly) {
      console.log('@fs/constructor: Sync operations are being enforced (undefined will be returned when Storage.get is requested)');
    } // To-do:

    this.fs = __populate(); // Storage.entries() ...
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
  } // Read from FS (To-do: Notify if operation is sync/async due to Cache Read)

  __CCRead(path) {
    if (path.charAt(0) !== '/') path = "/" + path;
    let arr = path.split('/');
		arr.shift();

    let fileName = arr[arr.length - 1];
		arr.pop();

		path = arr.join('/');
		path = '/' + path;
		path = path + '/';
    try {
      return s.fs[arr][fileName];
    } catch {
      return null;
    }
  } // Read only from CachedFS with a try statement (This is used within early loading of FreeExecutor)
}

// Exports
export { KeyFSInstance }