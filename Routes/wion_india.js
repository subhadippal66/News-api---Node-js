const rp = require('request-promise');
const cheerio = require('cheerio');

// const url = 'https://timesofindia.indiatimes.com/briefs';
const url = 'https://www.wionews.com/india-news?page=1';


var wion_india = function(data, callback){
    let resPayload = {};

    rp(url)
    .then(function(html){
        const $ = cheerio.load(html);
        let result_ = $('.list-holder');
        resPayload.html = [];
        
        $(result_).each(function(i, element){
            let src = 'WION';
            let title = $(element).find('.content-holder>h2').text();
            let details = $(element).find('.content-holder>p').text();
            let image = $(element).find('.img-place-holder>img').attr('src');
            let news_link = 'https://www.wionews.com' + $(element).find('.img-holder>a').attr('href');
            // let fillhtml = $(element).html();
            if(title != ''){ resPayload.html.push({title,details,image,news_link,src}) };
        })

        callback(200, resPayload);
    })
    .catch(function(err){
        // handle error
        console.log(err);
        callback(200, err);
    });

    
}

module.exports = wion_india;