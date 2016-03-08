/**
 * Created by Admin on 3/8/2016.
 */
//svn 1
function suggestAd(url, inputId, eid, titleLimit)
{
    var desUrl = $.trim($(inputId).val());
    if(desUrl == '')
    {
        step1ErrorDesUrl(true);
        $(inputId).focus();
        return;
    }
    else
    {
        step1ErrorDesUrl(false);
    }

    if(isUrl(desUrl) || androidMarketUrlValid(desUrl))
    {
        step1ErrorDesUrl(false);
        var onSuccess = function(data)
        {
            $(eid).html(data);
            var title = $.trim($('#step1_suggest_title').html());

            if(title != home_lang['example_ad_title'])
            {
                $('#title').val(htmlspecialchars_decode(title, 'ENT_QUOTES'));
                $('#errorTitle').hide();
                step1ErrorTitle(false);
                updateCountLimit('t', titleLimit);
            }
            else
            {
                var currTitle = $.trim($('#title').val());
                if( currTitle == '')
                {
                    step1ErrorTitle(true);
                }
                else
                {
                    $('#step1_suggest_title').html(currTitle);
                }
            }
            updateStep1Review();
            $('#imgSugLoading').css('display','none');
            setStyleClear('t');
            setStyleClear('b');
        };
        var currImage = $.trim($('#step1_suggest_image').attr('src'));
        getAjax(url, 'url=' + UrlEncode.encode(desUrl) + '&img=' + UrlEncode.encode(currImage), '', '', '', false, onSuccess);
        $('#imgSugLoading').css('display','');
    }
    else
    {
        step1ErrorDesUrl(true);
        $(inputId).focus();
        return;
    }
}

//Edit the counter/limiter value as your wish
function setp1_limiter(countLimit, styleMax, eIdCheck, eIdStore, eIdCount, eIdShow, strDefault, errEId, e){

    var isShow = (typeof(eIdShow) === 'undefined' || eIdShow === '') ? false : true;
    var errEId = (typeof(errEId) === 'undefined' || errEId === '') ? '' : errEId;
    var chk = true;
    var hasEvt = false;
    var type = eIdCheck == '#title' ? 't' : (eIdCheck == '#brand-name' ? 'br' : (eIdCheck == '#brand-intro' ? 'bi' : 'b'));

    var starbox = $("#chkstarBox").attr('checked') == true ? 1:0;
    var typead = $.trim($('#typead').val());
    var tmp = $(eIdCheck).val();

    // detect typing encode
    try
    {
        if(detectEnc(tmp) > 1)
        {
            tmp = convert2Unicode(tmp);
            $(eIdCheck).val(tmp);
        }
    }
    catch(err)
    {
        //Handle errors here
    }

    if(eIdCheck == '#txtbutton'){
        type = 'bt';
    }
    else if(eIdCheck == '#txtbtnote')
    {
        type = 'bt-note';
    }
    if(type == 'br' && (typead==2 || typead==9))
    {
        var srcLogo = $('img[alt="filelogo"]').attr('src');
        var lensrcLogo = (srcLogo != null) ? srcLogo.length : 0;
        var chkLogo = lensrcLogo > 0 ? true:false;
        var fLogo = $.trim($('#hddlogoFileName').val());
        errEId = (fLogo=='') ? '':errEId;
        $('.inl_brandname').css("left", chkLogo ? "123px":"99px");
    }

    if(typeof(e) == 'object')
    {
        hasEvt = true;
        var keyCode = (e.keyCode ? e.keyCode : e.which);
        if(!(keyCode == 8 || keyCode == 32 || (keyCode >= 41 && keyCode <= 127)))
        {
            chk = false;
        }
        else
        {
            //setStyleClearAll(type);
        }

    }

    if(chk)
    {
        var tex = $(eIdCheck).val();
        if(!hasEvt)
        {
            if(Encoder.hasEncoded(tex))
            {
                tex = Encoder.htmlDecode(tex);
            }
            if(chkHtmlTags(tex))
            {
                tex = stripHtmlTags(tex);
                $(eIdCheck).val(tex);
            }
        }

        var len = tex.length;
        if(type=='b')
        {
            countLimit = starbox ? 45 : countLimit;
        }

        if(len > countLimit){

            tex = tex.substring(0,countLimit);
            $(eIdCheck).val(tex);
            $(eIdStore).val(tex);
            $(eIdCount).html(countLimit - tex.length);
            if(type == 't')
            {
                $('#step1_suggest_title_160').html(tex);
                $('#review_title').html(tex);
                $('#review_adname').html(tex);
            }
            else if(type == 'b')
            {
                $('#step1_suggest_body').html(tex);
                $('#review_bodytext').html(tex);
            }
            else if(type == 'bt')
            {
                $('#button_name').html(tex);
                $('#review_button_name').html(tex);
                $('#review_buy').html(tex);
            }
            else if(type == 'bt-note')
            {
                $('#btn-note').html(tex);
                $('#btn-note-review').html(tex);
            }
            else if(type == 'br')
            {
                $('#step1_suggest_brand_name').html(tex);
                $('#review_suggest_brand_name').html(tex);
                $('.brand-fnew').html(tex);
            }
            else if(type == 'bi')
            {
                $('#step1_suggest_brand_intro').html(tex);
                $('#review_suggest_brand_intro').html(tex);
            }
            if(isShow)
            {
                $(eIdShow).html(tex);
            }
            //return false;
        }
        else
        {
            $(eIdCount).html(countLimit-len);
            $(eIdStore).val(tex);
            if(type == 't')
            {
                $('#review_adname').html(tex);
                $('#step1_suggest_title_160').html(tex);
                $('#review_title').html(tex);
                $('#review_suggest_title_fnew').html(tex);
            }
            else if(type == 'b')
            {
                $('#step1_suggest_body').html(tex);
                $('#review_bodytext').html(tex);
                $('#review_suggest_body_fnew').html(tex);
            }
            else if(type == 'bt')
            {
                if(tex!=''){
                    $('#review_buy').show();
                    $('#review_buy').html(tex);
                    $('#button_name').html(tex);
                    $('#review_button_name').html(tex);
                }
                else{
                    $('#button_name').html('');
                    $('#review_button_name').html('');
                    $('#review_buy').hide();
                }
                var h = (typeof($('#txtbtnote').val()) === 'undefined' || $('#txtbtnote').val() === '') ? 0 : $('#txtbtnote').val();
                if(h.length==0)
                {
                    $('.sponsor-btn-note').hide();
                    $('.sponsor-btn-content').addClass('sponsor-btn-name-not-note');
                }
                else
                {
                    $('.sponsor-btn-note').show();
                    $('.sponsor-btn-content').removeClass('sponsor-btn-name-not-note');
                }

            }
            else if(type == 'bt-note')
            {
                if(tex!=''){
                    $('.sponsor-btn-content').removeClass('sponsor-btn-name-not-note');
                    $('#btn-note-review').html(tex);
                    $('#sponsor-btn-note').show();
                    $('#sponsor-btn-note-review').show();
                }
                else{
                    $('.sponsor-btn-content').addClass('sponsor-btn-name-not-note');
                    $('#sponsor-btn-note').hide();
                    $('#sponsor-btn-note-review').hide();
                }
            }
            else if(type == 'br')
            {
                $('#step1_suggest_brand_name').html(tex);
                $('#review_suggest_brand_name').html(tex);
                $('#review_suggest_brand_name_fnew').html(tex);
            }
            else if(type == 'bi')
            {
                $('#step1_suggest_brand_intro').html(tex);
                $('#review_suggest_brand_intro').html(tex);
            }
            if(isShow)
            {
                if(tex == '')
                {
                    $(eIdShow).html(strDefault);
                    $(eIdShow + '_160').html(strDefault);
                }
                else
                {
                    $(eIdShow).html(tex);
                    $(eIdShow + '_160').html(tex);
                }
            }

            if(errEId != '')
            {
                if($.trim(tex) == '')
                {
                    $(eIdCheck).addClass('error-border');
                    $(errEId).show();
                }
                else
                {
                    $(eIdCheck).removeClass('error-border');
                    $(errEId).hide();
                }
            }
        }
    }
}

function chkMaxWord(str, numMax)
{
    var arr = str.split(' ');
    var num = arr.length;
    for(var i=0; i<num; i++)
    {
        arr[i] = $.trim(arr[i]);
        if(arr[i].length > numMax)
        {
            return false;
        }
    }
    return true;
}

function move2Step(stepId, time)
{
    time = (typeof(time) == 'undefined' || time == '') ? 1000 : time;
    $('html,body').animate({scrollTop: $(stepId).position().top}, time);
}
function moveToDivStep1()
{
    $('#chooseType').fadeOut("slow");
    updateLocationReview();
    updateOsReview();
    updateManuReview();
    $('#divStep1').fadeIn("slow");
    move2Step('#divStep1', 100);
}

function step1ErrorHtmlCode(isShow)
{
    if(isShow)
    {
        $('#htmlcode').addClass('error-border');
        $('#errorHtmlCode').show();
    }
    else
    {
        $('#htmlcode').removeClass('error-border');
        $('#errorHtmlCode').hide();
    }
}

function step1ErrorTrkView(isShow)
{
    if(isShow)
    {
        $('#trackurl').addClass('error-border');
        $('#errorTrackViewUrl').show();
    }
    else
    {
        $('#trackurl').removeClass('error-border');
        $('#errorTrackViewUrl').hide();
    }
}

function step1ErrorScript(isShow)
{
    if(isShow)
    {
        $('#mscript').addClass('error-border');
        $('#errorInputScript').show();
    }
    else
    {
        $('#mscript').removeClass('error-border');
        $('#errorInputScript').hide();
    }
}

function step1ErrorTitle(isShow)
{
    if(isShow)
    {
        $('#title').addClass('error-border');
        $('#errorTitle').show();
    }
    else
    {
        $('#title').removeClass('error-border');
        $('#errorTitle').hide();
    }
}

function step1ErrorDesUrl(isShow)
{
    if(isShow)
    {
        $('#desUrl').addClass('error-border');
        $('#errorDesUrl').show();
    }
    else
    {
        $('#desUrl').removeClass('error-border');
        $('#errorDesUrl').hide();
    }
}

function step1ErrorVideo(isShow)
{
    if(isShow)
    {
        $('#errorStep1Video').show();
    }
    else
    {
        $('#errorStep1Video').hide();
    }
}

function step1ErrorImage(isShow)
{
    if(isShow)
    {
        $('#errorStep1Image').show();
    }
    else
    {
        $('#errorStep1Image').hide();
    }
}

function step1ErrorImage_2(isShow)
{
    if(isShow)
    {
        $('#errorStep1Image_2').show();
    }
    else
    {
        $('#errorStep1Image_2').hide();
    }
}


function step1ErrorLogo(isShow)
{
    if(isShow)
    {
        $('#errorStep1Logo').show();
    }
    else
    {
        $('#errorStep1Logo').hide();
    }
}

function step1ErrorButton(isShow)
{
    if(isShow)
    {
        $('#errorButton').show();
    }
    else
    {
        $('#errorButton').hide();
    }
}

function step1ErrorBrand(isShow)
{
    if(isShow)
    {
        $('#errorStep1Brand').show();
    }
    else
    {
        $('#errorStep1Brand').hide();
    }
}

function step1_continue_click()
{
    var typead = $.trim($('#typead').val());
    var desUrl = $.trim($('#desUrl').val());
    var chkUrl = true;
    if(!(isUrl(desUrl) || androidMarketUrlValid(desUrl)) || desUrl == '')
    {
        step1ErrorDesUrl(true);
        chkUrl = false;
    }
    else
    {
        step1ErrorDesUrl(false);
        chkUrl = true;
    }

    var title = $.trim($('#title').val());
    var chkTitle = true;
    if(title == '')
    {
        step1ErrorTitle(true);
        chkTitle = false;
    }
    else
    {
        step1ErrorTitle(false);
        chkTitle = true;
    }

    var bodyText = $.trim($('#step1BodyText').val());
    var chkBtext = true;
    if(bodyText == '')
    {
        step1ErrorBodyText(true);
        chkBtext = false;
    }
    else
    {
        step1ErrorBodyText(false);
        chkBtext = true;
    }
    chkbtnText = true;
    if(typead==5 || typead==8)
    {
        var btnText = $.trim($('#txtbutton').val());
        var chkbtnText = true;
        if(btnText == '')
        {
            step1btnText(true);
            chkbtnText = false;
        }
        else
        {
            step1btnText(false);
            chkbtnText = true;
        }
    }
    else
    {
        var btnText = $.trim($('#txtbutton').val());
        if(btnText == '')
        {
            $('#review_buy').hide();
        }
    }

    chkBrLogo = true;
    if(typead==9 || typead==13 || typead==8 || typead==5)
    {
        var brName = $.trim($('#hddbrandname').val());
        var fLogo = $.trim($('#hddlogoFileName').val());
        var chkbt = false;
        if(typead==13 || typead==5 || typead==8)
        {
            var txtbt = $.trim($('#txtbutton').val());
            chkbt = txtbt=='' ? true:false;
            chkBr = (brName=='') ? true : false;
            chkLogo = (fLogo=='') ? true : false;
            chkBrLogo = (brName=='' || fLogo=='') ? false : true;
            step1ErrorBrand(chkBr);
            step1ErrorLogo(chkLogo);
            step1ErrorButton(chkbt);
        }
        else
        {
            chkbt = false;
            chkBrLogo = ((brName!='' && fLogo=='') || (brName=='' && fLogo!='')) ? false : true;
            if(!chkBrLogo)
            {
                var chkBr = (brName == '' && fLogo != '') ? true : false;
                var chkLg = (fLogo == '' && brName != '') ? true : false;
                step1ErrorBrand(chkBr);
                step1ErrorLogo(chkLg);
            }
            else
            {
                step1ErrorBrand(false);
                step1ErrorLogo(false);
            }
        }
    }

    var bodyText = $.trim($('#step1BodyText').val());
    var chkBtext = true;
    if(bodyText == '')
    {
        step1ErrorBodyText(true);
        chkBtext = false;
    }
    else
    {
        step1ErrorBodyText(false);
        chkBtext = true;
    }

    var imageFile = $.trim($('#hddFileName40').val());
    var imgSrc = $.trim($('#step1_suggest_image').attr('src'));
    var chkImg = true;
    if(imageFile == '' || imgSrc == '')
    {
        step1ErrorImage(true);
        chkImg = false;
    }
    else
    {
        step1ErrorImage(false);
        chkImg = true;
    }
    if(chkUrl && chkBtext && chkImg && chkTitle && chkbtnText && chkBrLogo && !chkbt)
    {
        $('#step1_continue').hide();
        updateLocationReview();
        updateOsReview();
        updateManuReview();
        $('#divStep2').show();
        showDivEstimate();
        move2Step('#divStep2', 1000);
    }
}

function validUrlVcm()
{
    var chk = false;
    var vcm = true;
    var hddUrlvcm = parseInt($('#hddUrlvcm').val());
    var UrlVcm = $.trim($('#desUrl').val());
    var RegexUrl_soha_v1=/^https?:\/\/(www\.)?sohastore\.vn/i;
    var RegexUrl_apple=/^https?:\/\/(www\.)?itunes.apple\.com/i;
    var RegexUrl_play_google=/^https?:\/\/(www\.)?play\.google\.com/i;
    var RegexUrl_mongtien=/^https?:\/\/(www\.)?mongtien\.sohagame\.vn/i;
    var RegexUrl_b52=/^https?:\/\/(www\.)?i\.download\.app4u\.vn\/9\/downloadb52/i;
    var RegexUrl_b52_v2=/^https?:\/\/(www\.)?gameb52\.com/i;
    var RegexUrl_chienbinh=/^https?:\/\/(www\.)?chienbinh\.sohagame\.vn/i;
    var RegexUrl_8x01=/^https?:\/\/(www\.)?m.8x01\.vn/i;
    if(RegexUrl_soha_v1.test(UrlVcm) || RegexUrl_apple.test(UrlVcm) || RegexUrl_play_google.test(UrlVcm) || RegexUrl_mongtien.test(UrlVcm) || RegexUrl_b52.test(UrlVcm) || RegexUrl_b52_v2.test(UrlVcm) || RegexUrl_chienbinh.test(UrlVcm) || RegexUrl_8x01.test(UrlVcm))
    {
        chk = true;
    }

    for(i=0;i<=$('.chkOs').length;i++)
    {
        if($('#chk'+i).attr('checked') && hddUrlvcm==1)
        {
            if($.trim($('#nOs'+i).val())=='Android' || $.trim($('#nOs'+i).val())=='iPhone OS / iOS')
            {
                vcm = false;
            }
        }
    }

    if(!vcm && !chk && hddUrlvcm==1)
    {
        $('#errlnkVcm').show();
        return false;
    }
    else
    {
        $('#errlnkVcm').hide();
        return true;
    }
}

function validOsUrl()
{
    var chkOs = true;
    var chkUrl_android = false;
    var chkUrl_ios = false;
    var chkOsisnot_android = false;
    var chkOsisnot_ios = false;
    var Url = $.trim($('#desUrl').val());
    var m_OsArray = new Array('Symbian', 'Other', 'Blackberry', 'J2ME');
    var typead = $.trim($('#ttypead').val());
    var RegexUrl_apple=/^https?:\/\/(www\.)?itunes.apple\.com/i;
    var RegexUrl_play_google=/^https?:\/\/(www\.)?play\.google\.com/i;
    if(RegexUrl_apple.test(Url))
    {
        chkUrl_ios = true;
    }
    else if(RegexUrl_play_google.test(Url))
    {
        chkUrl_android = true;
    }

    for(i=0;i<=$('.validOs .chkOs').length;i++)
    {
        if($('.validOs #chk'+i).attr('checked'))
        {
            var nameOs = $.trim($('#nOs'+i).val());
            if(nameOs != 'Android')
            {
                chkOsisnot_android = true;
            }
            if(nameOs != 'iPhone OS / iOS')
            {
                chkOsisnot_ios = true;
            }
        }
    }

    if(chkUrl_android && chkOsisnot_android)
    {
        // error url play.google.com, only android
        $('#errUrlOs_android').show();
        $('#errUrlOs_ios').hide();
        return false;
    }
    else if(chkUrl_ios && chkOsisnot_ios)
    {
        // error url play.google.com, only ios
        $('#errUrlOs_ios').show();
        $('#errUrlOs_android').hide();
        return false;
    }
    else
    {
        $('#errUrlOs_android').hide();
        $('#errUrlOs_ios').hide();
        return true;
    }

}

function step2_continue_click()
{

    var bac = ($('#chkBac').attr('checked')) ? '1' : '0';
    var trung = ($('#chkTrung').attr('checked')) ? '2' : '0';
    var nam = ($('#chkNam').attr('checked')) ? '3' : '0';
    var inter = ($('#chkInter').attr('checked')) ? '1' : '0';

    var chkCity = ($.trim($('#txtTargetLocationCity').val()) == '') ? false : true;
    var chkChannel = $.trim($('#hddListTargetSiteChannelId').val()) == '' ? false : true;
    var chkOs = $.trim($('#hddListOsId').val()) == '' ? false : true;
    var chkManu = $.trim($('#hddListManuId').val()) == '' ? false : true;
    var chkvalidVcm = validUrlVcm();
    var chkvalidOsUrl = validOsUrl();
    if( (bac != '0' || trung != '0' || nam != '0' || inter != '0' || chkCity) && chkChannel && chkOs && chkManu && chkvalidVcm && chkvalidOsUrl)
    {
        $('#step2_continue').hide();
        $('#divStep3').show();
        move2Step('#divStep3', 1000);
    }
    else
    {
        step2ShowLocationErr();
        step2ShowOsErr();
        step2ShowManuErr();
        step2ShowLikeErr();
        step2ShowSiteChannelError();
    }
    return;
}

function step2ShowLocationErr()
{
    var bac = ($('#chkBac').attr('checked')) ? '1' : '0';
    var trung = ($('#chkTrung').attr('checked')) ? '2' : '0';
    var nam = ($('#chkNam').attr('checked')) ? '3' : '0';
    var inter = ($('#chkInter').attr('checked')) ? '1' : '0';

    var chkCity = ($.trim($('#txtTargetLocationCity').val()) == '') ? false : true;

    if( bac == '0' && trung == '0' && nam == '0' && inter == '0' && !chkCity)
    {
        $('#errorLocation').show();
    }
    else
    {
        $('#errorLocation').hide();
    }
    return;
}

function step2ShowOsErr()
{
    var ok=0;
    for(i=0;i<=$('.chkOs').length;i++)
    {
        ok+= parseInt(($('#chk'+i).attr('checked')) ? '1' : '0');
    }
    if(ok == '0')
    {
        $('#errorOs').show();
    }else{
        $('#errorOs').hide();
    }
    validUrlVcm();
    return;
}

function step2ShowManuErr()
{
    var ok=0;
    for(i=0;i<=$('.chkManu').length+1;i++)
    {
        ok+= parseInt(($('#chkManu'+i).attr('checked')) ? '1' : '0');
    }
    if(ok == '0')
    {
        $('#errorManu').show();
    }else{
        $('#errorManu').hide();
    }
    return;
}

function step2ShowLikeErr()
{
    return;
}

function step2ShowSiteChannelError()
{

    var chkChannel = $.trim($('#hddListTargetSiteChannelId').val()) == '' ? false : true;
    if(!chkChannel)
    {
        $('#errorSiteChannel').show();
    }
    else
    {
        $('#errorSiteChannel').hide();
    }

    return;
}

// check all Carrier
function chkAllCarr(chkAll, boxId, chkClass, nameClass, divEstId,  ulEstId, liEstClass, maxEstItem, divRevId, ulRevId, liRevClass, maxRevItem, expEstId, expRevId)
{
    var val;
    if($(chkAll).attr('checked'))
    {
        $('.' + chkClass).attr('checked', 'checked');
    }
    else
    {
        $('.' + chkClass).attr('checked', false);
    }
    var chkClass_v1 =  $('.' + chkClass);
    for(i=0;i<=chkClass_v1.length;i++)
    {
        val = parseInt($(chkClass_v1[i]).val());
        chkCarr('#'+chkClass+'_'+val, boxId, chkClass, nameClass, divEstId,  ulEstId, liEstClass, maxEstItem, divRevId, ulRevId, liRevClass, maxRevItem, expEstId, expRevId);
    }
    $('#hddListCarrierId').val('');
}

function chkCarr(chkId, boxId, chkClass, nameClass, divEstId,  ulEstId, liEstClass, maxEstItem, divRevId, ulRevId, liRevClass, maxRevItem, expEstId, expRevId)
{
    var chkClass_v1 =  $('.' + chkClass);
    var chkCa = true;
    var strCurrId = $.trim($('#hddListCarrierId').val());
    var arrCurr= new Array();
    var val;
    for(i=0;i<=chkClass_v1.length;i++)
    {
        val = parseInt($(chkClass_v1[i]).val());
        if($('#chkCarr_' + val).attr('checked')==false)
        {
            chkCa = false;
        }
        else
        {
            id = $('#chkCarr_' + val).val();
            if(!isNaN(id))
            {
                arrCurr.push(id);
            }
        }
    }

    $('#hddListCarrierId').val(arrCurr.join());
    if(chkCa)
    {
        $('#chkCarrAll').attr('checked', 'checked');
        $('#hddListCarrierId').val('');
    }
    else
    {
        $('#chkCarrAll').attr('checked', false);
    }

    updateTrgReview(boxId, chkClass, nameClass, divEstId,  ulEstId, liEstClass, maxEstItem, divRevId, ulRevId, liRevClass, maxRevItem, expEstId, expRevId);
    updateEstimate();
}

function chkAllCarrier(chkAllCarrier, classCarrier)
{
    $(chkAllCarrier).attr('checked', 'checked');
    $(classCarrier).attr('checked', 'checked');
}

function chkAllGenderHobby(chkAllGender, chkMale, chkFemale, chkAllAge, chkAgeClass)
{
    $(chkAllGender).attr('checked', 'checked');
    $(chkMale).attr('checked', 'checked');
    $(chkFemale).attr('checked', 'checked');
    $(chkAllAge).attr('checked', 'checked');
    $(chkAgeClass).attr('checked', 'checked');
}

// for gender + hobby
function chkAllGender(chkAll, chkMale, maleName, chkFemale, femaleName, estId, estContentId, revId, revContentId, isUpdateEst)
{
    var isUpdateEst = (typeof(isUpdateEst) === 'undefined' || isUpdateEst === '') ? true : isUpdateEst;
    if($(chkAll).attr('checked'))
    {
        $(chkMale).attr('checked', 'checked');
        $(chkFemale).attr('checked', 'checked');
    }
    else
    {
        $(chkMale).attr('checked', false);
        $(chkFemale).attr('checked', false);
    }
    chkGender(chkAll, chkMale, maleName, chkFemale, femaleName, estId, estContentId, revId, revContentId, isUpdateEst);
}
function chkGender(chkAll, chkMale, maleName, chkFemale, femaleName, estId, estContentId, revId, revContentId, isUpdateEst)
{
    var isUpdateEst = (typeof(isUpdateEst) === 'undefined' || isUpdateEst === '') ? true : isUpdateEst;
    var m = $(chkMale).attr('checked');
    var mname = $.trim($(maleName).html());
    var f = $(chkFemale).attr('checked');
    var fname = $.trim($(femaleName).html());
    if(m || f)
    {
        if(m && f)
        {
            $(chkAll).attr('checked', 'checked');
        }
        else
        {
            $(chkAll).attr('checked', false);
        }
        var strEst = '';
        var strReview = '';
        if(m)
        {
            strReview += '<li class="liGenRev">' + mname + '</li>';
            strEst += '<li class="liGenEst">' + mname + '</li>';
        }

        if(f)
        {
            strReview += '<li class="liGenRev">' + fname + '</li>';
            strEst += '<li class="liGenEst">' + fname + '</li>';
        }

        $(estContentId).html(strEst);
        $(revContentId).html(strReview);
        $(estId).show();
        $(revId).show();
    }
    else
    {
        $(estId).hide();
        $(revId).hide();
    }
    if(isUpdateEst)
    {
        updateEstimate();
    }
}
// check age
function chkAllAge(chkAll, boxId, chkClass, nameClass, divEstId,  ulEstId, liEstClass, maxEstItem, divRevId, ulRevId, liRevClass, maxRevItem, expEstId, expRevId)
{
    var val;
    if($(chkAll).attr('checked'))
    {
        $('.' + chkClass).attr('checked', 'checked');
    }
    else
    {
        $('.' + chkClass).attr('checked', false);
    }
    var chkClass_v1 =  $('.' + chkClass);
    for(i=0;i<=chkClass_v1.length;i++)
    {
        val = parseInt($(chkClass_v1[i]).val());
        chkAge('#'+chkClass+'_'+val, boxId, chkClass, nameClass, divEstId,  ulEstId, liEstClass, maxEstItem, divRevId, ulRevId, liRevClass, maxRevItem, expEstId, expRevId);
    }
    $('#hddAge').val('');
}

function chkAge(chkId, boxId, chkClass, nameClass, divEstId,  ulEstId, liEstClass, maxEstItem, divRevId, ulRevId, liRevClass, maxRevItem, expEstId, expRevId)
{
    var val;
    var chkA = true;
    var strCurrId = $.trim($('#hddAge').val());
    var arrCurr= new Array();
    var chkClass_v1 =  $('.' + chkClass);
    for(i=0;i<=chkClass_v1.length;i++)
    {
        val = parseInt($(chkClass_v1[i]).val());
        if($('#chkAge_' + val).attr('checked')==false)
        {
            chkA = false;
        }
        else
        {
            id = $('#chkAge_' + val).val();
            if(!isNaN(id))
            {
                arrCurr.push(id);
            }
        }
    }

    $('#hddAge').val(arrCurr.join());
    if(chkA)
    {
        $('#chkAgeAll').attr('checked', 'checked');
        $('#hddAge').val('');
    }
    else
    {
        $('#chkAgeAll').attr('checked', false);
    }

    updateTrgReview(boxId, chkClass, nameClass, divEstId,  ulEstId, liEstClass, maxEstItem, divRevId, ulRevId, liRevClass, maxRevItem, expEstId, expRevId);
    updateEstimate();
}

