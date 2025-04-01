import { Response } from "express";

export const handleErrorResponse = (res: Response, error: unknown): Response => {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    return res.status(500).json({ error: errorMessage }); // ✅ Agregado return
};
