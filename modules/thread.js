export class WindowThread {
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
        break; // New non-standard events! Fun for the whole dev teams who develop for FreeExecutor!
          
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
  
/*
  window.thread/WindowThread is a new API that is just a wrapper around the WebWorker to make a way to define
  threads without requiring multiple external JS files (only source is needed)
*/