const rp = require('request-promise');
const cheerio = require('cheerio');


const today = require('../today');
const timestamp = require('../time')

const db = require('../firebase_connect');

const url = 'https://timesofindia.indiatimes.com/briefs';
// const url = 'https://timesofindia.indiatimes.com/briefs/india';


var toi_briefs =function(data, callback){
    let resPayload = {};

    rp(url)
    .then(function(html){
        const $ = cheerio.load(html);
        let result_ = $('.brief_box');
        resPayload.html = [];

        console.log(timestamp);
        
        $(result_).each(function(i, element){
            let src = 'The Times Of India';
            let title = $(element).children('h2').text();
            let image = $(element).children('a').children('div').children('img').attr('data-src');
            // console.log($(element).children('img'))
            let details = $(element).children('p').children('a').html();
            let news_link = 'https://timesofindia.indiatimes.com' + $(element).children('a').attr('href');
            // let fillhtml = $(link).html();
            if(title != ''){ 
                resPayload.html.push({src,title,details,image,news_link}) 

                db.collection(today+'-world').doc(title)
                .set({src,title,details,image,news_link,timestamp})
                .then(()=>{})
            };
            
            
        })

        callback(200, {'status':'success'});
    })
    .catch(function(err){
        // handle error
        console.log(err);
        callback(200, err);
    });

    
}

module.exports = toi_briefs;