-- Drop existing tables aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

DROP TABLE IF EXISTS dia_semana CASCADE;
DROP TABLE IF EXISTS puesto_archivado CASCADE;
DROP TABLE IF EXISTS arriendo_puesto CASCADE;
DROP TABLE IF EXISTS puesto CASCADE;
DROP TABLE IF EXISTS json_feria CASCADE;
DROP TABLE IF EXISTS intereses CASCADE;
DROP TABLE IF EXISTS horario_puesto CASCADE;
DROP TABLE IF EXISTS feriante CASCADE;
DROP TABLE IF EXISTS feria CASCADE;
DROP TABLE IF EXISTS encargado_feria CASCADE;
DROP TABLE IF EXISTS detalle CASCADE;
DROP TABLE IF EXISTS contrato_puesto CASCADE;
DROP TABLE IF EXISTS solicitudes_apertura CASCADE;
DROP TABLE IF EXISTS supervisor CASCADE;
DROP TABLE IF EXISTS team_supervisor CASCADE;
DROP TABLE IF EXISTS tipo_estado_contrato CASCADE;
DROP TABLE IF EXISTS tipo_pago CASCADE;
DROP TABLE IF EXISTS tipo_puesto CASCADE;
DROP TABLE IF EXISTS tipo_usuario CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;
DROP TABLE IF EXISTS administrador_municipal CASCADE;
DROP TABLE IF EXISTS comuna CASCADE;
DROP TABLE IF EXISTS region CASCADE;
DROP TABLE IF EXISTS estado_feria CASCADE;
DROP TABLE IF EXISTS programa_feria CASCADE;
DROP TABLE IF EXISTS detalle_team_supervisor CASCADE;
DROP TABLE IF EXISTS banco_encargado CASCADE;
DROP TABLE IF EXISTS detalle_programa_feria CASCADE;
DROP TABLE IF EXISTS detalle_solicitud CASCADE;
DROP TABLE IF EXISTS detalle_supervisor CASCADE;
DROP TABLE IF EXISTS redes_sociales CASCADE;
DROP TABLE IF EXISTS tipo_red CASCADE;
DROP TABLE IF EXISTS estado_puesto CASCADE;
DROP TABLE IF EXISTS estado_actividad CASCADE;
DROP TABLE IF EXISTS detalle_horario_empleado CASCADE;
DROP TABLE IF EXISTS detalle_team_vacante CASCADE;
DROP TABLE IF EXISTS estado_horario_feria CASCADE;
DROP TABLE IF EXISTS log_empleado CASCADE;
DROP TABLE IF EXISTS postulaciones CASCADE;
DROP TABLE IF EXISTS estado_postulacion CASCADE;
DROP TABLE IF EXISTS actividad_feria CASCADE;
DROP TABLE IF EXISTS dia_armado CASCADE;
DROP TABLE IF EXISTS log_actividad_feria CASCADE;
DROP TABLE IF EXISTS log_detalle_programa CASCADE;
DROP TABLE IF EXISTS rol_empleado CASCADE;
DROP TABLE IF EXISTS estado_solicitud CASCADE;
DROP TABLE IF EXISTS estado_vacante CASCADE;


CREATE TABLE actividad_feria (
    id_actividad_feria SERIAL NOT NULL,
    id_horario_feria   INTEGER NOT NULL,
    fecha              DATE NOT NULL,
    armado_hecho       BOOLEAN NOT NULL,
    feria_hecha        BOOLEAN NOT NULL,
    activo BOOLEAN
);

ALTER TABLE actividad_feria ADD CONSTRAINT actividad_feria_pk PRIMARY KEY ( id_actividad_feria );

CREATE TABLE administrador_municipal (
    id_user_adm      SERIAL NOT NULL,
    user_mail       CHARACTER VARYING(80) NOT NULL,
    id_tipo_usuario INTEGER NOT NULL,
    nombre          CHARACTER VARYING(40) NOT NULL,
    apellido        CHARACTER VARYING(40) NOT NULL,
    rut             INTEGER NOT NULL,
    rut_div         CHARACTER VARYING(1) NOT NULL,
    telefono        INTEGER,
    contrasena      CHARACTER VARYING(200) NOT NULL,
    url_foto_perfil CHARACTER VARYING(200)
);

