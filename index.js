const PORT = 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.get('/', (req, res) => {
    res.json('Welcome to the EV API.');
});

const newspapers = [
    {
        name: 'elektrek',
        address: 'https://electrek.com/'
    },
    {
        name: 'arstechnica',
        address: 'https://arstechnica.com/'
    },
    {
        name: 'insideevs',
        address: 'https://insideevs.com/'
    }
];

const articles = [];


newspapers.forEach(newspaper => {
    axios.get(newspaper.address).then(response => {
        const html = response.data;
        const $ = cheerio.load(html);

        $('a:contains("Musk")', html).each(function () {
            const title = $(this).text();
            const url = $(this).attr('href');

            articles.push({
                title,
                url,
                source: newspaper.name
            })
        })
    })
})


//this route will scrape from electrek
app.get('/news', (req, res) => {
    res.json(articles);
});


app.get('/news/:newspaperId', async (req, res) => {
    console.log(req);
    console.log(req.params.newspaperId);

    const newspaperId = req.params.newspaperId;

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address;

    console.log(newspaperAddress);


    axios.get(newspaperAddress).then(response => {
        const newspaperHtml = response.data;
        const $$ = cheerio.load(newspaperHtml);
        const specificArticles = [];

        $$('a:contains("Musk")', newspaperHtml).each(function () {
            const title = $$(this).text();
            const url = $$(this).attr('href');

            specificArticles.push({
                title,
                url,
                source: newspaperId
            })
        })
        if (specificArticles === []) {
            console.log('Empty array.')
        }

        else res.json(specificArticles);

    }).catch(err => {
        res.response(err);
    })
})



app.listen(PORT, () => console.log(`Server is online. Port ${PORT}.`));

