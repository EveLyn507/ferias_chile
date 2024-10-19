
// FUNCIONES PERFIL 
// get id_feria nombre nombre_region nombre_comuna
const get_feria_Encargado = async (req, res, pool) => {

      const {mail} = req.body;
    try {

    const result = await pool.query(
      ` SELECT * FROM obtener_ferias_encargado($1);` , [mail]);
    res.json(result.rows)

    }catch (err){
        console.error('Error al obtener las ferias:', err);
        res.status(500).send('Error al obtener las ferias');
    }
}

const abrirTiketFeria = async (req, res, pool) => {
  const {id_feria , mail} = req.body;
  const admin = '3@3';
try {

const result = await pool.query(
  'SELECT insertar_solicitud_apertura($1,$2,$3);' , [mail,admin,id_feria]);
res.json(result.rows)

}catch (err){
    console.error('Error al abrir tiket:', err);
    res.status(500).send('Error al  abrir tiket');

}

}





//HERRAMIENTA DE PLANOS
// Controlador para guardar la feria
const saveFeria = async (req, res) => {
  const { puestos, areas, calles, id_feria } = req.body; // Incluye id_feria en la desestructuración

  const pool = req.pool;

  try {
      const queryText = `
          INSERT INTO json_feria (nombre_json, id_feria)
          VALUES ($1, $2)
          WHERE id_feria = $4
      `;

      // Crear un objeto que contenga todos los datos en JSONB
      const nombre_json = {
          puestos,
          areas,
          calles,
      };

      // Asegúrate de pasar el id_feria desde el cuerpo de la solicitud
      const values = [JSON.stringify(nombre_json), 3 , 3,4]; // Usa id_feria aquí

      const result = await pool.query(queryText, values);
      res.status(201).json({ id_feria: result.rows[0].id_json });
  } catch (error) {
      console.error('Error al guardar la feria:', error);
      res.status(500).json({ error: 'Error al guardar la feria' });
  }
};



// cargar el json  de la feria a la app
const getFeria = async (req, res) => {
  const pool = req.pool;

  try {
    const result = await pool.query('SELECT nombre_json FROM json_feria WHERE id_feria = $1', [3]);
    if (result.rows.length > 0) {
      res.json(result.rows[0].nombre_json);
    } else {
      res.status(404).json({ error: 'Feria no encontrada' });
    }
  } catch (err) {
    console.error('Error al obtener la feria:', err);
    res.status(500).json({ error: 'Error al obtener la feria' });
  }
};


module.exports = {
  saveFeria,
  getFeria,
  get_feria_Encargado,
  abrirTiketFeria
};
