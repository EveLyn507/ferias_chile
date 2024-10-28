-- Drop existing tables aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

DROP TABLE IF EXISTS dia_semana CASCADE;
DROP TABLE IF EXISTS puesto_archivado CASCADE;
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
DROP TABLE IF EXISTS actividad_feria CASCADE;
DROP TABLE IF EXISTS dia_armado CASCADE;
DROP TABLE IF EXISTS log_actividad_feria CASCADE;
DROP TABLE IF EXISTS log_detalle_programa CASCADE;
DROP TABLE IF EXISTS rol_empleado CASCADE;

CREATE TABLE administrador_municipal (
    user_mail       CHARACTER VARYING(80) NOT NULL,
    id_tipo_usuario INTEGER NOT NULL,
    nombre          CHARACTER VARYING(40) NOT NULL,
    apellido        CHARACTER VARYING(40) NOT NULL,
    rut             INTEGER NOT NULL,
    rut_div         CHARACTER VARYING(1) NOT NULL,
    telefono        INTEGER,
    url_foto_perfil CHARACTER VARYING(200),
    contrasena      CHARACTER VARYING(200) NOT NULL
);

ALTER TABLE administrador_municipal ADD CONSTRAINT administrador_pk PRIMARY KEY ( user_mail );

CREATE TABLE banco_encargado (
    mail_banco      CHARACTER VARYING(100) NOT NULL,
    nombre_asociado CHARACTER VARYING(50) NOT NULL,
    numero_cuenta   CHARACTER VARYING(50) NOT NULL,
    encargado_mail  CHARACTER VARYING(80) NOT NULL
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
    fecha           TIMESTAMP NOT NULL,
    id_puesto       INTEGER NOT NULL,
    id_tipo_pago    INTEGER NOT NULL,
    estado_contrato INTEGER NOT NULL,
    precio          INTEGER NOT NULL,
    feriante_mail   CHARACTER VARYING(80) NOT NULL
);

ALTER TABLE contrato_puesto ADD CONSTRAINT contrato_diario_pk PRIMARY KEY ( id_contrato );

CREATE TABLE dia_semana (
    id_dia INTEGER NOT NULL,
    dia CHARACTER VARYING(20),
    PRIMARY KEY(id_dia)
);



CREATE TABLE detalle_horario_empleado (
    id_detalle_horario SERIAL NOT NULL,
    id_vacante         INTEGER NOT NULL,
    id_dia             INTEGER NOT NULL,
    hora_entrada       TIME WITHOUT TIME ZONE NOT NULL,
    hora_salida        TIME WITHOUT TIME ZONE NOT NULL
);

ALTER TABLE detalle_horario_empleado ADD CONSTRAINT detalle_horario_empleado_pk PRIMARY KEY ( id_detalle_horario );

ALTER TABLE detalle_horario_empleado 
    ADD CONSTRAINT id_dia_to_emphorario_FK FOREIGN KEY ( id_dia )
        REFERENCES dia_semana(id_dia);

CREATE TABLE dia_armado (
    id_dia_armado INTEGER NOT NULL,
    cuando CHARACTER VARYING(20),
    PRIMARY KEY (id_dia_armado)
);




CREATE TABLE detalle_programa_feria (
    id_horario_feria    SERIAL NOT NULL,
    id_feria            INTEGER NOT NULL,
    dia                 CHARACTER VARYING(10) NOT NULL,
    hora_inicio         TIME WITHOUT TIME ZONE NOT NULL,
    hora_termino        TIME WITHOUT TIME ZONE NOT NULL,
    id_dia_armado       INTEGER NOT NULL,
    hora_inicio_armado  TIME WITHOUT TIME ZONE NOT NULL,
    hora_termino_armado TIME WITHOUT TIME ZONE NOT NULL,
    activo              boolean NOT NULL
);

ALTER TABLE detalle_programa_feria ADD CONSTRAINT detalle_programa_pk PRIMARY KEY ( id_horario_feria );

