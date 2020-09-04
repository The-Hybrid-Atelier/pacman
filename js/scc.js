window.NAME = "pacman"
window.VERSION = 1.0
window.start_socket = function(host, port) {
    var socket, url;
    url = 'ws://' + host + ':' + port;
    console.log("Connecting to", url);
    
    socket = new WebSocket(url);
    $(document).unload(function() {
      return socket.close();
    });
    socket.onopen = function(event) {
      var message;
      message = {
        name: window.NAME,
        version: window.VERSION,
        event: "greeting"
      };
      return socket.send(JSON.stringify(message));
    };
    socket.onclose = function(event) {
     console.error("Socket connection lost");
    };
    socket.onmessage = function(event) {
      var stream;
      stream = JSON.parse(event.data);
      if (stream.event) {
        return $(document).trigger(stream.event, stream);
      } else {
        console.log("Client << ", event.data);
      }
    };
    socket.onerror = function(event) {
      console.log("Client << ", event);
      return console.error("<b>Error</b><p>Could not contact socket server at " + url + "</p>");
    };
    socket.jsend = function(message) {
      var headers;
      headers = {
        name: window.NAME,
        version: window.VERSION
      };
      message = _.extend(headers, message);
      if (this.readyState === this.OPEN) {
        this.send(JSON.stringify(message));
        console.log("Client >>", message);
      } else {
        return console.error("Lost connection to server (State=" + this.readyState + "). Refresh?");
      }
    };
    return socket;
  };