import { Request, Response } from "express";
import { getUserMissionService, createUserMissionService, getUserMissionByIdService, updateUserMissionService, deleteUserMissionService } from "./UserMission.service";
import { handleErrorResponse } from "../../utils/errorhandler";

// Get user missions with pagination
export const getUserMissionHandler = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        
        const missions = await getUserMissionService(page, limit);
        res.status(200).json(missions);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Get user mission by ID
export const getUserMissionByIdHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const mission = await getUserMissionByIdService(Number(id));
        
        if (!mission) {
            res.status(404).json({ message: "User mission not found" });
            return;
        }

        res.status(200).json(mission);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Create a new user mission
export const createUserMissionHandler = async (req: Request, res: Response) => {
    try {
        const userMissionData = req.body;
        const newUserMission = await createUserMissionService(userMissionData);
        
        res.status(201).json(newUserMission);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Update user mission
export const updateUserMissionHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userMissionData = req.body;
        
        const updatedUserMission = await updateUserMissionService(Number(id), userMissionData);
        res.status(200).json(updatedUserMission);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Delete user mission
export const deleteUserMissionHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await deleteUserMissionService(Number(id));

        res.status(200).json({ message: "User mission deleted successfully" });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};
