import { Request, Response } from "express";

import { ShopLivesService } from "./Shop.service"


//aumentar puntos en el usuario
export const ShopLivesController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const result = await ShopLivesService(userId);

    res.status(200).json({
      message: "❤️ Vida comprada exitosamente",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "No se pudo procesar la compra",
      error: error.message,
    });
  }
};
