-- Drop existing tables aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

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
DROP TABLE IF EXISTS detalle_programa CASCADE;
DROP TABLE IF EXISTS detalle_solicitud CASCADE;
DROP TABLE IF EXISTS detalle_supervisor CASCADE;
DROP TABLE IF EXISTS redes_sociales CASCADE;
DROP TABLE IF EXISTS tipo_red CASCADE;

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

ALTER TABLE comuna ADD CONSTRAINT comuna_pk PRIMARY KEY ( id_comuna,
                                                          id_region );

CREATE TABLE contrato_puesto (
    id_contrato     SERIAL NOT NULL,
    fecha           TIMESTAMP WITH TIME ZONE NOT NULL,
    id_puesto       INTEGER NOT NULL,
    id_tipo_pago    INTEGER NOT NULL,
    estado_contrato INTEGER NOT NULL,
    precio          INTEGER NOT NULL,
    feriante_mail   CHARACTER VARYING(80) NOT NULL
);

ALTER TABLE contrato_puesto ADD CONSTRAINT contrato_diario_pk PRIMARY KEY ( id_contrato );

CREATE TABLE detalle_programa (
    id_detalle_programa SERIAL NOT NULL,		
    id_feria       INTEGER NOT NULL,
    dia            CHARACTER VARYING(10) NOT NULL,
    hora_inicio    DATE NOT NULL,
    hora_termino   DATE NOT NULL,
    detalle_armado TEXT NOT NULL,
    PRIMARY KEY (id_detalle_programa)
);

CREATE TABLE detalle_solicitud (
    id_archivo            SERIAL NOT NULL,
    nombre_archivo        CHARACTER VARYING(100) NOT NULL,
    url_archivo           CHARACTER VARYING(200) NOT NULL,
    solicitud_apertura_id INTEGER NOT NULL
);

ALTER TABLE detalle_solicitud ADD CONSTRAINT detalle_pk PRIMARY KEY ( id_archivo );

CREATE TABLE detalle_supervisor (
    id_supervisor      INTEGER NOT NULL,
    feriante_mail      CHARACTER VARYING(80) NOT NULL,
    encargado_mail     CHARACTER VARYING(80) NOT NULL,
    supervisa_id_feria INTEGER
);

ALTER TABLE detalle_supervisor ADD CONSTRAINT team_supervisor_pk PRIMARY KEY ( id_supervisor );

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

CREATE TABLE estado_feria (
    estado    CHARACTER VARYING(20) NOT NULL,
    id_estado INTEGER NOT NULL
);

ALTER TABLE estado_feria ADD CONSTRAINT estado_feria_pk PRIMARY KEY ( id_estado );

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

ALTER TABLE feria ADD CONSTRAINT feria__un UNIQUE ( id_feria );

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

CREATE TABLE programa_feria (
    id_feria 	   INTEGER NOT NULL,
    lunes          CHAR(1) NOT NULL,
    martes         CHAR(1) NOT NULL,
    miercoles      CHAR(1) NOT NULL,
    jueves         CHAR(1) NOT NULL,
    viernes        CHAR(1) NOT NULL,
    sabado         CHAR(1) NOT NULL,
    domingo        CHAR(1) NOT NULL
);

ALTER TABLE programa_feria ADD CONSTRAINT programa_feria_pk PRIMARY KEY ( id_feria );

CREATE TABLE estado_puesto (
id_estado_puesto INTEGER NOT NULL,
estado CHARACTER VARYING NOT NULL,
PRIMARY KEY (id_estado_puesto)
);



CREATE TABLE puesto (
    id_puesto      SERIAL NOT NULL,
    numero         INTEGER NOT NULL,
    id_tipo_puesto INTEGER NOT NULL,
    id_feria       INTEGER NOT NULL,
    descripcion    TEXT NOT NULL,
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

ALTER TABLE detalle_supervisor
    ADD CONSTRAINT detalle_supervisor_feria_fk FOREIGN KEY ( supervisa_id_feria )
        REFERENCES feria ( id_feria );

ALTER TABLE detalle_supervisor
    ADD CONSTRAINT detalle_supervisor_feriante_fk FOREIGN KEY ( feriante_mail )
        REFERENCES feriante ( user_mail );

ALTER TABLE detalle_supervisor
    ADD CONSTRAINT encargado_mail_sup_fk FOREIGN KEY ( encargado_mail )
        REFERENCES encargado_feria ( user_mail );

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
    ADD CONSTRAINT feria_estado_solicitud_fk FOREIGN KEY ( id_estado )
        REFERENCES estado_feria ( id_estado );

ALTER TABLE programa_feria
    ADD CONSTRAINT horario_feria_feria_fk FOREIGN KEY ( id_feria )
        REFERENCES feria ( id_feria );

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
    ADD CONSTRAINT id_comuna_fk FOREIGN KEY ( id_comuna,
                                              id_region )
        REFERENCES comuna ( id_comuna,
                            id_region );

ALTER TABLE solicitudes_apertura
    ADD CONSTRAINT id_encargado_soli_fk FOREIGN KEY ( encargado_mail )
        REFERENCES encargado_feria ( user_mail );

ALTER TABLE json_feria
    ADD CONSTRAINT id_feria_to_json_fk FOREIGN KEY ( id_feria )
        REFERENCES feria ( id_feria );

ALTER TABLE detalle_programa
    ADD CONSTRAINT id_programa_feria_fk FOREIGN KEY ( id_feria )
        REFERENCES programa_feria ( id_feria );

ALTER TABLE administrador_municipal
    ADD CONSTRAINT id_tipo_user_to_admin FOREIGN KEY ( id_tipo_usuario )
        REFERENCES tipo_usuario ( id_tipo_usuario );

ALTER TABLE feriante
    ADD CONSTRAINT id_tipo_user_to_feriante_fk FOREIGN KEY ( id_tipo_usuario )
        REFERENCES tipo_usuario ( id_tipo_usuario );

ALTER TABLE intereses
    ADD CONSTRAINT intereses_feriante_fk FOREIGN KEY ( user_mail )
        REFERENCES feriante ( user_mail );

ALTER TABLE puesto_archivado
    ADD CONSTRAINT puesto_archivado_feriante_fk FOREIGN KEY ( user_mail )
        REFERENCES feriante ( user_mail );

ALTER TABLE puesto
    ADD CONSTRAINT puesto_feria_fk FOREIGN KEY ( id_feria )
        REFERENCES feria ( id_feria );
ALTER TABLE puesto
	ADD CONSTRAINT PUESTO_ESTADO_PUESTO_FK FOREIGN KEY (id_estado_puesto)
		REFERENCES estado_puesto (id_estado_puesto);

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


