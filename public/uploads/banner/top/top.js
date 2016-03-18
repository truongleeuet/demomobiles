/**
 * Created by Admin on 3/18/2016.
 */
function genTopBanner(url_log) {
    var html = '<div style="position: relative;width:' + windowPrototype.wdWidth() + 'px;height:' + (windowPrototype.wdWidth() * 320 / 640) + 'px;overflow: hidden;background-image: url(http://adi.admicro.vn/adt/cpc/tvcads/files/images/habicotop_080316/bgtop.jpg);background-size: 100%;background-position: center;background-repeat: no-repeat;"><iframe onload="_loadIframe()" style="width: 100%;height: ' + (windowPrototype.wdWidth() * 320 / 640) + 'px;display: block;overflow: hidden;border: none;" src="http://adi.admicro.vn/adt/cpc/tvcads/files/html/habicotop_080316/640x320.html?wd=' + windowPrototype.wdWidth() + '"></iframe><a ' + url_log + ' style="position: absolute;top:0;left:0;width: 100%;height:100%;z-index:1;"></a></div>';

    return html;
}
//var url_log_mm = 'http://bs.serving-sys.com/BurstingPipe/adServer.bs?cn=tf&c=19&mc=imp&pli=15507873&PluID=0&ord='+new Date().getTime();
//admsendTracking(url_log_mm);

var html = genTopBanner(admtop.logging);
document.getElementById('admTopBan_' + admtop.zoneid).innerHTML = html;

function _loadIframe() {
    document.getElementById('ban-top-site').style.display = 'block';
}