const express = require('express');
const app = express();
const cors = require('cors');
const chalk = require('chalk');

const ScheduleController = require('./controllers');
const { PORT, HOSTNAME } = require('./config');

app.use(cors());
app.get('/schedule', ScheduleController.getSchedule);
app.get('/route', ScheduleController.getRoute);

app.listen(PORT, HOSTNAME, () => {
    console.info(chalk.magenta(`--+ Server listening at http://${HOSTNAME}:${PORT} +---`));
});

