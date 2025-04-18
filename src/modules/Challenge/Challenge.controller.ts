// src/modules/Challenge/Challenge.controller.ts
import { Request, Response } from "express";
import {
  findAllChallenges,
  findChallengeById,
  createNewChallenge,
  deleteChallengeById,
  updateChallengeById,
  findChallengesByLessonId
} from "./challenge.service";
import { handleErrorResponse } from "../../utils/errorHandler";

export const getChallenges = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const challenges = await findAllChallenges(page, limit);
    res.status(200).json(challenges);
    return;
  } catch (error) {
    handleErrorResponse(res, error);
    return;
  }
};

export const getChallengeById = async (req: Request, res:Response) => {
  try {
    const { id } = req.params;
    const challenge = await findChallengeById(Number(id));
    if (!challenge) {
       res.status(404).json({ message: "Challenge not found" });
       return;

    }
     res.status(200).json(challenge);
     return;
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const createChallenge = async (req: Request, res: Response) => {
  try {
    const newChallenge = await createNewChallenge(req.body);
    res.status(201).json(newChallenge);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const deleteChallenge = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteChallengeById(Number(id));
    res.status(200).json({ message: "Challenge deleted successfully" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const updateChallenge = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedChallenge = await updateChallengeById(Number(id), req.body);
    res.status(200).json(updatedChallenge);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

// 2. Nuevo controlador en Challenge.controller.ts
export const getChallengesByLessonId = async (req: Request, res: Response) => {
  try {
    const { lesson_id } = req.params;
    const challenges = await findChallengesByLessonId(Number(lesson_id));

    if (!challenges || challenges.length === 0) {
      res.status(404).json({ message: "No se encontraron desafíos para esta lección." });
      return;
    }

    res.status(200).json(challenges);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
//aca veo si esto funciona o no
// import {uploadImageToCloudinary} from "../../utils/uploadImage"

// export const uploadImage = async (req: Request, res: Response) => {
//   try {
//     const file = req.file; // viene de multer
//     const imageUrl = await uploadImageToCloudinary(file); // tu lógica
//     res.status(200).json({ image_url: imageUrl });
//   } catch (error) {
//     handleErrorResponse(res, error);
//   }
// };