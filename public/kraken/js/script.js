//  java -jar compiler.jar  --js script.js --externs jquery-1.9.0.min.js --externs handlebars-1.0.rc.1.min.js --compilation_level SIMPLE_OPTIMIZATIONS --warning_level QUIET > script-min.js 


av = {} ;

av.util = { 
    fixConsole: function(alertFallback) {    
        if (typeof console === "undefined") {
            console = {}; 
        }
        if (typeof console.log === "undefined") {
            if (alertFallback) { console.log = function(msg) { alert(msg); }; } 
            else { console.log = function() {}; }
        }
        if (typeof console.dir === "undefined") {
            if (alertFallback) { 
                console.dir = function(obj) { alert("DIR: "+obj); }; 
            }
            else { console.dir = function() {}; }
        }
    }
}

av.features = {
	ver: "1.17",
	touch: false,
	useragent: "undetected",
	mobile: "",
	msPointer: false,
	appCache: false,
	localStorage: false,
	css3anim: false,
	css3transform: false,
	css3transition: false,
	css3transform3d: false,
	transformStyle: false,
	backfaceVisibility: false ,
	mode3d: false, 
	audio: false,
	width: window.innerWidth ,
	height: window.innerHeight ,
	
	detect: function() {
		if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
			this.touch = true;
		}
		this.useragent = window.navigator.userAgent ;
		this.mobile = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.userAgent.match(/IEMobile/i) ;
		this.mobile ? this.mobile : false ;
		this.msPointer = window.navigator.msPointerEnabled ;
		
		this.appCache = !!window.applicationCache;
		
		this.localStorage = !!window.localStorage;
		
		this.css3anim = this.detectCss("animation") ;
		this.css3transform = this.detectCss("transform") ;
		this.css3transform3d = this.detectCss("perspective") ;
		this.css3transition = this.detectCss("transition") ;
		this.transformStyle = this.detectCss("transformStyle") ;
		this.backfaceVisibility = this.detectCss("backfaceVisibility") ;
		this.mode3d = this.backfaceVisibility && this.transformStyle && this.css3transform3d && !av.features.useragent.match(/android 2/ig) && !av.features.useragent.match(/msie 10/ig) ;
		var elem = document.createElement('audio') ;
		this.audio = !!elem.canPlayType ;
		
	},
	detectCss: function(prop) {
		var div = document.createElement('div') ; 
		var vendors = 'khtml ms O Moz Webkit'.split(' ');  
		var len = vendors.length ;
		if ( prop in div.style ) return true;
		prop = prop.charAt(0).toUpperCase() + prop.slice(1) ;
		while(len--) {  
			if ( vendors[len] + prop in div.style ) {  
				return vendors[len];  
			}  
		}  
		return false;  
	}
}

av.touch = {
	state: "none" ,
	touchX: -1 ,
	touchY: -1,
	currX: -1,
	currY: -1,
	len: -1 ,
	dX:0,
	dY:0,
	eventTriggered:false,
	touched: false,
	evStart:0,
	evMove:0,
	evEnd:0
}

av.cards = [ ] ; 

av.cardNames = ["Bull","Butterfly","Crab","Crocodile","Deer","Fish","Frog","Moose","Rabbit","Rooster","Shark","Snake","Ant","Bat","Bear","Bee","Bird","Bulldog","Cat","Chicken","Cow","Dog","Dondey","Duck"] ;

