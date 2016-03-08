/**
 * Created by Admin on 3/8/2016.
 */
//range.js
function Range(){this._value=0;this._minimum=1;this._maximum=50;this._extent=0;this._isChanging=false}Range.prototype.setValue=function(a){a=Math.round(parseFloat(a));if(isNaN(a))return;if(this._value!=a){if(a+this._extent>this._maximum)this._value=this._maximum-this._extent;else if(a<this._minimum)this._value=this._minimum;else this._value=a;if(!this._isChanging&&typeof this.onchange=="function")this.onchange()}};Range.prototype.getValue=function(){return this._value};Range.prototype.setExtent=function(a){if(this._extent!=a){if(a<0)this._extent=0;else if(this._value+a>this._maximum)this._extent=this._maximum-this._value;else this._extent=a;if(!this._isChanging&&typeof this.onchange=="function")this.onchange()}};Range.prototype.getExtent=function(){return this._extent};Range.prototype.setMinimum=function(a){if(this._minimum!=a){var b=this._isChanging;this._isChanging=true;this._minimum=a;if(a>this._value)this.setValue(a);if(a>this._maximum){this._extent=0;this.setMaximum(a);this.setValue(a)}if(a+this._extent>this._maximum)this._extent=this._maximum-this._minimum;this._isChanging=b;if(!this._isChanging&&typeof this.onchange=="function")this.onchange()}};Range.prototype.getMinimum=function(){return this._minimum};Range.prototype.setMaximum=function(a){if(this._maximum!=a){var b=this._isChanging;this._isChanging=true;this._maximum=a;if(a<this._value)this.setValue(a-this._extent);if(a<this._minimum){this._extent=0;this.setMinimum(a);this.setValue(this._maximum)}if(a<this._minimum+this._extent)this._extent=this._maximum-this._minimum;if(a<this._value+this._extent)this._extent=this._maximum-this._value;this._isChanging=b;if(!this._isChanging&&typeof this.onchange=="function")this.onchange()}};Range.prototype.getMaximum=function(){return this._maximum};
//timer.js
function Timer(a){this._pauseTime=typeof a=="undefined"?1000:a;this._timer=null;this._isStarted=false}Timer.prototype.start=function(){if(this.isStarted())this.stop();var a=this;this._timer=window.setTimeout(function(){if(typeof a.ontimer=="function")a.ontimer()},this._pauseTime);this._isStarted=false};Timer.prototype.stop=function(){if(this._timer!=null)window.clearTimeout(this._timer);this._isStarted=false};Timer.prototype.isStarted=function(){return this._isStarted};Timer.prototype.getPauseTime=function(){return this._pauseTime};Timer.prototype.setPauseTime=function(a){this._pauseTime=a};
//slider.js
Slider.isSupported=typeof document.createElement!="undefined"&&typeof document.documentElement!="undefined"&&typeof document.documentElement.offsetWidth=="number";function Slider(a,b,c,d,f,g){if(!a)return;this._orientation=c||"horizontal";this._range=new Range();this._range.setExtent(0);this._blockIncrement=10;this._unitIncrement=1;this._timer=new Timer(100);this._customFnc=d;this._defaultVal=f;this._defaultSliderWidth=(typeof(g)==='undefined'||g==='')?0:g;if(Slider.isSupported&&a){this.document=a.ownerDocument||a.document;this.element=a;this.element.slider=this;this.element.unselectable="on";this.element.className=this._orientation+" "+this.classNameTag+" "+this.element.className;this.line=this.document.createElement("DIV");this.line.className="line";this.line.unselectable="on";this.line.appendChild(this.document.createElement("DIV"));this.element.appendChild(this.line);this.handle=this.document.createElement("DIV");this.handle.className="handle";this.handle.unselectable="on";this.handle.appendChild(this.document.createElement("DIV"));this.handle.firstChild.appendChild(this.document.createTextNode(String.fromCharCode(160)));this.element.appendChild(this.handle)}this.input=b;var h=this;this._range.onchange=function(){h.recalculate();if(typeof h.onchange=="function")h.onchange()};if(Slider.isSupported&&a){this.element.onfocus=Slider.eventHandlers.onfocus;this.element.onblur=Slider.eventHandlers.onblur;this.element.onmousedown=Slider.eventHandlers.onmousedown;this.element.onmouseover=Slider.eventHandlers.onmouseover;this.element.onmouseout=Slider.eventHandlers.onmouseout;this.element.onkeydown=Slider.eventHandlers.onkeydown;this.element.onkeypress=Slider.eventHandlers.onkeypress;this.element.onmousewheel=Slider.eventHandlers.onmousewheel;this.handle.onselectstart=function(){return false};this.element.onselectstart=function(){return false};this._timer.ontimer=function(){h.ontimer()};window.setTimeout(function(){h.recalculate()},1)}else{this.input.onchange=function(e){h.setValue(h.input.value)}}this.setValue(f);if(this._defaultSliderWidth>0){this.element.style.width=(this._defaultSliderWidth+5+5)+"px"}}Slider.eventHandlers={getEvent:function(e,a){if(!e){if(a)e=a.document.parentWindow.event;else e=window.event}if(!e.srcElement){var a=e.target;while(a!=null&&a.nodeType!=1)a=a.parentNode;e.srcElement=a}if(typeof e.offsetX=="undefined"){e.offsetX=e.layerX;e.offsetY=e.layerY}return e},getDocument:function(e){if(e.target)return e.target.ownerDocument;return e.srcElement.document},getSlider:function(e){var a=e.target||e.srcElement;while(a!=null&&a.slider==null){a=a.parentNode}if(a)return a.slider;return null},getLine:function(e){var a=e.target||e.srcElement;while(a!=null&&a.className!="line"){a=a.parentNode}return a},getHandle:function(e){var a=e.target||e.srcElement;var b=/handle/;while(a!=null&&!b.test(a.className)){a=a.parentNode}return a},onfocus:function(e){var s=this.slider;s._focused=true;s.handle.className="handle hover"},onblur:function(e){var s=this.slider;s._focused=false;s.handle.className="handle"},onmouseover:function(e){e=Slider.eventHandlers.getEvent(e,this);var s=this.slider;if(e.srcElement==s.handle)s.handle.className="handle hover"},onmouseout:function(e){e=Slider.eventHandlers.getEvent(e,this);var s=this.slider;if(e.srcElement==s.handle&&!s._focused)s.handle.className="handle"},onmousedown:function(e){e=Slider.eventHandlers.getEvent(e,this);var s=this.slider;if(s.element.focus)s.element.focus();Slider._currentInstance=s;var a=s.document;if(a.addEventListener){a.addEventListener("mousemove",Slider.eventHandlers.onmousemove,true);a.addEventListener("mouseup",Slider.eventHandlers.onmouseup,true)}else if(a.attachEvent){a.attachEvent("onmousemove",Slider.eventHandlers.onmousemove);a.attachEvent("onmouseup",Slider.eventHandlers.onmouseup);a.attachEvent("onlosecapture",Slider.eventHandlers.onmouseup);s.element.setCapture()}if(Slider.eventHandlers.getHandle(e)){Slider._sliderDragData={screenX:e.screenX,screenY:e.screenY,dx:e.screenX-s.handle.offsetLeft,dy:e.screenY-s.handle.offsetTop,startValue:s.getValue(),slider:s}}else{var b=Slider.eventHandlers.getLine(e);s._mouseX=e.offsetX+(b?s.line.offsetLeft:0);s._mouseY=e.offsetY+(b?s.line.offsetTop:0);s._increasing=null;s.ontimer()}},onmousemove:function(e){e=Slider.eventHandlers.getEvent(e,this);if(Slider._sliderDragData){var s=Slider._sliderDragData.slider;var a=s.getMaximum()-s.getMinimum();var b,pos,reset;if(s._orientation=="horizontal"){b=s.element.offsetWidth-s.handle.offsetWidth;pos=e.screenX-Slider._sliderDragData.dx;reset=Math.abs(e.screenY-Slider._sliderDragData.screenY)>100}else{b=s.element.offsetHeight-s.handle.offsetHeight;pos=s.element.offsetHeight-s.handle.offsetHeight-(e.screenY-Slider._sliderDragData.dy);reset=Math.abs(e.screenX-Slider._sliderDragData.screenX)>100}s.setValue(reset?Slider._sliderDragData.startValue:s.getMinimum()+a*pos/b);return false}else{var s=Slider._currentInstance;if(s!=null){var c=Slider.eventHandlers.getLine(e);s._mouseX=e.offsetX+(c?s.line.offsetLeft:0);s._mouseY=e.offsetY+(c?s.line.offsetTop:0)}}},onmouseup:function(e){e=Slider.eventHandlers.getEvent(e,this);var s=Slider._currentInstance;var a=s.document;if(a.removeEventListener){a.removeEventListener("mousemove",Slider.eventHandlers.onmousemove,true);a.removeEventListener("mouseup",Slider.eventHandlers.onmouseup,true)}else if(a.detachEvent){a.detachEvent("onmousemove",Slider.eventHandlers.onmousemove);a.detachEvent("onmouseup",Slider.eventHandlers.onmouseup);a.detachEvent("onlosecapture",Slider.eventHandlers.onmouseup);s.element.releaseCapture()}if(Slider._sliderDragData){Slider._sliderDragData=null}else{s._timer.stop();s._increasing=null}s._customFnc(s.getValue());Slider._currentInstance=null},onkeydown:function(e){e=Slider.eventHandlers.getEvent(e,this);var s=this.slider;var a=e.keyCode;switch(a){case 33:s.setValue(s.getValue()+s.getBlockIncrement());break;case 34:s.setValue(s.getValue()-s.getBlockIncrement());break;case 35:s.setValue(s.getOrientation()=="horizontal"?s.getMaximum():s.getMinimum());break;case 36:s.setValue(s.getOrientation()=="horizontal"?s.getMinimum():s.getMaximum());break;case 38:case 39:s.setValue(s.getValue()+s.getUnitIncrement());break;case 37:case 40:s.setValue(s.getValue()-s.getUnitIncrement());break}if(a>=33&&a<=40){return false}},onkeypress:function(e){e=Slider.eventHandlers.getEvent(e,this);var a=e.keyCode;if(a>=33&&a<=40){return false}},onmousewheel:function(e){e=Slider.eventHandlers.getEvent(e,this);var s=this.slider;if(s._focused){s.setValue(s.getValue()+e.wheelDelta/120*s.getUnitIncrement());return false}}};Slider.prototype.classNameTag="dynamic-slider-control",Slider.prototype.setValue=function(v){this._range.setValue(v);this.input.value=this.getValue()};Slider.prototype.getValue=function(){return this._range.getValue()};Slider.prototype.setMinimum=function(v){this._range.setMinimum(v);this.input.value=this.getValue()};Slider.prototype.getMinimum=function(){return this._range.getMinimum()};Slider.prototype.setMaximum=function(v){this._range.setMaximum(v);this.input.value=this.getValue()};Slider.prototype.getMaximum=function(){return this._range.getMaximum()};Slider.prototype.setUnitIncrement=function(v){this._unitIncrement=v};Slider.prototype.getUnitIncrement=function(){return this._unitIncrement};Slider.prototype.setBlockIncrement=function(v){this._blockIncrement=v};Slider.prototype.getBlockIncrement=function(){return this._blockIncrement};Slider.prototype.getOrientation=function(){return this._orientation};Slider.prototype.setOrientation=function(a){if(a!=this._orientation){if(Slider.isSupported&&this.element){this.element.className=this.element.className.replace(this._orientation,a)}this._orientation=a;this.recalculate()}};Slider.prototype.recalculate=function(){if(!Slider.isSupported||!this.element)return;var w=this.element.offsetWidth;var h=this.element.offsetHeight;var a=this.handle.offsetWidth;var b=this.handle.offsetHeight;var c=this.line.offsetWidth;var d=this.line.offsetHeight;if(this._orientation=="horizontal"){this.handle.style.left=(w-a)*(this.getValue()-this.getMinimum())/(this.getMaximum()-this.getMinimum())+"px";this.handle.style.top="-3px";this.line.style.top="4px";this.line.style.left="5px";this.line.style.right="5px";if(this._defaultSliderWidth==0){this.line.style.width=Math.max(0,w-a-1)+"px"}else{this.line.style.width=this._defaultSliderWidth+"px"}this.line.firstChild.style.width="10px"}else{this.handle.style.left=(w-a)/2+"px";this.handle.style.top=h-b-(h-b)*(this.getValue()-this.getMinimum())/(this.getMaximum()-this.getMinimum())+"px";this.line.style.left=(w-c)/2+"px";this.line.style.top=b/2+"px";this.line.style.height=Math.max(0,h-b-2)+"px";this.line.firstChild.style.height=Math.max(0,h-b-4)+"px"}};Slider.prototype.ontimer=function(){var a=this.handle.offsetWidth;var b=this.handle.offsetHeight;var c=this.handle.offsetLeft;var d=this.handle.offsetTop;if(this._orientation=="horizontal"){if(this._mouseX>c+a&&(this._increasing==null||this._increasing)){this.setValue(this.getValue()+this.getBlockIncrement());this._increasing=true}else if(this._mouseX<c&&(this._increasing==null||!this._increasing)){this.setValue(this.getValue()-this.getBlockIncrement());this._increasing=false}}else{if(this._mouseY>d+b&&(this._increasing==null||!this._increasing)){this.setValue(this.getValue()-this.getBlockIncrement());this._increasing=false}else if(this._mouseY<d&&(this._increasing==null||this._increasing)){this.setValue(this.getValue()+this.getBlockIncrement());this._increasing=true}}this._timer.start()};