CREATE TABLE ACTIVIDAD_FERIA (
    id_actividad_feria SERIAL,
    id_horario_feria INTEGER,
    fecha DATE,
    armado_hecho CHAR(1),
    feria_hecha CHAR(1),
    activo boolean,
    PRIMARY KEY (id_actividad_feria)
);

ALTER TABLE ACTIVIDAD_FERIA 
    ADD CONSTRAINT id_horario_to_actividad_fk FOREIGN KEY (id_horario_feria)
        REFERENCES detalle_programa_feria (id_horario_feria);


CREATE TABLE detalle_solicitud (
    id_archivo            SERIAL NOT NULL,
    nombre_archivo        CHARACTER VARYING(100) NOT NULL,
    url_archivo           CHARACTER VARYING(200) NOT NULL,
    solicitud_apertura_id INTEGER NOT NULL
);

ALTER TABLE detalle_solicitud ADD CONSTRAINT detalle_pk PRIMARY KEY ( id_archivo );

CREATE TABLE detalle_team_vacante (
    id_vacante         SERIAL NOT NULL,
    feriante_mail      CHARACTER VARYING(80),
    supervisa_id_feria INTEGER NOT NULL,
    id_rol             INTEGER NOT NULL,
    ingreso            DATE NOT NULL,
    termino            DATE NOT NULL,
    estado_vacante     CHAR(1) NOT NULL
);

ALTER TABLE detalle_team_vacante ADD CONSTRAINT team_supervisor_pk PRIMARY KEY ( id_vacante );

CREATE TABLE encargado_feria (
    user_mail       CHARACTER VARYING(80) NOT NULL,
    id_tipo_usuario INTEGER NOT NULL,
    nombre          CHARACTER VARYING(40) NOT NULL,
    apellido        CHARACTER VARYING(40),
    rut             INTEGER NOT NULL,
    rut_div         CHARACTER VARYING(1) NOT NULL,
    telefono        INTEGER,
    url_foto_perfil CHARACTER VARYING(200),
    contrasena      CHARACTER VARYING(200) NOT NULL
);

ALTER TABLE encargado_feria ADD CONSTRAINT encargado_feria_pk PRIMARY KEY ( user_mail );

CREATE TABLE estado_horario_feria (
    id_estado_programa INTEGER NOT NULL,
    estado             CHARACTER VARYING(20) NOT NULL
);

ALTER TABLE estado_horario_feria ADD CONSTRAINT estado_horario_feria_pk PRIMARY KEY ( id_estado_programa );

CREATE TABLE estado_puesto (
    id_estado_puesto INTEGER NOT NULL,
    estado           CHARACTER VARYING(20) NOT NULL
);

ALTER TABLE estado_puesto ADD CONSTRAINT estado_puesto_pk PRIMARY KEY ( id_estado_puesto );


CREATE TABLE estado_feria (
    id_estado INTEGER NOT NULL,
    estado CHARACTER VARYING(20),
    PRIMARY KEY (id_estado)
);



CREATE TABLE feria (
    id_feria       SERIAL NOT NULL,
    nombre         CHARACTER VARYING(80) NOT NULL,
    id_comuna      INTEGER NOT NULL,
    encargado_mail CHARACTER VARYING(80) NOT NULL,
    id_region      INTEGER NOT NULL,
    id_estado      INTEGER NOT NULL,
    mail_banco     CHARACTER VARYING(100)
);

ALTER TABLE feria ADD CONSTRAINT feria_pk PRIMARY KEY ( id_feria );


CREATE TABLE feriante (
    user_mail       CHARACTER VARYING(80) NOT NULL,
    id_tipo_usuario INTEGER NOT NULL,
    nombre          CHARACTER VARYING(40) NOT NULL,
    apellido        CHARACTER VARYING(40),
    rut             INTEGER NOT NULL,
    rut_div         CHARACTER VARYING(1) NOT NULL,
    biografia       TEXT,
    telefono        INTEGER,
    url_foto_perfil CHARACTER VARYING(200),
    auth_google     CHARACTER VARYING(100),
    contrasena      CHARACTER VARYING(200) NOT NULL
);

