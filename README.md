# FreeExecutor
How to load Free Executor.

1. Create a bookmark with these contents:

```
window.addEventListener("beforeunload",function(e){return e.preventDefault(),console.warning("[FEXPLOIT]: Stopped unload attempt."),"pro2"});var currstring="",tmp="";function freeScreen7219_(){document.head.innerHTML="",document.body.innerHTML=""}function boot2fe(){if(null===localStorage.getItem("/AUTOLOAD/BOOT.lnk")){let e=prompt("Please input the .FEBIN to autoboot");if(null===e)return alert("No .FEBIN Listed."),0;localStorage.setItem("/AUTOLOAD/BOOT.lnk",e)}currstring=localStorage.getItem("/AUTOLOAD/BOOT.lnk"),exec_()}function exec_(){if(currstring.includes(".FEBIN")){if(tmp=localStorage.getItem(currstring),null===tmp)return tmp="",alert("No .FEBIN Was Found under this name."),2;document.body.removeEventListener("keydown",keyMGR192B_),eval(tmp),console.log(".FEBIN Executed."),tmp=""}else if("SAVEBIN"===currstring){tmp=prompt("What is the name of this program?"),!1===tmp.includes(".FEBIN")&&(tmp+=".FEBIN"),!1===tmp.includes("/BIN/")&&(tmp="/BIN/"+tmp);let e=prompt("Please paste the minified FEBIN Contents to save.");localStorage.setItem(tmp,e),tmp=""}else if("BOOT2FE"===currstring)boot2fe();else{if("PATCHFS"===currstring){for(var a in localStorage)!0!==a.includes("/BIN/")&&!1===a.includes("function")&&(localStorage.setItem("/BIN/"+a,localStorage[a]),localStorage.removeItem(a),console.log("Fixed bad file "+a));return localStorage.removeItem("/BIN/getItem"),localStorage.removeItem("/BIN/removeItem"),localStorage.removeItem("/BIN/length"),localStorage.removeItem("/BIN/key"),localStorage.removeItem("/BIN/clear"),localStorage.removeItem("/BIN/setItem"),"DONE"}alert("Unknown Command")}}function S15D2_(){document.getElementById("terminal").innerHTML=currstring}function keyMGR192B_(e){var t;if(e.which){if(8===(t=e.which))return tmp=currstring.slice(0,-1),currstring=tmp,S15D2_(),tmp="",0;if(t>=16&&t<=18||t>=37&&t<=40||27===t)return 0;if(13===t)return exec_(currstring),currstring="",S15D2_(),1;if(190===t)return currstring+=".",S15D2_(),0;if(191===t)return currstring+="/",S15D2_(),0}currstring+=String.fromCharCode(t),document.getElementById("terminal").innerHTML+=String.fromCharCode(t)}function shell16A3_(){document.body.id="_shell",document.head.innerHTML+="<title>FreeExecutor 0.1.2 Shell</title><style>body{background:rgb(20,20,40);color:white;font-family:monospace;font-size:14px;overflow:hidden;min-height:100vh;}</style>",document.body.innerHTML+='<span id="_bootmark"> FreeExecutor 0.1.2 <br> (C) 2021 Doge Clan, All Rights Reserved <br> <br> </span>> <span id="terminal"></span> ',document.getElementById("_shell"),document.body.addEventListener("keydown",keyMGR192B_)}function init_(){freeScreen7219_(),null!==localStorage.getItem("/AUTOLOAD/BOOT.lnk")&&boot2fe(),shell16A3_()}init_();
```

2. Visit a website

3. Execute the bookmark

4. Enjoy the shell!

**Commands**

*.FEBIN*: Execute a program

*SAVEBIN*: A Tool to write to the localStorage easily

*PATCHFS*: Fix the FS to update to 0.1.1 Format

*BOOT2FE*: Boots to a FEBIN File (If you want a GUI, here you go)

**Quirks**

- You cannot switch sites to inject to and still have the same programs. Just an anti CORS thing browsers implement. 
- The shell is not advanced and can be buggy when inputting keys. Probably will be fixed soon.
- It clears only head and body tags. If JavaScript is outside those than the shell may keep unneeded or breaking JavaScript.

**Apps**

DumpMe (LocalStorage Item List)
```
document.head.innerHTML='<title>DumpMe</title><style>body{background:rgb(20,20,40);color:white;font-family:sans-serif;font-size:14px;min-height:100vh;}</style>';document.body.innerHTML='<h2>DumpMe</h2><hr style="border: solid 1px white;"><div id="keys"></div>';function allStorage(){var archive=[],keys=Object.keys(localStorage),i=0,key;for(;key=keys[i];i+=1){archive.push(key)}return archive}document.getElementById('keys').innerHTML=allStorage();let f=document.getElementById('keys').innerHTML.replace(/,/g,'<br>');document.getElementById('keys').innerHTML=f;
```
