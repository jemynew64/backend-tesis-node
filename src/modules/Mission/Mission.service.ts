import { missionEventEmitter } from "./Mission.event"; // 👈 importar de Mission.event

import { MissionModel } from "../../database/prismaClient";
import { MissionType } from "../../schemas";

// Fetch missions
export const fetchMissions = async (page: number, limit: number) => {
    return await MissionModel.findMany({
        take: limit,
        skip: (page - 1) * limit,
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
    try {
        const newMission = await MissionModel.create({
            data: missionData,
        });
        missionEventEmitter.emit('mission.created', newMission); // 👈 emitir evento
        return newMission;
    } catch (error) {
        missionEventEmitter.emit('mission.error', error);
        throw error;
    }
};

// Delete mission
export const deleteMission = async (id: number) => {
    try {
        const deletedMission = await MissionModel.delete({
            where: { id },
        });
        missionEventEmitter.emit('mission.deleted', id); // 👈 emitir evento
        return deletedMission;
    } catch (error) {
        missionEventEmitter.emit('mission.error', error);
        throw error;
    }
};

// Update mission
export const updateMission = async (id: number, missionData: Partial<MissionType>) => {
    try {
        const updatedMission = await MissionModel.update({
            where: { id },
            data: missionData,
        });
        missionEventEmitter.emit('mission.updated', updatedMission); // 👈 emitir evento
        return updatedMission;
    } catch (error) {
        missionEventEmitter.emit('mission.error', error);
        throw error;
    }
};
