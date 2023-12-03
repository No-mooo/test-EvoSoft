"use strict";

const fs = require('fs');

async function main() {
   try {
        const html_2ip = await fetch('https://2ip.ru').then(resolve => resolve.text());
        const myIp = searchIp(html_2ip);

        // Мне не удалось зарегистрироваться на сайте maxmind.com, чтобы получить API ключа, необходимый для отправки GET-запросов на сайт. Для регистрации не подойдет просто "бесплатная почта".
        // Поэтому здесь будет имитация получения данных с maxmind.com
            const myTimeZone = getTimeZone(myIp).split(',');
        // /

        const listTimeZone = await fetch("https://gist.githubusercontent.com/salkar/19df1918ee2aed6669e2/raw").then(resolve => resolve.json());
        const listTargetTimeZone = listTimeZone.filter(item => item[1].includes(myTimeZone[0]));

        fs.writeFileSync('output.csv', myTimeZone + '\n' + listTargetTimeZone.join(' || '), 'utf8');

    } catch (error) {
        console.log(error);
    }
}

function searchIp(text) {
    let endIp = text.indexOf('<div class="ip" id="d_clip_button">');
    endIp = text.indexOf("</span>", endIp);

    return text.slice(endIp - 14, endIp);
}

function getTimeZone(ip) {
    return "Novosibirsk, Novosibirsk Oblast, Russia, Europe";
}

main();
