const _ = require('lodash');
const cheerio = require('cheerio');

module.exports = class Parser {
    static getSchedule(body) {
        const $ = cheerio.load(body);
        const tbody = $('.schedule_table > tbody');
        const result = [];
        const tr = $(tbody).find('tr');
        tr.each((index, element) => {
            const td = $(element);
            const nthc = (n) => `td:nth-child(${n})`;
            const row = {
                id: td.find(nthc(2)).text().replaceAll(/\s/g, ''),
                idHref: td.find(nthc(2)).html().match(/href=".+"/)[0].replace('href="','').replace('"',''),
                direction: td.find(nthc(3)).text().replaceAll(/\s/g, '').replace('→', ' → '),
                timeFrom: td.find(nthc(4) + ' > span').text().replace('.', ':'),
                from: td.find(nthc(4) + ' > a').text(),
                timeTo: td.find(nthc(5) + ' > span').text().replace('.', ':'),
                to: td.find(nthc(5) + ' > a').text(),
                duration: td.find(nthc(6)).text().replaceAll(/\s/g, ''),
            };
            result.push(row);
        });
        return result;
    }

    static getRoute(body) {
        const $ = cheerio.load(body);
        const tbody = $('.train_schedule_table > tbody');
        const result = [];
        let tr = $(tbody).find('tr');
        tr.each((index, element) => {
            const td = $(element);
            const nthc = (n) => `td:nth-child(${n})`;
            const row = {
                name: td.find(nthc(1) + ' > a').text().replaceAll(/\s/g, ''),
                arrival: td.find(nthc(2) + ' > ._time').html().replace('.',':'),
                parking: td.find(nthc(3)).text().replaceAll(/\s/g, ''),
                inWay: td.find(nthc(5)).text().replaceAll(/\s/g, ''),
            };
            result.push(row);
        });
        return result;
    }
}