$(function () {
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

        $('#sidebar_menu_product_hierarchy').addClass("active");
        $('#sidebar_menu_product_hierarchy').css({'color':'lightblue'});
        $('#sidebar_menu_product_hierarchy').css({'font-weight':'900'});
    },1000);
}