ALTER TABLE feriante ADD CONSTRAINT feriante_pk PRIMARY KEY ( user_mail );

CREATE TABLE horario_puesto (
    id_horario   SERIAL NOT NULL,
    hora_inicio  DATE NOT NULL,
    hora_termino DATE NOT NULL,
    precio       INTEGER NOT NULL,
    num_horario  INTEGER NOT NULL,
    id_puesto    INTEGER NOT NULL
);

ALTER TABLE horario_puesto ADD CONSTRAINT horario_puesto_pk PRIMARY KEY ( id_horario );

CREATE TABLE intereses (
    id_interes SERIAL NOT NULL,
    interes    CHARACTER VARYING(40) NOT NULL,
    user_mail  CHARACTER VARYING(80) NOT NULL
);

ALTER TABLE intereses ADD CONSTRAINT intereses_pk PRIMARY KEY ( id_interes );

CREATE TABLE json_feria (
    nombre_json JSONB NOT NULL,
    id_json     SERIAL NOT NULL,
    id_feria    INTEGER NOT NULL
);

ALTER TABLE json_feria ADD CONSTRAINT json_feria_pk PRIMARY KEY ( id_json );

ALTER TABLE json_feria ADD CONSTRAINT json_feria__un UNIQUE ( id_feria );

CREATE TABLE log_empleado (
    id_log  SERIAL NOT NULL,
    feria   CHARACTER VARYING(100),
    ingreso DATE NOT NULL,
    termino DATE NOT NULL
);

ALTER TABLE log_empleado ADD CONSTRAINT log_empleado_pk PRIMARY KEY ( id_log );

CREATE TABLE postulaciones (
    id_postulacion SERIAL NOT NULL,
    feriante_mail  CHARACTER VARYING(80) NOT NULL,
    id_vacante     INTEGER NOT NULL,
    estado         CHAR(1) NOT NULL
);

ALTER TABLE postulaciones ADD CONSTRAINT invitaciones_pk PRIMARY KEY ( id_postulacion );

CREATE TABLE puesto (
    id_puesto        SERIAL NOT NULL,
    numero           INTEGER NOT NULL,
    id_tipo_puesto   INTEGER NOT NULL,
    id_feria         INTEGER NOT NULL,
    descripcion      TEXT NOT NULL,
    id_estado_puesto INTEGER NOT NULL
);

ALTER TABLE puesto ADD CONSTRAINT puesto_pk PRIMARY KEY ( id_puesto );

CREATE TABLE puesto_archivado (
    id_archivado SERIAL NOT NULL,
    nombre_feria CHARACTER VARYING(50) NOT NULL,
    puesto_feria INTEGER NOT NULL,
    id_feriante  INTEGER NOT NULL,
    user_mail    CHARACTER VARYING(80) NOT NULL
);

ALTER TABLE puesto_archivado ADD CONSTRAINT puesto_archivado_pk PRIMARY KEY ( id_archivado );

CREATE TABLE redes_sociales (
    id_redes      SERIAL NOT NULL,
    feriante_mail CHARACTER VARYING(80) NOT NULL,
    tipo_red      INTEGER NOT NULL,
    url_red       CHARACTER VARYING(200) NOT NULL
);

ALTER TABLE redes_sociales ADD CONSTRAINT redes_sociales_pk PRIMARY KEY ( id_redes );

CREATE TABLE region (
    id_region INTEGER NOT NULL,
    nombre    CHARACTER VARYING(100) NOT NULL
);

ALTER TABLE region ADD CONSTRAINT region_pk PRIMARY KEY ( id_region );

CREATE TABLE rol_empleado (
    id_rol INTEGER NOT NULL,
    rol    CHARACTER VARYING(20) NOT NULL
);

ALTER TABLE rol_empleado ADD CONSTRAINT rol_empleado_pk PRIMARY KEY ( id_rol );

