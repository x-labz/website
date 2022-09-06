var ajaxobj = null;
var dataSet = null;
var myWidth;
var myHeight;
var touch ;
var touchStartPosX =0 ;
var touchStartPosY =0 ;
var cnt = 0;
var leftAtTouch = 0;
var topAtTouch = 0;
var touched = false;
var scrollInProgress = false;
var dropped = 0;
var activeView = 0;
var dX = 0;
var dY = 0;
var cntStartEv = 0 ;
var cntMoveEv = 0;
var cntEndEv = 0;
var dViewHeight = [] ;
var topPos = 0;
var refreshInProgress = false;
var setRefreshLabel = 0;
var horizScroll = 0;
var BackgroundAtTouch = 0;
var backgroundView = [] ;
var objHorizWrapper ;
var objBackgroundImg;


function displayData() {
	for ( var x = 0; x < dataSet.length; x++) {
		$(".itemTemplate").clone().appendTo("#itemList");
		$("#itemList>.dataItem:last").removeClass("itemTemplate");
		$("#itemList>.dataItem:last>.itemName").text(dataSet[x].nev);
		$("#itemList>.dataItem:last>.itemDesc").text(dataSet[x].leiras);
		$("#itemList>.dataItem:last>.itemName").data("id",x);
	}
}

function refreshData() {
	ajaxobj = $.ajax( {
		type : "GET",
		url : "data.txt",
		dataType : "json",
		beforeSend : function() {
			$(".alertWeb").show();
			$(".opRefresh").removeClass("activeOp");
			$(".alertError").clearQueue().hide();
		},
		success : function(data) {  
			dataSet=data;
			if (data == null) {
				return;
				}
			localStorage.myData = JSON.stringify(dataSet) ;
			$("#itemList>.dataItem").remove();
			displayData();
			refreshFavs();
			initDisp();
			$(".alertWeb").show().delay(1000).fadeOut(500);
			$(".alertWebDone").show().delay(2000).fadeOut(500);
			$(".opRefresh").addClass("activeOp");
			$("#pullDownRun").show().delay(2000).fadeOut(0);
			refreshInProgress = 0;
			setRefreshLabel = 0;
			},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			$(".alertWeb").fadeOut(500);
			$(".errorCode").text(textStatus);
			$(".alertError").show().delay(5000).fadeOut(500);
			$(".opRefresh").addClass("activeOp");
			$("#pullDownRun").show().delay(2000).fadeOut(0);
			refreshInProgress = 0;
			setRefreshLabel = 0;
		}
		});	
}

function refreshFavs() {
		$("#itemListFav>.dataItem").remove();
		for ( var x = 0; x < dataSet.length; x++) {		
			if (dataSet[x].fav) {
				$(".itemTemplate").clone().appendTo("#itemListFav");
				$("#itemListFav>.dataItem:last").removeClass("itemTemplate");
				$("#itemListFav>.dataItem:last>.itemName").text(dataSet[x].nev);
				$("#itemListFav>.dataItem:last>.itemDesc").text(dataSet[x].leiras);
				$("#itemListFav>.dataItem:last>.itemName").data("id",x);
		}
		if ($("#itemListFav>.dataItem").size()) {
			$(".noItems").hide();
		}
		else {
			$(".noItems").show();
		}
	}
		
}

function refreshDisplay(){
	
	cnt++;
	$("#touch0").text("x: "+touch.pageX+" y: "+touch.pageY) ;
	$("#touch2").text("cnt:"+cnt+" touched:"+touched+" Drop:"+dropped+" Left:"+leftAtTouch+"Top:"+topAtTouch);
	$("#cntEvents").text("S: "+cntStartEv+" M: "+cntMoveEv+" E: "+cntEndEv);
	$("#touch1").text("dx:"+(dX)+" dy:"+(dY));
	$("#dispW").text("w: "+myWidth+" h: "+myHeight+" dH0: "+dViewHeight[0]+" dH1: "+dViewHeight[1]); 
	
}