ALTER TABLE administrador_municipal ADD CONSTRAINT administrador_pk PRIMARY KEY ( id_user_adm );

CREATE TABLE dia_semana (
    id_dia INTEGER NOT NULL,
    dia    CHARACTER VARYING(20) NOT NULL
);

ALTER TABLE dia_semana ADD CONSTRAINT dia_semana_pk PRIMARY KEY ( id_dia );



ALTER TABLE administrador_municipal ADD CONSTRAINT adm_mail__un UNIQUE ( user_mail );

CREATE TABLE banco_encargado (
    mail_banco      CHARACTER VARYING(100) NOT NULL,
    id_user_enf     INTEGER NOT NULL,
    nombre_asociado CHARACTER VARYING(50) NOT NULL,
    numero_cuenta   CHARACTER VARYING(50) NOT NULL
);

ALTER TABLE banco_encargado ADD CONSTRAINT banco_encargado_pk PRIMARY KEY ( mail_banco );

CREATE TABLE comuna (
    id_comuna INTEGER NOT NULL,
    comuna    CHARACTER VARYING(80) NOT NULL,
    id_region INTEGER NOT NULL
);

ALTER TABLE comuna ADD CONSTRAINT comuna_pk PRIMARY KEY ( id_comuna );

CREATE TABLE contrato_puesto (
    id_contrato     SERIAL NOT NULL,
    id_user_fte     INTEGER NOT NULL,
    fecha           DATE NOT NULL,
    id_arriendo_puesto       INTEGER NOT NULL,
    id_tipo_pago    INTEGER NOT NULL,
    id_estado_contrato INTEGER NOT NULL,
    precio          INTEGER NOT NULL,
    buy_order       CHARACTER VARYING(100) NOT NULL, 
    session_id      CHARACTER VARYING(100) NOT NULL
);

ALTER TABLE contrato_puesto ADD CONSTRAINT contrato_diario_pk PRIMARY KEY ( id_contrato );

CREATE TABLE detalle_horario_empleado (
    id_detalle_horario SERIAL NOT NULL,
    id_vacante         INTEGER NOT NULL,
    id_dia             INTEGER NOT NULL,
    hora_entrada       TIME WITHOUT TIME ZONE NOT NULL,
    hora_salida        TIME WITHOUT TIME ZONE NOT NULL
);

ALTER TABLE detalle_horario_empleado ADD CONSTRAINT detalle_horario_empleado_pk PRIMARY KEY ( id_detalle_horario );

CREATE TABLE detalle_programa_feria (
    id_horario_feria    SERIAL NOT NULL,
    id_feria            INTEGER NOT NULL,
    id_dia                 INTEGER NOT NULL,
    hora_inicio         TIME WITHOUT TIME ZONE NOT NULL,
    hora_termino        TIME WITHOUT TIME ZONE NOT NULL,
    id_dia_armado       INTEGER NOT NULL,
    hora_inicio_armado  TIME WITHOUT TIME ZONE NOT NULL,
    hora_termino_armado TIME WITHOUT TIME ZONE NOT NULL,
    activo              BOOLEAN NOT NULL
);

ALTER TABLE detalle_programa_feria ADD CONSTRAINT detalle_programa_pk PRIMARY KEY ( id_horario_feria );

ALTER TABLE detalle_programa_feria 
    ADD CONSTRAINT id_dia_to_programa_FK FOREIGN KEY (id_dia)
        REFERENCES dia_semana (id_dia);


CREATE TABLE detalle_solicitud (
    id_archivo            SERIAL NOT NULL,
    nombre_archivo        CHARACTER VARYING(100) NOT NULL,
    url_archivo           CHARACTER VARYING(200) NOT NULL,
    solicitud_apertura_id INTEGER NOT NULL
);

ALTER TABLE detalle_solicitud ADD CONSTRAINT detalle_pk PRIMARY KEY ( id_archivo );

