require('dotenv').config();

const {loadUsersCodes} = require("./helpers/loadUsersCodes")
const { deleteLastUsersClip } = require('./helpers/deleteLastUsersClip');

const express = require('express');
const exphbs = require("express-handlebars");
const path = require("path");
const upload = require("./io/multer");
const fs = require("fs");
const session = require('express-session');

const { Client } = require('discord.js-selfbot-v13');
const { generateUserHash, findUserByDMHash } = require('./helpers/userHash');

const port = process.env.PORT || 3000;
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

app.use(session({
    secret: 'chave-secreta',
    resave: false,
    saveUninitialized: false
}));

const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next()
}

const requireNoAuth = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    next()
}

app.get("/", requireAuth, (req, res) => {
    res.render("home", {homePage: true});
});

app.get("/sentConfirm", requireAuth, (req, res) => {
    res.render("sent", {sendPage: true})
})

app.get("/login", requireNoAuth, (req, res) => {
    res.render("login")
})

app.get("/signup", requireNoAuth, (req, res) => {
    res.render("signup")
})

app.post('/upload', requireAuth, upload.single('video_file'), async (req, res) => {
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
        console.error(err)
        if(err.message.includes("Request entity too large")) return res.status(413).send({message:'Request entity too large'});
        return res.status(500).send({message:'Erro ao enviar vídeo pro Discord.'});
    }
});

app.post("/undoLastClip", requireAuth, async (req, res) => {
    const {userCode} = req.body
    if(!userCode) return res.status(403).send({message: "UserCode not found."})
    
    const user = usersCodes.filter(user => user.userCode === userCode)[0]
    if(!user) return res.status(403).send({message: "User not found."})

    const resp = await deleteLastUsersClip(client,user.userId)
    if(!resp) return res.status(500).send({message: "Internal Error."})

    return res.status(200).send({message: "Deleted last clip successfully"})
})

app.post("/updateCodes", async (req,res) => {
    usersCodes = await loadUsersCodes(client)

    return res.status(200).send({message: "Codes updated."})
})

app.post("/auth/login", requireNoAuth, async (req, res) => {
    const{login, password} = req.body

    if(!login) return res.status(422).send({message: "Field login can't be null"})
    if(!password) return res.status(422).send({message: "Field password can't be null"})
    else if(password.length < 8)  return res.status(422).send({message: "Password length must be more than 8 characters"})

    const hash = generateUserHash(login, password)
    const userId = await findUserByDMHash(hash, client)

    if(!userId) return res.status(404).send({message: "User not found!"})

    const user = { id: userId };
    req.session.user = user

    res.status(200).send({message: "User successfully authenticated!", user, token:hash})
})

app.post("/auth/signup", requireNoAuth, async (req, res) => {
    const{login, password} = req.body

    if(!login) return res.status(422).send({message: "Field login can't be null"})
    if(!password) return res.status(422).send({message: "Field password can't be null"})
    else if(password.length < 8)  return res.status(422).send({message: "Password length must be more than 8 characters"})

    const hash = generateUserHash(login, password)
    
    res.status(200).send({message: "Please, confirm your token!", token: hash})
})

app.post('/auth/logout', requireAuth, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error while destroying:", err)
            return res.status(500).json({ error: 'Could not logout user!' });
        }

        res.clearCookie('connect.sid');
        return res.json({ message: 'Success! User is no longer authenticated.' });
    });
});

app.post("/token/confirm", async (req, res) => {
    const {token} = req.body

    if(!token) return res.status(422).send({message: "Field token can't be null"})

    const userId = await findUserByDMHash(token, client)

    if(!userId) return res.status(404).send({message: "User not found!"})

    const user = { id: userId };
    req.session.user = user

    res.status(200).send({message: "User successfully authenticated!", user, token})
})


app.listen(port, () => {
    console.log(`Server started at port: ${port}`);
});
