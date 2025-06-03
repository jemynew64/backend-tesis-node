import { Request, Response } from "express";
import { handleErrorResponse } from "../../utils/errorHandler";
import { generateUserReportPDF } from "./pdf.service";

export const getUserReportPDF = async (req: Request, res: Response) => {
  try {
    const userIdFromToken = (req as any).user?.id;
    const { from, to } = req.query;

    if (!from || !to) {
       res.status(400).json({ message: "Missing from/to dates." });
       return;
    }

    const pdfBuffer = await generateUserReportPDF(userIdFromToken, from.toString(), to.toString());

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=reporte_usuario.pdf");
    // res.send(pdfBuffer);
    res.end(pdfBuffer);
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