CREATE TABLE detalle_team_vacante (
    id_vacante        SERIAL NOT NULL,
    id_user_fte       INTEGER,
    id_feria          INTEGER NOT NULL,
    id_rol            INTEGER NOT NULL,
    ingreso           DATE NOT NULL,
    termino           DATE NOT NULL,
    id_estado_vacante INTEGER NOT NULL
);

ALTER TABLE detalle_team_vacante ADD CONSTRAINT team_supervisor_pk PRIMARY KEY ( id_vacante );

CREATE TABLE dia_armado (
    id_dia_armado INTEGER NOT NULL,
    cuando        CHARACTER VARYING(20) NOT NULL
);

ALTER TABLE dia_armado ADD CONSTRAINT dia_armado_pk PRIMARY KEY ( id_dia_armado );


CREATE TABLE encargado_feria (
    id_user_enf     SERIAL NOT NULL,
    user_mail       CHARACTER VARYING(80) NOT NULL,
    id_tipo_usuario INTEGER NOT NULL,
    nombre          CHARACTER VARYING(40) NOT NULL,
    apellido        CHARACTER VARYING(40),
    rut             INTEGER NOT NULL,
    rut_div         CHARACTER VARYING(1) NOT NULL,
    telefono        INTEGER,
    contrasena      CHARACTER VARYING(200) NOT NULL,
    url_foto_perfil CHARACTER VARYING(200)
);

ALTER TABLE encargado_feria ADD CONSTRAINT encargado_feria_pk PRIMARY KEY ( id_user_enf );

ALTER TABLE encargado_feria ADD CONSTRAINT encargado_feria__un UNIQUE ( user_mail );

CREATE TABLE estado_feria (
    id_estado INTEGER NOT NULL,
    estado    CHARACTER VARYING(20) NOT NULL
);

ALTER TABLE estado_feria ADD CONSTRAINT estado_feria_pk PRIMARY KEY ( id_estado );

CREATE TABLE estado_puesto (
    id_estado_puesto INTEGER NOT NULL,
    estado           CHARACTER VARYING(20) NOT NULL
);

ALTER TABLE estado_puesto ADD CONSTRAINT estado_puesto_pk PRIMARY KEY ( id_estado_puesto );

CREATE TABLE estado_solicitud (
    id_estado INTEGER NOT NULL,
    estado    CHARACTER VARYING(20) NOT NULL
);

ALTER TABLE estado_solicitud ADD CONSTRAINT estado_solicitud_pk PRIMARY KEY ( id_estado );

CREATE TABLE estado_vacante (
    id_estado INTEGER NOT NULL,
    estado    CHARACTER VARYING(20) NOT NULL
);

ALTER TABLE estado_vacante ADD CONSTRAINT estado_vacante_pk PRIMARY KEY ( id_estado );

CREATE TABLE feria (
    id_feria    SERIAL NOT NULL,
    id_user_enf INTEGER NOT NULL,
    nombre      CHARACTER VARYING(80) NOT NULL,
    id_comuna   INTEGER NOT NULL,
    id_estado   INTEGER NOT NULL,
    mail_banco  CHARACTER VARYING(100)
);

ALTER TABLE feria ADD CONSTRAINT feria_pk PRIMARY KEY ( id_feria );

CREATE TABLE feriante (
    id_user_fte     SERIAL NOT NULL,
    user_mail       CHARACTER VARYING(80) NOT NULL,
    id_tipo_usuario INTEGER NOT NULL,
    nombre          CHARACTER VARYING(40) NOT NULL,
    apellido        CHARACTER VARYING(40),
    rut             INTEGER NOT NULL,
    rut_div         CHARACTER VARYING(1) NOT NULL,
    biografia       TEXT,
    telefono        INTEGER,
    auth_google     CHARACTER VARYING(100),
    contrasena      CHARACTER VARYING(200) NOT NULL,
    perfil_privado  BOOLEAN NOT NULL,
    url_foto_perfil CHARACTER VARYING(200)
);

ALTER TABLE feriante ADD CONSTRAINT feriante_pk PRIMARY KEY ( id_user_fte );

ALTER TABLE feriante ADD CONSTRAINT feriante__un UNIQUE ( user_mail );

ALTER TABLE feriante
ALTER COLUMN perfil_privado SET DEFAULT false;


