# Proyecto: Configuración de Base de Datos con Docker y PostgreSQL

## Comandos Docker

### Crear y ejecutar un contenedor PostgreSQL
```sh
docker run -d --name my_postgres \
  -e POSTGRES_USER=jemal \
  -e POSTGRES_PASSWORD=123456 \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 postgres
```

### Acceder a PostgreSQL dentro del contenedor
```sh
docker exec -it my_postgres psql -U jemal -d mydb
```

---

## Script de Creación de Base de Datos

```sql
BEGIN;

-- Tabla Curso
CREATE TABLE curso (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    imagen_src VARCHAR(255) NOT NULL
);

-- Tabla Unidad
CREATE TABLE unidad (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    orden INTEGER NOT NULL,
    curso_id INTEGER NOT NULL REFERENCES curso(id) ON DELETE CASCADE
);

-- Tabla Lección
CREATE TABLE leccion (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    orden INTEGER NOT NULL,
    unidad_id INTEGER NOT NULL REFERENCES unidad(id) ON DELETE CASCADE
);

-- Tabla Usuario
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    imagen_perfil VARCHAR(255) NOT NULL DEFAULT '/default_user.png',
    corazones INTEGER NOT NULL DEFAULT 5,
    puntos INTEGER NOT NULL DEFAULT 0,
    experiencia INTEGER NOT NULL DEFAULT 0,
    nivel INTEGER NOT NULL DEFAULT 1,
    tipo_usuario VARCHAR(10) NOT NULL DEFAULT 'estudiante'
);

-- Tabla Reto
CREATE TABLE reto (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL,
    pregunta TEXT NOT NULL,
    orden INTEGER NOT NULL,
    leccion_id INTEGER NOT NULL REFERENCES leccion(id) ON DELETE CASCADE
);

-- Tabla Opción Reto
CREATE TABLE opcion_reto (
    id SERIAL PRIMARY KEY,
    texto TEXT NOT NULL,
    correcto BOOLEAN NOT NULL,
    imagen_src VARCHAR(255),
    audio_src VARCHAR(255),
    reto_id INTEGER NOT NULL REFERENCES reto(id) ON DELETE CASCADE
);

-- Tabla Progreso Usuario
CREATE TABLE progreso_usuario (
    id SERIAL PRIMARY KEY,
    curso_activo_id INTEGER NOT NULL REFERENCES curso(id) ON DELETE CASCADE,
    usuario_id INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE
);

-- Tabla Progreso Reto
CREATE TABLE progreso_reto (
    id SERIAL PRIMARY KEY,
    completado BOOLEAN NOT NULL,
    reto_id INTEGER NOT NULL REFERENCES reto(id) ON DELETE CASCADE,
    usuario_id INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE
);

-- Tabla Logro
CREATE TABLE logro (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    imagen_src VARCHAR(255) NOT NULL,
    experiencia_requerida INTEGER NOT NULL,
    nivel_requerido INTEGER NOT NULL
);

-- Tabla Logro Obtenido
CREATE TABLE logro_obtenido (
    id SERIAL PRIMARY KEY,
    fecha_obtencion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    logro_id INTEGER NOT NULL REFERENCES logro(id) ON DELETE CASCADE,
    usuario_id INTEGER NOT NULL REFERENCES usuario(id) ON DELETE CASCADE
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_reto_leccion ON reto (leccion_id);
CREATE INDEX idx_opcion_reto_reto ON opcion_reto (reto_id);
CREATE INDEX idx_unidad_curso ON unidad (curso_id);
CREATE INDEX idx_leccion_unidad ON leccion (unidad_id);
CREATE INDEX idx_progreso_usuario_curso ON progreso_usuario (curso_activo_id);
CREATE INDEX idx_progreso_usuario_usuario ON progreso_usuario (usuario_id);
CREATE INDEX idx_progreso_reto_reto ON progreso_reto (reto_id);
CREATE INDEX idx_progreso_reto_usuario ON progreso_reto (usuario_id);
CREATE INDEX idx_logro_obtenido_logro ON logro_obtenido (logro_id);
CREATE INDEX idx_logro_obtenido_usuario ON logro_obtenido (usuario_id);

COMMIT;
```

---

## Configuración del archivo `.env`

```env
DATABASE_URL="postgresql://jemal:123456@localhost:5432/mydb?schema=public"
```

---

Este archivo proporciona una guía rápida para configurar y trabajar con la base de datos en PostgreSQL utilizando Docker. 🚀

