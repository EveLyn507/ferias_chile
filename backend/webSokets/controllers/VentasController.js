
const axios = require('axios');
const WebpayPlus = require('transbank-sdk').WebpayPlus;

// Crear una instancia de Axios con un timeout
const axiosInstance = axios.create({
  timeout: 180000 // 30 segundos
});
WebpayPlus.Transaction.client = axiosInstance;



const { emitUpdateArriendo } = require('./roomFunction')

const activeChecks = {}; // Almacena los chequeos activos
const maxRetries = 3; // Máximo número de intentos permitidos

const cambiar_estado_arriendo = async (pool , id_arriendo_puesto, disponible ) => {

 console.log('cambiando arriendo' ,disponible );
 
  const result = await pool.query(`
    UPDATE arriendo_puesto 
    SET id_estado_arriendo = $2
    WHERE id_arriendo_puesto = $1 
    RETURNING *;
  `, [id_arriendo_puesto, disponible]);

  
  if (result.rowCount === 0) {
    
    return null
  } else {
    return result.rows[0];
  }
  }  


  const updateTransactionStatus = async (buyOrder, status, pool) => {
    try {
      await pool.query(
        `UPDATE contrato_puesto SET id_estado_contrato = $1 WHERE buy_order = $2`,
        [status, buyOrder]
      );
    } catch (error) {
      console.error('Error actualizando el estado de la transacción:', error);
    }
  };
  
  const checkTransactionStatus = async (buyOrder, pool) => {
    try {
      const result = await pool.query(
        `SELECT id_estado_contrato FROM contrato_puesto WHERE buy_order = $1`,
        [buyOrder]
      );
      return result.rows[0]?.id_estado_contrato;
    } catch (error) {
      console.error('Error verificando el estado del contrato:', error);
    }
  };
  
  const handleTransactionResult = async (
    response,
    io,
    id_feria,
    buy_order,
    id_arriendo_puesto,
    pool
  ) => {
    const contratoState = response.status === 'AUTHORIZED' ? 2 : 4; // Estado de contrato : comienza con estado 1
    const arriendoState = response.status === 'AUTHORIZED' ? 3 : 1; // Estado de arriendo : este estado comienza con estado  2 
    console.log(`Transacción ${buy_order} ${response.status.toLowerCase()}.`);
  
    await updateTransactionStatus(response.buy_order, contratoState, pool); // actualiza contrato_puesto
    const estado = await cambiar_estado_arriendo(pool, id_arriendo_puesto, arriendoState); // actualiza arriendo_puesto
  
    if (estado) emitUpdateArriendo(io, id_feria, estado);
  };
  

  const retryExceeded = async (buyOrder, pool, io, id_feria, id_arriendo_puesto) => {
    console.log(`Se alcanzó el número máximo de reintentos para la transacción ${buyOrder}.`);
    await updateTransactionStatus(buyOrder, 4, pool);
    const estado = await cambiar_estado_arriendo(pool, id_arriendo_puesto, 1);
    if (estado) emitUpdateArriendo(io, id_feria, estado);
  };
  

  const startTransactionCheck = async (io, id_feria, buy_order, id_arriendo_puesto, token_ws, pool) => {
    if (activeChecks[buy_order]) return;

  
    const estado = await checkTransactionStatus(buy_order, pool);
    if (estado === 3 ) {
      console.log('La transacción ya está completada, cancelando chequeo.');
      return;
    }
  
    let retryCount = 0;
    const intervalId = setInterval(async () => {
      try {
        const response = await new WebpayPlus.Transaction().commit(token_ws);
        if(response.status === 'REJECTED' || response.status === 'AUTHORIZED' || response.status === 'FAILED' || retryCount >= maxRetries) {
          await handleTransactionResult(response, io, id_feria, buy_order, id_arriendo_puesto, pool);
          clearInterval(intervalId);
          delete activeChecks[buy_order];
        }

      } catch (error) {
        console.error(`Error procesando la transacción ${buy_order}:`, error);
  
        if (error.response?.status === 422 || error.code === 'ECONNABORTED') {
          retryCount++;
          console.log(
            `Error ${error.response?.status || 'timeout'} en la transacción ${buy_order}. Intento ${retryCount} de ${maxRetries}.`
          );
  
          if (retryCount >= maxRetries) {
            await retryExceeded(buy_order, pool, io, id_feria, id_arriendo_puesto);
            clearInterval(intervalId);
            delete activeChecks[buy_order];
          }
        }
      }
    }, 10000);
  
    activeChecks[buy_order] = intervalId;
  };
  


const saveTransactionToDatabase = async ( pool, id_user_fte, id_arriendo_puesto , id_tipo_pago, id_estado_contrato, precio, buyOrder, sessionId) => {
  const timestampUTC = new Date().toISOString(); 
  await pool.query(`
    INSERT INTO contrato_puesto (id_user_fte, fecha_pago, id_arriendo_puesto, id_tipo_pago, id_estado_contrato, precio, buy_order, session_id)
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

    },1 ) 

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
