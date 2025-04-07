import { MissionModel } from "../../database/prismaClient";
import { MissionType } from "../../schemas";

// Fetch missions
export const fetchMissions = async (page: number, limit: number) => {
    return await MissionModel.findMany({
        take: limit,  // Number of missions per page
        skip: (page - 1) * limit, // How many to skip before starting
    });
};

// Fetch mission by ID
export const fetchMissionById = async (id: number) => {
    return await MissionModel.findUnique({
        where: { id },
    });
};

// Create mission
export const createMission = async (missionData: MissionType) => {
    return await MissionModel.create({
        data: missionData,
    });
};

// Delete mission
export const deleteMission = async (id: number) => {
    return await MissionModel.delete({
        where: { id },
    });
};

// Update mission
export const updateMission = async (id: number, missionData: Partial<MissionType>) => {
    return await MissionModel.update({
        where: { id },
        data: missionData,
    });
};
