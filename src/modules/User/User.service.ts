import { UserModel, UserProgressModel } from "../../database/prismaClient";
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
    return await UserModel.findUnique({
        where: { id },
    });
};

// Create a new user
export const createUserService = async (userData: UserType) => {
    // Validate user data using Zod schema
    const validatedUserData = UserSchema.parse(userData);

    // Check if the email is already registered
    const existingUser = await UserModel.findUnique({
        where: { email: validatedUserData.email },
    });

    if (existingUser) {
        throw new Error("Email is already registered");
    }

    // Hash the password before saving
    const hashedPassword = await hashPassword(validatedUserData.password);

    // Create user in the database
    const newUser = await UserModel.create({
        data: {
            ...validatedUserData,
            password: hashedPassword,
        },
    });

    // Add user progress for math and communication courses
    const mathCourseId = 1;
    const communicationCourseId = 2;

    await UserProgressModel.create({
        data: {
            user_id: newUser.id,
            active_course_id: mathCourseId,
        },
    });

    await UserProgressModel.create({
        data: {
            user_id: newUser.id,
            active_course_id: communicationCourseId,
        },
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