function chkHobby(chkId, boxId, chkClass, nameClass, divEstId,  ulEstId, liEstClass, maxEstItem, divRevId, ulRevId, liRevClass, maxRevItem, expEstId, expRevId)
{
    var strCurrId = $.trim($('#hddHobby').val());
    var arrCurr= new Array();
    if(strCurrId != '')
    {
        arrCurr = strCurrId.split(',');
    }
    var id = $(chkId).val();

    if($(chkId).attr('checked'))
    {
        if(jQuery.inArray(id,arrCurr) == -1)
        {
            arrCurr.push(id);
        }
        $('#hddHobby').val(arrCurr.join(','));
    }
    else
    {
        var index = jQuery.inArray(id,arrCurr);
        if( index > -1)
        {
            arrCurr.splice(index,1);
        }
        $('#hddHobby').val(arrCurr.join(','));
    }
    updateTrgReview(boxId, chkClass, nameClass, divEstId,  ulEstId, liEstClass, maxEstItem, divRevId, ulRevId, liRevClass, maxRevItem, expEstId, expRevId);
    updateEstimate();
}
function updateTrgReview(boxId, chkClass, nameClass, divEstId,  ulEstId, liEstClass, maxEstItem, divRevId, ulRevId, liRevClass, maxRevItem, expEstId, expRevId)
{
    var arrChk = $(boxId + ' .' + chkClass);
    var arrName = $(boxId + ' .' + nameClass);
    var num = arrChk.length;
    var strRev = '';
    var strEst = '';
    var numSiteCheck = 0;
    for(var i=0; i < num; i++)
    {
        if($(arrChk[i]).attr('checked'))
        {
            var name = $.trim($(arrName[i]).html());
            var styleEst = (numSiteCheck < maxEstItem) ? '' : 'display:none;';
            var styleRev = (numSiteCheck < maxRevItem) ? '' : 'display:none;';
            strRev += '<li class="' + liRevClass + '" style="' + styleRev + '">' + name + '</li>';
            strEst += '<li class="' + liEstClass + '" style="' + styleEst + '">' + name + '</li>';
            numSiteCheck++;
        }
    }

    if(numSiteCheck > maxEstItem)
    {
        strEst += '<li class="expand" id="'+expEstId+'" onclick="trgExpand(\'#'+expEstId+'\', \'' + ulEstId + '\', \'' + liEstClass + '\', ' + maxEstItem + ');" >' + home_lang['expand'] + '</li>';
    }
    if(numSiteCheck > maxRevItem)
    {
        strRev += '<li class="expand" id="'+expRevId+'" onclick="trgExpand(\'#'+expRevId+'\', \'' + ulRevId + '\', \'' + liRevClass + '\', ' + maxRevItem + ');" >'+ home_lang['expand'] +'</li>';
    }
    if(ulRevId != '')
    {
        $(ulRevId).html(strRev);
    }
    if(ulEstId != '')
    {
        $(ulEstId).html(strEst);
    }

    if(numSiteCheck > 0)
    {
        if(divRevId != '')
        {
            $(divRevId).css('display', '');
        }
        if(divEstId != '')
        {
            $(divEstId).css('display', '');
        }
    }
    else
    {
        if(divRevId != '')
        {
            $(divRevId).css('display', 'none');
        }
        if(divEstId != '')
        {
            $(divEstId).css('display', 'none');
        }
    }
}
// end for gender + hobby

function trgExpand(iconId, ulId, liClass, maxItem)
{
    if($(iconId).hasClass('expand'))
    {
        var arr = $(ulId + ' li.' +liClass);
        var num = arr.length;
        if(num > maxItem)
        {
            for(var i = maxItem; i < num; i++)
            {
                $(arr[i]).show();
            }
        }
        $(iconId).html(home_lang['collapse']);
        $(iconId).removeClass('expand');
        $(iconId).addClass('collaspe');
    }
    else if($(iconId).hasClass('collaspe'))
    {
        var arr = $(ulId + ' li.' +liClass);
        var num = arr.length;
        if(num > maxItem)
        {
            for(var i = maxItem; i < num; i++)
            {
                $(arr[i]).hide();
            }
        }
        $(iconId).html(home_lang['expand']);
        $(iconId).removeClass('collaspe');
        $(iconId).addClass('expand');
    }
    scrollEstimateBox();
}

function step3_showDivCampOption(opt)
{
    if(opt == 'create')
    {
        $('#endDate').val($('#campEndDate').val());
        $('#startDate').val($('#campStartDate').val());
        $('#divChooseCamp').hide();
        $('#divCreateCamp').show();
        $('#hddCampType').val('create');

        var price = $.trim($('#admoney').val());
        var campBudget = $('#txtCampBudget').val();
        $('#lastBugdet').val($('#allBugdet').val());
        $('#allBugdet').val($('#txtCampBudget').val());
        campBudget = campBudget.replace(/,/gi,'');
        campBudget = parseFloat(campBudget);

        var strapp_click = 0;
        var btypay = $('input[name=typepay]:checked').val();
        if(btypay==1)
        {
            strapp_click = addCommas(Math.round(campBudget/(parseInt(price) + (parseInt(price)*0.1))));
            $('#approximate_click').html(strapp_click + ' click');
            $('#camMoney').html(strapp_click + ' click  ');
        }
        else
        {
            strapp_click = addCommas(Math.round((campBudget/(parseInt(price) + (parseInt(price)*0.1)))*1000));
            $('#approximate_click').html(strapp_click + ' impressions');
            $('#camMoney').html(strapp_click + ' impressions  ');
        }

        updateCreateCampainReview();
    }
    else if(opt == 'choose')
    {
        $('#divChooseCamp').show();
        $('#divCreateCamp').hide();
        $('#hddCampType').val('choose');
        $('#txtCampName').html('');

        var price = $.trim($('#admoney').val());
        var campBudget = $('#allBugdet').val();

        $('#allBugdet').val($('#lastBugdet').val());

        campBudget = campBudget.replace(/,/gi,'');
        campBudget = parseFloat(campBudget);

        var strapp_click = 0;
        var btypay = $('input[name=typepay]:checked').val();
        if(btypay==1)
        {
            strapp_click = addCommas(Math.round(campBudget/(parseInt(price) + (parseInt(price)*0.1))));
            $('#approximate_click').html(strapp_click + ' click');
            $('#camMoney').html(strapp_click + ' click  ');
        }
        else
        {
            strapp_click = addCommas(Math.round((campBudget/(parseInt(price) + (parseInt(price)*0.1)))*1000));
            $('#approximate_click').html(strapp_click + ' impressions');
            $('#camMoney').html(strapp_click + ' impressions  ');
        }

        var campid = $('#step3SlcChooseCamp').val();
        chooseCampChange(campid);
    }
}

function chooseCampChange(value, editValue)
{
    editValue = (typeof(editValue) == 'undefined' || editValue == '') ? '' : editValue;
    var typead = $.trim($('#ttypead').val());
    if($.trim(value) == '' || $.trim(value) == '0')
    {
        showDivChooseCampErr(true);
    }
    else
    {
        showDivChooseCampErr(false);
    }

    if(editValue == '' || editValue != value)
    {
        var onsSuccess = function(data)
        {
            $('#imgChangeCampLoading').hide();
            var objData = jQuery.parseJSON(data);
            var isperday = $.trim(objData.isperday);
            var maxValudDate = $.trim(objData.maxValueDay);
            var maxValueDayVnd1 =  $.trim(objData.maxValueDayVnd1);
            var maxValueDateVnd = $.trim(objData.maxValueDayVnd);// maxValueDayVnd
            $('#allBugdet').val(maxValudDate);
            var campBudget = $('#allBugdet').val();
            campBudget = campBudget.replace(/,/gi,'');
            campBudget = parseFloat(campBudget);
            maxValudDate += ' ' +  home_lang['vnd'] + ' ' + ( isperday == '0' ? home_lang['life_time'] : home_lang['per_day']);
            var endDate = $.trim(objData.endDate);
            var arrEndDate = endDate.split('-');
            var startDate = $.trim(objData.startDate);
            var arrStartDate = startDate.split('-');
            ;
            var isCampFromDay = $.trim(objData.isCampFromDay);
            if(isCampFromDay == '1')
            {
                var currDate = new Date();
                var currMonth = currDate.getMonth() + 1;
                var currDay = currDate.getDate();
                var currYear = currDate.getFullYear();
                currMonth = (currMonth < 10) ? '0' + currMonth : currMonth;
                var strCurrDate = currDay + '-' + currMonth + '-' + currYear;

                $('#rvcmpfromday').html(common_lang['camp_run_from_day'] + ' <b>' + strCurrDate + '</b>').show();
                $('#rvcmpduration').hide();
            }
            else
            {
                var currDate = new Date();
                var currMonth = currDate.getMonth() + 1;
                var currDay = currDate.getDate();
                var currYear = currDate.getFullYear();
                currMonth = (currMonth < 10) ? '0' + currMonth : currMonth;
                var strCurrDate = currDay + '-' + currMonth + '-' + currYear;
                var currDate = new Date(currYear + '/' + currMonth + '/' + currDay);

                var endDateObj = new Date(arrEndDate[2] + '/' + arrEndDate[1] + '/' + arrEndDate[0]);
                var startDateObj = new Date(arrStartDate[2] + '/' + arrStartDate[1] + '/' + arrStartDate[0]);

                var numCampDay = 0;
                if(startDateObj > currDate)
                {
                    $('#startDate').val(startDate);
                    numCampDay = ((endDateObj - startDateObj)/86400000) + 1;
                    $('#review_camp_start').html(startDate);
                }
                else
                {
                    $('#startDate').val(strCurrDate);
                    numCampDay = ((endDateObj - currDate)/86400000) + 1;
                    $('#review_camp_start').html(strCurrDate);
                }
                $('#rvcmpduration').show();
                $('#rvcmpfromday').html('').hide();
            }

            var price = $.trim($('#admoney').val());

            var btypay = $('#typepay').val();
            if(btypay==1)
            {
                strapp_click = addCommas(Math.round(campBudget/(parseInt(price) + (parseInt(price)*0.1))));
                $('#approximate_click').html(strapp_click + ' click');
                $('#review_daily_budget_vnd').html(strapp_click + ' click ' +  home_lang['vnd'] + ' ' + ( isperday == '0' ? home_lang['life_time'] : home_lang['per_day']));
                $('#step3_ChooseCampBudget').html(maxValudDate + ' &asymp; <span id="camMoney">' + strapp_click + ' click </span> ' + ( isperday == '0' ? home_lang['life_time'] : home_lang['per_day']));
            }
            else
            {
                strapp_view = addCommas(Math.round((campBudget/(parseInt(price) + (parseInt(price)*0.1)))*1000));
                $('#approximate_click').html(strapp_view + ' impressions');
                $('#review_daily_budget_vnd').html(strapp_view + ' impressions ' +  home_lang['vnd'] + ' ' + ( isperday == '0' ? home_lang['life_time'] : home_lang['per_day']));
                $('#step3_ChooseCampBudget').html(maxValudDate + ' &asymp; <span id="camMoney">' + strapp_view + ' impressions </span> ' + ( isperday == '0' ? home_lang['life_time'] : home_lang['per_day']));
            }
            $('#endDate').val(endDate);

            $('#review_num_camp_day').html(numCampDay);
            $('#review_camp_end').html(endDate);

            $('#hddChooseCampEndDate').val(endDate);
            $('#review_daily_budget').html(maxValudDate);
            /*if(btypay==1)
             {
             $('#review_daily_budget_vnd').html(maxValueDateVnd + ' click ' + ( isperday == '0' ? home_lang['life_time'] : home_lang['per_day']));
             }
             else
             {
             $('#review_daily_budget_vnd').html(maxValueDayVnd1 + ' impressions ' + ( isperday == '0' ? home_lang['life_time'] : home_lang['per_day']));
             }*/
            $('#review_camp_name').html($.trim($("#step3SlcChooseCamp option[value=" + $("#step3SlcChooseCamp").val() + "]").text()));
            $('#review_camp_hdcode').html(objData.contract);
            $('#contract').val(objData.contract);
            $('#phanboid').val(0);
            $('#review_camp_hd_guest').html(objData.label);

            if(objData.contract != '' || objData.label != '')
            {
                $('#tr_review_hdcode').show();
                $('#tr_review_hd_guest').show();
            }
            else
            {
                $('#tr_review_hdcode').hide();
                $('#tr_review_hd_guest').hide();
            }

            if(prehdcn==0)
            {
                var phanboid = parseInt($('#phanboid').val());
                if(phanboid==0)
                {
                    errorChoosePhanboID(true);
                    popUpContractID(0);
                    return;
                }
                else
                {
                    errorChoosePhanboID(false);
                }
            }
        };
        var onError = function()
        {
            $('#imgChangeCampLoading').hide();
        };
        $('#imgChangeCampLoading').show();
        getAjax(makeSiteUrl('home/get_campaign/') + value + '/' + typead,'', '', '','', false, onsSuccess, onError);
    }
}

function showDivCreateCampNameErr(isShow)
{
    if(isShow)
    {
        $('#txtCampName').addClass('error-border');
        $('#errorCreateCampName').show();
    }
    else
    {
        $('#txtCampName').removeClass('error-border');
        $('#errorCreateCampName').hide();
    }
}

function showDivCreateCampBudgetErr(isShow)
{
    if(isShow)
    {
        $('#txtCampBudget').addClass('error-border');
        $('#errorCreateCampBudget').show();
    }
    else
    {
        $('#txtCampBudget').removeClass('error-border');
        $('#errorCreateCampBudget').hide();
    }
}

function showDivCreateCamphCodeErr(isShow)
{
    if(isShow)
    {
        $('#txtHdCode').addClass('error-border');
        $('#errorCreateCampTxtCode').show();
        $('#CamphdInfo').hide();
    }
    else
    {
        $('#txtHdCode').removeClass('error-border');
        $('#errorCreateCampTxtCode').hide();
    }
}

function showDivCreateCampPbIDErr(isShow)
{
    if(isShow)
    {
        $('#txtHdCode').addClass('error-border');
        $('#errorCreateCampPhanboID').show();
    }
    else
    {
        $('#txtHdCode').removeClass('error-border');
        $('#errorCreateCampPhanboID').hide();
    }
}

function showDivCreateCampTimeErr(isShow)
{
    if(isShow)
    {
        $('#errorCreateCampTime').show();
    }
    else
    {
        $('#errorCreateCampTime').hide();
    }
}

function showDivChooseCampErr(isShow)
{
    if(isShow)
    {
        $('#errorChooseCampName').show();
    }
    else
    {
        $('#errorChooseCampName').hide();
    }
}

function showDivCampaignKhongPhanbo(isShow)
{
    if(isShow)
    {
        $('#errorChooseCampainPhanboID').show();
    }
    else
    {
        $('#errorChooseCampainPhanboID').hide();
    }
}

function errorChoosePhanboID(isShow)
{
    if(isShow)
    {
        $('#errorChoosePhanboID').show();
    }
    else
    {
        $('#errorChoosePhanboID').hide();
    }
}

function step3_create_camp_name_keyup()
{
    var tex = $.trim($('#txtCampName').val());
    if(tex != '')
    {
        showDivCreateCampNameErr(false);
    }
    else
    {
        showDivCreateCampNameErr(true);
    }
}

function step3_continue_click()
{
    var chooseCampType = $('#hddCampType').val();
    // check typead
    var btypay = $('input[name=typepay]:checked').val();
    if(btypay == 1)
    {
        $('#review_cpm_price').hide();
        $('#review_cpc_price').show();
    }
    else
    {
        $('#review_cpm_price').show();
        $('#review_cpc_price').hide();
    }
    // check if add new campaign
    if(chooseCampType == 'create')
    {
        var chkTime = true;
        var chkName = true;
        var chkBudget = true;
        var chkFromDay = $('#chkRunToday').attr('checked');
        if(!chkFromDay)
        {
            var arrStartDate = ($('#campStartDate').val()).split('-');
            var arrEndDate = ($('#campEndDate').val()).split('-');

            var startDate = new Date(arrStartDate[2] + '/' + arrStartDate[1] + '/' + arrStartDate[0]);
            var endDate = new Date(arrEndDate[2] + '/' + arrEndDate[1] + '/' + arrEndDate[0]);

            if(endDate < startDate)
            {
                showDivCreateCampTimeErr(true);
                chkTime = false;
            }
            else
            {
                chkTime = true;
                showDivCreateCampTimeErr(false);
            }
        }

        var campName = $.trim($('#txtCampName').val());
        if(campName == '')
        {
            showDivCreateCampNameErr(true);
            chkName = false;
        }
        else
        {
            chkName = true;
            showDivCreateCampNameErr(false);
        }

        var campBudget = $('#txtCampBudget').val();
        campBudget = campBudget.replace(/,/gi,'');
        campBudget = parseFloat(campBudget);

        var hddgroupid = parseInt($('#hddgroupid').val());

        var minbudget = 100000;
        if(hddgroupid==0){
            minbudget = 500000;
        }

        var budType = $('#slcCampBudgetType').val();

        if(budType == 'perday')
        {
            var numCampDay = ((endDate - startDate)/86400000) + 1;
            if((campBudget * numCampDay) < minbudget)
            {
                showDivCreateCampBudgetErr(true);
                chkBudget = false;
            }
            else
            {
                chkBudget = true;
                showDivCreateCampBudgetErr(false);
            }
        }
        else if(budType == 'lifetime')
        {
            if(campBudget < minbudget)
            {
                showDivCreateCampBudgetErr(true);
                chkBudget = false;
            }
            else
            {
                chkBudget = true;
                showDivCreateCampBudgetErr(false);
            }
        }

        var txtHdCode = $('#txtHdCode').val();
        var prehdcn = $('#prehdcn').val();
        var chkHCode = true;
        var phanboid = $('#phanboid').val();
        if(txtHdCode == '' && prehdcn==0)
        {
            chkHCode = false;
            showDivCreateCamphCodeErr(true);
        }
        else if(txtHdCode != '' && prehdcn==0 && (phanboid==0 || phanboid==""))
        {
            chkHCode = false;
            showDivCreateCampPbIDErr(true);
        }
        else if(prehdcn==0)
        {
            var phanboid = $('#phanboid').val();
            if(phanboid == 0 || phanboid=="")
            {
                chkHCode = false;
                showDivCreateCampPbIDErr(true);
            }
        }

        //end check if add new campaign
        if(chkBudget && chkTime && chkName && chkHCode)
        {
            build_review();
            $('#step3_continue').hide();
            $('#divStep4').show();
            move2Step('#divStep4', 1000);
        }
    }
    else
    {
        var prehdcn = $('#prehdcn').val();
        if(prehdcn==0)
        {
            var phanboid = parseInt($('#phanboid').val());
            if(phanboid==0)
            {
                errorChoosePhanboID(true);
                popUpContractID(0);
                return;
            }
            else
            {
                errorChoosePhanboID(false);
            }
        }

        build_review();
        $('#step3_continue').hide();
        $('#divStep4').show();
        move2Step('#divStep4', 1000);
    }

    return;
}

function build_review()
{
    // update ad review
    updateStep1Review();

    // update location review
    updateLocationReview();

    // update os review
    updateOsReview();

    // update manufacture review
    updateManuReview();

    // update city reivew
    updateCityReview();

    // update site review
    listSiteSort(false, false);

    // fill campaign name
    var chooseCampType = $('#hddCampType').val();
    if(chooseCampType == 'create')
    {
        $('#review_camp_name').html($.trim($('#txtCampName').val()) + ' (' + home_lang['new_campaign'] + ')');

        var arrStartDate = ($('#campStartDate').val()).split('-');
        var arrEndDate = ($('#campEndDate').val()).split('-');

        var startDate = new Date(arrStartDate[2] + '/' + arrStartDate[1] + '/' + arrStartDate[0]);
        var endDate = new Date(arrEndDate[2] + '/' + arrEndDate[1] + '/' + arrEndDate[0]);

        var campBudget = $('#txtCampBudget').val();
        campBudget = campBudget.replace(/,/gi,'');
        campBudget = parseFloat(campBudget);

        var budType = $('#slcCampBudgetType').val();

        var numCampDay = ((endDate - startDate)/86400000) + 1;

        if(budType == 'perday')
        {
            $('#review_daily_budget').html( addCommas(campBudget.toString()) + ' ' + home_lang['vnd'] + ' ' + home_lang['per_day']);
            var chkFromDay = $('#chkRunToday').attr('checked');
            if(chkFromDay)
            {
                $('#rvcmpduration').hide();
                var currTime = new Date();
                var currYear = currTime.getFullYear();
                var currMonth = currTime.getMonth();
                currMonth = parseInt(currMonth) < 10 ? '0' + (currMonth + 1) : (currMonth + 1);
                var currDay = currTime.getDate();
                $('#rvcmpfromday').html(common_lang['camp_run_from_day'] + ' <b>' + currDay + '/' + currMonth + '/' + currYear + '</b>').show();
                $('#campStartDate').val(currDay + '-' + currMonth + '-' + currYear);
                $('#campEndDate').val(currDay + '-' + currMonth + '-' + currYear);
            }
            else
            {
                $('#rvcmpduration').show();
                $('#rvcmpfromday').html('').hide();
            }
        }
        else if(budType == 'lifetime')
        {
            $('#chkRunToday').attr('disabled','disabled');
            $('#chkRunToday').attr('checked','');
            $('#tdChkFday').addClass('text-666');
            $('#campStartDate').attr('disabled','').css('background-color', '#fff');
            $('#campEndDate').attr('disabled','').css('background-color', '#fff');

            $('#review_daily_budget').html(addCommas(campBudget.toString()) + ' ' + home_lang['vnd'] + ' ' + home_lang['life_time']);

            $('#rvcmpduration').show();
            $('#rvcmpfromday').html('').hide();
        }

        //review duration
        $('#review_num_camp_day').html(numCampDay);
        $('#review_camp_start').html($('#campStartDate').val());
        $('#review_camp_end').html($('#campEndDate').val());
    }
    else
    {
        $('#review_camp_name').html($.trim($("#step3SlcChooseCamp option[value=" + $("#step3SlcChooseCamp").val() + "]").text()));
    }
}


function step4_continue(type)
{
    type = (typeof(type) === 'undefined' || type === '') ? 'create' : type;
    var b3rd = $('#b3rd').attr('checked') ? true : false;
    var typead = $.trim($('#typead').val());
    var opvideo = $('#chkVid').attr('checked') ? true : false;

    // check des url
    var desUrl = $.trim($('#desUrl').val());
    if(desUrl == '' || !(isUrl(desUrl) || androidMarketUrlValid(desUrl)))
    {
        step1ErrorDesUrl(true);
        $('#desUrl').focus();
        move2Step('#divStep1', 1000);
        return;
    }
    else
    {
        step1ErrorDesUrl(false);
    }

    var chkbtnText = true;

    if(typead==5 || typead==8)
    {
        var btnText = $.trim($('#txtbutton').val());
        var chkbtnText = true;
        if(btnText == '')
        {
            step1btnText(true);
            chkbtnText = false;
        }
        else
        {
            step1btnText(false);
            chkbtnText = true;
        }
    }

    if(!chkbtnText)
    {
        $('#txtbutton').focus();
        move2Step('#divStep1', 1000);
        return;
    }
    else
    {
        step1ErrorDesUrl(false);
    }

    // check image
    if(($.trim($('#hddFileName300').val()) == '')&&($.trim($('#hddFileName40').val()) ==''))
    {
        step1ErrorImage(true);
        move2Step('#divStep1', 1000);
        return;
    }
    else
    {
        step1ErrorImage(false);
    }

    // video
    var videoFile = $.trim($('#hddFileVideo40').val());
    var videoSrc = $.trim($('#step1_suggest_video').attr('src'));
    var chkVideo = true;
    if(opvideo)
    {
        if(videoFile == '' || videoSrc == '')
        {
            step1ErrorVideo(true);
            chkVideo = false;
        }
        else
        {
            step1ErrorVideo(false);
            chkVideo = true;
        }
    }

    // check image
    if(!chkVideo)
    {
        step1ErrorVideo(true);
        move2Step('#divStep1', 1000);
        return;
    }
    else
    {
        step1ErrorVideo(false);
    }

    var chkBrLogo = true;
    if(typead==9 || typead==13 || typead==5 || typead==8)
    {
        var brName = $.trim($('#hddbrandname').val());
        var fLogo = $.trim($('#hddlogoFileName').val());
        if(typead==13 || typead==5 || typead==8)
        {
            var txtbt = $.trim($('#txtbutton').val());
            chkbt = txtbt=='' ? true:false;
            chkBr = (brName=='') ? true : false;
            chkLogo = (fLogo=='') ? true : false;
            chkBrLogo = (brName=='' || fLogo=='') ? false : true;
            step1ErrorBrand(chkBr);
            step1ErrorLogo(chkLogo);
            step1ErrorButton(chkbt);
            if(chkBr || chkLogo || chkbt)
            {
                move2Step('#divStep1', 1000);
                return;
            }
        }
        else
        {
            chkbt = true;
            chkBrLogo = ((brName!='' && fLogo=='') || (brName=='' && fLogo!='')) ? false : true;
            if(!chkBrLogo)
            {
                var chkBr = (brName == '' && fLogo != '') ? true : false;
                var chkLg = (fLogo == '' && brName != '') ? true : false;
                step1ErrorBrand(chkBr);
                step1ErrorLogo(chkLg);
                move2Step('#divStep1', 1000);
                return;
            }
            else
            {
                step1ErrorBrand(false);
                step1ErrorLogo(false);
            }
        }
    }

    var chk3rd = true;

    if(b3rd==true)
    {
        // htmlcode banner
        var htmlcode = $('#chkAdSelf').attr('checked');
        if(htmlcode)
        {
            var htmlcode = $.trim($('#htmlcode').val());
            if(htmlcode == '')
            {
                step1ErrorHtmlCode(true);
                chk3rd = false;
            }
            else
            {
                step1ErrorHtmlCode(false);
                chk3rd = true;
            }
        }

        // tracking view only
        var trkview = $('#chkTrackUrl').attr('checked');
        if(trkview)
        {
            var strTrkview = $.trim($('#trackurl').val());
            if(strTrkview == '')
            {
                step1ErrorTrkView(true);
                chk3rd = false;
            }
            else
            {
                step1ErrorTrkView(false);
                chk3rd = true;
            }
        }

        var mscript = $('#chkScript').attr('checked');
        if(mscript)
        {
            var strScript = $.trim($('#mscript').val());
            if(strScript == '')
            {
                step1ErrorScript(true);
                chk3rd = false;
            }
            else
            {
                step1ErrorScript(false);
                chk3rd = true;
            }
        }
    }

    // check target location
    var bac = ($('#chkBac').attr('checked')) ? '1' : '0';
    var trung = ($('#chkTrung').attr('checked')) ? '2' : '0';
    var nam = ($('#chkNam').attr('checked')) ? '3' : '0';
    var inter = ($('#chkInter').attr('checked')) ? '1' : '0';

    var chkCity = $.trim($('#txtTargetLocationCity').val()) == '' ? false : true;
    if(bac == '0' && trung == '0' && nam == '0' && inter=='0' && !chkCity)
    {
        step2ShowLocationErr();
        move2Step('#divStep2', 1000);
        return;
    }
    else
    {
        step2ShowLocationErr();
    }

    // check target os
    var ok=0;
    var valid = validUrlVcm();
    var chkvalidOsUrl = validOsUrl();
    for(i=0;i<=$('.chkOs').length;i++)
    {
        ok+= parseInt(($('#chk'+i).attr('checked')) ? '1' : '0');
    }
    if(ok == '0' || !valid || !chkvalidOsUrl)
    {
        step2ShowOsErr();
        move2Step('#divStep2', 1000);
        return;
    }
    else
    {
        step2ShowOsErr();
    }

    // check site channel
    var chkSite = $.trim($('#hddListTargetSiteChannelId').val());
    if(!chkSite)
    {
        step2ShowSiteChannelError();
        move2Step('#divStep2', 1000);
        return;
    }
    else
    {
        step2ShowSiteChannelError();
        reCheckSiteChannel();
    }

    var chooseCampType = $('#hddCampType').val();
    // check if add new campaign
    if(chooseCampType == 'create')
    {
        var chkFromDay = $('#chkRunToday').attr('checked');
        if(!chkFromDay)
        {
            var arrStartDate = ($('#campStartDate').val()).split('-');
            var arrEndDate = ($('#campEndDate').val()).split('-');

            var startDate = new Date(arrStartDate[2] + '/' + arrStartDate[1] + '/' + arrStartDate[0]);
            var endDate = new Date(arrEndDate[2] + '/' + arrEndDate[1] + '/' + arrEndDate[0]);

            if(endDate < startDate)
            {
                showDivCreateCampTimeErr(true);
                $('#campEndDate').focus();
                move2Step('#divStep3', 1000);
                return;
            }
            else
            {
                showDivCreateCampTimeErr(false);
            }
        }

        var campName = $.trim($('#txtCampName').val());
        if(campName == '')
        {
            showDivCreateCampNameErr(true);
            $('#txtCampName').focus();
            move2Step('#divStep3', 1000);
            return;
        }
        else
        {
            showDivCreateCampNameErr(false);
        }

        var campBudget = $('#txtCampBudget').val();
        campBudget = campBudget.replace(/,/gi,'');
        campBudget = parseFloat(campBudget);

        var budType = $('#slcCampBudgetType').val();

        var hddgroupid = parseInt($('#hddgroupid').val());

        var minbudget = 100000;
        if(hddgroupid==0){
            minbudget = 500000;
        }

        if(budType == 'perday')
        {
            var numCampDay = ((endDate - startDate)/86400000) + 1;

            if((campBudget * numCampDay) < minbudget)
            {
                showDivCreateCampBudgetErr(true);
                $('#txtCampBudget').focus();
                move2Step('#divStep3', 1000);
                return;
            }
            else
            {
                showDivCreateCampBudgetErr(false);
            }
        }
        else if(budType == 'lifetime')
        {
            if(campBudget < minbudget)
            {
                showDivCreateCampBudgetErr(true);
                $('#txtCampBudget').focus();
                move2Step('#divStep3', 1000);
                return;
            }
            else
            {
                showDivCreateCampBudgetErr(false);
            }
        }

        var txtHdCode = $('#txtHdCode').val();
        var prehdcn = $('#prehdcn').val();
        var chkHCode = true;
        if(txtHdCode == '' && prehdcn==0)
        {
            chkHCode = false;
            showDivCreateCamphCodeErr(true);
        }
        else if(prehdcn==0)
        {
            var phanboid = $('#phanboid').val();
            if(phanboid == 0)
            {
                chkHCode = false;
                showDivCreateCampPbIDErr(true);
            }
        }

        if(chkHCode==false)
        {
            showDivCreateCampBudgetErr(true);
            showDivCreateCampPbIDErr(true);
            $('#txtCampBudget').focus();
            move2Step('#divStep3', 1000);
            return;
        }
        else
        {
            showDivCreateCampBudgetErr(false);
        }

    }
    //end check if add new campaign
    else if (chooseCampType == 'choose')
    {
        if(prehdcn==0)
        {
            var phanboid = parseInt($('#phanboid').val());
            if(phanboid==0)
            {
                move2Step('#divStep3', 1000);
                errorChoosePhanboID(true);
                popUpContractID(0);
                return;
            }
            else
            {
                errorChoosePhanboID(false);
            }
        }

        var sclCampIdChk = $.trim($('#step3SlcChooseCamp').val());
        if(sclCampIdChk == '' || !isIntNumber(sclCampIdChk) || sclCampIdChk == '0')
        {
            showDivChooseCampErr(true);
            move2Step('#divStep3', 1000);
            return;
        }
        else
        {
            showDivChooseCampErr(false);
        }
    }

    if(type =='create')
    {
        loadAjaxLoadingPopup('#imgLoadingPopup', '#ajaxLoadingPopupBackground');
        $('#frmCreateAd').submit();
    }
    else if(type=='edit')
    {
        loadAjaxLoadingPopup('#imgLoadingPopup', '#ajaxLoadingPopupBackground');
        $('#frmCreateAd').submit();
    }
}