CREATE TABLE solicitudes_apertura (
    id_solicitud    SERIAL NOT NULL,
    encargado_mail  CHARACTER VARYING(80) NOT NULL,
    admin_muni_mail CHARACTER VARYING(80) NOT NULL,
    id_feria        INTEGER NOT NULL
);

ALTER TABLE solicitudes_apertura ADD CONSTRAINT solicitudes_apertura_pk PRIMARY KEY ( id_solicitud );

CREATE TABLE tipo_estado_contrato (
    id_status_contrato INTEGER NOT NULL,
    detalle            CHARACTER VARYING(50) NOT NULL
);

ALTER TABLE tipo_estado_contrato ADD CONSTRAINT tipo_estado_contrato_pk PRIMARY KEY ( id_status_contrato );

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






-- TABLAS EXCLUSIVAS PARA AUDITORIA --> DATA ELIMINADA


CREATE TABLE log_detalle_programa (
    id_horario_feria    SERIAL NOT NULL,
    id_feria            INTEGER NOT NULL,
    id_dia_armado       INTEGER NOT NULL,
    dia                 CHARACTER VARYING(10) NOT NULL,
    hora_inicio         TIME WITHOUT TIME ZONE NOT NULL,
    hora_termino        TIME WITHOUT TIME ZONE NOT NULL,
    hora_inicio_armado  TIME WITHOUT TIME ZONE NOT NULL,
    hora_termino_armado TIME WITHOUT TIME ZONE NOT NULL,
    activo              boolean NOT NULL,
    PRIMARY KEY (id_horario_feria)
);


CREATE TABLE LOG_ACTIVIDAD_FERIA (
    id_actividad_feria SERIAL,
    id_horario_feria INTEGER,
    fecha DATE,
    armado_hecho CHAR(1),
    feria_hecha CHAR(1),
    activo boolean,
    PRIMARY KEY (id_actividad_feria)
);


ALTER TABLE LOG_ACTIVIDAD_FERIA 
    ADD CONSTRAINT id_horario_to_log_fk FOREIGN KEY (id_horario_feria)
        REFERENCES log_detalle_programa (id_horario_feria);


-- INICIO ALTERRRRRRRRRRRRRRRRRRRRRRRS

ALTER TABLE comuna
    ADD CONSTRAINT comuna_region_fk FOREIGN KEY ( id_region )
        REFERENCES region ( id_region );

ALTER TABLE contrato_puesto
    ADD CONSTRAINT contrato_diario_puesto_fk FOREIGN KEY ( id_puesto )
        REFERENCES puesto ( id_puesto );

ALTER TABLE contrato_puesto
    ADD CONSTRAINT contrato_diario_tipo_pago_fk FOREIGN KEY ( id_tipo_pago )
        REFERENCES tipo_pago ( id_tipo_pago );

ALTER TABLE contrato_puesto
    ADD CONSTRAINT contrato_puesto_feriante_fk FOREIGN KEY ( feriante_mail )
        REFERENCES feriante ( user_mail );

ALTER TABLE detalle_team_vacante
    ADD CONSTRAINT detalle_supervisor_feria_fk FOREIGN KEY ( supervisa_id_feria )
        REFERENCES feria ( id_feria );

ALTER TABLE detalle_team_vacante
    ADD CONSTRAINT detalle_supervisor_feriante_fk FOREIGN KEY ( feriante_mail )
        REFERENCES feriante ( user_mail );

ALTER TABLE detalle_team_vacante
    ADD CONSTRAINT detalle_team_rol_empleado_fk FOREIGN KEY ( id_rol )
        REFERENCES rol_empleado ( id_rol );

ALTER TABLE banco_encargado
    ADD CONSTRAINT encargado_mail_to_banco_fk FOREIGN KEY ( encargado_mail )
        REFERENCES encargado_feria ( user_mail );

ALTER TABLE contrato_puesto
    ADD CONSTRAINT estado_puesto_contrato_fk FOREIGN KEY ( estado_contrato )
        REFERENCES tipo_estado_contrato ( id_status_contrato );

