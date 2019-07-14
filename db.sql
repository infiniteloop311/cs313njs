CREATE TABLE links (
    id      SERIAL NOT NULL PRIMARY KEY,
    name    varchar(80) NOT NULL UNIQUE,
    link    varchar NOT NULL
);

INSERT INTO links(name, link) VALUES('AMS', 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AnimatedMorphSphere/glTF/AnimatedMorphSphere.gltf');

INSERT INTO links(name, link) VALUES('BVC', 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxVertexColors/glTF/BoxVertexColors.gltf');