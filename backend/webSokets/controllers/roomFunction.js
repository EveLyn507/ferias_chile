


// Función para contar los clientes en una sala específica (room)
const countClientsInRoom = (io, roomName) => {

  
  // Obtén la información de la sala
  const room = io.sockets.adapter.rooms.get(roomName);
  console.log('desde contarRoom:', room);
  
  // Devuelve el tamaño de la sala o 0 si no existe
  return room ? room.size : 0;
};

  
  // Función para emitir un mensaje a una sala específica
  const emitUpdateArriendo = (io, idFeria, msj) => {

    const stringName = typeof idFeria === 'string' ? idFeria : String(idFeria);
    console.log(stringName);
    
    const size = countClientsInRoom(io, stringName); // Contamos los clientes en la sala
    if (size) {
      io.to(stringName).emit('room_message', msj);
      console.log(`Mensaje enviado a la sala ${stringName}: ${msj}`);
    } else {
      console.log(`No hay usuarios en la sala ${stringName}. No se ha enviado el mensaje.`);
    }
  };

 module.exports = { countClientsInRoom, emitUpdateArriendo };