ALTER TABLE feria
    ADD CONSTRAINT feria_banco_encargado_fk FOREIGN KEY ( mail_banco )
        REFERENCES banco_encargado ( mail_banco );

ALTER TABLE feria
    ADD CONSTRAINT feria_encargado_feria_fk FOREIGN KEY ( encargado_mail )
        REFERENCES encargado_feria ( user_mail );

ALTER TABLE feria
    ADD CONSTRAINT id_feria_estado_FK FOREIGN KEY ( id_estado )
        REFERENCES estado_feria ( id_estado );

ALTER TABLE horario_puesto
    ADD CONSTRAINT horario_puesto_puesto_fk FOREIGN KEY ( id_puesto )
        REFERENCES puesto ( id_puesto );

ALTER TABLE solicitudes_apertura
    ADD CONSTRAINT id_admin_soli_fk FOREIGN KEY ( admin_muni_mail )
        REFERENCES administrador_municipal ( user_mail );

ALTER TABLE detalle_solicitud
    ADD CONSTRAINT id_apertura_fk FOREIGN KEY ( solicitud_apertura_id )
        REFERENCES solicitudes_apertura ( id_solicitud );

ALTER TABLE feria
    ADD CONSTRAINT id_comuna_fk FOREIGN KEY ( id_comuna )
        REFERENCES comuna ( id_comuna );

ALTER TABLE solicitudes_apertura
    ADD CONSTRAINT id_encargado_soli_fk FOREIGN KEY ( encargado_mail )
        REFERENCES encargado_feria ( user_mail );

ALTER TABLE detalle_programa_feria
    ADD CONSTRAINT id_dia_armado_fk FOREIGN KEY ( id_dia_armado )
        REFERENCES dia_armado ( id_dia_armado );

ALTER TABLE json_feria
    ADD CONSTRAINT id_feria_to_json_fk FOREIGN KEY ( id_feria )
        REFERENCES feria ( id_feria );

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
    ADD CONSTRAINT intereses_feriante_fk FOREIGN KEY ( user_mail )
        REFERENCES feriante ( user_mail );

ALTER TABLE postulaciones
    ADD CONSTRAINT invitaciones_feriante_fk FOREIGN KEY ( feriante_mail )
        REFERENCES feriante ( user_mail );

ALTER TABLE postulaciones
    ADD CONSTRAINT postulaciones_detalle_team_fk FOREIGN KEY ( id_vacante )
        REFERENCES detalle_team_vacante ( id_vacante );

ALTER TABLE detalle_programa_feria
    ADD CONSTRAINT programa_id_feria_fk FOREIGN KEY ( id_feria )
        REFERENCES feria ( id_feria );

ALTER TABLE puesto_archivado
    ADD CONSTRAINT puesto_archivado_feriante_fk FOREIGN KEY ( user_mail )
        REFERENCES feriante ( user_mail );

ALTER TABLE puesto
    ADD CONSTRAINT puesto_estado_puesto_fk FOREIGN KEY ( id_estado_puesto )
        REFERENCES estado_puesto ( id_estado_puesto );

ALTER TABLE puesto
    ADD CONSTRAINT puesto_feria_fk FOREIGN KEY ( id_feria )
        REFERENCES feria ( id_feria );

ALTER TABLE puesto
    ADD CONSTRAINT puesto_tipo_puesto_fk FOREIGN KEY ( id_tipo_puesto )
        REFERENCES tipo_puesto ( id_tipo_puesto );

ALTER TABLE redes_sociales
    ADD CONSTRAINT redes_sociales_feriante_fk FOREIGN KEY ( feriante_mail )
        REFERENCES feriante ( user_mail );

ALTER TABLE redes_sociales
    ADD CONSTRAINT redes_sociales_tipo_red_fk FOREIGN KEY ( tipo_red )
        REFERENCES tipo_red ( id_tipo_red );

ALTER TABLE encargado_feria
    ADD CONSTRAINT tipo_user_to_encargado_fk FOREIGN KEY ( id_tipo_usuario )
        REFERENCES tipo_usuario ( id_tipo_usuario );