function stepedit_continue(type)
{
    type = (typeof(type) === 'undefined' || type === '') ? 'create' : type;

    // check target location
    var bac = ($('#chkBac').attr('checked')) ? '1' : '0';
    var trung = ($('#chkTrung').attr('checked')) ? '2' : '0';
    var nam = ($('#chkNam').attr('checked')) ? '3' : '0';
    var inter = ($('#chkInter').attr('checked')) ? '1' : '0';

    var chkCity = $.trim($('#txtTargetLocationCity').val()) == '' ? false : true;
    if(bac == '0' && trung == '0' && nam == '0' && inter=='0' && !chkCity)
    {
        step2ShowLocationErr();
        return;
    }
    else
    {
        step2ShowLocationErr();
    }

    // check target os
    var ok=0;
    var valid = validUrlVcm();
    var chkvalidOsUrl = validOsUrl();
    for(i=0;i<=$('.chkOs').length;i++)
    {
        ok+= parseInt(($('#chk'+i).attr('checked')) ? '1' : '0');
    }
    if(ok == '0' || !valid || !chkvalidOsUrl)
    {
        step2ShowOsErr();
        return;
    }
    else
    {
        step2ShowOsErr();
    }

    // check site channel
    var chkSite = $.trim($('#hddListTargetSiteChannelId').val());
    if(!chkSite)
    {
        step2ShowSiteChannelError();
        return;
    }
    else
    {
        step2ShowSiteChannelError();
        reCheckSiteChannel();
    }

    loadAjaxLoadingPopup('#imgLoadingPopup', '#ajaxLoadingPopupBackground');
    $('#frmEditAd').submit();
}

function initCreateAdFormField()
{
    // step 1
    $('#desUrl').val('');
    $('#title').val('');
    $('#hddFileName').val('');

    // step 2
    $('#chkLocationAll').attr('checked','checked');
    $('#chkBac').attr('checked','checked');
    $('#chkTrung').attr('checked','checked');
    $('#chkNam').attr('checked','checked');

    $('#chkOsAll').attr('checked','checked');
    $('#chkManuAll').attr('checked','checked');
    var typead = $('#ttypead').val();
    if(typead==1)
    {
        var arrOs= $('.chkOs');
        for(var i = 0; i <arrOs.length; i++)
        {
            var valOs = $(arrOs[i]).val();
            if(valOs != '1' && valOs != '2' && valOs != '3')
            {
                $(arrOs[i]).attr('checked','checked');
            }
        }

        var arrMan= $('.chkManu');
        for(var i = 0; i <arrMan.length; i++)
        {
            var valMan = $(arrMan[i]).val();
            if(valMan != '1' && valMan != '2' && valMan != '3' && valMan != '7' && valMan != '8')
            {
                $(arrMan[i]).attr('checked','checked');
            }
        }
    }
    else if(typead==4)
    {
        var arrOs= $('.chkOs');
        for(var i = 0; i <arrOs.length; i++)
        {
            var valOs = $(arrOs[i]).val();
            if(valOs == '1' || valOs == '2' || valOs == '3')
            {
                $(arrOs[i]).attr('checked','checked');
            }
        }
        $('.chkManu').attr('checked', 'checked');
    }
    else
    {
        $('.chkOs').attr('checked', 'checked');
        $('.chkManu').attr('checked', 'checked');
    }

    $('#chkkAllSiteChannel').attr('checked','');

    // get estimate number
    updateEstimate();

    // step 3

    var hddgroupid = parseInt($('#hddgroupid').val());
    var minbudget = 300000;
    if(hddgroupid==0){
        minbudget = 500000;
    }

    $('#txtCampName').val('');
    $('#txtCampBudget').val(minbudget);
    showDivCreateCampBudgetErr(false);
    $('#slcCampBudgetType').val('perday');

    var price = parseFloat($.trim($('#admoney').val()));
    var campBudget = $('#allBugdet').val();
    if(campBudget=='0')
    {
        campBudget = $.trim($('#txtCampBudget').val());
    }
    campBudget = campBudget.replace(/,/gi,'');
    campBudget = parseFloat(campBudget);

    var strapp_click = 0;
    var btypay = $('input[name=typepay]:checked').val();
    if(btypay==1)
    {
        strapp_click = addCommas(Math.round(campBudget/(parseInt(price) + (parseInt(price)*0.1))));
        $('#approximate_click').html(strapp_click + ' click');
        $('#camMoney').html(strapp_click + ' click  ');
    }
    else
    {
        strapp_click = addCommas(Math.round((campBudget/(parseInt(price) + (parseInt(price)*0.1)))*1000));
        $('#approximate_click').html(strapp_click + ' impressions');
        $('#camMoney').html(strapp_click + ' impressions  ');
    }

    var campid = $('#step3SlcChooseCamp').val();
    campid = campid == '' ? '0' : campid;

    var moneyUnitValue = $.trim($('#hddMoneyUnitValue').val());
    moneyUnitValue = moneyUnitValue.replace(/,/gi,'');

    moneyUnitValue = parseInt(moneyUnitValue);

    if(parseInt(campid) > 0)
    {
        chooseCampChange(campid);
    }
    else
    {
        var currDate = new Date();
        var currMonth = currDate.getMonth() + 1;
        currMonth = (currMonth < 10) ? '0' + currMonth : currMonth;
        var strCurrDate = currDate.getDate() + '-' + currMonth + '-' + currDate.getFullYear();
        $('#campStartDate').val(strCurrDate);
        $('#campEndDate').val(strCurrDate);
        $('#startDate').val(strCurrDate);
        $('#endDate').val(strCurrDate);
        $('#chkRunToday').attr('checked', '');
        $('#rvcmpduration').show();
        $('#rvcmpfromday').html('').show();
    }
}

function updateStep1Review()
{
    $('#review_title').html($('#title').val());
    $('#step1_domain').html(getDomainFromUrl($('#desUrl').val()));
    $('#review_url').html( getDomainFromUrl($('#desUrl').val()));
    $('#review_image').attr('src',$('#step1_suggest_image').attr('src'));
    $('#review_bodytext').html($('#step1BodyText').val());
    $('#review_adname').html($('#title').val());
}

function updateCountLimit(opt, limit)
{
    if(opt == 't')
    {
        var numText = $('#title').val().length;
        $('#titleLimit').html(limit - numText);
    }
    else if(opt == 'b')
    {
        if($('#step1BodyText').length > 0)
        {
            var numText = $('#step1BodyText').val().length;
            $('#bodyTextLimit').html(limit - numText);
        }
    }
    else if(opt == 'bt')
    {
        if($('#txtbutton').length > 0)
        {
            var numText = $('#txtbutton').val().length;
            $('#butonTextLimit').html(limit - numText);
        }
    }
    else if(opt == 'btnote')
    {
        if($('#txtbtnote').length > 0)
        {
            var numText = $('#txtbtnote').val().length;
            $('#btnoteLimit').html(limit - numText);
        }
    }
    else if(opt == 'br')
    {
        var hddbrand = $('#hddbrandname').val();
        if(hddbrand != null && hddbrand.length > 0)
        {
            var numText = $('#hddbrandname').val().length;
            $('#brand-limit').html(limit - numText);
        }
    }
}
// location
function chkLocationAllClick()
{
    var checked = $('#chkLocationAll').attr('checked') ? 'checked' : '';
    $('.chkLocation').attr('checked',checked);
    step2ShowLocationErr();
    updateLocationReview();
    updateEstimate();
}

function chkLocationItemClick()
{
    var arrLocaItem = $('.chkLocation');
    var chkall = true;
    for(var i = 0; i <arrLocaItem.length; i++)
    {
        if(!$(arrLocaItem[i]).attr('checked'))
        {
            chkall = false;
            break;
        }
    }

    if(chkall)
    {
        $('#chkLocationAll').attr('checked', 'checked');
        step2ShowLocationErr();
    }
    else
    {
        var chk = true;
        for(var i = 0; i <arrLocaItem.length; i++)
        {
            if($(arrLocaItem[i]).attr('checked'))
            {
                chk = false;
                break;
            }
        }

        $('#chkLocationAll').attr('checked', '');
        step2ShowLocationErr(chk);
    }
    updateLocationReview();
    updateEstimate();
}

function updateLocationReview()
{
    var strLocation = '';
    if($('#chkBac').attr('checked'))
    {
        strLocation += '<li>' + $.trim($('#bacName').html()) + '</li>';
    }
    if($('#chkTrung').attr('checked'))
    {
        strLocation += '<li>' + $.trim($('#trungName').html()) + '</li>';
    }
    if($('#chkNam').attr('checked'))
    {
        strLocation += '<li>' + $.trim($('#namName').html()) + '</li>';
    }
    if($('#chkInter').attr('checked'))
    {
        strLocation += '<li>' + $.trim($('#international_region b').html()) + '</li>';
    }
    $('#review_location').html(strLocation);
    $('#estimate-location').html(strLocation);

    if(strLocation != '')
    {
        $('#divEstimateLocation').css('display', '');
        $('#trReviewLocation').css('display', '');
    }
    else
    {
        $('#divEstimateLocation').css('display', 'none');
        $('#trReviewLocation').css('display', 'none');
    }
}
//end location

function chkOsIsAll()
{
    var arrLocaItem = $('#divOs .chkOs');
    var chk = true;
    var typead = $('#ttypead').val();
    jQuery.each(arrLocaItem, function()
    {
        var varOs = $(this).val();
        if(typead==1)
        {
            if(!$(this).attr('checked'))
            {
                if(varOs!=1 && varOs!=2 && varOs!=3)
                {
                    chk = false;
                }

            }
        }
        else if(typead==4)
        {
            if(!$(this).attr('checked'))
            {
                if(varOs==1 || varOs==2 || varOs==3)
                {
                    chk = false;
                }
            }
        }
        else
        {
            if(!$(this).attr('checked'))
            {
                chk = false;
            }
        }
    });
    return chk;
}

function updateOsReview()
{
    var strOs = '';
    var lstos = '';

    var arrLocaItem = $('#divOs .chkOs');
    var typead = $('#ttypead').val();
    jQuery.each(arrLocaItem, function()
    {
        if($(this).attr('checked'))
        {
            var valOs = $(this).val();
            if(typead==1)
            {
                if(valOs!=1&&valOs!=2&&valOs!=3)
                {
                    strOs += '<li>'+$(this).next().html() +'</li>';
                    lstos += $.trim($(this).val())+',';
                }
            }
            else if(typead==4)
            {
                if(valOs==1 || valOs==2 || valOs==3)
                {
                    strOs += '<li>'+$(this).next().html() +'</li>';
                    lstos += $.trim($(this).val())+',';
                }
            }
            else
            {
                strOs += '<li>'+$(this).next().html() +'</li>';
                lstos += $.trim($(this).val())+',';
            }
        }
    });
    $('#review_os').html(strOs);
    $('#estimate-os').html(strOs);
    $('#hddListOsId').val(lstos);
    if(strOs != '')
    {
        $('#divEstimateOs').css('display', '');
        $('#trReviewOs').css('display', '');
    }
    else
    {
        $('#divEstimateOs').css('display', 'none');
        $('#trReviewOs').css('display', 'none');
    }
}
//end operating system
//check Os&Manu(for Catfish&Popup)
function updateChkOsAll()
{
    var checked = $('#chkManuAll').attr('checked') ? 'checked' : '';

    if(checked=='')
    {
        $('#chkOsAll').attr('checked', '');
    }
}

function chkManuIsAll()
{
    var arrLocaItem = $('#divMan .chkManu');
    var chk = true;
    var typead = $('#ttypead').val();
    jQuery.each(arrLocaItem, function()
    {
        var varMan = $(this).val();
        if(typead==1)
        {
            if(!$(this).attr('checked'))
            {
                if(varMan!=1 && varMan!=2 && varMan!=3 && varMan!=7 && varMan!=8)
                {
                    chk = false;
                }
            }
        }
        else if(typead==4)
        {
            if(!$(this).attr('checked'))
            {
                chk = false;
            }
        }
        else
        {
            if(!$(this).attr('checked'))
            {
                chk = false;
            }
        }
    });
    return chk;
}

function removeItem(array, itemToRemove)
{
    var j = 0;
    while (j<array.length) {
        if(array[j] == itemToRemove)
        {
            array.splice(j, 1);
        }
        else
        {
            j++;
        }
    }
    return array;
}

function in_array(item, arr)
{
    for(p=0;p<arr.length;p++)
    {
        if (item == arr[p]) return true;
    }
    return false;
}

var chk = new Array();
var Os = new Array();
var Os_v1 = new Array();

function varAllOs()
{
    var arrOs = $('.hiddenOs');
    for(i=1;i<=arrOs.length;i++)
    {
        Os[i] = $('#Os'+i).val().split(',');
        Os_v1[i] = $('#Os'+i).val().split(',');
        chk[i] = Array();
    }
}

//operating system
function chkOsAllClick()
{
    var checked = $('#chkOsAll').attr('checked') ? 'checked' : '';
    var typead = $('#ttypead').val();
    if(typead==1)
    {
        var arrOs= $('.chkOs');
        for(var i = 0; i <arrOs.length; i++)
        {
            var valOs = $(arrOs[i]).val();
            if(valOs != '1' && valOs != '2' && valOs != '3')
            {
                $(arrOs[i]).attr('checked', checked);
            }
        }

        var arrMan= $('.chkManu');
        for(var i = 0; i <arrMan.length; i++)
        {
            var valMan = $(arrMan[i]).val();
            if(valMan != '1' && valMan != '2' && valMan != '3' && valMan != '7' && valMan != '8')
            {
                $(arrMan[i]).attr('checked', checked);
            }
        }
    }
    else if(typead==4)
    {
        var arrOs= $('.chkOs');
        for(var i = 0; i <arrOs.length; i++)
        {
            var valOs = $(arrOs[i]).val();
            if(valOs == '1' || valOs == '2' || valOs == '3')
            {
                $(arrOs[i]).attr('checked', checked);
            }
        }
        $('.chkManu').attr('checked', checked);
    }
    else
    {
        $('.chkOs').attr('checked',checked);
        $('.chkManu').attr('checked', checked);
    }

    $('#chkManuAll').attr('checked', checked);
    $('#chkAllList').val('9000');
    resetvalOs();
    if(checked=='')
    {
        $('.chkManu').attr('checked','');
        $('#chkManuAll').attr('checked', '');
        $('#chkAllList').val('');
        step2ShowOsErr();
        updateManuReview();
        updateEstimate();
    }
    var chkvalidOsUrl = validOsUrl();
    if(!validOsUrl){return;}
    step2ShowOsErr();
    step2ShowManuErr();
    updateOsReview();
    updateManuReview();
    updateEstimate();
}

//manufacture
function chkManuAllClick()
{
    var checked = $('#chkManuAll').attr('checked') ? 'checked' : '';
    var typead = $('#ttypead').val();
    if(typead==1)
    {
        var arrOs= $('.chkOs');
        for(var i = 0; i <arrOs.length; i++)
        {
            var valOs = $(arrOs[i]).val();
            if(valOs != '1' && valOs != '2' && valOs != '3')
            {
                $(arrOs[i]).attr('checked',checked);
            }
        }

        var arrMan= $('.chkManu');
        for(var i = 0; i <arrMan.length; i++)
        {
            var valMan = $(arrMan[i]).val();
            if(valMan != '1' && valMan != '2' && valMan != '3' && valMan != '7' && valMan != '8')
            {
                $(arrMan[i]).attr('checked',checked);
            }
        }
    }
    else if(typead==4)
    {
        var arrOs= $('.chkOs');
        for(var i = 0; i <arrOs.length; i++)
        {
            var valOs = $(arrOs[i]).val();
            if(valOs == '1' || valOs == '2' || valOs == '3')
            {
                $(arrOs[i]).attr('checked',checked);
            }
        }
        $('.chkManu').attr('checked', checked);
    }
    else
    {
        $('.chkManu').attr('checked',checked);
        $('.chkOs').attr('checked', checked);
    }
    $('#chkOsAll').attr('checked', checked);
    $('#chkAllList').val('9000');
    resetvalOs();
    if(checked=='')
    {
        $('.chkOs').attr('checked','');
        $('#chkOsAll').attr('checked', '');
        $('#chkAllList').val('');
        step2ShowOsErr();
        updateOsReview();
        updateEstimate();
    }
    step2ShowOsErr();
    step2ShowManuErr();
    updateOsReview();
    updateManuReview();
    updateEstimate();
}
function removeUniqueItemFromArr(arr1, arr2)
{
    for (var i = 0; i<arr2.length; i++) {
        var arrlen = arr1.length;
        for (var j = 0; j<arrlen; j++) {
            if (arr2[i] == arr1[j]) {
                arr1 = arr1.slice(0, j).concat(arr1.slice(j+1, arrlen));
            }
        }
    }
    return arr1;
}
function chkOsItemClick(mnid, obj)
{
    mnid = mnid.split(",");
    var arrOs = $('.hiddenOs');
    var arrUnique = new Array();
    var arrOs_isnot = arrOs_isok = new Array();
    if(!$(obj).attr('checked'))
    {
        for(i=1;i<=arrOs.length;i++)
        {
            Os[i] = $('#Os'+i).val().split(',');
            if($('#chk'+i).attr('checked')==false)
            {
                arrOs_isnot = arrOs_isnot.concat(Os[i]);
            }
            else
            {
                arrOs_isok = arrOs_isok.concat(Os[i]);
            }
            arrUnique = removeUniqueItemFromArr(arrOs_isnot, arrOs_isok);
        }

        for(var i = 0; i <arrUnique.length; i++)
        {
            $('#chkManu'+arrUnique[i]).attr('checked','');
            $('#chkManuAll').attr('checked','');
        }
    }
    else
    {
        for(var i = 0; i <mnid.length; i++)
        {
            $('#chkManu'+mnid[i]).attr('checked','checked');
            if(chkManuIsAll())
            {
                $('#chkManuAll').attr('checked','checked');
            }
        }
    }
    if(chkOsIsAll() && chkManuIsAll())
    {
        $('#chkOsAll').attr('checked',chkOsIsAll());
        $('#chkAllList').val('9000');
        resetvalOs();
        step2ShowOsErr();
    }else{
        var chkOs = true;
        var arrLocaItem = $('.chkOs');
        for(var i = 0; i <arrLocaItem.length; i++)
        {
            if($(arrLocaItem[i]).attr('checked'))
            {
                chkOs = false;
                break;
            }
        }
        $('#chkOsAll').attr('checked', '');
        $('#chkAllList').val('');
        step2ShowOsErr(chkOs);
    }
    var chkvalidOsUrl = validOsUrl();
    if(!validOsUrl){return;}
    step2ShowManuErr();
    updateOsReview();
    updateManuReview();
    updateEstimate();
}

function resetvalOs()
{
    var arrOs = $('.hiddenOs');
    for(i=1;i<=arrOs.length;i++)
    {
        Os[i].length = 0;
        Os_v1[i].length = 0;
        chk[i].length = 0;
        Os[i] = $('#Os'+i).val().split(',');
        Os_v1[i] = $('#Os'+i).val().split(',');
        chk[i] = Array();
    }
}
function manuRevAdd(val, j)
{
    var arrOs = $('.hiddenOs');
    if(j==1)
    {
        var arrManuItem = $('.chkManu');
        for(var i = 0; i<arrManuItem.length; i++)
        {
            if(!$(arrManuItem[i]).attr('checked'))
            {
                for(j=1;j<=arrOs.length;j++)
                {
                    chk[j] = removeItem(Os[j], $(arrManuItem[i]).val());
                    if(chk[j].length == 0)
                    {
                        $('#chk' + j).attr('checked', '');
                    }
                }
            }
        }
    }
    else
    {
        var typead = $('#ttypead').val();
        for(j=1;j<=arrOs.length;j++)
        {
            if(in_array(val, Os_v1[j]))
            {
                if(typead==1)
                {
                    if(j!=1 && j!=2 && j!=3)
                    {
                        if(chk[j].length < Os_v1[j].length)
                        {
                            chk[j].push(val);
                        }
                        $('#chk' + j).attr('checked', 'checked');
                    }
                }
                else if(j==1 && j==2 && j==3)
                {
                    if(chk[j].length < Os_v1[j].length)
                    {
                        chk[j].push(val);
                    }
                    $('#chk' + j).attr('checked', 'checked');
                }
                else
                {
                    if(chk[j].length < Os_v1[j].length)
                    {
                        chk[j].push(val);
                    }
                    $('#chk' + j).attr('checked', 'checked');
                }
            }
        }
    }
}

function isChkAll()
{
    var chkAllOs = chkOsIsAll();
    var chkAllManu = chkManuIsAll();

    if(chkAllOs && chkAllManu)
    {
        $('#chkOsAll').attr('checked','checked');
        $('#chkManuAll').attr('checked','checked');
        //resetvalOs();
    }
}

function chkManuItemClick(osid,obj)
{
    osid = osid.split(",");
    if(!$(obj).attr('checked'))
    {
        manuRevAdd(obj.value, '1');
        for(var i = 0;i<osid.length; i++)
        {
            //$('#chk'+osid[i]).attr('checked','');
            $('#chkOsAll').attr('checked','');
        }
        var chkManu = true;
        var arrManuItem = $('.chkManu');
        var typead = $('#ttypead').val();
        for(var i = 0; i <arrManuItem.length; i++)
        {
            var valMan = $(arrManuItem[i]).val();
            if($(arrManuItem[i]).attr('checked'))
            {
                if(typead==1)
                {
                    if(valMan!=1&&valMan!=2&&valMan!=3&&valMan!=7&&valMan!=8)
                    {
                        chkManu = false;
                        break;
                    }
                }
                else if(typead==4)
                {
                    chkManu = false;
                    break;
                }
                else
                {
                    chkManu = false;
                    break;
                }
            }
        }
        if(chkManu!=false){$('.chkOs').attr('checked','');}
    }
    else
    {
        manuRevAdd(obj.value, '2');
        for(var i = 0; i <osid.length; i++)
        {
            //$('#chk'+osid[i]).attr('checked','checked');
            var chkAllOs = chkOsIsAll();
            var chkAllManu = chkManuIsAll();
            if(chkAllOs && chkAllManu)
            {
                $('#chkOsAll').attr('checked','checked');
                resetvalOs();
            }
        }
    }

    if(chkManuIsAll())
    {
        $('#chkManuAll').attr('checked', 'checked');
        $('#chkAllList').val('9000');
        resetvalOs();
        step2ShowManuErr();
    }
    else
    {
        var arrManuItem = $('.chkOs');
        var chk = true;
        for(var i = 0; i <arrManuItem.length; i++)
        {
            if($(arrManuItem[i]).attr('checked'))
            {
                chk = false;
                break;
            }
        }
        $('#chkManuAll').attr('checked', '');
        $('#chkAllList').val('');
        step2ShowManuErr(chk);
    }
    step2ShowOsErr();
    updateOsReview();
    updateManuReview();
    updateEstimate();
}
function updateManuReview()
{
    var strManu = '';
    var lstmn = '';
    var arrLocaItem = $('#divMan .chkManu');
    var typead = $('#ttypead').val();
    jQuery.each(arrLocaItem, function()
    {
        if($(this).attr('checked'))
        {
            var valManu = $(this).val();
            if(typead==1)
            {
                if(valManu!=1 && valManu!=2 && valManu!=3 && valManu!=7 && valManu!=8)
                {
                    strManu += '<li>'+$(this).next().html() +'</li>';
                    lstmn += $.trim($(this).val())+',';
                }
            }
            else if(typead==4)
            {
                strManu += '<li>'+$(this).next().html() +'</li>';
                lstmn += $.trim($(this).val())+',';
            }
            else
            {
                strManu += '<li>'+$(this).next().html() +'</li>';
                lstmn += $.trim($(this).val())+',';
            }
        }
    });
    $('#review_manu').html(strManu);
    $('#estimate-manu').html(strManu);
    $('#hddListManuId').val(lstmn);
    if(strManu != '')
    {
        $('#divEstimateManu').css('display', '');
        $('#trReviewManu').css('display', '');
    }
    else
    {
        $('#divEstimateManu').css('display', 'none');
        $('#trReviewManu').css('display', 'none');
    }
}
//end manufacture

