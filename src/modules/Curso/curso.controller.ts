// curso.controller.ts
import { Request, Response } from "express";
import {
    getAllCursos,
    getCursoByIdService,
    createCursoService,
    deleteCursoService,
    updateCursoService
} from "./curso.service";
import { handleErrorResponse } from "../../utils/errorhandler";

export const getCurso = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const cursos = await getAllCursos(page, limit);
        res.status(200).json(cursos);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const getCursoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const curso = await getCursoByIdService(Number(id));
        if (!curso) {
            res.status(404).json({ message: "Curso no encontrado" });
        }
        res.status(200).json(curso);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const createCurso = async (req: Request, res: Response) => {
    try {
        const nuevoCurso = await createCursoService(req.body);
        res.status(201).json(nuevoCurso);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const deleteCurso = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await deleteCursoService(Number(id));
        res.status(200).json({ message: "Curso eliminado correctamente" });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

export const updateCurso = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const cursoActualizado = await updateCursoService(Number(id), req.body);
        res.status(200).json(cursoActualizado);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};