av.swapCards = function(cardA,cardB) {
	//console.log(cardA,cardB);
	var elemA = $(".card-container,.simple-card").filter("[idx="+cardA+"]:not('.hide')") ;
	var elemB = $(".card-container,.simple-card").filter("[idx="+cardB+"]:not('.hide')") ;
	
	if (elemA.hasClass("animate") || elemB.hasClass("animate")) {
		return false ;
	}
	
	if (av.features.mode3d) {
		elemA.hasClass("flipped") ? reverseA = -1 : reverseA = 1 ;
		elemB.hasClass("flipped") ? reverseB = -1 : reverseB = 1 ;
	}
	else {
		reverseA = 1 ;
		reverseB = 1 ;
	}
	

	elemB.before(elemA.clone().addClass("hide")) ;
	elemA.before(elemB.clone().addClass("hide")) ;
	elemA.addClass("selected") ;
	elemB.addClass("selected") ;
	
	if (!!av.features.css3transition && !!av.features.css3transform) {
		
		elemA.css("z-index",11) ;
		elemB.css("z-index",11) ;
		var diffX = elemA.offset().left - elemB.offset().left ;
		var diffY = elemB.offset().top - elemA.offset().top ;
		
		//console.log( diffX ) ;
		//console.log( diffY ) ;
		
		elemA.css("transform") == "none" ? cssA = "" : cssA = elemA.css("transform") ;
		elemB.css("transform") == "none" ? cssB = "" : cssB = elemB.css("transform") ;
		
		elemA.css("transform", cssA + " translate("+(reverseA*-diffX)+"px,"+( diffY)+"px)" ) ; 
		elemB.css("transform", cssB + " translate("+(reverseB* diffX)+"px,"+(-diffY)+"px)" ) ; 
		
		//console.log(cssA + " translate("+(reverseA*-diffX)+"px,"+( diffY)+"px)" );
		
		elemA.one('webkitTransitionEnd otransitionend oTransitionEnd MSTransitionEnd msTransitionEnd transitionend', function(e) { 
			elemA.remove();
			elemB.remove();
			$(".card-container.hide,.simple-card.hide").removeClass("hide") ;
			//console.log("swap transitionend");
		});
	}
	
	setTimeout(function() {
		if (elemA.size()) { 
			elemA.remove();
		}
		if (elemB.size()) {
			elemB.remove();
		}
		$(".card-container.hide,.simple-card.hide").removeClass("hide") ;
		//console.log("swap timeout");
	}, 600 ) ; 
	
}

av.randomSwap = function() {
	var cardA = Math.round(Math.random()*23) ;
	do {
		cardB = Math.round(Math.random()*23) ;
	} while (cardA == cardB) ;
	av.swapCards(cardA,cardB) ;
}

av.rndCards = function() {
	for (i=1;i<=60;i++) {
		rnd = Math.round(Math.random()*23) ;		
		do {
			rnd2 = Math.round(Math.random()*23) ;
		} while (rnd == rnd2 ) ;
		
		var a = $.extend ( true, {} , av.cards[rnd]) ;
		var b = $.extend ( true, {} , av.cards[rnd2]) ;
		
		av.cards[rnd] = b ;
		av.cards[rnd2] = a ;
	} 
}

av.score = {
	isGameEnd: false,
	moves : 0 ,
	score : 0 ,
	gameTime: 0,
	highScore: 0,
	newHighScore: false,
	calculate: function () {
		this.gameTime = av.gameTimer.counter ;
		this.moves?this.moves:1 ;
		this.score = Math.floor(100000000/this.moves/this.gameTime) ;
		if (this.score > this.highScore) {
			this.highScore = this.score ;
			this.newHighScore = true ;
			this.save();
		}
		else {
			this.newHighScore = false ;
		}
	},
	render: function() {
		$(".score-table").html(av.tmpl.scoreTemplate(this));
	},
	reset: function() {
		this.moves = 0;
	},
	save: function() {
		if (av.features.localStorage) {
			window.localStorage.setItem("kraken",this.highScore.toString()) ;
			//console.log("saving high score");
		}	
	}
}

