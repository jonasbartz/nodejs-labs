const main = require('./process-data-scorebing-api')
const update = require('./pg-connection-update')
const sleep = require('sleep-promise');
const fs = require('fs');

(async () => {
    while (true){
        const path = "./stop.js"

        if (fs.existsSync(path))
        {
            console.log("Encerrando o processo...");
            fs.unlinkSync(path)
            break;
        }

        console.log("Executando...");
        main.getMatchDetail();
        
        await sleep(5000);        

        update.update("call update_stats();");

        await sleep(60000);        
    }
})();