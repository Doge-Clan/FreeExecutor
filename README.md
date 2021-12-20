# FreeExecutor
How to load Free Executor.

1. Create a bookmark with these contents:

```
javascript:window.addEventListener("beforeunload",function(e){return e.preventDefault(),console.warning("[FEXPLOIT]: Stopped unload attempt. Is GoGuardian attempting to unload this?"),"blockedunload"});let currstring="",tmp="",libraries=[],currstring_history=[];const libnix=function(data){if("startup"===data){for(var a in tmp=0,console.log("[LIBNIX]: Loading Startup Libraries..."),localStorage)(a.includes("/usr/lib/")&&a.includes(".nlib")||a.includes("/usr/lib/")&&a.includes(".NLIB"))&&(tmp+=1,libraries[libraries.length]=a,eval(localStorage[a]),localStorage("Loaded Library "+a));console.log("[LIBNIX]: Loaded "+tmp+" libraries."),tmp=""}},boot2fe=function(){if(null==localStorage.getItem("/boot/sys.lnk")){let e=prompt("Please input the .FEBIN to autoboot");if(null===e)return alert("No .FEBIN Listed."),0;localStorage.setItem("/boot/sys.lnk",e)}currstring=localStorage.getItem("/boot/sys.lnk"),exec_()},patchfs_=function(){for(var e in console.log("Patching FS..."),localStorage)!0!==e.includes("/usr/bin/")&&!1===e.includes("function")&&(localStorage.setItem("/usr/bin/"+e,localStorage[e]),localStorage.removeItem(e),console.log("Fixed bad file "+e));return localStorage.removeItem("/usr/bin/getItem"),localStorage.removeItem("/usr/bin/removeItem"),localStorage.removeItem("/usr/bin/length"),localStorage.removeItem("/usr/bin/key"),localStorage.removeItem("/usr/bin/clear"),localStorage.removeItem("/usr/bin/setItem"),"null"!=localStorage.getItem("/AUTOLOAD/BOOT.lnk")&&(localStorage.setItem("/boot/sys.lnk",localStorage.getItem("/AUTOLOAD/BOOT.lnk")),localStorage.removeItem("/AUTOLOAD/BOOT.lnk")),console.log("Patched FS to 0.2.0 standards."),"DONE"},exec_=function(){if(currstring_history[currstring_history.length]=currstring,currstring.includes(".FEBIN")||currstring.includes(".febin")||currstring.includes("/usr/bin/")||"/boot/sys.lnk"===currstring){if(tmp=localStorage.getItem(currstring),null===tmp)return tmp="",alert("No .FEBIN Was Found under this name."),2;document.body.removeEventListener("keydown",keyMGR192B_),eval(tmp),tmp="",document.body.addEventListener("keydown",keyMGR192B_),console.log(".FEBIN Executed.")}else if("savebin"===currstring||"/usr/bin/savebin"===currstring){tmp=prompt("What is the name of this program?"),!1===tmp.includes(".FEBIN")&&!1===tmp.includes(".febin")&&(tmp+=".febin"),!1===tmp.includes("/usr/bin/")&&(tmp="/usr/bin/"+tmp);let e=prompt("Please paste the minified FEBIN Contents to save.");localStorage.setItem(tmp,e),tmp=""}else if("boot2fe"===currstring||"/usr/bin/boot2fe"===currstring)boot2fe();else if("patchfs"===currstring||"/usr/bin/patchfs"===currstring)patchfs_();else if(currstring.includes("echo")||currstring.includes("/usr/bin/echo")){let e;tmp=currstring.includes("/usr/bin/echo")?currstring.split("/usr/bin/echo "):currstring.split("echo "),e=tmp.slice(1),alert(e),tmp="",e=null}else"/usr/lib/"===currstring?alert(currstring+" is a directory."):alert("Unknown Command")},keyMGR192B_=function(e){let t,r=e.key,n=document.getElementById("terminal");if(/^[a-z]$/i.test(r)&&(t=e.shiftKey),t)currstring+=r,document.getElementById("terminal").innerHTML+=r;else{if(e.keyCode>=16&&e.keyCode<=18||e.keyCode>=37&&e.keyCode<=40)return 0;if(8===e.keyCode)return tmp=currstring.slice(0,-1),currstring=tmp,tmp="",n.innerHTML=currstring,0;if(13===e.keyCode)return exec_(),currstring="",n.innerHTML=currstring,0;currstring+=r.toLowerCase(),n.innerHTML+=r.toLowerCase()}},shell16A3_=function(){document.body.id="_shell",document.head.innerHTML+='<title>FreeExecutor 0.2.0 Shell</title><style>body{background:rgb(20,20,40);color:white;font-family:"IBM Plex Mono",monospace;font-size:14px;overflow:hidden;min-height:100vh;}</style><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap" rel="stylesheet">',document.body.innerHTML+='<span id="_bootmark"> FreeExecutor 0.2.0 <br>(C) 2021 Doge Clan, Licensed under the LGPL 2.1 License<br><br> </span>> <span id="terminal"></span> ',document.body.addEventListener("keydown",keyMGR192B_)},init_=function(){document.head.innerHTML="",document.body.innerHTML="",null!==localStorage.getItem("/boot/sys.lnk")&&boot2fe(),libnix("startup"),shell16A3_()};init_();
```

2. Visit a website

3. Execute the bookmark

4. Enjoy the shell!

**Commands**

*.febin*: Execute a program

*savebin*: A Tool to write to the localStorage easily

*patchfs*: Fix the FS to update to modern formats

*boot2fe*: Boots to a FEBIN File (If you want a GUI, here you go)

*echo*: Prints some text to an alert

**Quirks**

- You cannot switch sites to inject to and still have the same programs. This can't be fixed sadly.
- It clears only head and body tags. If JavaScript is outside those than the shell may keep unneeded or breaking JavaScript.
- Boot2FE is currently broken (0.2.1 should release with a patch for this)
- Swapping apps that override the Ui and not calling ```init_()``` will not work as of 0.2.0 with new security measures (const can't be overriden)

**Apps**

DumpMe (LocalStorage Item List)
```
document.head.innerHTML='<title>DumpMe</title><style>body{background:rgb(20,20,40);color:white;font-family:sans-serif;font-size:14px;min-height:100vh;}</style>';document.body.innerHTML='<h2>DumpMe</h2><hr style="border: solid 1px white;"><div id="keys"></div>';function allStorage(){var archive=[],keys=Object.keys(localStorage),i=0,key;for(;key=keys[i];i+=1){archive.push(key)}return archive}document.getElementById('keys').innerHTML=allStorage();let f=document.getElementById('keys').innerHTML.replace(/,/g,'<br>');document.getElementById('keys').innerHTML=f;
```
