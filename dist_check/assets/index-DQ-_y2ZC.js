(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Br="165",Ju=0,Za=1,Qu=2,su=1,ou=2,Mn=3,on=0,Be=1,Ze=2,Vn=0,rr=1,Ja=2,Qa=3,tl=4,th=5,ci=100,eh=101,nh=102,ih=103,rh=104,sh=200,oh=201,ah=202,lh=203,ha=204,fa=205,ch=206,uh=207,hh=208,fh=209,dh=210,ph=211,mh=212,gh=213,_h=214,xh=0,vh=1,yh=2,Gs=3,bh=4,Mh=5,Sh=6,wh=7,Da=0,Eh=1,Th=2,Wn=0,Ah=1,Ch=2,Ph=3,au=4,Rh=5,Lh=6,Ih=7,lu=300,lr=301,cr=302,da=303,pa=304,to=306,ma=1e3,hi=1001,ga=1002,Ge=1003,Dh=1004,Vr=1005,sn=1006,fo=1007,fi=1008,qn=1009,Uh=1010,Nh=1011,Vs=1012,cu=1013,ur=1014,fn=1015,eo=1016,uu=1017,hu=1018,hr=1020,Oh=35902,Bh=1021,Fh=1022,Je=1023,kh=1024,zh=1025,sr=1026,fr=1027,Hh=1028,fu=1029,Gh=1030,du=1031,pu=1033,po=33776,mo=33777,go=33778,_o=33779,el=35840,nl=35841,il=35842,rl=35843,sl=36196,ol=37492,al=37496,ll=37808,cl=37809,ul=37810,hl=37811,fl=37812,dl=37813,pl=37814,ml=37815,gl=37816,_l=37817,xl=37818,vl=37819,yl=37820,bl=37821,xo=36492,Ml=36494,Sl=36495,Vh=36283,wl=36284,El=36285,Tl=36286,Wh=3200,Xh=3201,mu=0,qh=1,zn="",un="srgb",$n="srgb-linear",Ua="display-p3",no="display-p3-linear",Ws="linear",Jt="srgb",Xs="rec709",qs="p3",Mi=7680,Al=519,jh=512,Yh=513,$h=514,gu=515,Kh=516,Zh=517,Jh=518,Qh=519,Cl=35044,Pl="300 es",Tn=2e3,js=2001;class yi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const r=this._listeners[t];if(r!==void 0){const s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const r=n.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,t);t.target=null}}}const Te=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],vo=Math.PI/180,_a=180/Math.PI;function Fr(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Te[i&255]+Te[i>>8&255]+Te[i>>16&255]+Te[i>>24&255]+"-"+Te[t&255]+Te[t>>8&255]+"-"+Te[t>>16&15|64]+Te[t>>24&255]+"-"+Te[e&63|128]+Te[e>>8&255]+"-"+Te[e>>16&255]+Te[e>>24&255]+Te[n&255]+Te[n>>8&255]+Te[n>>16&255]+Te[n>>24&255]).toLowerCase()}function Ne(i,t,e){return Math.max(t,Math.min(e,i))}function tf(i,t){return(i%t+t)%t}function yo(i,t,e){return(1-e)*i+e*t}function gr(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function He(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class wt{constructor(t=0,e=0){wt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6],this.y=r[1]*e+r[4]*n+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),r=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*n-o*r+t.x,this.y=s*r+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ct{constructor(t,e,n,r,s,o,a,l,c){Ct.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,o,a,l,c)}set(t,e,n,r,s,o,a,l,c){const u=this.elements;return u[0]=t,u[1]=r,u[2]=a,u[3]=e,u[4]=s,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],f=n[7],h=n[2],d=n[5],g=n[8],_=r[0],m=r[3],p=r[6],v=r[1],x=r[4],y=r[7],T=r[2],w=r[5],S=r[8];return s[0]=o*_+a*v+l*T,s[3]=o*m+a*x+l*w,s[6]=o*p+a*y+l*S,s[1]=c*_+u*v+f*T,s[4]=c*m+u*x+f*w,s[7]=c*p+u*y+f*S,s[2]=h*_+d*v+g*T,s[5]=h*m+d*x+g*w,s[8]=h*p+d*y+g*S,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8];return e*o*u-e*a*c-n*s*u+n*a*l+r*s*c-r*o*l}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],f=u*o-a*c,h=a*l-u*s,d=c*s-o*l,g=e*f+n*h+r*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=f*_,t[1]=(r*c-u*n)*_,t[2]=(a*n-r*o)*_,t[3]=h*_,t[4]=(u*e-r*l)*_,t[5]=(r*s-a*e)*_,t[6]=d*_,t[7]=(n*l-c*e)*_,t[8]=(o*e-n*s)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-r*c,r*l,-r*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(bo.makeScale(t,e)),this}rotate(t){return this.premultiply(bo.makeRotation(-t)),this}translate(t,e){return this.premultiply(bo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<9;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const bo=new Ct;function _u(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Ys(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function ef(){const i=Ys("canvas");return i.style.display="block",i}const Rl={};function xu(i){i in Rl||(Rl[i]=!0,console.warn(i))}function nf(i,t,e){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}const Ll=new Ct().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Il=new Ct().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Wr={[$n]:{transfer:Ws,primaries:Xs,toReference:i=>i,fromReference:i=>i},[un]:{transfer:Jt,primaries:Xs,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[no]:{transfer:Ws,primaries:qs,toReference:i=>i.applyMatrix3(Il),fromReference:i=>i.applyMatrix3(Ll)},[Ua]:{transfer:Jt,primaries:qs,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Il),fromReference:i=>i.applyMatrix3(Ll).convertLinearToSRGB()}},rf=new Set([$n,no]),Yt={enabled:!0,_workingColorSpace:$n,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!rf.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=Wr[t].toReference,r=Wr[e].fromReference;return r(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return Wr[i].primaries},getTransfer:function(i){return i===zn?Ws:Wr[i].transfer}};function or(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Mo(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Si;class sf{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Si===void 0&&(Si=Ys("canvas")),Si.width=t.width,Si.height=t.height;const n=Si.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Si}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ys("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const r=n.getImageData(0,0,t.width,t.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=or(s[o]/255)*255;return n.putImageData(r,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(or(e[n]/255)*255):e[n]=or(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let of=0;class vu{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:of++}),this.uuid=Fr(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(So(r[o].image)):s.push(So(r[o]))}else s=So(r);n.url=s}return e||(t.images[this.uuid]=n),n}}function So(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?sf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let af=0;class Fe extends yi{constructor(t=Fe.DEFAULT_IMAGE,e=Fe.DEFAULT_MAPPING,n=hi,r=hi,s=sn,o=fi,a=Je,l=qn,c=Fe.DEFAULT_ANISOTROPY,u=zn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:af++}),this.uuid=Fr(),this.name="",this.source=new vu(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new wt(0,0),this.repeat=new wt(1,1),this.center=new wt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ct,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==lu)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ma:t.x=t.x-Math.floor(t.x);break;case hi:t.x=t.x<0?0:1;break;case ga:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ma:t.y=t.y-Math.floor(t.y);break;case hi:t.y=t.y<0?0:1;break;case ga:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Fe.DEFAULT_IMAGE=null;Fe.DEFAULT_MAPPING=lu;Fe.DEFAULT_ANISOTROPY=1;class te{constructor(t=0,e=0,n=0,r=1){te.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,r){return this.x=t,this.y=e,this.z=n,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*r+o[12]*s,this.y=o[1]*e+o[5]*n+o[9]*r+o[13]*s,this.z=o[2]*e+o[6]*n+o[10]*r+o[14]*s,this.w=o[3]*e+o[7]*n+o[11]*r+o[15]*s,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,r,s;const l=t.elements,c=l[0],u=l[4],f=l[8],h=l[1],d=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(u-h)<.01&&Math.abs(f-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(f+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(c+1)/2,y=(d+1)/2,T=(p+1)/2,w=(u+h)/4,S=(f+_)/4,P=(g+m)/4;return x>y&&x>T?x<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(x),r=w/n,s=S/n):y>T?y<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(y),n=w/r,s=P/r):T<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(T),n=S/s,r=P/s),this.set(n,r,s,e),this}let v=Math.sqrt((m-g)*(m-g)+(f-_)*(f-_)+(h-u)*(h-u));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(f-_)/v,this.z=(h-u)/v,this.w=Math.acos((c+d+p-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class lf extends yi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new te(0,0,t,e),this.scissorTest=!1,this.viewport=new te(0,0,t,e);const r={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:sn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const s=new Fe(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=t,this.textures[r].image.height=e,this.textures[r].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,r=t.textures.length;n<r;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new vu(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class di extends lf{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class yu extends Fe{constructor(t=null,e=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=Ge,this.minFilter=Ge,this.wrapR=hi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class cf extends Fe{constructor(t=null,e=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=Ge,this.minFilter=Ge,this.wrapR=hi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class pi{constructor(t=0,e=0,n=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=r}static slerpFlat(t,e,n,r,s,o,a){let l=n[r+0],c=n[r+1],u=n[r+2],f=n[r+3];const h=s[o+0],d=s[o+1],g=s[o+2],_=s[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=u,t[e+3]=f;return}if(a===1){t[e+0]=h,t[e+1]=d,t[e+2]=g,t[e+3]=_;return}if(f!==_||l!==h||c!==d||u!==g){let m=1-a;const p=l*h+c*d+u*g+f*_,v=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const T=Math.sqrt(x),w=Math.atan2(T,p*v);m=Math.sin(m*w)/T,a=Math.sin(a*w)/T}const y=a*v;if(l=l*m+h*y,c=c*m+d*y,u=u*m+g*y,f=f*m+_*y,m===1-a){const T=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=T,c*=T,u*=T,f*=T}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,r,s,o){const a=n[r],l=n[r+1],c=n[r+2],u=n[r+3],f=s[o],h=s[o+1],d=s[o+2],g=s[o+3];return t[e]=a*g+u*f+l*d-c*h,t[e+1]=l*g+u*h+c*f-a*d,t[e+2]=c*g+u*d+a*h-l*f,t[e+3]=u*g-a*f-l*h-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,r){return this._x=t,this._y=e,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,r=t._y,s=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(r/2),f=a(s/2),h=l(n/2),d=l(r/2),g=l(s/2);switch(o){case"XYZ":this._x=h*u*f+c*d*g,this._y=c*d*f-h*u*g,this._z=c*u*g+h*d*f,this._w=c*u*f-h*d*g;break;case"YXZ":this._x=h*u*f+c*d*g,this._y=c*d*f-h*u*g,this._z=c*u*g-h*d*f,this._w=c*u*f+h*d*g;break;case"ZXY":this._x=h*u*f-c*d*g,this._y=c*d*f+h*u*g,this._z=c*u*g+h*d*f,this._w=c*u*f-h*d*g;break;case"ZYX":this._x=h*u*f-c*d*g,this._y=c*d*f+h*u*g,this._z=c*u*g-h*d*f,this._w=c*u*f+h*d*g;break;case"YZX":this._x=h*u*f+c*d*g,this._y=c*d*f+h*u*g,this._z=c*u*g-h*d*f,this._w=c*u*f-h*d*g;break;case"XZY":this._x=h*u*f-c*d*g,this._y=c*d*f-h*u*g,this._z=c*u*g+h*d*f,this._w=c*u*f+h*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,r=Math.sin(n);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],r=e[4],s=e[8],o=e[1],a=e[5],l=e[9],c=e[2],u=e[6],f=e[10],h=n+a+f;if(h>0){const d=.5/Math.sqrt(h+1);this._w=.25/d,this._x=(u-l)*d,this._y=(s-c)*d,this._z=(o-r)*d}else if(n>a&&n>f){const d=2*Math.sqrt(1+n-a-f);this._w=(u-l)/d,this._x=.25*d,this._y=(r+o)/d,this._z=(s+c)/d}else if(a>f){const d=2*Math.sqrt(1+a-n-f);this._w=(s-c)/d,this._x=(r+o)/d,this._y=.25*d,this._z=(l+u)/d}else{const d=2*Math.sqrt(1+f-n-a);this._w=(o-r)/d,this._x=(s+c)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ne(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const r=Math.min(1,e/n);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,r=t._y,s=t._z,o=t._w,a=e._x,l=e._y,c=e._z,u=e._w;return this._x=n*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-n*c,this._z=s*u+o*c+n*l-r*a,this._w=o*u-n*a-r*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,r=this._y,s=this._z,o=this._w;let a=o*t._w+n*t._x+r*t._y+s*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const d=1-e;return this._w=d*o+e*this._w,this._x=d*n+e*this._x,this._y=d*r+e*this._y,this._z=d*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),f=Math.sin((1-e)*u)/c,h=Math.sin(e*u)/c;return this._w=o*f+this._w*h,this._x=n*f+this._x*h,this._y=r*f+this._y*h,this._z=s*f+this._z*h,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(t=0,e=0,n=0){L.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Dl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Dl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*r,this.y=s[1]*e+s[4]*n+s[7]*r,this.z=s[2]*e+s[5]*n+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=t.elements,o=1/(s[3]*e+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*r+s[12])*o,this.y=(s[1]*e+s[5]*n+s[9]*r+s[13])*o,this.z=(s[2]*e+s[6]*n+s[10]*r+s[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,r=this.z,s=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*r-a*n),u=2*(a*e-s*r),f=2*(s*n-o*e);return this.x=e+l*c+o*f-a*u,this.y=n+l*u+a*c-s*f,this.z=r+l*f+s*u-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*r,this.y=s[1]*e+s[5]*n+s[9]*r,this.z=s[2]*e+s[6]*n+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,r=t.y,s=t.z,o=e.x,a=e.y,l=e.z;return this.x=r*l-s*a,this.y=s*o-n*l,this.z=n*a-r*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return wo.copy(this).projectOnVector(t),this.sub(wo)}reflect(t){return this.sub(wo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,r=this.z-t.z;return e*e+n*n+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const r=Math.sin(e)*t;return this.x=r*Math.sin(n),this.y=Math.cos(e)*t,this.z=r*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const wo=new L,Dl=new pi;class pe{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(tn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(tn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=tn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,tn):tn.fromBufferAttribute(s,o),tn.applyMatrix4(t.matrixWorld),this.expandByPoint(tn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Xr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Xr.copy(n.boundingBox)),Xr.applyMatrix4(t.matrixWorld),this.union(Xr)}const r=t.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,tn),tn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(_r),qr.subVectors(this.max,_r),wi.subVectors(t.a,_r),Ei.subVectors(t.b,_r),Ti.subVectors(t.c,_r),Rn.subVectors(Ei,wi),Ln.subVectors(Ti,Ei),Jn.subVectors(wi,Ti);let e=[0,-Rn.z,Rn.y,0,-Ln.z,Ln.y,0,-Jn.z,Jn.y,Rn.z,0,-Rn.x,Ln.z,0,-Ln.x,Jn.z,0,-Jn.x,-Rn.y,Rn.x,0,-Ln.y,Ln.x,0,-Jn.y,Jn.x,0];return!Eo(e,wi,Ei,Ti,qr)||(e=[1,0,0,0,1,0,0,0,1],!Eo(e,wi,Ei,Ti,qr))?!1:(jr.crossVectors(Rn,Ln),e=[jr.x,jr.y,jr.z],Eo(e,wi,Ei,Ti,qr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,tn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(tn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(gn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),gn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),gn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),gn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),gn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),gn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),gn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),gn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(gn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const gn=[new L,new L,new L,new L,new L,new L,new L,new L],tn=new L,Xr=new pe,wi=new L,Ei=new L,Ti=new L,Rn=new L,Ln=new L,Jn=new L,_r=new L,qr=new L,jr=new L,Qn=new L;function Eo(i,t,e,n,r){for(let s=0,o=i.length-3;s<=o;s+=3){Qn.fromArray(i,s);const a=r.x*Math.abs(Qn.x)+r.y*Math.abs(Qn.y)+r.z*Math.abs(Qn.z),l=t.dot(Qn),c=e.dot(Qn),u=n.dot(Qn);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const uf=new pe,xr=new L,To=new L;class pn{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):uf.setFromPoints(t).getCenter(n);let r=0;for(let s=0,o=t.length;s<o;s++)r=Math.max(r,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;xr.subVectors(t,this.center);const e=xr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),r=(n-this.radius)*.5;this.center.addScaledVector(xr,r/n),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(To.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(xr.copy(t.center).add(To)),this.expandByPoint(xr.copy(t.center).sub(To))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const _n=new L,Ao=new L,Yr=new L,In=new L,Co=new L,$r=new L,Po=new L;class kr{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,_n)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=_n.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(_n.copy(this.origin).addScaledVector(this.direction,e),_n.distanceToSquared(t))}distanceSqToSegment(t,e,n,r){Ao.copy(t).add(e).multiplyScalar(.5),Yr.copy(e).sub(t).normalize(),In.copy(this.origin).sub(Ao);const s=t.distanceTo(e)*.5,o=-this.direction.dot(Yr),a=In.dot(this.direction),l=-In.dot(Yr),c=In.lengthSq(),u=Math.abs(1-o*o);let f,h,d,g;if(u>0)if(f=o*l-a,h=o*a-l,g=s*u,f>=0)if(h>=-g)if(h<=g){const _=1/u;f*=_,h*=_,d=f*(f+o*h+2*a)+h*(o*f+h+2*l)+c}else h=s,f=Math.max(0,-(o*h+a)),d=-f*f+h*(h+2*l)+c;else h=-s,f=Math.max(0,-(o*h+a)),d=-f*f+h*(h+2*l)+c;else h<=-g?(f=Math.max(0,-(-o*s+a)),h=f>0?-s:Math.min(Math.max(-s,-l),s),d=-f*f+h*(h+2*l)+c):h<=g?(f=0,h=Math.min(Math.max(-s,-l),s),d=h*(h+2*l)+c):(f=Math.max(0,-(o*s+a)),h=f>0?s:Math.min(Math.max(-s,-l),s),d=-f*f+h*(h+2*l)+c);else h=o>0?-s:s,f=Math.max(0,-(o*h+a)),d=-f*f+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(Ao).addScaledVector(Yr,h),d}intersectSphere(t,e){_n.subVectors(t.center,this.origin);const n=_n.dot(this.direction),r=_n.dot(_n)-n*n,s=t.radius*t.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,r,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,h=this.origin;return c>=0?(n=(t.min.x-h.x)*c,r=(t.max.x-h.x)*c):(n=(t.max.x-h.x)*c,r=(t.min.x-h.x)*c),u>=0?(s=(t.min.y-h.y)*u,o=(t.max.y-h.y)*u):(s=(t.max.y-h.y)*u,o=(t.min.y-h.y)*u),n>o||s>r||((s>n||isNaN(n))&&(n=s),(o<r||isNaN(r))&&(r=o),f>=0?(a=(t.min.z-h.z)*f,l=(t.max.z-h.z)*f):(a=(t.max.z-h.z)*f,l=(t.min.z-h.z)*f),n>l||a>r)||((a>n||n!==n)&&(n=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(n>=0?n:r,e)}intersectsBox(t){return this.intersectBox(t,_n)!==null}intersectTriangle(t,e,n,r,s){Co.subVectors(e,t),$r.subVectors(n,t),Po.crossVectors(Co,$r);let o=this.direction.dot(Po),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;In.subVectors(this.origin,t);const l=a*this.direction.dot($r.crossVectors(In,$r));if(l<0)return null;const c=a*this.direction.dot(Co.cross(In));if(c<0||l+c>o)return null;const u=-a*In.dot(Po);return u<0?null:this.at(u/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Bt{constructor(t,e,n,r,s,o,a,l,c,u,f,h,d,g,_,m){Bt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,o,a,l,c,u,f,h,d,g,_,m)}set(t,e,n,r,s,o,a,l,c,u,f,h,d,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=r,p[1]=s,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=u,p[10]=f,p[14]=h,p[3]=d,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Bt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,r=1/Ai.setFromMatrixColumn(t,0).length(),s=1/Ai.setFromMatrixColumn(t,1).length(),o=1/Ai.setFromMatrixColumn(t,2).length();return e[0]=n[0]*r,e[1]=n[1]*r,e[2]=n[2]*r,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,r=t.y,s=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),f=Math.sin(s);if(t.order==="XYZ"){const h=o*u,d=o*f,g=a*u,_=a*f;e[0]=l*u,e[4]=-l*f,e[8]=c,e[1]=d+g*c,e[5]=h-_*c,e[9]=-a*l,e[2]=_-h*c,e[6]=g+d*c,e[10]=o*l}else if(t.order==="YXZ"){const h=l*u,d=l*f,g=c*u,_=c*f;e[0]=h+_*a,e[4]=g*a-d,e[8]=o*c,e[1]=o*f,e[5]=o*u,e[9]=-a,e[2]=d*a-g,e[6]=_+h*a,e[10]=o*l}else if(t.order==="ZXY"){const h=l*u,d=l*f,g=c*u,_=c*f;e[0]=h-_*a,e[4]=-o*f,e[8]=g+d*a,e[1]=d+g*a,e[5]=o*u,e[9]=_-h*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const h=o*u,d=o*f,g=a*u,_=a*f;e[0]=l*u,e[4]=g*c-d,e[8]=h*c+_,e[1]=l*f,e[5]=_*c+h,e[9]=d*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const h=o*l,d=o*c,g=a*l,_=a*c;e[0]=l*u,e[4]=_-h*f,e[8]=g*f+d,e[1]=f,e[5]=o*u,e[9]=-a*u,e[2]=-c*u,e[6]=d*f+g,e[10]=h-_*f}else if(t.order==="XZY"){const h=o*l,d=o*c,g=a*l,_=a*c;e[0]=l*u,e[4]=-f,e[8]=c*u,e[1]=h*f+_,e[5]=o*u,e[9]=d*f-g,e[2]=g*f-d,e[6]=a*u,e[10]=_*f+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(hf,t,ff)}lookAt(t,e,n){const r=this.elements;return We.subVectors(t,e),We.lengthSq()===0&&(We.z=1),We.normalize(),Dn.crossVectors(n,We),Dn.lengthSq()===0&&(Math.abs(n.z)===1?We.x+=1e-4:We.z+=1e-4,We.normalize(),Dn.crossVectors(n,We)),Dn.normalize(),Kr.crossVectors(We,Dn),r[0]=Dn.x,r[4]=Kr.x,r[8]=We.x,r[1]=Dn.y,r[5]=Kr.y,r[9]=We.y,r[2]=Dn.z,r[6]=Kr.z,r[10]=We.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],f=n[5],h=n[9],d=n[13],g=n[2],_=n[6],m=n[10],p=n[14],v=n[3],x=n[7],y=n[11],T=n[15],w=r[0],S=r[4],P=r[8],M=r[12],b=r[1],C=r[5],R=r[9],I=r[13],O=r[2],k=r[6],z=r[10],j=r[14],W=r[3],lt=r[7],ht=r[11],nt=r[15];return s[0]=o*w+a*b+l*O+c*W,s[4]=o*S+a*C+l*k+c*lt,s[8]=o*P+a*R+l*z+c*ht,s[12]=o*M+a*I+l*j+c*nt,s[1]=u*w+f*b+h*O+d*W,s[5]=u*S+f*C+h*k+d*lt,s[9]=u*P+f*R+h*z+d*ht,s[13]=u*M+f*I+h*j+d*nt,s[2]=g*w+_*b+m*O+p*W,s[6]=g*S+_*C+m*k+p*lt,s[10]=g*P+_*R+m*z+p*ht,s[14]=g*M+_*I+m*j+p*nt,s[3]=v*w+x*b+y*O+T*W,s[7]=v*S+x*C+y*k+T*lt,s[11]=v*P+x*R+y*z+T*ht,s[15]=v*M+x*I+y*j+T*nt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],r=t[8],s=t[12],o=t[1],a=t[5],l=t[9],c=t[13],u=t[2],f=t[6],h=t[10],d=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+s*l*f-r*c*f-s*a*h+n*c*h+r*a*d-n*l*d)+_*(+e*l*d-e*c*h+s*o*h-r*o*d+r*c*u-s*l*u)+m*(+e*c*f-e*a*d-s*o*f+n*o*d+s*a*u-n*c*u)+p*(-r*a*u-e*l*f+e*a*h+r*o*f-n*o*h+n*l*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],f=t[9],h=t[10],d=t[11],g=t[12],_=t[13],m=t[14],p=t[15],v=f*m*c-_*h*c+_*l*d-a*m*d-f*l*p+a*h*p,x=g*h*c-u*m*c-g*l*d+o*m*d+u*l*p-o*h*p,y=u*_*c-g*f*c+g*a*d-o*_*d-u*a*p+o*f*p,T=g*f*l-u*_*l-g*a*h+o*_*h+u*a*m-o*f*m,w=e*v+n*x+r*y+s*T;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const S=1/w;return t[0]=v*S,t[1]=(_*h*s-f*m*s-_*r*d+n*m*d+f*r*p-n*h*p)*S,t[2]=(a*m*s-_*l*s+_*r*c-n*m*c-a*r*p+n*l*p)*S,t[3]=(f*l*s-a*h*s-f*r*c+n*h*c+a*r*d-n*l*d)*S,t[4]=x*S,t[5]=(u*m*s-g*h*s+g*r*d-e*m*d-u*r*p+e*h*p)*S,t[6]=(g*l*s-o*m*s-g*r*c+e*m*c+o*r*p-e*l*p)*S,t[7]=(o*h*s-u*l*s+u*r*c-e*h*c-o*r*d+e*l*d)*S,t[8]=y*S,t[9]=(g*f*s-u*_*s-g*n*d+e*_*d+u*n*p-e*f*p)*S,t[10]=(o*_*s-g*a*s+g*n*c-e*_*c-o*n*p+e*a*p)*S,t[11]=(u*a*s-o*f*s-u*n*c+e*f*c+o*n*d-e*a*d)*S,t[12]=T*S,t[13]=(u*_*r-g*f*r+g*n*h-e*_*h-u*n*m+e*f*m)*S,t[14]=(g*a*r-o*_*r-g*n*l+e*_*l+o*n*m-e*a*m)*S,t[15]=(o*f*r-u*a*r+u*n*l-e*f*l-o*n*h+e*a*h)*S,this}scale(t){const e=this.elements,n=t.x,r=t.y,s=t.z;return e[0]*=n,e[4]*=r,e[8]*=s,e[1]*=n,e[5]*=r,e[9]*=s,e[2]*=n,e[6]*=r,e[10]*=s,e[3]*=n,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,r))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),r=Math.sin(e),s=1-n,o=t.x,a=t.y,l=t.z,c=s*o,u=s*a;return this.set(c*o+n,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+n,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,r,s,o){return this.set(1,n,s,0,t,1,o,0,e,r,1,0,0,0,0,1),this}compose(t,e,n){const r=this.elements,s=e._x,o=e._y,a=e._z,l=e._w,c=s+s,u=o+o,f=a+a,h=s*c,d=s*u,g=s*f,_=o*u,m=o*f,p=a*f,v=l*c,x=l*u,y=l*f,T=n.x,w=n.y,S=n.z;return r[0]=(1-(_+p))*T,r[1]=(d+y)*T,r[2]=(g-x)*T,r[3]=0,r[4]=(d-y)*w,r[5]=(1-(h+p))*w,r[6]=(m+v)*w,r[7]=0,r[8]=(g+x)*S,r[9]=(m-v)*S,r[10]=(1-(h+_))*S,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,n){const r=this.elements;let s=Ai.set(r[0],r[1],r[2]).length();const o=Ai.set(r[4],r[5],r[6]).length(),a=Ai.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),t.x=r[12],t.y=r[13],t.z=r[14],en.copy(this);const c=1/s,u=1/o,f=1/a;return en.elements[0]*=c,en.elements[1]*=c,en.elements[2]*=c,en.elements[4]*=u,en.elements[5]*=u,en.elements[6]*=u,en.elements[8]*=f,en.elements[9]*=f,en.elements[10]*=f,e.setFromRotationMatrix(en),n.x=s,n.y=o,n.z=a,this}makePerspective(t,e,n,r,s,o,a=Tn){const l=this.elements,c=2*s/(e-t),u=2*s/(n-r),f=(e+t)/(e-t),h=(n+r)/(n-r);let d,g;if(a===Tn)d=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(a===js)d=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,r,s,o,a=Tn){const l=this.elements,c=1/(e-t),u=1/(n-r),f=1/(o-s),h=(e+t)*c,d=(n+r)*u;let g,_;if(a===Tn)g=(o+s)*f,_=-2*f;else if(a===js)g=s*f,_=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-h,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<16;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ai=new L,en=new Bt,hf=new L(0,0,0),ff=new L(1,1,1),Dn=new L,Kr=new L,We=new L,Ul=new Bt,Nl=new pi;class je{constructor(t=0,e=0,n=0,r=je.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,r=this._order){return this._x=t,this._y=e,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const r=t.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],f=r[2],h=r[6],d=r[10];switch(e){case"XYZ":this._y=Math.asin(Ne(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ne(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ne(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Ne(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,d),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ne(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Ne(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ul.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ul,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Nl.setFromEuler(this),this.setFromQuaternion(Nl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}je.DEFAULT_ORDER="XYZ";class Na{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let df=0;const Ol=new L,Ci=new pi,xn=new Bt,Zr=new L,vr=new L,pf=new L,mf=new pi,Bl=new L(1,0,0),Fl=new L(0,1,0),kl=new L(0,0,1),zl={type:"added"},gf={type:"removed"},Pi={type:"childadded",child:null},Ro={type:"childremoved",child:null};class we extends yi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:df++}),this.uuid=Fr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=we.DEFAULT_UP.clone();const t=new L,e=new je,n=new pi,r=new L(1,1,1);function s(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Bt},normalMatrix:{value:new Ct}}),this.matrix=new Bt,this.matrixWorld=new Bt,this.matrixAutoUpdate=we.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=we.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Na,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ci.setFromAxisAngle(t,e),this.quaternion.multiply(Ci),this}rotateOnWorldAxis(t,e){return Ci.setFromAxisAngle(t,e),this.quaternion.premultiply(Ci),this}rotateX(t){return this.rotateOnAxis(Bl,t)}rotateY(t){return this.rotateOnAxis(Fl,t)}rotateZ(t){return this.rotateOnAxis(kl,t)}translateOnAxis(t,e){return Ol.copy(t).applyQuaternion(this.quaternion),this.position.add(Ol.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Bl,t)}translateY(t){return this.translateOnAxis(Fl,t)}translateZ(t){return this.translateOnAxis(kl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(xn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Zr.copy(t):Zr.set(t,e,n);const r=this.parent;this.updateWorldMatrix(!0,!1),vr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?xn.lookAt(vr,Zr,this.up):xn.lookAt(Zr,vr,this.up),this.quaternion.setFromRotationMatrix(xn),r&&(xn.extractRotation(r.matrixWorld),Ci.setFromRotationMatrix(xn),this.quaternion.premultiply(Ci.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(zl),Pi.child=t,this.dispatchEvent(Pi),Pi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(gf),Ro.child=t,this.dispatchEvent(Ro),Ro.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),xn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),xn.multiply(t.parent.matrixWorld)),t.applyMatrix4(xn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(zl),Pi.child=t,this.dispatchEvent(Pi),Pi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,r=this.children.length;n<r;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vr,t,pf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vr,mf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,r=e.length;n<r;n++){const s=e[n];(s.matrixWorldAutoUpdate===!0||t===!0)&&s.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++){const a=r[s];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxGeometryCount=this._maxGeometryCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];s(t.shapes,f)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(t.materials,this.material[l]));r.material=a}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),u=o(t.images),f=o(t.shapes),h=o(t.skeletons),d=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),f.length>0&&(n.shapes=f),h.length>0&&(n.skeletons=h),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=r,n;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const r=t.children[n];this.add(r.clone())}return this}}we.DEFAULT_UP=new L(0,1,0);we.DEFAULT_MATRIX_AUTO_UPDATE=!0;we.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const nn=new L,vn=new L,Lo=new L,yn=new L,Ri=new L,Li=new L,Hl=new L,Io=new L,Do=new L,Uo=new L;class Pe{constructor(t=new L,e=new L,n=new L){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,r){r.subVectors(n,e),nn.subVectors(t,e),r.cross(nn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,n,r,s){nn.subVectors(r,e),vn.subVectors(n,e),Lo.subVectors(t,e);const o=nn.dot(nn),a=nn.dot(vn),l=nn.dot(Lo),c=vn.dot(vn),u=vn.dot(Lo),f=o*c-a*a;if(f===0)return s.set(0,0,0),null;const h=1/f,d=(c*l-a*u)*h,g=(o*u-a*l)*h;return s.set(1-d-g,g,d)}static containsPoint(t,e,n,r){return this.getBarycoord(t,e,n,r,yn)===null?!1:yn.x>=0&&yn.y>=0&&yn.x+yn.y<=1}static getInterpolation(t,e,n,r,s,o,a,l){return this.getBarycoord(t,e,n,r,yn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,yn.x),l.addScaledVector(o,yn.y),l.addScaledVector(a,yn.z),l)}static isFrontFacing(t,e,n,r){return nn.subVectors(n,e),vn.subVectors(t,e),nn.cross(vn).dot(r)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,r){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,n,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return nn.subVectors(this.c,this.b),vn.subVectors(this.a,this.b),nn.cross(vn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Pe.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Pe.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,r,s){return Pe.getInterpolation(t,this.a,this.b,this.c,e,n,r,s)}containsPoint(t){return Pe.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Pe.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,r=this.b,s=this.c;let o,a;Ri.subVectors(r,n),Li.subVectors(s,n),Io.subVectors(t,n);const l=Ri.dot(Io),c=Li.dot(Io);if(l<=0&&c<=0)return e.copy(n);Do.subVectors(t,r);const u=Ri.dot(Do),f=Li.dot(Do);if(u>=0&&f<=u)return e.copy(r);const h=l*f-u*c;if(h<=0&&l>=0&&u<=0)return o=l/(l-u),e.copy(n).addScaledVector(Ri,o);Uo.subVectors(t,s);const d=Ri.dot(Uo),g=Li.dot(Uo);if(g>=0&&d<=g)return e.copy(s);const _=d*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(Li,a);const m=u*g-d*f;if(m<=0&&f-u>=0&&d-g>=0)return Hl.subVectors(s,r),a=(f-u)/(f-u+(d-g)),e.copy(r).addScaledVector(Hl,a);const p=1/(m+_+h);return o=_*p,a=h*p,e.copy(n).addScaledVector(Ri,o).addScaledVector(Li,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const bu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Un={h:0,s:0,l:0},Jr={h:0,s:0,l:0};function No(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class kt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=un){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Yt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,r=Yt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Yt.toWorkingColorSpace(this,r),this}setHSL(t,e,n,r=Yt.workingColorSpace){if(t=tf(t,1),e=Ne(e,0,1),n=Ne(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,o=2*n-s;this.r=No(o,s,t+1/3),this.g=No(o,s,t),this.b=No(o,s,t-1/3)}return Yt.toWorkingColorSpace(this,r),this}setStyle(t,e=un){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=un){const n=bu[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=or(t.r),this.g=or(t.g),this.b=or(t.b),this}copyLinearToSRGB(t){return this.r=Mo(t.r),this.g=Mo(t.g),this.b=Mo(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=un){return Yt.fromWorkingColorSpace(Ae.copy(this),t),Math.round(Ne(Ae.r*255,0,255))*65536+Math.round(Ne(Ae.g*255,0,255))*256+Math.round(Ne(Ae.b*255,0,255))}getHexString(t=un){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Yt.workingColorSpace){Yt.fromWorkingColorSpace(Ae.copy(this),e);const n=Ae.r,r=Ae.g,s=Ae.b,o=Math.max(n,r,s),a=Math.min(n,r,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const f=o-a;switch(c=u<=.5?f/(o+a):f/(2-o-a),o){case n:l=(r-s)/f+(r<s?6:0);break;case r:l=(s-n)/f+2;break;case s:l=(n-r)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=Yt.workingColorSpace){return Yt.fromWorkingColorSpace(Ae.copy(this),e),t.r=Ae.r,t.g=Ae.g,t.b=Ae.b,t}getStyle(t=un){Yt.fromWorkingColorSpace(Ae.copy(this),t);const e=Ae.r,n=Ae.g,r=Ae.b;return t!==un?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(t,e,n){return this.getHSL(Un),this.setHSL(Un.h+t,Un.s+e,Un.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Un),t.getHSL(Jr);const n=yo(Un.h,Jr.h,e),r=yo(Un.s,Jr.s,e),s=yo(Un.l,Jr.l,e);return this.setHSL(n,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*r,this.g=s[1]*e+s[4]*n+s[7]*r,this.b=s[2]*e+s[5]*n+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ae=new kt;kt.NAMES=bu;let _f=0;class bi extends yi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:_f++}),this.uuid=Fr(),this.name="",this.type="Material",this.blending=rr,this.side=on,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ha,this.blendDst=fa,this.blendEquation=ci,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new kt(0,0,0),this.blendAlpha=0,this.depthFunc=Gs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Al,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Mi,this.stencilZFail=Mi,this.stencilZPass=Mi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==rr&&(n.blending=this.blending),this.side!==on&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ha&&(n.blendSrc=this.blendSrc),this.blendDst!==fa&&(n.blendDst=this.blendDst),this.blendEquation!==ci&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Gs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Al&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Mi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Mi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Mi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(e){const s=r(t.textures),o=r(t.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const r=e.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class mi extends bi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new kt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new je,this.combine=Da,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const ce=new L,Qr=new wt;class ke{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Cl,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=fn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return xu("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[n+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Qr.fromBufferAttribute(this,e),Qr.applyMatrix3(t),this.setXY(e,Qr.x,Qr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ce.fromBufferAttribute(this,e),ce.applyMatrix3(t),this.setXYZ(e,ce.x,ce.y,ce.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ce.fromBufferAttribute(this,e),ce.applyMatrix4(t),this.setXYZ(e,ce.x,ce.y,ce.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ce.fromBufferAttribute(this,e),ce.applyNormalMatrix(t),this.setXYZ(e,ce.x,ce.y,ce.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ce.fromBufferAttribute(this,e),ce.transformDirection(t),this.setXYZ(e,ce.x,ce.y,ce.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=gr(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=He(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=gr(e,this.array)),e}setX(t,e){return this.normalized&&(e=He(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=gr(e,this.array)),e}setY(t,e){return this.normalized&&(e=He(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=gr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=He(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=gr(e,this.array)),e}setW(t,e){return this.normalized&&(e=He(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=He(e,this.array),n=He(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,r){return t*=this.itemSize,this.normalized&&(e=He(e,this.array),n=He(n,this.array),r=He(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t*=this.itemSize,this.normalized&&(e=He(e,this.array),n=He(n,this.array),r=He(r,this.array),s=He(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Cl&&(t.usage=this.usage),t}}class Mu extends ke{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Su extends ke{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class me extends ke{constructor(t,e,n){super(new Float32Array(t),e,n)}}let xf=0;const $e=new Bt,Oo=new we,Ii=new L,Xe=new pe,yr=new pe,ye=new L;class Ie extends yi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:xf++}),this.uuid=Fr(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(_u(t)?Su:Mu)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Ct().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return $e.makeRotationFromQuaternion(t),this.applyMatrix4($e),this}rotateX(t){return $e.makeRotationX(t),this.applyMatrix4($e),this}rotateY(t){return $e.makeRotationY(t),this.applyMatrix4($e),this}rotateZ(t){return $e.makeRotationZ(t),this.applyMatrix4($e),this}translate(t,e,n){return $e.makeTranslation(t,e,n),this.applyMatrix4($e),this}scale(t,e,n){return $e.makeScale(t,e,n),this.applyMatrix4($e),this}lookAt(t){return Oo.lookAt(t),Oo.updateMatrix(),this.applyMatrix4(Oo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ii).negate(),this.translate(Ii.x,Ii.y,Ii.z),this}setFromPoints(t){const e=[];for(let n=0,r=t.length;n<r;n++){const s=t[n];e.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new me(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new pe);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,r=e.length;n<r;n++){const s=e[n];Xe.setFromBufferAttribute(s),this.morphTargetsRelative?(ye.addVectors(this.boundingBox.min,Xe.min),this.boundingBox.expandByPoint(ye),ye.addVectors(this.boundingBox.max,Xe.max),this.boundingBox.expandByPoint(ye)):(this.boundingBox.expandByPoint(Xe.min),this.boundingBox.expandByPoint(Xe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new pn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(t){const n=this.boundingSphere.center;if(Xe.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const a=e[s];yr.setFromBufferAttribute(a),this.morphTargetsRelative?(ye.addVectors(Xe.min,yr.min),Xe.expandByPoint(ye),ye.addVectors(Xe.max,yr.max),Xe.expandByPoint(ye)):(Xe.expandByPoint(yr.min),Xe.expandByPoint(yr.max))}Xe.getCenter(n);let r=0;for(let s=0,o=t.count;s<o;s++)ye.fromBufferAttribute(t,s),r=Math.max(r,n.distanceToSquared(ye));if(e)for(let s=0,o=e.length;s<o;s++){const a=e[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)ye.fromBufferAttribute(a,c),l&&(Ii.fromBufferAttribute(t,c),ye.add(Ii)),r=Math.max(r,n.distanceToSquared(ye))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,r=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ke(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let P=0;P<n.count;P++)a[P]=new L,l[P]=new L;const c=new L,u=new L,f=new L,h=new wt,d=new wt,g=new wt,_=new L,m=new L;function p(P,M,b){c.fromBufferAttribute(n,P),u.fromBufferAttribute(n,M),f.fromBufferAttribute(n,b),h.fromBufferAttribute(s,P),d.fromBufferAttribute(s,M),g.fromBufferAttribute(s,b),u.sub(c),f.sub(c),d.sub(h),g.sub(h);const C=1/(d.x*g.y-g.x*d.y);isFinite(C)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(f,-d.y).multiplyScalar(C),m.copy(f).multiplyScalar(d.x).addScaledVector(u,-g.x).multiplyScalar(C),a[P].add(_),a[M].add(_),a[b].add(_),l[P].add(m),l[M].add(m),l[b].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:t.count}]);for(let P=0,M=v.length;P<M;++P){const b=v[P],C=b.start,R=b.count;for(let I=C,O=C+R;I<O;I+=3)p(t.getX(I+0),t.getX(I+1),t.getX(I+2))}const x=new L,y=new L,T=new L,w=new L;function S(P){T.fromBufferAttribute(r,P),w.copy(T);const M=a[P];x.copy(M),x.sub(T.multiplyScalar(T.dot(M))).normalize(),y.crossVectors(w,M);const C=y.dot(l[P])<0?-1:1;o.setXYZW(P,x.x,x.y,x.z,C)}for(let P=0,M=v.length;P<M;++P){const b=v[P],C=b.start,R=b.count;for(let I=C,O=C+R;I<O;I+=3)S(t.getX(I+0)),S(t.getX(I+1)),S(t.getX(I+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new ke(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let h=0,d=n.count;h<d;h++)n.setXYZ(h,0,0,0);const r=new L,s=new L,o=new L,a=new L,l=new L,c=new L,u=new L,f=new L;if(t)for(let h=0,d=t.count;h<d;h+=3){const g=t.getX(h+0),_=t.getX(h+1),m=t.getX(h+2);r.fromBufferAttribute(e,g),s.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),u.subVectors(o,s),f.subVectors(r,s),u.cross(f),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),a.add(u),l.add(u),c.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,d=e.count;h<d;h+=3)r.fromBufferAttribute(e,h+0),s.fromBufferAttribute(e,h+1),o.fromBufferAttribute(e,h+2),u.subVectors(o,s),f.subVectors(r,s),u.cross(f),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ye.fromBufferAttribute(t,e),ye.normalize(),t.setXYZ(e,ye.x,ye.y,ye.z)}toNonIndexed(){function t(a,l){const c=a.array,u=a.itemSize,f=a.normalized,h=new c.constructor(l.length*u);let d=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?d=l[_]*a.data.stride+a.offset:d=l[_]*u;for(let p=0;p<u;p++)h[g++]=c[d++]}return new ke(h,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ie,n=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=t(l,n);e.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,f=c.length;u<f;u++){const h=c[u],d=t(h,n);l.push(d)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,h=c.length;f<h;f++){const d=c[f];u.push(d.toJSON(t.data))}u.length>0&&(r[l]=u,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const r=t.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(e))}const s=t.morphAttributes;for(const c in s){const u=[],f=s[c];for(let h=0,d=f.length;h<d;h++)u.push(f[h].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,u=o.length;c<u;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Gl=new Bt,ti=new kr,ts=new pn,Vl=new L,Di=new L,Ui=new L,Ni=new L,Bo=new L,es=new L,ns=new wt,is=new wt,rs=new wt,Wl=new L,Xl=new L,ql=new L,ss=new L,os=new L;class It extends we{constructor(t=new Ie,e=new mi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(t,e){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(r,t);const a=this.morphTargetInfluences;if(s&&a){es.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],f=s[l];u!==0&&(Bo.fromBufferAttribute(f,t),o?es.addScaledVector(Bo,u):es.addScaledVector(Bo.sub(e),u))}e.add(es)}return e}raycast(t,e){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ts.copy(n.boundingSphere),ts.applyMatrix4(s),ti.copy(t.ray).recast(t.near),!(ts.containsPoint(ti.origin)===!1&&(ti.intersectSphere(ts,Vl)===null||ti.origin.distanceToSquared(Vl)>(t.far-t.near)**2))&&(Gl.copy(s).invert(),ti.copy(t.ray).applyMatrix4(Gl),!(n.boundingBox!==null&&ti.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ti)))}_computeIntersections(t,e,n){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,f=s.attributes.normal,h=s.groups,d=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=h.length;g<_;g++){const m=h[g],p=o[m.materialIndex],v=Math.max(m.start,d.start),x=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let y=v,T=x;y<T;y+=3){const w=a.getX(y),S=a.getX(y+1),P=a.getX(y+2);r=as(this,p,t,n,c,u,f,w,S,P),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,e.push(r))}}else{const g=Math.max(0,d.start),_=Math.min(a.count,d.start+d.count);for(let m=g,p=_;m<p;m+=3){const v=a.getX(m),x=a.getX(m+1),y=a.getX(m+2);r=as(this,o,t,n,c,u,f,v,x,y),r&&(r.faceIndex=Math.floor(m/3),e.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=h.length;g<_;g++){const m=h[g],p=o[m.materialIndex],v=Math.max(m.start,d.start),x=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let y=v,T=x;y<T;y+=3){const w=y,S=y+1,P=y+2;r=as(this,p,t,n,c,u,f,w,S,P),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,e.push(r))}}else{const g=Math.max(0,d.start),_=Math.min(l.count,d.start+d.count);for(let m=g,p=_;m<p;m+=3){const v=m,x=m+1,y=m+2;r=as(this,o,t,n,c,u,f,v,x,y),r&&(r.faceIndex=Math.floor(m/3),e.push(r))}}}}function vf(i,t,e,n,r,s,o,a){let l;if(t.side===Be?l=n.intersectTriangle(o,s,r,!0,a):l=n.intersectTriangle(r,s,o,t.side===on,a),l===null)return null;os.copy(a),os.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(os);return c<e.near||c>e.far?null:{distance:c,point:os.clone(),object:i}}function as(i,t,e,n,r,s,o,a,l,c){i.getVertexPosition(a,Di),i.getVertexPosition(l,Ui),i.getVertexPosition(c,Ni);const u=vf(i,t,e,n,Di,Ui,Ni,ss);if(u){r&&(ns.fromBufferAttribute(r,a),is.fromBufferAttribute(r,l),rs.fromBufferAttribute(r,c),u.uv=Pe.getInterpolation(ss,Di,Ui,Ni,ns,is,rs,new wt)),s&&(ns.fromBufferAttribute(s,a),is.fromBufferAttribute(s,l),rs.fromBufferAttribute(s,c),u.uv1=Pe.getInterpolation(ss,Di,Ui,Ni,ns,is,rs,new wt)),o&&(Wl.fromBufferAttribute(o,a),Xl.fromBufferAttribute(o,l),ql.fromBufferAttribute(o,c),u.normal=Pe.getInterpolation(ss,Di,Ui,Ni,Wl,Xl,ql,new L),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const f={a,b:l,c,normal:new L,materialIndex:0};Pe.getNormal(Di,Ui,Ni,f.normal),u.face=f}return u}class ne extends Ie{constructor(t=1,e=1,n=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],f=[];let h=0,d=0;g("z","y","x",-1,-1,n,e,t,o,s,0),g("z","y","x",1,-1,n,e,-t,o,s,1),g("x","z","y",1,1,t,n,e,r,o,2),g("x","z","y",1,-1,t,n,-e,r,o,3),g("x","y","z",1,-1,t,e,n,r,s,4),g("x","y","z",-1,-1,t,e,-n,r,s,5),this.setIndex(l),this.setAttribute("position",new me(c,3)),this.setAttribute("normal",new me(u,3)),this.setAttribute("uv",new me(f,2));function g(_,m,p,v,x,y,T,w,S,P,M){const b=y/S,C=T/P,R=y/2,I=T/2,O=w/2,k=S+1,z=P+1;let j=0,W=0;const lt=new L;for(let ht=0;ht<z;ht++){const nt=ht*C-I;for(let Dt=0;Dt<k;Dt++){const Wt=Dt*b-R;lt[_]=Wt*v,lt[m]=nt*x,lt[p]=O,c.push(lt.x,lt.y,lt.z),lt[_]=0,lt[m]=0,lt[p]=w>0?1:-1,u.push(lt.x,lt.y,lt.z),f.push(Dt/S),f.push(1-ht/P),j+=1}}for(let ht=0;ht<P;ht++)for(let nt=0;nt<S;nt++){const Dt=h+nt+k*ht,Wt=h+nt+k*(ht+1),q=h+(nt+1)+k*(ht+1),J=h+(nt+1)+k*ht;l.push(Dt,Wt,J),l.push(Wt,q,J),W+=6}a.addGroup(d,W,M),d+=W,h+=j}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ne(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function dr(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const r=i[e][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=r.clone():Array.isArray(r)?t[e][n]=r.slice():t[e][n]=r}}return t}function Ue(i){const t={};for(let e=0;e<i.length;e++){const n=dr(i[e]);for(const r in n)t[r]=n[r]}return t}function yf(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function wu(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Yt.workingColorSpace}const bf={clone:dr,merge:Ue};var Mf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Sf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class jn extends bi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Mf,this.fragmentShader=Sf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=dr(t.uniforms),this.uniformsGroups=yf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?e.uniforms[r]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[r]={type:"m4",value:o.toArray()}:e.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Eu extends we{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Bt,this.projectionMatrix=new Bt,this.projectionMatrixInverse=new Bt,this.coordinateSystem=Tn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Nn=new L,jl=new wt,Yl=new wt;class qe extends Eu{constructor(t=50,e=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=_a*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(vo*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return _a*2*Math.atan(Math.tan(vo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Nn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Nn.x,Nn.y).multiplyScalar(-t/Nn.z),Nn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Nn.x,Nn.y).multiplyScalar(-t/Nn.z)}getViewSize(t,e){return this.getViewBounds(t,jl,Yl),e.subVectors(Yl,jl)}setViewOffset(t,e,n,r,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(vo*.5*this.fov)/this.zoom,n=2*e,r=this.aspect*n,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,e-=o.offsetY*n/c,r*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(s+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Oi=-90,Bi=1;class wf extends we{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new qe(Oi,Bi,t,e);r.layers=this.layers,this.add(r);const s=new qe(Oi,Bi,t,e);s.layers=this.layers,this.add(s);const o=new qe(Oi,Bi,t,e);o.layers=this.layers,this.add(o);const a=new qe(Oi,Bi,t,e);a.layers=this.layers,this.add(a);const l=new qe(Oi,Bi,t,e);l.layers=this.layers,this.add(l);const c=new qe(Oi,Bi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,r,s,o,a,l]=e;for(const c of e)this.remove(c);if(t===Tn)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===js)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,u]=this.children,f=t.getRenderTarget(),h=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,r),t.render(e,s),t.setRenderTarget(n,1,r),t.render(e,o),t.setRenderTarget(n,2,r),t.render(e,a),t.setRenderTarget(n,3,r),t.render(e,l),t.setRenderTarget(n,4,r),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,r),t.render(e,u),t.setRenderTarget(f,h,d),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Tu extends Fe{constructor(t,e,n,r,s,o,a,l,c,u){t=t!==void 0?t:[],e=e!==void 0?e:lr,super(t,e,n,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Ef extends di{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},r=[n,n,n,n,n,n];this.texture=new Tu(r,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:sn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new ne(5,5,5),s=new jn({name:"CubemapFromEquirect",uniforms:dr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Be,blending:Vn});s.uniforms.tEquirect.value=e;const o=new It(r,s),a=e.minFilter;return e.minFilter===fi&&(e.minFilter=sn),new wf(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,r){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,r);t.setRenderTarget(s)}}const Fo=new L,Tf=new L,Af=new Ct;class wn{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,r){return this.normal.set(t,e,n),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const r=Fo.subVectors(n,e).cross(Tf.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Fo),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Af.getNormalMatrix(t),r=this.coplanarPoint(Fo).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ei=new pn,ls=new L;class io{constructor(t=new wn,e=new wn,n=new wn,r=new wn,s=new wn,o=new wn){this.planes=[t,e,n,r,s,o]}set(t,e,n,r,s,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Tn){const n=this.planes,r=t.elements,s=r[0],o=r[1],a=r[2],l=r[3],c=r[4],u=r[5],f=r[6],h=r[7],d=r[8],g=r[9],_=r[10],m=r[11],p=r[12],v=r[13],x=r[14],y=r[15];if(n[0].setComponents(l-s,h-c,m-d,y-p).normalize(),n[1].setComponents(l+s,h+c,m+d,y+p).normalize(),n[2].setComponents(l+o,h+u,m+g,y+v).normalize(),n[3].setComponents(l-o,h-u,m-g,y-v).normalize(),n[4].setComponents(l-a,h-f,m-_,y-x).normalize(),e===Tn)n[5].setComponents(l+a,h+f,m+_,y+x).normalize();else if(e===js)n[5].setComponents(a,f,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ei.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ei.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ei)}intersectsSprite(t){return ei.center.set(0,0,0),ei.radius=.7071067811865476,ei.applyMatrix4(t.matrixWorld),this.intersectsSphere(ei)}intersectsSphere(t){const e=this.planes,n=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const r=e[n];if(ls.x=r.normal.x>0?t.max.x:t.min.x,ls.y=r.normal.y>0?t.max.y:t.min.y,ls.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(ls)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Au(){let i=null,t=!1,e=null,n=null;function r(s,o){e(s,o),n=i.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(r),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){i=s}}}function Cf(i){const t=new WeakMap;function e(a,l){const c=a.array,u=a.usage,f=c.byteLength,h=i.createBuffer();i.bindBuffer(l,h),i.bufferData(l,c,u),a.onUploadCallback();let d;if(c instanceof Float32Array)d=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=i.SHORT;else if(c instanceof Uint32Array)d=i.UNSIGNED_INT;else if(c instanceof Int32Array)d=i.INT;else if(c instanceof Int8Array)d=i.BYTE;else if(c instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:f}}function n(a,l,c){const u=l.array,f=l._updateRange,h=l.updateRanges;if(i.bindBuffer(c,a),f.count===-1&&h.length===0&&i.bufferSubData(c,0,u),h.length!==0){for(let d=0,g=h.length;d<g;d++){const _=h[d];i.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}f.count!==-1&&(i.bufferSubData(c,f.offset*u.BYTES_PER_ELEMENT,u,f.offset,f.count),f.count=-1),l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isGLBufferAttribute){const u=t.get(a);(!u||u.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}class pr extends Ie{constructor(t=1,e=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:r};const s=t/2,o=e/2,a=Math.floor(n),l=Math.floor(r),c=a+1,u=l+1,f=t/a,h=e/l,d=[],g=[],_=[],m=[];for(let p=0;p<u;p++){const v=p*h-o;for(let x=0;x<c;x++){const y=x*f-s;g.push(y,-v,0),_.push(0,0,1),m.push(x/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let v=0;v<a;v++){const x=v+c*p,y=v+c*(p+1),T=v+1+c*(p+1),w=v+1+c*p;d.push(x,y,w),d.push(y,T,w)}this.setIndex(d),this.setAttribute("position",new me(g,3)),this.setAttribute("normal",new me(_,3)),this.setAttribute("uv",new me(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new pr(t.width,t.height,t.widthSegments,t.heightSegments)}}var Pf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Rf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Lf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,If=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Df=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Uf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Nf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Of=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Bf=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Ff=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,kf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,zf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Hf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Gf=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Vf=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Wf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Xf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,qf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,jf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Yf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,$f=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Kf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Zf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( batchId );
	vColor.xyz *= batchingColor.xyz;
#endif`,Jf=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Qf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,td=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,ed=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,nd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,id=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,rd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,sd="gl_FragColor = linearToOutputTexel( gl_FragColor );",od=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,ad=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,ld=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,cd=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,ud=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,hd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,dd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,pd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,md=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gd=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,_d=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,xd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,vd=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,yd=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,bd=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Md=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Sd=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,wd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ed=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Td=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Ad=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Cd=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Pd=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Rd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ld=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Id=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Dd=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ud=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Nd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Od=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Bd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Fd=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,kd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,zd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Hd=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Gd=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Vd=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Wd=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Xd=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,qd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,jd=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Yd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,$d=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Kd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Zd=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Jd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Qd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,tp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ep=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,np=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ip=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,rp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,sp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,op=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ap=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,lp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,cp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,up=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return shadow;
	}
#endif`,hp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,fp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,dp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,pp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,mp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,gp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,_p=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,xp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,vp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,yp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,bp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Mp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Sp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,wp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Ep=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Tp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Ap=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Cp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Pp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Rp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Lp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ip=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Dp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Up=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Np=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,Op=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Bp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Fp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,kp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Hp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Gp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Vp=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Xp=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qp=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,jp=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Yp=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,$p=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Kp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Zp=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jp=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Qp=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,em=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,nm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,im=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,rm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sm=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,om=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,am=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,At={alphahash_fragment:Pf,alphahash_pars_fragment:Rf,alphamap_fragment:Lf,alphamap_pars_fragment:If,alphatest_fragment:Df,alphatest_pars_fragment:Uf,aomap_fragment:Nf,aomap_pars_fragment:Of,batching_pars_vertex:Bf,batching_vertex:Ff,begin_vertex:kf,beginnormal_vertex:zf,bsdfs:Hf,iridescence_fragment:Gf,bumpmap_pars_fragment:Vf,clipping_planes_fragment:Wf,clipping_planes_pars_fragment:Xf,clipping_planes_pars_vertex:qf,clipping_planes_vertex:jf,color_fragment:Yf,color_pars_fragment:$f,color_pars_vertex:Kf,color_vertex:Zf,common:Jf,cube_uv_reflection_fragment:Qf,defaultnormal_vertex:td,displacementmap_pars_vertex:ed,displacementmap_vertex:nd,emissivemap_fragment:id,emissivemap_pars_fragment:rd,colorspace_fragment:sd,colorspace_pars_fragment:od,envmap_fragment:ad,envmap_common_pars_fragment:ld,envmap_pars_fragment:cd,envmap_pars_vertex:ud,envmap_physical_pars_fragment:bd,envmap_vertex:hd,fog_vertex:fd,fog_pars_vertex:dd,fog_fragment:pd,fog_pars_fragment:md,gradientmap_pars_fragment:gd,lightmap_pars_fragment:_d,lights_lambert_fragment:xd,lights_lambert_pars_fragment:vd,lights_pars_begin:yd,lights_toon_fragment:Md,lights_toon_pars_fragment:Sd,lights_phong_fragment:wd,lights_phong_pars_fragment:Ed,lights_physical_fragment:Td,lights_physical_pars_fragment:Ad,lights_fragment_begin:Cd,lights_fragment_maps:Pd,lights_fragment_end:Rd,logdepthbuf_fragment:Ld,logdepthbuf_pars_fragment:Id,logdepthbuf_pars_vertex:Dd,logdepthbuf_vertex:Ud,map_fragment:Nd,map_pars_fragment:Od,map_particle_fragment:Bd,map_particle_pars_fragment:Fd,metalnessmap_fragment:kd,metalnessmap_pars_fragment:zd,morphinstance_vertex:Hd,morphcolor_vertex:Gd,morphnormal_vertex:Vd,morphtarget_pars_vertex:Wd,morphtarget_vertex:Xd,normal_fragment_begin:qd,normal_fragment_maps:jd,normal_pars_fragment:Yd,normal_pars_vertex:$d,normal_vertex:Kd,normalmap_pars_fragment:Zd,clearcoat_normal_fragment_begin:Jd,clearcoat_normal_fragment_maps:Qd,clearcoat_pars_fragment:tp,iridescence_pars_fragment:ep,opaque_fragment:np,packing:ip,premultiplied_alpha_fragment:rp,project_vertex:sp,dithering_fragment:op,dithering_pars_fragment:ap,roughnessmap_fragment:lp,roughnessmap_pars_fragment:cp,shadowmap_pars_fragment:up,shadowmap_pars_vertex:hp,shadowmap_vertex:fp,shadowmask_pars_fragment:dp,skinbase_vertex:pp,skinning_pars_vertex:mp,skinning_vertex:gp,skinnormal_vertex:_p,specularmap_fragment:xp,specularmap_pars_fragment:vp,tonemapping_fragment:yp,tonemapping_pars_fragment:bp,transmission_fragment:Mp,transmission_pars_fragment:Sp,uv_pars_fragment:wp,uv_pars_vertex:Ep,uv_vertex:Tp,worldpos_vertex:Ap,background_vert:Cp,background_frag:Pp,backgroundCube_vert:Rp,backgroundCube_frag:Lp,cube_vert:Ip,cube_frag:Dp,depth_vert:Up,depth_frag:Np,distanceRGBA_vert:Op,distanceRGBA_frag:Bp,equirect_vert:Fp,equirect_frag:kp,linedashed_vert:zp,linedashed_frag:Hp,meshbasic_vert:Gp,meshbasic_frag:Vp,meshlambert_vert:Wp,meshlambert_frag:Xp,meshmatcap_vert:qp,meshmatcap_frag:jp,meshnormal_vert:Yp,meshnormal_frag:$p,meshphong_vert:Kp,meshphong_frag:Zp,meshphysical_vert:Jp,meshphysical_frag:Qp,meshtoon_vert:tm,meshtoon_frag:em,points_vert:nm,points_frag:im,shadow_vert:rm,shadow_frag:sm,sprite_vert:om,sprite_frag:am},it={common:{diffuse:{value:new kt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ct},alphaMap:{value:null},alphaMapTransform:{value:new Ct},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ct}},envmap:{envMap:{value:null},envMapRotation:{value:new Ct},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ct}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ct}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ct},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ct},normalScale:{value:new wt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ct},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ct}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ct}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ct}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new kt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new kt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ct},alphaTest:{value:0},uvTransform:{value:new Ct}},sprite:{diffuse:{value:new kt(16777215)},opacity:{value:1},center:{value:new wt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ct},alphaMap:{value:null},alphaMapTransform:{value:new Ct},alphaTest:{value:0}}},hn={basic:{uniforms:Ue([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.fog]),vertexShader:At.meshbasic_vert,fragmentShader:At.meshbasic_frag},lambert:{uniforms:Ue([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.fog,it.lights,{emissive:{value:new kt(0)}}]),vertexShader:At.meshlambert_vert,fragmentShader:At.meshlambert_frag},phong:{uniforms:Ue([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.fog,it.lights,{emissive:{value:new kt(0)},specular:{value:new kt(1118481)},shininess:{value:30}}]),vertexShader:At.meshphong_vert,fragmentShader:At.meshphong_frag},standard:{uniforms:Ue([it.common,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.roughnessmap,it.metalnessmap,it.fog,it.lights,{emissive:{value:new kt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:At.meshphysical_vert,fragmentShader:At.meshphysical_frag},toon:{uniforms:Ue([it.common,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.gradientmap,it.fog,it.lights,{emissive:{value:new kt(0)}}]),vertexShader:At.meshtoon_vert,fragmentShader:At.meshtoon_frag},matcap:{uniforms:Ue([it.common,it.bumpmap,it.normalmap,it.displacementmap,it.fog,{matcap:{value:null}}]),vertexShader:At.meshmatcap_vert,fragmentShader:At.meshmatcap_frag},points:{uniforms:Ue([it.points,it.fog]),vertexShader:At.points_vert,fragmentShader:At.points_frag},dashed:{uniforms:Ue([it.common,it.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:At.linedashed_vert,fragmentShader:At.linedashed_frag},depth:{uniforms:Ue([it.common,it.displacementmap]),vertexShader:At.depth_vert,fragmentShader:At.depth_frag},normal:{uniforms:Ue([it.common,it.bumpmap,it.normalmap,it.displacementmap,{opacity:{value:1}}]),vertexShader:At.meshnormal_vert,fragmentShader:At.meshnormal_frag},sprite:{uniforms:Ue([it.sprite,it.fog]),vertexShader:At.sprite_vert,fragmentShader:At.sprite_frag},background:{uniforms:{uvTransform:{value:new Ct},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:At.background_vert,fragmentShader:At.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ct}},vertexShader:At.backgroundCube_vert,fragmentShader:At.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:At.cube_vert,fragmentShader:At.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:At.equirect_vert,fragmentShader:At.equirect_frag},distanceRGBA:{uniforms:Ue([it.common,it.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:At.distanceRGBA_vert,fragmentShader:At.distanceRGBA_frag},shadow:{uniforms:Ue([it.lights,it.fog,{color:{value:new kt(0)},opacity:{value:1}}]),vertexShader:At.shadow_vert,fragmentShader:At.shadow_frag}};hn.physical={uniforms:Ue([hn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ct},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ct},clearcoatNormalScale:{value:new wt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ct},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ct},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ct},sheen:{value:0},sheenColor:{value:new kt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ct},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ct},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ct},transmissionSamplerSize:{value:new wt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ct},attenuationDistance:{value:0},attenuationColor:{value:new kt(0)},specularColor:{value:new kt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ct},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ct},anisotropyVector:{value:new wt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ct}}]),vertexShader:At.meshphysical_vert,fragmentShader:At.meshphysical_frag};const cs={r:0,b:0,g:0},ni=new je,lm=new Bt;function cm(i,t,e,n,r,s,o){const a=new kt(0);let l=s===!0?0:1,c,u,f=null,h=0,d=null;function g(v){let x=v.isScene===!0?v.background:null;return x&&x.isTexture&&(x=(v.backgroundBlurriness>0?e:t).get(x)),x}function _(v){let x=!1;const y=g(v);y===null?p(a,l):y&&y.isColor&&(p(y,1),x=!0);const T=i.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,o):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(v,x){const y=g(x);y&&(y.isCubeTexture||y.mapping===to)?(u===void 0&&(u=new It(new ne(1,1,1),new jn({name:"BackgroundCubeMaterial",uniforms:dr(hn.backgroundCube.uniforms),vertexShader:hn.backgroundCube.vertexShader,fragmentShader:hn.backgroundCube.fragmentShader,side:Be,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(T,w,S){this.matrixWorld.copyPosition(S.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),ni.copy(x.backgroundRotation),ni.x*=-1,ni.y*=-1,ni.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(ni.y*=-1,ni.z*=-1),u.material.uniforms.envMap.value=y,u.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(lm.makeRotationFromEuler(ni)),u.material.toneMapped=Yt.getTransfer(y.colorSpace)!==Jt,(f!==y||h!==y.version||d!==i.toneMapping)&&(u.material.needsUpdate=!0,f=y,h=y.version,d=i.toneMapping),u.layers.enableAll(),v.unshift(u,u.geometry,u.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new It(new pr(2,2),new jn({name:"BackgroundMaterial",uniforms:dr(hn.background.uniforms),vertexShader:hn.background.vertexShader,fragmentShader:hn.background.fragmentShader,side:on,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=Yt.getTransfer(y.colorSpace)!==Jt,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(f!==y||h!==y.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,f=y,h=y.version,d=i.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function p(v,x){v.getRGB(cs,wu(i)),n.buffers.color.setClear(cs.r,cs.g,cs.b,x,o)}return{getClearColor:function(){return a},setClearColor:function(v,x=1){a.set(v),l=x,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,p(a,l)},render:_,addToRenderList:m}}function um(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=h(null);let s=r,o=!1;function a(b,C,R,I,O){let k=!1;const z=f(I,R,C);s!==z&&(s=z,c(s.object)),k=d(b,I,R,O),k&&g(b,I,R,O),O!==null&&t.update(O,i.ELEMENT_ARRAY_BUFFER),(k||o)&&(o=!1,y(b,C,R,I),O!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(O).buffer))}function l(){return i.createVertexArray()}function c(b){return i.bindVertexArray(b)}function u(b){return i.deleteVertexArray(b)}function f(b,C,R){const I=R.wireframe===!0;let O=n[b.id];O===void 0&&(O={},n[b.id]=O);let k=O[C.id];k===void 0&&(k={},O[C.id]=k);let z=k[I];return z===void 0&&(z=h(l()),k[I]=z),z}function h(b){const C=[],R=[],I=[];for(let O=0;O<e;O++)C[O]=0,R[O]=0,I[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:R,attributeDivisors:I,object:b,attributes:{},index:null}}function d(b,C,R,I){const O=s.attributes,k=C.attributes;let z=0;const j=R.getAttributes();for(const W in j)if(j[W].location>=0){const ht=O[W];let nt=k[W];if(nt===void 0&&(W==="instanceMatrix"&&b.instanceMatrix&&(nt=b.instanceMatrix),W==="instanceColor"&&b.instanceColor&&(nt=b.instanceColor)),ht===void 0||ht.attribute!==nt||nt&&ht.data!==nt.data)return!0;z++}return s.attributesNum!==z||s.index!==I}function g(b,C,R,I){const O={},k=C.attributes;let z=0;const j=R.getAttributes();for(const W in j)if(j[W].location>=0){let ht=k[W];ht===void 0&&(W==="instanceMatrix"&&b.instanceMatrix&&(ht=b.instanceMatrix),W==="instanceColor"&&b.instanceColor&&(ht=b.instanceColor));const nt={};nt.attribute=ht,ht&&ht.data&&(nt.data=ht.data),O[W]=nt,z++}s.attributes=O,s.attributesNum=z,s.index=I}function _(){const b=s.newAttributes;for(let C=0,R=b.length;C<R;C++)b[C]=0}function m(b){p(b,0)}function p(b,C){const R=s.newAttributes,I=s.enabledAttributes,O=s.attributeDivisors;R[b]=1,I[b]===0&&(i.enableVertexAttribArray(b),I[b]=1),O[b]!==C&&(i.vertexAttribDivisor(b,C),O[b]=C)}function v(){const b=s.newAttributes,C=s.enabledAttributes;for(let R=0,I=C.length;R<I;R++)C[R]!==b[R]&&(i.disableVertexAttribArray(R),C[R]=0)}function x(b,C,R,I,O,k,z){z===!0?i.vertexAttribIPointer(b,C,R,O,k):i.vertexAttribPointer(b,C,R,I,O,k)}function y(b,C,R,I){_();const O=I.attributes,k=R.getAttributes(),z=C.defaultAttributeValues;for(const j in k){const W=k[j];if(W.location>=0){let lt=O[j];if(lt===void 0&&(j==="instanceMatrix"&&b.instanceMatrix&&(lt=b.instanceMatrix),j==="instanceColor"&&b.instanceColor&&(lt=b.instanceColor)),lt!==void 0){const ht=lt.normalized,nt=lt.itemSize,Dt=t.get(lt);if(Dt===void 0)continue;const Wt=Dt.buffer,q=Dt.type,J=Dt.bytesPerElement,ft=q===i.INT||q===i.UNSIGNED_INT||lt.gpuType===cu;if(lt.isInterleavedBufferAttribute){const rt=lt.data,Pt=rt.stride,Et=lt.offset;if(rt.isInstancedInterleavedBuffer){for(let zt=0;zt<W.locationSize;zt++)p(W.location+zt,rt.meshPerAttribute);b.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let zt=0;zt<W.locationSize;zt++)m(W.location+zt);i.bindBuffer(i.ARRAY_BUFFER,Wt);for(let zt=0;zt<W.locationSize;zt++)x(W.location+zt,nt/W.locationSize,q,ht,Pt*J,(Et+nt/W.locationSize*zt)*J,ft)}else{if(lt.isInstancedBufferAttribute){for(let rt=0;rt<W.locationSize;rt++)p(W.location+rt,lt.meshPerAttribute);b.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=lt.meshPerAttribute*lt.count)}else for(let rt=0;rt<W.locationSize;rt++)m(W.location+rt);i.bindBuffer(i.ARRAY_BUFFER,Wt);for(let rt=0;rt<W.locationSize;rt++)x(W.location+rt,nt/W.locationSize,q,ht,nt*J,nt/W.locationSize*rt*J,ft)}}else if(z!==void 0){const ht=z[j];if(ht!==void 0)switch(ht.length){case 2:i.vertexAttrib2fv(W.location,ht);break;case 3:i.vertexAttrib3fv(W.location,ht);break;case 4:i.vertexAttrib4fv(W.location,ht);break;default:i.vertexAttrib1fv(W.location,ht)}}}}v()}function T(){P();for(const b in n){const C=n[b];for(const R in C){const I=C[R];for(const O in I)u(I[O].object),delete I[O];delete C[R]}delete n[b]}}function w(b){if(n[b.id]===void 0)return;const C=n[b.id];for(const R in C){const I=C[R];for(const O in I)u(I[O].object),delete I[O];delete C[R]}delete n[b.id]}function S(b){for(const C in n){const R=n[C];if(R[b.id]===void 0)continue;const I=R[b.id];for(const O in I)u(I[O].object),delete I[O];delete R[b.id]}}function P(){M(),o=!0,s!==r&&(s=r,c(s.object))}function M(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:P,resetDefaultState:M,dispose:T,releaseStatesOfGeometry:w,releaseStatesOfProgram:S,initAttributes:_,enableAttribute:m,disableUnusedAttributes:v}}function hm(i,t,e){let n;function r(c){n=c}function s(c,u){i.drawArrays(n,c,u),e.update(u,n,1)}function o(c,u,f){f!==0&&(i.drawArraysInstanced(n,c,u,f),e.update(u,n,f))}function a(c,u,f){if(f===0)return;const h=t.get("WEBGL_multi_draw");if(h===null)for(let d=0;d<f;d++)this.render(c[d],u[d]);else{h.multiDrawArraysWEBGL(n,c,0,u,0,f);let d=0;for(let g=0;g<f;g++)d+=u[g];e.update(d,n,1)}}function l(c,u,f,h){if(f===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<c.length;g++)o(c[g],u[g],h[g]);else{d.multiDrawArraysInstancedWEBGL(n,c,0,u,0,h,0,f);let g=0;for(let _=0;_<f;_++)g+=u[_];for(let _=0;_<h.length;_++)e.update(g,n,h[_])}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function fm(i,t,e,n){let r;function s(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){const w=t.get("EXT_texture_filter_anisotropic");r=i.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(w){return!(w!==Je&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(w){const S=w===eo&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(w!==qn&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==fn&&!S)}function l(w){if(w==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const f=e.logarithmicDepthBuffer===!0,h=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_TEXTURE_SIZE),_=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),v=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),y=d>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:f,maxTextures:h,maxVertexTextures:d,maxTextureSize:g,maxCubemapSize:_,maxAttributes:m,maxVertexUniforms:p,maxVaryings:v,maxFragmentUniforms:x,vertexTextures:y,maxSamples:T}}function dm(i){const t=this;let e=null,n=0,r=!1,s=!1;const o=new wn,a=new Ct,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){const d=f.length!==0||h||n!==0||r;return r=h,n=f.length,d},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,h){e=u(f,h,0)},this.setState=function(f,h,d){const g=f.clippingPlanes,_=f.clipIntersection,m=f.clipShadows,p=i.get(f);if(!r||g===null||g.length===0||s&&!m)s?u(null):c();else{const v=s?0:n,x=v*4;let y=p.clippingState||null;l.value=y,y=u(g,h,x,d);for(let T=0;T!==x;++T)y[T]=e[T];p.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(f,h,d,g){const _=f!==null?f.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const p=d+_*4,v=h.matrixWorldInverse;a.getNormalMatrix(v),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,y=d;x!==_;++x,y+=4)o.copy(f[x]).applyMatrix4(v,a),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function pm(i){let t=new WeakMap;function e(o,a){return a===da?o.mapping=lr:a===pa&&(o.mapping=cr),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===da||a===pa)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Ef(l.height);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",r),e(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}class Cu extends Eu{constructor(t=-1,e=1,n=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-t,o=n+t,a=r+e,l=r-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const nr=4,$l=[.125,.215,.35,.446,.526,.582],ui=20,ko=new Cu,Kl=new kt;let zo=null,Ho=0,Go=0,Vo=!1;const li=(1+Math.sqrt(5))/2,Fi=1/li,Zl=[new L(-li,Fi,0),new L(li,Fi,0),new L(-Fi,0,li),new L(Fi,0,li),new L(0,li,-Fi),new L(0,li,Fi),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)];class Jl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,r=100){zo=this._renderer.getRenderTarget(),Ho=this._renderer.getActiveCubeFace(),Go=this._renderer.getActiveMipmapLevel(),Vo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,n,r,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ec(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=tc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(zo,Ho,Go),this._renderer.xr.enabled=Vo,t.scissorTest=!1,us(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===lr||t.mapping===cr?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),zo=this._renderer.getRenderTarget(),Ho=this._renderer.getActiveCubeFace(),Go=this._renderer.getActiveMipmapLevel(),Vo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:sn,minFilter:sn,generateMipmaps:!1,type:eo,format:Je,colorSpace:$n,depthBuffer:!1},r=Ql(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ql(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=mm(s)),this._blurMaterial=gm(s,t,e)}return r}_compileMaterial(t){const e=new It(this._lodPlanes[0],t);this._renderer.compile(e,ko)}_sceneToCubeUV(t,e,n,r){const a=new qe(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,h=u.toneMapping;u.getClearColor(Kl),u.toneMapping=Wn,u.autoClear=!1;const d=new mi({name:"PMREM.Background",side:Be,depthWrite:!1,depthTest:!1}),g=new It(new ne,d);let _=!1;const m=t.background;m?m.isColor&&(d.color.copy(m),t.background=null,_=!0):(d.color.copy(Kl),_=!0);for(let p=0;p<6;p++){const v=p%3;v===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):v===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));const x=this._cubeSize;us(r,v*x,p>2?x:0,x,x),u.setRenderTarget(r),_&&u.render(g,a),u.render(t,a)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=h,u.autoClear=f,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,r=t.mapping===lr||t.mapping===cr;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=ec()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=tc());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new It(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=t;const l=this._cubeSize;us(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,ko)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Zl[(r-s-1)%Zl.length];this._blur(t,s-1,s,o,a)}e.autoClear=n}_blur(t,e,n,r,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,r,"latitudinal",s),this._halfBlur(o,t,n,n,r,"longitudinal",s)}_halfBlur(t,e,n,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,f=new It(this._lodPlanes[r],c),h=c.uniforms,d=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*d):2*Math.PI/(2*ui-1),_=s/g,m=isFinite(s)?1+Math.floor(u*_):ui;m>ui&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ui}`);const p=[];let v=0;for(let S=0;S<ui;++S){const P=S/_,M=Math.exp(-P*P/2);p.push(M),S===0?v+=M:S<m&&(v+=2*M)}for(let S=0;S<p.length;S++)p[S]=p[S]/v;h.envMap.value=t.texture,h.samples.value=m,h.weights.value=p,h.latitudinal.value=o==="latitudinal",a&&(h.poleAxis.value=a);const{_lodMax:x}=this;h.dTheta.value=g,h.mipInt.value=x-n;const y=this._sizeLods[r],T=3*y*(r>x-nr?r-x+nr:0),w=4*(this._cubeSize-y);us(e,T,w,3*y,2*y),l.setRenderTarget(e),l.render(f,ko)}}function mm(i){const t=[],e=[],n=[];let r=i;const s=i-nr+1+$l.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);e.push(a);let l=1/a;o>i-nr?l=$l[o-i+nr-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),u=-c,f=1+c,h=[u,u,f,u,f,f,u,u,f,f,u,f],d=6,g=6,_=3,m=2,p=1,v=new Float32Array(_*g*d),x=new Float32Array(m*g*d),y=new Float32Array(p*g*d);for(let w=0;w<d;w++){const S=w%3*2/3-1,P=w>2?0:-1,M=[S,P,0,S+2/3,P,0,S+2/3,P+1,0,S,P,0,S+2/3,P+1,0,S,P+1,0];v.set(M,_*g*w),x.set(h,m*g*w);const b=[w,w,w,w,w,w];y.set(b,p*g*w)}const T=new Ie;T.setAttribute("position",new ke(v,_)),T.setAttribute("uv",new ke(x,m)),T.setAttribute("faceIndex",new ke(y,p)),t.push(T),r>nr&&r--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Ql(i,t,e){const n=new di(i,t,e);return n.texture.mapping=to,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function us(i,t,e,n,r){i.viewport.set(t,e,n,r),i.scissor.set(t,e,n,r)}function gm(i,t,e){const n=new Float32Array(ui),r=new L(0,1,0);return new jn({name:"SphericalGaussianBlur",defines:{n:ui,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Oa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function tc(){return new jn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Oa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function ec(){return new jn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Oa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Vn,depthTest:!1,depthWrite:!1})}function Oa(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function _m(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===da||l===pa,u=l===lr||l===cr;if(c||u){let f=t.get(a);const h=f!==void 0?f.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==h)return e===null&&(e=new Jl(i)),f=c?e.fromEquirectangular(a,f):e.fromCubemap(a,f),f.texture.pmremVersion=a.pmremVersion,t.set(a,f),f.texture;if(f!==void 0)return f.texture;{const d=a.image;return c&&d&&d.height>0||u&&d&&r(d)?(e===null&&(e=new Jl(i)),f=c?e.fromEquirectangular(a):e.fromCubemap(a),f.texture.pmremVersion=a.pmremVersion,t.set(a,f),a.addEventListener("dispose",s),f.texture):null}}}return a}function r(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function xm(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return t[n]=r,r}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const r=e(n);return r===null&&xu("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function vm(i,t,e,n){const r={},s=new WeakMap;function o(f){const h=f.target;h.index!==null&&t.remove(h.index);for(const g in h.attributes)t.remove(h.attributes[g]);for(const g in h.morphAttributes){const _=h.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)t.remove(_[m])}h.removeEventListener("dispose",o),delete r[h.id];const d=s.get(h);d&&(t.remove(d),s.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function a(f,h){return r[h.id]===!0||(h.addEventListener("dispose",o),r[h.id]=!0,e.memory.geometries++),h}function l(f){const h=f.attributes;for(const g in h)t.update(h[g],i.ARRAY_BUFFER);const d=f.morphAttributes;for(const g in d){const _=d[g];for(let m=0,p=_.length;m<p;m++)t.update(_[m],i.ARRAY_BUFFER)}}function c(f){const h=[],d=f.index,g=f.attributes.position;let _=0;if(d!==null){const v=d.array;_=d.version;for(let x=0,y=v.length;x<y;x+=3){const T=v[x+0],w=v[x+1],S=v[x+2];h.push(T,w,w,S,S,T)}}else if(g!==void 0){const v=g.array;_=g.version;for(let x=0,y=v.length/3-1;x<y;x+=3){const T=x+0,w=x+1,S=x+2;h.push(T,w,w,S,S,T)}}else return;const m=new(_u(h)?Su:Mu)(h,1);m.version=_;const p=s.get(f);p&&t.remove(p),s.set(f,m)}function u(f){const h=s.get(f);if(h){const d=f.index;d!==null&&h.version<d.version&&c(f)}else c(f);return s.get(f)}return{get:a,update:l,getWireframeAttribute:u}}function ym(i,t,e){let n;function r(h){n=h}let s,o;function a(h){s=h.type,o=h.bytesPerElement}function l(h,d){i.drawElements(n,d,s,h*o),e.update(d,n,1)}function c(h,d,g){g!==0&&(i.drawElementsInstanced(n,d,s,h*o,g),e.update(d,n,g))}function u(h,d,g){if(g===0)return;const _=t.get("WEBGL_multi_draw");if(_===null)for(let m=0;m<g;m++)this.render(h[m]/o,d[m]);else{_.multiDrawElementsWEBGL(n,d,0,s,h,0,g);let m=0;for(let p=0;p<g;p++)m+=d[p];e.update(m,n,1)}}function f(h,d,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<h.length;p++)c(h[p]/o,d[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,d,0,s,h,0,_,0,g);let p=0;for(let v=0;v<g;v++)p+=d[v];for(let v=0;v<_.length;v++)e.update(p,n,_[v])}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=f}function bm(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(s/3);break;case i.LINES:e.lines+=a*(s/2);break;case i.LINE_STRIP:e.lines+=a*(s-1);break;case i.LINE_LOOP:e.lines+=a*s;break;case i.POINTS:e.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:n}}function Mm(i,t,e){const n=new WeakMap,r=new te;function s(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=u!==void 0?u.length:0;let h=n.get(a);if(h===void 0||h.count!==f){let b=function(){P.dispose(),n.delete(a),a.removeEventListener("dispose",b)};var d=b;h!==void 0&&h.texture.dispose();const g=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],v=a.morphAttributes.normal||[],x=a.morphAttributes.color||[];let y=0;g===!0&&(y=1),_===!0&&(y=2),m===!0&&(y=3);let T=a.attributes.position.count*y,w=1;T>t.maxTextureSize&&(w=Math.ceil(T/t.maxTextureSize),T=t.maxTextureSize);const S=new Float32Array(T*w*4*f),P=new yu(S,T,w,f);P.type=fn,P.needsUpdate=!0;const M=y*4;for(let C=0;C<f;C++){const R=p[C],I=v[C],O=x[C],k=T*w*4*C;for(let z=0;z<R.count;z++){const j=z*M;g===!0&&(r.fromBufferAttribute(R,z),S[k+j+0]=r.x,S[k+j+1]=r.y,S[k+j+2]=r.z,S[k+j+3]=0),_===!0&&(r.fromBufferAttribute(I,z),S[k+j+4]=r.x,S[k+j+5]=r.y,S[k+j+6]=r.z,S[k+j+7]=0),m===!0&&(r.fromBufferAttribute(O,z),S[k+j+8]=r.x,S[k+j+9]=r.y,S[k+j+10]=r.z,S[k+j+11]=O.itemSize===4?r.w:1)}}h={count:f,texture:P,size:new wt(T,w)},n.set(a,h),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const _=a.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",h.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:s}}function Sm(i,t,e,n){let r=new WeakMap;function s(l){const c=n.render.frame,u=l.geometry,f=t.get(l,u);if(r.get(f)!==c&&(t.update(f),r.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;r.get(h)!==c&&(h.update(),r.set(h,c))}return f}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:o}}class Pu extends Fe{constructor(t,e,n,r,s,o,a,l,c,u=sr){if(u!==sr&&u!==fr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===sr&&(n=ur),n===void 0&&u===fr&&(n=hr),super(null,r,s,o,a,l,u,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Ge,this.minFilter=l!==void 0?l:Ge,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Ru=new Fe,Lu=new Pu(1,1);Lu.compareFunction=gu;const Iu=new yu,Du=new cf,Uu=new Tu,nc=[],ic=[],rc=new Float32Array(16),sc=new Float32Array(9),oc=new Float32Array(4);function mr(i,t,e){const n=i[0];if(n<=0||n>0)return i;const r=t*e;let s=nc[r];if(s===void 0&&(s=new Float32Array(r),nc[r]=s),t!==0){n.toArray(s,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(s,a)}return s}function ge(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function _e(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function ro(i,t){let e=ic[t];e===void 0&&(e=new Int32Array(t),ic[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function wm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Em(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ge(e,t))return;i.uniform2fv(this.addr,t),_e(e,t)}}function Tm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ge(e,t))return;i.uniform3fv(this.addr,t),_e(e,t)}}function Am(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ge(e,t))return;i.uniform4fv(this.addr,t),_e(e,t)}}function Cm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ge(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),_e(e,t)}else{if(ge(e,n))return;oc.set(n),i.uniformMatrix2fv(this.addr,!1,oc),_e(e,n)}}function Pm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ge(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),_e(e,t)}else{if(ge(e,n))return;sc.set(n),i.uniformMatrix3fv(this.addr,!1,sc),_e(e,n)}}function Rm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ge(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),_e(e,t)}else{if(ge(e,n))return;rc.set(n),i.uniformMatrix4fv(this.addr,!1,rc),_e(e,n)}}function Lm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Im(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ge(e,t))return;i.uniform2iv(this.addr,t),_e(e,t)}}function Dm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ge(e,t))return;i.uniform3iv(this.addr,t),_e(e,t)}}function Um(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ge(e,t))return;i.uniform4iv(this.addr,t),_e(e,t)}}function Nm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Om(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ge(e,t))return;i.uniform2uiv(this.addr,t),_e(e,t)}}function Bm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ge(e,t))return;i.uniform3uiv(this.addr,t),_e(e,t)}}function Fm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ge(e,t))return;i.uniform4uiv(this.addr,t),_e(e,t)}}function km(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);const s=this.type===i.SAMPLER_2D_SHADOW?Lu:Ru;e.setTexture2D(t||s,r)}function zm(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture3D(t||Du,r)}function Hm(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTextureCube(t||Uu,r)}function Gm(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture2DArray(t||Iu,r)}function Vm(i){switch(i){case 5126:return wm;case 35664:return Em;case 35665:return Tm;case 35666:return Am;case 35674:return Cm;case 35675:return Pm;case 35676:return Rm;case 5124:case 35670:return Lm;case 35667:case 35671:return Im;case 35668:case 35672:return Dm;case 35669:case 35673:return Um;case 5125:return Nm;case 36294:return Om;case 36295:return Bm;case 36296:return Fm;case 35678:case 36198:case 36298:case 36306:case 35682:return km;case 35679:case 36299:case 36307:return zm;case 35680:case 36300:case 36308:case 36293:return Hm;case 36289:case 36303:case 36311:case 36292:return Gm}}function Wm(i,t){i.uniform1fv(this.addr,t)}function Xm(i,t){const e=mr(t,this.size,2);i.uniform2fv(this.addr,e)}function qm(i,t){const e=mr(t,this.size,3);i.uniform3fv(this.addr,e)}function jm(i,t){const e=mr(t,this.size,4);i.uniform4fv(this.addr,e)}function Ym(i,t){const e=mr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function $m(i,t){const e=mr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Km(i,t){const e=mr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Zm(i,t){i.uniform1iv(this.addr,t)}function Jm(i,t){i.uniform2iv(this.addr,t)}function Qm(i,t){i.uniform3iv(this.addr,t)}function tg(i,t){i.uniform4iv(this.addr,t)}function eg(i,t){i.uniform1uiv(this.addr,t)}function ng(i,t){i.uniform2uiv(this.addr,t)}function ig(i,t){i.uniform3uiv(this.addr,t)}function rg(i,t){i.uniform4uiv(this.addr,t)}function sg(i,t,e){const n=this.cache,r=t.length,s=ro(e,r);ge(n,s)||(i.uniform1iv(this.addr,s),_e(n,s));for(let o=0;o!==r;++o)e.setTexture2D(t[o]||Ru,s[o])}function og(i,t,e){const n=this.cache,r=t.length,s=ro(e,r);ge(n,s)||(i.uniform1iv(this.addr,s),_e(n,s));for(let o=0;o!==r;++o)e.setTexture3D(t[o]||Du,s[o])}function ag(i,t,e){const n=this.cache,r=t.length,s=ro(e,r);ge(n,s)||(i.uniform1iv(this.addr,s),_e(n,s));for(let o=0;o!==r;++o)e.setTextureCube(t[o]||Uu,s[o])}function lg(i,t,e){const n=this.cache,r=t.length,s=ro(e,r);ge(n,s)||(i.uniform1iv(this.addr,s),_e(n,s));for(let o=0;o!==r;++o)e.setTexture2DArray(t[o]||Iu,s[o])}function cg(i){switch(i){case 5126:return Wm;case 35664:return Xm;case 35665:return qm;case 35666:return jm;case 35674:return Ym;case 35675:return $m;case 35676:return Km;case 5124:case 35670:return Zm;case 35667:case 35671:return Jm;case 35668:case 35672:return Qm;case 35669:case 35673:return tg;case 5125:return eg;case 36294:return ng;case 36295:return ig;case 36296:return rg;case 35678:case 36198:case 36298:case 36306:case 35682:return sg;case 35679:case 36299:case 36307:return og;case 35680:case 36300:case 36308:case 36293:return ag;case 36289:case 36303:case 36311:case 36292:return lg}}class ug{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Vm(e.type)}}class hg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=cg(e.type)}}class fg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(t,e[a.id],n)}}}const Wo=/(\w+)(\])?(\[|\.)?/g;function ac(i,t){i.seq.push(t),i.map[t.id]=t}function dg(i,t,e){const n=i.name,r=n.length;for(Wo.lastIndex=0;;){const s=Wo.exec(n),o=Wo.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){ac(e,c===void 0?new ug(a,i,t):new hg(a,i,t));break}else{let f=e.map[a];f===void 0&&(f=new fg(a),ac(e,f)),e=f}}}class Fs{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=t.getActiveUniform(e,r),o=t.getUniformLocation(e,s.name);dg(s,o,this)}}setValue(t,e,n,r){const s=this.map[e];s!==void 0&&s.setValue(t,n,r)}setOptional(t,e,n){const r=e[n];r!==void 0&&this.setValue(t,n,r)}static upload(t,e,n,r){for(let s=0,o=e.length;s!==o;++s){const a=e[s],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,r)}}static seqWithValue(t,e){const n=[];for(let r=0,s=t.length;r!==s;++r){const o=t[r];o.id in e&&n.push(o)}return n}}function lc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const pg=37297;let mg=0;function gg(i,t){const e=i.split(`
`),n=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=r;o<s;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function _g(i){const t=Yt.getPrimaries(Yt.workingColorSpace),e=Yt.getPrimaries(i);let n;switch(t===e?n="":t===qs&&e===Xs?n="LinearDisplayP3ToLinearSRGB":t===Xs&&e===qs&&(n="LinearSRGBToLinearDisplayP3"),i){case $n:case no:return[n,"LinearTransferOETF"];case un:case Ua:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function cc(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=i.getShaderInfoLog(t).trim();if(n&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+r+`

`+gg(i.getShaderSource(t),o)}else return r}function xg(i,t){const e=_g(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function vg(i,t){let e;switch(t){case Ah:e="Linear";break;case Ch:e="Reinhard";break;case Ph:e="OptimizedCineon";break;case au:e="ACESFilmic";break;case Lh:e="AgX";break;case Ih:e="Neutral";break;case Rh:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function yg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ir).join(`
`)}function bg(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Mg(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(t,r),o=s.name;let a=1;s.type===i.FLOAT_MAT2&&(a=2),s.type===i.FLOAT_MAT3&&(a=3),s.type===i.FLOAT_MAT4&&(a=4),e[o]={type:s.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Ir(i){return i!==""}function uc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function hc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Sg=/^[ \t]*#include +<([\w\d./]+)>/gm;function xa(i){return i.replace(Sg,Eg)}const wg=new Map;function Eg(i,t){let e=At[t];if(e===void 0){const n=wg.get(t);if(n!==void 0)e=At[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return xa(e)}const Tg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function fc(i){return i.replace(Tg,Ag)}function Ag(i,t,e,n){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function dc(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Cg(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===su?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===ou?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Mn&&(t="SHADOWMAP_TYPE_VSM"),t}function Pg(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case lr:case cr:t="ENVMAP_TYPE_CUBE";break;case to:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Rg(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case cr:t="ENVMAP_MODE_REFRACTION";break}return t}function Lg(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Da:t="ENVMAP_BLENDING_MULTIPLY";break;case Eh:t="ENVMAP_BLENDING_MIX";break;case Th:t="ENVMAP_BLENDING_ADD";break}return t}function Ig(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function Dg(i,t,e,n){const r=i.getContext(),s=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=Cg(e),c=Pg(e),u=Rg(e),f=Lg(e),h=Ig(e),d=yg(e),g=bg(s),_=r.createProgram();let m,p,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ir).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ir).join(`
`),p.length>0&&(p+=`
`)):(m=[dc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ir).join(`
`),p=[dc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Wn?"#define TONE_MAPPING":"",e.toneMapping!==Wn?At.tonemapping_pars_fragment:"",e.toneMapping!==Wn?vg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",At.colorspace_pars_fragment,xg("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ir).join(`
`)),o=xa(o),o=uc(o,e),o=hc(o,e),a=xa(a),a=uc(a,e),a=hc(a,e),o=fc(o),a=fc(a),e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===Pl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Pl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=v+m+o,y=v+p+a,T=lc(r,r.VERTEX_SHADER,x),w=lc(r,r.FRAGMENT_SHADER,y);r.attachShader(_,T),r.attachShader(_,w),e.index0AttributeName!==void 0?r.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function S(C){if(i.debug.checkShaderErrors){const R=r.getProgramInfoLog(_).trim(),I=r.getShaderInfoLog(T).trim(),O=r.getShaderInfoLog(w).trim();let k=!0,z=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(k=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,_,T,w);else{const j=cc(r,T,"vertex"),W=cc(r,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+R+`
`+j+`
`+W)}else R!==""?console.warn("THREE.WebGLProgram: Program Info Log:",R):(I===""||O==="")&&(z=!1);z&&(C.diagnostics={runnable:k,programLog:R,vertexShader:{log:I,prefix:m},fragmentShader:{log:O,prefix:p}})}r.deleteShader(T),r.deleteShader(w),P=new Fs(r,_),M=Mg(r,_)}let P;this.getUniforms=function(){return P===void 0&&S(this),P};let M;this.getAttributes=function(){return M===void 0&&S(this),M};let b=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=r.getProgramParameter(_,pg)),b},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=mg++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=T,this.fragmentShader=w,this}let Ug=0;class Ng{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Og(t),e.set(t,n)),n}}class Og{constructor(t){this.id=Ug++,this.code=t,this.usedTimes=0}}function Bg(i,t,e,n,r,s,o){const a=new Na,l=new Ng,c=new Set,u=[],f=r.logarithmicDepthBuffer,h=r.vertexTextures;let d=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return c.add(M),M===0?"uv":`uv${M}`}function m(M,b,C,R,I){const O=R.fog,k=I.geometry,z=M.isMeshStandardMaterial?R.environment:null,j=(M.isMeshStandardMaterial?e:t).get(M.envMap||z),W=j&&j.mapping===to?j.image.height:null,lt=g[M.type];M.precision!==null&&(d=r.getMaxPrecision(M.precision),d!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",d,"instead."));const ht=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,nt=ht!==void 0?ht.length:0;let Dt=0;k.morphAttributes.position!==void 0&&(Dt=1),k.morphAttributes.normal!==void 0&&(Dt=2),k.morphAttributes.color!==void 0&&(Dt=3);let Wt,q,J,ft;if(lt){const Kt=hn[lt];Wt=Kt.vertexShader,q=Kt.fragmentShader}else Wt=M.vertexShader,q=M.fragmentShader,l.update(M),J=l.getVertexShaderID(M),ft=l.getFragmentShaderID(M);const rt=i.getRenderTarget(),Pt=I.isInstancedMesh===!0,Et=I.isBatchedMesh===!0,zt=!!M.map,N=!!M.matcap,Ut=!!j,Ht=!!M.aoMap,ee=!!M.lightMap,vt=!!M.bumpMap,Vt=!!M.normalMap,Ot=!!M.displacementMap,Tt=!!M.emissiveMap,le=!!M.metalnessMap,D=!!M.roughnessMap,E=M.anisotropy>0,V=M.clearcoat>0,$=M.dispersion>0,K=M.iridescence>0,Z=M.sheen>0,_t=M.transmission>0,st=E&&!!M.anisotropyMap,ot=V&&!!M.clearcoatMap,Rt=V&&!!M.clearcoatNormalMap,Q=V&&!!M.clearcoatRoughnessMap,mt=K&&!!M.iridescenceMap,Ft=K&&!!M.iridescenceThicknessMap,Mt=Z&&!!M.sheenColorMap,at=Z&&!!M.sheenRoughnessMap,Lt=!!M.specularMap,Gt=!!M.specularColorMap,oe=!!M.specularIntensityMap,U=_t&&!!M.transmissionMap,ct=_t&&!!M.thicknessMap,X=!!M.gradientMap,Y=!!M.alphaMap,et=M.alphaTest>0,St=!!M.alphaHash,Xt=!!M.extensions;let ae=Wn;M.toneMapped&&(rt===null||rt.isXRRenderTarget===!0)&&(ae=i.toneMapping);const xe={shaderID:lt,shaderType:M.type,shaderName:M.name,vertexShader:Wt,fragmentShader:q,defines:M.defines,customVertexShaderID:J,customFragmentShaderID:ft,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:d,batching:Et,batchingColor:Et&&I._colorsTexture!==null,instancing:Pt,instancingColor:Pt&&I.instanceColor!==null,instancingMorph:Pt&&I.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:rt===null?i.outputColorSpace:rt.isXRRenderTarget===!0?rt.texture.colorSpace:$n,alphaToCoverage:!!M.alphaToCoverage,map:zt,matcap:N,envMap:Ut,envMapMode:Ut&&j.mapping,envMapCubeUVHeight:W,aoMap:Ht,lightMap:ee,bumpMap:vt,normalMap:Vt,displacementMap:h&&Ot,emissiveMap:Tt,normalMapObjectSpace:Vt&&M.normalMapType===qh,normalMapTangentSpace:Vt&&M.normalMapType===mu,metalnessMap:le,roughnessMap:D,anisotropy:E,anisotropyMap:st,clearcoat:V,clearcoatMap:ot,clearcoatNormalMap:Rt,clearcoatRoughnessMap:Q,dispersion:$,iridescence:K,iridescenceMap:mt,iridescenceThicknessMap:Ft,sheen:Z,sheenColorMap:Mt,sheenRoughnessMap:at,specularMap:Lt,specularColorMap:Gt,specularIntensityMap:oe,transmission:_t,transmissionMap:U,thicknessMap:ct,gradientMap:X,opaque:M.transparent===!1&&M.blending===rr&&M.alphaToCoverage===!1,alphaMap:Y,alphaTest:et,alphaHash:St,combine:M.combine,mapUv:zt&&_(M.map.channel),aoMapUv:Ht&&_(M.aoMap.channel),lightMapUv:ee&&_(M.lightMap.channel),bumpMapUv:vt&&_(M.bumpMap.channel),normalMapUv:Vt&&_(M.normalMap.channel),displacementMapUv:Ot&&_(M.displacementMap.channel),emissiveMapUv:Tt&&_(M.emissiveMap.channel),metalnessMapUv:le&&_(M.metalnessMap.channel),roughnessMapUv:D&&_(M.roughnessMap.channel),anisotropyMapUv:st&&_(M.anisotropyMap.channel),clearcoatMapUv:ot&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:Rt&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Q&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:mt&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:Ft&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:Mt&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:at&&_(M.sheenRoughnessMap.channel),specularMapUv:Lt&&_(M.specularMap.channel),specularColorMapUv:Gt&&_(M.specularColorMap.channel),specularIntensityMapUv:oe&&_(M.specularIntensityMap.channel),transmissionMapUv:U&&_(M.transmissionMap.channel),thicknessMapUv:ct&&_(M.thicknessMap.channel),alphaMapUv:Y&&_(M.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(Vt||E),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!k.attributes.uv&&(zt||Y),fog:!!O,useFog:M.fog===!0,fogExp2:!!O&&O.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:f,skinning:I.isSkinnedMesh===!0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:nt,morphTextureStride:Dt,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:ae,decodeVideoTexture:zt&&M.map.isVideoTexture===!0&&Yt.getTransfer(M.map.colorSpace)===Jt,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Ze,flipSided:M.side===Be,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Xt&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:Xt&&M.extensions.multiDraw===!0&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return xe.vertexUv1s=c.has(1),xe.vertexUv2s=c.has(2),xe.vertexUv3s=c.has(3),c.clear(),xe}function p(M){const b=[];if(M.shaderID?b.push(M.shaderID):(b.push(M.customVertexShaderID),b.push(M.customFragmentShaderID)),M.defines!==void 0)for(const C in M.defines)b.push(C),b.push(M.defines[C]);return M.isRawShaderMaterial===!1&&(v(b,M),x(b,M),b.push(i.outputColorSpace)),b.push(M.customProgramCacheKey),b.join()}function v(M,b){M.push(b.precision),M.push(b.outputColorSpace),M.push(b.envMapMode),M.push(b.envMapCubeUVHeight),M.push(b.mapUv),M.push(b.alphaMapUv),M.push(b.lightMapUv),M.push(b.aoMapUv),M.push(b.bumpMapUv),M.push(b.normalMapUv),M.push(b.displacementMapUv),M.push(b.emissiveMapUv),M.push(b.metalnessMapUv),M.push(b.roughnessMapUv),M.push(b.anisotropyMapUv),M.push(b.clearcoatMapUv),M.push(b.clearcoatNormalMapUv),M.push(b.clearcoatRoughnessMapUv),M.push(b.iridescenceMapUv),M.push(b.iridescenceThicknessMapUv),M.push(b.sheenColorMapUv),M.push(b.sheenRoughnessMapUv),M.push(b.specularMapUv),M.push(b.specularColorMapUv),M.push(b.specularIntensityMapUv),M.push(b.transmissionMapUv),M.push(b.thicknessMapUv),M.push(b.combine),M.push(b.fogExp2),M.push(b.sizeAttenuation),M.push(b.morphTargetsCount),M.push(b.morphAttributeCount),M.push(b.numDirLights),M.push(b.numPointLights),M.push(b.numSpotLights),M.push(b.numSpotLightMaps),M.push(b.numHemiLights),M.push(b.numRectAreaLights),M.push(b.numDirLightShadows),M.push(b.numPointLightShadows),M.push(b.numSpotLightShadows),M.push(b.numSpotLightShadowsWithMaps),M.push(b.numLightProbes),M.push(b.shadowMapType),M.push(b.toneMapping),M.push(b.numClippingPlanes),M.push(b.numClipIntersection),M.push(b.depthPacking)}function x(M,b){a.disableAll(),b.supportsVertexTextures&&a.enable(0),b.instancing&&a.enable(1),b.instancingColor&&a.enable(2),b.instancingMorph&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),b.dispersion&&a.enable(20),b.batchingColor&&a.enable(21),M.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.skinning&&a.enable(4),b.morphTargets&&a.enable(5),b.morphNormals&&a.enable(6),b.morphColors&&a.enable(7),b.premultipliedAlpha&&a.enable(8),b.shadowMapEnabled&&a.enable(9),b.doubleSided&&a.enable(10),b.flipSided&&a.enable(11),b.useDepthPacking&&a.enable(12),b.dithering&&a.enable(13),b.transmission&&a.enable(14),b.sheen&&a.enable(15),b.opaque&&a.enable(16),b.pointsUvs&&a.enable(17),b.decodeVideoTexture&&a.enable(18),b.alphaToCoverage&&a.enable(19),M.push(a.mask)}function y(M){const b=g[M.type];let C;if(b){const R=hn[b];C=bf.clone(R.uniforms)}else C=M.uniforms;return C}function T(M,b){let C;for(let R=0,I=u.length;R<I;R++){const O=u[R];if(O.cacheKey===b){C=O,++C.usedTimes;break}}return C===void 0&&(C=new Dg(i,b,M,s),u.push(C)),C}function w(M){if(--M.usedTimes===0){const b=u.indexOf(M);u[b]=u[u.length-1],u.pop(),M.destroy()}}function S(M){l.remove(M)}function P(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:y,acquireProgram:T,releaseProgram:w,releaseShaderCache:S,programs:u,dispose:P}}function Fg(){let i=new WeakMap;function t(s){let o=i.get(s);return o===void 0&&(o={},i.set(s,o)),o}function e(s){i.delete(s)}function n(s,o,a){i.get(s)[o]=a}function r(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:r}}function kg(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function pc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function mc(){const i=[];let t=0;const e=[],n=[],r=[];function s(){t=0,e.length=0,n.length=0,r.length=0}function o(f,h,d,g,_,m){let p=i[t];return p===void 0?(p={id:f.id,object:f,geometry:h,material:d,groupOrder:g,renderOrder:f.renderOrder,z:_,group:m},i[t]=p):(p.id=f.id,p.object=f,p.geometry=h,p.material=d,p.groupOrder=g,p.renderOrder=f.renderOrder,p.z=_,p.group=m),t++,p}function a(f,h,d,g,_,m){const p=o(f,h,d,g,_,m);d.transmission>0?n.push(p):d.transparent===!0?r.push(p):e.push(p)}function l(f,h,d,g,_,m){const p=o(f,h,d,g,_,m);d.transmission>0?n.unshift(p):d.transparent===!0?r.unshift(p):e.unshift(p)}function c(f,h){e.length>1&&e.sort(f||kg),n.length>1&&n.sort(h||pc),r.length>1&&r.sort(h||pc)}function u(){for(let f=t,h=i.length;f<h;f++){const d=i[f];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:r,init:s,push:a,unshift:l,finish:u,sort:c}}function zg(){let i=new WeakMap;function t(n,r){const s=i.get(n);let o;return s===void 0?(o=new mc,i.set(n,[o])):r>=s.length?(o=new mc,s.push(o)):o=s[r],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function Hg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new L,color:new kt};break;case"SpotLight":e={position:new L,direction:new L,color:new kt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new kt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new kt,groundColor:new kt};break;case"RectAreaLight":e={color:new kt,position:new L,halfWidth:new L,halfHeight:new L};break}return i[t.id]=e,e}}}function Gg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new wt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new wt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new wt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Vg=0;function Wg(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Xg(i){const t=new Hg,e=Gg(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new L);const r=new L,s=new Bt,o=new Bt;function a(c){let u=0,f=0,h=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let d=0,g=0,_=0,m=0,p=0,v=0,x=0,y=0,T=0,w=0,S=0;c.sort(Wg);for(let M=0,b=c.length;M<b;M++){const C=c[M],R=C.color,I=C.intensity,O=C.distance,k=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)u+=R.r*I,f+=R.g*I,h+=R.b*I;else if(C.isLightProbe){for(let z=0;z<9;z++)n.probe[z].addScaledVector(C.sh.coefficients[z],I);S++}else if(C.isDirectionalLight){const z=t.get(C);if(z.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const j=C.shadow,W=e.get(C);W.shadowBias=j.bias,W.shadowNormalBias=j.normalBias,W.shadowRadius=j.radius,W.shadowMapSize=j.mapSize,n.directionalShadow[d]=W,n.directionalShadowMap[d]=k,n.directionalShadowMatrix[d]=C.shadow.matrix,v++}n.directional[d]=z,d++}else if(C.isSpotLight){const z=t.get(C);z.position.setFromMatrixPosition(C.matrixWorld),z.color.copy(R).multiplyScalar(I),z.distance=O,z.coneCos=Math.cos(C.angle),z.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),z.decay=C.decay,n.spot[_]=z;const j=C.shadow;if(C.map&&(n.spotLightMap[T]=C.map,T++,j.updateMatrices(C),C.castShadow&&w++),n.spotLightMatrix[_]=j.matrix,C.castShadow){const W=e.get(C);W.shadowBias=j.bias,W.shadowNormalBias=j.normalBias,W.shadowRadius=j.radius,W.shadowMapSize=j.mapSize,n.spotShadow[_]=W,n.spotShadowMap[_]=k,y++}_++}else if(C.isRectAreaLight){const z=t.get(C);z.color.copy(R).multiplyScalar(I),z.halfWidth.set(C.width*.5,0,0),z.halfHeight.set(0,C.height*.5,0),n.rectArea[m]=z,m++}else if(C.isPointLight){const z=t.get(C);if(z.color.copy(C.color).multiplyScalar(C.intensity),z.distance=C.distance,z.decay=C.decay,C.castShadow){const j=C.shadow,W=e.get(C);W.shadowBias=j.bias,W.shadowNormalBias=j.normalBias,W.shadowRadius=j.radius,W.shadowMapSize=j.mapSize,W.shadowCameraNear=j.camera.near,W.shadowCameraFar=j.camera.far,n.pointShadow[g]=W,n.pointShadowMap[g]=k,n.pointShadowMatrix[g]=C.shadow.matrix,x++}n.point[g]=z,g++}else if(C.isHemisphereLight){const z=t.get(C);z.skyColor.copy(C.color).multiplyScalar(I),z.groundColor.copy(C.groundColor).multiplyScalar(I),n.hemi[p]=z,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=it.LTC_FLOAT_1,n.rectAreaLTC2=it.LTC_FLOAT_2):(n.rectAreaLTC1=it.LTC_HALF_1,n.rectAreaLTC2=it.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=f,n.ambient[2]=h;const P=n.hash;(P.directionalLength!==d||P.pointLength!==g||P.spotLength!==_||P.rectAreaLength!==m||P.hemiLength!==p||P.numDirectionalShadows!==v||P.numPointShadows!==x||P.numSpotShadows!==y||P.numSpotMaps!==T||P.numLightProbes!==S)&&(n.directional.length=d,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=y+T-w,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=S,P.directionalLength=d,P.pointLength=g,P.spotLength=_,P.rectAreaLength=m,P.hemiLength=p,P.numDirectionalShadows=v,P.numPointShadows=x,P.numSpotShadows=y,P.numSpotMaps=T,P.numLightProbes=S,n.version=Vg++)}function l(c,u){let f=0,h=0,d=0,g=0,_=0;const m=u.matrixWorldInverse;for(let p=0,v=c.length;p<v;p++){const x=c[p];if(x.isDirectionalLight){const y=n.directional[f];y.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),f++}else if(x.isSpotLight){const y=n.spot[d];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),d++}else if(x.isRectAreaLight){const y=n.rectArea[g];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),o.identity(),s.copy(x.matrixWorld),s.premultiply(m),o.extractRotation(s),y.halfWidth.set(x.width*.5,0,0),y.halfHeight.set(0,x.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(x.isPointLight){const y=n.point[h];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),h++}else if(x.isHemisphereLight){const y=n.hemi[_];y.direction.setFromMatrixPosition(x.matrixWorld),y.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:n}}function gc(i){const t=new Xg(i),e=[],n=[];function r(u){c.camera=u,e.length=0,n.length=0}function s(u){e.push(u)}function o(u){n.push(u)}function a(){t.setup(e)}function l(u){t.setupView(e,u)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function qg(i){let t=new WeakMap;function e(r,s=0){const o=t.get(r);let a;return o===void 0?(a=new gc(i),t.set(r,[a])):s>=o.length?(a=new gc(i),o.push(a)):a=o[s],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class jg extends bi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Wh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Yg extends bi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const $g=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Kg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Zg(i,t,e){let n=new io;const r=new wt,s=new wt,o=new te,a=new jg({depthPacking:Xh}),l=new Yg,c={},u=e.maxTextureSize,f={[on]:Be,[Be]:on,[Ze]:Ze},h=new jn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new wt},radius:{value:4}},vertexShader:$g,fragmentShader:Kg}),d=h.clone();d.defines.HORIZONTAL_PASS=1;const g=new Ie;g.setAttribute("position",new ke(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new It(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=su;let p=this.type;this.render=function(w,S,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;const M=i.getRenderTarget(),b=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),R=i.state;R.setBlending(Vn),R.buffers.color.setClear(1,1,1,1),R.buffers.depth.setTest(!0),R.setScissorTest(!1);const I=p!==Mn&&this.type===Mn,O=p===Mn&&this.type!==Mn;for(let k=0,z=w.length;k<z;k++){const j=w[k],W=j.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;r.copy(W.mapSize);const lt=W.getFrameExtents();if(r.multiply(lt),s.copy(W.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/lt.x),r.x=s.x*lt.x,W.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/lt.y),r.y=s.y*lt.y,W.mapSize.y=s.y)),W.map===null||I===!0||O===!0){const nt=this.type!==Mn?{minFilter:Ge,magFilter:Ge}:{};W.map!==null&&W.map.dispose(),W.map=new di(r.x,r.y,nt),W.map.texture.name=j.name+".shadowMap",W.camera.updateProjectionMatrix()}i.setRenderTarget(W.map),i.clear();const ht=W.getViewportCount();for(let nt=0;nt<ht;nt++){const Dt=W.getViewport(nt);o.set(s.x*Dt.x,s.y*Dt.y,s.x*Dt.z,s.y*Dt.w),R.viewport(o),W.updateMatrices(j,nt),n=W.getFrustum(),y(S,P,W.camera,j,this.type)}W.isPointLightShadow!==!0&&this.type===Mn&&v(W,P),W.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(M,b,C)};function v(w,S){const P=t.update(_);h.defines.VSM_SAMPLES!==w.blurSamples&&(h.defines.VSM_SAMPLES=w.blurSamples,d.defines.VSM_SAMPLES=w.blurSamples,h.needsUpdate=!0,d.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new di(r.x,r.y)),h.uniforms.shadow_pass.value=w.map.texture,h.uniforms.resolution.value=w.mapSize,h.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(S,null,P,h,_,null),d.uniforms.shadow_pass.value=w.mapPass.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(S,null,P,d,_,null)}function x(w,S,P,M){let b=null;const C=P.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(C!==void 0)b=C;else if(b=P.isPointLight===!0?l:a,i.localClippingEnabled&&S.clipShadows===!0&&Array.isArray(S.clippingPlanes)&&S.clippingPlanes.length!==0||S.displacementMap&&S.displacementScale!==0||S.alphaMap&&S.alphaTest>0||S.map&&S.alphaTest>0){const R=b.uuid,I=S.uuid;let O=c[R];O===void 0&&(O={},c[R]=O);let k=O[I];k===void 0&&(k=b.clone(),O[I]=k,S.addEventListener("dispose",T)),b=k}if(b.visible=S.visible,b.wireframe=S.wireframe,M===Mn?b.side=S.shadowSide!==null?S.shadowSide:S.side:b.side=S.shadowSide!==null?S.shadowSide:f[S.side],b.alphaMap=S.alphaMap,b.alphaTest=S.alphaTest,b.map=S.map,b.clipShadows=S.clipShadows,b.clippingPlanes=S.clippingPlanes,b.clipIntersection=S.clipIntersection,b.displacementMap=S.displacementMap,b.displacementScale=S.displacementScale,b.displacementBias=S.displacementBias,b.wireframeLinewidth=S.wireframeLinewidth,b.linewidth=S.linewidth,P.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const R=i.properties.get(b);R.light=P}return b}function y(w,S,P,M,b){if(w.visible===!1)return;if(w.layers.test(S.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&b===Mn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,w.matrixWorld);const I=t.update(w),O=w.material;if(Array.isArray(O)){const k=I.groups;for(let z=0,j=k.length;z<j;z++){const W=k[z],lt=O[W.materialIndex];if(lt&&lt.visible){const ht=x(w,lt,M,b);w.onBeforeShadow(i,w,S,P,I,ht,W),i.renderBufferDirect(P,null,I,ht,w,W),w.onAfterShadow(i,w,S,P,I,ht,W)}}}else if(O.visible){const k=x(w,O,M,b);w.onBeforeShadow(i,w,S,P,I,k,null),i.renderBufferDirect(P,null,I,k,w,null),w.onAfterShadow(i,w,S,P,I,k,null)}}const R=w.children;for(let I=0,O=R.length;I<O;I++)y(R[I],S,P,M,b)}function T(w){w.target.removeEventListener("dispose",T);for(const P in c){const M=c[P],b=w.target.uuid;b in M&&(M[b].dispose(),delete M[b])}}}function Jg(i){function t(){let U=!1;const ct=new te;let X=null;const Y=new te(0,0,0,0);return{setMask:function(et){X!==et&&!U&&(i.colorMask(et,et,et,et),X=et)},setLocked:function(et){U=et},setClear:function(et,St,Xt,ae,xe){xe===!0&&(et*=ae,St*=ae,Xt*=ae),ct.set(et,St,Xt,ae),Y.equals(ct)===!1&&(i.clearColor(et,St,Xt,ae),Y.copy(ct))},reset:function(){U=!1,X=null,Y.set(-1,0,0,0)}}}function e(){let U=!1,ct=null,X=null,Y=null;return{setTest:function(et){et?ft(i.DEPTH_TEST):rt(i.DEPTH_TEST)},setMask:function(et){ct!==et&&!U&&(i.depthMask(et),ct=et)},setFunc:function(et){if(X!==et){switch(et){case xh:i.depthFunc(i.NEVER);break;case vh:i.depthFunc(i.ALWAYS);break;case yh:i.depthFunc(i.LESS);break;case Gs:i.depthFunc(i.LEQUAL);break;case bh:i.depthFunc(i.EQUAL);break;case Mh:i.depthFunc(i.GEQUAL);break;case Sh:i.depthFunc(i.GREATER);break;case wh:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}X=et}},setLocked:function(et){U=et},setClear:function(et){Y!==et&&(i.clearDepth(et),Y=et)},reset:function(){U=!1,ct=null,X=null,Y=null}}}function n(){let U=!1,ct=null,X=null,Y=null,et=null,St=null,Xt=null,ae=null,xe=null;return{setTest:function(Kt){U||(Kt?ft(i.STENCIL_TEST):rt(i.STENCIL_TEST))},setMask:function(Kt){ct!==Kt&&!U&&(i.stencilMask(Kt),ct=Kt)},setFunc:function(Kt,ln,cn){(X!==Kt||Y!==ln||et!==cn)&&(i.stencilFunc(Kt,ln,cn),X=Kt,Y=ln,et=cn)},setOp:function(Kt,ln,cn){(St!==Kt||Xt!==ln||ae!==cn)&&(i.stencilOp(Kt,ln,cn),St=Kt,Xt=ln,ae=cn)},setLocked:function(Kt){U=Kt},setClear:function(Kt){xe!==Kt&&(i.clearStencil(Kt),xe=Kt)},reset:function(){U=!1,ct=null,X=null,Y=null,et=null,St=null,Xt=null,ae=null,xe=null}}}const r=new t,s=new e,o=new n,a=new WeakMap,l=new WeakMap;let c={},u={},f=new WeakMap,h=[],d=null,g=!1,_=null,m=null,p=null,v=null,x=null,y=null,T=null,w=new kt(0,0,0),S=0,P=!1,M=null,b=null,C=null,R=null,I=null;const O=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,z=0;const j=i.getParameter(i.VERSION);j.indexOf("WebGL")!==-1?(z=parseFloat(/^WebGL (\d)/.exec(j)[1]),k=z>=1):j.indexOf("OpenGL ES")!==-1&&(z=parseFloat(/^OpenGL ES (\d)/.exec(j)[1]),k=z>=2);let W=null,lt={};const ht=i.getParameter(i.SCISSOR_BOX),nt=i.getParameter(i.VIEWPORT),Dt=new te().fromArray(ht),Wt=new te().fromArray(nt);function q(U,ct,X,Y){const et=new Uint8Array(4),St=i.createTexture();i.bindTexture(U,St),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Xt=0;Xt<X;Xt++)U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?i.texImage3D(ct,0,i.RGBA,1,1,Y,0,i.RGBA,i.UNSIGNED_BYTE,et):i.texImage2D(ct+Xt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,et);return St}const J={};J[i.TEXTURE_2D]=q(i.TEXTURE_2D,i.TEXTURE_2D,1),J[i.TEXTURE_CUBE_MAP]=q(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[i.TEXTURE_2D_ARRAY]=q(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),J[i.TEXTURE_3D]=q(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),s.setClear(1),o.setClear(0),ft(i.DEPTH_TEST),s.setFunc(Gs),vt(!1),Vt(Za),ft(i.CULL_FACE),Ht(Vn);function ft(U){c[U]!==!0&&(i.enable(U),c[U]=!0)}function rt(U){c[U]!==!1&&(i.disable(U),c[U]=!1)}function Pt(U,ct){return u[U]!==ct?(i.bindFramebuffer(U,ct),u[U]=ct,U===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=ct),U===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=ct),!0):!1}function Et(U,ct){let X=h,Y=!1;if(U){X=f.get(ct),X===void 0&&(X=[],f.set(ct,X));const et=U.textures;if(X.length!==et.length||X[0]!==i.COLOR_ATTACHMENT0){for(let St=0,Xt=et.length;St<Xt;St++)X[St]=i.COLOR_ATTACHMENT0+St;X.length=et.length,Y=!0}}else X[0]!==i.BACK&&(X[0]=i.BACK,Y=!0);Y&&i.drawBuffers(X)}function zt(U){return d!==U?(i.useProgram(U),d=U,!0):!1}const N={[ci]:i.FUNC_ADD,[eh]:i.FUNC_SUBTRACT,[nh]:i.FUNC_REVERSE_SUBTRACT};N[ih]=i.MIN,N[rh]=i.MAX;const Ut={[sh]:i.ZERO,[oh]:i.ONE,[ah]:i.SRC_COLOR,[ha]:i.SRC_ALPHA,[dh]:i.SRC_ALPHA_SATURATE,[hh]:i.DST_COLOR,[ch]:i.DST_ALPHA,[lh]:i.ONE_MINUS_SRC_COLOR,[fa]:i.ONE_MINUS_SRC_ALPHA,[fh]:i.ONE_MINUS_DST_COLOR,[uh]:i.ONE_MINUS_DST_ALPHA,[ph]:i.CONSTANT_COLOR,[mh]:i.ONE_MINUS_CONSTANT_COLOR,[gh]:i.CONSTANT_ALPHA,[_h]:i.ONE_MINUS_CONSTANT_ALPHA};function Ht(U,ct,X,Y,et,St,Xt,ae,xe,Kt){if(U===Vn){g===!0&&(rt(i.BLEND),g=!1);return}if(g===!1&&(ft(i.BLEND),g=!0),U!==th){if(U!==_||Kt!==P){if((m!==ci||x!==ci)&&(i.blendEquation(i.FUNC_ADD),m=ci,x=ci),Kt)switch(U){case rr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ja:i.blendFunc(i.ONE,i.ONE);break;case Qa:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case tl:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case rr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ja:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Qa:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case tl:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}p=null,v=null,y=null,T=null,w.set(0,0,0),S=0,_=U,P=Kt}return}et=et||ct,St=St||X,Xt=Xt||Y,(ct!==m||et!==x)&&(i.blendEquationSeparate(N[ct],N[et]),m=ct,x=et),(X!==p||Y!==v||St!==y||Xt!==T)&&(i.blendFuncSeparate(Ut[X],Ut[Y],Ut[St],Ut[Xt]),p=X,v=Y,y=St,T=Xt),(ae.equals(w)===!1||xe!==S)&&(i.blendColor(ae.r,ae.g,ae.b,xe),w.copy(ae),S=xe),_=U,P=!1}function ee(U,ct){U.side===Ze?rt(i.CULL_FACE):ft(i.CULL_FACE);let X=U.side===Be;ct&&(X=!X),vt(X),U.blending===rr&&U.transparent===!1?Ht(Vn):Ht(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),s.setFunc(U.depthFunc),s.setTest(U.depthTest),s.setMask(U.depthWrite),r.setMask(U.colorWrite);const Y=U.stencilWrite;o.setTest(Y),Y&&(o.setMask(U.stencilWriteMask),o.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),o.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),Tt(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?ft(i.SAMPLE_ALPHA_TO_COVERAGE):rt(i.SAMPLE_ALPHA_TO_COVERAGE)}function vt(U){M!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),M=U)}function Vt(U){U!==Ju?(ft(i.CULL_FACE),U!==b&&(U===Za?i.cullFace(i.BACK):U===Qu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):rt(i.CULL_FACE),b=U}function Ot(U){U!==C&&(k&&i.lineWidth(U),C=U)}function Tt(U,ct,X){U?(ft(i.POLYGON_OFFSET_FILL),(R!==ct||I!==X)&&(i.polygonOffset(ct,X),R=ct,I=X)):rt(i.POLYGON_OFFSET_FILL)}function le(U){U?ft(i.SCISSOR_TEST):rt(i.SCISSOR_TEST)}function D(U){U===void 0&&(U=i.TEXTURE0+O-1),W!==U&&(i.activeTexture(U),W=U)}function E(U,ct,X){X===void 0&&(W===null?X=i.TEXTURE0+O-1:X=W);let Y=lt[X];Y===void 0&&(Y={type:void 0,texture:void 0},lt[X]=Y),(Y.type!==U||Y.texture!==ct)&&(W!==X&&(i.activeTexture(X),W=X),i.bindTexture(U,ct||J[U]),Y.type=U,Y.texture=ct)}function V(){const U=lt[W];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function $(){try{i.compressedTexImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function K(){try{i.compressedTexImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Z(){try{i.texSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function _t(){try{i.texSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function st(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ot(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Rt(){try{i.texStorage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Q(){try{i.texStorage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function mt(){try{i.texImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ft(){try{i.texImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Mt(U){Dt.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),Dt.copy(U))}function at(U){Wt.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),Wt.copy(U))}function Lt(U,ct){let X=l.get(ct);X===void 0&&(X=new WeakMap,l.set(ct,X));let Y=X.get(U);Y===void 0&&(Y=i.getUniformBlockIndex(ct,U.name),X.set(U,Y))}function Gt(U,ct){const Y=l.get(ct).get(U);a.get(ct)!==Y&&(i.uniformBlockBinding(ct,Y,U.__bindingPointIndex),a.set(ct,Y))}function oe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),c={},W=null,lt={},u={},f=new WeakMap,h=[],d=null,g=!1,_=null,m=null,p=null,v=null,x=null,y=null,T=null,w=new kt(0,0,0),S=0,P=!1,M=null,b=null,C=null,R=null,I=null,Dt.set(0,0,i.canvas.width,i.canvas.height),Wt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),s.reset(),o.reset()}return{buffers:{color:r,depth:s,stencil:o},enable:ft,disable:rt,bindFramebuffer:Pt,drawBuffers:Et,useProgram:zt,setBlending:Ht,setMaterial:ee,setFlipSided:vt,setCullFace:Vt,setLineWidth:Ot,setPolygonOffset:Tt,setScissorTest:le,activeTexture:D,bindTexture:E,unbindTexture:V,compressedTexImage2D:$,compressedTexImage3D:K,texImage2D:mt,texImage3D:Ft,updateUBOMapping:Lt,uniformBlockBinding:Gt,texStorage2D:Rt,texStorage3D:Q,texSubImage2D:Z,texSubImage3D:_t,compressedTexSubImage2D:st,compressedTexSubImage3D:ot,scissor:Mt,viewport:at,reset:oe}}function Qg(i,t,e,n,r,s,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new wt,u=new WeakMap;let f;const h=new WeakMap;let d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(D,E){return d?new OffscreenCanvas(D,E):Ys("canvas")}function _(D,E,V){let $=1;const K=le(D);if((K.width>V||K.height>V)&&($=V/Math.max(K.width,K.height)),$<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){const Z=Math.floor($*K.width),_t=Math.floor($*K.height);f===void 0&&(f=g(Z,_t));const st=E?g(Z,_t):f;return st.width=Z,st.height=_t,st.getContext("2d").drawImage(D,0,0,Z,_t),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+Z+"x"+_t+")."),st}else return"data"in D&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),D;return D}function m(D){return D.generateMipmaps&&D.minFilter!==Ge&&D.minFilter!==sn}function p(D){i.generateMipmap(D)}function v(D,E,V,$,K=!1){if(D!==null){if(i[D]!==void 0)return i[D];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let Z=E;if(E===i.RED&&(V===i.FLOAT&&(Z=i.R32F),V===i.HALF_FLOAT&&(Z=i.R16F),V===i.UNSIGNED_BYTE&&(Z=i.R8)),E===i.RED_INTEGER&&(V===i.UNSIGNED_BYTE&&(Z=i.R8UI),V===i.UNSIGNED_SHORT&&(Z=i.R16UI),V===i.UNSIGNED_INT&&(Z=i.R32UI),V===i.BYTE&&(Z=i.R8I),V===i.SHORT&&(Z=i.R16I),V===i.INT&&(Z=i.R32I)),E===i.RG&&(V===i.FLOAT&&(Z=i.RG32F),V===i.HALF_FLOAT&&(Z=i.RG16F),V===i.UNSIGNED_BYTE&&(Z=i.RG8)),E===i.RG_INTEGER&&(V===i.UNSIGNED_BYTE&&(Z=i.RG8UI),V===i.UNSIGNED_SHORT&&(Z=i.RG16UI),V===i.UNSIGNED_INT&&(Z=i.RG32UI),V===i.BYTE&&(Z=i.RG8I),V===i.SHORT&&(Z=i.RG16I),V===i.INT&&(Z=i.RG32I)),E===i.RGB&&V===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),E===i.RGBA){const _t=K?Ws:Yt.getTransfer($);V===i.FLOAT&&(Z=i.RGBA32F),V===i.HALF_FLOAT&&(Z=i.RGBA16F),V===i.UNSIGNED_BYTE&&(Z=_t===Jt?i.SRGB8_ALPHA8:i.RGBA8),V===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),V===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function x(D,E){let V;return D?E===null||E===ur||E===hr?V=i.DEPTH24_STENCIL8:E===fn?V=i.DEPTH32F_STENCIL8:E===Vs&&(V=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===ur||E===hr?V=i.DEPTH_COMPONENT24:E===fn?V=i.DEPTH_COMPONENT32F:E===Vs&&(V=i.DEPTH_COMPONENT16),V}function y(D,E){return m(D)===!0||D.isFramebufferTexture&&D.minFilter!==Ge&&D.minFilter!==sn?Math.log2(Math.max(E.width,E.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?E.mipmaps.length:1}function T(D){const E=D.target;E.removeEventListener("dispose",T),S(E),E.isVideoTexture&&u.delete(E)}function w(D){const E=D.target;E.removeEventListener("dispose",w),M(E)}function S(D){const E=n.get(D);if(E.__webglInit===void 0)return;const V=D.source,$=h.get(V);if($){const K=$[E.__cacheKey];K.usedTimes--,K.usedTimes===0&&P(D),Object.keys($).length===0&&h.delete(V)}n.remove(D)}function P(D){const E=n.get(D);i.deleteTexture(E.__webglTexture);const V=D.source,$=h.get(V);delete $[E.__cacheKey],o.memory.textures--}function M(D){const E=n.get(D);if(D.depthTexture&&D.depthTexture.dispose(),D.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(E.__webglFramebuffer[$]))for(let K=0;K<E.__webglFramebuffer[$].length;K++)i.deleteFramebuffer(E.__webglFramebuffer[$][K]);else i.deleteFramebuffer(E.__webglFramebuffer[$]);E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer[$])}else{if(Array.isArray(E.__webglFramebuffer))for(let $=0;$<E.__webglFramebuffer.length;$++)i.deleteFramebuffer(E.__webglFramebuffer[$]);else i.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&i.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let $=0;$<E.__webglColorRenderbuffer.length;$++)E.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(E.__webglColorRenderbuffer[$]);E.__webglDepthRenderbuffer&&i.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const V=D.textures;for(let $=0,K=V.length;$<K;$++){const Z=n.get(V[$]);Z.__webglTexture&&(i.deleteTexture(Z.__webglTexture),o.memory.textures--),n.remove(V[$])}n.remove(D)}let b=0;function C(){b=0}function R(){const D=b;return D>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+r.maxTextures),b+=1,D}function I(D){const E=[];return E.push(D.wrapS),E.push(D.wrapT),E.push(D.wrapR||0),E.push(D.magFilter),E.push(D.minFilter),E.push(D.anisotropy),E.push(D.internalFormat),E.push(D.format),E.push(D.type),E.push(D.generateMipmaps),E.push(D.premultiplyAlpha),E.push(D.flipY),E.push(D.unpackAlignment),E.push(D.colorSpace),E.join()}function O(D,E){const V=n.get(D);if(D.isVideoTexture&&Ot(D),D.isRenderTargetTexture===!1&&D.version>0&&V.__version!==D.version){const $=D.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Wt(V,D,E);return}}e.bindTexture(i.TEXTURE_2D,V.__webglTexture,i.TEXTURE0+E)}function k(D,E){const V=n.get(D);if(D.version>0&&V.__version!==D.version){Wt(V,D,E);return}e.bindTexture(i.TEXTURE_2D_ARRAY,V.__webglTexture,i.TEXTURE0+E)}function z(D,E){const V=n.get(D);if(D.version>0&&V.__version!==D.version){Wt(V,D,E);return}e.bindTexture(i.TEXTURE_3D,V.__webglTexture,i.TEXTURE0+E)}function j(D,E){const V=n.get(D);if(D.version>0&&V.__version!==D.version){q(V,D,E);return}e.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture,i.TEXTURE0+E)}const W={[ma]:i.REPEAT,[hi]:i.CLAMP_TO_EDGE,[ga]:i.MIRRORED_REPEAT},lt={[Ge]:i.NEAREST,[Dh]:i.NEAREST_MIPMAP_NEAREST,[Vr]:i.NEAREST_MIPMAP_LINEAR,[sn]:i.LINEAR,[fo]:i.LINEAR_MIPMAP_NEAREST,[fi]:i.LINEAR_MIPMAP_LINEAR},ht={[jh]:i.NEVER,[Qh]:i.ALWAYS,[Yh]:i.LESS,[gu]:i.LEQUAL,[$h]:i.EQUAL,[Jh]:i.GEQUAL,[Kh]:i.GREATER,[Zh]:i.NOTEQUAL};function nt(D,E){if(E.type===fn&&t.has("OES_texture_float_linear")===!1&&(E.magFilter===sn||E.magFilter===fo||E.magFilter===Vr||E.magFilter===fi||E.minFilter===sn||E.minFilter===fo||E.minFilter===Vr||E.minFilter===fi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(D,i.TEXTURE_WRAP_S,W[E.wrapS]),i.texParameteri(D,i.TEXTURE_WRAP_T,W[E.wrapT]),(D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY)&&i.texParameteri(D,i.TEXTURE_WRAP_R,W[E.wrapR]),i.texParameteri(D,i.TEXTURE_MAG_FILTER,lt[E.magFilter]),i.texParameteri(D,i.TEXTURE_MIN_FILTER,lt[E.minFilter]),E.compareFunction&&(i.texParameteri(D,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(D,i.TEXTURE_COMPARE_FUNC,ht[E.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Ge||E.minFilter!==Vr&&E.minFilter!==fi||E.type===fn&&t.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||n.get(E).__currentAnisotropy){const V=t.get("EXT_texture_filter_anisotropic");i.texParameterf(D,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,r.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy}}}function Dt(D,E){let V=!1;D.__webglInit===void 0&&(D.__webglInit=!0,E.addEventListener("dispose",T));const $=E.source;let K=h.get($);K===void 0&&(K={},h.set($,K));const Z=I(E);if(Z!==D.__cacheKey){K[Z]===void 0&&(K[Z]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,V=!0),K[Z].usedTimes++;const _t=K[D.__cacheKey];_t!==void 0&&(K[D.__cacheKey].usedTimes--,_t.usedTimes===0&&P(E)),D.__cacheKey=Z,D.__webglTexture=K[Z].texture}return V}function Wt(D,E,V){let $=i.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),E.isData3DTexture&&($=i.TEXTURE_3D);const K=Dt(D,E),Z=E.source;e.bindTexture($,D.__webglTexture,i.TEXTURE0+V);const _t=n.get(Z);if(Z.version!==_t.__version||K===!0){e.activeTexture(i.TEXTURE0+V);const st=Yt.getPrimaries(Yt.workingColorSpace),ot=E.colorSpace===zn?null:Yt.getPrimaries(E.colorSpace),Rt=E.colorSpace===zn||st===ot?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Rt);let Q=_(E.image,!1,r.maxTextureSize);Q=Tt(E,Q);const mt=s.convert(E.format,E.colorSpace),Ft=s.convert(E.type);let Mt=v(E.internalFormat,mt,Ft,E.colorSpace,E.isVideoTexture);nt($,E);let at;const Lt=E.mipmaps,Gt=E.isVideoTexture!==!0,oe=_t.__version===void 0||K===!0,U=Z.dataReady,ct=y(E,Q);if(E.isDepthTexture)Mt=x(E.format===fr,E.type),oe&&(Gt?e.texStorage2D(i.TEXTURE_2D,1,Mt,Q.width,Q.height):e.texImage2D(i.TEXTURE_2D,0,Mt,Q.width,Q.height,0,mt,Ft,null));else if(E.isDataTexture)if(Lt.length>0){Gt&&oe&&e.texStorage2D(i.TEXTURE_2D,ct,Mt,Lt[0].width,Lt[0].height);for(let X=0,Y=Lt.length;X<Y;X++)at=Lt[X],Gt?U&&e.texSubImage2D(i.TEXTURE_2D,X,0,0,at.width,at.height,mt,Ft,at.data):e.texImage2D(i.TEXTURE_2D,X,Mt,at.width,at.height,0,mt,Ft,at.data);E.generateMipmaps=!1}else Gt?(oe&&e.texStorage2D(i.TEXTURE_2D,ct,Mt,Q.width,Q.height),U&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Q.width,Q.height,mt,Ft,Q.data)):e.texImage2D(i.TEXTURE_2D,0,Mt,Q.width,Q.height,0,mt,Ft,Q.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){Gt&&oe&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ct,Mt,Lt[0].width,Lt[0].height,Q.depth);for(let X=0,Y=Lt.length;X<Y;X++)if(at=Lt[X],E.format!==Je)if(mt!==null)if(Gt){if(U)if(E.layerUpdates.size>0){for(const et of E.layerUpdates){const St=at.width*at.height;e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,X,0,0,et,at.width,at.height,1,mt,at.data.slice(St*et,St*(et+1)),0,0)}E.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,X,0,0,0,at.width,at.height,Q.depth,mt,at.data,0,0)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,X,Mt,at.width,at.height,Q.depth,0,at.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Gt?U&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,X,0,0,0,at.width,at.height,Q.depth,mt,Ft,at.data):e.texImage3D(i.TEXTURE_2D_ARRAY,X,Mt,at.width,at.height,Q.depth,0,mt,Ft,at.data)}else{Gt&&oe&&e.texStorage2D(i.TEXTURE_2D,ct,Mt,Lt[0].width,Lt[0].height);for(let X=0,Y=Lt.length;X<Y;X++)at=Lt[X],E.format!==Je?mt!==null?Gt?U&&e.compressedTexSubImage2D(i.TEXTURE_2D,X,0,0,at.width,at.height,mt,at.data):e.compressedTexImage2D(i.TEXTURE_2D,X,Mt,at.width,at.height,0,at.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Gt?U&&e.texSubImage2D(i.TEXTURE_2D,X,0,0,at.width,at.height,mt,Ft,at.data):e.texImage2D(i.TEXTURE_2D,X,Mt,at.width,at.height,0,mt,Ft,at.data)}else if(E.isDataArrayTexture)if(Gt){if(oe&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ct,Mt,Q.width,Q.height,Q.depth),U)if(E.layerUpdates.size>0){let X;switch(Ft){case i.UNSIGNED_BYTE:switch(mt){case i.ALPHA:X=1;break;case i.LUMINANCE:X=1;break;case i.LUMINANCE_ALPHA:X=2;break;case i.RGB:X=3;break;case i.RGBA:X=4;break;default:throw new Error(`Unknown texel size for format ${mt}.`)}break;case i.UNSIGNED_SHORT_4_4_4_4:case i.UNSIGNED_SHORT_5_5_5_1:case i.UNSIGNED_SHORT_5_6_5:X=1;break;default:throw new Error(`Unknown texel size for type ${Ft}.`)}const Y=Q.width*Q.height*X;for(const et of E.layerUpdates)e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,et,Q.width,Q.height,1,mt,Ft,Q.data.slice(Y*et,Y*(et+1)));E.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,mt,Ft,Q.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Mt,Q.width,Q.height,Q.depth,0,mt,Ft,Q.data);else if(E.isData3DTexture)Gt?(oe&&e.texStorage3D(i.TEXTURE_3D,ct,Mt,Q.width,Q.height,Q.depth),U&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,mt,Ft,Q.data)):e.texImage3D(i.TEXTURE_3D,0,Mt,Q.width,Q.height,Q.depth,0,mt,Ft,Q.data);else if(E.isFramebufferTexture){if(oe)if(Gt)e.texStorage2D(i.TEXTURE_2D,ct,Mt,Q.width,Q.height);else{let X=Q.width,Y=Q.height;for(let et=0;et<ct;et++)e.texImage2D(i.TEXTURE_2D,et,Mt,X,Y,0,mt,Ft,null),X>>=1,Y>>=1}}else if(Lt.length>0){if(Gt&&oe){const X=le(Lt[0]);e.texStorage2D(i.TEXTURE_2D,ct,Mt,X.width,X.height)}for(let X=0,Y=Lt.length;X<Y;X++)at=Lt[X],Gt?U&&e.texSubImage2D(i.TEXTURE_2D,X,0,0,mt,Ft,at):e.texImage2D(i.TEXTURE_2D,X,Mt,mt,Ft,at);E.generateMipmaps=!1}else if(Gt){if(oe){const X=le(Q);e.texStorage2D(i.TEXTURE_2D,ct,Mt,X.width,X.height)}U&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,mt,Ft,Q)}else e.texImage2D(i.TEXTURE_2D,0,Mt,mt,Ft,Q);m(E)&&p($),_t.__version=Z.version,E.onUpdate&&E.onUpdate(E)}D.__version=E.version}function q(D,E,V){if(E.image.length!==6)return;const $=Dt(D,E),K=E.source;e.bindTexture(i.TEXTURE_CUBE_MAP,D.__webglTexture,i.TEXTURE0+V);const Z=n.get(K);if(K.version!==Z.__version||$===!0){e.activeTexture(i.TEXTURE0+V);const _t=Yt.getPrimaries(Yt.workingColorSpace),st=E.colorSpace===zn?null:Yt.getPrimaries(E.colorSpace),ot=E.colorSpace===zn||_t===st?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ot);const Rt=E.isCompressedTexture||E.image[0].isCompressedTexture,Q=E.image[0]&&E.image[0].isDataTexture,mt=[];for(let Y=0;Y<6;Y++)!Rt&&!Q?mt[Y]=_(E.image[Y],!0,r.maxCubemapSize):mt[Y]=Q?E.image[Y].image:E.image[Y],mt[Y]=Tt(E,mt[Y]);const Ft=mt[0],Mt=s.convert(E.format,E.colorSpace),at=s.convert(E.type),Lt=v(E.internalFormat,Mt,at,E.colorSpace),Gt=E.isVideoTexture!==!0,oe=Z.__version===void 0||$===!0,U=K.dataReady;let ct=y(E,Ft);nt(i.TEXTURE_CUBE_MAP,E);let X;if(Rt){Gt&&oe&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ct,Lt,Ft.width,Ft.height);for(let Y=0;Y<6;Y++){X=mt[Y].mipmaps;for(let et=0;et<X.length;et++){const St=X[et];E.format!==Je?Mt!==null?Gt?U&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,et,0,0,St.width,St.height,Mt,St.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,et,Lt,St.width,St.height,0,St.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Gt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,et,0,0,St.width,St.height,Mt,at,St.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,et,Lt,St.width,St.height,0,Mt,at,St.data)}}}else{if(X=E.mipmaps,Gt&&oe){X.length>0&&ct++;const Y=le(mt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ct,Lt,Y.width,Y.height)}for(let Y=0;Y<6;Y++)if(Q){Gt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,mt[Y].width,mt[Y].height,Mt,at,mt[Y].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,Lt,mt[Y].width,mt[Y].height,0,Mt,at,mt[Y].data);for(let et=0;et<X.length;et++){const Xt=X[et].image[Y].image;Gt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,et+1,0,0,Xt.width,Xt.height,Mt,at,Xt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,et+1,Lt,Xt.width,Xt.height,0,Mt,at,Xt.data)}}else{Gt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,Mt,at,mt[Y]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,Lt,Mt,at,mt[Y]);for(let et=0;et<X.length;et++){const St=X[et];Gt?U&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,et+1,0,0,Mt,at,St.image[Y]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,et+1,Lt,Mt,at,St.image[Y])}}}m(E)&&p(i.TEXTURE_CUBE_MAP),Z.__version=K.version,E.onUpdate&&E.onUpdate(E)}D.__version=E.version}function J(D,E,V,$,K,Z){const _t=s.convert(V.format,V.colorSpace),st=s.convert(V.type),ot=v(V.internalFormat,_t,st,V.colorSpace);if(!n.get(E).__hasExternalTextures){const Q=Math.max(1,E.width>>Z),mt=Math.max(1,E.height>>Z);K===i.TEXTURE_3D||K===i.TEXTURE_2D_ARRAY?e.texImage3D(K,Z,ot,Q,mt,E.depth,0,_t,st,null):e.texImage2D(K,Z,ot,Q,mt,0,_t,st,null)}e.bindFramebuffer(i.FRAMEBUFFER,D),Vt(E)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,K,n.get(V).__webglTexture,0,vt(E)):(K===i.TEXTURE_2D||K>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,K,n.get(V).__webglTexture,Z),e.bindFramebuffer(i.FRAMEBUFFER,null)}function ft(D,E,V){if(i.bindRenderbuffer(i.RENDERBUFFER,D),E.depthBuffer){const $=E.depthTexture,K=$&&$.isDepthTexture?$.type:null,Z=x(E.stencilBuffer,K),_t=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,st=vt(E);Vt(E)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,st,Z,E.width,E.height):V?i.renderbufferStorageMultisample(i.RENDERBUFFER,st,Z,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,Z,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,_t,i.RENDERBUFFER,D)}else{const $=E.textures;for(let K=0;K<$.length;K++){const Z=$[K],_t=s.convert(Z.format,Z.colorSpace),st=s.convert(Z.type),ot=v(Z.internalFormat,_t,st,Z.colorSpace),Rt=vt(E);V&&Vt(E)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Rt,ot,E.width,E.height):Vt(E)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Rt,ot,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,ot,E.width,E.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function rt(D,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,D),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(E.depthTexture).__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),O(E.depthTexture,0);const $=n.get(E.depthTexture).__webglTexture,K=vt(E);if(E.depthTexture.format===sr)Vt(E)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,$,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,$,0);else if(E.depthTexture.format===fr)Vt(E)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,$,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,$,0);else throw new Error("Unknown depthTexture format")}function Pt(D){const E=n.get(D),V=D.isWebGLCubeRenderTarget===!0;if(D.depthTexture&&!E.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");rt(E.__webglFramebuffer,D)}else if(V){E.__webglDepthbuffer=[];for(let $=0;$<6;$++)e.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[$]),E.__webglDepthbuffer[$]=i.createRenderbuffer(),ft(E.__webglDepthbuffer[$],D,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer=i.createRenderbuffer(),ft(E.__webglDepthbuffer,D,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function Et(D,E,V){const $=n.get(D);E!==void 0&&J($.__webglFramebuffer,D,D.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),V!==void 0&&Pt(D)}function zt(D){const E=D.texture,V=n.get(D),$=n.get(E);D.addEventListener("dispose",w);const K=D.textures,Z=D.isWebGLCubeRenderTarget===!0,_t=K.length>1;if(_t||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=E.version,o.memory.textures++),Z){V.__webglFramebuffer=[];for(let st=0;st<6;st++)if(E.mipmaps&&E.mipmaps.length>0){V.__webglFramebuffer[st]=[];for(let ot=0;ot<E.mipmaps.length;ot++)V.__webglFramebuffer[st][ot]=i.createFramebuffer()}else V.__webglFramebuffer[st]=i.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){V.__webglFramebuffer=[];for(let st=0;st<E.mipmaps.length;st++)V.__webglFramebuffer[st]=i.createFramebuffer()}else V.__webglFramebuffer=i.createFramebuffer();if(_t)for(let st=0,ot=K.length;st<ot;st++){const Rt=n.get(K[st]);Rt.__webglTexture===void 0&&(Rt.__webglTexture=i.createTexture(),o.memory.textures++)}if(D.samples>0&&Vt(D)===!1){V.__webglMultisampledFramebuffer=i.createFramebuffer(),V.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let st=0;st<K.length;st++){const ot=K[st];V.__webglColorRenderbuffer[st]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,V.__webglColorRenderbuffer[st]);const Rt=s.convert(ot.format,ot.colorSpace),Q=s.convert(ot.type),mt=v(ot.internalFormat,Rt,Q,ot.colorSpace,D.isXRRenderTarget===!0),Ft=vt(D);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ft,mt,D.width,D.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+st,i.RENDERBUFFER,V.__webglColorRenderbuffer[st])}i.bindRenderbuffer(i.RENDERBUFFER,null),D.depthBuffer&&(V.__webglDepthRenderbuffer=i.createRenderbuffer(),ft(V.__webglDepthRenderbuffer,D,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Z){e.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),nt(i.TEXTURE_CUBE_MAP,E);for(let st=0;st<6;st++)if(E.mipmaps&&E.mipmaps.length>0)for(let ot=0;ot<E.mipmaps.length;ot++)J(V.__webglFramebuffer[st][ot],D,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+st,ot);else J(V.__webglFramebuffer[st],D,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0);m(E)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(_t){for(let st=0,ot=K.length;st<ot;st++){const Rt=K[st],Q=n.get(Rt);e.bindTexture(i.TEXTURE_2D,Q.__webglTexture),nt(i.TEXTURE_2D,Rt),J(V.__webglFramebuffer,D,Rt,i.COLOR_ATTACHMENT0+st,i.TEXTURE_2D,0),m(Rt)&&p(i.TEXTURE_2D)}e.unbindTexture()}else{let st=i.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(st=D.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(st,$.__webglTexture),nt(st,E),E.mipmaps&&E.mipmaps.length>0)for(let ot=0;ot<E.mipmaps.length;ot++)J(V.__webglFramebuffer[ot],D,E,i.COLOR_ATTACHMENT0,st,ot);else J(V.__webglFramebuffer,D,E,i.COLOR_ATTACHMENT0,st,0);m(E)&&p(st),e.unbindTexture()}D.depthBuffer&&Pt(D)}function N(D){const E=D.textures;for(let V=0,$=E.length;V<$;V++){const K=E[V];if(m(K)){const Z=D.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,_t=n.get(K).__webglTexture;e.bindTexture(Z,_t),p(Z),e.unbindTexture()}}}const Ut=[],Ht=[];function ee(D){if(D.samples>0){if(Vt(D)===!1){const E=D.textures,V=D.width,$=D.height;let K=i.COLOR_BUFFER_BIT;const Z=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,_t=n.get(D),st=E.length>1;if(st)for(let ot=0;ot<E.length;ot++)e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ot,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ot,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,_t.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,_t.__webglFramebuffer);for(let ot=0;ot<E.length;ot++){if(D.resolveDepthBuffer&&(D.depthBuffer&&(K|=i.DEPTH_BUFFER_BIT),D.stencilBuffer&&D.resolveStencilBuffer&&(K|=i.STENCIL_BUFFER_BIT)),st){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,_t.__webglColorRenderbuffer[ot]);const Rt=n.get(E[ot]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Rt,0)}i.blitFramebuffer(0,0,V,$,0,0,V,$,K,i.NEAREST),l===!0&&(Ut.length=0,Ht.length=0,Ut.push(i.COLOR_ATTACHMENT0+ot),D.depthBuffer&&D.resolveDepthBuffer===!1&&(Ut.push(Z),Ht.push(Z),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Ht)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ut))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),st)for(let ot=0;ot<E.length;ot++){e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ot,i.RENDERBUFFER,_t.__webglColorRenderbuffer[ot]);const Rt=n.get(E[ot]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ot,i.TEXTURE_2D,Rt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,_t.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.resolveDepthBuffer===!1&&l){const E=D.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[E])}}}function vt(D){return Math.min(r.maxSamples,D.samples)}function Vt(D){const E=n.get(D);return D.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function Ot(D){const E=o.render.frame;u.get(D)!==E&&(u.set(D,E),D.update())}function Tt(D,E){const V=D.colorSpace,$=D.format,K=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||V!==$n&&V!==zn&&(Yt.getTransfer(V)===Jt?($!==Je||K!==qn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),E}function le(D){return typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement?(c.width=D.naturalWidth||D.width,c.height=D.naturalHeight||D.height):typeof VideoFrame<"u"&&D instanceof VideoFrame?(c.width=D.displayWidth,c.height=D.displayHeight):(c.width=D.width,c.height=D.height),c}this.allocateTextureUnit=R,this.resetTextureUnits=C,this.setTexture2D=O,this.setTexture2DArray=k,this.setTexture3D=z,this.setTextureCube=j,this.rebindTextures=Et,this.setupRenderTarget=zt,this.updateRenderTargetMipmap=N,this.updateMultisampleRenderTarget=ee,this.setupDepthRenderbuffer=Pt,this.setupFrameBufferTexture=J,this.useMultisampledRTT=Vt}function t0(i,t){function e(n,r=zn){let s;const o=Yt.getTransfer(r);if(n===qn)return i.UNSIGNED_BYTE;if(n===uu)return i.UNSIGNED_SHORT_4_4_4_4;if(n===hu)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Oh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Uh)return i.BYTE;if(n===Nh)return i.SHORT;if(n===Vs)return i.UNSIGNED_SHORT;if(n===cu)return i.INT;if(n===ur)return i.UNSIGNED_INT;if(n===fn)return i.FLOAT;if(n===eo)return i.HALF_FLOAT;if(n===Bh)return i.ALPHA;if(n===Fh)return i.RGB;if(n===Je)return i.RGBA;if(n===kh)return i.LUMINANCE;if(n===zh)return i.LUMINANCE_ALPHA;if(n===sr)return i.DEPTH_COMPONENT;if(n===fr)return i.DEPTH_STENCIL;if(n===Hh)return i.RED;if(n===fu)return i.RED_INTEGER;if(n===Gh)return i.RG;if(n===du)return i.RG_INTEGER;if(n===pu)return i.RGBA_INTEGER;if(n===po||n===mo||n===go||n===_o)if(o===Jt)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===po)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===mo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===go)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===_o)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===po)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===mo)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===go)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===_o)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===el||n===nl||n===il||n===rl)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===el)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===nl)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===il)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===rl)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===sl||n===ol||n===al)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===sl||n===ol)return o===Jt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===al)return o===Jt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ll||n===cl||n===ul||n===hl||n===fl||n===dl||n===pl||n===ml||n===gl||n===_l||n===xl||n===vl||n===yl||n===bl)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===ll)return o===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===cl)return o===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ul)return o===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===hl)return o===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===fl)return o===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===dl)return o===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===pl)return o===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ml)return o===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===gl)return o===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===_l)return o===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===xl)return o===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===vl)return o===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===yl)return o===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===bl)return o===Jt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===xo||n===Ml||n===Sl)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===xo)return o===Jt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ml)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Sl)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Vh||n===wl||n===El||n===Tl)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===xo)return s.COMPRESSED_RED_RGTC1_EXT;if(n===wl)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===El)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Tl)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===hr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class e0 extends qe{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Hn extends we{constructor(){super(),this.isGroup=!0,this.type="Group"}}const n0={type:"move"};class Xo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Hn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Hn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Hn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],h=u.position.distanceTo(f.position),d=.02,g=.005;c.inputState.pinching&&h>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&h<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=e.getPose(t.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(n0)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Hn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const i0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,r0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class s0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const r=new Fe,s=t.properties.get(r);s.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=r}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new jn({vertexShader:i0,fragmentShader:r0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new It(new pr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}}class o0 extends yi{constructor(t,e){super();const n=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,f=null,h=null,d=null,g=null;const _=new s0,m=e.getContextAttributes();let p=null,v=null;const x=[],y=[],T=new wt;let w=null;const S=new qe;S.layers.enable(1),S.viewport=new te;const P=new qe;P.layers.enable(2),P.viewport=new te;const M=[S,P],b=new e0;b.layers.enable(1),b.layers.enable(2);let C=null,R=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let J=x[q];return J===void 0&&(J=new Xo,x[q]=J),J.getTargetRaySpace()},this.getControllerGrip=function(q){let J=x[q];return J===void 0&&(J=new Xo,x[q]=J),J.getGripSpace()},this.getHand=function(q){let J=x[q];return J===void 0&&(J=new Xo,x[q]=J),J.getHandSpace()};function I(q){const J=y.indexOf(q.inputSource);if(J===-1)return;const ft=x[J];ft!==void 0&&(ft.update(q.inputSource,q.frame,c||o),ft.dispatchEvent({type:q.type,data:q.inputSource}))}function O(){r.removeEventListener("select",I),r.removeEventListener("selectstart",I),r.removeEventListener("selectend",I),r.removeEventListener("squeeze",I),r.removeEventListener("squeezestart",I),r.removeEventListener("squeezeend",I),r.removeEventListener("end",O),r.removeEventListener("inputsourceschange",k);for(let q=0;q<x.length;q++){const J=y[q];J!==null&&(y[q]=null,x[q].disconnect(J))}C=null,R=null,_.reset(),t.setRenderTarget(p),d=null,h=null,f=null,r=null,v=null,Wt.stop(),n.isPresenting=!1,t.setPixelRatio(w),t.setSize(T.width,T.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){s=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){a=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return h!==null?h:d},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(q){if(r=q,r!==null){if(p=t.getRenderTarget(),r.addEventListener("select",I),r.addEventListener("selectstart",I),r.addEventListener("selectend",I),r.addEventListener("squeeze",I),r.addEventListener("squeezestart",I),r.addEventListener("squeezeend",I),r.addEventListener("end",O),r.addEventListener("inputsourceschange",k),m.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(T),r.renderState.layers===void 0){const J={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(r,e,J),r.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),v=new di(d.framebufferWidth,d.framebufferHeight,{format:Je,type:qn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let J=null,ft=null,rt=null;m.depth&&(rt=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,J=m.stencil?fr:sr,ft=m.stencil?hr:ur);const Pt={colorFormat:e.RGBA8,depthFormat:rt,scaleFactor:s};f=new XRWebGLBinding(r,e),h=f.createProjectionLayer(Pt),r.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),v=new di(h.textureWidth,h.textureHeight,{format:Je,type:qn,depthTexture:new Pu(h.textureWidth,h.textureHeight,ft,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),Wt.setContext(r),Wt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode};function k(q){for(let J=0;J<q.removed.length;J++){const ft=q.removed[J],rt=y.indexOf(ft);rt>=0&&(y[rt]=null,x[rt].disconnect(ft))}for(let J=0;J<q.added.length;J++){const ft=q.added[J];let rt=y.indexOf(ft);if(rt===-1){for(let Et=0;Et<x.length;Et++)if(Et>=y.length){y.push(ft),rt=Et;break}else if(y[Et]===null){y[Et]=ft,rt=Et;break}if(rt===-1)break}const Pt=x[rt];Pt&&Pt.connect(ft)}}const z=new L,j=new L;function W(q,J,ft){z.setFromMatrixPosition(J.matrixWorld),j.setFromMatrixPosition(ft.matrixWorld);const rt=z.distanceTo(j),Pt=J.projectionMatrix.elements,Et=ft.projectionMatrix.elements,zt=Pt[14]/(Pt[10]-1),N=Pt[14]/(Pt[10]+1),Ut=(Pt[9]+1)/Pt[5],Ht=(Pt[9]-1)/Pt[5],ee=(Pt[8]-1)/Pt[0],vt=(Et[8]+1)/Et[0],Vt=zt*ee,Ot=zt*vt,Tt=rt/(-ee+vt),le=Tt*-ee;J.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(le),q.translateZ(Tt),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert();const D=zt+Tt,E=N+Tt,V=Vt-le,$=Ot+(rt-le),K=Ut*N/E*D,Z=Ht*N/E*D;q.projectionMatrix.makePerspective(V,$,K,Z,D,E),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}function lt(q,J){J===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(J.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(r===null)return;_.texture!==null&&(q.near=_.depthNear,q.far=_.depthFar),b.near=P.near=S.near=q.near,b.far=P.far=S.far=q.far,(C!==b.near||R!==b.far)&&(r.updateRenderState({depthNear:b.near,depthFar:b.far}),C=b.near,R=b.far,S.near=C,S.far=R,P.near=C,P.far=R,S.updateProjectionMatrix(),P.updateProjectionMatrix(),q.updateProjectionMatrix());const J=q.parent,ft=b.cameras;lt(b,J);for(let rt=0;rt<ft.length;rt++)lt(ft[rt],J);ft.length===2?W(b,S,P):b.projectionMatrix.copy(S.projectionMatrix),ht(q,b,J)};function ht(q,J,ft){ft===null?q.matrix.copy(J.matrixWorld):(q.matrix.copy(ft.matrixWorld),q.matrix.invert(),q.matrix.multiply(J.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(J.projectionMatrix),q.projectionMatrixInverse.copy(J.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=_a*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(h===null&&d===null))return l},this.setFoveation=function(q){l=q,h!==null&&(h.fixedFoveation=q),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=q)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(b)};let nt=null;function Dt(q,J){if(u=J.getViewerPose(c||o),g=J,u!==null){const ft=u.views;d!==null&&(t.setRenderTargetFramebuffer(v,d.framebuffer),t.setRenderTarget(v));let rt=!1;ft.length!==b.cameras.length&&(b.cameras.length=0,rt=!0);for(let Et=0;Et<ft.length;Et++){const zt=ft[Et];let N=null;if(d!==null)N=d.getViewport(zt);else{const Ht=f.getViewSubImage(h,zt);N=Ht.viewport,Et===0&&(t.setRenderTargetTextures(v,Ht.colorTexture,h.ignoreDepthValues?void 0:Ht.depthStencilTexture),t.setRenderTarget(v))}let Ut=M[Et];Ut===void 0&&(Ut=new qe,Ut.layers.enable(Et),Ut.viewport=new te,M[Et]=Ut),Ut.matrix.fromArray(zt.transform.matrix),Ut.matrix.decompose(Ut.position,Ut.quaternion,Ut.scale),Ut.projectionMatrix.fromArray(zt.projectionMatrix),Ut.projectionMatrixInverse.copy(Ut.projectionMatrix).invert(),Ut.viewport.set(N.x,N.y,N.width,N.height),Et===0&&(b.matrix.copy(Ut.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),rt===!0&&b.cameras.push(Ut)}const Pt=r.enabledFeatures;if(Pt&&Pt.includes("depth-sensing")){const Et=f.getDepthInformation(ft[0]);Et&&Et.isValid&&Et.texture&&_.init(t,Et,r.renderState)}}for(let ft=0;ft<x.length;ft++){const rt=y[ft],Pt=x[ft];rt!==null&&Pt!==void 0&&Pt.update(rt,J,c||o)}nt&&nt(q,J),J.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:J}),g=null}const Wt=new Au;Wt.setAnimationLoop(Dt),this.setAnimationLoop=function(q){nt=q},this.dispose=function(){}}}const ii=new je,a0=new Bt;function l0(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,wu(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,v,x,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),f(m,p)):p.isMeshPhongMaterial?(s(m,p),u(m,p)):p.isMeshStandardMaterial?(s(m,p),h(m,p),p.isMeshPhysicalMaterial&&d(m,p,y)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),_(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,v,x):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Be&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Be&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const v=t.get(p),x=v.envMap,y=v.envMapRotation;x&&(m.envMap.value=x,ii.copy(y),ii.x*=-1,ii.y*=-1,ii.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(ii.y*=-1,ii.z*=-1),m.envMapRotation.value.setFromMatrix4(a0.makeRotationFromEuler(ii)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,v,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*v,m.scale.value=x*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,v){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Be&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const v=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function c0(i,t,e,n){let r={},s={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,x){const y=x.program;n.uniformBlockBinding(v,y)}function c(v,x){let y=r[v.id];y===void 0&&(g(v),y=u(v),r[v.id]=y,v.addEventListener("dispose",m));const T=x.program;n.updateUBOMapping(v,T);const w=t.render.frame;s[v.id]!==w&&(h(v),s[v.id]=w)}function u(v){const x=f();v.__bindingPointIndex=x;const y=i.createBuffer(),T=v.__size,w=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,T,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,y),y}function f(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(v){const x=r[v.id],y=v.uniforms,T=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let w=0,S=y.length;w<S;w++){const P=Array.isArray(y[w])?y[w]:[y[w]];for(let M=0,b=P.length;M<b;M++){const C=P[M];if(d(C,w,M,T)===!0){const R=C.__offset,I=Array.isArray(C.value)?C.value:[C.value];let O=0;for(let k=0;k<I.length;k++){const z=I[k],j=_(z);typeof z=="number"||typeof z=="boolean"?(C.__data[0]=z,i.bufferSubData(i.UNIFORM_BUFFER,R+O,C.__data)):z.isMatrix3?(C.__data[0]=z.elements[0],C.__data[1]=z.elements[1],C.__data[2]=z.elements[2],C.__data[3]=0,C.__data[4]=z.elements[3],C.__data[5]=z.elements[4],C.__data[6]=z.elements[5],C.__data[7]=0,C.__data[8]=z.elements[6],C.__data[9]=z.elements[7],C.__data[10]=z.elements[8],C.__data[11]=0):(z.toArray(C.__data,O),O+=j.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,R,C.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(v,x,y,T){const w=v.value,S=x+"_"+y;if(T[S]===void 0)return typeof w=="number"||typeof w=="boolean"?T[S]=w:T[S]=w.clone(),!0;{const P=T[S];if(typeof w=="number"||typeof w=="boolean"){if(P!==w)return T[S]=w,!0}else if(P.equals(w)===!1)return P.copy(w),!0}return!1}function g(v){const x=v.uniforms;let y=0;const T=16;for(let S=0,P=x.length;S<P;S++){const M=Array.isArray(x[S])?x[S]:[x[S]];for(let b=0,C=M.length;b<C;b++){const R=M[b],I=Array.isArray(R.value)?R.value:[R.value];for(let O=0,k=I.length;O<k;O++){const z=I[O],j=_(z),W=y%T;W!==0&&T-W<j.boundary&&(y+=T-W),R.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),R.__offset=y,y+=j.storage}}}const w=y%T;return w>0&&(y+=T-w),v.__size=y,v.__cache={},this}function _(v){const x={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(x.boundary=4,x.storage=4):v.isVector2?(x.boundary=8,x.storage=8):v.isVector3||v.isColor?(x.boundary=16,x.storage=12):v.isVector4?(x.boundary=16,x.storage=16):v.isMatrix3?(x.boundary=48,x.storage=48):v.isMatrix4?(x.boundary=64,x.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),x}function m(v){const x=v.target;x.removeEventListener("dispose",m);const y=o.indexOf(x.__bindingPointIndex);o.splice(y,1),i.deleteBuffer(r[x.id]),delete r[x.id],delete s[x.id]}function p(){for(const v in r)i.deleteBuffer(r[v]);o=[],r={},s={}}return{bind:l,update:c,dispose:p}}class u0{constructor(t={}){const{canvas:e=ef(),context:n=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1}=t;this.isWebGLRenderer=!0;let h;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");h=n.getContextAttributes().alpha}else h=o;const d=new Uint32Array(4),g=new Int32Array(4);let _=null,m=null;const p=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=un,this.toneMapping=Wn,this.toneMappingExposure=1;const x=this;let y=!1,T=0,w=0,S=null,P=-1,M=null;const b=new te,C=new te;let R=null;const I=new kt(0);let O=0,k=e.width,z=e.height,j=1,W=null,lt=null;const ht=new te(0,0,k,z),nt=new te(0,0,k,z);let Dt=!1;const Wt=new io;let q=!1,J=!1;const ft=new Bt,rt=new L,Pt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Et=!1;function zt(){return S===null?j:1}let N=n;function Ut(A,B){return e.getContext(A,B)}try{const A={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Br}`),e.addEventListener("webglcontextlost",ct,!1),e.addEventListener("webglcontextrestored",X,!1),e.addEventListener("webglcontextcreationerror",Y,!1),N===null){const B="webgl2";if(N=Ut(B,A),N===null)throw Ut(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let Ht,ee,vt,Vt,Ot,Tt,le,D,E,V,$,K,Z,_t,st,ot,Rt,Q,mt,Ft,Mt,at,Lt,Gt;function oe(){Ht=new xm(N),Ht.init(),at=new t0(N,Ht),ee=new fm(N,Ht,t,at),vt=new Jg(N),Vt=new bm(N),Ot=new Fg,Tt=new Qg(N,Ht,vt,Ot,ee,at,Vt),le=new pm(x),D=new _m(x),E=new Cf(N),Lt=new um(N,E),V=new vm(N,E,Vt,Lt),$=new Sm(N,V,E,Vt),mt=new Mm(N,ee,Tt),ot=new dm(Ot),K=new Bg(x,le,D,Ht,ee,Lt,ot),Z=new l0(x,Ot),_t=new zg,st=new qg(Ht),Q=new cm(x,le,D,vt,$,h,l),Rt=new Zg(x,$,ee),Gt=new c0(N,Vt,ee,vt),Ft=new hm(N,Ht,Vt),Mt=new ym(N,Ht,Vt),Vt.programs=K.programs,x.capabilities=ee,x.extensions=Ht,x.properties=Ot,x.renderLists=_t,x.shadowMap=Rt,x.state=vt,x.info=Vt}oe();const U=new o0(x,N);this.xr=U,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const A=Ht.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=Ht.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return j},this.setPixelRatio=function(A){A!==void 0&&(j=A,this.setSize(k,z,!1))},this.getSize=function(A){return A.set(k,z)},this.setSize=function(A,B,H=!0){if(U.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=A,z=B,e.width=Math.floor(A*j),e.height=Math.floor(B*j),H===!0&&(e.style.width=A+"px",e.style.height=B+"px"),this.setViewport(0,0,A,B)},this.getDrawingBufferSize=function(A){return A.set(k*j,z*j).floor()},this.setDrawingBufferSize=function(A,B,H){k=A,z=B,j=H,e.width=Math.floor(A*H),e.height=Math.floor(B*H),this.setViewport(0,0,A,B)},this.getCurrentViewport=function(A){return A.copy(b)},this.getViewport=function(A){return A.copy(ht)},this.setViewport=function(A,B,H,G){A.isVector4?ht.set(A.x,A.y,A.z,A.w):ht.set(A,B,H,G),vt.viewport(b.copy(ht).multiplyScalar(j).round())},this.getScissor=function(A){return A.copy(nt)},this.setScissor=function(A,B,H,G){A.isVector4?nt.set(A.x,A.y,A.z,A.w):nt.set(A,B,H,G),vt.scissor(C.copy(nt).multiplyScalar(j).round())},this.getScissorTest=function(){return Dt},this.setScissorTest=function(A){vt.setScissorTest(Dt=A)},this.setOpaqueSort=function(A){W=A},this.setTransparentSort=function(A){lt=A},this.getClearColor=function(A){return A.copy(Q.getClearColor())},this.setClearColor=function(){Q.setClearColor.apply(Q,arguments)},this.getClearAlpha=function(){return Q.getClearAlpha()},this.setClearAlpha=function(){Q.setClearAlpha.apply(Q,arguments)},this.clear=function(A=!0,B=!0,H=!0){let G=0;if(A){let F=!1;if(S!==null){const tt=S.texture.format;F=tt===pu||tt===du||tt===fu}if(F){const tt=S.texture.type,ut=tt===qn||tt===ur||tt===Vs||tt===hr||tt===uu||tt===hu,dt=Q.getClearColor(),pt=Q.getClearAlpha(),yt=dt.r,bt=dt.g,xt=dt.b;ut?(d[0]=yt,d[1]=bt,d[2]=xt,d[3]=pt,N.clearBufferuiv(N.COLOR,0,d)):(g[0]=yt,g[1]=bt,g[2]=xt,g[3]=pt,N.clearBufferiv(N.COLOR,0,g))}else G|=N.COLOR_BUFFER_BIT}B&&(G|=N.DEPTH_BUFFER_BIT),H&&(G|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ct,!1),e.removeEventListener("webglcontextrestored",X,!1),e.removeEventListener("webglcontextcreationerror",Y,!1),_t.dispose(),st.dispose(),Ot.dispose(),le.dispose(),D.dispose(),$.dispose(),Lt.dispose(),Gt.dispose(),K.dispose(),U.dispose(),U.removeEventListener("sessionstart",ln),U.removeEventListener("sessionend",cn),Kn.stop()};function ct(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function X(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const A=Vt.autoReset,B=Rt.enabled,H=Rt.autoUpdate,G=Rt.needsUpdate,F=Rt.type;oe(),Vt.autoReset=A,Rt.enabled=B,Rt.autoUpdate=H,Rt.needsUpdate=G,Rt.type=F}function Y(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function et(A){const B=A.target;B.removeEventListener("dispose",et),St(B)}function St(A){Xt(A),Ot.remove(A)}function Xt(A){const B=Ot.get(A).programs;B!==void 0&&(B.forEach(function(H){K.releaseProgram(H)}),A.isShaderMaterial&&K.releaseShaderCache(A))}this.renderBufferDirect=function(A,B,H,G,F,tt){B===null&&(B=Pt);const ut=F.isMesh&&F.matrixWorld.determinant()<0,dt=Yu(A,B,H,G,F);vt.setMaterial(G,ut);let pt=H.index,yt=1;if(G.wireframe===!0){if(pt=V.getWireframeAttribute(H),pt===void 0)return;yt=2}const bt=H.drawRange,xt=H.attributes.position;let qt=bt.start*yt,ie=(bt.start+bt.count)*yt;tt!==null&&(qt=Math.max(qt,tt.start*yt),ie=Math.min(ie,(tt.start+tt.count)*yt)),pt!==null?(qt=Math.max(qt,0),ie=Math.min(ie,pt.count)):xt!=null&&(qt=Math.max(qt,0),ie=Math.min(ie,xt.count));const re=ie-qt;if(re<0||re===1/0)return;Lt.setup(F,G,dt,H,pt);let Ve,$t=Ft;if(pt!==null&&(Ve=E.get(pt),$t=Mt,$t.setIndex(Ve)),F.isMesh)G.wireframe===!0?(vt.setLineWidth(G.wireframeLinewidth*zt()),$t.setMode(N.LINES)):$t.setMode(N.TRIANGLES);else if(F.isLine){let gt=G.linewidth;gt===void 0&&(gt=1),vt.setLineWidth(gt*zt()),F.isLineSegments?$t.setMode(N.LINES):F.isLineLoop?$t.setMode(N.LINE_LOOP):$t.setMode(N.LINE_STRIP)}else F.isPoints?$t.setMode(N.POINTS):F.isSprite&&$t.setMode(N.TRIANGLES);if(F.isBatchedMesh)F._multiDrawInstances!==null?$t.renderMultiDrawInstances(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount,F._multiDrawInstances):$t.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else if(F.isInstancedMesh)$t.renderInstances(qt,re,F.count);else if(H.isInstancedBufferGeometry){const gt=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,De=Math.min(H.instanceCount,gt);$t.renderInstances(qt,re,De)}else $t.render(qt,re)};function ae(A,B,H){A.transparent===!0&&A.side===Ze&&A.forceSinglePass===!1?(A.side=Be,A.needsUpdate=!0,Hr(A,B,H),A.side=on,A.needsUpdate=!0,Hr(A,B,H),A.side=Ze):Hr(A,B,H)}this.compile=function(A,B,H=null){H===null&&(H=A),m=st.get(H),m.init(B),v.push(m),H.traverseVisible(function(F){F.isLight&&F.layers.test(B.layers)&&(m.pushLight(F),F.castShadow&&m.pushShadow(F))}),A!==H&&A.traverseVisible(function(F){F.isLight&&F.layers.test(B.layers)&&(m.pushLight(F),F.castShadow&&m.pushShadow(F))}),m.setupLights();const G=new Set;return A.traverse(function(F){const tt=F.material;if(tt)if(Array.isArray(tt))for(let ut=0;ut<tt.length;ut++){const dt=tt[ut];ae(dt,H,F),G.add(dt)}else ae(tt,H,F),G.add(tt)}),v.pop(),m=null,G},this.compileAsync=function(A,B,H=null){const G=this.compile(A,B,H);return new Promise(F=>{function tt(){if(G.forEach(function(ut){Ot.get(ut).currentProgram.isReady()&&G.delete(ut)}),G.size===0){F(A);return}setTimeout(tt,10)}Ht.get("KHR_parallel_shader_compile")!==null?tt():setTimeout(tt,10)})};let xe=null;function Kt(A){xe&&xe(A)}function ln(){Kn.stop()}function cn(){Kn.start()}const Kn=new Au;Kn.setAnimationLoop(Kt),typeof self<"u"&&Kn.setContext(self),this.setAnimationLoop=function(A){xe=A,U.setAnimationLoop(A),A===null?Kn.stop():Kn.start()},U.addEventListener("sessionstart",ln),U.addEventListener("sessionend",cn),this.render=function(A,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),U.enabled===!0&&U.isPresenting===!0&&(U.cameraAutoUpdate===!0&&U.updateCamera(B),B=U.getCamera()),A.isScene===!0&&A.onBeforeRender(x,A,B,S),m=st.get(A,v.length),m.init(B),v.push(m),ft.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),Wt.setFromProjectionMatrix(ft),J=this.localClippingEnabled,q=ot.init(this.clippingPlanes,J),_=_t.get(A,p.length),_.init(),p.push(_),U.enabled===!0&&U.isPresenting===!0){const tt=x.xr.getDepthSensingMesh();tt!==null&&lo(tt,B,-1/0,x.sortObjects)}lo(A,B,0,x.sortObjects),_.finish(),x.sortObjects===!0&&_.sort(W,lt),Et=U.enabled===!1||U.isPresenting===!1||U.hasDepthSensing()===!1,Et&&Q.addToRenderList(_,A),this.info.render.frame++,q===!0&&ot.beginShadows();const H=m.state.shadowsArray;Rt.render(H,A,B),q===!0&&ot.endShadows(),this.info.autoReset===!0&&this.info.reset();const G=_.opaque,F=_.transmissive;if(m.setupLights(),B.isArrayCamera){const tt=B.cameras;if(F.length>0)for(let ut=0,dt=tt.length;ut<dt;ut++){const pt=tt[ut];qa(G,F,A,pt)}Et&&Q.render(A);for(let ut=0,dt=tt.length;ut<dt;ut++){const pt=tt[ut];Xa(_,A,pt,pt.viewport)}}else F.length>0&&qa(G,F,A,B),Et&&Q.render(A),Xa(_,A,B);S!==null&&(Tt.updateMultisampleRenderTarget(S),Tt.updateRenderTargetMipmap(S)),A.isScene===!0&&A.onAfterRender(x,A,B),Lt.resetDefaultState(),P=-1,M=null,v.pop(),v.length>0?(m=v[v.length-1],q===!0&&ot.setGlobalState(x.clippingPlanes,m.state.camera)):m=null,p.pop(),p.length>0?_=p[p.length-1]:_=null};function lo(A,B,H,G){if(A.visible===!1)return;if(A.layers.test(B.layers)){if(A.isGroup)H=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(B);else if(A.isLight)m.pushLight(A),A.castShadow&&m.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||Wt.intersectsSprite(A)){G&&rt.setFromMatrixPosition(A.matrixWorld).applyMatrix4(ft);const ut=$.update(A),dt=A.material;dt.visible&&_.push(A,ut,dt,H,rt.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||Wt.intersectsObject(A))){const ut=$.update(A),dt=A.material;if(G&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),rt.copy(A.boundingSphere.center)):(ut.boundingSphere===null&&ut.computeBoundingSphere(),rt.copy(ut.boundingSphere.center)),rt.applyMatrix4(A.matrixWorld).applyMatrix4(ft)),Array.isArray(dt)){const pt=ut.groups;for(let yt=0,bt=pt.length;yt<bt;yt++){const xt=pt[yt],qt=dt[xt.materialIndex];qt&&qt.visible&&_.push(A,ut,qt,H,rt.z,xt)}}else dt.visible&&_.push(A,ut,dt,H,rt.z,null)}}const tt=A.children;for(let ut=0,dt=tt.length;ut<dt;ut++)lo(tt[ut],B,H,G)}function Xa(A,B,H,G){const F=A.opaque,tt=A.transmissive,ut=A.transparent;m.setupLightsView(H),q===!0&&ot.setGlobalState(x.clippingPlanes,H),G&&vt.viewport(b.copy(G)),F.length>0&&zr(F,B,H),tt.length>0&&zr(tt,B,H),ut.length>0&&zr(ut,B,H),vt.buffers.depth.setTest(!0),vt.buffers.depth.setMask(!0),vt.buffers.color.setMask(!0),vt.setPolygonOffset(!1)}function qa(A,B,H,G){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[G.id]===void 0&&(m.state.transmissionRenderTarget[G.id]=new di(1,1,{generateMipmaps:!0,type:Ht.has("EXT_color_buffer_half_float")||Ht.has("EXT_color_buffer_float")?eo:qn,minFilter:fi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Yt.workingColorSpace}));const tt=m.state.transmissionRenderTarget[G.id],ut=G.viewport||b;tt.setSize(ut.z,ut.w);const dt=x.getRenderTarget();x.setRenderTarget(tt),x.getClearColor(I),O=x.getClearAlpha(),O<1&&x.setClearColor(16777215,.5),Et?Q.render(H):x.clear();const pt=x.toneMapping;x.toneMapping=Wn;const yt=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),m.setupLightsView(G),q===!0&&ot.setGlobalState(x.clippingPlanes,G),zr(A,H,G),Tt.updateMultisampleRenderTarget(tt),Tt.updateRenderTargetMipmap(tt),Ht.has("WEBGL_multisampled_render_to_texture")===!1){let bt=!1;for(let xt=0,qt=B.length;xt<qt;xt++){const ie=B[xt],re=ie.object,Ve=ie.geometry,$t=ie.material,gt=ie.group;if($t.side===Ze&&re.layers.test(G.layers)){const De=$t.side;$t.side=Be,$t.needsUpdate=!0,ja(re,H,G,Ve,$t,gt),$t.side=De,$t.needsUpdate=!0,bt=!0}}bt===!0&&(Tt.updateMultisampleRenderTarget(tt),Tt.updateRenderTargetMipmap(tt))}x.setRenderTarget(dt),x.setClearColor(I,O),yt!==void 0&&(G.viewport=yt),x.toneMapping=pt}function zr(A,B,H){const G=B.isScene===!0?B.overrideMaterial:null;for(let F=0,tt=A.length;F<tt;F++){const ut=A[F],dt=ut.object,pt=ut.geometry,yt=G===null?ut.material:G,bt=ut.group;dt.layers.test(H.layers)&&ja(dt,B,H,pt,yt,bt)}}function ja(A,B,H,G,F,tt){A.onBeforeRender(x,B,H,G,F,tt),A.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),F.onBeforeRender(x,B,H,G,A,tt),F.transparent===!0&&F.side===Ze&&F.forceSinglePass===!1?(F.side=Be,F.needsUpdate=!0,x.renderBufferDirect(H,B,G,F,A,tt),F.side=on,F.needsUpdate=!0,x.renderBufferDirect(H,B,G,F,A,tt),F.side=Ze):x.renderBufferDirect(H,B,G,F,A,tt),A.onAfterRender(x,B,H,G,F,tt)}function Hr(A,B,H){B.isScene!==!0&&(B=Pt);const G=Ot.get(A),F=m.state.lights,tt=m.state.shadowsArray,ut=F.state.version,dt=K.getParameters(A,F.state,tt,B,H),pt=K.getProgramCacheKey(dt);let yt=G.programs;G.environment=A.isMeshStandardMaterial?B.environment:null,G.fog=B.fog,G.envMap=(A.isMeshStandardMaterial?D:le).get(A.envMap||G.environment),G.envMapRotation=G.environment!==null&&A.envMap===null?B.environmentRotation:A.envMapRotation,yt===void 0&&(A.addEventListener("dispose",et),yt=new Map,G.programs=yt);let bt=yt.get(pt);if(bt!==void 0){if(G.currentProgram===bt&&G.lightsStateVersion===ut)return $a(A,dt),bt}else dt.uniforms=K.getUniforms(A),A.onBuild(H,dt,x),A.onBeforeCompile(dt,x),bt=K.acquireProgram(dt,pt),yt.set(pt,bt),G.uniforms=dt.uniforms;const xt=G.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(xt.clippingPlanes=ot.uniform),$a(A,dt),G.needsLights=Ku(A),G.lightsStateVersion=ut,G.needsLights&&(xt.ambientLightColor.value=F.state.ambient,xt.lightProbe.value=F.state.probe,xt.directionalLights.value=F.state.directional,xt.directionalLightShadows.value=F.state.directionalShadow,xt.spotLights.value=F.state.spot,xt.spotLightShadows.value=F.state.spotShadow,xt.rectAreaLights.value=F.state.rectArea,xt.ltc_1.value=F.state.rectAreaLTC1,xt.ltc_2.value=F.state.rectAreaLTC2,xt.pointLights.value=F.state.point,xt.pointLightShadows.value=F.state.pointShadow,xt.hemisphereLights.value=F.state.hemi,xt.directionalShadowMap.value=F.state.directionalShadowMap,xt.directionalShadowMatrix.value=F.state.directionalShadowMatrix,xt.spotShadowMap.value=F.state.spotShadowMap,xt.spotLightMatrix.value=F.state.spotLightMatrix,xt.spotLightMap.value=F.state.spotLightMap,xt.pointShadowMap.value=F.state.pointShadowMap,xt.pointShadowMatrix.value=F.state.pointShadowMatrix),G.currentProgram=bt,G.uniformsList=null,bt}function Ya(A){if(A.uniformsList===null){const B=A.currentProgram.getUniforms();A.uniformsList=Fs.seqWithValue(B.seq,A.uniforms)}return A.uniformsList}function $a(A,B){const H=Ot.get(A);H.outputColorSpace=B.outputColorSpace,H.batching=B.batching,H.batchingColor=B.batchingColor,H.instancing=B.instancing,H.instancingColor=B.instancingColor,H.instancingMorph=B.instancingMorph,H.skinning=B.skinning,H.morphTargets=B.morphTargets,H.morphNormals=B.morphNormals,H.morphColors=B.morphColors,H.morphTargetsCount=B.morphTargetsCount,H.numClippingPlanes=B.numClippingPlanes,H.numIntersection=B.numClipIntersection,H.vertexAlphas=B.vertexAlphas,H.vertexTangents=B.vertexTangents,H.toneMapping=B.toneMapping}function Yu(A,B,H,G,F){B.isScene!==!0&&(B=Pt),Tt.resetTextureUnits();const tt=B.fog,ut=G.isMeshStandardMaterial?B.environment:null,dt=S===null?x.outputColorSpace:S.isXRRenderTarget===!0?S.texture.colorSpace:$n,pt=(G.isMeshStandardMaterial?D:le).get(G.envMap||ut),yt=G.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,bt=!!H.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),xt=!!H.morphAttributes.position,qt=!!H.morphAttributes.normal,ie=!!H.morphAttributes.color;let re=Wn;G.toneMapped&&(S===null||S.isXRRenderTarget===!0)&&(re=x.toneMapping);const Ve=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,$t=Ve!==void 0?Ve.length:0,gt=Ot.get(G),De=m.state.lights;if(q===!0&&(J===!0||A!==M)){const Ye=A===M&&G.id===P;ot.setState(G,A,Ye)}let Zt=!1;G.version===gt.__version?(gt.needsLights&&gt.lightsStateVersion!==De.state.version||gt.outputColorSpace!==dt||F.isBatchedMesh&&gt.batching===!1||!F.isBatchedMesh&&gt.batching===!0||F.isBatchedMesh&&gt.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&gt.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&gt.instancing===!1||!F.isInstancedMesh&&gt.instancing===!0||F.isSkinnedMesh&&gt.skinning===!1||!F.isSkinnedMesh&&gt.skinning===!0||F.isInstancedMesh&&gt.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&gt.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&gt.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&gt.instancingMorph===!1&&F.morphTexture!==null||gt.envMap!==pt||G.fog===!0&&gt.fog!==tt||gt.numClippingPlanes!==void 0&&(gt.numClippingPlanes!==ot.numPlanes||gt.numIntersection!==ot.numIntersection)||gt.vertexAlphas!==yt||gt.vertexTangents!==bt||gt.morphTargets!==xt||gt.morphNormals!==qt||gt.morphColors!==ie||gt.toneMapping!==re||gt.morphTargetsCount!==$t)&&(Zt=!0):(Zt=!0,gt.__version=G.version);let mn=gt.currentProgram;Zt===!0&&(mn=Hr(G,B,F));let Gr=!1,Zn=!1,co=!1;const ve=mn.getUniforms(),Pn=gt.uniforms;if(vt.useProgram(mn.program)&&(Gr=!0,Zn=!0,co=!0),G.id!==P&&(P=G.id,Zn=!0),Gr||M!==A){ve.setValue(N,"projectionMatrix",A.projectionMatrix),ve.setValue(N,"viewMatrix",A.matrixWorldInverse);const Ye=ve.map.cameraPosition;Ye!==void 0&&Ye.setValue(N,rt.setFromMatrixPosition(A.matrixWorld)),ee.logarithmicDepthBuffer&&ve.setValue(N,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&ve.setValue(N,"isOrthographic",A.isOrthographicCamera===!0),M!==A&&(M=A,Zn=!0,co=!0)}if(F.isSkinnedMesh){ve.setOptional(N,F,"bindMatrix"),ve.setOptional(N,F,"bindMatrixInverse");const Ye=F.skeleton;Ye&&(Ye.boneTexture===null&&Ye.computeBoneTexture(),ve.setValue(N,"boneTexture",Ye.boneTexture,Tt))}F.isBatchedMesh&&(ve.setOptional(N,F,"batchingTexture"),ve.setValue(N,"batchingTexture",F._matricesTexture,Tt),ve.setOptional(N,F,"batchingColorTexture"),F._colorsTexture!==null&&ve.setValue(N,"batchingColorTexture",F._colorsTexture,Tt));const uo=H.morphAttributes;if((uo.position!==void 0||uo.normal!==void 0||uo.color!==void 0)&&mt.update(F,H,mn),(Zn||gt.receiveShadow!==F.receiveShadow)&&(gt.receiveShadow=F.receiveShadow,ve.setValue(N,"receiveShadow",F.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(Pn.envMap.value=pt,Pn.flipEnvMap.value=pt.isCubeTexture&&pt.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&B.environment!==null&&(Pn.envMapIntensity.value=B.environmentIntensity),Zn&&(ve.setValue(N,"toneMappingExposure",x.toneMappingExposure),gt.needsLights&&$u(Pn,co),tt&&G.fog===!0&&Z.refreshFogUniforms(Pn,tt),Z.refreshMaterialUniforms(Pn,G,j,z,m.state.transmissionRenderTarget[A.id]),Fs.upload(N,Ya(gt),Pn,Tt)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Fs.upload(N,Ya(gt),Pn,Tt),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&ve.setValue(N,"center",F.center),ve.setValue(N,"modelViewMatrix",F.modelViewMatrix),ve.setValue(N,"normalMatrix",F.normalMatrix),ve.setValue(N,"modelMatrix",F.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const Ye=G.uniformsGroups;for(let ho=0,Zu=Ye.length;ho<Zu;ho++){const Ka=Ye[ho];Gt.update(Ka,mn),Gt.bind(Ka,mn)}}return mn}function $u(A,B){A.ambientLightColor.needsUpdate=B,A.lightProbe.needsUpdate=B,A.directionalLights.needsUpdate=B,A.directionalLightShadows.needsUpdate=B,A.pointLights.needsUpdate=B,A.pointLightShadows.needsUpdate=B,A.spotLights.needsUpdate=B,A.spotLightShadows.needsUpdate=B,A.rectAreaLights.needsUpdate=B,A.hemisphereLights.needsUpdate=B}function Ku(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return S},this.setRenderTargetTextures=function(A,B,H){Ot.get(A.texture).__webglTexture=B,Ot.get(A.depthTexture).__webglTexture=H;const G=Ot.get(A);G.__hasExternalTextures=!0,G.__autoAllocateDepthBuffer=H===void 0,G.__autoAllocateDepthBuffer||Ht.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),G.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(A,B){const H=Ot.get(A);H.__webglFramebuffer=B,H.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(A,B=0,H=0){S=A,T=B,w=H;let G=!0,F=null,tt=!1,ut=!1;if(A){const pt=Ot.get(A);pt.__useDefaultFramebuffer!==void 0?(vt.bindFramebuffer(N.FRAMEBUFFER,null),G=!1):pt.__webglFramebuffer===void 0?Tt.setupRenderTarget(A):pt.__hasExternalTextures&&Tt.rebindTextures(A,Ot.get(A.texture).__webglTexture,Ot.get(A.depthTexture).__webglTexture);const yt=A.texture;(yt.isData3DTexture||yt.isDataArrayTexture||yt.isCompressedArrayTexture)&&(ut=!0);const bt=Ot.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(bt[B])?F=bt[B][H]:F=bt[B],tt=!0):A.samples>0&&Tt.useMultisampledRTT(A)===!1?F=Ot.get(A).__webglMultisampledFramebuffer:Array.isArray(bt)?F=bt[H]:F=bt,b.copy(A.viewport),C.copy(A.scissor),R=A.scissorTest}else b.copy(ht).multiplyScalar(j).floor(),C.copy(nt).multiplyScalar(j).floor(),R=Dt;if(vt.bindFramebuffer(N.FRAMEBUFFER,F)&&G&&vt.drawBuffers(A,F),vt.viewport(b),vt.scissor(C),vt.setScissorTest(R),tt){const pt=Ot.get(A.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+B,pt.__webglTexture,H)}else if(ut){const pt=Ot.get(A.texture),yt=B||0;N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,pt.__webglTexture,H||0,yt)}P=-1},this.readRenderTargetPixels=function(A,B,H,G,F,tt,ut){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let dt=Ot.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&ut!==void 0&&(dt=dt[ut]),dt){vt.bindFramebuffer(N.FRAMEBUFFER,dt);try{const pt=A.texture,yt=pt.format,bt=pt.type;if(!ee.textureFormatReadable(yt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ee.textureTypeReadable(bt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=A.width-G&&H>=0&&H<=A.height-F&&N.readPixels(B,H,G,F,at.convert(yt),at.convert(bt),tt)}finally{const pt=S!==null?Ot.get(S).__webglFramebuffer:null;vt.bindFramebuffer(N.FRAMEBUFFER,pt)}}},this.readRenderTargetPixelsAsync=async function(A,B,H,G,F,tt,ut){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let dt=Ot.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&ut!==void 0&&(dt=dt[ut]),dt){vt.bindFramebuffer(N.FRAMEBUFFER,dt);try{const pt=A.texture,yt=pt.format,bt=pt.type;if(!ee.textureFormatReadable(yt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ee.textureTypeReadable(bt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(B>=0&&B<=A.width-G&&H>=0&&H<=A.height-F){const xt=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,xt),N.bufferData(N.PIXEL_PACK_BUFFER,tt.byteLength,N.STREAM_READ),N.readPixels(B,H,G,F,at.convert(yt),at.convert(bt),0),N.flush();const qt=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);await nf(N,qt,4);try{N.bindBuffer(N.PIXEL_PACK_BUFFER,xt),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,tt)}finally{N.deleteBuffer(xt),N.deleteSync(qt)}return tt}}finally{const pt=S!==null?Ot.get(S).__webglFramebuffer:null;vt.bindFramebuffer(N.FRAMEBUFFER,pt)}}},this.copyFramebufferToTexture=function(A,B=null,H=0){A.isTexture!==!0&&(console.warn("WebGLRenderer: copyFramebufferToTexture function signature has changed."),B=arguments[0]||null,A=arguments[1]);const G=Math.pow(2,-H),F=Math.floor(A.image.width*G),tt=Math.floor(A.image.height*G),ut=B!==null?B.x:0,dt=B!==null?B.y:0;Tt.setTexture2D(A,0),N.copyTexSubImage2D(N.TEXTURE_2D,H,0,0,ut,dt,F,tt),vt.unbindTexture()},this.copyTextureToTexture=function(A,B,H=null,G=null,F=0){A.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture function signature has changed."),G=arguments[0]||null,A=arguments[1],B=arguments[2],F=arguments[3]||0,H=null);let tt,ut,dt,pt,yt,bt;H!==null?(tt=H.max.x-H.min.x,ut=H.max.y-H.min.y,dt=H.min.x,pt=H.min.y):(tt=A.image.width,ut=A.image.height,dt=0,pt=0),G!==null?(yt=G.x,bt=G.y):(yt=0,bt=0);const xt=at.convert(B.format),qt=at.convert(B.type);Tt.setTexture2D(B,0),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,B.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,B.unpackAlignment);const ie=N.getParameter(N.UNPACK_ROW_LENGTH),re=N.getParameter(N.UNPACK_IMAGE_HEIGHT),Ve=N.getParameter(N.UNPACK_SKIP_PIXELS),$t=N.getParameter(N.UNPACK_SKIP_ROWS),gt=N.getParameter(N.UNPACK_SKIP_IMAGES),De=A.isCompressedTexture?A.mipmaps[F]:A.image;N.pixelStorei(N.UNPACK_ROW_LENGTH,De.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,De.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,dt),N.pixelStorei(N.UNPACK_SKIP_ROWS,pt),A.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,F,yt,bt,tt,ut,xt,qt,De.data):A.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,F,yt,bt,De.width,De.height,xt,De.data):N.texSubImage2D(N.TEXTURE_2D,F,yt,bt,xt,qt,De),N.pixelStorei(N.UNPACK_ROW_LENGTH,ie),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,re),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Ve),N.pixelStorei(N.UNPACK_SKIP_ROWS,$t),N.pixelStorei(N.UNPACK_SKIP_IMAGES,gt),F===0&&B.generateMipmaps&&N.generateMipmap(N.TEXTURE_2D),vt.unbindTexture()},this.copyTextureToTexture3D=function(A,B,H=null,G=null,F=0){A.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture3D function signature has changed."),H=arguments[0]||null,G=arguments[1]||null,A=arguments[2],B=arguments[3],F=arguments[4]||0);let tt,ut,dt,pt,yt,bt,xt,qt,ie;const re=A.isCompressedTexture?A.mipmaps[F]:A.image;H!==null?(tt=H.max.x-H.min.x,ut=H.max.y-H.min.y,dt=H.max.z-H.min.z,pt=H.min.x,yt=H.min.y,bt=H.min.z):(tt=re.width,ut=re.height,dt=re.depth,pt=0,yt=0,bt=0),G!==null?(xt=G.x,qt=G.y,ie=G.z):(xt=0,qt=0,ie=0);const Ve=at.convert(B.format),$t=at.convert(B.type);let gt;if(B.isData3DTexture)Tt.setTexture3D(B,0),gt=N.TEXTURE_3D;else if(B.isDataArrayTexture||B.isCompressedArrayTexture)Tt.setTexture2DArray(B,0),gt=N.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,B.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,B.unpackAlignment);const De=N.getParameter(N.UNPACK_ROW_LENGTH),Zt=N.getParameter(N.UNPACK_IMAGE_HEIGHT),mn=N.getParameter(N.UNPACK_SKIP_PIXELS),Gr=N.getParameter(N.UNPACK_SKIP_ROWS),Zn=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,re.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,re.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,pt),N.pixelStorei(N.UNPACK_SKIP_ROWS,yt),N.pixelStorei(N.UNPACK_SKIP_IMAGES,bt),A.isDataTexture||A.isData3DTexture?N.texSubImage3D(gt,F,xt,qt,ie,tt,ut,dt,Ve,$t,re.data):B.isCompressedArrayTexture?N.compressedTexSubImage3D(gt,F,xt,qt,ie,tt,ut,dt,Ve,re.data):N.texSubImage3D(gt,F,xt,qt,ie,tt,ut,dt,Ve,$t,re),N.pixelStorei(N.UNPACK_ROW_LENGTH,De),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Zt),N.pixelStorei(N.UNPACK_SKIP_PIXELS,mn),N.pixelStorei(N.UNPACK_SKIP_ROWS,Gr),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Zn),F===0&&B.generateMipmaps&&N.generateMipmap(gt),vt.unbindTexture()},this.initRenderTarget=function(A){Ot.get(A).__webglFramebuffer===void 0&&Tt.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?Tt.setTextureCube(A,0):A.isData3DTexture?Tt.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?Tt.setTexture2DArray(A,0):Tt.setTexture2D(A,0),vt.unbindTexture()},this.resetState=function(){T=0,w=0,S=null,vt.reset(),Lt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Tn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===Ua?"display-p3":"srgb",e.unpackColorSpace=Yt.workingColorSpace===no?"display-p3":"srgb"}}class Ba{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new kt(t),this.near=e,this.far=n}clone(){return new Ba(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class _c extends we{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new je,this.environmentIntensity=1,this.environmentRotation=new je,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class xc extends Fe{constructor(t=null,e=1,n=1,r,s,o,a,l,c=Ge,u=Ge,f,h){super(null,o,a,l,c,u,r,s,f,h),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}function h0(i,t){return i.z-t.z}function f0(i,t){return t.z-i.z}class d0{constructor(){this.index=0,this.pool=[],this.list=[]}push(t,e){const n=this.pool,r=this.list;this.index>=n.length&&n.push({start:-1,count:-1,z:-1});const s=n[this.index];r.push(s),this.index++,s.start=t.start,s.count=t.count,s.z=e}reset(){this.list.length=0,this.index=0}}const ki="batchId",On=new Bt,qo=new Bt,p0=new Bt,m0=new kt(1,1,1),vc=new Bt,jo=new io,hs=new pe,ri=new pn,br=new L,yc=new L,g0=new L,Yo=new d0,Ce=new It,fs=[];function _0(i,t,e=0){const n=t.itemSize;if(i.isInterleavedBufferAttribute||i.array.constructor!==t.array.constructor){const r=i.count;for(let s=0;s<r;s++)for(let o=0;o<n;o++)t.setComponent(s+e,o,i.getComponent(s,o))}else t.array.set(i.array,e*n);t.needsUpdate=!0}class x0 extends It{get maxGeometryCount(){return this._maxGeometryCount}constructor(t,e,n=e*2,r){super(new Ie,r),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._drawRanges=[],this._reservedRanges=[],this._visibility=[],this._active=[],this._bounds=[],this._maxGeometryCount=t,this._maxVertexCount=e,this._maxIndexCount=n,this._geometryInitialized=!1,this._geometryCount=0,this._multiDrawCounts=new Int32Array(t),this._multiDrawStarts=new Int32Array(t),this._multiDrawCount=0,this._multiDrawInstances=null,this._visibilityChanged=!0,this._matricesTexture=null,this._initMatricesTexture(),this._colorsTexture=null}_initMatricesTexture(){let t=Math.sqrt(this._maxGeometryCount*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4),n=new xc(e,t,t,Je,fn);this._matricesTexture=n}_initColorsTexture(){let t=Math.sqrt(this._maxGeometryCount);t=Math.ceil(t);const e=new Float32Array(t*t*4).fill(1),n=new xc(e,t,t,Je,fn);n.colorSpace=Yt.workingColorSpace,this._colorsTexture=n}_initializeGeometry(t){const e=this.geometry,n=this._maxVertexCount,r=this._maxGeometryCount,s=this._maxIndexCount;if(this._geometryInitialized===!1){for(const a in t.attributes){const l=t.getAttribute(a),{array:c,itemSize:u,normalized:f}=l,h=new c.constructor(n*u),d=new ke(h,u,f);e.setAttribute(a,d)}if(t.getIndex()!==null){const a=n>65536?new Uint32Array(s):new Uint16Array(s);e.setIndex(new ke(a,1))}const o=r>65536?new Uint32Array(n):new Uint16Array(n);e.setAttribute(ki,new ke(o,1)),this._geometryInitialized=!0}}_validateGeometry(t){if(t.getAttribute(ki))throw new Error(`BatchedMesh: Geometry cannot use attribute "${ki}"`);const e=this.geometry;if(!!t.getIndex()!=!!e.getIndex())throw new Error('BatchedMesh: All geometries must consistently have "index".');for(const n in e.attributes){if(n===ki)continue;if(!t.hasAttribute(n))throw new Error(`BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);const r=t.getAttribute(n),s=e.getAttribute(n);if(r.itemSize!==s.itemSize||r.normalized!==s.normalized)throw new Error("BatchedMesh: All attributes must have a consistent itemSize and normalized value.")}}setCustomSort(t){return this.customSort=t,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new pe);const t=this._geometryCount,e=this.boundingBox,n=this._active;e.makeEmpty();for(let r=0;r<t;r++)n[r]!==!1&&(this.getMatrixAt(r,On),this.getBoundingBoxAt(r,hs).applyMatrix4(On),e.union(hs))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new pn);const t=this._geometryCount,e=this.boundingSphere,n=this._active;e.makeEmpty();for(let r=0;r<t;r++)n[r]!==!1&&(this.getMatrixAt(r,On),this.getBoundingSphereAt(r,ri).applyMatrix4(On),e.union(ri))}addGeometry(t,e=-1,n=-1){if(this._initializeGeometry(t),this._validateGeometry(t),this._geometryCount>=this._maxGeometryCount)throw new Error("BatchedMesh: Maximum geometry count reached.");const r={vertexStart:-1,vertexCount:-1,indexStart:-1,indexCount:-1};let s=null;const o=this._reservedRanges,a=this._drawRanges,l=this._bounds;this._geometryCount!==0&&(s=o[o.length-1]),e===-1?r.vertexCount=t.getAttribute("position").count:r.vertexCount=e,s===null?r.vertexStart=0:r.vertexStart=s.vertexStart+s.vertexCount;const c=t.getIndex(),u=c!==null;if(u&&(n===-1?r.indexCount=c.count:r.indexCount=n,s===null?r.indexStart=0:r.indexStart=s.indexStart+s.indexCount),r.indexStart!==-1&&r.indexStart+r.indexCount>this._maxIndexCount||r.vertexStart+r.vertexCount>this._maxVertexCount)throw new Error("BatchedMesh: Reserved space request exceeds the maximum buffer size.");const f=this._visibility,h=this._active,d=this._matricesTexture,g=this._matricesTexture.image.data,_=this._colorsTexture;f.push(!0),h.push(!0);const m=this._geometryCount;this._geometryCount++,p0.toArray(g,m*16),d.needsUpdate=!0,_!==null&&(m0.toArray(_.image.data,m*4),_.needsUpdate=!0),o.push(r),a.push({start:u?r.indexStart:r.vertexStart,count:-1}),l.push({boxInitialized:!1,box:new pe,sphereInitialized:!1,sphere:new pn});const p=this.geometry.getAttribute(ki);for(let v=0;v<r.vertexCount;v++)p.setX(r.vertexStart+v,m);return p.needsUpdate=!0,this.setGeometryAt(m,t),m}setGeometryAt(t,e){if(t>=this._geometryCount)throw new Error("BatchedMesh: Maximum geometry count reached.");this._validateGeometry(e);const n=this.geometry,r=n.getIndex()!==null,s=n.getIndex(),o=e.getIndex(),a=this._reservedRanges[t];if(r&&o.count>a.indexCount||e.attributes.position.count>a.vertexCount)throw new Error("BatchedMesh: Reserved space not large enough for provided geometry.");const l=a.vertexStart,c=a.vertexCount;for(const d in n.attributes){if(d===ki)continue;const g=e.getAttribute(d),_=n.getAttribute(d);_0(g,_,l);const m=g.itemSize;for(let p=g.count,v=c;p<v;p++){const x=l+p;for(let y=0;y<m;y++)_.setComponent(x,y,0)}_.needsUpdate=!0,_.addUpdateRange(l*m,c*m)}if(r){const d=a.indexStart;for(let g=0;g<o.count;g++)s.setX(d+g,l+o.getX(g));for(let g=o.count,_=a.indexCount;g<_;g++)s.setX(d+g,l);s.needsUpdate=!0,s.addUpdateRange(d,a.indexCount)}const u=this._bounds[t];e.boundingBox!==null?(u.box.copy(e.boundingBox),u.boxInitialized=!0):u.boxInitialized=!1,e.boundingSphere!==null?(u.sphere.copy(e.boundingSphere),u.sphereInitialized=!0):u.sphereInitialized=!1;const f=this._drawRanges[t],h=e.getAttribute("position");return f.count=r?o.count:h.count,this._visibilityChanged=!0,t}deleteGeometry(t){const e=this._active;return t>=e.length||e[t]===!1?this:(e[t]=!1,this._visibilityChanged=!0,this)}getInstanceCountAt(t){return this._multiDrawInstances===null?null:this._multiDrawInstances[t]}setInstanceCountAt(t,e){return this._multiDrawInstances===null&&(this._multiDrawInstances=new Int32Array(this._maxGeometryCount).fill(1)),this._multiDrawInstances[t]=e,t}getBoundingBoxAt(t,e){if(this._active[t]===!1)return null;const r=this._bounds[t],s=r.box,o=this.geometry;if(r.boxInitialized===!1){s.makeEmpty();const a=o.index,l=o.attributes.position,c=this._drawRanges[t];for(let u=c.start,f=c.start+c.count;u<f;u++){let h=u;a&&(h=a.getX(h)),s.expandByPoint(br.fromBufferAttribute(l,h))}r.boxInitialized=!0}return e.copy(s),e}getBoundingSphereAt(t,e){if(this._active[t]===!1)return null;const r=this._bounds[t],s=r.sphere,o=this.geometry;if(r.sphereInitialized===!1){s.makeEmpty(),this.getBoundingBoxAt(t,hs),hs.getCenter(s.center);const a=o.index,l=o.attributes.position,c=this._drawRanges[t];let u=0;for(let f=c.start,h=c.start+c.count;f<h;f++){let d=f;a&&(d=a.getX(d)),br.fromBufferAttribute(l,d),u=Math.max(u,s.center.distanceToSquared(br))}s.radius=Math.sqrt(u),r.sphereInitialized=!0}return e.copy(s),e}setMatrixAt(t,e){const n=this._active,r=this._matricesTexture,s=this._matricesTexture.image.data,o=this._geometryCount;return t>=o||n[t]===!1?this:(e.toArray(s,t*16),r.needsUpdate=!0,this)}getMatrixAt(t,e){const n=this._active,r=this._matricesTexture.image.data,s=this._geometryCount;return t>=s||n[t]===!1?null:e.fromArray(r,t*16)}setColorAt(t,e){this._colorsTexture===null&&this._initColorsTexture();const n=this._active,r=this._colorsTexture,s=this._colorsTexture.image.data,o=this._geometryCount;return t>=o||n[t]===!1?this:(e.toArray(s,t*4),r.needsUpdate=!0,this)}getColorAt(t,e){const n=this._active,r=this._colorsTexture.image.data,s=this._geometryCount;return t>=s||n[t]===!1?null:e.fromArray(r,t*4)}setVisibleAt(t,e){const n=this._visibility,r=this._active,s=this._geometryCount;return t>=s||r[t]===!1||n[t]===e?this:(n[t]=e,this._visibilityChanged=!0,this)}getVisibleAt(t){const e=this._visibility,n=this._active,r=this._geometryCount;return t>=r||n[t]===!1?!1:e[t]}raycast(t,e){const n=this._visibility,r=this._active,s=this._drawRanges,o=this._geometryCount,a=this.matrixWorld,l=this.geometry;Ce.material=this.material,Ce.geometry.index=l.index,Ce.geometry.attributes=l.attributes,Ce.geometry.boundingBox===null&&(Ce.geometry.boundingBox=new pe),Ce.geometry.boundingSphere===null&&(Ce.geometry.boundingSphere=new pn);for(let c=0;c<o;c++){if(!n[c]||!r[c])continue;const u=s[c];Ce.geometry.setDrawRange(u.start,u.count),this.getMatrixAt(c,Ce.matrixWorld).premultiply(a),this.getBoundingBoxAt(c,Ce.geometry.boundingBox),this.getBoundingSphereAt(c,Ce.geometry.boundingSphere),Ce.raycast(t,fs);for(let f=0,h=fs.length;f<h;f++){const d=fs[f];d.object=this,d.batchId=c,e.push(d)}fs.length=0}Ce.material=null,Ce.geometry.index=null,Ce.geometry.attributes={},Ce.geometry.setDrawRange(0,1/0)}copy(t){return super.copy(t),this.geometry=t.geometry.clone(),this.perObjectFrustumCulled=t.perObjectFrustumCulled,this.sortObjects=t.sortObjects,this.boundingBox=t.boundingBox!==null?t.boundingBox.clone():null,this.boundingSphere=t.boundingSphere!==null?t.boundingSphere.clone():null,this._drawRanges=t._drawRanges.map(e=>({...e})),this._reservedRanges=t._reservedRanges.map(e=>({...e})),this._visibility=t._visibility.slice(),this._active=t._active.slice(),this._bounds=t._bounds.map(e=>({boxInitialized:e.boxInitialized,box:e.box.clone(),sphereInitialized:e.sphereInitialized,sphere:e.sphere.clone()})),this._maxGeometryCount=t._maxGeometryCount,this._maxVertexCount=t._maxVertexCount,this._maxIndexCount=t._maxIndexCount,this._geometryInitialized=t._geometryInitialized,this._geometryCount=t._geometryCount,this._multiDrawCounts=t._multiDrawCounts.slice(),this._multiDrawStarts=t._multiDrawStarts.slice(),this._matricesTexture=t._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.slice(),this._colorsTexture!==null&&(this._colorsTexture=t._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.slice()),this}dispose(){return this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null),this}onBeforeRender(t,e,n,r,s){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;const o=r.getIndex(),a=o===null?1:o.array.BYTES_PER_ELEMENT,l=this._active,c=this._visibility,u=this._multiDrawStarts,f=this._multiDrawCounts,h=this._drawRanges,d=this.perObjectFrustumCulled;d&&(vc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse).multiply(this.matrixWorld),jo.setFromProjectionMatrix(vc,t.coordinateSystem));let g=0;if(this.sortObjects){qo.copy(this.matrixWorld).invert(),br.setFromMatrixPosition(n.matrixWorld).applyMatrix4(qo),yc.set(0,0,-1).transformDirection(n.matrixWorld).transformDirection(qo);for(let p=0,v=c.length;p<v;p++)if(c[p]&&l[p]){this.getMatrixAt(p,On),this.getBoundingSphereAt(p,ri).applyMatrix4(On);let x=!1;if(d&&(x=!jo.intersectsSphere(ri)),!x){const y=g0.subVectors(ri.center,br).dot(yc);Yo.push(h[p],y)}}const _=Yo.list,m=this.customSort;m===null?_.sort(s.transparent?f0:h0):m.call(this,_,n);for(let p=0,v=_.length;p<v;p++){const x=_[p];u[g]=x.start*a,f[g]=x.count,g++}Yo.reset()}else for(let _=0,m=c.length;_<m;_++)if(c[_]&&l[_]){let p=!1;if(d&&(this.getMatrixAt(_,On),this.getBoundingSphereAt(_,ri).applyMatrix4(On),p=!jo.intersectsSphere(ri)),!p){const v=h[_];u[g]=v.start*a,f[g]=v.count,g++}}this._multiDrawCount=g,this._visibilityChanged=!1}onBeforeShadow(t,e,n,r,s,o){this.onBeforeRender(t,null,r,s,o)}}class v0 extends bi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new kt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const $s=new L,Ks=new L,bc=new Bt,Mr=new kr,ds=new pn,$o=new L,Mc=new L;class so extends we{constructor(t=new Ie,e=new v0){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let r=1,s=e.count;r<s;r++)$s.fromBufferAttribute(e,r-1),Ks.fromBufferAttribute(e,r),n[r]=n[r-1],n[r]+=$s.distanceTo(Ks);t.setAttribute("lineDistance",new me(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,r=this.matrixWorld,s=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ds.copy(n.boundingSphere),ds.applyMatrix4(r),ds.radius+=s,t.ray.intersectsSphere(ds)===!1)return;bc.copy(r).invert(),Mr.copy(t.ray).applyMatrix4(bc);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=n.index,h=n.attributes.position;if(u!==null){const d=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let _=d,m=g-1;_<m;_+=c){const p=u.getX(_),v=u.getX(_+1),x=ps(this,t,Mr,l,p,v);x&&e.push(x)}if(this.isLineLoop){const _=u.getX(g-1),m=u.getX(d),p=ps(this,t,Mr,l,_,m);p&&e.push(p)}}else{const d=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=d,m=g-1;_<m;_+=c){const p=ps(this,t,Mr,l,_,_+1);p&&e.push(p)}if(this.isLineLoop){const _=ps(this,t,Mr,l,g-1,d);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function ps(i,t,e,n,r,s){const o=i.geometry.attributes.position;if($s.fromBufferAttribute(o,r),Ks.fromBufferAttribute(o,s),e.distanceSqToSegment($s,Ks,$o,Mc)>n)return;$o.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo($o);if(!(l<t.near||l>t.far))return{distance:l,point:Mc.clone().applyMatrix4(i.matrixWorld),index:r,face:null,faceIndex:null,object:i}}const Sc=new L,wc=new L;class Nu extends so{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let r=0,s=e.count;r<s;r+=2)Sc.fromBufferAttribute(e,r),wc.fromBufferAttribute(e,r+1),n[r]=r===0?0:n[r-1],n[r+1]=n[r]+Sc.distanceTo(wc);t.setAttribute("lineDistance",new me(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Ou extends so{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}}class Bu extends bi{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new kt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Ec=new Bt,va=new kr,ms=new pn,gs=new L;class Fa extends we{constructor(t=new Ie,e=new Bu){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,r=this.matrixWorld,s=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ms.copy(n.boundingSphere),ms.applyMatrix4(r),ms.radius+=s,t.ray.intersectsSphere(ms)===!1)return;Ec.copy(r).invert(),va.copy(t.ray).applyMatrix4(Ec);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,f=n.attributes.position;if(c!==null){const h=Math.max(0,o.start),d=Math.min(c.count,o.start+o.count);for(let g=h,_=d;g<_;g++){const m=c.getX(g);gs.fromBufferAttribute(f,m),Tc(gs,m,l,r,t,e,this)}}else{const h=Math.max(0,o.start),d=Math.min(f.count,o.start+o.count);for(let g=h,_=d;g<_;g++)gs.fromBufferAttribute(f,g),Tc(gs,g,l,r,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Tc(i,t,e,n,r,s,o){const a=va.distanceSqToPoint(i);if(a<e){const l=new L;va.closestPointToPoint(i,l),l.applyMatrix4(n);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,object:o})}}class Zs extends Ie{constructor(t=1,e=1,n=1,r=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const u=[],f=[],h=[],d=[];let g=0;const _=[],m=n/2;let p=0;v(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(u),this.setAttribute("position",new me(f,3)),this.setAttribute("normal",new me(h,3)),this.setAttribute("uv",new me(d,2));function v(){const y=new L,T=new L;let w=0;const S=(e-t)/n;for(let P=0;P<=s;P++){const M=[],b=P/s,C=b*(e-t)+t;for(let R=0;R<=r;R++){const I=R/r,O=I*l+a,k=Math.sin(O),z=Math.cos(O);T.x=C*k,T.y=-b*n+m,T.z=C*z,f.push(T.x,T.y,T.z),y.set(k,S,z).normalize(),h.push(y.x,y.y,y.z),d.push(I,1-b),M.push(g++)}_.push(M)}for(let P=0;P<r;P++)for(let M=0;M<s;M++){const b=_[M][P],C=_[M+1][P],R=_[M+1][P+1],I=_[M][P+1];u.push(b,C,I),u.push(C,R,I),w+=6}c.addGroup(p,w,0),p+=w}function x(y){const T=g,w=new wt,S=new L;let P=0;const M=y===!0?t:e,b=y===!0?1:-1;for(let R=1;R<=r;R++)f.push(0,m*b,0),h.push(0,b,0),d.push(.5,.5),g++;const C=g;for(let R=0;R<=r;R++){const O=R/r*l+a,k=Math.cos(O),z=Math.sin(O);S.x=M*z,S.y=m*b,S.z=M*k,f.push(S.x,S.y,S.z),h.push(0,b,0),w.x=k*.5+.5,w.y=z*.5*b+.5,d.push(w.x,w.y),g++}for(let R=0;R<r;R++){const I=T+R,O=C+R;y===!0?u.push(O,O+1,I):u.push(O+1,O,I),P+=3}c.addGroup(p,P,y===!0?1:2),p+=P}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zs(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ur extends Ie{constructor(t=1,e=32,n=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const u=[],f=new L,h=new L,d=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){const v=[],x=p/n;let y=0;p===0&&o===0?y=.5/e:p===n&&l===Math.PI&&(y=-.5/e);for(let T=0;T<=e;T++){const w=T/e;f.x=-t*Math.cos(r+w*s)*Math.sin(o+x*a),f.y=t*Math.cos(o+x*a),f.z=t*Math.sin(r+w*s)*Math.sin(o+x*a),g.push(f.x,f.y,f.z),h.copy(f).normalize(),_.push(h.x,h.y,h.z),m.push(w+y,1-x),v.push(c++)}u.push(v)}for(let p=0;p<n;p++)for(let v=0;v<e;v++){const x=u[p][v+1],y=u[p][v],T=u[p+1][v],w=u[p+1][v+1];(p!==0||o>0)&&d.push(x,y,w),(p!==n-1||l<Math.PI)&&d.push(y,T,w)}this.setIndex(d),this.setAttribute("position",new me(g,3)),this.setAttribute("normal",new me(_,3)),this.setAttribute("uv",new me(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ur(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class ue extends bi{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new kt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new kt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=mu,this.normalScale=new wt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new je,this.combine=Da,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class ka extends we{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new kt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}const Ko=new Bt,Ac=new L,Cc=new L;class Fu{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new wt(512,512),this.map=null,this.mapPass=null,this.matrix=new Bt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new io,this._frameExtents=new wt(1,1),this._viewportCount=1,this._viewports=[new te(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Ac.setFromMatrixPosition(t.matrixWorld),e.position.copy(Ac),Cc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Cc),e.updateMatrixWorld(),Ko.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ko),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ko)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Pc=new Bt,Sr=new L,Zo=new L;class y0 extends Fu{constructor(){super(new qe(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new wt(4,2),this._viewportCount=6,this._viewports=[new te(2,1,1,1),new te(0,1,1,1),new te(3,1,1,1),new te(1,1,1,1),new te(3,0,1,1),new te(1,0,1,1)],this._cubeDirections=[new L(1,0,0),new L(-1,0,0),new L(0,0,1),new L(0,0,-1),new L(0,1,0),new L(0,-1,0)],this._cubeUps=[new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,0,1),new L(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,r=this.matrix,s=t.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),Sr.setFromMatrixPosition(t.matrixWorld),n.position.copy(Sr),Zo.copy(n.position),Zo.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Zo),n.updateMatrixWorld(),r.makeTranslation(-Sr.x,-Sr.y,-Sr.z),Pc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Pc)}}class b0 extends ka{constructor(t,e,n=0,r=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=r,this.shadow=new y0}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class M0 extends Fu{constructor(){super(new Cu(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class _s extends ka{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(we.DEFAULT_UP),this.updateMatrix(),this.target=new we,this.shadow=new M0}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Rc extends ka{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}const Lc=new Bt;class S0{constructor(t,e,n=0,r=1/0){this.ray=new kr(t,e),this.near=n,this.far=r,this.camera=null,this.layers=new Na,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Lc.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Lc),this}intersectObject(t,e=!0,n=[]){return ya(t,this,n,e),n.sort(Ic),n}intersectObjects(t,e=!0,n=[]){for(let r=0,s=t.length;r<s;r++)ya(t[r],this,n,e);return n.sort(Ic),n}}function Ic(i,t){return i.distance-t.distance}function ya(i,t,e,n){let r=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(r=!1),r===!0&&n===!0){const s=i.children;for(let o=0,a=s.length;o<a;o++)ya(s[o],t,e,!0)}}const Dc=new L,xs=new L;class An{constructor(t=new L,e=new L){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){Dc.subVectors(t,this.start),xs.subVectors(this.end,this.start);const n=xs.dot(xs);let s=xs.dot(Dc)/n;return e&&(s=Ne(s,0,1)),s}closestPointToPoint(t,e,n){const r=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(r).add(this.start)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Br}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Br);const zi=new je(0,0,0,"YXZ"),Hi=new L,w0={type:"change"},E0={type:"lock"},T0={type:"unlock"},Uc=Math.PI/2;class A0 extends yi{constructor(t,e){super(),this.camera=t,this.domElement=e,this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,this._onMouseMove=C0.bind(this),this._onPointerlockChange=P0.bind(this),this._onPointerlockError=R0.bind(this),this.connect()}connect(){this.domElement.ownerDocument.addEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this._onPointerlockError)}disconnect(){this.domElement.ownerDocument.removeEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this._onPointerlockError)}dispose(){this.disconnect()}getObject(){return this.camera}getDirection(t){return t.set(0,0,-1).applyQuaternion(this.camera.quaternion)}moveForward(t){const e=this.camera;Hi.setFromMatrixColumn(e.matrix,0),Hi.crossVectors(e.up,Hi),e.position.addScaledVector(Hi,t)}moveRight(t){const e=this.camera;Hi.setFromMatrixColumn(e.matrix,0),e.position.addScaledVector(Hi,t)}lock(){this.domElement.requestPointerLock()}unlock(){this.domElement.ownerDocument.exitPointerLock()}}function C0(i){if(this.isLocked===!1)return;const t=i.movementX||i.mozMovementX||i.webkitMovementX||0,e=i.movementY||i.mozMovementY||i.webkitMovementY||0,n=this.camera;zi.setFromQuaternion(n.quaternion),zi.y-=t*.002*this.pointerSpeed,zi.x-=e*.002*this.pointerSpeed,zi.x=Math.max(Uc-this.maxPolarAngle,Math.min(Uc-this.minPolarAngle,zi.x)),n.quaternion.setFromEuler(zi),this.dispatchEvent(w0)}function P0(){this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(E0),this.isLocked=!0):(this.dispatchEvent(T0),this.isLocked=!1)}function R0(){console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}const dn={dirt:{id:"dirt",name:"Dirt",category:"block",stackSize:64,color:9133098,placesBlock:"dirt"},grass:{id:"grass",name:"Grass",category:"block",stackSize:64,color:6135354,placesBlock:"grass"},stone:{id:"stone",name:"Stone",category:"block",stackSize:64,color:8947848,placesBlock:"stone"},cobblestone:{id:"cobblestone",name:"Cobblestone",category:"block",stackSize:64,color:8945776,placesBlock:"cobblestone"},wood:{id:"wood",name:"Wood",category:"block",stackSize:64,color:7031850,placesBlock:"wood"},planks:{id:"planks",name:"Planks",category:"block",stackSize:64,color:13148256,placesBlock:"planks"},sand:{id:"sand",name:"Sand",category:"block",stackSize:64,color:13943940,placesBlock:"sand"},glass:{id:"glass",name:"Glass",category:"block",stackSize:64,color:8965358,placesBlock:"glass"},iron_block:{id:"iron_block",name:"Iron Block",category:"block",stackSize:64,color:11184810,placesBlock:"iron_block"},crafting_table:{id:"crafting_table",name:"Crafting Table",category:"block",stackSize:64,color:9133098,placesBlock:"crafting_table"},furnace:{id:"furnace",name:"Furnace",category:"block",stackSize:64,color:7829367,placesBlock:"furnace"},torch:{id:"torch",name:"Torch",category:"block",stackSize:64,color:16755234,placesBlock:"torch"},stick:{id:"stick",name:"Stick",category:"material",stackSize:64,color:9136404},iron_ore:{id:"iron_ore",name:"Iron Ore",category:"material",stackSize:64,color:8939093},coal_ore:{id:"coal_ore",name:"Coal",category:"material",stackSize:64,color:3355443},iron_ingot:{id:"iron_ingot",name:"Iron Ingot",category:"material",stackSize:64,color:12303291},flint:{id:"flint",name:"Flint",category:"material",stackSize:64,color:5592405},arrow_item:{id:"arrow_item",name:"Arrow",category:"material",stackSize:64,color:8947848},apple:{id:"apple",name:"Apple",category:"food",stackSize:64,color:14492194,foodPoints:4},bread:{id:"bread",name:"Bread",category:"food",stackSize:64,color:13148256,foodPoints:5},wood_sword:{id:"wood_sword",name:"Wood Sword",category:"weapon",stackSize:1,color:13148256,damage:4,durability:59},wood_pickaxe:{id:"wood_pickaxe",name:"Wood Pickaxe",category:"tool",stackSize:1,color:13148256,toolCategory:"pickaxe",tier:"wood",speedMult:2,durability:59},wood_axe:{id:"wood_axe",name:"Wood Axe",category:"tool",stackSize:1,color:13148256,toolCategory:"axe",tier:"wood",speedMult:2,durability:59},wood_shovel:{id:"wood_shovel",name:"Wood Shovel",category:"tool",stackSize:1,color:13148256,toolCategory:"shovel",tier:"wood",speedMult:2,durability:59},stone_sword:{id:"stone_sword",name:"Stone Sword",category:"weapon",stackSize:1,color:8945776,damage:5,durability:131},stone_pickaxe:{id:"stone_pickaxe",name:"Stone Pickaxe",category:"tool",stackSize:1,color:8945776,toolCategory:"pickaxe",tier:"stone",speedMult:4,durability:131},stone_axe:{id:"stone_axe",name:"Stone Axe",category:"tool",stackSize:1,color:8945776,toolCategory:"axe",tier:"stone",speedMult:4,durability:131},iron_sword:{id:"iron_sword",name:"Iron Sword",category:"weapon",stackSize:1,color:12303291,damage:6,durability:250},iron_pickaxe:{id:"iron_pickaxe",name:"Iron Pickaxe",category:"tool",stackSize:1,color:12303291,toolCategory:"pickaxe",tier:"iron",speedMult:6,durability:250},iron_axe:{id:"iron_axe",name:"Iron Axe",category:"tool",stackSize:1,color:12303291,toolCategory:"axe",tier:"iron",speedMult:6,durability:250},bow:{id:"bow",name:"Bow",category:"weapon",stackSize:1,color:9136404,damage:8,durability:384},iron_helmet:{id:"iron_helmet",name:"Iron Helmet",category:"armor",stackSize:1,color:12303291,armorValue:2,armorSlot:"head"},iron_chestplate:{id:"iron_chestplate",name:"Iron Chestplate",category:"armor",stackSize:1,color:12303291,armorValue:5,armorSlot:"chest"},iron_leggings:{id:"iron_leggings",name:"Iron Leggings",category:"armor",stackSize:1,color:12303291,armorValue:4,armorSlot:"legs"},iron_boots:{id:"iron_boots",name:"Iron Boots",category:"armor",stackSize:1,color:12303291,armorValue:2,armorSlot:"feet"}},Bn=[{t:0,sky:328976,fog:394773,ambientColor:2109520,ambientInt:.08,sunInt:0,sunColor:16777215},{t:.2,sky:660789,fog:661552,ambientColor:3162224,ambientInt:.15,sunInt:0,sunColor:16777215},{t:.27,sky:16744512,fog:14508080,ambientColor:13395507,ambientInt:.5,sunInt:.7,sunColor:16748640},{t:.35,sky:8308963,fog:11195624,ambientColor:11585768,ambientInt:.7,sunInt:1.6,sunColor:16771248},{t:.5,sky:5944285,fog:8441070,ambientColor:12114160,ambientInt:.85,sunInt:1.9,sunColor:16776672},{t:.65,sky:8308963,fog:11195624,ambientColor:11585768,ambientInt:.7,sunInt:1.6,sunColor:16771248},{t:.73,sky:16736288,fog:13385744,ambientColor:13391138,ambientInt:.5,sunInt:.7,sunColor:16740416},{t:.8,sky:660789,fog:661552,ambientColor:3162224,ambientInt:.15,sunInt:0,sunColor:16777215},{t:1,sky:328976,fog:394773,ambientColor:2109520,ambientInt:.08,sunInt:0,sunColor:16777215}];function vs(i,t,e){const n=i>>16&255,r=i>>8&255,s=i&255,o=t>>16&255,a=t>>8&255,l=t&255;return Math.round(n+(o-n)*e)<<16|Math.round(r+(a-r)*e)<<8|Math.round(s+(l-s)*e)}function L0(i){i=(i%1+1)%1;let t=Bn[0],e=Bn[Bn.length-1];for(let r=0;r<Bn.length-1;r++)if(i>=Bn[r].t&&i<=Bn[r+1].t){t=Bn[r],e=Bn[r+1];break}const n=t.t===e.t?0:(i-t.t)/(e.t-t.t);return{sky:vs(t.sky,e.sky,n),fog:vs(t.fog,e.fog,n),ambientColor:vs(t.ambientColor,e.ambientColor,n),ambientInt:t.ambientInt+(e.ambientInt-t.ambientInt)*n,sunInt:t.sunInt+(e.sunInt-t.sunInt)*n,sunColor:vs(t.sunColor,e.sunColor,n)}}class I0{constructor(t){Object.defineProperty(this,"scene",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"camera",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"renderer",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"controls",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"dayTime",{enumerable:!0,configurable:!0,writable:!0,value:.38}),Object.defineProperty(this,"DAY_DURATION",{enumerable:!0,configurable:!0,writable:!0,value:600}),Object.defineProperty(this,"sunLight",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"ambientLight",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"stars",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"moon",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"armScene",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"armGroup",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"armSwingTimer",{enumerable:!0,configurable:!0,writable:!0,value:0}),Object.defineProperty(this,"ARM_SWING_DURATION",{enumerable:!0,configurable:!0,writable:!0,value:.25}),Object.defineProperty(this,"onPointerLockChange",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}}),this.renderer=new u0({antialias:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=ou,this.renderer.toneMapping=au,this.renderer.toneMappingExposure=1,this.renderer.autoClear=!1,t.appendChild(this.renderer.domElement),this.scene=new _c,this.scene.background=new kt(8308963),this.scene.fog=new Ba(11195624,48,130),this.camera=new qe(75,window.innerWidth/window.innerHeight,.1,200),this.camera.position.set(32,4,12),this.camera.lookAt(32,4,24),this.controls=new A0(this.camera,this.renderer.domElement),this.controls.addEventListener("lock",()=>this.onPointerLockChange(!0)),this.controls.addEventListener("unlock",()=>this.onPointerLockChange(!1)),this.setupLighting(),this.buildClouds(),this.stars=this.buildStars(),this.moon=this.buildMoon(),this.armScene=new _c,this.armScene.add(new Rc(16777215,.9));const e=new _s(16771248,.8);e.position.set(1,2,1),this.armScene.add(e),this.armGroup=new Hn,this.armGroup.scale.setScalar(.65),this.armScene.add(this.armGroup),this.buildArmMesh(),window.addEventListener("resize",()=>this.onResize())}get isPointerLocked(){return this.controls.isLocked}lockPointer(){this.controls.lock()}unlockPointer(){this.controls.unlock()}updateDayNight(t){this.dayTime=(this.dayTime+t/this.DAY_DURATION)%1;const e=L0(this.dayTime);this.scene.background.setHex(e.sky),this.scene.fog.color.setHex(e.fog),this.ambientLight.color.setHex(e.ambientColor),this.ambientLight.intensity=e.ambientInt,this.sunLight.intensity=e.sunInt,this.sunLight.color.setHex(e.sunColor);const n=this.dayTime*Math.PI*2,r=100;this.sunLight.position.set(Math.cos(n)*r,Math.sin(n)*r,20),this.renderer.toneMappingExposure=.5+e.ambientInt*.8;const s=Math.max(0,1-e.ambientInt*4);this.stars.material.opacity=s*.9,this.moon.material.opacity=s*.95;const o=this.dayTime*Math.PI*2+Math.PI,a=130;this.moon.position.set(Math.cos(o)*a+32,Math.abs(Math.sin(o))*a,20)}updateArmItem(t){for(;this.armGroup.children.length>1;)this.armGroup.remove(this.armGroup.children[1]);if(!t)return;const e=dn[t];if(!e)return;const n=this.buildItemMesh(e.category,e.color);n&&this.armGroup.add(n)}buildItemMesh(t,e){if(t==="block"){const n=new ue({color:e}),r=new It(new ne(.22,.22,.22),n);return r.position.set(-.06,.24,0),r.rotation.set(.3,.5,.2),r}if(t==="weapon"||t==="tool"||t==="material"){const n=new Hn,r=new ue({color:9136404}),s=new It(new ne(.05,.42,.05),r);s.position.set(0,.18,0),s.rotation.z=.35,n.add(s);const o=new ue({color:e});if(t==="weapon"){const a=new It(new ne(.08,.28,.04),o);a.position.set(-.08,.44,0),n.add(a)}else{const a=new It(new ne(.18,.12,.06),o);a.position.set(-.07,.44,0),n.add(a)}return n}return null}buildArmMesh(){const t=new ue({color:9134144}),e=new It(new ne(.12,.36,.12),t);this.armGroup.add(e)}buildStars(){const e=new Float32Array(2400);for(let o=0;o<800;o++){const a=Math.random()*Math.PI*2,l=Math.acos(2*Math.random()-1),c=160;e[o*3]=c*Math.sin(l)*Math.cos(a)+32,e[o*3+1]=Math.abs(c*Math.cos(l)),e[o*3+2]=c*Math.sin(l)*Math.sin(a)+32}const n=new Ie;n.setAttribute("position",new me(e,3));const r=new Bu({color:16777215,size:.5,transparent:!0,opacity:0}),s=new Fa(n,r);return this.scene.add(s),s}buildMoon(){const t=new Ur(4,8,8),e=new mi({color:15658717,transparent:!0,opacity:0}),n=new It(t,e);return this.scene.add(n),n}buildClouds(){const t=new ue({color:16777215,transparent:!0,opacity:.85}),e=[[10,8],[28,5],[48,12],[15,42],[45,38],[5,22],[38,25],[55,50],[22,55],[50,20],[35,14],[18,48],[52,32],[8,36],[42,58]];for(const[n,r]of e){const s=5+n%7,o=3+r%5,a=new It(new ne(s,1,o),t);a.position.set(n,22,r),this.scene.add(a)}}swingArm(){this.armSwingTimer=this.ARM_SWING_DURATION}render(t=0){this.renderer.clear(),this.renderer.render(this.scene,this.camera),this.renderer.clearDepth(),this.renderArm(t)}renderArm(t){this.armSwingTimer>0&&(this.armSwingTimer=Math.max(0,this.armSwingTimer-t));const e=new L,n=new pi;this.camera.getWorldPosition(e),this.camera.getWorldQuaternion(n);const r=this.armSwingTimer/this.ARM_SWING_DURATION,s=Math.sin(r*Math.PI)*1.2,o=new L(.38,-.52+r*.08,-.75);o.applyQuaternion(n),this.armGroup.position.copy(e).add(o);const a=new pi().setFromEuler(new je(.25-s,-.2,.12,"YXZ"));this.armGroup.quaternion.copy(n).multiply(a),this.renderer.render(this.armScene,this.camera)}resetCamera(){this.camera.position.set(32,2.62,48),this.camera.lookAt(32,2.62,32)}setupLighting(){this.ambientLight=new Rc(11585768,.7),this.scene.add(this.ambientLight),this.sunLight=new _s(16771248,1.6),this.sunLight.position.set(60,100,20),this.sunLight.castShadow=!0,this.sunLight.shadow.mapSize.set(2048,2048),this.sunLight.shadow.camera.near=1,this.sunLight.shadow.camera.far=220,this.sunLight.shadow.camera.left=-90,this.sunLight.shadow.camera.right=90,this.sunLight.shadow.camera.top=90,this.sunLight.shadow.camera.bottom=-90,this.scene.add(this.sunLight);const t=new _s(8956620,.5);t.position.set(-30,20,-20),this.scene.add(t);const e=new _s(10138828,.4);e.position.set(0,15,60),this.scene.add(e)}onResize(){this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight)}}const ku=0,D0=1,U0=2,Nc=2,Jo=1.25,Oc=1,Re=6*4+4+4,fe=Re/4,zu=65535,ks=Math.pow(2,-24),za=Symbol("SKIP_GENERATION"),Hu={strategy:ku,maxDepth:40,maxLeafSize:10,useSharedArrayBuffer:!1,setBoundingBox:!0,onProgress:null,indirect:!1,verbose:!0,range:null,[za]:!1};function se(i,t,e){return e.min.x=t[i],e.min.y=t[i+1],e.min.z=t[i+2],e.max.x=t[i+3],e.max.y=t[i+4],e.max.z=t[i+5],e}function Bc(i){let t=-1,e=-1/0;for(let n=0;n<3;n++){const r=i[n+3]-i[n];r>e&&(e=r,t=n)}return t}function Fc(i,t){t.set(i)}function kc(i,t,e){let n,r;for(let s=0;s<3;s++){const o=s+3;n=i[s],r=t[s],e[s]=n<r?n:r,n=i[o],r=t[o],e[o]=n>r?n:r}}function ys(i,t,e){for(let n=0;n<3;n++){const r=t[i+2*n],s=t[i+2*n+1],o=r-s,a=r+s;o<e[n]&&(e[n]=o),a>e[n+3]&&(e[n+3]=a)}}function wr(i){const t=i[3]-i[0],e=i[4]-i[1],n=i[5]-i[2];return 2*(t*e+e*n+n*t)}function de(i,t){return t[i+15]===zu}function Le(i,t){return t[i+6]}function Oe(i,t){return t[i+14]}function Me(i){return i+fe}function Se(i,t){const e=t[i+6];return i+e*fe}function Ha(i,t){return t[i+7]}function Qo(i,t,e,n,r){let s=1/0,o=1/0,a=1/0,l=-1/0,c=-1/0,u=-1/0,f=1/0,h=1/0,d=1/0,g=-1/0,_=-1/0,m=-1/0;const p=i.offset||0;for(let v=(t-p)*6,x=(t+e-p)*6;v<x;v+=6){const y=i[v+0],T=i[v+1],w=y-T,S=y+T;w<s&&(s=w),S>l&&(l=S),y<f&&(f=y),y>g&&(g=y);const P=i[v+2],M=i[v+3],b=P-M,C=P+M;b<o&&(o=b),C>c&&(c=C),P<h&&(h=P),P>_&&(_=P);const R=i[v+4],I=i[v+5],O=R-I,k=R+I;O<a&&(a=O),k>u&&(u=k),R<d&&(d=R),R>m&&(m=R)}n[0]=s,n[1]=o,n[2]=a,n[3]=l,n[4]=c,n[5]=u,r[0]=f,r[1]=h,r[2]=d,r[3]=g,r[4]=_,r[5]=m}const Sn=32,N0=(i,t)=>i.candidate-t.candidate,Fn=new Array(Sn).fill().map(()=>({count:0,bounds:new Float32Array(6),rightCacheBounds:new Float32Array(6),leftCacheBounds:new Float32Array(6),candidate:0})),bs=new Float32Array(6);function O0(i,t,e,n,r,s){let o=-1,a=0;if(s===ku)o=Bc(t),o!==-1&&(a=(t[o]+t[o+3])/2);else if(s===D0)o=Bc(i),o!==-1&&(a=B0(e,n,r,o));else if(s===U0){const l=wr(i);let c=Jo*r;const u=e.offset||0,f=(n-u)*6,h=(n+r-u)*6;for(let d=0;d<3;d++){const g=t[d],p=(t[d+3]-g)/Sn;if(r<Sn/4){const v=[...Fn];v.length=r;let x=0;for(let T=f;T<h;T+=6,x++){const w=v[x];w.candidate=e[T+2*d],w.count=0;const{bounds:S,leftCacheBounds:P,rightCacheBounds:M}=w;for(let b=0;b<3;b++)M[b]=1/0,M[b+3]=-1/0,P[b]=1/0,P[b+3]=-1/0,S[b]=1/0,S[b+3]=-1/0;ys(T,e,S)}v.sort(N0);let y=r;for(let T=0;T<y;T++){const w=v[T];for(;T+1<y&&v[T+1].candidate===w.candidate;)v.splice(T+1,1),y--}for(let T=f;T<h;T+=6){const w=e[T+2*d];for(let S=0;S<y;S++){const P=v[S];w>=P.candidate?ys(T,e,P.rightCacheBounds):(ys(T,e,P.leftCacheBounds),P.count++)}}for(let T=0;T<y;T++){const w=v[T],S=w.count,P=r-w.count,M=w.leftCacheBounds,b=w.rightCacheBounds;let C=0;S!==0&&(C=wr(M)/l);let R=0;P!==0&&(R=wr(b)/l);const I=Oc+Jo*(C*S+R*P);I<c&&(o=d,c=I,a=w.candidate)}}else{for(let y=0;y<Sn;y++){const T=Fn[y];T.count=0,T.candidate=g+p+y*p;const w=T.bounds;for(let S=0;S<3;S++)w[S]=1/0,w[S+3]=-1/0}for(let y=f;y<h;y+=6){let S=~~((e[y+2*d]-g)/p);S>=Sn&&(S=Sn-1);const P=Fn[S];P.count++,ys(y,e,P.bounds)}const v=Fn[Sn-1];Fc(v.bounds,v.rightCacheBounds);for(let y=Sn-2;y>=0;y--){const T=Fn[y],w=Fn[y+1];kc(T.bounds,w.rightCacheBounds,T.rightCacheBounds)}let x=0;for(let y=0;y<Sn-1;y++){const T=Fn[y],w=T.count,S=T.bounds,M=Fn[y+1].rightCacheBounds;w!==0&&(x===0?Fc(S,bs):kc(S,bs,bs)),x+=w;let b=0,C=0;x!==0&&(b=wr(bs)/l);const R=r-x;R!==0&&(C=wr(M)/l);const I=Oc+Jo*(b*x+C*R);I<c&&(o=d,c=I,a=T.candidate)}}}}else console.warn(`BVH: Invalid build strategy value ${s} used.`);return{axis:o,pos:a}}function B0(i,t,e,n){let r=0;const s=i.offset;for(let o=t,a=t+e;o<a;o++)r+=i[(o-s)*6+n*2];return r/e}class ta{constructor(){this.boundingData=new Float32Array(6)}}function F0(i,t,e,n,r,s){let o=n,a=n+r-1;const l=s.pos,c=s.axis*2,u=e.offset||0;for(;;){for(;o<=a&&e[(o-u)*6+c]<l;)o++;for(;o<=a&&e[(a-u)*6+c]>=l;)a--;if(o<a){for(let f=0;f<t;f++){let h=i[o*t+f];i[o*t+f]=i[a*t+f],i[a*t+f]=h}for(let f=0;f<6;f++){const h=o-u,d=a-u,g=e[h*6+f];e[h*6+f]=e[d*6+f],e[d*6+f]=g}o++,a--}else return o}}let Gu,zs,ba,Vu;const k0=Math.pow(2,32);function Ma(i){return"count"in i?1:1+Ma(i.left)+Ma(i.right)}function z0(i,t,e){return Gu=new Float32Array(e),zs=new Uint32Array(e),ba=new Uint16Array(e),Vu=new Uint8Array(e),Sa(i,t)}function Sa(i,t){const e=i/4,n=i/2,r="count"in t,s=t.boundingData;for(let o=0;o<6;o++)Gu[e+o]=s[o];if(r)return t.buffer?(Vu.set(new Uint8Array(t.buffer),i),i+t.buffer.byteLength):(zs[e+6]=t.offset,ba[n+14]=t.count,ba[n+15]=zu,i+Re);{const{left:o,right:a,splitAxis:l}=t,c=i+Re;let u=Sa(c,o);const f=i/Re,d=u/Re-f;if(d>k0)throw new Error("MeshBVH: Cannot store relative child node offset greater than 32 bits.");return zs[e+6]=d,zs[e+7]=l,Sa(u,a)}}function H0(i,t,e,n,r,s){const{maxDepth:o,verbose:a,maxLeafSize:l,strategy:c,onProgress:u}=r,f=i.primitiveBuffer,h=i.primitiveBufferStride,d=new Float32Array(6);let g=!1;const _=new ta;return Qo(t,e,n,_.boundingData,d),p(_,e,n,d),_;function m(v){u&&u((v-s.offset)/s.count)}function p(v,x,y,T=null,w=0){if(!g&&w>=o&&(g=!0,a&&console.warn(`BVH: Max depth of ${o} reached when generating BVH. Consider increasing maxDepth.`)),y<=l||w>=o)return m(x+y),v.offset=x,v.count=y,v;const S=O0(v.boundingData,T,t,x,y,c);if(S.axis===-1)return m(x+y),v.offset=x,v.count=y,v;const P=F0(f,h,t,x,y,S);if(P===x||P===x+y)m(x+y),v.offset=x,v.count=y;else{v.splitAxis=S.axis;const M=new ta,b=x,C=P-x;v.left=M,Qo(t,b,C,M.boundingData,d),p(M,b,C,d,w+1);const R=new ta,I=P,O=y-C;v.right=R,Qo(t,I,O,R.boundingData,d),p(R,I,O,d,w+1)}return v}}function G0(i,t){const e=t.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,n=i.getRootRanges(t.range),r=n[0],s=n[n.length-1],o={offset:r.offset,count:s.offset+s.count-r.offset},a=new Float32Array(6*o.count);a.offset=o.offset,i.computePrimitiveBounds(o.offset,o.count,a),i._roots=n.map(l=>{const c=H0(i,a,l.offset,l.count,t,o),u=Ma(c),f=new e(Re*u);return z0(0,c,f),f})}class Ga{constructor(t){this._getNewPrimitive=t,this._primitives=[]}getPrimitive(){const t=this._primitives;return t.length===0?this._getNewPrimitive():t.pop()}releasePrimitive(t){this._primitives.push(t)}}class V0{constructor(){this.float32Array=null,this.uint16Array=null,this.uint32Array=null;const t=[];let e=null;this.setBuffer=n=>{e&&t.push(e),e=n,this.float32Array=new Float32Array(n),this.uint16Array=new Uint16Array(n),this.uint32Array=new Uint32Array(n)},this.clearBuffer=()=>{e=null,this.float32Array=null,this.uint16Array=null,this.uint32Array=null,t.length!==0&&this.setBuffer(t.pop())}}}const Qt=new V0;let Gn,ir;const Gi=[],Ms=new Ga(()=>new pe);function W0(i,t,e,n,r,s){Gn=Ms.getPrimitive(),ir=Ms.getPrimitive(),Gi.push(Gn,ir),Qt.setBuffer(i._roots[t]);const o=wa(0,i.geometry,e,n,r,s);Qt.clearBuffer(),Ms.releasePrimitive(Gn),Ms.releasePrimitive(ir),Gi.pop(),Gi.pop();const a=Gi.length;return a>0&&(ir=Gi[a-1],Gn=Gi[a-2]),o}function wa(i,t,e,n,r=null,s=0,o=0){const{float32Array:a,uint16Array:l,uint32Array:c}=Qt;let u=i*2;if(de(u,l)){const g=Le(i,c),_=Oe(u,l);return se(i,a,Gn),n(g,_,!1,o,s+i/fe,Gn)}else{let R=function(O){const{uint16Array:k,uint32Array:z}=Qt;let j=O*2;for(;!de(j,k);)O=Me(O),j=O*2;return Le(O,z)},I=function(O){const{uint16Array:k,uint32Array:z}=Qt;let j=O*2;for(;!de(j,k);)O=Se(O,z),j=O*2;return Le(O,z)+Oe(j,k)};var h=R,d=I;const g=Me(i),_=Se(i,c);let m=g,p=_,v,x,y,T;if(r&&(y=Gn,T=ir,se(m,a,y),se(p,a,T),v=r(y),x=r(T),x<v)){m=_,p=g;const O=v;v=x,x=O,y=T}y||(y=Gn,se(m,a,y));const w=de(m*2,l),S=e(y,w,v,o+1,s+m/fe);let P;if(S===Nc){const O=R(m),z=I(m)-O;P=n(O,z,!0,o+1,s+m/fe,y)}else P=S&&wa(m,t,e,n,r,s,o+1);if(P)return!0;T=ir,se(p,a,T);const M=de(p*2,l),b=e(T,M,x,o+1,s+p/fe);let C;if(b===Nc){const O=R(p),z=I(p)-O;C=n(O,z,!0,o+1,s+p/fe,T)}else C=b&&wa(p,t,e,n,r,s,o+1);return!!C}}const Dr=new Qt.constructor,Js=new Qt.constructor,kn=new Ga(()=>new pe),Vi=new pe,Wi=new pe,ea=new pe,na=new pe;let ia=!1;function X0(i,t,e,n){if(ia)throw new Error("MeshBVH: Recursive calls to bvhcast not supported.");ia=!0;const r=i._roots,s=t._roots;let o,a=0,l=0;const c=new Bt().copy(e).invert();for(let u=0,f=r.length;u<f;u++){Dr.setBuffer(r[u]),l=0;const h=kn.getPrimitive();se(0,Dr.float32Array,h),h.applyMatrix4(c);for(let d=0,g=s.length;d<g&&(Js.setBuffer(s[d]),o=rn(0,0,e,c,n,a,l,0,0,h),Js.clearBuffer(),l+=s[d].byteLength/Re,!o);d++);if(kn.releasePrimitive(h),Dr.clearBuffer(),a+=r[u].byteLength/Re,o)break}return ia=!1,o}function rn(i,t,e,n,r,s=0,o=0,a=0,l=0,c=null,u=!1){let f,h;u?(f=Js,h=Dr):(f=Dr,h=Js);const d=f.float32Array,g=f.uint32Array,_=f.uint16Array,m=h.float32Array,p=h.uint32Array,v=h.uint16Array,x=i*2,y=t*2,T=de(x,_),w=de(y,v);let S=!1;if(w&&T)u?S=r(Le(t,p),Oe(t*2,v),Le(i,g),Oe(i*2,_),l,o+t/fe,a,s+i/fe):S=r(Le(i,g),Oe(i*2,_),Le(t,p),Oe(t*2,v),a,s+i/fe,l,o+t/fe);else if(w){const P=kn.getPrimitive();se(t,m,P),P.applyMatrix4(e);const M=Me(i),b=Se(i,g);se(M,d,Vi),se(b,d,Wi);const C=P.intersectsBox(Vi),R=P.intersectsBox(Wi);S=C&&rn(t,M,n,e,r,o,s,l,a+1,P,!u)||R&&rn(t,b,n,e,r,o,s,l,a+1,P,!u),kn.releasePrimitive(P)}else{const P=Me(t),M=Se(t,p);se(P,m,ea),se(M,m,na);const b=c.intersectsBox(ea),C=c.intersectsBox(na);if(b&&C)S=rn(i,P,e,n,r,s,o,a,l+1,c,u)||rn(i,M,e,n,r,s,o,a,l+1,c,u);else if(b)if(T)S=rn(i,P,e,n,r,s,o,a,l+1,c,u);else{const R=kn.getPrimitive();R.copy(ea).applyMatrix4(e);const I=Me(i),O=Se(i,g);se(I,d,Vi),se(O,d,Wi);const k=R.intersectsBox(Vi),z=R.intersectsBox(Wi);S=k&&rn(P,I,n,e,r,o,s,l,a+1,R,!u)||z&&rn(P,O,n,e,r,o,s,l,a+1,R,!u),kn.releasePrimitive(R)}else if(C)if(T)S=rn(i,M,e,n,r,s,o,a,l+1,c,u);else{const R=kn.getPrimitive();R.copy(na).applyMatrix4(e);const I=Me(i),O=Se(i,g);se(I,d,Vi),se(O,d,Wi);const k=R.intersectsBox(Vi),z=R.intersectsBox(Wi);S=k&&rn(M,I,n,e,r,o,s,l,a+1,R,!u)||z&&rn(M,O,n,e,r,o,s,l,a+1,R,!u),kn.releasePrimitive(R)}}return S}const zc=new pe,Xi=new Float32Array(6);class q0{constructor(){this._roots=null,this.primitiveBuffer=null,this.primitiveBufferStride=null}init(t){t={...Hu,...t},G0(this,t)}getRootRanges(){throw new Error("BVH: getRootRanges() not implemented")}writePrimitiveBounds(){throw new Error("BVH: writePrimitiveBounds() not implemented")}writePrimitiveRangeBounds(t,e,n,r){let s=1/0,o=1/0,a=1/0,l=-1/0,c=-1/0,u=-1/0;for(let f=t,h=t+e;f<h;f++){this.writePrimitiveBounds(f,Xi,0);const[d,g,_,m,p,v]=Xi;d<s&&(s=d),m>l&&(l=m),g<o&&(o=g),p>c&&(c=p),_<a&&(a=_),v>u&&(u=v)}return n[r+0]=s,n[r+1]=o,n[r+2]=a,n[r+3]=l,n[r+4]=c,n[r+5]=u,n}computePrimitiveBounds(t,e,n){const r=n.offset||0;for(let s=t,o=t+e;s<o;s++){this.writePrimitiveBounds(s,Xi,0);const[a,l,c,u,f,h]=Xi,d=(a+u)/2,g=(l+f)/2,_=(c+h)/2,m=(u-a)/2,p=(f-l)/2,v=(h-c)/2,x=(s-r)*6;n[x+0]=d,n[x+1]=m+(Math.abs(d)+m)*ks,n[x+2]=g,n[x+3]=p+(Math.abs(g)+p)*ks,n[x+4]=_,n[x+5]=v+(Math.abs(_)+v)*ks}return n}shiftPrimitiveOffsets(t){const e=this._indirectBuffer;if(e)for(let n=0,r=e.length;n<r;n++)e[n]+=t;else{const n=this._roots;for(let r=0;r<n.length;r++){const s=n[r],o=new Uint32Array(s),a=new Uint16Array(s),l=s.byteLength/Re;for(let c=0;c<l;c++){const u=fe*c,f=2*u;de(f,a)&&(o[u+6]+=t)}}}}traverse(t,e=0){const n=this._roots[e],r=new Uint32Array(n),s=new Uint16Array(n);o(0);function o(a,l=0){const c=a*2,u=de(c,s);if(u){const f=r[a+6],h=s[c+14];t(l,u,new Float32Array(n,a*4,6),f,h)}else{const f=Me(a),h=Se(a,r),d=Ha(a,r);t(l,u,new Float32Array(n,a*4,6),d)||(o(f,l+1),o(h,l+1))}}}refit(){const t=this._roots;for(let e=0,n=t.length;e<n;e++){const r=t[e],s=new Uint32Array(r),o=new Uint16Array(r),a=new Float32Array(r),l=r.byteLength/Re;for(let c=l-1;c>=0;c--){const u=c*fe,f=u*2;if(de(f,o)){const d=Le(u,s),g=Oe(f,o);this.writePrimitiveRangeBounds(d,g,Xi,0),a.set(Xi,u)}else{const d=Me(u),g=Se(u,s);for(let _=0;_<3;_++){const m=a[d+_],p=a[d+_+3],v=a[g+_],x=a[g+_+3];a[u+_]=m<v?m:v,a[u+_+3]=p>x?p:x}}}}}getBoundingBox(t){return t.makeEmpty(),this._roots.forEach(n=>{se(0,new Float32Array(n),zc),t.union(zc)}),t}shapecast(t){let{boundsTraverseOrder:e,intersectsBounds:n,intersectsRange:r,intersectsPrimitive:s,scratchPrimitive:o,iterate:a}=t;if(r&&s){const f=r;r=(h,d,g,_,m)=>f(h,d,g,_,m)?!0:a(h,d,this,s,g,_,o)}else r||(s?r=(f,h,d,g)=>a(f,h,this,s,d,g,o):r=(f,h,d)=>d);let l=!1,c=0;const u=this._roots;for(let f=0,h=u.length;f<h;f++){const d=u[f];if(l=W0(this,f,n,r,e,c),l)break;c+=d.byteLength/Re}return l}bvhcast(t,e,n){let{intersectsRanges:r}=n;return X0(this,t,e,r)}}function j0(){return typeof SharedArrayBuffer<"u"}function Va(i){return i.index?i.index.count:i.attributes.position.count}function oo(i){return Va(i)/3}function Y0(i,t=ArrayBuffer){return i>65535?new Uint32Array(new t(4*i)):new Uint16Array(new t(2*i))}function $0(i,t){if(!i.index){const e=i.attributes.position.count,n=t.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,r=Y0(e,n);i.setIndex(new ke(r,1));for(let s=0;s<e;s++)r[s]=s}}function K0(i,t,e){const n=Va(i)/e,r=t||i.drawRange,s=r.start/e,o=(r.start+r.count)/e,a=Math.max(0,s),l=Math.min(n,o)-a;return{offset:Math.floor(a),count:Math.floor(l)}}function Z0(i,t){return i.groups.map(e=>({offset:e.start/t,count:e.count/t}))}function Hc(i,t,e){const n=K0(i,t,e),r=Z0(i,e);if(!r.length)return[n];const s=[],o=n.offset,a=n.offset+n.count,l=Va(i)/e,c=[];for(const h of r){const{offset:d,count:g}=h,_=d,m=isFinite(g)?g:l-d,p=d+m;_<a&&p>o&&(c.push({pos:Math.max(o,_),isStart:!0}),c.push({pos:Math.min(a,p),isStart:!1}))}c.sort((h,d)=>h.pos!==d.pos?h.pos-d.pos:h.type==="end"?-1:1);let u=0,f=null;for(const h of c){const d=h.pos;u!==0&&d!==f&&s.push({offset:f,count:d-f}),u+=h.isStart?1:-1,f=d}return s}function J0(i,t){const e=i[i.length-1],n=e.offset+e.count>2**16,r=i.reduce((c,u)=>c+u.count,0),s=n?4:2,o=t?new SharedArrayBuffer(r*s):new ArrayBuffer(r*s),a=n?new Uint32Array(o):new Uint16Array(o);let l=0;for(let c=0;c<i.length;c++){const{offset:u,count:f}=i[c];for(let h=0;h<f;h++)a[l+h]=u+h;l+=f}return a}class Q0 extends q0{get indirect(){return!!this._indirectBuffer}get primitiveStride(){return null}get primitiveBufferStride(){return this.indirect?1:this.primitiveStride}set primitiveBufferStride(t){}get primitiveBuffer(){return this.indirect?this._indirectBuffer:this.geometry.index.array}set primitiveBuffer(t){}constructor(t,e={}){if(t.isBufferGeometry){if(t.index&&t.index.isInterleavedBufferAttribute)throw new Error("BVH: InterleavedBufferAttribute is not supported for the index attribute.")}else throw new Error("BVH: Only BufferGeometries are supported.");if(e.useSharedArrayBuffer&&!j0())throw new Error("BVH: SharedArrayBuffer is not available.");super(),this.geometry=t,this.resolvePrimitiveIndex=e.indirect?n=>this._indirectBuffer[n]:n=>n,this.primitiveBuffer=null,this.primitiveBufferStride=null,this._indirectBuffer=null,e={...Hu,...e},e[za]||this.init(e)}init(t){const{geometry:e,primitiveStride:n}=this;if(t.indirect){const r=Hc(e,t.range,n),s=J0(r,t.useSharedArrayBuffer);this._indirectBuffer=s}else $0(e,t);super.init(t),!e.boundingBox&&t.setBoundingBox&&(e.boundingBox=this.getBoundingBox(new pe))}getRootRanges(t){return this.indirect?[{offset:0,count:this._indirectBuffer.length}]:Hc(this.geometry,t,this.primitiveStride)}raycastObject3D(){throw new Error("BVH: raycastObject3D() not implemented")}}class Cn{constructor(){this.min=1/0,this.max=-1/0}setFromPointsField(t,e){let n=1/0,r=-1/0;for(let s=0,o=t.length;s<o;s++){const l=t[s][e];n=l<n?l:n,r=l>r?l:r}this.min=n,this.max=r}setFromPoints(t,e){let n=1/0,r=-1/0;for(let s=0,o=e.length;s<o;s++){const a=e[s],l=t.dot(a);n=l<n?l:n,r=l>r?l:r}this.min=n,this.max=r}isSeparated(t){return this.min>t.max||t.min>this.max}}Cn.prototype.setFromBox=function(){const i=new L;return function(e,n){const r=n.min,s=n.max;let o=1/0,a=-1/0;for(let l=0;l<=1;l++)for(let c=0;c<=1;c++)for(let u=0;u<=1;u++){i.x=r.x*l+s.x*(1-l),i.y=r.y*c+s.y*(1-c),i.z=r.z*u+s.z*(1-u);const f=e.dot(i);o=Math.min(f,o),a=Math.max(f,a)}this.min=o,this.max=a}}();const t_=function(){const i=new L,t=new L,e=new L;return function(r,s,o){const a=r.start,l=i,c=s.start,u=t;e.subVectors(a,c),i.subVectors(r.end,r.start),t.subVectors(s.end,s.start);const f=e.dot(u),h=u.dot(l),d=u.dot(u),g=e.dot(l),m=l.dot(l)*d-h*h;let p,v;m!==0?p=(f*h-g*d)/m:p=0,v=(f+p*h)/d,o.x=p,o.y=v}}(),Wa=function(){const i=new wt,t=new L,e=new L;return function(r,s,o,a){t_(r,s,i);let l=i.x,c=i.y;if(l>=0&&l<=1&&c>=0&&c<=1){r.at(l,o),s.at(c,a);return}else if(l>=0&&l<=1){c<0?s.at(0,a):s.at(1,a),r.closestPointToPoint(a,!0,o);return}else if(c>=0&&c<=1){l<0?r.at(0,o):r.at(1,o),s.closestPointToPoint(o,!0,a);return}else{let u;l<0?u=r.start:u=r.end;let f;c<0?f=s.start:f=s.end;const h=t,d=e;if(r.closestPointToPoint(f,!0,t),s.closestPointToPoint(u,!0,e),h.distanceToSquared(f)<=d.distanceToSquared(u)){o.copy(h),a.copy(f);return}else{o.copy(u),a.copy(d);return}}}}(),e_=function(){const i=new L,t=new L,e=new wn,n=new An;return function(s,o){const{radius:a,center:l}=s,{a:c,b:u,c:f}=o;if(n.start=c,n.end=u,n.closestPointToPoint(l,!0,i).distanceTo(l)<=a||(n.start=c,n.end=f,n.closestPointToPoint(l,!0,i).distanceTo(l)<=a)||(n.start=u,n.end=f,n.closestPointToPoint(l,!0,i).distanceTo(l)<=a))return!0;const _=o.getPlane(e);if(Math.abs(_.distanceToPoint(l))<=a){const p=_.projectPoint(l,t);if(o.containsPoint(p))return!0}return!1}}(),n_=["x","y","z"],En=1e-15,Gc=En*En;function Ke(i){return Math.abs(i)<En}class an extends Pe{constructor(...t){super(...t),this.isExtendedTriangle=!0,this.satAxes=new Array(4).fill().map(()=>new L),this.satBounds=new Array(4).fill().map(()=>new Cn),this.points=[this.a,this.b,this.c],this.plane=new wn,this.isDegenerateIntoSegment=!1,this.isDegenerateIntoPoint=!1,this.degenerateSegment=new An,this.needsUpdate=!0}intersectsSphere(t){return e_(t,this)}update(){const t=this.a,e=this.b,n=this.c,r=this.points,s=this.satAxes,o=this.satBounds,a=s[0],l=o[0];this.getNormal(a),l.setFromPoints(a,r);const c=s[1],u=o[1];c.subVectors(t,e),u.setFromPoints(c,r);const f=s[2],h=o[2];f.subVectors(e,n),h.setFromPoints(f,r);const d=s[3],g=o[3];d.subVectors(n,t),g.setFromPoints(d,r);const _=c.length(),m=f.length(),p=d.length();this.isDegenerateIntoPoint=!1,this.isDegenerateIntoSegment=!1,_<En?m<En||p<En?this.isDegenerateIntoPoint=!0:(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(t),this.degenerateSegment.end.copy(n)):m<En?p<En?this.isDegenerateIntoPoint=!0:(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(e),this.degenerateSegment.end.copy(t)):p<En&&(this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(n),this.degenerateSegment.end.copy(e)),this.plane.setFromNormalAndCoplanarPoint(a,t),this.needsUpdate=!1}}an.prototype.closestPointToSegment=function(){const i=new L,t=new L,e=new An;return function(r,s=null,o=null){const{start:a,end:l}=r,c=this.points;let u,f=1/0;for(let h=0;h<3;h++){const d=(h+1)%3;e.start.copy(c[h]),e.end.copy(c[d]),Wa(e,r,i,t),u=i.distanceToSquared(t),u<f&&(f=u,s&&s.copy(i),o&&o.copy(t))}return this.closestPointToPoint(a,i),u=a.distanceToSquared(i),u<f&&(f=u,s&&s.copy(i),o&&o.copy(a)),this.closestPointToPoint(l,i),u=l.distanceToSquared(i),u<f&&(f=u,s&&s.copy(i),o&&o.copy(l)),Math.sqrt(f)}}();an.prototype.intersectsTriangle=function(){const i=new an,t=new Cn,e=new Cn,n=new L,r=new L,s=new L,o=new L,a=new An,l=new An,c=new L,u=new wt,f=new wt;function h(x,y,T,w){const S=n;!x.isDegenerateIntoPoint&&!x.isDegenerateIntoSegment?S.copy(x.plane.normal):S.copy(y.plane.normal);const P=x.satBounds,M=x.satAxes;for(let R=1;R<4;R++){const I=P[R],O=M[R];if(t.setFromPoints(O,y.points),I.isSeparated(t)||(o.copy(S).cross(O),t.setFromPoints(o,x.points),e.setFromPoints(o,y.points),t.isSeparated(e)))return!1}const b=y.satBounds,C=y.satAxes;for(let R=1;R<4;R++){const I=b[R],O=C[R];if(t.setFromPoints(O,x.points),I.isSeparated(t)||(o.crossVectors(S,O),t.setFromPoints(o,x.points),e.setFromPoints(o,y.points),t.isSeparated(e)))return!1}return T&&(w||console.warn("ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0."),T.start.set(0,0,0),T.end.set(0,0,0)),!0}function d(x,y,T,w,S,P,M,b,C,R,I){let O=M/(M-b);R.x=w+(S-w)*O,I.start.subVectors(y,x).multiplyScalar(O).add(x),O=M/(M-C),R.y=w+(P-w)*O,I.end.subVectors(T,x).multiplyScalar(O).add(x)}function g(x,y,T,w,S,P,M,b,C,R,I){if(S>0)d(x.c,x.a,x.b,w,y,T,C,M,b,R,I);else if(P>0)d(x.b,x.a,x.c,T,y,w,b,M,C,R,I);else if(b*C>0||M!=0)d(x.a,x.b,x.c,y,T,w,M,b,C,R,I);else if(b!=0)d(x.b,x.a,x.c,T,y,w,b,M,C,R,I);else if(C!=0)d(x.c,x.a,x.b,w,y,T,C,M,b,R,I);else return!0;return!1}function _(x,y,T,w){const S=y.degenerateSegment,P=x.plane.distanceToPoint(S.start),M=x.plane.distanceToPoint(S.end);return Ke(P)?Ke(M)?h(x,y,T,w):(T&&(T.start.copy(S.start),T.end.copy(S.start)),x.containsPoint(S.start)):Ke(M)?(T&&(T.start.copy(S.end),T.end.copy(S.end)),x.containsPoint(S.end)):x.plane.intersectLine(S,n)!=null?(T&&(T.start.copy(n),T.end.copy(n)),x.containsPoint(n)):!1}function m(x,y,T){const w=y.a;return Ke(x.plane.distanceToPoint(w))&&x.containsPoint(w)?(T&&(T.start.copy(w),T.end.copy(w)),!0):!1}function p(x,y,T){const w=x.degenerateSegment,S=y.a;return w.closestPointToPoint(S,!0,n),S.distanceToSquared(n)<Gc?(T&&(T.start.copy(S),T.end.copy(S)),!0):!1}function v(x,y,T,w){if(x.isDegenerateIntoSegment)if(y.isDegenerateIntoSegment){const S=x.degenerateSegment,P=y.degenerateSegment,M=r,b=s;S.delta(M),P.delta(b);const C=n.subVectors(P.start,S.start),R=M.x*b.y-M.y*b.x;if(Ke(R))return!1;const I=(C.x*b.y-C.y*b.x)/R,O=-(M.x*C.y-M.y*C.x)/R;if(I<0||I>1||O<0||O>1)return!1;const k=S.start.z+M.z*I,z=P.start.z+b.z*O;return Ke(k-z)?(T&&(T.start.copy(S.start).addScaledVector(M,I),T.end.copy(S.start).addScaledVector(M,I)),!0):!1}else return y.isDegenerateIntoPoint?p(x,y,T):_(y,x,T,w);else{if(x.isDegenerateIntoPoint)return y.isDegenerateIntoPoint?y.a.distanceToSquared(x.a)<Gc?(T&&(T.start.copy(x.a),T.end.copy(x.a)),!0):!1:y.isDegenerateIntoSegment?p(y,x,T):m(y,x,T);if(y.isDegenerateIntoPoint)return m(x,y,T);if(y.isDegenerateIntoSegment)return _(x,y,T,w)}}return function(y,T=null,w=!1){this.needsUpdate&&this.update(),y.isExtendedTriangle?y.needsUpdate&&y.update():(i.copy(y),i.update(),y=i);const S=v(this,y,T,w);if(S!==void 0)return S;const P=this.plane,M=y.plane;let b=M.distanceToPoint(this.a),C=M.distanceToPoint(this.b),R=M.distanceToPoint(this.c);Ke(b)&&(b=0),Ke(C)&&(C=0),Ke(R)&&(R=0);const I=b*C,O=b*R;if(I>0&&O>0)return!1;let k=P.distanceToPoint(y.a),z=P.distanceToPoint(y.b),j=P.distanceToPoint(y.c);Ke(k)&&(k=0),Ke(z)&&(z=0),Ke(j)&&(j=0);const W=k*z,lt=k*j;if(W>0&&lt>0)return!1;r.copy(P.normal),s.copy(M.normal);const ht=r.cross(s);let nt=0,Dt=Math.abs(ht.x);const Wt=Math.abs(ht.y);Wt>Dt&&(Dt=Wt,nt=1),Math.abs(ht.z)>Dt&&(nt=2);const J=n_[nt],ft=this.a[J],rt=this.b[J],Pt=this.c[J],Et=y.a[J],zt=y.b[J],N=y.c[J];if(g(this,ft,rt,Pt,I,O,b,C,R,u,a))return h(this,y,T,w);if(g(y,Et,zt,N,W,lt,k,z,j,f,l))return h(this,y,T,w);if(u.y<u.x){const Ut=u.y;u.y=u.x,u.x=Ut,c.copy(a.start),a.start.copy(a.end),a.end.copy(c)}if(f.y<f.x){const Ut=f.y;f.y=f.x,f.x=Ut,c.copy(l.start),l.start.copy(l.end),l.end.copy(c)}return u.y<f.x||f.y<u.x?!1:(T&&(f.x>u.x?T.start.copy(l.start):T.start.copy(a.start),f.y<u.y?T.end.copy(l.end):T.end.copy(a.end)),!0)}}();an.prototype.distanceToPoint=function(){const i=new L;return function(e){return this.closestPointToPoint(e,i),e.distanceTo(i)}}();an.prototype.distanceToTriangle=function(){const i=new L,t=new L,e=["a","b","c"],n=new An,r=new An;return function(o,a=null,l=null){const c=a||l?n:null;if(this.intersectsTriangle(o,c))return(a||l)&&(a&&c.getCenter(a),l&&c.getCenter(l)),0;let u=1/0;for(let f=0;f<3;f++){let h;const d=e[f],g=o[d];this.closestPointToPoint(g,i),h=g.distanceToSquared(i),h<u&&(u=h,a&&a.copy(i),l&&l.copy(g));const _=this[d];o.closestPointToPoint(_,i),h=_.distanceToSquared(i),h<u&&(u=h,a&&a.copy(_),l&&l.copy(i))}for(let f=0;f<3;f++){const h=e[f],d=e[(f+1)%3];n.set(this[h],this[d]);for(let g=0;g<3;g++){const _=e[g],m=e[(g+1)%3];r.set(o[_],o[m]),Wa(n,r,i,t);const p=i.distanceToSquared(t);p<u&&(u=p,a&&a.copy(i),l&&l.copy(t))}}return Math.sqrt(u)}}();class ze{constructor(t,e,n){this.isOrientedBox=!0,this.min=new L,this.max=new L,this.matrix=new Bt,this.invMatrix=new Bt,this.points=new Array(8).fill().map(()=>new L),this.satAxes=new Array(3).fill().map(()=>new L),this.satBounds=new Array(3).fill().map(()=>new Cn),this.alignedSatBounds=new Array(3).fill().map(()=>new Cn),this.needsUpdate=!1,t&&this.min.copy(t),e&&this.max.copy(e),n&&this.matrix.copy(n)}set(t,e,n){this.min.copy(t),this.max.copy(e),this.matrix.copy(n),this.needsUpdate=!0}copy(t){this.min.copy(t.min),this.max.copy(t.max),this.matrix.copy(t.matrix),this.needsUpdate=!0}}ze.prototype.update=function(){return function(){const t=this.matrix,e=this.min,n=this.max,r=this.points;for(let c=0;c<=1;c++)for(let u=0;u<=1;u++)for(let f=0;f<=1;f++){const h=1*c|2*u|4*f,d=r[h];d.x=c?n.x:e.x,d.y=u?n.y:e.y,d.z=f?n.z:e.z,d.applyMatrix4(t)}const s=this.satBounds,o=this.satAxes,a=r[0];for(let c=0;c<3;c++){const u=o[c],f=s[c],h=1<<c,d=r[h];u.subVectors(a,d),f.setFromPoints(u,r)}const l=this.alignedSatBounds;l[0].setFromPointsField(r,"x"),l[1].setFromPointsField(r,"y"),l[2].setFromPointsField(r,"z"),this.invMatrix.copy(this.matrix).invert(),this.needsUpdate=!1}}();ze.prototype.intersectsBox=function(){const i=new Cn;return function(e){this.needsUpdate&&this.update();const n=e.min,r=e.max,s=this.satBounds,o=this.satAxes,a=this.alignedSatBounds;if(i.min=n.x,i.max=r.x,a[0].isSeparated(i)||(i.min=n.y,i.max=r.y,a[1].isSeparated(i))||(i.min=n.z,i.max=r.z,a[2].isSeparated(i)))return!1;for(let l=0;l<3;l++){const c=o[l],u=s[l];if(i.setFromBox(c,e),u.isSeparated(i))return!1}return!0}}();ze.prototype.intersectsTriangle=function(){const i=new an,t=new Array(3),e=new Cn,n=new Cn,r=new L;return function(o){this.needsUpdate&&this.update(),o.isExtendedTriangle?o.needsUpdate&&o.update():(i.copy(o),i.update(),o=i);const a=this.satBounds,l=this.satAxes;t[0]=o.a,t[1]=o.b,t[2]=o.c;for(let h=0;h<3;h++){const d=a[h],g=l[h];if(e.setFromPoints(g,t),d.isSeparated(e))return!1}const c=o.satBounds,u=o.satAxes,f=this.points;for(let h=0;h<3;h++){const d=c[h],g=u[h];if(e.setFromPoints(g,f),d.isSeparated(e))return!1}for(let h=0;h<3;h++){const d=l[h];for(let g=0;g<4;g++){const _=u[g];if(r.crossVectors(d,_),e.setFromPoints(r,t),n.setFromPoints(r,f),e.isSeparated(n))return!1}}return!0}}();ze.prototype.closestPointToPoint=function(){return function(t,e){return this.needsUpdate&&this.update(),e.copy(t).applyMatrix4(this.invMatrix).clamp(this.min,this.max).applyMatrix4(this.matrix),e}}();ze.prototype.distanceToPoint=function(){const i=new L;return function(e){return this.closestPointToPoint(e,i),e.distanceTo(i)}}();ze.prototype.distanceToBox=function(){const i=["x","y","z"],t=new Array(12).fill().map(()=>new An),e=new Array(12).fill().map(()=>new An),n=new L,r=new L;return function(o,a=0,l=null,c=null){if(this.needsUpdate&&this.update(),this.intersectsBox(o))return(l||c)&&(o.getCenter(r),this.closestPointToPoint(r,n),o.closestPointToPoint(n,r),l&&l.copy(n),c&&c.copy(r)),0;const u=a*a,f=o.min,h=o.max,d=this.points;let g=1/0;for(let m=0;m<8;m++){const p=d[m];r.copy(p).clamp(f,h);const v=p.distanceToSquared(r);if(v<g&&(g=v,l&&l.copy(p),c&&c.copy(r),v<u))return Math.sqrt(v)}let _=0;for(let m=0;m<3;m++)for(let p=0;p<=1;p++)for(let v=0;v<=1;v++){const x=(m+1)%3,y=(m+2)%3,T=p<<x|v<<y,w=1<<m|p<<x|v<<y,S=d[T],P=d[w];t[_].set(S,P);const b=i[m],C=i[x],R=i[y],I=e[_],O=I.start,k=I.end;O[b]=f[b],O[C]=p?f[C]:h[C],O[R]=v?f[R]:h[C],k[b]=h[b],k[C]=p?f[C]:h[C],k[R]=v?f[R]:h[C],_++}for(let m=0;m<=1;m++)for(let p=0;p<=1;p++)for(let v=0;v<=1;v++){r.x=m?h.x:f.x,r.y=p?h.y:f.y,r.z=v?h.z:f.z,this.closestPointToPoint(r,n);const x=r.distanceToSquared(n);if(x<g&&(g=x,l&&l.copy(n),c&&c.copy(r),x<u))return Math.sqrt(x)}for(let m=0;m<12;m++){const p=t[m];for(let v=0;v<12;v++){const x=e[v];Wa(p,x,n,r);const y=n.distanceToSquared(r);if(y<g&&(g=y,l&&l.copy(n),c&&c.copy(r),y<u))return Math.sqrt(y)}}return Math.sqrt(g)}}();class i_ extends Ga{constructor(){super(()=>new an)}}const Qe=new i_,Er=new L,ra=new L;function r_(i,t,e={},n=0,r=1/0){const s=n*n,o=r*r;let a=1/0,l=null;if(i.shapecast({boundsTraverseOrder:u=>(Er.copy(t).clamp(u.min,u.max),Er.distanceToSquared(t)),intersectsBounds:(u,f,h)=>h<a&&h<o,intersectsTriangle:(u,f)=>{u.closestPointToPoint(t,Er);const h=t.distanceToSquared(Er);return h<a&&(ra.copy(Er),a=h,l=f),h<s}}),a===1/0)return null;const c=Math.sqrt(a);return e.point?e.point.copy(ra):e.point=ra.clone(),e.distance=c,e.faceIndex=l,e}const Ss=parseInt(Br)>=169,s_=parseInt(Br)<=161,si=new L,oi=new L,ai=new L,ws=new wt,Es=new wt,Ts=new wt,Vc=new L,Wc=new L,Xc=new L,Tr=new L;function o_(i,t,e,n,r,s,o,a){let l;if(s===Be?l=i.intersectTriangle(n,e,t,!0,r):l=i.intersectTriangle(t,e,n,s!==Ze,r),l===null)return null;const c=i.origin.distanceTo(r);return c<o||c>a?null:{distance:c,point:r.clone()}}function qc(i,t,e,n,r,s,o,a,l,c,u){si.fromBufferAttribute(t,s),oi.fromBufferAttribute(t,o),ai.fromBufferAttribute(t,a);const f=o_(i,si,oi,ai,Tr,l,c,u);if(f){if(n){ws.fromBufferAttribute(n,s),Es.fromBufferAttribute(n,o),Ts.fromBufferAttribute(n,a),f.uv=new wt;const d=Pe.getInterpolation(Tr,si,oi,ai,ws,Es,Ts,f.uv);Ss||(f.uv=d)}if(r){ws.fromBufferAttribute(r,s),Es.fromBufferAttribute(r,o),Ts.fromBufferAttribute(r,a),f.uv1=new wt;const d=Pe.getInterpolation(Tr,si,oi,ai,ws,Es,Ts,f.uv1);Ss||(f.uv1=d),s_&&(f.uv2=f.uv1)}if(e){Vc.fromBufferAttribute(e,s),Wc.fromBufferAttribute(e,o),Xc.fromBufferAttribute(e,a),f.normal=new L;const d=Pe.getInterpolation(Tr,si,oi,ai,Vc,Wc,Xc,f.normal);f.normal.dot(i.direction)>0&&f.normal.multiplyScalar(-1),Ss||(f.normal=d)}const h={a:s,b:o,c:a,normal:new L,materialIndex:0};if(Pe.getNormal(si,oi,ai,h.normal),f.face=h,f.faceIndex=s,Ss){const d=new L;Pe.getBarycoord(Tr,si,oi,ai,d),f.barycoord=d}}return f}function jc(i){return i&&i.isMaterial?i.side:i}function ao(i,t,e,n,r,s,o){const a=n*3;let l=a+0,c=a+1,u=a+2;const{index:f,groups:h}=i;i.index&&(l=f.getX(l),c=f.getX(c),u=f.getX(u));const{position:d,normal:g,uv:_,uv1:m}=i.attributes;if(Array.isArray(t)){const p=n*3;for(let v=0,x=h.length;v<x;v++){const{start:y,count:T,materialIndex:w}=h[v];if(p>=y&&p<y+T){const S=jc(t[w]),P=qc(e,d,g,_,m,l,c,u,S,s,o);if(P)if(P.faceIndex=n,P.face.materialIndex=w,r)r.push(P);else return P}}}else{const p=jc(t),v=qc(e,d,g,_,m,l,c,u,p,s,o);if(v)if(v.faceIndex=n,v.face.materialIndex=0,r)r.push(v);else return v}return null}function he(i,t,e,n){const r=i.a,s=i.b,o=i.c;let a=t,l=t+1,c=t+2;e&&(a=e.getX(a),l=e.getX(l),c=e.getX(c)),r.x=n.getX(a),r.y=n.getY(a),r.z=n.getZ(a),s.x=n.getX(l),s.y=n.getY(l),s.z=n.getZ(l),o.x=n.getX(c),o.y=n.getY(c),o.z=n.getZ(c)}function a_(i,t,e,n,r,s,o,a){const{geometry:l,_indirectBuffer:c}=i;for(let u=n,f=n+r;u<f;u++)ao(l,t,e,u,s,o,a)}function l_(i,t,e,n,r,s,o){const{geometry:a,_indirectBuffer:l}=i;let c=1/0,u=null;for(let f=n,h=n+r;f<h;f++){let d;d=ao(a,t,e,f,null,s,o),d&&d.distance<c&&(u=d,c=d.distance)}return u}function c_(i,t,e,n,r,s,o){const{geometry:a}=e,{index:l}=a,c=a.attributes.position;for(let u=i,f=t+i;u<f;u++){let h;if(h=u,he(o,h*3,l,c),o.needsUpdate=!0,n(o,h,r,s))return!0}return!1}function u_(i,t=null){t&&Array.isArray(t)&&(t=new Set(t));const e=i.geometry,n=e.index?e.index.array:null,r=e.attributes.position;let s,o,a,l,c=0;const u=i._roots;for(let h=0,d=u.length;h<d;h++)s=u[h],o=new Uint32Array(s),a=new Uint16Array(s),l=new Float32Array(s),f(0,c),c+=s.byteLength;function f(h,d,g=!1){const _=h*2;if(de(_,a)){const m=Le(h,o),p=Oe(_,a);let v=1/0,x=1/0,y=1/0,T=-1/0,w=-1/0,S=-1/0;for(let P=3*m,M=3*(m+p);P<M;P++){let b=n[P];const C=r.getX(b),R=r.getY(b),I=r.getZ(b);C<v&&(v=C),C>T&&(T=C),R<x&&(x=R),R>w&&(w=R),I<y&&(y=I),I>S&&(S=I)}return l[h+0]!==v||l[h+1]!==x||l[h+2]!==y||l[h+3]!==T||l[h+4]!==w||l[h+5]!==S?(l[h+0]=v,l[h+1]=x,l[h+2]=y,l[h+3]=T,l[h+4]=w,l[h+5]=S,!0):!1}else{const m=Me(h),p=Se(h,o);let v=g,x=!1,y=!1;if(t){if(!v){const b=m/fe+d/Re,C=p/fe+d/Re;x=t.has(b),y=t.has(C),v=!x&&!y}}else x=!0,y=!0;const T=v||x,w=v||y;let S=!1;T&&(S=f(m,d,v));let P=!1;w&&(P=f(p,d,v));const M=S||P;if(M)for(let b=0;b<3;b++){const C=m+b,R=p+b,I=l[C],O=l[C+3],k=l[R],z=l[R+3];l[h+b]=I<k?I:k,l[h+b+3]=O>z?O:z}return M}}}function Yn(i,t,e,n,r){let s,o,a,l,c,u;const f=1/e.direction.x,h=1/e.direction.y,d=1/e.direction.z,g=e.origin.x,_=e.origin.y,m=e.origin.z;let p=t[i],v=t[i+3],x=t[i+1],y=t[i+3+1],T=t[i+2],w=t[i+3+2];return f>=0?(s=(p-g)*f,o=(v-g)*f):(s=(v-g)*f,o=(p-g)*f),h>=0?(a=(x-_)*h,l=(y-_)*h):(a=(y-_)*h,l=(x-_)*h),s>l||a>o||((a>s||isNaN(s))&&(s=a),(l<o||isNaN(o))&&(o=l),d>=0?(c=(T-m)*d,u=(w-m)*d):(c=(w-m)*d,u=(T-m)*d),s>u||c>o)?!1:((c>s||s!==s)&&(s=c),(u<o||o!==o)&&(o=u),s<=r&&o>=n)}function h_(i,t,e,n,r,s,o,a){const{geometry:l,_indirectBuffer:c}=i;for(let u=n,f=n+r;u<f;u++){let h=c?c[u]:u;ao(l,t,e,h,s,o,a)}}function f_(i,t,e,n,r,s,o){const{geometry:a,_indirectBuffer:l}=i;let c=1/0,u=null;for(let f=n,h=n+r;f<h;f++){let d;d=ao(a,t,e,l?l[f]:f,null,s,o),d&&d.distance<c&&(u=d,c=d.distance)}return u}function d_(i,t,e,n,r,s,o){const{geometry:a}=e,{index:l}=a,c=a.attributes.position;for(let u=i,f=t+i;u<f;u++){let h;if(h=e.resolveTriangleIndex(u),he(o,h*3,l,c),o.needsUpdate=!0,n(o,h,r,s))return!0}return!1}function p_(i,t,e,n,r,s,o){Qt.setBuffer(i._roots[t]),Ea(0,i,e,n,r,s,o),Qt.clearBuffer()}function Ea(i,t,e,n,r,s,o){const{float32Array:a,uint16Array:l,uint32Array:c}=Qt,u=i*2;if(de(u,l)){const h=Le(i,c),d=Oe(u,l);a_(t,e,n,h,d,r,s,o)}else{const h=Me(i);Yn(h,a,n,s,o)&&Ea(h,t,e,n,r,s,o);const d=Se(i,c);Yn(d,a,n,s,o)&&Ea(d,t,e,n,r,s,o)}}const m_=["x","y","z"];function g_(i,t,e,n,r,s){Qt.setBuffer(i._roots[t]);const o=Ta(0,i,e,n,r,s);return Qt.clearBuffer(),o}function Ta(i,t,e,n,r,s){const{float32Array:o,uint16Array:a,uint32Array:l}=Qt;let c=i*2;if(de(c,a)){const f=Le(i,l),h=Oe(c,a);return l_(t,e,n,f,h,r,s)}else{const f=Ha(i,l),h=m_[f],g=n.direction[h]>=0;let _,m;g?(_=Me(i),m=Se(i,l)):(_=Se(i,l),m=Me(i));const v=Yn(_,o,n,r,s)?Ta(_,t,e,n,r,s):null;if(v){const T=v.point[h];if(g?T<=o[m+f]:T>=o[m+f+3])return v}const y=Yn(m,o,n,r,s)?Ta(m,t,e,n,r,s):null;return v&&y?v.distance<=y.distance?v:y:v||y||null}}const As=new pe,qi=new an,ji=new an,Ar=new Bt,Yc=new ze,Cs=new ze;function __(i,t,e,n){Qt.setBuffer(i._roots[t]);const r=Aa(0,i,e,n);return Qt.clearBuffer(),r}function Aa(i,t,e,n,r=null){const{float32Array:s,uint16Array:o,uint32Array:a}=Qt;let l=i*2;if(r===null&&(e.boundingBox||e.computeBoundingBox(),Yc.set(e.boundingBox.min,e.boundingBox.max,n),r=Yc),de(l,o)){const u=t.geometry,f=u.index,h=u.attributes.position,d=e.index,g=e.attributes.position,_=Le(i,a),m=Oe(l,o);if(Ar.copy(n).invert(),e.boundsTree)return se(i,s,Cs),Cs.matrix.copy(Ar),Cs.needsUpdate=!0,e.boundsTree.shapecast({intersectsBounds:v=>Cs.intersectsBox(v),intersectsTriangle:v=>{v.a.applyMatrix4(n),v.b.applyMatrix4(n),v.c.applyMatrix4(n),v.needsUpdate=!0;for(let x=_*3,y=(m+_)*3;x<y;x+=3)if(he(ji,x,f,h),ji.needsUpdate=!0,v.intersectsTriangle(ji))return!0;return!1}});{const p=oo(e);for(let v=_*3,x=(m+_)*3;v<x;v+=3){he(qi,v,f,h),qi.a.applyMatrix4(Ar),qi.b.applyMatrix4(Ar),qi.c.applyMatrix4(Ar),qi.needsUpdate=!0;for(let y=0,T=p*3;y<T;y+=3)if(he(ji,y,d,g),ji.needsUpdate=!0,qi.intersectsTriangle(ji))return!0}}}else{const u=Me(i),f=Se(i,a);return se(u,s,As),!!(r.intersectsBox(As)&&Aa(u,t,e,n,r)||(se(f,s,As),r.intersectsBox(As)&&Aa(f,t,e,n,r)))}}const Ps=new Bt,sa=new ze,Cr=new ze,x_=new L,v_=new L,y_=new L,b_=new L;function M_(i,t,e,n={},r={},s=0,o=1/0){t.boundingBox||t.computeBoundingBox(),sa.set(t.boundingBox.min,t.boundingBox.max,e),sa.needsUpdate=!0;const a=i.geometry,l=a.attributes.position,c=a.index,u=t.attributes.position,f=t.index,h=Qe.getPrimitive(),d=Qe.getPrimitive();let g=x_,_=v_,m=null,p=null;r&&(m=y_,p=b_);let v=1/0,x=null,y=null;return Ps.copy(e).invert(),Cr.matrix.copy(Ps),i.shapecast({boundsTraverseOrder:T=>sa.distanceToBox(T),intersectsBounds:(T,w,S)=>S<v&&S<o?(w&&(Cr.min.copy(T.min),Cr.max.copy(T.max),Cr.needsUpdate=!0),!0):!1,intersectsRange:(T,w)=>{if(t.boundsTree)return t.boundsTree.shapecast({boundsTraverseOrder:P=>Cr.distanceToBox(P),intersectsBounds:(P,M,b)=>b<v&&b<o,intersectsRange:(P,M)=>{for(let b=P,C=P+M;b<C;b++){he(d,3*b,f,u),d.a.applyMatrix4(e),d.b.applyMatrix4(e),d.c.applyMatrix4(e),d.needsUpdate=!0;for(let R=T,I=T+w;R<I;R++){he(h,3*R,c,l),h.needsUpdate=!0;const O=h.distanceToTriangle(d,g,m);if(O<v&&(_.copy(g),p&&p.copy(m),v=O,x=R,y=b),O<s)return!0}}}});{const S=oo(t);for(let P=0,M=S;P<M;P++){he(d,3*P,f,u),d.a.applyMatrix4(e),d.b.applyMatrix4(e),d.c.applyMatrix4(e),d.needsUpdate=!0;for(let b=T,C=T+w;b<C;b++){he(h,3*b,c,l),h.needsUpdate=!0;const R=h.distanceToTriangle(d,g,m);if(R<v&&(_.copy(g),p&&p.copy(m),v=R,x=b,y=P),R<s)return!0}}}}}),Qe.releasePrimitive(h),Qe.releasePrimitive(d),v===1/0?null:(n.point?n.point.copy(_):n.point=_.clone(),n.distance=v,n.faceIndex=x,r&&(r.point?r.point.copy(p):r.point=p.clone(),r.point.applyMatrix4(Ps),_.applyMatrix4(Ps),r.distance=_.sub(r.point).length(),r.faceIndex=y),n)}function S_(i,t=null){t&&Array.isArray(t)&&(t=new Set(t));const e=i.geometry,n=e.index?e.index.array:null,r=e.attributes.position;let s,o,a,l,c=0;const u=i._roots;for(let h=0,d=u.length;h<d;h++)s=u[h],o=new Uint32Array(s),a=new Uint16Array(s),l=new Float32Array(s),f(0,c),c+=s.byteLength;function f(h,d,g=!1){const _=h*2;if(de(_,a)){const m=Le(h,o),p=Oe(_,a);let v=1/0,x=1/0,y=1/0,T=-1/0,w=-1/0,S=-1/0;for(let P=m,M=m+p;P<M;P++){const b=3*i.resolveTriangleIndex(P);for(let C=0;C<3;C++){let R=b+C;R=n?n[R]:R;const I=r.getX(R),O=r.getY(R),k=r.getZ(R);I<v&&(v=I),I>T&&(T=I),O<x&&(x=O),O>w&&(w=O),k<y&&(y=k),k>S&&(S=k)}}return l[h+0]!==v||l[h+1]!==x||l[h+2]!==y||l[h+3]!==T||l[h+4]!==w||l[h+5]!==S?(l[h+0]=v,l[h+1]=x,l[h+2]=y,l[h+3]=T,l[h+4]=w,l[h+5]=S,!0):!1}else{const m=Me(h),p=Se(h,o);let v=g,x=!1,y=!1;if(t){if(!v){const b=m/fe+d/Re,C=p/fe+d/Re;x=t.has(b),y=t.has(C),v=!x&&!y}}else x=!0,y=!0;const T=v||x,w=v||y;let S=!1;T&&(S=f(m,d,v));let P=!1;w&&(P=f(p,d,v));const M=S||P;if(M)for(let b=0;b<3;b++){const C=m+b,R=p+b,I=l[C],O=l[C+3],k=l[R],z=l[R+3];l[h+b]=I<k?I:k,l[h+b+3]=O>z?O:z}return M}}}function w_(i,t,e,n,r,s,o){Qt.setBuffer(i._roots[t]),Ca(0,i,e,n,r,s,o),Qt.clearBuffer()}function Ca(i,t,e,n,r,s,o){const{float32Array:a,uint16Array:l,uint32Array:c}=Qt,u=i*2;if(de(u,l)){const h=Le(i,c),d=Oe(u,l);h_(t,e,n,h,d,r,s,o)}else{const h=Me(i);Yn(h,a,n,s,o)&&Ca(h,t,e,n,r,s,o);const d=Se(i,c);Yn(d,a,n,s,o)&&Ca(d,t,e,n,r,s,o)}}const E_=["x","y","z"];function T_(i,t,e,n,r,s){Qt.setBuffer(i._roots[t]);const o=Pa(0,i,e,n,r,s);return Qt.clearBuffer(),o}function Pa(i,t,e,n,r,s){const{float32Array:o,uint16Array:a,uint32Array:l}=Qt;let c=i*2;if(de(c,a)){const f=Le(i,l),h=Oe(c,a);return f_(t,e,n,f,h,r,s)}else{const f=Ha(i,l),h=E_[f],g=n.direction[h]>=0;let _,m;g?(_=Me(i),m=Se(i,l)):(_=Se(i,l),m=Me(i));const v=Yn(_,o,n,r,s)?Pa(_,t,e,n,r,s):null;if(v){const T=v.point[h];if(g?T<=o[m+f]:T>=o[m+f+3])return v}const y=Yn(m,o,n,r,s)?Pa(m,t,e,n,r,s):null;return v&&y?v.distance<=y.distance?v:y:v||y||null}}const Rs=new pe,Yi=new an,$i=new an,Pr=new Bt,$c=new ze,Ls=new ze;function A_(i,t,e,n){Qt.setBuffer(i._roots[t]);const r=Ra(0,i,e,n);return Qt.clearBuffer(),r}function Ra(i,t,e,n,r=null){const{float32Array:s,uint16Array:o,uint32Array:a}=Qt;let l=i*2;if(r===null&&(e.boundingBox||e.computeBoundingBox(),$c.set(e.boundingBox.min,e.boundingBox.max,n),r=$c),de(l,o)){const u=t.geometry,f=u.index,h=u.attributes.position,d=e.index,g=e.attributes.position,_=Le(i,a),m=Oe(l,o);if(Pr.copy(n).invert(),e.boundsTree)return se(i,s,Ls),Ls.matrix.copy(Pr),Ls.needsUpdate=!0,e.boundsTree.shapecast({intersectsBounds:v=>Ls.intersectsBox(v),intersectsTriangle:v=>{v.a.applyMatrix4(n),v.b.applyMatrix4(n),v.c.applyMatrix4(n),v.needsUpdate=!0;for(let x=_,y=m+_;x<y;x++)if(he($i,3*t.resolveTriangleIndex(x),f,h),$i.needsUpdate=!0,v.intersectsTriangle($i))return!0;return!1}});{const p=oo(e);for(let v=_,x=m+_;v<x;v++){const y=t.resolveTriangleIndex(v);he(Yi,3*y,f,h),Yi.a.applyMatrix4(Pr),Yi.b.applyMatrix4(Pr),Yi.c.applyMatrix4(Pr),Yi.needsUpdate=!0;for(let T=0,w=p*3;T<w;T+=3)if(he($i,T,d,g),$i.needsUpdate=!0,Yi.intersectsTriangle($i))return!0}}}else{const u=Me(i),f=Se(i,a);return se(u,s,Rs),!!(r.intersectsBox(Rs)&&Ra(u,t,e,n,r)||(se(f,s,Rs),r.intersectsBox(Rs)&&Ra(f,t,e,n,r)))}}const Is=new Bt,oa=new ze,Rr=new ze,C_=new L,P_=new L,R_=new L,L_=new L;function I_(i,t,e,n={},r={},s=0,o=1/0){t.boundingBox||t.computeBoundingBox(),oa.set(t.boundingBox.min,t.boundingBox.max,e),oa.needsUpdate=!0;const a=i.geometry,l=a.attributes.position,c=a.index,u=t.attributes.position,f=t.index,h=Qe.getPrimitive(),d=Qe.getPrimitive();let g=C_,_=P_,m=null,p=null;r&&(m=R_,p=L_);let v=1/0,x=null,y=null;return Is.copy(e).invert(),Rr.matrix.copy(Is),i.shapecast({boundsTraverseOrder:T=>oa.distanceToBox(T),intersectsBounds:(T,w,S)=>S<v&&S<o?(w&&(Rr.min.copy(T.min),Rr.max.copy(T.max),Rr.needsUpdate=!0),!0):!1,intersectsRange:(T,w)=>{if(t.boundsTree){const S=t.boundsTree;return S.shapecast({boundsTraverseOrder:P=>Rr.distanceToBox(P),intersectsBounds:(P,M,b)=>b<v&&b<o,intersectsRange:(P,M)=>{for(let b=P,C=P+M;b<C;b++){const R=S.resolveTriangleIndex(b);he(d,3*R,f,u),d.a.applyMatrix4(e),d.b.applyMatrix4(e),d.c.applyMatrix4(e),d.needsUpdate=!0;for(let I=T,O=T+w;I<O;I++){const k=i.resolveTriangleIndex(I);he(h,3*k,c,l),h.needsUpdate=!0;const z=h.distanceToTriangle(d,g,m);if(z<v&&(_.copy(g),p&&p.copy(m),v=z,x=I,y=b),z<s)return!0}}}})}else{const S=oo(t);for(let P=0,M=S;P<M;P++){he(d,3*P,f,u),d.a.applyMatrix4(e),d.b.applyMatrix4(e),d.c.applyMatrix4(e),d.needsUpdate=!0;for(let b=T,C=T+w;b<C;b++){const R=i.resolveTriangleIndex(b);he(h,3*R,c,l),h.needsUpdate=!0;const I=h.distanceToTriangle(d,g,m);if(I<v&&(_.copy(g),p&&p.copy(m),v=I,x=b,y=P),I<s)return!0}}}}}),Qe.releasePrimitive(h),Qe.releasePrimitive(d),v===1/0?null:(n.point?n.point.copy(_):n.point=_.clone(),n.distance=v,n.faceIndex=x,r&&(r.point?r.point.copy(p):r.point=p.clone(),r.point.applyMatrix4(Is),_.applyMatrix4(Is),r.distance=_.sub(r.point).length(),r.faceIndex=y),n)}function Kc(i,t,e){return i===null?null:(i.point.applyMatrix4(t.matrixWorld),i.distance=i.point.distanceTo(e.ray.origin),i.object=t,i)}const Ds=new ze,Us=new kr,Zc=new L,Jc=new Bt,Qc=new L,aa=["getX","getY","getZ"];class Qs extends Q0{static serialize(t,e={}){e={cloneBuffers:!0,...e};const n=t.geometry,r=t._roots,s=t._indirectBuffer,o=n.getIndex(),a={version:1,roots:null,index:null,indirectBuffer:null};return e.cloneBuffers?(a.roots=r.map(l=>l.slice()),a.index=o?o.array.slice():null,a.indirectBuffer=s?s.slice():null):(a.roots=r,a.index=o?o.array:null,a.indirectBuffer=s),a}static deserialize(t,e,n={}){n={setIndex:!0,indirect:!!t.indirectBuffer,...n};const{index:r,roots:s,indirectBuffer:o}=t;t.version||(console.warn("MeshBVH.deserialize: Serialization format has been changed and will be fixed up. It is recommended to regenerate any stored serialized data."),l(s));const a=new Qs(e,{...n,[za]:!0});if(a._roots=s,a._indirectBuffer=o||null,n.setIndex){const c=e.getIndex();if(c===null){const u=new ke(t.index,1,!1);e.setIndex(u)}else c.array!==r&&(c.array.set(r),c.needsUpdate=!0)}return a;function l(c){for(let u=0;u<c.length;u++){const f=c[u],h=new Uint32Array(f),d=new Uint16Array(f);for(let g=0,_=f.byteLength/Re;g<_;g++){const m=fe*g,p=2*m;de(p,d)||(h[m+6]=h[m+6]/fe-g)}}}}get primitiveStride(){return 3}get resolveTriangleIndex(){return this.resolvePrimitiveIndex}constructor(t,e={}){e.maxLeafTris&&(console.warn('MeshBVH: "maxLeafTris" option has been deprecated. Use maxLeafSize, instead.'),e={...e,maxLeafSize:e.maxLeafTris}),super(t,e)}shiftTriangleOffsets(t){return super.shiftPrimitiveOffsets(t)}writePrimitiveBounds(t,e,n){const r=this.geometry,s=this._indirectBuffer,o=r.attributes.position,a=r.index?r.index.array:null,c=(s?s[t]:t)*3;let u=c+0,f=c+1,h=c+2;a&&(u=a[u],f=a[f],h=a[h]);for(let d=0;d<3;d++){const g=o[aa[d]](u),_=o[aa[d]](f),m=o[aa[d]](h);let p=g;_<p&&(p=_),m<p&&(p=m);let v=g;_>v&&(v=_),m>v&&(v=m),e[n+d]=p,e[n+d+3]=v}return e}computePrimitiveBounds(t,e,n){const r=this.geometry,s=this._indirectBuffer,o=r.attributes.position,a=r.index?r.index.array:null,l=o.normalized;if(t<0||e+t-n.offset>n.length/6)throw new Error("MeshBVH: compute triangle bounds range is invalid.");const c=o.array,u=o.offset||0;let f=3;o.isInterleavedBufferAttribute&&(f=o.data.stride);const h=["getX","getY","getZ"],d=n.offset;for(let g=t,_=t+e;g<_;g++){const p=(s?s[g]:g)*3,v=(g-d)*6;let x=p+0,y=p+1,T=p+2;a&&(x=a[x],y=a[y],T=a[T]),l||(x=x*f+u,y=y*f+u,T=T*f+u);for(let w=0;w<3;w++){let S,P,M;l?(S=o[h[w]](x),P=o[h[w]](y),M=o[h[w]](T)):(S=c[x+w],P=c[y+w],M=c[T+w]);let b=S;P<b&&(b=P),M<b&&(b=M);let C=S;P>C&&(C=P),M>C&&(C=M);const R=(C-b)/2,I=w*2;n[v+I+0]=b+R,n[v+I+1]=R+(Math.abs(b)+R)*ks}}return n}raycastObject3D(t,e,n=[]){const{material:r}=t;if(r===void 0)return;Jc.copy(t.matrixWorld).invert(),Us.copy(e.ray).applyMatrix4(Jc),Qc.setFromMatrixScale(t.matrixWorld),Zc.copy(Us.direction).multiply(Qc);const s=Zc.length(),o=e.near/s,a=e.far/s;if(e.firstHitOnly===!0){let l=this.raycastFirst(Us,r,o,a);l=Kc(l,t,e),l&&n.push(l)}else{const l=this.raycast(Us,r,o,a);for(let c=0,u=l.length;c<u;c++){const f=Kc(l[c],t,e);f&&n.push(f)}}return n}refit(t=null){return(this.indirect?S_:u_)(this,t)}raycast(t,e=on,n=0,r=1/0){const s=this._roots,o=[],a=this.indirect?w_:p_;for(let l=0,c=s.length;l<c;l++)a(this,l,e,t,o,n,r);return o}raycastFirst(t,e=on,n=0,r=1/0){const s=this._roots;let o=null;const a=this.indirect?T_:g_;for(let l=0,c=s.length;l<c;l++){const u=a(this,l,e,t,n,r);u!=null&&(o==null||u.distance<o.distance)&&(o=u)}return o}intersectsGeometry(t,e){let n=!1;const r=this._roots,s=this.indirect?A_:__;for(let o=0,a=r.length;o<a&&(n=s(this,o,t,e),!n);o++);return n}shapecast(t){const e=Qe.getPrimitive(),n=super.shapecast({...t,intersectsPrimitive:t.intersectsTriangle,scratchPrimitive:e,iterate:this.indirect?d_:c_});return Qe.releasePrimitive(e),n}bvhcast(t,e,n){let{intersectsRanges:r,intersectsTriangles:s}=n;const o=Qe.getPrimitive(),a=this.geometry.index,l=this.geometry.attributes.position,c=this.indirect?g=>{const _=this.resolveTriangleIndex(g);he(o,_*3,a,l)}:g=>{he(o,g*3,a,l)},u=Qe.getPrimitive(),f=t.geometry.index,h=t.geometry.attributes.position,d=t.indirect?g=>{const _=t.resolveTriangleIndex(g);he(u,_*3,f,h)}:g=>{he(u,g*3,f,h)};if(s){if(!(t instanceof Qs))throw new Error('MeshBVH: "intersectsTriangles" callback can only be used with another MeshBVH.');const g=(_,m,p,v,x,y,T,w)=>{for(let S=p,P=p+v;S<P;S++){d(S),u.a.applyMatrix4(e),u.b.applyMatrix4(e),u.c.applyMatrix4(e),u.needsUpdate=!0;for(let M=_,b=_+m;M<b;M++)if(c(M),o.needsUpdate=!0,s(o,u,M,S,x,y,T,w))return!0}return!1};if(r){const _=r;r=function(m,p,v,x,y,T,w,S){return _(m,p,v,x,y,T,w,S)?!0:g(m,p,v,x,y,T,w,S)}}else r=g}return super.bvhcast(t,e,{intersectsRanges:r})}intersectsBox(t,e){return Ds.set(t.min,t.max,e),Ds.needsUpdate=!0,this.shapecast({intersectsBounds:n=>Ds.intersectsBox(n),intersectsTriangle:n=>Ds.intersectsTriangle(n)})}intersectsSphere(t){return this.shapecast({intersectsBounds:e=>t.intersectsBox(e),intersectsTriangle:e=>e.intersectsSphere(t)})}closestPointToGeometry(t,e,n={},r={},s=0,o=1/0){return(this.indirect?I_:M_)(this,t,e,n,r,s,o)}closestPointToPoint(t,e={},n=0,r=1/0){return r_(this,t,e,n,r)}}const Qi={Mesh:It.prototype.raycast,Line:so.prototype.raycast,LineSegments:Nu.prototype.raycast,LineLoop:Ou.prototype.raycast,Points:Fa.prototype.raycast,BatchedMesh:x0.prototype.raycast},Ee=new It,Ns=[];function D_(i,t){if(this.isBatchedMesh)U_.call(this,i,t);else{const{geometry:e}=this;if(e.boundsTree)e.boundsTree.raycastObject3D(this,i,t);else{let n;if(this instanceof It)n=Qi.Mesh;else if(this instanceof Nu)n=Qi.LineSegments;else if(this instanceof Ou)n=Qi.LineLoop;else if(this instanceof so)n=Qi.Line;else if(this instanceof Fa)n=Qi.Points;else throw new Error("BVH: Fallback raycast function not found.");n.call(this,i,t)}}}function U_(i,t){if(this.boundsTrees){const e=this.boundsTrees,n=this._drawInfo||this._instanceInfo,r=this._drawRanges||this._geometryInfo,s=this.matrixWorld;Ee.material=this.material,Ee.geometry=this.geometry;const o=Ee.geometry.boundsTree,a=Ee.geometry.drawRange;Ee.geometry.boundingSphere===null&&(Ee.geometry.boundingSphere=new pn);for(let l=0,c=n.length;l<c;l++){if(!this.getVisibleAt(l))continue;const u=n[l].geometryIndex;if(Ee.geometry.boundsTree=e[u],this.getMatrixAt(l,Ee.matrixWorld).premultiply(s),!Ee.geometry.boundsTree){this.getBoundingBoxAt(u,Ee.geometry.boundingBox),this.getBoundingSphereAt(u,Ee.geometry.boundingSphere);const f=r[u];Ee.geometry.setDrawRange(f.start,f.count)}Ee.raycast(i,Ns);for(let f=0,h=Ns.length;f<h;f++){const d=Ns[f];d.object=this,d.batchId=l,t.push(d)}Ns.length=0}Ee.geometry.boundsTree=o,Ee.geometry.drawRange=a,Ee.material=null,Ee.geometry=null}else Qi.BatchedMesh.call(this,i,t)}function N_(i={}){const{type:t=Qs}=i;return this.boundsTree=new t(this,i),this.boundsTree}function O_(){this.boundsTree=null}const Nr=64,Xn=64,tr=32,er=32,gi=18,_i=45,xi=18,vi=45,La=6,B_=30,F_=33,Os=32,k_=3;function ar(i,t){let e=i*374761393+t*1234567891|0;return e=(e^e>>13)*1274126177|0,e>>>0}function z_(i,t){return i>=gi&&i<=_i&&t>=xi&&t<=vi}function H_(i){G_(i),W_(i),$_(i),j_(i),Y_(i),K_(i)}function Ia(i){const t=i==="north"?2:61,e=[];for(let n=24;n<=40;n+=2)e.push([n,t]);return e}function G_(i){for(let t=0;t<Nr;t++)for(let e=0;e<Xn;e++){if(z_(t,e)){i.setBlock(t,0,e,"stone");continue}if(e<=8||e>=Xn-9){i.setBlock(t,0,e,"grass");continue}const n=V_(t,e),r=Math.floor(n*2.5);if(r>0)for(let s=0;s<r;s++)i.setBlock(t,s,e,"dirt");i.setBlock(t,r,e,"grass")}}function V_(i,t){const e=ar(Math.floor(i/6),Math.floor(t/6))%1e3/1e3,n=ar(Math.floor(i/3),Math.floor(t/3))%1e3/1e3*.5,r=ar(i,t)%1e3/1e3*.1;return(e+n+r)/1.6}function W_(i){X_(i),q_(i)}function X_(i){for(let t=gi;t<=_i;t++)for(let e=xi;e<=vi;e++){const n=t<=gi+1,r=t>=_i-1,s=e<=xi+1,o=e>=vi-1;if(!(n||r||s||o))continue;const a=t>=B_&&t<=F_,l=s&&a,c=o&&a;for(let u=1;u<=La;u++)(l||c)&&u<=k_||i.setBlock(t,u,e,"stone");(t+e)%2===0&&i.setBlock(t,La+1,e,"stone")}}function q_(i){const t=[[gi,xi],[_i-2,xi],[gi,vi-2],[_i-2,vi-2]];for(const[e,n]of t)for(let r=0;r<3;r++)for(let s=0;s<3;s++)for(let o=1;o<=La+2;o++)i.setBlock(e+r,o,n+s,"stone")}function j_(i){for(let t=2;t<Nr-2;t++)for(let e=2;e<Xn-2;e++){if(t>=gi-8&&t<=_i+8&&e>=xi-8&&e<=vi+8||e<=7||e>=Xn-8||ar(t,e)%16!==0)continue;const r=4+ar(t*3,e*7)%3;for(let s=1;s<=r;s++)i.setBlock(t,s,e,"wood");for(let s=r-1;s<=r+1;s++){const o=s<=r?2:1;for(let a=-o;a<=o;a++)for(let l=-o;l<=o;l++){if(Math.abs(a)===o&&Math.abs(l)===o)continue;const c=t+a,u=e+l;c<0||u<0||c>=Nr||u>=Xn||i.getBlock(c,s,u)==="air"&&i.setBlock(c,s,u,"leaves")}}i.setBlock(t,r+2,e,"leaves")}}function Y_(i){for(let t=6;t<Nr-6;t+=6)for(let e=6;e<Xn-6;e+=6){if(t>=gi-6&&t<=_i+6&&e>=xi-6&&e<=vi+6||e<=10||e>=Xn-11)continue;const n=ar(t*7,e*13);if(n%4!==0)continue;const r=n%3===0?"iron_ore":"coal_ore";for(let s=-1;s<=1;s++)for(let o=-1;o<=1;o++)i.setBlock(t+s,1,e+o,"stone");i.setBlock(t,2,e,r)}}function $_(i){for(let n=0;n<8;n++){const r=n/8*Math.PI*2,s=Math.round(32+Math.cos(r)*2),o=Math.round(32+Math.sin(r)*2);i.setBlock(s,1,o,"cobblestone"),i.setBlock(s,2,o,"cobblestone")}i.setBlock(32,0,32,"stone");for(let n=0;n<3;n++)i.setBlock(38+n,1,28,"planks"),i.setBlock(38+n,1,31,"planks"),i.setBlock(38+n,2,28,"planks"),i.setBlock(38+n,2,31,"planks"),i.setBlock(38+n,3,28,"wood"),i.setBlock(38+n,3,31,"wood");i.setBlock(38,1,29,"planks"),i.setBlock(38,1,30,"planks"),i.setBlock(38,2,29,"planks"),i.setBlock(38,2,30,"planks");for(let n=0;n<3;n++)for(let r=0;r<4;r++)i.setBlock(38+n,4,28+r,"planks");i.setBlock(39,1,29,"crafting_table"),i.setBlock(39,1,30,"furnace")}function K_(i){for(let t=1;t<=5;t++)i.setBlock(Os,t,2,"obsidian"),i.setBlock(Os+1,t,2,"obsidian"),i.setBlock(Os,t,61,"obsidian"),i.setBlock(Os+1,t,61,"obsidian")}Ie.prototype.computeBoundsTree=N_;Ie.prototype.disposeBoundsTree=O_;It.prototype.raycast=D_;const Or={air:{id:"air",name:"Air",color:0,hardness:0,placeable:!1,transparent:!0},grass:{id:"grass",name:"Grass",color:6135354,topColor:6135354,bottomColor:9133098,hardness:1,placeable:!0,transparent:!1},dirt:{id:"dirt",name:"Dirt",color:9133098,hardness:1,placeable:!0,transparent:!1},stone:{id:"stone",name:"Stone",color:8947848,hardness:3,placeable:!0,transparent:!1},wood:{id:"wood",name:"Wood",color:7031850,hardness:2,placeable:!0,transparent:!1},planks:{id:"planks",name:"Planks",color:13148256,hardness:2,placeable:!0,transparent:!1},cobblestone:{id:"cobblestone",name:"Cobblestone",color:8945776,hardness:3,placeable:!0,transparent:!1},sand:{id:"sand",name:"Sand",color:13943940,hardness:1,placeable:!0,transparent:!1},glass:{id:"glass",name:"Glass",color:8965358,hardness:1,placeable:!0,transparent:!0},leaves:{id:"leaves",name:"Leaves",color:3832357,hardness:.5,placeable:!0,transparent:!0},obsidian:{id:"obsidian",name:"Obsidian",color:1706538,hardness:10,placeable:!0,transparent:!1},iron_ore:{id:"iron_ore",name:"Iron Ore",color:8939093,hardness:4,placeable:!0,transparent:!1},coal_ore:{id:"coal_ore",name:"Coal Ore",color:4473924,hardness:3,placeable:!0,transparent:!1},iron_block:{id:"iron_block",name:"Iron Block",color:11184810,hardness:5,placeable:!0,transparent:!1},crafting_table:{id:"crafting_table",name:"Crafting Table",color:9133098,hardness:2,placeable:!0,transparent:!1},furnace:{id:"furnace",name:"Furnace",color:7829367,hardness:3,placeable:!0,transparent:!1},torch:{id:"torch",name:"Torch",color:16755234,hardness:0,placeable:!0,transparent:!0}},Wu=Object.keys(Or),Xu={};Wu.forEach((i,t)=>{Xu[i]=t});const jt=16,Hs=32,Ki=1;class Z_{constructor(t,e){Object.defineProperty(this,"cx",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"cz",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"data",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"mesh",{enumerable:!0,configurable:!0,writable:!0,value:null}),Object.defineProperty(this,"dirty",{enumerable:!0,configurable:!0,writable:!0,value:!0}),this.cx=t,this.cz=e,this.data=new Uint8Array(jt*Hs*jt)}getBlock(t,e,n){return t<0||t>=jt||e<0||e>=Hs||n<0||n>=jt?"air":Wu[this.data[t+n*jt+e*jt*jt]]}setBlock(t,e,n,r){t<0||t>=jt||e<0||e>=Hs||n<0||n>=jt||(this.data[t+n*jt+e*jt*jt]=Xu[r],this.dirty=!0)}}class J_{constructor(t){Object.defineProperty(this,"chunks",{enumerable:!0,configurable:!0,writable:!0,value:new Map}),Object.defineProperty(this,"scene",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"chunkMeshGroup",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.scene=t,this.chunkMeshGroup=new Hn,t.add(this.chunkMeshGroup)}key(t,e){return`${t},${e}`}getChunk(t,e){const n=this.key(t,e);return this.chunks.has(n)||this.chunks.set(n,new Z_(t,e)),this.chunks.get(n)}getBlock(t,e,n){const r=Math.floor(t/jt),s=Math.floor(n/jt),o=(t%jt+jt)%jt,a=(n%jt+jt)%jt;return this.getChunk(r,s).getBlock(o,e,a)}setBlock(t,e,n,r){const s=Math.floor(t/jt),o=Math.floor(n/jt),a=t-s*jt,l=n-o*jt;this.getChunk(s,o).setBlock(a,e,l,r),a===0&&(this.getChunk(s-1,o).dirty=!0),a===jt-1&&(this.getChunk(s+1,o).dirty=!0),l===0&&(this.getChunk(s,o-1).dirty=!0),l===jt-1&&(this.getChunk(s,o+1).dirty=!0)}rebuildDirtyChunks(){this.chunks.forEach(t=>{t.dirty&&(t.dirty=!1,this.rebuildChunkMesh(t))})}rebuildChunkMesh(t){t.mesh&&(this.chunkMeshGroup.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),t.mesh=null);const e=[],n=[],r=[],s=[];let o=0;const a=(h,d,g,_,m,p,v,x,y,T,w,S,P,M,b,C)=>{const R=P*C,I=M*C,O=b*C;e.push(h,d,g,h+_,d+m,g+p,h+v,d+x,g+y,h+_+v,d+m+x,g+p+y);for(let k=0;k<4;k++)n.push(T,w,S);for(let k=0;k<4;k++)r.push(R,I,O);s.push(o,o+1,o+2,o+1,o+3,o+2),o+=4},l=t.cx*jt,c=t.cz*jt;for(let h=0;h<jt;h++)for(let d=0;d<Hs;d++)for(let g=0;g<jt;g++){const _=t.getBlock(h,d,g);if(_==="air")continue;const m=Or[_],p=l+h,v=d,x=c+g,y=m.color,T=(y>>16&255)/255,w=(y>>8&255)/255,S=(y&255)/255,P=m.topColor??m.color,M=(P>>16&255)/255,b=(P>>8&255)/255,C=(P&255)/255,R=(Math.sin(p*127.1+v*311.7+x*74.7)*.5+.5-.5)*.07,I=z=>Math.max(0,Math.min(1,z)),O=[[0,1,0],[0,-1,0],[1,0,0],[-1,0,0],[0,0,1],[0,0,-1]],k=[{n:[0,1,0],a:[1,0,0],b:[0,0,1],shade:1,cr:I(M+R),cg:I(b+R),cb:I(C+R)},{n:[0,-1,0],a:[0,0,1],b:[1,0,0],shade:.45,cr:I(T+R),cg:I(w+R),cb:I(S+R)},{n:[1,0,0],a:[0,0,1],b:[0,1,0],shade:.8,cr:I(T+R),cg:I(w+R),cb:I(S+R)},{n:[-1,0,0],a:[0,1,0],b:[0,0,1],shade:.7,cr:I(T+R),cg:I(w+R),cb:I(S+R)},{n:[0,0,1],a:[0,1,0],b:[1,0,0],shade:.6,cr:I(T+R),cg:I(w+R),cb:I(S+R)},{n:[0,0,-1],a:[1,0,0],b:[0,1,0],shade:.6,cr:I(T+R),cg:I(w+R),cb:I(S+R)}];for(let z=0;z<6;z++){const[j,W,lt]=O[z],ht=this.getBlock(p+j,v+W,x+lt);if(ht!=="air"&&!Or[ht].transparent)continue;const nt=k[z];a(p+(nt.n[0]<0?0:nt.n[0]>0?1:0),v+(nt.n[1]<0?0:nt.n[1]>0?1:0),x+(nt.n[2]<0?0:nt.n[2]>0?1:0),nt.a[0]*Ki,nt.a[1]*Ki,nt.a[2]*Ki,nt.b[0]*Ki,nt.b[1]*Ki,nt.b[2]*Ki,nt.n[0],nt.n[1],nt.n[2],nt.cr,nt.cg,nt.cb,nt.shade)}}if(e.length===0)return;const u=new Ie;u.setAttribute("position",new me(e,3)),u.setAttribute("normal",new me(n,3)),u.setAttribute("color",new me(r,3)),u.setIndex(s),u.computeBoundsTree();const f=new ue({vertexColors:!0,side:on});t.mesh=new It(u,f),t.mesh.receiveShadow=!0,t.mesh.castShadow=!1,this.chunkMeshGroup.add(t.mesh)}getChunkMeshes(){const t=[];return this.chunks.forEach(e=>{e.mesh&&t.push(e.mesh)}),t}}class Q_{constructor(t){Object.defineProperty(this,"world",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.world=new J_(t),H_(this.world),this.world.rebuildDirtyChunks()}getChunkMeshes(){return this.world.getChunkMeshes()}}const be=Nr,bn=Xn,la=[-1,1,0,0,-1,-1,1,1],ca=[0,0,-1,1,-1,1,-1,1],tx=[1,1,1,1,1.414,1.414,1.414,1.414];class ex{constructor(t){Object.defineProperty(this,"world",{enumerable:!0,configurable:!0,writable:!0,value:t}),Object.defineProperty(this,"dist",{enumerable:!0,configurable:!0,writable:!0,value:new Float32Array(be*bn).fill(1/0)}),Object.defineProperty(this,"dirX",{enumerable:!0,configurable:!0,writable:!0,value:new Float32Array(be*bn)}),Object.defineProperty(this,"dirZ",{enumerable:!0,configurable:!0,writable:!0,value:new Float32Array(be*bn)})}recompute(t,e){this.dist.fill(1/0);const n=Math.max(0,Math.min(be-1,Math.floor(t))),r=Math.max(0,Math.min(bn-1,Math.floor(e))),s=[];this.dist[r*be+n]=0,s.push(r*be+n);let o=0;for(;o<s.length;){const a=s[o++],l=a%be,c=a/be|0,u=this.dist[a];for(let f=0;f<8;f++){const h=l+la[f],d=c+ca[f];if(h<0||h>=be||d<0||d>=bn||!this.isPassable(h,d))continue;const g=u+tx[f],_=d*be+h;g<this.dist[_]&&(this.dist[_]=g,s.push(_))}}this.computeDirections()}getFlowDirection(t,e){const n=Math.max(0,Math.min(be-1,Math.floor(t))),s=Math.max(0,Math.min(bn-1,Math.floor(e)))*be+n;return{dx:this.dirX[s],dz:this.dirZ[s]}}getDistance(t,e){const n=Math.max(0,Math.min(be-1,Math.floor(t))),r=Math.max(0,Math.min(bn-1,Math.floor(e)));return this.dist[r*be+n]}isPassable(t,e){return this.world.getBlock(t,1,e)==="air"}computeDirections(){for(let t=0;t<bn;t++)for(let e=0;e<be;e++){let n=0,r=0,s=1/0;for(let l=0;l<8;l++){const c=e+la[l],u=t+ca[l];if(c<0||c>=be||u<0||u>=bn)continue;const f=this.dist[u*be+c];f<s&&(s=f,n=la[l],r=ca[l])}const o=Math.sqrt(n*n+r*r),a=t*be+e;this.dirX[a]=o>0?n/o:0,this.dirZ[a]=o>0?r/o:0}}}const tu=.3,nx=.9,eu=.3;function ix(i){return{min:new L(i.x-tu,i.y,i.z-eu),max:new L(i.x+tu,i.y+nx*2,i.z+eu)}}function rx(i,t,e,n){const r=i.getBlock(t,e,n);return r==="air"?!1:!Or[r].transparent}function Zi(i,t){const e=ix(t),n=Math.floor(e.min.x),r=Math.floor(e.max.x-.001),s=Math.floor(e.min.y),o=Math.floor(e.max.y-.001),a=Math.floor(e.min.z),l=Math.floor(e.max.z-.001);for(let c=n;c<=r;c++)for(let u=s;u<=o;u++)for(let f=a;f<=l;f++)if(rx(i,c,u,f))return!0;return!1}function sx(i,t,e,n){const r=e.clone();let s=t.clone(),o=!1;r.y-=22*n;const a=r.y*n,l=s.clone();if(l.y+=a,Zi(i,l)?(a<0&&(o=!0),r.y=0):s=l,!o){const d=s.clone();d.y-=.05,Zi(i,d)&&(o=!0)}const c=r.x*n,u=s.clone();if(u.x+=c,Zi(i,u)){const d=u.clone();d.y+=1,Zi(i,d)?r.x=0:s=d}else s=u;const f=r.z*n,h=s.clone();if(h.z+=f,Zi(i,h)){const d=h.clone();d.y+=1,Zi(i,d)?r.z=0:s=d}else s=h;return{newPos:s,newVel:r,onGround:o}}const ox=5,ax=1.6,lx=7.5,cx=1.62,ux=.5,nu=1.5,hx=2.5,fx=2;class dx{constructor(t,e,n=32,r=32){Object.defineProperty(this,"world",{enumerable:!0,configurable:!0,writable:!0,value:t}),Object.defineProperty(this,"camera",{enumerable:!0,configurable:!0,writable:!0,value:e}),Object.defineProperty(this,"position",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"velocity",{enumerable:!0,configurable:!0,writable:!0,value:new L}),Object.defineProperty(this,"onGround",{enumerable:!0,configurable:!0,writable:!0,value:!1}),Object.defineProperty(this,"health",{enumerable:!0,configurable:!0,writable:!0,value:20}),Object.defineProperty(this,"maxHealth",{enumerable:!0,configurable:!0,writable:!0,value:20}),Object.defineProperty(this,"hunger",{enumerable:!0,configurable:!0,writable:!0,value:20}),Object.defineProperty(this,"xp",{enumerable:!0,configurable:!0,writable:!0,value:0}),Object.defineProperty(this,"level",{enumerable:!0,configurable:!0,writable:!0,value:0}),Object.defineProperty(this,"armorValue",{enumerable:!0,configurable:!0,writable:!0,value:0}),Object.defineProperty(this,"attackCooldown",{enumerable:!0,configurable:!0,writable:!0,value:0}),Object.defineProperty(this,"bowCharge",{enumerable:!0,configurable:!0,writable:!0,value:0}),Object.defineProperty(this,"isBowCharging",{enumerable:!0,configurable:!0,writable:!0,value:!1}),Object.defineProperty(this,"onDeath",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}}),Object.defineProperty(this,"_lookDir",{enumerable:!0,configurable:!0,writable:!0,value:new L}),Object.defineProperty(this,"_euler",{enumerable:!0,configurable:!0,writable:!0,value:new je(0,0,0,"YXZ")}),this.position=new L(n,1,r)}update(t,e){this.attackCooldown=Math.max(0,this.attackCooldown-t),this.isBowCharging&&(this.bowCharge=Math.min(nu,this.bowCharge+t)),this.applyMovement(t,e),this.camera.position.copy(this.getCameraPosition())}tryMeleeAttack(){if(this.attackCooldown>0)return null;this.attackCooldown=ux;const t=this.getLookDirection();return{center:this.getCameraPosition().addScaledVector(t,fx).add(new L(0,-.3,0)),radius:hx}}startBowCharge(){this.isBowCharging||(this.isBowCharging=!0,this.bowCharge=0)}releaseBow(){if(!this.isBowCharging)return null;const t=Math.min(1,this.bowCharge/nu);return this.isBowCharging=!1,this.bowCharge=0,t<.1?null:{power:t,from:this.getCameraPosition(),direction:this.getLookDirection()}}getCameraPosition(){return this.position.clone().add(new L(0,cx,0))}getLookDirection(){return this.camera.getWorldDirection(this._lookDir),this._lookDir.clone()}getYaw(){return this._euler.setFromQuaternion(this.camera.quaternion),this._euler.y}damage(t){const e=Math.max(1,t-this.armorValue/5),n=this.health;this.health=Math.max(0,this.health-e),n>0&&this.health===0&&this.onDeath()}heal(t){this.health=Math.min(this.maxHealth,this.health+t)}addXP(t){this.xp+=t;const e=[0,50,150,350,700,1200];for(;this.level<e.length-1&&this.xp>=e[this.level+1];)this.level++,this.maxHealth+=2,this.health=Math.min(this.health+2,this.maxHealth)}applyMovement(t,e){const n=this.getYaw();let r=ox;e.sprint&&(r*=ax);const s=new L;e.forward&&(s.z-=1),e.backward&&(s.z+=1),e.left&&(s.x-=1),e.right&&(s.x+=1),s.lengthSq()>0&&(s.normalize().multiplyScalar(r),s.applyAxisAngle(new L(0,1,0),n)),this.velocity.x=s.x,this.velocity.z=s.z,e.jump&&this.onGround&&(this.velocity.y=lx);const o=sx(this.world,this.position,this.velocity,t);this.position.copy(o.newPos),this.velocity.copy(o.newVel),this.onGround=o.onGround,this.position.x=Math.max(.31,Math.min(63.69,this.position.x)),this.position.z=Math.max(.31,Math.min(63.69,this.position.z))}}const Lr=9,px=27;class mx{constructor(){Object.defineProperty(this,"hotbar",{enumerable:!0,configurable:!0,writable:!0,value:Array(Lr).fill(null)}),Object.defineProperty(this,"backpack",{enumerable:!0,configurable:!0,writable:!0,value:Array(px).fill(null)}),Object.defineProperty(this,"armor",{enumerable:!0,configurable:!0,writable:!0,value:{head:null,chest:null,legs:null,feet:null}}),Object.defineProperty(this,"_activeSlot",{enumerable:!0,configurable:!0,writable:!0,value:0})}get activeSlot(){return this._activeSlot}set activeSlot(t){this._activeSlot=Math.max(0,Math.min(8,t))}getActiveItem(){return this.hotbar[this._activeSlot]}addItem(t,e){const n=dn[t];if(!n)return e;const r=n.stackSize;for(const o of[...this.hotbar,...this.backpack]){if(!o||o.itemId!==t)continue;const a=r-o.count;if(a<=0)continue;const l=Math.min(a,e);if(o.count+=l,e-=l,e===0)return 0}const s=[...this.hotbar,...this.backpack];for(let o=0;o<s.length;o++){if(s[o]!==null)continue;const a=Math.min(r,e),l={itemId:t,count:a,durability:n.durability!==void 0?n.durability:void 0};if(o<Lr?this.hotbar[o]=l:this.backpack[o-Lr]=l,e-=a,e===0)return 0}return e}removeItem(t,e){if(!this.hasItem(t,e))return!1;let n=e;const r=[...this.hotbar,...this.backpack];for(let s=0;s<r.length&&n>0;s++){const o=r[s];if(!o||o.itemId!==t)continue;const a=Math.min(o.count,n);o.count-=a,n-=a,o.count===0&&(s<Lr?this.hotbar[s]=null:this.backpack[s-Lr]=null)}return!0}hasItem(t,e=1){let n=0;for(const r of[...this.hotbar,...this.backpack])(r==null?void 0:r.itemId)===t&&(n+=r.count);return n>=e}countItem(t){let e=0;for(const n of[...this.hotbar,...this.backpack])(n==null?void 0:n.itemId)===t&&(e+=n.count);return e}getArmorValue(){let t=0;for(const e of Object.values(this.armor)){if(!e)continue;const n=dn[e.itemId];n!=null&&n.armorValue&&(t+=n.armorValue)}return t}setSlot(t,e,n){t==="hotbar"?this.hotbar[e]=n:this.backpack[e]=n}}const iu={zombie:{type:"zombie",name:"Zombie",maxHealth:60,speed:1.8,reward:10,damage:1,color:3832378,headColor:13152400,scale:1},spider:{type:"spider",name:"Spider",maxHealth:35,speed:3.4,reward:15,damage:1,color:1710618,headColor:1710618,scale:.75},golem:{type:"golem",name:"Stone Golem",maxHealth:280,speed:.9,reward:40,damage:3,color:8947848,headColor:6710886,scale:1.5},goblin:{type:"goblin",name:"Goblin",maxHealth:40,speed:3.8,reward:8,damage:1,color:3828250,headColor:5933610,scale:.75,xpReward:5},orc:{type:"orc",name:"Orc",maxHealth:150,speed:2,reward:18,damage:2,color:8014362,headColor:11168304,scale:1.1,xpReward:15},troll:{type:"troll",name:"Troll",maxHealth:400,speed:.9,reward:45,damage:4,color:5596740,headColor:4478259,scale:1.6,xpReward:40},goblin_miner:{type:"goblin_miner",name:"Goblin Miner",maxHealth:80,speed:1.5,reward:20,damage:1,color:8939042,headColor:11176004,scale:.85,canBreakWalls:!0,xpReward:20}},ua=1.5,gx=2,_x=3,ru=new Set(["goblin","orc","troll","goblin_miner","zombie","spider","golem"]);class xx{constructor(t,e){Object.defineProperty(this,"scene",{enumerable:!0,configurable:!0,writable:!0,value:t}),Object.defineProperty(this,"camera",{enumerable:!0,configurable:!0,writable:!0,value:e}),Object.defineProperty(this,"enemies",{enumerable:!0,configurable:!0,writable:!0,value:new Map}),Object.defineProperty(this,"meshes",{enumerable:!0,configurable:!0,writable:!0,value:new Map}),Object.defineProperty(this,"healthBars",{enumerable:!0,configurable:!0,writable:!0,value:new Map}),Object.defineProperty(this,"idCounter",{enumerable:!0,configurable:!0,writable:!0,value:0}),Object.defineProperty(this,"flowField",{enumerable:!0,configurable:!0,writable:!0,value:null}),Object.defineProperty(this,"world",{enumerable:!0,configurable:!0,writable:!0,value:null}),Object.defineProperty(this,"onEnemyReachedBase",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}}),Object.defineProperty(this,"onEnemyDied",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}}),Object.defineProperty(this,"onWallBroken",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}})}setFlowField(t){this.flowField=t}setWorld(t){this.world=t}spawn(t,e,n){const r=iu[t],s=this.idCounter++,o={id:s,config:r,health:r.maxHealth,waypointIndex:1,speed:r.speed,slowTimer:0,alive:!0,dying:!1,dyingTimer:0,movePhase:Math.random()*Math.PI*2,useFlowField:ru.has(t),breakTarget:null,breakTimer:0};this.enemies.set(s,o);const a=this.buildMesh(t,r.scale);if(ru.has(t)){let c,u;if(e!==void 0&&n!==void 0)c=e,u=n;else{const f=Ia("north");[c,u]=f[Math.floor(Math.random()*f.length)],c+=.5,u+=.5}a.position.set(c,ua,u)}else{const c=Ia("north"),[u,f]=c[Math.floor(Math.random()*c.length)];a.position.set(u+.5,ua,f+.5)}this.scene.add(a),this.meshes.set(s,a);const l=this.buildHealthBar();return this.scene.add(l.bg),this.scene.add(l.bar),this.healthBars.set(s,l),s}update(t){for(const[e,n]of this.enemies){if(!n.alive)continue;if(n.dying){n.dyingTimer-=t;const s=this.meshes.get(e);s.rotation.x+=t*4,s.scale.multiplyScalar(1-t*3),n.dyingTimer<=0&&this.despawn(e);continue}n.slowTimer>0&&(n.slowTimer-=t,n.slowTimer<=0&&(n.speed=n.config.speed,this.clearSlowTint(e)));const r=this.meshes.get(e);this.flowField&&this.updateFlowFieldEnemy(e,n,r,t),this.updateHealthBar(e,n,r.position)}}damage(t,e,n=1,r=0){var o;const s=this.enemies.get(t);!s||!s.alive||s.dying||(s.health=Math.max(0,s.health-e),this.flashHit(t),n<1&&r>0&&(s.speed=Math.min(s.speed,s.config.speed*n),s.slowTimer=Math.max(s.slowTimer,r),this.applySlowTint(t)),this.updateHealthBar(t,s,((o=this.meshes.get(t))==null?void 0:o.position)??new L),s.health<=0&&(s.dying=!0,s.dyingTimer=.4,this.onEnemyDied(s)))}getAliveEnemies(){return[...this.enemies.values()].filter(t=>t.alive&&!t.dying)}getEnemyPosition(t){var e;return((e=this.meshes.get(t))==null?void 0:e.position)??null}getEnemy(t){return this.enemies.get(t)}getEnemyMeshes(){return[...this.meshes.values()]}getMeshToId(){const t=new Map;return this.meshes.forEach((e,n)=>t.set(e,n)),t}reset(){for(const t of[...this.enemies.keys()])this.despawn(t);this.enemies.clear(),this.idCounter=0}getEnemyProgress(t){var r;const e=(r=this.meshes.get(t))==null?void 0:r.position;if(!e||!this.flowField)return 0;const n=this.flowField.getDistance(e.x,e.z);return isFinite(n)?1/(1+n):0}updateFlowFieldEnemy(t,e,n,r){const s=n.position,o=s.x-tr,a=s.z-er;if(Math.sqrt(o*o+a*a)<gx){e.alive=!1,this.despawn(t),this.onEnemyReachedBase(e);return}const l=this.flowField.getFlowDirection(s.x,s.z);if(e.config.canBreakWalls&&this.world){const c=Math.floor(s.x+l.dx),u=Math.floor(s.z+l.dz);if(c>=0&&u>=0&&this.world.getBlock(c,1,u)!=="air"){if((!e.breakTarget||e.breakTarget.x!==c||e.breakTarget.z!==u)&&(e.breakTarget={x:c,y:1,z:u},e.breakTimer=0),e.breakTimer=(e.breakTimer??0)+r,e.breakTimer>=_x){for(let h=1;h<=3;h++)this.world.getBlock(c,h,u)!=="air"&&this.world.setBlock(c,h,u,"air");this.world.rebuildDirtyChunks(),e.breakTarget=null,e.breakTimer=0,this.onWallBroken(c,u)}return}}if(l.dx!==0||l.dz!==0){s.x+=l.dx*e.speed*r,s.z+=l.dz*e.speed*r,s.y=ua;const c=Math.atan2(l.dx,l.dz);n.rotation.y=c}e.movePhase+=r*e.speed*4,this.animateLegs(t,e.movePhase)}buildMesh(t,e){const n=new Hn;return n.scale.setScalar(e),t==="spider"?this.buildSpiderMesh(n):this.buildHumanoidMesh(n,t),n}buildSpiderMesh(t){const e=new ue({color:1710618}),n=new It(new ne(.6,.3,.5),e);n.position.y=.15,n.castShadow=!0,t.add(n);const r=new ue({color:2763306}),s=new It(new ne(.3,.25,.3),r);s.position.set(.35,.2,0),t.add(s);const o=new ue({color:16711680,emissive:16711680,emissiveIntensity:.5});for(const l of[-.07,.07]){const c=new It(new ne(.06,.06,.01),o);c.position.set(.5,.22,l),t.add(c)}const a=new ue({color:1118481});for(let l=0;l<4;l++)for(const c of[-1,1]){const u=new It(new ne(.05,.05,.4),a);u.position.set(c*.35,.1,(l-1.5)*.18),u.rotation.z=c*.6,u.name=`leg_${l}_${c}`,t.add(u)}}buildHumanoidMesh(t,e){const n=iu[e],r=new ue({color:n.color}),s=new It(new ne(.5,.65,.3),r);s.position.y=.7,s.castShadow=!0,t.add(s);const o=new ue({color:n.headColor}),a=new It(new ne(.42,.42,.42),o);a.position.y=1.25,a.castShadow=!0,t.add(a);const l=e==="golem"?16729088:16777215,c=e==="golem"?16729088:8947848,u=new ue({color:l,emissive:c,emissiveIntensity:.5});for(const h of[-.1,.1]){const d=new It(new ne(.09,.09,.01),u);d.position.set(h,1.3,.22),t.add(d)}const f=new ue({color:n.color});for(const[h,d]of[[-.14,0],[.14,1]]){const g=new It(new ne(.22,.5,.22),f);g.position.set(h,.25,0),g.castShadow=!0,g.name=`leg_${d}`,t.add(g)}if(e==="golem"||e==="troll"){const h=new ue({color:6710886});for(const d of[-.35,.35]){const g=new It(new ne(.2,.2,.35),h);g.position.set(d,.95,0),t.add(g)}}if(e==="goblin_miner"){const h=new ue({color:8947848}),d=new It(new ne(.08,.08,.5),h);d.position.set(.35,.7,.2),d.rotation.x=Math.PI/4,t.add(d)}}animateLegs(t,e){const n=this.meshes.get(t);n&&n.traverse(r=>{if(r.name.startsWith("leg_")){const s=parseInt(r.name.split("_")[1]);r.rotation.x=Math.sin(e+s*Math.PI)*.5}})}buildHealthBar(){const t=new mi({color:3355443,side:Ze,depthTest:!1}),e=new It(new pr(.7,.1),t);e.renderOrder=1;const n=new mi({color:4521796,side:Ze,depthTest:!1}),r=new It(new pr(.7,.1),n);return r.renderOrder=2,{bar:r,bg:e}}updateHealthBar(t,e,n){const r=this.healthBars.get(t);if(!r)return;const s=e.config.type==="spider"?.6:1.7*e.config.scale,o=n.y+s;r.bg.position.set(n.x,o,n.z),r.bg.lookAt(this.camera.position);const a=Math.max(0,e.health/e.config.maxHealth),l=a>.5?4521796:a>.25?16755200:16720418;r.bar.material.color.setHex(l);const c=Math.max(.001,a);r.bar.scale.x=c,r.bar.position.set(n.x-(1-c)*.35,o,n.z),r.bar.lookAt(this.camera.position)}flashHit(t){const e=this.meshes.get(t);e&&e.traverse(n=>{const r=n;if(!r.isMesh)return;const s=r.material,o=s.emissive.getHex();s.emissive.setHex(16777215),s.emissiveIntensity=.8,setTimeout(()=>{s.emissive.setHex(o),s.emissiveIntensity=0},100)})}applySlowTint(t){const e=this.meshes.get(t);e&&e.traverse(n=>{const r=n;if(!r.isMesh)return;const s=r.material;s.emissive.setHex(3381759),s.emissiveIntensity=.3})}clearSlowTint(t){const e=this.meshes.get(t);e&&e.traverse(n=>{const r=n;if(!r.isMesh)return;const s=r.material;s.emissive.setHex(0),s.emissiveIntensity=0})}despawn(t){const e=this.meshes.get(t);e&&(this.scene.remove(e),e.traverse(r=>{if(r.isMesh){r.geometry.dispose();const s=r.material;Array.isArray(s)?s.forEach(o=>o.dispose()):s.dispose()}}),this.meshes.delete(t));const n=this.healthBars.get(t);n&&(this.scene.remove(n.bg),this.scene.remove(n.bar),n.bg.geometry.dispose(),n.bg.material.dispose(),n.bar.geometry.dispose(),n.bar.material.dispose(),this.healthBars.delete(t)),this.enemies.delete(t)}}const vx=200,yx=20,bx=.6,Mx=.9,Sx=20,wx=6,Ex=18,Tx=22;class Ax{constructor(t){Object.defineProperty(this,"scene",{enumerable:!0,configurable:!0,writable:!0,value:t}),Object.defineProperty(this,"pool",{enumerable:!0,configurable:!0,writable:!0,value:[]}),Object.defineProperty(this,"playerArrows",{enumerable:!0,configurable:!0,writable:!0,value:[]}),this.buildPool(),this.buildPlayerArrowPool()}buildPlayerArrowPool(){const t=new Zs(.04,.04,.6,4),e=new ue({color:9136404});for(let n=0;n<yx;n++){const r=new It(t,e);r.visible=!1,this.scene.add(r),this.playerArrows.push({active:!1,mesh:r,velocity:new L,damage:0,life:0})}}fireFromPlayer(t,e,n,r){const s=this.playerArrows.find(a=>!a.active);if(!s)return;s.active=!0,s.damage=r,s.life=wx,s.mesh.position.copy(t),s.mesh.visible=!0;const o=Ex+n*Tx;s.velocity.copy(e).multiplyScalar(o)}buildPool(){const t={arrow:new Zs(.04,.04,.5,4),cannonball:new Ur(.18,6,6),icebolt:new ne(.15,.15,.15)},e={arrow:new ue({color:9136404}),cannonball:new ue({color:3355443}),icebolt:new ue({color:10088191,emissive:4500223,emissiveIntensity:.4})};for(let n=0;n<vx;n++){const r=n%3===0?"arrow":n%3===1?"cannonball":"icebolt",s=new It(t[r],e[r].clone());s.visible=!1,s.castShadow=!1,this.scene.add(s),this.pool.push({active:!1,type:r,mesh:s,targetId:-1,damage:0,speed:0,aoeRadius:0,slowFactor:1,slowDuration:0,life:0,maxLife:3})}}fire(t,e,n,r,s,o=0,a=1,l=0){const c=this.pool.find(u=>!u.active&&u.type===t);c&&(c.active=!0,c.targetId=n,c.damage=r,c.speed=s,c.aoeRadius=o,c.slowFactor=a,c.slowDuration=l,c.life=0,c.maxLife=4,c.mesh.position.copy(e),c.mesh.visible=!0)}update(t,e,n,r,s){for(const o of this.pool){if(!o.active)continue;if(o.life+=t,o.life>o.maxLife){this.deactivate(o);continue}const a=e(o.targetId);if(!a){this.deactivate(o);continue}const l=a.clone().sub(o.mesh.position),c=l.length();if(c<bx){if(o.aoeRadius>0){for(const f of r(o.mesh.position,o.aoeRadius))n(f,o.damage,o.slowFactor,o.slowDuration);this.showAoeFlash(o.mesh.position,o.aoeRadius)}else n(o.targetId,o.damage,o.slowFactor,o.slowDuration);this.deactivate(o);continue}const u=l.normalize().multiplyScalar(Math.min(o.speed*t,c));o.mesh.position.add(u),o.type==="arrow"&&(o.mesh.lookAt(a),o.mesh.rotateX(Math.PI/2))}for(const o of this.playerArrows){if(!o.active)continue;if(o.life-=t,o.life<=0){this.deactivateArrow(o);continue}if(o.velocity.y-=Sx*t,o.mesh.position.addScaledVector(o.velocity,t),o.velocity.length()>.1){const l=o.velocity.clone().normalize();o.mesh.lookAt(o.mesh.position.clone().add(l)),o.mesh.rotateX(Math.PI/2)}if(s)for(const l of s()){const c=e(l);if(c&&o.mesh.position.distanceTo(c)<Mx){n(l,o.damage,1,0),this.deactivateArrow(o);break}}}}reset(){for(const t of this.pool)this.deactivate(t);for(const t of this.playerArrows)this.deactivateArrow(t)}deactivate(t){t.active=!1,t.mesh.visible=!1}deactivateArrow(t){t.active=!1,t.mesh.visible=!1}showAoeFlash(t,e){const n=new Ur(e,8,6),r=new mi({color:16737792,transparent:!0,opacity:.5,depthWrite:!1}),s=new It(n,r);s.position.copy(t),this.scene.add(s);let o=0;const a=()=>{o+=.016,r.opacity=Math.max(0,.5-o*2),r.opacity>0?requestAnimationFrame(a):(this.scene.remove(s),n.dispose(),r.dispose())};requestAnimationFrame(a)}}const Ji=[{wave:1,bonusGold:20,groups:[{type:"goblin",count:6,spawnInterval:2.5,gate:"north"}]},{wave:2,bonusGold:25,groups:[{type:"goblin",count:8,spawnInterval:2,gate:"north"},{type:"goblin",count:5,spawnInterval:2.5,gate:"south"}]},{wave:3,bonusGold:35,groups:[{type:"goblin",count:10,spawnInterval:1.8,gate:"north"},{type:"orc",count:3,spawnInterval:3,gate:"north"}]},{wave:4,bonusGold:40,groups:[{type:"orc",count:4,spawnInterval:2.5,gate:"north"},{type:"goblin",count:10,spawnInterval:1.5,gate:"south"},{type:"orc",count:3,spawnInterval:2.5,gate:"south"}]},{wave:5,bonusGold:55,groups:[{type:"goblin",count:12,spawnInterval:1.6,gate:"north"},{type:"goblin_miner",count:2,spawnInterval:8,gate:"north"},{type:"orc",count:5,spawnInterval:2.5,gate:"south"}]},{wave:6,bonusGold:65,groups:[{type:"goblin",count:15,spawnInterval:1.4,gate:"north"},{type:"troll",count:1,spawnInterval:0,gate:"north"},{type:"goblin_miner",count:3,spawnInterval:6,gate:"south"},{type:"orc",count:6,spawnInterval:2.2,gate:"south"}]},{wave:7,bonusGold:80,groups:[{type:"orc",count:10,spawnInterval:1.8,gate:"north"},{type:"troll",count:2,spawnInterval:5,gate:"north"},{type:"goblin",count:20,spawnInterval:1,gate:"south"},{type:"goblin_miner",count:4,spawnInterval:5,gate:"south"}]},{wave:8,bonusGold:100,groups:[{type:"troll",count:3,spawnInterval:4,gate:"north"},{type:"goblin_miner",count:5,spawnInterval:4,gate:"north"},{type:"orc",count:12,spawnInterval:1.6,gate:"south"},{type:"goblin",count:18,spawnInterval:.9,gate:"south"}]},{wave:9,bonusGold:130,groups:[{type:"orc",count:15,spawnInterval:1.4,gate:"north"},{type:"goblin_miner",count:6,spawnInterval:3.5,gate:"north"},{type:"troll",count:3,spawnInterval:5,gate:"north"},{type:"goblin",count:25,spawnInterval:.8,gate:"south"},{type:"goblin_miner",count:4,spawnInterval:4,gate:"south"},{type:"orc",count:8,spawnInterval:2,gate:"south"}]},{wave:10,bonusGold:250,groups:[{type:"troll",count:4,spawnInterval:3,gate:"north"},{type:"goblin_miner",count:8,spawnInterval:2.5,gate:"north"},{type:"orc",count:20,spawnInterval:1,gate:"north"},{type:"goblin",count:30,spawnInterval:.6,gate:"south"},{type:"goblin_miner",count:6,spawnInterval:3,gate:"south"},{type:"troll",count:3,spawnInterval:4,gate:"south"},{type:"orc",count:15,spawnInterval:1.2,gate:"south"}]}];class Cx{constructor(){Object.defineProperty(this,"currentWave",{enumerable:!0,configurable:!0,writable:!0,value:0}),Object.defineProperty(this,"spawnQueue",{enumerable:!0,configurable:!0,writable:!0,value:[]}),Object.defineProperty(this,"spawnTimer",{enumerable:!0,configurable:!0,writable:!0,value:0}),Object.defineProperty(this,"activeEnemyCount",{enumerable:!0,configurable:!0,writable:!0,value:0}),Object.defineProperty(this,"waveActive",{enumerable:!0,configurable:!0,writable:!0,value:!1}),Object.defineProperty(this,"_betweenWaveTimer",{enumerable:!0,configurable:!0,writable:!0,value:0}),Object.defineProperty(this,"betweenWaveDuration",{enumerable:!0,configurable:!0,writable:!0,value:120}),Object.defineProperty(this,"onWaveComplete",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}}),Object.defineProperty(this,"onBetweenWaveTick",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}}),Object.defineProperty(this,"_spawn",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}}),Object.defineProperty(this,"_tickAccum",{enumerable:!0,configurable:!0,writable:!0,value:0})}get wave(){return this.currentWave}get isActive(){return this.waveActive}get totalWaves(){return Ji.length}get timeUntilNextWave(){return Math.ceil(this._betweenWaveTimer)}get isBetweenWaves(){return!this.waveActive&&this.currentWave>0&&this.currentWave<Ji.length&&this._betweenWaveTimer>0}startWave(t){if(this.waveActive||this.currentWave>=Ji.length)return;this.currentWave++,this.waveActive=!0,this.activeEnemyCount=0,this._betweenWaveTimer=0;const e=Ji[this.currentWave-1];this.spawnQueue=[];let n=0;for(const r of e.groups)for(let s=0;s<r.count;s++)this.spawnQueue.push({type:r.type,gate:r.gate??"north",delay:n}),n+=r.spawnInterval,this.activeEnemyCount++;this.spawnTimer=0,this._spawn=t}update(t){if(this.waveActive)for(this.spawnTimer+=t;this.spawnQueue.length>0&&this.spawnQueue[0].delay<=this.spawnTimer;){const e=this.spawnQueue.shift();this._spawn(e.type,e.gate)}else if(this._betweenWaveTimer>0){const e=this._betweenWaveTimer;this._betweenWaveTimer=Math.max(0,this._betweenWaveTimer-t),this._tickAccum+=t,this._tickAccum>=1&&(this._tickAccum-=1,this.onBetweenWaveTick(this.timeUntilNextWave)),e>0&&this._betweenWaveTimer===0&&this.onBetweenWaveTick(0)}}onEnemyEliminated(){if(this.activeEnemyCount=Math.max(0,this.activeEnemyCount-1),this.activeEnemyCount===0&&this.spawnQueue.length===0&&this.waveActive){this.waveActive=!1;const t=Ji[this.currentWave-1];this._betweenWaveTimer=this.isLastWave()?0:this.betweenWaveDuration,this.onWaveComplete(this.currentWave,t.bonusGold)}}isLastWave(){return this.currentWave>=Ji.length}reset(){this.currentWave=0,this.spawnQueue=[],this.spawnTimer=0,this.activeEnemyCount=0,this.waveActive=!1,this._betweenWaveTimer=0,this._tickAccum=0}}const qu={grass:{toolCategory:"shovel",requiresTool:!1,drops:["dirt"]},dirt:{toolCategory:"shovel",requiresTool:!1,drops:["dirt"]},stone:{toolCategory:"pickaxe",requiresTool:!0,drops:["cobblestone"]},cobblestone:{toolCategory:"pickaxe",requiresTool:!0,drops:["cobblestone"]},wood:{toolCategory:"axe",requiresTool:!1,drops:["wood"]},planks:{toolCategory:"axe",requiresTool:!1,drops:["planks"]},leaves:{toolCategory:"hand",requiresTool:!1,drops:[]},sand:{toolCategory:"shovel",requiresTool:!1,drops:["sand"]},iron_ore:{toolCategory:"pickaxe",requiresTool:!0,drops:["iron_ore"]},coal_ore:{toolCategory:"pickaxe",requiresTool:!0,drops:["coal_ore"]},iron_block:{toolCategory:"pickaxe",requiresTool:!0,drops:["iron_block"]},crafting_table:{toolCategory:"axe",requiresTool:!1,drops:["crafting_table"]},furnace:{toolCategory:"pickaxe",requiresTool:!1,drops:["furnace"]},obsidian:{toolCategory:"pickaxe",requiresTool:!0,drops:[]},torch:{toolCategory:"hand",requiresTool:!1,drops:["torch"]}},Px=4.5,Rx={wood:2,stone:4,iron:6,diamond:8};class Lx{constructor(t,e,n){Object.defineProperty(this,"world",{enumerable:!0,configurable:!0,writable:!0,value:t}),Object.defineProperty(this,"camera",{enumerable:!0,configurable:!0,writable:!0,value:n}),Object.defineProperty(this,"raycaster",{enumerable:!0,configurable:!0,writable:!0,value:new S0}),Object.defineProperty(this,"targetHighlight",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"targetBlock",{enumerable:!0,configurable:!0,writable:!0,value:null}),Object.defineProperty(this,"adjacentBlock",{enumerable:!0,configurable:!0,writable:!0,value:null}),Object.defineProperty(this,"isBreaking",{enumerable:!0,configurable:!0,writable:!0,value:!1}),Object.defineProperty(this,"breakTimer",{enumerable:!0,configurable:!0,writable:!0,value:0}),Object.defineProperty(this,"breakHardness",{enumerable:!0,configurable:!0,writable:!0,value:1}),Object.defineProperty(this,"willYieldDrops",{enumerable:!0,configurable:!0,writable:!0,value:!0}),Object.defineProperty(this,"activeItem",{enumerable:!0,configurable:!0,writable:!0,value:null}),Object.defineProperty(this,"onBlockBroken",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}}),Object.defineProperty(this,"onBlockPlaced",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}});const r=new ne(1.008,1.008,1.008),s=new mi({color:0,wireframe:!0,transparent:!0,opacity:.6});this.targetHighlight=new It(r,s),this.targetHighlight.visible=!1,e.add(this.targetHighlight)}setActiveItem(t){if(this.activeItem=t,this.targetBlock){const e=this.world.getBlock(this.targetBlock.wx,this.targetBlock.wy,this.targetBlock.wz);e!=="air"&&this.computeBreakHardness(e)}}startBreaking(){this.isBreaking=!0,this.breakTimer=0}stopBreaking(){this.isBreaking=!1,this.breakTimer=0}getBreakProgress(){return this.breakHardness>0?Math.min(1,this.breakTimer/this.breakHardness):0}getTargetBlock(){return this.targetBlock}tryPlace(t){if(!this.adjacentBlock||t==="air")return!1;const{wx:e,wy:n,wz:r}=this.adjacentBlock;return n<0||n>=32||this.world.getBlock(e,n,r)!=="air"?!1:(this.world.setBlock(e,n,r,t),this.world.rebuildDirtyChunks(),this.onBlockPlaced(e,n,r,t),!0)}update(t){if(this.updateTarget(),this.isBreaking&&this.targetBlock&&(this.breakTimer+=t,this.breakTimer>=this.breakHardness)){const{wx:e,wy:n,wz:r}=this.targetBlock,s=this.world.getBlock(e,n,r);s!=="air"&&(this.world.setBlock(e,n,r,"air"),this.world.rebuildDirtyChunks(),this.onBlockBroken(e,n,r,s,this.willYieldDrops)),this.breakTimer=0}}computeBreakHardness(t){const e=Or[t].hardness,n=qu[t];if(!n){this.breakHardness=e,this.willYieldDrops=!0;return}const r=this.activeItem?dn[this.activeItem.itemId]:null,s=(r==null?void 0:r.toolCategory)===n.toolCategory,o=r==null?void 0:r.tier;if(!s){n.requiresTool?(this.breakHardness=e*3.33,this.willYieldDrops=!1):(this.breakHardness=e,this.willYieldDrops=!0);return}const a=(r==null?void 0:r.speedMult)??(o?Rx[o]:1);this.breakHardness=e/a,this.willYieldDrops=!0}updateTarget(){this.raycaster.setFromCamera(new wt(0,0),this.camera),this.raycaster.far=Px;const t=this.raycaster.intersectObjects(this.world.getChunkMeshes());if(t.length===0||!t[0].face){this.clearTarget();return}const e=t[0],n=e.face.normal,r=e.point,s=Math.floor(r.x-n.x*.001),o=Math.floor(r.y-n.y*.001),a=Math.floor(r.z-n.z*.001),l=this.world.getBlock(s,o,a);if(l==="air"){this.clearTarget();return}(!this.targetBlock||this.targetBlock.wx!==s||this.targetBlock.wy!==o||this.targetBlock.wz!==a)&&(this.breakTimer=0,this.computeBreakHardness(l)),this.targetBlock={wx:s,wy:o,wz:a},this.adjacentBlock={wx:Math.floor(r.x+n.x*.001),wy:Math.floor(r.y+n.y*.001),wz:Math.floor(r.z+n.z*.001)},this.targetHighlight.position.set(s+.5,o+.5,a+.5),this.targetHighlight.visible=!0}clearTarget(){this.targetBlock=null,this.adjacentBlock=null,this.targetHighlight.visible=!1,this.isBreaking&&(this.breakTimer=0)}}class Ix{constructor(t){Object.defineProperty(this,"keysHeld",{enumerable:!0,configurable:!0,writable:!0,value:new Set}),Object.defineProperty(this,"_activeSlot",{enumerable:!0,configurable:!0,writable:!0,value:0}),Object.defineProperty(this,"_leftDown",{enumerable:!0,configurable:!0,writable:!0,value:!1}),Object.defineProperty(this,"_rightDown",{enumerable:!0,configurable:!0,writable:!0,value:!1}),Object.defineProperty(this,"onLeftClick",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}}),Object.defineProperty(this,"onRightClick",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}}),Object.defineProperty(this,"onRightRelease",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}}),Object.defineProperty(this,"onInventoryToggle",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}}),Object.defineProperty(this,"onSlotChange",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}}),window.addEventListener("keydown",e=>this.onKeyDown(e)),window.addEventListener("keyup",e=>this.onKeyUp(e)),t.addEventListener("mousedown",e=>this.onMouseDown(e)),t.addEventListener("mouseup",e=>this.onMouseUp(e)),t.addEventListener("wheel",e=>this.onWheel(e),{passive:!0})}get activeSlot(){return this._activeSlot}getMovementInput(){return{forward:this.keysHeld.has("KeyW")||this.keysHeld.has("ArrowUp"),backward:this.keysHeld.has("KeyS")||this.keysHeld.has("ArrowDown"),left:this.keysHeld.has("KeyA")||this.keysHeld.has("ArrowLeft"),right:this.keysHeld.has("KeyD")||this.keysHeld.has("ArrowRight"),jump:this.keysHeld.has("Space"),sprint:this.keysHeld.has("ShiftLeft")||this.keysHeld.has("ShiftRight")}}isLeftMouseDown(){return this._leftDown}isRightMouseDown(){return this._rightDown}onKeyDown(t){this.keysHeld.add(t.code),t.code==="KeyE"&&this.onInventoryToggle();const e=t.code.match(/^Digit(\d)$/);if(e){const n=parseInt(e[1])-1;n>=0&&n<=8&&(this._activeSlot=n,this.onSlotChange(n))}}onKeyUp(t){this.keysHeld.delete(t.code)}onMouseDown(t){t.button===0&&(this._leftDown=!0,this.onLeftClick()),t.button===2&&(this._rightDown=!0,this.onRightClick())}onMouseUp(t){t.button===0&&(this._leftDown=!1),t.button===2&&(this._rightDown=!1,this.onRightRelease())}onWheel(t){const e=t.deltaY>0?1:-1;this._activeSlot=(this._activeSlot+e+9)%9,this.onSlotChange(this._activeSlot)}}function Dx(i,t){let n="";switch(t){case"sword":n=`<rect x="13" y="4" width="6" height="18" fill="${i}"/>
               <rect x="8" y="8" width="16" height="4" fill="${i}"/>
               <rect x="13" y="22" width="6" height="6" fill="#5c3a1a"/>`;break;case"pick":n=`<rect x="4" y="8" width="24" height="6" fill="${i}"/>
               <rect x="4" y="8" width="6" height="14" fill="${i}"/>
               <rect x="14" y="14" width="4" height="12" fill="#5c3a1a"/>`;break;case"axe":n=`<rect x="4" y="6" width="14" height="12" fill="${i}"/>
               <rect x="14" y="6" width="4" height="20" fill="#5c3a1a"/>`;break;case"bow":n=`<rect x="6" y="4" width="4" height="24" fill="#8b6914"/>
               <rect x="10" y="4" width="12" height="2" fill="#8b6914"/>
               <rect x="10" y="26" width="12" height="2" fill="#8b6914"/>
               <rect x="10" y="15" width="12" height="2" fill="#c8a060"/>`;break;case"food":n=`<rect x="8" y="8" width="16" height="16" fill="${i}"/>
               <rect x="10" y="6" width="4" height="4" fill="#3a7a25"/>`;break;case"armor":n=`<rect x="6" y="6" width="20" height="20" fill="${i}"/>
               <rect x="10" y="4" width="5" height="4" fill="${i}"/>
               <rect x="17" y="4" width="5" height="4" fill="${i}"/>`;break;default:n=`<rect x="4" y="4" width="24" height="24" fill="${i}"/>
               <rect x="4" y="4" width="24" height="4" fill="${i}cc"/>`}const r=`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">${n}</svg>`;return`data:image/svg+xml;charset=utf-8,${encodeURIComponent(r)}`}const Bs={};function Ux(i){if(Bs[i])return Bs[i];const t=dn[i];if(!t)return"";const e=Ox(t.color);let n="material";return t.category==="weapon"?n="sword":t.toolCategory==="pickaxe"?n="pick":t.toolCategory==="axe"?n="axe":t.id==="bow"?n="bow":t.category==="food"?n="food":t.category==="armor"?n="armor":t.category==="block"&&(n="block"),Bs[i]=Dx(e,n),Bs[i]}class Nx{constructor(t){Object.defineProperty(this,"onRestart",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}}),Object.defineProperty(this,"onPointerLockRequest",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}}),Object.defineProperty(this,"onModeSelect",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}}),Object.defineProperty(this,"onCraftingSlotClick",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}}),Object.defineProperty(this,"onCraftingResultClick",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}}),Object.defineProperty(this,"onStartWave",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}}),Object.defineProperty(this,"onSelectTowerType",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}}),Object.defineProperty(this,"onUpgrade",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}}),Object.defineProperty(this,"onSell",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}}),Object.defineProperty(this,"onStartGame",{enumerable:!0,configurable:!0,writable:!0,value:()=>{}}),Object.defineProperty(this,"crosshair",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"hotbarSlots",{enumerable:!0,configurable:!0,writable:!0,value:[]}),Object.defineProperty(this,"heartEls",{enumerable:!0,configurable:!0,writable:!0,value:[]}),Object.defineProperty(this,"hungerEls",{enumerable:!0,configurable:!0,writable:!0,value:[]}),Object.defineProperty(this,"xpBarFill",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"elWaveInfo",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"elObjective",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"lockPrompt",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"inventoryOverlay",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"deathOverlay",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"endOverlay",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"floatingContainer",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"backpackSlotEls",{enumerable:!0,configurable:!0,writable:!0,value:[]}),Object.defineProperty(this,"hotbarInvSlotEls",{enumerable:!0,configurable:!0,writable:!0,value:[]}),Object.defineProperty(this,"armorSlotEls",{enumerable:!0,configurable:!0,writable:!0,value:{}}),Object.defineProperty(this,"personalCraftCells",{enumerable:!0,configurable:!0,writable:!0,value:[]}),Object.defineProperty(this,"personalCraftResult",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"_personalGrid",{enumerable:!0,configurable:!0,writable:!0,value:[[null,null],[null,null]]}),Object.defineProperty(this,"_inventoryOpen",{enumerable:!0,configurable:!0,writable:!0,value:!1}),Object.defineProperty(this,"container",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.container=t,this.injectCSS(),this.build()}updatePlayerHealth(t,e){const n=Math.ceil(e/2);for(let r=0;r<this.heartEls.length;r++){const s=t-r*2,o=this.heartEls[r];if(r>=n){o.style.display="none";continue}o.style.display="",s>=2?(o.textContent="♥",o.style.color="#c00000"):s===1?(o.textContent="♥",o.style.color="#7a0000"):(o.textContent="♡",o.style.color="#373737")}}updateXP(t,e){const n=e>0?Math.min(1,t/e)*100:0;this.xpBarFill.style.width=`${n}%`}updateHunger(t,e){for(let n=0;n<this.hungerEls.length;n++){const r=t-n*2,s=this.hungerEls[n];r>=2?(s.textContent="🍖",s.style.opacity="1"):r===1?(s.textContent="🍖",s.style.opacity="0.5"):(s.textContent="🍖",s.style.opacity="0.2")}}updateHotbar(t,e){for(let n=0;n<9;n++){const r=this.hotbarSlots[n],s=t[n]??null;r.classList.toggle("active",n===e),this.renderStackInSlot(r,s)}}updateWaveInfo(t,e,n){this.elWaveInfo.innerHTML=`Wave ${t}/${e}<br>${n} enemies`}setObjective(t){this.elObjective.textContent=t,this.elObjective.style.opacity=t?"1":"0"}showPointerLockPrompt(t){this.lockPrompt.style.display=t?"flex":"none"}showInventory(t,e){this._inventoryOpen=t,this.inventoryOverlay.style.display=t?"flex":"none",t&&e&&this.refreshInventoryDisplay(e)}isInventoryOpen(){return this._inventoryOpen}showDeathScreen(){this.deathOverlay.style.display="flex"}hideDeathScreen(){this.deathOverlay.style.display="none"}showFloatingNumber(t,e,n,r){const s=document.createElement("div");s.className="float-num",s.textContent=t,s.style.cssText=`left:${n}px;top:${r}px;color:${e}`,this.floatingContainer.appendChild(s),setTimeout(()=>s.remove(),1100)}setPersonalCraftSlot(t,e,n){var s;this._personalGrid[t][e]=n;const r=(s=this.personalCraftCells[t])==null?void 0:s[e];r&&this.renderIdInSlot(r,n)}setPersonalCraftResult(t,e){this.renderIdInSlot(this.personalCraftResult,t,e>1?e:void 0)}getPersonalCraftGrid(){return this._personalGrid.map(t=>[...t])}showEnd(t,e){const n=this.endOverlay.querySelector(".overlay-box"),r=n.querySelector(".overlay-title"),s=n.querySelector(".overlay-stats");r.textContent=t==="victory"?"VICTORY!":"GAME OVER",r.style.color=t==="victory"?"#ffdd00":"#ff4444",s.textContent=e,this.endOverlay.style.display="flex"}hideEnd(){this.endOverlay.style.display="none"}updateHealth(t,e){}updateGold(t){}updateWave(t,e){}updateEnemyCount(t){}setStartWaveEnabled(t){}updateTowerButtons(t){}selectTowerBtn(t){}showSelectedTower(t,e){}showBanner(t,e){}showMenu(){this.showPointerLockPrompt(!0)}hideMenu(){this.showPointerLockPrompt(!1)}showGameOver(t,e){this.showEnd("gameover",`Survived ${t} waves · ${e} enemies defeated`)}showVictory(t,e){this.showEnd("victory",`All waves cleared! · ${t} kills · $${e} earned`)}hideEndScreens(){this.hideEnd()}build(){this.container.style.cssText="position:relative;width:100vw;height:100vh;overflow:hidden;";const t=Nt("fps-vignette");this.container.appendChild(t),this.crosshair=Nt("fps-crosshair"),this.crosshair.innerHTML='<span class="fps-ch-h"></span><span class="fps-ch-v"></span>',this.container.appendChild(this.crosshair),this.elObjective=Nt("fps-objective"),this.container.appendChild(this.elObjective),this.elWaveInfo=Nt("fps-wave-info"),this.elWaveInfo.innerHTML="Wave 0/10<br>0 enemies",this.container.appendChild(this.elWaveInfo),this.buildHearts(),this.buildHungerBar(),this.buildXPBar(),this.buildHotbar(),this.floatingContainer=Nt("floating-container"),this.container.appendChild(this.floatingContainer),this.lockPrompt=Nt("fps-lock-prompt"),this.lockPrompt.innerHTML=`
      <div class="fps-lock-box">
        <div class="fps-lock-title">HELM'S DEEP</div>
        <div class="fps-lock-sub">A Minecraft-Style Fortress Survival</div>
        <div class="fps-mode-row">
          <button class="fps-mode-btn" id="btn-helmsdeep">
            <span class="fps-mode-icon">⚔</span>
            <span class="fps-mode-name">Helm's Deep</span>
            <span class="fps-mode-desc">Defend across 10 waves</span>
          </button>
          <button class="fps-mode-btn" id="btn-freeplay">
            <span class="fps-mode-icon">🏗</span>
            <span class="fps-mode-name">Free Play</span>
            <span class="fps-mode-desc">Mine, build, explore</span>
          </button>
        </div>
        <div class="fps-lock-controls">
          WASD: move &nbsp;|&nbsp; Mouse: look &nbsp;|&nbsp;
          LClick: mine/attack &nbsp;|&nbsp; RClick: place &nbsp;|&nbsp;
          E: inventory &nbsp;|&nbsp; 1-9: hotbar &nbsp;|&nbsp; Esc: unlock
        </div>
      </div>`,this.lockPrompt.querySelector("#btn-helmsdeep").addEventListener("click",e=>{e.stopPropagation(),this.onModeSelect("helmsdeep"),this.onPointerLockRequest()}),this.lockPrompt.querySelector("#btn-freeplay").addEventListener("click",e=>{e.stopPropagation(),this.onModeSelect("freeplay"),this.onPointerLockRequest()}),this.container.appendChild(this.lockPrompt),this.buildInventoryOverlay(),this.buildDeathOverlay(),this.buildEndOverlay()}buildHearts(){const t=Nt("fps-hearts");for(let e=0;e<10;e++){const n=Nt("fps-heart");n.textContent="♥",t.appendChild(n),this.heartEls.push(n)}this.container.appendChild(t)}buildHungerBar(){const t=Nt("fps-hunger");for(let e=0;e<10;e++){const n=Nt("fps-hunger-icon");n.textContent="🍖",t.appendChild(n),this.hungerEls.push(n)}this.container.appendChild(t)}buildXPBar(){const t=Nt("fps-xp-track");this.xpBarFill=Nt("fps-xp-fill"),this.xpBarFill.style.width="0%",t.appendChild(this.xpBarFill),this.container.appendChild(t)}buildHotbar(){const t=Nt("fps-hotbar");for(let e=0;e<9;e++){const n=Nt("fps-hotbar-slot");n.innerHTML=`<span class="fps-slot-num">${e+1}</span>
        <span class="fps-slot-icon"></span>
        <span class="fps-slot-count"></span>`,t.appendChild(n),this.hotbarSlots.push(n)}this.container.appendChild(t)}buildInventoryOverlay(){const t=Nt("fps-inventory overlay hidden");t.style.display="none";const e=Nt("fps-inv-box"),n=Nt("fps-inv-top"),r=Nt("fps-inv-armor"),s=Nt("fps-inv-label");s.textContent="Armor",r.appendChild(s);const o=Nt("fps-armor-grid");for(const p of["head","chest","legs","feet"]){const v=Nt("fps-slot fps-armor-slot");v.dataset.slot=p,v.title=p;const x=Nt("fps-slot-icon-inner");x.textContent=Bx(p),v.appendChild(x),o.appendChild(v),this.armorSlotEls[p]=v}r.appendChild(o),n.appendChild(r);const a=Nt("fps-inv-craft"),l=Nt("fps-inv-label");l.textContent="Craft (2×2)",a.appendChild(l);const c=Nt("fps-craft-area"),u=Nt("fps-craft-grid fps-grid-2x2");this.personalCraftCells=[];for(let p=0;p<2;p++){const v=[];for(let x=0;x<2;x++){const y=Nt("fps-slot fps-craft-cell");y.addEventListener("click",()=>this.onCraftingSlotClick(p,x)),u.appendChild(y),v.push(y)}this.personalCraftCells.push(v)}c.appendChild(u);const f=Nt("fps-craft-arrow");f.textContent="➡",c.appendChild(f),this.personalCraftResult=Nt("fps-slot fps-craft-result"),this.personalCraftResult.addEventListener("click",()=>this.onCraftingResultClick()),c.appendChild(this.personalCraftResult),a.appendChild(c),n.appendChild(a),e.appendChild(n);const h=Nt("fps-inv-label");h.textContent="Inventory",e.appendChild(h);const d=Nt("fps-inv-grid");this.backpackSlotEls=[];for(let p=0;p<27;p++){const v=Nt("fps-slot");d.appendChild(v),this.backpackSlotEls.push(v)}e.appendChild(d);const g=Nt("fps-inv-label");g.textContent="Hotbar",e.appendChild(g);const _=Nt("fps-inv-hotbar-row");this.hotbarInvSlotEls=[];for(let p=0;p<9;p++){const v=Nt("fps-slot fps-slot-hotbar");_.appendChild(v),this.hotbarInvSlotEls.push(v)}e.appendChild(_);const m=Nt("fps-inv-hint");m.textContent="[E] close  ·  Click slots to interact",e.appendChild(m),t.appendChild(e),this.inventoryOverlay=t,this.container.appendChild(t)}buildDeathOverlay(){const t=Nt("overlay");t.style.display="none",t.innerHTML=`
      <div class="overlay-box">
        <h1 class="overlay-title" style="color:#ff4444">YOU DIED</h1>
        <p class="overlay-stats">The fortress has fallen.</p>
        <button class="overlay-btn" id="death-restart">Respawn</button>
      </div>`,t.querySelector("#death-restart").addEventListener("click",()=>{t.style.display="none",this.onRestart()}),this.deathOverlay=t,this.container.appendChild(t)}buildEndOverlay(){const t=Nt("overlay");t.style.display="none",t.innerHTML=`
      <div class="overlay-box">
        <h1 class="overlay-title"></h1>
        <p class="overlay-stats"></p>
        <button class="overlay-btn" id="end-restart">Play Again</button>
      </div>`,t.querySelector("#end-restart").addEventListener("click",()=>{t.style.display="none",this.onRestart()}),this.endOverlay=t,this.container.appendChild(t)}refreshInventoryDisplay(t){for(let e=0;e<27;e++)this.renderStackInSlot(this.backpackSlotEls[e],t.backpack[e]);for(let e=0;e<9;e++)this.renderStackInSlot(this.hotbarInvSlotEls[e],t.hotbar[e]);for(const[e,n]of Object.entries(this.armorSlotEls)){const r=t.armor[e];this.renderStackInSlot(n,r);const s=n.querySelector(".fps-slot-icon-inner");s&&(s.style.display=r?"none":"")}}renderStackInSlot(t,e){this.renderIdInSlot(t,(e==null?void 0:e.itemId)??null,e==null?void 0:e.count)}renderIdInSlot(t,e,n){const r=t.querySelector(".fps-slot-icon")??t.querySelector(".fps-slot-icon-inner"),s=t.querySelector(".fps-slot-count");if(!e){r&&(r.style.backgroundColor="",r.title=""),s&&(s.textContent=""),t.dataset.item="";return}const o=dn[e],a=(o==null?void 0:o.name)??e,l=o?Ux(e):null;r?(r.style.backgroundImage=l?`url("${l}")`:"",r.style.backgroundSize="contain",r.style.backgroundRepeat="no-repeat",r.style.backgroundPosition="center",r.style.backgroundColor="rgba(0,0,0,0.2)",r.style.boxShadow="",r.textContent="",r.title=a):(t.style.backgroundImage=l?`url("${l}")`:"",t.title=a),s&&n!==void 0&&n>1?s.textContent=String(n):s&&(s.textContent=""),t.dataset.item=e}injectCSS(){const t=document.createElement("style");t.textContent=Fx,document.head.appendChild(t)}}function Nt(i){const t=document.createElement("div");return t.className=i,t}function Ox(i){return"#"+i.toString(16).padStart(6,"0")}function Bx(i){return{head:"⛑",chest:"🧳",legs:"👖",feet:"👢"}[i]??"?"}const Fx=`
/* Vignette overlay */
.fps-vignette {
  position: absolute; inset: 0;
  pointer-events: none; z-index: 5;
  background: radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.55) 100%);
}

/* Crosshair — Minecraft pixel + */
.fps-crosshair {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  pointer-events: none; z-index: 20;
}
.fps-ch-h {
  position: absolute;
  width: 14px; height: 2px;
  background: #fff;
}
.fps-ch-v {
  position: absolute;
  width: 2px; height: 14px;
  background: #fff;
}

/* Objective banner — flat, no blur, pixel shadow */
.fps-objective {
  position: absolute;
  top: 8px; left: 50%; transform: translateX(-50%);
  font-size: 13px; font-weight: bold;
  color: #fff;
  text-shadow: 1px 1px 0 #000, 2px 2px 0 #000;
  background: rgba(0,0,0,0.6);
  padding: 4px 10px;
  pointer-events: none; z-index: 15;
  white-space: nowrap;
}

/* Wave info — flat, white text */
.fps-wave-info {
  position: absolute;
  top: 8px; right: 8px;
  font-size: 12px; font-weight: bold;
  color: #fff;
  text-shadow: 1px 1px 0 #000, 2px 2px 0 #000;
  background: rgba(0,0,0,0.5);
  padding: 4px 8px;
  pointer-events: none; z-index: 15;
  line-height: 1.4; text-align: right;
}

/* Health hearts — left of center, above hotbar */
.fps-hearts {
  position: absolute;
  bottom: 68px; right: calc(50% + 6px);
  display: flex; gap: 1px;
  pointer-events: none; z-index: 15;
}
.fps-heart {
  font-size: 14px;
  color: #c00000;
  text-shadow: 1px 1px 0 #000;
}

/* Hunger bar — right of center, above hotbar */
.fps-hunger {
  position: absolute;
  bottom: 68px; left: calc(50% + 6px);
  display: flex; gap: 1px; flex-direction: row-reverse;
  pointer-events: none; z-index: 15;
}
.fps-hunger-icon {
  font-size: 13px;
  text-shadow: 1px 1px 0 #000;
}

/* XP bar — sits just above hotbar */
.fps-xp-track {
  position: absolute;
  bottom: 62px; left: 50%; transform: translateX(-50%);
  width: 430px; height: 7px;
  background: #000;
  border: 1px solid #333;
  pointer-events: none; z-index: 15;
}
.fps-xp-fill {
  height: 100%;
  background: #80ff20;
  transition: width 0.3s;
}

/* Hotbar — Minecraft dark gray, square slots */
.fps-hotbar {
  position: absolute;
  bottom: 10px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 2px;
  background: #000;
  padding: 3px;
  border: 2px solid #555;
  z-index: 15;
}
.fps-hotbar-slot {
  position: relative;
  width: 46px; height: 46px;
  background: #373737;
  border: 2px solid #555;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.fps-hotbar-slot.active {
  border: 3px solid #fff;
  background: #555;
}
.fps-hotbar-slot .fps-slot-num {
  position: absolute; top: 1px; left: 3px;
  font-size: 8px; color: rgba(255,255,255,0.7);
  pointer-events: none;
  text-shadow: 1px 1px 0 #000;
}
.fps-hotbar-slot .fps-slot-icon {
  width: 32px; height: 32px;
  display: block;
  image-rendering: pixelated;
}
.fps-hotbar-slot .fps-slot-count {
  position: absolute; bottom: 1px; right: 2px;
  font-size: 9px; font-weight: bold;
  color: #fff; text-shadow: 1px 1px 0 #000;
}

/* Pointer lock splash — Minecraft title screen style */
.fps-lock-prompt {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: #000;
  z-index: 60;
}
.fps-lock-box {
  text-align: center;
  padding: 40px 56px;
  background: #1a1a1a;
  border: 3px solid #555;
  max-width: 520px;
}
.fps-lock-title {
  font-size: 42px; font-weight: bold;
  letter-spacing: 0.08em;
  color: #ffff55;
  text-shadow: 3px 3px 0 #3f3f00;
  margin-bottom: 6px;
}
.fps-lock-sub {
  font-size: 14px; color: #aaa;
  text-shadow: 1px 1px 0 #000;
  margin-bottom: 24px;
}
.fps-lock-cta {
  font-size: 18px; font-weight: bold;
  color: #fff;
  padding: 10px 28px;
  border: 2px solid #888;
  background: #555;
  cursor: pointer;
  display: inline-block;
  margin-bottom: 20px;
  text-shadow: 1px 1px 0 #000;
}
.fps-lock-cta:hover { background: #777; }
.fps-lock-controls {
  font-size: 8px; color: rgba(255,255,255,0.3);
  line-height: 2;
}
.fps-mode-row {
  display: flex; gap: 16px; justify-content: center;
  margin-bottom: 24px;
}
.fps-mode-btn {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 16px 24px;
  background: #373737;
  border: 3px solid #555;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  min-width: 160px;
  transition: background 0.1s, border-color 0.1s;
}
.fps-mode-btn:hover { background: #555; border-color: #fff; }
.fps-mode-icon { font-size: 28px; }
.fps-mode-name { font-size: 11px; font-weight: bold; color: #ffff55; text-shadow: 2px 2px 0 #3f3f00; }
.fps-mode-desc { font-size: 7px; color: rgba(255,255,255,0.5); }

/* Inventory overlay — Minecraft gray panel */
.fps-inventory {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.5);
  z-index: 50;
}
.fps-inv-box {
  background: #c6c6c6;
  border: 3px solid #555;
  padding: 16px 20px;
  display: flex; flex-direction: column; gap: 10px;
  min-width: 420px;
}
.fps-inv-top {
  display: flex; gap: 20px; align-items: flex-start;
}
.fps-inv-label {
  font-size: 10px; color: #555; font-weight: bold;
  text-transform: uppercase; letter-spacing: 0.06em;
  margin-bottom: 4px;
}
.fps-inv-armor { display: flex; flex-direction: column; }
.fps-armor-grid {
  display: grid; grid-template-columns: repeat(2, 40px); gap: 3px;
}
.fps-inv-craft { display: flex; flex-direction: column; }
.fps-craft-area {
  display: flex; align-items: center; gap: 6px;
}
.fps-craft-grid { display: grid; gap: 3px; }
.fps-grid-2x2  { grid-template-columns: repeat(2, 40px); }
.fps-craft-arrow { font-size: 18px; color: #555; }
.fps-craft-result { width: 40px; height: 40px; cursor: pointer; }
.fps-craft-result:hover { border-color: #fff !important; }
.fps-inv-grid {
  display: grid; grid-template-columns: repeat(9, 40px); gap: 3px;
}
.fps-inv-hotbar-row {
  display: grid; grid-template-columns: repeat(9, 40px); gap: 3px;
  padding-top: 4px; border-top: 2px solid #555;
}
.fps-slot-hotbar { border-color: #555 !important; }
.fps-inv-hint {
  font-size: 9px; color: #555;
  text-align: center;
}

/* Generic slot — Minecraft beveled gray */
.fps-slot {
  width: 40px; height: 40px;
  background: #8b8b8b;
  border: 2px solid #373737;
  border-top-color: #fff;
  border-left-color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: default; position: relative; overflow: hidden;
}
.fps-slot:hover { background: #9f9f9f; }
.fps-armor-slot { width: 40px; height: 40px; cursor: default; }
.fps-craft-cell { cursor: pointer; }
.fps-slot-icon-inner {
  font-size: 20px; pointer-events: none;
}

/* Floating damage numbers */
.floating-container {
  position: absolute; inset: 0;
  pointer-events: none; z-index: 15;
}
.float-num {
  position: absolute;
  font-size: 14px; font-weight: bold;
  color: #fff;
  text-shadow: 1px 1px 0 #000;
  pointer-events: none;
  animation: floatUp 1.1s ease-out forwards;
  transform: translateX(-50%);
}
@keyframes floatUp {
  0%   { opacity: 1; transform: translateX(-50%) translateY(0); }
  80%  { opacity: 0.8; }
  100% { opacity: 0; transform: translateX(-50%) translateY(-48px); }
}
`;class kx{constructor(){Object.defineProperty(this,"ctx",{enumerable:!0,configurable:!0,writable:!0,value:null}),Object.defineProperty(this,"masterGain",{enumerable:!0,configurable:!0,writable:!0,value:null}),Object.defineProperty(this,"effectsGain",{enumerable:!0,configurable:!0,writable:!0,value:null}),Object.defineProperty(this,"uiGain",{enumerable:!0,configurable:!0,writable:!0,value:null}),Object.defineProperty(this,"volume",{enumerable:!0,configurable:!0,writable:!0,value:{master:.7,effects:1,ui:.8}})}ensureCtx(){return this.ctx||(this.ctx=new AudioContext,this.masterGain=this.ctx.createGain(),this.effectsGain=this.ctx.createGain(),this.uiGain=this.ctx.createGain(),this.effectsGain.connect(this.masterGain),this.uiGain.connect(this.masterGain),this.masterGain.connect(this.ctx.destination),this.updateVolumes()),this.ctx.state==="suspended"&&this.ctx.resume(),this.ctx}updateVolumes(){!this.masterGain||!this.effectsGain||!this.uiGain||(this.masterGain.gain.value=this.volume.master,this.effectsGain.gain.value=this.volume.effects,this.uiGain.gain.value=this.volume.ui)}play(t,e=1){const n=this.ensureCtx(),s=t==="ui_click"||t==="upgrade"||t==="sell"?this.uiGain:this.effectsGain,o=n.createGain();o.gain.value=e,o.connect(s);const a=(c,u,f)=>{const h=n.createBuffer(1,Math.ceil(n.sampleRate*c),n.sampleRate),d=h.getChannelData(0);for(let m=0;m<d.length;m++)d[m]=(Math.random()*2-1)*Math.exp(-m/(n.sampleRate*f));const g=n.createBufferSource(),_=n.createBiquadFilter();_.type="bandpass",_.frequency.value=u,_.Q.value=1.2,g.buffer=h,g.connect(_),_.connect(o),g.start(),g.stop(n.currentTime+c)},l=(c,u,f="sine",h=e)=>{const d=n.createOscillator(),g=n.createGain();d.type=f,d.frequency.value=c,g.gain.setValueAtTime(h,n.currentTime),g.gain.exponentialRampToValueAtTime(.001,n.currentTime+u),d.connect(g),g.connect(s),d.start(),d.stop(n.currentTime+u+.05)};switch(t){case"arrow":l(440,.05,"sawtooth"),a(.04,1200,.02);break;case"cannon_fire":a(.5,80,.3),l(55,.4,"sawtooth");break;case"ice_fire":a(.12,4e3,.05),l(880,.1,"sine",.3);break;case"hit":a(.1,800,.04),l(120,.08,"square",.5);break;case"death":a(.3,200,.15),l(80,.25,"sawtooth");break;case"place":a(.06,600,.025);break;case"upgrade":{[523,659,784].forEach((u,f)=>{const h=n.createOscillator(),d=n.createGain(),g=n.currentTime+f*.09;h.type="sine",h.frequency.value=u,d.gain.setValueAtTime(.001,g),d.gain.linearRampToValueAtTime(e,g+.02),d.gain.exponentialRampToValueAtTime(.001,g+.1),h.connect(d),d.connect(s),h.start(g),h.stop(g+.12)});break}case"sell":l(523,.08,"sine"),l(392,.12,"sine");break;case"ui_click":l(880,.06,"sine");break;case"wave_start":l(220,.15,"sawtooth"),l(330,.2,"sawtooth");break;case"wave_complete":{[523,659,784,1047].forEach((u,f)=>{const h=n.createOscillator(),d=n.createGain(),g=n.currentTime+f*.1;h.type="sine",h.frequency.value=u,d.gain.setValueAtTime(.001,g),d.gain.linearRampToValueAtTime(e*.8,g+.03),d.gain.exponentialRampToValueAtTime(.001,g+.2),h.connect(d),d.connect(s),h.start(g),h.stop(g+.25)});break}case"base_hit":a(.2,100,.1),l(60,.3,"sawtooth");break;case"explosion":a(.5,80,.3),l(60,.4,"sawtooth");break;case"victory":{[523,659,784,1047].forEach(u=>{const f=n.createOscillator(),h=n.createGain();f.type="sine",f.frequency.value=u,h.gain.setValueAtTime(e*.5,n.currentTime),h.gain.exponentialRampToValueAtTime(.001,n.currentTime+1.5),f.connect(h),h.connect(s),f.start(),f.stop(n.currentTime+1.6)});break}case"swing":a(.08,2e3,.035),l(200,.06,"sawtooth",.6);break;case"bow_charge":l(330,.15,"sine",.3),l(440,.1,"sine",.2);break;case"arrow_release":a(.05,3e3,.02),l(660,.04,"sawtooth",.5);break;case"block_break":a(.18,300,.08),l(90,.12,"square",.4);break;case"block_place":a(.06,500,.025),l(160,.05,"square",.5);break;case"pickup":l(880,.05,"sine",.5),l(1047,.07,"sine",.4);break;case"eat":a(.12,600,.05),l(220,.08,"sine",.3);break;case"player_hurt":l(180,.12,"sawtooth",.7),a(.08,400,.04);break;case"player_death":a(.4,150,.2),l(100,.35,"sawtooth",.8),l(60,.5,"sine",.5);break}}}class zx{constructor(t){Object.defineProperty(this,"container",{enumerable:!0,configurable:!0,writable:!0,value:t}),Object.defineProperty(this,"phase",{enumerable:!0,configurable:!0,writable:!0,value:"wave_clear"}),Object.defineProperty(this,"mode",{enumerable:!0,configurable:!0,writable:!0,value:"helmsdeep"}),Object.defineProperty(this,"lastTime",{enumerable:!0,configurable:!0,writable:!0,value:0}),Object.defineProperty(this,"buildPhaseTimer",{enumerable:!0,configurable:!0,writable:!0,value:120}),Object.defineProperty(this,"torchLights",{enumerable:!0,configurable:!0,writable:!0,value:new Map}),Object.defineProperty(this,"hungerTimer",{enumerable:!0,configurable:!0,writable:!0,value:0}),Object.defineProperty(this,"scene",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"gameMap",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"flowField",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"player",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"inventory",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"enemies",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"projectiles",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"waves",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"blockInteraction",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"input",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"ui",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"audio",{enumerable:!0,configurable:!0,writable:!0,value:void 0})}start(){this.buildSystems(),requestAnimationFrame(t=>this.loop(t))}buildSystems(){this.scene=new I0(this.container),this.gameMap=new Q_(this.scene.scene),this.flowField=new ex(this.gameMap.world),this.flowField.recompute(tr,er),this.player=new dx(this.gameMap.world,this.scene.camera,32,48),this.inventory=new mx,this.inventory.addItem("wood_sword",1),this.inventory.addItem("wood_pickaxe",1),this.inventory.addItem("wood",16),this.inventory.addItem("dirt",16),this.inventory.addItem("torch",8),this.inventory.addItem("apple",4),this.enemies=new xx(this.scene.scene,this.scene.camera),this.enemies.setFlowField(this.flowField),this.enemies.setWorld(this.gameMap.world),this.projectiles=new Ax(this.scene.scene),this.waves=new Cx,this.blockInteraction=new Lx(this.gameMap.world,this.scene.scene,this.scene.camera),this.ui=new Nx(this.container),this.audio=new kx,this.input=new Ix(this.scene.renderer.domElement),this.wireCallbacks(),this.refreshHUD(),this.ui.setObjective(`Build fortifications! Wave 1 begins in ${Math.ceil(this.buildPhaseTimer)}s.`),this.ui.showPointerLockPrompt(!0)}wireCallbacks(){this.scene.onPointerLockChange=e=>{this.ui.showPointerLockPrompt(!e),e||this.ui.showInventory(!1)};const t=()=>{!this.scene.isPointerLocked&&!this.ui.isInventoryOpen()&&this.scene.lockPointer()};this.ui.onPointerLockRequest=t,document.addEventListener("click",t),this.input.onSlotChange=e=>{this.inventory.activeSlot=e,this.refreshHotbar()},this.input.onInventoryToggle=()=>{const e=!this.ui.isInventoryOpen();this.ui.showInventory(e,this.inventory),e&&this.scene.isPointerLocked?this.scene.unlockPointer():!e&&!this.scene.isPointerLocked&&this.scene.lockPointer()},this.input.onLeftClick=()=>{this.ui.isInventoryOpen()||this.blockInteraction.getTargetBlock()||this.tryMeleeAttack()},this.input.onRightClick=()=>{if(this.ui.isInventoryOpen())return;const e=this.inventory.getActiveItem(),n=e?dn[e.itemId]:null;(n==null?void 0:n.id)==="bow"&&this.inventory.hasItem("arrow_item",1)?(this.player.startBowCharge(),this.audio.play("bow_charge",.4)):(n==null?void 0:n.category)==="food"&&n.foodPoints&&this.player.hunger<20?(this.inventory.removeItem(e.itemId,1),this.player.hunger=Math.min(20,this.player.hunger+n.foodPoints),this.player.heal(Math.ceil(n.foodPoints/2)),this.audio.play("eat",.6),this.refreshHotbar(),this.ui.updateHunger(this.player.hunger,20),this.ui.updatePlayerHealth(this.player.health,this.player.maxHealth)):n!=null&&n.placesBlock&&e&&this.blockInteraction.tryPlace(n.placesBlock)&&(this.inventory.removeItem(e.itemId,1),this.audio.play("block_place",.5),this.refreshHotbar())},this.input.onRightRelease=()=>{if(this.player.isBowCharging){const e=this.player.releaseBow();if(e){const n=this.inventory.getActiveItem(),r=n?dn[n.itemId]:null,s=(r==null?void 0:r.damage)??6;this.projectiles.fireFromPlayer(e.from,e.direction,e.power,s),this.inventory.removeItem("arrow_item",1),this.audio.play("arrow_release"),this.refreshHotbar()}}},this.blockInteraction.onBlockBroken=(e,n,r,s,o)=>{if(this.audio.play("block_break",.55),o){const a=qu[s],l=(a==null?void 0:a.drops)??[s];for(const c of l)dn[c]&&this.inventory.addItem(c,1);this.refreshHotbar()}s==="torch"&&this.removeTorchLight(e,n,r),n>=1&&this.flowField.recompute(tr,er)},this.blockInteraction.onBlockPlaced=(e,n,r,s)=>{this.audio.play("block_place",.5),s==="torch"&&this.addTorchLight(e,n,r),this.flowField.recompute(tr,er),this.refreshHotbar()},this.enemies.onEnemyDied=e=>{e.config.xpReward&&(this.player.addXP(e.config.xpReward),this.refreshXPBar()),this.waves.onEnemyEliminated(),this.ui.updateWaveInfo(this.waves.wave,this.waves.totalWaves,this.enemies.getAliveEnemies().length),this.audio.play("death",.4)},this.enemies.onEnemyReachedBase=e=>{this.player.damage(e.config.damage),this.ui.updatePlayerHealth(this.player.health,this.player.maxHealth),this.audio.play("player_hurt",.7),this.waves.onEnemyEliminated(),this.ui.updateWaveInfo(this.waves.wave,this.waves.totalWaves,this.enemies.getAliveEnemies().length)},this.enemies.onWallBroken=(e,n)=>{this.flowField.recompute(tr,er),this.audio.play("block_break",.4)},this.player.onDeath=()=>{this.phase="gameover",this.ui.showDeathScreen(),this.audio.play("player_death"),this.scene.isPointerLocked&&this.scene.unlockPointer()},this.waves.onWaveComplete=(e,n)=>{if(this.audio.play("wave_complete"),this.waves.isLastWave())this.phase="win",this.ui.showEnd("victory",`All ${e} waves survived! The fortress holds!`),this.audio.play("victory"),this.scene.isPointerLocked&&this.scene.unlockPointer();else{this.phase="wave_clear";const r=e+1,s=this.waves.betweenWaveDuration;this.ui.setObjective(`Wave ${e} cleared! Reinforce the walls. Wave ${r} in ${s}s.`),this.ui.updateWaveInfo(e,this.waves.totalWaves,0)}},this.waves.onBetweenWaveTick=e=>{const n=this.waves.wave+1;e>0?this.ui.setObjective(`Reinforce the walls. Wave ${n} in ${e}s.`):this.startNextWave()},this.ui.onModeSelect=e=>{this.mode=e,e==="freeplay"?(this.ui.setObjective("Free Play — Mine, Build, Explore!"),this.ui.updateWaveInfo(0,10,0)):(this.ui.setObjective(`Build fortifications! Wave 1 begins in ${Math.ceil(this.buildPhaseTimer)}s.`),this.ui.updateWaveInfo(0,this.waves.totalWaves,0))},this.ui.onRestart=()=>this.resetGame()}startNextWave(){this.phase="playing",this.waves.startWave((t,e)=>this.spawnEnemy(t,e)),this.audio.play("wave_start"),this.ui.setObjective(`Wave ${this.waves.wave} — Defend the fortress!`),this.ui.updateWaveInfo(this.waves.wave,this.waves.totalWaves,0)}spawnEnemy(t,e){const n=Ia(e),[r,s]=n[Math.floor(Math.random()*n.length)];this.enemies.spawn(t,r+.5,s+.5)}resetGame(){this.phase="wave_clear",this.mode="helmsdeep",this.buildPhaseTimer=120,this.enemies.reset(),this.projectiles.reset(),this.waves.reset(),this.player.health=this.player.maxHealth,this.player.xp=0,this.player.level=0,this.player.hunger=20,this.player.onDeath=this.player.onDeath,this.flowField.recompute(tr,er),this.ui.hideDeathScreen(),this.ui.hideEnd(),this.refreshHUD(),this.ui.showPointerLockPrompt(!0)}loop(t){const e=Math.min((t-this.lastTime)/1e3,.05);this.lastTime=t,this.update(e),this.scene.render(e),requestAnimationFrame(n=>this.loop(n))}update(t){if(this.scene.updateDayNight(t),this.phase==="gameover"||this.phase==="win"||!this.scene.isPointerLocked||this.ui.isInventoryOpen())return;const e=this.input.getMovementInput();this.player.update(t,e);const n=this.inventory.getActiveItem();if(this.blockInteraction.setActiveItem(n),this.input.isLeftMouseDown()&&this.blockInteraction.getTargetBlock()?this.blockInteraction.startBreaking():this.blockInteraction.stopBreaking(),this.blockInteraction.update(t),this.mode==="helmsdeep"){if(this.phase==="wave_clear")if(this.waves.wave===0){this.buildPhaseTimer=Math.max(0,this.buildPhaseTimer-t);const r=Math.ceil(this.buildPhaseTimer);r>0?Math.ceil(this.buildPhaseTimer+t)!==r&&this.ui.setObjective(`Build fortifications! Wave 1 begins in ${r}s.`):this.startNextWave()}else this.waves.update(t);else if(this.phase==="playing"){this.waves.update(t),this.enemies.update(t),this.projectiles.update(t,s=>this.enemies.getEnemyPosition(s),(s,o,a,l)=>this.enemies.damage(s,o,a,l),(s,o)=>this.enemies.getAliveEnemies().filter(a=>{const l=this.enemies.getEnemyPosition(a.id);return l?l.distanceTo(s)<=o:!1}).map(a=>a.id),()=>this.enemies.getAliveEnemies().map(s=>s.id));const r=this.enemies.getAliveEnemies().length;this.ui.setObjective(`Defend the fortress! ${r} enemies remaining.`)}}this.hungerTimer+=t,this.hungerTimer>=45&&(this.hungerTimer=0,this.player.hunger>0?(this.player.hunger=Math.max(0,this.player.hunger-1),this.ui.updateHunger(this.player.hunger,20)):this.player.damage(1)),this.player.armorValue=this.inventory.getArmorValue(),this.ui.updatePlayerHealth(this.player.health,this.player.maxHealth),this.refreshHotbar()}tryMeleeAttack(){if(this.phase!=="playing")return;const t=this.inventory.getActiveItem(),e=t?dn[t.itemId]:null,n=(e==null?void 0:e.damage)??1,r=this.player.tryMeleeAttack();if(r){this.audio.play("swing"),this.scene.swingArm();for(const s of this.enemies.getAliveEnemies()){const o=this.enemies.getEnemyPosition(s.id);o&&o.distanceTo(r.center)<=r.radius&&(this.enemies.damage(s.id,n),this.audio.play("hit",.4))}}}torchKey(t,e,n){return`${t},${e},${n}`}addTorchLight(t,e,n){const r=this.torchKey(t,e,n);if(this.torchLights.has(r))return;const s=new b0(16755268,1.8,10,2);s.position.set(t+.5,e+.8,n+.5),this.scene.scene.add(s),this.torchLights.set(r,s)}removeTorchLight(t,e,n){const r=this.torchKey(t,e,n),s=this.torchLights.get(r);s&&(this.scene.scene.remove(s),s.dispose(),this.torchLights.delete(r))}refreshHUD(){this.refreshHotbar(),this.ui.updatePlayerHealth(this.player.health,this.player.maxHealth),this.ui.updateWaveInfo(this.waves.wave,this.waves.totalWaves,0),this.ui.updateHunger(this.player.hunger,20),this.refreshXPBar()}refreshXPBar(){const t=[0,50,150,350,700,1200],e=this.player.level;if(e>=t.length-1){this.ui.updateXP(1,1);return}const n=t[e],r=t[e+1];this.ui.updateXP(this.player.xp-n,r-n)}refreshHotbar(){this.ui.updateHotbar(this.inventory.hotbar,this.inventory.activeSlot);const t=this.inventory.getActiveItem();this.scene.updateArmItem((t==null?void 0:t.itemId)??null)}}const ju=document.getElementById("app");if(!ju)throw new Error("No #app element found");const Hx=new zx(ju);Hx.start();
