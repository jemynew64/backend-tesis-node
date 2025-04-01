import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Crear los cursos
  const cursoMatematicas = await prisma.curso.create({
    data: {
      titulo: "Matemáticas",
      imagen_src: "matematicas.png",
    },
  });

  const cursoComunicacion = await prisma.curso.create({
    data: {
      titulo: "Comunicación",
      imagen_src: "comunicacion.png",
    },
  });
  // Hashear contraseñas antes de guardarlas
  const saltRounds = 10;
  const hashedPassword1 = await bcrypt.hash("123456", saltRounds);
  const hashedPassword2 = await bcrypt.hash("123456", saltRounds);
  // Crear los usuarios
  const usuario10 = await prisma.usuario.create({
    data: {
      nombre: "jemal",
      email: "jemal@ejemplo.com",
      contrasena: hashedPassword1,
      imagen_perfil: "/default_user.png",
      tipo_usuario: "admin",
    },
  });

  const usuario1 = await prisma.usuario.create({
    data: {
      nombre: "Juan Pérez",
      email: "juan@ejemplo.com",
      contrasena: hashedPassword2,
      imagen_perfil: "/default_user.png",
    },
  });

  // Crear Unidades para Matemáticas
  const unidadMatematicas1 = await prisma.unidad.create({
    data: {
      titulo: "Suma y Resta",
      descripcion: "Aprende a sumar y restar números.",
      curso_id: cursoMatematicas.id,
      orden: 1,
    },
  });

  const unidadMatematicas2 = await prisma.unidad.create({
    data: {
      titulo: "Multiplicación",
      descripcion: "Aprende a multiplicar números.",
      curso_id: cursoMatematicas.id,
      orden: 2,
    },
  });

  // Crear Unidades para Comunicación
  const unidadComunicacion1 = await prisma.unidad.create({
    data: {
      titulo: "Lectura de Cuentos",
      descripcion: "Lee cuentos y aprende vocabulario.",
      curso_id: cursoComunicacion.id,
      orden: 1,
    },
  });

  const unidadComunicacion2 = await prisma.unidad.create({
    data: {
      titulo: "Escritura Creativa",
      descripcion: "Escribe tus propios cuentos.",
      curso_id: cursoComunicacion.id,
      orden: 2,
    },
  });

  // Crear Lecciones de Matemáticas
  const leccionMatematicas1 = await prisma.leccion.create({
    data: {
      titulo: "Suma de Números",
      unidad_id: unidadMatematicas1.id,
      orden: 1,
    },
  });

  const leccionMatematicas2 = await prisma.leccion.create({
    data: {
      titulo: "Resta de Números",
      unidad_id: unidadMatematicas1.id,
      orden: 2,
    },
  });

  const leccionMatematicas3 = await prisma.leccion.create({
    data: {
      titulo: "Multiplicación de Números",
      unidad_id: unidadMatematicas2.id,
      orden: 1,
    },
  });

  // Crear Lecciones de Comunicación
  const leccionComunicacion1 = await prisma.leccion.create({
    data: {
      titulo: "Responde preguntas sobre el cuento: La tortuga y la liebre",
      unidad_id: unidadComunicacion1.id,
      orden: 1,
    },
  });

  const leccionComunicacion2 = await prisma.leccion.create({
    data: {
      titulo: "Escribe y responde preguntas sobre tu propio cuento",
      unidad_id: unidadComunicacion2.id,
      orden: 1,
    },
  });

  // Crear Retos de Matemáticas: Suma
  const retoSuma1 = await prisma.reto.create({
    data: {
      leccion_id: leccionMatematicas1.id,
      tipo: "SELECCIONAR",
      pregunta: "¿Cuánto es 7 + 5?",
      orden: 1,
    },
  });

  await prisma.opcion_reto.createMany({
    data: [
      { reto_id: retoSuma1.id, texto: "12", correcto: true },
      { reto_id: retoSuma1.id, texto: "13", correcto: false },
      { reto_id: retoSuma1.id, texto: "11", correcto: false },
    ],
  });

  const retoSuma2 = await prisma.reto.create({
    data: {
      leccion_id: leccionMatematicas1.id,
      tipo: "SELECCIONAR",
      pregunta: "¿Cuánto es 15 + 8?",
      orden: 2,
    },
  });

  await prisma.opcion_reto.createMany({
    data: [
      { reto_id: retoSuma2.id, texto: "23", correcto: true },
      { reto_id: retoSuma2.id, texto: "22", correcto: false },
      { reto_id: retoSuma2.id, texto: "21", correcto: false },
    ],
  });

  // Reto de Resta
  const retoResta1 = await prisma.reto.create({
    data: {
      leccion_id: leccionMatematicas2.id,
      tipo: "SELECCIONAR",
      pregunta: "¿Cuánto es 9 - 4?",
      orden: 1,
    },
  });

  await prisma.opcion_reto.createMany({
    data: [
      { reto_id: retoResta1.id, texto: "5", correcto: true },
      { reto_id: retoResta1.id, texto: "6", correcto: false },
      { reto_id: retoResta1.id, texto: "4", correcto: false },
    ],
  });

  // Reto de Multiplicación
  const retoMultiplicacion1 = await prisma.reto.create({
    data: {
      leccion_id: leccionMatematicas3.id,
      tipo: "SELECCIONAR",
      pregunta: "¿Cuánto es 6 x 4?",
      orden: 1,
    },
  });

  await prisma.opcion_reto.createMany({
    data: [
      { reto_id: retoMultiplicacion1.id, texto: "24", correcto: true },
      { reto_id: retoMultiplicacion1.id, texto: "20", correcto: false },
      { reto_id: retoMultiplicacion1.id, texto: "22", correcto: false },
    ],
  });

  // Crear Retos de Comunicación
  const retoComunicacion1 = await prisma.reto.create({
    data: {
      leccion_id: leccionComunicacion1.id,
      tipo: "ESCRIBIR",
      pregunta: "¿Qué sucedió al final del cuento 'La tortuga y la liebre'?",
      orden: 1,
    },
  });

  const retoComunicacion2 = await prisma.reto.create({
    data: {
      leccion_id: leccionComunicacion2.id,
      tipo: "ESCRIBIR",
      pregunta: "Escribe un resumen de tu cuento.",
      orden: 1,
    },
  });

  console.log("Datos de ejemplo creados correctamente");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
