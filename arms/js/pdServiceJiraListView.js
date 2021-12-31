$(function () {
    // --- 에디터 설정 --- //
    CKEDITOR.replace( 'editor' );
    CKEDITOR.config.readOnly = true;
    CKEDITOR.on('instanceReady', function(ev) {
        var height = $( document ).height() -450;
        $('.cke_contents').css('height',height+'px');
    });

    setSideMenu();
});

function setSideMenu() {
    setTimeout(function(){
        $('#sidebar_menu_product').attr("class","accordion-toggle active");
        $('#sidebar_menu_product').attr("aria-expanded","true");
        $('#sidebar_menu_product').css({'color':'lightblue'});
        $('#sidebar_menu_product').css({'font-weight':'900'});

        $('#product-elements-collapse').attr("class","panel-collapse collapse in");
        $('#product-elements-collapse').attr("aria-expanded","true");

        $('#sidebar_menu_product_jira_list').addClass("active");
        $('#sidebar_menu_product_jira_list').css({'color':'lightblue'});
        $('#sidebar_menu_product_jira_list').css({'font-weight':'900'});
    },1000);
}