function initDisp() {
	myWidth = window.innerWidth ;
	myHeight = window.innerHeight ;
	horizScroll = 0.9*myWidth;
	backgroundView[0] = -0.2*myWidth;
	backgroundView[1] = -0.2*myWidth-0.25*myWidth;
	backgroundAtTouch = backgroundView[0] ;
	
	//$("#container").css("background-position",backgroundAtTouch+"px 50%");	
	objBackgroundImg.style.webkitTransform = "translate3d("+(backgroundAtTouch)+"px, 0px, 0px)" ;
		
	$(".screenW").css("width",(myWidth)+"px");
	//$("#itemList").css("margin-top","0px");	
	//$("#itemListFav").css("margin-top","0px");
	objItemList.style.webkitTransform = "translate3d(0px, 0px, 0px)" ;
	objItemListFav.style.webkitTransform = "translate3d(0px, 0px, 0px)" ;
	
	$(".views").css("width",(horizScroll)+"px");
	$(".itemListWrapper").css("height",(myHeight-$("#toolBar").outerHeight()-$(".fixedHeader").outerHeight())+"px");
	$(".itemListWrapper").css("width",(horizScroll)+"px");
	
	//$("#listWrapper").css("left",((activeView)?(-horizScroll):0)+"px");
	
	objHorizWrapper.style.webkitTransform = "translate3d("+((activeView)?(-horizScroll):0)+"px, 0px, 0px)" ;
	
	$(".screenW").css("height",(myHeight-$("#toolBar").outerHeight()-$(".fixedHeader").outerHeight())+"px") ;
	dViewHeight[0] = $(".screenW").height() -50 - $("#itemList").outerHeight() ;
	dViewHeight[1] = $(".screenW").height() -50 - $("#itemListFav").outerHeight() ;
}

function hScrollTimeout() {
	objHorizWrapper.style.webkitTransitionDuration = '0ms' ;
	objBackgroundImg.style.webkitTransitionDuration = '0ms'; 
	scrollInProgress = false; 
}

function vScrollTimeout(refreshMode) {
	objItemList.style.webkitTransitionDuration = '0ms' ;
	objItemListFav.style.webkitTransitionDuration = '0ms'; 
	scrollInProgress = false; 
	if (refreshMode) {
		if (refreshInProgress == 2) {
			$("#pullDownRun").show();
			$("#pullDownPre").hide();
			$("#pullDownStart").hide();
			refreshData();
		}
		if (refreshInProgress == 1) {
			refreshInProgress = 0;
			$("#pullDownPre").hide();
		}
	}
}

