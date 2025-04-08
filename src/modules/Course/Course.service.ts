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
// export const courseidunitlesson= async (id: number) => {
//   return await CourseModel.findUnique(
//     { where: { id } ,
//     select:{
//       id:true,
//       title:true,
//       unit:{
//         select:{
//           title:true,
//           description:true,
//           lesson:{
//             select:{
//               id:true,
//               title:true
//             }
//           }
//         }
//       }
//     }
  
  
//   });
// };