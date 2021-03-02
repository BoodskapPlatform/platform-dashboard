const async = require('async');
const PropertiesReader = require('properties-reader');
const fs = require('fs');

var prop = null;

try{
    prop = PropertiesReader(process.env.HOME + '/config/dashboard.properties');
    console.log(new Date()+" | property loaded for config folder")

}catch(e){
    console.log(new Date()+" | property loaded for project folder")
    prop = PropertiesReader('dashboard.properties');

}

var serverPort = 'server.port';
var domainKey = 'boodskap.domainkey';
var googleAnalytics = 'google.analytics.id';

//Get the property value
getProperty = (pty) => {return prop.get(pty);}
console.log("***************************************" +
    "\nBoodskap IoT Platform\n" +
            "***************************************")
async.series({
    'serverConfig' : function (scbk) {

        /****************************
         1] Configuring Server Properties
         ****************************/

        let txt = 'var config = {port:'+getProperty(serverPort)+',domainKey:"'+(getProperty(domainKey) ? getProperty(domainKey) : "")+'"};\nmodule.exports=config;';
        fs.writeFile('config.js', txt, (err) => {
            if (err){
                console.error('Error in configuring server properties')
                scbk(null,null);
            }else{
                console.error('1] Setting server properties success')
                scbk(null,null);
            }
        });

    },
     'webConfig' : function (wcbk) {

        /****************************
         2] Configuring Web Properties
         ****************************/

        let txt = 'var CONFIG={"googleAnalytics":"'+(getProperty(googleAnalytics) ? getProperty(googleAnalytics) : '')+'"}';

         fs.writeFile('./webapps/js/platform-config.js', txt, (err) => {
             if (err){
                 console.error('Error in configuring web properties')
                 wcbk(null,null);
             }else{
                 console.error('2] Setting web properties success')
                 wcbk(null,null);
             }
         });

    }
}, function (err, result) {
    console.log(new Date() + ' | Boodskap UI Build Success');
    console.log('Now execute > npm start');
})



