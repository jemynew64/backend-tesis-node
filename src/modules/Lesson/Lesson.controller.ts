import { Request, Response } from "express";
import {
  fetchLessons,
  fetchLessonById,
  createNewLesson,
  removeLessonById,
  modifyLessonById,
  completarProgresoLeccion,
  iniciarProgresoLeccion
} from "./Lesson.service";
import { handleErrorResponse } from "../../utils/errorHandler";

// Get all lessons
export const getLessons = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 1000;

    const lessons = await fetchLessons(page, limit);
    res.status(200).json(lessons);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

// Get a lesson by ID
export const getLessonById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lesson = await fetchLessonById(Number(id));
    if (!lesson) {
      res.status(404).json({ message: "Lesson not found" });
      return;
    }
    res.status(200).json(lesson);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

// Create a new lesson
export const createLesson = async (req: Request, res: Response) => {
  try {
    const newLesson = await createNewLesson(req.body);
    res.status(201).json(newLesson);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

// Update a lesson by ID
export const updateLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedLesson = await modifyLessonById(Number(id), req.body);
    res.status(200).json(updatedLesson);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

// Delete a lesson by ID
export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await removeLessonById(Number(id));
    res.status(200).json({ message: "Leccion eleminada satisfactoriamente" });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

// POST /iniciar/:lessonId/:userId
export const iniciarLeccion = async (req: Request, res: Response) => {
  try {
    const lessonId = Number(req.params.lessonId);
    const userId = Number(req.params.userId);
    await iniciarProgresoLeccion(lessonId, userId);
    res.status(200).json({ message: "Progreso inicializado correctamente." });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};

// POST /completar/:lessonId/:userId
export const completarLeccion = async (req: Request, res: Response) => {
  try {
    const lessonId = Number(req.params.lessonId);
    const userId = Number(req.params.userId);
    await completarProgresoLeccion(lessonId, userId);
    res.status(200).json({ message: "Lección completada correctamente." });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};