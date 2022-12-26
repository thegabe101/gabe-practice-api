const PORT = 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.get('/', (req, res) => {
    res.json('Welcome to the EV API.');
});

const articles = [];

//this url will scrape from electrek
app.get('/news', (req, res) => {
    axios.get('https://electrek.co/').then((response) => {
        //response.data here is the entire html block for the elektrek website 
        const html = response.data;
        //console.log(html);
        const $ = cheerio.load(html);

        $('a:contains("Musk")', html).each(function () {
            const title = $(this).text();
            const url = $(this).attr('href');
            articles.push(title, url);
        })
        console.log(articles);
    });
});

app.listen(PORT, () => console.log(`Server is online. Port ${PORT}.`));

