import express from "express";
import axios from "axios";
import { data } from "./data.js"; 

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/random-meme", (req, res) => {
    const memes = data.data.memes;

    if (!memes || memes.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No memes available."
        });
    }

    const randomMeme = memes[Math.floor(Math.random() * memes.length)];

    res.json({
        success: true,
        meme: randomMeme
    });
});

app.post("/create-meme", async (req, res) => {
    const { template_id, text, bool } = req.body;

    if (!template_id || text === undefined || bool === undefined) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields: template_id, text, or bool."
        });
    }

    try {
        const params = bool
            ? {
                  template_id,
                  username: "opbot-xd",
                  password: "iop123iop123",
                  text1: text,
              }
            : {
                  template_id,
                  username: "opbot-xd",
                  password: "iop123iop123",
                  text0: text,
              };

        const response = await axios.post("https://api.imgflip.com/caption_image", null, {
            params,
        });

        if (response.data.success) {
            res.json({
                success: true,
                meme: response.data.data
            });
        } else {
            res.status(500).json({
                success: false,
                message: "nahi hoga",
                error: response.data.error_message
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server fata...",
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
