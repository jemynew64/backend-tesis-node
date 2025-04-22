import { UnitModel } from "../../database/prismaClient";
import { UnitType } from "../../schemas";

// Fetch units with pagination
export const fetchUnits = async (page: number, limit: number) => {
    return await UnitModel.findMany({
      take: limit,                          // Number of units per page
      skip: (page - 1) * limit,             // Skip for pagination
      include: {
        course: {
          select: {
            title: true                     // Solo queremos el título del curso
          }
        }
      }
    });
  };
// Fetch unit by ID
export const fetchUnitById = async (id: number) => {
    return await UnitModel.findUnique({
        where: { id },
    });
};

// Create unit
export const createUnit = async (unitData: UnitType) => {
    return await UnitModel.create({
        data: unitData,
    });
};

// Delete unit
export const deleteUnit = async (id: number) => {
    return await UnitModel.delete({
        where: { id },
    });
};

// Update unit
export const updateUnit = async (id: number, unitData: Partial<UnitType>) => {
    return await UnitModel.update({
        where: { id },
        data: unitData,
    });
};
