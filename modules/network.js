export class NetworkingInstance {
  constructor(url, onmessageCallback, wsoptions = {}) {
    if (!url) {
      console.error('@networkinstance/constructor: URL not provided.');
      return null;
    }
      
    if (!onmessageCallback) {
      console.error('@networkinstance/constructor: onmessageCallback not provided.');
      return null;
    }
      
    this.connectionURL = url;
      
    this.connectionActive = false;
    this.connectionSocket = new WebSocket(this.connectionURL.url, wsoptions);
    this.connectionSocket.onopen = function(e) {
      console.debug('@networkinstance/socketconnection: Connected to ' + url);
      this.connectionActive = true;
    }; // Socket just opened 
      
    this.connectionSocket.onerror = function(e) {
      console.error('Uncaught Socket Error: ' + e);
    }
      
    this.connectionSocket.onclose = function(e) {
      if (e.wasClean) {
        console.debug('@networkinstance/socketclose: Connection closed (safely).');
      } else {
        switch (e.code) {
          case 1000:
            console.warn('@networkinstance/socketclose: Code 1000 was not marked as clean. This is a clear bug within the API!');
            return 1000; // Success, will send a warning about the invalid behavior
              
          case 1006:
            if (navigator.onLine) {
              console.error('@networkinstance/socketclose: Server-connection lost. (Server likely went down)');
            } else {
              console.error('@networkinstance/socketclose: Server-connection lost. (Internet connection was lost)');
            }
              
            return 1006; // Case 1006 (Connection lost, no close frame)
              
          case 1009:
            console.error('@networkinstance/socketclose: Message too big. The software using NetworkInstance is likely buggy and not well written.');
            return 1009; // Case 1009 (Message too big)
             
          case 1011:
            console.error('@networkinstance/socketclose: Unexpected Server Error.');
            return 1011; // Case 1011 (Unexpected Server Error)
              
          default:
            console.error('@networkinstance/socketclose: Socket connection lost for unknown reason.');
            return e.code; // Some code not covered within the API
        }
      }
    }; // The network dropped, find the probable reason
      
    this.connectionSocket.onmessage = onmessageCallback; // Run a callback provided via a passed function
  }
    
  send(data) {
    if (this.connectionSocket.readyState === 1) {
      this.connectionSocket.send(data);
    } else {
      console.error('@networkinstance/datasend: Data send did not go through. (readyState =/= 1)')
    }
  }

	kill() {
		this.connectionSocket.close(); // Why was this not in RC1?
	}
}
  
/*
  window.NetworkingInstance/NetworkingInstanceDriver is a new extension to FreeExecutor that simply wraps around WebSockets to allow development
  of programs that can hijack networking sockets on the same origin or connect to cross-origin sockets.
*/