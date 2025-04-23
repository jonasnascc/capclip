require('dotenv').config();

const {loadUsersCodes} = require("./helpers/loadUsersCodes")

const express = require('express');
const exphbs = require("express-handlebars");
const path = require("path");
const upload = require("./io/multer");
const fs = require("fs");

const { Client } = require('discord.js-selfbot-v13');

const port = 3000;
const app = express();

const client = new Client();

let usersCodes = [];

client.on('ready', async () => {
    console.log(`${client.user.username} is now running!`);
    usersCodes = await loadUsersCodes(client)
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

    if (!code) return res.status(422).send({message: "Código de usuário ausente"});
    if (!req.file) return res.status(400).send({message: 'Nenhum vídeo enviado.'});

    for(let i=1; i<=2; i++){
        const usersFilter = usersCodes.filter(uc => uc.userCode === code);
        if(usersFilter.length === 0) {
            if(i==1) usersCodes = await loadUsersCodes(client)
            if(i==2) return res.status(401).send({message: "Usuário não autorizado"})
        }
        else userId = usersFilter[0].userId
    }

    try {
        const videoPath = path.join(__dirname, 'uploads/video.mp4');
        const channel = await client.channels.fetch(process.env.CHANNEL_ID);

        await channel.send({
            content: `${description}\n\nEnviado por: <@${userId}>` || '\n',
            files: [{ attachment: videoPath, name: 'video.mp4' }]
        });

        await fs.promises.unlink(videoPath);

        return res.status(200).send({message: "Vídeo enviado para o Discord!" });
    } catch (err) {
        if(err.message.includes("Request entity too large")) return res.status(413).send({message:'Request entity too large'});
        return res.status(500).send({message:'Erro ao enviar vídeo pro Discord.'});
    }
});

app.post("/updateCodes", async (req,res) => {
    usersCodes = await loadUsersCodes(client)
    console.log(usersCodes)

    return res.status(200).send({message: "Codes updated."})
})

app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});
