(function () { "use strict";
var $hxClasses = {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = ["EReg"];
EReg.prototype = {
	customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.b += Std.string(this.matchedLeft());
			buf.b += Std.string(f(this));
			s = this.matchedRight();
		}
		buf.b += Std.string(s);
		return buf.b;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,r: null
	,__class__: EReg
}
var Hash = function() {
	this.h = { };
};
$hxClasses["Hash"] = Hash;
Hash.__name__ = ["Hash"];
Hash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,set: function(key,value) {
		this.h["$" + key] = value;
	}
	,h: null
	,__class__: Hash
}
var HxOverrides = function() { }
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntHash = function() {
	this.h = { };
};
$hxClasses["IntHash"] = IntHash;
IntHash.__name__ = ["IntHash"];
IntHash.prototype = {
	toString: function() {
		var s = new StringBuf();
		s.b += Std.string("{");
		var it = this.keys();
		while( it.hasNext() ) {
			var i = it.next();
			s.b += Std.string(i);
			s.b += Std.string(" => ");
			s.b += Std.string(Std.string(this.get(i)));
			if(it.hasNext()) s.b += Std.string(", ");
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,remove: function(key) {
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,exists: function(key) {
		return this.h.hasOwnProperty(key);
	}
	,get: function(key) {
		return this.h[key];
	}
	,set: function(key,value) {
		this.h[key] = value;
	}
	,h: null
	,__class__: IntHash
}
var IntIter = function(min,max) {
	this.min = min;
	this.max = max;
};
$hxClasses["IntIter"] = IntIter;
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var Lambda = function() { }
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = ["Lambda"];
Lambda.array = function(it) {
	var a = new Array();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		a.push(i);
	}
	return a;
}
Lambda.list = function(it) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var i = $it0.next();
		l.add(i);
	}
	return l;
}
Lambda.map = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(x));
	}
	return l;
}
Lambda.mapi = function(it,f) {
	var l = new List();
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(f(i++,x));
	}
	return l;
}
Lambda.has = function(it,elt,cmp) {
	if(cmp == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var x = $it0.next();
			if(x == elt) return true;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(cmp(x,elt)) return true;
		}
	}
	return false;
}
Lambda.exists = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) return true;
	}
	return false;
}
Lambda.foreach = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(!f(x)) return false;
	}
	return true;
}
Lambda.iter = function(it,f) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		f(x);
	}
}
Lambda.filter = function(it,f) {
	var l = new List();
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(f(x)) l.add(x);
	}
	return l;
}
Lambda.fold = function(it,f,first) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		first = f(x,first);
	}
	return first;
}
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var $it0 = $iterator(it)();
		while( $it0.hasNext() ) {
			var _ = $it0.next();
			n++;
		}
	} else {
		var $it1 = $iterator(it)();
		while( $it1.hasNext() ) {
			var x = $it1.next();
			if(pred(x)) n++;
		}
	}
	return n;
}
Lambda.empty = function(it) {
	return !$iterator(it)().hasNext();
}
Lambda.indexOf = function(it,v) {
	var i = 0;
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var v2 = $it0.next();
		if(v == v2) return i;
		i++;
	}
	return -1;
}
Lambda.concat = function(a,b) {
	var l = new List();
	var $it0 = $iterator(a)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		l.add(x);
	}
	var $it1 = $iterator(b)();
	while( $it1.hasNext() ) {
		var x = $it1.next();
		l.add(x);
	}
	return l;
}
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += Std.string("{");
		while(l != null) {
			if(first) first = false; else s.b += Std.string(", ");
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var Reflect = function() { }
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = function() { }
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = function() { }
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { }
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var org = {}
org.slplayer = {}
org.slplayer.component = {}
org.slplayer.component.ISLPlayerComponent = function() { }
$hxClasses["org.slplayer.component.ISLPlayerComponent"] = org.slplayer.component.ISLPlayerComponent;
org.slplayer.component.ISLPlayerComponent.__name__ = ["org","slplayer","component","ISLPlayerComponent"];
org.slplayer.component.ISLPlayerComponent.prototype = {
	getSLPlayer: null
	,SLPlayerInstanceId: null
	,__class__: org.slplayer.component.ISLPlayerComponent
}
org.slplayer.component.ui = {}
org.slplayer.component.ui.IDisplayObject = function() { }
$hxClasses["org.slplayer.component.ui.IDisplayObject"] = org.slplayer.component.ui.IDisplayObject;
org.slplayer.component.ui.IDisplayObject.__name__ = ["org","slplayer","component","ui","IDisplayObject"];
org.slplayer.component.ui.IDisplayObject.__interfaces__ = [org.slplayer.component.ISLPlayerComponent];
org.slplayer.component.ui.IDisplayObject.prototype = {
	rootElement: null
	,__class__: org.slplayer.component.ui.IDisplayObject
}
org.slplayer.component.ui.DisplayObject = function(rootElement,SLPId) {
	this.rootElement = rootElement;
	org.slplayer.component.SLPlayerComponent.initSLPlayerComponent(this,SLPId);
	org.slplayer.core.Application.get(this.SLPlayerInstanceId).addAssociatedComponent(rootElement,this);
};
$hxClasses["org.slplayer.component.ui.DisplayObject"] = org.slplayer.component.ui.DisplayObject;
org.slplayer.component.ui.DisplayObject.__name__ = ["org","slplayer","component","ui","DisplayObject"];
org.slplayer.component.ui.DisplayObject.__interfaces__ = [org.slplayer.component.ui.IDisplayObject];
org.slplayer.component.ui.DisplayObject.isDisplayObject = function(cmpClass) {
	if(cmpClass == Type.resolveClass("org.slplayer.component.ui.DisplayObject")) return true;
	if(Type.getSuperClass(cmpClass) != null) return org.slplayer.component.ui.DisplayObject.isDisplayObject(Type.getSuperClass(cmpClass));
	return false;
}
org.slplayer.component.ui.DisplayObject.checkFilterOnElt = function(cmpClass,elt) {
	if(elt.nodeType != js.Lib.document.body.nodeType) throw "cannot instantiate " + Type.getClassName(cmpClass) + " on a non element node.";
	var tagFilter = haxe.rtti.Meta.getType(cmpClass) != null?haxe.rtti.Meta.getType(cmpClass).tagNameFilter:null;
	if(tagFilter == null) return;
	if(Lambda.exists(tagFilter,function(s) {
		return elt.nodeName.toLowerCase() == Std.string(s).toLowerCase();
	})) return;
	throw "cannot instantiate " + Type.getClassName(cmpClass) + " on this type of HTML element: " + elt.nodeName.toLowerCase();
}
org.slplayer.component.ui.DisplayObject.prototype = {
	init: function() {
	}
	,getSLPlayer: function() {
		return org.slplayer.component.SLPlayerComponent.getSLPlayer(this);
	}
	,rootElement: null
	,SLPlayerInstanceId: null
	,__class__: org.slplayer.component.ui.DisplayObject
}
var com = {}
com.intermedia = {}
com.intermedia.components = {}
com.intermedia.components.ContextualResizer = function(rootElement,SLPId) {
	org.slplayer.component.ui.DisplayObject.call(this,rootElement,SLPId);
	js.Lib.document.body.addEventListener("resize",$bind(this,this.onResize),false);
	this.onResize(null);
};
$hxClasses["com.intermedia.components.ContextualResizer"] = com.intermedia.components.ContextualResizer;
com.intermedia.components.ContextualResizer.__name__ = ["com","intermedia","components","ContextualResizer"];
com.intermedia.components.ContextualResizer.__super__ = org.slplayer.component.ui.DisplayObject;
com.intermedia.components.ContextualResizer.prototype = $extend(org.slplayer.component.ui.DisplayObject.prototype,{
	onResize: function(e) {
		if(js.Lib.document.body.clientHeight < 780 && js.Lib.document.body.clientWidth < 980) {
			this.rootElement.style.width = "60.26px";
			this.rootElement.style.height = "48.69px";
			this.rootElement.style.marginLeft = "35px";
		}
	}
	,__class__: com.intermedia.components.ContextualResizer
});
com.intermedia.components.ResizeGallery = function(rootElement,SLPId) {
	org.slplayer.component.ui.DisplayObject.call(this,rootElement,SLPId);
	js.Lib.document.body.addEventListener("resize",$bind(this,this.onResize),false);
	this.onResize(null);
};
$hxClasses["com.intermedia.components.ResizeGallery"] = com.intermedia.components.ResizeGallery;
com.intermedia.components.ResizeGallery.__name__ = ["com","intermedia","components","ResizeGallery"];
com.intermedia.components.ResizeGallery.__super__ = org.slplayer.component.ui.DisplayObject;
com.intermedia.components.ResizeGallery.prototype = $extend(org.slplayer.component.ui.DisplayObject.prototype,{
	onResize: function(e) {
		if(js.Lib.document.body.clientHeight < 780 && js.Lib.document.body.clientWidth < 980) {
			this.rootElement.style.width = "115.5px";
			this.rootElement.style.height = "56.7px";
			this.rootElement.style.marginLeft = "185px";
			this.rootElement.style.marginTop = "19px";
		}
	}
	,__class__: com.intermedia.components.ResizeGallery
});
var haxe = {}
haxe.FastCell = function(elt,next) {
	this.elt = elt;
	this.next = next;
};
$hxClasses["haxe.FastCell"] = haxe.FastCell;
haxe.FastCell.__name__ = ["haxe","FastCell"];
haxe.FastCell.prototype = {
	next: null
	,elt: null
	,__class__: haxe.FastCell
}
haxe.FastList = function() {
};
$hxClasses["haxe.FastList"] = haxe.FastList;
haxe.FastList.__name__ = ["haxe","FastList"];
haxe.FastList.prototype = {
	toString: function() {
		var a = new Array();
		var l = this.head;
		while(l != null) {
			a.push(l.elt);
			l = l.next;
		}
		return "{" + a.join(",") + "}";
	}
	,iterator: function() {
		var l = this.head;
		return { hasNext : function() {
			return l != null;
		}, next : function() {
			var k = l;
			l = k.next;
			return k.elt;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.head;
		while(l != null) {
			if(l.elt == v) {
				if(prev == null) this.head = l.next; else prev.next = l.next;
				break;
			}
			prev = l;
			l = l.next;
		}
		return l != null;
	}
	,isEmpty: function() {
		return this.head == null;
	}
	,pop: function() {
		var k = this.head;
		if(k == null) return null; else {
			this.head = k.next;
			return k.elt;
		}
	}
	,first: function() {
		return this.head == null?null:this.head.elt;
	}
	,add: function(item) {
		this.head = new haxe.FastCell(item,this.head);
	}
	,head: null
	,__class__: haxe.FastList
}
haxe.Http = function(url) {
	this.url = url;
	this.headers = new Hash();
	this.params = new Hash();
	this.async = true;
};
$hxClasses["haxe.Http"] = haxe.Http;
haxe.Http.__name__ = ["haxe","Http"];
haxe.Http.requestUrl = function(url) {
	var h = new haxe.Http(url);
	h.async = false;
	var r = null;
	h.onData = function(d) {
		r = d;
	};
	h.onError = function(e) {
		throw e;
	};
	h.request(false);
	return r;
}
haxe.Http.prototype = {
	onStatus: function(status) {
	}
	,onError: function(msg) {
	}
	,onData: function(data) {
	}
	,request: function(post) {
		var me = this;
		var r = new js.XMLHttpRequest();
		var onreadystatechange = function() {
			if(r.readyState != 4) return;
			var s = (function($this) {
				var $r;
				try {
					$r = r.status;
				} catch( e ) {
					$r = null;
				}
				return $r;
			}(this));
			if(s == undefined) s = null;
			if(s != null) me.onStatus(s);
			if(s != null && s >= 200 && s < 400) me.onData(r.responseText); else switch(s) {
			case null: case undefined:
				me.onError("Failed to connect or resolve host");
				break;
			case 12029:
				me.onError("Failed to connect to host");
				break;
			case 12007:
				me.onError("Unknown host");
				break;
			default:
				me.onError("Http Error #" + r.status);
			}
		};
		if(this.async) r.onreadystatechange = onreadystatechange;
		var uri = this.postData;
		if(uri != null) post = true; else {
			var $it0 = this.params.keys();
			while( $it0.hasNext() ) {
				var p = $it0.next();
				if(uri == null) uri = ""; else uri += "&";
				uri += StringTools.urlEncode(p) + "=" + StringTools.urlEncode(this.params.get(p));
			}
		}
		try {
			if(post) r.open("POST",this.url,this.async); else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question?"?":"&") + uri,this.async);
				uri = null;
			} else r.open("GET",this.url,this.async);
		} catch( e ) {
			this.onError(e.toString());
			return;
		}
		if(this.headers.get("Content-Type") == null && post && this.postData == null) r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var $it1 = this.headers.keys();
		while( $it1.hasNext() ) {
			var h = $it1.next();
			r.setRequestHeader(h,this.headers.get(h));
		}
		r.send(uri);
		if(!this.async) onreadystatechange();
	}
	,setPostData: function(data) {
		this.postData = data;
	}
	,setParameter: function(param,value) {
		this.params.set(param,value);
	}
	,setHeader: function(header,value) {
		this.headers.set(header,value);
	}
	,params: null
	,headers: null
	,postData: null
	,async: null
	,url: null
	,__class__: haxe.Http
}
haxe.Int32 = function() { }
$hxClasses["haxe.Int32"] = haxe.Int32;
haxe.Int32.__name__ = ["haxe","Int32"];
haxe.Int32.make = function(a,b) {
	return a << 16 | b;
}
haxe.Int32.ofInt = function(x) {
	return x | 0;
}
haxe.Int32.clamp = function(x) {
	return x | 0;
}
haxe.Int32.toInt = function(x) {
	if((x >> 30 & 1) != x >>> 31) throw "Overflow " + Std.string(x);
	return x;
}
haxe.Int32.toNativeInt = function(x) {
	return x;
}
haxe.Int32.add = function(a,b) {
	return a + b | 0;
}
haxe.Int32.sub = function(a,b) {
	return a - b | 0;
}
haxe.Int32.mul = function(a,b) {
	return a * (b & 65535) + (a * (b >>> 16) << 16 | 0) | 0;
}
haxe.Int32.div = function(a,b) {
	return a / b | 0;
}
haxe.Int32.mod = function(a,b) {
	return a % b;
}
haxe.Int32.shl = function(a,b) {
	return a << b;
}
haxe.Int32.shr = function(a,b) {
	return a >> b;
}
haxe.Int32.ushr = function(a,b) {
	return a >>> b;
}
haxe.Int32.and = function(a,b) {
	return a & b;
}
haxe.Int32.or = function(a,b) {
	return a | b;
}
haxe.Int32.xor = function(a,b) {
	return a ^ b;
}
haxe.Int32.neg = function(a) {
	return -a;
}
haxe.Int32.isNeg = function(a) {
	return a < 0;
}
haxe.Int32.isZero = function(a) {
	return a == 0;
}
haxe.Int32.complement = function(a) {
	return ~a;
}
haxe.Int32.compare = function(a,b) {
	return a - b;
}
haxe.Int32.ucompare = function(a,b) {
	if(a < 0) return b < 0?~b - ~a:1;
	return b < 0?-1:a - b;
}
haxe.Log = function() { }
$hxClasses["haxe.Log"] = haxe.Log;
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Serializer = function() {
	this.buf = new StringBuf();
	this.cache = new Array();
	this.useCache = haxe.Serializer.USE_CACHE;
	this.useEnumIndex = haxe.Serializer.USE_ENUM_INDEX;
	this.shash = new Hash();
	this.scount = 0;
};
$hxClasses["haxe.Serializer"] = haxe.Serializer;
haxe.Serializer.__name__ = ["haxe","Serializer"];
haxe.Serializer.run = function(v) {
	var s = new haxe.Serializer();
	s.serialize(v);
	return s.toString();
}
haxe.Serializer.prototype = {
	serializeException: function(e) {
		this.buf.b += Std.string("x");
		this.serialize(e);
	}
	,serialize: function(v) {
		var $e = (Type["typeof"](v));
		switch( $e[1] ) {
		case 0:
			this.buf.b += Std.string("n");
			break;
		case 1:
			if(v == 0) {
				this.buf.b += Std.string("z");
				return;
			}
			this.buf.b += Std.string("i");
			this.buf.b += Std.string(v);
			break;
		case 2:
			if(Math.isNaN(v)) this.buf.b += Std.string("k"); else if(!Math.isFinite(v)) this.buf.b += Std.string(v < 0?"m":"p"); else {
				this.buf.b += Std.string("d");
				this.buf.b += Std.string(v);
			}
			break;
		case 3:
			this.buf.b += Std.string(v?"t":"f");
			break;
		case 6:
			var c = $e[2];
			if(c == String) {
				this.serializeString(v);
				return;
			}
			if(this.useCache && this.serializeRef(v)) return;
			switch(c) {
			case Array:
				var ucount = 0;
				this.buf.b += Std.string("a");
				var l = v.length;
				var _g = 0;
				while(_g < l) {
					var i = _g++;
					if(v[i] == null) ucount++; else {
						if(ucount > 0) {
							if(ucount == 1) this.buf.b += Std.string("n"); else {
								this.buf.b += Std.string("u");
								this.buf.b += Std.string(ucount);
							}
							ucount = 0;
						}
						this.serialize(v[i]);
					}
				}
				if(ucount > 0) {
					if(ucount == 1) this.buf.b += Std.string("n"); else {
						this.buf.b += Std.string("u");
						this.buf.b += Std.string(ucount);
					}
				}
				this.buf.b += Std.string("h");
				break;
			case List:
				this.buf.b += Std.string("l");
				var v1 = v;
				var $it0 = v1.iterator();
				while( $it0.hasNext() ) {
					var i = $it0.next();
					this.serialize(i);
				}
				this.buf.b += Std.string("h");
				break;
			case Date:
				var d = v;
				this.buf.b += Std.string("v");
				this.buf.b += Std.string(HxOverrides.dateStr(d));
				break;
			case Hash:
				this.buf.b += Std.string("b");
				var v1 = v;
				var $it1 = v1.keys();
				while( $it1.hasNext() ) {
					var k = $it1.next();
					this.serializeString(k);
					this.serialize(v1.get(k));
				}
				this.buf.b += Std.string("h");
				break;
			case IntHash:
				this.buf.b += Std.string("q");
				var v1 = v;
				var $it2 = v1.keys();
				while( $it2.hasNext() ) {
					var k = $it2.next();
					this.buf.b += Std.string(":");
					this.buf.b += Std.string(k);
					this.serialize(v1.get(k));
				}
				this.buf.b += Std.string("h");
				break;
			case haxe.io.Bytes:
				var v1 = v;
				var i = 0;
				var max = v1.length - 2;
				var charsBuf = new StringBuf();
				var b64 = haxe.Serializer.BASE64;
				while(i < max) {
					var b1 = v1.b[i++];
					var b2 = v1.b[i++];
					var b3 = v1.b[i++];
					charsBuf.b += Std.string(b64.charAt(b1 >> 2));
					charsBuf.b += Std.string(b64.charAt((b1 << 4 | b2 >> 4) & 63));
					charsBuf.b += Std.string(b64.charAt((b2 << 2 | b3 >> 6) & 63));
					charsBuf.b += Std.string(b64.charAt(b3 & 63));
				}
				if(i == max) {
					var b1 = v1.b[i++];
					var b2 = v1.b[i++];
					charsBuf.b += Std.string(b64.charAt(b1 >> 2));
					charsBuf.b += Std.string(b64.charAt((b1 << 4 | b2 >> 4) & 63));
					charsBuf.b += Std.string(b64.charAt(b2 << 2 & 63));
				} else if(i == max + 1) {
					var b1 = v1.b[i++];
					charsBuf.b += Std.string(b64.charAt(b1 >> 2));
					charsBuf.b += Std.string(b64.charAt(b1 << 4 & 63));
				}
				var chars = charsBuf.b;
				this.buf.b += Std.string("s");
				this.buf.b += Std.string(chars.length);
				this.buf.b += Std.string(":");
				this.buf.b += Std.string(chars);
				break;
			default:
				this.cache.pop();
				if(v.hxSerialize != null) {
					this.buf.b += Std.string("C");
					this.serializeString(Type.getClassName(c));
					this.cache.push(v);
					v.hxSerialize(this);
					this.buf.b += Std.string("g");
				} else {
					this.buf.b += Std.string("c");
					this.serializeString(Type.getClassName(c));
					this.cache.push(v);
					this.serializeFields(v);
				}
			}
			break;
		case 4:
			if(this.useCache && this.serializeRef(v)) return;
			this.buf.b += Std.string("o");
			this.serializeFields(v);
			break;
		case 7:
			var e = $e[2];
			if(this.useCache && this.serializeRef(v)) return;
			this.cache.pop();
			this.buf.b += Std.string(this.useEnumIndex?"j":"w");
			this.serializeString(Type.getEnumName(e));
			if(this.useEnumIndex) {
				this.buf.b += Std.string(":");
				this.buf.b += Std.string(v[1]);
			} else this.serializeString(v[0]);
			this.buf.b += Std.string(":");
			var l = v.length;
			this.buf.b += Std.string(l - 2);
			var _g = 2;
			while(_g < l) {
				var i = _g++;
				this.serialize(v[i]);
			}
			this.cache.push(v);
			break;
		case 5:
			throw "Cannot serialize function";
			break;
		default:
			throw "Cannot serialize " + Std.string(v);
		}
	}
	,serializeFields: function(v) {
		var _g = 0, _g1 = Reflect.fields(v);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			this.serializeString(f);
			this.serialize(Reflect.field(v,f));
		}
		this.buf.b += Std.string("g");
	}
	,serializeRef: function(v) {
		var vt = typeof(v);
		var _g1 = 0, _g = this.cache.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ci = this.cache[i];
			if(typeof(ci) == vt && ci == v) {
				this.buf.b += Std.string("r");
				this.buf.b += Std.string(i);
				return true;
			}
		}
		this.cache.push(v);
		return false;
	}
	,serializeString: function(s) {
		var x = this.shash.get(s);
		if(x != null) {
			this.buf.b += Std.string("R");
			this.buf.b += Std.string(x);
			return;
		}
		this.shash.set(s,this.scount++);
		this.buf.b += Std.string("y");
		s = StringTools.urlEncode(s);
		this.buf.b += Std.string(s.length);
		this.buf.b += Std.string(":");
		this.buf.b += Std.string(s);
	}
	,toString: function() {
		return this.buf.b;
	}
	,useEnumIndex: null
	,useCache: null
	,scount: null
	,shash: null
	,cache: null
	,buf: null
	,__class__: haxe.Serializer
}
haxe._Template = {}
haxe._Template.TemplateExpr = $hxClasses["haxe._Template.TemplateExpr"] = { __ename__ : ["haxe","_Template","TemplateExpr"], __constructs__ : ["OpVar","OpExpr","OpIf","OpStr","OpBlock","OpForeach","OpMacro"] }
haxe._Template.TemplateExpr.OpVar = function(v) { var $x = ["OpVar",0,v]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpExpr = function(expr) { var $x = ["OpExpr",1,expr]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpIf = function(expr,eif,eelse) { var $x = ["OpIf",2,expr,eif,eelse]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpStr = function(str) { var $x = ["OpStr",3,str]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpBlock = function(l) { var $x = ["OpBlock",4,l]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpForeach = function(expr,loop) { var $x = ["OpForeach",5,expr,loop]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe._Template.TemplateExpr.OpMacro = function(name,params) { var $x = ["OpMacro",6,name,params]; $x.__enum__ = haxe._Template.TemplateExpr; $x.toString = $estr; return $x; }
haxe.Template = function(str) {
	var tokens = this.parseTokens(str);
	this.expr = this.parseBlock(tokens);
	if(!tokens.isEmpty()) throw "Unexpected '" + Std.string(tokens.first().s) + "'";
};
$hxClasses["haxe.Template"] = haxe.Template;
haxe.Template.__name__ = ["haxe","Template"];
haxe.Template.prototype = {
	run: function(e) {
		var $e = (e);
		switch( $e[1] ) {
		case 0:
			var v = $e[2];
			this.buf.b += Std.string(Std.string(this.resolve(v)));
			break;
		case 1:
			var e1 = $e[2];
			this.buf.b += Std.string(Std.string(e1()));
			break;
		case 2:
			var eelse = $e[4], eif = $e[3], e1 = $e[2];
			var v = e1();
			if(v == null || v == false) {
				if(eelse != null) this.run(eelse);
			} else this.run(eif);
			break;
		case 3:
			var str = $e[2];
			this.buf.b += Std.string(str);
			break;
		case 4:
			var l = $e[2];
			var $it0 = l.iterator();
			while( $it0.hasNext() ) {
				var e1 = $it0.next();
				this.run(e1);
			}
			break;
		case 5:
			var loop = $e[3], e1 = $e[2];
			var v = e1();
			try {
				var x = $iterator(v)();
				if(x.hasNext == null) throw null;
				v = x;
			} catch( e2 ) {
				try {
					if(v.hasNext == null) throw null;
				} catch( e3 ) {
					throw "Cannot iter on " + Std.string(v);
				}
			}
			this.stack.push(this.context);
			var v1 = v;
			while( v1.hasNext() ) {
				var ctx = v1.next();
				this.context = ctx;
				this.run(loop);
			}
			this.context = this.stack.pop();
			break;
		case 6:
			var params = $e[3], m = $e[2];
			var v = Reflect.field(this.macros,m);
			var pl = new Array();
			var old = this.buf;
			pl.push($bind(this,this.resolve));
			var $it1 = params.iterator();
			while( $it1.hasNext() ) {
				var p = $it1.next();
				var $e = (p);
				switch( $e[1] ) {
				case 0:
					var v1 = $e[2];
					pl.push(this.resolve(v1));
					break;
				default:
					this.buf = new StringBuf();
					this.run(p);
					pl.push(this.buf.b);
				}
			}
			this.buf = old;
			try {
				this.buf.b += Std.string(Std.string(v.apply(this.macros,pl)));
			} catch( e1 ) {
				var plstr = (function($this) {
					var $r;
					try {
						$r = pl.join(",");
					} catch( e2 ) {
						$r = "???";
					}
					return $r;
				}(this));
				var msg = "Macro call " + m + "(" + plstr + ") failed (" + Std.string(e1) + ")";
				throw msg;
			}
			break;
		}
	}
	,makeExpr2: function(l) {
		var p = l.pop();
		if(p == null) throw "<eof>";
		if(p.s) return this.makeConst(p.p);
		switch(p.p) {
		case "(":
			var e1 = this.makeExpr(l);
			var p1 = l.pop();
			if(p1 == null || p1.s) throw p1.p;
			if(p1.p == ")") return e1;
			var e2 = this.makeExpr(l);
			var p2 = l.pop();
			if(p2 == null || p2.p != ")") throw p2.p;
			return (function($this) {
				var $r;
				switch(p1.p) {
				case "+":
					$r = function() {
						return e1() + e2();
					};
					break;
				case "-":
					$r = function() {
						return e1() - e2();
					};
					break;
				case "*":
					$r = function() {
						return e1() * e2();
					};
					break;
				case "/":
					$r = function() {
						return e1() / e2();
					};
					break;
				case ">":
					$r = function() {
						return e1() > e2();
					};
					break;
				case "<":
					$r = function() {
						return e1() < e2();
					};
					break;
				case ">=":
					$r = function() {
						return e1() >= e2();
					};
					break;
				case "<=":
					$r = function() {
						return e1() <= e2();
					};
					break;
				case "==":
					$r = function() {
						return e1() == e2();
					};
					break;
				case "!=":
					$r = function() {
						return e1() != e2();
					};
					break;
				case "&&":
					$r = function() {
						return e1() && e2();
					};
					break;
				case "||":
					$r = function() {
						return e1() || e2();
					};
					break;
				default:
					$r = (function($this) {
						var $r;
						throw "Unknown operation " + p1.p;
						return $r;
					}($this));
				}
				return $r;
			}(this));
		case "!":
			var e = this.makeExpr(l);
			return function() {
				var v = e();
				return v == null || v == false;
			};
		case "-":
			var e = this.makeExpr(l);
			return function() {
				return -e();
			};
		}
		throw p.p;
	}
	,makeExpr: function(l) {
		return this.makePath(this.makeExpr2(l),l);
	}
	,makePath: function(e,l) {
		var p = l.first();
		if(p == null || p.p != ".") return e;
		l.pop();
		var field = l.pop();
		if(field == null || !field.s) throw field.p;
		var f = field.p;
		haxe.Template.expr_trim.match(f);
		f = haxe.Template.expr_trim.matched(1);
		return this.makePath(function() {
			return Reflect.field(e(),f);
		},l);
	}
	,makeConst: function(v) {
		haxe.Template.expr_trim.match(v);
		v = haxe.Template.expr_trim.matched(1);
		if(HxOverrides.cca(v,0) == 34) {
			var str = HxOverrides.substr(v,1,v.length - 2);
			return function() {
				return str;
			};
		}
		if(haxe.Template.expr_int.match(v)) {
			var i = Std.parseInt(v);
			return function() {
				return i;
			};
		}
		if(haxe.Template.expr_float.match(v)) {
			var f = Std.parseFloat(v);
			return function() {
				return f;
			};
		}
		var me = this;
		return function() {
			return me.resolve(v);
		};
	}
	,parseExpr: function(data) {
		var l = new List();
		var expr = data;
		while(haxe.Template.expr_splitter.match(data)) {
			var p = haxe.Template.expr_splitter.matchedPos();
			var k = p.pos + p.len;
			if(p.pos != 0) l.add({ p : HxOverrides.substr(data,0,p.pos), s : true});
			var p1 = haxe.Template.expr_splitter.matched(0);
			l.add({ p : p1, s : p1.indexOf("\"") >= 0});
			data = haxe.Template.expr_splitter.matchedRight();
		}
		if(data.length != 0) l.add({ p : data, s : true});
		var e;
		try {
			e = this.makeExpr(l);
			if(!l.isEmpty()) throw l.first().p;
		} catch( s ) {
			if( js.Boot.__instanceof(s,String) ) {
				throw "Unexpected '" + s + "' in " + expr;
			} else throw(s);
		}
		return function() {
			try {
				return e();
			} catch( exc ) {
				throw "Error : " + Std.string(exc) + " in " + expr;
			}
		};
	}
	,parse: function(tokens) {
		var t = tokens.pop();
		var p = t.p;
		if(t.s) return haxe._Template.TemplateExpr.OpStr(p);
		if(t.l != null) {
			var pe = new List();
			var _g = 0, _g1 = t.l;
			while(_g < _g1.length) {
				var p1 = _g1[_g];
				++_g;
				pe.add(this.parseBlock(this.parseTokens(p1)));
			}
			return haxe._Template.TemplateExpr.OpMacro(p,pe);
		}
		if(HxOverrides.substr(p,0,3) == "if ") {
			p = HxOverrides.substr(p,3,p.length - 3);
			var e = this.parseExpr(p);
			var eif = this.parseBlock(tokens);
			var t1 = tokens.first();
			var eelse;
			if(t1 == null) throw "Unclosed 'if'";
			if(t1.p == "end") {
				tokens.pop();
				eelse = null;
			} else if(t1.p == "else") {
				tokens.pop();
				eelse = this.parseBlock(tokens);
				t1 = tokens.pop();
				if(t1 == null || t1.p != "end") throw "Unclosed 'else'";
			} else {
				t1.p = HxOverrides.substr(t1.p,4,t1.p.length - 4);
				eelse = this.parse(tokens);
			}
			return haxe._Template.TemplateExpr.OpIf(e,eif,eelse);
		}
		if(HxOverrides.substr(p,0,8) == "foreach ") {
			p = HxOverrides.substr(p,8,p.length - 8);
			var e = this.parseExpr(p);
			var efor = this.parseBlock(tokens);
			var t1 = tokens.pop();
			if(t1 == null || t1.p != "end") throw "Unclosed 'foreach'";
			return haxe._Template.TemplateExpr.OpForeach(e,efor);
		}
		if(haxe.Template.expr_splitter.match(p)) return haxe._Template.TemplateExpr.OpExpr(this.parseExpr(p));
		return haxe._Template.TemplateExpr.OpVar(p);
	}
	,parseBlock: function(tokens) {
		var l = new List();
		while(true) {
			var t = tokens.first();
			if(t == null) break;
			if(!t.s && (t.p == "end" || t.p == "else" || HxOverrides.substr(t.p,0,7) == "elseif ")) break;
			l.add(this.parse(tokens));
		}
		if(l.length == 1) return l.first();
		return haxe._Template.TemplateExpr.OpBlock(l);
	}
	,parseTokens: function(data) {
		var tokens = new List();
		while(haxe.Template.splitter.match(data)) {
			var p = haxe.Template.splitter.matchedPos();
			if(p.pos > 0) tokens.add({ p : HxOverrides.substr(data,0,p.pos), s : true, l : null});
			if(HxOverrides.cca(data,p.pos) == 58) {
				tokens.add({ p : HxOverrides.substr(data,p.pos + 2,p.len - 4), s : false, l : null});
				data = haxe.Template.splitter.matchedRight();
				continue;
			}
			var parp = p.pos + p.len;
			var npar = 1;
			while(npar > 0) {
				var c = HxOverrides.cca(data,parp);
				if(c == 40) npar++; else if(c == 41) npar--; else if(c == null) throw "Unclosed macro parenthesis";
				parp++;
			}
			var params = HxOverrides.substr(data,p.pos + p.len,parp - (p.pos + p.len) - 1).split(",");
			tokens.add({ p : haxe.Template.splitter.matched(2), s : false, l : params});
			data = HxOverrides.substr(data,parp,data.length - parp);
		}
		if(data.length > 0) tokens.add({ p : data, s : true, l : null});
		return tokens;
	}
	,resolve: function(v) {
		if(Reflect.hasField(this.context,v)) return Reflect.field(this.context,v);
		var $it0 = this.stack.iterator();
		while( $it0.hasNext() ) {
			var ctx = $it0.next();
			if(Reflect.hasField(ctx,v)) return Reflect.field(ctx,v);
		}
		if(v == "__current__") return this.context;
		return Reflect.field(haxe.Template.globals,v);
	}
	,execute: function(context,macros) {
		this.macros = macros == null?{ }:macros;
		this.context = context;
		this.stack = new List();
		this.buf = new StringBuf();
		this.run(this.expr);
		return this.buf.b;
	}
	,buf: null
	,stack: null
	,macros: null
	,context: null
	,expr: null
	,__class__: haxe.Template
}
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = window.setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe.Timer;
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
}
haxe.Timer.measure = function(f,pos) {
	var t0 = haxe.Timer.stamp();
	var r = f();
	haxe.Log.trace(haxe.Timer.stamp() - t0 + "s",pos);
	return r;
}
haxe.Timer.stamp = function() {
	return new Date().getTime() / 1000;
}
haxe.Timer.prototype = {
	run: function() {
	}
	,stop: function() {
		if(this.id == null) return;
		window.clearInterval(this.id);
		this.id = null;
	}
	,id: null
	,__class__: haxe.Timer
}
haxe.Unserializer = function(buf) {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = new Array();
	this.cache = new Array();
	var r = haxe.Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = Type;
		haxe.Unserializer.DEFAULT_RESOLVER = r;
	}
	this.setResolver(r);
};
$hxClasses["haxe.Unserializer"] = haxe.Unserializer;
haxe.Unserializer.__name__ = ["haxe","Unserializer"];
haxe.Unserializer.initCodes = function() {
	var codes = new Array();
	var _g1 = 0, _g = haxe.Unserializer.BASE64.length;
	while(_g1 < _g) {
		var i = _g1++;
		codes[haxe.Unserializer.BASE64.charCodeAt(i)] = i;
	}
	return codes;
}
haxe.Unserializer.run = function(v) {
	return new haxe.Unserializer(v).unserialize();
}
haxe.Unserializer.prototype = {
	unserialize: function() {
		switch(this.buf.charCodeAt(this.pos++)) {
		case 110:
			return null;
		case 116:
			return true;
		case 102:
			return false;
		case 122:
			return 0;
		case 105:
			return this.readDigits();
		case 100:
			var p1 = this.pos;
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
			}
			return Std.parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
		case 121:
			var len = this.readDigits();
			if(this.buf.charCodeAt(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid string length";
			var s = HxOverrides.substr(this.buf,this.pos,len);
			this.pos += len;
			s = StringTools.urlDecode(s);
			this.scache.push(s);
			return s;
		case 107:
			return Math.NaN;
		case 109:
			return Math.NEGATIVE_INFINITY;
		case 112:
			return Math.POSITIVE_INFINITY;
		case 97:
			var buf = this.buf;
			var a = new Array();
			this.cache.push(a);
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c == 104) {
					this.pos++;
					break;
				}
				if(c == 117) {
					this.pos++;
					var n = this.readDigits();
					a[a.length + n - 1] = null;
				} else a.push(this.unserialize());
			}
			return a;
		case 111:
			var o = { };
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 114:
			var n = this.readDigits();
			if(n < 0 || n >= this.cache.length) throw "Invalid reference";
			return this.cache[n];
		case 82:
			var n = this.readDigits();
			if(n < 0 || n >= this.scache.length) throw "Invalid string reference";
			return this.scache[n];
		case 120:
			throw this.unserialize();
			break;
		case 99:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o = Type.createEmptyInstance(cl);
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 119:
			var name = this.unserialize();
			var edecl = this.resolver.resolveEnum(name);
			if(edecl == null) throw "Enum not found " + name;
			var e = this.unserializeEnum(edecl,this.unserialize());
			this.cache.push(e);
			return e;
		case 106:
			var name = this.unserialize();
			var edecl = this.resolver.resolveEnum(name);
			if(edecl == null) throw "Enum not found " + name;
			this.pos++;
			var index = this.readDigits();
			var tag = Type.getEnumConstructs(edecl)[index];
			if(tag == null) throw "Unknown enum index " + name + "@" + index;
			var e = this.unserializeEnum(edecl,tag);
			this.cache.push(e);
			return e;
		case 108:
			var l = new List();
			this.cache.push(l);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
			this.pos++;
			return l;
		case 98:
			var h = new Hash();
			this.cache.push(h);
			var buf = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s = this.unserialize();
				h.set(s,this.unserialize());
			}
			this.pos++;
			return h;
		case 113:
			var h = new IntHash();
			this.cache.push(h);
			var buf = this.buf;
			var c = this.buf.charCodeAt(this.pos++);
			while(c == 58) {
				var i = this.readDigits();
				h.set(i,this.unserialize());
				c = this.buf.charCodeAt(this.pos++);
			}
			if(c != 104) throw "Invalid IntHash format";
			return h;
		case 118:
			var d = HxOverrides.strDate(HxOverrides.substr(this.buf,this.pos,19));
			this.cache.push(d);
			this.pos += 19;
			return d;
		case 115:
			var len = this.readDigits();
			var buf = this.buf;
			if(this.buf.charCodeAt(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid bytes length";
			var codes = haxe.Unserializer.CODES;
			if(codes == null) {
				codes = haxe.Unserializer.initCodes();
				haxe.Unserializer.CODES = codes;
			}
			var i = this.pos;
			var rest = len & 3;
			var size = (len >> 2) * 3 + (rest >= 2?rest - 1:0);
			var max = i + (len - rest);
			var bytes = haxe.io.Bytes.alloc(size);
			var bpos = 0;
			while(i < max) {
				var c1 = codes[buf.charCodeAt(i++)];
				var c2 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c1 << 2 | c2 >> 4) & 255;
				var c3 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c2 << 4 | c3 >> 2) & 255;
				var c4 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c3 << 6 | c4) & 255;
			}
			if(rest >= 2) {
				var c1 = codes[buf.charCodeAt(i++)];
				var c2 = codes[buf.charCodeAt(i++)];
				bytes.b[bpos++] = (c1 << 2 | c2 >> 4) & 255;
				if(rest == 3) {
					var c3 = codes[buf.charCodeAt(i++)];
					bytes.b[bpos++] = (c2 << 4 | c3 >> 2) & 255;
				}
			}
			this.pos += len;
			this.cache.push(bytes);
			return bytes;
		case 67:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o = Type.createEmptyInstance(cl);
			this.cache.push(o);
			o.hxUnserialize(this);
			if(this.buf.charCodeAt(this.pos++) != 103) throw "Invalid custom data";
			return o;
		default:
		}
		this.pos--;
		throw "Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos;
	}
	,unserializeEnum: function(edecl,tag) {
		if(this.buf.charCodeAt(this.pos++) != 58) throw "Invalid enum format";
		var nargs = this.readDigits();
		if(nargs == 0) return Type.createEnum(edecl,tag);
		var args = new Array();
		while(nargs-- > 0) args.push(this.unserialize());
		return Type.createEnum(edecl,tag,args);
	}
	,unserializeObject: function(o) {
		while(true) {
			if(this.pos >= this.length) throw "Invalid object";
			if(this.buf.charCodeAt(this.pos) == 103) break;
			var k = this.unserialize();
			if(!js.Boot.__instanceof(k,String)) throw "Invalid object key";
			var v = this.unserialize();
			o[k] = v;
		}
		this.pos++;
	}
	,readDigits: function() {
		var k = 0;
		var s = false;
		var fpos = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c != c) break;
			if(c == 45) {
				if(this.pos != fpos) break;
				s = true;
				this.pos++;
				continue;
			}
			if(c < 48 || c > 57) break;
			k = k * 10 + (c - 48);
			this.pos++;
		}
		if(s) k *= -1;
		return k;
	}
	,get: function(p) {
		return this.buf.charCodeAt(p);
	}
	,getResolver: function() {
		return this.resolver;
	}
	,setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_) {
			return null;
		}}; else this.resolver = r;
	}
	,resolver: null
	,scache: null
	,cache: null
	,length: null
	,pos: null
	,buf: null
	,__class__: haxe.Unserializer
}
haxe.io = {}
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
$hxClasses["haxe.io.Bytes"] = haxe.io.Bytes;
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
}
haxe.io.Bytes.ofString = function(s) {
	var a = new Array();
	var _g1 = 0, _g = s.length;
	while(_g1 < _g) {
		var i = _g1++;
		var c = s.charCodeAt(i);
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe.io.Bytes(a.length,a);
}
haxe.io.Bytes.ofData = function(b) {
	return new haxe.io.Bytes(b.length,b);
}
haxe.io.Bytes.prototype = {
	getData: function() {
		return this.b;
	}
	,toHex: function() {
		var s = new StringBuf();
		var chars = [];
		var str = "0123456789abcdef";
		var _g1 = 0, _g = str.length;
		while(_g1 < _g) {
			var i = _g1++;
			chars.push(HxOverrides.cca(str,i));
		}
		var _g1 = 0, _g = this.length;
		while(_g1 < _g) {
			var i = _g1++;
			var c = this.b[i];
			s.b += String.fromCharCode(chars[c >> 4]);
			s.b += String.fromCharCode(chars[c & 15]);
		}
		return s.b;
	}
	,toString: function() {
		return this.readString(0,this.length);
	}
	,readString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c2 = b[i++];
				var c3 = b[i++];
				s += fcc((c & 15) << 18 | (c2 & 127) << 12 | c3 << 6 & 127 | b[i++] & 127);
			}
		}
		return s;
	}
	,compare: function(other) {
		var b1 = this.b;
		var b2 = other.b;
		var len = this.length < other.length?this.length:other.length;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			if(b1[i] != b2[i]) return b1[i] - b2[i];
		}
		return this.length - other.length;
	}
	,sub: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw haxe.io.Error.OutsideBounds;
		return new haxe.io.Bytes(len,this.b.slice(pos,pos + len));
	}
	,blit: function(pos,src,srcpos,len) {
		if(pos < 0 || srcpos < 0 || len < 0 || pos + len > this.length || srcpos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		if(b1 == b2 && pos > srcpos) {
			var i = len;
			while(i > 0) {
				i--;
				b1[i + pos] = b2[i + srcpos];
			}
			return;
		}
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b1[i + pos] = b2[i + srcpos];
		}
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,get: function(pos) {
		return this.b[pos];
	}
	,b: null
	,length: null
	,__class__: haxe.io.Bytes
}
haxe.io.BytesBuffer = function() {
	this.b = new Array();
};
$hxClasses["haxe.io.BytesBuffer"] = haxe.io.BytesBuffer;
haxe.io.BytesBuffer.__name__ = ["haxe","io","BytesBuffer"];
haxe.io.BytesBuffer.prototype = {
	getBytes: function() {
		var bytes = new haxe.io.Bytes(this.b.length,this.b);
		this.b = null;
		return bytes;
	}
	,addBytes: function(src,pos,len) {
		if(pos < 0 || len < 0 || pos + len > src.length) throw haxe.io.Error.OutsideBounds;
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = pos, _g = pos + len;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,add: function(src) {
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = 0, _g = src.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,addByte: function($byte) {
		this.b.push($byte);
	}
	,b: null
	,__class__: haxe.io.BytesBuffer
}
haxe.io.Input = function() { }
$hxClasses["haxe.io.Input"] = haxe.io.Input;
haxe.io.Input.__name__ = ["haxe","io","Input"];
haxe.io.Input.prototype = {
	getDoubleSig: function(bytes) {
		return Std.parseInt((((bytes[1] & 15) << 16 | bytes[2] << 8 | bytes[3]) * Math.pow(2,32)).toString()) + Std.parseInt(((bytes[4] >> 7) * Math.pow(2,31)).toString()) + Std.parseInt(((bytes[4] & 127) << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7]).toString());
	}
	,readString: function(len) {
		var b = haxe.io.Bytes.alloc(len);
		this.readFullBytes(b,0,len);
		return b.toString();
	}
	,readInt32: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var ch4 = this.readByte();
		return this.bigEndian?(ch1 << 8 | ch2) << 16 | (ch3 << 8 | ch4):(ch4 << 8 | ch3) << 16 | (ch2 << 8 | ch1);
	}
	,readUInt30: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var ch4 = this.readByte();
		if((this.bigEndian?ch1:ch4) >= 64) throw haxe.io.Error.Overflow;
		return this.bigEndian?ch4 | ch3 << 8 | ch2 << 16 | ch1 << 24:ch1 | ch2 << 8 | ch3 << 16 | ch4 << 24;
	}
	,readInt31: function() {
		var ch1, ch2, ch3, ch4;
		if(this.bigEndian) {
			ch4 = this.readByte();
			ch3 = this.readByte();
			ch2 = this.readByte();
			ch1 = this.readByte();
		} else {
			ch1 = this.readByte();
			ch2 = this.readByte();
			ch3 = this.readByte();
			ch4 = this.readByte();
		}
		if((ch4 & 128) == 0 != ((ch4 & 64) == 0)) throw haxe.io.Error.Overflow;
		return ch1 | ch2 << 8 | ch3 << 16 | ch4 << 24;
	}
	,readUInt24: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		return this.bigEndian?ch3 | ch2 << 8 | ch1 << 16:ch1 | ch2 << 8 | ch3 << 16;
	}
	,readInt24: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var ch3 = this.readByte();
		var n = this.bigEndian?ch3 | ch2 << 8 | ch1 << 16:ch1 | ch2 << 8 | ch3 << 16;
		if((n & 8388608) != 0) return n - 16777216;
		return n;
	}
	,readUInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		return this.bigEndian?ch2 | ch1 << 8:ch1 | ch2 << 8;
	}
	,readInt16: function() {
		var ch1 = this.readByte();
		var ch2 = this.readByte();
		var n = this.bigEndian?ch2 | ch1 << 8:ch1 | ch2 << 8;
		if((n & 32768) != 0) return n - 65536;
		return n;
	}
	,readInt8: function() {
		var n = this.readByte();
		if(n >= 128) return n - 256;
		return n;
	}
	,readDouble: function() {
		var bytes = [];
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		if(this.bigEndian) bytes.reverse();
		var sign = 1 - (bytes[0] >> 7 << 1);
		var exp = (bytes[0] << 4 & 2047 | bytes[1] >> 4) - 1023;
		var sig = this.getDoubleSig(bytes);
		if(sig == 0 && exp == -1023) return 0.0;
		return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
	}
	,readFloat: function() {
		var bytes = [];
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		bytes.push(this.readByte());
		if(this.bigEndian) bytes.reverse();
		var sign = 1 - (bytes[0] >> 7 << 1);
		var exp = (bytes[0] << 1 & 255 | bytes[1] >> 7) - 127;
		var sig = (bytes[1] & 127) << 16 | bytes[2] << 8 | bytes[3];
		if(sig == 0 && exp == -127) return 0.0;
		return sign * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp);
	}
	,readLine: function() {
		var buf = new StringBuf();
		var last;
		var s;
		try {
			while((last = this.readByte()) != 10) buf.b += String.fromCharCode(last);
			s = buf.b;
			if(HxOverrides.cca(s,s.length - 1) == 13) s = HxOverrides.substr(s,0,-1);
		} catch( e ) {
			if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
				s = buf.b;
				if(s.length == 0) throw e;
			} else throw(e);
		}
		return s;
	}
	,readUntil: function(end) {
		var buf = new StringBuf();
		var last;
		while((last = this.readByte()) != end) buf.b += String.fromCharCode(last);
		return buf.b;
	}
	,read: function(nbytes) {
		var s = haxe.io.Bytes.alloc(nbytes);
		var p = 0;
		while(nbytes > 0) {
			var k = this.readBytes(s,p,nbytes);
			if(k == 0) throw haxe.io.Error.Blocked;
			p += k;
			nbytes -= k;
		}
		return s;
	}
	,readFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.readBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,readAll: function(bufsize) {
		if(bufsize == null) bufsize = 16384;
		var buf = haxe.io.Bytes.alloc(bufsize);
		var total = new haxe.io.BytesBuffer();
		try {
			while(true) {
				var len = this.readBytes(buf,0,bufsize);
				if(len == 0) throw haxe.io.Error.Blocked;
				total.addBytes(buf,0,len);
			}
		} catch( e ) {
			if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
			} else throw(e);
		}
		return total.getBytes();
	}
	,setEndian: function(b) {
		this.bigEndian = b;
		return b;
	}
	,close: function() {
	}
	,readBytes: function(s,pos,len) {
		var k = len;
		var b = s.b;
		if(pos < 0 || len < 0 || pos + len > s.length) throw haxe.io.Error.OutsideBounds;
		while(k > 0) {
			b[pos] = this.readByte();
			pos++;
			k--;
		}
		return len;
	}
	,readByte: function() {
		return (function($this) {
			var $r;
			throw "Not implemented";
			return $r;
		}(this));
	}
	,bigEndian: null
	,__class__: haxe.io.Input
	,__properties__: {set_bigEndian:"setEndian"}
}
haxe.io.BytesInput = function(b,pos,len) {
	if(pos == null) pos = 0;
	if(len == null) len = b.length - pos;
	if(pos < 0 || len < 0 || pos + len > b.length) throw haxe.io.Error.OutsideBounds;
	this.b = b.b;
	this.pos = pos;
	this.len = len;
};
$hxClasses["haxe.io.BytesInput"] = haxe.io.BytesInput;
haxe.io.BytesInput.__name__ = ["haxe","io","BytesInput"];
haxe.io.BytesInput.__super__ = haxe.io.Input;
haxe.io.BytesInput.prototype = $extend(haxe.io.Input.prototype,{
	readBytes: function(buf,pos,len) {
		if(pos < 0 || len < 0 || pos + len > buf.length) throw haxe.io.Error.OutsideBounds;
		if(this.len == 0 && len > 0) throw new haxe.io.Eof();
		if(this.len < len) len = this.len;
		var b1 = this.b;
		var b2 = buf.b;
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			b2[pos + i] = b1[this.pos + i];
		}
		this.pos += len;
		this.len -= len;
		return len;
	}
	,readByte: function() {
		if(this.len == 0) throw new haxe.io.Eof();
		this.len--;
		return this.b[this.pos++];
	}
	,len: null
	,pos: null
	,b: null
	,__class__: haxe.io.BytesInput
});
haxe.io.Output = function() { }
$hxClasses["haxe.io.Output"] = haxe.io.Output;
haxe.io.Output.__name__ = ["haxe","io","Output"];
haxe.io.Output.prototype = {
	writeString: function(s) {
		var b = haxe.io.Bytes.ofString(s);
		this.writeFullBytes(b,0,b.length);
	}
	,writeInput: function(i,bufsize) {
		if(bufsize == null) bufsize = 4096;
		var buf = haxe.io.Bytes.alloc(bufsize);
		try {
			while(true) {
				var len = i.readBytes(buf,0,bufsize);
				if(len == 0) throw haxe.io.Error.Blocked;
				var p = 0;
				while(len > 0) {
					var k = this.writeBytes(buf,p,len);
					if(k == 0) throw haxe.io.Error.Blocked;
					p += k;
					len -= k;
				}
			}
		} catch( e ) {
			if( js.Boot.__instanceof(e,haxe.io.Eof) ) {
			} else throw(e);
		}
	}
	,prepare: function(nbytes) {
	}
	,writeInt32: function(x) {
		if(this.bigEndian) {
			this.writeByte(haxe.Int32.toInt(x >>> 24));
			this.writeByte(haxe.Int32.toInt(x >>> 16) & 255);
			this.writeByte(haxe.Int32.toInt(x >>> 8) & 255);
			this.writeByte(haxe.Int32.toInt(x & (255 | 0)));
		} else {
			this.writeByte(haxe.Int32.toInt(x & (255 | 0)));
			this.writeByte(haxe.Int32.toInt(x >>> 8) & 255);
			this.writeByte(haxe.Int32.toInt(x >>> 16) & 255);
			this.writeByte(haxe.Int32.toInt(x >>> 24));
		}
	}
	,writeUInt30: function(x) {
		if(x < 0 || x >= 1073741824) throw haxe.io.Error.Overflow;
		if(this.bigEndian) {
			this.writeByte(x >>> 24);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >>> 24);
		}
	}
	,writeInt31: function(x) {
		if(x < -1073741824 || x >= 1073741824) throw haxe.io.Error.Overflow;
		if(this.bigEndian) {
			this.writeByte(x >>> 24);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >>> 24);
		}
	}
	,writeUInt24: function(x) {
		if(x < 0 || x >= 16777216) throw haxe.io.Error.Overflow;
		if(this.bigEndian) {
			this.writeByte(x >> 16);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x >> 16);
		}
	}
	,writeInt24: function(x) {
		if(x < -8388608 || x >= 8388608) throw haxe.io.Error.Overflow;
		this.writeUInt24(x & 16777215);
	}
	,writeUInt16: function(x) {
		if(x < 0 || x >= 65536) throw haxe.io.Error.Overflow;
		if(this.bigEndian) {
			this.writeByte(x >> 8);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8);
		}
	}
	,writeInt16: function(x) {
		if(x < -32768 || x >= 32768) throw haxe.io.Error.Overflow;
		this.writeUInt16(x & 65535);
	}
	,writeInt8: function(x) {
		if(x < -128 || x >= 128) throw haxe.io.Error.Overflow;
		this.writeByte(x & 255);
	}
	,writeDouble: function(x) {
		if(x == 0.0) {
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			return;
		}
		var exp = Math.floor(Math.log(Math.abs(x)) / haxe.io.Output.LN2);
		var sig = Math.floor(Math.abs(x) / Math.pow(2,exp) * Math.pow(2,52));
		var sig_h = sig & 34359738367;
		var sig_l = Math.floor(sig / Math.pow(2,32));
		var b1 = exp + 1023 >> 4 | (exp > 0?x < 0?128:64:x < 0?128:0), b2 = exp + 1023 << 4 & 255 | sig_l >> 16 & 15, b3 = sig_l >> 8 & 255, b4 = sig_l & 255, b5 = sig_h >> 24 & 255, b6 = sig_h >> 16 & 255, b7 = sig_h >> 8 & 255, b8 = sig_h & 255;
		if(this.bigEndian) {
			this.writeByte(b8);
			this.writeByte(b7);
			this.writeByte(b6);
			this.writeByte(b5);
			this.writeByte(b4);
			this.writeByte(b3);
			this.writeByte(b2);
			this.writeByte(b1);
		} else {
			this.writeByte(b1);
			this.writeByte(b2);
			this.writeByte(b3);
			this.writeByte(b4);
			this.writeByte(b5);
			this.writeByte(b6);
			this.writeByte(b7);
			this.writeByte(b8);
		}
	}
	,writeFloat: function(x) {
		if(x == 0.0) {
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			this.writeByte(0);
			return;
		}
		var exp = Math.floor(Math.log(Math.abs(x)) / haxe.io.Output.LN2);
		var sig = Math.floor(Math.abs(x) / Math.pow(2,exp) * 8388608) & 8388607;
		var b1 = exp + 127 >> 1 | (exp > 0?x < 0?128:64:x < 0?128:0), b2 = exp + 127 << 7 & 255 | sig >> 16 & 127, b3 = sig >> 8 & 255, b4 = sig & 255;
		if(this.bigEndian) {
			this.writeByte(b4);
			this.writeByte(b3);
			this.writeByte(b2);
			this.writeByte(b1);
		} else {
			this.writeByte(b1);
			this.writeByte(b2);
			this.writeByte(b3);
			this.writeByte(b4);
		}
	}
	,writeFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.writeBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,write: function(s) {
		var l = s.length;
		var p = 0;
		while(l > 0) {
			var k = this.writeBytes(s,p,l);
			if(k == 0) throw haxe.io.Error.Blocked;
			p += k;
			l -= k;
		}
	}
	,setEndian: function(b) {
		this.bigEndian = b;
		return b;
	}
	,close: function() {
	}
	,flush: function() {
	}
	,writeBytes: function(s,pos,len) {
		var k = len;
		var b = s.b;
		if(pos < 0 || len < 0 || pos + len > s.length) throw haxe.io.Error.OutsideBounds;
		while(k > 0) {
			this.writeByte(b[pos]);
			pos++;
			k--;
		}
		return len;
	}
	,writeByte: function(c) {
		throw "Not implemented";
	}
	,bigEndian: null
	,__class__: haxe.io.Output
	,__properties__: {set_bigEndian:"setEndian"}
}
haxe.io.BytesOutput = function() {
	this.b = new haxe.io.BytesBuffer();
};
$hxClasses["haxe.io.BytesOutput"] = haxe.io.BytesOutput;
haxe.io.BytesOutput.__name__ = ["haxe","io","BytesOutput"];
haxe.io.BytesOutput.__super__ = haxe.io.Output;
haxe.io.BytesOutput.prototype = $extend(haxe.io.Output.prototype,{
	getBytes: function() {
		return this.b.getBytes();
	}
	,writeBytes: function(buf,pos,len) {
		this.b.addBytes(buf,pos,len);
		return len;
	}
	,writeByte: function(c) {
		this.b.b.push(c);
	}
	,b: null
	,__class__: haxe.io.BytesOutput
});
haxe.io.Eof = function() {
};
$hxClasses["haxe.io.Eof"] = haxe.io.Eof;
haxe.io.Eof.__name__ = ["haxe","io","Eof"];
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
}
haxe.io.Error = $hxClasses["haxe.io.Error"] = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] }
haxe.io.Error.Blocked = ["Blocked",0];
haxe.io.Error.Blocked.toString = $estr;
haxe.io.Error.Blocked.__enum__ = haxe.io.Error;
haxe.io.Error.Overflow = ["Overflow",1];
haxe.io.Error.Overflow.toString = $estr;
haxe.io.Error.Overflow.__enum__ = haxe.io.Error;
haxe.io.Error.OutsideBounds = ["OutsideBounds",2];
haxe.io.Error.OutsideBounds.toString = $estr;
haxe.io.Error.OutsideBounds.__enum__ = haxe.io.Error;
haxe.io.Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe.io.Error; $x.toString = $estr; return $x; }
haxe.io.StringInput = function(s) {
	haxe.io.BytesInput.call(this,haxe.io.Bytes.ofString(s));
};
$hxClasses["haxe.io.StringInput"] = haxe.io.StringInput;
haxe.io.StringInput.__name__ = ["haxe","io","StringInput"];
haxe.io.StringInput.__super__ = haxe.io.BytesInput;
haxe.io.StringInput.prototype = $extend(haxe.io.BytesInput.prototype,{
	__class__: haxe.io.StringInput
});
haxe.remoting = {}
haxe.remoting.AsyncConnection = function() { }
$hxClasses["haxe.remoting.AsyncConnection"] = haxe.remoting.AsyncConnection;
haxe.remoting.AsyncConnection.__name__ = ["haxe","remoting","AsyncConnection"];
haxe.remoting.AsyncConnection.prototype = {
	setErrorHandler: null
	,call: null
	,resolve: null
	,__class__: haxe.remoting.AsyncConnection
}
haxe.remoting.Context = function() {
	this.objects = new Hash();
};
$hxClasses["haxe.remoting.Context"] = haxe.remoting.Context;
haxe.remoting.Context.__name__ = ["haxe","remoting","Context"];
haxe.remoting.Context.share = function(name,obj) {
	var ctx = new haxe.remoting.Context();
	ctx.addObject(name,obj);
	return ctx;
}
haxe.remoting.Context.prototype = {
	call: function(path,params) {
		if(path.length < 2) throw "Invalid path '" + path.join(".") + "'";
		var inf = this.objects.get(path[0]);
		if(inf == null) throw "No such object " + path[0];
		var o = inf.obj;
		var m = Reflect.field(o,path[1]);
		if(path.length > 2) {
			if(!inf.rec) throw "Can't access " + path.join(".");
			var _g1 = 2, _g = path.length;
			while(_g1 < _g) {
				var i = _g1++;
				o = m;
				m = Reflect.field(o,path[i]);
			}
		}
		if(!Reflect.isFunction(m)) throw "No such method " + path.join(".");
		return m.apply(o,params);
	}
	,addObject: function(name,obj,recursive) {
		this.objects.set(name,{ obj : obj, rec : recursive});
	}
	,objects: null
	,__class__: haxe.remoting.Context
}
haxe.remoting.HttpAsyncConnection = function(data,path) {
	this.__data = data;
	this.__path = path;
};
$hxClasses["haxe.remoting.HttpAsyncConnection"] = haxe.remoting.HttpAsyncConnection;
haxe.remoting.HttpAsyncConnection.__name__ = ["haxe","remoting","HttpAsyncConnection"];
haxe.remoting.HttpAsyncConnection.__interfaces__ = [haxe.remoting.AsyncConnection];
haxe.remoting.HttpAsyncConnection.urlConnect = function(url) {
	return new haxe.remoting.HttpAsyncConnection({ url : url, error : function(e) {
		throw e;
	}},[]);
}
haxe.remoting.HttpAsyncConnection.prototype = {
	call: function(params,onResult) {
		var h = new haxe.Http(this.__data.url);
		var s = new haxe.Serializer();
		s.serialize(this.__path);
		s.serialize(params);
		h.setHeader("X-Haxe-Remoting","1");
		h.setParameter("__x",s.toString());
		var error = this.__data.error;
		h.onData = function(response) {
			var ok = true;
			var ret;
			try {
				if(HxOverrides.substr(response,0,3) != "hxr") throw "Invalid response : '" + response + "'";
				var s1 = new haxe.Unserializer(HxOverrides.substr(response,3,null));
				ret = s1.unserialize();
			} catch( err ) {
				ret = null;
				ok = false;
				error(err);
			}
			if(ok && onResult != null) onResult(ret);
		};
		h.onError = error;
		h.request(true);
	}
	,setErrorHandler: function(h) {
		this.__data.error = h;
	}
	,resolve: function(name) {
		var c = new haxe.remoting.HttpAsyncConnection(this.__data,this.__path.slice());
		c.__path.push(name);
		return c;
	}
	,__path: null
	,__data: null
	,__class__: haxe.remoting.HttpAsyncConnection
}
haxe.rtti = {}
haxe.rtti.Meta = function() { }
$hxClasses["haxe.rtti.Meta"] = haxe.rtti.Meta;
haxe.rtti.Meta.__name__ = ["haxe","rtti","Meta"];
haxe.rtti.Meta.getType = function(t) {
	var meta = t.__meta__;
	return meta == null || meta.obj == null?{ }:meta.obj;
}
haxe.rtti.Meta.getStatics = function(t) {
	var meta = t.__meta__;
	return meta == null || meta.statics == null?{ }:meta.statics;
}
haxe.rtti.Meta.getFields = function(t) {
	var meta = t.__meta__;
	return meta == null || meta.fields == null?{ }:meta.fields;
}
var hscript = {}
hscript.Const = $hxClasses["hscript.Const"] = { __ename__ : ["hscript","Const"], __constructs__ : ["CInt","CFloat","CString","CInt32"] }
hscript.Const.CInt = function(v) { var $x = ["CInt",0,v]; $x.__enum__ = hscript.Const; $x.toString = $estr; return $x; }
hscript.Const.CFloat = function(f) { var $x = ["CFloat",1,f]; $x.__enum__ = hscript.Const; $x.toString = $estr; return $x; }
hscript.Const.CString = function(s) { var $x = ["CString",2,s]; $x.__enum__ = hscript.Const; $x.toString = $estr; return $x; }
hscript.Const.CInt32 = function(v) { var $x = ["CInt32",3,v]; $x.__enum__ = hscript.Const; $x.toString = $estr; return $x; }
hscript.Expr = $hxClasses["hscript.Expr"] = { __ename__ : ["hscript","Expr"], __constructs__ : ["EConst","EIdent","EVar","EParent","EBlock","EField","EBinop","EUnop","ECall","EIf","EWhile","EFor","EBreak","EContinue","EFunction","EReturn","EArray","EArrayDecl","ENew","EThrow","ETry","EObject","ETernary"] }
hscript.Expr.EConst = function(c) { var $x = ["EConst",0,c]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EIdent = function(v) { var $x = ["EIdent",1,v]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EVar = function(n,t,e) { var $x = ["EVar",2,n,t,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EParent = function(e) { var $x = ["EParent",3,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EBlock = function(e) { var $x = ["EBlock",4,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EField = function(e,f) { var $x = ["EField",5,e,f]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EBinop = function(op,e1,e2) { var $x = ["EBinop",6,op,e1,e2]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EUnop = function(op,prefix,e) { var $x = ["EUnop",7,op,prefix,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.ECall = function(e,params) { var $x = ["ECall",8,e,params]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EIf = function(cond,e1,e2) { var $x = ["EIf",9,cond,e1,e2]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EWhile = function(cond,e) { var $x = ["EWhile",10,cond,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EFor = function(v,it,e) { var $x = ["EFor",11,v,it,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EBreak = ["EBreak",12];
hscript.Expr.EBreak.toString = $estr;
hscript.Expr.EBreak.__enum__ = hscript.Expr;
hscript.Expr.EContinue = ["EContinue",13];
hscript.Expr.EContinue.toString = $estr;
hscript.Expr.EContinue.__enum__ = hscript.Expr;
hscript.Expr.EFunction = function(args,e,name,ret) { var $x = ["EFunction",14,args,e,name,ret]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EReturn = function(e) { var $x = ["EReturn",15,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EArray = function(e,index) { var $x = ["EArray",16,e,index]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EArrayDecl = function(e) { var $x = ["EArrayDecl",17,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.ENew = function(cl,params) { var $x = ["ENew",18,cl,params]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EThrow = function(e) { var $x = ["EThrow",19,e]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.ETry = function(e,v,t,ecatch) { var $x = ["ETry",20,e,v,t,ecatch]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.EObject = function(fl) { var $x = ["EObject",21,fl]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.Expr.ETernary = function(cond,e1,e2) { var $x = ["ETernary",22,cond,e1,e2]; $x.__enum__ = hscript.Expr; $x.toString = $estr; return $x; }
hscript.CType = $hxClasses["hscript.CType"] = { __ename__ : ["hscript","CType"], __constructs__ : ["CTPath","CTFun","CTAnon","CTParent"] }
hscript.CType.CTPath = function(path,params) { var $x = ["CTPath",0,path,params]; $x.__enum__ = hscript.CType; $x.toString = $estr; return $x; }
hscript.CType.CTFun = function(args,ret) { var $x = ["CTFun",1,args,ret]; $x.__enum__ = hscript.CType; $x.toString = $estr; return $x; }
hscript.CType.CTAnon = function(fields) { var $x = ["CTAnon",2,fields]; $x.__enum__ = hscript.CType; $x.toString = $estr; return $x; }
hscript.CType.CTParent = function(t) { var $x = ["CTParent",3,t]; $x.__enum__ = hscript.CType; $x.toString = $estr; return $x; }
hscript.Error = $hxClasses["hscript.Error"] = { __ename__ : ["hscript","Error"], __constructs__ : ["EInvalidChar","EUnexpected","EUnterminatedString","EUnterminatedComment","EUnknownVariable","EInvalidIterator","EInvalidOp","EInvalidAccess"] }
hscript.Error.EInvalidChar = function(c) { var $x = ["EInvalidChar",0,c]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; }
hscript.Error.EUnexpected = function(s) { var $x = ["EUnexpected",1,s]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; }
hscript.Error.EUnterminatedString = ["EUnterminatedString",2];
hscript.Error.EUnterminatedString.toString = $estr;
hscript.Error.EUnterminatedString.__enum__ = hscript.Error;
hscript.Error.EUnterminatedComment = ["EUnterminatedComment",3];
hscript.Error.EUnterminatedComment.toString = $estr;
hscript.Error.EUnterminatedComment.__enum__ = hscript.Error;
hscript.Error.EUnknownVariable = function(v) { var $x = ["EUnknownVariable",4,v]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; }
hscript.Error.EInvalidIterator = function(v) { var $x = ["EInvalidIterator",5,v]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; }
hscript.Error.EInvalidOp = function(op) { var $x = ["EInvalidOp",6,op]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; }
hscript.Error.EInvalidAccess = function(f) { var $x = ["EInvalidAccess",7,f]; $x.__enum__ = hscript.Error; $x.toString = $estr; return $x; }
hscript._Interp = {}
hscript._Interp.Stop = $hxClasses["hscript._Interp.Stop"] = { __ename__ : ["hscript","_Interp","Stop"], __constructs__ : ["SBreak","SContinue","SReturn"] }
hscript._Interp.Stop.SBreak = ["SBreak",0];
hscript._Interp.Stop.SBreak.toString = $estr;
hscript._Interp.Stop.SBreak.__enum__ = hscript._Interp.Stop;
hscript._Interp.Stop.SContinue = ["SContinue",1];
hscript._Interp.Stop.SContinue.toString = $estr;
hscript._Interp.Stop.SContinue.__enum__ = hscript._Interp.Stop;
hscript._Interp.Stop.SReturn = function(v) { var $x = ["SReturn",2,v]; $x.__enum__ = hscript._Interp.Stop; $x.toString = $estr; return $x; }
hscript.Interp = function() {
	this.locals = new Hash();
	this.declared = new Array();
	this.variables = new Hash();
	this.variables.set("null",null);
	this.variables.set("true",true);
	this.variables.set("false",false);
	this.variables.set("trace",function(e) {
		haxe.Log.trace(Std.string(e),{ fileName : "hscript", lineNumber : 0});
	});
	this.initOps();
};
$hxClasses["hscript.Interp"] = hscript.Interp;
hscript.Interp.__name__ = ["hscript","Interp"];
hscript.Interp.prototype = {
	cnew: function(cl,args) {
		return Type.createInstance(Type.resolveClass(cl),args);
	}
	,call: function(o,f,args) {
		return f.apply(o,args);
	}
	,set: function(o,f,v) {
		if(o == null) throw hscript.Error.EInvalidAccess(f);
		o[f] = v;
		return v;
	}
	,get: function(o,f) {
		if(o == null) throw hscript.Error.EInvalidAccess(f);
		return Reflect.field(o,f);
	}
	,forLoop: function(n,it,e) {
		var old = this.declared.length;
		this.declared.push({ n : n, old : this.locals.get(n)});
		var it1 = this.makeIterator(this.expr(it));
		try {
			while(it1.hasNext()) {
				this.locals.set(n,{ r : it1.next()});
				try {
					this.expr(e);
				} catch( err ) {
					if( js.Boot.__instanceof(err,hscript._Interp.Stop) ) {
						switch( (err)[1] ) {
						case 1:
							break;
						case 0:
							throw "__break__";
							break;
						case 2:
							throw err;
							break;
						}
					} else throw(err);
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		this.restore(old);
	}
	,makeIterator: function(v) {
		try {
			v = $iterator(v)();
		} catch( e ) {
		}
		if(v.hasNext == null || v.next == null) throw hscript.Error.EInvalidIterator(v);
		return v;
	}
	,whileLoop: function(econd,e) {
		var old = this.declared.length;
		try {
			while(this.expr(econd) == true) try {
				this.expr(e);
			} catch( err ) {
				if( js.Boot.__instanceof(err,hscript._Interp.Stop) ) {
					switch( (err)[1] ) {
					case 1:
						break;
					case 0:
						throw "__break__";
						break;
					case 2:
						throw err;
						break;
					}
				} else throw(err);
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		this.restore(old);
	}
	,expr: function(e) {
		var $e = (e);
		switch( $e[1] ) {
		case 0:
			var c = $e[2];
			var $e = (c);
			switch( $e[1] ) {
			case 0:
				var v = $e[2];
				return v;
			case 3:
				var v = $e[2];
				return v;
			case 1:
				var f = $e[2];
				return f;
			case 2:
				var s = $e[2];
				return s;
			}
			break;
		case 1:
			var id = $e[2];
			var l = this.locals.get(id);
			if(l != null) return l.r;
			var v = this.variables.get(id);
			if(v == null && !this.variables.exists(id)) throw hscript.Error.EUnknownVariable(id);
			return v;
		case 2:
			var e1 = $e[4], n = $e[2];
			this.declared.push({ n : n, old : this.locals.get(n)});
			this.locals.set(n,{ r : e1 == null?null:this.expr(e1)});
			return null;
		case 3:
			var e1 = $e[2];
			return this.expr(e1);
		case 4:
			var exprs = $e[2];
			var old = this.declared.length;
			var v = null;
			var _g = 0;
			while(_g < exprs.length) {
				var e1 = exprs[_g];
				++_g;
				v = this.expr(e1);
			}
			this.restore(old);
			return v;
		case 5:
			var f = $e[3], e1 = $e[2];
			return this.get(this.expr(e1),f);
		case 6:
			var e2 = $e[4], e1 = $e[3], op = $e[2];
			var fop = this.binops.get(op);
			if(fop == null) throw hscript.Error.EInvalidOp(op);
			return fop(e1,e2);
		case 7:
			var e1 = $e[4], prefix = $e[3], op = $e[2];
			switch(op) {
			case "!":
				return this.expr(e1) != true;
			case "-":
				return -this.expr(e1);
			case "++":
				return this.increment(e1,prefix,1);
			case "--":
				return this.increment(e1,prefix,-1);
			case "~":
				return ~this.expr(e1);
			default:
				throw hscript.Error.EInvalidOp(op);
			}
			break;
		case 8:
			var params = $e[3], e1 = $e[2];
			var args = new Array();
			var _g = 0;
			while(_g < params.length) {
				var p = params[_g];
				++_g;
				args.push(this.expr(p));
			}
			var $e = (e1);
			switch( $e[1] ) {
			case 5:
				var f = $e[3], e2 = $e[2];
				var obj = this.expr(e2);
				if(obj == null) throw hscript.Error.EInvalidAccess(f);
				return this.call(obj,Reflect.field(obj,f),args);
			default:
				return this.call(null,this.expr(e1),args);
			}
			break;
		case 9:
			var e2 = $e[4], e1 = $e[3], econd = $e[2];
			return this.expr(econd) == true?this.expr(e1):e2 == null?null:this.expr(e2);
		case 10:
			var e1 = $e[3], econd = $e[2];
			this.whileLoop(econd,e1);
			return null;
		case 11:
			var e1 = $e[4], it = $e[3], v = $e[2];
			this.forLoop(v,it,e1);
			return null;
		case 12:
			throw hscript._Interp.Stop.SBreak;
			break;
		case 13:
			throw hscript._Interp.Stop.SContinue;
			break;
		case 15:
			var e1 = $e[2];
			throw hscript._Interp.Stop.SReturn(e1 == null?null:this.expr(e1));
			break;
		case 14:
			var name = $e[4], fexpr = $e[3], params = $e[2];
			var capturedLocals = this.duplicate(this.locals);
			var me = this;
			var f = function(args) {
				if(args.length != params.length) throw "Invalid number of parameters";
				var old = me.locals;
				me.locals = me.duplicate(capturedLocals);
				var _g1 = 0, _g = params.length;
				while(_g1 < _g) {
					var i = _g1++;
					me.locals.set(params[i].name,{ r : args[i]});
				}
				var r = null;
				try {
					r = me.exprReturn(fexpr);
				} catch( e1 ) {
					me.locals = old;
					throw e1;
				}
				me.locals = old;
				return r;
			};
			var f1 = Reflect.makeVarArgs(f);
			if(name != null) this.variables.set(name,f1);
			return f1;
		case 17:
			var arr = $e[2];
			var a = new Array();
			var _g = 0;
			while(_g < arr.length) {
				var e1 = arr[_g];
				++_g;
				a.push(this.expr(e1));
			}
			return a;
		case 16:
			var index = $e[3], e1 = $e[2];
			return this.expr(e1)[this.expr(index)];
		case 18:
			var params = $e[3], cl = $e[2];
			var a = new Array();
			var _g = 0;
			while(_g < params.length) {
				var e1 = params[_g];
				++_g;
				a.push(this.expr(e1));
			}
			return this.cnew(cl,a);
		case 19:
			var e1 = $e[2];
			throw this.expr(e1);
			break;
		case 20:
			var ecatch = $e[5], n = $e[3], e1 = $e[2];
			var old = this.declared.length;
			try {
				var v = this.expr(e1);
				this.restore(old);
				return v;
			} catch( $e0 ) {
				if( js.Boot.__instanceof($e0,hscript._Interp.Stop) ) {
					var err = $e0;
					throw err;
				} else {
				var err = $e0;
				this.restore(old);
				this.declared.push({ n : n, old : this.locals.get(n)});
				this.locals.set(n,{ r : err});
				var v = this.expr(ecatch);
				this.restore(old);
				return v;
				}
			}
			break;
		case 21:
			var fl = $e[2];
			var o = { };
			var _g = 0;
			while(_g < fl.length) {
				var f = fl[_g];
				++_g;
				this.set(o,f.name,this.expr(f.e));
			}
			return o;
		case 22:
			var e2 = $e[4], e1 = $e[3], econd = $e[2];
			return this.expr(econd) == true?this.expr(e1):this.expr(e2);
		}
		return null;
	}
	,restore: function(old) {
		while(this.declared.length > old) {
			var d = this.declared.pop();
			this.locals.set(d.n,d.old);
		}
	}
	,duplicate: function(h) {
		var h2 = new Hash();
		var $it0 = h.keys();
		while( $it0.hasNext() ) {
			var k = $it0.next();
			h2.set(k,h.get(k));
		}
		return h2;
	}
	,exprReturn: function(e) {
		try {
			return this.expr(e);
		} catch( e1 ) {
			if( js.Boot.__instanceof(e1,hscript._Interp.Stop) ) {
				var $e = (e1);
				switch( $e[1] ) {
				case 0:
					throw "Invalid break";
					break;
				case 1:
					throw "Invalid continue";
					break;
				case 2:
					var v = $e[2];
					return v;
				}
			} else throw(e1);
		}
		return null;
	}
	,execute: function(expr) {
		this.locals = new Hash();
		return this.exprReturn(expr);
	}
	,increment: function(e,prefix,delta) {
		var $e = (e);
		switch( $e[1] ) {
		case 1:
			var id = $e[2];
			var l = this.locals.get(id);
			var v = l == null?this.variables.get(id):l.r;
			if(prefix) {
				v += delta;
				if(l == null) this.variables.set(id,v); else l.r = v;
			} else if(l == null) this.variables.set(id,v + delta); else l.r = v + delta;
			return v;
		case 5:
			var f = $e[3], e1 = $e[2];
			var obj = this.expr(e1);
			var v = this.get(obj,f);
			if(prefix) {
				v += delta;
				this.set(obj,f,v);
			} else this.set(obj,f,v + delta);
			return v;
		case 16:
			var index = $e[3], e1 = $e[2];
			var arr = this.expr(e1);
			var index1 = this.expr(index);
			var v = arr[index1];
			if(prefix) {
				v += delta;
				arr[index1] = v;
			} else arr[index1] = v + delta;
			return v;
		default:
			throw hscript.Error.EInvalidOp(delta > 0?"++":"--");
		}
	}
	,evalAssignOp: function(op,fop,e1,e2) {
		var v;
		var $e = (e1);
		switch( $e[1] ) {
		case 1:
			var id = $e[2];
			var l = this.locals.get(id);
			v = fop(this.expr(e1),this.expr(e2));
			if(l == null) this.variables.set(id,v); else l.r = v;
			break;
		case 5:
			var f = $e[3], e = $e[2];
			var obj = this.expr(e);
			v = fop(this.get(obj,f),this.expr(e2));
			v = this.set(obj,f,v);
			break;
		case 16:
			var index = $e[3], e = $e[2];
			var arr = this.expr(e);
			var index1 = this.expr(index);
			v = fop(arr[index1],this.expr(e2));
			arr[index1] = v;
			break;
		default:
			throw hscript.Error.EInvalidOp(op);
		}
		return v;
	}
	,assignOp: function(op,fop) {
		var me = this;
		this.binops.set(op,function(e1,e2) {
			return me.evalAssignOp(op,fop,e1,e2);
		});
	}
	,assign: function(e1,e2) {
		var v = this.expr(e2);
		var $e = (e1);
		switch( $e[1] ) {
		case 1:
			var id = $e[2];
			var l = this.locals.get(id);
			if(l == null) this.variables.set(id,v); else l.r = v;
			break;
		case 5:
			var f = $e[3], e = $e[2];
			v = this.set(this.expr(e),f,v);
			break;
		case 16:
			var index = $e[3], e = $e[2];
			this.expr(e)[this.expr(index)] = v;
			break;
		default:
			throw hscript.Error.EInvalidOp("=");
		}
		return v;
	}
	,initOps: function() {
		var me = this;
		this.binops = new Hash();
		this.binops.set("+",function(e1,e2) {
			return me.expr(e1) + me.expr(e2);
		});
		this.binops.set("-",function(e1,e2) {
			return me.expr(e1) - me.expr(e2);
		});
		this.binops.set("*",function(e1,e2) {
			return me.expr(e1) * me.expr(e2);
		});
		this.binops.set("/",function(e1,e2) {
			return me.expr(e1) / me.expr(e2);
		});
		this.binops.set("%",function(e1,e2) {
			return me.expr(e1) % me.expr(e2);
		});
		this.binops.set("&",function(e1,e2) {
			return me.expr(e1) & me.expr(e2);
		});
		this.binops.set("|",function(e1,e2) {
			return me.expr(e1) | me.expr(e2);
		});
		this.binops.set("^",function(e1,e2) {
			return me.expr(e1) ^ me.expr(e2);
		});
		this.binops.set("<<",function(e1,e2) {
			return me.expr(e1) << me.expr(e2);
		});
		this.binops.set(">>",function(e1,e2) {
			return me.expr(e1) >> me.expr(e2);
		});
		this.binops.set(">>>",function(e1,e2) {
			return me.expr(e1) >>> me.expr(e2);
		});
		this.binops.set("==",function(e1,e2) {
			return me.expr(e1) == me.expr(e2);
		});
		this.binops.set("!=",function(e1,e2) {
			return me.expr(e1) != me.expr(e2);
		});
		this.binops.set(">=",function(e1,e2) {
			return me.expr(e1) >= me.expr(e2);
		});
		this.binops.set("<=",function(e1,e2) {
			return me.expr(e1) <= me.expr(e2);
		});
		this.binops.set(">",function(e1,e2) {
			return me.expr(e1) > me.expr(e2);
		});
		this.binops.set("<",function(e1,e2) {
			return me.expr(e1) < me.expr(e2);
		});
		this.binops.set("||",function(e1,e2) {
			return me.expr(e1) == true || me.expr(e2) == true;
		});
		this.binops.set("&&",function(e1,e2) {
			return me.expr(e1) == true && me.expr(e2) == true;
		});
		this.binops.set("=",$bind(this,this.assign));
		this.binops.set("...",function(e1,e2) {
			return new IntIter(me.expr(e1),me.expr(e2));
		});
		this.assignOp("+=",function(v1,v2) {
			return v1 + v2;
		});
		this.assignOp("-=",function(v1,v2) {
			return v1 - v2;
		});
		this.assignOp("*=",function(v1,v2) {
			return v1 * v2;
		});
		this.assignOp("/=",function(v1,v2) {
			return v1 / v2;
		});
		this.assignOp("%=",function(v1,v2) {
			return v1 % v2;
		});
		this.assignOp("&=",function(v1,v2) {
			return v1 & v2;
		});
		this.assignOp("|=",function(v1,v2) {
			return v1 | v2;
		});
		this.assignOp("^=",function(v1,v2) {
			return v1 ^ v2;
		});
		this.assignOp("<<=",function(v1,v2) {
			return v1 << v2;
		});
		this.assignOp(">>=",function(v1,v2) {
			return v1 >> v2;
		});
		this.assignOp(">>>=",function(v1,v2) {
			return v1 >>> v2;
		});
	}
	,declared: null
	,binops: null
	,locals: null
	,variables: null
	,__class__: hscript.Interp
}
hscript.Token = $hxClasses["hscript.Token"] = { __ename__ : ["hscript","Token"], __constructs__ : ["TEof","TConst","TId","TOp","TPOpen","TPClose","TBrOpen","TBrClose","TDot","TComma","TSemicolon","TBkOpen","TBkClose","TQuestion","TDoubleDot"] }
hscript.Token.TEof = ["TEof",0];
hscript.Token.TEof.toString = $estr;
hscript.Token.TEof.__enum__ = hscript.Token;
hscript.Token.TConst = function(c) { var $x = ["TConst",1,c]; $x.__enum__ = hscript.Token; $x.toString = $estr; return $x; }
hscript.Token.TId = function(s) { var $x = ["TId",2,s]; $x.__enum__ = hscript.Token; $x.toString = $estr; return $x; }
hscript.Token.TOp = function(s) { var $x = ["TOp",3,s]; $x.__enum__ = hscript.Token; $x.toString = $estr; return $x; }
hscript.Token.TPOpen = ["TPOpen",4];
hscript.Token.TPOpen.toString = $estr;
hscript.Token.TPOpen.__enum__ = hscript.Token;
hscript.Token.TPClose = ["TPClose",5];
hscript.Token.TPClose.toString = $estr;
hscript.Token.TPClose.__enum__ = hscript.Token;
hscript.Token.TBrOpen = ["TBrOpen",6];
hscript.Token.TBrOpen.toString = $estr;
hscript.Token.TBrOpen.__enum__ = hscript.Token;
hscript.Token.TBrClose = ["TBrClose",7];
hscript.Token.TBrClose.toString = $estr;
hscript.Token.TBrClose.__enum__ = hscript.Token;
hscript.Token.TDot = ["TDot",8];
hscript.Token.TDot.toString = $estr;
hscript.Token.TDot.__enum__ = hscript.Token;
hscript.Token.TComma = ["TComma",9];
hscript.Token.TComma.toString = $estr;
hscript.Token.TComma.__enum__ = hscript.Token;
hscript.Token.TSemicolon = ["TSemicolon",10];
hscript.Token.TSemicolon.toString = $estr;
hscript.Token.TSemicolon.__enum__ = hscript.Token;
hscript.Token.TBkOpen = ["TBkOpen",11];
hscript.Token.TBkOpen.toString = $estr;
hscript.Token.TBkOpen.__enum__ = hscript.Token;
hscript.Token.TBkClose = ["TBkClose",12];
hscript.Token.TBkClose.toString = $estr;
hscript.Token.TBkClose.__enum__ = hscript.Token;
hscript.Token.TQuestion = ["TQuestion",13];
hscript.Token.TQuestion.toString = $estr;
hscript.Token.TQuestion.__enum__ = hscript.Token;
hscript.Token.TDoubleDot = ["TDoubleDot",14];
hscript.Token.TDoubleDot.toString = $estr;
hscript.Token.TDoubleDot.__enum__ = hscript.Token;
hscript.Parser = function() {
	this.line = 1;
	this.opChars = "+*/-=!><&|^%~";
	this.identChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
	var priorities = [["%"],["*","/"],["+","-"],["<<",">>",">>>"],["|","&","^"],["==","!=",">","<",">=","<="],["..."],["&&"],["||"],["=","+=","-=","*=","/=","%=","<<=",">>=",">>>=","|=","&=","^="]];
	this.opPriority = new Hash();
	this.opRightAssoc = new Hash();
	var _g1 = 0, _g = priorities.length;
	while(_g1 < _g) {
		var i = _g1++;
		var _g2 = 0, _g3 = priorities[i];
		while(_g2 < _g3.length) {
			var x = _g3[_g2];
			++_g2;
			this.opPriority.set(x,i);
			if(i == 9) this.opRightAssoc.set(x,true);
		}
	}
	this.unops = new Hash();
	var _g = 0, _g1 = ["!","++","--","-","~"];
	while(_g < _g1.length) {
		var x = _g1[_g];
		++_g;
		this.unops.set(x,x == "++" || x == "--");
	}
};
$hxClasses["hscript.Parser"] = hscript.Parser;
hscript.Parser.__name__ = ["hscript","Parser"];
hscript.Parser.prototype = {
	tokenString: function(t) {
		return (function($this) {
			var $r;
			var $e = (t);
			switch( $e[1] ) {
			case 0:
				$r = "<eof>";
				break;
			case 1:
				var c = $e[2];
				$r = $this.constString(c);
				break;
			case 2:
				var s = $e[2];
				$r = s;
				break;
			case 3:
				var s = $e[2];
				$r = s;
				break;
			case 4:
				$r = "(";
				break;
			case 5:
				$r = ")";
				break;
			case 6:
				$r = "{";
				break;
			case 7:
				$r = "}";
				break;
			case 8:
				$r = ".";
				break;
			case 9:
				$r = ",";
				break;
			case 10:
				$r = ";";
				break;
			case 11:
				$r = "[";
				break;
			case 12:
				$r = "]";
				break;
			case 13:
				$r = "?";
				break;
			case 14:
				$r = ":";
				break;
			}
			return $r;
		}(this));
	}
	,constString: function(c) {
		return (function($this) {
			var $r;
			var $e = (c);
			switch( $e[1] ) {
			case 0:
				var v = $e[2];
				$r = Std.string(v);
				break;
			case 3:
				var v = $e[2];
				$r = Std.string(v);
				break;
			case 1:
				var f = $e[2];
				$r = Std.string(f);
				break;
			case 2:
				var s = $e[2];
				$r = s;
				break;
			}
			return $r;
		}(this));
	}
	,tokenComment: function(op,$char) {
		var c = HxOverrides.cca(op,1);
		var s = this.input;
		if(c == 47) {
			try {
				while($char != 10 && $char != 13) $char = s.readByte();
				this["char"] = $char;
			} catch( e ) {
			}
			return this.token();
		}
		if(c == 42) {
			var old = this.line;
			try {
				while(true) {
					while($char != 42) {
						if($char == 10) this.line++;
						$char = s.readByte();
					}
					$char = s.readByte();
					if($char == 47) break;
				}
			} catch( e ) {
				this.line = old;
				throw hscript.Error.EUnterminatedComment;
			}
			return this.token();
		}
		this["char"] = $char;
		return hscript.Token.TOp(op);
	}
	,token: function() {
		if(!(this.tokens.head == null)) return this.tokens.pop();
		var $char;
		if(this["char"] < 0) $char = this.readChar(); else {
			$char = this["char"];
			this["char"] = -1;
		}
		while(true) {
			switch($char) {
			case 0:
				return hscript.Token.TEof;
			case 32:case 9:case 13:
				break;
			case 10:
				this.line++;
				break;
			case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
				var n = ($char - 48) * 1.0;
				var exp = 0.;
				while(true) {
					$char = this.readChar();
					exp *= 10;
					switch($char) {
					case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
						n = n * 10 + ($char - 48);
						break;
					case 46:
						if(exp > 0) {
							if(exp == 10 && this.readChar() == 46) {
								this.tokens.add(hscript.Token.TOp("..."));
								var i = n | 0;
								return hscript.Token.TConst(i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
							}
							this.invalidChar($char);
						}
						exp = 1.;
						break;
					case 120:
						if(n > 0 || exp > 0) this.invalidChar($char);
						var n1 = 0 | 0;
						while(true) {
							$char = this.readChar();
							switch($char) {
							case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
								n1 = (n1 << 4) + ($char - 48) | 0;
								break;
							case 65:case 66:case 67:case 68:case 69:case 70:
								n1 = (n1 << 4) + ($char - 55) | 0;
								break;
							case 97:case 98:case 99:case 100:case 101:case 102:
								n1 = (n1 << 4) + ($char - 87) | 0;
								break;
							default:
								this["char"] = $char;
								var v = (function($this) {
									var $r;
									try {
										$r = hscript.Const.CInt((function($this) {
											var $r;
											if((n1 >> 30 & 1) != n1 >>> 31) throw "Overflow " + Std.string(n1);
											$r = n1;
											return $r;
										}($this)));
									} catch( e ) {
										$r = hscript.Const.CInt32(n1);
									}
									return $r;
								}(this));
								return hscript.Token.TConst(v);
							}
						}
						break;
					default:
						this["char"] = $char;
						var i = n | 0;
						return hscript.Token.TConst(exp > 0?hscript.Const.CFloat(n * 10 / exp):i == n?hscript.Const.CInt(i):hscript.Const.CFloat(n));
					}
				}
				break;
			case 59:
				return hscript.Token.TSemicolon;
			case 40:
				return hscript.Token.TPOpen;
			case 41:
				return hscript.Token.TPClose;
			case 44:
				return hscript.Token.TComma;
			case 46:
				$char = this.readChar();
				switch($char) {
				case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
					var n = $char - 48;
					var exp = 1;
					while(true) {
						$char = this.readChar();
						exp *= 10;
						switch($char) {
						case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
							n = n * 10 + ($char - 48);
							break;
						default:
							this["char"] = $char;
							return hscript.Token.TConst(hscript.Const.CFloat(n / exp));
						}
					}
					break;
				case 46:
					$char = this.readChar();
					if($char != 46) this.invalidChar($char);
					return hscript.Token.TOp("...");
				default:
					this["char"] = $char;
					return hscript.Token.TDot;
				}
				break;
			case 123:
				return hscript.Token.TBrOpen;
			case 125:
				return hscript.Token.TBrClose;
			case 91:
				return hscript.Token.TBkOpen;
			case 93:
				return hscript.Token.TBkClose;
			case 39:
				return hscript.Token.TConst(hscript.Const.CString(this.readString(39)));
			case 34:
				return hscript.Token.TConst(hscript.Const.CString(this.readString(34)));
			case 63:
				return hscript.Token.TQuestion;
			case 58:
				return hscript.Token.TDoubleDot;
			default:
				if(this.ops[$char]) {
					var op = String.fromCharCode($char);
					while(true) {
						$char = this.readChar();
						if(!this.ops[$char]) {
							if(HxOverrides.cca(op,0) == 47) return this.tokenComment(op,$char);
							this["char"] = $char;
							return hscript.Token.TOp(op);
						}
						op += String.fromCharCode($char);
					}
				}
				if(this.idents[$char]) {
					var id = String.fromCharCode($char);
					while(true) {
						$char = this.readChar();
						if(!this.idents[$char]) {
							this["char"] = $char;
							return hscript.Token.TId(id);
						}
						id += String.fromCharCode($char);
					}
				}
				this.invalidChar($char);
			}
			$char = this.readChar();
		}
		return null;
	}
	,readString: function(until) {
		var c = 0;
		var b = new haxe.io.BytesOutput();
		var esc = false;
		var old = this.line;
		var s = this.input;
		while(true) {
			try {
				c = s.readByte();
			} catch( e ) {
				this.line = old;
				throw hscript.Error.EUnterminatedString;
			}
			if(esc) {
				esc = false;
				switch(c) {
				case 110:
					b.writeByte(10);
					break;
				case 114:
					b.writeByte(13);
					break;
				case 116:
					b.writeByte(9);
					break;
				case 39:case 34:case 92:
					b.writeByte(c);
					break;
				case 47:
					if(this.allowJSON) b.writeByte(c); else this.invalidChar(c);
					break;
				case 117:
					if(!this.allowJSON) throw this.invalidChar(c);
					var code = null;
					try {
						code = s.readString(4);
					} catch( e ) {
						this.line = old;
						throw hscript.Error.EUnterminatedString;
					}
					var k = 0;
					var _g = 0;
					while(_g < 4) {
						var i = _g++;
						k <<= 4;
						var $char = HxOverrides.cca(code,i);
						switch($char) {
						case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
							k += $char - 48;
							break;
						case 65:case 66:case 67:case 68:case 69:case 70:
							k += $char - 55;
							break;
						case 97:case 98:case 99:case 100:case 101:case 102:
							k += $char - 87;
							break;
						default:
							this.invalidChar($char);
						}
					}
					if(k <= 127) b.writeByte(k); else if(k <= 2047) {
						b.writeByte(192 | k >> 6);
						b.writeByte(128 | k & 63);
					} else {
						b.writeByte(224 | k >> 12);
						b.writeByte(128 | k >> 6 & 63);
						b.writeByte(128 | k & 63);
					}
					break;
				default:
					this.invalidChar(c);
				}
			} else if(c == 92) esc = true; else if(c == until) break; else {
				if(c == 10) this.line++;
				b.writeByte(c);
			}
		}
		return b.getBytes().toString();
	}
	,readChar: function() {
		return (function($this) {
			var $r;
			try {
				$r = $this.input.readByte();
			} catch( e ) {
				$r = 0;
			}
			return $r;
		}(this));
	}
	,incPos: function() {
	}
	,parseExprList: function(etk) {
		var args = new Array();
		var tk = this.token();
		if(tk == etk) return args;
		this.tokens.add(tk);
		try {
			while(true) {
				args.push(this.parseExpr());
				tk = this.token();
				switch( (tk)[1] ) {
				case 9:
					break;
				default:
					if(tk == etk) throw "__break__";
					this.unexpected(tk);
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		return args;
	}
	,parseTypeNext: function(t) {
		var tk = this.token();
		var $e = (tk);
		switch( $e[1] ) {
		case 3:
			var op = $e[2];
			if(op != "->") {
				this.tokens.add(tk);
				return t;
			}
			break;
		default:
			this.tokens.add(tk);
			return t;
		}
		var t2 = this.parseType();
		var $e = (t2);
		switch( $e[1] ) {
		case 1:
			var ret = $e[3], args = $e[2];
			args.unshift(t);
			return t2;
		default:
			return hscript.CType.CTFun([t],t2);
		}
	}
	,parseType: function() {
		var t = this.token();
		var $e = (t);
		switch( $e[1] ) {
		case 2:
			var v = $e[2];
			var path = [v];
			while(true) {
				t = this.token();
				if(t != hscript.Token.TDot) break;
				t = this.token();
				var $e = (t);
				switch( $e[1] ) {
				case 2:
					var v1 = $e[2];
					path.push(v1);
					break;
				default:
					this.unexpected(t);
				}
			}
			var params = null;
			var $e = (t);
			switch( $e[1] ) {
			case 3:
				var op = $e[2];
				if(op == "<") {
					params = [];
					try {
						while(true) {
							params.push(this.parseType());
							t = this.token();
							var $e = (t);
							switch( $e[1] ) {
							case 9:
								continue;
								break;
							case 3:
								var op1 = $e[2];
								if(op1 == ">") throw "__break__";
								break;
							default:
							}
							this.unexpected(t);
						}
					} catch( e ) { if( e != "__break__" ) throw e; }
				}
				break;
			default:
				this.tokens.add(t);
			}
			return this.parseTypeNext(hscript.CType.CTPath(path,params));
		case 4:
			var t1 = this.parseType();
			this.ensure(hscript.Token.TPClose);
			return this.parseTypeNext(hscript.CType.CTParent(t1));
		case 6:
			var fields = [];
			try {
				while(true) {
					t = this.token();
					var $e = (t);
					switch( $e[1] ) {
					case 7:
						throw "__break__";
						break;
					case 2:
						var name = $e[2];
						this.ensure(hscript.Token.TDoubleDot);
						fields.push({ name : name, t : this.parseType()});
						t = this.token();
						switch( (t)[1] ) {
						case 9:
							break;
						case 7:
							throw "__break__";
							break;
						default:
							this.unexpected(t);
						}
						break;
					default:
						this.unexpected(t);
					}
				}
			} catch( e ) { if( e != "__break__" ) throw e; }
			return this.parseTypeNext(hscript.CType.CTAnon(fields));
		default:
			return this.unexpected(t);
		}
	}
	,parseExprNext: function(e1) {
		var tk = this.token();
		var $e = (tk);
		switch( $e[1] ) {
		case 3:
			var op = $e[2];
			if(this.unops.get(op)) {
				if(this.isBlock(e1) || (function($this) {
					var $r;
					switch( (e1)[1] ) {
					case 3:
						$r = true;
						break;
					default:
						$r = false;
					}
					return $r;
				}(this))) {
					this.tokens.add(tk);
					return e1;
				}
				return this.parseExprNext(hscript.Expr.EUnop(op,false,e1));
			}
			return this.makeBinop(op,e1,this.parseExpr());
		case 8:
			tk = this.token();
			var field = null;
			var $e = (tk);
			switch( $e[1] ) {
			case 2:
				var id = $e[2];
				field = id;
				break;
			default:
				this.unexpected(tk);
			}
			return this.parseExprNext(hscript.Expr.EField(e1,field));
		case 4:
			return this.parseExprNext(hscript.Expr.ECall(e1,this.parseExprList(hscript.Token.TPClose)));
		case 11:
			var e2 = this.parseExpr();
			this.ensure(hscript.Token.TBkClose);
			return this.parseExprNext(hscript.Expr.EArray(e1,e2));
		case 13:
			var e2 = this.parseExpr();
			this.ensure(hscript.Token.TDoubleDot);
			var e3 = this.parseExpr();
			return hscript.Expr.ETernary(e1,e2,e3);
		default:
			this.tokens.add(tk);
			return e1;
		}
	}
	,parseStructure: function(id) {
		return (function($this) {
			var $r;
			switch(id) {
			case "if":
				$r = (function($this) {
					var $r;
					var cond = $this.parseExpr();
					var e1 = $this.parseExpr();
					var e2 = null;
					var semic = false;
					var tk = $this.token();
					if(tk == hscript.Token.TSemicolon) {
						semic = true;
						tk = $this.token();
					}
					if(Type.enumEq(tk,hscript.Token.TId("else"))) e2 = $this.parseExpr(); else {
						$this.tokens.add(tk);
						if(semic) $this.tokens.add(hscript.Token.TSemicolon);
					}
					$r = hscript.Expr.EIf(cond,e1,e2);
					return $r;
				}($this));
				break;
			case "var":
				$r = (function($this) {
					var $r;
					var tk = $this.token();
					var ident = null;
					var $e = (tk);
					switch( $e[1] ) {
					case 2:
						var id1 = $e[2];
						ident = id1;
						break;
					default:
						$this.unexpected(tk);
					}
					tk = $this.token();
					var t = null;
					if(tk == hscript.Token.TDoubleDot && $this.allowTypes) {
						t = $this.parseType();
						tk = $this.token();
					}
					var e = null;
					if(Type.enumEq(tk,hscript.Token.TOp("="))) e = $this.parseExpr(); else $this.tokens.add(tk);
					$r = hscript.Expr.EVar(ident,t,e);
					return $r;
				}($this));
				break;
			case "while":
				$r = (function($this) {
					var $r;
					var econd = $this.parseExpr();
					var e = $this.parseExpr();
					$r = hscript.Expr.EWhile(econd,e);
					return $r;
				}($this));
				break;
			case "for":
				$r = (function($this) {
					var $r;
					$this.ensure(hscript.Token.TPOpen);
					var tk = $this.token();
					var vname = null;
					var $e = (tk);
					switch( $e[1] ) {
					case 2:
						var id1 = $e[2];
						vname = id1;
						break;
					default:
						$this.unexpected(tk);
					}
					tk = $this.token();
					if(!Type.enumEq(tk,hscript.Token.TId("in"))) $this.unexpected(tk);
					var eiter = $this.parseExpr();
					$this.ensure(hscript.Token.TPClose);
					var e = $this.parseExpr();
					$r = hscript.Expr.EFor(vname,eiter,e);
					return $r;
				}($this));
				break;
			case "break":
				$r = hscript.Expr.EBreak;
				break;
			case "continue":
				$r = hscript.Expr.EContinue;
				break;
			case "else":
				$r = $this.unexpected(hscript.Token.TId(id));
				break;
			case "function":
				$r = (function($this) {
					var $r;
					var tk = $this.token();
					var name = null;
					var $e = (tk);
					switch( $e[1] ) {
					case 2:
						var id1 = $e[2];
						name = id1;
						break;
					default:
						$this.tokens.add(tk);
					}
					$this.ensure(hscript.Token.TPOpen);
					var args = new Array();
					tk = $this.token();
					if(tk != hscript.Token.TPClose) {
						var arg = true;
						while(arg) {
							var name1 = null;
							var $e = (tk);
							switch( $e[1] ) {
							case 2:
								var id1 = $e[2];
								name1 = id1;
								break;
							default:
								$this.unexpected(tk);
							}
							tk = $this.token();
							var t = null;
							if(tk == hscript.Token.TDoubleDot && $this.allowTypes) {
								t = $this.parseType();
								tk = $this.token();
							}
							args.push({ name : name1, t : t});
							switch( (tk)[1] ) {
							case 9:
								tk = $this.token();
								break;
							case 5:
								arg = false;
								break;
							default:
								$this.unexpected(tk);
							}
						}
					}
					var ret = null;
					if($this.allowTypes) {
						tk = $this.token();
						if(tk != hscript.Token.TDoubleDot) $this.tokens.add(tk); else ret = $this.parseType();
					}
					var body = $this.parseExpr();
					$r = hscript.Expr.EFunction(args,body,name,ret);
					return $r;
				}($this));
				break;
			case "return":
				$r = (function($this) {
					var $r;
					var tk = $this.token();
					$this.tokens.add(tk);
					var e = tk == hscript.Token.TSemicolon?null:$this.parseExpr();
					$r = hscript.Expr.EReturn(e);
					return $r;
				}($this));
				break;
			case "new":
				$r = (function($this) {
					var $r;
					var a = new Array();
					var tk = $this.token();
					var $e = (tk);
					switch( $e[1] ) {
					case 2:
						var id1 = $e[2];
						a.push(id1);
						break;
					default:
						$this.unexpected(tk);
					}
					var next = true;
					while(next) {
						tk = $this.token();
						switch( (tk)[1] ) {
						case 8:
							tk = $this.token();
							var $e = (tk);
							switch( $e[1] ) {
							case 2:
								var id1 = $e[2];
								a.push(id1);
								break;
							default:
								$this.unexpected(tk);
							}
							break;
						case 4:
							next = false;
							break;
						default:
							$this.unexpected(tk);
						}
					}
					var args = $this.parseExprList(hscript.Token.TPClose);
					$r = hscript.Expr.ENew(a.join("."),args);
					return $r;
				}($this));
				break;
			case "throw":
				$r = (function($this) {
					var $r;
					var e = $this.parseExpr();
					$r = hscript.Expr.EThrow(e);
					return $r;
				}($this));
				break;
			case "try":
				$r = (function($this) {
					var $r;
					var e = $this.parseExpr();
					var tk = $this.token();
					if(!Type.enumEq(tk,hscript.Token.TId("catch"))) $this.unexpected(tk);
					$this.ensure(hscript.Token.TPOpen);
					tk = $this.token();
					var vname = (function($this) {
						var $r;
						var $e = (tk);
						switch( $e[1] ) {
						case 2:
							var id1 = $e[2];
							$r = id1;
							break;
						default:
							$r = $this.unexpected(tk);
						}
						return $r;
					}($this));
					$this.ensure(hscript.Token.TDoubleDot);
					var t = null;
					if($this.allowTypes) t = $this.parseType(); else {
						tk = $this.token();
						if(!Type.enumEq(tk,hscript.Token.TId("Dynamic"))) $this.unexpected(tk);
					}
					$this.ensure(hscript.Token.TPClose);
					var ec = $this.parseExpr();
					$r = hscript.Expr.ETry(e,vname,t,ec);
					return $r;
				}($this));
				break;
			default:
				$r = null;
			}
			return $r;
		}(this));
	}
	,makeBinop: function(op,e1,e) {
		return (function($this) {
			var $r;
			var $e = (e);
			switch( $e[1] ) {
			case 6:
				var e3 = $e[4], e2 = $e[3], op2 = $e[2];
				$r = $this.opPriority.get(op) <= $this.opPriority.get(op2) && !$this.opRightAssoc.exists(op)?hscript.Expr.EBinop(op2,$this.makeBinop(op,e1,e2),e3):hscript.Expr.EBinop(op,e1,e);
				break;
			case 22:
				var e4 = $e[4], e3 = $e[3], e2 = $e[2];
				$r = $this.opRightAssoc.exists(op)?hscript.Expr.EBinop(op,e1,e):hscript.Expr.ETernary($this.makeBinop(op,e1,e2),e3,e4);
				break;
			default:
				$r = hscript.Expr.EBinop(op,e1,e);
			}
			return $r;
		}(this));
	}
	,makeUnop: function(op,e) {
		return (function($this) {
			var $r;
			var $e = (e);
			switch( $e[1] ) {
			case 6:
				var e2 = $e[4], e1 = $e[3], bop = $e[2];
				$r = hscript.Expr.EBinop(bop,$this.makeUnop(op,e1),e2);
				break;
			case 22:
				var e3 = $e[4], e2 = $e[3], e1 = $e[2];
				$r = hscript.Expr.ETernary($this.makeUnop(op,e1),e2,e3);
				break;
			default:
				$r = hscript.Expr.EUnop(op,true,e);
			}
			return $r;
		}(this));
	}
	,parseExpr: function() {
		var tk = this.token();
		var $e = (tk);
		switch( $e[1] ) {
		case 2:
			var id = $e[2];
			var e = this.parseStructure(id);
			if(e == null) e = hscript.Expr.EIdent(id);
			return this.parseExprNext(e);
		case 1:
			var c = $e[2];
			return this.parseExprNext(hscript.Expr.EConst(c));
		case 4:
			var e = this.parseExpr();
			this.ensure(hscript.Token.TPClose);
			return this.parseExprNext(hscript.Expr.EParent(e));
		case 6:
			tk = this.token();
			var $e = (tk);
			switch( $e[1] ) {
			case 7:
				return this.parseExprNext(hscript.Expr.EObject([]));
			case 2:
				var id = $e[2];
				var tk2 = this.token();
				this.tokens.add(tk2);
				this.tokens.add(tk);
				switch( (tk2)[1] ) {
				case 14:
					return this.parseExprNext(this.parseObject(0));
				default:
				}
				break;
			case 1:
				var c = $e[2];
				if(this.allowJSON) {
					switch( (c)[1] ) {
					case 2:
						var tk2 = this.token();
						this.tokens.add(tk2);
						this.tokens.add(tk);
						switch( (tk2)[1] ) {
						case 14:
							return this.parseExprNext(this.parseObject(0));
						default:
						}
						break;
					default:
						this.tokens.add(tk);
					}
				} else this.tokens.add(tk);
				break;
			default:
				this.tokens.add(tk);
			}
			var a = new Array();
			while(true) {
				a.push(this.parseFullExpr());
				tk = this.token();
				if(tk == hscript.Token.TBrClose) break;
				this.tokens.add(tk);
			}
			return hscript.Expr.EBlock(a);
		case 3:
			var op = $e[2];
			if(this.unops.exists(op)) return this.makeUnop(op,this.parseExpr());
			return this.unexpected(tk);
		case 11:
			var a = new Array();
			tk = this.token();
			while(tk != hscript.Token.TBkClose) {
				this.tokens.add(tk);
				a.push(this.parseExpr());
				tk = this.token();
				if(tk == hscript.Token.TComma) tk = this.token();
			}
			return this.parseExprNext(hscript.Expr.EArrayDecl(a));
		default:
			return this.unexpected(tk);
		}
	}
	,parseObject: function(p1) {
		var fl = new Array();
		try {
			while(true) {
				var tk = this.token();
				var id = null;
				var $e = (tk);
				switch( $e[1] ) {
				case 2:
					var i = $e[2];
					id = i;
					break;
				case 1:
					var c = $e[2];
					if(!this.allowJSON) this.unexpected(tk);
					var $e = (c);
					switch( $e[1] ) {
					case 2:
						var s = $e[2];
						id = s;
						break;
					default:
						this.unexpected(tk);
					}
					break;
				case 7:
					throw "__break__";
					break;
				default:
					this.unexpected(tk);
				}
				this.ensure(hscript.Token.TDoubleDot);
				fl.push({ name : id, e : this.parseExpr()});
				tk = this.token();
				switch( (tk)[1] ) {
				case 7:
					throw "__break__";
					break;
				case 9:
					break;
				default:
					this.unexpected(tk);
				}
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		return this.parseExprNext(hscript.Expr.EObject(fl));
	}
	,parseFullExpr: function() {
		var e = this.parseExpr();
		var tk = this.token();
		if(tk != hscript.Token.TSemicolon && tk != hscript.Token.TEof) {
			if(this.isBlock(e)) this.tokens.add(tk); else this.unexpected(tk);
		}
		return e;
	}
	,isBlock: function(e) {
		return (function($this) {
			var $r;
			var $e = (e);
			switch( $e[1] ) {
			case 4:
			case 21:
				$r = true;
				break;
			case 14:
				var e1 = $e[3];
				$r = $this.isBlock(e1);
				break;
			case 2:
				var e1 = $e[4];
				$r = e1 != null && $this.isBlock(e1);
				break;
			case 9:
				var e2 = $e[4], e1 = $e[3];
				$r = e2 != null?$this.isBlock(e2):$this.isBlock(e1);
				break;
			case 6:
				var e1 = $e[4];
				$r = $this.isBlock(e1);
				break;
			case 7:
				var e1 = $e[4], prefix = $e[3];
				$r = !prefix && $this.isBlock(e1);
				break;
			case 10:
				var e1 = $e[3];
				$r = $this.isBlock(e1);
				break;
			case 11:
				var e1 = $e[4];
				$r = $this.isBlock(e1);
				break;
			case 15:
				var e1 = $e[2];
				$r = e1 != null && $this.isBlock(e1);
				break;
			default:
				$r = false;
			}
			return $r;
		}(this));
	}
	,mk: function(e,pmin,pmax) {
		return e;
	}
	,pmax: function(e) {
		return 0;
	}
	,pmin: function(e) {
		return 0;
	}
	,expr: function(e) {
		return e;
	}
	,ensure: function(tk) {
		var t = this.token();
		if(t != tk) this.unexpected(t);
	}
	,push: function(tk) {
		this.tokens.add(tk);
	}
	,unexpected: function(tk) {
		throw hscript.Error.EUnexpected(this.tokenString(tk));
		return null;
	}
	,parse: function(s) {
		this.tokens = new haxe.FastList();
		this["char"] = -1;
		this.input = s;
		this.ops = new Array();
		this.idents = new Array();
		var _g1 = 0, _g = this.opChars.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.ops[HxOverrides.cca(this.opChars,i)] = true;
		}
		var _g1 = 0, _g = this.identChars.length;
		while(_g1 < _g) {
			var i = _g1++;
			this.idents[HxOverrides.cca(this.identChars,i)] = true;
		}
		var a = new Array();
		while(true) {
			var tk = this.token();
			if(tk == hscript.Token.TEof) break;
			this.tokens.add(tk);
			a.push(this.parseFullExpr());
		}
		return a.length == 1?a[0]:hscript.Expr.EBlock(a);
	}
	,parseString: function(s) {
		this.line = 1;
		return this.parse(new haxe.io.StringInput(s));
	}
	,invalidChar: function(c) {
		throw hscript.Error.EInvalidChar(c);
	}
	,error: function(err,pmin,pmax) {
		throw err;
	}
	,tokens: null
	,idents: null
	,ops: null
	,'char': null
	,input: null
	,allowTypes: null
	,allowJSON: null
	,unops: null
	,opRightAssoc: null
	,opPriority: null
	,identChars: null
	,opChars: null
	,line: null
	,__class__: hscript.Parser
}
var js = {}
js.Boot = function() { }
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = function() { }
$hxClasses["js.Lib"] = js.Lib;
js.Lib.__name__ = ["js","Lib"];
js.Lib.document = null;
js.Lib.window = null;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib["eval"] = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
org.slplayer.component.SLPlayerComponent = function() { }
$hxClasses["org.slplayer.component.SLPlayerComponent"] = org.slplayer.component.SLPlayerComponent;
org.slplayer.component.SLPlayerComponent.__name__ = ["org","slplayer","component","SLPlayerComponent"];
org.slplayer.component.SLPlayerComponent.initSLPlayerComponent = function(component,SLPlayerInstanceId) {
	component.SLPlayerInstanceId = SLPlayerInstanceId;
}
org.slplayer.component.SLPlayerComponent.getSLPlayer = function(component) {
	return org.slplayer.core.Application.get(component.SLPlayerInstanceId);
}
org.slplayer.component.SLPlayerComponent.checkRequiredParameters = function(cmpClass,elt) {
	var requires = haxe.rtti.Meta.getType(cmpClass).requires;
	if(requires == null) return;
	var _g = 0;
	while(_g < requires.length) {
		var r = requires[_g];
		++_g;
		if(elt.getAttribute(Std.string(r)) == null || StringTools.trim(elt.getAttribute(Std.string(r))) == "") throw Std.string(r) + " parameter is required for " + Type.getClassName(cmpClass);
	}
}
org.slplayer.component.group = {}
org.slplayer.component.group.IGroupable = function() { }
$hxClasses["org.slplayer.component.group.IGroupable"] = org.slplayer.component.group.IGroupable;
org.slplayer.component.group.IGroupable.__name__ = ["org","slplayer","component","group","IGroupable"];
org.slplayer.component.group.IGroupable.__interfaces__ = [org.slplayer.component.ui.IDisplayObject];
org.slplayer.component.group.IGroupable.prototype = {
	groupElement: null
	,__class__: org.slplayer.component.group.IGroupable
}
org.slplayer.component.group.Groupable = function() { }
$hxClasses["org.slplayer.component.group.Groupable"] = org.slplayer.component.group.Groupable;
org.slplayer.component.group.Groupable.__name__ = ["org","slplayer","component","group","Groupable"];
org.slplayer.component.group.Groupable.startGroupable = function(groupable) {
	var groupId = groupable.rootElement.getAttribute("data-group-id");
	if(groupId == null) return;
	var groupElements = js.Lib.document.getElementsByClassName(groupId);
	if(groupElements.length < 1) return;
	if(groupElements.length > 1) throw "ERROR " + groupElements.length + " Group components are declared with the same group id " + groupId;
	groupable.groupElement = groupElements[0];
}
org.slplayer.component.navigation = {}
org.slplayer.component.navigation.LayerStatus = $hxClasses["org.slplayer.component.navigation.LayerStatus"] = { __ename__ : ["org","slplayer","component","navigation","LayerStatus"], __constructs__ : ["visible","hidden","notInitialized"] }
org.slplayer.component.navigation.LayerStatus.visible = ["visible",0];
org.slplayer.component.navigation.LayerStatus.visible.toString = $estr;
org.slplayer.component.navigation.LayerStatus.visible.__enum__ = org.slplayer.component.navigation.LayerStatus;
org.slplayer.component.navigation.LayerStatus.hidden = ["hidden",1];
org.slplayer.component.navigation.LayerStatus.hidden.toString = $estr;
org.slplayer.component.navigation.LayerStatus.hidden.__enum__ = org.slplayer.component.navigation.LayerStatus;
org.slplayer.component.navigation.LayerStatus.notInitialized = ["notInitialized",2];
org.slplayer.component.navigation.LayerStatus.notInitialized.toString = $estr;
org.slplayer.component.navigation.LayerStatus.notInitialized.__enum__ = org.slplayer.component.navigation.LayerStatus;
org.slplayer.component.navigation.Layer = function(rootElement,SLPId) {
	org.slplayer.component.ui.DisplayObject.call(this,rootElement,SLPId);
	this.isListeningHide = false;
	this.isListeningShow = false;
	this.status = org.slplayer.component.navigation.LayerStatus.notInitialized;
	this.childrenArray = new Array();
	this.styleAttrDisplay = rootElement.style.display;
};
$hxClasses["org.slplayer.component.navigation.Layer"] = org.slplayer.component.navigation.Layer;
org.slplayer.component.navigation.Layer.__name__ = ["org","slplayer","component","navigation","Layer"];
org.slplayer.component.navigation.Layer.__super__ = org.slplayer.component.ui.DisplayObject;
org.slplayer.component.navigation.Layer.prototype = $extend(org.slplayer.component.ui.DisplayObject.prototype,{
	doShow: function(nullIfCalledDirectly) {
		if(this.isListeningShow == false) return;
		this.isListeningShow = false;
		if(nullIfCalledDirectly != null) this.rootElement.removeEventListener("transitionEventTypeEnded",$bind(this,this.doShow),false);
	}
	,show: function(transitionData) {
		if(this.status != org.slplayer.component.navigation.LayerStatus.visible) {
			this.status = org.slplayer.component.navigation.LayerStatus.visible;
			this.rootElement.style.display = this.styleAttrDisplay;
			while(this.childrenArray.length > 0) {
				var element = this.childrenArray.shift();
				this.rootElement.appendChild(element);
				if(element.tagName != null && (element.tagName.toLowerCase() == "audio" || element.tagName.toLowerCase() == "video")) try {
					if(element.autoplay == true) {
						element.currentTime = 0;
						element.play();
					}
					element.muted = org.slplayer.component.sound.SoundOn.isMuted;
				} catch( e ) {
					null;
				}
			}
			this.isListeningShow = true;
			if(this.detectTransition(transitionData)) this.rootElement.addEventListener("transitionEventTypeEnded",$bind(this,this.doShow),false); else this.doShow(null);
		} else {
		}
	}
	,doHide: function(nullIfCalledDirectly) {
		if(this.isListeningHide == false) return;
		this.isListeningHide = false;
		if(nullIfCalledDirectly != null) this.rootElement.removeEventListener("transitionEventTypeEnded",$bind(this,this.doHide),false);
		while(this.rootElement.childNodes.length > 0) {
			var element = this.rootElement.childNodes[0];
			this.rootElement.removeChild(element);
			this.childrenArray.push(element);
			if(element.tagName != null && (element.tagName.toLowerCase() == "audio" || element.tagName.toLowerCase() == "video")) try {
				element.pause();
				element.currentTime = 0;
			} catch( e ) {
				null;
			}
		}
		this.rootElement.style.display = "none";
	}
	,hide: function(transitionData) {
		if(this.status != org.slplayer.component.navigation.LayerStatus.hidden) {
			this.status = org.slplayer.component.navigation.LayerStatus.hidden;
			this.isListeningHide = true;
			if(this.detectTransition(transitionData)) this.rootElement.addEventListener("transitionEventTypeEnded",$bind(this,this.doHide),false); else this.doHide(null);
		} else {
		}
	}
	,onTransitionStarted: function(event) {
		this.hasTransitionStarted = true;
	}
	,detectTransition: function(transitionData) {
		this.rootElement.addEventListener("transitionEventTypeStarted",$bind(this,this.onTransitionStarted),false);
		this.hasTransitionStarted = false;
		var event = js.Lib.document.createEvent("CustomEvent");
		event.initCustomEvent("transitionEventTypeRequest",true,true,transitionData);
		this.rootElement.dispatchEvent(event);
		this.rootElement.removeEventListener("transitionEventTypeStarted",$bind(this,this.onTransitionStarted),false);
		return this.hasTransitionStarted;
	}
	,styleAttrDisplay: null
	,hasTransitionStarted: null
	,status: null
	,childrenArray: null
	,isListeningShow: null
	,isListeningHide: null
	,__class__: org.slplayer.component.navigation.Layer
});
org.slplayer.component.navigation.Page = function(rootElement,SLPId) {
	org.slplayer.component.ui.DisplayObject.call(this,rootElement,SLPId);
	org.slplayer.component.group.Groupable.startGroupable(this);
	this.name = rootElement.getAttribute("name");
	if(this.name == null || this.name == "") throw "Pages have to have a 'name' attribute";
};
$hxClasses["org.slplayer.component.navigation.Page"] = org.slplayer.component.navigation.Page;
org.slplayer.component.navigation.Page.__name__ = ["org","slplayer","component","navigation","Page"];
org.slplayer.component.navigation.Page.__interfaces__ = [org.slplayer.component.group.IGroupable];
org.slplayer.component.navigation.Page.openPage = function(pageName,isPopup,transitionData,slPlayerId,root) {
	var document = root;
	if(root == null) document = js.Lib.document;
	var page = org.slplayer.component.navigation.Page.getPageByName(pageName,slPlayerId,document);
	if(page == null) throw "Error, could not find a page with name " + pageName;
	page.open(transitionData,!isPopup);
}
org.slplayer.component.navigation.Page.closePage = function(pageName,transitionData,slPlayerId,root) {
	var document = root;
	if(root == null) document = js.Lib.document;
	var page = org.slplayer.component.navigation.Page.getPageByName(pageName,slPlayerId,document);
	if(page == null) throw "Error, could not find a page with name " + pageName;
	page.close(transitionData);
}
org.slplayer.component.navigation.Page.getPageNodes = function(slPlayerId,root) {
	var document = root;
	if(root == null) document = js.Lib.document;
	return document.getElementsByClassName("Page");
}
org.slplayer.component.navigation.Page.getLayerNodes = function(pageName,slPlayerId,root) {
	var document = root;
	if(root == null) document = js.Lib.document;
	return document.getElementsByClassName(pageName);
}
org.slplayer.component.navigation.Page.getPageByName = function(pageName,slPlayerId,root) {
	var document = root;
	if(root == null) document = js.Lib.document;
	var pages = org.slplayer.component.navigation.Page.getPageNodes(slPlayerId,document);
	var _g1 = 0, _g = pages.length;
	while(_g1 < _g) {
		var pageIdx = _g1++;
		if(pages[pageIdx].getAttribute("name") == pageName) {
			var pageInstances = org.slplayer.core.Application.get(slPlayerId).getAssociatedComponents(pages[pageIdx],org.slplayer.component.navigation.Page);
			var $it0 = pageInstances.iterator();
			while( $it0.hasNext() ) {
				var page = $it0.next();
				return page;
			}
			return null;
		}
	}
	return null;
}
org.slplayer.component.navigation.Page.__super__ = org.slplayer.component.ui.DisplayObject;
org.slplayer.component.navigation.Page.prototype = $extend(org.slplayer.component.ui.DisplayObject.prototype,{
	close: function(transitionData,preventCloseByClassName) {
		if(transitionData == null) transitionData = new org.slplayer.component.navigation.transition.TransitionData(org.slplayer.component.navigation.transition.TransitionType.hide,"2s");
		transitionData.type = org.slplayer.component.navigation.transition.TransitionType.hide;
		if(preventCloseByClassName == null) preventCloseByClassName = new Array();
		var nodes = org.slplayer.component.navigation.Page.getLayerNodes(this.name,this.SLPlayerInstanceId,this.groupElement);
		var _g1 = 0, _g = nodes.length;
		while(_g1 < _g) {
			var idxLayerNode = _g1++;
			var layerNode = nodes[idxLayerNode];
			var hasForbiddenClass = false;
			var _g2 = 0;
			while(_g2 < preventCloseByClassName.length) {
				var className = preventCloseByClassName[_g2];
				++_g2;
				if(org.slplayer.util.DomTools.hasClass(layerNode,className)) {
					hasForbiddenClass = true;
					break;
				}
			}
			if(!hasForbiddenClass) {
				var layerInstances = this.getSLPlayer().getAssociatedComponents(layerNode,org.slplayer.component.navigation.Layer);
				var $it0 = layerInstances.iterator();
				while( $it0.hasNext() ) {
					var layerInstance = $it0.next();
					(js.Boot.__cast(layerInstance , org.slplayer.component.navigation.Layer)).hide(transitionData);
				}
			}
		}
	}
	,doOpen: function(transitionData) {
		if(transitionData == null) transitionData = new org.slplayer.component.navigation.transition.TransitionData(org.slplayer.component.navigation.transition.TransitionType.show,"2s");
		transitionData.type = org.slplayer.component.navigation.transition.TransitionType.show;
		var nodes = org.slplayer.component.navigation.Page.getLayerNodes(this.name,this.SLPlayerInstanceId,this.groupElement);
		var _g1 = 0, _g = nodes.length;
		while(_g1 < _g) {
			var idxLayerNode = _g1++;
			var layerNode = nodes[idxLayerNode];
			var layerInstances = this.getSLPlayer().getAssociatedComponents(layerNode,org.slplayer.component.navigation.Layer);
			var $it0 = layerInstances.iterator();
			while( $it0.hasNext() ) {
				var layerInstance = $it0.next();
				layerInstance.show(transitionData);
			}
		}
	}
	,closeOthers: function(transitionData) {
		var nodes = org.slplayer.component.navigation.Page.getPageNodes(this.SLPlayerInstanceId,this.groupElement);
		var _g1 = 0, _g = nodes.length;
		while(_g1 < _g) {
			var idxPageNode = _g1++;
			var pageNode = nodes[idxPageNode];
			var pageInstances = this.getSLPlayer().getAssociatedComponents(pageNode,org.slplayer.component.navigation.Page);
			var $it0 = pageInstances.iterator();
			while( $it0.hasNext() ) {
				var pageInstance = $it0.next();
				if(pageInstance != this) pageInstance.close(transitionData,[this.name]);
			}
		}
	}
	,open: function(transitionData,doCloseOthers) {
		if(doCloseOthers == null) doCloseOthers = true;
		if(doCloseOthers) this.closeOthers(transitionData);
		this.doOpen(transitionData);
	}
	,init: function() {
		org.slplayer.component.ui.DisplayObject.prototype.init.call(this);
		if(org.slplayer.util.DomTools.getMeta("initialPageName") == this.name || this.groupElement != null && this.groupElement.getAttribute("data-initial-page-name") == this.name) this.open();
	}
	,groupElement: null
	,name: null
	,__class__: org.slplayer.component.navigation.Page
});
org.slplayer.component.navigation.link = {}
org.slplayer.component.navigation.link.LinkBase = function(rootElement,SLPId) {
	org.slplayer.component.ui.DisplayObject.call(this,rootElement,SLPId);
	org.slplayer.component.group.Groupable.startGroupable(this);
	this.transitionData = new org.slplayer.component.navigation.transition.TransitionData(null,"0");
	rootElement.addEventListener("click",$bind(this,this.onClick),false);
	if(rootElement.getAttribute("href") != null) {
		this.linkName = StringTools.trim(rootElement.getAttribute("href"));
		this.linkName = HxOverrides.substr(this.linkName,this.linkName.indexOf("#") + 1,null);
	} else null;
	if(rootElement.getAttribute("target") != null && StringTools.trim(rootElement.getAttribute("target")) != "") this.targetAttr = StringTools.trim(rootElement.getAttribute("target"));
};
$hxClasses["org.slplayer.component.navigation.link.LinkBase"] = org.slplayer.component.navigation.link.LinkBase;
org.slplayer.component.navigation.link.LinkBase.__name__ = ["org","slplayer","component","navigation","link","LinkBase"];
org.slplayer.component.navigation.link.LinkBase.__interfaces__ = [org.slplayer.component.group.IGroupable];
org.slplayer.component.navigation.link.LinkBase.__super__ = org.slplayer.component.ui.DisplayObject;
org.slplayer.component.navigation.link.LinkBase.prototype = $extend(org.slplayer.component.ui.DisplayObject.prototype,{
	onClick: function(e) {
		e.preventDefault();
		this.transitionData = new org.slplayer.component.navigation.transition.TransitionData(null,this.rootElement.getAttribute("data-transition-duration"),this.rootElement.getAttribute("data-transition-timing-function"),this.rootElement.getAttribute("data-transition-delay"),this.rootElement.getAttribute("data-transition-is-reversed") != null);
	}
	,transitionData: null
	,targetAttr: null
	,linkName: null
	,groupElement: null
	,__class__: org.slplayer.component.navigation.link.LinkBase
});
org.slplayer.component.navigation.link.LinkClosePage = function(rootElement,SLPId) {
	org.slplayer.component.navigation.link.LinkBase.call(this,rootElement,SLPId);
};
$hxClasses["org.slplayer.component.navigation.link.LinkClosePage"] = org.slplayer.component.navigation.link.LinkClosePage;
org.slplayer.component.navigation.link.LinkClosePage.__name__ = ["org","slplayer","component","navigation","link","LinkClosePage"];
org.slplayer.component.navigation.link.LinkClosePage.__super__ = org.slplayer.component.navigation.link.LinkBase;
org.slplayer.component.navigation.link.LinkClosePage.prototype = $extend(org.slplayer.component.navigation.link.LinkBase.prototype,{
	onClick: function(e) {
		org.slplayer.component.navigation.link.LinkBase.prototype.onClick.call(this,e);
		org.slplayer.component.navigation.Page.closePage(this.linkName,this.transitionData,this.SLPlayerInstanceId);
	}
	,__class__: org.slplayer.component.navigation.link.LinkClosePage
});
org.slplayer.component.navigation.link.LinkToPage = function(rootElement,SLPId) {
	org.slplayer.component.navigation.link.LinkBase.call(this,rootElement,SLPId);
};
$hxClasses["org.slplayer.component.navigation.link.LinkToPage"] = org.slplayer.component.navigation.link.LinkToPage;
org.slplayer.component.navigation.link.LinkToPage.__name__ = ["org","slplayer","component","navigation","link","LinkToPage"];
org.slplayer.component.navigation.link.LinkToPage.__super__ = org.slplayer.component.navigation.link.LinkBase;
org.slplayer.component.navigation.link.LinkToPage.prototype = $extend(org.slplayer.component.navigation.link.LinkBase.prototype,{
	onClick: function(e) {
		org.slplayer.component.navigation.link.LinkBase.prototype.onClick.call(this,e);
		org.slplayer.component.navigation.Page.openPage(this.linkName,this.targetAttr == "_top",this.transitionData,this.SLPlayerInstanceId,this.groupElement);
	}
	,__class__: org.slplayer.component.navigation.link.LinkToPage
});
org.slplayer.component.navigation.transition = {}
org.slplayer.component.navigation.transition.TransitionBase = function(rootElement,SLPId) {
	org.slplayer.component.ui.DisplayObject.call(this,rootElement,SLPId);
	this.onEndCallback = $bind(this,this.onEnd);
	this.isListening = false;
	rootElement.addEventListener("transitionEventTypeRequest",$bind(this,this.onTransitionEventTypeRequest),false);
};
$hxClasses["org.slplayer.component.navigation.transition.TransitionBase"] = org.slplayer.component.navigation.transition.TransitionBase;
org.slplayer.component.navigation.transition.TransitionBase.__name__ = ["org","slplayer","component","navigation","transition","TransitionBase"];
org.slplayer.component.navigation.transition.TransitionBase.__super__ = org.slplayer.component.ui.DisplayObject;
org.slplayer.component.navigation.transition.TransitionBase.prototype = $extend(org.slplayer.component.ui.DisplayObject.prototype,{
	removeEvents: function() {
		if(this.isListening) {
			this.isListening = false;
			this.rootElement.removeEventListener("transitionend",this.onEndCallback,false);
			this.rootElement.removeEventListener("transitionEnd",this.onEndCallback,false);
			this.rootElement.removeEventListener("webkitTransitionEnd",this.onEndCallback,false);
			this.rootElement.removeEventListener("oTransitionEnd",this.onEndCallback,false);
			this.rootElement.removeEventListener("MSTransitionEnd",this.onEndCallback,false);
		}
	}
	,addEvents: function() {
		if(this.isListening == false) {
			this.isListening = true;
			this.rootElement.addEventListener("transitionend",this.onEndCallback,false);
			this.rootElement.addEventListener("transitionEnd",this.onEndCallback,false);
			this.rootElement.addEventListener("webkitTransitionEnd",this.onEndCallback,false);
			this.rootElement.addEventListener("oTransitionEnd",this.onEndCallback,false);
			this.rootElement.addEventListener("MSTransitionEnd",this.onEndCallback,false);
		}
	}
	,onEnd: function(e) {
		if(this.isListening) {
			var event = js.Lib.document.createEvent("Event");
			event.initEvent("transitionEventTypeEnded",true,true);
			this.rootElement.dispatchEvent(event);
		}
		this.removeEvents();
	}
	,doInNextFrame: function(transitionProperty,newPropertyValue) {
		this.rootElement.style[transitionProperty] = newPropertyValue;
	}
	,applyTransitionParams: function(transitionProperty,newPropertyValue,transitionDuration,transitionTimingFunction,transitionDelay) {
		this.rootElement.style.transitionProperty = transitionProperty;
		this.rootElement.style.transitionDuration = transitionDuration;
		this.rootElement.style.transitionTimingFunction = transitionTimingFunction;
		this.rootElement.style.transitionDelay = transitionDelay;
		this.rootElement.style.MozTransitionProperty = transitionProperty;
		this.rootElement.style.MozTransitionDuration = transitionDuration;
		this.rootElement.style.MozTransitionTimingFunction = transitionTimingFunction;
		this.rootElement.style.MozTransitionDelay = transitionDelay;
		this.rootElement.style.webkitTransitionProperty = transitionProperty;
		this.rootElement.style.webkitTransitionDuration = transitionDuration;
		this.rootElement.style.webkitTransitionTimingFunction = transitionTimingFunction;
		this.rootElement.style.webkitTransitionDelay = transitionDelay;
		this.rootElement.style.oTransitionProperty = transitionProperty;
		this.rootElement.style.oTransitionDuration = transitionDuration;
		this.rootElement.style.oTransitionTimingFunction = transitionTimingFunction;
		this.rootElement.style.oTransitionDelay = transitionDelay;
		haxe.Timer.delay((function(f,a1,a2) {
			return function() {
				return f(a1,a2);
			};
		})($bind(this,this.doInNextFrame),transitionProperty,newPropertyValue),10);
	}
	,onTransitionEventTypeRequest: function(event) {
		this.addEvents();
		var transitionData = event.detail;
		this.start(transitionData);
		var event1 = js.Lib.document.createEvent("Event");
		event1.initEvent("transitionEventTypeStarted",true,true);
		this.rootElement.dispatchEvent(event1);
	}
	,start: function(transitionData) {
	}
	,onEndCallback: null
	,isListening: null
	,__class__: org.slplayer.component.navigation.transition.TransitionBase
});
org.slplayer.component.navigation.transition.TransitionType = $hxClasses["org.slplayer.component.navigation.transition.TransitionType"] = { __ename__ : ["org","slplayer","component","navigation","transition","TransitionType"], __constructs__ : ["show","hide"] }
org.slplayer.component.navigation.transition.TransitionType.show = ["show",0];
org.slplayer.component.navigation.transition.TransitionType.show.toString = $estr;
org.slplayer.component.navigation.transition.TransitionType.show.__enum__ = org.slplayer.component.navigation.transition.TransitionType;
org.slplayer.component.navigation.transition.TransitionType.hide = ["hide",1];
org.slplayer.component.navigation.transition.TransitionType.hide.toString = $estr;
org.slplayer.component.navigation.transition.TransitionType.hide.__enum__ = org.slplayer.component.navigation.transition.TransitionType;
org.slplayer.component.navigation.transition.TransitionData = function(transitionType,transitionDuration,transitionTimingFunction,transitionDelay,transitionIsReversed) {
	if(transitionIsReversed == null) transitionIsReversed = false;
	if(transitionDelay == null) transitionDelay = "0";
	if(transitionTimingFunction == null) transitionTimingFunction = "linear";
	if(transitionDuration == null) transitionDuration = ".5s";
	this.type = transitionType;
	this.duration = transitionDuration;
	this.timingFunction = transitionTimingFunction;
	this.delay = transitionDelay;
	this.isReversed = transitionIsReversed;
};
$hxClasses["org.slplayer.component.navigation.transition.TransitionData"] = org.slplayer.component.navigation.transition.TransitionData;
org.slplayer.component.navigation.transition.TransitionData.__name__ = ["org","slplayer","component","navigation","transition","TransitionData"];
org.slplayer.component.navigation.transition.TransitionData.prototype = {
	isReversed: null
	,type: null
	,delay: null
	,timingFunction: null
	,duration: null
	,__class__: org.slplayer.component.navigation.transition.TransitionData
}
org.slplayer.component.navigation.transition.TransitionHorizontal = function(rootElement,SLPId) {
	org.slplayer.component.navigation.transition.TransitionBase.call(this,rootElement,SLPId);
	this.styleAttrPosition = rootElement.style.position;
	rootElement.style.left = "0px";
};
$hxClasses["org.slplayer.component.navigation.transition.TransitionHorizontal"] = org.slplayer.component.navigation.transition.TransitionHorizontal;
org.slplayer.component.navigation.transition.TransitionHorizontal.__name__ = ["org","slplayer","component","navigation","transition","TransitionHorizontal"];
org.slplayer.component.navigation.transition.TransitionHorizontal.__super__ = org.slplayer.component.navigation.transition.TransitionBase;
org.slplayer.component.navigation.transition.TransitionHorizontal.prototype = $extend(org.slplayer.component.navigation.transition.TransitionBase.prototype,{
	onEnd: function(e) {
		org.slplayer.component.navigation.transition.TransitionBase.prototype.onEnd.call(this,e);
		this.rootElement.style.position = this.styleAttrPosition;
	}
	,start: function(transitionData) {
		org.slplayer.component.navigation.transition.TransitionBase.prototype.start.call(this,transitionData);
		this.rootElement.style.position = "absolute";
		var left;
		if(transitionData.type == org.slplayer.component.navigation.transition.TransitionType.show) left = 0; else left = js.Lib.window.innerWidth;
		if(transitionData.isReversed) left = -left;
		this.applyTransitionParams("left",left + "px",transitionData.duration,transitionData.timingFunction,transitionData.delay);
	}
	,styleAttrPosition: null
	,__class__: org.slplayer.component.navigation.transition.TransitionHorizontal
});
org.slplayer.component.navigation.transition.TransitionVertical = function(rootElement,SLPId) {
	org.slplayer.component.navigation.transition.TransitionHorizontal.call(this,rootElement,SLPId);
};
$hxClasses["org.slplayer.component.navigation.transition.TransitionVertical"] = org.slplayer.component.navigation.transition.TransitionVertical;
org.slplayer.component.navigation.transition.TransitionVertical.__name__ = ["org","slplayer","component","navigation","transition","TransitionVertical"];
org.slplayer.component.navigation.transition.TransitionVertical.__super__ = org.slplayer.component.navigation.transition.TransitionHorizontal;
org.slplayer.component.navigation.transition.TransitionVertical.prototype = $extend(org.slplayer.component.navigation.transition.TransitionHorizontal.prototype,{
	start: function(transitionData) {
		this.rootElement.style.position = "absolute";
		var top;
		if(transitionData.type == org.slplayer.component.navigation.transition.TransitionType.show) top = 0; else top = js.Lib.window.innerHeight;
		if(transitionData.isReversed) top = -top;
		this.applyTransitionParams("top",top + "px",transitionData.duration,transitionData.timingFunction,transitionData.delay);
	}
	,__class__: org.slplayer.component.navigation.transition.TransitionVertical
});
org.slplayer.component.sound = {}
org.slplayer.component.sound.SoundOn = function(rootElement,SLPId) {
	org.slplayer.component.ui.DisplayObject.call(this,rootElement,SLPId);
	rootElement.onclick = $bind(this,this.onClick);
};
$hxClasses["org.slplayer.component.sound.SoundOn"] = org.slplayer.component.sound.SoundOn;
org.slplayer.component.sound.SoundOn.__name__ = ["org","slplayer","component","sound","SoundOn"];
org.slplayer.component.sound.SoundOn.mute = function(doMute) {
	var audioTags = js.Lib.document.getElementsByTagName("audio");
	var _g1 = 0, _g = audioTags.length;
	while(_g1 < _g) {
		var idx = _g1++;
		audioTags[idx].muted = doMute;
	}
	org.slplayer.component.sound.SoundOn.isMuted = doMute;
	var soundOffButtons = js.Lib.document.getElementsByClassName("SoundOff");
	var soundOnButtons = js.Lib.document.getElementsByClassName("SoundOn");
	var _g1 = 0, _g = soundOffButtons.length;
	while(_g1 < _g) {
		var idx = _g1++;
		if(doMute) soundOffButtons[idx].style.visibility = "hidden"; else soundOffButtons[idx].style.visibility = "visible";
	}
	var _g1 = 0, _g = soundOnButtons.length;
	while(_g1 < _g) {
		var idx = _g1++;
		if(!doMute) soundOnButtons[idx].style.visibility = "hidden"; else soundOnButtons[idx].style.visibility = "visible";
	}
}
org.slplayer.component.sound.SoundOn.__super__ = org.slplayer.component.ui.DisplayObject;
org.slplayer.component.sound.SoundOn.prototype = $extend(org.slplayer.component.ui.DisplayObject.prototype,{
	onClick: function(e) {
		org.slplayer.component.sound.SoundOn.mute(false);
	}
	,init: function() {
		org.slplayer.component.sound.SoundOn.mute(false);
	}
	,__class__: org.slplayer.component.sound.SoundOn
});
org.slplayer.component.sound.SoundOff = function(rootElement,SLPId) {
	org.slplayer.component.sound.SoundOn.call(this,rootElement,SLPId);
};
$hxClasses["org.slplayer.component.sound.SoundOff"] = org.slplayer.component.sound.SoundOff;
org.slplayer.component.sound.SoundOff.__name__ = ["org","slplayer","component","sound","SoundOff"];
org.slplayer.component.sound.SoundOff.__super__ = org.slplayer.component.sound.SoundOn;
org.slplayer.component.sound.SoundOff.prototype = $extend(org.slplayer.component.sound.SoundOn.prototype,{
	onClick: function(e) {
		org.slplayer.component.sound.SoundOn.mute(true);
	}
	,__class__: org.slplayer.component.sound.SoundOff
});
org.slplayer.core = {}
org.slplayer.core.Application = function(id,args) {
	this.dataObject = args;
	this.id = id;
	this.nodesIdSequence = 0;
	this.registeredComponents = new Array();
	this.nodeToCmpInstances = new Hash();
	this.metaParameters = new Hash();
};
$hxClasses["org.slplayer.core.Application"] = org.slplayer.core.Application;
$hxExpose(org.slplayer.core.Application, "app");
org.slplayer.core.Application.__name__ = ["org","slplayer","core","Application"];
org.slplayer.core.Application.get = function(SLPId) {
	return org.slplayer.core.Application.instances.get(SLPId);
}
org.slplayer.core.Application.main = function() {
	var newApp = org.slplayer.core.Application.createApplication();
	js.Lib.window.onload = function(e) {
		newApp.init();
	};
}
org.slplayer.core.Application.createApplication = function(args) {
	var newId = org.slplayer.core.Application.generateUniqueId();
	var newInstance = new org.slplayer.core.Application(newId,args);
	org.slplayer.core.Application.instances.set(newId,newInstance);
	return newInstance;
}
org.slplayer.core.Application.generateUniqueId = function() {
	return Std.string(Math.round(Math.random() * 10000));
}
org.slplayer.core.Application.prototype = {
	getUnconflictedClassTag: function(displayObjectClassName) {
		var classTag = displayObjectClassName;
		if(classTag.indexOf(".") != -1) classTag = HxOverrides.substr(classTag,classTag.lastIndexOf(".") + 1,null);
		var _g = 0, _g1 = this.registeredComponents;
		while(_g < _g1.length) {
			var rc = _g1[_g];
			++_g;
			if(rc.classname != displayObjectClassName && classTag == HxOverrides.substr(rc.classname,classTag.lastIndexOf(".") + 1,null)) return displayObjectClassName;
		}
		return classTag;
	}
	,getAssociatedComponents: function(node,typeFilter) {
		var nodeId = node.getAttribute("data-" + "slpid");
		if(nodeId != null) {
			var l = new List();
			if(this.nodeToCmpInstances.exists(nodeId)) {
				var $it0 = this.nodeToCmpInstances.get(nodeId).iterator();
				while( $it0.hasNext() ) {
					var i = $it0.next();
					if(js.Boot.__instanceof(i,typeFilter)) {
						var inst = i;
						l.add(inst);
					}
				}
			}
			return l;
		}
		return new List();
	}
	,addAssociatedComponent: function(node,cmp) {
		var nodeId = node.getAttribute("data-" + "slpid");
		var associatedCmps;
		if(nodeId != null) associatedCmps = this.nodeToCmpInstances.get(nodeId); else {
			this.nodesIdSequence++;
			nodeId = Std.string(this.nodesIdSequence);
			node.setAttribute("data-" + "slpid",nodeId);
			associatedCmps = new List();
		}
		associatedCmps.add(cmp);
		this.nodeToCmpInstances.set(nodeId,associatedCmps);
	}
	,callInitOnComponents: function() {
		var $it0 = this.nodeToCmpInstances.iterator();
		while( $it0.hasNext() ) {
			var l = $it0.next();
			var $it1 = l.iterator();
			while( $it1.hasNext() ) {
				var c = $it1.next();
				c.init();
			}
		}
	}
	,createComponentsOfType: function(componentClassName,args) {
		var componentClass = Type.resolveClass(componentClassName);
		if(componentClass == null) {
			var rslErrMsg = "ERROR cannot resolve " + componentClassName;
			throw rslErrMsg;
			return;
		}
		if(org.slplayer.component.ui.DisplayObject.isDisplayObject(componentClass)) {
			var classTag = this.getUnconflictedClassTag(componentClassName);
			var taggedNodes = new Array();
			var taggedNodesCollection = this.htmlRootElement.getElementsByClassName(classTag);
			var _g1 = 0, _g = taggedNodesCollection.length;
			while(_g1 < _g) {
				var nodeCnt = _g1++;
				taggedNodes.push(taggedNodesCollection[nodeCnt]);
			}
			if(componentClassName != classTag) {
				taggedNodesCollection = this.htmlRootElement.getElementsByClassName(componentClassName);
				var _g1 = 0, _g = taggedNodesCollection.length;
				while(_g1 < _g) {
					var nodeCnt = _g1++;
					taggedNodes.push(taggedNodesCollection[nodeCnt]);
				}
			}
			var _g = 0;
			while(_g < taggedNodes.length) {
				var node = taggedNodes[_g];
				++_g;
				var newDisplayObject;
				newDisplayObject = Type.createInstance(componentClass,[node,this.id]);
			}
		} else {
			var cmpInstance = null;
			if(args != null) cmpInstance = Type.createInstance(componentClass,[args]); else cmpInstance = Type.createInstance(componentClass,[]);
			if(cmpInstance != null && js.Boot.__instanceof(cmpInstance,org.slplayer.component.ISLPlayerComponent)) cmpInstance.initSLPlayerComponent(this.id);
		}
	}
	,initComponents: function() {
		var _g = 0, _g1 = this.registeredComponents;
		while(_g < _g1.length) {
			var rc = _g1[_g];
			++_g;
			this.createComponentsOfType(rc.classname,rc.args);
		}
		this.callInitOnComponents();
	}
	,registerComponent: function(componentClassName,args) {
		this.registeredComponents.push({ classname : componentClassName, args : args});
	}
	,registerComponentsforInit: function() {
		org.slplayer.component.navigation.Layer;
		this.registerComponent("org.slplayer.component.navigation.Layer");
		org.slplayer.component.navigation.link.LinkToPage;
		this.registerComponent("org.slplayer.component.navigation.link.LinkToPage");
		org.slplayer.component.navigation.transition.TransitionHorizontal;
		this.registerComponent("org.slplayer.component.navigation.transition.TransitionHorizontal");
		org.slplayer.component.sound.SoundOff;
		this.registerComponent("org.slplayer.component.sound.SoundOff");
		com.intermedia.components.ResizeGallery;
		this.registerComponent("com.intermedia.components.ResizeGallery");
		org.slplayer.component.sound.SoundOn;
		this.registerComponent("org.slplayer.component.sound.SoundOn");
		org.slplayer.component.navigation.link.LinkClosePage;
		this.registerComponent("org.slplayer.component.navigation.link.LinkClosePage");
		org.slplayer.component.navigation.transition.TransitionVertical;
		this.registerComponent("org.slplayer.component.navigation.transition.TransitionVertical");
		com.intermedia.components.ContextualResizer;
		this.registerComponent("com.intermedia.components.ContextualResizer");
		org.slplayer.component.navigation.Page;
		this.registerComponent("org.slplayer.component.navigation.Page");
	}
	,initMetaParameters: function() {
		this.metaParameters.set("initialPageName","page1");
	}
	,init: function(appendTo) {
		this.htmlRootElement = appendTo;
		if(this.htmlRootElement == null || this.htmlRootElement.nodeType != js.Lib.document.body.nodeType) this.htmlRootElement = js.Lib.document.body;
		if(this.htmlRootElement == null) return;
		this.initMetaParameters();
		this.registerComponentsforInit();
		this.initComponents();
	}
	,getMetaParameter: function(metaParamKey) {
		return this.metaParameters.get(metaParamKey);
	}
	,metaParameters: null
	,registeredComponents: null
	,dataObject: null
	,htmlRootElement: null
	,nodeToCmpInstances: null
	,nodesIdSequence: null
	,id: null
	,__class__: org.slplayer.core.Application
}
org.slplayer.util = {}
org.slplayer.util.DomTools = function() { }
$hxClasses["org.slplayer.util.DomTools"] = org.slplayer.util.DomTools;
org.slplayer.util.DomTools.__name__ = ["org","slplayer","util","DomTools"];
org.slplayer.util.DomTools.doLater = function(callbackFunction) {
	haxe.Timer.delay(callbackFunction,10);
}
org.slplayer.util.DomTools.getElementsByAttribute = function(elt,attr,value) {
	var childElts = elt.getElementsByTagName("*");
	var filteredChildElts = new Array();
	var _g1 = 0, _g = childElts.length;
	while(_g1 < _g) {
		var cCount = _g1++;
		if(childElts[cCount].getAttribute(attr) != null && (value == "*" || childElts[cCount].getAttribute(attr) == value)) filteredChildElts.push(childElts[cCount]);
	}
	return filteredChildElts;
}
org.slplayer.util.DomTools.getSingleElement = function(rootElement,className,required) {
	if(required == null) required = true;
	var domElements = rootElement.getElementsByClassName(className);
	if(domElements != null && domElements.length == 1) return domElements[0]; else {
		if(required) throw "Error: search for the element with class name \"" + className + "\" gave " + domElements.length + " results";
		return null;
	}
}
org.slplayer.util.DomTools.getElementBoundingBox = function(htmlDom) {
	var halfBorderH = 0;
	var halfBorderV = 0;
	return { x : Math.floor(htmlDom.offsetLeft - halfBorderH), y : Math.floor(htmlDom.offsetTop - halfBorderV), w : Math.floor(htmlDom.offsetWidth - halfBorderH), h : Math.floor(htmlDom.offsetHeight - halfBorderV)};
}
org.slplayer.util.DomTools.inspectTrace = function(obj,callingClass) {
	var _g = 0, _g1 = Reflect.fields(obj);
	while(_g < _g1.length) {
		var prop = _g1[_g];
		++_g;
		null;
	}
	null;
}
org.slplayer.util.DomTools.toggleClass = function(element,className) {
	if(org.slplayer.util.DomTools.hasClass(element,className)) org.slplayer.util.DomTools.removeClass(element,className); else org.slplayer.util.DomTools.addClass(element,className);
}
org.slplayer.util.DomTools.addClass = function(element,className) {
	if(element.className == null) element.className = "";
	if(!org.slplayer.util.DomTools.hasClass(element,className)) element.className += " " + className;
}
org.slplayer.util.DomTools.removeClass = function(element,className) {
	if(element.className == null) return;
	if(org.slplayer.util.DomTools.hasClass(element,className)) element.className = StringTools.replace(element.className,className,"");
}
org.slplayer.util.DomTools.hasClass = function(element,className) {
	if(element.className == null) return false;
	return element.className.indexOf(className) > -1;
}
org.slplayer.util.DomTools.setMeta = function(metaName,metaValue,attributeName) {
	if(attributeName == null) attributeName = "content";
	var res = new Hash();
	var metaTags = js.Lib.document.getElementsByTagName("META");
	var found = false;
	var _g1 = 0, _g = metaTags.length;
	while(_g1 < _g) {
		var idxNode = _g1++;
		var node = metaTags[idxNode];
		var configName = node.getAttribute("name");
		var configValue = node.getAttribute(attributeName);
		if(configName != null && configValue != null) {
			if(configName == metaName) {
				configValue = metaValue;
				node.setAttribute(attributeName,metaValue);
				found = true;
			}
			res.set(configName,configValue);
		}
	}
	if(!found) {
		var node = js.Lib.document.createElement("meta");
		node.setAttribute("name",metaName);
		node.setAttribute("content",metaValue);
		var head = js.Lib.document.getElementsByTagName("head")[0];
		head.appendChild(node);
		res.set(metaName,metaValue);
	}
	return res;
}
org.slplayer.util.DomTools.getMeta = function(name,attributeName,head) {
	if(attributeName == null) attributeName = "content";
	if(head == null) head = js.Lib.document.getElementsByTagName("head")[0];
	var metaTags = head.getElementsByTagName("meta");
	var _g1 = 0, _g = metaTags.length;
	while(_g1 < _g) {
		var idxNode = _g1++;
		var node = metaTags[idxNode];
		var configName = node.getAttribute("name");
		var configValue = node.getAttribute(attributeName);
		if(configName == name) return configValue;
	}
	return null;
}
org.slplayer.util.DomTools.addCssRules = function(css,head) {
	if(head == null) head = js.Lib.document.getElementsByTagName("head")[0];
	var node = js.Lib.document.createElement("style");
	node.setAttribute("type","text/css");
	node.appendChild(js.Lib.document.createTextNode(css));
	head.appendChild(node);
	return node;
}
org.slplayer.util.DomTools.embedScript = function(src) {
	var head = js.Lib.document.getElementsByTagName("head")[0];
	var scriptNodes = js.Lib.document.getElementsByTagName("script");
	var _g1 = 0, _g = scriptNodes.length;
	while(_g1 < _g) {
		var idxNode = _g1++;
		var node = scriptNodes[idxNode];
		if(node.getAttribute("src") == src) return node;
	}
	var node = js.Lib.document.createElement("script");
	node.setAttribute("src",src);
	head.appendChild(node);
	return node;
}
org.slplayer.util.DomTools.getBaseTag = function() {
	var head = js.Lib.document.getElementsByTagName("head")[0];
	var baseNodes = js.Lib.document.getElementsByTagName("base");
	if(baseNodes.length > 0) return baseNodes[0].getAttribute("href"); else return null;
}
org.slplayer.util.DomTools.setBaseTag = function(href) {
	var head = js.Lib.document.getElementsByTagName("head")[0];
	var baseNodes = js.Lib.document.getElementsByTagName("base");
	if(baseNodes.length > 0) baseNodes[0].setAttribute("href",href); else {
		var node = js.Lib.document.createElement("base");
		node.setAttribute("href",href);
		node.setAttribute("target","_self");
		if(head.childNodes.length > 0) head.insertBefore(node,head.childNodes[0]); else head.appendChild(node);
	}
}
var silex = {}
silex.ServiceBase = function(serviceName,gatewayUrl) {
	if(gatewayUrl == null) gatewayUrl = "../../";
	this.serviceName = serviceName;
	this.connection = haxe.remoting.HttpAsyncConnection.urlConnect(gatewayUrl);
};
$hxClasses["silex.ServiceBase"] = silex.ServiceBase;
silex.ServiceBase.__name__ = ["silex","ServiceBase"];
silex.ServiceBase.prototype = {
	callServerMethod: function(methodName,args,onResult,onError) {
		this.connection.setErrorHandler(onError);
		this.connection.resolve(this.serviceName).resolve(methodName).call(args,onResult);
	}
	,connection: null
	,serviceName: null
	,__class__: silex.ServiceBase
}
silex.Silex = function() { }
$hxClasses["silex.Silex"] = silex.Silex;
silex.Silex.__name__ = ["silex","Silex"];
silex.Silex.publicationName = null;
silex.Silex.main = function() {
	js.Lib.window.onload = silex.Silex.init;
}
silex.Silex.init = function(unused) {
	if(js.Lib.window.location.hash != "" && org.slplayer.util.DomTools.getMeta("useDeeplink") != "false") {
		var initialPageName = HxOverrides.substr(js.Lib.window.location.hash,1,null);
		org.slplayer.util.DomTools.setMeta("initialPageName",initialPageName);
	}
	silex.Silex.publicationName = org.slplayer.util.DomTools.getMeta("publicationName");
	var publicationBody = org.slplayer.util.DomTools.getMeta("publicationBody");
	if(publicationBody != null) {
		js.Lib.document.body.innerHTML = StringTools.htmlUnescape(org.slplayer.util.DomTools.getMeta("publicationBody"));
		org.slplayer.util.DomTools.setBaseTag("./publications/" + silex.Silex.publicationName + "/");
	}
	var application = org.slplayer.core.Application.createApplication();
	application.init();
}
silex.interpreter = {}
silex.interpreter.Interpreter = function() { }
$hxClasses["silex.interpreter.Interpreter"] = silex.interpreter.Interpreter;
silex.interpreter.Interpreter.__name__ = ["silex","interpreter","Interpreter"];
silex.interpreter.Interpreter.exec = function(script,context) {
	var parser = new hscript.Parser();
	var program = parser.parseString(script);
	var interp = new hscript.Interp();
	var _g = 0, _g1 = Reflect.fields({ Lib : js.Lib, Math : Math, Timer : haxe.Timer, StringTools : StringTools, DomTools : org.slplayer.util.DomTools, Application : org.slplayer.core.Application, Page : org.slplayer.component.navigation.Page});
	while(_g < _g1.length) {
		var varName = _g1[_g];
		++_g;
		interp.variables.set(varName,Reflect.getProperty({ Lib : js.Lib, Math : Math, Timer : haxe.Timer, StringTools : StringTools, DomTools : org.slplayer.util.DomTools, Application : org.slplayer.core.Application, Page : org.slplayer.component.navigation.Page},varName));
	}
	if(context != null) {
		var $it0 = context.keys();
		while( $it0.hasNext() ) {
			var varName = $it0.next();
			interp.variables.set(varName,context.get(varName));
		}
	}
	var res = interp.execute(program);
	return res;
}
silex.publication = {}
silex.publication.PublicationCategory = $hxClasses["silex.publication.PublicationCategory"] = { __ename__ : ["silex","publication","PublicationCategory"], __constructs__ : ["Publication","Utility","Theme"] }
silex.publication.PublicationCategory.Publication = ["Publication",0];
silex.publication.PublicationCategory.Publication.toString = $estr;
silex.publication.PublicationCategory.Publication.__enum__ = silex.publication.PublicationCategory;
silex.publication.PublicationCategory.Utility = ["Utility",1];
silex.publication.PublicationCategory.Utility.toString = $estr;
silex.publication.PublicationCategory.Utility.__enum__ = silex.publication.PublicationCategory;
silex.publication.PublicationCategory.Theme = ["Theme",2];
silex.publication.PublicationCategory.Theme.toString = $estr;
silex.publication.PublicationCategory.Theme.__enum__ = silex.publication.PublicationCategory;
silex.publication.PublicationState = $hxClasses["silex.publication.PublicationState"] = { __ename__ : ["silex","publication","PublicationState"], __constructs__ : ["Trashed","Published","Private"] }
silex.publication.PublicationState.Trashed = function(data) { var $x = ["Trashed",0,data]; $x.__enum__ = silex.publication.PublicationState; $x.toString = $estr; return $x; }
silex.publication.PublicationState.Published = function(data) { var $x = ["Published",1,data]; $x.__enum__ = silex.publication.PublicationState; $x.toString = $estr; return $x; }
silex.publication.PublicationState.Private = ["Private",2];
silex.publication.PublicationState.Private.toString = $estr;
silex.publication.PublicationState.Private.__enum__ = silex.publication.PublicationState;
silex.publication.PublicationService = function(publicationFolder,gatewayUrl) {
	if(gatewayUrl == null) gatewayUrl = "../../";
	silex.ServiceBase.call(this,"publicationService",gatewayUrl);
	this.publicationFolder = publicationFolder;
};
$hxClasses["silex.publication.PublicationService"] = silex.publication.PublicationService;
silex.publication.PublicationService.__name__ = ["silex","publication","PublicationService"];
silex.publication.PublicationService.__super__ = silex.ServiceBase;
silex.publication.PublicationService.prototype = $extend(silex.ServiceBase.prototype,{
	getPublications: function(stateFilter,categoryFilter,onResult,onError) {
		this.callServerMethod("getPublications",[stateFilter,categoryFilter,this.publicationFolder],onResult,onError);
	}
	,rename: function(srcPublicationName,publicationName,onResult,onError) {
		this.callServerMethod("rename",[srcPublicationName,publicationName,this.publicationFolder],onResult,onError);
	}
	,duplicate: function(srcPublicationName,publicationName,onResult,onError) {
		this.callServerMethod("duplicate",[srcPublicationName,publicationName,this.publicationFolder],onResult,onError);
	}
	,emptyTrash: function(onResult,onError) {
		this.callServerMethod("emptyTrash",[this.publicationFolder],onResult,onError);
	}
	,trash: function(publicationName,onResult,onError) {
		this.callServerMethod("trash",[publicationName,this.publicationFolder],onResult,onError);
	}
	,create: function(publicationName,publicationData,onResult,onError) {
		this.callServerMethod("create",[publicationName,publicationData,this.publicationFolder],onResult,onError);
	}
	,setPublicationData: function(publicationName,publicationData,onResult,onError) {
		this.callServerMethod("setPublicationData",[publicationName,publicationData,this.publicationFolder],onResult,onError);
	}
	,getPublicationData: function(publicationName,onResult,onError) {
		this.callServerMethod("getPublicationData",[publicationName,this.publicationFolder],onResult,onError);
	}
	,getPublicationConfig: function(publicationName,onResult,onError) {
		this.callServerMethod("getPublicationConfig",[publicationName,this.publicationFolder],onResult,onError);
	}
	,publicationFolder: null
	,__class__: silex.publication.PublicationService
});
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; };
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
js.XMLHttpRequest = window.XMLHttpRequest?XMLHttpRequest:window.ActiveXObject?function() {
	try {
		return new ActiveXObject("Msxml2.XMLHTTP");
	} catch( e ) {
		try {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} catch( e1 ) {
			throw "Unable to create XMLHttpRequest object.";
		}
	}
}:(function($this) {
	var $r;
	throw "Unable to create XMLHttpRequest object.";
	return $r;
}(this));
haxe.Serializer.USE_CACHE = false;
haxe.Serializer.USE_ENUM_INDEX = false;
haxe.Serializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.Template.splitter = new EReg("(::[A-Za-z0-9_ ()&|!+=/><*.\"-]+::|\\$\\$([A-Za-z0-9_-]+)\\()","");
haxe.Template.expr_splitter = new EReg("(\\(|\\)|[ \r\n\t]*\"[^\"]*\"[ \r\n\t]*|[!+=/><*.&|-]+)","");
haxe.Template.expr_trim = new EReg("^[ ]*([^ ]+)[ ]*$","");
haxe.Template.expr_int = new EReg("^[0-9]+$","");
haxe.Template.expr_float = new EReg("^([+-]?)(?=\\d|,\\d)\\d*(,\\d*)?([Ee]([+-]?\\d+))?$","");
haxe.Template.globals = { };
haxe.Unserializer.DEFAULT_RESOLVER = Type;
haxe.Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.Unserializer.CODES = null;
haxe.io.Output.LN2 = Math.log(2);
hscript.Parser.p1 = 0;
hscript.Parser.readPos = 0;
hscript.Parser.tokenMin = 0;
hscript.Parser.tokenMax = 0;
js.Lib.onerror = null;
org.slplayer.component.navigation.Page.CLASS_NAME = "Page";
org.slplayer.component.navigation.Page.CONFIG_NAME_ATTR = "name";
org.slplayer.component.navigation.Page.CONFIG_INITIAL_PAGE_NAME = "initialPageName";
org.slplayer.component.navigation.Page.ATTRIBUTE_INITIAL_PAGE_NAME = "data-initial-page-name";
org.slplayer.component.navigation.link.LinkBase.__meta__ = { obj : { tagNameFilter : ["a"]}};
org.slplayer.component.navigation.link.LinkBase.CONFIG_PAGE_NAME_ATTR = "href";
org.slplayer.component.navigation.link.LinkBase.CONFIG_TARGET_ATTR = "target";
org.slplayer.component.navigation.link.LinkBase.CONFIG_TARGET_IS_POPUP = "_top";
org.slplayer.component.navigation.link.LinkBase.CONFIG_TRANSITION_DURATION = "data-transition-duration";
org.slplayer.component.navigation.link.LinkBase.CONFIG_TRANSITION_TIMING_FUNCTION = "data-transition-timing-function";
org.slplayer.component.navigation.link.LinkBase.CONFIG_TRANSITION_DELAY = "data-transition-delay";
org.slplayer.component.navigation.link.LinkBase.CONFIG_TRANSITION_IS_REVERSED = "data-transition-is-reversed";
org.slplayer.component.navigation.link.LinkClosePage.__meta__ = { obj : { tagNameFilter : ["a"]}};
org.slplayer.component.navigation.link.LinkToPage.__meta__ = { obj : { tagNameFilter : ["a"]}};
org.slplayer.component.navigation.transition.TransitionBase.__meta__ = { obj : { tagNameFilter : ["div"]}};
org.slplayer.component.navigation.transition.TransitionData.EVENT_TYPE_REQUEST = "transitionEventTypeRequest";
org.slplayer.component.navigation.transition.TransitionData.EVENT_TYPE_STARTED = "transitionEventTypeStarted";
org.slplayer.component.navigation.transition.TransitionData.EVENT_TYPE_ENDED = "transitionEventTypeEnded";
org.slplayer.component.navigation.transition.TransitionData.LINEAR = "linear";
org.slplayer.component.navigation.transition.TransitionData.EASE = "ease";
org.slplayer.component.navigation.transition.TransitionData.EASE_IN = "ease-in";
org.slplayer.component.navigation.transition.TransitionData.EASE_OUT = "ease-out";
org.slplayer.component.navigation.transition.TransitionData.EASE_IN_OUT = "ease-in-out";
org.slplayer.component.sound.SoundOn.__meta__ = { obj : { tagNameFilter : ["a"]}};
org.slplayer.component.sound.SoundOn.CLASS_NAME = "SoundOn";
org.slplayer.component.sound.SoundOn.isMuted = false;
org.slplayer.component.sound.SoundOff.__meta__ = { obj : { tagNameFilter : ["a"]}};
org.slplayer.component.sound.SoundOff.CLASS_NAME = "SoundOff";
org.slplayer.core.Application.SLPID_ATTR_NAME = "slpid";
org.slplayer.core.Application.instances = new Hash();
silex.ServiceBase.DEFAULT_GATEWAY_URL = "../../";
silex.Silex.CONFIG_PUBLICATION_NAME = "publicationName";
silex.Silex.CONFIG_PUBLICATION_BODY = "publicationBody";
silex.Silex.CONFIG_USE_DEEPLINK = "useDeeplink";
silex.Silex.LOADER_SCRIPT_PATH = "../../loader.js";
silex.interpreter.Interpreter.CONFIG_TAG_DEBUG_MODE_ACTION = "debugModeAction";
silex.interpreter.Interpreter.BASIC_CONTEXT = { Lib : js.Lib, Math : Math, Timer : haxe.Timer, StringTools : StringTools, DomTools : org.slplayer.util.DomTools, Application : org.slplayer.core.Application, Page : org.slplayer.component.navigation.Page};
silex.publication.PublicationService.SERVICE_NAME = "publicationService";
silex.publication.PublicationService.PUBLICATION_FOLDER = "./publications/";
silex.publication.PublicationService.BUILDER_PUBLICATION_NAME = "admin";
silex.Silex.main();
function $hxExpose(src, path) {
	var o = window;
	var parts = path.split(".");
	for(var ii = 0; ii < parts.length-1; ++ii) {
		var p = parts[ii];
		if(typeof o[p] == "undefined") o[p] = {};
		o = o[p];
	}
	o[parts[parts.length-1]] = src;
}
})();