


// Función para contar los clientes en una sala específica (room)
const countClientsInRoom = (io, roomName) => {
    const room = io.sockets.adapter.rooms.get(roomName);
    return room ? room.size : 0;
  };
  
  
  // Función para emitir un mensaje a una sala específica
  const emitUpdateArriendo = (io, idFeria, msj) => {
    const size = countClientsInRoom(io, idFeria); // Contamos los clientes en la sala
    if (size !== 0) {
      io.to(idFeria).emit('room_message', { id_feria: idFeria, msj });
      console.log(`Mensaje enviado a la sala ${idFeria}: ${msj}`);
    } else {
      console.log(`No hay usuarios en la sala ${idFeria}. No se ha enviado el mensaje.`);
    }
  };

 module.exports = { countClientsInRoom, emitUpdateArriendo };
