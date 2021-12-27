$(function () {
    authUserCheck();
    includeLayout();

    /*맨위로 아이콘*/
    $( '#topicon' ).click( function() {
        $('html, body').animate({scrollTop:0},400);
        return false;
    });

});

function authUserCheck(){
    $.ajax({
        url : "/auth-check" + "/identity",
        type : "GET",
        timeout : 7313,
        global : false,
        statusCode: {
            200 : function(n) {
                console.log(n);
            },
            401 : function(n) {
                location.href="/sso/login";
            }
        }
    });
}

function includeLayout() {
    var includeArea = $('[data-include]');
    var self, url;
    $.each(includeArea, function () {
        self = $(this);
        url = self.data("include");
        self.load(url, function () {
            self.removeAttr("data-include");
        });
    });
}

function resetToDefaults() {
    topbar.config({
        autoRun      : true,
        barThickness : 3,
        barColors    : {
            '0'      : 'rgba(26,  188, 156, .9)',
            '.25'    : 'rgba(52,  152, 219, .9)',
            '.50'    : 'rgba(241, 196, 15,  .9)',
            '.75'    : 'rgba(230, 126, 34,  .9)',
            '1.0'    : 'rgba(211, 84,  0,   .9)'
        },
        shadowBlur   : 10,
        shadowColor  : 'rgba(0,   0,   0,   .6)'
    })
}

// Page load
resetToDefaults();
topbar.show();
setTimeout(function() {
    $('.container').fadeIn('slow')
    topbar.hide()
}, 1500);