import { CourseModel } from "../../database/prismaClient";
import { CourseSchema, CourseType } from "./CourseSchema";

export const findAllCourses = async (page: number, limit: number) => {
  return await CourseModel.findMany({
    take: limit,
    skip: (page - 1) * limit,
  });
};

export const findCourseById = async (id: number) => {
  return await CourseModel.findUnique({ where: { id } });
};

export const createNewCourse = async (data: CourseType) => {
  const validatedData = CourseSchema.parse(data);
  return await CourseModel.create({ data: validatedData });
};

export const deleteCourseById = async (id: number) => {
  return await CourseModel.delete({ where: { id } });
};

export const updateCourseById = async (
  id: number,
  data: Partial<CourseType>
) => {
  const validatedData = CourseSchema.partial().parse(data);
  return await CourseModel.update({
    where: { id },
    data: validatedData,
  });
};

export const courseidunitlesson= async (id: number,user_id:number) => {
  return await CourseModel.findFirst(
    { where: { id } ,
    select:{
      title:true,
      unit:{
        select:{
          title:true,
          description:true,
          lesson:{
            select:{
              id:true,
              title:true,
              lesson_progress: {
                where: {
                  user_id: user_id,
                },
                select: {
                  completed: true,
                },
              },
            }
          }
        }
      }
    }
  });
};
// Función para obtener el curso con sus lecciones desbloqueadas por usuario
export const courseWithUnlockedLessons = async (courseId: number, userId: number) => {
  // 1️⃣ Buscamos el curso por su ID
  const course = await CourseModel.findFirst({
    where: { id: courseId },
    select: {
      title: true, // Solo traemos el título del curso
      unit: {
        orderBy: { order_num: "asc" }, // Ordenamos las unidades por su número
        select: {
          title: true,
          description: true,
          lesson: {
            orderBy: { order_num: "asc" }, // Ordenamos lecciones dentro de la unidad
            select: {
              id: true,
              title: true,
              lesson_progress: {
                where: { user_id: userId }, // Solo traemos el progreso del usuario actual
                select: { completed: true }, // Solo nos interesa si está completada
              },
            },
          },
        },
      },
    },
  });

  // 2️⃣ Si no se encuentra el curso, devolvemos null
  if (!course) return null;

  // 3️⃣ Construimos manualmente la estructura de respuesta con el estado de desbloqueo
  const courseWithStatus = {
    title: course.title,
    unit: course.unit.map((unit) => {
      // Para cada unidad, procesamos las lecciones
      const lessonWithStatus = unit.lesson.map((lesson, index, array) => {
        const isFirst = index === 0; // La primera lección siempre está desbloqueada
        const previousCompleted = isFirst|| array[index - 1].lesson_progress?.[0]?.completed; // reviso en la leccion anterior aver si esta completada
// Traducción humana
// Si estoy en la primera lección → desbloqueada.

// Sino:
//   Reviso la lección anterior:
//     ¿Tiene progreso?
//     ¿Ese progreso está completado?
//       ✔️ Sí → desbloqueada
//       ❌ No o undefined → bloqueada
        return {
          id: lesson.id,
          title: lesson.title,
          completed: lesson.lesson_progress?.[0]?.completed || false, // Estado actual
          //este campo de abajo es dependiendo de la anterior 
          unlocked: isFirst || previousCompleted, // Desbloqueada si es la primera o si la anterior está completada
        };
      });
      //hasta aca es de lesson
      return {
        title: unit.title,
        description: unit.description,
        lesson: lessonWithStatus,
      };
    }),
  };

  return courseWithStatus;
};



