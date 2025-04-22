import { Request, Response } from "express";
import * as XLSX from "xlsx";
import {
  UnitModel,
  LessonModel,
  ChallengeModel,
  ChallengeOptionModel,
} from "../../database/prismaClient";

interface ExcelRow {
  unit_title: string;
  unit_description: string;
  unit_order_num: number;

  lesson_title: string;
  lesson_order_num: number;

  challenge_type: string;
  challenge_question: string;
  challenge_image_src: string;
  challenge_order_num: number;

  opt1_text: string;
  opt1_correct: boolean;
  opt1_img: string;
  opt1_audio: string;

  opt2_text: string;
  opt2_correct: boolean;
  opt2_img: string;
  opt2_audio: string;

  opt3_text: string;
  opt3_correct: boolean;
  opt3_img: string;
  opt3_audio: string;
}

export const handleExcelUpload = async (req: Request, res: Response) => {
  try {
    const fileBuffer = req.file?.buffer;
    const { course_id } = req.body;
    if (!fileBuffer || !course_id) {
       res.status(400).json({ message: "Faltan archivo o course_id" });
       return;
    }

    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const data = XLSX.utils.sheet_to_json<ExcelRow>(workbook.Sheets[workbook.SheetNames[0]]);

    const clean = (v: any) => (v === null || v === undefined ? "" : v);

    // 🧠 Cache para evitar duplicados
    const unidadesCache = new Map<string, number>();
    const leccionesCache = new Map<string, number>();

    for (const row of data) {
      const unidadKey = clean(row.unit_title);
      let unidadId: number;

      // ✅ Crear o reutilizar unidad
      if (unidadesCache.has(unidadKey)) {
        unidadId = unidadesCache.get(unidadKey)!;
      } else {
        const unidad = await UnitModel.create({
          data: {
            title: unidadKey,
            description: clean(row.unit_description),
            order_num: Number(row.unit_order_num),
            course_id: Number(course_id),
          },
        });
        unidadId = unidad.id;
        unidadesCache.set(unidadKey, unidadId);
      }

      const leccionKey = `${unidadKey}/${clean(row.lesson_title)}`;
      let leccionId: number;

      // ✅ Crear o reutilizar lección
      if (leccionesCache.has(leccionKey)) {
        leccionId = leccionesCache.get(leccionKey)!;
      } else {
        const leccion = await LessonModel.create({
          data: {
            title: clean(row.lesson_title),
            order_num: Number(row.lesson_order_num),
            unit_id: unidadId,
          },
        });
        leccionId = leccion.id;
        leccionesCache.set(leccionKey, leccionId);
      }

      // 🧩 Crear challenge
      const reto = await ChallengeModel.create({
        data: {
          type: clean(row.challenge_type),
          question: clean(row.challenge_question),
          image_src: clean(row.challenge_image_src),
          order_num: Number(row.challenge_order_num),
          lesson_id: leccionId,
        },
      });

      // 🔁 Crear opciones del reto
      const options = [
        {
          text: row.opt1_text,
          is_correct: Boolean(row.opt1_correct),
          image_src: row.opt1_img,
          audio_src: row.opt1_audio,
        },
        {
          text: row.opt2_text,
          is_correct: Boolean(row.opt2_correct),
          image_src: row.opt2_img,
          audio_src: row.opt2_audio,
        },
        {
          text: row.opt3_text,
          is_correct: Boolean(row.opt3_correct),
          image_src: row.opt3_img,
          audio_src: row.opt3_audio,
        },
      ];

      for (const option of options) {
        await ChallengeOptionModel.create({
          data: {
            text: clean(option.text),
            is_correct: option.is_correct,
            image_src: clean(option.image_src),
            audio_src: clean(option.audio_src),
            challenge_id: reto.id,
          },
        });
      }
    }

    res.status(200).json({ message: "Datos importados correctamente desde memoria" });
  } catch (error) {
    console.error("Error al procesar Excel:", error);
    res.status(500).json({ message: "Error al procesar el archivo Excel" });
  }
};
