export let FECore = { }; // Exported Object

// Populate Object
FECore.isTextMode = localStorage.getItem('fe_textmode') || true; // is FreeExecutor in Text Mode?
FECore.isGraphicsMode = localStorage.getItem('fe_graphicsmode') || false; // is FreeExecutor in Graphics Mode?
FECore.hostname = localStorage.getItem('fe_hostname') || "system"; // Hostname of the install?
FECore.version = "0.4.0-rc2"; // The reported version of FreeExecutor
FECore.startupMsg = localStorage.getItem('fe_startupmsg') || "FreeExecutor " + FECore.version + "<br>(C) 2021-2022 Doge Clan, Licensed under LGPL 2.1 License"; // Greeting Message on boot
FECore.currentUser = 'root'; // root = default, baseplate for multi-user system when VFS gets added
FECore.execGUI = function() {
  alert('Nothing installed at fe.execGUI()! Please use libnix to patch the GUI.');
  FECore.isTextMode = true;
  FECore.isGraphicsMode = false;
}; // What to do when executing GUI. (To-do: Move to window.fe.user to seperate user managed and system managed)

FECore.set_execGUI = function(callback) {
	FECore.execGUI = callback;
}

FECore.isNotCompatibleWithBrowser = !window.MSInputMethodContext && !document.documentMode || // IE 11 Case (IE 10 and below will likely not execute)
                                    !window.WebSocket || // Web Socket
                                    !window.localStorage || // Local Storage Check (Probably will crash before we get this far)
                                    !window.caches || // No Caches?
                                    !window.indexedDB; // IndexedDB

FECore.system = {
  threads: navigator.hardwareConcurrency,
  usableMemory: performance.memory.jsHeapSizeLimit || 0, // 0 is undefined/fallback case 
};

/*
  window.fe is a new extension to the Window API that stores the state of FreeExecutor and its modes
  to be exposed to programs that need them. It is essentially a kernel state with GUI modes, etc.
*/