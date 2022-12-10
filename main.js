/*
  FreeExecutor 0.4
  (C) 2022 Doge Clan, Licensed under the LGPL 2.1 License
  ================================================================
  FreeExecutor 0.4 is a major update version of FreeExecutor that makes it usable 
  and gives the tools to finally use it as a daily system (sort-of-ish). This update includes:
   - VFS (finally, about time)
   - Math library improvements (Lots of standard changes)
   - Integrated Time API (Data API Wrapper globally)
   - Network Library (WebSockets)
   - More POSIX Standard Command Compat. (Still not done)
   - Bug fixes (some nasty ones including one that can brick your install due to a bad libnix library)
   - QoL improvements
   - Code Quality Improvements (Fully ES5 Strict Mode Compatible)
*/

import { FECore } from './modules/fecore.js';
import { FEMath } from './modules/math.js';
import { NetworkingInstanceDriver } from './modules/network.js'; // To-do: Rename Export to NetworkingInstance
import { WindowThread } from './modules/thread.js';
import { WindowTime } from './modules/time.js';
import { WindowPage } from './modules/page.js';

import { IHFS1Instance } from './modules/drivers/ihfs1.js'; // IHFS is the VFS Driver (To-do: Maybe add driver interface soon?)

// jshint esnext: true
// Wrapper for FreeExecutor
(function() {
  "use strict"; // Ensure that ES5 strict mode is enabled


  Object.assign(window.Math, window.Math, FEMath); // Object.assign is used over spread to fix a random bug found while using Webpacked versions (0.4.0-rc1)

  window.fe = FECore;
  window.NetworkingInstance = NetworkingInstanceDriver;
  window.thread = WindowThread;
  window.time = WindowTime;
  window.page = WindowPage;

  window.fs = new IHFS1Instance('OS'); // The OS Partition for VFS

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
    window.fepkg is a new extension that is a WIP package manager. It is held within the main script because it is tightly integrated within the core of FreeExecutor
  */
  
  // The Array Addition
  Array.removeFirst2String = function(str) {
    str.shift();
    return str.join(' ');
  }; // Remove First phrase from array
  
  // JavaScript onerror Hook (WIP)
  window.onerror = function(err) {
    console.error('<br>' + err);
    if (window.fe.isTextMode) {
      cmd_string = ""; // Imagine abusing loose scope rules in JavaScript to fix stupid bugs definitely not me (This is because cmd_string is not defined until late in the program)
      document.body.innerHTML += `root@${window.fe.hostname}>`; // Add first command line
    } // A mitigation for textMode/GraphicsMode
  }

  // Libnix 1.1 (fe0.3 port of 0.2.1 version with localStorage until fs library is included
  console.log('@system/libnix: Loading Startup Libraries...');
  for (let a in localStorage) {
     a = a.toUpperCase();
     if (a.includes('OS:/USR/LIB/') && a.includes('.FBL')) {
       try {
       eval(localStorage[a]); // Eval ISN'T HARMFUL
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

  console.write = function(data) {
    console.defaultLog(data);
    if (window.fe.isTextMode) {
      document.body.innerHTML += data;
      window.scrollTo(0, document.body.scrollHeight);
    }
  }; // console.write with no <br>
  
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
      oldPrompt(question, placeholder); // Not ready yet, this is hard to do within the current codebase
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
  style.background = localStorage.getItem('fe_background_color') || "rgb(20, 20, 20)";
  style.color = localStorage.getItem('fe_foreground_color') || "rgb(255, 255, 255)";
  style.fontFamily = "monospace";
  style.fontSize = "12px";
  style.overflowX = "hidden"; // for better text overflow (no left scroll, only vert.)

  // Setup Utility (Init Script)
  let fe_setup = localStorage.getItem('fe_setup');
  let fe_setupversion = localStorage.getItem('fe_setupversion'); // To-do: Add a system to check if the reported version matches the setup version
  if (!fe_setup || !fe_setupversion) {
    console.log('Welcome to FreeExecutor ' + window.fe.version);
    console.log('(C) 2022 Doge Clan, Licensed under the LGPL 2.1 License');
    console.newLine();
  
    console.log('Setting Up Default Flags...');
      localStorage.setItem('fe_textmode', true);
      localStorage.setItem('fe_graphicsmode', false);
      localStorage.setItem('fe_use_highaccuracy_timer', false);
    console.log('Finishing Setup...');
      localStorage.setItem('fe_setupversion', window.fe.version);
      localStorage.setItem('fe_setup', true);
    console.log('Done!');
  
    console.clear();
  }

  // Command Parser (Links at window.fe)
  window.fe.commandHistory = []; // This is to give us command history for a later feature
  window.fe.parseCommand = function(cmd, options = {}) {
    // A Better, Attribute like system for the commands (better *nix compat. + Removes need for .includes() or regex searches)
    let attrib = cmd;
    if (attrib.charAt(0) === " ") {
      attrib = [...attrib];
      attrib.shift();
      attrib = attrib.join('');
    }
  
    attrib = attrib.split(" "); // This works very well suprisingly
  
    // Options (Helps commands fix linebreaking)
    const op = options;
    const isCLI = op.isCLI || false;
    if (isCLI) {
      window.fe.commandHistory.push(cmd);
    } 
    
    // Command Search
    switch(attrib[0]) {
      case '':
      case '#!/bin/sh': // Stub /bin/sh for proper purposes (POSIX Compat.)
        if (isCLI) {
          console.newLine();
        }
        
        break; // Basic stubbed commands/inputs
        
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
        if (isCLI) {
          console.log('<br>Created alias named '+ setData + ' to run ' + dta);
        }
        
        break; // Alias ported command from bash (This is now since the environment is more complex)
        
      case 'clear':
        console.clear();
        break; // Clear the console
      
      case 'unset':
        let dl = Array.removeFirst2String(attrib);
        
        localStorage.removeItem('fe_' + dl);
        
        if (isCLI) {
        console.log('<br>Unset ' + dl);
        }
          
        break;
        
      case 'echo':
        let printdata = attrib;
        printdata.shift();
        printdata = printdata.join(' ');
        
        if (isCLI) {
          console.log('<br>'+printdata);
        }
        
        break;
        
      case 'eval':
        let evalStr = Array.removeFirst2String(attrib);
        
        eval(evalStr); // Evaluate now. Or Else.
        
        if (isCLI) {
          console.newLine(); // Add a new line
        }
          
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
                  console.log('&ensp;&ensp;' + window.fepkg.installedPackages[j]);
                }
              
                i = flags_ln; // Basically a break statement for the for loop
              
                break; // List installed packages
              
              case '--list-commands':
                const cmd_ln = window.fepkg.installedCommands.length;
                console.log('Installed Commands:')
                for (let j = 0; j < cmd_ln; j++) {
                  if (j % 4 === 0 && j !== 0) {
                    console.write('&ensp;&ensp;'+window.fepkg.installedCommands[j]);
                    console.newLine();
                  } else {
                    console.write('&ensp;&ensp;'+window.fepkg.installedCommands[j]);
                  } // To-do: Fix edge case of j = 0 fully
                }
                
                console.newLine();
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
        
        if (isCLI) {
          console.log('<br>Set '+ toSet + ' to value ' + str);
        }
        
        break;  // Set command but better written
      
      case 'savelibnix':
        if (!isCLI) {
          console.error('savelibnix: Cannot run savelibnix when not in a CLI instance!');
          return null;
        }
        
        let prm = prompt('What should this libnix library be called?');
        console.log(prm);
        if (prm === "" || !prm) {
          console.error('<br>savelibnix: No name added!');
          return null;
        }
          
        
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
          console.error(`<br>${attrib[0]} is not a known location, file, or program.`);
        } else {
          let passedOn = attrib;
          window.fepkg[attrib[0]](passedOn); // Pass it on to be executed (Somehow this shit works)
        }
        
        break; // No Command Exists
    }
  }; // Parse command (Hardcoded + Added)
  
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
        window.fe.parseCommand(cmd_string, { isCLI: true });
        console.write(`${window.fe.currentUser}@${window.fe.hostname}|OS:/>`);
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
      case 'F1':
      case 'F2':
      case 'F3':
      case 'F4':
      case 'F5':
      case 'F6':
      case 'F7':
      case 'F8':
      case 'F9':
      case 'F10':
      case 'F11':
      case 'F12':
        break; // Some things to not do anything on
      
      default:
        console.write(event.key);
        cmd_string += event.key;
        break; // Default case which is just the character
    }
  }
  
  // Init. Code
  if (localStorage.getItem('fe_use_highaccuracy_timer') === "true") {
    window.Timer = setInterval(time.update, 500);
  } else {
    window.Timer = setInterval(time.update, 1000);
  }
  
  if (!window.fe.isNotCompatibleWithBrowser) {
    console.write('Fatal! FreeExecutor ' + window.fe.version + ' could not find all required APIs within the browser!<br>Please update your browser.');
  } // If Required APIs do not exist within the browser engine 
  else if (window.fe.isTextMode) {
    time.update(); // Ensure that the time is updated and ready to be used (for the Trans Easter Egg)
    window.addEventListener("keydown", parseKeyInput_textMode); // Enable Key Stroke Manager

    console.log(window.fe.startupMsg); // Startup message
    
    if (time.month === 11 && time.day === 20) { // Nov. 20th, Trans Remembrance Day 
      document.body.innerHTML += `<span style='color:cyan'>Doge</span> <span style='color:pink'>Clan</span> says <span style='color:pink;'>Trans</span> <span style='color:cyan;'>Rights!</span><br><br>${window.fe.currentUser}@${window.fe.hostname}|OS:/>`; // Add first command line, but trans its gender
    } else {
      document.body.innerHTML += `<br>${window.fe.currentUser}@${window.fe.hostname}|OS:/>`; // Add first command line
    }
  } else if (window.fe.isGraphicsMode) {
    style.overflow = "hidden"; // Hide overflow everywhere to allow a HTML based UI (X+Y)
    window.fe.execGUI();
  } else {
    localStorage.setItem('fe_textmode', true);
    localStorage.setItem('fe_graphicsmode', false);

    console.write('Fatal! Invalid boot mode configuration (false:false). The boot modes have been reset to their default.<br>Please restart FreeExecutor to boot.')
  }
})(); // I moved the IIFE to an anonymous function to avoid polluting the injectable context.
