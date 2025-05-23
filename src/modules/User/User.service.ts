import { UserModel, UserProgressModel,CourseModel,prisma ,heart_recoveryModel  } from "../../database/prismaClient";
import { UserSchema, UserType } from "./UserSchema";
import { hashPassword } from "../../utils/hashPassword";

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
  const now = new Date();

  const user = await UserModel.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");

  const maxHearts = 5;

  const heartsToRestore = await heart_recoveryModel.findMany({
    where: {
      user_id: id,
      recover_at: { lte: now },
    },
    orderBy: { recover_at: "asc" },
  });

  const spaceLeft = maxHearts - user.hearts;

  if (heartsToRestore.length > 0 && spaceLeft > 0) {
    const toRestore = heartsToRestore.slice(0, spaceLeft);

    await prisma.$transaction([
      UserModel.update({
        where: { id },
        data: {
          hearts: {
            increment: toRestore.length,
          },
        },
      }),
      heart_recoveryModel.deleteMany({
        where: {
          id: {
            in: toRestore.map(h => h.id),
          },
        },
      }),
    ]);
  }

  return await UserModel.findUnique({ where: { id } });
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

  const newHearts = user.hearts - 1;

  // Obtener el último recover_at programado para este usuario
  const lastRecovery = await heart_recoveryModel.findFirst({
    where: { user_id: id },
    orderBy: { recover_at: 'desc' },
  });

  // Si no hay ninguna recuperación pendiente, base = ahora
  const baseTime = lastRecovery ? new Date(lastRecovery.recover_at) : new Date();

  // Nueva recuperación programada exactamente +5 minutos después de la anterior
  // const recover_at = new Date(baseTime.getTime() + 5 * 60 * 1000);
  const recover_at = new Date(baseTime.getTime() + 1 * 60 * 1000); // 1 minuto

  const [updatedUser] = await prisma.$transaction([
    UserModel.update({
      where: { id },
      data: { hearts: newHearts },
    }),
    heart_recoveryModel.create({
      data: {
        user_id: id,
        recover_at,
      },
    }),
  ]);

  return updatedUser;
};


export const getHeartsPendingService = async (userId: number) => {
  const now = new Date();

  const recoveries = await heart_recoveryModel.findMany({
    where: {
      user_id: userId,
      recover_at: { gt: now },
    },
    orderBy: { recover_at: "asc" },
  });

  return {
    heartsPending: recoveries.length,
    recoveries: recoveries.map((r) => r.recover_at),
  };
};
