const express = require('express');
const cors = require('cors');
const entityRouter = require('./routes/entity.routes');

const PORT = process.env.PORT || 5150;

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', entityRouter);

app.listen(PORT, () => console.log(`listening on ${PORT}`));
