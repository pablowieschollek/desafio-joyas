const { getJewels, filterJewels, prepareHATEOAS } = require('./database')
const { reportarConsulta } = require('./middlewares/reportar')
const express = require('express')
const { prepareValue } = require('pg/lib/utils')
const app = express()

app.use(express.json())

app.listen(3000, () => {console.log("Servidor encendido")})

//Rutas
app.get("/joyas", reportarConsulta, async (req, res) => {
    try {
        const joyas = await getJewels(req.query)
        const HATEOAS = await prepareHATEOAS(joyas)
        res.json(HATEOAS) 
    } catch (err) {
        res.status(500).send(err)
    }
})

app.get("/joyas/filtros", reportarConsulta, async (req, res) => {
    try {
        const joyas = await filterJewels(req.query)
        res.json(joyas)
    } catch (err) {
        res.status(500).send(err)
    }
})