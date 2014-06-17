

// Message = function (username, text, roomname) {
//   this.username = username;
//   this.text = text;
//   this.roomname = roomname;
// };

/*========================================================*/
var app = {
  server : 'https://api.parse.com/1/classes/chatterbox',
  currentuser : 'anonymous',
  roomname: '_codersRoom'
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
    data: 'order=-createdAt', //JSON.stringify(message),
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
    var msgText = messages[i].text;
    var userName = messages[i].username;

    if (msgText && userName) {
      msgText = msgText.replace('<', '&lt;', 'gi');
      msgText = msgText.replace('>', '&gt;', 'gi');
      //msgText = msgText.replace('$', '', 'gi');
      var currentMessage = '<li class="message">' + messages[i].username + ': ' + msgText + '</li>';
      $('.messageList').append(currentMessage);
      console.log(messages[i].createdAt, messages[i].username, msgText);
    }
  }
};



app.send = function() {

  // input text -

  var message = {
    username: this.currentuser,
    text: text,
    roomname: roomname
  }


  var msg = new Message(currentuser, 'blah', 'room');
  $.ajax({
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.init();
