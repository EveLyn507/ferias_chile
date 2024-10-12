

// get id_feria nombre nombre_region nombre_comuna
const get_feria = async (_req, res, pool) => {

try {

const result = await pool.query(
   ' SELECT * FROM obtener_ferias();'
    
);
res.json(result.rows)

}catch (err){
    console.error('Error al obtener las ferias:', err);
    res.status(500).send('Error al obtener las ferias');

}

}


const get_puestos_feria = async (req, res, pool) => {
    const id_feria = parseInt(req.params.id_feria, 10); // Convertir a entero

try{
const resutl = await pool.query( 'SELECT * FROM public.obtener_horarios_por_puesto($1)' , [id_feria])
res.json(resutl.rows)

}catch (err){

    console.error('Error al obtener los puestos de la feria:', err);
    res.status(500).send('Error al obtener los puestos');

}
    
}




module.exports = { get_feria ,get_puestos_feria};