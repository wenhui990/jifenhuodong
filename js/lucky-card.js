(function(g,h,b){function f(k,l){this.cover=null;this.ctx=null;this.scratchDiv=null;this.cardDiv=null;this.cHeight=0;this.cWidth=0;this.supportTouch=false;this.events=[];this.startEventHandler=null;this.moveEventHandler=null;this.endEventHandler=null;this.start=[];this.opt={coverColor:"",coverImg:"",ratio:0.8,callback:null,scratchDivId:null,cardDivId:null,startMoveCallback:null,startMoveCalled:false,coverText:null,bizId:null};this.init(k,l)}function i(l,o,m){var n=l.getImageData(0,0,290,100);var k=[];e(n.data,function(r,q){var p=n.data[q+3];if(p===0){k.push(p)}});if(k.length/n.data.length>m){o&&typeof o==="function"&&o()}}function e(k,l){return Array.prototype.forEach.call(k,function(n,m){l(n,m)})}function j(){var k=h.createElement("canvas");return !!(k.getContext&&k.getContext("2d"))}function c(k){this.cardDiv.style.opacity=1;this.moveEventHandler=d.bind(this);this.cover.addEventListener(this.events[1],this.moveEventHandler,false);this.endEventHandler=a.bind(this);h.addEventListener(this.events[2],this.endEventHandler,false);k.preventDefault()}function d(q){q.preventDefault();var m=this.supportTouch?q.touches[0]:q;var l=this.cover.getBoundingClientRect();var n=h.documentElement.scrollTop||h.body.scrollTop;var k=h.documentElement.scrollLeft||h.body.scrollLeft;var p=m.pageX-l.left-k;var o=m.pageY-l.top-n;this.ctx.beginPath();if(this.start.length<2){this.start=[p,o]}else{this.ctx.moveTo(this.start[0],this.start[1]);this.ctx.lineTo(p,o);this.ctx.stroke();this.start=[p,o]}if(this.opt.startMoveCallback&&!this.opt.startMoveCalled){this.opt.startMoveCallback();this.opt.startMoveCalled=true}}function a(k){if(this.opt.callback&&typeof this.opt.callback==="function"){i(this.ctx,this.opt.callback,this.opt.ratio)}this.cover.removeEventListener(this.events[1],this.moveEventHandler,false);h.removeEventListener(this.events[2],this.endEventHandler,false);k.preventDefault()}f.prototype.createCanvas=function(){this.cover=h.createElement("canvas");this.cover.id="cover";this.cover.height=this.cHeight;this.cover.width=this.cWidth;this.ctx=this.cover.getContext("2d");if(this.opt.coverImg){var l=this;var k=new Image();k.src=this.opt.coverImg;k.onload=function(){l.ctx.drawImage(k,0,0,l.cover.width,l.cover.height)}}else{this.ctx.fillStyle=this.opt.coverColor;this.ctx.fillRect(0,0,this.cover.width,this.cover.height)}this.ctx.font="bold 20px Microsoft Yahei";this.ctx.textAlign="center";this.ctx.fillStyle="#fff";this.ctx.fillText(this.opt.coverText,this.cover.width/2,this.cover.height/2+10);this.ctx.lineCap="round";this.ctx.lineJoin="round";this.ctx.globalCompositeOperation="destination-out";this.ctx.lineWidth=20;this.scratchDiv.appendChild(this.cover)};f.prototype.eventDetect=function(){if("ontouchstart" in g){this.supportTouch=true}this.events=this.supportTouch?["touchstart","touchmove","touchend"]:["mousedown","mousemove","mouseup"];this.addEvent()};f.prototype.addEvent=function(){this.startEventHandler=c.bind(this);this.cover.addEventListener(this.events[0],this.startEventHandler,false)};f.prototype.clearCover=function(){this.ctx.clearRect(0,0,this.cover.width,this.cover.height)};f.prototype.init=function(k,m){if(!j()){alert("对不起，当前浏览器不支持Canvas，无法使用本控件！");return}var l=this;e(arguments,function(o){if(typeof o==="object"){for(var n in o){if(n==="callback"&&typeof o[n]==="function"){l.opt.callback=o[n].bind(l)}else{if(n==="startMoveCallback"&&typeof o[n]==="function"){l.opt.startMoveCallback=o[n].bind(l)}else{n in l.opt&&(l.opt[n]=o[n])}}}}else{if(typeof o==="function"){l.opt.callback=o.bind(l)}}});this.scratchDiv=h.getElementById(this.opt.scratchDivId);this.cardDiv=h.getElementById(this.opt.cardDivId);if(!this.scratchDiv||!this.cardDiv){return}this.cHeight=this.cardDiv.clientHeight;this.cWidth=this.cardDiv.clientWidth;this.cardDiv.style.opacity=0;this.createCanvas();this.eventDetect()};f.create=function(k,l){return new f(k,l)};if(typeof define==="function"&&typeof define.amd==="object"&&define.amd){define(function(){return f})}else{if(typeof module!=="undefined"&&module.exports){module.exports=f.create;module.exports.LuckyCard=f}else{g.LuckyCard=f}}})(window,document);