$(document).ready(function() {	
	
	objHorizWrapper = document.getElementById("listWrapper") ;
	objBackgroundImg = document.getElementById("backgroundImg") ;
	objItemList = document.getElementById("itemList") ;
	objItemListFav = document.getElementById("itemListFav") ;
	
	/*objHorizWrapper.addEventListener('webkitTransitionEnd', function( event ) { 
         objHorizWrapper.style['-webkit-transition-duration'] = '00ms' ;
         scrollInProgress = false; 
     }, false ); */
     
	
	$(".alertBar>label").hide();
	$("#main").delegate(".itemName","click", function() {
	  $(".activeItem").removeClass("activeItem") ;
	  $(this).addClass("activeItem") ;
	  $(".opDel, .opCancel, .opAddFav").removeClass("activeOp");
	  (activeView)?$(".opDel, .opCancel").addClass("activeOp"):$(".opAddFav, .opCancel").addClass("activeOp");
	});
	$(".opSet").click(function(){
		$("#statusPanel").toggle();
		if ($("#statusPanel:visible").size()) {
			Timer=window.setInterval("refreshDisplay()",100);
		}
		else {
			window.clearInterval(Timer);
		}
	});
	
	$(".opCancel").click(function(){
		$(".opAddFav, .opCancel").removeClass("activeOp");
		$(".activeItem").removeClass("activeItem") ;
	});
	
	$(".opDel").click(function() {
		$(".alertDel").show().delay(2000).fadeOut(500);
		$(".opDel, .opCancel").removeClass("activeOp");
		dataSet[$(".activeItem").data("id")].fav=0 ;
		$(".activeItem").removeClass("activeItem") ;
		refreshFavs();
		initDisp();
		localStorage.myData = JSON.stringify(dataSet) ;
	});
	
	 $(".opAddFav").click(function() {
		 if ($("#itemList>.activeItem").lenght == 0) return ;
		 if (!dataSet[$(".activeItem").data("id")].fav) {
			 dataSet[$(".activeItem").data("id")].fav=1 ;
		 }
		 $(".alertFavAdded").show().delay(2000).fadeOut(500);
		 refreshFavs();
		 $(".activeItem").removeClass("activeItem") ;
		 $(".opAddFav, .opCancel").removeClass("activeOp");
		 initDisp();
		 localStorage.myData = JSON.stringify(dataSet) ;
	 });
	 
	 $(".opRefresh").click(function(){
		if ($(".opRefresh").hasClass("activeOp")) {
			refreshData();
		}
	});
		
	var o = document.getElementById('main');
	o.addEventListener("touchstart", function(event){
		cntStartEv++;
	},false);
	
	o.addEventListener("touchend", function(event){
		touched = false;
		scrollInProgress = true;
		cntEndEv++;
		var dH = dViewHeight[activeView];
		
		if (activeView) {
			if (dX>60) {
				activeView = 0;
				leftAtTouch = 0 ;
				backgroundAtTouch = backgroundView[activeView];
				
				/*$("#container").animate({ backgroundPosition: backgroundAtTouch +"px"},300);
				$("#listWrapper").animate({ left: 0},300,function() {
					scrollInProgress = false;
				}); */
				objHorizWrapper.style.webkitTransitionDuration = '500ms'; 
				objBackgroundImg.style.webkitTransitionDuration = '500ms'; 
				objHorizWrapper.style.webkitTransform = "translate3d("+(0)+"px, 0px, 0px)" ;
				//objBackgroundImg.style.webkitTransform = "translate3d("+(backgroundAtTouch)+"px, 0px, 0px)" ;
				setTimeout("hScrollTimeout()",500);
				
				$("#viewFav").removeClass("activeView");
				objItemList.style.webkitTransform = "translate3d(0px,"+(0)+"px, 0px)" ;
				//$("#itemList").css("margin-top","0px");
				topPos = 0;
				$(".opDel").hide();
				$(".opAddFav").show();
			} 
			else {
				/*
				$("#container").animate({ backgroundPosition: backgroundView[activeView] +"px"},300);
				$("#listWrapper").animate({ left: -horizScroll},300,function() {
					scrollInProgress = false;
				}); */
				objHorizWrapper.style.webkitTransitionDuration = '500ms'; 
				objBackgroundImg.style.webkitTransitionDuration = '500ms'; 
				objHorizWrapper.style.webkitTransform = "translate3d("+(-horizScroll)+"px, 0px, 0px)" ;
				//objBackgroundImg.style.webkitTransform = "translate3d("+(backgroundView[activeView])+"px, 0px, 0px)" ;
				setTimeout("hScrollTimeout()",500);
				
			}
			if (dH<0 && topPos < dH) { 		
				/*$("#itemListFav").animate({ marginTop: dH +"px"},300, function() {
					topPos=dH;
					scrollInProgress = false;
				});	*/
				topPos=dH;
				objItemListFav.style.webkitTransitionDuration = '500ms'; 
				objItemListFav.style.webkitTransform = "translate3d(0px,"+(dH)+"px, 0px)" ;
				setTimeout("vScrollTimeout(false)",500);	
			}
			if (dH>=0 || topPos > 0) {
				/*$("#itemListFav").animate({ marginTop: 0 +"px"},300, function() {
					topPos=0;
					scrollInProgress = false;
				});*/
				topPos=0;
				objItemListFav.style.webkitTransitionDuration = '500ms'; 
				objItemListFav.style.webkitTransform = "translate3d(0px,"+(0)+"px, 0px)" ;
				setTimeout("vScrollTimeout(false)",500);	
			}
		} 
		else {
			if (dX<-60) {
				activeView = 1;
				leftAtTouch = -horizScroll ;
				backgroundAtTouch = backgroundView[activeView];
				/*
				$("#container").animate({ backgroundPosition:  backgroundAtTouch+"px"},300);
				$("#listWrapper").animate({ left: -horizScroll},300,function() {
					scrollInProgress = false;
				}); */
				objHorizWrapper.style.webkitTransitionDuration = '500ms'; 
				objBackgroundImg.style.webkitTransitionDuration = '500ms'; 
				objHorizWrapper.style.webkitTransform = "translate3d("+(-horizScroll)+"px, 0px, 0px)" ;
				//objBackgroundImg.style.webkitTransform = "translate3d("+(backgroundAtTouch)+"px, 0px, 0px)" ;
				setTimeout("hScrollTimeout()",500);
				
				$("#viewAll").removeClass("activeView");
				//$("#itemListFav").css("margin-top","0px");
				objItemListFav.style.webkitTransform = "translate3d(0px,"+(0)+"px, 0px)" ;
				topPos = 0;
				$(".opDel").show();
				$(".opAddFav").hide();
			} 
			else {
				
				/*$("#container").animate({ backgroundPosition: backgroundView[activeView] +"px"},300);
				$("#listWrapper").animate({ left: 0},300,function() {
					scrollInProgress = false;
				}); */
				objHorizWrapper.style.webkitTransitionDuration = '500ms'; 
				objBackgroundImg.style.webkitTransitionDuration = '500ms'; 
				objHorizWrapper.style.webkitTransform = "translate3d("+(0)+"px, 0px, 0px)" ;
				//objBackgroundImg.style.webkitTransform = "translate3d("+(backgroundView[activeView])+"px, 0px, 0px)" ;
				setTimeout("hScrollTimeout()",500);
			}
			if (dH<0 && topPos < dH) { 		
				/*$("#itemList").animate({ marginTop: dH +"px"},300, function() {
				topPos=dH;
				scrollInProgress = false;
				});*/
				topPos=dH;
				objItemList.style.webkitTransitionDuration = '500ms'; 
				objItemList.style.webkitTransform = "translate3d(0px,"+(dH)+"px, 0px)" ;
				setTimeout("vScrollTimeout(false)",500);	
			}
			
			if (dH>=0 || topPos > 0) {
				
				/*$("#itemList").animate({ marginTop: 0 +"px"},300, function() {
					topPos=0;
					if (refreshInProgress == 2) {
						$("#pullDownRun").show();
						$("#pullDownPre").hide();
						$("#pullDownStart").hide();
						refreshData();
					}
					if (refreshInProgress == 1) {
						refreshInProgress = 0;
						$("#pullDownPre").hide();
					}
					scrollInProgress = false;
				});*/
				topPos=0;
				objItemList.style.webkitTransitionDuration = '500ms'; 
				objItemList.style.webkitTransform = "translate3d(0px,"+(0)+"px, 0px)" ;
				setTimeout("vScrollTimeout(true)",500);	
			}
		}
	},false);
	
	o.addEventListener("touchmove", function(event){
		event.preventDefault();
		cntMoveEv++;
	
		if (scrollInProgress) {
			dropped++;
			return;
		} 
		scrollInProgress = true; 
		touch=event.targetTouches[0] ;  
		if (!touched) {
			touched = true ;
			touchStartPosX = touch.pageX  ;
			touchStartPosY = touch.pageY ;
			topAtTouch = topPos ;
		}		
		dX = touch.pageX-touchStartPosX;
		dY = touch.pageY-touchStartPosY;
		
		//objHorizWrapper.style.webkitTransform = "translateX("+(leftAtTouch+dX)+"px)" ;
			
		var dY2 = dY + dY ;
		if ( (dX<0?-dX:dX) > (dY2<0?-dY2:dY2) ) {
			//$("#listWrapper").css("left",(leftAtTouch+dX)+"px");
			//objHorizWrapper.style.left=(leftAtTouch+dX)+"px" ;
			objHorizWrapper.style.webkitTransform = "translate3d("+(leftAtTouch+dX)+"px, 0px, 0px)" ;
			//$("body").css("background-position",(backgroundAtTouch+dX/4)+"px 50%");
			//objContainer.style.backgroundPosition = (backgroundAtTouch+dX/4)+"px 50%";
			//objBackgroundImg.style.webkitTransform = "translate3d("+(backgroundAtTouch+dX/4)+"px, 0px, 0px)" ;
		}
		var dX2 = dX + dX ;
		
		if ( (dY<0?-dY:dY) > (dX2<0?-dX2:dX2) ) {
			topPos = topAtTouch + dY ;			
			if (!activeView) {
				//$("#itemList").css("margin-top",topPos+"px") ;
				objItemList.style.webkitTransform = "translate3d(0px,"+(topPos)+"px, 0px)" ;
				if (topPos > 25) {
					if (topPos > 70) {
						setRefreshLabel = 2;
					}
					else {
						setRefreshLabel = 1;
					}
				}
				if (setRefreshLabel == 1 && refreshInProgress !=1 ) {
				refreshInProgress = 1 ;
				$("#pullDownPre").show();
				$("#pullDownStart").hide();
				}
				if (setRefreshLabel == 2 && refreshInProgress !=2) {
					refreshInProgress = 2 ;
					$("#pullDownPre").hide();
					$("#pullDownStart").show();
				}
			}
			else {
				//$("#itemListFav").css("margin-top",topPos+"px") ;
				objItemListFav.style.webkitTransform = "translate3d(0px,"+(topPos)+"px, 0px)" ;
			}
		}
		scrollInProgress = false;
	},false);
		
	$(window).resize( function(){
		initDisp();
	}) ;
	window.addEventListener('orientationchange', initDisp, false);
		
	if (localStorage.myData == null) {		
		refreshData();
	}
	else {
		$(".alertLocal").show().delay(2000).fadeOut(500);
		dataSet = jQuery.parseJSON(localStorage.myData) ;
		displayData();
		refreshFavs();
		initDisp();
	}
	
	$(".opDel").hide();
	
});
