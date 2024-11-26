
const axios = require('axios');
const WebpayPlus = require('transbank-sdk').WebpayPlus;

// Crear una instancia de Axios con un timeout
const axiosInstance = axios.create({
  timeout: 180000 // 30 segundos
});
WebpayPlus.Transaction.client = axiosInstance;



const { emitUpdateArriendo } = require('./roomFunction')


const cambiar_estado_arriendo = async (pool , id_arriendo_puesto, disponible ) => {

 console.log('cambiando arriendo' ,disponible );
 
  const result = await pool.query(`
    UPDATE arriendo_puesto 
    SET id_estado_arriendo = $2
    WHERE id_arriendo_puesto = $1 
    RETURNING *;
  `, [id_arriendo_puesto, disponible]);
  console.log('esto es result',result.rows[0]);
  
  if (result.rowCount === 0) {
    
    return null
  } else {
    console.log('El registro fue actualizado:', result.rows[0]);
    return result.rows[0];
  }
  }  



const updateTransactionStatus = async (buyOrder, status, pool) => {
  try {
    await pool.query(`
      UPDATE contrato_puesto
      SET estado_contrato = $1
      WHERE buy_order = $2`,
      [status, buyOrder]);
      
  } catch (error) {
    console.error('Error actualizando el estado de la transacción:', error);
  }
};

const check_status_contrato = async ( buy_order ,pool  ) => {
  try{
  const result = await pool.query(`  
    SELECT estado_contrato FROM contrato_puesto 
    WHERE buy_order  = $1`,[buy_order] );
    return result.rows[0]?.estado_contrato;
  }catch (error){ 

    console.error('Error actualizando el estado de la transacción:', error);
  }

}

const activeChecks = {}; // Almacena los chequeos activos
const maxRetries = 3; // Máximo número de intentos permitidos

const startTransactionCheck = async (io,id_feria, buy_order,id_arriendo_puesto ,token_ws, pool) => {
  if (activeChecks[buy_order]) return; // Evita iniciar un chequeo si ya está activo

  const estado = await check_status_contrato(buy_order, pool); // Asegúrate de esperar la resolución de la promesa
  if (estado === 1) {

    let retryCount = 0; // Inicializa el contador de intentos

    const intervalId = setInterval(async () => {
      try {
        const response = await (new WebpayPlus.Transaction()).commit(token_ws);

        if (response.status === 'AUTHORIZED') {
          console.log(`Transacción ${buy_order} autorizada.`);
          await updateTransactionStatus(response.buy_order, 2, pool);
          const estado = await cambiar_estado_arriendo(pool , id_arriendo_puesto, 3)

          if(estado){
            emitUpdateArriendo( io,id_feria, estado)
           }
          clearInterval(intervalId); // Detiene el chequeo
          delete activeChecks[buy_order]; // Elimina el chequeo activo

        } else if (response.status === 'REJECTED') {
          console.log(`Transacción ${buy_order} rechazada.`);
          await updateTransactionStatus(response.buy_order, 3, pool);
          const estado = await cambiar_estado_arriendo(pool , id_arriendo_puesto, 1)

          if(estado){
            emitUpdateArriendo( io,id_feria, estado)
           }
          clearInterval(intervalId); // Detiene el chequeo
          delete activeChecks[buy_order]; // Elimina el chequeo activo
        }
      } catch (error) {
        console.error(`Error al procesar la transacción ${buy_order}:`, error);

        // Manejo de errores 422
        if (error.response && error.response.status === 422) {
          console.log(`Error 422 para la transacción ${buy_order}. Intento ${retryCount + 1} de ${maxRetries}.`);

          retryCount++; // Incrementa el contador de intentos
          if (retryCount >= maxRetries) {
            console.log(`Se alcanzó el número máximo de reintentos para la transacción ${buy_order}. Deteniendo chequeo.`);
            await updateTransactionStatus(buy_order, 3, pool);
            const estado = await cambiar_estado_arriendo(pool , id_arriendo_puesto, 1)

            if(estado){
              emitUpdateArriendo( io,id_feria, estado)
             }
            clearInterval(intervalId); // Detiene el chequeo
            delete activeChecks[buy_order]; // Elimina el chequeo activo
          }
        }
        // Manejo de errores de timeout
        else if (error.code === 'ECONNABORTED') {
          console.log(`Timeout para la transacción ${buy_order}. Intento ${retryCount + 1} de ${maxRetries}.`);

          retryCount++; // Incrementa el contador de intentos
          if (retryCount >= maxRetries) {
            console.log(`Se alcanzó el número máximo de reintentos para la transacción ${buy_order}. Deteniendo chequeo.`);
            await updateTransactionStatus(buy_order, 3, pool);
            const estado = await cambiar_estado_arriendo(pool , id_arriendo_puesto, 1)
            if(estado){
              emitUpdateArriendo( io,id_feria, estado)
             }
            clearInterval(intervalId); // Detiene el chequeo
            delete activeChecks[buy_order]; // Elimina el chequeo activo
          }
        }
      }
    }, 10000); // Chequea cada 10 segundos

    // Almacena el ID del intervalo para que puedas detenerlo más tarde si es necesario
    activeChecks[buy_order] = intervalId;

  } else {

    console.log('La transaccion esta completada, cancelando chequeo.');
  }
};



