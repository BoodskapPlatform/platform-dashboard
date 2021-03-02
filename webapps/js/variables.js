var DEV = false;

var API_BASE_PATH = '';
var PLATFORM_BASE_PATH ='';
var MQTT_CONFIG = {}
var WEB_BASE_PATH = $("#WEB_BASE_PATH").val() ? $("#WEB_BASE_PATH").val() : '';



//properties
var GOOGLE_ANALYTICS_COCDE = CONFIG.googleAnalytics;

var PROFILE_PICTURE_PROPERTY = "user.picture";
var DOMAIN_BRANDING_PROPERTY = "domain.logobranding";
var ADMIN_DOMAIN_BRANDING_PROPERTY = '612b8370-e384-11e8-b568-0800200c9a66'
var DOMAIN_THEME_PROPERTY = "domain.theme";

if(DEV){
    API_BASE_PATH = 'https://platform.boodskap.io/api';
    PLATFORM_BASE_PATH ='https://platform.boodskap.io/platform';
    MQTT_CONFIG = {
        "hostName": 'platform.boodskap.io',
        "portNo": 443,
        "ssl": true
    }
}else{
    var hostName = location.hostname;
    var protocol = location.protocol;

    var mqttPort = protocol === 'https:' ? 443 : 80;

    API_BASE_PATH = protocol+"//"+hostName+"/api";
    WEB_BASE_PATH = protocol+"//"+hostName+WEB_BASE_PATH;
    MQTT_CONFIG = {
        "hostName": hostName,
        "portNo": mqttPort,
        "ssl": mqttPort === 443 ? true : false
    }
}



var SESSION_OBJ = Cookies.get('session_obj');
var API_TOKEN = '';

//If login restricted with the particular domain, hard code the domain key here
var DOMAIN_KEY = '';

var API_KEY = '';
var USER_OBJ = {};

if(SESSION_OBJ){
    SESSION_OBJ = JSON.parse(SESSION_OBJ);
    API_TOKEN = SESSION_OBJ.token;
    DOMAIN_KEY = SESSION_OBJ.domainKey;
    API_KEY = SESSION_OBJ.apiKey;
    USER_OBJ = SESSION_OBJ.user;
}
