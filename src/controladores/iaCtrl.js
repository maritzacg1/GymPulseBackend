import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY no está configurada.");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const preguntarIA = async (req, res) => {

  try {

    const { pregunta } = req.body;

    if (!pregunta || pregunta.trim() === "") {

      return res.status(400).json({
        message: "Debe enviar una pregunta."
      });

    }

    const prompt = `
Eres GymPulse AI.

Eres un entrenador profesional de gimnasio.

Solo respondes preguntas relacionadas con:

- entrenamiento
- gimnasio
- nutrición
- ejercicios
- dietas
- salud
- acondicionamiento físico

Si el usuario pregunta otra cosa responde exactamente:

"Solo puedo responder preguntas relacionadas con entrenamiento y salud."

Pregunta:

${pregunta}
`;

    console.log("================================");
    console.log("API KEY:", process.env.GEMINI_API_KEY);
    console.log("LONGITUD:", process.env.GEMINI_API_KEY?.length);
    console.log("================================");

    const response = await ai.models.generateContent({

      model: "gemini-2.5-flash",

      contents: prompt

    });

    const texto = response.text || "";

    res.json({

      respuesta: texto

    });

  } catch (error) {

    console.log("================================");
    console.log("ERROR GEMINI");
    console.log(error);

    console.log("STATUS:");
    console.log(error.status);

    console.log("MESSAGE:");
    console.log(error.message);

    console.log("BODY:");
    console.log(error.body);

    console.log("================================");

    res.status(500).json({

      message: "Error IA",

      status: error.status,

      error: error.message

    });

  }

};