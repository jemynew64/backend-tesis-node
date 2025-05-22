import { UserModel, UserProgressModel,CourseModel  } from "../../database/prismaClient";
import { UserSchema, UserType } from "./UserSchema";
import { hashPassword } from "../../utils/hashPassword";
import { scheduleHeartRecovery } from "./heartRecoveryTimer"; // ✅ importa

// Get all users with pagination
export const getUsersService = async (page: number, limit: number) => {
    return await UserModel.findMany({
        where: { user_type: "student" },
        take: limit,
        skip: (page - 1) * limit,
    });
};

// Get user by ID
export const getUserByIdService = async (id: number) => {
    return await UserModel.findUnique({
        where: { id },
    });
};

// Create a new user
export const createUserService = async (userData: UserType) => {
    // Validar los datos del usuario
    const validatedUserData = UserSchema.parse(userData);
  
    // Verificar si el email ya existe
    const existingUser = await UserModel.findUnique({
      where: { email: validatedUserData.email },
    });
  
    if (existingUser) {
      throw new Error("Email is already registered");
    }
  
    // Hashear la contraseña
    const hashedPassword = await hashPassword(validatedUserData.password);
  
    // Crear el usuario
    const newUser = await UserModel.create({
      data: {
        ...validatedUserData,
        password: hashedPassword,
      },
    });
  
    // Buscar cursos por título
    const mathCourse = await CourseModel.findFirst({ where: { title: "Matemáticas" } });
    const communicationCourse = await CourseModel.findFirst({ where: { title: "Comunicación" } });
  
    if (!mathCourse || !communicationCourse) {
      throw new Error("Los cursos base no están registrados en la base de datos.");
    }
  
    // Crear el progreso del usuario en ambos cursos
    await UserProgressModel.createMany({
      data: [
        {
          user_id: newUser.id,
          active_course_id: mathCourse.id,
        },
        {
          user_id: newUser.id,
          active_course_id: communicationCourse.id,
        },
      ],
    });
  
    return newUser;
  };

// Delete a user
export const deleteUserService = async (id: number) => {
    await UserModel.delete({
        where: { id },
    });
};

// Update user details
export const updateUserService = async (id: number, userData: Partial<UserType>) => {
    // Check if the user exists
    const existingUser = await UserModel.findUnique({
        where: { id },
    });

    if (!existingUser) {
        throw new Error("User not found");
    }

    // If updating the password, hash it
    if (userData.password) {
        userData.password = await hashPassword(userData.password);
    }

    // Update user in the database
    const updatedUser = await UserModel.update({
        where: { id },
        data: userData,
    });

    return updatedUser;
};

export const ReducerliveService = async (id: number) => {
  const user = await UserModel.findUnique({ where: { id } });

  if (!user) throw new Error("User not found");
  if (user.hearts <= 0) throw new Error("User has no remaining life");

  const updatedUser = await UserModel.update({
    where: { id },
    data: {
      hearts: user.hearts - 1,
    },
  });

  // 🕒 Programar recuperación si es necesario
  if (updatedUser.hearts < 5) {
    scheduleHeartRecovery(updatedUser.id);
  }

  return updatedUser;
};