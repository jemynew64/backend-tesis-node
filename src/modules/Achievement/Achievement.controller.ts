// src/controllers/achievement.controller.ts
import { Request, Response } from "express";
import {
  findAllAchievements,
  findAchievementById,
  createNewAchievement,
  deleteAchievementById,
  updateAchievementById,
} from "./achievement.service";
import { handleErrorResponse } from "../../utils/errorhandler";

// Obtener todos los logros
export const getAchievement = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const achievements = await findAllAchievements(page, limit);
    res.status(200).json(achievements);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

// Buscar logro por ID
export const getAchievementById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const achievement = await findAchievementById(Number(id));
    if (!achievement) {
       res.status(404).json({ message: "Achievement no encontrada" });
    }
    res.status(200).json(achievement);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

// Crear logro
export const createAchievement = async (req: Request, res: Response) => {
  try {
    const nuevoAchievement = await createNewAchievement(req.body);
    res.status(201).json(nuevoAchievement);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

// Eliminar logro
export const deleteAchievement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteAchievementById(Number(id));
    res.status(200).json({ message: "Achievement eliminado correctamente" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

// Actualizar logro
export const updateAchievement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const achievementActualizado = await updateAchievementById(
      Number(id),
      req.body
    );
    res.status(200).json(achievementActualizado);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
