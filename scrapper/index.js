const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const axios = require('axios');
const cheerio = require("cheerio");

async function main() {
    
    const url = "https://footystats.org/grenada/mt-rich-fc-vs-fc-camerhogne-h2h-stats" + "?timestamp=" + Date.now();

    axios.defaults.headers = {
        'Cache-Control': 'no-cache',
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache',
        'Expires': '0',
        };

    axios(url).then(response => {
        const html = response.data;
        const $ = cheerio.load(html);

        const comparisonTable = [];
      
        let id = 0
        let key = "";
        let home = "";
        let away = "";

        const currentMinute = $("#lswrapper > section > div.inner-content > div > div:nth-child(1) > p.ac.semi-bold.mt05").text();
        comparisonTable.push({
            'key': 'Time',
            'home': currentMinute,
            'away': currentMinute,
        });  

        const homeTeamName = $("#lswrapper > section > div.inner-content > div > div.fl.w50.rw100.pl1e.pr1e.pb1e > table > thead > tr > th:nth-child(2)").text();
        const awayTeamName = $("#lswrapper > section > div.inner-content > div > div.fl.w50.rw100.pl1e.pr1e.pb1e > table > thead > tr > th:nth-child(3)").text();

        comparisonTable.push({
            'key': 'Teams',
            'home': homeTeamName,
            'away': awayTeamName
        });   
                                
        const linkHomeTeam = $("#h2h_content2 > section.stat-group.stat-box.h2h-widget-neo > div.inner-content > div.row.cf > div.fl.ac.teamA.pr.w25 > p > a").prop('href');
        const linkAwayTeam = $("#h2h_content2 > section.stat-group.stat-box.h2h-widget-neo > div.inner-content > div.row.cf > div.fl.ac.teamB.pr.w25 > p > a").prop('href');
        
        comparisonTable.push({
            'key': 'TeamHomePage',
            'home': linkHomeTeam,
            'away': linkAwayTeam
        });   

        const score = $("#lswrapper > section > div.inner-content > div > div:nth-child(1) > p.ac.fs2e.bold").text();
        
        comparisonTable.push({
            'key': 'Score',
            'home': score.split(" ")[0],
            'away': score.split(" ")[2]
        });     

        $("#lswrapper > section > div.inner-content > div > div.fl.w50.rw100.pl1e.pr1e.pb1e > table > tbody > tr").each((index, element) => {
            let id = index + 1;
            const tds = $(element).find("td");
    
            let key  = $(tds[0]).text();
            let home = $(tds[1]).text();
            let away = $(tds[2]).text();
    
            comparisonTable.push({
                key,
                home,
                away
            });
        });

        $("#h2h_content3 > div:nth-child(2) > table > tbody > tr").each((index, element) => {
            let id = index +1;

            let market  = $("#h2h_content3 > div:nth-child(2) > table > tbody > tr:nth-child(" + id + ") > td.dark-gray.mild-small.al").text();
            let odds = $("#h2h_content3 > div:nth-child(2) > table > tbody > tr:nth-child(" + id + ") > td:nth-child(2)").text();
            let stats = $("#h2h_content3 > div:nth-child(2) > table > tbody > tr:nth-child(" + id + ") > td:nth-child(3)").text();

            comparisonTable.push({
                market,
                odds,
                stats
            });
        });        
        
    
        const csvWriter = createCsvWriter({
            path: 'file.csv',
            fieldDelimiter: ';',
            alwaysQuote: true,
            header: [
                {id: 'key', title: 'key'},
                {id: 'home', title: 'home'},
                {id: 'away', title: 'away'}
            ]
        });

        csvWriter.writeRecords(comparisonTable).then(() => {
            console.log('...Done');
        });

        console.log(comparisonTable);   

        const homeData = []

        comparisonTable.forEach(function(data){
            homeData.push(data.key, data.home)
        });

        /*        
        console.log(homeData);
        let d = Object.values(homeData.reduce((a, c) =>{
            // either use the existing entry or create a new one
            // with month already set
            (a[c.key] || (a[c.key] = {key: c.key}))[c.key] = c.home
            return a
        }, {}))
        
        console.log(d)
*/

    });  
}

main();