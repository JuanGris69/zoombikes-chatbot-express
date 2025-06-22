// index.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const { message } = req.body;

  const prompt = `
Eres un experto de ZoomBikes. Recomienda una bicicleta de 18 o 20 pulgadas para niños, en base a su edad, peso y altura. 
Solo responde con una frase clara como: "Según sus medidas, te recomiendo la talla 20 pulgadas."
Datos del usuario: ${message}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al contactar con OpenAI', detalle: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
