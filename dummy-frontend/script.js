$(document).ready(function(){
  var socket = io.connect('http://localhost:5000');

  // var username = prompt("whats your name?");
  // socket.emit('join', username);

  let msgCounter = 0;

  $("#chatForm").on('submit', function(e){
    e.preventDefault();
    var message = $("#message").val();
    var user = 'Jim';
    socket.emit('message-to-back',message, user, function(){
      $("#message").val("");
    });
  })

  socket.on('connected', function(result){
    result.data.messages = result.data.messages.map(el => {
      el.date = new Date(el.date);
      return el}
    )
    result.data.messages.map(el => {
      $li = $('<li>').text(`${el.author} says ${el.content} on ${el.date}`);
      $("#messagesContainer").append($li);
    });
    msgCounter = result.data.messages.length;
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
  });

  socket.on('old-messages-to-front', function(result){
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
  });

  socket.on('message-to-front', function(result){
    result.data.messages = result.data.messages.map(el => {
      el.date = new Date(el.date);
      return el}
    )
    result.data.messages.map(el => {
      $li = $('<li>').text(`${el.author} says ${el.content} on ${el.date}`);
      $("#messagesContainer > ul").append($li);
    });
    msgCounter++;
  })

  $('#only-new-btn').on('click', function(event) {
    event.preventDefault();
    socket.emit('messages-request', { only_new: true }, 'Jim', function(){
      console.log('you pushed the only new button')
    })
  });
  
  $('old-msgs-btn').on('click', function(event) {
    event.preventDefault();
    socket.emit('message-to-back', 'Message sent to back!', function(){
      console.log('you pushed ping button')
    })
  });
})