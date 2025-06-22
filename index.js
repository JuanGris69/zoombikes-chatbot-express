const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Ruta de prueba para confirmar que el servidor está activo
app.get("/", (req, res) => {
  res.send("Servidor activo y funcionando");
});

// Ruta principal del chatbot
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "El mensaje es obligatorio" });
    }

    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "gpt-3.5-turbo",
    });

    const response = chatCompletion.choices[0].message.content;
    res.json({ response });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error.message);
    res.status(500).json({ error: "Hubo un error en el servidor" });
  }
});

// Puerto dinámico para Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
