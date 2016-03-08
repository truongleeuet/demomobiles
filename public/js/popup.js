/**
 * Created by Admin on 3/8/2016.
 */
/***************************/
//@Author: Adrian "yEnS" Mato Gondelle
//@website: www.yensdesign.com
//@email: yensamg@gmail.com
//@license: Feel free to use it, but keep this credits please!
/***************************/

//SETTING UP OUR POPUP
//0 means disabled; 1 means enabled;
var toannhPopupStatus = 0;
var devPopupStatus = 0;
var casePopup = 0;
/*
 * popup 1
 */

//loading popup with jQuery magic!
function toannhPopup(){
    //loads popup only if it is disabled
    if(toannhPopupStatus==0){
        centerToannhPopup();
        $("#toannhPopupBackground").css({
            "opacity": "0.7","filter":"alpha(opacity=70)"
        });
        $("#toannhPopupBackground").fadeIn("fast");
        $("#toannhPopup").fadeIn("slow");
        toannhPopupStatus = 1;
        $('div.pu-box').pngFix( );
    }
}

//disabling popup with jQuery magic!
function disableToannhPopup(){
    //disables popup only if it is enabled
    if(toannhPopupStatus==1){
        $("#toannhPopupBackground").fadeOut();
        $("#toannhPopupBackground").hide();
        $("#toannhPopup").fadeOut();
        $("#toannhPopup").hide();
        toannhPopupStatus = 0;
        try {
            $('#fade').fadeOut();
        }
        catch (e){return true;}
    }
}

//centering popup
function centerToannhPopup(){
    //request data for centering
    var windowWidth = document.documentElement.clientWidth;
    var windowHeight = document.documentElement.clientHeight;
    var bodywidth = $('body').innerWidth();
    var bodyheight = $('body').innerHeight();
    var popupHeight = $("#toannhPopup").height();
    var popupWidth = $("#toannhPopup").width();

    var wpos = (bodywidth > windowWidth) ? bodywidth : windowWidth;
    var hpos = (bodyheight > windowHeight) ? bodyheight : windowHeight;
    var scrollWindow = $(window).scrollTop();
    var top = windowHeight/2-((popupHeight/3)*2) + scrollWindow;
    var left = windowWidth/2-popupWidth/2;

    $("#toannhPopupBackground").css({
        "height": hpos,
        "width" : wpos
    });

    //centering
    $("#toannhPopup").css({
        "position": "absolute",
        "top": top,
        "left": left
    });
    //only need force for IE6

    $(window).scroll(function(){
        if($('#toannhPopup').css('display') != 'none')
        {
            $('#toannhPopup').stop();
            var scroll = $(window).scrollTop();
            var scrollPos = windowHeight/2-((popupHeight/3)*2) + scroll;
            $('#toannhPopup').animate({top: scrollPos},'slow');
        }
    });
}

/*
 * popup 2
 */

//loading popup with jQuery magic!
function devPopup(){
    //loads popup only if it is disabled
    if(devPopupStatus==0){
        centerdevPopup();
        $("#devPopupBackground").css({
            "opacity": "0.7","filter":"alpha(opacity=70)"
        });
        $("#devPopupBackground").fadeIn("fast");
        $("#devPopup").fadeIn("slow");
        devPopupStatus = 1;
        $('div.pu-box').pngFix( );
    }
}

//disabling popup with jQuery magic!
function disabledevPopup(){
    //disables popup only if it is enabled
    if(devPopupStatus==1){
        $("#devPopupBackground").fadeOut();
        $("#devPopupBackground").hide();
        $("#devPopup").fadeOut();
        $("#devPopup").hide();
        devPopupStatus = 0;
        try {
            $('#fade').fadeOut(3000);
        }
        catch (e){return true;}
    }
}

function editBannerPopup(){
    //loads popup only if it is disabled
    if(devPopupStatus==0){
        centerdevPopup();
        $("#devPopupBackground").css({
            "opacity": "0.7","filter":"alpha(opacity=70)"
        });
        $("#devPopupBackground").fadeIn("fast");
        $("#devPopup").fadeIn("slow");
        devPopupStatus = 1;
        $('div.pu-box').pngFix( );
        $('#devPopup').css('top', '25px');
    }
}

//centering popup
function centerdevPopup(){
    //request data for centering
    var windowWidth = document.documentElement.clientWidth;
    var windowHeight = document.documentElement.clientHeight;
    var bodywidth = $('body').innerWidth();
    var bodyheight = $('body').innerHeight();
    var popupHeight = $("#devPopup").height();
    var popupWidth = $("#devPopup").width();

    var wpos = (bodywidth > windowWidth) ? bodywidth : windowWidth;
    var hpos = (bodyheight > windowHeight) ? bodyheight : windowHeight;
    var scrollWindow = $(window).scrollTop();
    var top = windowHeight/2-((popupHeight/3)*2) + scrollWindow;
    var left = windowWidth/2-popupWidth/2;

    $("#devPopupBackground").css({
        "height": hpos,
        "width" : wpos
    });

    //centering
    $("#devPopup").css({
        "position": "absolute",
        "top": top,
        "left": left
    });
    //only need force for IE6

    $(window).scroll(function(){
        if($('#devPopup').css('display') != 'none')
        {
            /*$('#devPopup').stop();
             var scroll = $(window).scrollTop();
             var scrollPos = windowHeight/2-((popupHeight/3)*2) + scroll;
             $('#devPopup').animate({top: scrollPos},'slow');
             $("#devPopup").css({
             "opacity": "1","filter":"alpha(opacity=1)"
             });*/
        }
    });
}