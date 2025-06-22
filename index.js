const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Servidor activo y funcionando");
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  const prompt = `
Eres un experto de ZoomBikes. Recomienda una bicicleta de 18 o 20 pulgadas para niños, en base a su edad, peso y altura.
Solo responde con una frase clara como: "Según sus medidas, te recomiendo la talla 20 pulgadas."
Datos del usuario: ${message}
`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
    });

    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error al generar respuesta:", error.message);
    res.status(500).json({ error: "Error al generar respuesta" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
