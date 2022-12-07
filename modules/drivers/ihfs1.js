/* 
	IHFS (Indexed Hierarchical File System) 1.0
	==============================================================================================================================================================
	IHFS is a spec that provides a performant file system standard that builds off of IndexedDB to provide a high-performance filesystem. 
	Features include:
	- Unlimited(-ish) Storage! Go Wild!
	- Performant and Heavily Optimized
	- Sync (sorta) + Async, powered by idb.js!
*/

import { openDB, deleteDB } from '../extern/idb.js'; // Import IDB to provide async vs sync operations

// IHFS Driver Class
class IHFS1Instance {
	specMajorVersion = 1; // The current ihfs version (IndexedDB Version)
	specMinorVersion = 0; // Minor ihfs version (Bug fix/non-breaking change)
	constructor(partitionName = 'OS') {
		const scope = this;
		async function getDB() {
			scope.elm = await openDB(partitionName, scope.specMajorVersion);
		}
		
		getDB(); // Get the Enhanced Indexed Database via idb
	}
}

// Exports
export { IHFS1Instance }