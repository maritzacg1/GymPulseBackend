import axios from 'axios';
import { guardarHistorial } from './historialCtrl.js';
export const preguntarIA = async (req, res) => {

  try {

    const { pregunta } = req.body;

    const response = await axios.post(

      'https://openrouter.ai/api/v1/chat/completions',

      {
        model: "openrouter/free",

        messages: [
          {
            role: 'system',
            content: `
Eres GymPulse AI.

Solo respondes preguntas sobre:

- gimnasio
- ejercicios
- entrenamiento
- nutrición
- salud
- acondicionamiento físico

Si preguntan otra cosa responde:

"Solo puedo responder preguntas relacionadas con entrenamiento y salud."
`
          },
          {
            role: 'user',
            content: pregunta
          }
        ]
      },

      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }

    );
await guardarHistorial(

  req.usuario.id_usuario,

  'IA',

  'Consulta',

  'Realizó una consulta a GymPulse AI'

);
    res.json({
      respuesta:
        response.data.choices[0].message.content
    });

  } catch (error) {

    console.log('ERROR OPENROUTER');
    console.log("OPENROUTER KEY:", process.env.OPENROUTER_API_KEY?.substring(0,15));
console.log("MODELO:", "openrouter/free");

    console.log(
      error.response?.data || error.message
    );

    res.status(500).json({
      message: 'Error IA',
      error:
        error.response?.data || error.message
    });

  }

};