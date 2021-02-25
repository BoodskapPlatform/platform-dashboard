var user_list = [];
var userTable = null;


$(document).ready(function () {
    $(".leftMenu").removeClass('active')
    $(".users").addClass('active')

    loadUsersList();

});


function loadUsersList() {


    if (userTable) {
        userTable.destroy();
        $("#userTable").html("");
    }

    var fields = [
        {
            sTitle: 'Details',
            "className": 'details-control',
            "orderable": false,
            sWidth: '5%',
            "data": null,
            "defaultContent": ''
        },
        {
            mData: 'fullname',
            sTitle: 'Full Name',
            orderable: false,
            mRender: function (data, type, row) {
                data = (row['firstName'] ? row['firstName'] : "") + " " + (row['lastName'] ? row['lastName'] : "");
                return data;
            }
        },
        {
            mData: 'email',
            sTitle: 'Email',
            orderable: false

        },
        {
            mData: 'roles',
            sTitle: 'Role',
            orderable: false,
            mRender: function (data, type, row) {

                return data ? data.join("<br>") : '';
            }
        },
        {
            mData: 'registeredStamp',
            sTitle: 'Created Time',
            mRender: function (data, type, row) {
                return data ? moment(data).format('MM/DD/YYYY hh:mm:ss a') : "-";
            }
        },
       /* {
            mData: 'action',
            sTitle: 'Action',
            orderable: false,
            sWidth: '10%',
            mRender: function (data, type, row) {

                var str = `

                        <div class="btn-group">
                            <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fa fa-ellipsis-h"></i>
                            </button>
                            <div class="dropdown-menu" x-placement="bottom-start" 
                            style="position: absolute; transform: translate3d(0px, 29px, 0px); top: 0px; left: 0px; will-change: transform;    overflow: hidden;">
                                <a class="dropdown-item" href="javascript:void(0)" onclick="openModal(2,'`+row["email"]+`')">
						    	<i class="fa fa-edit"></i> Edit User</a>
						    	<a class="dropdown-item" href="javascript:void(0)" onclick="openModal(3,'`+row["email"]+`')"><i class="fa fa-trash"></i> Delete User</a>
						  	</div>
						</div>
					`

                return str;

            }
        }*/

    ];



    var domainKeyJson = {"match": {"domainKey": DOMAIN_KEY}};
    var defaultSorting = [];

    var queryParams = {
        query: {
            "bool": {
                "must": [],
            }
        },

        sort: []
    };

    var tableOption = {
        "language": {

            "processing": '<i class="fa fa-spinner fa-spin"></i> Processing'
        },
        responsive: true,
        paging: true,
        searching: true,
        aaSorting: [[4, 'desc']],
        "ordering": true,
        iDisplayLength: 10,
        lengthMenu: [[10, 50, 100], [10, 50, 100]],
        aoColumns: fields,
        "bProcessing": true,
        "bServerSide": true,
        "sAjaxSource": API_BASE_PATH + '/elastic/search/query/' + API_TOKEN,
        "fnServerData": function (sSource, aoData, fnCallback, oSettings) {

            queryParams.query['bool']['must'] = [];
            queryParams.query['bool']['should'] = [];
            delete queryParams.query['bool']["minimum_should_match"];

            var keyName = fields[oSettings.aaSorting[0][0]]

            var sortingJson = {};
            sortingJson[keyName['mData']] = {"order": oSettings.aaSorting[0][1]};
            queryParams.sort = [sortingJson];

            queryParams['size'] = oSettings._iDisplayLength;
            queryParams['from'] = oSettings._iDisplayStart;

            var searchText = oSettings.oPreviousSearch.sSearch;

            if (searchText) {

                queryParams.query['bool']['should'].push({"wildcard" : { "fullname" : "*"+searchText.toLowerCase()+"*" }})
                queryParams.query['bool']['should'].push({"wildcard" : { "email" : "*"+searchText.toLowerCase()+"*" }})
                queryParams.query['bool']['should'].push({"wildcard" : { "primaryPhone" : "*"+searchText.toLowerCase()+"*" }})
                queryParams.query['bool']["minimum_should_match"]=1;
                queryParams.query['bool']['must'] = [domainKeyJson];
            }else {
                queryParams.query['bool']['must'] = [domainKeyJson];
            }


            var ajaxObj = {
                "method": "GET",
                "extraPath": "",
                type : 'USER',
                "query": JSON.stringify(queryParams),
                "params": []
            };


            oSettings.jqXHR = $.ajax({
                "dataType": 'json',
                "contentType": 'application/json',
                "type": "POST",
                "url": sSource,
                "data": JSON.stringify(ajaxObj),
                success: function (data) {

                    var resultData = searchQueryFormatter(data).data;
                    user_list =resultData.data;
                    $('.totalRecords').html(resultData.recordsTotal)
                    resultData['draw'] = oSettings.iDraw;

                    fnCallback(resultData);
                }
            });
        }

    };

    userTable = $("#userTable").DataTable(tableOption);

    $('#userTable tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = userTable.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            var obj = row.data();
            row.child(format(obj)).show();
            tr.addClass('shown');
            loadUserProperties(obj)

        }
    });

}



