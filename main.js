//Constants
var PATH = "";
var BODY;
var PAGE;

//GLOBAL FUNCTIONS
function APPLICATION(){
	//Global Variables
	this.sBrowserName="";
	this.site = null;
	this.page = null;
	this.sliderValues = [];
	this.user = JSON.parse(localStorage.getItem("user"));
    this.url = "./api/api.php/";
    this.homePageResult = "";
	this.homePageResult = JSON.parse(localStorage.getItem("homePageResult"));
	this.errors = new Errors();
	
	if (typeof APPLICATION.INIT=="undefined"){

	APPLICATION.prototype.findXY = function(obj) {
		var x = 0;
		var y = 0;
		while (obj){
			x += obj.offsetLeft;
			y += obj.offsetTop;
			obj = obj.offsetParent;
		}
		var values = [x,y];
		return values;
	}
	
	APPLICATION.prototype.removeA = function (arr){
		var what, a= arguments, L= a.length, ax;
		while(L> 1 && arr.length){
		    what= a[--L];
		    while((ax= arr.indexOf(what))!= -1){
		        arr.splice(ax, 1);
		    }
		}
		return arr;
	}
	
	APPLICATION.prototype.autoClose = function(obj){
		var theTimeout = 0;
		$(obj).mouseenter(function() {
			theTimeout = setTimeout(function(){
				$(obj).fadeOut(500,function(){
					$(obj).remove();
				});
			},1000);
		}).mouseleave(function() {
			clearTimeout(theTimeout);
		});
	}
	
	APPLICATION.prototype.scrollToAnchor = function(div) {
		 $('html,body').animate({scrollTop: div.offset().top},'slow');
	}
	
    APPLICATION.prototype.callJSON = function(pageQuery,oData,type,callbackSuccess,silent){
		if (!silent) {
			APP.showLoader();
		}
		var request = $.ajax({
			type: type,
			url: pageQuery,
			data: oData,
			dataType:"application/json",
			complete: function(data) {
				APP.removeLoader();
				callbackSuccess(data);
			}
		});
    };
		
	APPLICATION.prototype.floatMid = function(win,container){
		var iWidth = $(win).innerWidth();
		var iHeight = $(win).innerHeight();
		if(container==undefined){
			var iContainerWidth=$(window).innerWidth();
			var iContainerHeight=$(window).innerHeight();
		}else{
			var iContainerWidth=$(container).innerWidth();
			var iContainerHeight=$(container).innerHeight();
		}
		var iLeft = Math.floor((iContainerWidth - iWidth) / 2);
		var iTop = Math.floor((iContainerHeight - iHeight) / 2);
		$(win).css({top:iTop,left:iLeft});
		
	}
	
	APPLICATION.prototype.setDropdown = function(oButton,aList,sClass){
		sClass = sClass || "widget-dropdown"; //Default class
		//Bind mouse event
		$(oButton).mouseenter(function(){
			t = $(this);
			createDropdown(t);
		}).mouseleave(function() {
			$("#dropDown").remove();
		});
		
		
		var createDropdown = function(o){
			//Get position of parent
			var iLeft = o.offset().left;
			var iTop = o.offset().top + o.height();
			var widget = APP.createElement(BODY,"dropDown",sClass);
			$(widget).css({top:iTop,left:iLeft});
		}
	}
	
	/*********** create html element */
	APPLICATION.prototype.createElement = function(divParent,sID,sClassName,sType){
		var divA;
		if (!sType) sType="div";
		divA = document.createElement(sType);
		if (sClassName) divA.className=sClassName;
		if (sID) divA.setAttribute("id",sID);
		try{
			divParent.appendChild(divA);
		}catch(err){
			txt=err+".\r\n";
			txt+="DivParent -> "+divParent+".\r\n";
			txt+="DivA -> "+divA+".\r\n";
		}
		return divA;
	};

	APPLICATION.prototype.autoTextInit = function(){
		//Capture default font size and apply to alt tag
		$(".resizeText").each(function(){
			fontSize = parseInt($(this).css("font-size"));
			$(this).attr("alt",fontSize);
		});
	}
	
	APPLICATION.prototype.autoTextUpdate = function(){
		//Standard height, for which the body font size is correct
		var preferredHeight = 450;
		var displayHeight = $(window).innerHeight();
		//Resize text percentage based of captured alt tag font size
		$(".resizeText").each(function(index){
			fontSize = parseInt($(this).attr("alt"));
			percentage = displayHeight / preferredHeight;
			newFontSize = Math.floor(fontSize * percentage) - 1;
			$(this).css("font-size", newFontSize);
		});
	}
	
	APPLICATION.prototype.autoImageUpdate = function(){
		var preferredHeight = 980;
		var displayHeight = $(window).innerHeight();
		
		$(".resizeImage").each(function(index){			 
			var percentage = displayHeight / preferredHeight;
		
			var heightSize = parseInt($(this).attr("alt-height"));
			var widthSize = parseInt($(this).attr("alt-width"));
			
			var aspect = widthSize / heightSize;
			var newHeightSize = Math.floor(heightSize * percentage) - 1;
			var newWidthSize = Math.floor(newHeightSize * aspect);
			$(this).css("height", newHeightSize);
			$(this).css("width", newWidthSize);
		});
	}
	
	APPLICATION.prototype.buildContainer = function() {
		var contentbody = document.getElementById("contentBody");
		$(contentBody).empty();
		APP.topCrumbs();
		
		var rowFluid = APP.createElement(contentbody, "row-fluid-top", "row-fluid");
		var span6 = APP.createElement(rowFluid, "top-1", "span6");
		var span6 = APP.createElement(rowFluid, "top-2", "span6");
		var span6 = APP.createElement(rowFluid, "top-3", "span6");
		var span6 = APP.createElement(rowFluid, "top-4", "span6");
		
		var rowFluid = APP.createElement(contentbody, "row-fluid-middle", "row-fluid");
		var span6 = APP.createElement(rowFluid, "middle-1", "span6");
		var span6 = APP.createElement(rowFluid, "middle-2", "span6");
		
		var rowFluid = APP.createElement(contentbody, "row-fluid-bottom", "row-fluid");
		var span12 = APP.createElement(rowFluid, "bottom-all", "span12");
		var rowFluid = APP.createElement(contentbody, "", "row-fluid");
		var span12 = APP.createElement(rowFluid, "bottom-all-2", "span12");
	}

	APPLICATION.prototype.buildChartsContainer = function() {
		var contentbody = document.getElementById("contentBody");
		$(contentBody).empty();
		APP.topCrumbs();
		
		var rowFluid = APP.createElement(contentbody, "row-fluid-top", "row-fluid");
		var span6 = APP.createElement(rowFluid, "top-1", "span7");
		var span6 = APP.createElement(rowFluid, "top-2", "span5");
		
		var rowFluid = APP.createElement(contentbody, "row-fluid-middle", "row-fluid");
		var span6 = APP.createElement(rowFluid, "middle-1", "span6");
		var span6 = APP.createElement(rowFluid, "middle-2", "span6");
	}
	
	APPLICATION.prototype.topCrumbs = function(objectAdd){
		var bod = $("#contentBody")[0];
		var oList = APP.breadcrumbs;
		var rowFluid = APP.createElement(bod,"breadheader","row-fluid");
		var navbar = APP.createElement(rowFluid,"","navbar");
		var navbarInner = APP.createElement(navbar,"","navbar-inner");
		
		var breadcrumb = APP.createElement(navbarInner,"crumblist","breadcrumb","ul");
		var iconHide = APP.createElement(breadcrumb,"","icon-chevron-left hide-sidebar","i");
		var iconShow = APP.createElement(breadcrumb,"","icon-chevron-right show-sidebar","i");
		$(iconShow).attr("style","display:none;");
		
		var link = APP.createElement(iconShow,"","","a");
		$(link).attr("title","Show Sidebar").attr("rel","tooltip").html("&nbsp;");
		var link = APP.createElement(iconHide,"","","a");
		$(link).attr("title","Hide Sidebar").attr("rel","tooltip").html("&nbsp;");
		
		$('.hide-sidebar').click(function() {
		  $('#sidebar').hide('fast', function() {
			$('#contentBody').removeClass('span9');
			$('#contentBody').addClass('span12');
			$('.hide-sidebar').hide();
			$('.show-sidebar').show();
		  });
		});

		$('.show-sidebar').click(function() {
			$('#contentBody').removeClass('span12');
			$('#contentBody').addClass('span9');
			$('.show-sidebar').hide();
			$('.hide-sidebar').show();
			$('#sidebar').show('fast');
		});
	}


	/*********** lightweight scanning for valid email address */
	APPLICATION.prototype.getValidEmailAddress = function(sEmailAddress){
	   var sReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	   if(!sReg.test(sEmailAddress)) {
		  return 0;
	   } else {
			return 1;
		}
	};
	
	APPLICATION.prototype.showLoader = function () {
		var body = document.getElementById("contentBody");
		var loaderimg = APP.createElement(body, "", "loaderimg");
	}
	
	APPLICATION.prototype.removeLoader = function() {
		$(".loaderimg").remove(); 
	}
	
	APPLICATION.INIT=1;
  }
};

function Errors()
{
	this.noData = "<strong>Information!</strong> No data was returned.";
	this.errorDeleting = "<strong>Error!</strong> There was an error deleting the record.";
	this.successDeleting = "<strong>Success!</strong> Record successfully deleted.";
	this.serverError = "<strong>Error!</strong> A server side error occured. Please contact your administrator.";
	this.loginError = "<strong>Error!</strong> Invalid login credentials provided.";
}

function user ()
{
	this.session_key = "";
}

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};