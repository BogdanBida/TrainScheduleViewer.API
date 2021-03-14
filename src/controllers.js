const needle = require('needle');
const Parser = require('./parser');
const fs = require('fs');
const chalk = require('chalk');
const { CACHE_PATH, MAX_CACHE_FILE_COUNT } = require('./config');

const getFileName = (data) => {
    const fileName = data.replace('https://', '').split('/').join('').split('.').join('');
    return CACHE_PATH + fileName + '.json';
}

module.exports = class ScheduleController {
    static async getSchedule(req, res) {
        const url = req.query.url;
        needle.get(url, (err, parsedData) => {
            let data;
            if (err) {
                console.warn(chalk.rgb(255, 255, 0).visible(`---------------+ Warning!\n${err}`));
                try {
                    data = JSON.parse(fs.readFileSync(getFileName(url), 'utf-8'));
                    console.info(chalk.cyan('---+ Data taken from cache +--'));
                } catch (err) {
                    console.error(chalk.red('ReadFile - ' + err.message));
                    return res.status(502).json(err);
                }
            } else {
                try {
                    data = Parser.getSchedule(parsedData.body);
                    setFileToCache(getFileName(url), data);
                } catch (err) {
                    console.error(chalk.red('WriteFile - ' + err.message));
                }
            }
            res.json([...data]);
        });
    }

    static async getRoute(req, res) {
        const url = req.query.url;
        needle.get(url, (err, parsedData) => {
            if (err) {
                console.warn(chalk.rgb(255, 255, 0).visible(`---------------+ Warning!\n${err}`));
                return res.status(502).json(err);
            }
            const data = Parser.getRoute(parsedData.body);
            res.json([...data]);
        });
    }
}

function setFileToCache(path, data) {
    try {
        fs.writeFileSync(path, JSON.stringify(data));
    } catch (err) {
        console.error(chalk.red('WriteFile - ' + err.message));
    }
    fs.readdir(CACHE_PATH, (err, files) => {
        if (err) { console.error(chalk.red(err)); }
        else if (files.length > MAX_CACHE_FILE_COUNT) {
            try {
                files.forEach(v => fs.unlink(CACHE_PATH + v, () => { }));
            } catch (err) {
                console.error(chalk.red('UnlinkFile - ' + err.message));
            }
        }
    });
}