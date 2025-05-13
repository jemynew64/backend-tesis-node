// 📁 src/modules/EarnedAchievement/EarnedAchievement.controller.ts

import { Request, Response } from "express";
import {
  fetchEarnedAchievements,
  fetchEarnedAchievementById,
  createNewEarnedAchievement,
  removeEarnedAchievementById,
  modifyEarnedAchievementById,
  autoAssignAchievements,
} from "./EarnedAchievement.service";
import { handleErrorResponse } from "../../utils/errorHandler";

export const getEarnedAchievements = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 1000;

    const earnedAchievements = await fetchEarnedAchievements(page, limit);
    res.status(200).json(earnedAchievements);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const getEarnedAchievementById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const earnedAchievement = await fetchEarnedAchievementById(Number(id));
    if (!earnedAchievement) {
      res.status(404).json({ message: "Earned Achievement not found" });
      return;
    }
    res.status(200).json(earnedAchievement);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const createEarnedAchievement = async (req: Request, res: Response) => {
  try {
    const newEarnedAchievement = await createNewEarnedAchievement(req.body);
    res.status(201).json(newEarnedAchievement);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const deleteEarnedAchievement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await removeEarnedAchievementById(Number(id));
    res.status(200).json({ message: "Earned Achievement successfully deleted" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const updateEarnedAchievement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedEarnedAchievement = await modifyEarnedAchievementById(Number(id), req.body);
    res.status(200).json(updatedEarnedAchievement);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const autoCheckAchievements = async (req: Request, res: Response) => {
  try {
  const userId = (req as any).user?.id;
    if (!userId) {
     res.status(401).json({ message: "Unauthorized" });
     return;
    }  

    const result = await autoAssignAchievements(userId);
    res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};