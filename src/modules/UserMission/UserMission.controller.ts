import { Request, Response } from "express";
import { getUserMissionService, createUserMissionService, getUserMissionByIdService, updateUserMissionService, deleteUserMissionService,getUserMissionsTodayService,checkAndMarkUserMissionsService } from "./UserMission.service";
import { handleErrorResponse } from "../../utils/errorHandler";

// Get user missions with pagination
export const getUserMissionHandler = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 1000;
        
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

// Misiones del día para un usuario
export const getUserMissionsTodayHandler = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
         res.status(401).json({ message: "No autorizado" });
         return;
      }
  
      const missions = await getUserMissionsTodayService(userId);
  
      res.status(200).json(
      missions.map((m: { id: number; completed: boolean; daily_mission: { mission: any } }) => ({
          id: m.id,
          completed: m.completed,
          mission: m.daily_mission.mission,
        }))
      );
    } catch (error) {
      handleErrorResponse(res, error);
    }
  };
  
//controlador para verificar si se han echo o no las misiones 
  export const checkAndMarkUserMissionsHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
       res.status(401).json({ message: "No autorizado" });
       return;
    }

    const result = await checkAndMarkUserMissionsService(userId);
    res.status(200).json({
      message: `${result.completed} misiones completadas`,
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};