//city
function updateCityReview()
{
    var arrSelectedTag = $('#txtTargetLocationCity').parent('.superblyTagInputItem').parent('.superblyTagItems').children(".superblyTagItem");
    var numSelectedTag = arrSelectedTag.length;

    var strReviewCity = '';
    var strEsitmateCity = '';
    var numSiteCheck = 0;
    for(var i=0; i<numSelectedTag; i++)
    {
        var name = ($(arrSelectedTag[i]).find('span').html());
        var style = (i < 5) ? '' : 'display:none;';
        strReviewCity += '<li class="liCityReview" style="' + style + '">' + name + '</li>';
        strEsitmateCity += '<li class="liCityEstimate" style="' + style + '">' + name + '</li>';
        numSiteCheck++;
    }

    if(numSiteCheck > 5)
    {
        strReviewCity += '<li class="expand" id="liCityReviewExpand" onclick="cityReviewExpand();" >'+ home_lang['expand'] +'</li>';
        strEsitmateCity += '<li class="expand" id="liCityEstimateExpand" onclick="cityEstimateExpand();" >' + home_lang['expand'] + '</li>';
    }

    $('#review_city').html(strReviewCity);
    $('#estimate-location-city').html(strEsitmateCity);

    if(numSiteCheck > 0)
    {
        $('#divEstimateCity').css('display', '');
        $('#trReviewCity').css('display', '');
    }
    else
    {
        $('#divEstimateCity').css('display', 'none');
        $('#trReviewCity').css('display', 'none');
    }
}

function cityEstimateExpand()
{
    if($('#liCityEstimateExpand').hasClass('expand'))
    {
        var arr = $('#estimate-location-city li.liCityEstimate');
        var num = arr.length;
        if(num > 4)
        {
            for(var i = 5; i < num; i++)
            {
                $(arr[i]).show();
            }
        }
        $('#liCityEstimateExpand').html(home_lang['collapse']);
        $('#liCityEstimateExpand').removeClass('expand');
        $('#liCityEstimateExpand').addClass('collaspe');
    }
    else if($('#liCityEstimateExpand').hasClass('collaspe'))
    {
        var arr = $('#estimate-location-city li.liCityEstimate');
        var num = arr.length;
        if(num > 4)
        {
            for(var i = 5; i < num; i++)
            {
                $(arr[i]).hide();
            }
        }

        $('#liCityEstimateExpand').html(home_lang['expand']);
        $('#liCityEstimateExpand').removeClass('collaspe');
        $('#liCityEstimateExpand').addClass('expand');
    }
    scrollEstimateBox();
}

function cityReviewExpand()
{
    if($('#liCityReviewExpand').hasClass('expand'))
    {
        var arr = $('#review_city li.liCityReview');
        var num = arr.length;
        if(num > 4)
        {
            for(var i = 5; i < num; i++)
            {
                $(arr[i]).show(250);
            }
        }
        $('#liCityReviewExpand').html(home_lang['collapse']);
        $('#liCityReviewExpand').removeClass('expand');
        $('#liCityReviewExpand').addClass('collaspe');
    }
    else if($('#liCityReviewExpand').hasClass('collaspe'))
    {
        var arr = $('#review_city li.liCityReview');
        var num = arr.length;
        if(num > 4)
        {
            for(var i = 5; i < num; i++)
            {
                $(arr[i]).hide(250);
            }
        }
        $('#liCityReviewExpand').html(home_lang['expand']);
        $('#liCityReviewExpand').removeClass('collaspe');
        $('#liCityReviewExpand').addClass('expand');
    }
    scrollEstimateBox();
}
//end city

//estimate box
function scrollEstimateBox()
{
    var footerPos = $('#footer-inner').position();
    var estimatePos = $('#divEstimate').position();
    var estimateHeight = $('#divEstimate').height();
    var top = estimatePos.top;

    if(estimatePos.top + estimateHeight > footerPos.top)
    {
        top = (footerPos.top - estimateHeight);
        top = top - 5;
        $("#divEstimate").stop().animate({"top": top + "px"}, 500);
    }
    else
    {
        var tmpStep2Pos = $('#divStep2').position();
        if($(window).scrollTop() <= tmpStep2Pos.top)
        {
            top = tmpStep2Pos.top;
        }
        else
        {
            top = $(window).scrollTop();
        }
        if(top + estimateHeight <= footerPos.top)
        {
            $("#divEstimate").stop().animate({"top": top + "px"}, 500);
        }
        else
        {
            top = top - (top + estimateHeight - footerPos.top);
            $("#divEstimate").stop().animate({"top": top + "px"}, 500);
        }
    }
}

function siteEstimateExpand()
{
    if($('#liSiteEstimateExpand').hasClass('expand'))
    {
        var arr = $('#estimate-site li.liSiteEstimate');
        var num = arr.length;
        if(num > 4)
        {
            for(var i = 3; i < num; i++)
            {
                $(arr[i]).show();
            }
        }
        $('#liSiteEstimateExpand').html(home_lang['collapse']);
        $('#liSiteEstimateExpand').removeClass('expand');
        $('#liSiteEstimateExpand').addClass('collaspe');
    }
    else if($('#liSiteEstimateExpand').hasClass('collaspe'))
    {
        var arr = $('#estimate-site li.liSiteEstimate');
        var num = arr.length;
        if(num > 4)
        {
            for(var i = 3; i < num; i++)
            {
                $(arr[i]).hide();
            }
        }
        $('#liSiteEstimateExpand').html(home_lang['expand']);
        $('#liSiteEstimateExpand').removeClass('collaspe');
        $('#liSiteEstimateExpand').addClass('expand');
    }
    scrollEstimateBox();
}

function siteReviewExpand()
{
    if($('#liSiteReviewExpand').hasClass('expand'))
    {
        var arr = $('#review_site li.liSiteReview');
        var num = arr.length;
        if(num > 4)
        {
            for(var i = 3; i < num; i++)
            {
                $(arr[i]).show(250);
            }
        }
        $('#liSiteReviewExpand').html(home_lang['collapse']);
        $('#liSiteReviewExpand').removeClass('expand');
        $('#liSiteReviewExpand').addClass('collaspe');
    }
    else if($('#liSiteReviewExpand').hasClass('collaspe'))
    {
        var arr = $('#review_site li.liSiteReview');
        var num = arr.length;
        if(num > 4)
        {
            for(var i = 3; i < num; i++)
            {
                $(arr[i]).hide(250);
            }
        }
        $('#liSiteReviewExpand').html(home_lang['expand']);
        $('#liSiteReviewExpand').removeClass('collaspe');
        $('#liSiteReviewExpand').addClass('expand');
    }
    scrollEstimateBox();
}

function btnEditAdClick()
{
    move2Step('#divStep1', 2000);
}

function moveMoney()
{
    var campBudget = $('#txtCampBudget').val();
    campBudget = campBudget.replace(/,/gi,'');
    campBudget = parseFloat(campBudget);
    $('#allBugdet').val(campBudget);
}

function updateCreateCampainReview()
{
    var price = parseFloat($.trim($('#admoney').val()));

    var moneyUnitValue = $.trim($('#hddMoneyUnitValue').val());
    moneyUnitValue = moneyUnitValue.replace(/,/gi,'');
    moneyUnitValue = parseInt(moneyUnitValue);

    $('#review_camp_name').html($.trim($('#txtCampName').val()) + ' (' + home_lang['new_campaign'] + ')');
    $('#review_camp_hdcode').html($.trim($('#txtHdCode').val()));
    $('#review_camp_hd_guest').html($.trim($('#txtHdGuest').val()));

    if($.trim($('#txtHdCode').val()) != '' || $.trim($('#txtHdGuest').val()) != '')
    {
        $('#tr_review_hdcode').show();
        $('#tr_review_hd_guest').show();
    }
    else
    {
        $('#tr_review_hdcode').hide();
        $('#tr_review_hd_guest').hide();
    }

    var strStartDate = $('#campStartDate').val();
    var strEndDate = $('#campEndDate').val();
    var arrStartDate = strStartDate.split('-');
    var arrEndDate = strEndDate.split('-');

    var startDate = new Date(arrStartDate[2] + '/' + arrStartDate[1] + '/' + arrStartDate[0]);
    var endDate = new Date(arrEndDate[2] + '/' + arrEndDate[1] + '/' + arrEndDate[0]);

    var campBudget = $('#allBugdet').val();
    if(campBudget=='0')
    {
        campBudget = $.trim($('#txtCampBudget').val());
    }
    campBudget = campBudget.replace(/,/gi,'');
    campBudget = parseFloat(campBudget);


    var strapp_click = 0;
    var btypay = $('input[name=typepay]:checked').val();
    if(btypay==1)
    {
        strapp_click = addCommas(Math.round(campBudget/(parseInt(price) + (parseInt(price)*0.1))));
        $('#approximate_click').html(strapp_click + ' click');
        $('#camMoney').html(strapp_click + ' click  ');
    }
    else
    {
        strapp_click = addCommas(Math.round((campBudget/(parseInt(price) + (parseInt(price)*0.1)))*1000));
        $('#approximate_click').html(strapp_click + ' impressions');
        $('#camMoney').html(strapp_click + ' impressions  ');
    }

    var hddgroupid = parseInt($('#hddgroupid').val());

    var minbudget = 100000;
    if(hddgroupid==0){
        minbudget = 500000;
    }

    if(campBudget < minbudget)
    {
        $('#errorCreateCampBudget').show();
    }
    else
    {
        $('#errorCreateCampBudget').hide();
    }
    var budType = $('#slcCampBudgetType').val();
    var chkFromDay = $('#chkRunToday').attr('checked');
    var numCampDay = ((endDate - startDate)/86400000) + 1;

    if(budType == 'perday')
    {
        $('#review_daily_budget').html(addCommas(campBudget.toString()) + ' ' + home_lang['vnd'] + ' ' + home_lang['per_day']);
        if(btypay==1)
        {
            $('#review_daily_budget_vnd').html(strapp_click + ' click ' + home_lang['per_day']);
        }
        else
        {
            $('#review_daily_budget_vnd').html(strapp_click + ' impressions  ' + home_lang['per_day']);
        }

        if(chkFromDay)
        {
            $('#rvcmpduration').hide();
            var currTime = new Date();
            var currYear = currTime.getFullYear();
            var currMonth = currTime.getMonth();
            currMonth = parseInt(currMonth) < 9 ? '0' + (currMonth + 1) : (currMonth + 1);

            var currDay = currTime.getDate();
            currDay = 	parseInt(currDay) < 10 ? '0' + currDay : currDay;

            $('#rvcmpfromday').html(common_lang['camp_run_from_day'] + ' <b>' + currDay + '-' + currMonth + '-' + currYear + '</b>').show();
            $('#campStartDate').val(currDay + '-' + currMonth + '-' + currYear);
            $('#campEndDate').val(currDay + '-' + currMonth + '-' + currYear);
        }
        else
        {
            $('#rvcmpduration').show();
            $('#rvcmpfromday').html('').hide();
        }

        $('#chkRunToday').attr('disabled','');
        $('#tdChkFday').removeClass('text-666');

        $('#hddCampDBanner').val(campBudget);

    }
    else if(budType == 'lifetime')
    {
        $('#chkRunToday').attr('disabled','disabled');
        $('#chkRunToday').attr('checked','');
        $('#tdChkFday').addClass('text-666');
        if(prehdcn==0)
        {
            var pbid = $('#phanboid').val();

            if(pbid==0 || (typeof(pbid) === 'undefined' || pbid === ''))
            {
                $('#campStartDate').attr('disabled','').css('background-color', '#fff');
                $('#campEndDate').attr('disabled','').css('background-color', '#fff');
            }
        }

        $('#review_daily_budget').html(addCommas(campBudget.toString()) + ' ' + home_lang['vnd'] + ' ' + home_lang['life_time']);

        if(btypay==1)
        {
            $('#review_daily_budget_vnd').html(strapp_click + ' click ' + home_lang['life_time']);
        }
        else
        {
            $('#review_daily_budget_vnd').html(strapp_click + ' impressions  ' + home_lang['life_time']);
        }

        $('#rvcmpduration').show();
        $('#rvcmpfromday').html('').hide();
        $('#hddCampDBanner').val(Math.round(campBudget / numCampDay));
    }
    if($('#hddCampType').val() == 'create')
    {
        $('#review_num_camp_day').html(numCampDay);
        $('#review_camp_start').html(strStartDate);
        $('#review_camp_end').html(strEndDate);
    }


}

function updateEstimate()
{
    var strLocationId = '';
    if($('#chkBac').attr('checked'))
    {
        strLocationId += (strLocationId == '') ? '1' : ',1';
    }
    if($('#chkTrung').attr('checked'))
    {
        strLocationId += (strLocationId == '') ? '2' : ',2';
    }
    if($('#chkNam').attr('checked'))
    {
        strLocationId += (strLocationId == '') ? '3' : ',3';
    }

    var strCityId = $('#txtTargetLocationCity').val();
    var strChannelId = $('#hddListTargetSiteChannelId').val();

    var onSuccess = function(data)
    {
        var objData = jQuery.parseJSON(data);
        var estimateNumber = $.trim(objData.estimate);
        $('#estimate-number').html(estimateNumber);
        $('#estimateLoading').css('display','none');

    };
    $('#estimateLoading').css('display','');
    getAjax(makeSiteUrl('home/estimate/?locat=' + strLocationId + '&city=' + strCityId + '&channel=' + strChannelId), '', '', '', '', false, onSuccess);

}

function showDivEstimate()
{
    var divStep2Pos = $('#divStep2').position();
    $("#divEstimate").css({top: divStep2Pos.top + 'px', left: (divStep2Pos.left+840) + 'px' }) ;
    $('#divEstimate').show();
}
//end estimate box

// for new
function showTargetByCity(obj, eId)
{
    if($(obj).attr('checked'))
    {
        $(eId).show();
    }
    else
    {
        $(eId).hide();
    }
}


function expandSiteChannel(divOuterId, classname, obj)
{
    var className = $.trim($(obj).attr('class'));
    className = className.toLowerCase();
    if(className == 'img-site-expand')
    {
        $(divOuterId + ' .' + classname).slideDown(300);
        $(obj).attr('class', 'img-site-collapse');
    }
    else if(className == 'img-site-collapse')
    {
        var arr = $(divOuterId + ' .' + classname);
        var num = arr.length;

        $(divOuterId + ' .' + classname).slideUp(300);
        $(obj).attr('class', 'img-site-expand');
    }
}

function channelItemCheck(obj, siteBoxId, chkClass, divSiteId, priceBoxId, priceCheckAllId)
{
    var strCurrChalId = $.trim($('#hddListTargetSiteChannelId').val());
    var arrCurrChalId = new Array();
    if(strCurrChalId != '')
    {
        arrCurrChalId = strCurrChalId.split(',');
    }
    var id = $(obj).val();

    if($(obj).attr('checked'))
    {
        if(jQuery.inArray(id,arrCurrChalId) == -1)
        {
            arrCurrChalId.push(id);
        }
        $('#hddListTargetSiteChannelId').val(arrCurrChalId.join(','));
    }
    else
    {
        var index = jQuery.inArray(id,arrCurrChalId);
        if( index > -1)
        {
            arrCurrChalId.splice(index,1);
        }
        $('#hddListTargetSiteChannelId').val(arrCurrChalId.join(','));
    }
    if(checkChannelIsCheckAll())
    {
        $('#chkkAllSiteChannel').attr('checked', 'checked');
    }
    else
    {
        if(priceBoxIsChkAll(priceBoxId))
        {
            $(priceCheckAllId).attr('checked', 'checked');
        }
        else
        {
            $(priceCheckAllId).attr('checked', '');
        }
        $('#chkkAllSiteChannel').attr('checked', '');
    }
    step2ShowSiteChannelError();
    listSiteSort(false, false, false);
    updateEstimate();
    // get estimate money
    //getEstimateMoney();
}

function channelItemNameCheck(chkId, siteBoxId, chkClass, divSiteId, priceBoxId, priceCheckAllId)
{
    var strCurrChalId = $.trim($('#hddListTargetSiteChannelId').val());
    var arrCurrChalId = new Array();
    if(strCurrChalId != '')
    {
        arrCurrChalId = strCurrChalId.split(',');
    }
    var id = $(chkId).val();

    if($(chkId).attr('checked'))
    {
        var index = jQuery.inArray(id,arrCurrChalId);
        if( index > -1)
        {
            arrCurrChalId.splice(index,1);
        }
        $('#hddListTargetSiteChannelId').val(arrCurrChalId.join(','));
        $(chkId).attr('checked', '');
    }
    else
    {
        if(jQuery.inArray(id,arrCurrChalId) == -1)
        {
            arrCurrChalId.push(id);
        }
        $('#hddListTargetSiteChannelId').val(arrCurrChalId.join(','));
        $(chkId).attr('checked', 'checked');

    }
    if(checkChannelIsCheckAll())
    {
        $('#chkkAllSiteChannel').attr('checked', 'checked');
    }
    else
    {
        if(priceBoxIsChkAll(priceBoxId))
        {
            $(priceCheckAllId).attr('checked', 'checked');
        }
        else
        {
            $(priceCheckAllId).attr('checked', '');
        }
        $('#chkkAllSiteChannel').attr('checked', '');
    }
    step2ShowSiteChannelError();
    listSiteSort(false, false, false);
    updateEstimate();

    // estimate money
    //getEstimateMoney();

}

function reCheckSiteChannel()
{
    var arrCurrChannelId= new Array();
    var arrSiteChannel = $('#divTargetSiteBox .target-site-cat-box .chksitechannel');
    var num = arrSiteChannel.length;
    for(var i = 0; i < num; i++)
    {
        if($(arrSiteChannel[i]).attr('checked'))
        {
            var channelid = $(arrSiteChannel[i]).val();
            if(jQuery.inArray(channelid, arrCurrChannelId) == -1)
            {
                arrCurrChannelId.push(channelid);
            }
        }
    }
    $('#hddListTargetSiteChannelId').val(arrCurrChannelId.join(','));
}

function checkAllSiteChannel(divOuterId, classname, divSiteId, obj)
{
    var strCurrChalId = $.trim($('#hddListTargetSiteChannelId').val());
    var arrCurrChalId = new Array();
    if(strCurrChalId != '')
    {
        arrCurrChalId = strCurrChalId.split(',');
    }
    if($(obj).hasClass('chkall'))
    {
        var arrChal = $(divOuterId + ' .' + classname);
        var numChal = arrChal.length;
        for(var i=0; i < numChal; i++)
        {
            var id = $(arrChal[i]).val();
            if(jQuery.inArray(id,arrCurrChalId) == -1)
            {
                arrCurrChalId.push(id);
            }
            $(arrChal[i]).attr('checked', 'checked');
        }
        $('#hddListTargetSiteChannelId').val(arrCurrChalId.join(','));
        $(obj).removeClass('chkall');
        $(obj).addClass('chkunall');
        $(divSiteId).addClass('trg-site-name-box-slc');
    }
    else if($(obj).hasClass('chkunall'))
    {
        var arrChal = $(divOuterId + ' .' + classname);
        var numChal = arrChal.length;
        for(var i=0; i < numChal; i++)
        {
            var id = $(arrChal[i]).val();
            var index = jQuery.inArray(id,arrCurrChalId);
            if( index > -1)
            {
                arrCurrChalId.splice(index,1);
            }
            $(arrChal[i]).attr('checked', '');
        }
        $('#hddListTargetSiteChannelId').val(arrCurrChalId.join(','));
        $(obj).removeClass('chkunall');
        $(obj).addClass('chkall');
        $(divSiteId).removeClass('trg-site-name-box-slc');
    }

    if(checkChannelIsCheckAll())
    {
        $('#chkkAllSiteChannel').attr('checked', 'checked');
    }
    else
    {
        $('#chkkAllSiteChannel').attr('checked', '');
    }
    //update_allow_ad_size();
    updateEstimate();
    listSiteSort(false, false, false);
    step2ShowSiteChannelError();
}

function checkAllChannel(obj)
{
    if($(obj).attr('checked'))
    {
        $('#divTargetSiteBox .target-site-cat-box a.target-site-cat-btab').removeClass('gchkall');
        $('#divTargetSiteBox .target-site-cat-box a.target-site-cat-btab').addClass('gchkunall');

        $('#divTargetSiteBox .target-site-cat-box a.chkSiteName').removeClass('chkall');
        $('#divTargetSiteBox .target-site-cat-box a.chkSiteName').addClass('chkunall');

        var arrChannel = $('#divTargetSiteBox .chksitechannel');
        var numChannel = arrChannel.length;
        var arrChannelId = new Array();
        for(var i = 0; i < numChannel; i++)
        {
            arrChannelId.push($(arrChannel[i]).val());
            $(arrChannel[i]).attr('checked', 'checked');
        }
        $('.tag-trg-sc-chk').attr('checked', 'checked');
        $('#hddListTargetSiteChannelId').val(arrChannelId.join(','));
        updateEstimate();
    }
    else
    {
        $('#divTargetSiteBox .target-site-cat-box a.target-site-cat-btab').removeClass('gchkunall');
        $('#divTargetSiteBox .target-site-cat-box a.target-site-cat-btab').addClass('gchkall');

        $('#divTargetSiteBox .target-site-cat-box a.chkSiteName').removeClass('chkunall');
        $('#divTargetSiteBox .target-site-cat-box a.chkSiteName').addClass('chkall');

        $('#divTargetSiteBox .chksitechannel').attr('checked', '');
        $('#hddListTargetSiteChannelId').val('');
        $('.tag-trg-sc-chk').attr('checked', '');
        updateEstimate();
    }
    listSiteSort(false, false, true);
    step2ShowSiteChannelError();
}

function checkChannelIsCheckAll()
{
    var arrChannel = $('#divTargetSiteBox .chksitechannel');
    var num = arrChannel.length;
    var chk = true;
    for(var i=0; i < num; i++)
    {
        if(!$(arrChannel[i]).attr('checked'))
        {
            chk = false;
            break;
        }
    }
    return chk;
}

function priceBoxIsChkAll(priceBoxId)
{
    var arrChannel = $(priceBoxId + ' .chksitechannel');
    var num = arrChannel.length;
    var chk = true;
    for(var i=0; i < num; i++)
    {
        if(!$(arrChannel[i]).attr('checked'))
        {
            chk = false;
            break;
        }
    }
    return chk;
}

// for suggest channel
function gcatChkAllChn(divGcatId, chkClassName, divSiteBoxClass, obj)
{
    // channel
    var strCurrChalId = $.trim($('#hddListTargetSiteChannelId').val());
    var arrCurrChalId = new Array();
    if(strCurrChalId != '')
    {
        arrCurrChalId = strCurrChalId.split(',');
    }

    // tag
    var strDivGcatId = divGcatId;
    var arrDivTag = strDivGcatId.split("-");
    var tagid = parseInt(arrDivTag[1]);
    var strCurrTagId = $.trim($('#hddListTagChannelId').val());
    var arrCurrTagId = new Array();
    if(strCurrTagId != '')
    {
        arrCurrTagId = strCurrTagId.split(',');
    }

    if($(obj).hasClass('gchkall'))
    {
        var arrChal =$(divGcatId + ' ' + chkClassName);
        var numChal = arrChal.length;
        // channel
        for(var i=0; i < numChal; i++)
        {
            var id = $(arrChal[i]).val();
            if(jQuery.inArray(id,arrCurrChalId) == -1)
            {
                arrCurrChalId.push(id);
            }
            $(arrChal[i]).attr('checked', 'checked');
        }
        $(obj).parent().parent().find(divSiteBoxClass + ' a.chkSiteName').removeClass('chkall');
        $(obj).parent().parent().find(divSiteBoxClass + ' a.chkSiteName').addClass('chkunall');

        $('#hddListTargetSiteChannelId').val(arrCurrChalId.join(','));
        $(obj).removeClass('gchkall');
        $(obj).addClass('gchkunall');
        // tag
        if(jQuery.inArray(tagid, arrCurrTagId) == -1)
        {
            arrCurrTagId.push(tagid);
        }
        $('#hddListTagChannelId').val(arrCurrTagId.join(','));
        $(divGcatId + ' ' +divSiteBoxClass).addClass('trg-site-name-box-slc');
        $("#site-tag-" + tagid).attr('checked', 'checked');
    }
    else if($(obj).hasClass('gchkunall'))
    {
        var arrChal = $(divGcatId + ' ' + chkClassName);
        var numChal = arrChal.length;
        for(var i=0; i < numChal; i++)
        {
            var id = $(arrChal[i]).val();
            var index = jQuery.inArray(id,arrCurrChalId);
            if( index > -1)
            {
                arrCurrChalId.splice(index,1);
            }
            $(arrChal[i]).attr('checked', '');
        }
        $(obj).parent().parent().find(divSiteBoxClass + ' a.chkSiteName').removeClass('chkunall');
        $(obj).parent().parent().find(divSiteBoxClass + ' a.chkSiteName').addClass('chkall');
        $('#hddListTargetSiteChannelId').val(arrCurrChalId.join(','));

        $(obj).removeClass('gchkunall');
        $(obj).addClass('gchkall');


        if(jQuery.inArray(tagid, arrCurrTagId) > -1)
        {
            arrCurrTagId.splice(tagid);
        }
        $('#hddListTagChannelId').val(arrCurrTagId.join(','));
        $(divGcatId + ' ' +divSiteBoxClass).removeClass('trg-site-name-box-slc');
        $("#site-tag-" + tagid).attr('checked', '');
    }
    if(checkChannelIsCheckAll())
    {
        $('#chkkAllSiteChannel').attr('checked', 'checked');
    }
    else
    {
        $('#chkkAllSiteChannel').attr('checked', '');
    }
    updateEstimate();
    listSiteSort(false, false, true);
    step2ShowSiteChannelError();
}
function expandSite(boxId, expId, colId, classname, chClassName, type)
{
    if(type == 1)
    {
        $(boxId + ' ' + classname + ' li').slideDown(300);
        $(expId).hide();
        $(colId).show();
        scrollEstimateBox();
    }
    else if(type == 2)
    {
        $(expId).show();
        $(colId).hide();
        $(boxId + ' a.trg-site-expand img').attr('class', 'img-site-expand');
        var arrSite = $(boxId + ' ' + classname + ' li');
        var numS = arrSite.length;
        var nShow = 0;
        var arrShow = new Array();
        var arrHide = new Array();
        for(var i=0; i<numS;i++)
        {
            var arrChn = $(arrSite[i]).find('p' + chClassName);
            var numTmp = arrChn.length;
            var chk = false;
            for(var j=0;j<numTmp;j++)
            {
                var arrChk = $(arrChn[j]).find('input');
                if($(arrChk[0]).attr('checked'))
                {
                    chk = true;
                    break;
                }
            }
            if(chk && nShow < 3)
            {
                arrShow.push(arrSite[i]);
                nShow++;
            }
            else
            {
                arrHide.push(arrSite[i]);
            }
        }
        if(nShow == 0 || nShow < 3)
        {
            var nHide = arrHide.length;
            var rmHideIndex = new Array();
            var tmpArrHide = new Array();
            for(var i=0; i<nHide; i++)
            {
                if(nShow < 3)
                {
                    arrShow.push(arrHide[i]);
                    nShow++;
                }
                else
                {
                    tmpArrHide.push(arrHide[i]);
                }
            }
            arrHide = null;
            arrHide = tmpArrHide;
        }
        jQuery.each(arrHide, function(){$(this).slideUp(300);$(this).find(chClassName).slideUp(300);});
        jQuery.each(arrShow, function(){$(this).find(chClassName).slideUp(300);$(this).slideDown(300);});

        $('html,body').animate({scrollTop: $(boxId).position().top - 30}, 500);
    }
}