function format(obj) {

    var str = '<div class="row">' +
        '<div class="col-md-12 mt-2 mb-2"> ' +
            '<p>Give access to the dashboard</p>' +
            '<ul class="list-group" id="user_'+obj.email.replace("@",'').replace(".",'')+'">' +

            '</ul>'+
            '<p class="msg_'+obj.email.replace("@",'').replace(".",'')+'"></p>' +
        '</div> ' +
        '</div>';
    return str;
}
var dashboardList = [];

function loadUserProperties(obj){
    dashboardList = [];
    var id= obj.email.replace("@",'').replace(".",'');
    $("#user_"+id).html('');

    getUserProperty('user.dashboard.list',obj.email,function (status,data){

        var userDasboard = [];

        if(status){

            var dat = JSON.parse(data.value);
            userDasboard = _.pluck(dat,'property');

        }

        getDomainProperty('domain.dashboard.list',function (status,result){
            if(status){

                var data = JSON.parse(result.value);

                dashboardList = JSON.parse(result.value);

                if(data && data.length > 0){

                    for(var i=0;i<data.length;i++){

                        var flag = userDasboard.includes(data[i].property) ? 'checked' : '';

                        var disabled = data[i].tokenId ? '' : 'disabled';

                        $("#user_"+id).append('<li style="" class="list-group-item">' +
                            '<label style="display: block"><input type="checkbox" '+disabled+' '+flag+' onchange="updateUserProp(\''+obj.email+'\',\''+data[i].property+'\',this)" /> '+data[i].name+'</label>' +
                            '</li>')
                    }



                }
            }
        })
    })


}

function updateUserProp(id, property, e){

    // console.log("status =>",$(e).is(':checked'))
    // console.log("Id =>",id)
    // console.log("property =>",property)


    var classId= id.replace("@",'').replace(".",'');

    // $("#user_"+classId+" input").attr('disabled','disabled');
    $(".msg_"+classId).html('<i class="fa fa-spinner fa-spin"></i> processing....')

    getUserProperty('user.dashboard.list',id,function (status,data) {
        var result = [];
        if (status) {

            result = JSON.parse(data.value);
            result = _.pluck(result,'property');

        }


        if($(e).is(':checked')){
            result.push(property)

        }else{
            var tmp = [];
            for(var j=0;j<result.length;j++){
                if(property != result[j]){
                    tmp.push(result[j])
                }
            }
            result = tmp;
        }

        result = _.uniq(result);


        var rObj = [];
        for(var i=0;i<dashboardList.length;i++){
            if(result.includes(dashboardList[i].property)){
                rObj.push(dashboardList[i])
            }
        }

        var obj = {
            name : 'user.dashboard.list',
            userId : id,
            value : JSON.stringify(rObj)
        }

        upsertUserProperty(obj,function (status,result){
            if(status){
            }else{
                errorMsg('Error in giving dashboard access')
            }
            $(".msg_"+classId).html('');
            // $("#user_"+classId+" input").removeAttr('disabled');

        })
    });
}
