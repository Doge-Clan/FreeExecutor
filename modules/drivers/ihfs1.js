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
			scope.db = await openDB(partitionName, scope.specMajorVersion, {
				upgrade(db) {
					if (partitionName = 'OS') {
						db.createObjectStore('/bin/', { autoIncrement: false }); // /bin/ (Standard Apps (/usr/bin/ basically))
						db.createObjectStore('/home/', { autoIncrement: true }); // /home/ (Home for users, stub)
						db.createObjectStore('/root/', { autoIncrement: false }); // /root (Root home)
						db.createObjectStore('/sbin/', { autoIncrement: false }); // /sbin/ (Root only Apps (when perm. levels are added))
						db.createObjectStore('/boot/', { autoIncrement: false }); // /boot/ (Boot directory)
						db.createObjectStore('/boot/services/', { autoIncrement: false }); // /boot/services (Services Directory)
					}
				},
			});
		}

		getDB();
	} // Make the partition

	createDirectory(path) {
		if (path.chatAt(0) !== '/') path = "/" + path;
		this.db.createObjectStore(path, { autoIncrement: false }); // Ensure defaults are enforced
	}

	writeFile(path, data) {
		const scope = this;
		let arr = path.split('/');
		arr.shift();

		let fileName = arr[arr.length - 1];
		arr.pop();

		path = arr.join('/');
		path = '/' + path;
		path = path + '/';

		async function putFile() {
			const tx = scope.db.transaction(path, 'readwrite');
			await Promise.all([
  			tx.store.put(data, fileName),
  			tx.done,
			]); // To-do: Maybe not use Promise.all()? It seems overkill to resolve it this way.
		} // Async cool hack

		putFile();
	}

	readFile(path) {
		const scope = this;
		let arr = path.split('/');
		arr.shift();

		let fileName = arr[arr.length - 1];
		arr.pop();

		path = arr.join('/');
		path = '/' + path;
		path = path + '/';

		async function getFile() {
			const tx = scope.db.transaction(path);
			const data = await Promise.resolve(tx.store.get(fileName));

			return data;
		}
		
		let tmp = getFile();
		return tmp;
	}

	delete() {
		const scope = this;
		async function killDB() {
			await deleteDB(scope.partitionName);
		}

		killDB(); // kill the database!
	} // Removes the current Partition
}

// Exports
export { IHFS1Instance }