function listSiteSort(isReturnListChannelId, isSort, isCollapse)
{
    isReturnListChannelId = (typeof(isReturnListChannelId) === 'undefined' || isReturnListChannelId === '') ? false : isReturnListChannelId;
    isSort = (typeof(isSort) === 'undefined' || isSort === '') ? true : isSort;
    isCollapse = (typeof(isCollapse) === 'undefined' || isCollapse === '') ? false : isCollapse;
    var arrSiteBox = $('#divTargetSiteBox .target-site-cat-box');
    var num = arrSiteBox.length;
    var arrValueChecked = new Array();
    var arrSiteName = new Array();
    var chklstchannelid = $('#hddListTargetSiteChannelId').val()=='' ? false : true;
    for(var i = 0; i < num; i++)
    {
        var arrTmpSite = $(arrSiteBox[i]).find('.liSiteCl');
        var arrUl =  $(arrSiteBox[i]).find('ul.ul-target-site');
        var nSite = arrTmpSite.length;
        var arrSiteCheck = new Array();
        var arrSiteNotCheck = new Array();
        var hasCheckItem = false;
        for(var m = 0; m < nSite; m++)
        {
            var arrChk = $(arrTmpSite[m]).find('input.chksitechannel');
            var numCheck = arrChk.length;
            /*
             * var chkItem = true;
             for(var j=0; j < numCheck; j++)
             {
             if(!$(arrChk[j]).attr('checked'))
             {
             chkItem = false;
             break;
             }
             }
             */

            var chkItem = false;
            for(var j=0; j < numCheck; j++)
            {
                if($(arrChk[j]).attr('checked'))
                {
                    chkItem = true;
                    break;
                }
            }

            // check xem co site duoc chon hay khong
            if(!hasCheckItem && chkItem)
            {
                hasCheckItem = true;
            }

            if(chkItem && chklstchannelid)
            {
                $(arrTmpSite[m]).find('div.trg-site-name-box').addClass('trg-site-name-box-slc');
                $(arrTmpSite[m]).find('div.trg-site-name-box .trg-site-name a.chkSiteName').addClass('chkunall').removeClass('chkall');
                arrSiteCheck.push(arrTmpSite[m]);
                var arrChalItem = $(arrTmpSite[m]).find('.target-site-channel');
                arrSiteName.push($(arrTmpSite[m]).find('.trg-site-name').children('a').html());
                jQuery.each(arrChalItem, function(){
                    if($(this).children('.chksitechannel').attr('checked'))
                    {
                        arrValueChecked.push($(this).children('.chksitechannel').val());
                    }
                });
            }
            else
            {
                $(arrTmpSite[m]).find('div.trg-site-name-box').removeClass('trg-site-name-box-slc');
                $(arrTmpSite[m]).find('div.trg-site-name-box .trg-site-name a.chkSiteName').removeClass('chkunall').addClass('chkall');
                arrSiteNotCheck.push(arrTmpSite[m]);
            }
        }

        var numSiteBoxHasSelected = arrSiteCheck.length;
        var numSiteBoxNotSelected = arrSiteNotCheck.length;
        var i_temp = 0;

        var arrIndexShow1 = new Array();
        var arrIndexShow2 = new Array();
        var arrNotCheck2 = new Array();
        var chkExpand = $(arrSiteBox[i]).find('.target-site-more-exp').css('display') != 'none' ? false : true;

        // show 5 site chua chon
        for(var n = 0; n < numSiteBoxNotSelected; n++)
        {
            var chkSiteExpand = ($(arrSiteNotCheck[n]).find('.trg-site-expand').children('img').attr('class') == 'img-site-expand') ? false : true;
            if(!chkSiteExpand)
            {
                $(arrSiteNotCheck[n]).find('.target-site-channel').css('display','none');
                $(arrSiteNotCheck[n]).find('.trg-site-expand').children('img').attr('class', 'img-site-expand');

            }
            if(!chkExpand)
            {
                if((i_temp < 5 && hasCheckItem) || (i_temp < 6 && !hasCheckItem) )
                {
                    $(arrSiteNotCheck[n]).css('display', '');
                    arrIndexShow1.push(n);
                    i_temp++;
                }
                else
                {
                    $(arrSiteNotCheck[n]).css('display', 'none');
                    arrNotCheck2.push(arrSiteNotCheck[n]);
                }
            }
            else
            {
                arrNotCheck2.push(arrSiteNotCheck[n]);
            }
        }

        //show 1 site da chon
        var arrCheck2 = new Array();
        for(var n=0; n < numSiteBoxHasSelected; n++)
        {
            var chkSiteExpand = ($(arrSiteCheck[n]).find('.trg-site-expand').children('img').attr('class') == 'img-site-expand') ? false : true;
            if(!chkSiteExpand)
            {
                $(arrSiteCheck[n]).find('.target-site-channel').css('display','none');

            }
            if(!chkExpand)
            {
                if(i_temp < 6)
                {
                    $(arrSiteCheck[n]).css('display', '');
                    arrIndexShow2.push(n);
                    i_temp++;
                }
                else
                {
                    $(arrSiteCheck[n]).css('display', 'none');
                    arrCheck2.push(arrSiteCheck[n]);
                }
            }
            else
            {
                //i_temp++;
                arrCheck2.push(arrSiteCheck[n]);
            }

        }

        // gan lai thu tu website

        var arrListSite = new Array();
        var tmp_num1 = arrIndexShow1.length;
        for(var k = 0; k < tmp_num1; k++)
        {
            arrListSite.push(arrSiteNotCheck[arrIndexShow1[k]]);
        }
        tmp_num1 = arrIndexShow2.length;
        for(var k = 0; k < tmp_num1; k++)
        {
            arrListSite.push(arrSiteCheck[arrIndexShow2[k]]);
        }
        // neu dang expand
        if(chkExpand)
        {
            tmp_num1 = arrNotCheck2.length;
            for(var k = 0; k < tmp_num1; k++)
            {
                arrListSite.push(arrNotCheck2[k]);
            }

            tmp_num1 = arrCheck2.length;
            for(var k = 0; k < tmp_num1; k++)
            {
                arrListSite.push(arrCheck2[k]);
            }
        }
        else
        {
            tmp_num1 = arrCheck2.length;
            for(var k = 0; k < tmp_num1; k++)
            {
                arrListSite.push(arrCheck2[k]);
            }

            tmp_num1 = arrNotCheck2.length;
            for(var k = 0; k < tmp_num1; k++)
            {
                arrListSite.push(arrNotCheck2[k]);
            }
        }

        if(arrUl.length > 0)
        {
            $(arrUl[0]).html(arrListSite);//.append(arrListSite);
        }
        arrListSite = null;

        arrCheck1 = null;
        arrCheck2 = null;
        arrIndexShow2 = null;
        arrIndexShow1 = null;
    }

    // update estimate site + update step 4 review site
    var numSlcSite = arrSiteName.length;
    var numSiteCheck = 0;
    var strSiteReview = '';
    var strSiteEstimate = '';
    for(var i=0; i < numSlcSite; i++)
    {
        var style = (i < 6) ? '' : 'display:none;';
        strSiteReview += '<li class="liSiteReview" style="' + style + '">' + arrSiteName[i] + '</li>';
        strSiteEstimate += '<li class="liSiteEstimate" style="' + style + '">' + arrSiteName[i] + '</li>';
        numSiteCheck++;
    }

    if(numSiteCheck > 6)
    {
        strSiteReview += '<li class="expand" id="liSiteReviewExpand" onclick="siteReviewExpand();" >'+ home_lang['expand'] +'</li>';

        strSiteEstimate += '<li class="expand" id="liSiteEstimateExpand" onclick="siteEstimateExpand();" >' + home_lang['expand'] + '</li>';
    }

    $('#review_site').html(strSiteReview);
    $('#estimate-site').html(strSiteEstimate);

    if(numSiteCheck > 0)
    {
        $('#divEstimateSite').css('display', '');
        $('#trReviewSite').css('display', '');
    }
    else
    {
        $('#divEstimateSite').css('display', 'none');
        $('#trReviewSite').css('display', 'none');
    }

    if(isReturnListChannelId)
    {
        if(arrValueChecked.length > 0)
        {
            return arrValueChecked.join(',');
        }
        else
        {
            return '';
        }
    }

    // tao mang chua ten tag
    var urev = $('#urev').val();

    var arrChooseTag = Array();
    var arrChooseTagId = Array();
    var arrTagNotChk = Array();
    var arrTagetBox = $('.liSiteCl');
    var num_i = arrTagetBox.length;
    var strTagName = '';
    var chkchTag = true;
    for(var b = 0; b < num_i; b++)
    {
        // tim cac input ben trong cac tag
        var arrchkBox = $(arrTagetBox[b]).find('.target-site-channel').find('.chksitechannel');
        var num_k = arrchkBox.length;
        var full = 0;
        var valTagid = parseInt($.trim($(arrTagetBox[b]).parent().parent().find('.classtagid').val()));
        for(var m = 0; m < num_k; m++)
        {
            // check cac input xem da dc check chua
            if($(arrchkBox[m]).attr('checked'))
            {
                // neu dc check roi thi lay ten tag && tagid
                strTagName = $.trim($(arrTagetBox[b]).parent().parent().find('.target-site-cat-btab').find('span').html());
                valTagid = valTagid;
                full++;
            }
            else
            {
                valTagid_notin = valTagid;
                if(jQuery.inArray(valTagid_notin, arrTagNotChk)==-1)
                {
                    arrTagNotChk.push(valTagid_notin);
                }
            }
        }

        //if(full == num_k && chklstchannelid)
        if(chklstchannelid)
        {
            if(jQuery.inArray(strTagName, arrChooseTag)==-1 && strTagName!='' && strTagName!=null)
            {
                $("#gcatbox-" + valTagid).find('.target-site-cat-btab').removeClass('gchkall').addClass('gchkunall');
                var arrRemid = new Array();
                var chktag;
                if(urev != null && urev!='')
                {
                    arrRemid = urev.split(',');
                }
                else
                {
                    arrRemid = new Array();
                }
                chktag = $('#site-tag-' + valTagid).attr('checked');
                if(chktag)
                {
                    if(!in_array(valTagid, arrRemid))
                    {
                        arrChooseTag.push(strTagName);
                        arrChooseTagId.push(valTagid);
                    }
                }
                else
                {
                    if(!in_array(valTagid, arrChooseTagId))
                    {
                        arrChooseTag.push(strTagName);
                        arrChooseTagId.push(valTagid);
                    }
                    $('#site-tag-' + valTagid).attr('checked','checked');
                }
            }
            else
            {
                //$('#site-tag-' + valTagid).attr('checked','');
            }
        }
    }

    // get tagid
    var strTagID = arrChooseTagId.join();
    $('#hddListTagChannelId').val(strTagID);

    // tao string de day vao the html
    var numTagCheck = 0;
    var numTag = arrChooseTag.length;
    var strTagReview = '';
    var strTagEstimate = '';
    for(var i=0; i < numTag; i++)
    {
        var style = (i < 6) ? '' : 'display:none;';
        strTagReview += '<li class="liTagReview" style="' + style + '">' + arrChooseTag[i] + '</li>';
        strTagEstimate += '<li class="liTagEstimate" style="' + style + '">' + arrChooseTag[i] + '</li>';
        numTagCheck++;
    }

    if(numTagCheck > 6)
    {
        strTagReview += '<li class="expand" id="TagReviewExpand" onclick="tagReviewExpand();" >'+ home_lang['expand'] +'</li>';

        strTagEstimate += '<li class="expand" id="TagEstimateExpand" onclick="tagEstimateExpand();" >' + home_lang['expand'] + '</li>';
    }

    $('#review_tag').html(strTagReview);
    $('#estTag').html(strTagEstimate);

    if(numTagCheck > 0)
    {
        $('#divEstTag').css('display', '');
        $('#trReviewTag').css('display', '');
    }
    else
    {
        $('#divEstTag').css('display', 'none');
        $('#trReviewTag').css('display', 'none');
    }


    removeTagbyUser(urev);
}

function tagEstimateExpand()
{
    if($('#TagEstimateExpand').hasClass('expand'))
    {
        var arr = $('#estTag li.liTagEstimate');
        var num = arr.length;
        if(num > 4)
        {
            for(var i = 3; i < num; i++)
            {
                $(arr[i]).show();
            }
        }
        $('#TagEstimateExpand').html(home_lang['collapse']);
        $('#TagEstimateExpand').removeClass('expand');
        $('#TagEstimateExpand').addClass('collaspe');
    }
    else if($('#TagEstimateExpand').hasClass('collaspe'))
    {
        var arr = $('#estTag li.liTagEstimate');
        var num = arr.length;
        if(num > 4)
        {
            for(var i = 3; i < num; i++)
            {
                $(arr[i]).hide();
            }
        }
        $('#TagEstimateExpand').html(home_lang['expand']);
        $('#TagEstimateExpand').removeClass('collaspe');
        $('#TagEstimateExpand').addClass('expand');
    }
    scrollEstimateBox();
}

function tagReviewExpand()
{
    if($('#TagReviewExpand').hasClass('expand'))
    {
        var arr = $('#review_tag li.liTagReview');
        var num = arr.length;
        if(num > 6)
        {
            for(var i = 5; i < num; i++)
            {
                $(arr[i]).show(250);
            }
        }
        $('#TagReviewExpand').html(home_lang['collapse']);
        $('#TagReviewExpand').removeClass('expand');
        $('#TagReviewExpand').addClass('collaspe');
    }
    else if($('#TagReviewExpand').hasClass('collaspe'))
    {
        var arr = $('#review_tag li.liTagReview');
        var num = arr.length;
        if(num > 6)
        {
            for(var i = 5; i < num; i++)
            {
                $(arr[i]).hide(250);
            }
        }
        $('#TagReviewExpand').html(home_lang['expand']);
        $('#TagReviewExpand').removeClass('collaspe');
        $('#TagReviewExpand').addClass('expand');
    }
    scrollEstimateBox();
}

function chkRunFromDay(obj)
{
    if($(obj).attr('checked'))
    {
        $('#campStartDate').attr('disabled', 'disabled').css('background-color', '#f3f3f3');
        $('#campEndDate').attr('disabled', 'disabled').css('background-color', '#f3f3f3');

        $('#slcCampBudgetType').find('option[value=\"perday\"]').remove();
        $('#slcCampBudgetType').find('option[value=\"lifetime\"]').remove();
        $('#slcCampBudgetType').append('<option value="perday">' + common_lang['camp_budget_perday'] + '</option>');

        updateCreateCampainReview();


    }
    else
    {
        $('#campStartDate').attr('disabled', '').css('background-color', '#fff');
        $('#campEndDate').attr('disabled', '').css('background-color', '#fff');

        $('#slcCampBudgetType').find('option[value=\"perday\"]').remove();
        $('#slcCampBudgetType').find('option[value=\"lifetime\"]').remove();
        $('#slcCampBudgetType').append('<option value="perday">' + common_lang['camp_budget_perday'] + '</option>');
        $('#slcCampBudgetType').append('<option value="lifetime">' + common_lang['camp_budget_lifetime'] + '</option>');

        updateCreateCampainReview();
    }
}

// set style bold
function convertStyle(opt)
{
    var str = '';
    var realStartPos = -1;
    var realEndPos = -1;
    if(opt == 't') // title
    {
        str = $('#title').val();
        var numStyle = arrTStyle.length;
        var strTmp = '';
        for(var i = 0; i < numStyle; i++)
        {
            realStartPos = arrTStyle[i][0];
            realEndPos = arrTStyle[i][1];
            for(var j=0; j < i; j++)
            {
                strTmp = '';
                if(arrTStyle[i][0] >= arrTStyle[j][1])
                {
                    if(arrTStyle[j][3] != '')
                    {
                        strTmp = '<b style="font-weight:';
                        if(arrTStyle[j][2] == 0)
                        {
                            strTmp += 'normal;';
                        }
                        else if(arrTStyle[j][2] == 1)
                        {
                            strTmp += 'bold;';
                        }
                        strTmp += 'color:' + arrTStyle[j][3] + ';';
                        strTmp += '"></b>';
                    }
                    else
                    {
                        if(arrTStyle[j][2] == 1)
                        {
                            strTmp += '<b></b>';
                        }
                    }
                    realStartPos = realStartPos + strTmp.length;
                    realEndPos = realEndPos + strTmp.length;
                }
            }
            var str1 = str.substring(0, realStartPos);
            var str2 = str.substring(realStartPos, realEndPos);
            var str3 = str.substring(realEndPos, str.length);
            strTmp = '';
            if(arrTStyle[i][3] != '')
            {
                strTmp = '<b style="font-weight:';
                if(arrTStyle[i][2] == 0)
                {
                    strTmp += 'normal;';
                }
                else if(arrTStyle[i][2] == 1)
                {
                    strTmp += 'bold;';
                }
                strTmp += 'color:' + arrTStyle[i][3] + ';';
                strTmp += '">';
                str2 = strTmp + str2 + '</b>';
            }
            else
            {
                if(arrTStyle[i][2] == 1)
                {
                    str2 = '<b>' + str2 + '</b>';
                }
            }
            str = str1 + str2 + str3;
        }
        $('#title').val(str);
        $('#step1_suggest_title').html(str);
        $('#step1_suggest_title_160').html(str);
        $('#review_title').html(str);
        $('#review_adname').html(str);
        $('#estimateAdTitle').html(str);
    }

    else if(opt == 'b') // body
    {
        str = $('#step1BodyText').val();
        var numStyle = arrBStyle.length;
        var strTmp = '';
        for(var i = 0; i < numStyle; i++)
        {
            realStartPos = arrBStyle[i][0];
            realEndPos = arrBStyle[i][1];
            for(var j=0; j < i; j++)
            {
                strTmp = '';
                if(arrBStyle[i][0] >= arrBStyle[j][1])
                {
                    if(arrBStyle[j][3] != '')
                    {
                        strTmp = '<b style="font-weight:';
                        if(arrBStyle[j][2] == 0)
                        {
                            strTmp += 'normal;';
                        }
                        else if(arrBStyle[j][2] == 1)
                        {
                            strTmp += 'bold;';
                        }
                        strTmp += 'color:' + arrBStyle[j][3] + ';';
                        strTmp += '"></b>';
                    }
                    else
                    {
                        if(arrBStyle[j][2] == 1)
                        {
                            strTmp += '<b></b>';
                        }
                    }
                    realStartPos = realStartPos + strTmp.length;
                    realEndPos = realEndPos + strTmp.length;
                }
            }
            var str1 = str.substring(0, realStartPos);
            var str2 = str.substring(realStartPos, realEndPos);
            var str3 = str.substring(realEndPos, str.length);

            strTmp = '';
            if(arrBStyle[i][3] != '')
            {
                strTmp = '<b style="font-weight:';
                if(arrBStyle[i][2] == 0)
                {
                    strTmp += 'normal;';
                }
                else if(arrBStyle[i][2] == 1)
                {
                    strTmp += 'bold;';
                }
                strTmp += 'color:' + arrBStyle[i][3] + ';';
                strTmp += '">';
                str2 = strTmp + str2 + '</b>';
            }
            else
            {
                if(arrBStyle[i][2] == 1)
                {
                    str2 = '<b>' + str2 + '</b>';
                }
            }
            str = str1 + str2 + str3;
        }
        $('#step1BodyText').val(str);
        $('#step1_suggest_body').html(str);
        $('#review_bodytext').html(str);
    }
}

function setStyleBoldClick()
{
    if(strModifyText != '' && startPos >=0 && endPos > 0)
    {
        var isBold = 1;
        if(styleType == '1') // title
        {
            var numSTitle = arrTStyle.length;
            var newStyle = new Array();
            var arrRemove = new Array();

            newStyle[0] = startPos;
            newStyle[1] = endPos;
            newStyle[2] = isBold;
            newStyle[3] = '';
            var tmpArrStyle = new Array();
            for(var k=0; k<arrTStyle.length;k++)
            {
                tmpArrStyle.push(arrTStyle[k]);
            }

            for(var i=0; i < numSTitle; i++)
            {
                if( (startPos <= tmpArrStyle[i][1] && startPos >= tmpArrStyle[i][0] && endPos > tmpArrStyle[i][1]) || (startPos <= tmpArrStyle[i][0] && endPos > tmpArrStyle[i][0] && endPos <= tmpArrStyle[i][1]) || ( startPos >= tmpArrStyle[i][0] && endPos <= tmpArrStyle[i][1] ) || (tmpArrStyle[i][0] >= startPos && tmpArrStyle[i][1] <= endPos))
                {
                    isBold = (tmpArrStyle[i][2] == 1) ? 0 : 1;
                    newStyle[2] = isBold;
                    newStyle[3] = tmpArrStyle[i][3];
                    arrRemove.push(i);
                }
            }
            tmpArrStyle = null;
            tmpArrStyle = new Array();
            for(var i=0; i < numSTitle; i++)
            {
                if(jQuery.inArray(i, arrRemove) == -1)
                {
                    tmpArrStyle.push(arrTStyle[i]);
                }
            }
            tmpArrStyle.push(newStyle);

            var tmpNumChar = 0;
            for(var i=0; i < tmpArrStyle.length; i++)
            {
                if($.trim(tmpArrStyle[i][2]) != '0' || $.trim(tmpArrStyle[i][3]) != '')
                {
                    var tmpChar = tmpArrStyle[i][1] - tmpArrStyle[i][0];
                    tmpNumChar += (tmpChar < 0) ? 0 : tmpChar;
                }

            }

            if(tmpNumChar > max_title_set_style)
            {
                alert(home_lang['max_set_style_error_title'] + max_title_set_style);
                $("#title").caret({start: newStyle[0], end: newStyle[1]});
                return;
            }

            arrTStyle = null;
            arrTStyle = new Array();
            for(var k=0; k<tmpArrStyle.length;k++)
            {
                arrTStyle.push(tmpArrStyle[k]);
            }
            convertStyle('t');
            $("#title").caret({start: newStyle[0], end: newStyle[1]});
        }
        else if(styleType == '2')
        {
            var numBTitle = arrBStyle.length;
            var newStyle = new Array();
            var arrRemove = new Array();

            newStyle[0] = startPos;
            newStyle[1] = endPos;
            newStyle[2] = isBold;
            newStyle[3] = '';

            var tmpArrStyle = new Array();
            for(var k=0; k<arrBStyle.length;k++)
            {
                tmpArrStyle.push(arrBStyle[k]);
            }

            for(var i=0; i < numBTitle; i++)
            {
                if( (startPos <= tmpArrStyle[i][1] && startPos >= tmpArrStyle[i][0] && endPos > tmpArrStyle[i][1]) || (startPos <= tmpArrStyle[i][0] && endPos > tmpArrStyle[i][0] && endPos <= tmpArrStyle[i][1]) || ( startPos >= tmpArrStyle[i][0] && endPos <= tmpArrStyle[i][1] ) || (tmpArrStyle[i][0] >= startPos && tmpArrStyle[i][1] <= endPos))
                {
                    isBold = (tmpArrStyle[i][2] == 1) ? 0 : 1;
                    newStyle[2] = isBold;
                    newStyle[3] = tmpArrStyle[i][3];
                    arrRemove.push(i);
                }
            }
            tmpArrStyle = null;
            tmpArrStyle = new Array();
            for(var i = 0; i < numBTitle; i++)
            {
                if(jQuery.inArray(i,arrRemove) == -1)
                {
                    tmpArrStyle.push(arrBStyle[i]);
                }
            }
            tmpArrStyle.push(newStyle);
            var tmpNumBoldChar = 0;
            var tmpNumColorChar = 0;

            for(var i=0; i < tmpArrStyle.length; i++)
            {
                if($.trim(tmpArrStyle[i][2]) != '0' || $.trim(tmpArrStyle[i][3]) != '')
                {
                    if($.trim(tmpArrStyle[i][2]) != '0' && $.trim(tmpArrStyle[i][3]) == '')
                    {
                        tmpNumBoldChar += tmpArrStyle[i][1] - tmpArrStyle[i][0];
                    }
                    if($.trim(tmpArrStyle[i][3]) != '')
                    {
                        tmpNumColorChar += tmpArrStyle[i][1] - tmpArrStyle[i][0];
                    }
                }
            }

            if(tmpNumBoldChar > maxBStyleBold || tmpNumColorChar > maxBStyleColor)
            {
                alert(home_lang['max_set_style_error_title'] +  maxBStyleBold + home_lang['max_set_style_error_title2'] + maxBStyleColor);
                $("#step1BodyText").caret({start: newStyle[0], end: newStyle[1]});
                return;
            }

            arrBStyle = null;
            arrBStyle = new Array();
            for(var k=0; k<tmpArrStyle.length;k++)
            {
                arrBStyle.push(tmpArrStyle[k]);
            }
            convertStyle('b');
            $("#step1BodyText").caret({start: newStyle[0], end: newStyle[1]});
        }
    }
}

function setStyleClearAll(type)
{
    strModifyText= '';
    startPos = -1;
    endPos = -1;
    styleType = '0';
    if(type == 't')
    {
        arrTStyle = null;
        arrTStyle = new Array();
        num_title_set_style = 0;
        var title = $.trim($('#title').val());
        title = (title == '') ? common_lang['example_ad_title'] : title;
        $('#step1_suggest_title').html(title);
    }
    if(type == 'b')
    {
        arrBStyle = null;
        arrBStyle = new Array();
        num_body_set_style = 0;
        var bodyText = $.trim($('#step1BodyText').val());
        $('#step1BodyText').val(bodyText);
        bodyText = (bodyText == '') ? common_lang['body_text_here'] : bodyText;

        $('#step1_suggest_body').html(bodyText);
    }
}

function setStyleClear(type)
{
    strModifyText= '';
    startPos = -1;
    endPos = -1;
    styleType = '0';
    if(type == 't')
    {
        arrTStyle = [];
        num_title_set_style = 0;
    }
    if(type == 'b')
    {
        arrBStyle = [];
        num_body_set_style = 0;
    }
}

function setStyleColorClick(opt)
{
    if(strModifyText != '' && startPos >=0 && endPos > 0)
    {
        var styleColor = '';
        if(opt == '1') // red text
        {
            styleColor = '#fc0203';
        }
        else if(opt == '2') // orange text
        {
            styleColor = '#fe6601';
        }
        if(styleType == '1') // title
        {
            var numSTitle = arrTStyle.length;
            var newStyle = new Array();
            var arrRemove = new Array();

            newStyle[0] = startPos;
            newStyle[1] = endPos;
            newStyle[2] = 1; // title always is bold
            newStyle[3] = styleColor;

            var tmpArrStyle = new Array();
            for(var k=0; k<arrTStyle.length;k++)
            {
                tmpArrStyle.push(arrTStyle[k]);
            }
            for(var i=0; i < numSTitle; i++)
            {
                if( (startPos <= tmpArrStyle[i][1] && startPos >= tmpArrStyle[i][0] && endPos > tmpArrStyle[i][1]) || (startPos <= tmpArrStyle[i][0] && endPos > tmpArrStyle[i][0] && endPos <= tmpArrStyle[i][1]) || ( startPos >= tmpArrStyle[i][0] && endPos <= tmpArrStyle[i][1] ) || (tmpArrStyle[i][0] >= startPos && tmpArrStyle[i][1] <= endPos))
                {
                    newStyle[2] = tmpArrStyle[i][2];
                    if(tmpArrStyle[i][3].toLowerCase() == '' || tmpArrStyle[i][3].toLowerCase() != styleColor)
                    {
                        newStyle[3] = styleColor;
                    }
                    else
                    {
                        newStyle[3] = '';
                    }

                    arrRemove.push(i);
                }
            }
            tmpArrStyle = null;
            tmpArrStyle = new Array();
            for(var i=0; i < numSTitle; i++)
            {
                if(jQuery.inArray(i, arrRemove) == -1)
                {
                    tmpArrStyle.push(arrTStyle[i]);
                }
            }
            tmpArrStyle.push(newStyle);

            var tmpNumChar = 0;
            for(var i=0; i < tmpArrStyle.length; i++)
            {
                if($.trim(tmpArrStyle[i][3]) != '') // do titl luon luon bold nen chi check color
                {
                    var tmpChar = tmpArrStyle[i][1] - tmpArrStyle[i][0];
                    tmpNumChar += (tmpChar < 0) ? 0 : tmpChar;
                }
            }

            if(tmpNumChar > max_title_set_style)
            {
                alert(home_lang['max_set_style_error_title'] + max_title_set_style);
                $("#title").caret({start: newStyle[0], end: newStyle[1]});
                return;
            }

            arrTStyle = null;
            arrTStyle = new Array();
            for(var k=0; k<tmpArrStyle.length;k++)
            {
                arrTStyle.push(tmpArrStyle[k]);
            }
            convertStyle('t');
            $("#title").caret({start: newStyle[0], end: newStyle[1]});
        }
        else if(styleType == '2')
        {
            var numBTitle = arrBStyle.length;
            var newStyle = new Array();
            var arrRemove = new Array();

            newStyle[0] = startPos;
            newStyle[1] = endPos;
            newStyle[2] = 0;
            newStyle[3] = styleColor;

            var tmpArrStyle = new Array();
            for(var k=0; k<arrBStyle.length;k++)
            {
                tmpArrStyle.push(arrBStyle[k]);
            }
            for(var i=0; i < numBTitle; i++)
            {
                if( (startPos <= tmpArrStyle[i][1] && startPos >= tmpArrStyle[i][0] && endPos > tmpArrStyle[i][1]) || (startPos <= tmpArrStyle[i][0] && endPos > tmpArrStyle[i][0] && endPos <= tmpArrStyle[i][1]) || ( startPos >= tmpArrStyle[i][0] && endPos <= tmpArrStyle[i][1] ) || (tmpArrStyle[i][0] >= startPos && tmpArrStyle[i][1] <= endPos))
                {
                    newStyle[2] = tmpArrStyle[i][2];
                    if(tmpArrStyle[i][3].toLowerCase() == '' || tmpArrStyle[i][3].toLowerCase() != styleColor)
                    {
                        newStyle[3] = styleColor;
                    }
                    else
                    {
                        newStyle[3] = '';
                    }
                    arrRemove.push(i);
                }
            }
            tmpArrStyle = null;
            tmpArrStyle = new Array();
            for(var i = 0; i < numBTitle; i++)
            {
                if(jQuery.inArray(i, arrRemove) == -1)
                {
                    tmpArrStyle.push(arrBStyle[i]);
                }
            }
            tmpArrStyle.push(newStyle);
            var tmpNumBoldChar = 0;
            var tmpNumColorChar = 0;
            for(var i=0; i < tmpArrStyle.length; i++)
            {
                if($.trim(tmpArrStyle[i][3]) != '' || $.trim(tmpArrStyle[i][2]) != '0')
                {
                    if($.trim(tmpArrStyle[i][2]) != '0' && $.trim(tmpArrStyle[i][3]) == '')
                    {
                        tmpNumBoldChar += tmpArrStyle[i][1] - tmpArrStyle[i][0];
                    }
                    if($.trim(tmpArrStyle[i][3]) != '')
                    {
                        tmpNumColorChar += tmpArrStyle[i][1] - tmpArrStyle[i][0];
                    }
                }
            }
            if(tmpNumBoldChar > maxBStyleBold || tmpNumColorChar > maxBStyleColor)
            {
                alert(home_lang['max_set_style_error_title'] +  maxBStyleBold + home_lang['max_set_style_error_title2'] + maxBStyleColor);
                $("#step1BodyText").caret({start: newStyle[0], end: newStyle[1]});
                return;
            }

            arrBStyle = null;
            arrBStyle = new Array();
            for(var k=0; k<tmpArrStyle.length;k++)
            {
                arrBStyle.push(tmpArrStyle[k]);
            }
            convertStyle('b');
            $("#step1BodyText").caret({start: newStyle[0], end: newStyle[1]});
        }
    }
}
// end set style bold