CREATE TABLE intereses (
    id_interes  SERIAL NOT NULL,
    id_user_fte INTEGER NOT NULL,
    interes     CHARACTER VARYING(40) NOT NULL
);

ALTER TABLE intereses ADD CONSTRAINT intereses_pk PRIMARY KEY ( id_interes );

CREATE TABLE json_feria (
    id_json     SERIAL NOT NULL,
    id_feria    INTEGER NOT NULL,
    nombre_json JSONB NOT NULL
);

ALTER TABLE json_feria ADD CONSTRAINT json_feria_pk PRIMARY KEY ( id_json );

ALTER TABLE json_feria ADD CONSTRAINT json_feria__un UNIQUE ( id_feria );

CREATE TABLE log_actividad_feria (
    id_actividad     INTEGER NOT NULL,
    id_horario_feria INTEGER NOT NULL,
    fecha            DATE NOT NULL,
    armado_hecho     BOOLEAN NOT NULL,
    feria_hecha      BOOLEAN NOT NULL
);

ALTER TABLE log_actividad_feria ADD CONSTRAINT log_actividad_feria_pk PRIMARY KEY ( id_actividad );

CREATE TABLE log_detalle_programa (
    id_horario_feria    INTEGER NOT NULL,
    id_feria            INTEGER NOT NULL,
    dia                 CHARACTER VARYING(20) NOT NULL,
    hora_inicio         TIME WITHOUT TIME ZONE NOT NULL,
    hora_termino        TIME WITHOUT TIME ZONE NOT NULL,
    dia_armado          CHARACTER VARYING(20) NOT NULL,
    hora_inicio_armado  time WITHOUT TIME ZONE NOT NULL,
    hora_termino_armado TIME WITHOUT TIME ZONE NOT NULL,
    activo              CHAR(1) NOT NULL
);

ALTER TABLE log_detalle_programa ADD CONSTRAINT log_detalle_programa_pk PRIMARY KEY ( id_horario_feria );

CREATE TABLE log_empleado (
    id_log  INTEGER NOT NULL,
    feria   CHARACTER VARYING(100) NOT NULL,
    ingreso DATE NOT NULL,
    termino DATE NOT NULL
);

ALTER TABLE log_empleado ADD CONSTRAINT log_empleado_pk PRIMARY KEY ( id_log );

CREATE TABLE estado_postulacion (
    id_estado INTEGER NOT NULL, 
    estado CHARACTER VARYING, 
    PRIMARY KEY (id_estado)
);


CREATE TABLE postulaciones (
    id_postulacion SERIAL NOT NULL,
    id_vacante     INTEGER NOT NULL,
    id_user_fte    INTEGER NOT NULL,
    id_estado      INTEGER NOT NULL
);

ALTER TABLE postulaciones ADD CONSTRAINT invitaciones_pk PRIMARY KEY ( id_postulacion );

ALTER TABLE postulaciones 
    ADD CONSTRAINT id_estado_postulacion_FK FOREIGN KEY (id_estado)
         REFERENCES estado_postulacion (id_estado);

CREATE TABLE puesto (
    id_puesto        SERIAL NOT NULL,
    id_tipo_puesto   INTEGER ,
    numero           INTEGER NOT NULL,
    descripcion      TEXT ,
    id_feria         INTEGER NOT NULL,
    id_estado_puesto INTEGER NOT NULL,
    precio INTEGER NOT NULL
);

ALTER TABLE puesto ADD CONSTRAINT puesto_pk PRIMARY KEY ( id_puesto );

CREATE TABLE estado_arriendo (
    id_estado_arriendo INTEGER,
    estado CHARACTER VARYING, 
    PRIMARY KEY(id_estado_arriendo)
)



CREATE TABLE arriendo_puesto (
    id_arriendo_puesto SERIAL NOT NULL,
    id_actividad_feria INTEGER NOT NULL,
    id_puesto INTEGER NOT NULL , 
    id_estado_arriendo INTEGER NOT NULL,
    activo BOOLEAN,
    PRIMARY KEY (id_arriendo_puesto)
);

