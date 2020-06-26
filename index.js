const puppeteer = require('puppeteer');
const fs = require('fs');
const request = require('request');

const spawn = require('child_process').spawn

const url = "https://samplefocus.com/collections/claps-pack"
const name = url.substring(url.lastIndexOf('/') + 1);

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    let elems = await page.$$eval('.sample-mp3', (elements) => {
        let result = []
        for (element of elements) {
            result.push(element.value);
        }
        return result
    });
    await browser.close()
    let cpt = 1;
    fs.mkdir('./' + name, function (err) {
        for (elem of elems) {
            request.get(elem)
                .on('error', function (error) {
                    console.error(error)
                })
                .pipe(fs.createWriteStream('./' + name + '/' + cpt + '.mp3'))
            cpt++;
        }
        spawn('env/Scripts/python.exe',["converter.py", name]);
    })


})();