// Patch the Console (PatcherInstance)
function consolePatch() {
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
}

export { consolePatch }
