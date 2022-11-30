/*
  FreeExecutor 0.4
  (C) 2022 Doge Clan, Licensed under the LGPL 2.1 License
  ================================================================
  FreeExecutor 0.4 is a major update version of FreeExecutor that makes it usable 
  and gives the tools to finally use it as a daily system (sort-of-ish). This update includes:
   - VFS (finally, about time)
   - Math library improvements (Lots of standard changes, Linear Algebra integrated)
   - Canvas2D Renderer with ProcessingJS-ish syntax (Now you really can build your own GUI)
   - Command aliases (Not important but alright)
   - Bug fixes (some nasty ones including one that can brick your install due to a bad libnix library)
   - QoL improvements (echo command added)
   - Code Quality Improvements (Fully ES5 Strict Mode Compatible)
*/


// jshint esnext: true
// Wrapper for FreeExecutor
(function() {
  "use strict"; // Ensure that ES5 strict mode is enabled
  
  // JavaScript Extensions
  window.page = {
    url: window.location.href,
    isGoGuardian: window.location.href.includes('blocked.goguardian.com'), // I found a way to extract random info from the ctx string of this site. For that random feature used in 0.4 versions.
    isLocal: window.location.href.includes("C:") || window.location.href.indexOf('/') === 0 // Saved File (Windows/NT), Saved File (unix/unix like)
  };

  /*
    window.page is a new extension to the Window API that can be used to get various information
    on the injected page from a bookmarklet perspective
  */
  
  window.fe = { };
  
  window.fe.isTextMode = localStorage.getItem('fe_textmode') || true; // is FreeExecutor in Text Mode?
  window.fe.isGraphicsMode = localStorage.getItem('fe_graphicsmode') || false; // is FreeExecutor in Graphics Mode?
  window.fe.hostname = localStorage.getItem('fe_hostname') || "system"; // Hostname of the install?
  window.fe.sharedMemorySize = localStorage.getItem('fe_sharedmem_size') || 1024; // The size of window.fe.sharedMemory
  window.fe.version = "0.4"; // The reported version of FreeExecutor
  window.fe.startupMsg = localStorage.getItem('fe_startupmsg') || "FreeExecutor " + window.fe.version + "<br>(C) 2021-2022 Doge Clan, Licensed under LGPL 2.1 License"; // Greeting Message on boot
  window.fe.currentUser = 'root'; // root = default, baseplate for multi-user system when VFS gets added
  window.fe.sharedMemory = new Uint8Array(window.fe.sharedMemorySize); // Shared Memory in browser (1024 entries by default, 1KB)
  window.fe.execGUI = function() {
    alert('Nothing installed at fe.execGUI()! Please use libnix to patch the GUI.');
    window.fe.isTextMode = true;
    window.fe.isGraphicsMode = false;
  }; // What to do when executing GUI. (To-do: Move to window.fe.user to seperate user managed and system managed)

  window.fe.isCompatibleWithBrowser = !window.MSInputMethodContext && !document.documentMode || // IE 11 Case (IE 10 and below will likely not execute)
                                      !window.WebSocket || // Web Socket
                                      !window.localStorage; // Local Storage Check (Probably will crash before we get this far)
  
  /*
    window.fe is a new extension to the Window API that stores the state of FreeExecutor and its modes
    to be exposed to programs that need them. It is essentially a kernel state with GUI modes, etc.
  */

  window.fepkg = {
    installedPackages: ['base_fe-' + window.fe.version], // Packages Installed
    installedCommands: ['alias', 'clear', 'eval', 'echo', 'fepkg', 'unset', 'savelibnix', 'set'], // Used in the help command (To-do: Automate population of this)
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
  
  window.C2DInstance = class Canvas2DRenderer {
    constructor(canvas, width = 400, height = 400) {
      if (!canvas || canvas.toUpperCase() === 'NONE') {
        this.canvas = document.createElement('canvas');
        this.canvas.height = height;
        this.canvas.width = width;
        
        document.body.appendChild(this.canvas);
      } else {
        this.canvas = canvas;
        this.canvas.height = height;
        this.canvas.width = width;
      }
      
      this.height = height;
      this.width = width;
      
      this.ctx = this.canvas.getContext('2d');
      if (!this.ctx) {
        console.error('@c2dinstance/constructor: Could not get context. Is your browser up to date?');
        return null;
      }
    }
    
    resize(width, height) {
      this.width = width;
      this.height = height;
      
      this.canvas.width = width;
      this.canvas.height = height;
    }
    
    fill(r = 255, g = r, b = r, a = 1) {
      this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    
    get currentFill() {
      return this.ctx.fillStyle;
    }
  }
  
  /*
    window.C2DInstance is a new extension to FreeExecutor that is a basic rendering framework for
    2D graphics using the canvas 2d API built in to all modern browsers. Mostly used within UI
    creation/basic games.
  */
  
  // Misc.
  window.Math.HALF_PI = Math.PI / 2; // Half Pi is now usable since it is very common
  window.Math.average = function(numArr) {
    let ln = numArr.length;
    if (!ln) { console.error('@math/average: Non-array data passed. Make sure the average data is in an array!'); return null; }
    let sum = 0; // Sum of all numbers
    for (let i = 0; i < ln; i++) {
      sum += numArr[i];
    }
    
    return sum / ln; // The mean, in a function
  }; // Calculates average of an array :P
  
  // Linear Algebra
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
    
    // Hardcoded cool stuff to provide 4d vector hardcoding in an xyzw spec that many programs use (This is basically PVector sorta)
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
  }; // A Custom vector class to remove a common library requirement (Vector4/Vector3/Vector2 uses this to save lines of code, they literally are wrappers to NVector)
  
  // Cool Hardcoded Math Extensions that are aliases to various Linear Algebra parts
  window.Math.Vector2 = class Vector2 {
    constructor(x, y) {
      return new Math.Vector([x, y]);
    }
  }
  
  window.Math.Vector3 = class Vector3 {
    constructor(x, y, z) {
      return new Math.Vector([x, y, z]);
    }
  }
  
  window.Math.Vector4 = class Vector4 {
    constructor(x, y, z, w) {
      return new Math.Vector([x, y, z, w]);
    }
  }
  
  if (localStorage.getItem('fe_no_multinamespaces') === "false") {
    window.math = window.Math; // Make sure that Math.* can be accessed at math.* for style purposes
  }
  
  /*
    window.Math.* are just some common tools that are added on to window.Math for
    an improvement in the developer experience, including some basic linear algebra tools that
    can be used in game development (a standard library).
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
    
    on(event, func) {
      switch (event) {
        case 'onData':
          this.worker.onmessage = func; // onData for the web worker
          break;
          
        case 'onKill':
          this.worker.onkill = func;
          break; // New non-standard events! Fun for the whole dev team!
          
        default:
          console.error('@thread/eventsetter: Unknown event "' + event + '" passed.'); // Change to console.error for consistency in code
          break;
      }
    } // .on() is a cleaner API than setEvent() hence it will be used for now on (a lot of libraries use .on() anyways)
    
    kill() {
      if (this.worker.onkill) {
          this.worker.onkill();
      }
      
      this.worker.terminate();
    } // Say bye bye worker
  }
  
  // The Array OBJ Expansion
  Array.removeFirst2String = function(str) {
    str.shift();
    return str.join(' ');
  }; // Remove First phrase from array
  
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
       try {
       eval(localStorage[a]); // Eval ISN'T HARMFUL (this can break installs maybe idk)
       } catch(e) {
         a = a.substring(4, a.length); // Cut string "OS:/" from a
         a = "OS:/" + a.toLowerCase(); // rest should be lowercase because the emulated filesystem structure is FHS-like
         console.error('@system/libnix: Failed to load FE Boot Library from ' + a)
       }
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
  
  console.oldClear = console.clear;
  console.clear = function() {
    console.oldClear();
    console.logs = []; // Fix a random memory leak in pre1 (console.logs was never cleared)
    if (window.fe.isTextMode) {
      document.body.innerHTML = "";
    }
  }; // console.clear replacement function

  console.newLine = function() {
    if (window.fe.isTextMode) {
      document.body.innerHTML += "<br>";
    }
  }; // Adds <br> because it is too common to not be a function
  
  // alert/prompt patches
  const oldAlert = alert;
  window.alert = function(data) {
    if (window.fe.isTextMode) {
      console.log('<br>' + data);
    } else {
      oldAlert(data);
    }
  }; // alert but not stupid
  
  const oldPrompt = prompt;
  window.prompt = function(question, placeholder) {
    if (window.fe.isTextMode) {
      oldPrompt(question, placeholder); // Not ready yet, this is hard to do.
    } else {
      oldPrompt(question, placeholder);
    }
  }
  
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
      localStorage.setItem('fe_no_multinamespaces', false);
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
        
      case 'alias':
        let s = Array.removeFirst2String(attrib);
    
        // Does = not exist?
        if (!s.includes('=')) {
          console.error('<br>Cannot create alias without anything being set!');
          break;
        } 
        
        // Some variables of the alias itself
        let dta = s.substring(s.indexOf('=') + 1); // + 1 to remove = sign
        let setData = s.slice(0, s.indexOf('=')); // What are we setting dta = to?
        
        // Does it have the same name as an existing command?
        if (fepkg.installedCommands.indexOf(setData) !== -1) {
          console.error('<br>Cannot use already taken command/alias name for an alias!');
          break;
        }
        
        // We are good, add the command to fepkg and let default case run it
        window.fepkg.addCommand(setData, function(){window.fe.parseCommand(dta);});
        console.log('<br>Created alias named '+ setData + ' to run ' + dta);
        
        break; // Alias ported command from bash (This is now since the environment is more complex)
        
      case 'clear':
        console.clear();
        break; // Clear the console
      
      case 'unset':
        let dl = Array.removeFirst2String(attrib);
        
        localStorage.removeItem('fe_'+dl);
        console.log('<br>Unset '+dl);
        
        break;
        
      case 'echo':
        let printdata = attrib;
        printdata.shift();
        printdata = printdata.join(' ');
        
        console.log('<br>'+printdata);
        break;
        
      case 'eval':
        let evalStr = Array.removeFirst2String(attrib);
        
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
              
              case '--update':
                break; // Fetch the repo
                
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
        let str = Array.removeFirst2String(attrib);
        let tstr = str.split('=');
        str = tstr[1]; // Set str to split
        let toSet = tstr[0];
        if (toSet.charAt(0) === 'f' && toSet.charAt(1) === 'e' && toSet.charAt(2) === '_') {
          toSet = toSet.split('fe_')[1];
        } // Support extra style
        
        localStorage.setItem('fe_' + toSet, str);
        console.log('<br>Set '+ toSet + ' to value ' + str);
        break;  // Set command but better written
      
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
  } // Parse command (Hardcoded + Added)
  
  window.fe.executeSH = function(script) {
    let toParse = script.split('\n');
    let ln = toParse.length;
    if (ln > 0) {
      for (let i = 0; i < ln; i++) {
        window.fe.parseCommand(toParse[i]);
      }
    } else {
      console.error('@fe/execsh: Cannot parse script with zero lines!');
      return null;
    }
  }; // Parse an SHell file (.sh) saved to VFS (Or just in pinned memory as a multiline)

  // textMode Terminal GUI Utilities
  let cmd_string = ""; // the current held string
  function parseKeyInput_textMode(event) { 
    switch(event.key) {
      case 'Backspace':
      case 'Delete':
        document.body.innerHTML = document.body.innerHTML.substring(0, document.body.innerHTML.length - 1)
        cmd_string = cmd_string.substring(0, cmd_string.length - 1)
        break;
    
      case 'Enter':
        window.fe.parseCommand(cmd_string);
        document.body.innerHTML += `${window.fe.currentUser}@${window.fe.hostname}|OS:/>`;
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

  // Init. Code
  if (!window.fe.isCompatibleWithBrowser) {
    document.body.innerHTML = 'Fatal! FreeExecutor ' + window.fe.version + ' could not find all required APIs within the browser!<br>Please update your browser.';
  } // If Required APIs do not exist within the browser engine 
  else if (window.fe.isTextMode) {
    window.addEventListener("keydown", parseKeyInput_textMode); // Enable Key Stroke Manager

    console.log(window.fe.startupMsg); // Startup message
    document.body.innerHTML += `<br>${window.fe.currentUser}@${window.fe.hostname}|OS:/>`; // Add first command line
  } else if (window.fe.isGraphicsMode) {
    style.overflow = "hidden"; // Hide overflow everywhere to allow a HTML based UI (X+Y)
    window.fe.execGUI();
  }
})(); // I moved the IIFE to an anonymous function to avoid polluting the injectable context.
