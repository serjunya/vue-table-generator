const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Entity = require('./models/entity');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const db = "mongodb+srv://serega:niceCokeBruh@cluster0.g5cu8by.mongodb.net/?retryWrites=true&w=majority";
const setPath = page => path.resolve(__dirname, 'pages', `${page}.html`);
mongoose
    .set('strictQuery', false)
    .connect(db)
    .then(res => console.log("connected to database"))
    .catch(error => console.log(error));
app.listen(3000, err => {
    err ? console.log(err) : console.log('listening on 3000');
});

app.all('/api/entities', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
  });

app.get('/api/entities', (req, res) => {
    Entity
        .find()
        .then(entities => res.send(entities))
        .catch(error => {
            console.log(error);
            res.render(setPath('error'), { title: 'Error' });
        })
})

app.post('/api/entities', (req, res) => {
    const {_createUser, _updateUser, _createDt, _updateDt,
        Login, Name, Password, Lang, LoginsCount } = req.body;
    const entity = new Entity({_createUser, _updateUser, _createDt, _updateDt,
        Login, Name, Password, Lang, LoginsCount });
    entity
        .save()
        .then(result => res.send(result))
        .catch(error => {
            console.log(error);
            res.render(setPath('error'));
        })
})

app.all('/api/entities/edit/:id', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
  });

app.put('/api/entities/edit/:id', (req, res) => {
    const {_createUser, _updateUser, _createDt, _updateDt,
        Login, Name, Password, Lang, LoginsCount } = req.body;
    const { id } = req.params;
    Entity
        .findByIdAndUpdate(id, {_createUser, _updateUser, _createDt,
            _updateDt, Login, Name, Password, Lang, LoginsCount })
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            console.log(error);
            res.render(setPath('error'));
        });
})

app.all('/api/entities/:id', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
  });

app.delete('/api/entities/:id', (req, res) => {
    Entity
        .findByIdAndDelete(req.params.id)
        .then(result => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.log(error);
            res.render(setPath('error'));
        });
})
