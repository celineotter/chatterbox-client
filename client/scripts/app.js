var app = {
  server : 'https://api.parse.com/1/classes/chatterbox',
  currentuser : 'anonymous',
  roomname: 'lobby'
};

app.init = function() {
  this.currentuser = this.initUserName();
  this.fetch(this.renderMessages);
  this.fetchRooms(this.renderRooms);
};

app.initUserName = function() {
  var stringNameQuery =  window.location.search;
  var nameStartIIndex = stringNameQuery.indexOf('=');
  return stringNameQuery.slice(nameStartIIndex + 1);
};

app.fetchRooms = function(callback) {
  $.ajax({
    url: this.server,
    type: 'GET',
    contentType: 'application/json',
    data: {
      order: "-createdAt",
    },
    success: function (data) {
      callback(data);
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive rooms');
    }
  });
};

app.renderRooms = function(data) {
  var messages = data.results;
  var results = [];
  var room;

  for (var i=0; i<messages.length; i++) {
    room = messages[i].roomname;
    if (room && room.length > 0) {
      results.push(room);
    }
  }

  // Sort room names
  //results.sort();
  var uniqueRooms = ['Lobby'];
  $.each(results, function(i, element) {
    if ($.inArray(element, uniqueRooms) === -1) {
      uniqueRooms.push(element);
    }
  });

  // TODO: sort is not alphabetical
  uniqueRooms.sort();
  $.each(uniqueRooms, function(i, room) {
    app.addRoom(room);
  });

  $(".roomName").on("click", function (e) {
    e.preventDefault();
    app.roomname = this.text();
    console.log('I got clicked! ' + app.roomname);
    app.fetch();
  });

};

app.addRoom = function(room) {
  var $room = $("<li>").text(room);

  $('#rooms').append('<li class="uniqRoom"><a class="roomLink">' + room + '</a></li>');

};

app.fetch = function(callback) {
  this.clearMessages();
  callback = callback || this.renderMessages;
  console.log('room check', this.getRoomname());
  $.ajax({
    url: this.server,
    type: 'GET',
    contentType: 'application/json',
    data: {
      order: "-createdAt",
      where: {
        roomname: this.getRoomname()
      }
    },
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
  $(".room-label").text(app.getRoomname());

  var messages = data.results;
  //messages = messages.reverse();

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

    var currentMessage = '<li class="message">' + message.username + ': ' + msgText
      + ' ['+ moment(message.createdAt).fromNow() + ']'
      + '</li>';

    $('#chats').append(currentMessage);
    //console.log(message.roomname, message.username, msgText);
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

app.getRoomname = function() {

  var menu = $("#roomName option:selected");
  return menu.text();
};

app.createMessageObj = function (userinput) {
  var message = {
    username: this.currentuser,
    text: userinput,
    roomname: this.getRoomname()
  };
  app.send(message);
};



/*========================================================*/
/*========================================================*/

$(function() {
  app.init();

  $(".btn").on("click", function () {
    var userinput = $(".form-control").val();
    app.createMessageObj(userinput);
  });

  $("#roomName").on("change", function () {
    app.fetch();
  });

  $(".roomName").on("click", function (e) {
    e.preventDefault();
    app.roomname = this.text();
    console.log('I got clicked! ' + app.roomname);
    app.fetch();
  });

});