ALTER TABLE ARRIENDO_PUESTO 
    ADD CONSTRAINT id_puesto_to_arriendo_FK FOREIGN KEY (id_puesto)
        REFERENCES puesto (id_puesto);

ALTER TABLE ARRIENDO_PUESTO 
    ADD CONSTRAINT id_actividad_to_arriendo_FK FOREIGN KEY (id_actividad_feria)
        REFERENCES actividad_feria (id_actividad_feria);

ALTER TABLE ARRIENDO_PUESTO 
    ADD CONSTRAINT id_estado_to_arriendo_fk FOREIGN KEY (id_estado_arriendo)
        REFERENCES estado_arriendo (id_estado_arriendo);

CREATE TABLE puesto_archivado (
    id_archivado SERIAL NOT NULL,
    id_user_fte  INTEGER NOT NULL,
    nombre_feria CHARACTER VARYING(50) NOT NULL,
    puesto_feria INTEGER NOT NULL,
    id_feriante  INTEGER NOT NULL
);

ALTER TABLE puesto_archivado ADD CONSTRAINT puesto_archivado_pk PRIMARY KEY ( id_archivado );

CREATE TABLE redes_sociales (
    id_redes    SERIAL NOT NULL,
    id_user_fte INTEGER NOT NULL,
    tipo_red    INTEGER NOT NULL,
    url_red     CHARACTER VARYING(200) NOT NULL
);

ALTER TABLE redes_sociales ADD CONSTRAINT redes_sociales_pk PRIMARY KEY ( id_redes );

CREATE TABLE region (
    id_region INTEGER NOT NULL,
    region    CHARACTER VARYING(100) NOT NULL
);

ALTER TABLE region ADD CONSTRAINT region_pk PRIMARY KEY ( id_region );

CREATE TABLE rol_empleado (
    id_rol INTEGER NOT NULL,
    rol    CHARACTER VARYING(20) NOT NULL
);

ALTER TABLE rol_empleado ADD CONSTRAINT rol_empleado_pk PRIMARY KEY ( id_rol );

CREATE TABLE solicitudes_apertura (
    id_solicitud SERIAL NOT NULL,
    id_user_adm  INTEGER NOT NULL,
    id_feria     INTEGER NOT NULL,
    id_estado    INTEGER NOT NULL
);

ALTER TABLE solicitudes_apertura ADD CONSTRAINT solicitudes_apertura_pk PRIMARY KEY ( id_solicitud );

CREATE TABLE estado_contrato (
    id_estado_contrato INTEGER NOT NULL,
    detalle            CHARACTER VARYING(50) NOT NULL
);

ALTER TABLE estado_contrato ADD CONSTRAINT id_estado_contrato_pk PRIMARY KEY ( id_estado_contrato );

CREATE TABLE tipo_pago (
    id_tipo_pago INTEGER NOT NULL,
    detalle      CHARACTER VARYING(50) NOT NULL
);

ALTER TABLE tipo_pago ADD CONSTRAINT tipo_pago_pk PRIMARY KEY ( id_tipo_pago );

CREATE TABLE tipo_puesto (
    id_tipo_puesto INTEGER NOT NULL,
    detalle        CHARACTER VARYING(50) NOT NULL
);

ALTER TABLE tipo_puesto ADD CONSTRAINT tipo_puesto_pk PRIMARY KEY ( id_tipo_puesto );

CREATE TABLE tipo_red (
    id_tipo_red  INTEGER NOT NULL,
    red_social   CHARACTER VARYING(30) NOT NULL,
    url_foto_red CHARACTER VARYING(200) NOT NULL
);

ALTER TABLE tipo_red ADD CONSTRAINT tipo_red_pk PRIMARY KEY ( id_tipo_red );

CREATE TABLE tipo_usuario (
    id_tipo_usuario INTEGER NOT NULL,
    detalle         CHARACTER VARYING(30)
);

ALTER TABLE tipo_usuario ADD CONSTRAINT tipo_usuario_pk PRIMARY KEY ( id_tipo_usuario );

ALTER TABLE comuna
    ADD CONSTRAINT comuna_region_fk FOREIGN KEY ( id_region )
        REFERENCES region ( id_region );

