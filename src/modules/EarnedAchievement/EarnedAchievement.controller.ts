import { Request, Response } from "express";
import {
  fetchEarnedAchievements,
  fetchEarnedAchievementById,
  createNewEarnedAchievement,
  removeEarnedAchievementById,
  modifyEarnedAchievementById,
} from "./EarnedAchievement.service";
import { handleErrorResponse } from "../../utils/errorhandler";

// Obtener todos los logros ganados
export const getEarnedAchievements = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const earnedAchievements = await fetchEarnedAchievements(page, limit);
    res.status(200).json(earnedAchievements);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

// Obtener un logro ganado por ID
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

// Crear un nuevo logro ganado
export const createEarnedAchievement = async (req: Request, res: Response) => {
  try {
    const newEarnedAchievement = await createNewEarnedAchievement(req.body);
    res.status(201).json(newEarnedAchievement);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

// Eliminar un logro ganado por ID
export const deleteEarnedAchievement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await removeEarnedAchievementById(Number(id));
    res.status(200).json({ message: "Earned Achievement successfully deleted" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

// Actualizar un logro ganado por ID
export const updateEarnedAchievement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedEarnedAchievement = await modifyEarnedAchievementById(
      Number(id),
      req.body
    );
    res.status(200).json(updatedEarnedAchievement);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
