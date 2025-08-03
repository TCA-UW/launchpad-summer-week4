const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3001;

const tasksRouter = require('./routes/tasks');

app.use(cors());
app.use(express.json());

app.use('/tasks', tasksRouter);

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});