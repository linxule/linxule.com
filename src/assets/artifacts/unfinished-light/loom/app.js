var tu=0,gc=1,nu=2;var Ji=1,iu=2,Os=3,An=0,tn=1,St=2,bn=0,zi=1,Bs=2,_c=3,xc=4,su=5;var _i=100,ru=101,au=102,ou=103,lu=104,cu=200,hu=201,uu=202,du=203,Ia=204,La=205,fu=206,pu=207,mu=208,gu=209,_u=210,xu=211,vu=212,yu=213,Mu=214,Da=0,Fa=1,Na=2,ki=3,Ua=4,Oa=5,Ba=6,za=7,go=0,bu=1,Su=2,In=0,Lr=1,Dr=2,Fr=3,$i=4,Nr=5,Ur=6,Or=7;var vc=300,wi=301,Ki=302,_o=303,xo=304,Br=306,Vi=1e3,Un=1001,ka=1002,Nt=1003,Tu=1004;var zr=1005;var Mt=1006,vo=1007;var ln=1008;var cn=1009,yc=1010,Mc=1011,zs=1012,yo=1013,Ln=1014,$t=1015,Ht=1016,Mo=1017,bo=1018,ks=1020,bc=35902,Sc=35899,Tc=1021,Ec=1022,nn=1023,On=1026,Ai=1027,So=1028,To=1029,Ri=1030,Eo=1031;var wo=1033,kr=33776,Vr=33777,Hr=33778,Gr=33779,Ao=35840,Ro=35841,Co=35842,Po=35843,Io=36196,Lo=37492,Do=37496,Fo=37488,No=37489,Wr=37490,Uo=37491,Oo=37808,Bo=37809,zo=37810,ko=37811,Vo=37812,Ho=37813,Go=37814,Wo=37815,Xo=37816,qo=37817,Yo=37818,Zo=37819,Jo=37820,$o=37821,Ko=36492,jo=36494,Qo=36495,el=36283,tl=36284,Xr=36285,nl=36286;var ur=2300,Va=2301,Pa=2302,ic=2303,sc=2400,rc=2401,ac=2402;var Eu=3200,wc=3201;var qr=0,wu=1,ti="",vt="srgb",dr="srgb-linear",fr="linear",dt="srgb";var Oi=7680;var oc=519,Au=512,Ru=513,Cu=514,il=515,Pu=516,Iu=517,sl=518,Lu=519,lc=35044,ji=35048;var Ac="300 es",wn=2e3,Ts=2001;function Xd(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function qd(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function pr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Du(){let i=pr("canvas");return i.style.display="block",i}var Mh={},Es=null;function Rc(...i){let e="THREE."+i.shift();Es?Es("log",e,...i):console.log(e,...i)}function Fu(i){let e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Je(...i){i=Fu(i);let e="THREE."+i.shift();if(Es)Es("warn",e,...i);else{let t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function $e(...i){i=Fu(i);let e="THREE."+i.shift();if(Es)Es("error",e,...i);else{let t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Bi(...i){let e=i.join(" ");e in Mh||(Mh[e]=!0,Je(...i))}function Nu(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var Uu={[Da]:Fa,[Na]:Ba,[Ua]:za,[ki]:Oa,[Fa]:Da,[Ba]:Na,[za]:Ua,[Oa]:ki},Bn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}},Yt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],bh=1234567,or=Math.PI/180,Hi=180/Math.PI;function Vs(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Yt[i&255]+Yt[i>>8&255]+Yt[i>>16&255]+Yt[i>>24&255]+"-"+Yt[e&255]+Yt[e>>8&255]+"-"+Yt[e>>16&15|64]+Yt[e>>24&255]+"-"+Yt[t&63|128]+Yt[t>>8&255]+"-"+Yt[t>>16&255]+Yt[t>>24&255]+Yt[n&255]+Yt[n>>8&255]+Yt[n>>16&255]+Yt[n>>24&255]).toLowerCase()}function tt(i,e,t){return Math.max(e,Math.min(t,i))}function Cc(i,e){return(i%e+e)%e}function Yd(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Zd(i,e,t){return i!==e?(t-i)/(e-i):0}function lr(i,e,t){return(1-t)*i+t*e}function Jd(i,e,t,n){return lr(i,e,1-Math.exp(-t*n))}function $d(i,e=1){return e-Math.abs(Cc(i,e*2)-e)}function Kd(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function jd(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Qd(i,e){return i+Math.floor(Math.random()*(e-i+1))}function ef(i,e){return i+Math.random()*(e-i)}function tf(i){return i*(.5-Math.random())}function nf(i){i!==void 0&&(bh=i);let e=bh+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function sf(i){return i*or}function rf(i){return i*Hi}function af(i){return(i&i-1)===0&&i!==0}function of(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function lf(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function cf(i,e,t,n,s){let r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),u=a((e+n)/2),f=r((e-n)/2),h=a((e-n)/2),d=r((n-e)/2),g=a((n-e)/2);switch(s){case"XYX":i.set(o*u,l*f,l*h,o*c);break;case"YZY":i.set(l*h,o*u,l*f,o*c);break;case"ZXZ":i.set(l*f,l*h,o*u,o*c);break;case"XZX":i.set(o*u,l*g,l*d,o*c);break;case"YXY":i.set(l*d,o*u,l*g,o*c);break;case"ZYZ":i.set(l*g,l*d,o*u,o*c);break;default:Je("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function bs(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function jt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var sn={DEG2RAD:or,RAD2DEG:Hi,generateUUID:Vs,clamp:tt,euclideanModulo:Cc,mapLinear:Yd,inverseLerp:Zd,lerp:lr,damp:Jd,pingpong:$d,smoothstep:Kd,smootherstep:jd,randInt:Qd,randFloat:ef,randFloatSpread:tf,seededRandom:nf,degToRad:sf,radToDeg:rf,isPowerOfTwo:af,ceilPowerOfTwo:of,floorPowerOfTwo:lf,setQuaternionFromProperEuler:cf,normalize:jt,denormalize:bs},Le=class i{static{i.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=tt(this.x,e.x,t.x),this.y=tt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=tt(this.x,e,t),this.y=tt(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(tt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(tt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},on=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],u=n[s+2],f=n[s+3],h=r[a+0],d=r[a+1],g=r[a+2],y=r[a+3];if(f!==y||l!==h||c!==d||u!==g){let m=l*h+c*d+u*g+f*y;m<0&&(h=-h,d=-d,g=-g,y=-y,m=-m);let p=1-o;if(m<.9995){let A=Math.acos(m),T=Math.sin(A);p=Math.sin(p*A)/T,o=Math.sin(o*A)/T,l=l*p+h*o,c=c*p+d*o,u=u*p+g*o,f=f*p+y*o}else{l=l*p+h*o,c=c*p+d*o,u=u*p+g*o,f=f*p+y*o;let A=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=A,c*=A,u*=A,f*=A}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f}static multiplyQuaternionsFlat(e,t,n,s,r,a){let o=n[s],l=n[s+1],c=n[s+2],u=n[s+3],f=r[a],h=r[a+1],d=r[a+2],g=r[a+3];return e[t]=o*g+u*f+l*d-c*h,e[t+1]=l*g+u*h+c*f-o*d,e[t+2]=c*g+u*d+o*h-l*f,e[t+3]=u*g-o*f-l*h-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(s/2),f=o(r/2),h=l(n/2),d=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=h*u*f+c*d*g,this._y=c*d*f-h*u*g,this._z=c*u*g+h*d*f,this._w=c*u*f-h*d*g;break;case"YXZ":this._x=h*u*f+c*d*g,this._y=c*d*f-h*u*g,this._z=c*u*g-h*d*f,this._w=c*u*f+h*d*g;break;case"ZXY":this._x=h*u*f-c*d*g,this._y=c*d*f+h*u*g,this._z=c*u*g+h*d*f,this._w=c*u*f-h*d*g;break;case"ZYX":this._x=h*u*f-c*d*g,this._y=c*d*f+h*u*g,this._z=c*u*g-h*d*f,this._w=c*u*f+h*d*g;break;case"YZX":this._x=h*u*f+c*d*g,this._y=c*d*f+h*u*g,this._z=c*u*g-h*d*f,this._w=c*u*f-h*d*g;break;case"XZY":this._x=h*u*f-c*d*g,this._y=c*d*f-h*u*g,this._z=c*u*g+h*d*f,this._w=c*u*f+h*d*g;break;default:Je("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],f=t[10],h=n+o+f;if(h>0){let d=.5/Math.sqrt(h+1);this._w=.25/d,this._x=(u-l)*d,this._y=(r-c)*d,this._z=(a-s)*d}else if(n>o&&n>f){let d=2*Math.sqrt(1+n-o-f);this._w=(u-l)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+c)/d}else if(o>f){let d=2*Math.sqrt(1+o-n-f);this._w=(r-c)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(l+u)/d}else{let d=2*Math.sqrt(1+f-n-o);this._w=(a-s)/d,this._x=(r+c)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(tt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+a*o+s*c-r*l,this._y=s*u+a*l+r*o-n*c,this._z=r*u+a*c+n*l-s*o,this._w=a*u-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){let c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},U=class i{static{i.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Sh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Sh.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),u=2*(o*t-r*s),f=2*(r*n-a*t);return this.x=t+l*c+a*f-o*u,this.y=n+l*u+o*c-r*f,this.z=s+l*f+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=tt(this.x,e.x,t.x),this.y=tt(this.y,e.y,t.y),this.z=tt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=tt(this.x,e,t),this.y=tt(this.y,e,t),this.z=tt(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(tt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Il.copy(this).projectOnVector(e),this.sub(Il)}reflect(e){return this.sub(Il.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(tt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Il=new U,Sh=new on,je=class i{static{i.prototype.isMatrix3=!0}constructor(e,t,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){let u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],f=n[7],h=n[2],d=n[5],g=n[8],y=s[0],m=s[3],p=s[6],A=s[1],T=s[4],v=s[7],R=s[2],E=s[5],w=s[8];return r[0]=a*y+o*A+l*R,r[3]=a*m+o*T+l*E,r[6]=a*p+o*v+l*w,r[1]=c*y+u*A+f*R,r[4]=c*m+u*T+f*E,r[7]=c*p+u*v+f*w,r[2]=h*y+d*A+g*R,r[5]=h*m+d*T+g*E,r[8]=h*p+d*v+g*w,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-n*r*u+n*o*l+s*r*c-s*a*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=u*a-o*c,h=o*l-u*r,d=c*r-a*l,g=t*f+n*h+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/g;return e[0]=f*y,e[1]=(s*c-u*n)*y,e[2]=(o*n-s*a)*y,e[3]=h*y,e[4]=(u*t-s*l)*y,e[5]=(s*r-o*t)*y,e[6]=d*y,e[7]=(n*l-c*t)*y,e[8]=(a*t-n*r)*y,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Bi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Ll.makeScale(e,t)),this}rotate(e){return Bi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Ll.makeRotation(-e)),this}translate(e,t){return Bi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Ll.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Ll=new je,Th=new je().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Eh=new je().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function hf(){let i={enabled:!0,workingColorSpace:dr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===dt&&(s.r=$n(s.r),s.g=$n(s.g),s.b=$n(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===dt&&(s.r=Ss(s.r),s.g=Ss(s.g),s.b=Ss(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ti?fr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Bi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Bi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[dr]:{primaries:e,whitePoint:n,transfer:fr,toXYZ:Th,fromXYZ:Eh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:vt},outputColorSpaceConfig:{drawingBufferColorSpace:vt}},[vt]:{primaries:e,whitePoint:n,transfer:dt,toXYZ:Th,fromXYZ:Eh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:vt}}}),i}var rt=hf();function $n(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ss(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var cs,Ha=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{cs===void 0&&(cs=pr("canvas")),cs.width=e.width,cs.height=e.height;let s=cs.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=cs}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=pr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=$n(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor($n(t[n]/255)*255):t[n]=$n(t[n]);return{data:t,width:e.width,height:e.height}}else return Je("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},uf=0,ws=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:uf++}),this.uuid=Vs(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Dl(s[a].image)):r.push(Dl(s[a]))}else r=Dl(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function Dl(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ha.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Je("Texture: Unable to serialize Texture."),{})}var df=0,Fl=new U,Qt=class i extends Bn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Un,s=Un,r=Mt,a=ln,o=nn,l=cn,c=i.DEFAULT_ANISOTROPY,u=ti){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:df++}),this.uuid=Vs(),this.name="",this.source=new ws(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Le(0,0),this.repeat=new Le(1,1),this.center=new Le(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new je,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Fl).x}get height(){return this.source.getSize(Fl).y}get depth(){return this.source.getSize(Fl).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Je(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Je(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==vc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Vi:e.x=e.x-Math.floor(e.x);break;case Un:e.x=e.x<0?0:1;break;case ka:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Vi:e.y=e.y-Math.floor(e.y);break;case Un:e.y=e.y<0?0:1;break;case ka:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Qt.DEFAULT_IMAGE=null;Qt.DEFAULT_MAPPING=vc;Qt.DEFAULT_ANISOTROPY=1;var ft=class i{static{i.prototype.isVector4=!0}constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],u=l[4],f=l[8],h=l[1],d=l[5],g=l[9],y=l[2],m=l[6],p=l[10];if(Math.abs(u-h)<.01&&Math.abs(f-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(f+y)<.1&&Math.abs(g+m)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let T=(c+1)/2,v=(d+1)/2,R=(p+1)/2,E=(u+h)/4,w=(f+y)/4,x=(g+m)/4;return T>v&&T>R?T<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(T),s=E/n,r=w/n):v>R?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=E/s,r=x/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=w/r,s=x/r),this.set(n,s,r,t),this}let A=Math.sqrt((m-g)*(m-g)+(f-y)*(f-y)+(h-u)*(h-u));return Math.abs(A)<.001&&(A=1),this.x=(m-g)/A,this.y=(f-y)/A,this.z=(h-u)/A,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=tt(this.x,e.x,t.x),this.y=tt(this.y,e.y,t.y),this.z=tt(this.z,e.z,t.z),this.w=tt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=tt(this.x,e,t),this.y=tt(this.y,e,t),this.z=tt(this.z,e,t),this.w=tt(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(tt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Ga=class extends Bn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Mt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new ft(0,0,e,t),this.scissorTest=!1,this.viewport=new ft(0,0,e,t),this.textures=[];let s={width:e,height:t,depth:n.depth},r=new Qt(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Mt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new ws(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ct=class extends Ga{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},mr=class extends Qt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Nt,this.minFilter=Nt,this.wrapR=Un,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Wa=class extends Qt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Nt,this.minFilter=Nt,this.wrapR=Un,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ut=class i{static{i.prototype.isMatrix4=!0}constructor(e,t,n,s,r,a,o,l,c,u,f,h,d,g,y,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,u,f,h,d,g,y,m)}set(e,t,n,s,r,a,o,l,c,u,f,h,d,g,y,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=u,p[10]=f,p[14]=h,p[3]=d,p[7]=g,p[11]=y,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,s=1/hs.setFromMatrixColumn(e,0).length(),r=1/hs.setFromMatrixColumn(e,1).length(),a=1/hs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){let h=a*u,d=a*f,g=o*u,y=o*f;t[0]=l*u,t[4]=-l*f,t[8]=c,t[1]=d+g*c,t[5]=h-y*c,t[9]=-o*l,t[2]=y-h*c,t[6]=g+d*c,t[10]=a*l}else if(e.order==="YXZ"){let h=l*u,d=l*f,g=c*u,y=c*f;t[0]=h+y*o,t[4]=g*o-d,t[8]=a*c,t[1]=a*f,t[5]=a*u,t[9]=-o,t[2]=d*o-g,t[6]=y+h*o,t[10]=a*l}else if(e.order==="ZXY"){let h=l*u,d=l*f,g=c*u,y=c*f;t[0]=h-y*o,t[4]=-a*f,t[8]=g+d*o,t[1]=d+g*o,t[5]=a*u,t[9]=y-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let h=a*u,d=a*f,g=o*u,y=o*f;t[0]=l*u,t[4]=g*c-d,t[8]=h*c+y,t[1]=l*f,t[5]=y*c+h,t[9]=d*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let h=a*l,d=a*c,g=o*l,y=o*c;t[0]=l*u,t[4]=y-h*f,t[8]=g*f+d,t[1]=f,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=d*f+g,t[10]=h-y*f}else if(e.order==="XZY"){let h=a*l,d=a*c,g=o*l,y=o*c;t[0]=l*u,t[4]=-f,t[8]=c*u,t[1]=h*f+y,t[5]=a*u,t[9]=d*f-g,t[2]=g*f-d,t[6]=o*u,t[10]=y*f+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(ff,e,pf)}lookAt(e,t,n){let s=this.elements;return dn.subVectors(e,t),dn.lengthSq()===0&&(dn.z=1),dn.normalize(),hi.crossVectors(n,dn),hi.lengthSq()===0&&(Math.abs(n.z)===1?dn.x+=1e-4:dn.z+=1e-4,dn.normalize(),hi.crossVectors(n,dn)),hi.normalize(),ra.crossVectors(dn,hi),s[0]=hi.x,s[4]=ra.x,s[8]=dn.x,s[1]=hi.y,s[5]=ra.y,s[9]=dn.y,s[2]=hi.z,s[6]=ra.z,s[10]=dn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],f=n[5],h=n[9],d=n[13],g=n[2],y=n[6],m=n[10],p=n[14],A=n[3],T=n[7],v=n[11],R=n[15],E=s[0],w=s[4],x=s[8],S=s[12],C=s[1],D=s[5],L=s[9],X=s[13],Y=s[2],I=s[6],P=s[10],F=s[14],J=s[3],K=s[7],oe=s[11],me=s[15];return r[0]=a*E+o*C+l*Y+c*J,r[4]=a*w+o*D+l*I+c*K,r[8]=a*x+o*L+l*P+c*oe,r[12]=a*S+o*X+l*F+c*me,r[1]=u*E+f*C+h*Y+d*J,r[5]=u*w+f*D+h*I+d*K,r[9]=u*x+f*L+h*P+d*oe,r[13]=u*S+f*X+h*F+d*me,r[2]=g*E+y*C+m*Y+p*J,r[6]=g*w+y*D+m*I+p*K,r[10]=g*x+y*L+m*P+p*oe,r[14]=g*S+y*X+m*F+p*me,r[3]=A*E+T*C+v*Y+R*J,r[7]=A*w+T*D+v*I+R*K,r[11]=A*x+T*L+v*P+R*oe,r[15]=A*S+T*X+v*F+R*me,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],f=e[6],h=e[10],d=e[14],g=e[3],y=e[7],m=e[11],p=e[15],A=l*d-c*h,T=o*d-c*f,v=o*h-l*f,R=a*d-c*u,E=a*h-l*u,w=a*f-o*u;return t*(y*A-m*T+p*v)-n*(g*A-m*R+p*E)+s*(g*T-y*R+p*w)-r*(g*v-y*E+m*w)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],u=e[10];return t*(a*u-o*c)-n*(r*u-o*l)+s*(r*c-a*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=e[9],h=e[10],d=e[11],g=e[12],y=e[13],m=e[14],p=e[15],A=t*o-n*a,T=t*l-s*a,v=t*c-r*a,R=n*l-s*o,E=n*c-r*o,w=s*c-r*l,x=u*y-f*g,S=u*m-h*g,C=u*p-d*g,D=f*m-h*y,L=f*p-d*y,X=h*p-d*m,Y=A*X-T*L+v*D+R*C-E*S+w*x;if(Y===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let I=1/Y;return e[0]=(o*X-l*L+c*D)*I,e[1]=(s*L-n*X-r*D)*I,e[2]=(y*w-m*E+p*R)*I,e[3]=(h*E-f*w-d*R)*I,e[4]=(l*C-a*X-c*S)*I,e[5]=(t*X-s*C+r*S)*I,e[6]=(m*v-g*w-p*T)*I,e[7]=(u*w-h*v+d*T)*I,e[8]=(a*L-o*C+c*x)*I,e[9]=(n*C-t*L-r*x)*I,e[10]=(g*E-y*v+p*A)*I,e[11]=(f*v-u*E-d*A)*I,e[12]=(o*S-a*D-l*x)*I,e[13]=(t*D-n*S+s*x)*I,e[14]=(y*T-g*R-m*A)*I,e[15]=(u*R-f*T+h*A)*I,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+n,u*l-s*a,0,c*l-s*o,u*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,f=o+o,h=r*c,d=r*u,g=r*f,y=a*u,m=a*f,p=o*f,A=l*c,T=l*u,v=l*f,R=n.x,E=n.y,w=n.z;return s[0]=(1-(y+p))*R,s[1]=(d+v)*R,s[2]=(g-T)*R,s[3]=0,s[4]=(d-v)*E,s[5]=(1-(h+p))*E,s[6]=(m+A)*E,s[7]=0,s[8]=(g+T)*w,s[9]=(m-A)*w,s[10]=(1-(h+y))*w,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=hs.set(s[0],s[1],s[2]).length(),o=hs.set(s[4],s[5],s[6]).length(),l=hs.set(s[8],s[9],s[10]).length();r<0&&(a=-a),Sn.copy(this);let c=1/a,u=1/o,f=1/l;return Sn.elements[0]*=c,Sn.elements[1]*=c,Sn.elements[2]*=c,Sn.elements[4]*=u,Sn.elements[5]*=u,Sn.elements[6]*=u,Sn.elements[8]*=f,Sn.elements[9]*=f,Sn.elements[10]*=f,t.setFromRotationMatrix(Sn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=wn,l=!1){let c=this.elements,u=2*r/(t-e),f=2*r/(n-s),h=(t+e)/(t-e),d=(n+s)/(n-s),g,y;if(l)g=r/(a-r),y=a*r/(a-r);else if(o===wn)g=-(a+r)/(a-r),y=-2*a*r/(a-r);else if(o===Ts)g=-a/(a-r),y=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=wn,l=!1){let c=this.elements,u=2/(t-e),f=2/(n-s),h=-(t+e)/(t-e),d=-(n+s)/(n-s),g,y;if(l)g=1/(a-r),y=a/(a-r);else if(o===wn)g=-2/(a-r),y=-(a+r)/(a-r);else if(o===Ts)g=-1/(a-r),y=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},hs=new U,Sn=new ut,ff=new U(0,0,0),pf=new U(1,1,1),hi=new U,ra=new U,dn=new U,wh=new ut,Ah=new on,zn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],u=s[9],f=s[2],h=s[6],d=s[10];switch(t){case"XYZ":this._y=Math.asin(tt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-tt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(tt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-tt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(tt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-tt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,d),this._y=0);break;default:Je("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return wh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(wh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ah.setFromEuler(this),this.setFromQuaternion(Ah,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};zn.DEFAULT_ORDER="XYZ";var As=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},mf=0,Rh=new U,us=new on,Xn=new ut,aa=new U,er=new U,gf=new U,_f=new on,Ch=new U(1,0,0),Ph=new U(0,1,0),Ih=new U(0,0,1),Lh={type:"added"},xf={type:"removed"},ds={type:"childadded",child:null},Nl={type:"childremoved",child:null},Et=class i extends Bn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:mf++}),this.uuid=Vs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new U,t=new zn,n=new on,s=new U(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ut},normalMatrix:{value:new je}}),this.matrix=new ut,this.matrixWorld=new ut,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new As,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return us.setFromAxisAngle(e,t),this.quaternion.multiply(us),this}rotateOnWorldAxis(e,t){return us.setFromAxisAngle(e,t),this.quaternion.premultiply(us),this}rotateX(e){return this.rotateOnAxis(Ch,e)}rotateY(e){return this.rotateOnAxis(Ph,e)}rotateZ(e){return this.rotateOnAxis(Ih,e)}translateOnAxis(e,t){return Rh.copy(e).applyQuaternion(this.quaternion),this.position.add(Rh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ch,e)}translateY(e){return this.translateOnAxis(Ph,e)}translateZ(e){return this.translateOnAxis(Ih,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Xn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?aa.copy(e):aa.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),er.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Xn.lookAt(er,aa,this.up):Xn.lookAt(aa,er,this.up),this.quaternion.setFromRotationMatrix(Xn),s&&(Xn.extractRotation(s.matrixWorld),us.setFromRotationMatrix(Xn),this.quaternion.premultiply(us.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?($e("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Lh),ds.child=e,this.dispatchEvent(ds),ds.child=null):$e("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(xf),Nl.child=e,this.dispatchEvent(Nl),Nl.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Xn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Xn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Xn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Lh),ds.child=e,this.dispatchEvent(ds),ds.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(er,e,gf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(er,_f,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let f=l[c];r(e.shapes,f)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),f=a(e.shapes),h=a(e.skeletons),d=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),f.length>0&&(n.shapes=f),h.length>0&&(n.skeletons=h),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){let l=[];for(let c in o){let u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};Et.DEFAULT_UP=new U(0,1,0);Et.DEFAULT_MATRIX_AUTO_UPDATE=!0;Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var At=class extends Et{constructor(){super(),this.isGroup=!0,this.type="Group"}},vf={type:"move"},Rs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new At,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new At,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new At,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let y of e.hand.values()){let m=t.getJointPose(y,n),p=this._getHandJoint(c,y);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],h=u.position.distanceTo(f.position),d=.02,g=.005;c.inputState.pinching&&h>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(vf)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new At;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Ou={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ui={h:0,s:0,l:0},oa={h:0,s:0,l:0};function Ul(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var ze=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=vt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,rt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=rt.workingColorSpace){return this.r=e,this.g=t,this.b=n,rt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=rt.workingColorSpace){if(e=Cc(e,1),t=tt(t,0,1),n=tt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Ul(a,r,e+1/3),this.g=Ul(a,r,e),this.b=Ul(a,r,e-1/3)}return rt.colorSpaceToWorking(this,s),this}setStyle(e,t=vt){function n(r){r!==void 0&&parseFloat(r)<1&&Je("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Je("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Je("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=vt){let n=Ou[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Je("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=$n(e.r),this.g=$n(e.g),this.b=$n(e.b),this}copyLinearToSRGB(e){return this.r=Ss(e.r),this.g=Ss(e.g),this.b=Ss(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=vt){return rt.workingToColorSpace(Zt.copy(this),e),Math.round(tt(Zt.r*255,0,255))*65536+Math.round(tt(Zt.g*255,0,255))*256+Math.round(tt(Zt.b*255,0,255))}getHexString(e=vt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=rt.workingColorSpace){rt.workingToColorSpace(Zt.copy(this),t);let n=Zt.r,s=Zt.g,r=Zt.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,c,u=(o+a)/2;if(o===a)l=0,c=0;else{let f=a-o;switch(c=u<=.5?f/(a+o):f/(2-a-o),a){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=rt.workingColorSpace){return rt.workingToColorSpace(Zt.copy(this),t),e.r=Zt.r,e.g=Zt.g,e.b=Zt.b,e}getStyle(e=vt){rt.workingToColorSpace(Zt.copy(this),e);let t=Zt.r,n=Zt.g,s=Zt.b;return e!==vt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(ui),this.setHSL(ui.h+e,ui.s+t,ui.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ui),e.getHSL(oa);let n=lr(ui.h,oa.h,t),s=lr(ui.s,oa.s,t),r=lr(ui.l,oa.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Zt=new ze;ze.NAMES=Ou;var gr=class i{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new ze(e),this.density=t}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}},_r=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new ze(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Gi=class extends Et{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new zn,this.environmentIntensity=1,this.environmentRotation=new zn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},Tn=new U,qn=new U,Ol=new U,Yn=new U,fs=new U,ps=new U,Dh=new U,Bl=new U,zl=new U,kl=new U,Vl=new ft,Hl=new ft,Gl=new ft,gi=class i{constructor(e=new U,t=new U,n=new U){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Tn.subVectors(e,t),s.cross(Tn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Tn.subVectors(s,t),qn.subVectors(n,t),Ol.subVectors(e,t);let a=Tn.dot(Tn),o=Tn.dot(qn),l=Tn.dot(Ol),c=qn.dot(qn),u=qn.dot(Ol),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;let h=1/f,d=(c*l-o*u)*h,g=(a*u-o*l)*h;return r.set(1-d-g,g,d)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Yn)===null?!1:Yn.x>=0&&Yn.y>=0&&Yn.x+Yn.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,Yn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Yn.x),l.addScaledVector(a,Yn.y),l.addScaledVector(o,Yn.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return Vl.setScalar(0),Hl.setScalar(0),Gl.setScalar(0),Vl.fromBufferAttribute(e,t),Hl.fromBufferAttribute(e,n),Gl.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Vl,r.x),a.addScaledVector(Hl,r.y),a.addScaledVector(Gl,r.z),a}static isFrontFacing(e,t,n,s){return Tn.subVectors(n,t),qn.subVectors(e,t),Tn.cross(qn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Tn.subVectors(this.c,this.b),qn.subVectors(this.a,this.b),Tn.cross(qn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,a,o;fs.subVectors(s,n),ps.subVectors(r,n),Bl.subVectors(e,n);let l=fs.dot(Bl),c=ps.dot(Bl);if(l<=0&&c<=0)return t.copy(n);zl.subVectors(e,s);let u=fs.dot(zl),f=ps.dot(zl);if(u>=0&&f<=u)return t.copy(s);let h=l*f-u*c;if(h<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(n).addScaledVector(fs,a);kl.subVectors(e,r);let d=fs.dot(kl),g=ps.dot(kl);if(g>=0&&d<=g)return t.copy(r);let y=d*c-l*g;if(y<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(ps,o);let m=u*g-d*f;if(m<=0&&f-u>=0&&d-g>=0)return Dh.subVectors(r,s),o=(f-u)/(f-u+(d-g)),t.copy(s).addScaledVector(Dh,o);let p=1/(m+y+h);return a=y*p,o=h*p,t.copy(n).addScaledVector(fs,a).addScaledVector(ps,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},kn=class{constructor(e=new U(1/0,1/0,1/0),t=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(En.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(En.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=En.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,En):En.fromBufferAttribute(r,a),En.applyMatrix4(e.matrixWorld),this.expandByPoint(En);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),la.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),la.copy(n.boundingBox)),la.applyMatrix4(e.matrixWorld),this.union(la)}let s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,En),En.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(tr),ca.subVectors(this.max,tr),ms.subVectors(e.a,tr),gs.subVectors(e.b,tr),_s.subVectors(e.c,tr),di.subVectors(gs,ms),fi.subVectors(_s,gs),Di.subVectors(ms,_s);let t=[0,-di.z,di.y,0,-fi.z,fi.y,0,-Di.z,Di.y,di.z,0,-di.x,fi.z,0,-fi.x,Di.z,0,-Di.x,-di.y,di.x,0,-fi.y,fi.x,0,-Di.y,Di.x,0];return!Wl(t,ms,gs,_s,ca)||(t=[1,0,0,0,1,0,0,0,1],!Wl(t,ms,gs,_s,ca))?!1:(ha.crossVectors(di,fi),t=[ha.x,ha.y,ha.z],Wl(t,ms,gs,_s,ca))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,En).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(En).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Zn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Zn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Zn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Zn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Zn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Zn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Zn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Zn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Zn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Zn=[new U,new U,new U,new U,new U,new U,new U,new U],En=new U,la=new kn,ms=new U,gs=new U,_s=new U,di=new U,fi=new U,Di=new U,tr=new U,ca=new U,ha=new U,Fi=new U;function Wl(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Fi.fromArray(i,r);let o=s.x*Math.abs(Fi.x)+s.y*Math.abs(Fi.y)+s.z*Math.abs(Fi.z),l=e.dot(Fi),c=t.dot(Fi),u=n.dot(Fi);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}var Dt=new U,ua=new Le,yf=0,Rt=class extends Bn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:yf++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=lc,this.updateRanges=[],this.gpuType=$t,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ua.fromBufferAttribute(this,t),ua.applyMatrix3(e),this.setXY(t,ua.x,ua.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Dt.fromBufferAttribute(this,t),Dt.applyMatrix3(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Dt.fromBufferAttribute(this,t),Dt.applyMatrix4(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Dt.fromBufferAttribute(this,t),Dt.applyNormalMatrix(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Dt.fromBufferAttribute(this,t),Dt.transformDirection(e),this.setXYZ(t,Dt.x,Dt.y,Dt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=bs(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=jt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=bs(t,this.array)),t}setX(e,t){return this.normalized&&(t=jt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=bs(t,this.array)),t}setY(e,t){return this.normalized&&(t=jt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=bs(t,this.array)),t}setZ(e,t){return this.normalized&&(t=jt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=bs(t,this.array)),t}setW(e,t){return this.normalized&&(t=jt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=jt(t,this.array),n=jt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=jt(t,this.array),n=jt(n,this.array),s=jt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=jt(t,this.array),n=jt(n,this.array),s=jt(s,this.array),r=jt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==lc&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}};var xr=class extends Rt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var vr=class extends Rt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Ye=class extends Rt{constructor(e,t,n){super(new Float32Array(e),t,n)}},Mf=new kn,nr=new U,Xl=new U,Vn=class{constructor(e=new U,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Mf.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;nr.subVectors(e,this.center);let t=nr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(nr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Xl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(nr.copy(e.center).add(Xl)),this.expandByPoint(nr.copy(e.center).sub(Xl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},bf=0,vn=new ut,ql=new Et,xs=new U,fn=new kn,ir=new kn,kt=new U,at=class i extends Bn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:bf++}),this.uuid=Vs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Xd(e)?vr:xr)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new je().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return vn.makeRotationFromQuaternion(e),this.applyMatrix4(vn),this}rotateX(e){return vn.makeRotationX(e),this.applyMatrix4(vn),this}rotateY(e){return vn.makeRotationY(e),this.applyMatrix4(vn),this}rotateZ(e){return vn.makeRotationZ(e),this.applyMatrix4(vn),this}translate(e,t,n){return vn.makeTranslation(e,t,n),this.applyMatrix4(vn),this}scale(e,t,n){return vn.makeScale(e,t,n),this.applyMatrix4(vn),this}lookAt(e){return ql.lookAt(e),ql.updateMatrix(),this.applyMatrix4(ql.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(xs).negate(),this.translate(xs.x,xs.y,xs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Ye(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Je("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new kn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){$e("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];fn.setFromBufferAttribute(r),this.morphTargetsRelative?(kt.addVectors(this.boundingBox.min,fn.min),this.boundingBox.expandByPoint(kt),kt.addVectors(this.boundingBox.max,fn.max),this.boundingBox.expandByPoint(kt)):(this.boundingBox.expandByPoint(fn.min),this.boundingBox.expandByPoint(fn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&$e('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Vn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){$e("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(e){let n=this.boundingSphere.center;if(fn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){let o=t[r];ir.setFromBufferAttribute(o),this.morphTargetsRelative?(kt.addVectors(fn.min,ir.min),fn.expandByPoint(kt),kt.addVectors(fn.max,ir.max),fn.expandByPoint(kt)):(fn.expandByPoint(ir.min),fn.expandByPoint(ir.max))}fn.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)kt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(kt));if(t)for(let r=0,a=t.length;r<a;r++){let o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)kt.fromBufferAttribute(o,c),l&&(xs.fromBufferAttribute(e,c),kt.add(xs)),s=Math.max(s,n.distanceToSquared(kt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&$e('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){$e("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv,a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Rt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));let o=[],l=[];for(let x=0;x<n.count;x++)o[x]=new U,l[x]=new U;let c=new U,u=new U,f=new U,h=new Le,d=new Le,g=new Le,y=new U,m=new U;function p(x,S,C){c.fromBufferAttribute(n,x),u.fromBufferAttribute(n,S),f.fromBufferAttribute(n,C),h.fromBufferAttribute(r,x),d.fromBufferAttribute(r,S),g.fromBufferAttribute(r,C),u.sub(c),f.sub(c),d.sub(h),g.sub(h);let D=1/(d.x*g.y-g.x*d.y);isFinite(D)&&(y.copy(u).multiplyScalar(g.y).addScaledVector(f,-d.y).multiplyScalar(D),m.copy(f).multiplyScalar(d.x).addScaledVector(u,-g.x).multiplyScalar(D),o[x].add(y),o[S].add(y),o[C].add(y),l[x].add(m),l[S].add(m),l[C].add(m))}let A=this.groups;A.length===0&&(A=[{start:0,count:e.count}]);for(let x=0,S=A.length;x<S;++x){let C=A[x],D=C.start,L=C.count;for(let X=D,Y=D+L;X<Y;X+=3)p(e.getX(X+0),e.getX(X+1),e.getX(X+2))}let T=new U,v=new U,R=new U,E=new U;function w(x){R.fromBufferAttribute(s,x),E.copy(R);let S=o[x];T.copy(S),T.sub(R.multiplyScalar(R.dot(S))).normalize(),v.crossVectors(E,S);let D=v.dot(l[x])<0?-1:1;a.setXYZW(x,T.x,T.y,T.z,D)}for(let x=0,S=A.length;x<S;++x){let C=A[x],D=C.start,L=C.count;for(let X=D,Y=D+L;X<Y;X+=3)w(e.getX(X+0)),w(e.getX(X+1)),w(e.getX(X+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Rt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,d=n.count;h<d;h++)n.setXYZ(h,0,0,0);let s=new U,r=new U,a=new U,o=new U,l=new U,c=new U,u=new U,f=new U;if(e)for(let h=0,d=e.count;h<d;h+=3){let g=e.getX(h+0),y=e.getX(h+1),m=e.getX(h+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,y),a.fromBufferAttribute(t,m),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,y),c.fromBufferAttribute(n,m),o.add(u),l.add(u),c.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(y,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,d=t.count;h<d;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)kt.fromBufferAttribute(e,t),kt.normalize(),e.setXYZ(t,kt.x,kt.y,kt.z)}toNonIndexed(){function e(o,l){let c=o.array,u=o.itemSize,f=o.normalized,h=new c.constructor(l.length*u),d=0,g=0;for(let y=0,m=l.length;y<m;y++){o.isInterleavedBufferAttribute?d=l[y]*o.data.stride+o.offset:d=l[y]*u;for(let p=0;p<u;p++)h[g++]=c[d++]}return new Rt(h,u,f)}if(this.index===null)return Je("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,n);t.setAttribute(o,c)}let r=this.morphAttributes;for(let o in r){let l=[],c=r[o];for(let u=0,f=c.length;u<f;u++){let h=c[u],d=e(h,n);l.push(d)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let f=0,h=c.length;f<h;f++){let d=c[f];u.push(d.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(t))}let r=e.morphAttributes;for(let c in r){let u=[],f=r[c];for(let h=0,d=f.length;h<d;h++)u.push(f[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,u=a.length;c<u;c++){let f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var Sf=0,Rn=class extends Bn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Sf++}),this.uuid=Vs(),this.name="",this.type="Material",this.blending=zi,this.side=An,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ia,this.blendDst=La,this.blendEquation=_i,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ze(0,0,0),this.blendAlpha=0,this.depthFunc=ki,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=oc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Oi,this.stencilZFail=Oi,this.stencilZPass=Oi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Je(`Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){Je(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==zi&&(n.blending=this.blending),this.side!==An&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ia&&(n.blendSrc=this.blendSrc),this.blendDst!==La&&(n.blendDst=this.blendDst),this.blendEquation!==_i&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ki&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==oc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Oi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Oi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Oi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(t){let r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new ze().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Le().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Le().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var Jn=new U,Yl=new U,da=new U,pi=new U,Zl=new U,fa=new U,Jl=new U,Wi=class{constructor(e=new U,t=new U(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Jn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Jn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Jn.copy(this.origin).addScaledVector(this.direction,t),Jn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Yl.copy(e).add(t).multiplyScalar(.5),da.copy(t).sub(e).normalize(),pi.copy(this.origin).sub(Yl);let r=e.distanceTo(t)*.5,a=-this.direction.dot(da),o=pi.dot(this.direction),l=-pi.dot(da),c=pi.lengthSq(),u=Math.abs(1-a*a),f,h,d,g;if(u>0)if(f=a*l-o,h=a*o-l,g=r*u,f>=0)if(h>=-g)if(h<=g){let y=1/u;f*=y,h*=y,d=f*(f+a*h+2*o)+h*(a*f+h+2*l)+c}else h=r,f=Math.max(0,-(a*h+o)),d=-f*f+h*(h+2*l)+c;else h=-r,f=Math.max(0,-(a*h+o)),d=-f*f+h*(h+2*l)+c;else h<=-g?(f=Math.max(0,-(-a*r+o)),h=f>0?-r:Math.min(Math.max(-r,-l),r),d=-f*f+h*(h+2*l)+c):h<=g?(f=0,h=Math.min(Math.max(-r,-l),r),d=h*(h+2*l)+c):(f=Math.max(0,-(a*r+o)),h=f>0?r:Math.min(Math.max(-r,-l),r),d=-f*f+h*(h+2*l)+c);else h=a>0?-r:r,f=Math.max(0,-(a*h+o)),d=-f*f+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Yl).addScaledVector(da,h),d}intersectSphere(e,t){Jn.subVectors(e.center,this.origin);let n=Jn.dot(this.direction),s=Jn.dot(Jn)-n*n,r=e.radius*e.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l,c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,h=this.origin;return c>=0?(n=(e.min.x-h.x)*c,s=(e.max.x-h.x)*c):(n=(e.max.x-h.x)*c,s=(e.min.x-h.x)*c),u>=0?(r=(e.min.y-h.y)*u,a=(e.max.y-h.y)*u):(r=(e.max.y-h.y)*u,a=(e.min.y-h.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(e.min.z-h.z)*f,l=(e.max.z-h.z)*f):(o=(e.max.z-h.z)*f,l=(e.min.z-h.z)*f),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Jn)!==null}intersectTriangle(e,t,n,s,r){Zl.subVectors(t,e),fa.subVectors(n,e),Jl.crossVectors(Zl,fa);let a=this.direction.dot(Jl),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;pi.subVectors(this.origin,e);let l=o*this.direction.dot(fa.crossVectors(pi,fa));if(l<0)return null;let c=o*this.direction.dot(Zl.cross(pi));if(c<0||l+c>a)return null;let u=-o*pi.dot(Jl);return u<0?null:this.at(u/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},xi=class extends Rn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.combine=go,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Fh=new ut,Ni=new Wi,pa=new Vn,Nh=new U,ma=new U,ga=new U,_a=new U,$l=new U,xa=new U,Uh=new U,va=new U,Ke=class extends Et{constructor(e=new at,t=new xi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(r&&o){xa.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let u=o[l],f=r[l];u!==0&&($l.fromBufferAttribute(f,e),a?xa.addScaledVector($l,u):xa.addScaledVector($l.sub(t),u))}t.add(xa)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),pa.copy(n.boundingSphere),pa.applyMatrix4(r),Ni.copy(e.ray).recast(e.near),!(pa.containsPoint(Ni.origin)===!1&&(Ni.intersectSphere(pa,Nh)===null||Ni.origin.distanceToSquared(Nh)>(e.far-e.near)**2))&&(Fh.copy(r).invert(),Ni.copy(e.ray).applyMatrix4(Fh),!(n.boundingBox!==null&&Ni.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ni)))}_computeIntersections(e,t,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,f=r.attributes.normal,h=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,y=h.length;g<y;g++){let m=h[g],p=a[m.materialIndex],A=Math.max(m.start,d.start),T=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let v=A,R=T;v<R;v+=3){let E=o.getX(v),w=o.getX(v+1),x=o.getX(v+2);s=ya(this,p,e,n,c,u,f,E,w,x),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,d.start),y=Math.min(o.count,d.start+d.count);for(let m=g,p=y;m<p;m+=3){let A=o.getX(m),T=o.getX(m+1),v=o.getX(m+2);s=ya(this,a,e,n,c,u,f,A,T,v),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,y=h.length;g<y;g++){let m=h[g],p=a[m.materialIndex],A=Math.max(m.start,d.start),T=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let v=A,R=T;v<R;v+=3){let E=v,w=v+1,x=v+2;s=ya(this,p,e,n,c,u,f,E,w,x),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let g=Math.max(0,d.start),y=Math.min(l.count,d.start+d.count);for(let m=g,p=y;m<p;m+=3){let A=m,T=m+1,v=m+2;s=ya(this,a,e,n,c,u,f,A,T,v),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function Tf(i,e,t,n,s,r,a,o){let l;if(e.side===tn?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===An,o),l===null)return null;va.copy(o),va.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(va);return c<t.near||c>t.far?null:{distance:c,point:va.clone(),object:i}}function ya(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,ma),i.getVertexPosition(l,ga),i.getVertexPosition(c,_a);let u=Tf(i,e,t,n,ma,ga,_a,Uh);if(u){let f=new U;gi.getBarycoord(Uh,ma,ga,_a,f),s&&(u.uv=gi.getInterpolatedAttribute(s,o,l,c,f,new Le)),r&&(u.uv1=gi.getInterpolatedAttribute(r,o,l,c,f,new Le)),a&&(u.normal=gi.getInterpolatedAttribute(a,o,l,c,f,new U),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let h={a:o,b:l,c,normal:new U,materialIndex:0};gi.getNormal(ma,ga,_a,h.normal),u.face=h,u.barycoord=f}return u}var vi=class extends Qt{constructor(e=null,t=1,n=1,s,r,a,o,l,c=Nt,u=Nt,f,h){super(null,a,o,l,c,u,s,r,f,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Kn=class extends Rt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},vs=new ut,Oh=new ut,Ma=[],Bh=new kn,Ef=new ut,sr=new Ke,rr=new Vn,yi=class extends Ke{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Kn(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Ef)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new kn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,vs),Bh.copy(e.boundingBox).applyMatrix4(vs),this.boundingBox.union(Bh)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Vn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,vs),rr.copy(e.boundingSphere).applyMatrix4(vs),this.boundingSphere.union(rr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(sr.geometry=this.geometry,sr.material=this.material,sr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),rr.copy(this.boundingSphere),rr.applyMatrix4(n),e.ray.intersectsSphere(rr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,vs),Oh.multiplyMatrices(n,vs),sr.matrixWorld=Oh,sr.raycast(e,Ma);for(let a=0,o=Ma.length;a<o;a++){let l=Ma[a];l.instanceId=r,l.object=this,t.push(l)}Ma.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Kn(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new vi(new Float32Array(s*this.count),s,this.count,So,$t));let r=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Kl=new U,wf=new U,Af=new je,Jt=class{constructor(e=new U(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Kl.subVectors(n,t).cross(wf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let s=e.delta(Kl),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Af.getNormalMatrix(e),s=this.coplanarPoint(Kl).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Ui=new Vn,Rf=new Le(.5,.5),ba=new U,Cs=class{constructor(e=new Jt,t=new Jt,n=new Jt,s=new Jt,r=new Jt,a=new Jt){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=wn,n=!1){let s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],u=r[4],f=r[5],h=r[6],d=r[7],g=r[8],y=r[9],m=r[10],p=r[11],A=r[12],T=r[13],v=r[14],R=r[15];if(s[0].setComponents(c-a,d-u,p-g,R-A).normalize(),s[1].setComponents(c+a,d+u,p+g,R+A).normalize(),s[2].setComponents(c+o,d+f,p+y,R+T).normalize(),s[3].setComponents(c-o,d-f,p-y,R-T).normalize(),n)s[4].setComponents(l,h,m,v).normalize(),s[5].setComponents(c-l,d-h,p-m,R-v).normalize();else if(s[4].setComponents(c-l,d-h,p-m,R-v).normalize(),t===wn)s[5].setComponents(c+l,d+h,p+m,R+v).normalize();else if(t===Ts)s[5].setComponents(l,h,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ui.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ui.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ui)}intersectsSprite(e){Ui.center.set(0,0,0);let t=Rf.distanceTo(e.center);return Ui.radius=.7071067811865476+t,Ui.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ui)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(ba.x=s.normal.x>0?e.max.x:e.min.x,ba.y=s.normal.y>0?e.max.y:e.min.y,ba.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ba)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var yn=class extends Rn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ze(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Xa=new U,qa=new U,zh=new ut,ar=new Wi,Sa=new Vn,jl=new U,kh=new U,Ya=class extends Et{constructor(e=new at,t=new yn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Xa.fromBufferAttribute(t,s-1),qa.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Xa.distanceTo(qa);e.setAttribute("lineDistance",new Ye(n,1))}else Je("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Sa.copy(n.boundingSphere),Sa.applyMatrix4(s),Sa.radius+=r,e.ray.intersectsSphere(Sa)===!1)return;zh.copy(s).invert(),ar.copy(e.ray).applyMatrix4(zh);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=n.index,h=n.attributes.position;if(u!==null){let d=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let y=d,m=g-1;y<m;y+=c){let p=u.getX(y),A=u.getX(y+1),T=Ta(this,e,ar,l,p,A,y);T&&t.push(T)}if(this.isLineLoop){let y=u.getX(g-1),m=u.getX(d),p=Ta(this,e,ar,l,y,m,g-1);p&&t.push(p)}}else{let d=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let y=d,m=g-1;y<m;y+=c){let p=Ta(this,e,ar,l,y,y+1,y);p&&t.push(p)}if(this.isLineLoop){let y=Ta(this,e,ar,l,g-1,d,g-1);y&&t.push(y)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Ta(i,e,t,n,s,r,a){let o=i.geometry.attributes.position;if(Xa.fromBufferAttribute(o,s),qa.fromBufferAttribute(o,r),t.distanceSqToSegment(Xa,qa,jl,kh)>n)return;jl.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(jl);if(!(c<e.near||c>e.far))return{distance:c,point:kh.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}var Vh=new U,Hh=new U,Cn=class extends Ya{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Vh.fromBufferAttribute(t,s),Hh.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Vh.distanceTo(Hh);e.setAttribute("lineDistance",new Ye(n,1))}else Je("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var Za=class extends Rn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ze(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Gh=new ut,cc=new Wi,Ea=new Vn,wa=new U,Xi=class extends Et{constructor(e=new at,t=new Za){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ea.copy(n.boundingSphere),Ea.applyMatrix4(s),Ea.radius+=r,e.ray.intersectsSphere(Ea)===!1)return;Gh.copy(s).invert(),cc.copy(e.ray).applyMatrix4(Gh);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,f=n.attributes.position;if(c!==null){let h=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);for(let g=h,y=d;g<y;g++){let m=c.getX(g);wa.fromBufferAttribute(f,m),Wh(wa,m,l,s,e,t,this)}}else{let h=Math.max(0,a.start),d=Math.min(f.count,a.start+a.count);for(let g=h,y=d;g<y;g++)wa.fromBufferAttribute(f,g),Wh(wa,g,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}};function Wh(i,e,t,n,s,r,a){let o=cc.distanceSqToPoint(i);if(o<t){let l=new U;cc.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var yr=class extends Qt{constructor(e=[],t=wi,n,s,r,a,o,l,c,u){super(e,t,n,s,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},pn=class extends Qt{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var jn=class extends Qt{constructor(e,t,n=Ln,s,r,a,o=Nt,l=Nt,c,u=On,f=1){if(u!==On&&u!==Ai)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:t,depth:f};super(h,s,r,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ws(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Ja=class extends jn{constructor(e,t=Ln,n=wi,s,r,a=Nt,o=Nt,l,c=On){let u={width:e,height:e,depth:1},f=[u,u,u,u,u,u];super(e,e,t,n,s,r,a,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Mr=class extends Qt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Ps=class i extends at{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],c=[],u=[],f=[],h=0,d=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Ye(c,3)),this.setAttribute("normal",new Ye(u,3)),this.setAttribute("uv",new Ye(f,2));function g(y,m,p,A,T,v,R,E,w,x,S){let C=v/w,D=R/x,L=v/2,X=R/2,Y=E/2,I=w+1,P=x+1,F=0,J=0,K=new U;for(let oe=0;oe<P;oe++){let me=oe*D-X;for(let de=0;de<I;de++){let we=de*C-L;K[y]=we*A,K[m]=me*T,K[p]=Y,c.push(K.x,K.y,K.z),K[y]=0,K[m]=0,K[p]=E>0?1:-1,u.push(K.x,K.y,K.z),f.push(de/w),f.push(1-oe/x),F+=1}}for(let oe=0;oe<x;oe++)for(let me=0;me<w;me++){let de=h+me+I*oe,we=h+me+I*(oe+1),Ge=h+(me+1)+I*(oe+1),Re=h+(me+1)+I*oe;l.push(de,we,Re),l.push(we,Ge,Re),J+=6}o.addGroup(d,J,S),d+=J,h+=F}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var Qn=class i extends at{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let u=[],f=[],h=[],d=[],g=0,y=[],m=n/2,p=0;A(),a===!1&&(e>0&&T(!0),t>0&&T(!1)),this.setIndex(u),this.setAttribute("position",new Ye(f,3)),this.setAttribute("normal",new Ye(h,3)),this.setAttribute("uv",new Ye(d,2));function A(){let v=new U,R=new U,E=0,w=(t-e)/n;for(let x=0;x<=r;x++){let S=[],C=x/r,D=C*(t-e)+e;for(let L=0;L<=s;L++){let X=L/s,Y=X*l+o,I=Math.sin(Y),P=Math.cos(Y);R.x=D*I,R.y=-C*n+m,R.z=D*P,f.push(R.x,R.y,R.z),v.set(I,w,P).normalize(),h.push(v.x,v.y,v.z),d.push(X,1-C),S.push(g++)}y.push(S)}for(let x=0;x<s;x++)for(let S=0;S<r;S++){let C=y[S][x],D=y[S+1][x],L=y[S+1][x+1],X=y[S][x+1];(e>0||S!==0)&&(u.push(C,D,X),E+=3),(t>0||S!==r-1)&&(u.push(D,L,X),E+=3)}c.addGroup(p,E,0),p+=E}function T(v){let R=g,E=new Le,w=new U,x=0,S=v===!0?e:t,C=v===!0?1:-1;for(let L=1;L<=s;L++)f.push(0,m*C,0),h.push(0,C,0),d.push(.5,.5),g++;let D=g;for(let L=0;L<=s;L++){let Y=L/s*l+o,I=Math.cos(Y),P=Math.sin(Y);w.x=S*P,w.y=m*C,w.z=S*I,f.push(w.x,w.y,w.z),h.push(0,C,0),E.x=I*.5+.5,E.y=P*.5*C+.5,d.push(E.x,E.y),g++}for(let L=0;L<s;L++){let X=R+L,Y=D+L;v===!0?u.push(Y,Y+1,X):u.push(Y+1,Y,X),x+=3}c.addGroup(p,x,v===!0?1:2),p+=x}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var Mn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Je("Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let u=n[s],h=n[s+1]-u,d=(a-u)/h;return(s+d)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new Le:new U);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new U,s=[],r=[],a=[],o=new U,l=new ut;for(let d=0;d<=e;d++){let g=d/e;s[d]=this.getTangentAt(g,new U)}r[0]=new U,a[0]=new U;let c=Number.MAX_VALUE,u=Math.abs(s[0].x),f=Math.abs(s[0].y),h=Math.abs(s[0].z);u<=c&&(c=u,n.set(1,0,0)),f<=c&&(c=f,n.set(0,1,0)),h<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let d=1;d<=e;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(s[d-1],s[d]),o.length()>Number.EPSILON){o.normalize();let g=Math.acos(tt(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(o,g))}a[d].crossVectors(s[d],r[d])}if(t===!0){let d=Math.acos(tt(r[0].dot(r[e]),-1,1));d/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(d=-d);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],d*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},br=class extends Mn{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new Le){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let u=Math.cos(this.aRotation),f=Math.sin(this.aRotation),h=l-this.aX,d=c-this.aY;l=h*u-d*f+this.aX,c=h*f+d*u+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},$a=class extends br{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Pc(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,u,f){let h=(a-r)/c-(o-r)/(c+u)+(o-a)/u,d=(o-a)/u-(l-a)/(u+f)+(l-o)/f;h*=u,d*=u,s(a,o,h,d)},calc:function(r){let a=r*r,o=a*r;return i+e*r+t*a+n*o}}}var Xh=new U,qh=new U,Ql=new Pc,ec=new Pc,tc=new Pc,Pn=class extends Mn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new U){let n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,u;this.closed||o>0?c=s[(o-1)%r]:(qh.subVectors(s[0],s[1]).add(s[0]),c=qh);let f=s[o%r],h=s[(o+1)%r];if(this.closed||o+2<r?u=s[(o+2)%r]:(Xh.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=Xh),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(f),d),y=Math.pow(f.distanceToSquared(h),d),m=Math.pow(h.distanceToSquared(u),d);y<1e-4&&(y=1),g<1e-4&&(g=y),m<1e-4&&(m=y),Ql.initNonuniformCatmullRom(c.x,f.x,h.x,u.x,g,y,m),ec.initNonuniformCatmullRom(c.y,f.y,h.y,u.y,g,y,m),tc.initNonuniformCatmullRom(c.z,f.z,h.z,u.z,g,y,m)}else this.curveType==="catmullrom"&&(Ql.initCatmullRom(c.x,f.x,h.x,u.x,this.tension),ec.initCatmullRom(c.y,f.y,h.y,u.y,this.tension),tc.initCatmullRom(c.z,f.z,h.z,u.z,this.tension));return n.set(Ql.calc(l),ec.calc(l),tc.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new U().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Yh(i,e,t,n,s){let r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function Cf(i,e){let t=1-i;return t*t*e}function Pf(i,e){return 2*(1-i)*i*e}function If(i,e){return i*i*e}function cr(i,e,t,n){return Cf(i,e)+Pf(i,t)+If(i,n)}function Lf(i,e){let t=1-i;return t*t*t*e}function Df(i,e){let t=1-i;return 3*t*t*i*e}function Ff(i,e){return 3*(1-i)*i*i*e}function Nf(i,e){return i*i*i*e}function hr(i,e,t,n,s){return Lf(i,e)+Df(i,t)+Ff(i,n)+Nf(i,s)}var Ka=class extends Mn{constructor(e=new Le,t=new Le,n=new Le,s=new Le){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new Le){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(hr(e,s.x,r.x,a.x,o.x),hr(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},ja=class extends Mn{constructor(e=new U,t=new U,n=new U,s=new U){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new U){let n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(hr(e,s.x,r.x,a.x,o.x),hr(e,s.y,r.y,a.y,o.y),hr(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Qa=class extends Mn{constructor(e=new Le,t=new Le){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Le){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Le){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},eo=class extends Mn{constructor(e=new U,t=new U){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new U){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new U){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},to=class extends Mn{constructor(e=new Le,t=new Le,n=new Le){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new Le){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(cr(e,s.x,r.x,a.x),cr(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Sr=class extends Mn{constructor(e=new U,t=new U,n=new U){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new U){let n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(cr(e,s.x,r.x,a.x),cr(e,s.y,r.y,a.y),cr(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},no=class extends Mn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Le){let n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],u=s[a>s.length-2?s.length-1:a+1],f=s[a>s.length-3?s.length-1:a+2];return n.set(Yh(o,l.x,c.x,u.x,f.x),Yh(o,l.y,c.y,u.y,f.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new Le().fromArray(s))}return this}},Uf=Object.freeze({__proto__:null,ArcCurve:$a,CatmullRomCurve3:Pn,CubicBezierCurve:Ka,CubicBezierCurve3:ja,EllipseCurve:br,LineCurve:Qa,LineCurve3:eo,QuadraticBezierCurve:to,QuadraticBezierCurve3:Sr,SplineCurve:no});var Tr=class i extends at{constructor(e=[new Le(0,-.5),new Le(.5,0),new Le(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=tt(s,0,Math.PI*2);let r=[],a=[],o=[],l=[],c=[],u=1/t,f=new U,h=new Le,d=new U,g=new U,y=new U,m=0,p=0;for(let A=0;A<=e.length-1;A++)switch(A){case 0:m=e[A+1].x-e[A].x,p=e[A+1].y-e[A].y,d.x=p*1,d.y=-m,d.z=p*0,y.copy(d),d.normalize(),l.push(d.x,d.y,d.z);break;case e.length-1:l.push(y.x,y.y,y.z);break;default:m=e[A+1].x-e[A].x,p=e[A+1].y-e[A].y,d.x=p*1,d.y=-m,d.z=p*0,g.copy(d),d.x+=y.x,d.y+=y.y,d.z+=y.z,d.normalize(),l.push(d.x,d.y,d.z),y.copy(g)}for(let A=0;A<=t;A++){let T=n+A*u*s,v=Math.sin(T),R=Math.cos(T);for(let E=0;E<=e.length-1;E++){f.x=e[E].x*v,f.y=e[E].y,f.z=e[E].x*R,a.push(f.x,f.y,f.z),h.x=A/t,h.y=E/(e.length-1),o.push(h.x,h.y);let w=l[3*E+0]*v,x=l[3*E+1],S=l[3*E+0]*R;c.push(w,x,S)}}for(let A=0;A<t;A++)for(let T=0;T<e.length-1;T++){let v=T+A*e.length,R=v,E=v+e.length,w=v+e.length+1,x=v+1;r.push(R,E,x),r.push(w,x,E)}this.setIndex(r),this.setAttribute("position",new Ye(a,3)),this.setAttribute("uv",new Ye(o,2)),this.setAttribute("normal",new Ye(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}};var Vt=class i extends at{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,u=l+1,f=e/o,h=t/l,d=[],g=[],y=[],m=[];for(let p=0;p<u;p++){let A=p*h-a;for(let T=0;T<c;T++){let v=T*f-r;g.push(v,-A,0),y.push(0,0,1),m.push(T/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let A=0;A<o;A++){let T=A+c*p,v=A+c*(p+1),R=A+1+c*(p+1),E=A+1+c*p;d.push(T,v,E),d.push(v,R,E)}this.setIndex(d),this.setAttribute("position",new Ye(g,3)),this.setAttribute("normal",new Ye(y,3)),this.setAttribute("uv",new Ye(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var Is=class i extends at{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);let l=[],c=[],u=[],f=[],h=new U,d=new U,g=new U;for(let y=0;y<=n;y++){let m=a+y/n*o;for(let p=0;p<=s;p++){let A=p/s*r;d.x=(e+t*Math.cos(m))*Math.cos(A),d.y=(e+t*Math.cos(m))*Math.sin(A),d.z=t*Math.sin(m),c.push(d.x,d.y,d.z),h.x=e*Math.cos(A),h.y=e*Math.sin(A),g.subVectors(d,h).normalize(),u.push(g.x,g.y,g.z),f.push(p/s),f.push(y/n)}}for(let y=1;y<=n;y++)for(let m=1;m<=s;m++){let p=(s+1)*y+m-1,A=(s+1)*(y-1)+m-1,T=(s+1)*(y-1)+m,v=(s+1)*y+m;l.push(p,A,v),l.push(A,T,v)}this.setIndex(l),this.setAttribute("position",new Ye(c,3)),this.setAttribute("normal",new Ye(u,3)),this.setAttribute("uv",new Ye(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var Er=class i extends at{constructor(e=new Sr(new U(-1,-1,0),new U(-1,1,0),new U(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};let a=e.computeFrenetFrames(t,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new U,l=new U,c=new Le,u=new U,f=[],h=[],d=[],g=[];y(),this.setIndex(g),this.setAttribute("position",new Ye(f,3)),this.setAttribute("normal",new Ye(h,3)),this.setAttribute("uv",new Ye(d,2));function y(){for(let T=0;T<t;T++)m(T);m(r===!1?t:0),A(),p()}function m(T){u=e.getPointAt(T/t,u);let v=a.normals[T],R=a.binormals[T];for(let E=0;E<=s;E++){let w=E/s*Math.PI*2,x=Math.sin(w),S=-Math.cos(w);l.x=S*v.x+x*R.x,l.y=S*v.y+x*R.y,l.z=S*v.z+x*R.z,l.normalize(),h.push(l.x,l.y,l.z),o.x=u.x+n*l.x,o.y=u.y+n*l.y,o.z=u.z+n*l.z,f.push(o.x,o.y,o.z)}}function p(){for(let T=1;T<=t;T++)for(let v=1;v<=s;v++){let R=(s+1)*(T-1)+(v-1),E=(s+1)*T+(v-1),w=(s+1)*T+v,x=(s+1)*(T-1)+v;g.push(R,E,x),g.push(E,w,x)}}function A(){for(let T=0;T<=t;T++)for(let v=0;v<=s;v++)c.x=T/t,c.y=v/s,d.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new i(new Uf[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}};function Qi(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];if(Zh(s))s.isRenderTargetTexture?(Je("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(Zh(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function Kt(i){let e={};for(let t=0;t<i.length;t++){let n=Qi(i[t]);for(let s in n)e[s]=n[s]}return e}function Zh(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Of(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Ic(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:rt.workingColorSpace}var gn={clone:Qi,merge:Kt},Bf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,zf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,mt=class extends Rn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Bf,this.fragmentShader=zf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Qi(e.uniforms),this.uniformsGroups=Of(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new ze().setHex(s.value);break;case"v2":this.uniforms[n].value=new Le().fromArray(s.value);break;case"v3":this.uniforms[n].value=new U().fromArray(s.value);break;case"v4":this.uniforms[n].value=new ft().fromArray(s.value);break;case"m3":this.uniforms[n].value=new je().fromArray(s.value);break;case"m4":this.uniforms[n].value=new ut().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Ls=class extends mt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},en=class extends Rn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ze(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ze(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=qr,this.normalScale=new Le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},ei=class extends en{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Le(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return tt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ze(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ze(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ze(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var Ds=class extends Rn{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ze(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=qr,this.normalScale=new Le(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.combine=go,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Fs=class extends Rn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Eu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ns=class extends Rn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Aa(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}var Mi=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<s)){for(let o=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=t[++n],e<s)break e}a=t.length;break t}if(!(e>=r)){let o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){let o=n+a>>>1;e<t[o]?a=o:n=o+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},io=class extends Mi{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:sc,endingEnd:sc}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case rc:r=e,o=2*t-n;break;case ac:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case rc:a=e,l=2*n-t;break;case ac:a=1,l=n+s[1]-s[0];break;default:a=e-1,l=t}let c=(n-t)*.5,u=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this._offsetPrev,f=this._offsetNext,h=this._weightPrev,d=this._weightNext,g=(n-t)/(s-t),y=g*g,m=y*g,p=-h*m+2*h*y-h*g,A=(1+h)*m+(-1.5-2*h)*y+(-.5+h)*g+1,T=(-1-d)*m+(1.5+d)*y+.5*g,v=d*m-d*y;for(let R=0;R!==o;++R)r[R]=p*a[u+R]+A*a[c+R]+T*a[l+R]+v*a[f+R];return r}},so=class extends Mi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=(n-t)/(s-t),f=1-u;for(let h=0;h!==o;++h)r[h]=a[c+h]*f+a[l+h]*u;return r}},ro=class extends Mi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},ao=class extends Mi{interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,u=this.inTangents,f=this.outTangents;if(!u||!f){let g=(n-t)/(s-t),y=1-g;for(let m=0;m!==o;++m)r[m]=a[c+m]*y+a[l+m]*g;return r}let h=o*2,d=e-1;for(let g=0;g!==o;++g){let y=a[c+g],m=a[l+g],p=d*h+g*2,A=f[p],T=f[p+1],v=e*h+g*2,R=u[v],E=u[v+1],w=(n-t)/(s-t),x,S,C,D,L;for(let X=0;X<8;X++){x=w*w,S=x*w,C=1-w,D=C*C,L=D*C;let I=L*t+3*D*w*A+3*C*x*R+S*s-n;if(Math.abs(I)<1e-10)break;let P=3*D*(A-t)+6*C*w*(R-A)+3*x*(s-R);if(Math.abs(P)<1e-10)break;w=w-I/P,w=Math.max(0,Math.min(1,w))}r[g]=L*y+3*D*w*T+3*C*x*E+S*m}return r}},mn=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Aa(t,this.TimeBufferType),this.values=Aa(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Aa(e.times,Array),values:Aa(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new ro(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new so(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new io(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new ao(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case ur:t=this.InterpolantFactoryMethodDiscrete;break;case Va:t=this.InterpolantFactoryMethodLinear;break;case Pa:t=this.InterpolantFactoryMethodSmooth;break;case ic:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Je("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ur;case this.InterpolantFactoryMethodLinear:return Va;case this.InterpolantFactoryMethodSmooth:return Pa;case this.InterpolantFactoryMethodBezier:return ic}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&($e("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&($e("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){$e("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){$e("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&qd(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){$e("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Pa,r=e.length-1,a=1;for(let o=1;o<r;++o){let l=!1,c=e[o],u=e[o+1];if(c!==u&&(o!==1||c!==e[0]))if(s)l=!0;else{let f=o*n,h=f-n,d=f+n;for(let g=0;g!==n;++g){let y=t[f+g];if(y!==t[h+g]||y!==t[d+g]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let f=o*n,h=a*n;for(let d=0;d!==n;++d)t[h+d]=t[f+d]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};mn.prototype.ValueTypeName="";mn.prototype.TimeBufferType=Float32Array;mn.prototype.ValueBufferType=Float32Array;mn.prototype.DefaultInterpolation=Va;var bi=class extends mn{constructor(e,t,n){super(e,t,n)}};bi.prototype.ValueTypeName="bool";bi.prototype.ValueBufferType=Array;bi.prototype.DefaultInterpolation=ur;bi.prototype.InterpolantFactoryMethodLinear=void 0;bi.prototype.InterpolantFactoryMethodSmooth=void 0;var oo=class extends mn{constructor(e,t,n,s){super(e,t,n,s)}};oo.prototype.ValueTypeName="color";var lo=class extends mn{constructor(e,t,n,s){super(e,t,n,s)}};lo.prototype.ValueTypeName="number";var co=class extends Mi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(s-t),c=e*o;for(let u=c+o;c!==u;c+=4)on.slerpFlat(r,0,a,c-o,a,c,l);return r}},wr=class extends mn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new co(this.times,this.values,this.getValueSize(),e)}};wr.prototype.ValueTypeName="quaternion";wr.prototype.InterpolantFactoryMethodSmooth=void 0;var Si=class extends mn{constructor(e,t,n){super(e,t,n)}};Si.prototype.ValueTypeName="string";Si.prototype.ValueBufferType=Array;Si.prototype.DefaultInterpolation=ur;Si.prototype.InterpolantFactoryMethodLinear=void 0;Si.prototype.InterpolantFactoryMethodSmooth=void 0;var ho=class extends mn{constructor(e,t,n,s){super(e,t,n,s)}};ho.prototype.ValueTypeName="vector";var uo=class{constructor(e,t,n){let s=this,r=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){o++,r===!1&&s.onStart!==void 0&&s.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,s.onProgress!==void 0&&s.onProgress(u,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,f){return c.push(u,f),this},this.removeHandler=function(u){let f=c.indexOf(u);return f!==-1&&c.splice(f,2),this},this.getHandler=function(u){for(let f=0,h=c.length;f<h;f+=2){let d=c[f],g=c[f+1];if(d.global&&(d.lastIndex=0),d.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Bu=new uo,fo=class{constructor(e){this.manager=e!==void 0?e:Bu,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};fo.DEFAULT_MATERIAL_NAME="__DEFAULT";var qi=class extends Et{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ze(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Yi=class extends qi{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ze(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},nc=new ut,Jh=new U,$h=new U,Ar=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Le(512,512),this.mapType=cn,this.map=null,this.mapPass=null,this.matrix=new ut,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Cs,this._frameExtents=new Le(1,1),this._viewportCount=1,this._viewports=[new ft(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Jh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Jh),$h.setFromMatrixPosition(e.target.matrixWorld),t.lookAt($h),t.updateMatrixWorld(),nc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(nc,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===Ts||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(nc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Ra=new U,Ca=new on,Nn=new U,Rr=class extends Et{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ut,this.projectionMatrix=new ut,this.projectionMatrixInverse=new ut,this.coordinateSystem=wn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Ra,Ca,Nn),Nn.x===1&&Nn.y===1&&Nn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ra,Ca,Nn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Ra,Ca,Nn),Nn.x===1&&Nn.y===1&&Nn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ra,Ca,Nn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},mi=new U,Kh=new Le,jh=new Le,Ft=class extends Rr{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Hi*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(or*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Hi*2*Math.atan(Math.tan(or*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){mi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(mi.x,mi.y).multiplyScalar(-e/mi.z),mi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(mi.x,mi.y).multiplyScalar(-e/mi.z)}getViewSize(e,t){return this.getViewBounds(e,Kh,jh),t.subVectors(jh,Kh)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(or*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},hc=class extends Ar{constructor(){super(new Ft(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=Hi*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},Cr=class extends qi{constructor(e,t,n=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.target=new Et,this.distance=n,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new hc}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},uc=class extends Ar{constructor(){super(new Ft(90,1,.5,500)),this.isPointLightShadow=!0}},Ti=class extends qi{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new uc}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Ei=class extends Rr{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},dc=class extends Ar{constructor(){super(new Ei(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Zi=class extends qi{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.target=new Et,this.shadow=new dc}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var Pr=class extends at{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}};var ys=-90,Ms=1,po=class extends Et{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Ft(ys,Ms,e,t);s.layers=this.layers,this.add(s);let r=new Ft(ys,Ms,e,t);r.layers=this.layers,this.add(r);let a=new Ft(ys,Ms,e,t);a.layers=this.layers,this.add(a);let o=new Ft(ys,Ms,e,t);o.layers=this.layers,this.add(o);let l=new Ft(ys,Ms,e,t);l.layers=this.layers,this.add(l);let c=new Ft(ys,Ms,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(let c of t)this.remove(c);if(e===wn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ts)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,c,u]=this.children,f=e.getRenderTarget(),h=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=y,e.setRenderTarget(n,5,s),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(f,h,d),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},mo=class extends Ft{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Ir=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=kf.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function kf(){this._document.hidden===!1&&this.reset()}var Lc="\\[\\]\\.:\\/",Vf=new RegExp("["+Lc+"]","g"),Dc="[^"+Lc+"]",Hf="[^"+Lc.replace("\\.","")+"]",Gf=/((?:WC+[\/:])*)/.source.replace("WC",Dc),Wf=/(WCOD+)?/.source.replace("WCOD",Hf),Xf=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Dc),qf=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Dc),Yf=new RegExp("^"+Gf+Wf+Xf+qf+"$"),Zf=["material","materials","bones","map"],fc=class{constructor(e,t,n){let s=n||bt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},bt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Vf,"")}static parseTrackName(e){let t=Yf.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Zf.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===t||o.uuid===t)return o;let l=n(o.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Je("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){$e("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){$e("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){$e("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){$e("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){$e("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){$e("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){$e("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;$e("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){$e("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){$e("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};bt.Composite=fc;bt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};bt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};bt.prototype.GetterByBindingType=[bt.prototype._getValue_direct,bt.prototype._getValue_array,bt.prototype._getValue_arrayElement,bt.prototype._getValue_toArray];bt.prototype.SetterByBindingTypeAndVersioning=[[bt.prototype._setValue_direct,bt.prototype._setValue_direct_setNeedsUpdate,bt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[bt.prototype._setValue_array,bt.prototype._setValue_array_setNeedsUpdate,bt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[bt.prototype._setValue_arrayElement,bt.prototype._setValue_arrayElement_setNeedsUpdate,bt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[bt.prototype._setValue_fromArray,bt.prototype._setValue_fromArray_setNeedsUpdate,bt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var rx=new Float32Array(1);var Qh=new ut,Us=class{constructor(e,t,n=0,s=1/0){this.ray=new Wi(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new As,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):$e("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Qh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Qh),this}intersectObject(e,t=!0,n=[]){return pc(e,this,n,t),n.sort(eu),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)pc(e[s],this,n,t);return n.sort(eu),n}};function eu(i,e){return i.distance-e.distance}function pc(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let a=0,o=r.length;a<o;a++)pc(r[a],e,t,!0)}}var mc=class i{static{i.prototype.isMatrix2=!0}constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};function Fc(i,e,t,n){let s=Jf(n);switch(t){case Tc:return i*e;case So:return i*e/s.components*s.byteLength;case To:return i*e/s.components*s.byteLength;case Ri:return i*e*2/s.components*s.byteLength;case Eo:return i*e*2/s.components*s.byteLength;case Ec:return i*e*3/s.components*s.byteLength;case nn:return i*e*4/s.components*s.byteLength;case wo:return i*e*4/s.components*s.byteLength;case kr:case Vr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Hr:case Gr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ro:case Po:return Math.max(i,16)*Math.max(e,8)/4;case Ao:case Co:return Math.max(i,8)*Math.max(e,8)/2;case Io:case Lo:case Fo:case No:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Do:case Wr:case Uo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Oo:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Bo:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case zo:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case ko:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Vo:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Ho:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Go:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Wo:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Xo:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case qo:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Yo:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Zo:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Jo:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case $o:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Ko:case jo:case Qo:return Math.ceil(i/4)*Math.ceil(e/4)*16;case el:case tl:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Xr:case nl:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Jf(i){switch(i){case cn:case yc:return{byteLength:1,components:1};case zs:case Mc:case Ht:return{byteLength:2,components:1};case Mo:case bo:return{byteLength:2,components:4};case Ln:case yo:case $t:return{byteLength:4,components:1};case bc:case Sc:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"185"}}));typeof window<"u"&&(window.__THREE__?Je("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="185");function od(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Kf(i){let e=new WeakMap;function t(o,l){let c=o.array,u=o.usage,f=c.byteLength,h=i.createBuffer();i.bindBuffer(l,h),i.bufferData(l,c,u),o.onUploadCallback();let d;if(c instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=i.SHORT;else if(c instanceof Uint32Array)d=i.UNSIGNED_INT;else if(c instanceof Int32Array)d=i.INT;else if(c instanceof Int8Array)d=i.BYTE;else if(c instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,c){let u=l.array,f=l.updateRanges;if(i.bindBuffer(c,o),f.length===0)i.bufferSubData(c,0,u);else{f.sort((d,g)=>d.start-g.start);let h=0;for(let d=1;d<f.length;d++){let g=f[h],y=f[d];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++h,f[h]=y)}f.length=h+1;for(let d=0,g=f.length;d<g;d++){let y=f[d];i.bufferSubData(c,y.start*u.BYTES_PER_ELEMENT,u,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var jf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Qf=`#ifdef USE_ALPHAHASH
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
#endif`,ep=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,tp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,np=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ip=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,sp=`#ifdef USE_AOMAP
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
#endif`,rp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ap=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
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
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,op=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,lp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,cp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,hp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,up=`#ifdef USE_IRIDESCENCE
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
#endif`,dp=`#ifdef USE_BUMPMAP
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
#endif`,fp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,pp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,mp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,gp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,_p=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,xp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,vp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,yp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Mp=`#define PI 3.141592653589793
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
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
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
} // validated`,bp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Sp=`vec3 transformedNormal = objectNormal;
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
#endif`,Tp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ep=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,wp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ap=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Rp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Cp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Pp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Ip=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Lp=`#ifdef USE_ENVMAP
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
#endif`,Dp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Fp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Np=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Up=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Op=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Bp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,zp=`#ifdef USE_GRADIENTMAP
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
}`,kp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Vp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Hp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Gp=`uniform bool receiveShadow;
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
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
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
#endif
#include <lightprobes_pars_fragment>`,Wp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
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
#endif`,Xp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,qp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Yp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Zp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Jp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
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
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
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
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
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
#endif`,$p=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
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
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
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
		return 0.5 / max( gv + gl, EPSILON );
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
	vec3 f0 = material.specularColorBlended;
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
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
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
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
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
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
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
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
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
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Kp=`
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
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
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
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
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
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
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
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
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
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,jp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
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
#endif`,Qp=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,em=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,tm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,nm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,im=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,sm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,rm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,am=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,om=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,lm=`#if defined( USE_POINTS_UV )
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
#endif`,cm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,hm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,um=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,dm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,fm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,pm=`#ifdef USE_MORPHTARGETS
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
#endif`,mm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,gm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
	#ifdef DOUBLE_SIDED
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
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,_m=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,xm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,vm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ym=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Mm=`#ifdef USE_NORMALMAP
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
#endif`,bm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Sm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Tm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Em=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,wm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Am=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Rm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Cm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Pm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Im=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Lm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Dm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Fm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Nm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
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
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Um=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
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
#endif`,Om=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Bm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,zm=`#ifdef USE_SKINNING
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
#endif`,km=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Vm=`#ifdef USE_SKINNING
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
#endif`,Hm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Gm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Wm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Xm=`#ifndef saturate
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
vec3 CineonToneMapping( vec3 color ) {
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,qm=`#ifdef USE_TRANSMISSION
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
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Ym=`#ifdef USE_TRANSMISSION
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
#endif`,Zm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Jm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,$m=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Km=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,jm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Qm=`uniform sampler2D t2D;
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
}`,eg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,tg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ng=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ig=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sg=`#include <common>
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
}`,rg=`#if DEPTH_PACKING == 3200
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
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,ag=`#define DISTANCE
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
}`,og=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,lg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,cg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hg=`uniform float scale;
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
}`,ug=`uniform vec3 diffuse;
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
}`,dg=`#include <common>
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
}`,fg=`uniform vec3 diffuse;
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
}`,pg=`#define LAMBERT
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
}`,mg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
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
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
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
}`,gg=`#define MATCAP
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
}`,_g=`#define MATCAP
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
}`,xg=`#define NORMAL
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
}`,vg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
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
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,yg=`#define PHONG
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
}`,Mg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
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
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
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
}`,bg=`#define STANDARD
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
}`,Sg=`#define STANDARD
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
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
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
}`,Tg=`#define TOON
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
}`,Eg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
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
}`,wg=`uniform float size;
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
}`,Ag=`uniform vec3 diffuse;
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
}`,Rg=`#include <common>
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
}`,Cg=`uniform vec3 color;
uniform float opacity;
#include <common>
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
	#include <premultiplied_alpha_fragment>
}`,Pg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
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
}`,Ig=`uniform vec3 diffuse;
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
}`,nt={alphahash_fragment:jf,alphahash_pars_fragment:Qf,alphamap_fragment:ep,alphamap_pars_fragment:tp,alphatest_fragment:np,alphatest_pars_fragment:ip,aomap_fragment:sp,aomap_pars_fragment:rp,batching_pars_vertex:ap,batching_vertex:op,begin_vertex:lp,beginnormal_vertex:cp,bsdfs:hp,iridescence_fragment:up,bumpmap_pars_fragment:dp,clipping_planes_fragment:fp,clipping_planes_pars_fragment:pp,clipping_planes_pars_vertex:mp,clipping_planes_vertex:gp,color_fragment:_p,color_pars_fragment:xp,color_pars_vertex:vp,color_vertex:yp,common:Mp,cube_uv_reflection_fragment:bp,defaultnormal_vertex:Sp,displacementmap_pars_vertex:Tp,displacementmap_vertex:Ep,emissivemap_fragment:wp,emissivemap_pars_fragment:Ap,colorspace_fragment:Rp,colorspace_pars_fragment:Cp,envmap_fragment:Pp,envmap_common_pars_fragment:Ip,envmap_pars_fragment:Lp,envmap_pars_vertex:Dp,envmap_physical_pars_fragment:Wp,envmap_vertex:Fp,fog_vertex:Np,fog_pars_vertex:Up,fog_fragment:Op,fog_pars_fragment:Bp,gradientmap_pars_fragment:zp,lightmap_pars_fragment:kp,lights_lambert_fragment:Vp,lights_lambert_pars_fragment:Hp,lights_pars_begin:Gp,lights_toon_fragment:Xp,lights_toon_pars_fragment:qp,lights_phong_fragment:Yp,lights_phong_pars_fragment:Zp,lights_physical_fragment:Jp,lights_physical_pars_fragment:$p,lights_fragment_begin:Kp,lights_fragment_maps:jp,lights_fragment_end:Qp,lightprobes_pars_fragment:em,logdepthbuf_fragment:tm,logdepthbuf_pars_fragment:nm,logdepthbuf_pars_vertex:im,logdepthbuf_vertex:sm,map_fragment:rm,map_pars_fragment:am,map_particle_fragment:om,map_particle_pars_fragment:lm,metalnessmap_fragment:cm,metalnessmap_pars_fragment:hm,morphinstance_vertex:um,morphcolor_vertex:dm,morphnormal_vertex:fm,morphtarget_pars_vertex:pm,morphtarget_vertex:mm,normal_fragment_begin:gm,normal_fragment_maps:_m,normal_pars_fragment:xm,normal_pars_vertex:vm,normal_vertex:ym,normalmap_pars_fragment:Mm,clearcoat_normal_fragment_begin:bm,clearcoat_normal_fragment_maps:Sm,clearcoat_pars_fragment:Tm,iridescence_pars_fragment:Em,opaque_fragment:wm,packing:Am,premultiplied_alpha_fragment:Rm,project_vertex:Cm,dithering_fragment:Pm,dithering_pars_fragment:Im,roughnessmap_fragment:Lm,roughnessmap_pars_fragment:Dm,shadowmap_pars_fragment:Fm,shadowmap_pars_vertex:Nm,shadowmap_vertex:Um,shadowmask_pars_fragment:Om,skinbase_vertex:Bm,skinning_pars_vertex:zm,skinning_vertex:km,skinnormal_vertex:Vm,specularmap_fragment:Hm,specularmap_pars_fragment:Gm,tonemapping_fragment:Wm,tonemapping_pars_fragment:Xm,transmission_fragment:qm,transmission_pars_fragment:Ym,uv_pars_fragment:Zm,uv_pars_vertex:Jm,uv_vertex:$m,worldpos_vertex:Km,background_vert:jm,background_frag:Qm,backgroundCube_vert:eg,backgroundCube_frag:tg,cube_vert:ng,cube_frag:ig,depth_vert:sg,depth_frag:rg,distance_vert:ag,distance_frag:og,equirect_vert:lg,equirect_frag:cg,linedashed_vert:hg,linedashed_frag:ug,meshbasic_vert:dg,meshbasic_frag:fg,meshlambert_vert:pg,meshlambert_frag:mg,meshmatcap_vert:gg,meshmatcap_frag:_g,meshnormal_vert:xg,meshnormal_frag:vg,meshphong_vert:yg,meshphong_frag:Mg,meshphysical_vert:bg,meshphysical_frag:Sg,meshtoon_vert:Tg,meshtoon_frag:Eg,points_vert:wg,points_frag:Ag,shadow_vert:Rg,shadow_frag:Cg,sprite_vert:Pg,sprite_frag:Ig},Ie={common:{diffuse:{value:new ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new je}},envmap:{envMap:{value:null},envMapRotation:{value:new je},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new je},normalScale:{value:new Le(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new U},probesMax:{value:new U},probesResolution:{value:new U}},points:{diffuse:{value:new ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0},uvTransform:{value:new je}},sprite:{diffuse:{value:new ze(16777215)},opacity:{value:1},center:{value:new Le(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}}},Gn={basic:{uniforms:Kt([Ie.common,Ie.specularmap,Ie.envmap,Ie.aomap,Ie.lightmap,Ie.fog]),vertexShader:nt.meshbasic_vert,fragmentShader:nt.meshbasic_frag},lambert:{uniforms:Kt([Ie.common,Ie.specularmap,Ie.envmap,Ie.aomap,Ie.lightmap,Ie.emissivemap,Ie.bumpmap,Ie.normalmap,Ie.displacementmap,Ie.fog,Ie.lights,{emissive:{value:new ze(0)},envMapIntensity:{value:1}}]),vertexShader:nt.meshlambert_vert,fragmentShader:nt.meshlambert_frag},phong:{uniforms:Kt([Ie.common,Ie.specularmap,Ie.envmap,Ie.aomap,Ie.lightmap,Ie.emissivemap,Ie.bumpmap,Ie.normalmap,Ie.displacementmap,Ie.fog,Ie.lights,{emissive:{value:new ze(0)},specular:{value:new ze(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:nt.meshphong_vert,fragmentShader:nt.meshphong_frag},standard:{uniforms:Kt([Ie.common,Ie.envmap,Ie.aomap,Ie.lightmap,Ie.emissivemap,Ie.bumpmap,Ie.normalmap,Ie.displacementmap,Ie.roughnessmap,Ie.metalnessmap,Ie.fog,Ie.lights,{emissive:{value:new ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:nt.meshphysical_vert,fragmentShader:nt.meshphysical_frag},toon:{uniforms:Kt([Ie.common,Ie.aomap,Ie.lightmap,Ie.emissivemap,Ie.bumpmap,Ie.normalmap,Ie.displacementmap,Ie.gradientmap,Ie.fog,Ie.lights,{emissive:{value:new ze(0)}}]),vertexShader:nt.meshtoon_vert,fragmentShader:nt.meshtoon_frag},matcap:{uniforms:Kt([Ie.common,Ie.bumpmap,Ie.normalmap,Ie.displacementmap,Ie.fog,{matcap:{value:null}}]),vertexShader:nt.meshmatcap_vert,fragmentShader:nt.meshmatcap_frag},points:{uniforms:Kt([Ie.points,Ie.fog]),vertexShader:nt.points_vert,fragmentShader:nt.points_frag},dashed:{uniforms:Kt([Ie.common,Ie.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:nt.linedashed_vert,fragmentShader:nt.linedashed_frag},depth:{uniforms:Kt([Ie.common,Ie.displacementmap]),vertexShader:nt.depth_vert,fragmentShader:nt.depth_frag},normal:{uniforms:Kt([Ie.common,Ie.bumpmap,Ie.normalmap,Ie.displacementmap,{opacity:{value:1}}]),vertexShader:nt.meshnormal_vert,fragmentShader:nt.meshnormal_frag},sprite:{uniforms:Kt([Ie.sprite,Ie.fog]),vertexShader:nt.sprite_vert,fragmentShader:nt.sprite_frag},background:{uniforms:{uvTransform:{value:new je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:nt.background_vert,fragmentShader:nt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new je}},vertexShader:nt.backgroundCube_vert,fragmentShader:nt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:nt.cube_vert,fragmentShader:nt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:nt.equirect_vert,fragmentShader:nt.equirect_frag},distance:{uniforms:Kt([Ie.common,Ie.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:nt.distance_vert,fragmentShader:nt.distance_frag},shadow:{uniforms:Kt([Ie.lights,Ie.fog,{color:{value:new ze(0)},opacity:{value:1}}]),vertexShader:nt.shadow_vert,fragmentShader:nt.shadow_frag}};Gn.physical={uniforms:Kt([Gn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new je},clearcoatNormalScale:{value:new Le(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new je},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new je},sheen:{value:0},sheenColor:{value:new ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new je},transmissionSamplerSize:{value:new Le},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new je},attenuationDistance:{value:0},attenuationColor:{value:new ze(0)},specularColor:{value:new ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new je},anisotropyVector:{value:new Le},anisotropyMap:{value:null},anisotropyMapTransform:{value:new je}}]),vertexShader:nt.meshphysical_vert,fragmentShader:nt.meshphysical_frag};var rl={r:0,b:0,g:0},Lg=new ut,ld=new je;ld.set(-1,0,0,0,1,0,0,0,1);function Dg(i,e,t,n,s,r){let a=new ze(0),o=s===!0?0:1,l,c,u=null,f=0,h=null;function d(A){let T=A.isScene===!0?A.background:null;if(T&&T.isTexture){let v=A.backgroundBlurriness>0;T=e.get(T,v)}return T}function g(A){let T=!1,v=d(A);v===null?m(a,o):v&&v.isColor&&(m(v,1),T=!0);let R=i.xr.getEnvironmentBlendMode();R==="additive"?t.buffers.color.setClear(0,0,0,1,r):R==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||T)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function y(A,T){let v=d(T);v&&(v.isCubeTexture||v.mapping===Br)?(c===void 0&&(c=new Ke(new Ps(1,1,1),new mt({name:"BackgroundCubeMaterial",uniforms:Qi(Gn.backgroundCube.uniforms),vertexShader:Gn.backgroundCube.vertexShader,fragmentShader:Gn.backgroundCube.fragmentShader,side:tn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(R,E,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Lg.makeRotationFromEuler(T.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(ld),c.material.toneMapped=rt.getTransfer(v.colorSpace)!==dt,(u!==v||f!==v.version||h!==i.toneMapping)&&(c.material.needsUpdate=!0,u=v,f=v.version,h=i.toneMapping),c.layers.enableAll(),A.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new Ke(new Vt(2,2),new mt({name:"BackgroundMaterial",uniforms:Qi(Gn.background.uniforms),vertexShader:Gn.background.vertexShader,fragmentShader:Gn.background.fragmentShader,side:An,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,l.material.toneMapped=rt.getTransfer(v.colorSpace)!==dt,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||f!==v.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,u=v,f=v.version,h=i.toneMapping),l.layers.enableAll(),A.unshift(l,l.geometry,l.material,0,0,null))}function m(A,T){A.getRGB(rl,Ic(i)),t.buffers.color.setClear(rl.r,rl.g,rl.b,T,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(A,T=1){a.set(A),o=T,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(A){o=A,m(a,o)},render:g,addToRenderList:y,dispose:p}}function Fg(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=h(null),r=s,a=!1;function o(D,L,X,Y,I){let P=!1,F=f(D,Y,X,L);r!==F&&(r=F,c(r.object)),P=d(D,Y,X,I),P&&g(D,Y,X,I),I!==null&&e.update(I,i.ELEMENT_ARRAY_BUFFER),(P||a)&&(a=!1,v(D,L,X,Y),I!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(I).buffer))}function l(){return i.createVertexArray()}function c(D){return i.bindVertexArray(D)}function u(D){return i.deleteVertexArray(D)}function f(D,L,X,Y){let I=Y.wireframe===!0,P=n[L.id];P===void 0&&(P={},n[L.id]=P);let F=D.isInstancedMesh===!0?D.id:0,J=P[F];J===void 0&&(J={},P[F]=J);let K=J[X.id];K===void 0&&(K={},J[X.id]=K);let oe=K[I];return oe===void 0&&(oe=h(l()),K[I]=oe),oe}function h(D){let L=[],X=[],Y=[];for(let I=0;I<t;I++)L[I]=0,X[I]=0,Y[I]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:X,attributeDivisors:Y,object:D,attributes:{},index:null}}function d(D,L,X,Y){let I=r.attributes,P=L.attributes,F=0,J=X.getAttributes();for(let K in J)if(J[K].location>=0){let me=I[K],de=P[K];if(de===void 0&&(K==="instanceMatrix"&&D.instanceMatrix&&(de=D.instanceMatrix),K==="instanceColor"&&D.instanceColor&&(de=D.instanceColor)),me===void 0||me.attribute!==de||de&&me.data!==de.data)return!0;F++}return r.attributesNum!==F||r.index!==Y}function g(D,L,X,Y){let I={},P=L.attributes,F=0,J=X.getAttributes();for(let K in J)if(J[K].location>=0){let me=P[K];me===void 0&&(K==="instanceMatrix"&&D.instanceMatrix&&(me=D.instanceMatrix),K==="instanceColor"&&D.instanceColor&&(me=D.instanceColor));let de={};de.attribute=me,me&&me.data&&(de.data=me.data),I[K]=de,F++}r.attributes=I,r.attributesNum=F,r.index=Y}function y(){let D=r.newAttributes;for(let L=0,X=D.length;L<X;L++)D[L]=0}function m(D){p(D,0)}function p(D,L){let X=r.newAttributes,Y=r.enabledAttributes,I=r.attributeDivisors;X[D]=1,Y[D]===0&&(i.enableVertexAttribArray(D),Y[D]=1),I[D]!==L&&(i.vertexAttribDivisor(D,L),I[D]=L)}function A(){let D=r.newAttributes,L=r.enabledAttributes;for(let X=0,Y=L.length;X<Y;X++)L[X]!==D[X]&&(i.disableVertexAttribArray(X),L[X]=0)}function T(D,L,X,Y,I,P,F){F===!0?i.vertexAttribIPointer(D,L,X,I,P):i.vertexAttribPointer(D,L,X,Y,I,P)}function v(D,L,X,Y){y();let I=Y.attributes,P=X.getAttributes(),F=L.defaultAttributeValues;for(let J in P){let K=P[J];if(K.location>=0){let oe=I[J];if(oe===void 0&&(J==="instanceMatrix"&&D.instanceMatrix&&(oe=D.instanceMatrix),J==="instanceColor"&&D.instanceColor&&(oe=D.instanceColor)),oe!==void 0){let me=oe.normalized,de=oe.itemSize,we=e.get(oe);if(we===void 0)continue;let Ge=we.buffer,Re=we.type,te=we.bytesPerElement,_e=Re===i.INT||Re===i.UNSIGNED_INT||oe.gpuType===yo;if(oe.isInterleavedBufferAttribute){let fe=oe.data,Ce=fe.stride,ke=oe.offset;if(fe.isInstancedInterleavedBuffer){for(let Ue=0;Ue<K.locationSize;Ue++)p(K.location+Ue,fe.meshPerAttribute);D.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let Ue=0;Ue<K.locationSize;Ue++)m(K.location+Ue);i.bindBuffer(i.ARRAY_BUFFER,Ge);for(let Ue=0;Ue<K.locationSize;Ue++)T(K.location+Ue,de/K.locationSize,Re,me,Ce*te,(ke+de/K.locationSize*Ue)*te,_e)}else{if(oe.isInstancedBufferAttribute){for(let fe=0;fe<K.locationSize;fe++)p(K.location+fe,oe.meshPerAttribute);D.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let fe=0;fe<K.locationSize;fe++)m(K.location+fe);i.bindBuffer(i.ARRAY_BUFFER,Ge);for(let fe=0;fe<K.locationSize;fe++)T(K.location+fe,de/K.locationSize,Re,me,de*te,de/K.locationSize*fe*te,_e)}}else if(F!==void 0){let me=F[J];if(me!==void 0)switch(me.length){case 2:i.vertexAttrib2fv(K.location,me);break;case 3:i.vertexAttrib3fv(K.location,me);break;case 4:i.vertexAttrib4fv(K.location,me);break;default:i.vertexAttrib1fv(K.location,me)}}}}A()}function R(){S();for(let D in n){let L=n[D];for(let X in L){let Y=L[X];for(let I in Y){let P=Y[I];for(let F in P)u(P[F].object),delete P[F];delete Y[I]}}delete n[D]}}function E(D){if(n[D.id]===void 0)return;let L=n[D.id];for(let X in L){let Y=L[X];for(let I in Y){let P=Y[I];for(let F in P)u(P[F].object),delete P[F];delete Y[I]}}delete n[D.id]}function w(D){for(let L in n){let X=n[L];for(let Y in X){let I=X[Y];if(I[D.id]===void 0)continue;let P=I[D.id];for(let F in P)u(P[F].object),delete P[F];delete I[D.id]}}}function x(D){for(let L in n){let X=n[L],Y=D.isInstancedMesh===!0?D.id:0,I=X[Y];if(I!==void 0){for(let P in I){let F=I[P];for(let J in F)u(F[J].object),delete F[J];delete I[P]}delete X[Y],Object.keys(X).length===0&&delete n[L]}}}function S(){C(),a=!0,r!==s&&(r=s,c(r.object))}function C(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:S,resetDefaultState:C,dispose:R,releaseStatesOfGeometry:E,releaseStatesOfObject:x,releaseStatesOfProgram:w,initAttributes:y,enableAttribute:m,disableUnusedAttributes:A}}function Ng(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,u){u!==0&&(i.drawArraysInstanced(n,l,c,u),t.update(c,n,u))}function o(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let h=0;for(let d=0;d<u;d++)h+=c[d];t.update(h,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Ug(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let w=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(w){return!(w!==nn&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(w){let x=w===Ht&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(w!==cn&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==$t&&!x)}function l(w){if(w==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",u=l(c);u!==c&&(Je("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let f=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&Je("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),A=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),T=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),R=i.getParameter(i.MAX_SAMPLES),E=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:h,maxTextures:d,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:A,maxVaryings:T,maxFragmentUniforms:v,maxSamples:R,samples:E}}function Og(i){let e=this,t=null,n=0,s=!1,r=!1,a=new Jt,o=new je,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){let d=f.length!==0||h||n!==0||s;return s=h,n=f.length,d},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,h){t=u(f,h,0)},this.setState=function(f,h,d){let g=f.clippingPlanes,y=f.clipIntersection,m=f.clipShadows,p=i.get(f);if(!s||g===null||g.length===0||r&&!m)r?u(null):c();else{let A=r?0:n,T=A*4,v=p.clippingState||null;l.value=v,v=u(g,h,T,d);for(let R=0;R!==T;++R)v[R]=t[R];p.clippingState=v,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=A}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(f,h,d,g){let y=f!==null?f.length:0,m=null;if(y!==0){if(m=l.value,g!==!0||m===null){let p=d+y*4,A=h.matrixWorldInverse;o.getNormalMatrix(A),(m===null||m.length<p)&&(m=new Float32Array(p));for(let T=0,v=d;T!==y;++T,v+=4)a.copy(f[T]).applyMatrix4(A,o),a.normal.toArray(m,v),m[v+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,m}}var Ci=4,zu=[.125,.215,.35,.446,.526,.582],es=20,Bg=256,Yr=new Ei,ku=new ze,Nc=null,Uc=0,Oc=0,Bc=!1,zg=new U,ol=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){let{size:a=256,position:o=zg}=r;Nc=this._renderer.getRenderTarget(),Uc=this._renderer.getActiveCubeFace(),Oc=this._renderer.getActiveMipmapLevel(),Bc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Hu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Nc,Uc,Oc),this._renderer.xr.enabled=Bc,e.scissorTest=!1,Hs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===wi||e.mapping===Ki?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Nc=this._renderer.getRenderTarget(),Uc=this._renderer.getActiveCubeFace(),Oc=this._renderer.getActiveMipmapLevel(),Bc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Mt,minFilter:Mt,generateMipmaps:!1,type:Ht,format:nn,colorSpace:dr,depthBuffer:!1},s=Vu(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Vu(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=kg(r)),this._blurMaterial=Hg(r,e,t),this._ggxMaterial=Vg(r,e,t)}return s}_compileMaterial(e){let t=new Ke(new at,e);this._renderer.compile(t,Yr)}_sceneToCubeUV(e,t,n,s,r){let l=new Ft(90,1,t,n),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,h=f.autoClear,d=f.toneMapping;f.getClearColor(ku),f.toneMapping=In,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ke(new Ps,new xi({name:"PMREM.Background",side:tn,depthWrite:!1,depthTest:!1})));let y=this._backgroundBox,m=y.material,p=!1,A=e.background;A?A.isColor&&(m.color.copy(A),e.background=null,p=!0):(m.color.copy(ku),p=!0);for(let T=0;T<6;T++){let v=T%3;v===0?(l.up.set(0,c[T],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[T],r.y,r.z)):v===1?(l.up.set(0,0,c[T]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[T],r.z)):(l.up.set(0,c[T],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[T]));let R=this._cubeSize;Hs(s,v*R,T>2?R:0,R,R),f.setRenderTarget(s),p&&f.render(y,l),f.render(e,l)}f.toneMapping=d,f.autoClear=h,e.background=A}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===wi||e.mapping===Ki;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Hu());let r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;let o=r.uniforms;o.envMap.value=e;let l=this._cubeSize;Hs(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Yr)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),f=Math.sqrt(c*c-u*u),h=0+c*1.25,d=f*h,{_lodMax:g}=this,y=this._sizeLods[n],m=3*y*(n>g-Ci?n-g+Ci:0),p=4*(this._cubeSize-y);l.envMap.value=e.texture,l.roughness.value=d,l.mipInt.value=g-t,Hs(r,m,p,3*y,2*y),s.setRenderTarget(r),s.render(o,Yr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,Hs(e,m,p,3*y,2*y),s.setRenderTarget(e),s.render(o,Yr)}_blur(e,t,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&$e("blur direction must be either latitudinal or longitudinal!");let u=3,f=this._lodMeshes[s];f.material=c;let h=c.uniforms,d=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*es-1),y=r/g,m=isFinite(r)?1+Math.floor(u*y):es;m>es&&Je(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${es}`);let p=[],A=0;for(let w=0;w<es;++w){let x=w/y,S=Math.exp(-x*x/2);p.push(S),w===0?A+=S:w<m&&(A+=2*S)}for(let w=0;w<p.length;w++)p[w]=p[w]/A;h.envMap.value=e.texture,h.samples.value=m,h.weights.value=p,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);let{_lodMax:T}=this;h.dTheta.value=g,h.mipInt.value=T-n;let v=this._sizeLods[s],R=3*v*(s>T-Ci?s-T+Ci:0),E=4*(this._cubeSize-v);Hs(t,R,E,3*v,2*v),l.setRenderTarget(t),l.render(f,Yr)}};function kg(i){let e=[],t=[],n=[],s=i,r=i-Ci+1+zu.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);e.push(o);let l=1/o;a>i-Ci?l=zu[a-i+Ci-1]:a===0&&(l=0),t.push(l);let c=1/(o-2),u=-c,f=1+c,h=[u,u,f,u,f,f,u,u,f,f,u,f],d=6,g=6,y=3,m=2,p=1,A=new Float32Array(y*g*d),T=new Float32Array(m*g*d),v=new Float32Array(p*g*d);for(let E=0;E<d;E++){let w=E%3*2/3-1,x=E>2?0:-1,S=[w,x,0,w+2/3,x,0,w+2/3,x+1,0,w,x,0,w+2/3,x+1,0,w,x+1,0];A.set(S,y*g*E),T.set(h,m*g*E);let C=[E,E,E,E,E,E];v.set(C,p*g*E)}let R=new at;R.setAttribute("position",new Rt(A,y)),R.setAttribute("uv",new Rt(T,m)),R.setAttribute("faceIndex",new Rt(v,p)),n.push(new Ke(R,null)),s>Ci&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function Vu(i,e,t){let n=new Ct(i,e,t);return n.texture.mapping=Br,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Hs(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Vg(i,e,t){return new mt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Bg,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:hl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function Hg(i,e,t){let n=new Float32Array(es),s=new U(0,1,0);return new mt({name:"SphericalGaussianBlur",defines:{n:es,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:hl(),fragmentShader:`

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
		`,blending:bn,depthTest:!1,depthWrite:!1})}function Hu(){return new mt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:hl(),fragmentShader:`

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
		`,blending:bn,depthTest:!1,depthWrite:!1})}function Gu(){return new mt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:hl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:bn,depthTest:!1,depthWrite:!1})}function hl(){return`

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
	`}var ll=class extends Ct{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new yr(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ps(5,5,5),r=new mt({name:"CubemapFromEquirect",uniforms:Qi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:tn,blending:bn});r.uniforms.tEquirect.value=t;let a=new Ke(s,r),o=t.minFilter;return t.minFilter===ln&&(t.minFilter=Mt),new po(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}};function Gg(i){let e=new WeakMap,t=new WeakMap,n=null;function s(h,d=!1){return h==null?null:d?a(h):r(h)}function r(h){if(h&&h.isTexture){let d=h.mapping;if(d===_o||d===xo)if(e.has(h)){let g=e.get(h).texture;return o(g,h.mapping)}else{let g=h.image;if(g&&g.height>0){let y=new ll(g.height);return y.fromEquirectangularTexture(i,h),e.set(h,y),h.addEventListener("dispose",c),o(y.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture){let d=h.mapping,g=d===_o||d===xo,y=d===wi||d===Ki;if(g||y){let m=t.get(h),p=m!==void 0?m.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==p)return n===null&&(n=new ol(i)),m=g?n.fromEquirectangular(h,m):n.fromCubemap(h,m),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),m.texture;if(m!==void 0)return m.texture;{let A=h.image;return g&&A&&A.height>0||y&&A&&l(A)?(n===null&&(n=new ol(i)),m=g?n.fromEquirectangular(h):n.fromCubemap(h),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),h.addEventListener("dispose",u),m.texture):null}}}return h}function o(h,d){return d===_o?h.mapping=wi:d===xo&&(h.mapping=Ki),h}function l(h){let d=0,g=6;for(let y=0;y<g;y++)h[y]!==void 0&&d++;return d===g}function c(h){let d=h.target;d.removeEventListener("dispose",c);let g=e.get(d);g!==void 0&&(e.delete(d),g.dispose())}function u(h){let d=h.target;d.removeEventListener("dispose",u);let g=t.get(d);g!==void 0&&(t.delete(d),g.dispose())}function f(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:f}}function Wg(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&Bi("WebGLRenderer: "+n+" extension not supported."),s}}}function Xg(i,e,t,n){let s={},r=new WeakMap;function a(f){let h=f.target;h.index!==null&&e.remove(h.index);for(let g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",a),delete s[h.id];let d=r.get(h);d&&(e.remove(d),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(f,h){return s[h.id]===!0||(h.addEventListener("dispose",a),s[h.id]=!0,t.memory.geometries++),h}function l(f){let h=f.attributes;for(let d in h)e.update(h[d],i.ARRAY_BUFFER)}function c(f){let h=[],d=f.index,g=f.attributes.position,y=0;if(g===void 0)return;if(d!==null){let A=d.array;y=d.version;for(let T=0,v=A.length;T<v;T+=3){let R=A[T+0],E=A[T+1],w=A[T+2];h.push(R,E,E,w,w,R)}}else{let A=g.array;y=g.version;for(let T=0,v=A.length/3-1;T<v;T+=3){let R=T+0,E=T+1,w=T+2;h.push(R,E,E,w,w,R)}}let m=new(g.count>=65535?vr:xr)(h,1);m.version=y;let p=r.get(f);p&&e.remove(p),r.set(f,m)}function u(f){let h=r.get(f);if(h){let d=f.index;d!==null&&h.version<d.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:u}}function qg(i,e,t){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,h){i.drawElements(n,h,r,f*a),t.update(h,n,1)}function c(f,h,d){d!==0&&(i.drawElementsInstanced(n,h,r,f*a,d),t.update(h,n,d))}function u(f,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,f,0,d);let y=0;for(let m=0;m<d;m++)y+=h[m];t.update(y,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function Yg(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:$e("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Zg(i,e,t){let n=new WeakMap,s=new ft;function r(a,o,l){let c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=u!==void 0?u.length:0,h=n.get(o);if(h===void 0||h.count!==f){let S=function(){w.dispose(),n.delete(o),o.removeEventListener("dispose",S)};h!==void 0&&h.texture.dispose();let d=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,y=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],A=o.morphAttributes.color||[],T=0;d===!0&&(T=1),g===!0&&(T=2),y===!0&&(T=3);let v=o.attributes.position.count*T,R=1;v>e.maxTextureSize&&(R=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let E=new Float32Array(v*R*4*f),w=new mr(E,v,R,f);w.type=$t,w.needsUpdate=!0;let x=T*4;for(let C=0;C<f;C++){let D=m[C],L=p[C],X=A[C],Y=v*R*4*C;for(let I=0;I<D.count;I++){let P=I*x;d===!0&&(s.fromBufferAttribute(D,I),E[Y+P+0]=s.x,E[Y+P+1]=s.y,E[Y+P+2]=s.z,E[Y+P+3]=0),g===!0&&(s.fromBufferAttribute(L,I),E[Y+P+4]=s.x,E[Y+P+5]=s.y,E[Y+P+6]=s.z,E[Y+P+7]=0),y===!0&&(s.fromBufferAttribute(X,I),E[Y+P+8]=s.x,E[Y+P+9]=s.y,E[Y+P+10]=s.z,E[Y+P+11]=X.itemSize===4?s.w:1)}}h={count:f,texture:w,size:new Le(v,R)},n.set(o,h),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let d=0;for(let y=0;y<c.length;y++)d+=c[y];let g=o.morphTargetsRelative?1:1-d;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",h.size)}return{update:r}}function Jg(i,e,t,n,s){let r=new WeakMap;function a(c){let u=s.render.frame,f=c.geometry,h=e.get(c,f);if(r.get(h)!==u&&(e.update(h),r.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){let d=c.skeleton;r.get(d)!==u&&(d.update(),r.set(d,u))}return h}function o(){r=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:a,dispose:o}}var $g={[Lr]:"LINEAR_TONE_MAPPING",[Dr]:"REINHARD_TONE_MAPPING",[Fr]:"CINEON_TONE_MAPPING",[$i]:"ACES_FILMIC_TONE_MAPPING",[Ur]:"AGX_TONE_MAPPING",[Or]:"NEUTRAL_TONE_MAPPING",[Nr]:"CUSTOM_TONE_MAPPING"};function Kg(i,e,t,n,s,r){let a=new Ct(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,depthTexture:s?new jn(e,t):void 0}),o=new Ct(e,t,{type:Ht,depthBuffer:!1,stencilBuffer:!1}),l=new at;l.setAttribute("position",new Ye([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new Ye([0,2,0,0,2,0],2));let c=new Ls({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new Ke(l,c),f=new Ei(-1,1,1,-1,0,1),h=null,d=null,g=!1,y,m=null,p=[],A=!1;this.setSize=function(T,v){a.setSize(T,v),o.setSize(T,v);for(let R=0;R<p.length;R++){let E=p[R];E.setSize&&E.setSize(T,v)}},this.setEffects=function(T){p=T,A=p.length>0&&p[0].isRenderPass===!0;let v=a.width,R=a.height;for(let E=0;E<p.length;E++){let w=p[E];w.setSize&&w.setSize(v,R)}},this.begin=function(T,v){if(g||T.toneMapping===In&&p.length===0)return!1;if(m=v,v!==null){let R=v.width,E=v.height;(a.width!==R||a.height!==E)&&this.setSize(R,E)}return A===!1&&T.setRenderTarget(a),y=T.toneMapping,T.toneMapping=In,!0},this.hasRenderPass=function(){return A},this.end=function(T,v){T.toneMapping=y,g=!0;let R=a,E=o;for(let w=0;w<p.length;w++){let x=p[w];if(x.enabled!==!1&&(x.render(T,E,R,v),x.needsSwap!==!1)){let S=R;R=E,E=S}}if(h!==T.outputColorSpace||d!==T.toneMapping){h=T.outputColorSpace,d=T.toneMapping,c.defines={},rt.getTransfer(h)===dt&&(c.defines.SRGB_TRANSFER="");let w=$g[d];w&&(c.defines[w]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=R.texture,T.setRenderTarget(m),T.render(u,f),m=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose()}}var cd=new Qt,Vc=new jn(1,1),hd=new mr,ud=new Wa,dd=new yr,Wu=[],Xu=[],qu=new Float32Array(16),Yu=new Float32Array(9),Zu=new Float32Array(4);function Ws(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Wu[s];if(r===void 0&&(r=new Float32Array(s),Wu[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Ut(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Ot(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function ul(i,e){let t=Xu[e];t===void 0&&(t=new Int32Array(e),Xu[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function jg(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Qg(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;i.uniform2fv(this.addr,e),Ot(t,e)}}function e0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ut(t,e))return;i.uniform3fv(this.addr,e),Ot(t,e)}}function t0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;i.uniform4fv(this.addr,e),Ot(t,e)}}function n0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ut(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Ot(t,e)}else{if(Ut(t,n))return;Zu.set(n),i.uniformMatrix2fv(this.addr,!1,Zu),Ot(t,n)}}function i0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ut(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Ot(t,e)}else{if(Ut(t,n))return;Yu.set(n),i.uniformMatrix3fv(this.addr,!1,Yu),Ot(t,n)}}function s0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Ut(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Ot(t,e)}else{if(Ut(t,n))return;qu.set(n),i.uniformMatrix4fv(this.addr,!1,qu),Ot(t,n)}}function r0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function a0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;i.uniform2iv(this.addr,e),Ot(t,e)}}function o0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ut(t,e))return;i.uniform3iv(this.addr,e),Ot(t,e)}}function l0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;i.uniform4iv(this.addr,e),Ot(t,e)}}function c0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function h0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;i.uniform2uiv(this.addr,e),Ot(t,e)}}function u0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ut(t,e))return;i.uniform3uiv(this.addr,e),Ot(t,e)}}function d0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;i.uniform4uiv(this.addr,e),Ot(t,e)}}function f0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Vc.compareFunction=t.isReversedDepthBuffer()?sl:il,r=Vc):r=cd,t.setTexture2D(e||r,s)}function p0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||ud,s)}function m0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||dd,s)}function g0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||hd,s)}function _0(i){switch(i){case 5126:return jg;case 35664:return Qg;case 35665:return e0;case 35666:return t0;case 35674:return n0;case 35675:return i0;case 35676:return s0;case 5124:case 35670:return r0;case 35667:case 35671:return a0;case 35668:case 35672:return o0;case 35669:case 35673:return l0;case 5125:return c0;case 36294:return h0;case 36295:return u0;case 36296:return d0;case 35678:case 36198:case 36298:case 36306:case 35682:return f0;case 35679:case 36299:case 36307:return p0;case 35680:case 36300:case 36308:case 36293:return m0;case 36289:case 36303:case 36311:case 36292:return g0}}function x0(i,e){i.uniform1fv(this.addr,e)}function v0(i,e){let t=Ws(e,this.size,2);i.uniform2fv(this.addr,t)}function y0(i,e){let t=Ws(e,this.size,3);i.uniform3fv(this.addr,t)}function M0(i,e){let t=Ws(e,this.size,4);i.uniform4fv(this.addr,t)}function b0(i,e){let t=Ws(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function S0(i,e){let t=Ws(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function T0(i,e){let t=Ws(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function E0(i,e){i.uniform1iv(this.addr,e)}function w0(i,e){i.uniform2iv(this.addr,e)}function A0(i,e){i.uniform3iv(this.addr,e)}function R0(i,e){i.uniform4iv(this.addr,e)}function C0(i,e){i.uniform1uiv(this.addr,e)}function P0(i,e){i.uniform2uiv(this.addr,e)}function I0(i,e){i.uniform3uiv(this.addr,e)}function L0(i,e){i.uniform4uiv(this.addr,e)}function D0(i,e,t){let n=this.cache,s=e.length,r=ul(t,s);Ut(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Vc:a=cd;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function F0(i,e,t){let n=this.cache,s=e.length,r=ul(t,s);Ut(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||ud,r[a])}function N0(i,e,t){let n=this.cache,s=e.length,r=ul(t,s);Ut(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||dd,r[a])}function U0(i,e,t){let n=this.cache,s=e.length,r=ul(t,s);Ut(n,r)||(i.uniform1iv(this.addr,r),Ot(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||hd,r[a])}function O0(i){switch(i){case 5126:return x0;case 35664:return v0;case 35665:return y0;case 35666:return M0;case 35674:return b0;case 35675:return S0;case 35676:return T0;case 5124:case 35670:return E0;case 35667:case 35671:return w0;case 35668:case 35672:return A0;case 35669:case 35673:return R0;case 5125:return C0;case 36294:return P0;case 36295:return I0;case 36296:return L0;case 35678:case 36198:case 36298:case 36306:case 35682:return D0;case 35679:case 36299:case 36307:return F0;case 35680:case 36300:case 36308:case 36293:return N0;case 36289:case 36303:case 36311:case 36292:return U0}}var Hc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=_0(t.type)}},Gc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=O0(t.type)}},Wc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(e,t[o.id],n)}}},zc=/(\w+)(\])?(\[|\.)?/g;function Ju(i,e){i.seq.push(e),i.map[e.id]=e}function B0(i,e,t){let n=i.name,s=n.length;for(zc.lastIndex=0;;){let r=zc.exec(n),a=zc.lastIndex,o=r[1],l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Ju(t,c===void 0?new Hc(o,i,e):new Gc(o,i,e));break}else{let f=t.map[o];f===void 0&&(f=new Wc(o),Ju(t,f)),t=f}}}var Gs=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);B0(o,l,this)}let s=[],r=[];for(let a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){let o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let a=e[s];a.id in t&&n.push(a)}return n}};function $u(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var z0=37297,k0=0;function V0(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}var Ku=new je;function H0(i){rt._getMatrix(Ku,rt.workingColorSpace,i);let e=`mat3( ${Ku.elements.map(t=>t.toFixed(4))} )`;switch(rt.getTransfer(i)){case fr:return[e,"LinearTransferOETF"];case dt:return[e,"sRGBTransferOETF"];default:return Je("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function ju(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+V0(i.getShaderSource(e),o)}else return r}function G0(i,e){let t=H0(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var W0={[Lr]:"Linear",[Dr]:"Reinhard",[Fr]:"Cineon",[$i]:"ACESFilmic",[Ur]:"AgX",[Or]:"Neutral",[Nr]:"Custom"};function X0(i,e){let t=W0[e];return t===void 0?(Je("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var al=new U;function q0(){rt.getLuminanceCoefficients(al);let i=al.x.toFixed(4),e=al.y.toFixed(4),t=al.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Y0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Jr).join(`
`)}function Z0(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function J0(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Jr(i){return i!==""}function Qu(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ed(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var $0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Xc(i){return i.replace($0,j0)}var K0=new Map;function j0(i,e){let t=nt[e];if(t===void 0){let n=K0.get(e);if(n!==void 0)t=nt[n],Je('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Xc(t)}var Q0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function td(i){return i.replace(Q0,e_)}function e_(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function nd(i){let e=`precision ${i.precision} float;
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
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var t_={[Ji]:"SHADOWMAP_TYPE_PCF",[Os]:"SHADOWMAP_TYPE_VSM"};function n_(i){return t_[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var i_={[wi]:"ENVMAP_TYPE_CUBE",[Ki]:"ENVMAP_TYPE_CUBE",[Br]:"ENVMAP_TYPE_CUBE_UV"};function s_(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":i_[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var r_={[Ki]:"ENVMAP_MODE_REFRACTION"};function a_(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":r_[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var o_={[go]:"ENVMAP_BLENDING_MULTIPLY",[bu]:"ENVMAP_BLENDING_MIX",[Su]:"ENVMAP_BLENDING_ADD"};function l_(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":o_[i.combine]||"ENVMAP_BLENDING_NONE"}function c_(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function h_(i,e,t,n){let s=i.getContext(),r=t.defines,a=t.vertexShader,o=t.fragmentShader,l=n_(t),c=s_(t),u=a_(t),f=l_(t),h=c_(t),d=Y0(t),g=Z0(r),y=s.createProgram(),m,p,A=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Jr).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Jr).join(`
`),p.length>0&&(p+=`
`)):(m=[nd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Jr).join(`
`),p=[nd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==In?"#define TONE_MAPPING":"",t.toneMapping!==In?nt.tonemapping_pars_fragment:"",t.toneMapping!==In?X0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",nt.colorspace_pars_fragment,G0("linearToOutputTexel",t.outputColorSpace),q0(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Jr).join(`
`)),a=Xc(a),a=Qu(a,t),a=ed(a,t),o=Xc(o),o=Qu(o,t),o=ed(o,t),a=td(a),o=td(o),t.isRawShaderMaterial!==!0&&(A=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Ac?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ac?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let T=A+m+a,v=A+p+o,R=$u(s,s.VERTEX_SHADER,T),E=$u(s,s.FRAGMENT_SHADER,v);s.attachShader(y,R),s.attachShader(y,E),t.index0AttributeName!==void 0?s.bindAttribLocation(y,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function w(D){if(i.debug.checkShaderErrors){let L=s.getProgramInfoLog(y)||"",X=s.getShaderInfoLog(R)||"",Y=s.getShaderInfoLog(E)||"",I=L.trim(),P=X.trim(),F=Y.trim(),J=!0,K=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(J=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,y,R,E);else{let oe=ju(s,R,"vertex"),me=ju(s,E,"fragment");$e("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+I+`
`+oe+`
`+me)}else I!==""?Je("WebGLProgram: Program Info Log:",I):(P===""||F==="")&&(K=!1);K&&(D.diagnostics={runnable:J,programLog:I,vertexShader:{log:P,prefix:m},fragmentShader:{log:F,prefix:p}})}s.deleteShader(R),s.deleteShader(E),x=new Gs(s,y),S=J0(s,y)}let x;this.getUniforms=function(){return x===void 0&&w(this),x};let S;this.getAttributes=function(){return S===void 0&&w(this),S};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=s.getProgramParameter(y,z0)),C},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=k0++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=R,this.fragmentShader=E,this}var u_=0,qc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Yc(e),t.set(e,n)),n}},Yc=class{constructor(e){this.id=u_++,this.code=e,this.usedTimes=0}};function d_(i){return i===Ri||i===Wr||i===Xr}function f_(i,e,t,n,s,r){let a=new As,o=new qc,l=new Set,c=[],u=new Map,f=n.logarithmicDepthBuffer,h=n.precision,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){return l.add(x),x===0?"uv":`uv${x}`}function y(x,S,C,D,L,X){let Y=D.fog,I=L.geometry,P=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?D.environment:null,F=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,J=e.get(x.envMap||P,F),K=J&&J.mapping===Br?J.image.height:null,oe=d[x.type];x.precision!==null&&(h=n.getMaxPrecision(x.precision),h!==x.precision&&Je("WebGLProgram.getParameters:",x.precision,"not supported, using",h,"instead."));let me=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,de=me!==void 0?me.length:0,we=0;I.morphAttributes.position!==void 0&&(we=1),I.morphAttributes.normal!==void 0&&(we=2),I.morphAttributes.color!==void 0&&(we=3);let Ge,Re,te,_e;if(oe){let Be=Gn[oe];Ge=Be.vertexShader,Re=Be.fragmentShader}else{Ge=x.vertexShader,Re=x.fragmentShader;let Be=o.getVertexShaderStage(x),it=o.getFragmentShaderStage(x);o.update(x,Be,it),te=Be.id,_e=it.id}let fe=i.getRenderTarget(),Ce=i.state.buffers.depth.getReversed(),ke=L.isInstancedMesh===!0,Ue=L.isBatchedMesh===!0,et=!!x.map,Z=!!x.matcap,ye=!!J,Se=!!x.aoMap,Ee=!!x.lightMap,Oe=!!x.bumpMap&&x.wireframe===!1,he=!!x.normalMap,Me=!!x.displacementMap,ue=!!x.emissiveMap,pe=!!x.metalnessMap,Pe=!!x.roughnessMap,N=x.anisotropy>0,V=x.clearcoat>0,ae=x.dispersion>0,M=x.iridescence>0,_=x.sheen>0,O=x.transmission>0,z=N&&!!x.anisotropyMap,H=V&&!!x.clearcoatMap,ie=V&&!!x.clearcoatNormalMap,j=V&&!!x.clearcoatRoughnessMap,W=M&&!!x.iridescenceMap,$=M&&!!x.iridescenceThicknessMap,ce=_&&!!x.sheenColorMap,Te=_&&!!x.sheenRoughnessMap,G=!!x.specularMap,k=!!x.specularColorMap,ne=!!x.specularIntensityMap,ge=O&&!!x.transmissionMap,Ae=O&&!!x.thicknessMap,B=!!x.gradientMap,xe=!!x.alphaMap,re=x.alphaTest>0,ve=!!x.alphaHash,be=!!x.extensions,le=In;x.toneMapped&&(fe===null||fe.isXRRenderTarget===!0)&&(le=i.toneMapping);let De={shaderID:oe,shaderType:x.type,shaderName:x.name,vertexShader:Ge,fragmentShader:Re,defines:x.defines,customVertexShaderID:te,customFragmentShaderID:_e,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:h,batching:Ue,batchingColor:Ue&&L._colorsTexture!==null,instancing:ke,instancingColor:ke&&L.instanceColor!==null,instancingMorph:ke&&L.morphTexture!==null,outputColorSpace:fe===null?i.outputColorSpace:fe.isXRRenderTarget===!0?fe.texture.colorSpace:rt.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:et,matcap:Z,envMap:ye,envMapMode:ye&&J.mapping,envMapCubeUVHeight:K,aoMap:Se,lightMap:Ee,bumpMap:Oe,normalMap:he,displacementMap:Me,emissiveMap:ue,normalMapObjectSpace:he&&x.normalMapType===wu,normalMapTangentSpace:he&&x.normalMapType===qr,packedNormalMap:he&&x.normalMapType===qr&&d_(x.normalMap.format),metalnessMap:pe,roughnessMap:Pe,anisotropy:N,anisotropyMap:z,clearcoat:V,clearcoatMap:H,clearcoatNormalMap:ie,clearcoatRoughnessMap:j,dispersion:ae,iridescence:M,iridescenceMap:W,iridescenceThicknessMap:$,sheen:_,sheenColorMap:ce,sheenRoughnessMap:Te,specularMap:G,specularColorMap:k,specularIntensityMap:ne,transmission:O,transmissionMap:ge,thicknessMap:Ae,gradientMap:B,opaque:x.transparent===!1&&x.blending===zi&&x.alphaToCoverage===!1,alphaMap:xe,alphaTest:re,alphaHash:ve,combine:x.combine,mapUv:et&&g(x.map.channel),aoMapUv:Se&&g(x.aoMap.channel),lightMapUv:Ee&&g(x.lightMap.channel),bumpMapUv:Oe&&g(x.bumpMap.channel),normalMapUv:he&&g(x.normalMap.channel),displacementMapUv:Me&&g(x.displacementMap.channel),emissiveMapUv:ue&&g(x.emissiveMap.channel),metalnessMapUv:pe&&g(x.metalnessMap.channel),roughnessMapUv:Pe&&g(x.roughnessMap.channel),anisotropyMapUv:z&&g(x.anisotropyMap.channel),clearcoatMapUv:H&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:ie&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:j&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:W&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:$&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:ce&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:Te&&g(x.sheenRoughnessMap.channel),specularMapUv:G&&g(x.specularMap.channel),specularColorMapUv:k&&g(x.specularColorMap.channel),specularIntensityMapUv:ne&&g(x.specularIntensityMap.channel),transmissionMapUv:ge&&g(x.transmissionMap.channel),thicknessMapUv:Ae&&g(x.thicknessMap.channel),alphaMapUv:xe&&g(x.alphaMap.channel),vertexTangents:!!I.attributes.tangent&&(he||N),vertexNormals:!!I.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!I.attributes.uv&&(et||xe),fog:!!Y,useFog:x.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||I.attributes.normal===void 0&&he===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:Ce,skinning:L.isSkinnedMesh===!0,hasPositionAttribute:I.attributes.position!==void 0,morphTargets:I.morphAttributes.position!==void 0,morphNormals:I.morphAttributes.normal!==void 0,morphColors:I.morphAttributes.color!==void 0,morphTargetsCount:de,morphTextureStride:we,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numLightProbeGrids:X.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:le,decodeVideoTexture:et&&x.map.isVideoTexture===!0&&rt.getTransfer(x.map.colorSpace)===dt,decodeVideoTextureEmissive:ue&&x.emissiveMap.isVideoTexture===!0&&rt.getTransfer(x.emissiveMap.colorSpace)===dt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===St,flipSided:x.side===tn,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:be&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(be&&x.extensions.multiDraw===!0||Ue)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return De.vertexUv1s=l.has(1),De.vertexUv2s=l.has(2),De.vertexUv3s=l.has(3),l.clear(),De}function m(x){let S=[];if(x.shaderID?S.push(x.shaderID):(S.push(x.customVertexShaderID),S.push(x.customFragmentShaderID)),x.defines!==void 0)for(let C in x.defines)S.push(C),S.push(x.defines[C]);return x.isRawShaderMaterial===!1&&(p(S,x),A(S,x),S.push(i.outputColorSpace)),S.push(x.customProgramCacheKey),S.join()}function p(x,S){x.push(S.precision),x.push(S.outputColorSpace),x.push(S.envMapMode),x.push(S.envMapCubeUVHeight),x.push(S.mapUv),x.push(S.alphaMapUv),x.push(S.lightMapUv),x.push(S.aoMapUv),x.push(S.bumpMapUv),x.push(S.normalMapUv),x.push(S.displacementMapUv),x.push(S.emissiveMapUv),x.push(S.metalnessMapUv),x.push(S.roughnessMapUv),x.push(S.anisotropyMapUv),x.push(S.clearcoatMapUv),x.push(S.clearcoatNormalMapUv),x.push(S.clearcoatRoughnessMapUv),x.push(S.iridescenceMapUv),x.push(S.iridescenceThicknessMapUv),x.push(S.sheenColorMapUv),x.push(S.sheenRoughnessMapUv),x.push(S.specularMapUv),x.push(S.specularColorMapUv),x.push(S.specularIntensityMapUv),x.push(S.transmissionMapUv),x.push(S.thicknessMapUv),x.push(S.combine),x.push(S.fogExp2),x.push(S.sizeAttenuation),x.push(S.morphTargetsCount),x.push(S.morphAttributeCount),x.push(S.numDirLights),x.push(S.numPointLights),x.push(S.numSpotLights),x.push(S.numSpotLightMaps),x.push(S.numHemiLights),x.push(S.numRectAreaLights),x.push(S.numDirLightShadows),x.push(S.numPointLightShadows),x.push(S.numSpotLightShadows),x.push(S.numSpotLightShadowsWithMaps),x.push(S.numLightProbes),x.push(S.shadowMapType),x.push(S.toneMapping),x.push(S.numClippingPlanes),x.push(S.numClipIntersection),x.push(S.depthPacking)}function A(x,S){a.disableAll(),S.instancing&&a.enable(0),S.instancingColor&&a.enable(1),S.instancingMorph&&a.enable(2),S.matcap&&a.enable(3),S.envMap&&a.enable(4),S.normalMapObjectSpace&&a.enable(5),S.normalMapTangentSpace&&a.enable(6),S.clearcoat&&a.enable(7),S.iridescence&&a.enable(8),S.alphaTest&&a.enable(9),S.vertexColors&&a.enable(10),S.vertexAlphas&&a.enable(11),S.vertexUv1s&&a.enable(12),S.vertexUv2s&&a.enable(13),S.vertexUv3s&&a.enable(14),S.vertexTangents&&a.enable(15),S.anisotropy&&a.enable(16),S.alphaHash&&a.enable(17),S.batching&&a.enable(18),S.dispersion&&a.enable(19),S.batchingColor&&a.enable(20),S.gradientMap&&a.enable(21),S.packedNormalMap&&a.enable(22),S.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reversedDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),S.numLightProbeGrids>0&&a.enable(22),S.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function T(x){let S=d[x.type],C;if(S){let D=Gn[S];C=gn.clone(D.uniforms)}else C=x.uniforms;return C}function v(x,S){let C=u.get(S);return C!==void 0?++C.usedTimes:(C=new h_(i,S,x,s),c.push(C),u.set(S,C)),C}function R(x){if(--x.usedTimes===0){let S=c.indexOf(x);c[S]=c[c.length-1],c.pop(),u.delete(x.cacheKey),x.destroy()}}function E(x){o.remove(x)}function w(){o.dispose()}return{getParameters:y,getProgramCacheKey:m,getUniforms:T,acquireProgram:v,releaseProgram:R,releaseShaderCache:E,programs:c,dispose:w}}function p_(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function m_(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function id(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function sd(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(h){let d=0;return h.isInstancedMesh&&(d+=2),h.isSkinnedMesh&&(d+=1),d}function o(h,d,g,y,m,p){let A=i[e];return A===void 0?(A={id:h.id,object:h,geometry:d,material:g,materialVariant:a(h),groupOrder:y,renderOrder:h.renderOrder,z:m,group:p},i[e]=A):(A.id=h.id,A.object=h,A.geometry=d,A.material=g,A.materialVariant=a(h),A.groupOrder=y,A.renderOrder=h.renderOrder,A.z=m,A.group=p),e++,A}function l(h,d,g,y,m,p){let A=o(h,d,g,y,m,p);g.transmission>0?n.push(A):g.transparent===!0?s.push(A):t.push(A)}function c(h,d,g,y,m,p){let A=o(h,d,g,y,m,p);g.transmission>0?n.unshift(A):g.transparent===!0?s.unshift(A):t.unshift(A)}function u(h,d,g){t.length>1&&t.sort(h||m_),n.length>1&&n.sort(d||id),s.length>1&&s.sort(d||id),g&&(t.reverse(),n.reverse(),s.reverse())}function f(){for(let h=e,d=i.length;h<d;h++){let g=i[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:f,sort:u}}function g_(){let i=new WeakMap;function e(n,s){let r=i.get(n),a;return r===void 0?(a=new sd,i.set(n,[a])):s>=r.length?(a=new sd,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function __(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new U,color:new ze};break;case"SpotLight":t={position:new U,direction:new U,color:new ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new U,color:new ze,distance:0,decay:0};break;case"HemisphereLight":t={direction:new U,skyColor:new ze,groundColor:new ze};break;case"RectAreaLight":t={color:new ze,position:new U,halfWidth:new U,halfHeight:new U};break}return i[e.id]=t,t}}}function x_(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Le,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var v_=0;function y_(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function M_(i){let e=new __,t=x_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new U);let s=new U,r=new ut,a=new ut;function o(c){let u=0,f=0,h=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let d=0,g=0,y=0,m=0,p=0,A=0,T=0,v=0,R=0,E=0,w=0;c.sort(y_);for(let S=0,C=c.length;S<C;S++){let D=c[S],L=D.color,X=D.intensity,Y=D.distance,I=null;if(D.shadow&&D.shadow.map&&(D.shadow.map.texture.format===Ri?I=D.shadow.map.texture:I=D.shadow.map.depthTexture||D.shadow.map.texture),D.isAmbientLight)u+=L.r*X,f+=L.g*X,h+=L.b*X;else if(D.isLightProbe){for(let P=0;P<9;P++)n.probe[P].addScaledVector(D.sh.coefficients[P],X);w++}else if(D.isDirectionalLight){let P=e.get(D);if(P.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){let F=D.shadow,J=t.get(D);J.shadowIntensity=F.intensity,J.shadowBias=F.bias,J.shadowNormalBias=F.normalBias,J.shadowRadius=F.radius,J.shadowMapSize=F.mapSize,n.directionalShadow[d]=J,n.directionalShadowMap[d]=I,n.directionalShadowMatrix[d]=D.shadow.matrix,A++}n.directional[d]=P,d++}else if(D.isSpotLight){let P=e.get(D);P.position.setFromMatrixPosition(D.matrixWorld),P.color.copy(L).multiplyScalar(X),P.distance=Y,P.coneCos=Math.cos(D.angle),P.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),P.decay=D.decay,n.spot[y]=P;let F=D.shadow;if(D.map&&(n.spotLightMap[R]=D.map,R++,F.updateMatrices(D),D.castShadow&&E++),n.spotLightMatrix[y]=F.matrix,D.castShadow){let J=t.get(D);J.shadowIntensity=F.intensity,J.shadowBias=F.bias,J.shadowNormalBias=F.normalBias,J.shadowRadius=F.radius,J.shadowMapSize=F.mapSize,n.spotShadow[y]=J,n.spotShadowMap[y]=I,v++}y++}else if(D.isRectAreaLight){let P=e.get(D);P.color.copy(L).multiplyScalar(X),P.halfWidth.set(D.width*.5,0,0),P.halfHeight.set(0,D.height*.5,0),n.rectArea[m]=P,m++}else if(D.isPointLight){let P=e.get(D);if(P.color.copy(D.color).multiplyScalar(D.intensity),P.distance=D.distance,P.decay=D.decay,D.castShadow){let F=D.shadow,J=t.get(D);J.shadowIntensity=F.intensity,J.shadowBias=F.bias,J.shadowNormalBias=F.normalBias,J.shadowRadius=F.radius,J.shadowMapSize=F.mapSize,J.shadowCameraNear=F.camera.near,J.shadowCameraFar=F.camera.far,n.pointShadow[g]=J,n.pointShadowMap[g]=I,n.pointShadowMatrix[g]=D.shadow.matrix,T++}n.point[g]=P,g++}else if(D.isHemisphereLight){let P=e.get(D);P.skyColor.copy(D.color).multiplyScalar(X),P.groundColor.copy(D.groundColor).multiplyScalar(X),n.hemi[p]=P,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ie.LTC_FLOAT_1,n.rectAreaLTC2=Ie.LTC_FLOAT_2):(n.rectAreaLTC1=Ie.LTC_HALF_1,n.rectAreaLTC2=Ie.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=f,n.ambient[2]=h;let x=n.hash;(x.directionalLength!==d||x.pointLength!==g||x.spotLength!==y||x.rectAreaLength!==m||x.hemiLength!==p||x.numDirectionalShadows!==A||x.numPointShadows!==T||x.numSpotShadows!==v||x.numSpotMaps!==R||x.numLightProbes!==w)&&(n.directional.length=d,n.spot.length=y,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=A,n.directionalShadowMap.length=A,n.pointShadow.length=T,n.pointShadowMap.length=T,n.spotShadow.length=v,n.spotShadowMap.length=v,n.directionalShadowMatrix.length=A,n.pointShadowMatrix.length=T,n.spotLightMatrix.length=v+R-E,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=w,x.directionalLength=d,x.pointLength=g,x.spotLength=y,x.rectAreaLength=m,x.hemiLength=p,x.numDirectionalShadows=A,x.numPointShadows=T,x.numSpotShadows=v,x.numSpotMaps=R,x.numLightProbes=w,n.version=v_++)}function l(c,u){let f=0,h=0,d=0,g=0,y=0,m=u.matrixWorldInverse;for(let p=0,A=c.length;p<A;p++){let T=c[p];if(T.isDirectionalLight){let v=n.directional[f];v.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),f++}else if(T.isSpotLight){let v=n.spot[d];v.position.setFromMatrixPosition(T.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),d++}else if(T.isRectAreaLight){let v=n.rectArea[g];v.position.setFromMatrixPosition(T.matrixWorld),v.position.applyMatrix4(m),a.identity(),r.copy(T.matrixWorld),r.premultiply(m),a.extractRotation(r),v.halfWidth.set(T.width*.5,0,0),v.halfHeight.set(0,T.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),g++}else if(T.isPointLight){let v=n.point[h];v.position.setFromMatrixPosition(T.matrixWorld),v.position.applyMatrix4(m),h++}else if(T.isHemisphereLight){let v=n.hemi[y];v.direction.setFromMatrixPosition(T.matrixWorld),v.direction.transformDirection(m),y++}}}return{setup:o,setupView:l,state:n}}function rd(i){let e=new M_(i),t=[],n=[],s=[];function r(h){f.camera=h,t.length=0,n.length=0,s.length=0}function a(h){t.push(h)}function o(h){n.push(h)}function l(h){s.push(h)}function c(){e.setup(t)}function u(h){e.setupView(t,h)}let f={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:c,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function b_(i){let e=new WeakMap;function t(s,r=0){let a=e.get(s),o;return a===void 0?(o=new rd(i),e.set(s,[o])):r>=a.length?(o=new rd(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}var S_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,T_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,E_=[new U(1,0,0),new U(-1,0,0),new U(0,1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1)],w_=[new U(0,-1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1),new U(0,-1,0),new U(0,-1,0)],ad=new ut,Zr=new U,kc=new U;function A_(i,e,t){let n=new Cs,s=new Le,r=new Le,a=new ft,o=new Fs,l=new Ns,c={},u=t.maxTextureSize,f={[An]:tn,[tn]:An,[St]:St},h=new mt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Le},radius:{value:4}},vertexShader:S_,fragmentShader:T_}),d=h.clone();d.defines.HORIZONTAL_PASS=1;let g=new at;g.setAttribute("position",new Rt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new Ke(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ji;let p=this.type;this.render=function(E,w,x){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;this.type===iu&&(Je("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Ji);let S=i.getRenderTarget(),C=i.getActiveCubeFace(),D=i.getActiveMipmapLevel(),L=i.state;L.setBlending(bn),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);let X=p!==this.type;X&&w.traverse(function(Y){Y.material&&(Array.isArray(Y.material)?Y.material.forEach(I=>I.needsUpdate=!0):Y.material.needsUpdate=!0)});for(let Y=0,I=E.length;Y<I;Y++){let P=E[Y],F=P.shadow;if(F===void 0){Je("WebGLShadowMap:",P,"has no shadow.");continue}if(F.autoUpdate===!1&&F.needsUpdate===!1)continue;s.copy(F.mapSize);let J=F.getFrameExtents();s.multiply(J),r.copy(F.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/J.x),s.x=r.x*J.x,F.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/J.y),s.y=r.y*J.y,F.mapSize.y=r.y));let K=i.state.buffers.depth.getReversed();if(F.camera._reversedDepth=K,F.map===null||X===!0){if(F.map!==null&&(F.map.depthTexture!==null&&(F.map.depthTexture.dispose(),F.map.depthTexture=null),F.map.dispose()),this.type===Os){if(P.isPointLight){Je("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}F.map=new Ct(s.x,s.y,{format:Ri,type:Ht,minFilter:Mt,magFilter:Mt,generateMipmaps:!1}),F.map.texture.name=P.name+".shadowMap",F.map.depthTexture=new jn(s.x,s.y,$t),F.map.depthTexture.name=P.name+".shadowMapDepth",F.map.depthTexture.format=On,F.map.depthTexture.compareFunction=null,F.map.depthTexture.minFilter=Nt,F.map.depthTexture.magFilter=Nt}else P.isPointLight?(F.map=new ll(s.x),F.map.depthTexture=new Ja(s.x,Ln)):(F.map=new Ct(s.x,s.y),F.map.depthTexture=new jn(s.x,s.y,Ln)),F.map.depthTexture.name=P.name+".shadowMap",F.map.depthTexture.format=On,this.type===Ji?(F.map.depthTexture.compareFunction=K?sl:il,F.map.depthTexture.minFilter=Mt,F.map.depthTexture.magFilter=Mt):(F.map.depthTexture.compareFunction=null,F.map.depthTexture.minFilter=Nt,F.map.depthTexture.magFilter=Nt);F.camera.updateProjectionMatrix()}let oe=F.map.isWebGLCubeRenderTarget?6:1;for(let me=0;me<oe;me++){if(F.map.isWebGLCubeRenderTarget)i.setRenderTarget(F.map,me),i.clear();else{me===0&&(i.setRenderTarget(F.map),i.clear());let de=F.getViewport(me);a.set(r.x*de.x,r.y*de.y,r.x*de.z,r.y*de.w),L.viewport(a)}if(P.isPointLight){let de=F.camera,we=F.matrix,Ge=P.distance||de.far;Ge!==de.far&&(de.far=Ge,de.updateProjectionMatrix()),Zr.setFromMatrixPosition(P.matrixWorld),de.position.copy(Zr),kc.copy(de.position),kc.add(E_[me]),de.up.copy(w_[me]),de.lookAt(kc),de.updateMatrixWorld(),we.makeTranslation(-Zr.x,-Zr.y,-Zr.z),ad.multiplyMatrices(de.projectionMatrix,de.matrixWorldInverse),F._frustum.setFromProjectionMatrix(ad,de.coordinateSystem,de.reversedDepth)}else F.updateMatrices(P);n=F.getFrustum(),v(w,x,F.camera,P,this.type)}F.isPointLightShadow!==!0&&this.type===Os&&A(F,x),F.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(S,C,D)};function A(E,w){let x=e.update(y);h.defines.VSM_SAMPLES!==E.blurSamples&&(h.defines.VSM_SAMPLES=E.blurSamples,d.defines.VSM_SAMPLES=E.blurSamples,h.needsUpdate=!0,d.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Ct(s.x,s.y,{format:Ri,type:Ht})),h.uniforms.shadow_pass.value=E.map.depthTexture,h.uniforms.resolution.value=E.mapSize,h.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(w,null,x,h,y,null),d.uniforms.shadow_pass.value=E.mapPass.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(w,null,x,d,y,null)}function T(E,w,x,S){let C=null,D=x.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(D!==void 0)C=D;else if(C=x.isPointLight===!0?l:o,i.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0||w.alphaToCoverage===!0){let L=C.uuid,X=w.uuid,Y=c[L];Y===void 0&&(Y={},c[L]=Y);let I=Y[X];I===void 0&&(I=C.clone(),Y[X]=I,w.addEventListener("dispose",R)),C=I}if(C.visible=w.visible,C.wireframe=w.wireframe,S===Os?C.side=w.shadowSide!==null?w.shadowSide:w.side:C.side=w.shadowSide!==null?w.shadowSide:f[w.side],C.alphaMap=w.alphaMap,C.alphaTest=w.alphaToCoverage===!0?.5:w.alphaTest,C.map=w.map,C.clipShadows=w.clipShadows,C.clippingPlanes=w.clippingPlanes,C.clipIntersection=w.clipIntersection,C.displacementMap=w.displacementMap,C.displacementScale=w.displacementScale,C.displacementBias=w.displacementBias,C.wireframeLinewidth=w.wireframeLinewidth,C.linewidth=w.linewidth,x.isPointLight===!0&&C.isMeshDistanceMaterial===!0){let L=i.properties.get(C);L.light=x}return C}function v(E,w,x,S,C){if(E.visible===!1)return;if(E.layers.test(w.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&C===Os)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,E.matrixWorld);let X=e.update(E),Y=E.material;if(Array.isArray(Y)){let I=X.groups;for(let P=0,F=I.length;P<F;P++){let J=I[P],K=Y[J.materialIndex];if(K&&K.visible){let oe=T(E,K,S,C);E.onBeforeShadow(i,E,w,x,X,oe,J),i.renderBufferDirect(x,null,X,oe,E,J),E.onAfterShadow(i,E,w,x,X,oe,J)}}}else if(Y.visible){let I=T(E,Y,S,C);E.onBeforeShadow(i,E,w,x,X,I,null),i.renderBufferDirect(x,null,X,I,E,null),E.onAfterShadow(i,E,w,x,X,I,null)}}let L=E.children;for(let X=0,Y=L.length;X<Y;X++)v(L[X],w,x,S,C)}function R(E){E.target.removeEventListener("dispose",R);for(let x in c){let S=c[x],C=E.target.uuid;C in S&&(S[C].dispose(),delete S[C])}}}function R_(i,e){function t(){let B=!1,xe=new ft,re=null,ve=new ft(0,0,0,0);return{setMask:function(be){re!==be&&!B&&(i.colorMask(be,be,be,be),re=be)},setLocked:function(be){B=be},setClear:function(be,le,De,Be,it){it===!0&&(be*=Be,le*=Be,De*=Be),xe.set(be,le,De,Be),ve.equals(xe)===!1&&(i.clearColor(be,le,De,Be),ve.copy(xe))},reset:function(){B=!1,re=null,ve.set(-1,0,0,0)}}}function n(){let B=!1,xe=!1,re=null,ve=null,be=null;return{setReversed:function(le){if(xe!==le){let De=e.get("EXT_clip_control");le?De.clipControlEXT(De.LOWER_LEFT_EXT,De.ZERO_TO_ONE_EXT):De.clipControlEXT(De.LOWER_LEFT_EXT,De.NEGATIVE_ONE_TO_ONE_EXT),xe=le;let Be=be;be=null,this.setClear(Be)}},getReversed:function(){return xe},setTest:function(le){le?fe(i.DEPTH_TEST):Ce(i.DEPTH_TEST)},setMask:function(le){re!==le&&!B&&(i.depthMask(le),re=le)},setFunc:function(le){if(xe&&(le=Uu[le]),ve!==le){switch(le){case Da:i.depthFunc(i.NEVER);break;case Fa:i.depthFunc(i.ALWAYS);break;case Na:i.depthFunc(i.LESS);break;case ki:i.depthFunc(i.LEQUAL);break;case Ua:i.depthFunc(i.EQUAL);break;case Oa:i.depthFunc(i.GEQUAL);break;case Ba:i.depthFunc(i.GREATER);break;case za:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ve=le}},setLocked:function(le){B=le},setClear:function(le){be!==le&&(be=le,xe&&(le=1-le),i.clearDepth(le))},reset:function(){B=!1,re=null,ve=null,be=null,xe=!1}}}function s(){let B=!1,xe=null,re=null,ve=null,be=null,le=null,De=null,Be=null,it=null;return{setTest:function(lt){B||(lt?fe(i.STENCIL_TEST):Ce(i.STENCIL_TEST))},setMask:function(lt){xe!==lt&&!B&&(i.stencilMask(lt),xe=lt)},setFunc:function(lt,Gt,ct){(re!==lt||ve!==Gt||be!==ct)&&(i.stencilFunc(lt,Gt,ct),re=lt,ve=Gt,be=ct)},setOp:function(lt,Gt,ct){(le!==lt||De!==Gt||Be!==ct)&&(i.stencilOp(lt,Gt,ct),le=lt,De=Gt,Be=ct)},setLocked:function(lt){B=lt},setClear:function(lt){it!==lt&&(i.clearStencil(lt),it=lt)},reset:function(){B=!1,xe=null,re=null,ve=null,be=null,le=null,De=null,Be=null,it=null}}}let r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap,u={},f={},h={},d=new WeakMap,g=[],y=null,m=!1,p=null,A=null,T=null,v=null,R=null,E=null,w=null,x=new ze(0,0,0),S=0,C=!1,D=null,L=null,X=null,Y=null,I=null,P=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),F=!1,J=0,K=i.getParameter(i.VERSION);K.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(K)[1]),F=J>=1):K.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),F=J>=2);let oe=null,me={},de=i.getParameter(i.SCISSOR_BOX),we=i.getParameter(i.VIEWPORT),Ge=new ft().fromArray(de),Re=new ft().fromArray(we);function te(B,xe,re,ve){let be=new Uint8Array(4),le=i.createTexture();i.bindTexture(B,le),i.texParameteri(B,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(B,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let De=0;De<re;De++)B===i.TEXTURE_3D||B===i.TEXTURE_2D_ARRAY?i.texImage3D(xe,0,i.RGBA,1,1,ve,0,i.RGBA,i.UNSIGNED_BYTE,be):i.texImage2D(xe+De,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,be);return le}let _e={};_e[i.TEXTURE_2D]=te(i.TEXTURE_2D,i.TEXTURE_2D,1),_e[i.TEXTURE_CUBE_MAP]=te(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),_e[i.TEXTURE_2D_ARRAY]=te(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),_e[i.TEXTURE_3D]=te(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),fe(i.DEPTH_TEST),a.setFunc(ki),Oe(!1),he(gc),fe(i.CULL_FACE),Se(bn);function fe(B){u[B]!==!0&&(i.enable(B),u[B]=!0)}function Ce(B){u[B]!==!1&&(i.disable(B),u[B]=!1)}function ke(B,xe){return h[B]!==xe?(i.bindFramebuffer(B,xe),h[B]=xe,B===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=xe),B===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=xe),!0):!1}function Ue(B,xe){let re=g,ve=!1;if(B){re=d.get(xe),re===void 0&&(re=[],d.set(xe,re));let be=B.textures;if(re.length!==be.length||re[0]!==i.COLOR_ATTACHMENT0){for(let le=0,De=be.length;le<De;le++)re[le]=i.COLOR_ATTACHMENT0+le;re.length=be.length,ve=!0}}else re[0]!==i.BACK&&(re[0]=i.BACK,ve=!0);ve&&i.drawBuffers(re)}function et(B){return y!==B?(i.useProgram(B),y=B,!0):!1}let Z={[_i]:i.FUNC_ADD,[ru]:i.FUNC_SUBTRACT,[au]:i.FUNC_REVERSE_SUBTRACT};Z[ou]=i.MIN,Z[lu]=i.MAX;let ye={[cu]:i.ZERO,[hu]:i.ONE,[uu]:i.SRC_COLOR,[Ia]:i.SRC_ALPHA,[_u]:i.SRC_ALPHA_SATURATE,[mu]:i.DST_COLOR,[fu]:i.DST_ALPHA,[du]:i.ONE_MINUS_SRC_COLOR,[La]:i.ONE_MINUS_SRC_ALPHA,[gu]:i.ONE_MINUS_DST_COLOR,[pu]:i.ONE_MINUS_DST_ALPHA,[xu]:i.CONSTANT_COLOR,[vu]:i.ONE_MINUS_CONSTANT_COLOR,[yu]:i.CONSTANT_ALPHA,[Mu]:i.ONE_MINUS_CONSTANT_ALPHA};function Se(B,xe,re,ve,be,le,De,Be,it,lt){if(B===bn){m===!0&&(Ce(i.BLEND),m=!1);return}if(m===!1&&(fe(i.BLEND),m=!0),B!==su){if(B!==p||lt!==C){if((A!==_i||R!==_i)&&(i.blendEquation(i.FUNC_ADD),A=_i,R=_i),lt)switch(B){case zi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Bs:i.blendFunc(i.ONE,i.ONE);break;case _c:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case xc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:$e("WebGLState: Invalid blending: ",B);break}else switch(B){case zi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Bs:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case _c:$e("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case xc:$e("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:$e("WebGLState: Invalid blending: ",B);break}T=null,v=null,E=null,w=null,x.set(0,0,0),S=0,p=B,C=lt}return}be=be||xe,le=le||re,De=De||ve,(xe!==A||be!==R)&&(i.blendEquationSeparate(Z[xe],Z[be]),A=xe,R=be),(re!==T||ve!==v||le!==E||De!==w)&&(i.blendFuncSeparate(ye[re],ye[ve],ye[le],ye[De]),T=re,v=ve,E=le,w=De),(Be.equals(x)===!1||it!==S)&&(i.blendColor(Be.r,Be.g,Be.b,it),x.copy(Be),S=it),p=B,C=!1}function Ee(B,xe){B.side===St?Ce(i.CULL_FACE):fe(i.CULL_FACE);let re=B.side===tn;xe&&(re=!re),Oe(re),B.blending===zi&&B.transparent===!1?Se(bn):Se(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),a.setFunc(B.depthFunc),a.setTest(B.depthTest),a.setMask(B.depthWrite),r.setMask(B.colorWrite);let ve=B.stencilWrite;o.setTest(ve),ve&&(o.setMask(B.stencilWriteMask),o.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),o.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),ue(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?fe(i.SAMPLE_ALPHA_TO_COVERAGE):Ce(i.SAMPLE_ALPHA_TO_COVERAGE)}function Oe(B){D!==B&&(B?i.frontFace(i.CW):i.frontFace(i.CCW),D=B)}function he(B){B!==tu?(fe(i.CULL_FACE),B!==L&&(B===gc?i.cullFace(i.BACK):B===nu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ce(i.CULL_FACE),L=B}function Me(B){B!==X&&(F&&i.lineWidth(B),X=B)}function ue(B,xe,re){B?(fe(i.POLYGON_OFFSET_FILL),(Y!==xe||I!==re)&&(Y=xe,I=re,a.getReversed()&&(xe=-xe),i.polygonOffset(xe,re))):Ce(i.POLYGON_OFFSET_FILL)}function pe(B){B?fe(i.SCISSOR_TEST):Ce(i.SCISSOR_TEST)}function Pe(B){B===void 0&&(B=i.TEXTURE0+P-1),oe!==B&&(i.activeTexture(B),oe=B)}function N(B,xe,re){re===void 0&&(oe===null?re=i.TEXTURE0+P-1:re=oe);let ve=me[re];ve===void 0&&(ve={type:void 0,texture:void 0},me[re]=ve),(ve.type!==B||ve.texture!==xe)&&(oe!==re&&(i.activeTexture(re),oe=re),i.bindTexture(B,xe||_e[B]),ve.type=B,ve.texture=xe)}function V(){let B=me[oe];B!==void 0&&B.type!==void 0&&(i.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function ae(){try{i.compressedTexImage2D(...arguments)}catch(B){$e("WebGLState:",B)}}function M(){try{i.compressedTexImage3D(...arguments)}catch(B){$e("WebGLState:",B)}}function _(){try{i.texSubImage2D(...arguments)}catch(B){$e("WebGLState:",B)}}function O(){try{i.texSubImage3D(...arguments)}catch(B){$e("WebGLState:",B)}}function z(){try{i.compressedTexSubImage2D(...arguments)}catch(B){$e("WebGLState:",B)}}function H(){try{i.compressedTexSubImage3D(...arguments)}catch(B){$e("WebGLState:",B)}}function ie(){try{i.texStorage2D(...arguments)}catch(B){$e("WebGLState:",B)}}function j(){try{i.texStorage3D(...arguments)}catch(B){$e("WebGLState:",B)}}function W(){try{i.texImage2D(...arguments)}catch(B){$e("WebGLState:",B)}}function $(){try{i.texImage3D(...arguments)}catch(B){$e("WebGLState:",B)}}function ce(B){return f[B]!==void 0?f[B]:i.getParameter(B)}function Te(B,xe){f[B]!==xe&&(i.pixelStorei(B,xe),f[B]=xe)}function G(B){Ge.equals(B)===!1&&(i.scissor(B.x,B.y,B.z,B.w),Ge.copy(B))}function k(B){Re.equals(B)===!1&&(i.viewport(B.x,B.y,B.z,B.w),Re.copy(B))}function ne(B,xe){let re=c.get(xe);re===void 0&&(re=new WeakMap,c.set(xe,re));let ve=re.get(B);ve===void 0&&(ve=i.getUniformBlockIndex(xe,B.name),re.set(B,ve))}function ge(B,xe){let ve=c.get(xe).get(B);l.get(xe)!==ve&&(i.uniformBlockBinding(xe,ve,B.__bindingPointIndex),l.set(xe,ve))}function Ae(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),u={},f={},oe=null,me={},h={},d=new WeakMap,g=[],y=null,m=!1,p=null,A=null,T=null,v=null,R=null,E=null,w=null,x=new ze(0,0,0),S=0,C=!1,D=null,L=null,X=null,Y=null,I=null,Ge.set(0,0,i.canvas.width,i.canvas.height),Re.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:fe,disable:Ce,bindFramebuffer:ke,drawBuffers:Ue,useProgram:et,setBlending:Se,setMaterial:Ee,setFlipSided:Oe,setCullFace:he,setLineWidth:Me,setPolygonOffset:ue,setScissorTest:pe,activeTexture:Pe,bindTexture:N,unbindTexture:V,compressedTexImage2D:ae,compressedTexImage3D:M,texImage2D:W,texImage3D:$,pixelStorei:Te,getParameter:ce,updateUBOMapping:ne,uniformBlockBinding:ge,texStorage2D:ie,texStorage3D:j,texSubImage2D:_,texSubImage3D:O,compressedTexSubImage2D:z,compressedTexSubImage3D:H,scissor:G,viewport:k,reset:Ae}}function C_(i,e,t,n,s,r,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Le,u=new WeakMap,f=new Set,h,d=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(M,_){return g?new OffscreenCanvas(M,_):pr("canvas")}function m(M,_,O){let z=1,H=ae(M);if((H.width>O||H.height>O)&&(z=O/Math.max(H.width,H.height)),z<1)if(typeof HTMLImageElement<"u"&&M instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&M instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&M instanceof ImageBitmap||typeof VideoFrame<"u"&&M instanceof VideoFrame){let ie=Math.floor(z*H.width),j=Math.floor(z*H.height);h===void 0&&(h=y(ie,j));let W=_?y(ie,j):h;return W.width=ie,W.height=j,W.getContext("2d").drawImage(M,0,0,ie,j),Je("WebGLRenderer: Texture has been resized from ("+H.width+"x"+H.height+") to ("+ie+"x"+j+")."),W}else return"data"in M&&Je("WebGLRenderer: Image in DataTexture is too big ("+H.width+"x"+H.height+")."),M;return M}function p(M){return M.generateMipmaps}function A(M){i.generateMipmap(M)}function T(M){return M.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:M.isWebGL3DRenderTarget?i.TEXTURE_3D:M.isWebGLArrayRenderTarget||M.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function v(M,_,O,z,H,ie=!1){if(M!==null){if(i[M]!==void 0)return i[M];Je("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+M+"'")}let j;z&&(j=e.get("EXT_texture_norm16"),j||Je("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let W=_;if(_===i.RED&&(O===i.FLOAT&&(W=i.R32F),O===i.HALF_FLOAT&&(W=i.R16F),O===i.UNSIGNED_BYTE&&(W=i.R8),O===i.UNSIGNED_SHORT&&j&&(W=j.R16_EXT),O===i.SHORT&&j&&(W=j.R16_SNORM_EXT)),_===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(W=i.R8UI),O===i.UNSIGNED_SHORT&&(W=i.R16UI),O===i.UNSIGNED_INT&&(W=i.R32UI),O===i.BYTE&&(W=i.R8I),O===i.SHORT&&(W=i.R16I),O===i.INT&&(W=i.R32I)),_===i.RG&&(O===i.FLOAT&&(W=i.RG32F),O===i.HALF_FLOAT&&(W=i.RG16F),O===i.UNSIGNED_BYTE&&(W=i.RG8),O===i.UNSIGNED_SHORT&&j&&(W=j.RG16_EXT),O===i.SHORT&&j&&(W=j.RG16_SNORM_EXT)),_===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(W=i.RG8UI),O===i.UNSIGNED_SHORT&&(W=i.RG16UI),O===i.UNSIGNED_INT&&(W=i.RG32UI),O===i.BYTE&&(W=i.RG8I),O===i.SHORT&&(W=i.RG16I),O===i.INT&&(W=i.RG32I)),_===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(W=i.RGB8UI),O===i.UNSIGNED_SHORT&&(W=i.RGB16UI),O===i.UNSIGNED_INT&&(W=i.RGB32UI),O===i.BYTE&&(W=i.RGB8I),O===i.SHORT&&(W=i.RGB16I),O===i.INT&&(W=i.RGB32I)),_===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(W=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(W=i.RGBA16UI),O===i.UNSIGNED_INT&&(W=i.RGBA32UI),O===i.BYTE&&(W=i.RGBA8I),O===i.SHORT&&(W=i.RGBA16I),O===i.INT&&(W=i.RGBA32I)),_===i.RGB&&(O===i.UNSIGNED_SHORT&&j&&(W=j.RGB16_EXT),O===i.SHORT&&j&&(W=j.RGB16_SNORM_EXT),O===i.UNSIGNED_INT_5_9_9_9_REV&&(W=i.RGB9_E5),O===i.UNSIGNED_INT_10F_11F_11F_REV&&(W=i.R11F_G11F_B10F)),_===i.RGBA){let $=ie?fr:rt.getTransfer(H);O===i.FLOAT&&(W=i.RGBA32F),O===i.HALF_FLOAT&&(W=i.RGBA16F),O===i.UNSIGNED_BYTE&&(W=$===dt?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT&&j&&(W=j.RGBA16_EXT),O===i.SHORT&&j&&(W=j.RGBA16_SNORM_EXT),O===i.UNSIGNED_SHORT_4_4_4_4&&(W=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(W=i.RGB5_A1)}return(W===i.R16F||W===i.R32F||W===i.RG16F||W===i.RG32F||W===i.RGBA16F||W===i.RGBA32F)&&e.get("EXT_color_buffer_float"),W}function R(M,_){let O;return M?_===null||_===Ln||_===ks?O=i.DEPTH24_STENCIL8:_===$t?O=i.DEPTH32F_STENCIL8:_===zs&&(O=i.DEPTH24_STENCIL8,Je("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Ln||_===ks?O=i.DEPTH_COMPONENT24:_===$t?O=i.DEPTH_COMPONENT32F:_===zs&&(O=i.DEPTH_COMPONENT16),O}function E(M,_){return p(M)===!0||M.isFramebufferTexture&&M.minFilter!==Nt&&M.minFilter!==Mt?Math.log2(Math.max(_.width,_.height))+1:M.mipmaps!==void 0&&M.mipmaps.length>0?M.mipmaps.length:M.isCompressedTexture&&Array.isArray(M.image)?_.mipmaps.length:1}function w(M){let _=M.target;_.removeEventListener("dispose",w),S(_),_.isVideoTexture&&u.delete(_),_.isHTMLTexture&&f.delete(_)}function x(M){let _=M.target;_.removeEventListener("dispose",x),D(_)}function S(M){let _=n.get(M);if(_.__webglInit===void 0)return;let O=M.source,z=d.get(O);if(z){let H=z[_.__cacheKey];H.usedTimes--,H.usedTimes===0&&C(M),Object.keys(z).length===0&&d.delete(O)}n.remove(M)}function C(M){let _=n.get(M);i.deleteTexture(_.__webglTexture);let O=M.source,z=d.get(O);delete z[_.__cacheKey],a.memory.textures--}function D(M){let _=n.get(M);if(M.depthTexture&&(M.depthTexture.dispose(),n.remove(M.depthTexture)),M.isWebGLCubeRenderTarget)for(let z=0;z<6;z++){if(Array.isArray(_.__webglFramebuffer[z]))for(let H=0;H<_.__webglFramebuffer[z].length;H++)i.deleteFramebuffer(_.__webglFramebuffer[z][H]);else i.deleteFramebuffer(_.__webglFramebuffer[z]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[z])}else{if(Array.isArray(_.__webglFramebuffer))for(let z=0;z<_.__webglFramebuffer.length;z++)i.deleteFramebuffer(_.__webglFramebuffer[z]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let z=0;z<_.__webglColorRenderbuffer.length;z++)_.__webglColorRenderbuffer[z]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[z]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let O=M.textures;for(let z=0,H=O.length;z<H;z++){let ie=n.get(O[z]);ie.__webglTexture&&(i.deleteTexture(ie.__webglTexture),a.memory.textures--),n.remove(O[z])}n.remove(M)}let L=0;function X(){L=0}function Y(){return L}function I(M){L=M}function P(){let M=L;return M>=s.maxTextures&&Je("WebGLTextures: Trying to use "+M+" texture units while this GPU supports only "+s.maxTextures),L+=1,M}function F(M){let _=[];return _.push(M.wrapS),_.push(M.wrapT),_.push(M.wrapR||0),_.push(M.magFilter),_.push(M.minFilter),_.push(M.anisotropy),_.push(M.internalFormat),_.push(M.format),_.push(M.type),_.push(M.generateMipmaps),_.push(M.premultiplyAlpha),_.push(M.flipY),_.push(M.unpackAlignment),_.push(M.colorSpace),_.join()}function J(M,_){let O=n.get(M);if(M.isVideoTexture&&N(M),M.isRenderTargetTexture===!1&&M.isExternalTexture!==!0&&M.version>0&&O.__version!==M.version){let z=M.image;if(z===null)Je("WebGLRenderer: Texture marked for update but no image data found.");else if(z.complete===!1)Je("WebGLRenderer: Texture marked for update but image is incomplete");else{Ce(O,M,_);return}}else M.isExternalTexture&&(O.__webglTexture=M.sourceTexture?M.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+_)}function K(M,_){let O=n.get(M);if(M.isRenderTargetTexture===!1&&M.version>0&&O.__version!==M.version){Ce(O,M,_);return}else M.isExternalTexture&&(O.__webglTexture=M.sourceTexture?M.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+_)}function oe(M,_){let O=n.get(M);if(M.isRenderTargetTexture===!1&&M.version>0&&O.__version!==M.version){Ce(O,M,_);return}t.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+_)}function me(M,_){let O=n.get(M);if(M.isCubeDepthTexture!==!0&&M.version>0&&O.__version!==M.version){ke(O,M,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+_)}let de={[Vi]:i.REPEAT,[Un]:i.CLAMP_TO_EDGE,[ka]:i.MIRRORED_REPEAT},we={[Nt]:i.NEAREST,[Tu]:i.NEAREST_MIPMAP_NEAREST,[zr]:i.NEAREST_MIPMAP_LINEAR,[Mt]:i.LINEAR,[vo]:i.LINEAR_MIPMAP_NEAREST,[ln]:i.LINEAR_MIPMAP_LINEAR},Ge={[Au]:i.NEVER,[Lu]:i.ALWAYS,[Ru]:i.LESS,[il]:i.LEQUAL,[Cu]:i.EQUAL,[sl]:i.GEQUAL,[Pu]:i.GREATER,[Iu]:i.NOTEQUAL};function Re(M,_){if(_.type===$t&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===Mt||_.magFilter===vo||_.magFilter===zr||_.magFilter===ln||_.minFilter===Mt||_.minFilter===vo||_.minFilter===zr||_.minFilter===ln)&&Je("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(M,i.TEXTURE_WRAP_S,de[_.wrapS]),i.texParameteri(M,i.TEXTURE_WRAP_T,de[_.wrapT]),(M===i.TEXTURE_3D||M===i.TEXTURE_2D_ARRAY)&&i.texParameteri(M,i.TEXTURE_WRAP_R,de[_.wrapR]),i.texParameteri(M,i.TEXTURE_MAG_FILTER,we[_.magFilter]),i.texParameteri(M,i.TEXTURE_MIN_FILTER,we[_.minFilter]),_.compareFunction&&(i.texParameteri(M,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(M,i.TEXTURE_COMPARE_FUNC,Ge[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Nt||_.minFilter!==zr&&_.minFilter!==ln||_.type===$t&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){let O=e.get("EXT_texture_filter_anisotropic");i.texParameterf(M,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function te(M,_){let O=!1;M.__webglInit===void 0&&(M.__webglInit=!0,_.addEventListener("dispose",w));let z=_.source,H=d.get(z);H===void 0&&(H={},d.set(z,H));let ie=F(_);if(ie!==M.__cacheKey){H[ie]===void 0&&(H[ie]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,O=!0),H[ie].usedTimes++;let j=H[M.__cacheKey];j!==void 0&&(H[M.__cacheKey].usedTimes--,j.usedTimes===0&&C(_)),M.__cacheKey=ie,M.__webglTexture=H[ie].texture}return O}function _e(M,_,O){return Math.floor(Math.floor(M/O)/_)}function fe(M,_,O,z){let ie=M.updateRanges;if(ie.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,O,z,_.data);else{ie.sort((Te,G)=>Te.start-G.start);let j=0;for(let Te=1;Te<ie.length;Te++){let G=ie[j],k=ie[Te],ne=G.start+G.count,ge=_e(k.start,_.width,4),Ae=_e(G.start,_.width,4);k.start<=ne+1&&ge===Ae&&_e(k.start+k.count-1,_.width,4)===ge?G.count=Math.max(G.count,k.start+k.count-G.start):(++j,ie[j]=k)}ie.length=j+1;let W=t.getParameter(i.UNPACK_ROW_LENGTH),$=t.getParameter(i.UNPACK_SKIP_PIXELS),ce=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let Te=0,G=ie.length;Te<G;Te++){let k=ie[Te],ne=Math.floor(k.start/4),ge=Math.ceil(k.count/4),Ae=ne%_.width,B=Math.floor(ne/_.width),xe=ge,re=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,Ae),t.pixelStorei(i.UNPACK_SKIP_ROWS,B),t.texSubImage2D(i.TEXTURE_2D,0,Ae,B,xe,re,O,z,_.data)}M.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,W),t.pixelStorei(i.UNPACK_SKIP_PIXELS,$),t.pixelStorei(i.UNPACK_SKIP_ROWS,ce)}}function Ce(M,_,O){let z=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(z=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(z=i.TEXTURE_3D);let H=te(M,_),ie=_.source;t.bindTexture(z,M.__webglTexture,i.TEXTURE0+O);let j=n.get(ie);if(ie.version!==j.__version||H===!0){if(t.activeTexture(i.TEXTURE0+O),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){let re=rt.getPrimaries(rt.workingColorSpace),ve=_.colorSpace===ti?null:rt.getPrimaries(_.colorSpace),be=_.colorSpace===ti||re===ve?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,be)}t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment);let $=m(_.image,!1,s.maxTextureSize);$=V(_,$);let ce=r.convert(_.format,_.colorSpace),Te=r.convert(_.type),G=v(_.internalFormat,ce,Te,_.normalized,_.colorSpace,_.isVideoTexture);Re(z,_);let k,ne=_.mipmaps,ge=_.isVideoTexture!==!0,Ae=j.__version===void 0||H===!0,B=ie.dataReady,xe=E(_,$);if(_.isDepthTexture)G=R(_.format===Ai,_.type),Ae&&(ge?t.texStorage2D(i.TEXTURE_2D,1,G,$.width,$.height):t.texImage2D(i.TEXTURE_2D,0,G,$.width,$.height,0,ce,Te,null));else if(_.isDataTexture)if(ne.length>0){ge&&Ae&&t.texStorage2D(i.TEXTURE_2D,xe,G,ne[0].width,ne[0].height);for(let re=0,ve=ne.length;re<ve;re++)k=ne[re],ge?B&&t.texSubImage2D(i.TEXTURE_2D,re,0,0,k.width,k.height,ce,Te,k.data):t.texImage2D(i.TEXTURE_2D,re,G,k.width,k.height,0,ce,Te,k.data);_.generateMipmaps=!1}else ge?(Ae&&t.texStorage2D(i.TEXTURE_2D,xe,G,$.width,$.height),B&&fe(_,$,ce,Te)):t.texImage2D(i.TEXTURE_2D,0,G,$.width,$.height,0,ce,Te,$.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){ge&&Ae&&t.texStorage3D(i.TEXTURE_2D_ARRAY,xe,G,ne[0].width,ne[0].height,$.depth);for(let re=0,ve=ne.length;re<ve;re++)if(k=ne[re],_.format!==nn)if(ce!==null)if(ge){if(B)if(_.layerUpdates.size>0){let be=Fc(k.width,k.height,_.format,_.type);for(let le of _.layerUpdates){let De=k.data.subarray(le*be/k.data.BYTES_PER_ELEMENT,(le+1)*be/k.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,re,0,0,le,k.width,k.height,1,ce,De)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,re,0,0,0,k.width,k.height,$.depth,ce,k.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,re,G,k.width,k.height,$.depth,0,k.data,0,0);else Je("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ge?B&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,re,0,0,0,k.width,k.height,$.depth,ce,Te,k.data):t.texImage3D(i.TEXTURE_2D_ARRAY,re,G,k.width,k.height,$.depth,0,ce,Te,k.data)}else{ge&&Ae&&t.texStorage2D(i.TEXTURE_2D,xe,G,ne[0].width,ne[0].height);for(let re=0,ve=ne.length;re<ve;re++)k=ne[re],_.format!==nn?ce!==null?ge?B&&t.compressedTexSubImage2D(i.TEXTURE_2D,re,0,0,k.width,k.height,ce,k.data):t.compressedTexImage2D(i.TEXTURE_2D,re,G,k.width,k.height,0,k.data):Je("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ge?B&&t.texSubImage2D(i.TEXTURE_2D,re,0,0,k.width,k.height,ce,Te,k.data):t.texImage2D(i.TEXTURE_2D,re,G,k.width,k.height,0,ce,Te,k.data)}else if(_.isDataArrayTexture)if(ge){if(Ae&&t.texStorage3D(i.TEXTURE_2D_ARRAY,xe,G,$.width,$.height,$.depth),B)if(_.layerUpdates.size>0){let re=Fc($.width,$.height,_.format,_.type);for(let ve of _.layerUpdates){let be=$.data.subarray(ve*re/$.data.BYTES_PER_ELEMENT,(ve+1)*re/$.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ve,$.width,$.height,1,ce,Te,be)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,$.width,$.height,$.depth,ce,Te,$.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,G,$.width,$.height,$.depth,0,ce,Te,$.data);else if(_.isData3DTexture)ge?(Ae&&t.texStorage3D(i.TEXTURE_3D,xe,G,$.width,$.height,$.depth),B&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,$.width,$.height,$.depth,ce,Te,$.data)):t.texImage3D(i.TEXTURE_3D,0,G,$.width,$.height,$.depth,0,ce,Te,$.data);else if(_.isFramebufferTexture){if(Ae)if(ge)t.texStorage2D(i.TEXTURE_2D,xe,G,$.width,$.height);else{let re=$.width,ve=$.height;for(let be=0;be<xe;be++)t.texImage2D(i.TEXTURE_2D,be,G,re,ve,0,ce,Te,null),re>>=1,ve>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in i){let re=i.canvas;if(re.hasAttribute("layoutsubtree")||re.setAttribute("layoutsubtree","true"),$.parentNode!==re){re.appendChild($),f.add(_),re.onpaint=ve=>{let be=ve.changedElements;for(let le of f)be.includes(le.image)&&(le.needsUpdate=!0)},re.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,$);else{let be=i.RGBA,le=i.RGBA,De=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,be,le,De,$)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(ne.length>0){if(ge&&Ae){let re=ae(ne[0]);t.texStorage2D(i.TEXTURE_2D,xe,G,re.width,re.height)}for(let re=0,ve=ne.length;re<ve;re++)k=ne[re],ge?B&&t.texSubImage2D(i.TEXTURE_2D,re,0,0,ce,Te,k):t.texImage2D(i.TEXTURE_2D,re,G,ce,Te,k);_.generateMipmaps=!1}else if(ge){if(Ae){let re=ae($);t.texStorage2D(i.TEXTURE_2D,xe,G,re.width,re.height)}B&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ce,Te,$)}else t.texImage2D(i.TEXTURE_2D,0,G,ce,Te,$);p(_)&&A(z),j.__version=ie.version,_.onUpdate&&_.onUpdate(_)}M.__version=_.version}function ke(M,_,O){if(_.image.length!==6)return;let z=te(M,_),H=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,M.__webglTexture,i.TEXTURE0+O);let ie=n.get(H);if(H.version!==ie.__version||z===!0){t.activeTexture(i.TEXTURE0+O);let j=rt.getPrimaries(rt.workingColorSpace),W=_.colorSpace===ti?null:rt.getPrimaries(_.colorSpace),$=_.colorSpace===ti||j===W?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,$);let ce=_.isCompressedTexture||_.image[0].isCompressedTexture,Te=_.image[0]&&_.image[0].isDataTexture,G=[];for(let le=0;le<6;le++)!ce&&!Te?G[le]=m(_.image[le],!0,s.maxCubemapSize):G[le]=Te?_.image[le].image:_.image[le],G[le]=V(_,G[le]);let k=G[0],ne=r.convert(_.format,_.colorSpace),ge=r.convert(_.type),Ae=v(_.internalFormat,ne,ge,_.normalized,_.colorSpace),B=_.isVideoTexture!==!0,xe=ie.__version===void 0||z===!0,re=H.dataReady,ve=E(_,k);Re(i.TEXTURE_CUBE_MAP,_);let be;if(ce){B&&xe&&t.texStorage2D(i.TEXTURE_CUBE_MAP,ve,Ae,k.width,k.height);for(let le=0;le<6;le++){be=G[le].mipmaps;for(let De=0;De<be.length;De++){let Be=be[De];_.format!==nn?ne!==null?B?re&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,De,0,0,Be.width,Be.height,ne,Be.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,De,Ae,Be.width,Be.height,0,Be.data):Je("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):B?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,De,0,0,Be.width,Be.height,ne,ge,Be.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,De,Ae,Be.width,Be.height,0,ne,ge,Be.data)}}}else{if(be=_.mipmaps,B&&xe){be.length>0&&ve++;let le=ae(G[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,ve,Ae,le.width,le.height)}for(let le=0;le<6;le++)if(Te){B?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,G[le].width,G[le].height,ne,ge,G[le].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,Ae,G[le].width,G[le].height,0,ne,ge,G[le].data);for(let De=0;De<be.length;De++){let it=be[De].image[le].image;B?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,De+1,0,0,it.width,it.height,ne,ge,it.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,De+1,Ae,it.width,it.height,0,ne,ge,it.data)}}else{B?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,0,0,ne,ge,G[le]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,Ae,ne,ge,G[le]);for(let De=0;De<be.length;De++){let Be=be[De];B?re&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,De+1,0,0,ne,ge,Be.image[le]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+le,De+1,Ae,ne,ge,Be.image[le])}}}p(_)&&A(i.TEXTURE_CUBE_MAP),ie.__version=H.version,_.onUpdate&&_.onUpdate(_)}M.__version=_.version}function Ue(M,_,O,z,H,ie){let j=r.convert(O.format,O.colorSpace),W=r.convert(O.type),$=v(O.internalFormat,j,W,O.normalized,O.colorSpace),ce=n.get(_),Te=n.get(O);if(Te.__renderTarget=_,!ce.__hasExternalTextures){let G=Math.max(1,_.width>>ie),k=Math.max(1,_.height>>ie);H===i.TEXTURE_3D||H===i.TEXTURE_2D_ARRAY?t.texImage3D(H,ie,$,G,k,_.depth,0,j,W,null):t.texImage2D(H,ie,$,G,k,0,j,W,null)}t.bindFramebuffer(i.FRAMEBUFFER,M),Pe(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,z,H,Te.__webglTexture,0,pe(_)):(H===i.TEXTURE_2D||H>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&H<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,z,H,Te.__webglTexture,ie),t.bindFramebuffer(i.FRAMEBUFFER,null)}function et(M,_,O){if(i.bindRenderbuffer(i.RENDERBUFFER,M),_.depthBuffer){let z=_.depthTexture,H=z&&z.isDepthTexture?z.type:null,ie=R(_.stencilBuffer,H),j=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Pe(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,pe(_),ie,_.width,_.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,pe(_),ie,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,ie,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,j,i.RENDERBUFFER,M)}else{let z=_.textures;for(let H=0;H<z.length;H++){let ie=z[H],j=r.convert(ie.format,ie.colorSpace),W=r.convert(ie.type),$=v(ie.internalFormat,j,W,ie.normalized,ie.colorSpace);Pe(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,pe(_),$,_.width,_.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,pe(_),$,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,$,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Z(M,_,O){let z=_.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,M),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let H=n.get(_.depthTexture);if(H.__renderTarget=_,(!H.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),z){if(H.__webglInit===void 0&&(H.__webglInit=!0,_.depthTexture.addEventListener("dispose",w)),H.__webglTexture===void 0){H.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture),Re(i.TEXTURE_CUBE_MAP,_.depthTexture);let ce=r.convert(_.depthTexture.format),Te=r.convert(_.depthTexture.type),G;_.depthTexture.format===On?G=i.DEPTH_COMPONENT24:_.depthTexture.format===Ai&&(G=i.DEPTH24_STENCIL8);for(let k=0;k<6;k++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+k,0,G,_.width,_.height,0,ce,Te,null)}}else J(_.depthTexture,0);let ie=H.__webglTexture,j=pe(_),W=z?i.TEXTURE_CUBE_MAP_POSITIVE_X+O:i.TEXTURE_2D,$=_.depthTexture.format===Ai?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(_.depthTexture.format===On)Pe(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,W,ie,0,j):i.framebufferTexture2D(i.FRAMEBUFFER,$,W,ie,0);else if(_.depthTexture.format===Ai)Pe(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,W,ie,0,j):i.framebufferTexture2D(i.FRAMEBUFFER,$,W,ie,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ye(M){let _=n.get(M),O=M.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==M.depthTexture){let z=M.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),z){let H=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,z.removeEventListener("dispose",H)};z.addEventListener("dispose",H),_.__depthDisposeCallback=H}_.__boundDepthTexture=z}if(M.depthTexture&&!_.__autoAllocateDepthBuffer)if(O)for(let z=0;z<6;z++)Z(_.__webglFramebuffer[z],M,z);else{let z=M.texture.mipmaps;z&&z.length>0?Z(_.__webglFramebuffer[0],M,0):Z(_.__webglFramebuffer,M,0)}else if(O){_.__webglDepthbuffer=[];for(let z=0;z<6;z++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[z]),_.__webglDepthbuffer[z]===void 0)_.__webglDepthbuffer[z]=i.createRenderbuffer(),et(_.__webglDepthbuffer[z],M,!1);else{let H=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ie=_.__webglDepthbuffer[z];i.bindRenderbuffer(i.RENDERBUFFER,ie),i.framebufferRenderbuffer(i.FRAMEBUFFER,H,i.RENDERBUFFER,ie)}}else{let z=M.texture.mipmaps;if(z&&z.length>0?t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),et(_.__webglDepthbuffer,M,!1);else{let H=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ie=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ie),i.framebufferRenderbuffer(i.FRAMEBUFFER,H,i.RENDERBUFFER,ie)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Se(M,_,O){let z=n.get(M);_!==void 0&&Ue(z.__webglFramebuffer,M,M.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&ye(M)}function Ee(M){let _=M.texture,O=n.get(M),z=n.get(_);M.addEventListener("dispose",x);let H=M.textures,ie=M.isWebGLCubeRenderTarget===!0,j=H.length>1;if(j||(z.__webglTexture===void 0&&(z.__webglTexture=i.createTexture()),z.__version=_.version,a.memory.textures++),ie){O.__webglFramebuffer=[];for(let W=0;W<6;W++)if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer[W]=[];for(let $=0;$<_.mipmaps.length;$++)O.__webglFramebuffer[W][$]=i.createFramebuffer()}else O.__webglFramebuffer[W]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer=[];for(let W=0;W<_.mipmaps.length;W++)O.__webglFramebuffer[W]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(j)for(let W=0,$=H.length;W<$;W++){let ce=n.get(H[W]);ce.__webglTexture===void 0&&(ce.__webglTexture=i.createTexture(),a.memory.textures++)}if(M.samples>0&&Pe(M)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let W=0;W<H.length;W++){let $=H[W];O.__webglColorRenderbuffer[W]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[W]);let ce=r.convert($.format,$.colorSpace),Te=r.convert($.type),G=v($.internalFormat,ce,Te,$.normalized,$.colorSpace,M.isXRRenderTarget===!0),k=pe(M);i.renderbufferStorageMultisample(i.RENDERBUFFER,k,G,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+W,i.RENDERBUFFER,O.__webglColorRenderbuffer[W])}i.bindRenderbuffer(i.RENDERBUFFER,null),M.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),et(O.__webglDepthRenderbuffer,M,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ie){t.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture),Re(i.TEXTURE_CUBE_MAP,_);for(let W=0;W<6;W++)if(_.mipmaps&&_.mipmaps.length>0)for(let $=0;$<_.mipmaps.length;$++)Ue(O.__webglFramebuffer[W][$],M,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+W,$);else Ue(O.__webglFramebuffer[W],M,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+W,0);p(_)&&A(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(j){for(let W=0,$=H.length;W<$;W++){let ce=H[W],Te=n.get(ce),G=i.TEXTURE_2D;(M.isWebGL3DRenderTarget||M.isWebGLArrayRenderTarget)&&(G=M.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(G,Te.__webglTexture),Re(G,ce),Ue(O.__webglFramebuffer,M,ce,i.COLOR_ATTACHMENT0+W,G,0),p(ce)&&A(G)}t.unbindTexture()}else{let W=i.TEXTURE_2D;if((M.isWebGL3DRenderTarget||M.isWebGLArrayRenderTarget)&&(W=M.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(W,z.__webglTexture),Re(W,_),_.mipmaps&&_.mipmaps.length>0)for(let $=0;$<_.mipmaps.length;$++)Ue(O.__webglFramebuffer[$],M,_,i.COLOR_ATTACHMENT0,W,$);else Ue(O.__webglFramebuffer,M,_,i.COLOR_ATTACHMENT0,W,0);p(_)&&A(W),t.unbindTexture()}M.depthBuffer&&ye(M)}function Oe(M){let _=M.textures;for(let O=0,z=_.length;O<z;O++){let H=_[O];if(p(H)){let ie=T(M),j=n.get(H).__webglTexture;t.bindTexture(ie,j),A(ie),t.unbindTexture()}}}let he=[],Me=[];function ue(M){if(M.samples>0){if(Pe(M)===!1){let _=M.textures,O=M.width,z=M.height,H=i.COLOR_BUFFER_BIT,ie=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,j=n.get(M),W=_.length>1;if(W)for(let ce=0;ce<_.length;ce++)t.bindFramebuffer(i.FRAMEBUFFER,j.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,j.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,j.__webglMultisampledFramebuffer);let $=M.texture.mipmaps;$&&$.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,j.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,j.__webglFramebuffer);for(let ce=0;ce<_.length;ce++){if(M.resolveDepthBuffer&&(M.depthBuffer&&(H|=i.DEPTH_BUFFER_BIT),M.stencilBuffer&&M.resolveStencilBuffer&&(H|=i.STENCIL_BUFFER_BIT)),W){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,j.__webglColorRenderbuffer[ce]);let Te=n.get(_[ce]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Te,0)}i.blitFramebuffer(0,0,O,z,0,0,O,z,H,i.NEAREST),l===!0&&(he.length=0,Me.length=0,he.push(i.COLOR_ATTACHMENT0+ce),M.depthBuffer&&M.resolveDepthBuffer===!1&&(he.push(ie),Me.push(ie),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Me)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,he))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),W)for(let ce=0;ce<_.length;ce++){t.bindFramebuffer(i.FRAMEBUFFER,j.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.RENDERBUFFER,j.__webglColorRenderbuffer[ce]);let Te=n.get(_[ce]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,j.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.TEXTURE_2D,Te,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,j.__webglMultisampledFramebuffer)}else if(M.depthBuffer&&M.resolveDepthBuffer===!1&&l){let _=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function pe(M){return Math.min(s.maxSamples,M.samples)}function Pe(M){let _=n.get(M);return M.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function N(M){let _=a.render.frame;u.get(M)!==_&&(u.set(M,_),M.update())}function V(M,_){let O=M.colorSpace,z=M.format,H=M.type;return M.isCompressedTexture===!0||M.isVideoTexture===!0||O!==dr&&O!==ti&&(rt.getTransfer(O)===dt?(z!==nn||H!==cn)&&Je("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):$e("WebGLTextures: Unsupported texture color space:",O)),_}function ae(M){return typeof HTMLImageElement<"u"&&M instanceof HTMLImageElement?(c.width=M.naturalWidth||M.width,c.height=M.naturalHeight||M.height):typeof VideoFrame<"u"&&M instanceof VideoFrame?(c.width=M.displayWidth,c.height=M.displayHeight):(c.width=M.width,c.height=M.height),c}this.allocateTextureUnit=P,this.resetTextureUnits=X,this.getTextureUnits=Y,this.setTextureUnits=I,this.setTexture2D=J,this.setTexture2DArray=K,this.setTexture3D=oe,this.setTextureCube=me,this.rebindTextures=Se,this.setupRenderTarget=Ee,this.updateRenderTargetMipmap=Oe,this.updateMultisampleRenderTarget=ue,this.setupDepthRenderbuffer=ye,this.setupFrameBufferTexture=Ue,this.useMultisampledRTT=Pe,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function P_(i,e){function t(n,s=ti){let r,a=rt.getTransfer(s);if(n===cn)return i.UNSIGNED_BYTE;if(n===Mo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===bo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===bc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Sc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===yc)return i.BYTE;if(n===Mc)return i.SHORT;if(n===zs)return i.UNSIGNED_SHORT;if(n===yo)return i.INT;if(n===Ln)return i.UNSIGNED_INT;if(n===$t)return i.FLOAT;if(n===Ht)return i.HALF_FLOAT;if(n===Tc)return i.ALPHA;if(n===Ec)return i.RGB;if(n===nn)return i.RGBA;if(n===On)return i.DEPTH_COMPONENT;if(n===Ai)return i.DEPTH_STENCIL;if(n===So)return i.RED;if(n===To)return i.RED_INTEGER;if(n===Ri)return i.RG;if(n===Eo)return i.RG_INTEGER;if(n===wo)return i.RGBA_INTEGER;if(n===kr||n===Vr||n===Hr||n===Gr)if(a===dt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===kr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Hr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Gr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===kr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Vr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Hr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Gr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ao||n===Ro||n===Co||n===Po)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ao)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ro)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Co)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Po)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Io||n===Lo||n===Do||n===Fo||n===No||n===Wr||n===Uo)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Io||n===Lo)return a===dt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Do)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Fo)return r.COMPRESSED_R11_EAC;if(n===No)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Wr)return r.COMPRESSED_RG11_EAC;if(n===Uo)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Oo||n===Bo||n===zo||n===ko||n===Vo||n===Ho||n===Go||n===Wo||n===Xo||n===qo||n===Yo||n===Zo||n===Jo||n===$o)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Oo)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Bo)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===zo)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ko)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Vo)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ho)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Go)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Wo)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Xo)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===qo)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Yo)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Zo)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Jo)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===$o)return a===dt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ko||n===jo||n===Qo)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Ko)return a===dt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===jo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Qo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===el||n===tl||n===Xr||n===nl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===el)return r.COMPRESSED_RED_RGTC1_EXT;if(n===tl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Xr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===nl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ks?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var I_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,L_=`
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

}`,Zc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Mr(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new mt({vertexShader:I_,fragmentShader:L_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ke(new Vt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Jc=class extends Bn{constructor(e,t){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,f=null,h=null,d=null,g=null,y=typeof XRWebGLBinding<"u",m=new Zc,p={},A=t.getContextAttributes(),T=null,v=null,R=[],E=[],w=new Le,x=null,S=new Ft;S.viewport=new ft;let C=new Ft;C.viewport=new ft;let D=[S,C],L=new mo,X=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(te){let _e=R[te];return _e===void 0&&(_e=new Rs,R[te]=_e),_e.getTargetRaySpace()},this.getControllerGrip=function(te){let _e=R[te];return _e===void 0&&(_e=new Rs,R[te]=_e),_e.getGripSpace()},this.getHand=function(te){let _e=R[te];return _e===void 0&&(_e=new Rs,R[te]=_e),_e.getHandSpace()};function I(te){let _e=E.indexOf(te.inputSource);if(_e===-1)return;let fe=R[_e];fe!==void 0&&(fe.update(te.inputSource,te.frame,c||a),fe.dispatchEvent({type:te.type,data:te.inputSource}))}function P(){s.removeEventListener("select",I),s.removeEventListener("selectstart",I),s.removeEventListener("selectend",I),s.removeEventListener("squeeze",I),s.removeEventListener("squeezestart",I),s.removeEventListener("squeezeend",I),s.removeEventListener("end",P),s.removeEventListener("inputsourceschange",F);for(let te=0;te<R.length;te++){let _e=E[te];_e!==null&&(E[te]=null,R[te].disconnect(_e))}X=null,Y=null,m.reset();for(let te in p)delete p[te];e.setRenderTarget(T),d=null,h=null,f=null,s=null,v=null,Re.stop(),n.isPresenting=!1,e.setPixelRatio(x),e.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(te){r=te,n.isPresenting===!0&&Je("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(te){o=te,n.isPresenting===!0&&Je("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(te){c=te},this.getBaseLayer=function(){return h!==null?h:d},this.getBinding=function(){return f===null&&y&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(te){if(s=te,s!==null){if(T=e.getRenderTarget(),s.addEventListener("select",I),s.addEventListener("selectstart",I),s.addEventListener("selectend",I),s.addEventListener("squeeze",I),s.addEventListener("squeezestart",I),s.addEventListener("squeezeend",I),s.addEventListener("end",P),s.addEventListener("inputsourceschange",F),A.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(w),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let fe=null,Ce=null,ke=null;A.depth&&(ke=A.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,fe=A.stencil?Ai:On,Ce=A.stencil?ks:Ln);let Ue={colorFormat:t.RGBA8,depthFormat:ke,scaleFactor:r};f=this.getBinding(),h=f.createProjectionLayer(Ue),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),v=new Ct(h.textureWidth,h.textureHeight,{format:nn,type:cn,depthTexture:new jn(h.textureWidth,h.textureHeight,Ce,void 0,void 0,void 0,void 0,void 0,void 0,fe),stencilBuffer:A.stencil,colorSpace:e.outputColorSpace,samples:A.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{let fe={antialias:A.antialias,alpha:!0,depth:A.depth,stencil:A.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,t,fe),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),v=new Ct(d.framebufferWidth,d.framebufferHeight,{format:nn,type:cn,colorSpace:e.outputColorSpace,stencilBuffer:A.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Re.setContext(s),Re.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function F(te){for(let _e=0;_e<te.removed.length;_e++){let fe=te.removed[_e],Ce=E.indexOf(fe);Ce>=0&&(E[Ce]=null,R[Ce].disconnect(fe))}for(let _e=0;_e<te.added.length;_e++){let fe=te.added[_e],Ce=E.indexOf(fe);if(Ce===-1){for(let Ue=0;Ue<R.length;Ue++)if(Ue>=E.length){E.push(fe),Ce=Ue;break}else if(E[Ue]===null){E[Ue]=fe,Ce=Ue;break}if(Ce===-1)break}let ke=R[Ce];ke&&ke.connect(fe)}}let J=new U,K=new U;function oe(te,_e,fe){J.setFromMatrixPosition(_e.matrixWorld),K.setFromMatrixPosition(fe.matrixWorld);let Ce=J.distanceTo(K),ke=_e.projectionMatrix.elements,Ue=fe.projectionMatrix.elements,et=ke[14]/(ke[10]-1),Z=ke[14]/(ke[10]+1),ye=(ke[9]+1)/ke[5],Se=(ke[9]-1)/ke[5],Ee=(ke[8]-1)/ke[0],Oe=(Ue[8]+1)/Ue[0],he=et*Ee,Me=et*Oe,ue=Ce/(-Ee+Oe),pe=ue*-Ee;if(_e.matrixWorld.decompose(te.position,te.quaternion,te.scale),te.translateX(pe),te.translateZ(ue),te.matrixWorld.compose(te.position,te.quaternion,te.scale),te.matrixWorldInverse.copy(te.matrixWorld).invert(),ke[10]===-1)te.projectionMatrix.copy(_e.projectionMatrix),te.projectionMatrixInverse.copy(_e.projectionMatrixInverse);else{let Pe=et+ue,N=Z+ue,V=he-pe,ae=Me+(Ce-pe),M=ye*Z/N*Pe,_=Se*Z/N*Pe;te.projectionMatrix.makePerspective(V,ae,M,_,Pe,N),te.projectionMatrixInverse.copy(te.projectionMatrix).invert()}}function me(te,_e){_e===null?te.matrixWorld.copy(te.matrix):te.matrixWorld.multiplyMatrices(_e.matrixWorld,te.matrix),te.matrixWorldInverse.copy(te.matrixWorld).invert()}this.updateCamera=function(te){if(s===null)return;let _e=te.near,fe=te.far;m.texture!==null&&(m.depthNear>0&&(_e=m.depthNear),m.depthFar>0&&(fe=m.depthFar)),L.near=C.near=S.near=_e,L.far=C.far=S.far=fe,(X!==L.near||Y!==L.far)&&(s.updateRenderState({depthNear:L.near,depthFar:L.far}),X=L.near,Y=L.far),L.layers.mask=te.layers.mask|6,S.layers.mask=L.layers.mask&-5,C.layers.mask=L.layers.mask&-3;let Ce=te.parent,ke=L.cameras;me(L,Ce);for(let Ue=0;Ue<ke.length;Ue++)me(ke[Ue],Ce);ke.length===2?oe(L,S,C):L.projectionMatrix.copy(S.projectionMatrix),de(te,L,Ce)};function de(te,_e,fe){fe===null?te.matrix.copy(_e.matrixWorld):(te.matrix.copy(fe.matrixWorld),te.matrix.invert(),te.matrix.multiply(_e.matrixWorld)),te.matrix.decompose(te.position,te.quaternion,te.scale),te.updateMatrixWorld(!0),te.projectionMatrix.copy(_e.projectionMatrix),te.projectionMatrixInverse.copy(_e.projectionMatrixInverse),te.isPerspectiveCamera&&(te.fov=Hi*2*Math.atan(1/te.projectionMatrix.elements[5]),te.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(h===null&&d===null))return l},this.setFoveation=function(te){l=te,h!==null&&(h.fixedFoveation=te),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=te)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(L)},this.getCameraTexture=function(te){return p[te]};let we=null;function Ge(te,_e){if(u=_e.getViewerPose(c||a),g=_e,u!==null){let fe=u.views;d!==null&&(e.setRenderTargetFramebuffer(v,d.framebuffer),e.setRenderTarget(v));let Ce=!1;fe.length!==L.cameras.length&&(L.cameras.length=0,Ce=!0);for(let Z=0;Z<fe.length;Z++){let ye=fe[Z],Se=null;if(d!==null)Se=d.getViewport(ye);else{let Oe=f.getViewSubImage(h,ye);Se=Oe.viewport,Z===0&&(e.setRenderTargetTextures(v,Oe.colorTexture,Oe.depthStencilTexture),e.setRenderTarget(v))}let Ee=D[Z];Ee===void 0&&(Ee=new Ft,Ee.layers.enable(Z),Ee.viewport=new ft,D[Z]=Ee),Ee.matrix.fromArray(ye.transform.matrix),Ee.matrix.decompose(Ee.position,Ee.quaternion,Ee.scale),Ee.projectionMatrix.fromArray(ye.projectionMatrix),Ee.projectionMatrixInverse.copy(Ee.projectionMatrix).invert(),Ee.viewport.set(Se.x,Se.y,Se.width,Se.height),Z===0&&(L.matrix.copy(Ee.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),Ce===!0&&L.cameras.push(Ee)}let ke=s.enabledFeatures;if(ke&&ke.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&y){f=n.getBinding();let Z=f.getDepthInformation(fe[0]);Z&&Z.isValid&&Z.texture&&m.init(Z,s.renderState)}if(ke&&ke.includes("camera-access")&&y){e.state.unbindTexture(),f=n.getBinding();for(let Z=0;Z<fe.length;Z++){let ye=fe[Z].camera;if(ye){let Se=p[ye];Se||(Se=new Mr,p[ye]=Se);let Ee=f.getCameraImage(ye);Se.sourceTexture=Ee}}}}for(let fe=0;fe<R.length;fe++){let Ce=E[fe],ke=R[fe];Ce!==null&&ke!==void 0&&ke.update(Ce,_e,c||a)}we&&we(te,_e),_e.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:_e}),g=null}let Re=new od;Re.setAnimationLoop(Ge),this.setAnimationLoop=function(te){we=te},this.dispose=function(){}}},D_=new ut,fd=new je;fd.set(-1,0,0,0,1,0,0,0,1);function F_(i,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Ic(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,A,T,v){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(m,p):p.isMeshLambertMaterial?(r(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(m,p),f(m,p)):p.isMeshPhongMaterial?(r(m,p),u(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(m,p),h(m,p),p.isMeshPhysicalMaterial&&d(m,p,v)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),y(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,A,T):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===tn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===tn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let A=e.get(p),T=A.envMap,v=A.envMapRotation;T&&(m.envMap.value=T,m.envMapRotation.value.setFromMatrix4(D_.makeRotationFromEuler(v)).transpose(),T.isCubeTexture&&T.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(fd),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,A,T){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*A,m.scale.value=T*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,A){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===tn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=A.texture,m.transmissionSamplerSize.value.set(A.width,A.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function y(m,p){let A=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(A.matrixWorld),m.nearDistance.value=A.shadow.camera.near,m.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function N_(i,e,t,n){let s={},r={},a=[],o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,R){let E=R.program;n.uniformBlockBinding(v,E)}function c(v,R){let E=s[v.id];E===void 0&&(m(v),E=u(v),s[v.id]=E,v.addEventListener("dispose",A));let w=R.program;n.updateUBOMapping(v,w);let x=e.render.frame;r[v.id]!==x&&(h(v),r[v.id]=x)}function u(v){let R=f();v.__bindingPointIndex=R;let E=i.createBuffer(),w=v.__size,x=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,E),i.bufferData(i.UNIFORM_BUFFER,w,x),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,R,E),E}function f(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return $e("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(v){let R=s[v.id],E=v.uniforms,w=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,R);for(let x=0,S=E.length;x<S;x++){let C=E[x];if(Array.isArray(C))for(let D=0,L=C.length;D<L;D++)d(C[D],x,D,w);else d(C,x,0,w)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(v,R,E,w){if(y(v,R,E,w)===!0){let x=v.__offset,S=v.value;if(Array.isArray(S)){let C=0;for(let D=0;D<S.length;D++){let L=S[D],X=p(L);g(L,v.__data,C),typeof L!="number"&&typeof L!="boolean"&&!L.isMatrix3&&!ArrayBuffer.isView(L)&&(C+=X.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(S,v.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,x,v.__data)}}function g(v,R,E){typeof v=="number"||typeof v=="boolean"?R[0]=v:v.isMatrix3?(R[0]=v.elements[0],R[1]=v.elements[1],R[2]=v.elements[2],R[3]=0,R[4]=v.elements[3],R[5]=v.elements[4],R[6]=v.elements[5],R[7]=0,R[8]=v.elements[6],R[9]=v.elements[7],R[10]=v.elements[8],R[11]=0):ArrayBuffer.isView(v)?R.set(new v.constructor(v.buffer,v.byteOffset,R.length)):v.toArray(R,E)}function y(v,R,E,w){let x=v.value,S=R+"_"+E;if(w[S]===void 0)return typeof x=="number"||typeof x=="boolean"?w[S]=x:ArrayBuffer.isView(x)?w[S]=x.slice():w[S]=x.clone(),!0;{let C=w[S];if(typeof x=="number"||typeof x=="boolean"){if(C!==x)return w[S]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(C.equals(x)===!1)return C.copy(x),!0}}return!1}function m(v){let R=v.uniforms,E=0,w=16;for(let S=0,C=R.length;S<C;S++){let D=Array.isArray(R[S])?R[S]:[R[S]];for(let L=0,X=D.length;L<X;L++){let Y=D[L],I=Array.isArray(Y.value)?Y.value:[Y.value];for(let P=0,F=I.length;P<F;P++){let J=I[P],K=p(J),oe=E%w,me=oe%K.boundary,de=oe+me;E+=me,de!==0&&w-de<K.storage&&(E+=w-de),Y.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),Y.__offset=E,E+=K.storage}}}let x=E%w;return x>0&&(E+=w-x),v.__size=E,v.__cache={},this}function p(v){let R={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(R.boundary=4,R.storage=4):v.isVector2?(R.boundary=8,R.storage=8):v.isVector3||v.isColor?(R.boundary=16,R.storage=12):v.isVector4?(R.boundary=16,R.storage=16):v.isMatrix3?(R.boundary=48,R.storage=48):v.isMatrix4?(R.boundary=64,R.storage=64):v.isTexture?Je("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(R.boundary=16,R.storage=v.byteLength):Je("WebGLRenderer: Unsupported uniform value type.",v),R}function A(v){let R=v.target;R.removeEventListener("dispose",A);let E=a.indexOf(R.__bindingPointIndex);a.splice(E,1),i.deleteBuffer(s[R.id]),delete s[R.id],delete r[R.id]}function T(){for(let v in s)i.deleteBuffer(s[v]);a=[],s={},r={}}return{bind:l,update:c,dispose:T}}var U_=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Hn=null;function O_(){return Hn===null&&(Hn=new vi(U_,16,16,Ri,Ht),Hn.name="DFG_LUT",Hn.minFilter=Mt,Hn.magFilter=Mt,Hn.wrapS=Un,Hn.wrapT=Un,Hn.generateMipmaps=!1,Hn.needsUpdate=!0),Hn}var cl=class{constructor(e={}){let{canvas:t=Du(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:h=!1,outputBufferType:d=cn}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;let y=d,m=new Set([wo,Eo,To]),p=new Set([cn,Ln,zs,ks,Mo,bo]),A=new Uint32Array(4),T=new Int32Array(4),v=new U,R=null,E=null,w=[],x=[],S=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=In,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let C=this,D=!1,L=null,X=null,Y=null,I=null;this._outputColorSpace=vt;let P=0,F=0,J=null,K=-1,oe=null,me=new ft,de=new ft,we=null,Ge=new ze(0),Re=0,te=t.width,_e=t.height,fe=1,Ce=null,ke=null,Ue=new ft(0,0,te,_e),et=new ft(0,0,te,_e),Z=!1,ye=new Cs,Se=!1,Ee=!1,Oe=new ut,he=new U,Me=new ft,ue={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},pe=!1;function Pe(){return J===null?fe:1}let N=n;function V(b,q){return t.getContext(b,q)}try{let b={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"185"}`),t.addEventListener("webglcontextlost",it,!1),t.addEventListener("webglcontextrestored",lt,!1),t.addEventListener("webglcontextcreationerror",Gt,!1),N===null){let q="webgl2";if(N=V(q,b),N===null)throw V(q)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(b){throw $e("WebGLRenderer: "+b.message),b}let ae,M,_,O,z,H,ie,j,W,$,ce,Te,G,k,ne,ge,Ae,B,xe,re,ve,be,le;function De(){ae=new Wg(N),ae.init(),ve=new P_(N,ae),M=new Ug(N,ae,e,ve),_=new R_(N,ae),M.reversedDepthBuffer&&h&&_.buffers.depth.setReversed(!0),X=N.createFramebuffer(),Y=N.createFramebuffer(),I=N.createFramebuffer(),O=new Yg(N),z=new p_,H=new C_(N,ae,_,z,M,ve,O),ie=new Gg(C),j=new Kf(N),be=new Fg(N,j),W=new Xg(N,j,O,be),$=new Jg(N,W,j,be,O),B=new Zg(N,M,H),ne=new Og(z),ce=new f_(C,ie,ae,M,be,ne),Te=new F_(C,z),G=new g_,k=new b_(ae),Ae=new Dg(C,ie,_,$,g,l),ge=new A_(C,$,M),le=new N_(N,O,M,_),xe=new Ng(N,ae,O),re=new qg(N,ae,O),O.programs=ce.programs,C.capabilities=M,C.extensions=ae,C.properties=z,C.renderLists=G,C.shadowMap=ge,C.state=_,C.info=O}De(),y!==cn&&(S=new Kg(y,t.width,t.height,o,s,r));let Be=new Jc(C,N);this.xr=Be,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){let b=ae.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){let b=ae.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return fe},this.setPixelRatio=function(b){b!==void 0&&(fe=b,this.setSize(te,_e,!1))},this.getSize=function(b){return b.set(te,_e)},this.setSize=function(b,q,se=!0){if(Be.isPresenting){Je("WebGLRenderer: Can't change size while VR device is presenting.");return}te=b,_e=q,t.width=Math.floor(b*fe),t.height=Math.floor(q*fe),se===!0&&(t.style.width=b+"px",t.style.height=q+"px"),S!==null&&S.setSize(t.width,t.height),this.setViewport(0,0,b,q)},this.getDrawingBufferSize=function(b){return b.set(te*fe,_e*fe).floor()},this.setDrawingBufferSize=function(b,q,se){te=b,_e=q,fe=se,t.width=Math.floor(b*se),t.height=Math.floor(q*se),this.setViewport(0,0,b,q)},this.setEffects=function(b){if(y===cn){$e("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let q=0;q<b.length;q++)if(b[q].isOutputPass===!0){Je("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}S.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(me)},this.getViewport=function(b){return b.copy(Ue)},this.setViewport=function(b,q,se,Q){b.isVector4?Ue.set(b.x,b.y,b.z,b.w):Ue.set(b,q,se,Q),_.viewport(me.copy(Ue).multiplyScalar(fe).round())},this.getScissor=function(b){return b.copy(et)},this.setScissor=function(b,q,se,Q){b.isVector4?et.set(b.x,b.y,b.z,b.w):et.set(b,q,se,Q),_.scissor(de.copy(et).multiplyScalar(fe).round())},this.getScissorTest=function(){return Z},this.setScissorTest=function(b){_.setScissorTest(Z=b)},this.setOpaqueSort=function(b){Ce=b},this.setTransparentSort=function(b){ke=b},this.getClearColor=function(b){return b.copy(Ae.getClearColor())},this.setClearColor=function(){Ae.setClearColor(...arguments)},this.getClearAlpha=function(){return Ae.getClearAlpha()},this.setClearAlpha=function(){Ae.setClearAlpha(...arguments)},this.clear=function(b=!0,q=!0,se=!0){let Q=0;if(b){let ee=!1;if(J!==null){let Ne=J.texture.format;ee=m.has(Ne)}if(ee){let Ne=J.texture.type,He=p.has(Ne),Fe=Ae.getClearColor(),We=Ae.getClearAlpha(),qe=Fe.r,Qe=Fe.g,st=Fe.b;He?(A[0]=qe,A[1]=Qe,A[2]=st,A[3]=We,N.clearBufferuiv(N.COLOR,0,A)):(T[0]=qe,T[1]=Qe,T[2]=st,T[3]=We,N.clearBufferiv(N.COLOR,0,T))}else Q|=N.COLOR_BUFFER_BIT}q&&(Q|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),se&&(Q|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),Q!==0&&N.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),L=b},this.dispose=function(){t.removeEventListener("webglcontextlost",it,!1),t.removeEventListener("webglcontextrestored",lt,!1),t.removeEventListener("webglcontextcreationerror",Gt,!1),Ae.dispose(),G.dispose(),k.dispose(),z.dispose(),ie.dispose(),$.dispose(),be.dispose(),le.dispose(),ce.dispose(),Be.dispose(),Be.removeEventListener("sessionstart",fh),Be.removeEventListener("sessionend",ph),Li.stop()};function it(b){b.preventDefault(),Rc("WebGLRenderer: Context Lost."),D=!0}function lt(){Rc("WebGLRenderer: Context Restored."),D=!1;let b=O.autoReset,q=ge.enabled,se=ge.autoUpdate,Q=ge.needsUpdate,ee=ge.type;De(),O.autoReset=b,ge.enabled=q,ge.autoUpdate=se,ge.needsUpdate=Q,ge.type=ee}function Gt(b){$e("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function ct(b){let q=b.target;q.removeEventListener("dispose",ct),Xt(q)}function Xt(b){Qs(b),z.remove(b)}function Qs(b){let q=z.get(b).programs;q!==void 0&&(q.forEach(function(se){ce.releaseProgram(se)}),b.isShaderMaterial&&ce.releaseShaderCache(b))}this.renderBufferDirect=function(b,q,se,Q,ee,Ne){q===null&&(q=ue);let He=ee.isMesh&&ee.matrixWorld.determinantAffine()<0,Fe=Hd(b,q,se,Q,ee);_.setMaterial(Q,He);let We=se.index,qe=1;if(Q.wireframe===!0){if(We=W.getWireframeAttribute(se),We===void 0)return;qe=2}let Qe=se.drawRange,st=se.attributes.position,Ze=Qe.start*qe,gt=(Qe.start+Qe.count)*qe;Ne!==null&&(Ze=Math.max(Ze,Ne.start*qe),gt=Math.min(gt,(Ne.start+Ne.count)*qe)),We!==null?(Ze=Math.max(Ze,0),gt=Math.min(gt,We.count)):st!=null&&(Ze=Math.max(Ze,0),gt=Math.min(gt,st.count));let Pt=gt-Ze;if(Pt<0||Pt===1/0)return;be.setup(ee,Q,Fe,se,We);let wt,_t=xe;if(We!==null&&(wt=j.get(We),_t=re,_t.setIndex(wt)),ee.isMesh)Q.wireframe===!0?(_.setLineWidth(Q.wireframeLinewidth*Pe()),_t.setMode(N.LINES)):_t.setMode(N.TRIANGLES);else if(ee.isLine){let qt=Q.linewidth;qt===void 0&&(qt=1),_.setLineWidth(qt*Pe()),ee.isLineSegments?_t.setMode(N.LINES):ee.isLineLoop?_t.setMode(N.LINE_LOOP):_t.setMode(N.LINE_STRIP)}else ee.isPoints?_t.setMode(N.POINTS):ee.isSprite&&_t.setMode(N.TRIANGLES);if(ee.isBatchedMesh)if(ae.get("WEBGL_multi_draw"))_t.renderMultiDraw(ee._multiDrawStarts,ee._multiDrawCounts,ee._multiDrawCount);else{let qt=ee._multiDrawStarts,Ve=ee._multiDrawCounts,un=ee._multiDrawCount,ht=We?j.get(We).bytesPerElement:1,xn=z.get(Q).currentProgram.getUniforms();for(let Fn=0;Fn<un;Fn++)xn.setValue(N,"_gl_DrawID",Fn),_t.render(qt[Fn]/ht,Ve[Fn])}else if(ee.isInstancedMesh)_t.renderInstances(Ze,Pt,ee.count);else if(se.isInstancedBufferGeometry){let qt=se._maxInstanceCount!==void 0?se._maxInstanceCount:1/0,Ve=Math.min(se.instanceCount,qt);_t.renderInstances(Ze,Pt,Ve)}else _t.render(Ze,Pt)};function rs(b,q,se){b.transparent===!0&&b.side===St&&b.forceSinglePass===!1?(b.side=tn,b.needsUpdate=!0,sa(b,q,se),b.side=An,b.needsUpdate=!0,sa(b,q,se),b.side=St):sa(b,q,se)}this.compile=function(b,q,se=null){se===null&&(se=b),E=k.get(se),E.init(q),x.push(E),se.traverseVisible(function(ee){ee.isLight&&ee.layers.test(q.layers)&&(E.pushLight(ee),ee.castShadow&&E.pushShadow(ee))}),b!==se&&b.traverseVisible(function(ee){ee.isLight&&ee.layers.test(q.layers)&&(E.pushLight(ee),ee.castShadow&&E.pushShadow(ee))}),E.setupLights();let Q=new Set;return b.traverse(function(ee){if(!(ee.isMesh||ee.isPoints||ee.isLine||ee.isSprite))return;let Ne=ee.material;if(Ne)if(Array.isArray(Ne))for(let He=0;He<Ne.length;He++){let Fe=Ne[He];rs(Fe,se,ee),Q.add(Fe)}else rs(Ne,se,ee),Q.add(Ne)}),E=x.pop(),Q},this.compileAsync=function(b,q,se=null){let Q=this.compile(b,q,se);return new Promise(ee=>{function Ne(){if(Q.forEach(function(He){z.get(He).currentProgram.isReady()&&Q.delete(He)}),Q.size===0){ee(b);return}setTimeout(Ne,10)}ae.get("KHR_parallel_shader_compile")!==null?Ne():setTimeout(Ne,10)})};let as=null;function kd(b){as&&as(b)}function fh(){Li.stop()}function ph(){Li.start()}let Li=new od;Li.setAnimationLoop(kd),typeof self<"u"&&Li.setContext(self),this.setAnimationLoop=function(b){as=b,Be.setAnimationLoop(b),b===null?Li.stop():Li.start()},Be.addEventListener("sessionstart",fh),Be.addEventListener("sessionend",ph),this.render=function(b,q){if(q!==void 0&&q.isCamera!==!0){$e("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;L!==null&&L.renderStart(b,q);let se=Be.enabled===!0&&Be.isPresenting===!0,Q=S!==null&&(J===null||se)&&S.begin(C,J);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),q.parent===null&&q.matrixWorldAutoUpdate===!0&&q.updateMatrixWorld(),Be.enabled===!0&&Be.isPresenting===!0&&(S===null||S.isCompositing()===!1)&&(Be.cameraAutoUpdate===!0&&Be.updateCamera(q),q=Be.getCamera()),b.isScene===!0&&b.onBeforeRender(C,b,q,J),E=k.get(b,x.length),E.init(q),E.state.textureUnits=H.getTextureUnits(),x.push(E),Oe.multiplyMatrices(q.projectionMatrix,q.matrixWorldInverse),ye.setFromProjectionMatrix(Oe,wn,q.reversedDepth),Ee=this.localClippingEnabled,Se=ne.init(this.clippingPlanes,Ee),R=G.get(b,w.length),R.init(),w.push(R),Be.enabled===!0&&Be.isPresenting===!0){let He=C.xr.getDepthSensingMesh();He!==null&&Pl(He,q,-1/0,C.sortObjects)}Pl(b,q,0,C.sortObjects),R.finish(),C.sortObjects===!0&&R.sort(Ce,ke,q.reversedDepth),pe=Be.enabled===!1||Be.isPresenting===!1||Be.hasDepthSensing()===!1,pe&&Ae.addToRenderList(R,b),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Se===!0&&ne.beginShadows();let ee=E.state.shadowsArray;if(ge.render(ee,b,q),Se===!0&&ne.endShadows(),(Q&&S.hasRenderPass())===!1){let He=R.opaque,Fe=R.transmissive;if(E.setupLights(),q.isArrayCamera){let We=q.cameras;if(Fe.length>0)for(let qe=0,Qe=We.length;qe<Qe;qe++){let st=We[qe];gh(He,Fe,b,st)}pe&&Ae.render(b);for(let qe=0,Qe=We.length;qe<Qe;qe++){let st=We[qe];mh(R,b,st,st.viewport)}}else Fe.length>0&&gh(He,Fe,b,q),pe&&Ae.render(b),mh(R,b,q)}J!==null&&F===0&&(H.updateMultisampleRenderTarget(J),H.updateRenderTargetMipmap(J)),Q&&S.end(C),b.isScene===!0&&b.onAfterRender(C,b,q),be.resetDefaultState(),K=-1,oe=null,x.pop(),x.length>0?(E=x[x.length-1],H.setTextureUnits(E.state.textureUnits),Se===!0&&ne.setGlobalState(C.clippingPlanes,E.state.camera)):E=null,w.pop(),w.length>0?R=w[w.length-1]:R=null,L!==null&&L.renderEnd()};function Pl(b,q,se,Q){if(b.visible===!1)return;if(b.layers.test(q.layers)){if(b.isGroup)se=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(q);else if(b.isLightProbeGrid)E.pushLightProbeGrid(b);else if(b.isLight)E.pushLight(b),b.castShadow&&E.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||ye.intersectsSprite(b)){Q&&Me.setFromMatrixPosition(b.matrixWorld).applyMatrix4(Oe);let He=$.update(b),Fe=b.material;Fe.visible&&R.push(b,He,Fe,se,Me.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||ye.intersectsObject(b))){let He=$.update(b),Fe=b.material;if(Q&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Me.copy(b.boundingSphere.center)):(He.boundingSphere===null&&He.computeBoundingSphere(),Me.copy(He.boundingSphere.center)),Me.applyMatrix4(b.matrixWorld).applyMatrix4(Oe)),Array.isArray(Fe)){let We=He.groups;for(let qe=0,Qe=We.length;qe<Qe;qe++){let st=We[qe],Ze=Fe[st.materialIndex];Ze&&Ze.visible&&R.push(b,He,Ze,se,Me.z,st)}}else Fe.visible&&R.push(b,He,Fe,se,Me.z,null)}}let Ne=b.children;for(let He=0,Fe=Ne.length;He<Fe;He++)Pl(Ne[He],q,se,Q)}function mh(b,q,se,Q){let{opaque:ee,transmissive:Ne,transparent:He}=b;E.setupLightsView(se),Se===!0&&ne.setGlobalState(C.clippingPlanes,se),Q&&_.viewport(me.copy(Q)),ee.length>0&&ia(ee,q,se),Ne.length>0&&ia(Ne,q,se),He.length>0&&ia(He,q,se),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function gh(b,q,se,Q){if((se.isScene===!0?se.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[Q.id]===void 0){let Ze=ae.has("EXT_color_buffer_half_float")||ae.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[Q.id]=new Ct(1,1,{generateMipmaps:!0,type:Ze?Ht:cn,minFilter:ln,samples:Math.max(4,M.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:rt.workingColorSpace})}let Ne=E.state.transmissionRenderTarget[Q.id],He=Q.viewport||me;Ne.setSize(He.z*C.transmissionResolutionScale,He.w*C.transmissionResolutionScale);let Fe=C.getRenderTarget(),We=C.getActiveCubeFace(),qe=C.getActiveMipmapLevel();C.setRenderTarget(Ne),C.getClearColor(Ge),Re=C.getClearAlpha(),Re<1&&C.setClearColor(16777215,.5),C.clear(),pe&&Ae.render(se);let Qe=C.toneMapping;C.toneMapping=In;let st=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),E.setupLightsView(Q),Se===!0&&ne.setGlobalState(C.clippingPlanes,Q),ia(b,se,Q),H.updateMultisampleRenderTarget(Ne),H.updateRenderTargetMipmap(Ne),ae.has("WEBGL_multisampled_render_to_texture")===!1){let Ze=!1;for(let gt=0,Pt=q.length;gt<Pt;gt++){let wt=q[gt],{object:_t,geometry:qt,material:Ve,group:un}=wt;if(Ve.side===St&&_t.layers.test(Q.layers)){let ht=Ve.side;Ve.side=tn,Ve.needsUpdate=!0,_h(_t,se,Q,qt,Ve,un),Ve.side=ht,Ve.needsUpdate=!0,Ze=!0}}Ze===!0&&(H.updateMultisampleRenderTarget(Ne),H.updateRenderTargetMipmap(Ne))}C.setRenderTarget(Fe,We,qe),C.setClearColor(Ge,Re),st!==void 0&&(Q.viewport=st),C.toneMapping=Qe}function ia(b,q,se){let Q=q.isScene===!0?q.overrideMaterial:null;for(let ee=0,Ne=b.length;ee<Ne;ee++){let He=b[ee],{object:Fe,geometry:We,group:qe}=He,Qe=He.material;Qe.allowOverride===!0&&Q!==null&&(Qe=Q),Fe.layers.test(se.layers)&&_h(Fe,q,se,We,Qe,qe)}}function _h(b,q,se,Q,ee,Ne){b.onBeforeRender(C,q,se,Q,ee,Ne),b.modelViewMatrix.multiplyMatrices(se.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),ee.onBeforeRender(C,q,se,Q,b,Ne),ee.transparent===!0&&ee.side===St&&ee.forceSinglePass===!1?(ee.side=tn,ee.needsUpdate=!0,C.renderBufferDirect(se,q,Q,ee,b,Ne),ee.side=An,ee.needsUpdate=!0,C.renderBufferDirect(se,q,Q,ee,b,Ne),ee.side=St):C.renderBufferDirect(se,q,Q,ee,b,Ne),b.onAfterRender(C,q,se,Q,ee,Ne)}function sa(b,q,se){q.isScene!==!0&&(q=ue);let Q=z.get(b),ee=E.state.lights,Ne=E.state.shadowsArray,He=ee.state.version,Fe=ce.getParameters(b,ee.state,Ne,q,se,E.state.lightProbeGridArray),We=ce.getProgramCacheKey(Fe),qe=Q.programs;Q.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?q.environment:null,Q.fog=q.fog;let Qe=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;Q.envMap=ie.get(b.envMap||Q.environment,Qe),Q.envMapRotation=Q.environment!==null&&b.envMap===null?q.environmentRotation:b.envMapRotation,qe===void 0&&(b.addEventListener("dispose",ct),qe=new Map,Q.programs=qe);let st=qe.get(We);if(st!==void 0){if(Q.currentProgram===st&&Q.lightsStateVersion===He)return vh(b,Fe),st}else Fe.uniforms=ce.getUniforms(b),L!==null&&b.isNodeMaterial&&L.build(b,se,Fe),b.onBeforeCompile(Fe,C),st=ce.acquireProgram(Fe,We),qe.set(We,st),Q.uniforms=Fe.uniforms;let Ze=Q.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Ze.clippingPlanes=ne.uniform),vh(b,Fe),Q.needsLights=Wd(b),Q.lightsStateVersion=He,Q.needsLights&&(Ze.ambientLightColor.value=ee.state.ambient,Ze.lightProbe.value=ee.state.probe,Ze.directionalLights.value=ee.state.directional,Ze.directionalLightShadows.value=ee.state.directionalShadow,Ze.spotLights.value=ee.state.spot,Ze.spotLightShadows.value=ee.state.spotShadow,Ze.rectAreaLights.value=ee.state.rectArea,Ze.ltc_1.value=ee.state.rectAreaLTC1,Ze.ltc_2.value=ee.state.rectAreaLTC2,Ze.pointLights.value=ee.state.point,Ze.pointLightShadows.value=ee.state.pointShadow,Ze.hemisphereLights.value=ee.state.hemi,Ze.directionalShadowMatrix.value=ee.state.directionalShadowMatrix,Ze.spotLightMatrix.value=ee.state.spotLightMatrix,Ze.spotLightMap.value=ee.state.spotLightMap,Ze.pointShadowMatrix.value=ee.state.pointShadowMatrix),Q.lightProbeGrid=E.state.lightProbeGridArray.length>0,Q.currentProgram=st,Q.uniformsList=null,st}function xh(b){if(b.uniformsList===null){let q=b.currentProgram.getUniforms();b.uniformsList=Gs.seqWithValue(q.seq,b.uniforms)}return b.uniformsList}function vh(b,q){let se=z.get(b);se.outputColorSpace=q.outputColorSpace,se.batching=q.batching,se.batchingColor=q.batchingColor,se.instancing=q.instancing,se.instancingColor=q.instancingColor,se.instancingMorph=q.instancingMorph,se.skinning=q.skinning,se.morphTargets=q.morphTargets,se.morphNormals=q.morphNormals,se.morphColors=q.morphColors,se.morphTargetsCount=q.morphTargetsCount,se.numClippingPlanes=q.numClippingPlanes,se.numIntersection=q.numClipIntersection,se.vertexAlphas=q.vertexAlphas,se.vertexTangents=q.vertexTangents,se.toneMapping=q.toneMapping}function Vd(b,q){if(b.length===0)return null;if(b.length===1)return b[0].texture!==null?b[0]:null;v.setFromMatrixPosition(q.matrixWorld);for(let se=0,Q=b.length;se<Q;se++){let ee=b[se];if(ee.texture!==null&&ee.boundingBox.containsPoint(v))return ee}return null}function Hd(b,q,se,Q,ee){q.isScene!==!0&&(q=ue),H.resetTextureUnits();let Ne=q.fog,He=Q.isMeshStandardMaterial||Q.isMeshLambertMaterial||Q.isMeshPhongMaterial?q.environment:null,Fe=J===null?C.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:rt.workingColorSpace,We=Q.isMeshStandardMaterial||Q.isMeshLambertMaterial&&!Q.envMap||Q.isMeshPhongMaterial&&!Q.envMap,qe=ie.get(Q.envMap||He,We),Qe=Q.vertexColors===!0&&!!se.attributes.color&&se.attributes.color.itemSize===4,st=!!se.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),Ze=!!se.morphAttributes.position,gt=!!se.morphAttributes.normal,Pt=!!se.morphAttributes.color,wt=In;Q.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(wt=C.toneMapping);let _t=se.morphAttributes.position||se.morphAttributes.normal||se.morphAttributes.color,qt=_t!==void 0?_t.length:0,Ve=z.get(Q),un=E.state.lights;if(Se===!0&&(Ee===!0||b!==oe)){let yt=b===oe&&Q.id===K;ne.setState(Q,b,yt)}let ht=!1;Q.version===Ve.__version?(Ve.needsLights&&Ve.lightsStateVersion!==un.state.version||Ve.outputColorSpace!==Fe||ee.isBatchedMesh&&Ve.batching===!1||!ee.isBatchedMesh&&Ve.batching===!0||ee.isBatchedMesh&&Ve.batchingColor===!0&&ee.colorTexture===null||ee.isBatchedMesh&&Ve.batchingColor===!1&&ee.colorTexture!==null||ee.isInstancedMesh&&Ve.instancing===!1||!ee.isInstancedMesh&&Ve.instancing===!0||ee.isSkinnedMesh&&Ve.skinning===!1||!ee.isSkinnedMesh&&Ve.skinning===!0||ee.isInstancedMesh&&Ve.instancingColor===!0&&ee.instanceColor===null||ee.isInstancedMesh&&Ve.instancingColor===!1&&ee.instanceColor!==null||ee.isInstancedMesh&&Ve.instancingMorph===!0&&ee.morphTexture===null||ee.isInstancedMesh&&Ve.instancingMorph===!1&&ee.morphTexture!==null||Ve.envMap!==qe||Q.fog===!0&&Ve.fog!==Ne||Ve.numClippingPlanes!==void 0&&(Ve.numClippingPlanes!==ne.numPlanes||Ve.numIntersection!==ne.numIntersection)||Ve.vertexAlphas!==Qe||Ve.vertexTangents!==st||Ve.morphTargets!==Ze||Ve.morphNormals!==gt||Ve.morphColors!==Pt||Ve.toneMapping!==wt||Ve.morphTargetsCount!==qt||!!Ve.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(ht=!0):(ht=!0,Ve.__version=Q.version);let xn=Ve.currentProgram;ht===!0&&(xn=sa(Q,q,ee),L&&Q.isNodeMaterial&&L.onUpdateProgram(Q,xn,Ve));let Fn=!1,oi=!1,os=!1,xt=xn.getUniforms(),It=Ve.uniforms;if(_.useProgram(xn.program)&&(Fn=!0,oi=!0,os=!0),Q.id!==K&&(K=Q.id,oi=!0),Ve.needsLights){let yt=Vd(E.state.lightProbeGridArray,ee);Ve.lightProbeGrid!==yt&&(Ve.lightProbeGrid=yt,oi=!0)}if(Fn||oe!==b){_.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),xt.setValue(N,"projectionMatrix",b.projectionMatrix),xt.setValue(N,"viewMatrix",b.matrixWorldInverse);let ci=xt.map.cameraPosition;ci!==void 0&&ci.setValue(N,he.setFromMatrixPosition(b.matrixWorld)),M.logarithmicDepthBuffer&&xt.setValue(N,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&xt.setValue(N,"isOrthographic",b.isOrthographicCamera===!0),oe!==b&&(oe=b,oi=!0,os=!0)}if(Ve.needsLights&&(un.state.directionalShadowMap.length>0&&xt.setValue(N,"directionalShadowMap",un.state.directionalShadowMap,H),un.state.spotShadowMap.length>0&&xt.setValue(N,"spotShadowMap",un.state.spotShadowMap,H),un.state.pointShadowMap.length>0&&xt.setValue(N,"pointShadowMap",un.state.pointShadowMap,H)),ee.isSkinnedMesh){xt.setOptional(N,ee,"bindMatrix"),xt.setOptional(N,ee,"bindMatrixInverse");let yt=ee.skeleton;yt&&(yt.boneTexture===null&&yt.computeBoneTexture(),xt.setValue(N,"boneTexture",yt.boneTexture,H))}ee.isBatchedMesh&&(xt.setOptional(N,ee,"batchingTexture"),xt.setValue(N,"batchingTexture",ee._matricesTexture,H),xt.setOptional(N,ee,"batchingIdTexture"),xt.setValue(N,"batchingIdTexture",ee._indirectTexture,H),xt.setOptional(N,ee,"batchingColorTexture"),ee._colorsTexture!==null&&xt.setValue(N,"batchingColorTexture",ee._colorsTexture,H));let li=se.morphAttributes;if((li.position!==void 0||li.normal!==void 0||li.color!==void 0)&&B.update(ee,se,xn),(oi||Ve.receiveShadow!==ee.receiveShadow)&&(Ve.receiveShadow=ee.receiveShadow,xt.setValue(N,"receiveShadow",ee.receiveShadow)),(Q.isMeshStandardMaterial||Q.isMeshLambertMaterial||Q.isMeshPhongMaterial)&&Q.envMap===null&&q.environment!==null&&(It.envMapIntensity.value=q.environmentIntensity),It.dfgLUT!==void 0&&(It.dfgLUT.value=O_()),oi){if(xt.setValue(N,"toneMappingExposure",C.toneMappingExposure),Ve.needsLights&&Gd(It,os),Ne&&Q.fog===!0&&Te.refreshFogUniforms(It,Ne),Te.refreshMaterialUniforms(It,Q,fe,_e,E.state.transmissionRenderTarget[b.id]),Ve.needsLights&&Ve.lightProbeGrid){let yt=Ve.lightProbeGrid;It.probesSH.value=yt.texture,It.probesMin.value.copy(yt.boundingBox.min),It.probesMax.value.copy(yt.boundingBox.max),It.probesResolution.value.copy(yt.resolution)}Gs.upload(N,xh(Ve),It,H)}if(Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(Gs.upload(N,xh(Ve),It,H),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&xt.setValue(N,"center",ee.center),xt.setValue(N,"modelViewMatrix",ee.modelViewMatrix),xt.setValue(N,"normalMatrix",ee.normalMatrix),xt.setValue(N,"modelMatrix",ee.matrixWorld),Q.uniformsGroups!==void 0){let yt=Q.uniformsGroups;for(let ci=0,ls=yt.length;ci<ls;ci++){let yh=yt[ci];le.update(yh,xn),le.bind(yh,xn)}}return xn}function Gd(b,q){b.ambientLightColor.needsUpdate=q,b.lightProbe.needsUpdate=q,b.directionalLights.needsUpdate=q,b.directionalLightShadows.needsUpdate=q,b.pointLights.needsUpdate=q,b.pointLightShadows.needsUpdate=q,b.spotLights.needsUpdate=q,b.spotLightShadows.needsUpdate=q,b.rectAreaLights.needsUpdate=q,b.hemisphereLights.needsUpdate=q}function Wd(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return F},this.getRenderTarget=function(){return J},this.setRenderTargetTextures=function(b,q,se){let Q=z.get(b);Q.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,Q.__autoAllocateDepthBuffer===!1&&(Q.__useRenderToTexture=!1),z.get(b.texture).__webglTexture=q,z.get(b.depthTexture).__webglTexture=Q.__autoAllocateDepthBuffer?void 0:se,Q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,q){let se=z.get(b);se.__webglFramebuffer=q,se.__useDefaultFramebuffer=q===void 0},this.setRenderTarget=function(b,q=0,se=0){J=b,P=q,F=se;let Q=null,ee=!1,Ne=!1;if(b){let Fe=z.get(b);if(Fe.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(N.FRAMEBUFFER,Fe.__webglFramebuffer),me.copy(b.viewport),de.copy(b.scissor),we=b.scissorTest,_.viewport(me),_.scissor(de),_.setScissorTest(we),K=-1;return}else if(Fe.__webglFramebuffer===void 0)H.setupRenderTarget(b);else if(Fe.__hasExternalTextures)H.rebindTextures(b,z.get(b.texture).__webglTexture,z.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){let Qe=b.depthTexture;if(Fe.__boundDepthTexture!==Qe){if(Qe!==null&&z.has(Qe)&&(b.width!==Qe.image.width||b.height!==Qe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");H.setupDepthRenderbuffer(b)}}let We=b.texture;(We.isData3DTexture||We.isDataArrayTexture||We.isCompressedArrayTexture)&&(Ne=!0);let qe=z.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(qe[q])?Q=qe[q][se]:Q=qe[q],ee=!0):b.samples>0&&H.useMultisampledRTT(b)===!1?Q=z.get(b).__webglMultisampledFramebuffer:Array.isArray(qe)?Q=qe[se]:Q=qe,me.copy(b.viewport),de.copy(b.scissor),we=b.scissorTest}else me.copy(Ue).multiplyScalar(fe).floor(),de.copy(et).multiplyScalar(fe).floor(),we=Z;if(se!==0&&(Q=X),_.bindFramebuffer(N.FRAMEBUFFER,Q)&&_.drawBuffers(b,Q),_.viewport(me),_.scissor(de),_.setScissorTest(we),ee){let Fe=z.get(b.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+q,Fe.__webglTexture,se)}else if(Ne){let Fe=q;for(let We=0;We<b.textures.length;We++){let qe=z.get(b.textures[We]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+We,qe.__webglTexture,se,Fe)}}else if(b!==null&&se!==0){let Fe=z.get(b.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Fe.__webglTexture,se)}K=-1},this.readRenderTargetPixels=function(b,q,se,Q,ee,Ne,He,Fe=0){if(!(b&&b.isWebGLRenderTarget)){$e("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let We=z.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&He!==void 0&&(We=We[He]),We){_.bindFramebuffer(N.FRAMEBUFFER,We);try{let qe=b.textures[Fe],Qe=qe.format,st=qe.type;if(b.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Fe),!M.textureFormatReadable(Qe)){$e("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!M.textureTypeReadable(st)){$e("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}q>=0&&q<=b.width-Q&&se>=0&&se<=b.height-ee&&N.readPixels(q,se,Q,ee,ve.convert(Qe),ve.convert(st),Ne)}finally{let qe=J!==null?z.get(J).__webglFramebuffer:null;_.bindFramebuffer(N.FRAMEBUFFER,qe)}}},this.readRenderTargetPixelsAsync=async function(b,q,se,Q,ee,Ne,He,Fe=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let We=z.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&He!==void 0&&(We=We[He]),We)if(q>=0&&q<=b.width-Q&&se>=0&&se<=b.height-ee){_.bindFramebuffer(N.FRAMEBUFFER,We);let qe=b.textures[Fe],Qe=qe.format,st=qe.type;if(b.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Fe),!M.textureFormatReadable(Qe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!M.textureTypeReadable(st))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Ze=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,Ze),N.bufferData(N.PIXEL_PACK_BUFFER,Ne.byteLength,N.STREAM_READ),N.readPixels(q,se,Q,ee,ve.convert(Qe),ve.convert(st),0);let gt=J!==null?z.get(J).__webglFramebuffer:null;_.bindFramebuffer(N.FRAMEBUFFER,gt);let Pt=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await Nu(N,Pt,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,Ze),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,Ne),N.deleteBuffer(Ze),N.deleteSync(Pt),Ne}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,q=null,se=0){let Q=Math.pow(2,-se),ee=Math.floor(b.image.width*Q),Ne=Math.floor(b.image.height*Q),He=q!==null?q.x:0,Fe=q!==null?q.y:0;H.setTexture2D(b,0),N.copyTexSubImage2D(N.TEXTURE_2D,se,0,0,He,Fe,ee,Ne),_.unbindTexture()},this.copyTextureToTexture=function(b,q,se=null,Q=null,ee=0,Ne=0){let He,Fe,We,qe,Qe,st,Ze,gt,Pt,wt=b.isCompressedTexture?b.mipmaps[Ne]:b.image;if(se!==null)He=se.max.x-se.min.x,Fe=se.max.y-se.min.y,We=se.isBox3?se.max.z-se.min.z:1,qe=se.min.x,Qe=se.min.y,st=se.isBox3?se.min.z:0;else{let It=Math.pow(2,-ee);He=Math.floor(wt.width*It),Fe=Math.floor(wt.height*It),b.isDataArrayTexture?We=wt.depth:b.isData3DTexture?We=Math.floor(wt.depth*It):We=1,qe=0,Qe=0,st=0}Q!==null?(Ze=Q.x,gt=Q.y,Pt=Q.z):(Ze=0,gt=0,Pt=0);let _t=ve.convert(q.format),qt=ve.convert(q.type),Ve;q.isData3DTexture?(H.setTexture3D(q,0),Ve=N.TEXTURE_3D):q.isDataArrayTexture||q.isCompressedArrayTexture?(H.setTexture2DArray(q,0),Ve=N.TEXTURE_2D_ARRAY):(H.setTexture2D(q,0),Ve=N.TEXTURE_2D),_.activeTexture(N.TEXTURE0),_.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,q.flipY),_.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),_.pixelStorei(N.UNPACK_ALIGNMENT,q.unpackAlignment);let un=_.getParameter(N.UNPACK_ROW_LENGTH),ht=_.getParameter(N.UNPACK_IMAGE_HEIGHT),xn=_.getParameter(N.UNPACK_SKIP_PIXELS),Fn=_.getParameter(N.UNPACK_SKIP_ROWS),oi=_.getParameter(N.UNPACK_SKIP_IMAGES);_.pixelStorei(N.UNPACK_ROW_LENGTH,wt.width),_.pixelStorei(N.UNPACK_IMAGE_HEIGHT,wt.height),_.pixelStorei(N.UNPACK_SKIP_PIXELS,qe),_.pixelStorei(N.UNPACK_SKIP_ROWS,Qe),_.pixelStorei(N.UNPACK_SKIP_IMAGES,st);let os=b.isDataArrayTexture||b.isData3DTexture,xt=q.isDataArrayTexture||q.isData3DTexture;if(b.isDepthTexture){let It=z.get(b),li=z.get(q),yt=z.get(It.__renderTarget),ci=z.get(li.__renderTarget);_.bindFramebuffer(N.READ_FRAMEBUFFER,yt.__webglFramebuffer),_.bindFramebuffer(N.DRAW_FRAMEBUFFER,ci.__webglFramebuffer);for(let ls=0;ls<We;ls++)os&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,z.get(b).__webglTexture,ee,st+ls),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,z.get(q).__webglTexture,Ne,Pt+ls)),N.blitFramebuffer(qe,Qe,He,Fe,Ze,gt,He,Fe,N.DEPTH_BUFFER_BIT,N.NEAREST);_.bindFramebuffer(N.READ_FRAMEBUFFER,null),_.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(ee!==0||b.isRenderTargetTexture||z.has(b)){let It=z.get(b),li=z.get(q);_.bindFramebuffer(N.READ_FRAMEBUFFER,Y),_.bindFramebuffer(N.DRAW_FRAMEBUFFER,I);for(let yt=0;yt<We;yt++)os?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,It.__webglTexture,ee,st+yt):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,It.__webglTexture,ee),xt?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,li.__webglTexture,Ne,Pt+yt):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,li.__webglTexture,Ne),ee!==0?N.blitFramebuffer(qe,Qe,He,Fe,Ze,gt,He,Fe,N.COLOR_BUFFER_BIT,N.NEAREST):xt?N.copyTexSubImage3D(Ve,Ne,Ze,gt,Pt+yt,qe,Qe,He,Fe):N.copyTexSubImage2D(Ve,Ne,Ze,gt,qe,Qe,He,Fe);_.bindFramebuffer(N.READ_FRAMEBUFFER,null),_.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else xt?b.isDataTexture||b.isData3DTexture?N.texSubImage3D(Ve,Ne,Ze,gt,Pt,He,Fe,We,_t,qt,wt.data):q.isCompressedArrayTexture?N.compressedTexSubImage3D(Ve,Ne,Ze,gt,Pt,He,Fe,We,_t,wt.data):N.texSubImage3D(Ve,Ne,Ze,gt,Pt,He,Fe,We,_t,qt,wt):b.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,Ne,Ze,gt,He,Fe,_t,qt,wt.data):b.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,Ne,Ze,gt,wt.width,wt.height,_t,wt.data):N.texSubImage2D(N.TEXTURE_2D,Ne,Ze,gt,He,Fe,_t,qt,wt);_.pixelStorei(N.UNPACK_ROW_LENGTH,un),_.pixelStorei(N.UNPACK_IMAGE_HEIGHT,ht),_.pixelStorei(N.UNPACK_SKIP_PIXELS,xn),_.pixelStorei(N.UNPACK_SKIP_ROWS,Fn),_.pixelStorei(N.UNPACK_SKIP_IMAGES,oi),Ne===0&&q.generateMipmaps&&N.generateMipmap(Ve),_.unbindTexture()},this.initRenderTarget=function(b){z.get(b).__webglFramebuffer===void 0&&H.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?H.setTextureCube(b,0):b.isData3DTexture?H.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?H.setTexture2DArray(b,0):H.setTexture2D(b,0),_.unbindTexture()},this.resetState=function(){P=0,F=0,J=null,_.reset(),be.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return wn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=rt._getDrawingBufferColorSpace(e),t.unpackColorSpace=rt._getUnpackColorSpace()}};var Xs=class i extends Ke{constructor(e,t={}){super(e),this.isReflector=!0,this.type="Reflector",this.forceUpdate=!1,this._reflectionCameras=new WeakMap;let n=this,s=t.color!==void 0?new ze(t.color):new ze(8355711),r=t.textureWidth||512,a=t.textureHeight||512,o=t.clipBias||0,l=t.shader||i.ReflectorShader,c=t.multisample!==void 0?t.multisample:4,u=new Jt,f=new U,h=new U,d=new U,g=new ut,y=new U(0,0,-1),m=new ft,p=new U,A=new U,T=new ft,v=new ut,R=new Ct(r,a,{samples:c,type:Ht}),E=new mt({name:l.name!==void 0?l.name:"unspecified",uniforms:gn.clone(l.uniforms),fragmentShader:l.fragmentShader,vertexShader:l.vertexShader});E.uniforms.tDiffuse.value=R.texture,E.uniforms.color.value=s,E.uniforms.textureMatrix.value=v,this.material=E,this.onBeforeRender=function(w,x,S){let C=this.getReflectionCamera(S);if(h.setFromMatrixPosition(n.matrixWorld),d.setFromMatrixPosition(S.matrixWorld),g.extractRotation(n.matrixWorld),f.set(0,0,1),f.applyMatrix4(g),p.subVectors(h,d),p.dot(f)>0===!0&&this.forceUpdate===!1)return;p.reflect(f).negate(),p.add(h),g.extractRotation(S.matrixWorld),y.set(0,0,-1),y.applyMatrix4(g),y.add(d),A.subVectors(h,y),A.reflect(f).negate(),A.add(h),C.position.copy(p),C.up.set(0,1,0),C.up.applyMatrix4(g),C.up.reflect(f),C.lookAt(A),C.far=S.far,C.updateMatrixWorld(),C.projectionMatrix.copy(S.projectionMatrix),v.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),v.multiply(C.projectionMatrix),v.multiply(C.matrixWorldInverse),v.multiply(n.matrixWorld),u.setFromNormalAndCoplanarPoint(f,h),u.applyMatrix4(C.matrixWorldInverse),m.set(u.normal.x,u.normal.y,u.normal.z,u.constant);let L=C.projectionMatrix;C.isOrthographicCamera?(T.x=(Math.sign(m.x)+L.elements[8])/L.elements[0],T.y=(Math.sign(m.y)+L.elements[9])/L.elements[5],T.z=-S.far,T.w=1):(T.x=(Math.sign(m.x)+L.elements[8])/L.elements[0],T.y=(Math.sign(m.y)+L.elements[9])/L.elements[5],T.z=-1,T.w=(1+L.elements[10])/L.elements[14]),m.multiplyScalar(2/m.dot(T)),L.elements[2]=m.x,L.elements[6]=m.y,C.isOrthographicCamera?(L.elements[10]=m.z-o,L.elements[14]=m.w-1):(L.elements[10]=m.z+1-o,L.elements[14]=m.w),n.visible=!1;let X=w.getRenderTarget(),Y=w.xr.enabled,I=w.shadowMap.autoUpdate;w.xr.enabled=!1,w.shadowMap.autoUpdate=!1,w.setRenderTarget(R),w.state.buffers.depth.setMask(!0),w.autoClear===!1&&w.clear(),w.render(x,C),w.xr.enabled=Y,w.shadowMap.autoUpdate=I,w.setRenderTarget(X);let P=S.viewport;P!==void 0&&w.state.viewport(P),n.visible=!0,this.forceUpdate=!1},this.getRenderTarget=function(){return R},this.dispose=function(){R.dispose(),n.material.dispose()},this.getReflectionCamera=function(w){let x=this._reflectionCameras.get(w);return x===void 0&&(x=w.clone(),this._reflectionCameras.set(w,x)),x}}};Xs.ReflectorShader={name:"ReflectorShader",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`
		uniform mat4 textureMatrix;
		varying vec4 vUv;

		#include <common>
		#include <logdepthbuf_pars_vertex>

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			#include <logdepthbuf_vertex>

		}`,fragmentShader:`
		uniform vec3 color;
		uniform sampler2D tDiffuse;
		varying vec4 vUv;

		#include <logdepthbuf_pars_fragment>

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			#include <logdepthbuf_fragment>

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};var pd={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var Dn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},B_=new Ei(-1,1,1,-1,0,1),$c=class extends at{constructor(){super(),this.setAttribute("position",new Ye([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Ye([0,2,0,0,2,0],2))}},z_=new $c,qs=class{constructor(e){this._mesh=new Ke(z_,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,B_)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var Ys=class extends Dn{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof mt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=gn.clone(e.uniforms),this.material=new mt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new qs(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var $r=class extends Dn{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let s=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},dl=class extends Dn{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var fl=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new Le);this._width=n.width,this._height=n.height,t=new Ct(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Ht}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Ys(pd),this.copyPass.material.blending=bn,this.timer=new Ir}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let s=0,r=this.passes.length;s<r;s++){let a=this.passes[s];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){let o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}$r!==void 0&&(a instanceof $r?n=!0:a instanceof dl&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new Le);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var pl=class extends Dn{constructor(e,t,n=null,s=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new ze}render(e,t,n){let s=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=s}};var Kr={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var ml=class extends Dn{constructor(){super(),this.isOutputPass=!0,this.uniforms=gn.clone(Kr.uniforms),this.material=new Ls({name:Kr.name,uniforms:this.uniforms,vertexShader:Kr.vertexShader,fragmentShader:Kr.fragmentShader}),this._fsQuad=new qs(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},rt.getTransfer(this._outputColorSpace)===dt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Lr?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Dr?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Fr?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===$i?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Ur?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Or?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Nr&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var _l=class{constructor({paths:e=[],groups:t=[],pinnedStart:n=[],pinnedEnd:s=[],fixedDt:r=1/120,iterations:a=6,maxSubSteps:o=12,damping:l=2.6,shapeStiffness:c=4.5,stretchCompliance:u=5e-8,bendCompliance:f=.0016,couplingCompliance:h=.0018,grabCompliance:d=2e-5,maxGrabDistance:g=2.8,maxGrabSpeed:y=14,maxNodeDisplacement:m=10,gravity:p=[0,0,0],floor:A=-1/0}={}){if(!Array.isArray(e)||!e.length)throw new TypeError("FiberPhysics needs at least one path.");if(!(r>0&&r<=1/30))throw new RangeError("fixedDt must be positive and at most 1/30.");this.fixedDt=r,this.iterations=Math.max(2,Math.min(20,Math.floor(a))),this.maxSubSteps=Math.max(1,Math.min(60,Math.floor(o))),this.damping=Math.max(0,l),this.shapeStiffness=Math.max(0,c),this.stretchCompliance=Math.max(0,u),this.bendCompliance=Math.max(0,f),this.couplingCompliance=Math.max(0,h),this.grabCompliance=Math.max(0,d),this.maxGrabDistance=Math.max(.01,g),this.maxGrabSpeed=Math.max(.01,y),this.maxNodeDisplacement=Math.max(this.maxGrabDistance+.5,m),this.gravity=gl(p),this.floor=A,this.offsets=new Uint32Array(e.length),this.counts=new Uint16Array(e.length);let T=[],v=[];this.ropes=[];for(let S=0;S<e.length;S++){let C=e[S]?.positions||e[S],D=ArrayBuffer.isView(C)||Array.isArray(C)&&typeof C[0]=="number",L=D?C.length/3:C.length;if(!Number.isInteger(L)||L<3||L>65535)throw new RangeError(`Path ${S} needs 3\u201365535 xyz points.`);let X=T.length/3;this.offsets[S]=X,this.counts[S]=L;let Y=n[S]??e[S]?.pinnedStart??!0,I=s[S]??e[S]?.pinnedEnd??!0;for(let P=0;P<L;P++){let F=D?[C[P*3],C[P*3+1],C[P*3+2]]:gl(C[P]);if(!F.every(Number.isFinite))throw new TypeError(`Path ${S}, node ${P} is not finite.`);T.push(...F),v.push(P===0&&Y||P===L-1&&I?0:1)}this.ropes.push({offset:X,count:L,startPinned:Y,endPinned:I})}this.positions=Float32Array.from(T),this.restPositions=Float32Array.from(T),this.previous=Float32Array.from(T),this.inverseMass=Float32Array.from(v),this.nodeCount=v.length,this.ropeCount=e.length;let R=[],E=[],w=[];this.arcLengths=this.ropes.map(({offset:S,count:C})=>{let D=new Float32Array(C);for(let L=0;L<C-1;L++){let X=S+L,Y=X+1,I=md(this.positions,X,Y);if(I<1e-6)throw new RangeError("Consecutive fiber nodes must be distinct.");R.push(X,Y,I),D[L+1]=D[L]+I,L<C-2&&E.push(X,Y+1,md(this.positions,X,Y+1))}return D});let x=new Map;for(let S=0;S<this.ropes.length;S++){let C=t[S];if(!(C==null||C<0)){if(x.has(C)){let D=this.ropes[x.get(C)],L=this.ropes[S],X=Math.min(D.count,L.count);for(let Y=1;Y<X-1;Y++){let I=D.offset+Math.round(Y*(D.count-1)/(X-1)),P=L.offset+Math.round(Y*(L.count-1)/(X-1));w.push(I,P)}}x.set(C,S)}}this.stretch=Float64Array.from(R),this.bends=Float64Array.from(E),this.couples=Uint32Array.from(w),this._stretchLambda=new Float32Array(R.length/3),this._bendLambda=new Float32Array(E.length/3),this._coupleLambda=new Float32Array(w.length/2*3),this._grabLambda=new Float64Array(3),this._grab=null,this._accumulator=0,this.elapsed=0,this.energy=0,this.maxDisplacement=0,this._state={energy:0,maxDisplacement:0,grabbed:!1,steps:0}}get grab(){return this._grab}getPositions(){return this.positions}getNode(e,t,n={}){let s=this._index(e,t)*3;return n.x=this.positions[s],n.y=this.positions[s+1],n.z=this.positions[s+2],n}setGrab(e,t,n){let s=this._index(e,t);if(!this.inverseMass[s])return!1;let r=n===void 0?this.getNode(e,t):n,a=gl(r);if(!a.every(Number.isFinite))return!1;let o=s*3;return this._grab={ropeIndex:e,nodeIndex:t,node:s,target:[this.positions[o],this.positions[o+1],this.positions[o+2]],desired:a},this._clampGrabTarget(),!0}moveGrab(e){if(!this._grab)return!1;let t=gl(e);return t.every(Number.isFinite)?(this._grab.desired=t,this._clampGrabTarget(),!0):!1}release(){let e=this._grab;return this._grab=null,e}reset(){this.positions.set(this.restPositions),this.previous.set(this.restPositions),this._grab=null,this._accumulator=0,this.elapsed=0,this.energy=0,this.maxDisplacement=0,Object.assign(this._state,{energy:0,maxDisplacement:0,grabbed:!1,steps:0})}step(e){if(!Number.isFinite(e)||e<=0)return this._state;let t=this.fixedDt;this._accumulator+=Math.min(e,t*this.maxSubSteps);let n=Math.min(this.maxSubSteps,Math.floor((this._accumulator+1e-10)/t));for(let s=0;s<n;s++)this._substep(t);return this._accumulator=Math.max(0,this._accumulator-n*t),this._state.energy=this.energy,this._state.maxDisplacement=this.maxDisplacement,this._state.grabbed=this._grab!==null,this._state.steps=n,this._state}_index(e,t){if(!Number.isInteger(e)||!Number.isInteger(t)||e<0||e>=this.ropeCount||t<0||t>=this.counts[e])throw new RangeError("Fiber node index is outside its rope.");return this.offsets[e]+t}_clampGrabTarget(){let e=this._grab,t=e.node*3,n=this.restPositions;Kc(e.desired,n[t],n[t+1],n[t+2],this.maxGrabDistance);let s=this.ropes[e.ropeIndex],r=this.arcLengths[e.ropeIndex];for(let a=0;a<3;a++){if(s.startPinned){let o=s.offset*3;Kc(e.desired,n[o],n[o+1],n[o+2],r[e.nodeIndex]*1.01)}if(s.endPinned){let o=(s.offset+s.count-1)*3;Kc(e.desired,n[o],n[o+1],n[o+2],(r[r.length-1]-r[e.nodeIndex])*1.01)}}}_substep(e){let t=this.positions,n=this.restPositions,s=this.previous,r=this.inverseMass,a=Math.exp(-this.damping*e),o=e*e;for(let f=0;f<this.nodeCount;f++){let h=f*3;if(!r[f]){for(let d=0;d<3;d++)s[h+d]=t[h+d]=n[h+d];continue}for(let d=0;d<3;d++){let g=h+d,y=t[g];t[g]+=(y-s[g])*a+(this.gravity[d]+(n[g]-y)*this.shapeStiffness)*o,s[g]=y}}if(this._grab){let{target:f,desired:h}=this._grab,d=h[0]-f[0],g=h[1]-f[1],y=h[2]-f[2],m=Math.hypot(d,g,y),p=m>1e-9?Math.min(1,this.maxGrabSpeed*e/m):0;f[0]+=d*p,f[1]+=g*p,f[2]+=y*p}this._stretchLambda.fill(0),this._bendLambda.fill(0),this._coupleLambda.fill(0),this._grabLambda.fill(0);for(let f=0;f<this.iterations;f++)this._solveGrab(o),this._solveDistances(this.bends,this._bendLambda,this.bendCompliance/o,f&1),this._solveCoupling(o),this._solveDistances(this.stretch,this._stretchLambda,this.stretchCompliance/o,f&1);let l=0,c=0;for(let f=0;f<this.nodeCount;f++){if(!r[f])continue;let h=f*3,d=t[h]-n[h],g=t[h+1]-n[h+1],y=t[h+2]-n[h+2],m=d*d+g*g+y*y;if(!Number.isFinite(m)){for(let p=0;p<3;p++)t[h+p]=s[h+p]=n[h+p];continue}if(m>this.maxNodeDisplacement*this.maxNodeDisplacement){let p=this.maxNodeDisplacement/Math.sqrt(m);t[h]=n[h]+d*p,t[h+1]=n[h+1]+g*p,t[h+2]=n[h+2]+y*p;for(let A=0;A<3;A++)s[h+A]=t[h+A];m=this.maxNodeDisplacement*this.maxNodeDisplacement}t[h+1]<this.floor&&(t[h+1]=this.floor,s[h+1]=Math.min(s[h+1],this.floor),s[h]+=(t[h]-s[h])*.3,s[h+2]+=(t[h+2]-s[h+2])*.3),c=Math.max(c,m);for(let p=0;p<3;p++){let A=(t[h+p]-s[h+p])/e;l+=A*A}}this.maxDisplacement=Math.sqrt(c);let u=Math.min(1,Math.sqrt(l/Math.max(1,this.nodeCount))*1.4);this.energy+=(u-this.energy)*(1-Math.exp(-e*14)),this.elapsed+=e}_solveDistances(e,t,n,s){let r=this.positions,a=this.inverseMass,o=e.length/3;for(let l=0;l<o;l++){let c=s?o-1-l:l,u=c*3,f=e[u],h=e[u+1],d=f*3,g=h*3,y=a[f],m=a[h],p=y+m;if(!p)continue;let A=r[d]-r[g],T=r[d+1]-r[g+1],v=r[d+2]-r[g+2],R=Math.sqrt(A*A+T*T+v*v);if(R<1e-9)continue;let E=(e[u+2]-R-n*t[c])/(p+n);t[c]+=E;let w=E/R;r[d]+=A*w*y,r[d+1]+=T*w*y,r[d+2]+=v*w*y,r[g]-=A*w*m,r[g+1]-=T*w*m,r[g+2]-=v*w*m}}_solveCoupling(e){let t=this.positions,n=this.restPositions,s=this.inverseMass,r=this.couplingCompliance/e;for(let a=0;a<this.couples.length;a+=2){let o=this.couples[a],l=this.couples[a+1],c=o*3,u=l*3,f=s[o],h=s[l],d=f+h;if(d)for(let g=0;g<3;g++){let y=a/2*3+g,p=(-(t[c+g]-n[c+g]-(t[u+g]-n[u+g]))-r*this._coupleLambda[y])/(d+r);this._coupleLambda[y]+=p,t[c+g]+=p*f,t[u+g]-=p*h}}}_solveGrab(e){if(!this._grab)return;let{node:t,target:n}=this._grab,s=t*3,r=this.grabCompliance/e;for(let a=0;a<3;a++){let o=(n[a]-this.positions[s+a]-r*this._grabLambda[a])/(1+r);this._grabLambda[a]+=o,this.positions[s+a]+=o}}};function gl(i){return i&&Number.isFinite(i.x)&&Number.isFinite(i.y)&&Number.isFinite(i.z)?[i.x,i.y,i.z]:Array.isArray(i)||ArrayBuffer.isView(i)?[i[0],i[1],i[2]]:[NaN,NaN,NaN]}function md(i,e,t){return Math.hypot(i[e*3]-i[t*3],i[e*3+1]-i[t*3+1],i[e*3+2]-i[t*3+2])}function Kc(i,e,t,n,s){let r=i[0]-e,a=i[1]-t,o=i[2]-n,l=Math.hypot(r,a,o);if(l>s){let c=s/l;i[0]=e+r*c,i[1]=t+a*c,i[2]=n+o*c}}function xl(i=481){return()=>{let e=i+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var Wt=(i,e,t)=>new U(i,e,t),ni=Math.PI*2,ii=49,Zs=(i,e,t)=>{let n=sn.clamp((t-i)/(e-i),0,1);return n*n*(3-2*n)};function gd({quality:i=1}={}){let e=xl(4918),t=new At;t.name="Continuous linen, with unfinished selvedges";let n=[],s=[],r=[],a=[],o=[],l=[],c=[],u=[],f=[],h=sn.clamp(i,.5,1.35),d=[{p:[[-20,22,-5],[-14,16,-1],[-11,11,2],[-10.8,7.5,3],[-13,3.4,5],[-16,.55,7]],n:580,w:4.8,g:7,depth:1.1,fold:1.2},{p:[[-25,16,-6],[-17,14,-3],[-11,10,1],[-7,7.1,2],[-3.6,5.9,-3],[-1.65,6.6,-7]],n:390,w:2.8,g:6,depth:.72,fold:1.7},{p:[[19,24,-9],[15,17,-7],[13.5,11,-2],[10.5,7,2.5],[9.8,3.3,5],[12,.75,6]],n:500,w:3.6,g:7,depth:1.15,fold:1.1},{p:[[1.65,2.8,-7],[5.5,3.9,-3],[9.5,6.6,1],[15.5,10.2,0],[23,15,-5]],n:380,w:2.65,g:6,depth:.7,fold:1.6},{p:[[-25,20,-15],[-13,15.4,-12],[-2,13.8,-11],[10,16.3,-13],[23,20,-16]],n:145,w:1.5,g:3,depth:.45,fold:.6},{p:[[-23,3.2,5],[-15,1.05,7],[-10,1.3,6],[-6,2.1,1],[-1.7,2.65,-6.8]],n:185,w:1.7,g:3,depth:.72,fold:.9},{p:[[-7,9,1],[-7.8,6.1,4],[-7,3.6,7],[-4.4,.85,9],[1,.32,8]],n:115,w:1.1,g:3,depth:.44,fold:1.2}];function g(V,ae,M=!1){let _=new Pn(V,!1,"centripetal"),O=_.getSpacedPoints(ii-1),z=n.length;return n.push(O),s.push(ae),r.push(!0),a.push(!M),o.push(_),l.push(_.getLength()),c.push(_.computeFrenetFrames(128,!1)),z}function y(V){let ae=new U().crossVectors(V,Math.abs(V.y)>.91?Wt(1,0,0):Wt(0,1,0)).normalize();return[ae,new U().crossVectors(V,ae).normalize()]}d.forEach((V,ae)=>{let M=[];for(let O=0;O<V.g;O++){let z=O/(V.g-1)-.5,H=V.p.map((ie,j)=>{let W=j/(V.p.length-1),$=Math.sin(W*7.8+ae*.72)*V.fold;return Wt(ie[0]+z*V.w*(.45+.35*Math.sin(W*5.2+ae)),ie[1]+z*V.w*(.85+.28*Math.sin(W*8+ae)),ie[2]+Math.sin(z*4+W*5+ae)*V.depth+z*$)});M.push(g(H,ae,ae===6))}f.push(M);let _=Math.round(V.n*h);for(let O=0;O<_;O++){let z=O/(_-1)*(M.length-1),H=Math.min(M.length-2,Math.floor(z)),ie=z-H,j=M[H],W=M[H+1],$=e()<.14,ce=$?e()*.68:e()*(ae===1||ae===3?.17:.09),Te=$?Math.min(1,ce+.12+e()*.34):.72+e()*.28;u.push({guide:j,next:W,between:ie,from:ce,to:Te,radius:(e()<.18?.0075:.0024)+e()*.004,phase:e()*ni,wander:.035+e()*.055,depth:(e()-.5)*.31,shade:e(),family:ae})}});for(let V=0;V<9;V++){let ae=-17.5+V*4.3,M=Math.abs(ae)<2?7.05:.55+e()*2.3,_=g([Wt(ae,21,-10.6),Wt(ae+.05,14,-10.55),Wt(ae-.07,8.5,-10.3),Wt(ae,M,-9.9)],20+V,V%3===1);for(let O=0;O<Math.round(30*h);O++)u.push({guide:_,next:_,between:0,from:e()*.13,to:.76+e()*.24,radius:.0017+e()*.0022,phase:e()*ni,wander:.007,offset:(O/29-.5)*4,shade:.3+e()*.6,family:20+V})}for(let V=0;V<10;V++){let ae=V%2?0:2,M=f[ae],_=o[M[1+V%(M.length-2)]].getPointAt(.3+e()*.5),O=ae===0?-1:1,z=g([_,_.clone().add(Wt(O*.25,-.6,.4)),_.clone().add(Wt(O*(.35+e()),-1.6,.8)),_.clone().add(Wt(O*(.1+e()),-2.6-e()*1.3,.4))],40+V,!0);for(let H=0;H<3;H++)u.push({guide:z,next:z,between:0,from:0,to:.9+e()*.1,radius:.0045+e()*.003,phase:e()*ni,wander:.025,shade:e(),family:40+V})}let m=new _l({paths:n,groups:s,pinnedStart:r,pinnedEnd:a,iterations:6,maxGrabDistance:3.8}),p=new Float32Array(ii*n.length*4),A=new vi(p,ii,n.length,nn,$t);A.magFilter=A.minFilter=Nt,A.generateMipmaps=!1,A.needsUpdate=!0;let T={uFiberGuides:{value:A},uFiberGrid:{value:new Le(ii,n.length)},uFiberViewport:{value:1080},uFiberTouch:{value:0}},v=[],R=[],E=[],w=[],x=[],S=[],C=[],D=[new ze("#c9c8b8"),new ze("#a5b3b5"),new ze("#c3b7a2"),new ze("#928675"),new ze("#a8aca2")],L=0;function X(V){let ae=V.shade;return(ae<.1?D[1]:ae<.14?D[3]:ae<.28?D[4]:ae<.44?D[2]:D[0]).clone().multiplyScalar(.66+e()*.3)}function Y(V,ae,M=120,_=4){let O=v.length/3,z=X(V),H=[];for(let j=0;j<=M;j++)H.push(ae(j/M));let ie=null;for(let j=0;j<=M;j++){let W=j/M,$=V.from+(V.to-V.from)*W,ce=H[j],Te=H[Math.min(M,j+1)].clone().sub(H[Math.max(0,j-1)]).normalize(),[G,k]=y(Te);ie&&(G=ie.clone().addScaledVector(Te,-ie.dot(Te)).normalize(),k.crossVectors(Te,G).normalize()),ie=G;let ne=V.to<.98||V.family>=40,ge=(.58+.42*Zs(0,.025,W))*(ne?1-.9*Zs(.86,1,W):1),Ae=V.radius*ge*(.87+.085*Math.sin($*48+V.phase)+.04*Math.sin($*153+V.phase)),B=V.phase+.18*Math.sin($*70+V.phase);for(let xe=0;xe<_;xe++){let re=xe/_*ni+B,ve=G.clone().multiplyScalar(Math.cos(re)).addScaledVector(k,Math.sin(re)),be=ce.clone().addScaledVector(ve,Ae);v.push(be.x,be.y,be.z),R.push(ve.x,ve.y,ve.z),E.push(z.r,z.g,z.b),w.push(V.guide+(V.next-V.guide)*V.between,$),x.push(Te.x,Te.y,Te.z,Ae),S.push(xe/_,$)}}for(let j=0;j<M;j++)for(let W=0;W<_;W++){let $=O+j*_+W,ce=O+j*_+(W+1)%_,Te=$+_,G=ce+_;C.push($,ce,Te,ce,G,Te)}L++}for(let V of u){let ae=o[V.guide],M=o[V.next];Y(V,O=>{let z=V.from+(V.to-V.from)*O,H=ae.getPointAt(z).lerp(M.getPointAt(z),V.between),ie=ae.getTangentAt(z),j=c[V.guide],W=Math.min(127,Math.floor(z*128)),$=z*128-W,ce=j.normals[W].clone().lerp(j.normals[W+1],$).normalize(),Te=new U().crossVectors(ie,ce).normalize(),G=Math.sin(z*Math.PI);if(H.addScaledVector(ce,(Math.sin(z*28+V.phase)*V.wander+Math.sin(z*71+V.phase)*V.wander*.24)*G),H.addScaledVector(Te,(Math.sin(z*22+V.phase*1.9)*V.wander*.72+(V.depth||0))*(.3+.7*G)),V.offset!==void 0&&(H.x+=V.offset),V.family<7){let k=Zs(.72,1,O),ne=1-Zs(0,.16,O),ge=V.phase/ni*.19+.055;H.addScaledVector(ce,k*Math.sin(O*14+V.phase)*ge+ne*Math.sin(O*11+V.phase)*.04),H.addScaledVector(Te,k*Math.cos(O*14+V.phase)*ge),H.y-=k*k*(.12+V.phase*.045)}if(V.family<7&&V.shade<.016){let k=Math.exp(-(((z-.43-V.phase*.012)/.014)**2));H.addScaledVector(ce,Math.cos(z*900)*.032*k),H.addScaledVector(Te,Math.sin(z*900)*.032*k)}return H},V.family>=20?64:Math.max(32,Math.ceil((V.to-V.from)*128)))}d.forEach((V,ae)=>{let M=f[ae],_=Math.round((ae===0||ae===2?96:52)*h);for(let O=0;O<_;O++){let z=.08+O/_*.82+(e()-.5)*.009;if(e()<.2)continue;let H=e()*.22,ie=.75+e()*.25,j=M[0],W=M.at(-1),$={guide:j,next:W,between:0,from:z,to:z,radius:.0018+e()*.002,phase:e()*ni,shade:.25+e()*.75,family:ae},ce=v.length/3,Te=40;Y($,G=>{let k=H+(ie-H)*G,ne=k*(M.length-1),ge=Math.min(M.length-2,Math.floor(ne)),Ae=ne-ge,B=o[M[ge]].getPointAt(z),xe=o[M[ge+1]].getPointAt(z);return B.lerp(xe,Ae).add(Wt(0,Math.sin(G*41+O)*.008,Math.sin(G*63+O)*.013))},Te,3);for(let G=0;G<=Te;G++)for(let k=0;k<3;k++){let ne=(ce+G*3+k)*2;w[ne]=j+(W-j)*(H+(ie-H)*G/Te)}}});let I=new at;I.setAttribute("position",new Ye(v,3)),I.setAttribute("normal",new Ye(R,3)),I.setAttribute("color",new Ye(E,3)),I.setAttribute("aFiberGuide",new Ye(w,2)),I.setAttribute("aFiberTangent",new Ye(x,4)),I.setAttribute("uv",new Ye(S,2)),I.setIndex(C),I.computeBoundingSphere(),I.boundingSphere.radius+=5;let P=`
    uniform sampler2D uFiberGuides;
    uniform vec2 uFiberGrid;
    uniform float uFiberViewport;
    attribute vec2 aFiberGuide;
    attribute vec4 aFiberTangent;
    varying float vFiberCoverage;
    varying float vFiberWarmth;
    float fiberWarm(vec2 g){
      vec2 p=vec2(clamp(g.y,0.,1.)*(uFiberGrid.x-1.),g.x);
      vec2 cell=floor(p),f=fract(p);
      float a=texture2D(uFiberGuides,(cell+.5)/uFiberGrid).a;
      float b=texture2D(uFiberGuides,(cell+vec2(1.5,.5))/uFiberGrid).a;
      float c=texture2D(uFiberGuides,(cell+vec2(.5,1.5))/uFiberGrid).a;
      float d=texture2D(uFiberGuides,(cell+1.5)/uFiberGrid).a;
      return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
    }
    vec3 fiberNode(float row,float col){return texture2D(uFiberGuides,(vec2(clamp(col,0.,uFiberGrid.x-1.),row)+.5)/uFiberGrid).xyz;}
    vec3 fiberCurve(float row,float at){
      float s=clamp(at,0.,1.)*(uFiberGrid.x-1.),i=floor(s),f=s-i;
      vec3 a=fiberNode(row,i-1.),b=fiberNode(row,i),c=fiberNode(row,i+1.),d=fiberNode(row,i+2.);
      return b+.5*f*(c-a+f*(2.*a-5.*b+4.*c-d+f*(3.*(b-c)+d-a)));
    }
    vec3 fiberOffset(vec2 g){float row=floor(g.x),f=fract(g.x);vec3 a=fiberCurve(row,g.y);return f<.001?a:mix(a,fiberCurve(row+1.,g.y),f);}
  `,F=new en({color:16777215,vertexColors:!0,roughness:.94,metalness:0,transparent:!0,opacity:.48,depthWrite:!1,side:An});F.name="Soft ivory linen, resolved below one pixel";let J=(V,ae)=>{Object.assign(V.uniforms,T),V.vertexShader=P+V.vertexShader,V.vertexShader=V.vertexShader.replace("#include <beginnormal_vertex>",`#include <beginnormal_vertex>
      vec3 fiberD=fiberOffset(aFiberGuide);
      vec3 fiberAhead=fiberOffset(vec2(aFiberGuide.x,min(1.,aFiberGuide.y+.006)));
      vec3 fiberBehind=fiberOffset(vec2(aFiberGuide.x,max(0.,aFiberGuide.y-.006)));
      vec3 oldT=aFiberTangent.xyz*inversesqrt(max(dot(aFiberTangent.xyz,aFiberTangent.xyz),1.e-12));
      vec3 direction=oldT+(fiberAhead-fiberBehind)*2.0;
      vec3 newT=direction*inversesqrt(max(dot(direction,direction),1.e-12));
      vec3 fiberNormal=objectNormal-newT*dot(objectNormal,newT);
      float normalLength2=dot(fiberNormal,fiberNormal);
      objectNormal=normalLength2>1.e-10?fiberNormal*inversesqrt(normalLength2):vec3(0.,1.,0.);
    `),V.vertexShader=V.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
      transformed+=fiberOffset(aFiberGuide);
      vFiberCoverage=1.;
      vFiberWarmth=fiberWarm(aFiberGuide);
      ${ae?`vec4 fiberView=modelViewMatrix*vec4(transformed,1.);
      float fiberPixels=aFiberTangent.w*projectionMatrix[1][1]*uFiberViewport/max(.01,-2.*fiberView.z);
      float fiberScale=max(1.,.54/max(.001,fiberPixels));
      transformed+=objectNormal*aFiberTangent.w*(fiberScale-1.);
      vFiberCoverage=clamp(fiberPixels/.54,.025,1.);`:""}
    `),V.fragmentShader.includes("#include <emissivemap_fragment>")&&(V.fragmentShader=`varying float vFiberWarmth;
`+V.fragmentShader,V.fragmentShader=V.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        totalEmissiveRadiance+=vec3(.48,.255,.075)*vFiberWarmth;
        diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(1.16,1.04,.82),vFiberWarmth);
      `)),ae&&(V.fragmentShader=`varying float vFiberCoverage;
`+V.fragmentShader,V.fragmentShader=V.fragmentShader.replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.a *= vFiberCoverage;`))};F.onBeforeCompile=V=>J(V,!0),F.customProgramCacheKey=()=>"linen-guide-volume-v2";let K=new Fs({depthPacking:wc,side:St});K.onBeforeCompile=V=>J(V,!1),K.customProgramCacheKey=()=>"linen-guide-depth-v2";let oe=new Ke(I,F),me=new ft;oe.onBeforeRender=V=>{V.getCurrentViewport(me),T.uFiberViewport.value=me.w},oe.name="Woven volume and frayed weft",oe.castShadow=!0,oe.receiveShadow=!1,oe.frustumCulled=!1,oe.customDepthMaterial=K,t.add(oe);let de=new Ns;de.onBeforeCompile=V=>J(V,!1),de.customProgramCacheKey=()=>"linen-guide-distance-v2",oe.customDistanceMaterial=de;let we=[],Ge=[],Re=[];function te(V){let ae=xl(V),M=h<.8?512:1024,_=new Uint8Array(M*M*4),O=[9,27,83].map(j=>({n:j,values:Float32Array.from({length:j*j},()=>ae())})),z=(j,W,$)=>{let ce=j.n,Te=sn.clamp(W,0,.999999)*(ce-1),G=sn.clamp($,0,.999999)*(ce-1),k=Math.floor(Te),ne=Math.floor(G),ge=Te-k,Ae=G-ne,B=ge*ge*(3-2*ge),xe=Ae*Ae*(3-2*Ae),re=j.values[ne*ce+k],ve=j.values[ne*ce+k+1],be=j.values[(ne+1)*ce+k],le=j.values[(ne+1)*ce+k+1];return(re+(ve-re)*B)*(1-xe)+(be+(le-be)*B)*xe},H=Array.from({length:9},(j,W)=>({x:W<4?W%2?1.015:-.015:.12+ae()*.76,y:.1+ae()*.8,rx:.035+ae()*.11,ry:.025+ae()*.09,angle:ae()*ni})).map(j=>({...j,co:Math.cos(j.angle),si:Math.sin(j.angle)}));for(let j=0;j<M;j++)for(let W=0;W<M;W++){let $=W/(M-1),ce=j/(M-1),Te=z(O[0],$,ce),G=z(O[1],$,ce),k=z(O[2],$,ce),ne=Math.min($,1-$,ce*.72,(1-ce)*.72),ge=.012+(Te-.5)*.13+(G-.5)*.035+(k-.5)*.011,Ae=Zs(ge,ge+.048,ne)*(.37+Te*.43+G*.13);for(let le of H){let De=$-le.x,Be=ce-le.y,it=le.co,lt=le.si,Gt=(De*it+Be*lt)/le.rx,ct=(-De*lt+Be*it)/le.ry,Xt=Math.sqrt(Gt*Gt+ct*ct);Ae*=Zs(.65+G*.45,1.12+G*.24,Xt)}let B=Math.pow(.5+.5*Math.sin(($*183+G*.37)*ni),10),xe=Math.pow(.5+.5*Math.sin((ce*267+Te*.21)*ni),12),re=.965+B*.025+xe*.02,ve=(ae()-.5)*3,be=(j*M+W)*4;_[be]=(201+Te*28+G*9)*re+ve,_[be+1]=(206+Te*27+G*8)*re+ve,_[be+2]=(201+Te*28+G*10)*re+ve,_[be+3]=Math.round(255*sn.clamp(Ae*(.9+B*.07+xe*.05),0,1))}let ie=new vi(_,M,M,nn);return ie.colorSpace=vt,ie.generateMipmaps=!0,ie.minFilter=ln,ie.magFilter=Mt,ie.anisotropy=8,ie.needsUpdate=!0,we.push(ie),ie}let _e=[te(883),te(1593),te(3281)];[{b:0,a:.09,z:.54,l:0,r:.96,depth:.07,opacity:.64},{b:0,a:.38,z:.86,l:.08,r:.91,depth:-.09,opacity:.57},{b:0,a:.29,z:.62,l:.02,r:.69,depth:.21,opacity:.23},{b:1,a:.19,z:.72,l:.06,r:.97,depth:.02,opacity:.54},{b:1,a:.48,z:.86,l:.18,r:.82,depth:.1,opacity:.21},{b:2,a:.19,z:.63,l:.04,r:.98,depth:.11,opacity:.61},{b:2,a:.52,z:.91,l:.09,r:.93,depth:.05,opacity:.56},{b:2,a:.31,z:.75,l:.15,r:.72,depth:-.19,opacity:.21},{b:3,a:.17,z:.62,l:.05,r:.94,depth:.09,opacity:.44},{b:3,a:.49,z:.91,l:.07,r:.8,depth:-.13,opacity:.26},{b:5,a:.19,z:.69,l:.08,r:.89,depth:.07,opacity:.23},{b:6,a:.29,z:.75,l:.04,r:.96,depth:.05,opacity:.25}].forEach((V,ae)=>{let M=f[V.b],_=[],O=[],z=[],H=[],ie=[],j=24,W=76;for(let G=0;G<=W;G++)for(let k=0;k<=j;k++){let ne=G/W,ge=V.a+(V.z-V.a)*ne,Ae=k/j,B=V.l+.055*Math.sin(ne*9+ae)+.022*Math.sin(ne*27+ae*.7),xe=V.r+.043*Math.sin(ne*13+ae*.4),re=sn.clamp(B+(xe-B)*Ae,0,1),ve=re*(M.length-1),be=Math.min(M.length-2,Math.floor(ve)),le=ve-be,De=o[M[be]],Be=o[M[be+1]],it=De.getPointAt(ge).lerp(Be.getPointAt(ge),le),lt=De.getTangentAt(ge).lerp(Be.getTangentAt(ge),le).normalize(),Gt=c[M[be]],ct=Math.min(127,Math.floor(ge*128)),Xt=Gt.binormals[ct].clone();it.addScaledVector(Xt,V.depth+Math.sin(Ae*10+ne*8+ae)*.085+Math.sin(Ae*21-ne*12+ae)*.024),_.push(it.x,it.y,it.z),O.push(M[be]+le,ge),z.push(lt.x,lt.y,lt.z,0),H.push(Ae,ne)}for(let G=0;G<W;G++)for(let k=0;k<j;k++){let ne=G*(j+1)+k,ge=ne+1,Ae=ne+j+1,B=Ae+1;ie.push(ne,Ae,ge,ge,Ae,B)}let $=new at;$.setAttribute("position",new Ye(_,3)),$.setAttribute("uv",new Ye(H,2)),$.setAttribute("aFiberGuide",new Ye(O,2)),$.setAttribute("aFiberTangent",new Ye(z,4)),$.setIndex(ie),$.computeVertexNormals();let ce=new ei({color:ae%4===1?"#cbd7d6":"#dddccd",map:_e[ae%_e.length],roughness:.94,metalness:0,sheen:.65,sheenRoughness:.9,sheenColor:new ze("#c0ccc8"),transparent:!0,opacity:V.opacity,depthWrite:!1,side:St});ce.name="Torn gauze, soft reflected linen light",ce.onBeforeCompile=G=>J(G,!1),ce.customProgramCacheKey=()=>"linen-guide-gauze-v2";let Te=new Ke($,ce);Te.name=`Remnant of gauze ${ae+1}`,Te.frustumCulled=!1,Te.castShadow=!1,Te.receiveShadow=!1,t.add(Te),Ge.push($),Re.push(ce)});let Ce=Wt(0,0,0),ke=Wt(0,0,0),Ue=Wt(0,0,0),et=Wt(0,0,0),Z=Wt(0,0,0),ye=new Jt,Se=Wt(0,0,0),Ee=null,Oe=null,he=(V,ae,M)=>{let _=(m.offsets[V]+ae)*3;return M.fromArray(m.positions,_)};function Me(V,ae,{viewportHeight:M=globalThis.innerHeight||1080,pixelThreshold:_=17,minY:O=-.03,maxDistance:z=1/0}={}){let H=null,ie=1/0,j=M*ae.projectionMatrix.elements[5]*.5;for(let W=0;W<n.length;W++){let $=m.counts[W];for(let ce=1;ce<$-2;ce++){he(W,ce,Ce),he(W,ce+1,ke);let Te=V.distanceSqToSegment(Ce,ke,Ue,et);if(et.y<O||Ue.distanceTo(V.origin)>z||(Z.copy(et).applyMatrix4(ae.matrixWorldInverse),Z.z>-.1))continue;let G=Math.sqrt(Te)*j/-Z.z;if(G>_)continue;let k=G+Ue.distanceTo(V.origin)*.028;if(k>=ie)continue;ie=k;let ne=et.distanceToSquared(Ce)<et.distanceToSquared(ke)?ce:ce+1;H={point:et.clone(),ropeIndex:W,nodeIndex:ne,pixelDistance:G,distance:Ue.distanceTo(V.origin)}}}return H}function ue(V,ae,M={}){let _=Me(V,ae,M);return _?(ae.getWorldDirection(Z),ye.setFromNormalAndCoplanarPoint(Z,_.point),he(_.ropeIndex,_.nodeIndex,Ce),Ee={..._,offset:Ce.clone().sub(_.point)},m.setGrab(_.ropeIndex,_.nodeIndex,Ce)?_:(Ee=null,null)):null}function pe(V){return!Ee||!V.intersectPlane(ye,Se)?null:(m.moveGrab(Se.clone().add(Ee.offset)),Ee.point.copy(Se),Se.clone())}function Pe(){m.release(),Ee=null}function N(V=0){let ae=m.positions,M=m.restPositions;for(let _=0;_<n.length;_++)for(let O=0;O<ii;O++){let z=m.offsets[_]+Math.min(m.counts[_]-1,O),H=z*3,ie=(_*ii+O)*4,j=O/(ii-1),W=Math.sin(j*Math.PI),$=s[_]*.61,ce=.018*W*Math.sin(V*.16+j*4.7+$);p[ie]=ae[H]-M[H]+ce*.55,p[ie+1]=ae[H+1]-M[H+1]+Math.sin(V*.13+j*5.1+$)*W*.009,p[ie+2]=ae[H+2]-M[H+2]+ce}A.needsUpdate=!0}return{group:t,mesh:oe,physics:m,count:L,guideCount:n.length,hover:Me,beginGrab:ue,moveGrab:pe,endGrab:Pe,get energy(){return m.energy||0},get grab(){return Ee},update(V,ae=0,M=0,{dt:_,paused:O=!1,viewportHeight:z,deterministic:H=!1}={}){let ie=_??(Oe===null?0:Math.max(0,V-Oe));(H||Oe!==null&&(V<Oe||ie>.5))&&(m.reset(),Ee=null),!O&&!H&&m.step(Math.min(ie,.05)),N(V),Oe=V,z?T.uFiberViewport.value=z:T.uFiberViewport.value=(globalThis.innerHeight||1080)*Math.min(globalThis.devicePixelRatio||1,2),T.uFiberTouch.value=ae},setViewportHeight(V){T.uFiberViewport.value=V},setGuideHeat(V){for(let ae=0;ae<n.length;ae++)for(let M=0;M<ii;M++){let _=m.offsets[ae]+Math.min(m.counts[ae]-1,M);p[(ae*ii+M)*4+3]=Math.max(0,Math.min(1,V?.[_]||0))}A.needsUpdate=!0},reset(){m.reset(),Ee=null,Oe=null,N()},dispose(){I.dispose(),F.dispose(),K.dispose(),de.dispose(),A.dispose(),we.forEach(V=>V.dispose()),Ge.forEach(V=>V.dispose()),Re.forEach(V=>V.dispose())}}}var rn=Math.PI*2,pt=(i,e,t)=>i+(e-i)*t,jr=(i,e,t)=>Math.max(e,Math.min(t,i));function yl(i){let e=i>>>0;return()=>{e+=1831565813;let t=Math.imul(e^e>>>15,1|e);return t^=t+Math.imul(t^t>>>7,61|t),((t^t>>>14)>>>0)/4294967296}}function jc(i){let e=document.createElement("canvas");return e.width=e.height=i,[e,e.getContext("2d",{alpha:!0})]}function Qc(i,e,t=!0){let n=new pn(i);return t&&(n.colorSpace=vt),n.minFilter=ln,n.magFilter=Mt,n.generateMipmaps=!0,n.anisotropy=8,n.name=e,n}function Pi(i,e){i.beginPath(),i.moveTo(e[0],e[1]),i.bezierCurveTo(...e.slice(2)),i.stroke()}function vd(i,e,t=.15){i.strokeStyle=`rgba(65,79,73,${t})`,i.lineWidth=.48;let n=39+e()*12;for(let s=48;s<990;s+=n)i.beginPath(),i.moveTo(31,s),i.lineTo(994,s+.7),i.stroke(),i.beginPath(),i.moveTo(s,30),i.lineTo(s+.4,994),i.stroke();i.strokeStyle="rgba(65,73,60,.33)",i.lineWidth=.55,i.strokeRect(47,46,930,932);for(let s=58,r=0;s<973;s+=8,r++){let a=r%5===0?6:2.5;i.beginPath(),i.moveTo(s,46),i.lineTo(s,46+a),i.stroke(),i.beginPath(),i.moveTo(47,s),i.lineTo(47+a,s),i.stroke()}}function _d(i,e,t,n,s,r,a,o=!1){i.save(),i.translate(e,t),i.rotate(s);let l=n*r,c=(a()-.5)*n*.24,u=new Path2D;u.moveTo(0,0);for(let h=0;h<2;h++)for(let d=0;d<=32;d++){let g=h?1-d/32:d/32,y=1+Math.sin(g*106)*.045,m=l*Math.pow(Math.sin(Math.PI*g),.85)*y;u.lineTo(c*g*g+(h?-1:1)*m,-n*g)}u.closePath(),i.fillStyle=o?"rgba(123,87,50,.10)":"rgba(64,79,54,.075)",i.fill(u),i.strokeStyle="rgba(50,55,40,.56)",i.lineWidth=.57,i.stroke(u),i.strokeStyle="rgba(46,52,36,.65)",i.lineWidth=.61,i.beginPath(),i.moveTo(0,0),i.quadraticCurveTo(0,-n*.52,c,-n),i.stroke(),i.save(),i.clip(u);let f=Math.max(5,Math.round(n/8));for(let h=1;h<f;h++){let d=h/f,g=l*Math.sin(Math.PI*d);for(let y of[-1,1]){let m=c*d*d,p=-n*d,A=m+g*y,T=-n*Math.min(.98,d+.15);i.strokeStyle="rgba(46,54,36,.43)",i.lineWidth=.34,i.beginPath(),i.moveTo(m,p),i.quadraticCurveTo(m+y*g*.58,p-n*.07,A,T),i.stroke();for(let v=1;v<4;v++){let R=v/4;i.strokeStyle="rgba(54,61,42,.22)",i.lineWidth=.24,i.beginPath(),i.moveTo(pt(m,A,R),pt(p,T,R)),i.lineTo(pt(m,A,R+.18),pt(p,T,R)-n*.047),i.stroke()}}}i.restore(),i.restore()}function vl(i,e,t,n,s,r){let a=(s()-.5)*n*.29,o=c=>[e+a*Math.sin(c*1.75),t-n*c];i.strokeStyle="rgba(51,54,36,.63)",i.lineWidth=1.35,Pi(i,[e,t,e+a*.07,t-n*.26,e+a,t-n*.66,...o(1)]),i.strokeStyle="rgba(51,54,36,.24)",i.lineWidth=.43,Pi(i,[e+2.2,t,e+a*.07+1.3,t-n*.26,e+a+.6,t-n*.66,...o(1)]);let l=r===2?15:10;for(let c=0;c<l;c++){let u=.14+c/l*.81,f=c%2?1:-1,[h,d]=o(u),g=n*(r===2?.21:.29)*(1-u*.69)*pt(.72,1.12,s()),y=g*pt(.5,1.1,s()),m=h+f*g,p=d-y;i.strokeStyle="rgba(49,54,36,.58)",i.lineWidth=.72,Pi(i,[h,d,h+f*g*.27,d-y*.14,h+f*g*.67,d-y*.82,m,p]);let A=r===2?12:5+Math.floor(s()*3);for(let T=0;T<A;T++){let v=.15+T/A*.85,R=pt(h,m,v),E=pt(d,p,v*v*.23+v*.77),w=T%2?1:-1,x=g*(r===2?.19:.34)*(1-v*.29)*pt(.78,1.2,s()),S=Math.atan2(m-h,d-p)+w*pt(.48,1.03,s()),C=x*.12;i.strokeStyle="rgba(57,59,41,.46)",i.lineWidth=.43,i.beginPath(),i.moveTo(R,E),i.lineTo(R+Math.sin(S)*C,E-Math.cos(S)*C),i.stroke(),_d(i,R+Math.sin(S)*C,E-Math.cos(S)*C,x,S,r===1?.23:r===2?.13:.17,s,s()<.15)}if(_d(i,m,p,g*.22,Math.atan2(m-h,d-p),.18,s),r===1&&c>l-4)for(let T=0;T<3;T++){let v=m+(s()-.5)*22,R=p-s()*21;i.strokeStyle="rgba(82,54,39,.42)",i.lineWidth=.44,i.beginPath(),i.moveTo(m,p),i.lineTo(v,R),i.stroke();for(let E=0;E<5;E++){let w=E/5*rn;i.fillStyle="rgba(126,73,57,.075)",i.strokeStyle="rgba(91,58,42,.38)",i.beginPath(),i.ellipse(v+Math.sin(w)*3,R+Math.cos(w)*3,4.5,2,w,0,rn),i.fill(),i.stroke()}}}for(let c=0;c<14;c++){let u=(s()-.5)*n*.15,f=n*pt(.025,.095,s());i.strokeStyle="rgba(75,60,40,.48)",i.lineWidth=pt(.34,.64,s()),Pi(i,[e,t-2,e+u*.1,t+f*.25,e+u*.7,t+f*.89,e+u,t+f]);for(let h=0;h<3;h++){let d=.3+h*.2;i.strokeStyle="rgba(75,60,40,.29)",i.lineWidth=.25,Pi(i,[e+u*d,t+f*d,e+u*d+5,t+f*d+5,e+u*d-7,t+f*d+12,e+u*d+(s()-.5)*18,t+f*d+20])}}}function k_(i,e,t){i.strokeStyle="rgba(84,84,60,.13)",i.lineWidth=.48,i.strokeRect(59,61,906,898),t%2?(vl(i,360,839,627,e,t%3),vl(i,754,865,509,e,(t+1)%3)):(vl(i,483,865,708,e,t%3),vl(i,785,350,198,e,2));for(let n=0;n<5;n++){let s=123+n%2*92,r=163+n*123;i.strokeStyle="rgba(70,64,42,.36)",i.lineWidth=.51,i.beginPath(),i.ellipse(s,r,11+e()*8,19+e()*10,-.18,0,rn),i.stroke();for(let a=-3;a<=3;a++)i.beginPath(),i.moveTo(s+a*2,r-19),i.quadraticCurveTo(s+a*5,r-1,s+a*2,r+20),i.stroke();i.strokeStyle="rgba(64,63,43,.27)",i.lineWidth=.42,i.beginPath(),i.moveTo(s-16,r+35),i.lineTo(s+20,r+35),i.moveTo(s-16,r+32),i.lineTo(s-16,r+38),i.moveTo(s+20,r+32),i.lineTo(s+20,r+38),i.stroke()}}function V_(i,e,t){let n=t*1.41+e()*5;for(let s=0;s<3;s++){let r=pt(170,870,e()),a=pt(100,1e3,e()),o=pt(200,450,e()),l=pt(160,365,e());i.save(),i.beginPath();for(let u=0;u<=490;u++){let f=u/490*rn,h=1+.2*Math.sin(f*3+n)+.14*Math.cos(f*7+s)+.07*Math.sin(f*15+.4)+.03*Math.cos(f*37)+.012*Math.sin(f*83),d=r+Math.cos(f)*o*h,g=a+Math.sin(f)*l*h;u?i.lineTo(d,g):i.moveTo(d,g)}i.closePath(),i.fillStyle=["rgba(152,112,85,.16)","rgba(129,143,106,.13)","rgba(165,139,101,.18)"][(s+t)%3],i.fill(),i.strokeStyle="rgba(46,66,67,.59)",i.lineWidth=.76,i.stroke(),i.clip();let c=(u,f)=>[u+Math.sin(f*.019+n)*19+Math.sin(u*.055)*5,f+Math.sin(u*.014+n)*21+Math.sin(f*.069)*3];for(let u=0;u<39;u++)for(let f=0;f<30;f++){let h=f*39-35,d=u*31-24,g=[c(h,d),c(h+39,d),c(h+39,d+31),c(h,d+31)];i.beginPath(),i.moveTo(...g[0]);for(let y=1;y<4;y++)i.lineTo(...g[y]);i.closePath(),i.fillStyle=e()<.54?`rgba(176,126,98,${e()*.08})`:`rgba(112,136,115,${e()*.07})`,i.fill(),i.strokeStyle="rgba(93,80,62,.38)",i.lineWidth=.44,i.stroke()}for(let u=0;u<13;u++){let f=e()*1024;i.strokeStyle="rgba(36,75,89,.48)",i.lineWidth=u%4?.49:.95,i.beginPath();for(let h=-20;h<=1060;h+=4){let d=f+Math.sin(h*.008+n)*103+Math.sin(h*.026+u)*18+Math.sin(h*.086)*2;h===-20?i.moveTo(d,h):i.lineTo(d,h)}i.stroke()}i.strokeStyle="rgba(64,65,51,.30)",i.lineWidth=.42;for(let u=0;u<1100;u++){let f=e()*1024,h=e()*1024;Math.abs(Math.sin(f*.006+n)*240+520-h)>34+e()*63||(i.beginPath(),i.moveTo(f-3,h+4),i.lineTo(f,h-2),i.lineTo(f+2,h+3),i.stroke())}i.restore()}vd(i,e,.2);for(let s=0;s<69;s++){i.strokeStyle=s%6===0?"rgba(99,72,54,.46)":"rgba(40,70,80,.36)",i.lineWidth=s%6===0?.84:.47,i.beginPath();for(let r=-20;r<=1060;r+=4){let a=s*21-190+139*Math.sin(r*.0044+n+s*.082)+60*Math.cos(r*.009+s*.043)+13*Math.sin(r*.027+s*.15);r===-20?i.moveTo(r,a):i.lineTo(r,a)}i.stroke()}if(t%2){let s=320+e()*270,r=300+e()*300;for(let a=1;a<23;a++){i.strokeStyle=a%5===0?"rgba(107,73,50,.49)":"rgba(41,72,82,.43)",i.lineWidth=a%5===0?.89:.51,i.beginPath();for(let o=0;o<=210;o++){let l=o/210*rn,c=a*11*(1+.13*Math.sin(l*3+a*.07)+.05*Math.cos(l*7)),u=s+Math.cos(l)*c*1.22,f=r+Math.sin(l)*c*.88;o?i.lineTo(u,f):i.moveTo(u,f)}i.stroke()}}for(let s=0;s<390;s++){let r=60+e()*900,a=60+e()*900;i.fillStyle="rgba(53,63,53,.43)",i.beginPath(),i.arc(r,a,.65,0,rn),i.fill(),s%4===0&&(i.strokeStyle="rgba(66,68,50,.23)",i.lineWidth=.46,i.beginPath(),i.moveTo(r,a),i.lineTo(r+4,a-4),i.stroke())}}function H_(i,e,t){vd(i,e,.09);for(let n=0;n<7;n++){let s=n%2,r=Math.floor(n/2),a=255+s*455+(e()-.5)*100,o=160+r*231,l=pt(61,117,e());i.strokeStyle="rgba(47,63,60,.41)",i.lineWidth=.62;for(let f=1;f<=3;f++)i.beginPath(),i.ellipse(a,o,l*f/3,l*f/3*(t%2?.67:1),0,0,rn),i.stroke();let c=5+Math.floor(e()*4),u=Array.from({length:c},(f,h)=>[a+Math.cos(h/c*rn)*l,o+Math.sin(h/c*rn)*l]);i.beginPath();for(let f=0;f<c;f++)i.moveTo(...u[f]),i.lineTo(...u[(f+2)%c]),i.moveTo(a,o),i.lineTo(...u[f]);i.stroke(),i.strokeStyle="rgba(129,77,43,.36)",i.lineWidth=.78,i.beginPath(),i.arc(a,o,l*.85,-.2,1.8),i.stroke(),i.strokeStyle="rgba(53,67,61,.24)",i.lineWidth=.4;for(let f=0;f<60;f++){let h=f/60*rn;i.beginPath(),i.moveTo(a+Math.cos(h)*l,o+Math.sin(h)*l),i.lineTo(a+Math.cos(h)*(l+(f%5?2:5)),o+Math.sin(h)*(l+(f%5?2:5))),i.stroke()}}for(let n=0;n<11;n++){i.strokeStyle="rgba(48,66,66,.25)",i.lineWidth=.49,i.beginPath();for(let s=94;s<940;s+=3){let r=430+n*13+Math.sin(s*.016+n*.37)*47;s===94?i.moveTo(s,r):i.lineTo(s,r)}i.stroke()}}function G_(i,e,t,n){let s=[[145,167,168],[183,181,158],[193,184,157],[168,164,149],[162,177,168],[141,160,165],[191,179,148],[169,161,133],[175,175,150],[153,172,175],[187,174,149],[184,187,166]],r=s[n%s.length],a=i.createImageData(e,e);for(let o=0;o<e;o++)for(let l=0;l<e;l++){let c=l/e,u=o/e,f=(o*e+l)*4,h=Math.sin(c*19+Math.sin(u*9)+n)*2.4+Math.sin(u*43-c*8+n)*1.7,d=(t()-.5)*7+Math.sin(l*.28+Math.sin(o*.03))*.5,g=Math.pow(Math.max(Math.abs(c-.5),Math.abs(u-.5))*2,5);a.data[f]=r[0]+h+d-g*10,a.data[f+1]=r[1]+h+d-g*12,a.data[f+2]=r[2]+h+d-g*15,a.data[f+3]=255}i.putImageData(a,0,0),i.scale(e/1024,e/1024);for(let o=0;o<34;o++){let l=t()*1024,c=t()*1024,u=pt(23,166,t()),f=i.createRadialGradient(l,c,u*.08,l,c,u);f.addColorStop(0,"rgba(99,74,36,.013)"),f.addColorStop(.73,"rgba(99,74,36,.021)"),f.addColorStop(.87,"rgba(99,74,36,.040)"),f.addColorStop(1,"rgba(99,74,36,0)"),i.fillStyle=f,i.fillRect(l-u,c-u,u*2,u*2)}for(let o=0;o<130;o++){let l=t()*1024,c=t()*1024;i.fillStyle=`rgba(119,80,38,${pt(.03,.12,t())})`,i.beginPath(),i.ellipse(l,c,pt(.5,2.3,t()),pt(.4,1.9,t()),t()*rn,0,rn),i.fill()}}function W_(i,e,t){let n=(r,a)=>7+Math.sin(r*17+a+t)*2.2+Math.sin(r*51+t)*1.5+Math.sin(r*157+a)*.8+e()*1.8,s=new Path2D;for(let r=0;r<=128;r++){let a=r/128;r?s.lineTo(a*1024,n(a,0)):s.moveTo(0,n(a,0))}for(let r=0;r<=128;r++){let a=r/128;s.lineTo(1024-n(a,1),a*1024)}for(let r=128;r>=0;r--){let a=r/128;s.lineTo(a*1024,1024-n(a,2))}for(let r=128;r>=0;r--){let a=r/128;s.lineTo(n(a,3),a*1024)}if(s.closePath(),i.globalCompositeOperation="destination-in",i.fillStyle="#fff",i.fill(s),i.globalCompositeOperation="destination-out",i.fillStyle="#000",i.save(),i.translate(512,512),i.rotate(t%4*Math.PI/2),i.translate(-512,-512),t%3!==0){let r=120+t%4*34;i.beginPath(),i.moveTo(-20,-20),i.lineTo(r+86,-20);for(let a=0;a<=24;a++){let o=a/24;i.lineTo(r*(1-o)+Math.sin(o*13)*15+(e()-.5)*6,r*o+Math.sin(o*9)*11+e()*5)}i.lineTo(-20,r+42),i.closePath(),i.fill()}if(t%4===1||t%4===2){let r=380+e()*370,a=35+e()*100;i.beginPath(),i.moveTo(1035,r-95);for(let o=0;o<=34;o++){let l=o/34;i.lineTo(1024-Math.sin(l*Math.PI)*a-e()*5,r-94+l*188)}i.lineTo(1035,r+95),i.closePath(),i.fill()}(t===7||t===10)&&(i.beginPath(),i.moveTo(-10,650),i.lineTo(1040,805),i.lineTo(1040,1040),i.lineTo(-10,1040),i.closePath(),i.fill()),i.restore();for(let r=0;r<15;r++)i.beginPath(),i.ellipse(20+e()*984,20+e()*984,pt(.5,1.7,e()),pt(.7,3.1,e()),e()*3,0,rn),i.fill();if(t%5===2){let r=100+e()*750,a=180+e()*650;i.beginPath();for(let o=0;o<=31;o++){let l=o/31*rn,c=13+e()*7,u=r+Math.cos(l)*c*.64,f=a+Math.sin(l)*c;o?i.lineTo(u,f):i.moveTo(u,f)}i.closePath(),i.fill()}i.globalCompositeOperation="source-over"}function X_(i,e,t){let n=yl(i+e*1637),[s,r]=jc(t);G_(r,t,n,e),[0,3,5,9].includes(e)?V_(r,n,e):[1,2,6,8,11].includes(e)?k_(r,n,e):H_(r,n,e);for(let a=0;a<18;a++){let o=n()*1024,l=n()*1024,c=50+n()*130,u=r.createRadialGradient(o,l,0,o,l,c);u.addColorStop(0,"rgba(209,202,176,.10)"),u.addColorStop(1,"rgba(209,202,176,0)"),r.fillStyle=u,r.fillRect(o-c,l-c,c*2,c*2)}r.lineWidth=.38;for(let a=0;a<3200;a++){let o=n()*1024,l=n()*1024;r.strokeStyle=a%3?"rgba(83,81,61,.065)":"rgba(237,233,206,.16)",r.beginPath(),r.moveTo(o,l),r.quadraticCurveTo(o+(n()-.5)*5,l+3,o+(n()-.5)*3,l+pt(2,12,n())),r.stroke()}for(let a=0;a<7;a++){let o=n()*1024;r.strokeStyle="rgba(81,71,50,.11)",r.lineWidth=1.25,Pi(r,[o,-10,o+13,300,o-18,710,o+17,1030]),r.strokeStyle="rgba(234,226,201,.15)",r.lineWidth=.69,Pi(r,[o+1.8,-10,o+14.8,300,o-16.2,710,o+18.8,1030])}return W_(r,n,e),Qc(s,`archive-copperplate-${e}`)}function xd(i,e=!1){let t=yl(i),[n,s]=jc(1024),r=s.createImageData(1024,1024);for(let a=0;a<1024;a++)for(let o=0;o<1024;o++){let l=(a*1024+o)*4,c=e?Math.sin(o*.77+Math.sin(a*.021)*.18)*5+Math.sin(a*.72)*2:0,u=128+(t()-.5)*12+Math.sin(o*.073+Math.sin(a*.025)*2)*3+c;r.data[l]=r.data[l+1]=r.data[l+2]=u,r.data[l+3]=255}return s.putImageData(r,0,0),Qc(n,e?"silk-weave-relief":"laid-paper-relief",!1)}function q_(i,e,t,n,s=0){let r=new Vt(i,e,40,54),a=r.attributes.position;for(let o=0;o<a.count;o++){let l=a.getX(o),c=a.getY(o),u=l/i,f=c/e,h=Math.pow(Math.abs(u)*2,5),d=Math.sin(f*3.3+t)*n+Math.sin(u*4.7+t*.3)*n*.54+h*Math.sin(f*8+t)*n*.47+Math.tanh(Math.sin(u*7.7-f*4.2+t)*2)*n*.13+Math.sin(u*23+f*12+t)*.013+Math.sin(f*34-u*9)*.007,g=l+Math.sin(f*6+t)*i*.025*h,y=c+Math.sin(u*9+t)*e*.008*Math.pow(Math.abs(f)*2,4);if(s){let m=(x,S,C,D,L)=>Math.exp(-x*x/(C*C)-S*S/(D*D))*L;d+=m(l+c*.41+i*.08,c-e*.06,.16,e*.44,.145),d-=m(l+c*.41+i*.14,c-e*.02,.24,e*.4,.075),d+=m(c-l*.47+e*.11,l-i*.04,.19,i*.48,.12),d-=m(c-l*.47+e*.17,l+i*.02,.3,i*.43,.07),d+=m(c+l*.67-e*.29,l+i*.25,.15,i*.23,.09);let p=(s===1?-1:1)/Math.SQRT2,A=-1/Math.SQRT2,v=.16*(i+e)/Math.SQRT2/1.1,R=Math.max(0,g*p+y*A-.34*(i+e)/Math.SQRT2),E=R/v,w=R-v*Math.sin(E);g-=p*w,y-=A*w,d+=v*(1-Math.cos(E))}a.setXYZ(o,g,y,d)}return r.computeVertexNormals(),r}function Y_(i){let e=yl(i),[t,n]=jc(2048),s=n.createImageData(2048,2048);for(let r=0;r<2048;r++)for(let a=0;a<2048;a++){let o=a/2048,l=r/2048,c=(r*2048+a)*4,u=jr(Math.min(o,1-o)*53-.2*Math.sin(l*14),0,1),f=jr((1-l+.021*Math.sin(o*26)+.008*Math.sin(o*119))*23,0,1),h=.012*Math.sin(o*247+Math.sin(l*8))+.004*Math.sin(o*971),d=.004*Math.sin(l*421+Math.sin(o*4)),g=.22+.037*Math.sin(o*9+l*7)+.012*Math.sin(o*41-l*13);s.data[c]=199,s.data[c+1]=207,s.data[c+2]=201,s.data[c+3]=255*jr(g+h+d,.09,.35)*u*f}n.putImageData(s,0,0),n.scale(2,2),n.lineWidth=.47;for(let r=0;r<640;r++){let a=e()*1024;n.strokeStyle=`rgba(219,223,209,${pt(.025,.1,e())})`,Pi(n,[a,0,a+e()*2,350,a-e()*3,700,a+e()*2,pt(900,1035,e())])}return Qc(t,"worn-silk-object-space-weave")}function Z_(i,e,t){let n=new Vt(i,e,48,88),s=n.attributes.position;for(let r=0;r<s.count;r++){let a=s.getX(r)/i,o=.5-s.getY(r)/e,l=.9-.24*o+.04*Math.sin(o*4+t),c=a*i*l+Math.sin(o*3.2+t)*i*.21,u=e*(.5-o),f=Math.sin(a*13+t+o*.9)*(.1+.23*o)+Math.sin(a*26+o*1.7+t)*.041,h=Math.sin(o*4.1+t)*i*.12+f+Math.pow(o,3)*Math.sin(a*8+t)*i*.1;s.setXYZ(r,c,u,h)}return n.computeVertexNormals(),n}function yd({seed:i=481,quality:e=1}={}){let t=yl(i),n=new At;n.name="The suspended archive";let s=e<.7?1024:2048,r=Array.from({length:12},(v,R)=>X_(i,R,s)),a=xd(i+51),o=xd(i+53,!0),l=r.map(v=>new en({map:v,bumpMap:a,bumpScale:.008,side:St,roughness:.98,metalness:0,alphaTest:.38,alphaToCoverage:!0,color:15723740})),c=[],u=[],f=[],h=[],d=[[-10.8,11,0,6.3,7.5,0,-.25],[-13.8,7.7,2.3,4.7,6.3,9,.22],[-9.5,14.4,-3.9,4.6,5.9,1,.13],[-14.1,13.4,-4.8,5.1,6.7,5,-.26],[-17,8.6,-1.8,3.5,6.2,7,.14],[-11.4,4.6,-1.4,3,4.8,3,-.19],[-8.2,10,-6.1,3.4,5.3,4,.14],[-16,16.8,-8.3,5.6,4.1,8,.24],[10.6,11.1,-.9,5.8,7.8,6,-.18],[14.4,8.4,.8,5.4,5.7,9,.29],[9.6,15.7,-4.4,4.6,6.2,11,.22],[14.2,13.6,-5.5,4.1,6,3,-.23],[7.9,11.5,-7.3,2.8,4.8,8,-.17],[17.2,7.2,-2.5,4.5,6.9,0,.18],[11.5,5,-2.9,3.7,5.1,10,-.25],[17.4,15.7,-9.8,4.3,6.6,1,.26],[-17.4,11.5,3.8,4.3,7.4,11,-.2],[-14.4,4.7,4.7,3.9,5.1,0,.18],[-10.3,18.2,-7.3,5.3,4.4,5,-.19],[-7,17.2,-11.7,3.7,5.3,4,.24],[7.5,19,-10.8,4.6,5.2,9,-.23],[16.5,12.2,4.9,4.8,7.2,2,.16],[14.2,4.7,3.8,2.9,4.5,7,-.29],[18.5,18.5,-5.2,4.3,5.1,0,.19],[-18.9,5.4,-9.2,4.3,5.7,3,.24],[18,5.3,-9.9,4.1,5.8,8,-.18],[-7.4,5.5,-14,2,3.3,5,-.26],[7.9,6.6,-14.5,2.2,4,11,.23],[-12.5,19.5,-14.1,3.8,4.4,6,-.16],[13.8,19.1,-14.4,3,4.8,10,.21],[-19,17.4,1.3,4.8,5.5,9,.18],[18.7,11.1,7,4.3,5.6,6,-.21]],g=new Set([6,12,19,29]);for(let v=0;v<d.length;v++){let[R,E,w,x,S,C,D]=d[v],L=t()*rn,X=q_(x,S,L,pt(.33,.59,t()),v===1?1:v===16?2:0);c.push(X);let Y=g.has(v),I=l[C];Y&&(I=I.clone(),I.transparent=!0,I.opacity=.53,I.alphaTest=.08,I.alphaToCoverage=!1,I.depthWrite=!1,I.forceSinglePass=!0,l.push(I));let P=new Ke(X,I);P.name=`Fragment ${v+1} / copperplate ${C+1}`,P.position.set(R,E,w),P.rotation.set(pt(-.16,.16,t()),pt(-.26,.26,t()),D),P.castShadow=!Y,P.receiveShadow=!0,n.add(P),u.push({mesh:P,phase:L,baseY:E,baseRotation:P.rotation.clone(),amplitude:pt(.006,.012,t()),cloth:!1});let F=X.attributes.position;for(let J of[0,40,F.count-41,F.count-1]){let K=new U().fromBufferAttribute(F,J),oe=K.clone();oe.folio={sheetIndex:v,plate:C,kind:[0,3,5,9].includes(C)?"weather":[1,2,6,8,11].includes(C)?"botanical":"geometry"},f.push(oe),h.push({mesh:P,point:K,anchor:oe})}}let y=Y_(i+876),m=new ei({map:y,bumpMap:o,bumpScale:.007,color:14278872,side:St,transparent:!0,opacity:.72,depthWrite:!1,forceSinglePass:!0,roughness:.87,metalness:0,sheen:.42,sheenRoughness:.86,sheenColor:13949902,specularIntensity:.16}),p=[[-10.6,8.9,4,5.1,14.1,1.7,-.18],[11.6,9.1,3.1,5.1,14.1,.7,.16],[-16,9.3,-2.9,4.7,14.1,2.1,.09],[17,10.3,-4.4,4,15,3.1,-.13],[-8,11.8,-6.2,3,11.8,2.8,-.1],[8.9,11.6,-7.2,3.5,11.7,4.1,.08]];for(let v=0;v<p.length;v++){let[R,E,w,x,S,C,D]=p[v],L=Z_(x,S,C);c.push(L);let X=new Ke(L,m);X.name=`Loose silk ${v+1}`,X.position.set(R,E,w),X.rotation.z=D,X.receiveShadow=!0,n.add(X);let Y={mesh:X,phase:C,baseY:E,baseRotation:X.rotation.clone(),amplitude:.017,cloth:!0,width:x,height:S,rest:L.attributes.position.array.slice(),lastContact:!1};u.push(Y);let I=L.attributes.position,P=[];for(let oe=0;oe<64;oe++){let me=Math.floor(t()*48),de=88-Math.floor(t()*2),we=new U().fromBufferAttribute(I,de*49+me),Ge=pt(.12,.8,t()),Re=pt(-.12,.12,t());for(let te=0;te<10;te++)for(let _e=0;_e<2;_e++){let fe=(te+_e)/10;P.push(we.x+Re*fe+Math.sin(fe*8+C)*.007,we.y-Ge*fe,we.z+Math.sin(fe*3+C)*.033)}}let F=new at;F.setAttribute("position",new Ye(P,3)),c.push(F);let J=new yn({color:11713449,transparent:!0,opacity:.115,depthWrite:!1});l.push(J);let K=new Cn(F,J);K.name="Surviving hem fibers",X.add(K),Y.fray={geometry:F,rest:F.attributes.position.array.slice()}}let A=new U;function T(v,{touchPoint:R=null,strength:E=0}={}){for(let w of u)w.mesh.rotation.y=w.baseRotation.y+Math.sin(v*.057+w.phase)*w.amplitude,w.mesh.rotation.x=w.baseRotation.x+Math.sin(v*.043+w.phase*1.7)*w.amplitude*.55,w.mesh.rotation.z=w.baseRotation.z+Math.sin(v*.038+w.phase)*w.amplitude*.25,w.mesh.position.y=w.baseY+Math.sin(v*.063+w.phase)*.015;n.updateMatrixWorld(!0);for(let w of u){if(!w.cloth)continue;R&&E>1e-4&&(A.copy(R),w.mesh.worldToLocal(A));let x=R&&E>1e-4&&Math.abs(A.x)<w.width*.85&&Math.abs(A.y)<w.height*.55&&Math.abs(A.z)<2.4;if(x||w.lastContact){for(let S of[{geometry:w.mesh.geometry,rest:w.rest},w.fray]){let C=S.geometry.attributes.position,D=S.rest;for(let L=0;L<C.count;L++){let X=L*3,Y=D[X],I=D[X+1],P=D[X+2],F=0;if(x){let J=(Y-A.x)**2+(I-A.y)**2,K=jr((w.height*.5-I)/(w.height*.27),0,1);F=Math.exp(-J/2.8)*jr(E,0,1)*.25*K}C.setXYZ(L,Y,I,P+F)}C.needsUpdate=!0}w.mesh.geometry.computeVertexNormals()}w.lastContact=!!x}for(let w of h)w.anchor.copy(w.point).applyMatrix4(w.mesh.matrixWorld)}return T(0),{group:n,anchors:f,update:T,counts:{paperFragments:d.length,silkPieces:p.length,anchors:f.length,texturePlates:r.length},dispose(){for(let v of c)v.dispose();for(let v of l)v.dispose();m.dispose();for(let v of[...r,a,o,y])v.dispose()}}}var Ml=i=>()=>{let e=i+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296},Js=(i,e)=>.035*Math.sin(i*.47+e*.14)+.06*Math.sin(e*.31)+.024*Math.sin(i*1.6+e*.51),eh=`
float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise2(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(hash2(i),hash2(i+vec2(1,0)),f.x),
             mix(hash2(i+vec2(0,1)),hash2(i+vec2(1)),f.x),f.y);
}
float dapple(vec2 p) {
  float b = .52*noise2(p*.28+5.) + .30*noise2(p*.67-8.)
          + .18*noise2(p*1.62);
  // A broad, ordinary clearing and long soft shadows reaching out of the wood.
  float openingAxis=(p.x + .5 + p.y*.20)/2.2;
  float opening = exp(-openingAxis*openingAxis);
  float bands = smoothstep(.34,.68,noise2(vec2(p.x*.63+p.y*.19,p.y*.085)));
  return clamp(.23 + .27*smoothstep(.30,.63,b) + .56*opening - .18*bands, .23, 1.);
}
`;function th(i,e=!1){let t=Ml(i),n=document.createElement("canvas");n.width=1024,n.height=1024;let s=n.getContext("2d"),r=[];for(let o=0;o<24;o++){let l=t()*Math.PI*2,c=Math.sqrt(t());r.push({x:512+Math.cos(l)*320*c,y:445+Math.sin(l)*285*c,rx:80+t()*125,ry:55+t()*110})}for(let o=0;o<12500;o++){let l=r[Math.floor(t()*r.length)],c=t()*Math.PI*2,u=Math.sqrt(t()),f=l.x+Math.cos(c)*l.rx*u,h=l.y+Math.sin(c)*l.ry*u,d=t(),g=Math.max(0,.62-h/1100)*d,y=(e?57:25)+g*67+d*13,m=(e?66:35)+g*64+d*15,p=(e?40:21)+g*30+d*7;s.fillStyle=`rgba(${y|0},${m|0},${p|0},${.74+t()*.26})`,s.beginPath(),s.ellipse(f,h,3+t()*11,2+t()*5,t()*Math.PI,0,Math.PI*2),s.fill()}let a=new pn(n);return a.colorSpace=vt,a.anisotropy=4,a}function J_(){let i=Ml(330),e=document.createElement("canvas");e.width=e.height=512;let t=e.getContext("2d");t.fillStyle="#4a512d",t.fillRect(0,0,512,512);for(let s=0;s<38e3;s++){let r=i();t.fillStyle=r>.82?"#756b3c":r>.53?"#586132":r>.25?"#3d4828":"#293821";let a=i()*512,o=i()*512;t.fillRect(a,o,i()*3+1,i()*7+1)}let n=new pn(e);return n.wrapS=n.wrapT=Vi,n.repeat.set(12,14),n.colorSpace=vt,n.anisotropy=4,n}function $_(){let i=Ml(3817),e=document.createElement("canvas");e.width=256,e.height=512;let t=e.getContext("2d");for(let s=0;s<59;s++){let r=126+(i()-.5)*129,a=505-i()*19,o=100+Math.pow(i(),.55)*383,l=(i()-.5)*168,c=1.1+i()*2.7,u=i()>.86,f=i(),h=t.createLinearGradient(0,a,0,a-o);h.addColorStop(0,"#53663c"),h.addColorStop(.55,u?"#a4a072":`rgb(${110+f*31|0},${132+f*28|0},${68+f*21|0})`),h.addColorStop(1,u?"#c0b585":"#b3bd83"),t.fillStyle=h,t.beginPath(),t.moveTo(r-c,a),t.quadraticCurveTo(r+l*.2-c,a-o*.6,r+l,a-o),t.quadraticCurveTo(r+l*.2+c,a-o*.6,r+c,a),t.closePath(),t.fill()}let n=new pn(e);return n.colorSpace=vt,n.anisotropy=4,n}function Md({quality:i=1}={}){let e=Ml(271828),t=new Gi;t.background=new ze("#34432c"),t.fog=new _r("#536144",20,60);let n=new Ft(40,1024/1280,.06,80);n.position.set(0,1.12,3.4),n.lookAt(0,.04,-1.4);let s=i<.7?768:1536,r=new Ct(s,Math.round(s*1.25),{type:Ht,minFilter:Mt,magFilter:Mt,depthBuffer:!0,stencilBuffer:!1,samples:4});r.texture.name="Ordinary daylight",t.add(new Yi("#d7dfbb","#303626",2));let a=new Zi("#fff1c0",3);a.position.set(-9,12,3),t.add(a);let o=J_(),l=new Vt(42,48,80,80);l.rotateX(-Math.PI/2);let c=l.attributes.position;for(let he=0;he<c.count;he++){let Me=c.getX(he),ue=c.getZ(he)-12;c.setXYZ(he,Me,Js(Me,ue)-.022,ue)}l.computeVertexNormals();let u=new mt({uniforms:gn.merge([Ie.fog,{uGround:{value:o}}]),fog:!0,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      varying vec2 vGroundPosition;
      void main(){
        vGroundPosition=position.xz;
        vec4 mvPosition=modelViewMatrix*vec4(position,1.);
        gl_Position=projectionMatrix*mvPosition;
        #include <fog_vertex>
      }
    `,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform sampler2D uGround;
      varying vec2 vGroundPosition;
      ${eh}
      void main(){
        vec2 p=vGroundPosition;
        float detail=texture2D(uGround,p*.32).g;
        float moss=noise2(p*3.5)*.6+noise2(p*13.)*.4;
        vec3 col=mix(vec3(.065,.083,.030),vec3(.145,.177,.056),moss);
        col*=.70+detail*1.8;
        col*=mix(vec3(.48,.64,.68),vec3(1.8,1.48,.89),dapple(p));
        gl_FragColor=vec4(col,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }
    `});t.add(new Ke(l,u));let f=Math.round(1e4*Math.min(1.2,Math.max(.35,i))),h=new Pr,d=[],g=[],y=[],m=4;for(let he=0;he<=m;he++){let Me=he/m;if(d.push(-.5,Me,0,.5,Me,0),g.push(0,Me,1,Me),he<m){let ue=he*2;y.push(ue,ue+1,ue+2,ue+1,ue+3,ue+2)}}h.setAttribute("position",new Ye(d,3)),h.setAttribute("uv",new Ye(g,2)),h.setIndex(y);let p=new Float32Array(f*3),A=new Float32Array(f*4),T=new Float32Array(f*2);for(let he=0;he<f;he++){let Me=e()<.86,ue=Me?3.5-Math.pow(e(),.87)*12:-8-e()*24,pe=Me?3.2+(3.5-ue)*.26:14,Pe=(e()-.5)*pe*2;p.set([Pe,Js(Pe,ue),ue],he*3);let N=e()>.91,V=.5+.5*Math.sin(Pe*2.3+ue*1.6)*Math.sin(Pe*.7-ue*1.8),ae=1-.55*Math.exp(-Math.pow((Pe-1.3-ue*.04)/1.1,2))*.32;A.set([(.09+Math.pow(e(),1.8)*.26+(N?.11:0))*ae*(.7+V*.65),N?.006+e()*.009:.009+e()*.016,e()*Math.PI*2,(e()-.5)*.25],he*4),T.set([e()*.75+V*.25,N?1:0],he*2)}h.setAttribute("origin",new Kn(p,3)),h.setAttribute("shape",new Kn(A,4)),h.setAttribute("shade",new Kn(T,2)),h.instanceCount=f;let v={uTime:{value:0}},R=new mt({uniforms:v,side:St,fog:!0,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      attribute vec3 origin;
      attribute vec4 shape;
      attribute vec2 shade;
      uniform float uTime;
      varying float vHeight;
      varying vec2 vShade;
      varying vec2 vField;
      varying float vFace;
      void main() {
        float t=position.y;
        float taper=pow(max(0.,1.-t),.72);
        float bend=shape.w*t*t;
        float wave=sin(uTime*.63+origin.x*.33+origin.z*.29)
                  +.35*sin(uTime*1.19+origin.x*.78-origin.z*.43);
        vec3 p=vec3(position.x*shape.y*taper+bend,t*shape.x,0.);
        float c=cos(shape.z),s=sin(shape.z);
        p.xz=mat2(c,-s,s,c)*p.xz;
        p.x+=wave*.018*t*t;
        p.z+=wave*.010*t*t;
        p.y-=abs(shape.w)*t*t*.17;
        p+=origin;
        vHeight=t;vShade=shade;vField=origin.xz;
        vFace=.68+.32*abs(dot(vec2(s,c),normalize(vec2(-.8,.4))));
        vec4 mvPosition=modelViewMatrix*vec4(p,1.);
        gl_Position=projectionMatrix*mvPosition;
        #include <fog_vertex>
      }
    `,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      varying float vHeight;
      varying vec2 vShade;
      varying vec2 vField;
      varying float vFace;
      ${eh}
      void main() {
        vec3 green=mix(vec3(.063,.105,.033),vec3(.16,.22,.068),vShade.x);
        vec3 dry=mix(vec3(.16,.147,.070),vec3(.33,.30,.15),vShade.x);
        vec3 col=mix(green,dry,vShade.y);
        float light=dapple(vField);
        col*=mix(vec3(.44,.63,.66),vec3(2.05,1.73,1.02),light)*vFace;
        col*=mix(.62,1.0,pow(max(0.,vHeight),.55));
        col+=vec3(.072,.068,.021)*pow(max(0.,vHeight),3.)*light;
        gl_FragColor=vec4(col,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }
    `});Object.assign(R.uniforms,gn.clone(Ie.fog));let E=new Ke(h,R);E.frustumCulled=!1,t.add(E);let w=$_(),x=new Vt(1,1,1,3);x.translate(0,.5,0);let S=new xi({map:w,color:"#bbcaac",alphaTest:.35,alphaToCoverage:!0,side:St,fog:!0});S.onBeforeCompile=he=>{he.uniforms.uTime=v.uTime,he.vertexShader=he.vertexShader.replace("#include <common>",`#include <common>
uniform float uTime;
varying vec2 vTuftField;`),he.vertexShader=he.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
vTuftField=(instanceMatrix*vec4(position,1.)).xz;
transformed.x+=sin(uTime*.62+vTuftField.x*.3+vTuftField.y*.4)*.014/max(length(instanceMatrix[0].xyz),.01)*uv.y*uv.y;`),he.fragmentShader=he.fragmentShader.replace("#include <common>",`#include <common>
varying vec2 vTuftField;
`+eh),he.fragmentShader=he.fragmentShader.replace("#include <map_fragment>",`#include <map_fragment>
diffuseColor.rgb*=mix(vec3(.38,.56,.59),vec3(1.45,1.23,.72),dapple(vTuftField));`)};let C=Math.round(16e3*Math.min(1.2,Math.max(.35,i))),D=new yi(x,S,C),L=new Et,X=new ze;for(let he=0;he<C;he++){let Me=e()<.88,ue=Me?3.2-Math.pow(e(),.87)*15:-10-e()*23,pe=(e()-.5)*(Me?5.1+(3.2-ue)*.55:29),Pe=.73+.28*Math.sin(pe*2.2-ue*.61)*Math.sin(pe*.9+ue*1.7);L.position.set(pe,Js(pe,ue),ue),L.rotation.set(0,e()*Math.PI*2,(e()-.5)*.09),L.scale.set((.22+e()*.19)*Pe,(.075+e()*.11)*Pe,1),L.updateMatrix(),D.setMatrixAt(he,L.matrix);let N=.78+e()*.24;X.setRGB(N,N,N*(.88+e()*.12)),D.setColorAt(he,X)}t.add(D);let Y=w.clone();Y.wrapS=Vi,Y.repeat.set(110,1);let I=S.clone();I.map=Y,I.onBeforeCompile=S.onBeforeCompile;let P=new yi(x,I,110);for(let he=0;he<110;he++){let Me=-10-he*.19+e()*.16;L.position.set((e()-.5)*.7,Js(0,Me),Me),L.rotation.set(0,(e()-.5)*.13,0),L.scale.set(38,.15+e()*.14,1),L.updateMatrix(),P.setMatrixAt(he,L.matrix)}t.add(P);let F=[],J=[],K=[];for(let he=0;he<155;he++){let Me=(e()-.5)*16,ue=2-e()*25,pe=.25+e()*.34,Pe=(e()-.5)*.18,N=Js(Me,ue),V=M=>[Me+Pe*M*M,N+pe*M,ue+Math.sin(he)*M*M*.09];for(let M=0;M<5;M++)F.push(...V(M/5),...V((M+1)/5));let ae=4+Math.floor(e()*5);for(let M=0;M<ae;M++){let _=.69+M/ae*.3,O=V(_),z=M%2===0?1:-1,H=[O[0]+z*(.028+e()*.06)*(1-_+.3),O[1]+.025,O[2]+(e()-.5)*.04];F.push(...O,...H),J.push(...H),K.push(.6+e()*.4)}}let oe=new at;oe.setAttribute("position",new Ye(F,3));let me=new yn({color:"#908c61",transparent:!0,opacity:.5}),de=new Cn(oe,me);t.add(de);let we=new at;we.setAttribute("position",new Ye(J,3)),we.setAttribute("shade",new Ye(K,1));let Ge=new mt({transparent:!0,depthWrite:!1,uniforms:{uResolution:{value:s}},vertexShader:`
      attribute float shade;
      uniform float uResolution;
      varying float vShade;
      void main(){
        vec4 p=modelViewMatrix*vec4(position,1.);
        gl_Position=projectionMatrix*p;
        gl_PointSize=clamp(uResolution*.015/-p.z,1.,5.);
        vShade=shade;
      }
    `,fragmentShader:`
      varying float vShade;
      void main(){
        vec2 p=(gl_PointCoord-.5)*vec2(2.,1.);
        float a=1.-smoothstep(.24,.5,length(p));
        if(a<.05)discard;
        gl_FragColor=vec4(vec3(.43,.35,.145)*vShade,a*.9);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `});t.add(new Xi(we,Ge));let Re=new Ds({color:"#303429"}),te=new Ds({color:"#242f22"}),_e=new yn({color:"#424836",transparent:!0,opacity:.75}),Ce=[th(813,!0),th(1287,!1),th(619,!1)].map(he=>new xi({map:he,transparent:!0,alphaTest:.22,depthWrite:!0,side:St,color:"#b9c39c",fog:!0})),ke=new Vt(1,1),Ue=[],et=[];for(let he=0;he<21;he++){let Me=(e()-.5)*49,ue=-22-e()*15,pe=3.8+e()*7.2,Pe=.11+e()*.15,N=new Ke(new Qn(Pe*.46,Pe,pe,5,1),he%2?Re:te);N.position.set(Me,pe*.5+Js(Me,ue),ue),N.rotation.z=(e()-.5)*.21,t.add(N),Ue.push(N);for(let V=0;V<4;V++){let ae=pe*(.3+e()*.5),M=Me+(e()-.5)*4,_=ae+1+e()*2;et.push(Me,ae,ue,M,_,ue+(e()-.5)*2)}}let Z=new at;Z.setAttribute("position",new Ye(et,3)),t.add(new Cn(Z,_e));let ye=[];for(let he=0;he<3;he++)for(let Me=0;Me<10;Me++){let ue=new Ke(ke,Ce[he]),pe=7+e()*5,Pe=5+e()*4;ue.scale.set(pe,Pe,1),ue.position.set(-27+Me*6+(e()-.5)*2,(he===0?1.8:2.1)+e()*1.7,-35+he*5+(e()-.5)*2),ue.rotation.z=(e()-.5)*.34,ue.userData.restX=ue.position.x,t.add(ue),ye.push(ue)}for(let he=0;he<24;he++){let Me=new Ke(ke,Ce[1+he%2]);Me.scale.set(3.5+e()*3,2.3+e()*2.3,1),Me.position.set(-24+he*2.1+(e()-.5)*1.4,.9+e()*.9,-20-e()*7),Me.rotation.z=(e()-.5)*.4,Me.userData.restX=Me.position.x,t.add(Me),ye.push(Me)}for(let he=0;he<5;he++){let Me=new Ke(ke,Ce[1+he%2]);Me.scale.set(10+e()*6,8+e()*4,1),Me.position.set(-13+he*6,9.8+e()*2,-23+e()*3),Me.userData.restX=Me.position.x,t.add(Me),ye.push(Me)}let Se=new U;function Ee(he,Me=0,ue=0){v.uTime.value=he,n.position.set(Me*.12,1.26+ue*.025,3.4),Se.set(Me*.028,.43+ue*.012,-5.4),n.lookAt(Se),ye.forEach((pe,Pe)=>{pe.position.x=pe.userData.restX+Math.sin(he*.12+Pe*1.7)*.022})}function Oe(){let he=new Set,Me=new Set,ue=new Set;t.traverse(pe=>{pe.geometry&&!he.has(pe.geometry)&&(pe.geometry.dispose(),he.add(pe.geometry));let Pe=Array.isArray(pe.material)?pe.material:[pe.material];for(let N of Pe)if(N&&!Me.has(N)){for(let V of Object.values(N))V?.isTexture&&!ue.has(V)&&(V.dispose(),ue.add(V));N.dispose(),Me.add(N)}}),o.dispose(),r.dispose()}return Ee(0),{scene:t,camera:n,target:r,update:Ee,dispose:Oe}}var bd=[{at:17,length:16,anchor:18,end:[-1.62,6.68,-6.85]},{at:34,length:18,anchor:39,end:[1.67,3.15,-6.8],unfinished:.74},{at:49,length:16,anchor:4,end:[-1.57,4.1,-6.8]},{at:66,length:20,anchor:68,end:[1.55,6.69,-6.8]},{at:82,length:18,anchor:52,end:[.4,2.69,-6.8]},{at:103,length:19,anchor:94,end:[-1.55,3.4,-6.8],unfinished:.83},{at:127,length:16,anchor:14,end:[.2,6.72,-6.8]},{at:151,length:21,anchor:78,end:[1.57,5.5,-6.8],unfinished:.67}];function Sd(i){let e=new At,t=[];for(let n=0;n<bd.length;n++){let s=bd[n],r=i[s.anchor%i.length].clone(),a=new U(...s.end),o=r.clone().lerp(a,.55);o.y-=1.1+n%3*.4,o.z+=1.5;let l=new Pn([r,r.clone().lerp(o,.6),o,a]),c=new Er(l,170,.012,5,!1),u=new mt({transparent:!0,depthWrite:!1,uniforms:{uProgress:{value:0},uSettled:{value:0}},vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec2 vUv;uniform float uProgress,uSettled;
      void main(){if(vUv.x>uProgress)discard;float tip=exp(-pow((vUv.x-uProgress)/.026,2.))*(1.-uSettled);
      vec3 c=mix(vec3(.34,.32,.23),vec3(.93,.8,.48),tip*.65);gl_FragColor=vec4(c,.24+tip*.4);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`}),f=new Ke(c,u);f.visible=!1,e.add(f),t.push({mesh:f,e:s})}return{group:e,update(n){for(let{mesh:s,e:r}of t){let a=sn.clamp((n-r.at)/r.length,0,1),o=r.unfinished||1;s.visible=a>0,s.material.uniforms.uProgress.value=a*a*(3-2*a)*o,s.material.uniforms.uSettled.value=sn.smoothstep(n,r.at+r.length,r.at+r.length+5)}},dispose(){for(let n of t)n.mesh.geometry.dispose(),n.mesh.material.dispose()}}}function Td(){let i=new At,e=[],t=document.createElement("canvas");t.width=256,t.height=1024;let n=t.getContext("2d");n.fillStyle="#51483b",n.fillRect(0,0,256,1024);for(let x=0;x<256;x++){let S=.04+.08*(.5+.5*Math.sin(x*31.74));n.strokeStyle=`rgba(17,20,18,${S})`,n.lineWidth=1,n.beginPath();for(let C=0;C<=1024;C+=8){let D=x+Math.sin(C*.011+x*.21)*2.5+Math.sin(C*.035)*.8;C?n.lineTo(D,C):n.moveTo(D,C)}n.stroke()}let s=new pn(t);s.colorSpace=vt,s.anisotropy=8;let r=new en({map:s,color:"#877459",roughness:.92,bumpMap:s,bumpScale:.014}),a=new en({color:"#605b45",roughness:.77,metalness:.42}),o=new en({color:"#b4b3a0",roughness:1});function l(x,S,C,D=r){let L=new U(...x),X=new U(...S),Y=X.clone().sub(L),I=new Ke(new Qn(C*.96,C,Y.length(),12,1),D);return I.position.copy(L).add(X).multiplyScalar(.5),I.quaternion.setFromUnitVectors(new U(0,1,0),Y.normalize()),I.castShadow=I.receiveShadow=!0,i.add(I),I}l([-17.8,1.2,-10],[-17.2,23,-10.7],.26),l([17.4,.9,-11],[17.1,24,-11.6],.24);let c=l([-19,18.6,-9.7],[19,18.6,-9.7],.32);e.push(c),l([-17.5,13.1,-9.5],[17.4,13.05,-9.5],.105),l([-15,9.4,-9.2],[15.1,9.48,-9.2],.064),l([-16.8,3.3,-10],[16.8,3.25,-10],.12);let u=new At;i.add(u);let f=[new At,new At];u.add(...f);let h=new Is(.045,.008,4,10),d=new Qn(.006,.006,3.7,4);for(let x=0;x<100;x++){if(x%11===0||x%17===0)continue;let S=-13.5+x*.27,C=new Ke(h,a);C.position.set(S,11.7,-9.2+x%2*.07),f[x%2].add(C);let D=new Ke(d,a);D.position.set(S,11.1,-9.2+x%2*.07),f[x%2].add(D)}let g=new At;i.add(g);for(let x=0;x<11;x++){let S=-12+x*2.36,C=l([S-.28,18.6,-9.7],[S+.28,18.6,-9.7],.36,o);C.material=o;let D=[S-.31,S+.31];for(let L of D)l([L-.025,18.6,-9.7],[L+.025,18.6,-9.7],.44,r)}let y=new At;y.position.set(-2,7.35,-7.6),i.add(y);let m=[new Le(0,-.65),new Le(.055,-.53),new Le(.09,-.28),new Le(.095,.25),new Le(.055,.5),new Le(0,.65)],p=new Ke(new Tr(m,16),r);p.rotation.z=Math.PI/2,p.scale.set(1,.9,.68),p.castShadow=!0,y.add(p);let A=new Ke(new Qn(.065,.065,.35,12),o);A.rotation.z=Math.PI/2,A.position.z=.025,y.add(A);let T=new Ke(new Is(.077,.012,5,18),a);T.rotation.y=Math.PI/2,y.add(T);let v=(x,S,C)=>{let D=sn.clamp((C-x)/(S-x),0,1);return D*D*(3-2*D)},R=c.quaternion.clone(),E=new on,w=[[12,22],[26,32],[35,43],[47,57],[63,79]];return{group:i,update(x,S=0,C={}){let D=-4.1,L=0,X=0;for(let I=0;I<w.length;I++){let[P,F]=w[I],J=v(P,F,x),K=I%2?-1:1;D+=K*8.2*J,X+=J,x>=P&&x<=F&&(L=Math.sin(J*Math.PI)*K)}let Y=C.unfolding||0;for(let I=0;I<2;I++){let P=I?1:-1;f[I].position.y=P*(L*.22+Y*.14),f[I].position.z=P*(L*.08+Y*.11)}y.position.set(D,7.35+Math.abs(L)*.07+Math.min(S,.1)*.13,-7.6+Y*.16),y.rotation.z=L*.025,E.setFromAxisAngle(new U(0,1,0),X*.07),c.quaternion.copy(R).multiply(E)},dispose(){i.traverse(x=>x.geometry?.dispose()),r.dispose(),a.dispose(),o.dispose(),s.dispose()}}}var ih=Math.PI*2,ot=(i=0,e=0,t=0)=>new U(i,e,t),sh=i=>Math.max(0,Math.min(1,i)),an=(i,e,t)=>{let n=sh((t-i)/(e-i));return n*n*(3-2*n)},Ad=ot(0,1,0);function Rd(i){return()=>{let e=i+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function Ed(i=0){let e=Number.isFinite(i)?Math.max(0,i):0;return{returning:an(30,72,e),unfolding:an(72,113,e),bloom:an(112,149,e),settled:an(150,172,e),shuttle:an(22,35,e)*(1-.78*an(112,162,e)),wind:.12+.88*an(90,145,e)}}function K_(i){let e=document.createElement("canvas");e.width=e.height=i<.7?512:1024;let t=e.getContext("2d");t.scale(e.width/1024,e.height/1024),t.fillStyle="#dedfd0",t.fillRect(0,0,1024,1024);let n=Rd(732011);for(let r=0;r<380;r++){let a=r*2.7;t.strokeStyle=`rgba(96,100,77,${.018+n()*.042})`,t.lineWidth=.5+n()*.55,t.beginPath(),t.moveTo(0,a),t.bezierCurveTo(340,a+1.4,720,a-.6,1024,a+.8),t.stroke(),t.beginPath(),t.moveTo(a,0),t.bezierCurveTo(a+1,370,a-.8,760,a+.5,1024),t.stroke()}t.strokeStyle="rgba(65,79,53,.57)",t.lineWidth=5.6,t.beginPath(),t.moveTo(512,1024),t.bezierCurveTo(511,690,513,230,512,0),t.stroke();for(let r=1;r<20;r++){let a=r/21;for(let o of[-1,1]){let l=1024*(1-a),c=l-85,u=452*Math.pow(Math.sin(Math.PI*Math.min(.98,a+.07)),.78);t.strokeStyle="rgba(70,84,54,.43)",t.lineWidth=2.8,t.beginPath(),t.moveTo(512,l),t.bezierCurveTo(512+o*u*.33,l-41,512+o*u*.72,c+14,512+o*u,c),t.stroke();for(let f=1;f<5;f++){let h=f/5;t.strokeStyle="rgba(87,98,67,.23)",t.lineWidth=1.1,t.beginPath(),t.moveTo(512+o*u*h,l-85*h),t.quadraticCurveTo(512+o*u*(h+.08),l-85*h-32,512+o*u*Math.min(1,h+.16),l-85*h-52),t.stroke()}}}let s=new pn(e);return s.colorSpace=vt,s.anisotropy=8,s.minFilter=ln,s.magFilter=Mt,s.name="Copperplate veins surviving in woven linen",s}function j_(i=0){let e=[],t=[],n=[];for(let o=0;o<=32;o++)for(let l=0;l<=12;l++){let c=o/32,u=l/12*2-1,f=Math.pow(Math.max(0,Math.sin(c*Math.PI)),i===2?1.1:.84),h=i===1?1-.33*Math.pow(Math.sin(c*Math.PI*10),2):1,d=(i===0?.145:i===1?.12:.225)*f*h,g=1+u*.17*Math.sin(c*4.7+i),y=i===2&&u>0?1-.32*an(.59,.69,c)*(1-an(.74,.82,c)):1,m=u*d*g*y+(i===0?.042:-.018)*c*c,p=.026*Math.sin(c*Math.PI)*(1-Math.abs(u))+.13*Math.pow(Math.abs(u),1.65)*f+.12*c*c+.018*u*Math.sin(c*6.4);e.push(m,c,p),t.push(l/12,c)}for(let o=0;o<32;o++)for(let l=0;l<12;l++){let c=o*13+l,u=c+12+1;n.push(c,u,c+1,u,u+1,c+1)}let a=new at;return a.setAttribute("position",new Ye(e,3)),a.setAttribute("uv",new Ye(t,2)),a.setIndex(n),a.computeVertexNormals(),a}function wd(i,e=5){let t=new at,n=new Float32Array((i+1)*(e+1)*3),s=n.slice(),r=new Float32Array((i+1)*(e+1)*2),a=[];for(let o=0;o<=i;o++)for(let l=0;l<=e;l++){let c=o*(e+1)+l;if(r[c*2]=l/e,r[c*2+1]=o/i,o<i&&l<e){let u=c,f=u+e+1;a.push(u,f,u+1,u+1,f,f+1)}}return t.setAttribute("position",new Rt(n,3).setUsage(ji)),t.setAttribute("normal",new Rt(s,3).setUsage(ji)),t.setAttribute("uv",new Rt(r,2)),t.setIndex(a),t}var Cd={tangent:ot(),normal:ot(),binormal:ot(),previousNormal:ot(),direction:ot(),point:ot()};function nh(i,e,t,n=!1,s=0,r=null){let a=i.attributes.position,o=i.attributes.normal,l=r??a.count/e.length-1,{tangent:c,normal:u,binormal:f,previousNormal:h}=Cd;for(let d=0;d<e.length;d++){c.subVectors(e[Math.min(d+1,e.length-1)],e[Math.max(0,d-1)]),c.lengthSq()<1e-12?c.set(0,1,0):c.normalize(),d?(u.copy(h).addScaledVector(c,-h.dot(c)),u.lengthSq()<1e-10&&u.crossVectors(c,ot(1,0,0)),u.normalize()):u.crossVectors(c,Math.abs(c.y)>.94?ot(1,0,0):Ad).normalize(),h.copy(u),f.crossVectors(c,u).normalize();let g=t*(n?.95-.75*d/(e.length-1):1);for(let y=0;y<=l;y++){let m=y/l*ih,p=u.x*Math.cos(m)+f.x*Math.sin(m),A=u.y*Math.cos(m)+f.y*Math.sin(m),T=u.z*Math.cos(m)+f.z*Math.sin(m),v=s+d*(l+1)+y;a.setXYZ(v,e[d].x+p*g,e[d].y+A*g,e[d].z+T*g),o.setXYZ(v,p,A,T)}}a.needsUpdate=o.needsUpdate=!0}function Pd({anchors:i=[],physics:e,quality:t=1}={}){let n=new At;n.name="What the daylight grows in return";let s=Rd(817903),r=new Float32Array(e.positions.length/3),a=[],o=[],l=[],c=[],u=[],f=[],h=new Float32Array(6),d=Ed(0),g=[ot(-8,5,-2),ot(8,7,-3),ot(-8,10,-5),ot(9,3,-2),ot(-12,2.4,3),ot(13,2.5,3)],y=new Set,m=K_(t),p=[0,1,2].map(j_);a.push(...p);let A=new ei({map:m,bumpMap:m,bumpScale:.009,color:16777215,side:St,roughness:.94,metalness:0,sheen:.5,sheenRoughness:.9,sheenColor:14999240,specularIntensity:.1,emissive:12233089,emissiveIntensity:.028});o.push(A);let T=new en({color:10988675,roughness:.92,metalness:0,emissive:10586709,emissiveIntensity:.07});o.push(T);let v=new ze("#a8ae90"),R=new ze("#e3dfc9"),E=new Et,w=new on,x=new ze,S=0,C=null,D=!1,L=[],X=(Z,ye,Se=!1,Ee=ot())=>{let Oe=(e.offsets[Z]+ye)*3,he=Se?e.restPositions:e.positions;return Ee.set(he[Oe],he[Oe+1],he[Oe+2])};function Y(Z,ye){let Se=0,Ee=1/0;for(let Oe=0;Oe<e.counts[Z];Oe++){let he=X(Z,Oe,!0,Cd.point).distanceToSquared(ye);he<Ee&&(Ee=he,Se=Oe)}return{node:Se,distance:Ee}}function I(Z,ye,Se,Ee,Oe,he,Me=!0){let pe=wd(112,4);Me&&a.push(pe);let Pe={uFront:{value:-1},uPulse:{value:0},uWake:{value:0}},N=new en({color:13221007,roughness:.87,transparent:!0,opacity:.33,depthWrite:!1,emissive:16308629,emissiveIntensity:.02});Me&&o.push(N),N.onBeforeCompile=M=>{Object.assign(M.uniforms,Pe),M.vertexShader=M.vertexShader.replace("#include <common>",`#include <common>
varying float vRouteProgress;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vRouteProgress = uv.y;`),M.fragmentShader=M.fragmentShader.replace("#include <common>",`#include <common>
varying float vRouteProgress; uniform float uFront; uniform float uPulse; uniform float uWake;`),M.fragmentShader=M.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
float along = (vRouteProgress-uFront)*19.0; float arriving = exp(-along*along)*uPulse;
totalEmissiveRadiance += vec3(1.0,.69,.28)*(arriving*.66+uWake*.025);
diffuseColor.a *= .52+arriving*1.6+uWake*.35;`)},N.customProgramCacheKey=()=>"bloom-continuous-return-route-v1";let V=new Ke(pe,N);V.name=Me?"A thread carrying daylight back to its paper":"The route left by a hand",V.frustumCulled=!1,n.add(V);let ae={root:Z,origin:ye,rope:Se,from:Ee,to:Oe,plantIndex:he,authored:Me,mesh:V,geometry:pe,uniforms:Pe,points:Array.from({length:113},()=>ot()),lengths:[],guideProgress:[],distance:0};return P(ae),ae}function P(Z){let ye=[],Se=[],Ee=Z.to>=Z.from?1:-1,Oe=X(Z.rope,Z.from),he=Z.authored?Z.origin:Oe;ye.push(he.clone()),Z.authored&&ye.push(he.clone().lerp(Oe,.5).add(ot(0,-.12,.035)));for(let pe=Z.from;Se.push({point:ye.length,node:pe}),ye.push(X(Z.rope,pe)),pe!==Z.to;pe+=Ee);let Me=ye.at(-1);ye.push(Me.clone().lerp(Z.root,.5).add(ot(0,-.11,.045)),Z.root.clone());let ue=new Pn(ye,!1,"centripetal");ue.getPoints(Z.points.length-1).forEach((pe,Pe)=>Z.points[Pe].copy(pe)),Z.guideProgress=Se.map(({point:pe,node:Pe})=>({node:Pe,u:pe/(ye.length-1)})),Z.distance=ue.getLength(),nh(Z.geometry,Z.points,Z.authored?.012:.009)}for(let Z=0;Z<g.length;Z++){let ye=-1,Se=1/0;if(i.forEach((ie,j)=>{let W=ie.distanceToSquared(g[Z]);!y.has(Math.floor(j/4))&&W<Se&&(Se=W,ye=j)}),ye<0)continue;y.add(Math.floor(ye/4));let Ee=i[ye],Oe=Ee.x<0?-1:1,he=ot(Oe*1.52,Oe<0?6.58:2.82,-6.88),Me=0,ue=0,pe=0,Pe=1/0;for(let ie=0;ie<e.counts.length;ie++){let j=Y(ie,he),W=Y(ie,Ee),$=j.distance*.62+W.distance+(Math.abs(j.node-W.node)<6?16:0);$<Pe&&(Pe=$,Me=ie,ue=j.node,pe=W.node)}let N=I(Ee,he,Me,ue,pe,Z);N.start=31+Z*4.7,N.duration=18+Z*.65,l.push(N);let V=Z>=4,ae=-Oe,M=V?[ot(),ot(ae*.55,-.65,.6),ot(ae*1.5,-Ee.y+.065,1.3),ot(ae*3.1,-Ee.y+.21,1.8),ot(ae*3.8,-Ee.y+1.45,1.55)]:[ot(),ot(ae*.7,.6,.65),ot(ae*1.7,2,1.1),ot(ae*3,3.65,.7),ot(ae*4,4.3,.3),ot(ae*4.55,3.82,.65)];Z===2&&M.forEach((ie,j)=>{ie.y*=-.55,ie.x*=.85,ie.z+=j*.12}),Z===1&&M.forEach(ie=>{ie.y*=.5,ie.x*=.92});let _=new Pn(M,!1,"centripetal"),O=wd(88,5);a.push(O);let z=new Ke(O,T);z.name=`Botanical plate ${Math.floor(ye/4)+1}, leaving the page`,z.castShadow=!0,z.receiveShadow=!0,z.frustumCulled=!1,n.add(z);let H={index:Z,anchorIndex:ye,root:Ee,side:Oe,lower:V,route:N,curve:_,mesh:z,stem:O,points:Array.from({length:89},()=>ot()),growth:0,phase:s()*ih,leafStart:L.length,leafCount:[24,13,19,12,9,13][Z]};for(let ie=0;ie<H.leafCount;ie++){let j=.075+(ie+(s()-.5)*.58)/H.leafCount*.84,W=(ie+(ie%7===0?1:0))%2?1:-1,$=[1,0,0,2,0,1][Z],ce=[1.27,1.78,1.5,1.14,1.32,1.05][Z]*(.64+s()*.55)*(.47+.53*Math.sin(j*Math.PI));L.push({plant:H,u:j,side:W,length:ce,species:$,width:.78+s()*.37,petiole:.14+s()*.44,azimuth:(s()-.5)*1.15,roll:(s()-.5)*1.06,phase:s()*ih,variation:s()})}c.push(H)}let F=p.map((Z,ye)=>{let Se=new yi(Z,A,L.filter(Ee=>Ee.species===ye).length);return Se.name=["Slender pressed willow leaves lifting into air","Incised fern pinnae woven from linen","Uneven folded ovate remnants"][ye],Se.instanceMatrix.setUsage(ji),Se.frustumCulled=!1,Se.castShadow=!0,Se.receiveShadow=!0,n.add(Se),Se}),J=[0,0,0];L.forEach(Z=>{Z.instanceIndex=J[Z.species]++});let K=8,oe=4,me=(K+1)*(oe+1),de=new at,we=new Float32Array(L.length*me*3),Ge=[];for(let Z=0;Z<L.length;Z++)for(let ye=0;ye<K;ye++)for(let Se=0;Se<oe;Se++){let Ee=Z*me+ye*(oe+1)+Se,Oe=Ee+oe+1;Ge.push(Ee,Oe,Ee+1,Ee+1,Oe,Oe+1)}de.setAttribute("position",new Rt(we,3).setUsage(ji)),de.setAttribute("normal",new Rt(we.slice(),3).setUsage(ji)),de.setIndex(Ge),a.push(de);let Re=new Ke(de,T);Re.name="Irregular petioles carry the unfolding leaves",Re.frustumCulled=!1,Re.castShadow=!0,n.add(Re);let te=Array.from({length:K+1},()=>ot()),_e=(Z,ye,Se,Ee=ot())=>{Z.curve.getPoint(sh(ye),Ee);let Oe=Math.pow(sh(ye),1.6),he=Math.sin(Se*.31+Z.phase+ye*2.4);return Ee.x+=he*.053*Oe*d.wind,Ee.z+=Math.sin(Se*.24+Z.phase+ye*3.1)*.079*Oe*d.wind,Ee.add(Z.root),Z.lower&&(Ee.y=Math.max(.042,Ee.y)),Ee};function fe(Z,ye,Se,Ee=0){Z.uniforms.uFront.value=ye,Z.uniforms.uPulse.value=Se,Z.uniforms.uWake.value=Ee;for(let{node:Oe,u:he}of Z.guideProgress){let Me=e.offsets[Z.rope]+Oe,ue=Math.exp(-(((he-ye)*14)**2))*Se;r[Me]=Math.min(1,r[Me]+ue),Oe>0&&(r[Me-1]=Math.min(1,r[Me-1]+ue*.32)),Oe+1<e.counts[Z.rope]&&(r[Me+1]=Math.min(1,r[Me+1]+ue*.32))}}function Ce(Z=0,{dt:ye=0,deterministic:Se=!1,reducedMotion:Ee=!1,paused:Oe=!1}={}){Z=Number.isFinite(Z)?Math.max(0,Z):0,D=Se,!Se&&!Oe&&Number.isFinite(ye)&&(S+=Math.max(0,Math.min(.1,ye))),Object.assign(d,Ed(Z)),r.fill(0);let he=Ee?105:Z,Me=Se?new Float32Array(6):h.slice();for(let ue of l){P(ue);let pe=Z-ue.start,Pe=pe/ue.duration,N=Pe>=-.1&&Pe<=1.14,V=an(ue.start,ue.start+ue.duration,Z);ue.mesh.visible=Z>=ue.start-3,fe(ue,Pe,N?.9:0,V)}if(!Se)for(let ue=u.length-1;ue>=0;ue--){let pe=u[ue],Pe=S-pe.start,N=Pe/pe.duration;if(P(pe.route),fe(pe.route,N,N<=1.13?.68:0,.3),!pe.arrived&&Pe>=pe.duration){pe.arrived=!0;let ae=c[pe.plantIndex],M=ae.root;f.push({plantIndex:pe.plantIndex,energy:pe.energy,potency:pe.potency,material:ae.lower?"water":ae.index%2?"leaf":"linen",root:{x:M.x,y:M.y,z:M.z}}),f.length>24&&f.shift()}let V=an(pe.duration,pe.duration+13,Pe);Me[pe.plantIndex]=Math.min(1,Me[pe.plantIndex]+pe.potency*V),Pe>=pe.duration+13&&(h[pe.plantIndex]=Math.min(.72,h[pe.plantIndex]+pe.potency),n.remove(pe.route.mesh),pe.route.geometry.dispose(),pe.route.mesh.material.dispose(),u.splice(ue,1))}for(let ue of u)ue.route.mesh.visible=!Se;for(let ue of c){let pe=an(68+ue.index*4.5,129+ue.index*3.2,Z);ue.growth=Math.min(1,pe*.86+Me[ue.index]*.48),ue.mesh.visible=ue.growth>1e-4;for(let Pe=0;Pe<ue.points.length;Pe++)_e(ue,Math.min(Pe/(ue.points.length-1),ue.growth),he,ue.points[Pe]);nh(ue.stem,ue.points,ue.lower?.021:.026,!0)}for(let ue=0;ue<L.length;ue++){let pe=L[ue],Pe=pe.plant,N=an(pe.u,pe.u+.23,Pe.growth),V=_e(Pe,pe.u,he),ae=_e(Pe,Math.max(0,pe.u-.01),he),_=_e(Pe,Math.min(1,pe.u+.01),he).sub(ae).normalize(),O=ot(-_.y,_.x,.08).normalize().multiplyScalar(pe.side).applyAxisAngle(_,pe.azimuth),z=_.clone().multiplyScalar(.32).addScaledVector(O,.83*N+.08).add(ot(0,.07,.19)).normalize();Pe.lower&&V.y<1.4&&(z.y=Math.abs(z.y)*.54+.26,z.normalize());for(let j=0;j<=K;j++){let W=j/K;te[j].copy(V).addScaledVector(z,pe.petiole*N*W).addScaledVector(_,Math.sin(W*Math.PI)*.035*N)}nh(de,te,Math.max(1e-5,.009*N),!0,ue*me,oe),E.position.copy(te.at(-1)),w.setFromUnitVectors(Ad,z),E.quaternion.copy(w),E.rotateY((1-N)*pe.side*1.47+pe.roll*N+Math.sin(he*.28+pe.phase)*.032*N*d.wind);let H=pe.length*N;E.scale.set(Math.max(1e-5,H*pe.width*(.055+.945*N)),Math.max(1e-5,H),Math.max(1e-5,H)),E.updateMatrix();let ie=F[pe.species];ie.setMatrixAt(pe.instanceIndex,E.matrix),x.copy(v).lerp(R,.23+N*.52).multiplyScalar(.87+pe.variation*.17),ie.setColorAt(pe.instanceIndex,x)}for(let ue of F)ue.instanceMatrix.needsUpdate=!0,ue.instanceColor&&(ue.instanceColor.needsUpdate=!0);Re.visible=c.some(ue=>ue.growth>.07),C=Z}function ke({ropeIndex:Z=0,nodeIndex:ye=24,energy:Se=0,time:Ee=C??0}={}){if(u.length>=12||!Number.isFinite(ye)||!Number.isFinite(Ee)||!Number.isInteger(Z)||Z<0||Z>=e.counts.length||!Number.isFinite(Se)||Se<.002)return null;ye=Math.max(0,Math.min(e.counts[Z]-1,Math.round(ye)));let Oe=X(Z,ye),he=Oe.clone(),Me=c[0],ue=ye,pe=1/0;for(let ae of c){let M=Y(Z,ae.root),_=M.distance+Math.abs(M.node-ye)*.21;_<pe&&(pe=_,Me=ae,ue=M.node)}if(!Me)return null;let Pe=I(Me.root,he,Z,ye,ue,Me.index,!1),N=Math.min(9.5,Math.max(4.8,Pe.distance*.3)),V=.15+.2*Math.sqrt(Math.min(1,Se));return u.push({route:Pe,plantIndex:Me.index,start:S,duration:N,potency:V,energy:Se,arrived:!1,authoredTime:Ee}),{plantIndex:Me.index,anchorIndex:Me.anchorIndex,arrivalIn:N,potency:V}}function Ue(){h.fill(0),r.fill(0),S=0,C=null;for(let Z of u)n.remove(Z.route.mesh),Z.route.geometry.dispose(),Z.route.mesh.material.dispose();u.length=0,f.length=0}function et(){return{...d,roots:c.length,leaves:L.length,openLeaves:L.reduce((Z,ye)=>Z+(ye.plant.growth>ye.u+.07?1:0),0),grown:c.reduce((Z,ye)=>Z+ye.growth,0)/Math.max(1,c.length),arrivals:l.filter(Z=>(C??0)>=Z.start+Z.duration).length,activeHandPulses:D?0:u.length,rememberedGrowth:D?0:Array.from(h).reduce((Z,ye)=>Z+ye,0),warmNodes:r.reduce((Z,ye)=>Z+(ye>.025?1:0),0),plants:c.map(Z=>({index:Z.index,anchorIndex:Z.anchorIndex,ropeIndex:Z.route.rope,fromNode:Z.route.from,toNode:Z.route.to,growth:Z.growth,root:{x:Z.root.x,y:Z.root.y,z:Z.root.z}}))}}return Ce(0,{deterministic:!0}),{group:n,guideHeat:r,state:d,update:Ce,release:ke,reset:Ue,stats:et,waterContacts(){return c.filter(Z=>Z.lower).map(Z=>{let ye=Math.max(1,Math.floor((Z.points.length-1)*Z.growth)),Se=Z.points[0];for(let Ee=1;Ee<=ye;Ee++)Z.points[Ee].y<Se.y&&(Se=Z.points[Ee]);return{x:Se.x,z:Se.z,y:Se.y,amount:(1-an(.045,.22,Se.y))*an(.33,.63,Z.growth)}})},drainArrivals(){return f.splice(0)},dispose(){Ue();for(let Z of new Set(a))Z.dispose();for(let Z of new Set(o))Z.dispose();m.dispose()}}}var Qr=(i,e,t)=>{let n=sn.clamp((t-i)/(e-i),0,1);return n*n*(3-2*n)},bl=180,rh=[{at:0,name:"The scattered things"},{at:30,name:"The light returns"},{at:72,name:"The paper remembers"},{at:112,name:"A room learning to grow"},{at:150,name:"What stays"}];function Id(i,{width:e=innerWidth,height:t=innerHeight,capture:n=!1}={}){let s=e<600?.65:1,r=!1,a=()=>n?1:Math.min(devicePixelRatio,2,r?1/0:Math.sqrt(21e5/(e*t))),o=new cl({canvas:i,antialias:!0,alpha:!1,powerPreference:"high-performance",preserveDrawingBuffer:n});o.setPixelRatio(a()),o.setSize(e,t),o.outputColorSpace=vt,o.toneMapping=$i,o.toneMappingExposure=1.12,o.info.autoReset=!1;let l=new Gi;l.background=new ze("#030809"),l.fog=new gr("#050c0e",.0105);let c=new Ft(43,e/t,.1,150),u=new Yi("#8baac5","#282822",.76);l.add(u);let f=new Cr("#f2f0e6",750,70,.65,.82,1.4);f.position.set(-16,18,10),f.target.position.set(-6,6,-5),l.add(f,f.target);let h=new Zi("#a6c7d8",.62);h.position.set(15,8,-7),l.add(h),o.shadowMap.enabled=!0,o.shadowMap.type=Ji,f.castShadow=!0,f.shadow.mapSize.set(4096,4096),f.shadow.bias=-3e-4,f.shadow.normalBias=.008;let d=new Ti("#ffe1a0",130,25,2);d.position.set(0,4.8,-4.5),l.add(d);let g=new Ti("#dce5e2",35,24,2);g.position.set(-11,6,5),l.add(g);let y=new Ti("#cbdde0",90,35,2);y.position.set(13,12,9),l.add(y);let m=[-1,1].map(G=>{let k=new Ti("#e6d6af",0,11,2);return k.position.set(G*9,2.3,7),l.add(k),k}),p=yd({quality:s});l.add(p.group),p.update(0);let A=Sd(p.anchors);l.add(A.group);let T=gd({quality:s});l.add(T.group);let v=Pd({anchors:p.anchors,physics:T.physics,quality:s});l.add(v.group);let R=Md({quality:s}),E=new Ke(new Vt(3.1,4),new mt({uniforms:{map:{value:R.target.texture},uDay:{value:0}},side:St,transparent:!0,depthWrite:!0,vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`uniform sampler2D map;uniform float uDay;varying vec2 vUv;
    void main(){vec2 uv=vUv;vec3 c=texture2D(map,uv).rgb;
    float edge=min(min(uv.x,1.-uv.x),min(uv.y,1.-uv.y));
    float torn=sin(uv.y*193.)*.002+sin(uv.x*233.)*.002;
    c*=.87+uDay*.13;
    gl_FragColor=vec4(c,smoothstep(.002,.035,edge+torn));
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    }`}));E.position.set(0,4.7,-7),l.add(E);let w=new Ke(new Vt(10,12),new mt({transparent:!0,depthWrite:!1,blending:Bs,vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:"varying vec2 vUv;void main(){vec2 p=(vUv-.5)*vec2(3.8,3.5);float a=exp(-dot(p,p)*2.)*.065;gl_FragColor=vec4(.55,.36,.14,a);}"}));w.position.set(0,4.7,-7.05),l.add(w);let x=new Ke(new Vt(180,100),new mt({uniforms:{},depthWrite:!1,vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`varying vec2 vUv;void main(){float lowAxis=(vUv.y-.38)*5.;float poolX=(vUv.x-.43)*8.,poolY=(vUv.y-.4)*5.;float low=exp(-lowAxis*lowAxis);float pool=exp(-poolX*poolX-poolY*poolY);vec3 c=vec3(.002,.004,.007)+low*vec3(.006,.011,.016)+pool*vec3(.007,.008,.007);gl_FragColor=vec4(c,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    }`}));x.position.set(0,22,-45),l.add(x);let S=new mt({transparent:!0,depthWrite:!1,blending:Bs,side:St,uniforms:{uTime:{value:0}},vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:"varying vec2 vUv;uniform float uTime;void main(){vec2 p=vUv-.5;float a=exp(-dot(p*vec2(4.8,2.6),p*vec2(4.8,2.6)))*smoothstep(.5,.2,length(p));gl_FragColor=vec4(.26,.27,.24,a*.037);}"});for(let G=0;G<4;G++){let k=new Ke(new Vt(5+G*1.2,22),S);k.position.set(-10+G*2,10,-9+G*2),k.rotation.z=.38,l.add(k)}let C=Math.floor(p.anchors.length/2),D=new Float32Array(C*18*2*3),L=new at;L.setAttribute("position",new Rt(D,3));let X=new yn({color:"#98a397",transparent:!0,opacity:.16,depthWrite:!1});l.add(new Cn(L,X));function Y(){let G=0;for(let k=0;k<C;k++){let ne=p.anchors[k*2],ge=ne.x<0?-1:1,Ae=new U(ge*(1.7+k%7*.43),k%3===0?7.1:2.4,-7+k%5*.6);for(let B=0;B<18;B++)for(let xe=0;xe<2;xe++){let re=(B+xe)/18,ve=ne.x+(Ae.x-ne.x)*re,be=ne.y+(Ae.y-ne.y)*re-Math.sin(re*Math.PI)*(.4+k%4*.18),le=ne.z+(Ae.z-ne.z)*re+Math.sin(re*Math.PI)*(k%3)*.22;D[G++]=ve,D[G++]=be,D[G++]=le}}L.attributes.position.needsUpdate=!0,L.computeBoundingSphere()}let I=[],P=[],F=xl(9221),J=new ze("#cdb98c"),K=(G,k,ne)=>{I.push(...G,...k),P.push(ne.r,ne.g,ne.b,ne.r,ne.g,ne.b)};for(let G=0;G<108;G++){let k=G%4;if((k===1||k===3)&&F()<.72)continue;let ne=F()*.15,ge=F(),Ae=.04+F()*.34,B=-6.89+F()*.13,xe=J.clone().multiplyScalar(.4+F()*.5),re;for(let ve=0;ve<=12;ve++){let be=Math.min(1,ge+ve/12*Ae),le=Math.sin(ve/12*Math.PI)*(.025+F()*.003),De=k<2?[(k?1:-1)*(1.55+ne)+le,2.7+be*4,B]:[-1.55+be*3.1,(k===2?2.7:6.7)+(k===2?-1:1)*ne+le,B];re&&K(re,De,xe),re=De}}for(let G=0;G<9;G++){let k;for(let ne=0;ne<=48;ne++){let ge=ne/48*Math.PI*2,Ae=[-1.57+Math.cos(ge)*(.09+G*.005),2.76+Math.sin(ge)*(.045+G*.008),-6.83+Math.sin(ge*2)*.03+G*.009];k&&K(k,Ae,J),k=Ae}}let oe=new at;oe.setAttribute("position",new Ye(I,3)),oe.setAttribute("color",new Ye(P,3)),l.add(new Cn(oe,new yn({vertexColors:!0,transparent:!0,opacity:.085})));let me=Td();l.add(me.group);let de={uniforms:gn.merge([Xs.ReflectorShader.uniforms,{uTime:{value:0},uTension:{value:0},uTouch:{value:new Le(0,0)},uRippleAge:{value:100},uLifeContacts:{value:[new ft,new ft]}}]),vertexShader:`uniform mat4 textureMatrix;varying vec4 vUv;varying vec3 vWorld;
    void main(){vUv=textureMatrix*vec4(position,1.);vWorld=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`uniform sampler2D tDiffuse;uniform float uTime,uTension,uRippleAge;uniform vec2 uTouch;uniform vec4 uLifeContacts[2];varying vec4 vUv;varying vec3 vWorld;
    void main(){vec2 uv=vUv.xy/vUv.w;
    float wave=sin(vWorld.z*2.8+sin(vWorld.x*.31)+uTime*.18)*.00013;
    wave+=sin(vWorld.z*6.7-uTime*.12)*.000045;
    float r=length(vWorld.xz-uTouch);
    float ringAxis=(r-uRippleAge*1.1)*.7;float ring=sin(r*5.-uRippleAge*3.5)*exp(-ringAxis*ringAxis)*exp(-uRippleAge*.65)*.001;
    uv+=vec2(wave+ring*.55,wave*.25+ring*.2);
    for(int i=0;i<2;i++){
      vec2 delta=vWorld.xz-uLifeContacts[i].xy;
      float radius=length(delta),strength=uLifeContacts[i].z;
      float touchWave=sin(radius*4.2-uTime*.85)*exp(-radius*radius*.10)*strength*.00019;
      uv+=vec2(touchWave,touchWave*.38);
    }
    vec3 ref=texture2D(tDiffuse,uv).rgb;
    vec3 water=mix(vec3(.003,.008,.011),ref*.72,.9);
    water=mix(water,vec3(.008,.017,.024),smoothstep(18.,80.,-vWorld.z)*.75);
    gl_FragColor=vec4(water,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    }`},we=new Xs(new Vt(140,105),{textureWidth:Math.round(e*o.getPixelRatio()),textureHeight:Math.round(t*o.getPixelRatio()),color:9605778,clipBias:.004,shader:de,multisample:4});we.rotation.x=-Math.PI/2,we.position.set(0,-.03,33),l.add(we);let Ge=new at,Re=[],te=[];for(let G=0;G<470*s;G++)Re.push((F()-.5)*29,.5+F()*20,-13+F()*25),te.push(F()*6.28);Ge.setAttribute("position",new Ye(Re,3)),Ge.setAttribute("aPhase",new Ye(te,1));let _e=new mt({uniforms:{uTime:{value:0}},transparent:!0,depthWrite:!1,vertexShader:"attribute float aPhase;uniform float uTime;varying float vAlpha;void main(){vec3 p=position;p.x+=sin(uTime*.047+aPhase)*.32;p.y+=sin(uTime*.037+aPhase)*.24;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(20./-mv.z,.6,2.);vAlpha=.12+.16*pow(max(0.,sin(uTime*.1+aPhase)),4.);}",fragmentShader:"varying float vAlpha;void main(){float a=smoothstep(.5,.08,length(gl_PointCoord-.5));gl_FragColor=vec4(.8,.72,.53,a*vAlpha);}"});l.add(new Xi(Ge,_e));let fe=new Ct(e*o.getPixelRatio(),t*o.getPixelRatio(),{type:Ht,samples:4}),Ce=new fl(o,fe);Ce.setSize(e,t),Ce.addPass(new pl(l,c)),Ce.addPass(new ml);let ke=new Ys({uniforms:{tDiffuse:{value:null},uTime:{value:0},uFade:{value:1},uResolution:{value:new Le(e,t)}},vertexShader:"varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:`uniform sampler2D tDiffuse;uniform float uTime,uFade;uniform vec2 uResolution;varying vec2 vUv;
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;vec2 p=vUv-.5;float vignette=1.-.43*pow(length(p*vec2(.95,1.2)),1.55);c*=vignette;gl_FragColor=vec4(c*uFade,1.);}`});Ce.addPass(ke);let Ue=0,et=0,Z=null,ye=null,Se=0,Ee=!1,Oe=100,he=new Us,Me=p.group.children.filter(G=>G.isMesh&&!G.material.transparent),ue=new Us,pe=new Jt(new U(0,1,0),.03),Pe=new U,N=G=>{let k=G.clone();return k.origin.y=-.06-k.origin.y,k.direction.y=-k.direction.y,k},V=(G,k)=>{let ne=i.getBoundingClientRect();return ue.setFromCamera(new Le((G-ne.left)/ne.width*2-1,1-(k-ne.top)/ne.height*2),c),ue.ray};function ae(G,k){let ne=V(G,k),ge={viewportHeight:i.clientHeight||t,pixelThreshold:15};he.ray.copy(ne),ge.maxDistance=(he.intersectObjects(Me,!1)[0]?.distance??1/0)-.02;let Ae=T.hover(ne,c,ge);if(Ae)return{hit:Ae,ray:ne,camera:c,options:ge};if(ne.intersectPlane(pe,Pe)){let B=N(ne),xe=we.getReflectionCamera(c);if(he.ray.copy(B),ge.maxDistance=(he.intersectObjects(Me,!1)[0]?.distance??1/0)-.02,Ae=T.hover(B,xe,ge),Ae)return{hit:{...Ae,reflected:!0},ray:B,camera:xe,options:ge}}return null}function M(G,k){return Z=ae(G,k)?.hit||null,Z}function _(G,k){if(T.grab)return null;let ne=ae(G,k);if(!ne)return null;let ge=T.beginGrab(ne.ray,ne.camera,ne.options);return ge?(Ee=!!ne.hit.reflected,Z={...ge,reflected:Ee},ye={position:c.position.clone(),quaternion:c.quaternion.clone()},Se=0,Ee&&(we.material.uniforms.uTouch.value.set(Pe.x,Pe.z),Oe=0),Z):null}function O(G,k){let ne=V(G,k);return T.moveGrab(Ee?N(ne):ne)}function z({awaken:G=!1}={}){let k=T.grab,ne=Math.min(1,T.energy+T.physics.maxDisplacement*.3),ge=G&&k?v.release({...k,energy:ne,time:Ue}):null;return T.endGrab(),k&&(Se=1),k?{...k,seed:ge}:null}function H(){ie(),v.reset()}function ie(){T.reset(),ye=null,Se=0,Z=null,Ee=!1,Oe=100}function j(){let G=T.physics,k=[];for(let ne=0;ne<G.counts.length;ne++)for(let ge=0;ge<G.counts[ne];ge++){let Ae=G.offsets[ne]+ge,B=Ae*3;k.push({ropeIndex:ne,nodeIndex:ge,x:G.positions[B],y:G.positions[B+1],z:G.positions[B+2],pinned:G.inverseMass[Ae]===0})}return k}function W(){let G=i.getBoundingClientRect(),k=[];for(let ne of j()){if(ne.pinned||ne.nodeIndex<7||ne.nodeIndex>40||ne.nodeIndex%4)continue;let ge=new U(ne.x,ne.y,ne.z).project(c);if(ge.z<-1||ge.z>1||Math.abs(ge.x)>.83||Math.abs(ge.y)>.7)continue;let Ae=G.left+(ge.x*.5+.5)*G.width,B=G.top+(.5-ge.y*.5)*G.height,xe=ae(Ae,B);xe&&!xe.hit.reflected&&xe.hit.ropeIndex===ne.ropeIndex&&k.push({...ne,clientX:Ae,clientY:B})}return k}function $(G,{pointer:k={x:0,y:0},tension:ne=0,mode:ge="journey",reducedMotion:Ae=!1,dt:B=0,paused:xe=!1,deterministic:re=!1}={}){o.info.reset();let ve=Math.max(0,G),be=Qr(70,118,ve)*(1-Qr(149,190,ve)*.25),le,De;if(ge==="drift"){let ct=Ae?0:ve;le=new U(Math.sin(ct*.007)*2.2,5.5+Math.sin(ct*.008)*.28,25+Math.sin(ct*.005)*1.2),De=new U(-.35,5.9,-4)}else{let ct=[[0,-1.8,4.6,32,-.3,6.5,-5],[32,-1.4,4.6,26,-.2,5.6,-5],[65,-2.8,5.1,22,-1.7,6.5,-4],[94,-3.8,5.5,21,-2.6,7,-3],[123,2.4,4.2,22,1.5,5.2,-3],[149,1.6,3.9,25,.5,5.1,-3],[180,-.5,5.5,29,-.3,6,-4]],Xt=0;for(;Xt<ct.length-2&&ve>ct[Xt+1][0];)Xt++;let Qs=ct[Xt],rs=ct[Xt+1],as=Qr(Qs[0],rs[0],ve);le=new U(...Qs.slice(1,4)).lerp(new U(...rs.slice(1,4)),as),De=new U(...Qs.slice(4,7)).lerp(new U(...rs.slice(4,7)),as)}if(Ae&&(le.set(0,5.7,23),De.set(0,6,-5)),e/t<1?(le.z+=9,c.fov=55):c.fov=43,Ae||(le.x+=k.x*.6,le.y+=k.y*.24,De.x+=k.x*.16,De.y+=k.y*.09),c.position.copy(le),c.lookAt(De),ye)if(T.grab)c.position.copy(ye.position),c.quaternion.copy(ye.quaternion);else{Se=Math.max(0,Se-B/3);let ct=Se*Se*(3-2*Se);c.position.lerp(ye.position,ct),c.quaternion.slerp(ye.quaternion,ct),Se||(ye=null)}c.updateProjectionMatrix(),c.updateMatrixWorld();let it=Ae?28:ve;T.update(it,ne,be,{dt:B,paused:xe,deterministic:re,viewportHeight:i.height}),p.update(it,{touchPoint:T.grab?.point,strength:Math.min(1,T.physics.maxDisplacement)*.18}),v.update(ve,{dt:B,deterministic:re,reducedMotion:Ae,paused:xe}),T.setGuideHeat(v.guideHeat);let lt=v.waterContacts();for(let ct=0;ct<2;ct++){let Xt=lt[ct];we.material.uniforms.uLifeContacts.value[ct].set(Xt?.x||0,Xt?.z||0,Xt?.amount||0,0),m[ct].intensity=(Xt?.amount||0)*14}Y(),A.update(it),me.update(it,T.energy,v.state),R.update(it,k.x,k.y),E.material.uniforms.uDay.value=be,we.material.uniforms.uTime.value=it,we.material.uniforms.uTension.value=ne,_e.uniforms.uTime.value=it,d.intensity=60+be*60,f.intensity=260+be*60,y.color.setRGB(.61+v.state.bloom*.13,.72+v.state.bloom*.04,.75-v.state.bloom*.1),y.intensity=90+v.state.unfolding*35,Oe+=B,we.material.uniforms.uRippleAge.value=Oe,ke.uniforms.uTime.value=it,ke.uniforms.uFade.value=n?(.17+.83*Qr(0,6,ve))*(1-Qr(176,180,ve)*.88):1,o.setRenderTarget(R.target),o.render(R.scene,R.camera),o.setRenderTarget(null);let Gt=performance.now();Ce.render(),et=performance.now()-Gt,Ue=ve}function ce(){let G=o.getRenderTarget(),k=new Ct(R.target.width,R.target.height,{type:$t}),ne=new Float32Array(k.width*k.height*4);try{o.setRenderTarget(k),o.render(R.scene,R.camera),o.readRenderTargetPixels(k,0,0,k.width,k.height,ne);let ge=0;for(let Ae of ne)Number.isFinite(Ae)||ge++;return{width:k.width,height:k.height,invalidChannels:ge}}finally{o.setRenderTarget(G),k.dispose()}}function Te(G,k){e=G,t=k,o.setPixelRatio(a()),o.setSize(G,k),Ce.setPixelRatio(o.getPixelRatio()),Ce.setSize(G,k),we.getRenderTarget().setSize(Math.round(G*o.getPixelRatio()),Math.round(k*o.getPixelRatio())),c.aspect=G/k,c.updateProjectionMatrix(),ke.uniforms.uResolution.value.set(G*o.getPixelRatio(),k*o.getPixelRatio())}return{renderer:o,canvas:i,scene:l,camera:c,render:$,setSize:Te,setFullDetail(G){r=!!G,Te(e,t)},hoverAt:M,beginGrab:_,moveGrab:O,endGrab:z,resetInteraction:ie,resetWorld:H,settleView(){ye={position:c.position.clone(),quaternion:c.quaternion.clone()},Se=1},takeArrivals:()=>v.drainArrivals?.()||[],interactionTargets:W,interactionSamples:j,diagnoseRadiance:ce,stats:()=>({time:Ue,frameMs:et,drawCalls:o.info.render.calls,triangles:o.info.render.triangles,lineSegments:T.count,guideCount:T.guideCount,samples:fe.samples,fullDetail:r,pixelRatio:o.getPixelRatio(),bloom:v.stats(),physics:{grabbed:T.grab?{ropeIndex:T.grab.ropeIndex,nodeIndex:T.grab.nodeIndex}:null,hovered:Z?{ropeIndex:Z.ropeIndex,nodeIndex:Z.nodeIndex}:null,energy:T.energy,maxDisplacement:T.physics.maxDisplacement},camera:{x:c.position.x,y:c.position.y,z:c.position.z},width:i.width,height:i.height}),dispose(){v.dispose(),me.dispose(),p.dispose(),T.dispose(),R.dispose(),we.dispose(),Ce.dispose(),o.dispose()}}}var oh=Math.PI*2,Ii=(i,e,t)=>Math.min(t,Math.max(e,i)),Ld=new WeakMap;function El(i){let e=i>>>0;return()=>{e+=1831565813;let t=Math.imul(e^e>>>15,e|1);return t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function Sl(i,e){if(e<=i[0][0])return i[0][1];for(let t=1;t<i.length;t++)if(e<=i[t][0]){let[n,s]=i[t-1],[r,a]=i[t];return s+(a-s)*(e-n)/(r-n)}return i[i.length-1][1]}function Bt(i,e,t,n,s=1){Ld.set(i,e.map(([r,a])=>[r,a*s])),i.setValueAtTime(Sl(e,n)*s,t);for(let[r,a]of e)r>n&&i.linearRampToValueAtTime(a*s,t+r-n)}function Q_(i,e,t){let n=[e,...i.filter(([r])=>r>e&&r<t).map(([r])=>r),t],s=0;for(let r=1;r<n.length;r++){let a=n[r-1],o=n[r];s+=(Sl(i,a)+Sl(i,o))*(o-a)*.5}return s}function lh(i,e,t,n){if(typeof i.cancelAndHoldAtTime=="function")i.cancelAndHoldAtTime(e);else{let s=i.value;i.cancelScheduledValues(e),i.setValueAtTime(s,e)}i.setTargetAtTime(t,e,n)}var ah=new WeakMap;function Dd(i){if(ah.has(i))return ah.get(i);let e=El(1970169449),t=i.createBuffer(2,Math.ceil(i.sampleRate*9.7),i.sampleRate);for(let r=0;r<2;r++){let a=t.getChannelData(r),o=0,l=0,c=0;for(let u=0;u<a.length;u++){let f=e()*2-1;o=.99765*o+f*.099046,l=.963*l+f*.2965164,c=.57*c+f*1.0526913;let h=Math.min(1,u/1600,(a.length-u-1)/1600);a[u]=(o+l+c+f*.1848)*.15*h}}let n=i.createBuffer(2,Math.ceil(i.sampleRate*3.6),i.sampleRate);for(let r=0;r<2;r++){let a=n.getChannelData(r),o=0;for(let l=0;l<a.length;l++){let c=l/i.sampleRate;o=o*.62+(e()*2-1)*.38;let u=Math.min(1,c/.027);a[l]=o*Math.exp(-c*2.05)*u*.22}for(let[l,c]of[[.081,.23],[.173,.13],[.311,.055]])a[Math.floor((l+r*.007)*i.sampleRate)]+=c}let s={noise:t,impulse:n};return ah.set(i,s),s}function ex(i){let e=Dd(i);if(e.living)return e.living;let t=i.sampleRate,n=Math.ceil(t*29.3),s=i.createBuffer(1,n,t),r=s.getChannelData(0),a=e.noise.getChannelData(0),o=El(1919905652);for(let l=.3;l<29.3;l+=.7+o()*2.1){let c=.5+o()*1.7,u=Math.floor(l*t),f=Math.floor(o()*a.length),h=.023+o()*.022;for(let d=0,g=Math.floor(c*t);d<g;d++){let y=d/g,m=Math.sin(Math.PI*y)**2,p=.35+.65*Math.sin(y*(21+l)+l)**2;r[(u+d)%n]+=a[(f+d)%a.length]*h*m*p}}for(let[l,c]of[[3.7,147],[12.9,123],[23.4,164.8]]){let u=Math.floor(l*t),f=2.6;for(let h=0;h<f*t;h++){let d=h/t,g=Math.min(1,d/.028)*Math.exp(-d*3.1)*(1-d/f),y=Math.sin(oh*c*d)*.65+Math.sin(oh*c*1.473*d)*.25;r[(u+h)%n]+=y*g*.0036}}return e.living=s,s}function tx(){let i=[],e=El(1818847080);for(let[n,s,r,a,o]of[[3,20,110,.018,-.5],[18,22,146.832,.014,.45],[34,24,73.416,.015,-.17],[46,18,164.814,.01,.54],[64,19,110,.012,-.62],[82,17,146.832,.01,.26],[103,15,220,.007,-.35],[137,17,164.814,.006,-.4],[153,19,146.832,.009,.15],[165,15,164.814,.005,-.38]])i.push({kind:"bow",at:n,length:s,hz:r,gain:a,pan:o,seed:e()});let t=6.8;for(;t<170;){let n=t>72;i.push({kind:"wood",at:t,length:.72,hz:350+e()*180,gain:n?.013:.021,pan:e()*1.45-.725,seed:e()}),e()>.74&&i.push({kind:"wood",at:t+.15+e()*.13,length:.54,hz:480+e()*220,gain:.007,pan:e()-.5,seed:e()}),t+=7.1+e()*10.6}for(t=1.2;t<180;)i.push({kind:"paper",at:t,length:2.2+e()*3.6,hz:850+e()*1850,gain:.011+e()*.011,pan:e()*1.6-.8,seed:e(),growth:Ii((t-72)/38,0,1)}),t+=8+e()*9;for(let[n,s,r,a]of[[13,57,.018,-.24],[29.8,64,.011,.4],[43,62,.014,-.45],[68.4,64,.013,.08],[91.7,69,.012,.38],[116.2,62,.016,-.18],[131.4,66,.014,-.32],[154.7,62,.015,-.28],[172.3,64,.014,-.04]])i.push({kind:"string",at:n,length:11,hz:440*2**((s-69)/12),gain:r,pan:a,seed:e()});for(let[n,s,r,a]of[[32.8,-.72,146.832,.009],[44.6,.76,164.814,.01],[57.4,-.85,110,.011],[68.5,.68,146.832,.011],[86.2,-.57,164.814,.008],[108.3,.78,146.832,.008],[139.2,-.67,110,.006]])i.push({kind:"returning",at:n,length:6.4,hz:r,gain:a,pan:s,seed:e()});for(let[n,s,r]of[[76.9,-.68,166],[87.1,.63,147],[99.7,-.42,123],[111.1,.74,132],[126.8,-.77,110],[145.1,.51,147],[163.7,-.58,164.8]])i.push({kind:"body",at:n,length:3.8,hz:r,gain:.009,pan:s,seed:e()}),i.push({kind:"paper",at:n+.72,length:4.5,hz:1750+e()*900,gain:.019,pan:s,seed:e(),growth:Ii((n-65)/40,.1,1)});for(let[n,s]of[[119.8,-.34],[134.6,.53],[147.2,-.6],[168.4,.25]])i.push({kind:"water",at:n,length:2.1,hz:188+e()*36,gain:.01,pan:s,seed:e()});i.push({kind:"paper",at:176.4,length:7.8,hz:2380,gain:.024,pan:-.61,seed:.721,growth:1});for(let n of[99.6,114.7,126.4,139.5,151.1,163.6,177.2]){let s=1780+e()*950,r=.27+e()*.44,a=2+Math.floor(e()*3);for(let o=0;o<a;o++)i.push({kind:"bird",at:n+o*(.17+e()*.05),length:.1+e()*.15,hz:s+o*70,gain:(n<110?.0028:.0045)*(.7+e()*.4),pan:r,seed:e()})}return i.sort((n,s)=>n.at-s.at)}var nx=tx();function ch(i,e,{offset:t=0,anchor:n=i.currentTime+.035,duration:s=1/0,interactive:r=!0,events:a=nx,ambient:o=!0,living:l=!1}={}){let c=[],u=[],{noise:f,impulse:h}=Dd(i),d=I=>{let P=i[I]();return c.push(P),P},g=(I,P,F,J=0)=>{let K=Math.max(0,t-P),oe=n+Math.max(0,P-t);if(I.buffer)I.start(oe,(J+K)%I.buffer.duration);else{if(K>0&&I.type==="sine"){let me=Ld.get(I.frequency),de=(me?Q_(me,P,t):I.frequency.value*K)*2**(I.detune.value/1200),we=oh*(de%1);I.setPeriodicWave(i.createPeriodicWave(new Float32Array([0,Math.sin(we)]),new Float32Array([0,Math.cos(we)]),{disableNormalization:!0}))}I.start(oe)}Number.isFinite(F)&&I.stop(Math.max(oe+.002,n+P+F-t)),u.push(I)},y=d("createGain"),m=d("createGain"),p=d("createConvolver"),A=d("createBiquadFilter"),T=d("createGain");y.gain.value=.86,m.gain.value=.2,p.buffer=h,A.type="lowpass",A.frequency.value=4200,y.connect(T),m.connect(p).connect(A).connect(T),T.gain.setValueAtTime(0,i.currentTime),T.gain.linearRampToValueAtTime(4.92,n+.1),T.connect(e);function v(I,P){let F=d("createStereoPanner");Array.isArray(P)?Bt(F.pan,P,n,t):F.pan.value=P,I.connect(F),F.connect(y),F.connect(m)}if(o){let I=d("createBufferSource");I.buffer=f,I.loop=!0;let P=d("createBiquadFilter");P.type="lowpass",Bt(P.frequency,[[0,560],[30,650],[72,1250],[112,2800],[145,3100],[180,2400]],n,t);let F=d("createBiquadFilter");F.type="highpass",F.frequency.value=200;let J=d("createGain");Bt(J.gain,[[0,.002],[5,.009],[35,.011],[75,.01],[102,.017],[121,.024],[147,.021],[180,.018]],n,t),I.connect(P).connect(F).connect(J),v(J,-.08),g(I,0,s);let K=d("createOscillator"),oe=d("createGain");K.frequency.value=.087,oe.gain.value=.003,K.connect(oe).connect(J.gain),g(K,0,s)}if(l){let I=ex(i);for(let[P,F,J,K]of[[-.68,.991,0,.62],[.61,1.013,13.7,.48]]){let oe=d("createBufferSource"),me=d("createBiquadFilter"),de=d("createGain");oe.buffer=I,oe.loop=!0,oe.playbackRate.value=F,me.type="lowpass",me.frequency.value=3900,de.gain.value=K,oe.connect(me).connect(de),v(de,P),g(oe,0,s,J+t*(F-1))}}function R(I){let{at:P,length:F,hz:J,gain:K,pan:oe,seed:me}=I,de=d("createGain");Bt(de.gain,[[P,0],[P+F*.24,K],[P+F*.62,K*.78],[P+F,0]],n,t);let we=d("createBiquadFilter");we.type="lowpass",we.frequency.value=1350+me*350,de.connect(we),v(we,oe);for(let[Ce,ke]of[[1,.58],[2,.23],[3,.12],[5,.038]]){let Ue=d("createOscillator"),et=d("createGain");Ue.frequency.value=J*Ce,Ue.detune.value=(me-.5)*5+Ce*.17,et.gain.value=ke,Ue.connect(et).connect(de),g(Ue,P,F)}let Ge=d("createBufferSource"),Re=d("createBiquadFilter"),te=d("createGain");Ge.buffer=f,Ge.loop=!0,Re.type="bandpass",Re.frequency.value=J*6.07,Re.Q.value=2,te.gain.value=.24,Ge.connect(Re).connect(te).connect(de),g(Ge,P,F,me*8);let _e=d("createOscillator"),fe=d("createGain");_e.frequency.value=.23+me*.12,fe.gain.value=K*.035,_e.connect(fe).connect(de.gain),g(_e,P,F)}function E(I){let{at:P,length:F,hz:J,gain:K,pan:oe,seed:me}=I,de=d("createGain");de.gain.value=K,v(de,oe);for(let[we,Ge]of[[1,.58],[2.002,.27],[3.011,.115],[4.029,.047],[6.07,.012]]){let Re=d("createOscillator"),te=d("createGain");Re.frequency.value=J*we,Re.detune.value=(me-.5)*3.3;let _e=2.9/Math.sqrt(we),fe=[[P,0],[P+.016,Ge]];for(let Ce=1;Ce<=28;Ce++){let ke=Ce*F/28;fe.push([P+ke,Ge*Math.exp(-ke/_e)*(1-ke/F)])}fe.push([P+F+.01,0]),Bt(te.gain,fe,n,t),Re.connect(te).connect(de),g(Re,P,F+.025)}}function w(I){let{at:P,length:F,hz:J,gain:K,pan:oe}=I,me=d("createGain");me.gain.value=1,v(me,oe);for(let[de,we]of[[1,.7],[1.478,.22],[2.173,.08]]){let Ge=d("createOscillator"),Re=d("createGain");Ge.frequency.value=J*de,Bt(Re.gain,[[P,0],[P+.003,K*we],[P+.024,K*we*.31],[P+.11,K*we*.05],[P+F,0]],n,t),Ge.connect(Re).connect(me),g(Ge,P,F)}}function x(I){let{at:P,length:F,hz:J,gain:K,pan:oe,seed:me,growth:de=0}=I,we=d("createBufferSource"),Ge=d("createBiquadFilter"),Re=d("createBiquadFilter"),te=d("createGain");we.buffer=f,we.loop=!0,Ge.type="highpass",Bt(Ge.frequency,[[P,J*.65],[P+F,J*(.65-de*.37)]],n,t),Re.type="lowpass",Bt(Re.frequency,[[P,J*1.8],[P+F,Math.min(6100,J*(1.8+de))]],n,t);let _e=[[P,0],[P+F*.22,K*.42],[P+F*.38,K],[P+F*.54,K*.27],[P+F*.7,K*.53],[P+F,0]],fe=El(Math.floor(me*4294967295)),Ce=[];for(let ke=0;ke<=56;ke++){let Ue=P+F*ke/56,et=Sl(_e,Ue),Z=.18+fe()**1.8*1.95;Ce.push([Ue,et*(1-de+de*Z)])}Bt(te.gain,Ce,n,t),we.connect(Ge).connect(Re).connect(te),v(te,oe),g(we,P,F,me*8)}function S(I){let{at:P,length:F,hz:J,gain:K,pan:oe,seed:me}=I,de=d("createGain");de.gain.value=1,v(de,[[P,oe*.035],[P+F*.52,oe*.67],[P+F,oe]]);for(let[we,Ge]of[4.007,3.013,2.004,1].entries()){let Re=P+we*(.68+me*.11),te=F-(Re-P);if(Re+te<=t)continue;let _e=d("createOscillator"),fe=d("createGain");Bt(_e.frequency,[[Re,J*Ge*1.006],[Re+.32,J*Ge],[Re+te,J*Ge*.999]],n,t),Bt(fe.gain,[[Re,0],[Re+.06,K*(.62+we*.11)],[Re+.5,K*.31],[Re+te*.65,K*.085],[Re+te,0]],n,t),_e.connect(fe).connect(de),g(_e,Re,te)}}function C(I){let{at:P,length:F,hz:J,gain:K,pan:oe,seed:me}=I,de=d("createGain");de.gain.value=1,v(de,oe);for(let[te,_e]of[[1,.62],[1.473,.28],[2.39,.12],[3.21,.034]]){let fe=d("createOscillator"),Ce=d("createGain");Bt(fe.frequency,[[P,J*te*1.009],[P+.42,J*te],[P+F,J*te*.997]],n,t),Bt(Ce.gain,[[P,0],[P+.033,K*_e],[P+.18,K*_e*.48],[P+.67,K*_e*.19],[P+F,0]],n,t),fe.connect(Ce).connect(de),g(fe,P,F)}let we=d("createBufferSource"),Ge=d("createBiquadFilter"),Re=d("createGain");we.buffer=f,we.loop=!0,Ge.type="bandpass",Ge.Q.value=3.2,Bt(Ge.frequency,[[P,J*3.8],[P+F*.35,J*2.4],[P+F,J*2.7]],n,t),Bt(Re.gain,[[P,0],[P+.2,K*.43],[P+F*.48,K*.17],[P+F,0]],n,t),we.connect(Ge).connect(Re).connect(de),g(we,P,F,me*8)}function D(I){let{at:P,length:F,hz:J,gain:K,pan:oe}=I,me=d("createGain");me.gain.value=1,v(me,oe);for(let[de,we]of[[1,.66],[2.713,.21]]){let Ge=d("createOscillator"),Re=d("createGain");Bt(Ge.frequency,[[P,J*de*1.24],[P+.075,J*de*.92],[P+.22,J*de],[P+F,J*de*.997]],n,t),Bt(Re.gain,[[P,0],[P+.009,K*we],[P+.055,K*we*.39],[P+.32,K*we*.08],[P+F,0]],n,t),Ge.connect(Re).connect(me),g(Ge,P,F)}}function L(I){let{at:P,length:F,hz:J,gain:K,pan:oe,seed:me}=I,de=d("createOscillator"),we=d("createGain");Bt(de.frequency,[[P,J*.9],[P+F*.34,J*1.16],[P+F,J*(.69+me*.1)]],n,t),Bt(we.gain,[[P,0],[P+.015,K],[P+F*.58,K*.8],[P+F,0]],n,t),de.connect(we),v(we,oe),g(de,P,F)}let X={bow:R,string:E,wood:w,paper:x,bird:L,returning:S,body:C,water:D};for(let I of a)I.at+I.length>t&&I.at<s&&X[I.kind](I);let Y=d("createGain");if(Y.gain.value=0,r){for(let I of[220.07,293.61]){let P=d("createOscillator"),F=d("createGain");P.frequency.value=I,F.gain.value=.004,P.connect(F).connect(Y),g(P,0,1/0)}v(Y,0)}return{anchor:n,offset:t,setInteraction(I=0,P=0){let F=Number.isFinite(I)?I:0,J=Number.isFinite(P)?P:0;Y.gain.setTargetAtTime(Ii(F*.8+J*.12,0,1),i.currentTime,.65)},fadeAndStop(){lh(T.gain,i.currentTime,0,.012);for(let P of u)try{P.stop(i.currentTime+.08)}catch{}return setTimeout(()=>{for(let P of c)try{P.disconnect()}catch{}},100)},disconnect(){for(let I of u)try{I.stop()}catch{}for(let I of c)try{I.disconnect()}catch{}}}}var Tl=class{constructor(){this.context=null,this.master=null,this.graph=null,this.muted=!1,this.paused=!0,this.time=0,this.disposed=!1,this.pendingStart=null,this.cleanupTimers=new Set,this.plucks=new Set,this.mode="journey"}async start(e=0){if(this.disposed)throw new Error("This LoomSound has been disposed.");if(this.time=Math.max(0,Number.isFinite(e)?e:0),this.mode="journey",this.paused=!1,!this.context){let n=globalThis.AudioContext||globalThis.webkitAudioContext;if(!n)throw new Error("Web Audio is unavailable in this browser.");this.context=new n({latencyHint:"playback"}),this.master=this.context.createGain(),this.master.gain.value=this.muted?0:.86;let s=this.context.createBiquadFilter();s.type="highpass",s.frequency.value=35;let r=this.context.createDynamicsCompressor();r.threshold.value=-12,r.knee.value=6,r.ratio.value=3,r.attack.value=.008,r.release.value=.24,this.master.connect(s).connect(r).connect(this.context.destination)}let t=this.context.resume();this.pendingStart=t;try{await t}catch(n){throw this.pendingStart===t&&(this.pendingStart=null,this.paused=!0),n}this.disposed||this.paused||this.pendingStart!==t||(this.pendingStart=null,this._replaceGraph(this.time))}_replaceGraph(e){if(!(!this.context||this.disposed)){for(let t of this.plucks)t();if(this.graph){let t=this.graph.fadeAndStop();this.cleanupTimers.add(t),setTimeout(()=>this.cleanupTimers.delete(t),150)}this.time=e,this.graph=ch(this.context,this.master,this.mode==="linger"?{offset:e,events:[],living:!0}:{offset:e})}}_currentTime(){return this.graph&&!this.paused?Math.max(this.graph.offset,this.graph.offset+this.context.currentTime-this.graph.anchor):this.time}setMuted(e){this.muted=!!e,this.master&&!this.disposed&&lh(this.master.gain,this.context.currentTime,this.muted?0:.86,.045)}setPaused(e){let t=!!e;if(!(this.disposed||t===this.paused)){if(this.time=this._currentTime(),this.paused=t,t){for(let n of this.plucks)n();if(this.pendingStart=null,this.graph){let n=this.graph.fadeAndStop();this.cleanupTimers.add(n),setTimeout(()=>this.cleanupTimers.delete(n),150),this.graph=null}}else if(this.context){let n=this.mode==="linger";this.start(this.time).then(()=>{n&&!this.paused&&this.linger(this.time)}).catch(()=>{this.paused=!0})}}}seek(e){if(!this.disposed){for(let t of this.plucks)t();this.mode="journey",this.time=Math.max(0,Number.isFinite(e)?e:0),this.context&&!this.paused&&!this.pendingStart&&this._replaceGraph(this.time)}}update({time:e,tension:t=0,proximity:n=0}={}){this.disposed||(Number.isFinite(e)&&(!this.paused&&this.graph&&this.mode!=="linger"&&Math.abs(e-this._currentTime())>.7?this.seek(e):(this.paused||!this.graph)&&(this.time=Math.max(0,e))),this.graph?.setInteraction(t,n))}linger(e=180){if(this.disposed)return!1;let t=Math.max(180,Number.isFinite(e)?e:180);return this.mode==="linger"&&this.graph||(this.mode="linger",this.time=t,this.context&&!this.paused&&!this.pendingStart&&this._replaceGraph(t)),!0}_trackTransient(e,t){let n=!1,s,r=()=>{n||(n=!0,clearTimeout(o),clearTimeout(s),e.disconnect(),this.plucks.delete(a))},a=()=>{n||s!==void 0||(e.fadeAndStop(),s=setTimeout(r,120))};a.dispose=r;let o=setTimeout(r,t*1e3);this.plucks.add(a),this.plucks.size>10&&this.plucks.values().next().value.dispose()}pluck({energy:e=0,ropeIndex:t=0,pan:n=0}={}){if(e=Number.isFinite(e)?Ii(e,0,1):0,n=Number.isFinite(n)?Ii(n,-1,1):0,!this.context||this.paused||this.disposed||e<.002)return!1;let s=Number.isFinite(t)?(Math.trunc(t)%5+5)%5:0,r=this.context,a=r.currentTime,o=r.createGain(),l=r.createStereoPanner(),c=[o,l],u=[];l.pan.value=n,o.connect(l).connect(this.master);let f=.018*Math.sqrt(e);o.gain.setValueAtTime(0,a),o.gain.linearRampToValueAtTime(f,a+.006),o.gain.exponentialRampToValueAtTime(1e-5,a+2.4);let h=[146.832,164.814,196,220,293.665][s];for(let[d,g]of[1,2.002,3.013].entries()){let y=r.createOscillator(),m=r.createGain();y.frequency.value=h*g,m.gain.value=1/(1+d*3),y.connect(m).connect(o),y.start(a),y.stop(a+2.45),c.push(y,m),u.push(y)}return this._trackTransient({fadeAndStop(){lh(o.gain,r.currentTime,0,.015);for(let d of u)try{d.stop(r.currentTime+.08)}catch{}},disconnect(){for(let d of u)try{d.stop()}catch{}for(let d of c)d.disconnect()}},2.6),!0}awaken({energy:e=0,pan:t=0,material:n="linen"}={}){if(e=Number.isFinite(e)?Ii(e,0,1):0,t=Number.isFinite(t)?Ii(t,-1,1):0,!this.context||this.paused||this.disposed||e<.002)return!1;let s=["linen","paper","leaf","wood","water"].indexOf(n),r=Math.max(0,s),a=.137+r*.157,o=[146.832,164.814,146.832,110,196][r],l=.007*Math.sqrt(e),c=r===1?.42:1,u=[{kind:"returning",at:0,length:4.4,hz:o,gain:l,pan:t,seed:a},{kind:r===4?"water":"body",at:1.55,length:3.2,hz:r===4?204:o,gain:l*.9,pan:t,seed:a},{kind:"paper",at:2.05,length:4.1,hz:1680+r*190,gain:l*1.55,pan:t,seed:a,growth:c}],f=ch(this.context,this.master,{anchor:this.context.currentTime+.008,duration:9.8,interactive:!1,ambient:!1,events:u});return this._trackTransient(f,9.8),!0}dispose(){if(!this.disposed){for(let e of this.plucks)e.dispose();this.plucks.clear(),this.disposed=!0,this.pendingStart=null,this.graph?.disconnect(),this.graph=null,this.cleanupTimers.clear(),this.master?.disconnect(),this.context&&this.context.state!=="closed"&&this.context.close(),this.master=null,this.context=null}}};async function Fd(i=180,e=48e3){if(!Number.isFinite(i)||i<=0||i>3600)throw new RangeError("Score duration must be between 0 and 3600 seconds.");if(!Number.isFinite(e)||e<8e3||e>96e3)throw new RangeError("Sample rate must be between 8000 and 96000 Hz.");let t=globalThis.OfflineAudioContext||globalThis.webkitOfflineAudioContext;if(!t)throw new Error("Offline Web Audio rendering is unavailable.");let n=new t(2,Math.ceil(i*e),e),s=n.createGain();s.gain.value=.86;let r=n.createBiquadFilter();r.type="highpass",r.frequency.value=35;let a=n.createDynamicsCompressor();a.threshold.value=-12,a.knee.value=6,a.ratio.value=3,a.attack.value=.008,a.release.value=.24,s.connect(r).connect(a).connect(n.destination);let o=ch(n,s,{anchor:0,duration:i,interactive:!1});s.gain.setValueAtTime(0,0),s.gain.linearRampToValueAtTime(.86,Math.min(2,i*.1)),s.gain.setValueAtTime(.86,Math.max(i*.5,i-5)),s.gain.linearRampToValueAtTime(0,i);let l=await n.startRendering();return o.disconnect(),l}function Nd(i){if(!i||!Number.isInteger(i.numberOfChannels)||i.numberOfChannels<1)throw new TypeError("Expected an AudioBuffer.");let e=i.numberOfChannels,t=e*2,n=i.length*t;if(n>4294967251)throw new RangeError("Audio exceeds WAV size limits.");let s=new ArrayBuffer(44+n),r=new DataView(s),a=(c,u)=>{for(let f=0;f<u.length;f++)r.setUint8(c+f,u.charCodeAt(f))};a(0,"RIFF"),r.setUint32(4,n+36,!0),a(8,"WAVE"),a(12,"fmt "),r.setUint32(16,16,!0),r.setUint16(20,1,!0),r.setUint16(22,e,!0),r.setUint32(24,i.sampleRate,!0),r.setUint32(28,i.sampleRate*t,!0),r.setUint16(32,t,!0),r.setUint16(34,16,!0),a(36,"data"),r.setUint32(40,n,!0);let o=Array.from({length:e},(c,u)=>i.getChannelData(u)),l=44;for(let c=0;c<i.length;c++)for(let u=0;u<e;u++){let f=Number.isFinite(o[u][c])?Ii(o[u][c],-1,1):0;r.setInt16(l,Math.round(f*(f<0?32768:32767)),!0),l+=2}return s}var Xe=i=>document.getElementById(i),uh=new URLSearchParams(location.search).has("capture");uh&&document.body.classList.add("capture");var Tt,_n,ri=!1,hn=!1,Wn=!1,ss="journey",Lt=0,ta=performance.now(),$s=0,ai=!1,Ud,Od,Bd=!1,Al=!1,Rl=!1,Ks={x:0,y:0},Cl={x:0,y:0},zt={x:innerWidth/2,y:innerHeight/2,inside:!1},dh=matchMedia("(prefers-reduced-motion: reduce)").matches;Xe("stillness").checked=dh;function is(i=0){Tt.render(Lt,{pointer:Ks,tension:$s,mode:ri?ss:"drift",reducedMotion:dh,dt:i,paused:!1});for(let e of Tt.takeArrivals())ri&&_n?.awaken?.({energy:e.energy??e.potency,pan:Math.max(-.8,Math.min(.8,(e.root?.x||0)/15)),material:e.material})}function na(){let i=Math.max(0,rh.findLastIndex(e=>Lt>=e.at));Xe("chapter-number").textContent=["I","II","III","IV","V"][i],Xe("chapter-name").textContent=ss==="drift"?"A little longer":rh[i].name,Xe("progress").setAttribute("aria-valuenow",Math.min(180,Math.floor(Lt))),Xe("progress").firstElementChild.style.width=`${Math.min(100,Lt/180*100)}%`,Xe("pause-toggle").textContent=hn?"Pause":"Resume",Xe("pause-toggle").setAttribute("aria-label",hn?"Pause the passage":"Resume the passage")}function js(){document.body.classList.remove("idle"),clearTimeout(Ud),Ud=setTimeout(()=>{hn&&!Xe("about-panel").open&&!ai&&document.body.classList.add("idle")},4500)}async function wl(i="journey"){if(Tt){si(!1),Tt.resetWorld(),$s=0,ss=i,ri=!0,Lt=i==="drift"?180:0,hn=!0,Xe("ending").hidden=!0,document.body.classList.add("entered","hint"),clearTimeout(Od),Od=setTimeout(()=>document.body.classList.remove("hint"),10500);try{await _n.start(Lt),i==="drift"&&_n.linger?.(Lt),Al=!0,_n.setMuted(Wn)}catch(e){console.warn("Sound could not start:",e),Wn=!0,Xe("sound-toggle").textContent="Enable sound"}ta=performance.now(),na(),js(),Xe("invitation").inert=!0,Xe("controls").inert=!1,Xe("world").tabIndex=0,Xe("world").focus({preventScroll:!0})}}function ns(i=!hn){i||si(!1),hn=i,_n?.setPaused(!hn),na(),js()}function ix(){si(!1),Tt.settleView(),ss="drift",hn=!0,Xe("ending").hidden=!0,_n?.linger?.(Lt),_n?.setPaused(!1),ta=performance.now(),Xe("world").focus({preventScroll:!0}),na(),js()}function si(i=!0){if(ai){let e=Tt.stats().physics,t=Tt.endGrab({awaken:i});i&&t&&_n?.pluck({energy:Math.min(1,e.energy+e.maxDisplacement*.3),ropeIndex:t.ropeIndex,pan:Ks.x*.7})}ai=!1,Rl=!1,document.body.classList.remove("holding"),Xe("cursor-word").textContent=""}function sx(i){si(!1),Tt.resetWorld(),Lt=Math.max(0,Math.min(bl,i)),_n?.seek(Lt),is(),na()}function ea(i){zt.x=i.clientX,zt.y=i.clientY,zt.inside=!0,Cl.x=(i.clientX/innerWidth-.5)*2,Cl.y=-(i.clientY/innerHeight-.5)*2,Xe("presence").style.left=i.clientX+"px",Xe("presence").style.top=i.clientY+"px",document.body.classList.add("pointer-in")}function hh(){if(!ri||!zt.inside||ai)return;let i=Tt.hoverAt(zt.x,zt.y);document.body.classList.toggle("thread-near",!!i),Xe("cursor-word").textContent=i?i.reflected?"a reflection":"take up":""}function zd(){return!ri||ai||!Tt.beginGrab(zt.x,zt.y)?!1:(ai=!0,document.body.classList.add("holding"),document.body.classList.remove("hint"),Xe("cursor-word").textContent="release",js(),!0)}try{let t=function(n){let s=Math.max(0,Math.min(.1,(n-ta)/1e3));ta=n,hn&&(Lt+=s),hn&&ss==="journey"&&Lt>=bl&&(Lt=bl,ns(!1),Xe("ending").hidden=!1,Xe("stay").focus(),document.body.classList.remove("pointer-in")),Ks.x+=(Cl.x-Ks.x)*Math.min(1,s*1.4),Ks.y+=(Cl.y-Ks.y)*Math.min(1,s*1.4);let r=Tt.stats().physics;$s+=(Math.min(1,r.maxDisplacement*.65+r.energy*.3)-$s)*Math.min(1,s*4),_n.update({time:Lt,tension:$s,proximity:Math.max(0,1-Math.abs(Lt-132)/72)}),ri||(Lt=18),is(s),e+=s,e>.12&&(hh(),e=0),ri&&na(),requestAnimationFrame(t)};Tt=Id(Xe("world"),{capture:uh}),_n=new Tl,is(),window.__loom={ready:!0,canvas:Tt.canvas,renderFrame(n,s=30){Lt=n/s,Tt.render(Lt,{mode:"journey",tension:0,reducedMotion:!1,deterministic:!0})},setSize:Tt.setSize,renderScore:Fd,audioBufferToWav:Nd,seek:sx,interactionTargets:Tt.interactionTargets,interactionSamples:Tt.interactionSamples,diagnoseRadiance:Tt.diagnoseRadiance,stats:()=>({...Tt.stats(),time:Lt,playing:hn,muted:Wn,mode:ss,entered:ri,audioStarted:Al}),setState(n={}){n.time!==void 0&&(Lt=n.time),n.mode&&(ss=n.mode),n.tension!==void 0&&($s=n.tension),is()}},document.body.classList.add("ready"),Xe("loading").setAttribute("aria-hidden","true"),Xe("enter").disabled=!1,Xe("drift").disabled=!1,Xe("enter").addEventListener("click",()=>wl()),Xe("drift").addEventListener("click",()=>wl("drift")),Xe("pause-toggle").addEventListener("click",()=>ns()),Xe("sound-toggle").addEventListener("click",async()=>{Al?Wn=!Wn:(await _n.start(Lt),Al=!0,Wn=!1),_n.setMuted(Wn),Xe("sound-toggle").textContent=Wn?"Sound off":"Sound on",Xe("sound-toggle").setAttribute("aria-pressed",String(!Wn)),Xe("sound-toggle").setAttribute("aria-label",Wn?"Unmute sound":"Mute sound"),js()}),Xe("restart").addEventListener("click",()=>wl()),Xe("again").addEventListener("click",()=>wl()),Xe("stay").addEventListener("click",ix),Xe("about-toggle").addEventListener("click",()=>{Bd=hn,ns(!1),document.body.classList.remove("pointer-in"),Xe("about-panel").showModal()}),Xe("about-close").addEventListener("click",()=>Xe("about-panel").close()),Xe("about-panel").addEventListener("close",()=>{Bd&&ns(!0),Xe("about-toggle").focus()}),Xe("stillness").addEventListener("change",()=>{dh=Xe("stillness").checked,is()}),Xe("full-detail").addEventListener("change",()=>{Tt.setFullDetail(Xe("full-detail").checked),is()}),Xe("fullscreen").addEventListener("click",async()=>{try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen()}catch{}}),Xe("world").addEventListener("pointerenter",n=>{ea(n),hh()}),Xe("world").addEventListener("pointerleave",()=>{ai||(zt.inside=!1,document.body.classList.remove("pointer-in","thread-near"))}),Xe("world").addEventListener("pointermove",n=>{ea(n),ai?Tt.moveGrab(zt.x,zt.y):hh(),js()}),Xe("world").addEventListener("pointerdown",n=>{n.button!==0||ai||(ea(n),zd()&&Xe("world").setPointerCapture(n.pointerId))}),window.addEventListener("pointerup",()=>si()),window.addEventListener("pointercancel",()=>si(!1)),window.addEventListener("blur",()=>{si(!1),document.body.classList.remove("pointer-in")}),document.addEventListener("keydown",n=>{if(!(!ri||Xe("about-panel").open||n.target.matches("input")||n.metaKey||n.ctrlKey||n.altKey)){if(n.code==="Space"&&!n.target.matches("button,a")){if(n.preventDefault(),n.repeat)return;if(!Tt.hoverAt(zt.x,zt.y)){let s=Tt.interactionTargets().sort((r,a)=>Math.hypot(r.clientX-innerWidth/2,r.clientY-innerHeight/2)-Math.hypot(a.clientX-innerWidth/2,a.clientY-innerHeight/2))[0];s&&ea(s)}Rl=zd()}n.code==="KeyP"&&!n.repeat&&ns(),n.code==="KeyM"&&!n.repeat&&Xe("sound-toggle").click(),Rl&&["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(n.code)&&(n.preventDefault(),zt.x+=n.code==="ArrowLeft"?-8:n.code==="ArrowRight"?8:0,zt.y+=n.code==="ArrowUp"?-8:n.code==="ArrowDown"?8:0,ea({clientX:zt.x,clientY:zt.y}),Tt.moveGrab(zt.x,zt.y))}}),document.addEventListener("keyup",n=>{n.code==="Space"&&Rl&&(n.preventDefault(),si())});let i=!1;document.addEventListener("visibilitychange",()=>{si(!1),document.hidden?(i=hn,hn&&ns(!1)):i&&(ta=performance.now(),ns(!0),i=!1)}),window.addEventListener("resize",()=>{Tt.setSize(innerWidth,innerHeight),is()});let e=0;uh||requestAnimationFrame(t)}catch(i){console.error(i),Xe("loading").style.display="none",Xe("error").hidden=!1,Xe("error").textContent=`The loom could not open. Please try a browser with WebGL 2 enabled. ${i.message}`}
/*! For license information please see app.js.LEGAL.txt */
