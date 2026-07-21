import { GoogleGenAI } from "@google/genai";

export const preguntarIA = async (req, res) => {

  try {

    const apiKey = process.env.GEMINI_API_KEY;

    const ai = new GoogleGenAI({
      apiKey
    });

    const response = await ai.models.generateContent({

      model: "gemini-2.5-flash",

      contents: req.body.pregunta

    });

    res.json({

      respuesta: response.text

    });

  } catch (error) {

    console.log(error);

    res.status(500).json(error);

  }

};