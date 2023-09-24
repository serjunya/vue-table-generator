const db = require('../db');
class EntityController {
    async createEntity(req, res) {
        const {
            _createUser,
            _updateUser,
            _createDt,
            _updateDt,
            Login,
            Name,
            Password,
            Lang,
            LoginsCount
        } = req.body;
        
        const newEntity = await db.query(
            `INSERT INTO entity ("_createUser", "_updateUser", "_createDt", 
                "_updateDt", "Login", "Name", "Password", "Lang", "LoginsCount") 
                values ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
                [
                    _createUser,
                    _updateUser,
                    _createDt,
                    _updateDt,
                    Login,
                    Name,
                    Password,
                    Lang,
                    LoginsCount
                ])
        res.json(newEntity.rows[0]);
    }

    async getEntities(req, res) {
        const entities = await db.query(`SELECT * FROM entity
        ORDER BY _id ASC LIMIT 15`);
        res.json(entities.rows);
    }

    //usual
    async getNEntsFrom(req, res) {
        const moreEnts = await db.query(`SELECT * FROM entity 
        WHERE _id > ${req.params.from} 
        ORDER BY _id ASC LIMIT 15`);
        res.json(moreEnts.rows);
    }

    async getFiltered(req, res) {
        console.log(req.query);
        let filterString = '';
        switch (req.query.type) {
            case 'empty':
                filterString = `AND "${req.query.col}"
                    LIKE '' `;
                break;
            case 'notEmpty':
                filterString = `AND "${req.query.col}"
                    NOT LIKE '' `;
                break;
            case 'eq':
                filterString = `AND "${req.query.col}"
                    LIKE '${req.query.str}' `;
                break;
            case 'notEq':
                filterString = `AND "${req.query.col}"
                    NOT LIKE '${req.query.str}' `;
                break;
            case 'begins':
                filterString = `AND "${req.query.col}"
                    LIKE '${req.query.str}%' `;
                break;
            case 'contains':
                filterString = `AND "${req.query.col}"
                    LIKE '%${req.query.str}%' `;
                break;
            case 'notContains':
                filterString = `AND "${req.query.col}"
                    NOT LIKE '%${req.query.str}%' `;
                break;
            default:
                filterString = '';
        }

        switch(req.query.sorting) {
            case 'asc    ':
                filterString += `ORDER BY ${req.query.sortingCol} ASC `;
                break;
            case 'desc    ':
                filterString += `ORDER BY ${req.query.sortingCol} DESC `;
        }
        
        let sign = '>';
        if (req.query.sorting === 'desc    ') sign = '<';
        const formedQuery = `
            SELECT * FROM entity
            WHERE ${req.query.sortingCol} ${sign} ${req.query.from} 
            ${filterString}
            LIMIT 15
        `
        console.log(formedQuery);
        const entities = await db.query(formedQuery);
        res.json(entities.rows);
    }

    async getLast(req, res) {
        const lastEnt = await db.query(`SELECT * FROM entity
        ORDER BY ${req.query.sortingCol} DESC LIMIT 1`);
        res.json(lastEnt.rows[0]);
    }

    async updateEntity(req, res) {
        const {
            _id,
            _createUser,
            _updateUser,
            _createDt,
            _updateDt,
            Login,
            Name,
            Password,
            Lang,
            LoginsCount
        } = req.body;

        const entity = await db.query(`
        UPDATE entity SET 
        "_createUser" = $1, 
        "_updateUser" = $2, 
        "_createDt" = $3, 
        "_updateDt" = $4, 
        "Login" = $5, 
        "Name" = $6, 
        "Password" = $7, 
        "Lang" = $8, 
        "LoginsCount" = $9
        WHERE _id = $10
        RETURNING *`, [
            _createUser,
            _updateUser,
            _createDt,
            _updateDt,
            Login,
            Name,
            Password,
            Lang,
            LoginsCount,
            _id
        ]);
        res.json(entity.rows[0]);
    }
    async deleteEntity(req, res) {
        const id = req.params.id;
        const entity = await db.query('DELETE FROM entity WHERE _id = $1', [id]);
        res.json(entity.rows[0]);
    }
}

module.exports = new EntityController();