const saveTransactionToDatabase = async ( pool, id_user_fte, id_arriendo_puesto , id_tipo_pago, id_estado_contrato, precio, buyOrder, sessionId) => {
  const timestampUTC = new Date().toISOString(); 
  await pool.query(`
    INSERT INTO contrato_puesto (id_user_fte, fecha, id_arriendo_puesto, id_tipo_pago, id_estado_contrato, precio, buy_order, session_id)
    VALUES ($1, $2, $3, $4,$5,$6,$7,$8)`,
    [ id_user_fte,timestampUTC,id_arriendo_puesto,id_tipo_pago, id_estado_contrato, precio, buyOrder, sessionId]);
};


// Función para crear la transacción
const createTransaction = async (io,socket, pool, params) => {

  const { puesto, mail , id_user_fte } = params.params; // Obtener datos del POST
  const returnUrl = `http://localhost:5173/pagos/estado`; // URL de retorno
  const emailFragment = mail.split('@')[0];
  const timestamp = new Date().getTime();  // Obtener el timestamp actual
  const sessionId = `session-${puesto.id_puesto}-${timestamp}`;
  const buyOrder = `order-${puesto.id_puesto}-${timestamp}`;
  const amount = puesto.precio
  const id_arriendo_puesto = puesto.id_arriendo_puesto

  try {
    // Crear la transacción con Transbank
    const  estado = await cambiar_estado_arriendo(pool , id_arriendo_puesto, 2)
    //cambiar el estado en la pagina

    emitUpdateArriendo(io,puesto.id_feria , estado)

    const response = await (new WebpayPlus.Transaction()).create(buyOrder, sessionId, amount, returnUrl);
    const { token, url } = response;

    // Guardar la transacción en la base de datos como "pendiente"
    await saveTransactionToDatabase( pool ,id_user_fte, id_arriendo_puesto , 1, 1, puesto.precio, buyOrder, sessionId);
    setTimeout(() => {
      startTransactionCheck(io,puesto.id_feria,buyOrder ,id_arriendo_puesto, token , pool)

    },40000 ) 

    // Responder con la URL y el token
    socket.emit('opentbk', {token , url})
  } catch (error) {
    console.error('Error creando la transacción:', error);
    const nulo = null
    socket.emit('opentbk', {nulo})
  }
};



 
// Función para confirmar el commit -- para el front
const commitTransaction = async ( io,socket,pool ,params) => {
  console.log(params);
  
  const { token , id_arriendo_puesto , id_feria} = params.params
  try {
    const response = await (new WebpayPlus.Transaction()).commit(token);
 
    
    if (response.status === 'AUTHORIZED') {
      // Actualizar la transacción en la base de datos como "completada"
      await updateTransactionStatus(response.buy_order, 2, pool);
      const estado = await cambiar_estado_arriendo(pool , id_arriendo_puesto, 3)
      console.log('esto es estado',estado);
      
      if(estado){
        emitUpdateArriendo( io,id_feria, estado)
       }
      socket.emit('comittbk' ,response )
    } else {
     await updateTransactionStatus(response.buy_order, 3,pool);
     const estado = await cambiar_estado_arriendo(pool ,id_arriendo_puesto, 1)    
     if(estado){
      emitUpdateArriendo( io,id_feria, estado)
     }
   
      socket.emit('comittbk' ,response )
    }
  } catch (error) {
    console.error('Error confirmando la transacción:', error);
   
  }
};




// Exportar las funciones
module.exports = {
  createTransaction,
  commitTransaction,
};
