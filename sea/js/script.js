// TODO

// game start / end / restart - 25%
// cli-srv szétválasztás
// totem (snail)

// 5LET
// csak a karakter környezetében látszódnak a dolgok

// KÉSZ

// feature detect (fullscreen(ok), canvas, animFrame, web-sockets, audio api...)
// fullscreen api
// scale mobilra --> egér koord. skálázni!
// fight bubbles
// forEach
// enemy AI (?) támadás - védés
// flags - capture the flag
// group ? side migrálás?
// default DIR
// squid kontúr
// fps független működés
// fordulási szögsebesség legyen arányos a sebességgel --> helyett sebesség szabályozás
// food AI - move
// háttér canvas - elemek
// felitatok egy felső layerre
// fight ==> a célpont hit() fv. meghívása
// enemy - friend : csapat ID --> ebből kell azonosítani az ellenséget
// a.par - paraméterek tömbként
// harc az útbaeső ellenséggel
// shape szín variáns
// mouseover fv
// mozilla teszt
// enemy op=0-ban is támadjon --- op=0 kell-e?

"use strict";

window.onerror = function (msg,url,line) {
	//console.log("--error: ",msg,url,line);
	var e = document.querySelector("#ovl") ;
	e.className="";
	e.insertAdjacentHTML('beforeend',"<p>"+msg+url+line+"</p>") ;
	//return false;
}

var a = {} ;

a.v = function(n,a) {
	this.v = n || 0;
	this.a = a || 0;
	this.set = function(n,a) {
		this.v = n;
		this.a = a;
	};
	this.add = function(arg) {
		this.x =  this.v * Math.cos(this.a) + arg.v * Math.cos(arg.a) ;
		this.y =  this.v * Math.sin(this.a) + arg.v * Math.sin(arg.a) ;
		this.v = Math.sqrt(this.x*this.x+this.y*this.y) ;
		this.a = Math.atan2(this.y,this.x) ;
	};
	this.addS = function(n,a) {
		this.x =  this.v * Math.cos(this.a) + n * Math.cos(a) ;
		this.y =  this.v * Math.sin(this.a) + n * Math.sin(a) ;
		this.v = Math.sqrt(this.x*this.x+this.y*this.y) ;
		this.a = Math.atan2(this.y,this.x) ;
	};
	this.sub = function(arg) {
		var x =  this.v * Math.cos(this.a) - arg.v * Math.cos(arg.a) ;
		var y =  this.v * Math.sin(this.a) - arg.v * Math.sin(arg.a) ;
		this.v = Math.sqrt(x*x+y*y) ;
		this.a = Math.atan2(y,x) ;
	};
	
	this.rot = function(arg) {
		this.a+=arg;
		if (this.a >  Math.PI) {
			this.a-=window.a.c.PIx2 ;
		}
		if (this.a < -Math.PI) {
			this.a+=window.a.c.PIx2 ;
		}
	};
	
} ;
 
// ---------------------------------- CONST
a.c = {
	PI_2: Math.PI / 2, 
	PI_3_4: 3* Math.PI / 4 , 
	PI_4: Math.PI / 4,
	PI_8: Math.PI / 8,
	PIx2: Math.PI * 2,
	PI_180: Math.PI / 180,
	PI_18: Math.PI / 18,
	PIx0_75: Math.PI * 0.75,
	PIx1_5: Math.PI * 1.5
};

// ---------------------------------- UTIL
a.util = { 
	addAng: function(a1,a2) {
		a1 += a2;
		if (a1 >  Math.PI) {
			a1-=window.a.c.PIx2 ;
		}
		if (a1 < -Math.PI) {
			a1+=window.a.c.PIx2 ;
		}
		return a1;
	}
}

a.feat = {
	init: function () {
		var e = document.documentElement; 
		e.fullScr = e.requestFullscreen || e.msRequestFullscreen || e.mozRequestFullScreen || e.webkitRequestFullScreen ;
		
		window.requestAnimFrame = window.requestAnimationFrame 
						|| window.webkitRequestAnimationFrame 
						|| window.mozRequestAnimationFrame 
						|| window.oRequestAnimationFrame 
						|| window.msRequestAnimationFrame  	; 
						
		this.chk = [!!document.documentElement.fullScr,
					!!window.requestAnimFrame,
					!!document.createElement("canvas").getContext,
					'WebSocket' in window || 'MozWebSocket' in window,
					!!(window.AudioContext || window.webkitAudioContext)] ;
		
		this.chk.forEach(function(e,i) {
			!e ? document.querySelectorAll("#ovl div")[i].style.display  = "block" : 0;
		});
					
		return this.chk[1] && this.chk[2] && this.chk[3] ;
	}
}

