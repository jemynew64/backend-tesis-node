import { Request, Response } from "express";
import {
  findAllCourses,
  findCourseById,
  createNewCourse,
  deleteCourseById,
  updateCourseById,
} from "./Course.service";
import { handleErrorResponse } from "../../utils/errorhandler";

export const getCourses = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const courses = await findAllCourses(page, limit);
    res.status(200).json(courses);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const course = await findCourseById(Number(id));
    if (!course) {
      res.status(404).json({ message: "Curso no encontrado" });
      return;
    }
    res.status(200).json(course);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const newCourse = await createNewCourse(req.body);
    res.status(201).json(newCourse);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteCourseById(Number(id));
    res.status(200).json({ message: "Curso eliminado correctamente" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedCourse = await updateCourseById(Number(id), req.body);
    res.status(200).json(updatedCourse);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
