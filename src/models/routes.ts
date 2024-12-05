export const PublicRoutes = { 
    FEEDFERIAS : 'Feed-Ferias' ,
    LOGIN: 'login',
    LOGINEN : 'login1',
    LOGINFE : 'login2',
    LOGINMUNI : 'login3',
    REGISTRO: 'registro',
    RESETPASSWORD: 'reset-password',
    DATOSENCARGADO : 'actualizar-datos',
    DETALLEFERIA : "/feria/:id_feria/:nombre_feria/:fecha",
     PAGOS : 'pago',
     PAGOS2 : 'pagosss',
     PAGOOK : '/pagos/estado'
}

export const PrivateRoutes = {
    PRIVATE : 'private',
    PERFILENCARGADO : '1',
    BANCOS : '1/bancos',
    TEAM : '1/TEAM',
    HERRAMIENTA : '1/Plano/:id_feria',
    
    PERFILFERIANTE : '2',
    POSTULACIONES : '2/postulaciones',
    MAPASUPERVISOR :"2/supervisor/:id_feria/:nombre_feria/:fecha",
    SUPERVISOR: '2/postulaciones/supervisor/:id_feria/:nombre_feria',

    PERFILADMIN : '3',

 

} 