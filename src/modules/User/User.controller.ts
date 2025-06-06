import { Request, Response } from "express";
import { createUserService, getUsersService, getUserByIdService, deleteUserService, updateUserService,ReducerliveService,getHeartsPendingService ,updateProfileImageService } from "./User.service";
import { handleErrorResponse } from "../../utils/errorHandler";

// Get all users with pagination
export const getUsersHandler = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 1000;

        const users = await getUsersService(page, limit);
        res.status(200).json(users);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Get user by ID
export const getUserByIdHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log("ID: mandado por aca ", id);
        const user = await getUserByIdService(Number(id));
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Create a new user
export const createUserHandler = async (req: Request, res: Response) => {
    try {
        const userData = req.body;
        const newUser = await createUserService(userData);
        res.status(201).json(newUser);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Delete a user
export const deleteUserHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await deleteUserService(Number(id));
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Update user details
export const updateUserHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userData = req.body;
        const updatedUser = await updateUserService(Number(id), userData);
        res.status(200).json(updatedUser);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const ReducerliveController = async (req: Request, res: Response) => {
    try {
        const userIdFromToken = (req as any).user?.id;
        const newUser = await ReducerliveService(userIdFromToken);
        res.status(201).json(newUser);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const getHeartsPendingHandler = async (req: Request, res: Response) => {
  try {
    const userIdFromToken = (req as any).user?.id;
    const data = await getHeartsPendingService(userIdFromToken);
    res.status(200).json(data);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

// Actualizar solo la imagen de perfil
export const updateProfileImageHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { profile_image } = req.body;

    if (!profile_image) {
       res.status(400).json({ message: "Profile image URL is required." });
       return;
    }

    const updatedUser = await updateProfileImageService(Number(userId), profile_image);
    res.status(200).json(updatedUser);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