// init category
function editAdAddCat(tagid, name, catid, strInputDefault)
{
    strInputDefault = (typeof(strInputDefault) === 'undefined' || strInputDefault === '') ? '' : strInputDefault;
    $(tagid).parent('.superblyTagInputItem').before("<li class='superblyTagItem'><span>" + name + "</span><a><img alt='' src='http://mobilead.vn/images/x.gif' /></a><input type='hidden' class='superblyTagItemHddId' value='" + catid + "' /></li>");

    var val = $(tagid).val();
    if(val == '')
    {
        $(tagid).val(catid);
    }
    else
    {
        $(tagid).val($(tagid).val() + ',' + catid);
    }

    var new_index = $(tagid).parent('.superblyTagInputItem').parent('.superblyTagItems').children('.superblyTagItem').size()-1;
    $($(tagid).parent('.superblyTagInputItem').parent('.superblyTagItems').children('.superblyTagItem')[new_index]).children('a').click(function(e){
        //var value = $($(this).parent('.superblyTagItem').children('span')[0]).text();
        var value = $($(this).parent('.superblyTagItem').children('.superblyTagItemHddId')).val();
        removeSuggestCat(value, tagid, strInputDefault);
    });
}

// end init caregory
function buildEditLocation()
{
    var arrLocaItem = $('.chkLocation');
    var chkall = true;
    for(var i = 0; i <arrLocaItem.length; i++)
    {
        if(!$(arrLocaItem[i]).attr('checked'))
        {
            chkall = false;
            break;
        }
    }
    if(chkall)
    {
        $('#chkLocationAll').attr('checked', 'checked');
    }
    else
    {
        $('#chkLocationAll').attr('checked', '');
    }
}

function buildEditOs()
{
    var arrOsItem = $('.chkOs');
    var chkall = true;
    var typead = $('#ttypead').val();
    for(var i = 0; i <arrOsItem.length; i++)
    {
        var valOs = $(arrOsItem[i]).val();
        if(!$(arrOsItem[i]).attr('checked'))
        {
            if(typead==1)
            {
                if(valOs!=1&&valOs!=2&&valOs!=3)
                {
                    chkall = false;
                    break;
                }
            }
            else if(typead==4)
            {
                if(valOs==1 || valOs==2 || valOs==3)
                {
                    chkall = false;
                    break;
                }
            }
            else
            {
                chkall = false;
                break;
            }
        }
    }
    if(chkall)
    {
        $('#chkOsAll').attr('checked', 'checked');
    }
    else
    {
        $('#chkOsAll').attr('checked', '');
    }
}

function buildEditMan()
{
    var arrManuItem = $('.chkManu');
    var chkall = true;
    var typead = $('#ttypead').val();
    for(var i = 0; i <arrManuItem.length; i++)
    {
        var valMan = $(arrManuItem[i]).val();
        if(!$(arrManuItem[i]).attr('checked'))
        {
            if(typead==1)
            {
                if(valMan!=1&&valMan!=2&&valMan!=3&&valMan!=7&&valMan!=8)
                {
                    chkall = false;
                    break;
                }
            }
            else if(typead==4)
            {
                chkall = false;
                break;
            }
            else
            {
                chkall = false;
                break;
            }
        }
    }
    if(chkall)
    {
        $('#chkManuAll').attr('checked', 'checked');
    }
    else
    {
        $('#chkManuAll').attr('checked', '');
    }
}

function builTextCount(txtId, countId, limit)
{
    var tex = $(txtId).val();
    var len = tex.length;
    $(countId).html(limit-len);
}

function builStyleCount(countId, numCurr, limit)
{
    $(countId).html(limit - numCurr);
}
// end for new



// payment
function payment_checkout()
{
    var price = $.trim($('#txtPrice').val());

    price = price.replace(/,/g, '');

    var chkPrice = true;
    if(!isIntNumber(price) || (parseInt(price) < 50000))
    {
        $('#txtPrice').next('span').html(payment_lang['msg_50000']);
        chkPrice = false;
    }
    else
    {
        $('#txtPrice').next('span').html('');
        chkPrice = true;
    }

    if(chkPrice)
    {
        $('#frmCheckOut').submit();
    }
}
// end payment


// create account
function account_checkuname()
{
    var uname = $.trim($('#username').val());
    var onSuccess = function(data)
    {
        var objData = jQuery.parseJSON(data);
        var chk = $.trim(objData.chk);
        if(chk.length > 0)
        {
            $('#uname_check').show();
            $('#errorUsername').show();
            $('#errorUsername').html(chk);
            $('#username').addClass('error-border');
        }
        else
        {
            $('#errorUsername').hide();
            $('#uname_check').hide();
            $('#username').removeClass('error-border');
        }
    };

    getAjax(makeSiteUrl('account/checkuname/?uname=' + uname), '', '', '', '', false, onSuccess);
}

function account_checkemail()
{
    var email = $.trim($('#email').val());
    var onSuccess = function(data)
    {
        var objData = jQuery.parseJSON(data);
        var chk = $.trim(objData.chk);
        if(chk == 0)
        {
            $('#errorEmail').show();
            $('#errorEmail').html(account_lang['email_exists']);
            $('#email').addClass('error-border');
        }
        else
        {
            $('#errorEmail').hide();
            $('#email').removeClass('error-border');
        }
    };

    getAjax(makeSiteUrl('account/checkemail/?email=' + email), '', '', '', '', false, onSuccess);
}

function phonenumber_validate(str)
{
    if (!isNaN(str)) return true;
    return false;
}

function signup_check()
{
    //account_checkuname(); account_checkemail();
    var uname = $.trim($('#username').val());
    var pass = $.trim($('#password').val());
    var repass = $.trim($('#repassword').val());

    var fullname = $.trim($('#fullname').val());

    var email = $.trim($('#email').val());

    var phone = $.trim($('#phone').val());
    var address = $.trim($('#address').val());

    var uname_error = validateUsername(uname);
    var pass_error = validatePassword(pass);
    var email_error = validateEmail(email);

    var captcha = $.trim($('#aCaptcha').val());
    var term = $('#cbPolicy:checked').val();

    if(uname_error == '') uname_error = $.trim($('#errorUsername').val());
    if(email_error == '') email_error = $.trim($('#errorEmail').val());

    var chkUserName = true;
    if(uname_error != '')
    {
        $('#errorUsername').html(uname_error);
        $('#errorUsername').show();
        $('#username').addClass('error-border');
        chkUserName = false;
    }
    else
    {
        $('#errorUsername').hide();
        $('#username').removeClass('error-border');
        chkUserName = true;
    }

    var chkPass = true;
    if(pass == '' || repass == '')
    {
        $('#errorPassword').html(account_lang['enter_pass']);
        $('#errorPassword').show();
        $('#password').addClass('error-border');
        chkPass = false;
    }
    else if(pass != repass)
    {
        $('#errorPassword').html(account_lang['pass_not_match']);
        $('#errorPassword').show();
        $('#password').addClass('error-border');
        $('#repassword').addClass('error-border');
        chkPass = false;
    }
    else if( pass.length < 6 || pass.length > 64)
    {
        $('#errorPassword').html(account_lang['pass_short']);
        $('#errorPassword').show();
        $('#password').addClass('error-border');
        chkPass = false;
    }
    else
    {
        $('#errorPassword').hide();
        $('#password').removeClass('error-border');
        $('#repassword').removeClass('error-border');
        chkPass = true;
    }

    var chkEmail = true;
    if(email_error != '')
    {
        $('#errorEmail').html(email_error);
        $('#errorEmail').show();
        $('#email').addClass('error-border');
        chkEmail = false;
    }
    else
    {
        $('#errorEmail').hide();
        $('#email').removeClass('error-border');
        chkEmail = true;
    }

    var chkFullName = true;
    if(fullname == '')
    {
        $('#errorFullname').html(account_lang['enter_fullname']);
        $('#errorFullname').show();
        $('#fullname').addClass('error-border');
        chkFullName = false;
    }
    else
    {
        $('#errorFullname').hide();
        $('#fullname').removeClass('error-border');
        chkFullName = true;
    }

    var chkPhone = true;
    if(phone == '')
    {
        $('#errorPhone').html(account_lang['enter_phone']);
        $('#errorPhone').show();
        $('#phone').addClass('error-border');
        chkPhone = false;
    }
    else if (!phonenumber_validate(phone))
    {
        $('#errorPhone').html(account_lang['phone_not_type']);
        $('#errorPhone').show();
        $('#phone').addClass('error-border');
        chkPhone = false;
    }
    else
    {
        $('#errorPhone').hide();
        $('#phone').removeClass('error-border');
        chkPhone = true;
    }

    //check captcha
    var chkCaptcha = true;
    if(captcha == '')
    {
        $('#errorCaptcha').html(account_lang['enter_captcha']);
        $('#errorCaptcha').show();
        $('#aCaptcha').addClass('error-border');
        chkCaptcha = false;
    }
    else
    {
        $('#errorCaptcha').hide();
        $('#aCaptcha').removeClass('error-border');
        chkCaptcha = true;
    }

    //Check term
    var chkTerm = true;
    if(term != '1')
    {
        $('#errorTerm').html(account_lang['enter_terms']);
        $('#errorTerm').show();
        chkTerm = false;
    }
    else
    {
        $('#errorTerm').hide();
        chkTerm = true;
    }

    if(chkUserName && chkPass && chkEmail && chkFullName && chkPhone && chkCaptcha && chkTerm)
    {
        $('#frmSignUp').submit(); return;
        // use ajax
        var dataString = 'username='+uname+'&password='+pass+'&repassword='+repass+'&fullname='+fullname+'&email='+email+'&phone='+phone+'&address='+address+'&aCaptcha='+captcha+'&callback=1';
        var onSuccess = function(data)
        {
            //Show popup
            if(data != ''){
                var objData = jQuery.parseJSON(data);
                //alert(objData.captcha);
                if(!objData.captcha)
                {
                    $('#errorCaptcha').html(objData.captcha_msg);
                    $('#errorCaptcha').show();
                    $('#aCaptcha').addClass('error-border');
                    return false;
                }

                var chk = $.trim(objData.chk);
                $('body').append(chk+'<div id="fade"></div>');
                $('#fade').css({'filter' : 'alpha(opacity=80)'}).fadeIn();

                $(document).ready(function() {
                    $('#fade').click(function() {
                        $('#fade').fadeOut();
                        return false;
                    });
                });
            }
        };
        account_checkuname(); account_checkemail();
        getAjax(makeSiteUrl('account/signup'),dataString,'','POST','',false,onSuccess);
    }
}

function account_update_check()
{
    var pass = $.trim($('#newpassword').val());
    var repass = $.trim($('#newrepassword').val());

    var fullname = $.trim($('#fullname').val());

    var email = $.trim($('#email').val());
    var email_error = validateEmail(email);

    var chkPass = true;
    if(pass != '')
    {
        var pass_error = validatePassword(pass);
        if(pass != repass)
        {
            $('#errorPassword').html('The passwords you entered do not match. Please try again.');
            $('#errorPassword').show();
            $('#newpassword').addClass('error-border');
            $('#newrepassword').addClass('error-border');
            chkPass = false;
        }
        else if( pass.length < 6 || pass.length > 64)
        {
            $('#errorPassword').html("The password is the wrong length.");
            $('#errorPassword').show();
            $('#newpassword').addClass('error-border');
            chkPass = false;
        }
        else
        {
            $('#errorPassword').hide();
            $('#newpassword').removeClass('error-border');
            $('#newrepassword').removeClass('error-border');
            chkPass = true;
        }
    }

    var chkEmail = true;
    if(email_error != '')
    {
        $('#errorEmail').html(email_error);
        $('#errorEmail').show();
        $('#email').addClass('error-border');
        chkEmail = false;
    }
    else
    {
        $('#errorEmail').hide();
        $('#email').removeClass('error-border');
        chkEmail = true;
    }

    var chkFullName = true;
    if(fullname == '')
    {
        $('#errorFullname').html('Please enter your fullname.');
        $('#errorFullname').show();
        $('#fullname').addClass('error-border');
        chkFullName = false;
    }
    else
    {
        $('#errorFullname').hide();
        $('#fullname').removeClass('error-border');
        chkFullName = true;
    }

    if(chkPass && chkEmail && chkFullName)
    {
        $('#frmChangeInfo').submit();
    }
}

function account_lostpass()
{
    var email = $.trim($('#email').val());
    var email_error = validateEmail(email);

    var chkEmail = true;
    if(email_error != '')
    {
        $('#errorEmail').html(email_error);
        $('#errorEmail').show();
        $('#email').addClass('error-border');
        chkEmail = false;
    }
    else
    {
        $('#errorEmail').hide();
        $('#email').removeClass('error-border');
        chkEmail = true;
    }
    if(chkEmail)
    {
        $('#frmLostPass').submit();
    }
}
// end creae account


/* tool tip */
function toannh_tooltip(e, strTipTitle, strTipBody, width, xOffset, yOffset)
{
    width = (typeof(width) === 'undefined' || width === '') ? 200 : width;
    xOffset = (typeof(xOffset) === 'undefined' || xOffset === '') ? 40 : xOffset;
    yOffset = (typeof(yOffset) === 'undefined' || yOffset === '') ? 0 : yOffset;

    if(strTipTitle != '' || strTipBody != '')
    {
        $('#toannh-tooltip').width(width);
        $("#toannh-tooltip-title").html(strTipTitle);
        $("#toannh-tooltip-body").html(strTipBody);

        var ttipW = $('#toannh-tooltip').width();
        var ttipH = $('#toannh-tooltip').height();

        if((ttipW/ttipH) < 3)
        {
            ttipW = ttipH * 3;
            ttipW = (ttipW > 450) ? 450 : ttipW;
            $('#toannh-tooltip').width(ttipW);
        }
        var pos = $(e).offset();
        var eWidth = $(e).outerWidth();
        var eHeight = $(e).outerHeight();

        $("#toannh-tooltip").css('z-index','-1000000001');
        $("#toannh-tooltip").show();

        var ttop = pos.top + yOffset + eHeight;
        var tleft = pos.left - xOffset;
        var arrowPosLeft = xOffset - ($('#toannh-tooltip-arrow').outerWidth() / 2) + (eWidth / 2);

        var wheight = $(window).height();
        var wWidth = $(window).width();

        var tooltipHeight = $('#toannh-tooltip').outerHeight();
        var tooltipWidth = $('#toannh-tooltip').outerWidth();

        if(tleft + tooltipWidth > wWidth)
        {
            var tmp = tleft + tooltipWidth - wWidth;
            tleft -= tmp;
            arrowPosLeft = arrowPosLeft + tmp;
        }
        $('#toannh-tooltip-arrow').css("left", arrowPosLeft + "px");
        $("#toannh-tooltip").css("top",ttop + "px");
        $("#toannh-tooltip").css("left",tleft + "px");
        $("#toannh-tooltip").css('z-index','1000000001');
    }
}

function removeToannh_Tooltip()
{
    $("#toannh-tooltip").css('display','none');
    $("#toannh-tooltip-title").html('');
    $("#toannh-tooltip-body").html('');
}

function toannh_tooltip2(e, strTipTitle, strTipBody, width, xOffset, yOffset, isFixWidth)
{
    width = (typeof(width) === 'undefined' || width === '') ? 200 : width;
    xOffset = (typeof(xOffset) === 'undefined' || xOffset === '') ? 40 : xOffset;
    yOffset = (typeof(yOffset) === 'undefined' || yOffset === '') ? 0 : yOffset;

    isFixWidth = (typeof(yOffset) === 'isFixWidth' || yOffset === '') ? false : isFixWidth;

    if(strTipTitle != '' || strTipBody != '')
    {
        $('#toannh-tooltip2').width(width);
        $("#toannh-tooltip-title2").html(strTipTitle);
        $("#toannh-tooltip-body2").html(strTipBody);

        var ttipW = $('#toannh-tooltip2').width();
        var ttipH = $('#toannh-tooltip2').height();

        if(!isFixWidth)
        {
            if((ttipW/ttipH) < 3)
            {
                ttipW = ttipH * 3;
                ttipW = (ttipW > 450) ? 450 : ttipW;
                $('#toannh-tooltip2').width(ttipW);
            }
        }
        var pos = $(e).offset();
        var eWidth = $(e).outerWidth();
        var eHeight = $(e).outerHeight();

        $("#toannh-tooltip2").css('z-index','-1000000001');
        $("#toannh-tooltip2").show();

        var tooltipHeight = $('#toannh-tooltip2').outerHeight();
        var tooltipWidth = $('#toannh-tooltip2').outerWidth();

        var ttop = pos.top - yOffset - tooltipHeight;

        var tleft = pos.left - xOffset;
        var arrowPosLeft = xOffset - ($('#toannh-tooltip-arrow-down').outerWidth() / 2) + (eWidth / 2);

        var wheight = $(window).height();
        var wWidth = $(window).width();

        if(tleft + tooltipWidth > wWidth)
        {
            var tmp = tleft + tooltipWidth - wWidth;
            tleft -= tmp;
            arrowPosLeft = arrowPosLeft + tmp;
        }
        $('#toannh-tooltip-arrow-down').css("left", arrowPosLeft + "px");
        $("#toannh-tooltip2").css("top",ttop + "px");
        $("#toannh-tooltip2").css("left",tleft + "px");
        $("#toannh-tooltip2").css('z-index','1000000001');
    }
}

function removeToannh_Tooltip2()
{
    $("#toannh-tooltip2").css('display','none');
    $("#toannh-tooltip-title2").html('');
    $("#toannh-tooltip-body2").html('');
}

function tooltip_preview (e, boxId, xOffset, yOffset)
{
    $('.ttip-ad-preview').hide();
    xOffset = (typeof(xOffset) === 'undefined' || xOffset === '') ? 40 : xOffset;
    yOffset = (typeof(yOffset) === 'undefined' || yOffset === '') ? 0 : yOffset;

    var ttipW = $(boxId).width();
    var ttipH = $(boxId).height();
    var pos = $(e).offset();
    var eWidth = $(e).outerWidth();
    var eHeight = $(e).outerHeight();

    $(boxId).css('z-index','-1000010');
    $(boxId).show();

    var ttop = pos.top + yOffset + eHeight;
    var tleft = pos.left - xOffset;
    var arrowWidth = $(boxId).children('.ttip-ad-preview-arrow').outerWidth();
    var arrowPosLeft = xOffset - (arrowWidth / 2) + (eWidth / 2);

    var wheight = $(window).height();
    var wWidth = $(window).width();
    var tooltipHeight = $(boxId).outerHeight();
    var tooltipWidth = $(boxId).outerWidth();

    if(tleft + tooltipWidth > wWidth)
    {
        var tmp = tleft + tooltipWidth - wWidth;
        tleft -= tmp;
        arrowPosLeft = arrowPosLeft + tmp;
    }

    $(boxId).find('img.ttip-ad-preview-arrow').css("left", arrowPosLeft + "px");
    $(boxId).css("top",ttop + "px");
    $(boxId).css("left",tleft + "px");
    $(boxId).css('z-index','1000010');
}

function tooltip_preview_remove(boxId)
{
    $(boxId).css('display','none');
}
/* end tool tip */
function notice_tooltip(e, strTipTitle, noticeId, width, xOffset, yOffset,val,pos)
{
    width = (typeof(width) === 'undefined' || width === '') ? 200 : width;
    xOffset = (typeof(xOffset) === 'undefined' || xOffset === '') ? 40 : xOffset;
    yOffset = (typeof(yOffset) === 'undefined' || yOffset === '') ? 0 : yOffset;
    if(strTipTitle != '')
    {
        $('#toannh-tooltip3').width(width);
        $("#toannh-tooltip-title3").html(strTipTitle);
        $("#toannh-tooltip-body3").html($(noticeId).html());
        var ttipW = $('#toannh-tooltip3').width();
        var ttipH = $('#toannh-tooltip3').height();
        if((ttipW/ttipH) < 3)
        {
            ttipW = ttipH * 3;
            ttipW = (ttipW > 450) ? 450 : ttipW;
            $('#toannh-tooltip3').width(ttipW);
        }
        var pos = $(e).offset();
        var eWidth = $(e).outerWidth();
        var eHeight = $(e).outerHeight();
        $("#toannh-tooltip3").css('z-index','-1000000001');
        $("#toannh-tooltip3").show();
        var tooltipHeight = $('#toannh-tooltip3').outerHeight();
        var tooltipWidth = $('#toannh-tooltip3').outerWidth();

        var ttop = pos.top + yOffset + eHeight;
        var tleft = pos.left - xOffset;

        var arrowPosLeft = xOffset - ($('#toannh-tooltip-arrow-down3').outerWidth() / 2) + (eWidth / 2);
        var wheight = $(window).height();
        var wWidth = $(window).width();
        if(tleft + tooltipWidth > wWidth)
        {
            var tmp = tleft + tooltipWidth - wWidth;
            tleft -= tmp;
            arrowPosLeft = arrowPosLeft + tmp;
        }
        $('#toannh-tooltip-arrow-down3').css("left", arrowPosLeft + "px");
        $("#toannh-tooltip3").css("top",ttop + "px");
        $("#toannh-tooltip3").css("left",tleft + "px");
        $("#toannh-tooltip3").css('z-index','1000000001');
    }
    $('#noticetooltip').attr('href', makeSiteUrl('home/editAd/'+val, true));
}
function removeNotice_Tooltip()
{
    $("#toannh-tooltip3").css('display','none');
    $("#toannh-tooltip-title3").html('');
    $("#toannh-tooltip-body3").html('');
}
function edit_check()
{
    var uname = $.trim($('#username').val());
    var pass = $.trim($('#password').val());
    var repass = $.trim($('#repassword').val());
    var fullname = $.trim($('#fullname').val());
    var email = $.trim($('#email').val());
    var phone = $.trim($('#phone').val());
    var address = $.trim($('#address').val());

    var uname_error = validateUsername(uname);
    var pass_error = validatePassword(pass);
    var email_error = validateEmail(email);

    var captcha = $.trim($('#aCaptcha').val());
    var term = $('#cbPolicy:checked').val();

    if(uname_error == '') uname_error = $.trim($('#errorUsername').val());
    if(email_error == '') email_error = $.trim($('#errorEmail').val());


    var chkPass = true;
    if(pass !='' && repass == '')
    {
        $('#errorPassword').html("BÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡n chÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°a nhÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­p MÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­t khÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©u.");
        $('#errorPassword').show();
        $('#password').addClass('error-border');
        chkPass = false;
    }
    else if(pass != repass)
    {
        $('#errorPassword').html('MÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­t khÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©u khÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â´ng trÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¹ng nhau, bÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡n hÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£y thÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â»ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­ lÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡i.');
        $('#errorPassword').show();
        $('#password').addClass('error-border');
        $('#repassword').addClass('error-border');
        chkPass = false;
    }
    else if( pass.length < 6 || pass.length > 64)
    {
        $('#errorPassword').html("MÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­t khÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©u cÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â»ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§a bÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡n quÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ ngÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¯n, ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¹ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â»ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ dÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â i mÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­t khÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â©u tÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â»ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â« 6-64 kÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½ tÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â»ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â±!");
        $('#errorPassword').show();
        $('#password').addClass('error-border');
        chkPass = false;
    }
    else
    {
        $('#errorPassword').hide();
        $('#password').removeClass('error-border');
        $('#repassword').removeClass('error-border');
        chkPass = true;
    }

    var chkEmail = true;
    if(email_error != '')
    {
        $('#errorEmail').html(email_error);
        $('#errorEmail').show();
        $('#email').addClass('error-border');
        chkEmail = false;
    }
    else
    {
        $('#errorEmail').hide();
        $('#email').removeClass('error-border');
        chkEmail = true;
    }

    var chkFullName = true;
    if(fullname == '')
    {
        $('#errorFullname').html('BÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡n chÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°a nhÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­p HÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â»ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½ tÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âªn.');
        $('#errorFullname').show();
        $('#fullname').addClass('error-border');
        chkFullName = false;
    }
    else
    {
        $('#errorFullname').hide();
        $('#fullname').removeClass('error-border');
        chkFullName = true;
    }

    var chkPhone = true;
    if(phone == '')
    {
        $('#errorPhone').html('BÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡n chÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°a nhÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­p SÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â»ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¹ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¹ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“iÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â»ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡n thoÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡i.');
        $('#errorPhone').show();
        $('#phone').addClass('error-border');
        chkPhone = false;
    }
    else if (!phonenumber_validate(phone))
    {
        $('#errorPhone').html('SÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â»ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¹ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¹ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“iÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â»ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡n thoÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡i phÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£i lÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â  dÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ng sÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â»ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¹ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“.');
        $('#errorPhone').show();
        $('#phone').addClass('error-border');
        chkPhone = false;
    }
    else
    {
        $('#errorPhone').hide();
        $('#phone').removeClass('error-border');
        chkPhone = true;
    }

    //check captcha
    var chkCaptcha = true;
    if(captcha == '')
    {
        $('#errorCaptcha').html('BÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡n chÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°a nhÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­p MÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£ chÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â»ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¹ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ng Spam !');
        $('#errorCaptcha').show();
        $('#aCaptcha').addClass('error-border');
        chkCaptcha = false;
    }
    else
    {
        $('#errorCaptcha').hide();
        $('#aCaptcha').removeClass('error-border');
        chkCaptcha = true;
    }

    //Check term
    var chkTerm = true;
    if(term != '1')
    {
        $('#errorTerm').html('BÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡n chÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°a chÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¥p nhÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­n cÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡c ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½iÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â»ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½u khoÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£n, nÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âªn viÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â»ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡c ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â¹ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ng kÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â½ khÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â´ng thÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â»ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ tiÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂºÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿p tÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â»ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¥c');
        $('#errorTerm').show();
        chkTerm = false;
    }
    else
    {
        $('#errorTerm').hide();
        chkTerm = true;
    }

    if(chkUserName && chkPass && chkEmail && chkFullName && chkPhone && chkCaptcha && chkTerm)
    {
        $('#frmSignUp').submit(); return;
        // use ajax
        var dataString = 'username='+uname+'&password='+pass+'&repassword='+repass+'&fullname='+fullname+'&email='+email+'&phone='+phone+'&address='+address+'&aCaptcha='+captcha+'&callback=1';
        var onSuccess = function(data)
        {
            //Show popup
            if(data != ''){
                var objData = jQuery.parseJSON(data);
                if(!objData.captcha)
                {
                    $('#errorCaptcha').html(objData.captcha_msg);
                    $('#errorCaptcha').show();
                    $('#aCaptcha').addClass('error-border');
                    return false;
                }

                var chk = $.trim(objData.chk);
                $('body').append(chk+'<div id="fade"></div>');
                $('#fade').css({'filter' : 'alpha(opacity=80)'}).fadeIn();

                $(document).ready(function() {
                    $('#fade').click(function() {
                        $('#fade').fadeOut();
                        return false;
                    });
                });
            }
        };
        account_checkuname(); account_checkemail();
        getAjax('/account/signup',dataString,'','POST','',false,onSuccess);
    }
}

