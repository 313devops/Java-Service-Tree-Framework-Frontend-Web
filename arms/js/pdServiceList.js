$(function() {
    jstreeDataTableReload();

    $('.dataTables_length').find('select:eq(0)').addClass("darkBack");
    $('.dataTables_length').find('select:eq(0)').css('min-height','30px');
    //min-height: 30px;
});

$(function () {
    setSideMenu();
});

// 제품 상세 보기 클릭 이벤트
$( "#selectView" ).click(function() {
    location.href="pdServiceListView.html";
});

// --- 사이드 메뉴 설정 --- //
function setSideMenu() {
    setTimeout(function(){
        $('#sidebar_menu_product').attr("class","accordion-toggle active");
        $('#sidebar_menu_product').attr("aria-expanded","true");
        $('#sidebar_menu_product').css({'color':'lightblue'});
        $('#sidebar_menu_product').css({'font-weight':'900'});

        $('#product-elements-collapse').attr("class","panel-collapse collapse in");
        $('#product-elements-collapse').attr("aria-expanded","true");

        $('#sidebar_menu_product_list').addClass("active");
        $('#sidebar_menu_product_list').css({'color':'lightblue'});
        $('#sidebar_menu_product_list').css({'font-weight':'900'});
    },1000);
}

// --- 데이터 테이블 설정 --- //
function jstreeDataTableReload() {

    console.log("href: "+$(location).attr('href'));
    console.log("protocol: "+$(location).attr('protocol'));
    console.log("host: "+$(location).attr('host'));
    console.log("pathname: "+$(location).attr('pathname'));
    console.log("search: "+$(location).attr('search'));
    console.log("hostname: "+$(location).attr('hostname'));
    console.log("port: "+$(location).attr('port'));

    var isDevelopingToRoute = "/auth-user";

    var tempDataTable = $('#jstreeTable').DataTable({
        "ajax": {
            "url": isDevelopingToRoute + "/api/arms/pdService/getMonitor.do",
            "dataSrc": ""
        },
        "destroy": true,
        "processing": true,
        "responsive": true,
        "select": true,
        "columns": [
            { "data": "c_id" },
            { "data": "c_parentid" },
            { "data": "c_position" },
            { "data": "c_left" },
            { "data": "c_right" },
            { "data": "c_level" },
            { "data": "c_title" },
            { "data": "c_type" }
        ]
    });

    $('#jstreeTable tbody').on('click', 'tr', function () {
        var data = tempDataTable.row( this ).data();
        console.log(data);
        //alert( 'You clicked on '+ data.c_title +'\'s row' );
    } );

}