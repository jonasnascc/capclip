const express = require('express');
const exphbs = require("express-handlebars");
const path = require("path")

const port = 3000

const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.get("/", (req, res) => {
    res.render("home")
})

app.listen(port, () => {
    console.log(`Server started at port: ${port}`)
})
