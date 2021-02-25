$(document).ready(function () {
    renderUserDetails()
    loadUserProfilePicture()
    loadLogoPicture()
    geThemeProperty();
});

function geThemeProperty() {

    if (!Cookies.get('platform_theme')) {
        getDomainProperty(DOMAIN_THEME_PROPERTY, function (status, data) {
            if (status) {
                var obj = JSON.parse(data.value);
                Cookies.set('platform_theme', obj);
                $("#headerBar").removeAttr('style')
                $("#headerBar").removeClass('bg-dark');
                $("#headerBar").css('background-color',obj.headerBg)
            }

        })
    }else{
        var obj = JSON.parse(Cookies.get('platform_theme'))
        $("#headerBar").removeClass('bg-dark');
        $("#headerBar").removeAttr('style')
        $("#headerBar").css('background-color',obj.headerBg)
    }

}



function loadLogoPicture() {

    if (!Cookies.get('domain_logo')) {
        getGlobalProperty(ADMIN_DOMAIN_BRANDING_PROPERTY, USER_OBJ.domainKey, function (status, data) {
            if (status) {
                var src = data.data;
                $(".domain_logo").attr('src', API_BASE_PATH + '/files/public/download/' + src);
                Cookies.set('domain_logo', src);

                // $(document).prop('title', resultData.titleName);

                var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                link.type = 'image/x-icon';
                link.rel = 'shortcut icon';
                link.href = API_BASE_PATH + '/files/public/download/' + src;
                document.getElementsByTagName('head')[0].appendChild(link);

            } else {
                $(".domain_logo").attr('src', "images/boodskap/bdskap-logo-1.png");

                var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                link.type = 'image/x-icon';
                link.rel = 'shortcut icon';
                link.href = "images/favicon.ico";
                document.getElementsByTagName('head')[0].appendChild(link);
            }

        })
    } else {
        $(".domain_logo").attr('src', API_BASE_PATH + '/files/public/download/'+ Cookies.get('domain_logo'));

        var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = API_BASE_PATH + '/files/public/download/' + Cookies.get('domain_logo');
        document.getElementsByTagName('head')[0].appendChild(link);
    }


}


function renderUserDetails() {
    if(USER_OBJ.firstName){
        $(".user_profile_name").html(USER_OBJ.firstName + ' ' + (USER_OBJ.lastName ? USER_OBJ.lastName : ''))
    }else{
        $(".user_profile_name").html('Administrator')
    }

}


function removeCookies() {
    Cookies.remove('session_obj');
    Cookies.remove('domain_logo');
    Cookies.remove('user_picture');
    Cookies.remove('platform_theme');
}

function logout() {
    loginOutCall(function (status, data) {
        removeCookies();
        document.location = WEB_BASE_PATH + '/login';

    });


}


function loadUserProfilePicture() {

    if (!Cookies.get('user_picture')) {

        getUserProperty(PROFILE_PICTURE_PROPERTY, USER_OBJ.email, function (status, data) {
            if (status) {
                var src = JSON.parse(data.value);
                Cookies.set('user_picture', src.picture);
                $(".user_profile_picture").attr('src', API_BASE_PATH + '/files/download/' + API_TOKEN + '/' + src.picture);
            } else {
                $(".user_profile_picture").attr('src', "images/avatar.png");
            }

        })
    } else {
        $(".user_profile_picture").attr('src', API_BASE_PATH + '/files/download/' + API_TOKEN + '/' + Cookies.get('user_picture'));
    }
}


function openNav() {
    if ($("#sideNavBar").hasClass('barwidth')) {
        $(".barmenu").html('<i class="fa fa-bars"></i>')
        $("#sideNavBar").removeClass('barwidth')
        $("#sideNavBar").hide();
    } else {
        $(".barmenu").html('<i class="fa fa-times"></i>')
        $("#sideNavBar").addClass('barwidth')
        $("#sideNavBar").show()
    }
}
