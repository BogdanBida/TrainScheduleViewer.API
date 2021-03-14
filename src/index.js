const express = require('express');
const app = express();
const cors = require('cors');
const chalk = require('chalk');
const { PORT } = require('./config');

const ScheduleController = require('./controllers');

app.use(cors());
app.get('/', (req, res) => res.send('Server works!'));
app.get('/schedule', ScheduleController.getSchedule);
app.get('/route', ScheduleController.getRoute);

app.listen(PORT, () => {
    console.info(chalk.magenta(`--+ Server listening on ${PORT} port +---`));
});
