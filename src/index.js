'use strict';

module.exports =
function messagingMiddleware( {

  messages: {

    chat: {

      receive: receiveMessageChat = 'chat message',
      send: sendMessageChat = 'chat message',

    } = {},

    room: {

      receive: receiveMessageRoom = 'room message',
      send: sendMessageRoom = 'room message',

    } = {},

    join: joinRoomRequest = 'join room',

    leave: leaveRoomRequest = 'leave room'

  } = {},

  notifications: {

    joinedRoom: joinedRoomNotification = 'You have joined room `{room}`'

  } = {},

  identity = ( handshake ) => {
    return {};
  },

  roomSecurity = ( room, socket, cb ) => {
    return cb( null, {} );
  }

} = {} ) {

  return function messagingHandler( socket, next ) {

    let io = socket.nsp;

    socket.on( receiveMessageChat, ( msg ) => {

      io.emit( sendMessageChat, msg );

    });

    socket.on( receiveMessageRoom, ( room, msg ) => {

      if ( room in socket.rooms ) {

        io.to( room ).emit( sendMessageRoom, {room, msg} );

      }

    });

    socket.on( joinRoomRequest, ( room, cb ) => {

      roomSecurity( room, socket, ( err, user ) => {

        if ( err ) {

          cb( err );

        } else {

          socket.join( room );
          cb( null, buildMessage( joinedRoomNotification, { room }) );

        }

      });

    });

    socket.on( leaveRoomRequest, ( room ) => {

      socket.leave( room );

    });

    next();

  }

}

function buildMessage( str, obj ) {
  return str.replace(/{(\w*)}/g, ( _, key ) => {
    return obj[key];
  });
}
