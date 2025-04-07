import { Request, Response } from "express";
import {
  findAllOptions,
  findOptionById,
  createNewOption,
  deleteOptionById,
  updateOptionById,
} from "./ChallengeOption.service";
import { handleErrorResponse } from "../../utils/errorhandler";

export const getOptions = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const options = await findAllOptions(page, limit);
    res.status(200).json(options);
    return;
  } catch (error) {
    handleErrorResponse(res, error);
    return;
  }
};

export const getOptionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const option = await findOptionById(Number(id));
    if (!option) {
      res.status(404).json({ message: "Opción no encontrada" });
      return;
    }
    res.status(200).json(option);
    return;
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const createOption = async (req: Request, res: Response) => {
  try {
    const newOption = await createNewOption(req.body);
    res.status(201).json(newOption);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const deleteOption = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteOptionById(Number(id));
    res.status(200).json({ message: "Opción eliminada correctamente" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const updateOption = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedOption = await updateOptionById(Number(id), req.body);
    res.status(200).json(updatedOption);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
