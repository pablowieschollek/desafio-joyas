const { Pool } = require('pg')
const  format = require('pg-format')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'chapalapachala69',
    port: 5432,
    database: 'joyas',
    allowExitOnIdle: true
})

const getJewels = async ({ limits = 5, order_by = 'id_ASC', page = 0}) => {
    const [campo, direccion] = order_by.split("_")
    const offset = page * limits
    const formattedQuery = format("SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s", campo, direccion, limits, offset)
    
    const { rows: jewels } = await pool.query(formattedQuery)
    return jewels
}

const filterJewels = async ({ precio_min, precio_max, categoria, metal }) => {
    let filtros = []
    let values = []
    const addFilter = (campo, comparador, valor) => {
        values.push(valor)
        const { length } = filtros
        filtros.push(`${campo} ${comparador} $${length + 1}`)
    }

    if(precio_min) addFilter.push('precio', '>=', precio_min)
    if(precio_max) addFilter('precio', '<=', precio_max)
    if(categoria) addFilter('categoria', '=', categoria)
    if(metal) addFilter('metal', '=', metal)
    
    let query = "SELECT * FROM inventario"
    if(filtros.length > 0) {
        filtros = filtros.join(" AND ")
        query += `WHERE ${filtros}` 
    }
    const { rows: joyas } = await pool.query(query, values)
    return joyas
}

const prepareHATEOAS = async (jewels) => {
    
    const results = jewels.map((j) => {
        return {
            name: j.nombre,
            href: `./joyas/joya/${j.id}`
        }
    }).slice(0, 9)
    const total = jewels.length
    const HATEOAS = {
        total, 
        results
    }
    return HATEOAS
}

module.exports = {
    prepareHATEOAS,
    getJewels,
    filterJewels
};