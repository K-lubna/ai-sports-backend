import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = "AIzaSyAGuxn9uJJQsZGA0qm61hW4ncrJoEgTbfA";

app.get("/", (req, res) => {
  res.send("Gemini AI backend running 🚀");
});

app.post("/ask", async (req, res) => {

  try {

    const message = req.body.message;

    if (!message) {
      return res.status(400).json({
        error: "Message required"
      });
    }

    if (!API_KEY) {
      return res.status(500).json({
        error: "Gemini API key missing"
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: message }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Gemini API error"
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text
      || "No AI response";

    res.json({ reply });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
