$(document).ready(function(){
  var socket = io.connect('http://localhost:5000');

  // var username = prompt("whats your name?");
  // socket.emit('join', username);

  $("#chatForm").on('submit', function(e){
    e.preventDefault();
    var message = $("#message").val();
    socket.emit('messages',message)
    $("#message").val("");
  })

  socket.on('messages', function(data){
    $message = $("<li>", {
      text: `${data.username} says ${data.message}`
    })
    $("#messagesContainer").append($message);
  })

  socket.on('connected', function(result){
    console.log(result)
  })

  // socket.on("removeChatter", function(name){
  //   $("#chatters li[data-name=" + name +"]").remove()
  // })

  // $('button').on('click', function(event) {
  //   event.preventDefault();
  //   console.log('you pressed ping!');
  // });
})