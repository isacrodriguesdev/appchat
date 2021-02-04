const socketio = require("socket.io-client")

socketio.connect("http://192.168.50.168:3344", {
  secure: false
})