/* switch user */
function showSuser(obj, eId)
{
    var pos = $(obj).offset();
    var eW = $(eId).outerWidth();
    var tleft = pos.left - eW + 12;
    var ttop = pos.top + 10;

    $(eId).css("top",ttop + "px");
    $(eId).css("left",tleft + "px");
    $(eId).slideToggle(500);
}

function suser(uname, imdLoading, divLoadingBg)
{
    var u = $.trim(uname);
    if(u == '')
    {
        alert(common_lang['switch_user_err']);
        return;
    }

    var onSuccess = function(data)
    {
        disableAjaxLoadingPopup(imdLoading, divLoadingBg);
        var objData = jQuery.parseJSON(data);
        if(objData.r == '1')
        {
            window.location = '/';
            return;
        }
        else
        {
            if(objData.r == '0')
            {
                window.location.reload(true);
                return;
            }
            if(objData.r == '-3')
            {
                alert(common_lang['switch_user_not_found']);
                return;
            }
            else if(objData.r == '-1' || objData.r == '-2')
            {
                alert(common_lang['switch_user_not_right']);
                return;
            }
        }
    };
    var onError = function()
    {
        disableAjaxLoadingPopup(imdLoading, divLoadingBg);
    };
    loadAjaxLoadingPopup(imdLoading, divLoadingBg);
    getAjax(makeSiteUrl('suser/change'), 'u=' + u, '', 'post', '', false, onSuccess, onError);
}

function von_suser(uname, imdLoading, divLoadingBg)
{
    var u = $.trim(uname);
    if(u == '')
    {
        alert(common_lang['switch_user_err']);
        return;
    }

    var onSuccess = function(data)
    {
        disableAjaxLoadingPopup(imdLoading, divLoadingBg);
        var objData = jQuery.parseJSON(data);
        if(objData.r == '1')
        {
            window.location = makeSiteUrl('campaign');
            return;
        }
        else
        {
            if(objData.r == '0')
            {
                window.location.reload(true);
                return;
            }
            if(objData.r == '-3')
            {
                alert(common_lang['switch_user_not_found']);
                return;
            }
            else if(objData.r == '-1' || objData.r == '-2')
            {
                alert(common_lang['switch_user_not_right']);
                return;
            }
        }
    };
    var onError = function()
    {
        disableAjaxLoadingPopup(imdLoading, divLoadingBg);
    };
    loadAjaxLoadingPopup(imdLoading, divLoadingBg);
    getAjax(makeSiteUrl('suser/von_change'), 'u=' + u, '', 'post', '', false, onSuccess, onError);
}


function viewas_suser(url, uname, imdLoading, divLoadingBg)
{
    var u = $.trim(uname);
    if(u == '')
    {
        alert(common_lang['switch_user_err']);
        return;
    }

    var onSuccess = function(data)
    {
        disableAjaxLoadingPopup(imdLoading, divLoadingBg);
        var objData = jQuery.parseJSON(data);
        if(objData.r == '1')
        {
            window.location = makeSiteUrl('banner');
            return;
        }
        else
        {
            if(objData.r == '0')
            {
                window.location.reload(true);
                return;
            }
            if(objData.r == '-3')
            {
                alert(common_lang['switch_user_not_found']);
                return;
            }
            else if(objData.r == '-1' || objData.r == '-2')
            {
                alert(common_lang['switch_user_not_right']);
                return;
            }
        }
    };
    var onError = function()
    {
        disableAjaxLoadingPopup(imdLoading, divLoadingBg);
    };
    loadAjaxLoadingPopup(imdLoading, divLoadingBg);
    getAjax(url, 'u=' + u, '', 'post', '', false, onSuccess, onError);
}

function suser_pager(cPage, groupId, eId, imdLoading, divLoadingBg)
{
    var onSuccess = function(data)
    {
        disableAjaxLoadingPopup(imdLoading, divLoadingBg);
        if($.trim(data) == 'login')
        {
            window.location.reload(true);
            return;
        }
        else
        {
            if($.trim(data) == 'notright')
            {
                alert(common_lang['switch_user_not_right']);
                return;
            }
            else
            {
                $(eId).html(data);
                return;
            }
        }
    };
    var onError = function()
    {
        disableAjaxLoadingPopup(imdLoading, divLoadingBg);
    };
    loadAjaxLoadingPopup(imdLoading, divLoadingBg);
    getAjax(makeSiteUrl('suser/view_paging/' + cPage + '/' + groupId), '', '', '', '', false, onSuccess, onError);
}

function von_suser_pager(cPage, groupId, eId, imdLoading, divLoadingBg)
{
    var onSuccess = function(data)
    {
        disableAjaxLoadingPopup(imdLoading, divLoadingBg);
        if($.trim(data) == 'login')
        {
            window.location.reload(true);
            return;
        }
        else
        {
            if($.trim(data) == 'notright')
            {
                alert(common_lang['switch_user_not_right']);
                return;
            }
            else
            {
                $(eId).html(data);
                return;
            }
        }
    };
    var onError = function()
    {
        disableAjaxLoadingPopup(imdLoading, divLoadingBg);
    };
    loadAjaxLoadingPopup(imdLoading, divLoadingBg);
    getAjax(makeSiteUrl('suser/von_view_paging/' + cPage + '/' + groupId), '', '', '', '', false, onSuccess, onError);
}

function suser_filter(keyId, stypeEId, groupId, eId, imdLoading, divLoadingBg)
{
    var keyword = $.trim($(keyId).val());
    var stype = $.trim($(stypeEId).val());
    var isSearch = (keyword != '') ? true : false;
    if(keyword.length < 3 && keyword.length > 0)
    {
        alert(common_lang['switch_user_snumword_error']);
        $(keyId).focus();
        return;
    }
    var onSuccess = function(data)
    {
        disableAjaxLoadingPopup(imdLoading, divLoadingBg);
        if($.trim(data) == 'login')
        {
            window.location.reload(true);
            return;
        }
        else
        {
            if($.trim(data) == 'notright')
            {
                alert(common_lang['switch_user_not_right']);
                return;
            }
            else
            {
                $(eId).html(data);
                return;
            }
        }
    };
    var onError = function()
    {
        disableAjaxLoadingPopup(imdLoading, divLoadingBg);
    };
    loadAjaxLoadingPopup(imdLoading, divLoadingBg);
    var url = (isSearch) ? makeSiteUrl('suser/search/') : makeSiteUrl('suser/view_paging/1/' + groupId);
    var param = (isSearch) ? 'stype=' + stype + '&g=' + groupId + '&cpage=1&keyword=' + UrlEncode.encode(keyword) : '';
    getAjax(url, param, '', '', '', false, onSuccess, onError);
}

function suser_search_pager(keyId, stypeEId, cPage, groupEId, eId, imdLoading, divLoadingBg)
{
    var keyword = $.trim($(keyId).val());
    var stype = $.trim($(stypeEId).val());
    var groupId = '-1';
    if($(groupEId).length)
    {
        groupId = $.trim($(groupEId).val());
    }

    if(keyword.length < 3)
    {
        alert(common_lang['switch_user_snumword_error']);
        $(keyId).focus();
        return;
    }

    var onSuccess = function(data)
    {
        disableAjaxLoadingPopup(imdLoading, divLoadingBg);
        if($.trim(data) == 'login')
        {
            window.location.reload(true);
            return;
        }
        else
        {
            if($.trim(data) == 'notright')
            {
                alert(common_lang['switch_user_not_right']);
                return;
            }
            else
            {
                $(eId).html(data);
                return;
            }
        }
    };
    var onError = function()
    {
        disableAjaxLoadingPopup(imdLoading, divLoadingBg);
    };
    loadAjaxLoadingPopup(imdLoading, divLoadingBg);

    getAjax(makeSiteUrl('suser/search/'), 'stype=' + stype + '&g=' + groupId + '&cpage=' + cPage + '&keyword=' + UrlEncode.encode(keyword), '', '', '', false, onSuccess, onError);
}
/* end switch user */

/* ub multi */
function bchkAll(obj, divId, chkItemClass, hddId)
{
    var strId = $.trim($(hddId).val());
    var arrId = new Array();
    if(strId != '')
    {
        arrId = strId.split(',');
    }
    if($(obj).attr('checked'))
    {
        var arr = $(divId + ' input.' + chkItemClass);
        jQuery.each(arr, function(){
            var id = $.trim($(this).val());
            if(jQuery.inArray(id,arrId) == -1)
            {
                arrId.push(id);
            }
            $(this).attr('checked', 'checked');
        });
        $(hddId).val(arrId.join(','));
    }
    else
    {
        var arr = $(divId + ' input.' + chkItemClass);
        jQuery.each(arr, function(){
            var id = $.trim($(this).val());
            var index = jQuery.inArray(id,arrId);
            if(index > -1)
            {
                arrId[index] = '';
            }
            $(this).attr('checked', '');
        });
        var str = '';
        $.each(arrId, function(idx, val) {
            if($.trim(arrId[idx]) != '')
            {
                str += (str != '') ? ',' + val : val;
            }
        });

        $(hddId).val(str);
    }
}

function bchkItem(obj, divId, chkAllId, chkItemClass, hddId)
{
    var strId = $.trim($(hddId).val());
    var arrId = new Array();
    if(strId != '')
    {
        arrId = strId.split(',');
    }

    var arr = $(divId + ' input.' + chkItemClass);
    var chkAll = true;
    var num = arr.length;
    for(var i=0; i<num; i++)
    {
        var id = $.trim($(arr[i]).val());
        if($(arr[i]).attr('checked'))
        {
            if(jQuery.inArray(id,arrId) == -1)
            {
                arrId.push(id);
            }
        }
        else
        {
            chkAll = false;
            var index = jQuery.inArray(id,arrId);
            if(index > -1)
            {
                arrId[index] = '';
            }
        }
    }
    if(chkAll)
    {
        $(chkAllId).attr('checked', 'checked');
    }
    else
    {
        $(chkAllId).attr('checked', '');
    }
    var str = '';
    $.each(arrId, function(idx, val) {
        if($.trim(arrId[idx]) != '')
        {
            str += (str != '') ? ',' + val : val;
        }
    });
    $(hddId).val(str);
}

function ubmulti(action, hddEmaId, imgLoadId, divBgLoadId, page, isReload)
{
    isReload = (typeof(isReload) === 'undefined' || isReload === '') ? false : isReload;
    var str = $.trim($(hddEmaId).val());
    var _onSuccess = function(data)
    {
        if(isReload)
        {
            window.location.reload(true);
        }
        else
        {
            dbLoadPage(page, imgLoadId, divBgLoadId);
        }
    };

    var _onError = function()
    {
        disableAjaxLoadingPopup(imgLoadId, divBgLoadId);
    };
    if(str != '')
    {
        loadAjaxLoadingPopup(imgLoadId, divBgLoadId);
        getAjax(makeSiteUrl('banner/emulti'), 'ac=' + action + '&lsb=' + str, '', 'GET', '', false, _onSuccess, _onError);
    }
}

function emainit(divId, chkAllId, chkItemClass, hddId, itemIdPrefix)
{
    var strId = $.trim($(hddId).val());
    if(strId != '')
    {
        var arr = strId.split(',');
        var num = arr.length;
        for(var i = 0; i < num; i++)
        {
            if($.trim(arr[i]) != '')
            {
                $(itemIdPrefix + arr[i]).attr('checked', 'checked');
            }
        }
    }

    var arr = $(divId + ' input.' + chkItemClass);
    var chkAll = true;
    var num = arr.length;
    for(var i=0; i<num; i++)
    {
        if(!$(arr[i]).attr('checked'))
        {
            chkAll = false;
            break;
        }
    }
    if(chkAll && num > 0)
    {
        $(chkAllId).attr('checked', 'checked');
    }
    else
    {
        $(chkAllId).attr('checked', '');
    }
}
/* end ub multi */

/* for promotion website */
function sp_tooltip(obj, content, eId, eInnerId, yOffset)
{
    yOffset = (typeof(yOffset) === 'undefined' || yOffset === '') ? 0 : yOffset;
    $(eInnerId).html(content);
    $(eInnerId).removeClass('pad10').addClass('pad5');
    var objParent = $(obj).parent().parent();
    var pos = $(objParent).offset();
    var tleft = pos.left;
    var w = $(objParent).outerWidth();
    var explH = $(eId).outerHeight();
    var ttop = pos.top - explH;

    ttop += yOffset;
    $(eId).css("top",ttop + "px");
    $(eId).css("left",tleft + "px");
    $(eId).css("width",w + "px");
    $(eId).fadeIn(300);
}
function sp_tooltip_out(eId, eInnerId)
{
    $(eId).fadeOut(300);
    $(eInnerId).html('');
    $(eInnerId).removeClass('pad5').addClass('pad10');
}
/* end for promotion website */
function step1_desUrlKeyUp(eId, errEId)
{
    var tex = $.trim($(eId).val());
    if(tex == '')
    {
        step1ErrorDesUrl(true);
        $('#step1_domain').html('');
        $('#review_url').html('http://www.yourwebsite.com/');
    }
    else
    {
        if(!(isUrl(tex) || androidMarketUrlValid(tex)))
        {
            step1ErrorDesUrl(true);
            $("a#s1ReviewBuy1").attr("href", $('#desUrl').val());
            $("a#review_buy").attr("href", $('#desUrl').val());
            $("a.sponsor-btn-url").attr("href", $('#desUrl').val());
            $('#step1_domain').html($('#desUrl').val());
            $('#review_url').html($('#desUrl').val());
        }
        else
        {
            step1ErrorDesUrl(false);
            $("a#s1ReviewBuy1").attr("href", $('#desUrl').val());
            $("a#review_buy").attr("href", $('#desUrl').val());
            $("a.sponsor-btn-url").attr("href", $('#desUrl').val());
            $('#step1_domain').html(getDomainFromUrl($('#desUrl').val()));
            $('#review_url').html(getDomainFromUrl($('#desUrl').val()));
            $('.sponsor-domain').html(getDomainFromUrl($('#desUrl').val()));
        }
    }
}
function step1ErrorBodyText(isShow)
{
    if(isShow)
    {
        $('#step1BodyText').addClass('error-border');
        $('#errorBodyText').show();
    }
    else
    {
        $('#step1BodyText').removeClass('error-border');
        $('#errorBodyText').hide();
    }
}
function step1btnText(isShow)
{
    if(isShow)
    {
        $('#txtbutton').addClass('error-border');
        $('#errorbtnText').show();
    }
    else
    {
        $('#txtbutton').removeClass('error-border');
        $('#errorbtnText').hide();
    }
}
function step1_continue_click_cpm()
{
    var desUrl = $.trim($('#desUrl').val());
    var chkUrl = true;
    var opvideo = $('#chkVid').attr('checked') ? true : false;
    if(!(isUrl(desUrl) || androidMarketUrlValid(desUrl)) || desUrl == '')
    {
        step1ErrorDesUrl(true);
        chkUrl = false;
    }
    else
    {
        step1ErrorDesUrl(false);
        chkUrl = true;
    }

    var title = $.trim($('#title').val());
    var chkTitle = true;
    if(title == '')
    {
        step1ErrorTitle(true);
        chkTitle = false;
    }
    else
    {
        step1ErrorTitle(false);
        chkTitle = true;
    }

    var imageFile = $.trim($('#hddFileName300').val());
    var imgSrc = $.trim($('#step1_suggest_image').attr('src'));
    var chkImg = true;
    if(imageFile == '' || imgSrc == '')
    {
        step1ErrorImage(true);
        chkImg = false;
    }
    else
    {
        step1ErrorImage(false);
        chkImg = true;
    }

    // video
    var videoFile = $.trim($('#hddFileVideo40').val());
    var videoSrc = $.trim($('#step1_suggest_video').attr('src'));
    var chkVideo = true;
    if(opvideo)
    {
        if(videoFile == '' || videoSrc == '')
        {
            step1ErrorVideo(true);
            chkVideo = false;
        }
        else
        {
            step1ErrorVideo(false);
            chkVideo = true;
        }
    }

    if(chkUrl && chkImg && chkTitle && chkVideo)
    {
        $('#step1_continue').hide();
        updateLocationReview();
        updateOsReview();
        updateManuReview();
        $('#divStep2').show();
        showDivEstimate();
        move2Step('#divStep2', 1000);
    }
}
function step1_continue_click_popup_catfish()
{
    var typead = parseInt($.trim($('#typead').val()));
    var desUrl = $.trim($('#desUrl').val());
    var chkUrl = true;
    var b3rd = $('#b3rd').attr('checked') ? true : false;
    var opvideo = $('#chkVid').attr('checked') ? true : false;
    if(!(isUrl(desUrl) || androidMarketUrlValid(desUrl)) || desUrl == '')
    {
        step1ErrorDesUrl(true);
        chkUrl = false;
    }
    else
    {
        step1ErrorDesUrl(false);
        chkUrl = true;
    }

    var title = $.trim($('#title').val());
    var chkTitle = true;
    if(title == '')
    {
        step1ErrorTitle(true);
        chkTitle = false;
    }
    else
    {
        step1ErrorTitle(false);
        chkTitle = true;
    }

    // image
    var imageFile = $.trim($('#hddFileName40').val());
    var imgSrc = $.trim($('#step1_suggest_image').attr('src'));
    var chkImg = true;
    if(imageFile == '' || imgSrc == '')
    {
        step1ErrorImage(true);
        chkImg = false;
    }
    else
    {
        step1ErrorImage(false);
        chkImg = true;
    }

    // video
    var videoFile = $.trim($('#hddFileVideo40').val());
    var videoSrc = $.trim($('#step1_suggest_video').attr('src'));
    var chkVideo = true;
    if(opvideo)
    {
        if(videoFile == '' || videoSrc == '')
        {
            step1ErrorVideo(true);
            chkVideo = false;
        }
        else
        {
            step1ErrorVideo(false);
            chkVideo = true;
        }
    }

    /*
     * config with format inpage
     */
    var chkImg_2 = true;
    if(typead == 14)
    {
        var imageFile_2 = $.trim($('#hddFileName_verti').val());
        var imgSrc_2 = $.trim($('#step2_suggest_image').attr('src'));
        var chkImg_2 = true;
        if(imageFile_2 == '' || imgSrc_2 == '')
        {
            step1ErrorImage_2(true);
            chkImg_2 = false;
        }
        else
        {
            step1ErrorImage_2(false);
            chkImg_2 = true;
        }
    }
    /*
     * end
     */
    var chk3rd = true;

    if(b3rd==true)
    {
        // htmlcode banner
        var htmlcode = $('#chkAdSelf').attr('checked');
        if(htmlcode)
        {
            var htmlcode = $.trim($('#htmlcode').val());
            if(htmlcode == '')
            {
                step1ErrorHtmlCode(true);
                chk3rd = false;
            }
            else
            {
                step1ErrorHtmlCode(false);
                chk3rd = true;
            }
        }

        // tracking view only
        var trkview = $('#chkTrackUrl').attr('checked');
        if(trkview)
        {
            var strTrkview = $.trim($('#trackurl').val());
            if(strTrkview == '')
            {
                step1ErrorTrkView(true);
                chk3rd = false;
            }
            else
            {
                step1ErrorTrkView(false);
                chk3rd = true;
            }
        }

        var mscript = $('#chkScript').attr('checked');
        if(mscript)
        {
            var strScript = $.trim($('#mscript').val());
            if(strScript == '')
            {
                step1ErrorScript(true);
                chk3rd = false;
            }
            else
            {
                step1ErrorScript(false);
                chk3rd = true;
            }
        }
    }

    if(chkUrl && chkImg && chkTitle && chkImg_2 && chk3rd && chkVideo)
    {
        $('#step1_continue').hide();
        updateLocationReview();
        updateOsReview();
        updateManuReview();
        $('#divStep2').show();
        showDivEstimate();
        move2Step('#divStep2', 1000);
    }
}

function slcBannerChange(bid, maxTitle, maxBody, maxbutton, maxbtnote, maxbrand)
{
    if(parseInt(bid) > 0)
    {
        var onSuccess = function(data)
        {
            $('#imgCopyAdLoading').css('display','none');
            var objData = jQuery.parseJSON(data);
            var title = $.trim(stripHtmlTags(objData.title));
            var btext = $.trim(stripHtmlTags(objData.desc));
            var buttontext = ((objData.buttonname) != null && (objData.buttonname) != 0)  ? $.trim(stripHtmlTags(objData.buttonname)) : '';
            var btnote = ((objData.btnnote) != null && (objData.btnnote) != 0)  ? $.trim(stripHtmlTags(objData.btnnote)) : '';
            var url = $.trim(objData.url);
            var filePath = $.trim(objData.img);
            var fileName = $.trim(objData.filename);
            var filelogo = $.trim(objData.filelogo);
            var filelogopath = $.trim(objData.filelogopath);
            var brand_name = $.trim(objData.brand_name);
            var star_view = $.trim(objData.star_view);
            var button_view = $.trim(objData.button_view);
            $('input:radio[name=btton_view][value=' + button_view + ']').attr('checked', true);

            var typead = $.trim($('#typead').val());
            var tagging = $.trim(objData.pdtagging);
            $('#keyword').val(tagging);
            slcbtChange('btton_view', '.bgr_button');
            if((typead==2 || typead==9) && star_view>0)
            {
                $('#slc_suggest_star').html('').rating('', {maxvalue:5, curvalue:star_view});
                $('#chkstarBox').attr('checked', 'checked');
                $('#slc_suggest_star').show();
                fill_star(star_view);
            }
            else
            {
                $('#chkstarBox').attr('checked', false);
                $('#slc_suggest_star').hide();
                $('#step1_suggest_star').hide();
                $('#review_suggest_star').hide();
                $('.suggest_star_fnew').hide();
            }

            (typead == 5 || typead == 8) ? $('.sponsor-domain').html(getDomainFromUrl(url)) : '';

            $('#desUrl').val(url);
            if(url != '')
            {
                $('#errorDesUrl').hide();
            }
            else
            {
                $('#errorDesUrl').show();
            }

            $('#step1_suggest_title').html(title);
            $('#review_suggest_title_fnew').html(title);
            $('#title').val(title);
            if(title != '')
            {
                $('#errorTitle').hide();
            }
            else
            {
                $('#errorTitle').show();
            }

            $('#step1_suggest_body').html(btext);
            $('#step1BodyText').val(btext);
            $('#review_suggest_body_fnew').html(btext);

            if(btext != '')
            {
                $('#errorBodyText').hide();
            }
            else
            {
                $('#errorBodyText').show();
            }
            //button
            if(buttontext != ''){
                $('#s1ReviewBuy1').html(buttontext);
                $('#txtbutton').val(buttontext);
                $('#button_name').html(buttontext);
                $('#review_button_name').html(buttontext);
                $('#review_buy').html(buttontext);
            }
            else
            {
                $('#review_buy').hide();
            }

            //button note
            if(btnote != ''){
                $('#sponsor-btn-note').show();
                $('#btn-note').html(btnote);
                $('#txtbtnote').val(btnote);
                $('#sponsor-btn-note-review').show();
                $('#btn-note-review').html(btnote);
                $('.sponsor-btn-content').removeClass('sponsor-btn-name-not-note');
            }
            else
            {
                $('#sponsor-btn-note').hide();
                $('#txtbtnote').val('');
                $('#sponsor-btn-note-review').hide();
                $('.sponsor-btn-content').addClass('sponsor-btn-name-not-note');
            }

            if(filePath != '')
            {
                $('#step1_suggest_image').attr('src', filePath).show();
                $('#step1_suggest_image_fnew').attr('src', filePath).show();
                $('#review_image').attr('src', filePath).show();
                $('#review_suggest_image_fnew').attr('src', filePath).show();
                $('#hddFileName40').val(fileName);
                $('#hddFileName300').val(fileName);
                $('#errorStep1Image').hide();
            }

            if(brand_name=='')
            {
                $('#brand-name').val('');
                $('#hddbrandname').val('');
                $('#review_suggest_brand_name').html('');
                $('#review_suggest_brand_name_fnew').html('');
                $('#step1_suggest_brand_name_fnew').html('');
                $('#step1_suggest_brand_name').html('');
                $('#brand-limit').html(maxbrand);
            }
            else
            {
                $('#step1_suggest_brand_name').html(brand_name);
                $('#step1_suggest_brand_name_fnew').html(brand_name);
                $('#brand-name').val(brand_name);
                $('#hddbrandname').val(brand_name);
                $('#review_suggest_brand_name').html(brand_name);
                $('#review_suggest_brand_name_fnew').html(brand_name);
            }

            if(typead==9  || typead==13 || typead==5 || typead==8)
            {
                if(filelogopath=='')
                {
                    $('#hddlogoFileName').val('');
                    $('#step1_suggest_image_logo').attr('src', '').hide();
                    $('#review_suggest_image_logo').attr('src', '').hide();
                }
                else
                {
                    $('#step1_suggest_image_logo').attr('src', filelogopath).show();
                    $('#step1_suggest_image_logo_fnew').attr('src', filelogopath).show();
                    $('#hddlogoFileName').val(filelogo);
                    $('#review_image').attr('src', filelogopath).show();
                    $('#review_suggest_image_logo_fnew').attr('src', filelogopath).show();
                    $('#errorStep1Logo').hide();
                    conner(filelogopath);
                }

                if(typead==13 || typead==5 || typead==8)
                {
                    var txtbutton = $('#txtbutton').val();
                    var chkbt = txtbutton=='' ? true:false;
                    step1ErrorButton(chkbt);
                    var txtbrand = $('#brand-name').val();
                    var chkbr = txtbrand=='' ? true:false;
                    step1ErrorBrand(chkbr);
                }
            }
            else if(typead==14) // inpage 2 image 1280x640 && 640x1280
            {
                var fileVertical = filelogo;
                var fileVerticalpath = filelogopath;

                if(fileVerticalpath=='')
                {
                    $('#hddFileName_verti').val('');
                    $('#step2_suggest_image').attr('src', '').hide();
                }
                else
                {
                    $('#step2_suggest_image').attr('src', fileVerticalpath).show();
                    $('#hddFileName_verti').val(fileVertical).show();
                }
            }

            updateCountLimit('t', maxTitle);
            updateCountLimit('b', maxBody);
            if(brand_name!='')
            {
                updateCountLimit('br', maxbrand);
            }

            if(maxbutton!='undefined')
            {
                updateCountLimit('bt', maxbutton);
            }
            if(maxbtnote!='undefined')
            {
                updateCountLimit('btnote', maxbtnote);
            }
            if(maxbrand!='undefined')
            {
                updateCountLimit('br', maxbrand);
            }
            updateStep1Review();
        };

        var onError = function(jqXHR, textStatus, errorThrown)
        {
            $('#imgCopyAdLoading').css('display','none');
        };

        var onComplete = function(jqXHR, textStatus)
        {
            $('#imgCopyAdLoading').css('display','none');
        };

        $('#imgCopyAdLoading').css('display','');
        getAjax(makeSiteUrl('home/suggest_banner/') + bid, '', '', '', '', false, onSuccess, onError, onComplete);
    }
}

