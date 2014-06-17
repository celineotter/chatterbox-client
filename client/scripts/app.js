

// Message = function (username, text, roomname) {
//   this.username = username;
//   this.text = text;
//   this.roomname = roomname;
// };

/*========================================================*/
var app = {
  server : 'https://api.parse.com/1/classes/chatterbox',
  currentuser : 'anonymous',
  roomname: 'lobby2'
};

app.init = function() {
  this.currentuser = this.initUserName();
  this.fetch(this.renderMessages);
};

app.initUserName = function() {
  var stringNameQuery =  window.location.search;
  var nameStartIIndex = stringNameQuery.indexOf('=');
  return stringNameQuery.slice(nameStartIIndex + 1);
};

app.fetch = function(callback) {
  $.ajax({
    url: this.server,
    type: 'GET',
    contentType: 'application/json',
/*    data: 'order=-createdAt',*/
    data: 'where={"roomname": "'+ this.roomname +'"}',
    success: function (data) {
      callback(data);
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive message');
    }
  });
};

app.renderMessages = function(data) {
  var messages = data.results;
  messages = messages.reverse();

  //for (var i= last; i > last -10; i--) {
  for (var i=0; i<messages.length; i++) {
    app.addMessage(messages[i]);
  }
};

app.addMessage = function(message) {
  var msgText = message.text;
  var userName = message.username;

  if (msgText && userName) {
    msgText = msgText.replace('<', '&lt;', 'gi');
    msgText = msgText.replace('>', '&gt;', 'gi');
    //msgText = msgText.replace('$', '', 'gi');
    var currentMessage = '<li class="message">' + message.username + ': ' + msgText + '</li>';
    $('#chats').append(currentMessage);
    console.log(message.roomname, message.username, msgText);
  }
};

app.clearMessages = function () {
  $("#chats").empty();
};

app.send = function(message) {
  $.ajax({
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');

      $(".form-control").val('');

      app.clearMessages();

      app.fetch(app.renderMessages);
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.createMessageObj = function (userinput) {
  var message = {
    username: this.currentuser,
    text: userinput,
    roomname: this.roomname
  };
  app.send(message);
};

app.addRoom = function(roomname) {};

app.init();

/*========================================================*/

$(function() {
  $(".btn").on("click", function () {
    var userinput = $(".form-control").val();
    app.createMessageObj(userinput);
  })

});
