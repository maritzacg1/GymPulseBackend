import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function listar() {

  try {

    const modelos = await ai.models.list();

    for await (const modelo of modelos) {

      console.log(modelo.name);

    }

  } catch (error) {

    console.log(error);

  }

}

listar();