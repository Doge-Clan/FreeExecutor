/*
  FreeExecutor 0.3
  (C) 2022 Doge Clan, Licensed under the LGPL 2.1 License
  ================================================================
  FreeExecutor 0.3 is a rewrite of FreeExecutor that fixes the poor code
  of previous versions and adds many new features (Greatly improved Terminal,
  GUI Boilerplate, Builtin Libraries, etc.)
  
   - VFS is not implemented yet
   - NOT COMPATIBLE WITH PREVIOUS VERSIONS (0.1.0 - 0.2.1) 
*/


// jshint esnext: true
// Wrapper for FreeExecutor
(function() {
  // JavaScript Extensions
  window.page = {
    url: window.location.href,
    isGoGuardian: window.location.href.includes('blocked.goguardian.com'), // I found a way to extract random info from the ctx string of this site. For that extra feature.
    isLocal: window.location.href.includes("C:") || window.location.href.indexOf('/') === 0 // Saved File (Windows/NT), Saved File (unix/unix like)
  };

  /*
    window.page is a new extension to the Window API that can be used to get various information
    on the injected page from a bookmarklet perspective
  */
  
  window.fe = { };
  
  window.fe.isTextMode = localStorage.getItem('fe_textmode') || true;
  window.fe.isGraphicsMode = localStorage.getItem('fe_graphicsmode') || false;
  window.fe.hostname = localStorage.getItem('fe_hostname') || "system";
  window.fe.version = "0.3"; // The reported version
  window.fe.startupMsg = localStorage.getItem('fe_startupmsg') || "FreeExecutor " + window.fe.version + "<br>(C) 2022 Doge Clan, Licensed under LGPL 2.1 License";
  window.fe.execGUI = function() {
    alert('Nothing installed at fe.execGUI()! Please use libnix to patch the GUI.');
    window.fe.isTextMode = true;
    window.fe.isGraphicsMode = false;
  }

  /*
    window.fe is a new extension to the Window API that stores the state of FreeExecutor and its modes
    to be exposed to programs that need them. It is essentially a kernel state with GUI modes, etc.
  */

  window.fepkg = {
    installedPackages: ['base_fe-' + window.fe.version], // Packages Installed
    installedCommands: ['clear', 'eval', 'fepkg', 'unset', 'set'], // Used in the help command (To-do: Automate population of this)
    loadAnonymousScript: function(packageName, src, isES6Module = false) {
      const elm = document.createElement('script');
      elm.src = src;
      if (isES6Module) { elm.type = 'module'; } // ES6 Module Fun (NO clue why modules would be used but... alright)
      
      document.body.appendChild(elm);
      
      window.fepkg.installedPackages.push(packageName);
      console.debug(`Sucessfully pushed anymous package ${packageName}`)
    }, // Saves as a package (Persistance does not work yet due to lack of VFS)
    addCommand: function(name, func) {
      window.fepkg.installedCommands.push(name);
      window.fepkg[name] = func;
    } // Add a command to the parser!
  }

  /*
    window.fepkg is a new extension that holds default fepkg data (that is it for now)
  */
  
  window.Math.HALF_PI = Math.PI / 2;
  window.Math.Vector = class NVector {
    constructor(arr) {
      this.dimensions = arr.length;
      this.v = new Int32Array(arr); // Use generic array
    }
    
    add(num) {
      for (let i = 0; i < this.dimensions; i++) {
        this.v[i] += num;
      }
    }
    
    sub(num) {
      for (let i = 0; i < this.dimensions; i++) {
        this.v[i] -= num;
      }
    }
    
    scale(factor) {
      for (let i = 0; i < this.dimensions; i++) {
        this.v[i] *= factor;
      }
    }
    
    multi(vectorToMultiplyBy) {
      const v2 = vectorToMultiplyBy.v;
      const ln = v2.length;
      for (let i = 0; i < ln; i++) {
        this.v[i] = this.v[i] * v2[i];
      }
    } // Multiply by vector
    
    // Hardcoded cool stuff to provide 4d vector hardcoding in an xyzw spec
    get x() {
      return this.v[0];
    }
    
    get y() {
      return this.v[1];
    }
    
    get z() {
      return this.v[2];
    }
    
    get w() {
      return this.v[3];
    }
  }; // A Custom vector class to remove a common library requirement (Vector4/Vector3/Vector2)
  
  /*
    window.Math.* are just some common tools that are added on to window.Math for
    an improvement in the developer experience. (limited so far, will expand later)
  */
  
  window.thread = class WindowThread {
    constructor(src) {
      if (!src) {
        console.error('<br>@thread/constructor: No source given to create thread.');
        return null;
      } else {
        const objURL = window.URL.createObjectURL(src);
        this.worker = new Worker(objURL); // Imagine fixing a problem with only two lines
      }
    }
    
    setEvent(event, src) {
      switch (event) {
        case 'onData':
          this.worker.onmessage = src; // onData for the web worker
          break;
          
        default:
          throw new Error('@thread: Unknown event "' + event + '" passed.');
      }
    }
    
    kill() {
      this.worker.terminate();
    } // Say bye bye worker
  }
  
  /*
    window.thread is a new API that is just a wrapper around the WebWorker to make a way to define
    threads without requiring multiple external JS files (only source is needed)
  */
  
  
  // JavaScript onerror Hook (WIP)
  window.onerror = function(err) {
    console.error('<br>' + err);
    if (window.fe.isTextMode) {
      cmd_string = ""; // Imagine abusing loose scope rules in JavaScript to fix stupid bugs definitely not me
      document.body.innerHTML += `root@${window.fe.hostname}>`; // Add first command line
    } // A mitigation for textMode/GraphicsMode
  }

  // Libnix 1.1 (fe0.3 port of 0.2.1 version with localStorage until fs library is included
  console.log('@system/libnix: Loading Startup Libraries...');
  for (let a in localStorage) {
     a = a.toUpperCase();
     if (a.includes('OS:/USR/LIB/') && a.includes('.FBL')) {
       eval(localStorage[a]); // Eval ISN'T HARMFUL (this can break installs maybe idk)
     }
   }
  
  // JavaScript Console Hooks (for textMode + GUI)
  console.defaultLog = console.log.bind(console);
  console.logs = []; // log history to redisplay
  console.log = function(){
    // default &  console.log()
    console.defaultLog.apply(console, arguments);
    // new & array data
    console.logs.push(Array.from(arguments));
    // add to document.body
    if (window.fe.isTextMode) {
      document.body.innerHTML += console.logs[console.logs.length - 1] + "<br>"; 
      window.scrollTo(0, document.body.scrollHeight);
    } // Get last log and add it if in textMode
  }; // console.log replacement function

  console.defaultWarn = console.warn.bind(console);
  console.warn = function(){
    // default &  console.log()
    console.defaultWarn.apply(console, arguments);
    // new & array data
    console.logs.push(Array.from(arguments));
    // add to document.body
    if (window.fe.isTextMode) {
      document.body.innerHTML += "<span style='color:yellow;'>" + console.logs[console.logs.length - 1] + "</span><br>"; 
      window.scrollTo(0, document.body.scrollHeight);
    } // Get last log and add it if in textMode
  }; // console.error replacement function
  
  console.defaultError = console.error.bind(console);
  console.error = function(){
    // default &  console.log()
    console.defaultError.apply(console, arguments);
    // new & array data
    console.logs.push(Array.from(arguments));
    // add to document.body
    if (window.fe.isTextMode) {
      document.body.innerHTML += "<span style='color:red;'>" + console.logs[console.logs.length - 1] + "</span><br>"; 
      window.scrollTo(0, document.body.scrollHeight);
    } // Get last log and add it if in textMode
  }; // console.error replacement function; // Link this so it sorta works
  
  console.debug = console.log; // They basically are the same thing
  
  console.oldClear = console.clear;
  console.clear = function() {
    console.oldClear();
    console.logs = []; // Fix a random memory leak in pre1
    if (window.fe.isTextMode) {
      document.body.innerHTML = "";
    }
  }; // console.clear replacement function

  console.newLine = function() {
    if (window.fe.isTextMode) {
      document.body.innerHTML += "<br>";
    }
  }; // Adds <br> because it is too common to not be a function
  
  // Clean the Page out of old trash
  document.head.innerHTML = '<meta charset="UTF-8"><title>FreeExecutor ' + window.fe.version + '</title>';
  document.body.innerHTML = '';
  
  // Load Default Stylesheet (JS for now, textMode)
  const style = document.body.style;
  style.margin = "0px";
  style.padding = "0px";
  style.userSelect = "none";
  style.background = "rgb(20, 20, 20)";
  style.color = "rgb(255, 255, 255)";
  style.fontFamily = "monospace";
  style.fontSize = "12px";
  style.overflowX = "hidden"; // for better text overflow (no left scroll, only vert.)

  // Setup Utility (Init Script)
  let fe_setup = localStorage.getItem('fe_setup');
  if (!fe_setup) {
    console.log('Welcome to FreeExecutor ' + window.fe.version);
    console.log('(C) 2022 Doge Clan, Licensed under the LGPL 2.1 License');
    console.newLine();
  
    console.log('Setting Up Default Flags...');
      localStorage.setItem('fe_textmode', true);
      localStorage.setItem('fe_graphicsmode', false);
    console.log('Finishing Setup...');
      localStorage.setItem('fe_setup', true);
    console.log('Done!');
  
    console.clear();
  }

  // Command Parser (Links at window.fe)
  window.fe.commandHistory = []; // This is to give us command history for a later feature
  window.fe.parseCommand = function(cmd) {
    // A Better, Attribute like system for the commands (better *nix compat. + Removes need for .includes() or regex searches)
    let attrib = cmd;
    if (attrib.charAt(0) === " ") {
      attrib = [...attrib];
      attrib.shift();
      attrib = attrib.join('');
    }
  
    attrib = attrib.split(" "); // This works for now.
  
    window.fe.commandHistory.push(cmd);
    
    // Command Search
    switch(attrib[0]) {
      case '':
        console.newLine();
        break; // Like most terminals so we don't get errors without any command (literally any computer ever)
        
      case 'clear':
        console.clear();
        break; // Clear the console
      
      case 'unset':
        let dl = attrib; // toDelete
        dl.shift(); // Remove "delete"
        dl = attrib.toString(); // Change to string form
        dl.replaceAll(',', ' '); // Fix for array0
        localStorage.removeItem('fe_'+dl);
        console.log('<br>Unset '+dl);
        
        break;
        
      case 'eval':
        let evalStr = attrib; // Copy
        evalStr.shift(); // Remove command
        evalStr = evalStr.toString(); // Change to string
        evalStr = evalStr.replaceAll(',', ' '); // Yes, this needs to be improved but it works for now
        
        eval(evalStr); // Evaluate now. Or Else.
        
        console.newLine(); // Add a new line
        
        break; // A Wrapper for eval, no safe guards because users are not implemented yet.
      
      case 'fepkg':
        let flags = attrib;
        flags.shift(); // Remove first element
      
        const flags_ln = flags.length;
        if (flags_ln === 0) {
          console.error('<br>Fatal! No Attributes defined! (Hint: Try --help to see possible options)');
          // To-do: show help
          break;
        } else {
          console.newLine();
          for (let i = 0; i < flags_ln; i++) {
            switch(flags[i]) {
              case '--help':
                console.log('Options:');
                console.log('&ensp;&ensp;--help: Show this menu')
                console.log('&ensp;&ensp;--install-anonymous [name] [source] [isES6](default=false): Install an anonymous script to the page (Not persistant yet)');
                console.log('&ensp;&ensp;--list-installed: List installed packages');
                console.log('&ensp;&ensp;--list-commands: List installed commands');
                break;
              
              case '--install-anonymous':
                let packageName = flags [i + 1] || "unknown-injected-" + window.fe.installedPackages.length;
                let srcStr = flags[i + 2]; // Source to get using fetch as a string
                if (!srcStr) {
                  console.error('Error! No Script Source was defined!');
                  break;
                }
                
                let isES6 = flags[i + 3] || false; // Is the script an ES6 Module?
                
                // Use the window.fs library to fetch a file from srcStr
                const xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                  if (this.readyState == 4) {
                    switch(this.status) {
                      case 0:
                      case 404:
                      case 500:
                        console.error('Failed to install ' + packageName + '(anonymous)')
                        break;
                        
                      case 200:
                        window.fepkg.loadAnonymousScript(packageName, srcStr, isES6);
                        console.log('Installed new package ' + packageName + '(anonymous) ')
                        break;
                    }
                  }
                };
                
                xhttp.open("GET", srcStr, true);
                xhttp.send();
                
                i = flags_ln; // Break statement for grand for loop
                break; // Installs an anonymous script from the source defined in the next parameter (OS/ or http or https)
                
              case '--list-installed':
                const pkg_ln = window.fepkg.installedPackages.length;
                console.log('Installed Packages:')
                for (let j = 0; j < pkg_ln; j++) {
                  console.log('&ensp;&ensp;'+window.fepkg.installedPackages[j]);
                }
              
                i = flags_ln; // Basically a break statement for the for loop
              
                break; // List installed packages
              
              case '--list-commands':
                const cmd_ln = window.fepkg.installedCommands.length;
                console.log('Installed Commands:')
                for (let j = 0; j < cmd_ln; j++) {
                  console.log('&ensp;&ensp;'+window.fepkg.installedCommands[j]);
                }
              
                i = flags_ln; // Basically a break statement for the for loop
                break; 
                
              default:
                console.error('Unknown attribute: '+ flags[i]);
                break;
            }
          }
        }
      
        break; // A Package Manager for FreeExecutor (fepkg)
        
      case 'set':
        let str = attrib;
        str.shift(); // Remove "set"
        str = str.toString(); // Change to string data type
        
        let data = str.substring(str.indexOf('=') + 1); // + 1 to remove = sign
        if (data.includes(',')) {
          str.replaceAll(',', ' ');
        } // Semi-Broken Fix for array data
        
        let dataAsArr = [...str]; // Spread operator is fun! I barely know how to use it!
        if (dataAsArr[0] === 'f' && dataAsArr[1] === 'e' && dataAsArr[2] === '_') {
          for (let i = 0; i < 2; i++) {
            data.shift();
          } // Shift Array 3 times (Probably bad method for code quality)
          
          str = dataAsArr.toString(); // Set str to this to complete fe_ string workaround
        } // Is the first 3 characters fe_? If so, remove these to ensure things don't break due to poor script quality
        
        let toSet = str.slice(0, str.indexOf('='));
        localStorage.setItem('fe_' + toSet, data);
        console.log('<br>Set '+toSet + ' to value '+data);
        
        break;  
      
      case 'savelibnix':
        let prm = prompt('What should this libnix library be called?');
        prm = prm.toUpperCase();
        if (!prm.includes('.FBL')) {
          prm += '.FBL';
        }
        
        if (!prm.includes('OS:/USR/LIB/')) {
          prm = "OS:/USR/LIB/" + prm; // Add
        }
        
        let src = prompt('Insert source code below:');
        if (!src) {
          alert('You need to add source code to the library in order for it to work.');
          break;
        } else {
          localStorage.setItem(prm, src);
        }
        
        break; // A temporary tool so 0.3 can come out earlier and I can develop on it now
        
      default:
        // Since it is not in the hardcoded commands, search the rest of the installed commands and execute a global window.fepkg.[INSERT COMMAND NAME]
        let index = fepkg.installedCommands.indexOf(attrib[0]);
        if (index === -1) {
          console.error(`<br>${attrib[0]} is not a known command or program.`);
        } else {
          let passedOn = attrib;
          window.fepkg[attrib[0]](passedOn); // Pass it on to be executed (Somehow this shit works)
        }
        
        break; // No Command Exists
    }
  }

  // textMode Terminal GUI Utilities
  let cmd_string = "";
  function parseKeyInput_textMode(event) { 
    switch(event.key) {
      case 'Backspace':
      case 'Delete':
        document.body.innerHTML = document.body.innerHTML.substring(0, document.body.innerHTML.length - 1)
        cmd_string = cmd_string.substring(0, cmd_string.length - 1)
        break;
    
      case 'Enter':
        window.fe.parseCommand(cmd_string);
        document.body.innerHTML += `root@${window.fe.hostname}>`;
        cmd_string = ""; // Reset cmd_string in ordewr to allow multiple commands
      
        window.scrollTo(0, document.body.scrollHeight); // QoL fix since this is only enabled on textMode
        break;
    
      case 'Shift':
      case 'Control':
      case 'Escape':
      case 'Meta':
      case 'Alt':
      case 'Tab':
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowUp':
      case 'ArrowDown':
      case '>':
      case '<':
      case '&':
        break; // Some things to not do anything on
      
      default:
        document.body.innerHTML += event.key;
        cmd_string += event.key;
        break; // Default case which is just the character
    }
  }

  // Init Code
  if (window.fe.isTextMode) {
    window.addEventListener("keydown", parseKeyInput_textMode); // Enable Key Stroke Manager

    console.log(window.fe.startupMsg); // Startup message
    document.body.innerHTML += `<br>root@${window.fe.hostname}>`; // Add first command line
  } else if (window.fe.isGraphicsMode) {
    style.overflow = "hidden"; // Hide overflow everywhere to allow a HTML based UI (X+Y)
    window.fe.execGUI();
  }
})(); // I moved the IIFE to an anonymous function to avoid polluting the injectable context.
