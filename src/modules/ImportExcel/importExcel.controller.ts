import { Request, Response } from "express";
import * as XLSX from "xlsx";
import {
  UnitModel,
  LessonModel,
  ChallengeModel,
  ChallengeOptionModel,
} from "../../database/prismaClient";
import { ZodError } from "zod";

import { createUserService } from "../User/User.service";

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
  opt1_correct: string;
  opt1_img: string;
  opt1_audio: string;

  opt2_text: string;
  opt2_correct: string;
  opt2_img: string;
  opt2_audio: string;

  opt3_text: string;
  opt3_correct: string;
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
    const data = XLSX.utils.sheet_to_json<ExcelRow>(
      workbook.Sheets[workbook.SheetNames[0]]
    );

    const clean = (v: any) => (v === null || v === undefined ? "" : v);
    const isCorrect = (v: any) =>
      clean(v).toString().trim().toUpperCase() === "VERDADERO";

    const unidadesCache = new Map<string, number>();
    const leccionesCache = new Map<string, number>();

    for (const row of data) {
      const unidadKey = clean(row.unit_title);
      let unidadId: number;

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

      const reto = await ChallengeModel.create({
        data: {
          type: clean(row.challenge_type),
          question: clean(row.challenge_question),
          image_src: clean(row.challenge_image_src),
          order_num: Number(row.challenge_order_num),
          lesson_id: leccionId,
        },
      });

      const options = [
        {
          text: clean(row.opt1_text),
          is_correct: isCorrect(row.opt1_correct),
          image_src: clean(row.opt1_img),
          audio_src: clean(row.opt1_audio),
        },
        {
          text: clean(row.opt2_text),
          is_correct: isCorrect(row.opt2_correct),
          image_src: clean(row.opt2_img),
          audio_src: clean(row.opt2_audio),
        },
        {
          text: clean(row.opt3_text),
          is_correct: isCorrect(row.opt3_correct),
          image_src: clean(row.opt3_img),
          audio_src: clean(row.opt3_audio),
        },
      ];

      for (const option of options) {
        await ChallengeOptionModel.create({
          data: {
            text: option.text,
            is_correct: option.is_correct,
            image_src: option.image_src,
            audio_src: option.audio_src,
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



interface UserExcelRow {
  name: string;
  email: string;
  password: string;
}

export const handleUserExcelUpload = async (req: Request, res: Response) => {
  try {
    const fileBuffer = req.file?.buffer;
    if (!fileBuffer) {
      console.warn("⚠️ No se encontró el archivo en la solicitud.");
      res.status(400).json({ message: "Archivo no encontrado." });
      return;
    }

    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(
      workbook.Sheets[workbook.SheetNames[0]]
    );

    // 🧪 LOG 1: Mostrar contenido bruto del Excel
    console.log("📊 Contenido del Excel leído:", rawData);

    // 🧪 LOG 2: Verificar encabezados detectados
    const headers = Object.keys(rawData[0] || {});
    console.log("🧪 Encabezados detectados:", headers);

    const requiredHeaders = ["Nombre", "Correo electronico", "Contraseña"];
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));

    if (missingHeaders.length > 0) {
      console.error(`❌ Faltan encabezados requeridos en el Excel: ${missingHeaders.join(", ")}`);
       res.status(400).json({
        message: `Encabezados inválidos. Asegúrate de incluir: ${requiredHeaders.join(", ")}`,
        encontrados: headers,
      });
      return;
    }

    const clean = (v: unknown): string => {
      if (typeof v === "string") return v.trim();
      if (typeof v === "number") return v.toString();
      return "";
    };

    const data: UserExcelRow[] = rawData.map((row) => ({
      name: clean(row["Nombre"]),
      email: clean(row["Correo electronico"]),
      password: clean(row["Contraseña"]),
    }));

    // 🧪 LOG 3: Ver datos procesados para crear usuarios
    console.log("✅ Datos mapeados a UserExcelRow:", data);

    const errores: { email: string; error: string }[] = [];
    let successCount = 0;

    for (const row of data) {
      const { name, email, password } = row;

      if (!name || !email || !password) {
        errores.push({ email, error: "Faltan campos obligatorios" });
        continue;
      }

      try {
        await createUserService({
          name,
          email,
          password,
          profile_image: "/images/iconomorado.jpg",
          hearts: 5,
          points: 0,
          experience: 0,
          level: 1,
          user_type: "student",
        });
        successCount++;
      } catch (error) {
        let msg = "Error desconocido";

        if (error instanceof ZodError) {
          msg = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(" | ");
        } else if (error instanceof Error) {
          msg = error.message;
        } else {
          msg = JSON.stringify(error);
        }

        console.error(`❌ Error al crear usuario ${email}: ${msg}`);
        errores.push({ email, error: msg });
      }
    }

    res.status(200).json({
      message: "Importación finalizada.",
      exitosos: successCount,
      errores,
    });

    if (errores.length === 0) {
      console.log(`✅ Todos los usuarios (${successCount}) se importaron correctamente.`);
    } else {
      console.warn(
        `⚠️ Importación parcial: ${successCount} exitosos, ${errores.length} con error.`
      );
    }
  } catch (error) {
    console.error("❌ Error al procesar el archivo Excel:", error);
    res.status(500).json({ message: "Error al procesar el archivo Excel." });
  }
};