ALTER TABLE contrato_puesto
    ADD CONSTRAINT id_arriendo_to_contrato_FK FOREIGN KEY ( id_arriendo_puesto )
        REFERENCES arriendo_puesto ( id_arriendo_puesto );

ALTER TABLE contrato_puesto
    ADD CONSTRAINT contrato_diario_tipo_pago_fk FOREIGN KEY ( id_tipo_pago )
        REFERENCES tipo_pago ( id_tipo_pago );

ALTER TABLE contrato_puesto
    ADD CONSTRAINT contrato_puesto_feriante_fk FOREIGN KEY ( id_user_fte )
        REFERENCES feriante ( id_user_fte );

ALTER TABLE banco_encargado
    ADD CONSTRAINT encargado_mail_to_banco_fk FOREIGN KEY ( id_user_enf )
        REFERENCES encargado_feria ( id_user_enf );

ALTER TABLE contrato_puesto
    ADD CONSTRAINT estado_puesto_contrato_fk FOREIGN KEY ( id_estado_contrato )
        REFERENCES estado_contrato ( id_estado_contrato );

ALTER TABLE feria
    ADD CONSTRAINT feria_banco_encargado_fk FOREIGN KEY ( mail_banco )
        REFERENCES banco_encargado ( mail_banco );

ALTER TABLE feria
    ADD CONSTRAINT feria_encargado_feria_fk FOREIGN KEY ( id_user_enf )
        REFERENCES encargado_feria ( id_user_enf );


ALTER TABLE solicitudes_apertura
    ADD CONSTRAINT id_admin_soli_fk FOREIGN KEY ( id_user_adm )
        REFERENCES administrador_municipal ( id_user_adm );

ALTER TABLE detalle_solicitud
    ADD CONSTRAINT id_apertura_fk FOREIGN KEY ( solicitud_apertura_id )
        REFERENCES solicitudes_apertura ( id_solicitud );

ALTER TABLE feria
    ADD CONSTRAINT id_comuna_fk FOREIGN KEY ( id_comuna )
        REFERENCES comuna ( id_comuna );

ALTER TABLE detalle_programa_feria
    ADD CONSTRAINT id_dia_armado_fk FOREIGN KEY ( id_dia_armado )
        REFERENCES dia_armado ( id_dia_armado );

ALTER TABLE detalle_horario_empleado
    ADD CONSTRAINT id_dia_to_emphorario_fk FOREIGN KEY ( id_dia )
        REFERENCES dia_semana ( id_dia );

ALTER TABLE postulaciones
    ADD CONSTRAINT id_dtv_to_postulaciones_fk FOREIGN KEY ( id_vacante )
        REFERENCES detalle_team_vacante ( id_vacante );

ALTER TABLE detalle_team_vacante
    ADD CONSTRAINT id_estado_to_dtv_fk FOREIGN KEY ( id_estado_vacante )
        REFERENCES estado_vacante ( id_estado );

ALTER TABLE solicitudes_apertura
    ADD CONSTRAINT id_estado_to_soli_fk FOREIGN KEY ( id_estado )
        REFERENCES estado_solicitud ( id_estado );

ALTER TABLE feria
    ADD CONSTRAINT id_feria_estado_fk FOREIGN KEY ( id_estado )
        REFERENCES estado_feria ( id_estado );

ALTER TABLE detalle_team_vacante
    ADD CONSTRAINT id_feria_to_dtv_fk FOREIGN KEY ( id_feria )
        REFERENCES feria ( id_feria );

ALTER TABLE json_feria
    ADD CONSTRAINT id_feria_to_json_fk FOREIGN KEY ( id_feria )
        REFERENCES feria ( id_feria );

ALTER TABLE detalle_team_vacante
    ADD CONSTRAINT id_fte_to_dtv_fk FOREIGN KEY ( id_user_fte )
        REFERENCES feriante ( id_user_fte );

ALTER TABLE postulaciones
    ADD CONSTRAINT id_fte_to_postulaciones_fk FOREIGN KEY ( id_user_fte )
        REFERENCES feriante ( id_user_fte );

ALTER TABLE redes_sociales
    ADD CONSTRAINT id_fte_to_redes_fk FOREIGN KEY ( id_user_fte )
        REFERENCES feriante ( id_user_fte );

