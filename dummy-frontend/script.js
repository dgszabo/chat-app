$(document).ready(function(){
  var socket = io.connect('http://localhost:5000');
  var username;
  var msgCounter = 0;

  $("#loginForm").on('submit', function(e){
    e.preventDefault();
    let username = $("#username").val();
    socket.emit('login', { username }, function(){
      $("#username").val("");
    });
  })

  $("#chatForm").on('submit', function(e){
    e.preventDefault();
    var message = $("#message").val();
    socket.emit('message-to-back', { message }, function(){
      $("#message").val("");
    });
  })

  socket.on('logged-in', function(result) {
    if(result.data) {
      username = result.data.username;
      console.log(username)
      $("#messagesContainer").html("");
      socket.emit('messages-request', { offset: msgCounter })
    } else {
      $("#messagesContainer").html(`<p>${result.error.message}</p>`);
    }
  });

  socket.on('new-messages-to-front', function(result){
    result.data.messages = result.data.messages.map(el => {
      el.date = new Date(el.date);
      return el}
    )
    $("#messagesContainer").html("");
    result.data.messages.map(el => {
      $li = $('<li>').text(`${el.author} says ${el.content} on ${el.date}`);
      $("#messagesContainer").append($li);
    });
    msgCounter = result.data.messages.length;
    console.log(msgCounter)
  });

  socket.on('old-messages-to-front', function(result){
    result.data.messages = result.data.messages.map(el => {
      el.date = new Date(el.date);
      return el}
    )
    result.data.messages.map(el => {
      $li = $('<li>').text(`${el.author} says ${el.content} on ${el.date}`);
      $("#messagesContainer").prepend($li);
    });
    msgCounter += result.data.messages.length;
    console.log(msgCounter);
  });

  socket.on('message-to-front', function(result){
    result.data.messages = result.data.messages.map(el => {
      el.date = new Date(el.date);
      return el}
    )
    result.data.messages.map(el => {
      $li = $('<li>').text(`${el.author} says ${el.content} on ${el.date}`);
      $("#messagesContainer").append($li);
    });
    msgCounter++;
  })

  socket.on('disconnect', function() {
    $("#messagesContainer").html("<p>You are disconnected</p>");
  })

  $('#only-new-btn').on('click', function(event) {
    event.preventDefault();
    socket.emit('messages-request', { only_new: true }, function(){
    })
  });
  
  $('#old-msgs-btn').on('click', function(event) {
    event.preventDefault();
    socket.emit('messages-request', { offset: msgCounter }, function(){
    })
  });
})