// ---------------------------------- CANVAS
a.canvas = {
	elemFg: null,
	ctxFg: null,
	w: null,
	h: null,
	mouse: {x:0,y:0},
	mouseClick: false,
	rect: {},
	resize: function() {
		var x=window.innerWidth/1300;
		var y=window.innerHeight/700;
		
		if (y<x) {
			y = y>1?1:y;
			this.elemFg.style.height = this.elemBg.style.height = 700*y+"px";
			//this.elemBg.style.height = 700*y+"px";
			this.elemFg.style.width = this.elemBg.style.width = "auto";
			//this.elemBg.style.width = "auto";
			this.ratio = y;
		}
		else {
			x = x>1?1:x;
			this.elemFg.style.width = this.elemBg.style.width = 1300*x+"px";
			//this.elemBg.style.width = 1300*x+"px";
			this.elemFg.style.height = this.elemBg.style.height = "auto";
			//this.elemBg.style.height = "auto";
			this.ratio = x;
		}
		this.elemFg.style.left = this.elemBg.style.left = window.innerWidth/2-650*this.ratio+"px";
		//this.elemBg.style.left = window.innerWidth/2-650*this.ratio+"px";
		this.elemFg.style.top = this.elemBg.style.top = window.innerHeight/2-350*this.ratio+"px";
		//this.elemBg.style.top = window.innerHeight/2-350*this.ratio+"px";
		this.rect = this.elemFg.getBoundingClientRect();
	},
	init: function() {			
		var $this = this;
		
		var canvas = document.getElementById('c-fg');
		canvas.height = this.h = 700 ;
		canvas.width = this.w = 1300 ;
						
		this.elemFg = canvas ;
		this.ctxFg = canvas.getContext('2d');
				
		canvas.addEventListener('click', function(evt) {
			$this.mouseClick = true;
			if (!a.app.fullSrc && document.documentElement.fullScr) {
				a.app.fullScr = 1;
				document.documentElement.fullScr();
			}
		}, false);
		  
		canvas.addEventListener('mousemove', function(evt) {
			$this.mouse.x = (evt.clientX- $this.rect.left)/$this.ratio ;
			$this.mouse.y = (evt.clientY- $this.rect.top)/$this.ratio ;
			//console.log(evt.clientX,evt.clientY);
		}, false);
		
		//   BG LAYER
				
		canvas = document.getElementById('c-bg');
		canvas.height = 700 ;
		canvas.width = 1300;
				
		this.elemBg = canvas ;
		this.ctxBg = canvas.getContext('2d');
		
		this.resize();
		
		window.addEventListener('resize', function() {
			a.canvas.resize();
		});
		
		// this.patt();
	},
	bg: function() {
		var ctx = this.ctxBg ;

		ctx.shadowBlur = 12;
		for (var i=0; i<6000; i++) {
			var col = "rgb("+Math.round(0+40*Math.random())+","+Math.round(0+40*Math.random())+",00)" ;
			ctx.fillStyle = col;
			ctx.shadowColor = col;
			var x = this.elemBg.width*Math.random();
			var y = this.elemBg.height*Math.random();
			var xw = 1+8*Math.random();

			ctx.beginPath();
			ctx.arc(x,y,xw,0,6.3);
			ctx.fill();
		} 
		
	},
	clr: function() {
		this.ctxFg.clearRect(0, 0, this.w, this.h);
	},
	gen: function() {
		this.spr = [] ;
		this.imgBuf = document.createElement("canvas"); //getElementById('c-sp'); 
		
		this.imgBuf.height = 64; //1600 ;
		this.imgBuf.width = 64; // 1600 ;

		var ctx = this.imgBuf.getContext('2d');
				
		var frames = [];
		
		for (var sh=0; sh< shp.length	; sh++) {
			this.spr[sh] = [];
			
			var img = shp[sh] ;
			if ( img[0] != "!" ) { 
				this.variant = 0;
				frames = [];
				for (var idx=0; idx < img.length; idx++) {
					frames[idx] = img[0].split("|");
					if (idx>0) {
						var diffItems = img[idx].split("|") ;

						for (var i=0; i< diffItems.length; i++) {
							var rowNr = diffItems[i].match(/(\$\d+,)(.+)/i)[1].match(/\d+/).toString() ;
							frames[idx][rowNr] = diffItems[i].match(/(\$\d+,)(.+)/i)[2];
						}
					}
				}
			}
			else {
				img.splice(0,1);
				this.variants = img;
				this.variant = 1;
			}

			for (var idx=0; idx < frames.length; idx++) {
				for (var row=0; row < frames[idx].length; row++) {
					var op = imgKey[frames[idx][row].match(/\w/).toString()] ;
										
					var eq = op.match(/=$/) ;

					if (eq) {
						op = op.match(/(.+)(=$)/)[1] ;
						var arg = frames[idx][row].replace(/(\w'|\w)/,"").replace(/'$/,"") ;
						
						if (this.variant) {
							for (var v=0; v< this.variants.length; v++) {
								var from = this.variants[v].split("|")[0];
								var to = this.variants[v].split("|")[1];
								var regEx = new RegExp(from.replace(/\(/,"\\(").replace(/\)/,"\\)")) ;
								arg = arg.replace(regEx,to);
							}
						}
						ctx[op] = arg ;
					}
					else {
						var args = frames[idx][row].replace(/\w/,"") ;
						args.length ? args = args.split(",") : args = [];
						ctx[op].apply(ctx,args);
					}
				}
				//ctx.translate(100,0);
				var fr = new Image();
				fr.src=this.imgBuf.toDataURL()
				this.spr[sh].push(fr) ; 
				ctx.clearRect(0, 0, 64, 64);
			}
			//ctx.translate(-100*frames.length,100);
		}
		
		// ==============  BUBBLES
		this.spr[sh] = [];
		
		var bubX = [34,28,38,33,33,37,29,37,29,32,31,36] ;
		var bubY = [31,33,33,25,41,38,28,27,38,35,30,33] ;
		var bubP = [ 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2];
				
		for( var f=0; f<16; f++) {
			bubX.forEach(function(e,i) {
				ctx.beginPath();
				ctx.arc(e,bubY[i],(f+bubP[i])& 3,0,a.c.PIx2); 
				ctx.fillStyle = "#008888";
				ctx.fill();
				ctx.beginPath();
				ctx.arc(e-1,bubY[i],1&(((f+bubP[i])& 3)&2?3:0),0,a.c.PIx2); 
				ctx.fillStyle = "#00aaaa";
				ctx.fill();
			});
			//ctx.translate(100,0);
			var fr = new Image();
			fr.src=this.imgBuf.toDataURL()
			this.spr[sh].push(fr) ;
			ctx.clearRect(0, 0, 64, 64);
		}
		//ctx.translate(-1600,100);
		
		
		//this.imgBuf = document.createElement("img");
		//this.imgBuf.src = this.imgBufC.toDataURL();
	}
	
}

// ---------------------------------- ANIM
a.anim = {
	//dropped: 0,
	T1: 0,
	T2: 0,
	dT: 0,
	cnt: 0,
	fps:0,
	fpsAvg: 0,
	calcDT: function() {
		this.T1 = this.T2 ;
		this.T2 = Date.now() ;
		this.dT = this.T2 - this.T1 ;
		
		// ================ calc FPS
		this.fps+= (1000 / this.dT) ;
		this.cnt++;
		if (this.cnt == 100)  { 
			this.cnt = 0;
			this.fpsAvg = Math.round(this.fps / 100)&63;
			this.fps = 0;
		}
	}
	
};

a.par = function(init) {
	this.id = a.app.obj.length;
	this.i = 0;	
	this.vdT = new a.v(0,0) ;
	this.p = new a.v(init[0] , init[1] ) ;
	this.dir = init[16] ;
	this.v = new a.v(0,this.dir) ;
	this.ctr = new a.v() ;
	this.sp = init[2]  ;
	this.d = init[3]  ;
	this.dA = 0;
	this.cA = 0;
	this.dist = new a.v(0,0);
	this.avo = init[4]  ;
	this.title = init[5] ;
	this.targetType = 0;
	this.targetId = -1;

	this.skipped = -1;
	this.vTarget = new a.v(0,0);
	this.vMove = new a.v(0,0);
	this.vToOther = new a.v(0,0);
		this.avoVect = new a.v(0,0); // ===========================TEST!!!!
	this.collIds = [] ;
	this.avoidIds = [] ;
	this.wallDir = [] ;
	this.wallDist = [] ;
	this.hp = init[6] ;
	this.health = init[7] ;
	this.prot = init[8] ;
	this.group = init[9]  ;
	this.side = init[10]  ;
	this.sw = init[11] ;
	
	// ================  SWARM center of gravity
	if (!a.app.swarms[this.sw]) {
		a.app.swarms[this.sw] = { x:0, y:0, sw: this.sw } ;
	}
	
	this.sh = init[12] ;
	this.frame = 0;
	this.lastFr = init[13] ;
	this.centFr = init[14] ;
	this.oneWay = init[15] ;
	this.animDir = 1;
	this.animT = 0;
	this.fight = 0;
	this.bub = 0;

	this.eat = 0;
	this.cacheUp = 0;
	
	this.AIrole = init[17] ;
	this.guardAng = 0;
		
	this.operate = function() {
		var $this = this;
		this.vMove.set(0,0) ;
		
		// ================================ ATTACK / SKIPPING
		if (this.avoidIds.indexOf(this.skipped) == -1) {
				this.skipped = -1 ;
			}
		
		if (this.side  && this.avoidIds.length ) { // && !this.fight
			this.cloId = -1;
			this.cloDist = Infinity;

			this.avoidIds.forEach(function(e,i) {
				if (a.app.obj[e].side && a.app.obj[e].side !=$this.side && e!=$this.skipped ) {
					$this.dx = $this.x - a.app.obj[e].x ;
					$this.dy = $this.y - a.app.obj[e].y ;
					$this.eDist = $this.dx * $this.dx + $this.dy * $this.dy ;
					if ($this.eDist < $this.cloDist) {
						$this.cloId = e ;
						$this.cloDist = $this.eDist;
					}
				}
			});
			if (this.cloId != -1) {
				this.setTarget(this.cloId) ;
			}
		}
	
		// ================================ TAGET COORD.
		if (this.targetType) {
			this.v.v = this.sp;
			
			if (this.targetId !=-1) {
				this.vTarget.set(a.app.obj[ this.targetId].p.v,a.app.obj[ this.targetId].p.a) ;
			}
			
			this.vMove.set(this.vTarget.v,this.vTarget.a) ;
			this.vMove.sub(this.p) ;				
			this.vMove.set(1,this.vMove.a);
		
						
			// avoid wall

			this.wallDir.forEach(function(e,i) {
				$this.vMove.addS($this.wallDist[i] / 5,e);
			});
			
			// avoid objects
			this.pen = 0;
			// ===========================TEST!!!!
			this.avoVect.set(0,0);
			// ===========================TEST!!!!
			
			this.avoidIds.forEach(function(e,i) {
				if (e != $this.targetId && !$this.fight ) {
					$this.vToOther.set($this.p.v,$this.p.a);
					$this.vToOther.sub(a.app.obj[e].p) ;
										
					$this.pen = $this.d + a.app.obj[e].avo - $this.vToOther.v ;
					$this.vMove.addS($this.pen / 15 ,$this.vToOther.a);
					
					// ===========================TEST!!!!
					
					$this.avoVect.addS($this.pen / 15 ,$this.vToOther.a);
					
					// ===========================TEST!!!!
				}
			});
			this.vMove.addS(0.1 ,this.ctr.a);		
			// ===========================TEST!!!!
			
			this.avoVect.addS(0.1 ,this.ctr.a);
			
			// ===========================TEST!!!!
		
		
		// ====================================== STEERING

			this.dA = a.util.addAng(this.vMove.a ,-this.v.a );
			this.dAng = (this.dA>0.03 ? 1 : (this.dA<-0.03 ? -1 : (this.dA))) ;
						
			this.v.a += this.dAng * a.app.dT ;  
			
			if (this.dA > a.c.PI_2 || this.dA < -a.c.PI_2) {
				this.v.v-= 60*a.app.dT*10;
				if (this.v.v < 1) this.v.v = 1;
			}
			else {
				this.v.v+= 60*a.app.dT*10;
				if (this.v.v > this.sp * (1 + this.cacheUp * 0.5) ) this.v.v = this.sp * (1 + this.cacheUp * 0.5);
			}
												
			// ARRIVE
			this.dist.set(this.p.v,this.p.a);
			this.dist.sub(this.vTarget);
			
			if ( this.dist.v < 5 && !this.fight) {

				this.clearTarget();
				if (this.sw) {
					a.app.swarms[this.sw].targetType = 0;
				}
			}
			else {
				if (this.sw && a.app.swarms[this.sw].targetType === 0 && this.ctr.v < a.app.swarms[this.sw].avgD*1.25 ) {
					this.clearTarget();
				}
			}
		
		
		
			// CACHE UP
			if (this.sw) {
				this.cacheUp = 0;
				this.cA = a.util.addAng(this.ctr.a,-this.v.a);	
				if (this.cA < a.c.PI_4 && this.cA > -a.c.PI_4 && this.ctr.v > a.app.swarms[this.sw].avgD * 1.25) {
					// this.v.v = this.sp * 1.5;
					this.cacheUp = 1;
				}

			}
			
		}
		else {	
			// FOOD target
			if (this.group == 1) {
				var x = Math.random() * a.canvas.elemBg.width ;
				var y = Math.random() * a.canvas.elemBg.height ;
				this.setTarget(undefined,undefined,x,y);
			}
		}
		
		// ================================  FIGHT
		if ( this.fight || this.eat ) {
			this.v.v = 0;
		}
		if (this.side) {
		
			if ( this.collIds.indexOf(this.targetId) !=-1 && a.app.obj[ this.targetId ].side && a.app.obj[ this.targetId ].side != this.side && a.app.obj[ this.targetId ].group != 2) {
				a.app.obj[ this.targetId ].hit(this.hp,this.id);
				this.fight = 50;					
			}
			
			this.fight-= 50*a.app.dT;
			if (this.fight < 0) {
				this.fight = 0;
			}
		
		// ========================= EAT ==============================
		
			if ( this.collIds.indexOf(this.targetId) !=-1 && a.app.obj[ this.targetId ].group == 1) {
				this.bite(this.targetId) ;
				
			}
			
		// ========================= GET TOTEM ==============================
		
			if ( this.collIds.indexOf(this.targetId) !=-1 && a.app.obj[ this.targetId ].group == 2 && a.app.obj[ this.targetId ].side != this.side) {
				this.getTotem(this.targetId) ;
			}
			
		}
		if (this.eat > 0) this.eat-= 50*a.app.dT;
		
		if (this.eat < 0) {
			this.eat = 0;
			if (this.group == 1) {
				this.dead();
			}
		}
	}
	
	this.bite = function(foodId) {
		this.health+= 50*a.app.dT  ;
		this.eat = 50;
		if (this.health > 100) {
			this.health = 100;
			this.clearTarget();
		}
		else {
			a.app.obj[ foodId ].eat = 50 ;
		}
	}
	
	this.getTotem = function(id) {
		this.health+= 50*a.app.dT  ;
		this.eat = 50;
		if (this.health > 100) {
			this.health = 100;
		}
		
		a.app.obj[ id ].health-= 10*a.app.dT  ;
		a.app.obj[ id ].eat = 50 ;
		if (a.app.obj[ id ].health < 1) {
			a.app.obj[ id ].dead();    // OTHER SIDE WON !!!!!
			this.clearTarget();
		}
		
	}
	
	this.hit = function(hp, src) {
		this.health-= hp* (0.5 + Math.random()) / this.prot  ;
		this.fight = 50;	
		if (this.health < 1) {
			this.dead();
			a.app.obj[src].clearTarget();
		}
	}
	
	this.dead = function() {
		this.v.v = 0;	
		this.health = 0;
		this.fight = 0;
		this.eat = 0;
	}
	
	this.setTarget = function(id, order,x,y) {
		var $this = this;
		a.app.obj.forEach(function(e,i) {
			if (($this.sw && $this.sw == e.sw && e.health) || ( !$this.sw && i == a.app.obj.indexOf($this) )) {
		
				if (e.targetId != -1 && (order || id===undefined) ) {
					e.skipped = e.targetId ;
					
					if (id != e.skipped) {
						if (e.skipped != -1 && a.app.obj[e.skipped].targetId==a.app.obj.indexOf(e) ) {
							a.app.obj[e.skipped].clearTarget(); 
							a.app.obj[e.skipped].skipped = a.app.obj.indexOf(e);
						}
					}
					// console.log("skipped",a.app.obj.indexOf(e),e.targetId);
				}
				
				if (id!==undefined && id!=-1) {
					e.targetId = id ;			
				}
				else {
					e.target = {x:x,y:y} ;
					e.vTarget.set(Math.sqrt(e.target.x*e.target.x+e.target.y*e.target.y),Math.atan2(e.target.y,e.target.x)) ;
					e.targetId = -1;
				}
				
				e.targetType = 1;
			}
		});
		a.app.swarms[this.sw].targetType = 1;
	}
	this.clearTarget = function() {
		this.targetId = -1;
		this.collIds.length = 0;
		this.v.v = 0;
		this.skipped = -1;
		this.targetType = 0;
	}	
	this.move = function() {
		this.vdT.v = this.v.v * a.app.dT;
		this.vdT.a = this.v.a;		
		this.p.add(this.vdT) ;
		this.dir = this.v.a ;	
		
		this.x = this.p.v * Math.cos(this.p.a)  ;
		this.y = this.p.v * Math.sin(this.p.a)  ;
	}
	
	this.draw = function() {
		var ctx = a.canvas.ctxFg ;
		ctx.save();
		ctx.translate(this.x , this.y);
		
		if (a.app.drawVectors && this.health) {
				
			ctx.beginPath();
			ctx.moveTo(0,0);
			ctx.lineTo(this.v.v * Math.cos(this.v.a),this.v.v * Math.sin(this.v.a));
			ctx.strokeStyle = "#ff0000" ;
			ctx.lineWidth = 1;		
			ctx.stroke();
				
			ctx.beginPath();
			ctx.moveTo(0,0);
			ctx.lineTo(this.avoVect.v * 10 * Math.cos(this.avoVect.a),this.avoVect.v * 10 * Math.sin(this.avoVect.a));
			ctx.strokeStyle = "#00ee00" ;
			ctx.lineWidth = 1;	
			ctx.stroke();
		}
	
			
		ctx.rotate(this.dir + a.c.PI_2);
	
		if (a.app.drawCircles) {
			ctx.beginPath();
			ctx.arc(0,0,this.d,0,a.c.PIx2,0);
			
			this.coll ? ctx.strokeStyle = "#330000" : ctx.strokeStyle = "#336667" ;
			if (this.health === 0) {
				ctx.strokeStyle = "#000000";
			} 
			ctx.lineWidth = 2;		// bounding circle
			ctx.stroke();
			
			ctx.beginPath();
			ctx.moveTo(0, -30);
			ctx.lineTo(0, -40);
			ctx.strokeStyle = "#555555" ;  //  avoid circle
			ctx.lineWidth = 1;	
			ctx.stroke();
			
			ctx.beginPath();
			ctx.arc(0,0,this.avo,0,a.c.PIx2,0);
			ctx.stroke();
		}
				
		// ======================= ANIM
		
		if ( (this.v.v || (!this.v.v && this.frame !=this.centFr) || this.fight || this.eat) && this.lastFr ) {
				this.animT += a.app.dT  ;
			}
		if (this.animT > 0.15) {
			this.animT -= 0.15;
			this.frame += this.animDir ;
			if ((this.frame == this.lastFr || this.frame === 0) && !this.oneWay) {
				this.animDir *= -1;
			}
			if (this.frame > this.lastFr && this.oneWay) {   // ONEWAY anim kérdéses!!
				this.frame = 0;
			}
			this.bub = ((this.bub+1))&15;
		}	
			
		// ===============================  DRAW SHAPE
				
			if (a.app.drawImages && this.health) {
				//ctx.drawImage(a.canvas.imgBuf,100*this.frame,this.sh*100,64,64, -32, -32,64,64);
				ctx.drawImage(a.canvas.spr[this.sh][this.frame], -32, -32);
				
			}

		// =============================== END DRAW SHAPE
		ctx.restore();
	}
	
	this.drawOvl = function() {	
		var ctx = a.canvas.ctxFg ;
		ctx.save();
		ctx.translate(this.x , this.y);
		
		if (this.selected || this.mouseOver) {
			ctx.beginPath();
			ctx.arc(0,0,this.d,0,a.c.PIx2,false);
			this.mouseOver ? ctx.strokeStyle = 'rgba(0,200,200,0.3)' : ctx.strokeStyle = 'rgba(0,200,0,0.3)' ;
			ctx.lineWidth = 10;		
			ctx.stroke();
		}
		
		if (this.mouseOver || this.fight || this.eat)  {
			ctx.beginPath();
			ctx.moveTo(30,-30);
			ctx.textAlign="left"; 
			ctx.font = '7.5pt Trebuchet MS';
			ctx.fillText(this.title.toUpperCase(), 30, -32);
			if (this.group || this.fight || this.eat) {	
				ctx.beginPath();
				ctx.moveTo(29,-25);
				ctx.lineTo(81,-25);
				ctx.strokeStyle = "#222222" ;
				ctx.lineWidth = 7;		
				ctx.stroke();
				
				ctx.beginPath();
				ctx.moveTo(30,-25);
				ctx.lineTo(30+this.health/2,-25);
				ctx.strokeStyle = "#cc2222" ;
				ctx.lineWidth = 3;		
				ctx.stroke();
			}
		}
		ctx.restore();
	}
	
}

// ---------------------------------- MAIN APP
a.app =  {
	drawImages: 1,
	drawVectors: 0,
	drawCircles: 0,
	dT:0,
	i: 0,
	n: 0,
	paused: 1,   
	firstRun: 20,
	obj: [],
	// ================  SWARM center of gravity
	swarms: [],
	selectedObjId: -1,
	mouseOverId: -1,
	myGrp: 3,
	AIgrp: 5,
	totem1id: 7,
	totem2id: 8,
	bub: 0,
	openX:0,
	doorSp:0,

	start: function() {
		// console.log("start");	
		if (!a.feat.init()) {
			document.querySelectorAll("#ovl div")[5].style.display  = "block";
			return false;
		}
		
		a.canvas.init();
		
		this.units();
				
		a.canvas.bg();
		a.canvas.gen();	
		
		document.querySelector("#c-bg").className = "lay";
		document.querySelector("#c-fg").className = "lay";
		
		this.animloop() ;		
	},
	units: function() {
		//init[pv,pa,sp,d,avo,title,hp,health,protection,group,side,swarm,shape,lastFr,centerFr,oneWay,dir,AI role]
		//groups: 0-other, 1-food, 2-totem, 3-my, 4-partner, 5-enemy
		//sides: 1-2
		// AI roles: 1 - attack, 2 - defend 

		this.obj.push(new a.par([270,1.3, 30,28,50,"shark"	 	,10,100, 20, 3, 1, 0, 1, 4, 2,0,-0.1,0,0]));
		this.obj.push(new a.par([425,1.4, 15,25,50,"turtle"	, 3,100, 30, 3, 1, 0, 0, 4, 2,0, 0.0,0,0]));
		this.obj.push(new a.par([370,1.1, 30,30,50,"stingray"	, 6,100, 20, 3, 1, 0, 2, 3, 3,0, 0.1,0,0]));
				
		this.obj.push(new a.par([1300,0.1, 20,30,50,"Enemy"	 , 9,100, 20, 5, 2, 0, 3, 3, 3, 0,0,1]));
		this.obj.push(new a.par([1340,0.1, 20,30,50,"Enemy"	 , 9,100, 20, 5, 2, 0, 3, 3, 3, 0,0,1]));
		
		this.obj.push(new a.par([1330,0.4, 20,30,50,"enemy guard"	 , 9,100, 20, 5, 2, 0, 3, 3, 3, 0,1,2]));
		this.obj.push(new a.par([1330,0.3, 20,30,50,"enemy guard"	 , 8,100, 20, 5, 2, 0, 3, 3, 3, 0,1,2]));
		
		this.obj.push(new a.par([ 350,1.4,  0,20,35,"totem-1" , 0,100,  1, 2, 1, 0, 7, 0, 0, 0,1,0]));
		this.obj.push(new a.par([1300,0.4,  0,20,35,"totem-2" , 0,100,  1, 2, 2, 0, 8, 0, 0, 0,1,0]));
		for (var i=0; i<5;i++) {
			this.obj.push(new a.par([530,0.7, 8,15,20,"squid", 0,100,  1, 1, 0, 4, 6, 4, 2, 0,0,0]));// sw 4
		}
		
		for (var i=0; i<5;i++) {
			this.obj.push(new a.par([930,0.6, 8,15,20,"squid", 0,100,  1, 1, 0, 5, 6, 4, 2, 0,0,0])); // sw 5
		}
		
		for (var i=0; i<5;i++) {
			this.obj.push(new a.par([670+i*10,0.6, 32,14,20,"orange fish"	, 2,100, 10, 3, 1, 1, 5, 4, 2,0,-0.3,0,0])); // sw 1
		}	
		
		for (var i=0; i<3;i++) {
			this.obj.push(new a.par([710+i*10,0.7, 32,14,20,"orange fish"	, 2,100, 10, 3, 1, 2, 5, 4, 2,0,-0.4,0,0])); // sw 2
		}
		
		for (var i=0; i<10;i++) {
			this.obj.push(new a.par([860+i*10,0.7, 32,14,20,"blue fish"	, 1,100, 10, 3, 1, 3, 4, 4, 2,0,-0.4,0,0])); // sw 3
		}
	},
	animloop: function(arg) {
		a.anim.calcDT() ;
		a.app.dT = a.anim.dT / 1000;
		if (a.app.firstRun) {
			a.app.firstRun--;
			if (!a.app.firstRun) {
				document.getElementById("ovl").className = "hide";
			}
		}	
		else {
			//a.app.T1 = new Date();
			a.canvas.clr();
			
			if (!a.app.paused) {  
				a.app.moveObj();
				a.app.collosionDetect();
					
				// ================  SWARM center of gravity
				a.app.calcSw();
					
				a.app.AI();
			}
			a.app.processMouse();
			//a.app.dT1 = new Date() - a.app.T1 ;
			a.app.drawObj();	
			a.app.drawOvl();	
			//a.app.dT2 = new Date() - a.app.T1 ;
			
			if (a.app.openX < 650) {
				a.app.door();
			}
		}				
		
		window.requestAnimFrame(a.app.animloop) ; 
	},
	door: function() {
		var ctx = a.canvas.ctxFg ;
		ctx.beginPath();
		ctx.fillStyle = "#808080";
		// ctx.fillStyle=a.canvas.pSteel ;
		ctx.strokeStyle = "#c0c0c0";
		ctx.lineWidth = 2;
		ctx.fillRect(0,0,650-this.openX,700);
		ctx.fillRect(650+this.openX,0,650,700);
		ctx.fillStyle = "#404040";
		ctx.fillRect(400-this.openX,300,250,100);
		ctx.fillRect(650+this.openX,300,250,100);
		ctx.moveTo(650-this.openX,300);
		ctx.lineTo(400-this.openX,300);
		ctx.lineTo(400-this.openX,400);
		ctx.lineTo(650-this.openX,400);
		
		ctx.moveTo(650+this.openX,300);
		ctx.lineTo(900+this.openX,300);
		ctx.lineTo(900+this.openX,400);
		ctx.lineTo(650+this.openX,400);
		ctx.stroke();
		
		ctx.beginPath();
		ctx.strokeStyle = "#707070";
		ctx.lineWidth = 16;
		ctx.moveTo(  8-this.openX,8);
		ctx.lineTo(642-this.openX,8);
		ctx.lineTo(642-this.openX,291);
		ctx.lineTo(391-this.openX,291);
		ctx.lineTo(391-this.openX,409);
		ctx.lineTo(642-this.openX,409);
		ctx.lineTo(642-this.openX,692);
		ctx.lineTo(  8-this.openX,692);
		ctx.closePath();
		ctx.stroke();
		
		this.openX+=this.dT* this.doorSp ;
		if (this.openX > 650) {
			this.paused = 0;
			this.doorSp = 0;
		}

		if (this.openX <0) {
			this.paused = 1;
			this.doorSp = 0;
		}
	},
	openD: function() {
		this.openX = 1;
		this.doorSp = 100;
	},
	closeD: function() {
		this.openX = 649;
		this.doorSp = -100;
	},
	AI: function() {
		var $this = this;
		this.obj.forEach(function(e,i) {

			if (e.group == $this.AIgrp) {
				if (e.AIrole == 1) {
					if (e.targetId == -1) {
						e.targetId = $this.totem1id ;
						e.targetType = 1;						
					}					
				}
				
				if (e.AIrole == 2) {
					if (e.targetType == 0) {
						
						e.vTarget.set($this.obj[$this.totem2id].p.v,$this.obj[$this.totem2id].p.a)   ;
						e.vTarget.addS(100,e.guardAng);
						
						e.guardAng = a.util.addAng(e.guardAng,1);	
						e.targetType = 1;
					}					
				}
			}
		});
	},
	moveObj: function() {
		this.obj.forEach(function(e,i) {
			if (e.health) {
				e.operate();
				e.move();
			}
		});
	},
	// ================  SWARM center of gravity
	calcSw: function() {
		var $this = this ;
		
		this.swarms.forEach(function(e,i){
			e.x = 0;
			e.y = 0;
			e.nr = 0;
			e.avgD = 0;
			e.cnt = 0;
		});

		this.obj.forEach(function(e,i){
			if (e.health !== 0 && e.sw) {
				$this.swarms[e.sw].x += e.x ;
				$this.swarms[e.sw].y += e.y ;
				$this.swarms[e.sw].nr ++;
			}
		});
		
		this.swarms.forEach(function(e,i){
			e.x /= e.nr ;
			e.y /= e.nr ;
			e.v = Math.sqrt(e.x*e.x + e.y*e.y) ;
			e.a = Math.atan2(e.y,e.x) ;
		});
		
		this.obj.forEach(function(e,i){
			if (e.health !== 0 && e.sw) {
				e.ctr.set($this.swarms[e.sw].v, $this.swarms[e.sw].a);
				e.ctr.sub(e.p);
				if (e.ctr.v > e.d*1.5) {
					$this.swarms[e.sw].avgD +=  e.ctr.v;
					$this.swarms[e.sw].cnt++;
				}
			}
		});
		
		this.swarms.forEach(function(e,i){
			e.avgD /= e.cnt ;
		});
	},
	drawObj: function() {
		this.obj.forEach(function(e,i){
			e.draw();
		});
	},
	drawOvl: function()	{
		var ctx = a.canvas.ctxFg ;
		
		this.obj.forEach(function(e,i){
			e.drawOvl();
		});
	
		// ================  SWARM center of gravity
		if (this.drawCircles) {
			this.swarms.forEach(function(e,i){
				ctx.beginPath();
				ctx.strokeStyle = "#661600" ;
				ctx.strokeRect(e.x,e.y,5,5);	
			});
		}
		
		// ================  BUBBLES
		this.obj.forEach(function(e,i){
			if ( (e.fight || e.eat)&& e.health && e.dA<0.2 && e.dA>-0.2 && e.targetId != -1) {
				ctx.drawImage(a.canvas.imgBuf,100*(e.bub),9*100,64,64, e.x-32+e.d*Math.cos(e.dir), e.y-32+e.d*Math.sin(e.dir),64,64);
				ctx.drawImage(a.canvas.spr[9][e.bub], e.x-32+e.d*Math.cos(e.dir), e.y-32+e.d*Math.sin(e.dir));
			}
		});
				
		// ========================  FPS
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.fillStyle = "rgba(100,100,100,0.5)";
			ctx.strokeStyle = "00e0e0" ;
			ctx.shadowColor = "00e0e0" ;
			//ctx.shadowBlur = 25;
			ctx.fillRect(20,15,150,70);
			ctx.strokeRect(20,15,150,70);
			
			//ctx.shadowBlur = 0;
			ctx.fillStyle = "#c0c0c0";
			ctx.textAlign="left"; 
			ctx.font = '8pt Lucida Console';
			ctx.fillText("FPS: " + a.anim.fpsAvg, 115, 25);
			
		// ========================== UNIT DATA
		if (this.mouseOverId != -1) {
			ctx.font = '10pt Trebuchet MS';
			ctx.fillText( this.obj[this.mouseOverId].title.toUpperCase() + "( " + this.obj.indexOf(this.obj[this.mouseOverId]) + " )", 30, 35);
			ctx.fillText("HP: " + this.obj[this.mouseOverId].hp, 30, 50);
			
			ctx.fillText("Protection: " + this.obj[this.mouseOverId].prot, 30, 65);
			ctx.fillText("Speed: " + this.obj[this.mouseOverId].sp, 30, 80);
			// ctx.fillText("act. speed: " + this.obj[this.mouseOverId].v.v.toFixed(1), 30, 110);
		}
		
	},
	collosionDetect: function() {
		var $this = this ;
		
		this.obj.forEach(function(e,i){
			e.coll = false;
			e.collIds.length = 0;
			e.avoidIds.length = 0;
			e.wallDir.length = 0;
			e.wallDist.length = 0;
		});
		
		this.obj.forEach(function(e,i){
			if (e.health !==0) {			
				$this.obj.forEach(function(o,i2){
					if (o.health !==0 && i2>i) {
						$this.dx = e.x - o.x ;
						$this.dy = e.y - o.y
						$this.dist = $this.dx * $this.dx + $this.dy * $this.dy ;
						var result = false;
						if ($this.dist < (e.d + o.d) * (e.d + o.d) ) {
							result = true;
							e.collIds.push(i2);
							o.collIds.push(i);
						}
						e.coll =  e.coll || result ;
						o.coll =  o.coll || result ;
						
						if ($this.dist < (e.d + o.avo) * (e.d + o.avo) ) {
							e.avoidIds.push(i2);
							o.avoidIds.push(i);
						}
					}
				});
				$this.dist = - e.x;
				if ($this.dist > 0) {
					e.wallDir.push(0);
					e.wallDist.push($this.dist);
				}
				$this.dist = e.x - a.canvas.w ;
				if ($this.dist > 0) {
					e.wallDir.push(Math.PI);
					e.wallDist.push($this.dist);
				}
				$this.dist = - e.y ;
				if ($this.dist > 0) {
					e.wallDir.push(a.c.PI_2);
					e.wallDist.push($this.dist);
				}
				$this.dist = e.y - a.canvas.h  ;
				if ($this.dist > 0) {
					e.wallDir.push(-a.c.PI_2);
					e.wallDist.push($this.dist);
				}
			}
		});
	},
	processMouse: function() {
		var $this = this ;
		if (!this.paused) {
			this.hoverObjId = -1;
			this.hoverObjDist = Infinity ;

			this.obj.forEach(function(e,i) {
				$this.dx = a.canvas.mouse.x - e.x ;
				$this.dy = a.canvas.mouse.y - e.y
				$this.dist = $this.dx * $this.dx + $this.dy * $this.dy ;
				if ($this.dist < e.d * e.d && e.health !==0) {
					if ($this.dist < $this.hoverObjDist) {
						$this.hoverObjDist = $this.dist;
						$this.hoverObjId = i;
					}
				}			
			});

			if (a.canvas.mouseClick) {
				if (this.hoverObjId != -1) {   // click on item
					if (this.obj[this.hoverObjId].group == this.myGrp) {  // my UNIT
						if (this.hoverObjId != this.selectedObjId) {  // SELECT
							this.selectObj(this.hoverObjId);
						}
						else { // DESELECT
							this.obj[this.selectedObjId].selected = false ;
							this.selectObj(-1);
						}
					}
					if (this.hoverObjId != this.selectedObjId 
						&& this.selectedObjId!=-1 
						&& (this.obj[this.hoverObjId].side && this.obj[this.hoverObjId].side != this.obj[this.selectedObjId].side || this.obj[this.hoverObjId].group == 1)) {  // enemy / totem or food	
						
						this.obj[this.selectedObjId].setTarget(this.hoverObjId,1);		
						this.selectObj(-1);
					}
				}
				else { // click on target coord or deselect
					if (this.selectedObjId != -1) {
						this.obj[this.selectedObjId].setTarget(undefined,undefined,a.canvas.mouse.x,a.canvas.mouse.y);
						this.selectObj(-1);
					}
				}
			}
					
			this.mouseOvrObj(this.hoverObjId);
		}
		else {
			// START GAME
			if (a.canvas.mouseClick) {
				this.openD();
			}
		}
		a.canvas.mouseClick = false;
	},
	selectObj: function(id) {
		if (this.obj[this.selectedObjId]) {
			this.obj[this.selectedObjId].selected = false;
		}
		this.selectedObjId = id;
		if (this.obj[id]) {
			this.obj[id].selected = true;
		}
	},
	mouseOvrObj: function(id) {
		if (this.mouseOverId != id) {
			if (this.obj[this.mouseOverId]) {
				this.obj[this.mouseOverId].mouseOver = false;
			}
			this.mouseOverId = id;
			if (this.obj[id]) {
				this.obj[id].mouseOver = true;
			}
		}
	}
}

window.onload = function() { a.app.start() } ;
	
	
