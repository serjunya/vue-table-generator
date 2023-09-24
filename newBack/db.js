const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    password: 'MineralwassaKokPG',
    host: 'localhost',
    port: 5432,
    database: "entities"
});

module.exports = pool;