av.gameTimer = {
	timer: null,
	counter: 0,
	hold: true,
	swapTimer: 0,
	count: function() {
		if (!this.hold) {
			this.counter++;
			this.swapTimer++;
		}
		
		var min = Math.floor(this.counter/240) ;
		$(".timer span").text( min + " m " + Math.floor((this.counter-min*240)/4) + " s " ) ;
		$(".moves span").text(av.score.moves) ;
		if (this.swapTimer > 20) {
			this.swapTimer = 0;
			av.randomSwap() ;
		}
	},
	reset: function() {
		this.counter = 0;
	}
}

av.sounds = {
	slide : null
}

av.endGame = function() {
	if (av.score.isGameEnd) {	
		av.score.calculate() ;
	}
	av.gameTimer.hold = true ;
	
	$(".card-container,.simple-card").addClass("delayed-opacity animated-opacity").css("opacity",0)	;
	
	setTimeout(function() {
		$(".cards").hide(); 
		av.score.render() ;
		$(".score-wrapper").addClass("show-score") ;
	}, 1300);
	
}

av.tmpl = {} ;

$(window).load(function() {
		
	av.util.fixConsole(false);
	console.log("ready");
	
	if (!!window.applicationCache) {
		window.applicationCache.addEventListener('updateready', function(e) {
			if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
			  // Browser downloaded a new app cache.
			  // Swap it in and reload the page to get the new hotness.
			  window.applicationCache.swapCache();
			  alert('A new version of this site is available.') ;
				window.location.reload();
			 
			}
		}, false);
	}
	
	av.features.detect();
		
	if ( !((av.features.css3transition && av.features.css3transform) || (av.features.mobile && av.features.css3transform) )) {
		console.log("browser not supported");
		$("#loading-text").hide();
		$("#browser-not-supported").show();
		return false ;
	}
	
	if (!av.features.mode3d) {
		$(".simple-browser").show();
	}
	
	if (av.features.appCache) {
		$(".feature-offline").show();
	}
	
	window.scrollTo(0,1) ;
	
	if (av.features.audio && !av.features.mobile) {  
		av.sounds.slide = new Audio() ;
		av.sounds.slide.src = "audio/slide.mp3" ;
		//av.sounds.slide.currentSrc = "audio/slide.mp3" ;
		if (av.features.css3transform == "O" || av.features.css3transform == "Moz" ) {
			av.sounds.slide.src = "audio/slide.ogg" ;
			//av.sounds.slide.currentSrc = "audio/slide.ogg" ;
		}
		av.sounds.slide.play();
	}
	
	if (av.features.localStorage) {
		var value = parseInt(window.localStorage.getItem("kraken")) ;
		if (value) {
			av.score.highScore = value ;
			console.log("high score loaded") ;
		}
		else {
			window.localStorage.setItem("kraken","0") ;
			console.log("setting up localstore");
		}
		
	}
	
	$("#container").show();
	$(".cards").hide();
		
	av.tmpl.scoreTemplate = Handlebars.compile($("#temp-score").html());
	
	av.tmpl.featuresTemplate = Handlebars.compile($("#temp-featurecheck").html());
    $(".side-panel").html(av.tmpl.featuresTemplate(av.features));
	
	set = [] ;
	for (i=1; i<=24; i++) {
		set[i] = true ;
	}
	
	for (i=1; i<=12; i++) {		
		do {
			rnd = Math.round(Math.random()*24) ;
			
		} while ( !set[rnd] ) ;
		set[rnd] = false ;
			//console.log(rnd) ;	
		av.cards[i-1] = 	{id:i-1, zodiac:rnd} ;
		av.cards[12+i-1] = 	{id:12+i-1, zodiac:rnd} ;		
	}
		
	if (av.features.mode3d) {
		av.tmpl.cardsTemplate = Handlebars.compile($("#temp-card").html());
	}
	else {
		av.tmpl.cardsTemplate = Handlebars.compile($("#temp-card-simple").html());
	}
    
    setTimeout(function() {
		//$(".front-panel").addClass("closed-front-panel") ;
		$(".left-side").removeClass("open-left"); 
		$(".right-side").removeClass("open-right") ; 
	}, 0 );
	
	setTimeout(function() {
		$(".start-wrapper").css("opacity",0);
		$("#loader-wrapper").hide();
		$("#main").show();
		av.score.render();
		$(".start-wrapper").show();
		setTimeout(function() {
			$(".start-wrapper").css("opacity",1);
		},0);
	}, 800 );
    
    
    av.gameTimer.timer = window.setInterval ( function() { 
			av.gameTimer.count() 
		}, 250 ) ;
		
	if (av.features.touch) {
	
		var o = document.getElementById('container');
		
		o.addEventListener("touchstart", function(event){
			av.touch.target = event.targetTouches[0].target ;
			
			/*
			if(av.touch.target.id == "test-block-7-button") {
				event.preventDefault();
				$("#tool-bar img").addClass("show-toolbar") ;
				$("#tool-bar").offset({left:av.touch.touchX-180,top:av.touch.touchY-100}) ;
			}
			* */
			av.touch.touchX = event.targetTouches[0].pageX ; 
			av.touch.touchY = event.targetTouches[0].pageY ;
			av.touch.state = "start" ;
			av.touch.evStart ++;
			av.touch.currX = null;
			av.touch.currY = null;
			av.touch.len = event.targetTouches.length ;
			av.touch.eventTriggered = false ;
			
		},false);
		
		o.addEventListener("touchmove", function(event){
			av.touch.evMove ++;
			av.touch.state = "move" ;
			
			av.touch.currX = event.targetTouches[0].pageX ;
			av.touch.currY = event.targetTouches[0].pageY ;
			av.touch.len = event.targetTouches.length ;
			av.touch.target = event.targetTouches[0].target ;
			
			dX = av.touch.currX - av.touch.touchX  ; 
			dY = av.touch.currY - av.touch.touchY  ; 
			
			av.touch.dX = dX;
			av.touch.dY = dY;
			
			if ( (dX<0?-dX:dX) > 30 && (dY<0?-dY:dY) < 10) {
				if (dX<0) {
					if (!av.touch.eventTriggered) {
						$(av.touch.target).trigger("swipeleft") ;
					}
					av.touch.eventTriggered = true ;
				}
				else {
					if (!av.touch.eventTriggered) {
						$(av.touch.target).trigger("swiperight") ;
					}
					av.touch.eventTriggered = true ;
				}
			}
			
		},false);
		
		o.addEventListener("touchend", function(event){
			av.touch.evEnd ++;
			av.touch.state = "end" ;
			//av.touch.touched = false;
			$(av.touch.target).trigger("tapEvent") ;
			
		},false);
		
		o.addEventListener("MSPointerUp", function(event){
			$(event.target).trigger("tapEvent") ;
			//$(event.target).addClass("touched") ;
		},false);
	
		var myTapEvent = "tapEvent" ;
	}
	else {
		var myTapEvent = "click" ;
	}
	
	
	$(".cards").on(myTapEvent,".card-container,.simple-card", function(e) { 
		if ($(this).hasClass("solved") || $(this).hasClass("selected")) {
			return false ;
		}
		$(this).toggleClass("flipped").addClass("animate");
		
		if (!$(this).hasClass("flipped")) {
			av.score.moves++ ;
		}
		
		var thisElem = $(this) ;
		setTimeout(function() { 
			thisElem.removeClass("animate") ;
			//console.log("animate timeout")
		}, 600 );
		
		var facedCardsNum = $(".card-container,.simple-card").not(".flipped,.solved").size() ;
		
		if (facedCardsNum == 2) {
			var result = [] ;
			$(".card-container,.simple-card").not(".flipped,.solved").each(function(i,e){
				result[i] = $(e).attr("zod") ;
			}) ;

			if (result[0] == result[1]) {
				$(".card-container,.simple-card").filter("[zod='"+result[0]+"']").addClass("solved") ;
				$("#card-name").text(av.cardNames[result[0]-1]) ;
				$("#card-name").removeClass("card-name-opacity-animation") ;
				$(".card-name-wrapper").css("top",thisElem.offset().top-20+"px");
				setTimeout(function() { 
					$("#card-name").addClass("card-name-opacity-animation") ;
				},0);
			}
		}
		
		if (facedCardsNum > 2) {
			$(".card-container,.simple-card").not(".solved,.animate").addClass("flipped") ;
		}
		
		if ($(".card-container,.simple-card").not(".solved").size() == 0) {
			setTimeout(function() { 
				av.score.isGameEnd = true;
				av.endGame();
			}, 2000 );
		}
		
	});
	
	$(".button-info").on(myTapEvent, function(e) { 
		$(".side-panel").removeClass("hidden-panel-left").toggleClass("hidden-panel") ;
		if ( $(".side-panel").hasClass("hidden-panel") ) {
			av.gameTimer.hold = false ;
		}
		else {
			av.gameTimer.hold = true ;
		}
	});
	
	$(".side-panel").on(myTapEvent, function(e) { 
		$(".side-panel").addClass("hidden-panel") ;
		av.gameTimer.hold = false ;
	});
	
	$(".start-button").on(myTapEvent, function(e) { 
		$(".start-wrapper").css("opacity",0);
		
		av.score.reset();	
		
		av.rndCards() ;
		$(".cards").html(av.tmpl.cardsTemplate(av.cards));
		$(".card-container,.simple-card").css("opacity",0) ;
		$(".cards").show();	
		
		setTimeout(function() {		
			$(".left-side").addClass("open-left"); 
			$(".right-side").addClass("open-right") ;

			if (av.features.audio && !av.features.mobile) {
				setTimeout(function() { 
					av.sounds.slide.play(); 
					console.log("start sound");
				},0);
			}
			
			av.gameTimer.hold = true ;
			av.gameTimer.reset();
		}, 350);
		setTimeout(function() { 
			$(".front-wrapper").hide();
			$(".start-wrapper").hide();
			$(".card-container,.simple-card").addClass("delayed-opacity animated-opacity").css("opacity",1)	;
			window.scrollTo(0,1) ;
		}, 1100 ) ; 
		
		setTimeout(function() { 
			$(".card-container,.simple-card").removeClass("delayed-opacity animated-opacity").addClass("flipped") ;
			av.gameTimer.hold = false ;
			
			$("#card-name").text("Find the pairs!") ;
			$("#card-name").removeClass("card-name-opacity-animation") ;
			$(".card-name-wrapper").css("top","50px");
			setTimeout(function() { 
				$("#card-name").addClass("card-name-opacity-animation") ;
			},0);
			
			
		}, 2800 ) ; 
		
		
	});
	
	$(".card-container,.simple-card").on('webkitTransitionEnd otransitionend oTransitionEnd MSTransitionEnd msTransitionEnd transitionend', function(e) { 
		$(e.target).removeClass("animate"); 
		//console.log("animate end");
	});
	
	$(".button-restart").on(myTapEvent, function(e) { 
		av.score.isGameEnd = false;
		av.endGame();
	});
	
	$(".score-wrapper").on(myTapEvent, function(e) { 
		$(".score-wrapper").removeClass("show-score") ;
		setTimeout(function() {
			$(".front-wrapper").show();
			setTimeout(function() {
				$(".left-side").removeClass("open-left"); 
				$(".right-side").removeClass("open-right") ; 
			}, 0);
			//$(".card-container,.simple-card").removeClass("solved") ;
			if (av.features.audio && !av.features.mobile) {
				av.sounds.slide.play();
			}
			window.scrollTo(0,1) ;
		}, 500 );
		setTimeout(function() {
			$(".start-wrapper").show();
			setTimeout(function() {
				$(".start-wrapper").css("opacity",1) ;
			},0);
		}, 1200 );
	});
	
});