function slcBannerActive(bid, maxTitle)
{
    if(parseInt(bid) > 0)
    {
        var onSuccess = function(data)
        {
            $('#imgCopyAdLoading').css('display','none');
            var objData = jQuery.parseJSON(data);
            var title = $.trim(stripHtmlTags(objData.title));
            var url = $.trim(objData.url);

            $('#desUrl').val(url);
            if(url != '')
            {
                $('#errorDesUrl').hide();
            }
            else
            {
                $('#errorDesUrl').show();
            }

            $('#step1_suggest_title').html(title);
            $('#title').val(title);
            if(title != '')
            {
                $('#errorTitle').hide();
            }
            else
            {
                $('#errorTitle').show();
            }

            updateCountLimit('t', maxTitle);
            updateStep1Review();
        };

        var onError = function(jqXHR, textStatus, errorThrown)
        {
            $('#imgCopyAdLoading').css('display','none');
        };

        var onComplete = function(jqXHR, textStatus)
        {
            $('#imgCopyAdLoading').css('display','none');
        };

        $('#imgCopyAdLoading').css('display','');
        getAjax(makeSiteUrl('home/suggest_url/') + bid, '', '', '', '', false, onSuccess, onError, onComplete);
    }
}

function tracking_url_view_sponsor(obj, eid)
{
    if($(obj).attr('checked'))
    {
        $(eid).show();
        $('#chkAdSelf').attr('disabled', true);
    }
    else
    {
        $(eid).hide();
        $('#chkAdSelf').attr('disabled', false);
    }
}

function tracking_url_view(obj, eid, hid, sid)
{
    if($(obj).attr('checked'))
    {
        $(eid).show();
        $(hid).hide();
        $(sid).hide();
    }
}

function cpa_tracking_view(obj, eid)
{
    if($(obj).attr('checked'))
    {
        $(eid).show();
    }
    else
    {
        $(eid).hide();
    }
}

function validTrackViewUrl(id, errorId)
{
    var trackUrl = $.trim($(id).val());
    if(trackUrl != '')
    {
        if(isUrl(trackUrl) && validTrackingViewUrl(trackUrl))
        {
            $(errorId).hide();
        }
        else
        {
            $(errorId).show();
            $(id).focus();
        }
    }
    else
    {
        $(errorId).hide();
    }
}

function validTrackingViewUrl(urlStr)
{
    if (urlStr.indexOf(' ') != -1) {
        return false;
    }

    if (urlStr == '' || urlStr == null) {
        return false;
    }

    var RegexUrl=/(https|http):\/\/(www\.)?bs\.serving-sys\.com\/?/i;
    var RegexUrlDoubleclick=/(https|http):\/\/(www\.)?ad\.doubleclick\.net\/?/i;
    var RegexUrlInnity=/(https|http):\/\/(www\.)?avn\.innity\.com\/?/i;
    var RegexUrlAtdmt=/(https|http):\/\/(www\.)?view\.atdmt\.com\/?/i;
    var RegexUrlADAtdmt=/(https|http):\/\/(www\.)?ad\.atdmt\.com\/?/i;
    var RegexUrlDtracker=/(https|http):\/\/(www\.)?dtracker\.net\/?/i;
    var RegexUrlBlueserving=/(https|http):\/\/(www\.)?blueserving\.com\/?/i;
    var RegexUrlakanetwork=/(https|http):\/\/(www\.)?data\.akanetwork\.com\/?/i;
    var RegexUrluserreport=/(https|http):\/\/(www\.)?visitanalytics\.userreport\.com\/?/i;

    var chkBsServing = false;
    if(RegexUrl.test(urlStr) || RegexUrlDoubleclick.test(urlStr) || RegexUrluserreport.test(urlStr) || RegexUrlInnity.test(urlStr) || RegexUrlAtdmt.test(urlStr) || RegexUrlDtracker.test(urlStr) || RegexUrlBlueserving.test(urlStr) || RegexUrlADAtdmt.test(urlStr) || RegexUrlakanetwork.test(urlStr)){
        chkBsServing = true;
    }else{
        chkBsServing = false;
    }

    var chk = (chkBsServing) ? true : false;
    return chk;
}

function numberKeyOnly(evt)
{
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
}

function mob_get_banner_report(url, fdate, tdate)
{
    var numitem = parseInt($('#pagesize').val());
    var arrbannerId = $('.tbl-list .bannerid');
    var page = parseInt($('#bannerpage').val());
    var total = arrbannerId.length;
    var ttimp = 0;
    var ttcl = 0;

    var start = (page - 1) * numitem;
    var end = ((start + numitem) <= total) ? (start + numitem) : total;

    var strbannerid = '';
    for(var i = start; i < end; i++)
    {
        strbannerid += (strbannerid == '') ? $.trim($(arrbannerId[i]).html()) : ',' + $.trim($(arrbannerId[i]).html());
    }

    var _onSuccess = function(data)
    {
        data = $.trim(data);
        if(data == 'unlogin' || data == 'notright')
        {
            window.location.reload(true);
            return;
        }
        else if(data == 'empty')
        {
            if(end < total)
            {
                //mob_get_banner_report(url, fdate, tdate);
            }
            else
            {
                for(var i = start; i < end; i++)
                {
                    var bannerid = $.trim($(arrbannerId[i]).html());
                    $('#banner_clicks_' + bannerid).html('N/A');
                    $('#banner_impressions_' + bannerid).html('N/A');
                    $('#banner_ctr_' + bannerid).html('N/A');
                }
            }
        }
        else
        {
            var obj = jQuery.parseJSON(data);
            for(var i = start; i < end; i++)
            {
                var bannerid1 = $.trim($(arrbannerId[i]).html());
                var clicks='N/A';
                var impressions='N/A';
                var ctr='N/A';
                jQuery.each(obj, function(){
                    var bannerid = this.bannerid;
                    var status = $('#status_'+ this.bannerid).val();

                    if(bannerid1==bannerid)
                    {
                        ttimp = ttimp + parseInt(this.impressions.replace(/\,/g,''));
                        ttcl = ttcl + parseInt(this.clicks.replace(/\,/g,''));

                        if((this.clicks)=='')
                        {
                            clicks='N/A';
                        }
                        else
                        {
                            clicks='<a href="javascript:void(0);" onclick="ajax_tooltip2('+ this.bannerid +',this,'+ status +');">' + this.clicks + '</a>';
                        }
                        if((this.impressions)=='')
                        {
                            impressions='N/A';
                        }
                        else
                        {
                            impressions='<a href="javascript:void(0);" onclick="ajax_tooltip2('+ this.bannerid +',this,'+ status +');">' + this.impressions + '</a>';
                        }
                        uviews=parseInt(this.uviews) ==0 ? 'N/A':this.uviews;
                        ctr=this.ctr;
                        return;
                    }
                });

                $('#banner_clicks_' + bannerid1).html(clicks);
                $('#banner_impressions_' + bannerid1).html(impressions);
                $('#banner_ctr_' + bannerid1).html(ctr);
            }

            $('#ttclick_campaign').html(addCommas(ttcl));
            $('#ttview_campaign').html(addCommas(ttimp));


            if(end < total)
            {
                //mob_get_banner_report(url, fdate, tdate);
            }
        }
        mob_get_banner_uview(makeSiteUrl('banner/get_dt_uview'), fdate, tdate);
    };

    var param = {'ajax' : '1', 'bannerid': strbannerid, 'fdate':fdate, 'tdate':tdate};
    getAjax(url, param, '', 'POST', '', false, _onSuccess);
}

//get data uview
function mob_get_banner_uview(url, fdate, tdate)
{
    var numitem = $('#pagesize').val();
    var arrbannerId = $('.tbl-list .bannerid');
    var page = parseInt($('#bannerpage').val());
    var total = arrbannerId.length;
    var start = (page - 1) * numitem;
    var end = ((start + numitem) <= total) ? (start + numitem) : total;

    var strbannerid = '';
    for(var i = start; i < end; i++)
    {
        strbannerid += (strbannerid == '') ? $.trim($(arrbannerId[i]).html()) : ',' + $.trim($(arrbannerId[i]).html());
    }

    var _onSuccess = function(data)
    {
        data = $.trim(data);
        if(data == 'unlogin' || data == 'notright')
        {
            window.location.reload(true);
            return;
        }
        else if(data == 'empty')
        {
            if(end < total)
            {
                //mob_get_banner_uview(url, fdate, tdate);
            }
            else
            {
                for(var i = start; i < end; i++)
                {
                    var bannerid = $.trim($(arrbannerId[i]).html());
                    $('#banner_uviews_' + bannerid).html('N/A');
                }
            }
        }
        else
        {
            var obj = jQuery.parseJSON(data);
            for(var i = start; i < end; i++)
            {
                var bannerid1 = $.trim($(arrbannerId[i]).html());
                var uviews='N/A';
                jQuery.each(obj, function(){
                    var bannerid = this.bannerid;
                    var status = $('#status_'+ this.bannerid).val();
                    if(bannerid1==bannerid)
                    {
                        uviews=parseInt(this.uviews) ==0 ? 'N/A' : this.uviews;
                        return;
                    }
                });
                $('#banner_uviews_' + bannerid1).html(uviews);
                if($('#banner_impressions_' + bannerid1).html()=='N/A')
                {
                    $('#banner_uviews_' + bannerid1).html('N/A');
                }
            }
            if(end < total)
            {
                //mob_get_banner_uview(url, fdate, tdate);
            }
        }
    };

    var param = {'ajax' : '1', 'bannerid': strbannerid, 'fdate':fdate, 'tdate':tdate};
    getAjax(url, param, '', 'POST', '', false, _onSuccess);
}

function pnrtp_ajax_report(url, fdate, tdate)
{
    var numitem = $('#pagesize').val();
    var arrId = $('#table .cpid');
    $('#hddpage').val(1);
    var page = parseInt($('#hddpage').val());
    var total = arrId.length;

    var start = (page - 1) * numitem;
    var end = ((start + numitem) <= total) ? (start + numitem) : total;

    page = page + 1;
    $('#hddpage').val(page);

    var strid = '';
    for(var i = start; i < end; i++)
    {
        strid += (strid == '') ? $.trim($(arrId[i]).val()) : ',' + $.trim($(arrId[i]).val());
    }
    var _onSuccess = function(data)
    {
        data = $.trim(data);
        if(data == 'unlogin' || data == 'notright')
        {
            window.location.reload(true);
            return;
        }
        else if(data == 'empty')
        {
            if(end < total)
            {
                //pnrtp_ajax_report(url, fdate, tdate);
            }
            else
            {
                for(var i = start; i < end; i++)
                {
                    var bannerid1 = $.trim($(arrId[i]).val());
                    var na='N/A';
                    $('#imp_' + bannerid1).html(na).removeClass('text-center').addClass('text-right');
                    $('#cl_' + bannerid1).html(na).removeClass('text-center').addClass('text-right');
                    $('#ctr_' + bannerid1).html(na).removeClass('text-center').addClass('text-right');
                    $('#money_' + bannerid1).html(na).removeClass('text-center').addClass('text-right');
                }
            }
        }
        else
        {
            var obj = jQuery.parseJSON(data);
            for(var i = start; i < end; i++)
            {
                var bannerid1 = $.trim($(arrId[i]).val());
                var na='N/A';
                $('#imp_' + bannerid1).html(na).removeClass('text-center').addClass('text-right');
                $('#cl_' + bannerid1).html(na).removeClass('text-center').addClass('text-right');
                $('#ctr_' + bannerid1).html(na).removeClass('text-center').addClass('text-right');
                $('#money_' + bannerid1).html(na).removeClass('text-center').addClass('text-right');
            }
            jQuery.each(obj, function()
            {
                var pid = this.id;
                var status = $('#'+pid).val();
                $('#imp_' + pid).html('<a onclick="ajax_tooltip2('+pid+',this,0,'+status+')">'+this.imp+'</a>').removeClass('text-center').addClass('text-right');
                $('#cl_' + pid).html('<a onclick="ajax_tooltip2('+pid+',this,0,'+status+')">'+this.cl+'</a>').removeClass('text-center').addClass('text-right');
                $('#ctr_' + pid).html(this.ctr).removeClass('text-center').addClass('text-right');
                $('#money_' + pid).html(this.money).removeClass('text-center').addClass('text-right');
            });
            if(end < total)
            {
                //pnrtp_ajax_report(url, fdate, tdate);
            }
        }
    };
    var param = {'ajax' : '1', 'id': strid, 'fdate':fdate, 'tdate':tdate};
    getAjax(url, param, '', 'POST', '', false, _onSuccess);
}

function campaign_rtp_ajax_report_uview(url, fdate, tdate)
{
    var numitem = $('#pagesize').val();
    var arrId = $('#table .cpid');
    $('#hddpage').val(1);
    var page = parseInt($('#hddpage').val());
    var total = arrId.length;

    var start = (page - 1) * numitem;
    var end = ((start + numitem) <= total) ? (start + numitem) : total;

    page = page + 1;
    $('#hddpage').val(page);

    var strid = '';
    for(var i = start; i < end; i++)
    {
        strid += (strid == '') ? $.trim($(arrId[i]).val()) : ',' + $.trim($(arrId[i]).val());
    }
    var _onSuccess = function(data)
    {
        data = $.trim(data);
        if(data == 'unlogin' || data == 'notright')
        {
            window.location.reload(true);
            return;
        }
        else if(data == 'empty')
        {
            if(end < total)
            {
                //pnrtp_ajax_report(url, fdate, tdate);
            }
            else
            {
                for(var i = start; i < end; i++)
                {
                    var bannerid1 = $.trim($(arrId[i]).val());
                    var na='N/A';
                    $('#uv_' + bannerid1).html(na).removeClass('text-center').addClass('text-right');
                }
                return;
            }
            $('#tt_uview').html(na).removeClass('text-center').addClass('text-right');
        }
        else
        {
            var obj = jQuery.parseJSON(data);
            for(var i = start; i < end; i++)
            {
                var bannerid1 = $.trim($(arrId[i]).val());
                var na='N/A';
                $('#uv_' + bannerid1).html(na).removeClass('text-center').addClass('text-right');
            }
            jQuery.each(obj, function()
            {
                var pid = this.id;
                var status = $('#'+pid).val();
                if(pid=='total')
                {
                    $('#tt_uview').html(this.uv).removeClass('text-center').addClass('text-right');
                }
                else
                {
                    $('#uv_' + pid).html(this.uv).removeClass('text-center').addClass('text-right');
                    if($('#imp_' + pid).html() == 'N/A')
                    {
                        $('#uv_' + pid).html('N/A').removeClass('text-center').addClass('text-right');
                    }
                }
            });
            if(end < total)
            {
                //pnrtp_ajax_report(url, fdate, tdate);
            }
        }
    };
    var param = {'ajax' : '1', 'id': strid, 'fdate':fdate, 'tdate':tdate};
    getAjax(url, param, '', 'POST', '', false, _onSuccess);
}

//get data uview
function ajax_get_banner_detail_report(url, ban_id, fdate, tdate)
{
    var _onSuccess = function(data)
    {
        data = $.trim(data);
        if(data == 'unlogin' || data == 'notright')
        {
            window.location.reload(true);
            return;
        }
        else if(data == 'empty')
        {
            /*
             du lieu tra ra bang rong -> uview = N/A het.
             */
            $('.date_uview').html('N/A');
            $('#tt_uview_bannerdetail').html('N/A');
        }
        else
        {
            var obj = jQuery.parseJSON(data);
            var uviews='N/A';
            jQuery.each(obj, function(){
                var dateid = this.date;
                var uview = parseInt(this.uview) == 0 ? 'N/A' : this.uview;
                $('#date_uviews_' + dateid).html(uview);
                if(parseInt(this.tt)>0)
                {
                    $('#tt_uview_bannerdetail').html(this.tt);
                }
                else
                {
                    $('#tt_uview_bannerdetail').html('N/A');
                }
            });
        }
    };

    var param = {'ajax' : '1', 'bannerid':ban_id, 'fdate':fdate, 'tdate':tdate};
    getAjax(url, param, '', 'POST', '', false, _onSuccess);
}

function slcStarChange(img)
{
    var star = $("#slcStar").val();
    var im = '';
    for(var i=0; i<star; i++)
    {
        im += '<img src="' + img + '" />';
    }
    $("#step1_suggest_star").html(im);
}

function slcbtChange(obj, eid)
{
    var typead = $.trim($('#typead').val());
    var optButton = $('input:radio[name=' + obj + ']:checked').val();
    var imgDownload = 'images/createad/inline27082013/icon_download.png';
    var imgView = 'images/createad/inline27082013/icon_popup.png';
    if(typead == 5 || typead == 8)
    {
        imgDownload = 'images/createad/sponsor/300x250_05_down.png';
        imgView = 'images/createad/sponsor/300x250_05_up.png';
    }

    if(optButton==0)
    {
        $(eid).attr('src', imgDownload).show();
    }
    else
    {
        $(eid).attr('src', imgView).show();
    }
}

function fill_star(num)
{
    var im = '';
    if(num > 0)
    {
        for(var i=0; i<num; i++)
        {
            im += '<img src="images/createad/inline27082013/starvc.jpg" />';
        }
        $("#step1_suggest_star").html(im).show();
        $("#review_suggest_star").html(im).show();
        $("#step1_suggest_star_fnew").html(im).show();
        $("#review_suggest_star_fnew").html(im).show();
        $('#hddStar').val(num);
    }
}

function optChooseStar(obj, eid, tid, rid, countlimit, boxlimit)
{
    if($(obj).attr('checked'))
    {
        $(eid).show();
        $(tid).show();
        $(rid).show();
        var tex = $('#step1BodyText').val();
        tex = tex.substring(0, 45);
        $('#step1BodyText').val(tex);
        $('#bodyTextLimit').val(tex);
        $('#step1_suggest_body').val(tex);
        $('#review_bodytext').val(tex);
        updateCountLimit('b', 45);
    }
    else
    {
        $(tid).hide();
        $(eid).hide();
        $(rid).hide();
        $(boxlimit).html(countlimit);
        builTextCount('#step1BodyText', '#bodyTextLimit', countlimit);
    }
}

function removeLogo(hddid, eid, rid)
{
    $(hddid).val('');
    $(eid).html('<img width="25" height="25" id="step1_suggest_image_logo" alt="filelogo" src=""/>');
    $(rid).html('<img width="25" height="25" id="review_suggest_image_logo" src=""/>');
    conner();
}

/* popup box create banner type  */
function btnCreateAdChoide(obj, boxId)
{
    var pos = $(obj).offset();
    var tleft = pos.left;
    var eHeight = $(obj).outerHeight();
    var ttop = pos.top + eHeight;
    $(boxId).css("top",ttop + "px");
    $(boxId).css("left",tleft + "px");
    if($(boxId).css('display') == 'none')
    {
        $(boxId).slideDown(500);
        $(document).mouseup(function(e) {
            if(('#' + $(e.target).attr('id') != boxId) && ('#' + $(e.target).parent().attr('id') != boxId) && ('#' + $(e.target).parent().parent().attr('id') != boxId)) {
                $(boxId).slideUp(500);
            }
        });
    }
    else
    {
        $(boxId).slideUp(500);
    }
}
/* end popup create banner type */
function removeTagbyUser(strid)
{
    var arrRemid = new Array();
    if(strid != '' && strid!=null)
    {
        arrRemid = strid.split(',');
    }
    else
    {
        return;
    }

    for(var i=0; i < arrRemid.length; i++)
    {
        $('#gcatbox-' + arrRemid[i]).find('#site-tag-' + arrRemid[i]).attr('checked', '');
        $('#gcatbox-' + arrRemid[i]).find('.trg-site-name-box').removeClass('trg-site-name-box-slc');
        $('#gcatbox-' + arrRemid[i]).find('.trg-site-name-box').removeClass('trg-site-name-box-slc');
        $('#gcatbox-' + arrRemid[i]).find('.chksitechannel').attr('checked', '');
        $('#gcatbox-' + arrRemid[i]).find('.target-site-cat-btab').removeClass('gchkunall').addClass('gchkall');
    }

    var strCurrTagId = $.trim($('#hddListTagChannelId').val());
    var arrCurrTagId = new Array();
    if(strCurrTagId != '')
    {
        arrCurrTagId = strCurrTagId.split(',');
    }
    var arUnique = new Array();
    for(var j=0; j < arrCurrTagId.length; j++)
    {
        if(jQuery.inArray(arrCurrTagId[j], arrRemid) == -1)
        {
            arUnique.push(arrCurrTagId[j]);
        }
    }
    $('#hddListTagChannelId').val(arUnique.join(','));
    $('#urev').val('');
}

function chkAdServing(obj, tid, cid, aid, bid, tbid, sid)
{
    if($(obj).attr('checked'))
    {
        $(tid).hide();
        $(aid).show();
        $(tbid).hide();
        $(sid).hide();
    }
}

function slc3rd(obj, ird)
{
    if($(obj).attr('checked'))
    {
        $(ird).show();
    }
    else
    {
        $(ird).hide();
    }
}

function chkIpScript(obj, sid, tid, hid)
{
    if($(obj).attr('checked'))
    {
        $(tid).hide();
        $(hid).hide();
        $(sid).show();
    }
}

function setOpenBannerProperty(obj, bid, type)
{
    if($(obj).attr('checked'))
    {
        $(bid).show();
    }else{
        $(bid).hide();
    }
}


function setDataFromhdcn(pbid, bookingid, fdatehdcn, tdatehdcn, eIdShow, httype)
{
    var isShow = (typeof(eIdShow) === 'undefined' || eIdShow === '' || eIdShow == 1) ? false : true;
    var typead = parseInt($.trim($('#typead').val()));
    if(httype > 0 && typead != 5){
        $("input[name=typepay][value="+httype+"]").attr('checked', true);
        chktypepay();
    }

    /*
     * mÃ£ phÃ¢n bá»•
     */
    var lstpb = $('#phanboid').val().trim();
    var arrpb = lstpb.split(',').map(function(lstpb){return Number(lstpb);});
    if(arrpb.indexOf(pbid) < 0 && pbid > 0)
    {
        arrpb.push(pbid);
    }
    else{
        var index = arrpb.indexOf(pbid);
        if (index > -1) {
            arrpb.splice(index, 1);
            $('.pbid_' + pbid).css('background-color', '');
            $('.pbid_' + pbid).css('color', '');
        }
    }

    lstpb = '';
    var nArrPb = 0;
    for (var i = arrpb.length - 1; i >= 0; i--)
    {
        if(arrpb[i] > 0)
        {
            $('.pbid_' + arrpb[i]).css('background-color', 'green');
            $('.pbid_' + arrpb[i]).css('color', 'white');
            lstpb = (lstpb=='' ? '' : (lstpb + ',')) + arrpb[i];
            nArrPb = nArrPb + 1;
        }
    };

    if(lstpb != "")
    {
        $('#nbv').html(nArrPb);
        $('#pb').html(lstpb);
        $('#showOn').show();
    }
    else
    {
        $('#showOn').hide();
    }

    $('#phanboid').val(lstpb);

    if(isShow)
    {
        updateCreateCampainReview();
    }
    showDivCreateCampPbIDErr(false);
}

function chooseRetargetingChange(value)
{
    value = parseInt(value);
    if(value > 0)
    {
        $('#bv-txtREtarget').show();
    }else{
        $('#bv-txtREtarget').hide();
    }
    $('.text-script-retarget').hide();
    $('#text-retarget-'+value).show();
}

function ct_ajax_report_speed(url)
{
    var arrCampaignid = $('.cpid');
    var lstcampaign = Array();
    jQuery.each(arrCampaignid, function()
    {
        var hd = $.trim($(this).val());
        if(hd!=''){
            lstcampaign.push(hd);
        }
    });
    lstcampaign = lstcampaign.join();
    $('#loading').show();
    var _onSuccess = function(data)
    {
        var objData = jQuery.parseJSON(data);
        for (var i = 0; i < objData.length; i++) {
            var kq = objData[i];

            if(kq['process']){
                var bgpercent = kq['percent'] > 100 ? 100 : kq['percent'];
                $(".tr-" + kq['campaignid']).html(kq['percent'] + '%');
                $(".rc-" + kq['campaignid']).css('width', bgpercent + '%').html('');
                $(".rc-" + kq['campaignid']).css('background-color', kq['color']);

                var bgbookmark = kq['pc'] > 99 ? 99 : kq['pc'];
                $(".rcx-" + kq['campaignid']).css('width', bgbookmark + '%');
                $(".hd-" + kq['campaignid']).hide();
                $(".prs-" + kq['campaignid']).show();
                $(".prs-" + kq['campaignid']).attr('title', kq['title']);
            }else{
                $(".hd-" + kq['campaignid']).hide();
            }

            /*if(kq['Cbook']['CPC']==0 && kq['Cbook']['CPM'] > 0){
             var rcolor = kq['perCPM'] <= 40 ? '#ce9597' : 'nocolor';
             if(rcolor=='nocolor'){
             var rcolor = kq['perCPM'] >= 60 ? '#00e04f' : 'nocolor';
             if(rcolor=='nocolor'){
             var rcolor = 40 < kq['perCPM'] && kq['perCPM'] < 60 ? '#97e0b3' : '';
             }
             }
             $(".tr-" + kq['hd']).html(kq['perCPM'] + '%');
             $(".rc-" + kq['hd']).css('width', kq['perCPM'] + '%').html('');
             $(".rc-" + kq['hd']).css('background-color', rcolor);
             $(".hd-" + kq['hd']).hide();
             $(".prs-" + kq['hd']).show();
             $(".prs-" + kq['hd']).attr('title', 'Thá»±c táº¿ ' + kq['Crun']['CPM'] + ' CPM/ngÃ y so vá»›i há»£p Ä‘á»“ng ' + kq['Cbook']['CPM'] + ' CPM/ngÃ y.');
             }else if(kq['Cbook']['CPM']==0 && kq['Cbook']['CPC'] > 0){
             var rcolor = kq['perCPC'] <= 40 ? '#ce9597' : 'nocolor';
             if(rcolor=='nocolor'){
             var rcolor = kq['perCPC'] >= 60 ? '#00e04f' : 'nocolor';
             if(rcolor=='nocolor'){
             var rcolor = 40 < kq['perCPC'] && kq['perCPC'] < 60 ? '#97e0b3' : '';
             }
             }
             $(".tr-" + kq['hd']).html(kq['perCPC'] + '%');
             $(".rc-" + kq['hd']).css('width', kq['perCPC'] + '%').html('');
             $(".rc-" + kq['hd']).css('background-color', rcolor);
             $(".hd-" + kq['hd']).hide();
             $(".prs-" + kq['hd']).show();
             $(".prs-" + kq['hd']).attr('title', 'Thá»±c táº¿ ' + kq['Crun']['CPC'] + ' CPC/ngÃ y so vá»›i há»£p Ä‘á»“ng ' + kq['Cbook']['CPC'] + ' CPC/ngÃ y.');
             }else if(kq['Cbook']['CPM']>0 && kq['Cbook']['CPC'] > 0){
             var rcolor = kq['perTT'] <= 40 ? '#ce9597' : 'nocolor';
             if(rcolor=='nocolor'){
             var rcolor = kq['perTT'] >= 60 ? '#00e04f' : 'nocolor';
             if(rcolor=='nocolor'){
             var rcolor = 40 < kq['perTT'] && kq['perTT'] < 60 ? '#97e0b3' : '';
             }
             }
             $(".tr-" + kq['hd']).html(kq['perTT'] + '%');
             $(".rc-" + kq['hd']).css('width', kq['perTT'] + '%').html('');
             $(".rc-" + kq['hd']).css('background-color', rcolor);
             $(".hd-" + kq['hd']).hide();
             $(".prs-" + kq['hd']).show();
             }*/
        };
        $('#loading').hide();
    };
    var param = {'val' : lstcampaign};
    getAjax(url, param, '', 'POST', '', false, _onSuccess);
}