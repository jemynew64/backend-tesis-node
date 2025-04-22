import { Request, Response } from "express";
import { MissionSchema, MissionType } from "../../schemas/index";
import * as MissionService from "./Mission.service";
import { handleErrorResponse } from "../../utils/errorHandler";

// Get missions
export const getMission = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;  // Current page (default 1)
        const limit = Number(req.query.limit) || 1000; // Missions per page (default 10)

        const missions = await MissionService.fetchMissions(page, limit);

        res.status(200).json(missions);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Get mission by ID
export const getMissionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const mission = await MissionService.fetchMissionById(Number(id));

        if (!mission) {
            res.status(404).json({ message: "Mission not found" });
            return;
        }

        res.status(200).json(mission);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Create mission
export const createMission = async (req: Request, res: Response) => {
    try {
        const missionData: MissionType = MissionSchema.parse(req.body);

        const newMission = await MissionService.createMission(missionData);

        res.status(201).json(newMission);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Delete mission
export const deleteMission = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await MissionService.deleteMission(Number(id));

        res.status(200).json({ message: "Mission deleted successfully" });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Update mission
export const updateMission = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const missionData: Partial<MissionType> = MissionSchema.partial().parse(req.body);

        const updatedMission = await MissionService.updateMission(Number(id), missionData);

        res.status(200).json(updatedMission);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};
