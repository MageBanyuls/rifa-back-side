CREATE TABLE usuarios (--
    id VARCHAR(100) NOT NULL,
    nombre VARCHAR(100),
    email VARCHAR(200) NOT NULL,
    celular VARCHAR(50),
    rut VARCHAR(100),
    fecha_de_nacimiento DATE,
    activo BOOLEAN NOT NULL DEFAULT 1,
    password VARCHAR(100),
    complete_register BOOLEAN NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE suscripciones (--
    id VARCHAR(100) NOT NULL,
    id_user VARCHAR(100) NOT NULL,
    date_created DATE,
    card_id VARCHAR(200),
    payment_method_id VARCHAR(100),
    plan_id VARCHAR(100) NOT NULL,
    end_date DATE,
    billing_day INT,
    type VARCHAR(25),
    PRIMARY KEY (id),
    KEY usuarios(id_user),
    KEY planes(plan_id)
);

CREATE TABLE pagos(
    id VARCHAR(100) NOT NULL,
    next_payment_date DATE,
    date_created DATE,
    suscription_id VARCHAR(100) NOT NULL,
    transaction_amount FLOAT NOT NULL,
    currency_id VARCHAR(10) NOT NULL,
    PRIMARY KEY (id),
    KEY suscripciones(suscription_id)
);

CREATE TABLE planes(
    id VARCHAR(100) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    precio VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE planes_por_usuario(
    id VARCHAR(100) NOT NULL,
    id_user VARCHAR(100) NOT NULL,
    id_plan VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    KEY usuarios(id_user),
    KEY planes(id_plan)
);