import { Request, Response } from "express";
import { UnitSchema, UnitType } from "./UnitSchema";
import * as UnitService from "./Unit.service";
import { handleErrorResponse } from "../../utils/errorHandler";

// Get units
export const getUnit = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page) || 1;  // Current page (default 1)
        const limit = Number(req.query.limit) || 10; // Units per page (default 10)

        const units = await UnitService.fetchUnits(page, limit);

        res.status(200).json(units);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Get unit by ID
export const getUnitById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const unit = await UnitService.fetchUnitById(Number(id));

        if (!unit) {
            res.status(404).json({ message: "Unit not found" });
            return;
        }

        res.status(200).json(unit);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Create unit
export const createUnit = async (req: Request, res: Response) => {
    try {
        const unitData: UnitType = UnitSchema.parse(req.body);

        const newUnit = await UnitService.createUnit(unitData);

        res.status(201).json(newUnit);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Delete unit
export const deleteUnit = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await UnitService.deleteUnit(Number(id));

        res.status(200).json({ message: "Unit elimnada correctamente" });
    } catch (error) {
        handleErrorResponse(res, error);
    }
};

// Update unit
export const updateUnit = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const unitData: Partial<UnitType> = UnitSchema.partial().parse(req.body);

        const updatedUnit = await UnitService.updateUnit(Number(id), unitData);

        res.status(200).json(updatedUnit);
    } catch (error) {
        handleErrorResponse(res, error);
    }
};
