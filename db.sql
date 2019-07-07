CREATE TABLE links (
    id      SERIAL NOT NULL PRIMARY KEY,
    name    varchar(80) NOT NULL UNIQUE,
    link    varchar NOT NULL
);