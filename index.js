require('dotenv').config();

const express = require('express');
const exphbs = require("express-handlebars");
const path = require("path");
const upload = require("./io/multer");
const fs = require("fs");
const { Client } = require('discord.js-selfbot-v13');

const port = 3000;
const app = express();

const client = new Client();

client.on('ready', async () => {
    console.log(`${client.user.username} is now running!`);
});

client.login(process.env.TOKEN);

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});

app.get("/", (req, res) => {
    res.render("home");
});

app.post('/upload', upload.single('video_file'), async (req, res) => {
    const { code, description } = req.body;

    if (!code) return res.status(422).send("❌ Código de usuário ausente");
    if (!req.file) return res.status(400).send('Nenhum vídeo enviado.');

    try {
        const videoPath = path.join(__dirname, 'uploads/video.mp4');
        const channel = await client.channels.fetch(process.env.CHANNEL_ID);

        await channel.send({
            content: description || '\n',
            files: [{ attachment: videoPath, name: 'video.mp4' }]
        });

        await fs.promises.unlink(videoPath);

        return res.status(200).send({ message: "✅ Vídeo enviado para o Discord!" });
    } catch (err) {
        console.error(err);
        return res.status(500).send('❌ Erro ao enviar vídeo pro Discord.');
    }
});

app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});