ALTER TABLE actividad_feria
    ADD CONSTRAINT id_horario_to_actividad_fk FOREIGN KEY ( id_horario_feria )
        REFERENCES detalle_programa_feria ( id_horario_feria );

ALTER TABLE log_actividad_feria
    ADD CONSTRAINT id_horario_to_log_fk FOREIGN KEY ( id_horario_feria )
        REFERENCES log_detalle_programa ( id_horario_feria );

ALTER TABLE detalle_team_vacante
    ADD CONSTRAINT id_rol_to_dtv_fk FOREIGN KEY ( id_rol )
        REFERENCES rol_empleado ( id_rol );

ALTER TABLE redes_sociales
    ADD CONSTRAINT id_tipo_red_to_redes_fk FOREIGN KEY ( tipo_red )
        REFERENCES tipo_red ( id_tipo_red );

ALTER TABLE administrador_municipal
    ADD CONSTRAINT id_tipo_user_to_admin FOREIGN KEY ( id_tipo_usuario )
        REFERENCES tipo_usuario ( id_tipo_usuario );

ALTER TABLE feriante
    ADD CONSTRAINT id_tipo_user_to_feriante_fk FOREIGN KEY ( id_tipo_usuario )
        REFERENCES tipo_usuario ( id_tipo_usuario );

ALTER TABLE detalle_horario_empleado
    ADD CONSTRAINT id_vacante_to_horario_fk FOREIGN KEY ( id_vacante )
        REFERENCES detalle_team_vacante ( id_vacante );

ALTER TABLE intereses
    ADD CONSTRAINT intereses_feriante_fk FOREIGN KEY ( id_user_fte )
        REFERENCES feriante ( id_user_fte );

ALTER TABLE detalle_programa_feria
    ADD CONSTRAINT programa_id_feria_fk FOREIGN KEY ( id_feria )
        REFERENCES feria ( id_feria );

ALTER TABLE puesto_archivado
    ADD CONSTRAINT puesto_archivado_feriante_fk FOREIGN KEY ( id_user_fte )
        REFERENCES feriante ( id_user_fte );

ALTER TABLE puesto
    ADD CONSTRAINT puesto_estado_puesto_fk FOREIGN KEY ( id_estado_puesto )
        REFERENCES estado_puesto ( id_estado_puesto );

ALTER TABLE puesto
    ADD CONSTRAINT puesto_feria_fk FOREIGN KEY ( id_feria )
        REFERENCES feria ( id_feria );

ALTER TABLE puesto
    ADD CONSTRAINT puesto_tipo_puesto_fk FOREIGN KEY ( id_tipo_puesto )
        REFERENCES tipo_puesto ( id_tipo_puesto );

ALTER TABLE solicitudes_apertura
    ADD CONSTRAINT solicitudes_apertura_feria_fk FOREIGN KEY ( id_feria )
        REFERENCES feria ( id_feria );

ALTER TABLE encargado_feria
    ADD CONSTRAINT tipo_user_to_encargado_fk FOREIGN KEY ( id_tipo_usuario )
        REFERENCES tipo_usuario ( id_tipo_usuario );


--ALTERS PARA COLUMNAS DEFAULT


ALTER TABLE postulaciones
ALTER COLUMN id_estado SET DEFAULT 1;


ALTER TABLE puesto 
ALTER COLUMN id_estado_puesto SET DEFAULT 1;

ALTER TABLE solicitudes_apertura
ALTER COLUMN id_estado SET DEFAULT 1;


ALTER TABLE feria
ALTER COLUMN id_estado SET DEFAULT 1;


ALTER TABLE actividad_feria
ALTER COLUMN armado_hecho SET DEFAULT false;

ALTER TABLE actividad_feria
ALTER COLUMN feria_hecha SET DEFAULT false;


ALTER TABLE actividad_feria
ALTER COLUMN activo SET DEFAULT true;


ALTER TABLE arriendo_puesto
ALTER COLUMN id_estado_arriendo SET DEFAULT 1;


ALTER TABLE arriendo_puesto
ALTER COLUMN activo SET DEFAULT true;

