const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path')
const request = require('request');

let cp = require('child_process')

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
            let writeStream = fs.createWriteStream('./' + name + '/' + cpt + '.mp3')
            request.get(elem)
                .on('error', function (error) {
                    console.error(error)
                })
                .pipe(writeStream);
            convert(writeStream, cpt, name);
            cpt++;
        }
    })

})();

function convert(writeStream, cpt, name){
    writeStream.on('finish', function(){
        let src = path.join(__dirname, name, cpt + '.mp3');
        let dst = path.join(__dirname, name, cpt + '.wav');
        let p = cp.spawn('ffmpeg', ['-i', src, dst]);
        p.stderr.pipe(process.stdout)
    })
}