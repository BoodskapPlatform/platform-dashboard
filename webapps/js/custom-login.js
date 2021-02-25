var SYS_DOMAIN_KEY = $("#SYS_DOMAIN_KEY").val();
var DOMAIN_UUID = '637e0554-7092-11e8-adc0-fa7ae01bbebc';
var DEFAULT_LOGIN_LOGO_PATH = 'images/boodskap/bdskap-logo-2.png';

var DEFAULT_LOGIN_THEME = {
    leftBg : '#fac300',
    leftBottomBg : '#f59c1a',
    textColor : '#f59c1a',
    buttonColor : '#f59c1a',
    titleName : 'Boodskap Highly Scalable IoT Platform',
    sloganText : 'The Launch Pad for your IoT needs'
}
$(document).ready(function () {
    getLoginProp()

});




function getLoginProp() {
    $(".textColor").removeClass('text-warning');
    $("#submitButton").removeClass('btn-warning');
    $(".news-feed").css('background-color','#fff');
    $(".leftBottomBg").removeClass('news-caption')

    getGlobalProperty(DOMAIN_UUID, SYS_DOMAIN_KEY, function (status, data) {
        if (status) {
            var resultData = JSON.parse(data.data);
            $(".loginLogo").attr('src', resultData.logoid ? API_BASE_PATH + '/files/public/download/' + resultData.logoid : 'images/boodskap/bdskap-logo-2.png');

            $(".loginCustom").html(resultData.customHtml);

            $(".textColor").css('color',resultData.textColor +'!important')
            $("#submitButton").css({
                'background-color': resultData.buttonColor,
                'border-color': resultData.buttonColor,
                'color' : '#fff'
            });
            $(".titleName").html(resultData.titleName)
            $(".sloganText").html(resultData.sloganText)

            $(document).prop('title', resultData.titleName);

            var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            link.href = resultData.logoid ? API_BASE_PATH + '/files/public/download/' + resultData.logoid : 'images/favicon.ico';
            document.getElementsByTagName('head')[0].appendChild(link);



            $(".news-feed").css('background-color', resultData.leftBg);
            $(".leftBottomBg").css('background-color', resultData.leftBottomBg);

        } else {
            $(".loginLogo").attr('src', DEFAULT_LOGIN_LOGO_PATH);
            $(".textColor").addClass('text-warning');
            $("#submitButton").addClass('btn-warning');
            $(".leftBottomBg").addClass('news-caption');
            $(".news-feed").css('background-color',DEFAULT_LOGIN_THEME.leftBg);
            $(".titleName").html('Boodskap Highly Scalable IoT Platform')
            $(".sloganText").html('The Launch Pad for your IoT needs')

            var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            link.href = 'images/favicon.ico';
            document.getElementsByTagName('head')[0].appendChild(link);

            $(document).prop('title', 'Boodskap - Highly Scalable IoT Platform');

        }

    });

}