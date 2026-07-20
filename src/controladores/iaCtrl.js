import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const preguntarIA = async (req, res) => {

  try {

    const { pregunta } = req.body;

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

Si el usuario pregunta otra cosa responde:

"Solo puedo responder preguntas relacionadas con entrenamiento y salud."

Pregunta:

${pregunta}
`;

    const response = await ai.models.generateContent({
  model: "models/gemini-flash-latest",
  contents: prompt
    });

    res.json({
      respuesta: response.text
    });

 } catch (error) {

  console.log("================================");
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
    error: error.message,
    body: error.body
  });

}

};