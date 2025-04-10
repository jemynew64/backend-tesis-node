import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create Courses
  const mathCourse = await prisma.course.create({
    data: {
      title: "Matemáticas",
      image_src: "matematicas.png",
    },
  });

  const communicationCourse = await prisma.course.create({
    data: {
      title: "Comunicación",
      image_src: "comunicacion.png",
    },
  });

  // Hash passwords
  const saltRounds = 10;
  const hashedPassword1 = await bcrypt.hash("123456", saltRounds);
  const hashedPassword2 = await bcrypt.hash("123456", saltRounds);
  const hashedPassword3 = await bcrypt.hash("123456", saltRounds);

  // Create Users
  const adminUser = await prisma.user_account.create({
    data: {
      name: "jemal",
      email: "jemal@ejemplo.com",
      password: hashedPassword1,
      profile_image: "/default_user.png",
      user_type: "admin",
    },
  });

  const regularUser = await prisma.user_account.create({
    data: {
      name: "Juan Pérez",
      email: "juan@ejemplo.com",
      password: hashedPassword2,
      profile_image: "/default_user.png",
    },
  });

  const regularUser2 = await prisma.user_account.create({
    data: {
      name: "Alejandro marino",
      email: "Alejo@gmail.com",
      password: hashedPassword3,
      profile_image: "/default_user.png",
    },
  });

  // Create Math Units
  const mathUnit1 = await prisma.unit.create({
    data: {
      title: "Suma y Resta",
      description: "Aprende a sumar y restar números.",
      course_id: mathCourse.id,
      order_num: 1,
    },
  });

  const mathUnit2 = await prisma.unit.create({
    data: {
      title: "Multiplicación",
      description: "Aprende a multiplicar números.",
      course_id: mathCourse.id,
      order_num: 2,
    },
  });

  // Create Communication Units
  const communicationUnit1 = await prisma.unit.create({
    data: {
      title: "Lectura de Cuentos",
      description: "Lee cuentos y aprende vocabulario.",
      course_id: communicationCourse.id,
      order_num: 1,
    },
  });

  const communicationUnit2 = await prisma.unit.create({
    data: {
      title: "Escritura Creativa",
      description: "Escribe tus propios cuentos.",
      course_id: communicationCourse.id,
      order_num: 2,
    },
  });

  // Create Math Lessons
  const mathLesson1 = await prisma.lesson.create({
    data: {
      title: "Suma de Números",
      unit_id: mathUnit1.id,
      order_num: 1,
    },
  });

  const mathLesson2 = await prisma.lesson.create({
    data: {
      title: "Resta de Números",
      unit_id: mathUnit1.id,
      order_num: 2,
    },
  });

  const mathLesson3 = await prisma.lesson.create({
    data: {
      title: "Multiplicación de Números",
      unit_id: mathUnit2.id,
      order_num: 1,
    },
  });

  // Create Communication Lessons
  const communicationLesson1 = await prisma.lesson.create({
    data: {
      title: "Responde preguntas sobre el cuento: La tortuga y la liebre",
      unit_id: communicationUnit1.id,
      order_num: 1,
    },
  });

  const communicationLesson2 = await prisma.lesson.create({
    data: {
      title: "Escribe y responde preguntas sobre tu propio cuento",
      unit_id: communicationUnit2.id,
      order_num: 1,
    },
  });

  // Math Challenges: Addition
  const additionChallenge1 = await prisma.challenge.create({
    data: {
      lesson_id: mathLesson1.id,
      type: "SELECCIONAR",
      question: "¿Cuánto es 7 + 5?",
      order_num: 1,
    },
  });

  await prisma.challenge_option.createMany({
    data: [
      { challenge_id: additionChallenge1.id, text: "12", is_correct: true },
      { challenge_id: additionChallenge1.id, text: "13", is_correct: false },
      { challenge_id: additionChallenge1.id, text: "11", is_correct: false },
    ],
  });

  const additionChallenge2 = await prisma.challenge.create({
    data: {
      lesson_id: mathLesson1.id,
      type: "SELECCIONAR",
      question: "¿Cuánto es 15 + 8?",
      order_num: 2,
    },
  });

  await prisma.challenge_option.createMany({
    data: [
      { challenge_id: additionChallenge2.id, text: "23", is_correct: true },
      { challenge_id: additionChallenge2.id, text: "22", is_correct: false },
      { challenge_id: additionChallenge2.id, text: "21", is_correct: false },
    ],
  });

  // Subtraction Challenge
  const subtractionChallenge = await prisma.challenge.create({
    data: {
      lesson_id: mathLesson2.id,
      type: "SELECCIONAR",
      question: "¿Cuánto es 9 - 4?",
      order_num: 1,
    },
  });

  await prisma.challenge_option.createMany({
    data: [
      { challenge_id: subtractionChallenge.id, text: "5", is_correct: true },
      { challenge_id: subtractionChallenge.id, text: "6", is_correct: false },
      { challenge_id: subtractionChallenge.id, text: "4", is_correct: false },
    ],
  });

  // Multiplication Challenge
  const multiplicationChallenge = await prisma.challenge.create({
    data: {
      lesson_id: mathLesson3.id,
      type: "SELECCIONAR",
      question: "¿Cuánto es 6 x 4?",
      order_num: 1,
    },
  });

  await prisma.challenge_option.createMany({
    data: [
      { challenge_id: multiplicationChallenge.id, text: "24", is_correct: true },
      { challenge_id: multiplicationChallenge.id, text: "20", is_correct: false },
      { challenge_id: multiplicationChallenge.id, text: "22", is_correct: false },
    ],
  });

  // Communication Challenges
  const communicationChallenge1 = await prisma.challenge.create({
    data: {
      lesson_id: communicationLesson1.id,
      type: "ESCRIBIR",
      question: "¿Qué sucedió al final del cuento 'La tortuga y la liebre'?",
      order_num: 1,
    },
  });

  const communicationChallenge2 = await prisma.challenge.create({
    data: {
      lesson_id: communicationLesson2.id,
      type: "ESCRIBIR",
      question: "Escribe un resumen de tu cuento.",
      order_num: 1,
    },
  });

  // Create Achievements
  const achievements = await prisma.achievement.createMany({
    data: [
      {
        title: "Primer Paso",
        description: "Completa tu primera lección",
        image_src: "first-step.png",
        required_experience: 10,
        required_level: 1
      },
      {
        title: "Matemático Novato",
        description: "Completa 5 lecciones de matemáticas",
        image_src: "math-novice.png",
        required_experience: 50,
        required_level: 2
      },
      {
        title: "Escritor en Desarrollo",
        description: "Completa 3 lecciones de comunicación",
        image_src: "writer.png",
        required_experience: 30,
        required_level: 1
      }
    ]
  });

  // Create Missions
  const missions = await prisma.mission.createMany({
    data: [
      {
        title: "Completa tu primera lección",
        description: "Completa cualquier lección para comenzar tu viaje de aprendizaje",
        granted_experience: 10
      },
      {
        title: "Estudiante dedicado",
        description: "Completa 5 lecciones en un día",
        granted_experience: 50
      },
      {
        title: "Explorador de cursos",
        description: "Completa lecciones en dos cursos diferentes",
        granted_experience: 30
      }
    ]
  });

  // Set user progress (active courses)
  await prisma.user_progress.createMany({
    data: [
      {
        user_id: regularUser.id,
        active_course_id: mathCourse.id
      },
      {
        user_id: regularUser2.id,
        active_course_id: communicationCourse.id
      }
    ]
  });

  // Create some lesson progress for regularUser
  await prisma.lesson_progress.createMany({
    data: [
      {
        user_id: regularUser.id,
        lesson_id: mathLesson1.id,
        completed: true
      },
      {
        user_id: regularUser.id,
        lesson_id: mathLesson2.id,
        completed: false
      }
    ]
  });

  // Create some challenge progress for regularUser
  await prisma.challenge_progress.createMany({
    data: [
      {
        user_id: regularUser.id,
        challenge_id: additionChallenge1.id,
        completed: true
      },
      {
        user_id: regularUser.id,
        challenge_id: additionChallenge2.id,
        completed: false
      }
    ]
  });

  // Assign some achievements to users
  await prisma.earned_achievement.createMany({
    data: [
      {
        user_id: regularUser.id,
        achievement_id: 1 // Primer Paso
      },
      {
        user_id: regularUser2.id,
        achievement_id: 1 // Primer Paso
      }
    ]
  });

  // Assign some missions to users
  await prisma.user_mission.createMany({
    data: [
      {
        user_id: regularUser.id,
        mission_id: 1,
        completed: true,
        completed_at: new Date()
      },
      {
        user_id: regularUser.id,
        mission_id: 2,
        completed: false
      },
      {
        user_id: regularUser2.id,
        mission_id: 1,
        completed: true,
        completed_at: new Date()
      }
    ]
  });

  console.log("La data se ha creado correctamente.");
}

main()
  .catch((e) => {
    console.error("Error al ejecutar el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
