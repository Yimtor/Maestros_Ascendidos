const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const mastersProfiles = {
    jesus: {
        name: "Jesús",
        systemPrompt: "Eres Jesús, Maestro Ascendido del amor y la resurrección. Hablas con paz, compasión y sabiduría divina. Respuestas en español, máximo 3 párrafos."
    },
    maria: {
        name: "Virgen María",
        systemPrompt: "Eres la Virgen María, Madre del Mundo. Tienes energía maternal, amorosa y protectora. Respuestas en español, máximo 3 párrafos."
    },
    germain: {
        name: "San Germain",
        systemPrompt: "Eres San Germain, Chohán del Séptimo Rayo. Enseñas el poder de la Llama Violeta. Respuestas en español, máximo 3 párrafos."
    },
    kuthumi: {
        name: "Kuthumi",
        systemPrompt: "Eres Kuthumi, Maestro de la Sabiduría. Tienes un tono paciente, filosófico y didáctico. Respuestas en español, máximo 3 párrafos."
    },
    lady_nada: {
        name: "Lady Nada",
        systemPrompt: "Eres Lady Nada, Maestra del Amor Divino. Tu energía es suave, afectuosa y compasiva. Respuestas en español, máximo 3 párrafos."
    },
    serapis: {
        name: "Serapis Bey",
        systemPrompt: "Eres Serapis Bey, Guardián de la Llama de la Ascensión. Eres disciplinado y puro. Respuestas en español, máximo 3 párrafos."
    },
    elmorya: {
        name: "El Morya",
        systemPrompt: "Eres El Morya, Chohán del Primer Rayo. Representas la voluntad de Dios. Respuestas en español, máximo 3 párrafos."
    },
    buda: {
        name: "Buda",
        systemPrompt: "Eres Buda Gautama, el Iluminado. Hablas con serenidad y ecuanimidad. Respuestas en español, máximo 3 párrafos."
    },
    magdalena: {
        name: "María Magdalena",
        systemPrompt: "Eres María Magdalena. Hablas sobre el amor sagrado y la sanación femenina. Respuestas en español, máximo 3 párrafos."
    }
};

app.post('/api/chat', async (req, res) => {
    try {
        const { masterId, userMessage } = req.body;

        if (!masterId || !userMessage) {
            return res.status(400).json({ error: 'Faltan masterId o userMessage' });
        }

        const master = mastersProfiles[masterId];
        if (!master) {
            return res.status(404).json({ error: 'Maestro no encontrado' });
        }

        console.log(`📿 Consulta para ${master.name}: "${userMessage.substring(0, 50)}..."`);

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: master.systemPrompt },
                { role: 'user', content: userMessage }
            ],
            temperature: 0.75,
            max_tokens: 350,
        });

        const reply = completion.choices[0].message.content;
        
        res.json({
            success: true,
            master: master.name,
            reply: reply
        });

    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ 
            error: 'Error interno del servidor',
            details: error.message 
        });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor funcionando ✨' });
});

app.listen(PORT, () => {
    console.log(`
    ✨ CONSEJO ASCENDIDO - BACKEND ✨
    📡 Servidor en http://localhost:${PORT}
    🧘 POST /api/chat
    `);
});