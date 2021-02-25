

$(document).ready(function () {
    loadUserDashboard()

});


function loadUserDashboard(obj){

    $("#dashboardTab").html('')
    $("#dashboardTabContent").html('')

    getUserProperty('user.dashboard.list',USER_OBJ.email,function (status,data){

        if(status){

            var dat = JSON.parse(data.value);

            if(dat && dat.length > 0){
                for(var i=0;i<dat.length;i++){

                    var str = '';

                    if(dat[i]['isimage'] && dat[i]['imgpath'] ){
                        str = '<img src="'+dat[i].imgpath+'" style="width:24px;margin-right:5px;" /> ';
                    }else{
                        str = '<img src="images/dashboard.png" style="width:24px;margin-right:5px;" /> ';
                    }



                    $(".leftMenu").append('<li class="'+dat[i].tokenId+' hightlightMenu '+(i==0 ? 'active' : '')+'">\n' +
                        '                <a  onclick="loadContent(\''+dat[i].tokenId+'\',\''+dat[i].name+'\',\''+dat[i].imgpath+'\')" href="javascript:void(0)">\n' +
                        str+dat[i].name +
                        '                </a>\n' +
                        '            </li>')

                   /* $("#dashboardTab").append('<li class="nav-item" role="presentation">' +
                        '<a onclick="loadContent(\''+dat[i].tokenId+'\')" class="nav-link '+(i==0 ? 'active' : '')+'"  id="t_'+dat[i].id+'" data-toggle="tab" ' +
                        'href="#t_'+dat[i].id+'" role="tab" style="font-weight: bold" aria-controls="t_'+dat[i].id+'" aria-selected="'+(i==0 ? 'true' : 'false')+'">' +
                        '<img src="'+dat[i].imgpath+'" style="width:24px;margin-right:5px;" /> '+dat[i].name+'</a>' +
                        '</li>')*/

                }

                loadContent(dat[0].tokenId,dat[0].name,dat[0].imgpath)

            }else{
                errorMsg('Oops! Dashboard not yet configured!')
            }

        }else{
            errorMsg('Oops! Dashboard not yet configured!')
        }

    })

}

function loadContent(id,nam,imgpath){

    if($("#sideNavBar").hasClass('barwidth')){
        openNav()
    }


    $(".hightlightMenu").removeClass('active');
    $("."+id).addClass('active');
    //'<img src="'+(imgpath ? imgpath : 'images/dashboard.png')+'" style="width:24px;margin-right:5px;" /> '+
    $(".pageTitle").html('<i class="fa fa-cube" style="color: #666"></i> '+ nam);

    $("#dashboardTabContent").html('<iframe id="parentIframe" src="'+CONFIG.web + '/public/dashboard/' + DOMAIN_KEY + '/' + id+'?p=1" style="width: 100%;min-height:'+$(window).height()*5+'px;border:0px;overflow: auto"></iframe>');


}