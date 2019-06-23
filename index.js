{/*global variables used throughout system */
var $validator;
var dtTable;
var dtTableA;
var current_left = 1;}

{/* form creation and validation */
function buildForm(tabpane, fieldnames, datanames, _dropdown, _dropdownnames, _textarea, values, descriptions, dataplaceholder, dropdownlookup, _media, _checkbox, _readonly, _readonlylookup) {
	var _dropdownnameindex = 0;
	if (descriptions == null) {
		descriptions = fieldnames;
	}
	if (dataplaceholder == null) {
		dataplaceholder = fieldnames;
	}
	/* runs for each field passed and checks what type it should be */
	for(i = 0; i < fieldnames.length ; i++)
	{
		var fieldlabel = APP.createElement(tabpane, "", "", "label");
		$(fieldlabel).html(descriptions[i]);
		
		/* this does not do dropdowns */
		if(_dropdown.indexOf(i) == -1)
		{
			/* build text area */
			if(_textarea.indexOf(i) > -1)
			{
				var fieldinput = APP.createElement(tabpane, fieldnames[i].replace(/ /g,''), "textarea", "textarea");
				$(fieldinput).attr("rows","4").attr("placeholder",fieldnames[i]).attr("alt", datanames[i]).html((values!=null?values[i]:"")).attr("name", fieldnames[i].replace(/ /g,''));;
			}
			else /* checkboxes, previews and inputs */
			{
				/* checkbox */
				if(_checkbox != undefined && _checkbox.indexOf(i) > -1)
				{
					buildCheckbox(tabpane, fieldnames[i].replace(/ /g,''), descriptions[i], values[i]);
				}
				else
				{
					/* preview box */
					if(_media != undefined && _media.indexOf(i) > -1)
					{
						var fieldinput = APP.createElement(tabpane, "", "media span12", "div");
						
						var fieldinput = APP.createElement(fieldinput, "", "thumbnail pull-left", "a");
						$(fieldinput).attr("data-toggle","#lightbox").attr("alt", "").on("click", function () {  
							$('#demoLightbox').lightbox();
						});
						var fieldinput = APP.createElement(fieldinput, fieldnames[i].replace(/ /g,''), "media-object previewImg", "img");
						$(fieldinput).attr("src","images/no_image.png");
						
						var fieldinput = APP.createElement(tabpane, "demoLightbox", "lightbox hide fade", "div");
						$(fieldinput).attr("tabindex", "-1").attr("role", "dialog").attr("aria-hidden", "true");
						
						var content = APP.createElement(fieldinput, "", "lightbox-content", "div");
							
						var fieldinput = APP.createElement(content, "lb"+fieldnames[i].replace(/ /g,''), "", "img");
					}
					else
					{
						/* inputs go here */
						var fieldinput = APP.createElement(tabpane, fieldnames[i].replace(/ /g,''), "", "input");
						$(fieldinput).attr("type","text").attr("placeholder",fieldnames[i]).attr("alt", datanames[i]).attr("value", (values!=null?values[i]:"")).attr("name", fieldnames[i].replace(/ /g,'')).focus();
					}
				}
			}
			
			if(fieldnames[i] == "Password")
			{
				$(fieldinput).attr("type","password");
				makePasswordField(fieldnames[i]);
			}
			if(fieldnames[i].replace(/ /g,'') == "LessonName")
			{
				$(fieldinput).change(function () {
					if(this.value != "")
					{
						if($("#Instructions").val() == "")
						{
							$("#Instructions").val("Please watch the lesson on '"+this.value+"' and click on the correct answer.").focus();
						}
						else {
							 $("#Instructions").val($("#Instructions").val().replace(value, this.value));
						}
						if ($("#Outcomes").val() == "")
						{
							$("#Outcomes").val("Completing this video and answering the questions correctly will let you pass the '"+this.value+"' lesson.").focus();
						}
						else
						{
							$("#Outcomes").val($("#Outcomes").val().replace(value, this.value));
						}													
						$("#LessonCode").focus();
					}
					else
					{
						$("#Instructions").val("").focus();
						$("#Outcomes").val("").focus();
						this.focus();
					}
					
					value = this.value;
				});
			}
		}
		else
		{
			/* dropdowns */
			List = APP.homePageResult[_dropdownnames[_dropdownnameindex]];
			var sel = APP.createElement(tabpane,fieldnames[i].replace(/ /g,''),"chzn-select","select");
			
			$(sel).attr("data-placeholder", dataplaceholder[i]).attr("name", fieldnames[i].replace(/ /g,''));
			
			if (dropdownlookup != null) {
				if (dropdownlookup[_dropdownnameindex] != null) {
					var label = APP.createElement(tabpane, "", "pull-right", "label");
					var i_el = APP.createElement(label, "", "icon-double-angle-right", "i");
					
					$(label).on("click", {e_id:_dropdownnameindex}, function(event, ui) {
						dropdownlookup[event.data.e_id].buildTopRight();
						$("#top-"+(current_left+1)).hide();
						$("#top-"+(current_left+1)).fadeIn('slow');
						initplugins();
						current_left++;
					});
				}
			}
			
			if (values == null) {
				if ((_dropdownnames[_dropdownnameindex] != "types")&&
					(_dropdownnames[_dropdownnameindex] != "lesson_types")&&
					(_dropdownnames[_dropdownnameindex] != "languages")&&
					(_dropdownnames[_dropdownnameindex] != "countries")) {
					var option = APP.createElement(sel,"","","option");
					$(option).attr("value","").html("");
				}
				if ((List != null)&&(List.length > 0)) {
					for(p=0;p < List.length; p++){
						var option = APP.createElement(sel,"","","option");
						$(option).attr("value",List[p]["uid"]).html(List[p]["name"]);
					}
				}
			} else {
				if ((List != null)&&(List.length > 0)) {
					if ((_dropdownnames[_dropdownnameindex] != "types")&&
					(_dropdownnames[_dropdownnameindex] != "lesson_types")&&
					(_dropdownnames[_dropdownnameindex] != "languages")&&
					(_dropdownnames[_dropdownnameindex] != "countries")) {
						var option = APP.createElement(sel,"","","option");
						$(option).attr("value","").html("");
					}
					for(e = 0; e < List.length; e++)
					{
						var option = APP.createElement(sel,"","","option");
						$(option).attr("value",List[e]["uid"]).html(List[e]["name"]);
						if(List[e]["uid"] == (values!=null?values[i]:""))
						{	
							$(option).attr("selected","");
						}
					}
				}
			}
			_dropdownnameindex++;
		}
		if(_readonly != null && _readonly.indexOf(i) > -1)
		{			
			$(fieldinput).attr("readonly", true);			
			var label = APP.createElement(tabpane, "", "pull-right", "label");
			var i_el = APP.createElement(label, "", "icon-double-angle-right", "i");
			
			$(label).on("click", {e_id:i}, function(event, ui) {
				APP.page.returnVal = event.data.e_id;
				if(_readonlylookup != null)
				{
					addTab(null, _readonlylookup, null);
				}
				else
				{
					if (current_left = 2) {
						addTab(APP.page);
					} else {
						//do something to not navigate, just re-show
					}
				}
				initplugins();
			});
		}
	}
}
function buildTopWizard(header, subheader, buildTabArray, values, callback, container, addSwitch, state) {	
	var left = true;
	if (container == null) {
		container = "top-1"
		id = "rootwizard-top-1";
	} else {
		left = false;
		id = "rootwizard-"+container;
	}
	if (state == null) {
		state = true;
	}
	var span6 = document.getElementById(container);
	$(span6).empty();
	
	var block = APP.createElement(span6, "", "block");
	var navbarHeader = APP.createElement(block, "navbarheader", "navbar navbar-inner block-header");
	var mutedPullLeft = APP.createElement(navbarHeader, "headerText", "muted pull-left");
	$(mutedPullLeft).html(header);
	var blockContent = APP.createElement(block, "blockContent", "block-content collapse in overflowshow");
	
	if (subheader != "") {
		var legend = APP.createElement(blockContent, "", "","legend");
		$(legend).html(subheader);
	}
	
	$(mutedPullLeft).html(header);
	
	var formname = header.substring(header.indexOf(' ')+1);
	var wizardform = APP.createElement(blockContent, formname.replace(/\s/g, '') + "wizardform", "form-horizontal", "form");
	$(wizardform).attr("method","get").attr("action","");
	var rootwizard = APP.createElement(wizardform, id, "");
	var navbar = APP.createElement(rootwizard, "", "navbar hidden");
	var navbarinner = APP.createElement(navbar, "", "navbar-inner");
	var container = APP.createElement(navbarinner, "", "container");
	var ul = APP.createElement(container, "", "step-top", "ul");
	if(addSwitch)
	{
		var switchbutton = APP.createElement(navbarHeader, "switch", "make-switch has-switch pull-right");
		$("#switch").attr("data-on","danger").attr("data-off","danger").attr("data-on-label","Single").attr("data-off-label","Bulk").on('switch-change', function(e, data) {
			var headerNormal = "Add "+APP.page.whoAmISingle();
			var headerBulk = "Bulk Upload "+APP.page.whoAmIPlural();
			if(!data.value)
			{
				buildTopWizard(headerBulk, "", [APP.page.buildBulkUpload], null, APP.page.finishClickedBulk, null, true, false);
				APP.page.validate();
				initplugins();	
			}
			else{
				buildTopWizard(headerNormal, "", APP.page.getFormContent(), null, APP.page.finishClicked, null, true);
				APP.page.validate();
				initplugins();	
			}
		});
		var switchinput = APP.createElement(switchbutton, "switchinput", "", "input");
		$(switchinput).attr("type", "checkbox").attr("checked",state);
		$("#switch").bootstrapSwitch();
	}
	
	var bar = APP.createElement(rootwizard, "bar", "progress progress-danger progress-striped active");
	var barbar = APP.createElement(bar, "", "bar");
	
	var tabcontent = APP.createElement(rootwizard, "", "tab-content");
	for (iCount = 1; iCount < buildTabArray.length+1; iCount++) {
		this.buildTab(tabcontent, buildTabArray[iCount-1], iCount, values, id);
		var li = APP.createElement(ul, "", "step-header", "li");
		var a = APP.createElement(li, "", "", "a");
		$(a).attr("href","#"+id+iCount).attr("data-toggle","tab").html("Step "+iCount);
	}
	var ul = APP.createElement(tabcontent, "", "pager wizard", "ul");
	
	var li = APP.createElement(ul, "", "previous first", "li");
	var a = APP.createElement(li, "", "", "a");
	$(a).attr("href","javascript:void(0);").html("First");
	
	var li = APP.createElement(ul, "", "previous", "li");
	var a = APP.createElement(li, "", "", "a");
	$(a).attr("href","javascript:void(0);").html("Previous");
	
	var li = APP.createElement(ul, "", "cancel pull-left", "li");
	var a = APP.createElement(li, "", "", "a");
	if (left) {
		$(a).attr("href","javascript:clearInput(0);").html("Cancel");
	} else {
		$(a).attr("href","javascript:clearInputRight(0);").html("Cancel");
	}
	
	var li = APP.createElement(ul, "", "next last", "li");
	var a = APP.createElement(li, "", "", "a");
	$(a).attr("href","javascript:void(0);").html("Last");
	
	var li = APP.createElement(ul, "", "next", "li");
	var a = APP.createElement(li, "", "", "a");
	$(a).attr("href","javascript:void(0);").html("Next");

	var li = APP.createElement(ul, "", "next finish", "li");
	var a = APP.createElement(li, "", "", "a");
	$(a).html((values==null?"Add":"Update")).attr("href","javascript:void(0);").on("click", callback);
	
}
function validateForm(form, index) {
	switch(form)
	{
		case "Mediawizardform": 
		{
			if(index == 2)
			{
				$validator.settings.ignore = ":not(.chzn-done):hidden";
			}
			else{
				$validator.settings.ignore = ":hidden";
			}
			break;
		}
	}
	var $valid = $("#"+form).valid();
	if(!$valid){
		$validator.focusInvalid();
		return false;
	}
	else 
	{	
		return true;
	}
}
}
{/* data table bottom-all creation */
function buildDatatableWizard(header, resultset, fieldnames, datanames , lookups, target, keephead, expand, expandCallback){
	var currentPage = 0;
	
	if (dtTable != null) {
		currentPage = dtTable.fnPagingInfo().iPage;
	}
	var span9 = null;
	if(!keephead)
	{
		if(target == null)
		{
			span9 = document.getElementById("bottom-all");
			$(span9).empty();
		}
		else
		{
			span9 = document.getElementById(target);
			$(span9).empty();
		}
	}
	//LIST TABLE
	var block = APP.createElement(span9, "", "block");
	var navbar = APP.createElement(block, "headerBar", "navbar navbar-inner block-header");
	var mutedPullLeft = APP.createElement(navbar, "", "muted pull-left");
	$(mutedPullLeft).html(header);
	header = "t" + header.replace(/ /g,'');
	var blockContent = APP.createElement(block, "", "block-content collapse in");
	var span12 = APP.createElement(blockContent, "bottom-content", "span12");
	if(keephead)
	{
		span12 = document.getElementById("bottom-content");
		$(span12).empty();
	}	
	var tableList = APP.createElement(span12, header, "table table-striped table-bordered","table");
	$(tableList).attr("cellspacing","0").attr("cellpadding","0").attr("border","0");	
	var thead = APP.createElement(tableList, "tableHead", "","thead");
	var tr = APP.createElement(thead, "", "","tr");
	for(rr=0; rr < fieldnames.length; rr++){
		var td = APP.createElement(tr, datanames+"-"+rr, "","th");
		$(td).html(fieldnames[rr]);
	}
	if(header.indexOf("Sales") == -1){
		var td = APP.createElement(tr, "", "","th");
		$(td).html("Controls");
	}
	
	var tbody = APP.createElement(tableList, "tableBody", "","tbody");
	
	if (resultset != null) {
		for(i=0;i < resultset.length;i++){//Rows
			
			var _dropdownnameindex = 0;
			var tr = APP.createElement(tbody, "row"+i, "even gradeA","tr");
			$(tr).attr('value', resultset[i]['uid']);
			if(expand)
			{
				$(tr).on('click', function() {
					expandCallback(this)
				});
			}
			var tmp = resultset[i];
			for(rr=0; rr < datanames.length; rr++){
				var td = APP.createElement(tr, ""+i, "","td");
				if ($.isArray(datanames[rr])) {
					val = tmp[datanames[rr][0]][datanames[rr][1]];
				} else {
					val = tmp[datanames[rr]];
					if(header.indexOf("Results") > -1)
					{	
						if(datanames[rr] == "outcome")
						{
							val = tmp[datanames[rr]] == "0"? "Failed" : "Passed";
						}
					}
				}
				if(lookups[rr]==null){
					$(td).html(val);
				}else{
					for(l=0; l < lookups[rr].length; l++){
						if(lookups[rr][l].uid == val){
							$(td).html(lookups[rr][l].name);
						}
					}
				}
			}
			
			if(header.indexOf("Sales") == -1)
			{
				var td = APP.createElement(tr, "", "center","td");
				var btnGroup = APP.createElement(td, "", "btn-group pull-right");
				var btn = APP.createElement(btnGroup, "", "btn");
				$(btn).html("Edit").on("click",{e_id:i}, function (event, ui) {
					APP.page.edit(event.data.e_id, target);
					/*$("html, body").animate({ scrollTop: $('#top-1').offset().top }, 1000);*/
				});
				var btn = APP.createElement(btnGroup, "", "btn");
				$(btn).html("Delete").on("click",{e_id:i,t_id:header}, function (event, ui) {
					rowElem = $(this).parent().parent().parent()[0];
					APP.page.drop(event.data.e_id,rowElem,event.data.t_id, target);
				});
			}
		}
	}
	
	//FIRE UP THE DT CANNON
	dtTable = $(tableList).dataTable({
		"sDom": "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
		"sPaginationType": "bootstrap",
		"oLanguage": {
			"sLengthMenu": "_MENU_ records per page"
		}
	});
	
	dtTable.fnPageChange(currentPage);
	
	return dtTable; // used by learners page for bulk delete

}
}

{/* top right filters */
function buildFilters(parent, filters, fieldnames, roots, placeholders, callbacks){
	if (placeholders == null) {
		placeholders = fieldnames;
	}
	if(filters != null)
	{
		for(var i = 0; i < filters.length; i++)
		{
			var fieldlabel = APP.createElement(parent, "", "", "label");
			$(fieldlabel).html(fieldnames[i]);
			
			list = APP.homePageResult[filters[i]];
			
			var sel = APP.createElement(parent,filters[i].replace(/ /g,''),"chzn-select","select");
			$(sel).attr("data-placeholder", placeholders[i]);
			if(callbacks != null)
			{
				$(sel).on("change",{e_id:i},function(event, ui) {callbacks[event.data.e_id]($(this).val())});
			}
			var option = APP.createElement(sel,"","","option");
			$(option).attr("value","").html("");
			if (list != null) {
				for(p=0;p < list.length; p++){
					var option = APP.createElement(sel,"","","option");
					$(option).attr("value",list[p]["uid"]).html(list[p][roots[i]]);
				}
			}
		}
	}
}

}

{/* builds tabs inside of wizards, page 1/2/3/ etc */
function buildTab(tabcontent, tab, i, valuesArray, id) {
	var right = false;
	if(id == "rootwizard-top-3") {
		right = true;
	}
	var tabpane = APP.createElement(tabcontent, ""+id+i, "tab-pane");
	var form = APP.createElement(tabpane, "", "form-horizontal");
	tab(form, valuesArray, right);
}
}
{/*functions used for 2nd and 3rd top tab navigation and creation */
function addTab(lookup, func, params) {
	var tab_left_remove = "#top-"+(current_left-1);
	var current_right_moveLeft = "#top-"+current_left;
	var not_shown_pull_left = "#top-"+(current_left+1);
	 // Left box animates to 0 width
    $(tab_left_remove).animate({
        "margin-left": "-50%",
		
    }, "slow", function() {
        // Hide when width animation finishes
        $(this).hide();
    });
    // Right box expands. Tinkered with add span12 after animation is complete
    $(current_right_moveLeft).animate({
		"margin-left": "0"
    }, "slow", function() {
		if(func == null)
		{
			lookup.buildTopRight();
		}
		else
		{
			func(params);
		}
		$(not_shown_pull_left).hide();
		$(not_shown_pull_left).fadeIn('slow');
		initplugins();
    });
	
}
function removeTab() {
	
	var now_shown_pulll_right = "#top-"+(current_left-2);
	var current_left_move_right = "#top-"+(current_left-1);
	var shown_right_move_off = "#top-"+(current_left);
	if (current_left > 2) {
		$(shown_right_move_off).fadeOut('fast', function() {
	
			$(current_left_move_right).animate({
				"margin-left": "2.564102564102564%"
			}, "slow", function() {
				
			});
			current_left--;
			$(now_shown_pulll_right).show();
			$(now_shown_pulll_right).animate({
				"margin-left": "0",
				
			}, "slow", function() {
				// Hide when width animation finishes
			});
		});
	} else {
		current_left = 1;
		APP.page.buildTopRightFilters();
		initplugins();
		$("#top-2").hide();
		$("#top-2").fadeIn('slow');
	}
}
}

{/* Screen Functionality */

function salesPage(){
	salesPage.prototype.init = function(){
		this.getAllSales();
		this.getAllMedia();
	}
	salesPage.prototype.getAllSales = function() {	
		var date = new Date();
		
		var postData = JSON.stringify(
		{
			"func" : "getAllSales",
			"startDate": new Date((date.getMonth() + 1) + '/' + (date.getDate()-7) + '/' +  date.getFullYear()),
			"endDate": new Date((date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()),
			"session_key" : APP.user.session_key
		});
		
		APP.callJSON(APP.url, postData, "POST", APP.page.getAllSalesCallBackSuccess);	
	}
	salesPage.prototype.getAllSalesCallBackSuccess = function(data, textStatus, request) {
		if (httpMessage(data, "")) {
			var ret_data = JSON.parse(data.responseText);
			APP.homePageResult["sales"] = ret_data["sales"];

			APP.page.build();
		}
	}
	salesPage.prototype.getAllMedia = function() {
		var postData = JSON.stringify(
		{
			"func" : "getAllMedia",
			"session_key" : APP.user.session_key
		});
		
		APP.callJSON(APP.url, postData, "POST", APP.page.getAllMediaCallBackSuccess);	
	}
	salesPage.prototype.getAllMediaCallBackSuccess = function(data, textStatus, request) {
		if (httpMessage(data, "")) {
			var ret_data = JSON.parse(data.responseText);
			APP.homePageResult["media"] = ret_data["media"];

			APP.page.build();
		}
	}
	salesPage.prototype.build = function() {
		var contentbody = document.getElementById("contentBody");
		$(contentBody).empty();
		
		APP.buildContainer();		
		this.buildTopLeft();
		this.buildTopRight();
		this.buildBottomAll("List Sales");
		
		initplugins();

		crumbs([{
			title:"Sales",
		},{
			title:"View Sales Table"
		}]);
	}
	salesPage.prototype.buildTopLeft = function() {
		var span6 = document.getElementById("top-1");
		
		var block = APP.createElement(span6, "", "block");
		var navbar = APP.createElement(block, "", "navbar navbar-inner block-header");
		var mutedPullLeft = APP.createElement(navbar, "", "muted pull-left");
		$(mutedPullLeft).html("Filter Results");
		
		var blockContent = APP.createElement(block, "", "block-content collapse in overflowshow");
		var legend = APP.createElement(blockContent, "", "","legend");
		$(legend).html("Filter where clause");
		
		var filters = new Array("stores", "media","chart_categories", "genres");
		var fieldnames = new Array("Filter sales data by Store", "Filter sales data by Media", "Filter sales data by Chart Category", "Filter sales data by Genre");
		
		var roots = ["name", "name", "name", "name"];
		var placeholders = ["Select a Store", "Select a Media", "Select a Chart Category", "Select a Genre"];
		
		var callbacks = new Array(this.refreshDatatableForFilters, this.refreshDatatableForFilters,this.refreshDatatableForFilters, this.refreshDatatableForFilters);
			
		buildFilters(blockContent, filters, fieldnames, roots, placeholders, callbacks);
	}
	salesPage.prototype.buildTopRight = function() {
		var span6 = document.getElementById("top-2");
		$(span6).empty();
		
		//build form
		var block = APP.createElement(span6, "", "block");
		var navbar = APP.createElement(block, "", "navbar navbar-inner block-header");
		var mutedPullLeft = APP.createElement(navbar, "", "muted pull-left");
		$(mutedPullLeft).html("Sales Date Filter");
		
		var blockContent = APP.createElement(block, "", "block-content collapse in overflowshow");
		var legend = APP.createElement(blockContent, "", "","legend");
		$(legend).html("Filter Sales with Start and End Date");
		
		var date = new Date();
		
		var fieldlabel = APP.createElement(blockContent, "", "", "label");		
		var span = APP.createElement(fieldlabel, "", "input-group-addon", "span");
		var calendarIcon = APP.createElement(span, "", "icon icon-calendar", "span");
		$(fieldlabel).append("Start Date");

		var inputGroup = APP.createElement(blockContent, "", "input-group date");
		var startDatepicker = APP.createElement(inputGroup, "startDate", "startDatepicker datePicker", "input");
		$('.startDatepicker').attr("type", "text").datepicker({
			autoclose: true,
			format: 'mm/dd/yyyy',
			todayHighlight: true,
			clearBtn: true
		});
		$('.startDatepicker').datepicker('setDate', (date.getMonth() + 1) + '/' + (date.getDate()-7) + '/' +  date.getFullYear());
		$('.startDatepicker').datepicker('update');
		
		var fieldlabel = APP.createElement(blockContent, "", "", "label");		
		var span = APP.createElement(fieldlabel, "", "input-group-addon", "span");
		var calendarIcon = APP.createElement(span, "", "icon icon-calendar", "span");
		$(fieldlabel).append("End Date");
		var endDatepicker = APP.createElement(blockContent, "endDate", "endDatepicker datePicker", "input");
		$('.endDatepicker').attr("type", "text").datepicker({
			autoclose: true,
			format: 'mm/dd/yyyy',
			todayHighlight: true,
			clearBtn: true
		});
		$('.endDatepicker').datepicker('setDate',  (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear());
		$('.endDatepicker').datepicker('update');
		
		$(".datePicker").change(function(){
			APP.page.refreshDatatableForFilters();
		});
	}
	salesPage.prototype.buildBottomAll = function (header) {
		var header = "Overall Store Sales";
		
		var fieldnames = new Array("Media Name", "Week Of Sales", "Amount Purchased", "Store Name", "Chart Category", "Genre Name");
		var datanames = new Array("mediaName", "weekOfSales","amount", "storeName", "chartCategory", "genreName");
		var lookups = [];
		var resultset =	APP.homePageResult["sales"];

		buildDatatableWizard(header, resultset, fieldnames, datanames, lookups);
	}
	salesPage.prototype.refreshDatatableForFilters = function(){
		var stores = $("#stores").val();
		var media = $("#media").val();
		var chart_categories = $("#chart_categories").val();
		var genre = $("#genres").val();
		var startDate = new Date($("#startDate").val());
		var endDate = new Date($("#endDate").val());
		
		var postData = JSON.stringify(
		{
				"func" : "getSalesByFilter", 
				"stores": stores,
				"media": media,
				"chart_categories": chart_categories,
				"genre": genre,
				"startDate": startDate,
				"endDate": endDate,
				"session_key" : APP.user.session_key
		});
		APP.callJSON(APP.url, postData, "POST", APP.page.setCallback, false);
	}
	salesPage.prototype.setCallback = function(data, textStatus, request){
		if (httpMessage(data, "")) {
			var ret_data = JSON.parse(data.responseText);
			APP.homePageResult["sales"] = ret_data["sales"];
			APP.page.buildBottomAll("List Sales");			
		}
	}
}
function storesPage(){
	this.uuid = null;
	this.index = null;
	storesPage.prototype.whoAmI = function() {
		return "Store";
	}
	storesPage.prototype.whoAmIPlural = function() {
		return "Stores";
	}
	storesPage.prototype.getFormContent = function() {
		return [this.buildTopLeftStores, this.buildTopLeftStoresAddress, this.buildTopLeftMediaArchiveDetails];
	}
	storesPage.prototype.buildTopLeftStores = function(tabpane, store) {
		var fieldnames = new Array("Store Name", "Store Description", "Store Contact Number", "Store Email");
		var datanames = new Array("name", "sStoreDescription", "sStoreContactNumber", "sStoreEmail");
		var descriptions = ["The name of the store", "a Description for the store, can be left blank", "The contact number for the store, can be left blank", "The email address for the store"];
		
		var _dropdown = [];
		var _dropdownnames = [""];
		var _textarea = [1];
		
		var values = null;
		if (store != null) {
			values = new Array(store["name"], store["sStoreDescription"], store["sStoreContactNumber"], store["sStoreEmail"]);
		}
		
		buildForm(tabpane, fieldnames, datanames, _dropdown, _dropdownnames, _textarea, values, descriptions);		
			
	}
	storesPage.prototype.validate = function() {	
		$validator = $("#" + APP.page.whoAmI() + "wizardform").validate({
			ignore: ":not(.chzn-done):hidden",
			rules: {
				StoreName: {
					required: true,
					minlength: 2				
				},
				StoreEmail: {
					required: true,
					email: true		
				},
				StoreAddressLine1: {
					required: true
				},
				AddressCityTown: {
					required: true
				}
			},
			messages: {
				StoreName: { 
					required: "Enter the Name of the store",
					minlength: "Enter at least 2 characters for the Store Name"
				},
				StoreEmail: {
					required: "Enter the Email Address of the store",
					email: "The Email Address that was entered is not valid"			
				},
				StoreAddressLine1: {
					required: "Enter the Address of the store"
				},
				AddressCityTown: {
					required: "Enter the City or Town of the store"
				}
			}
		});
		
	}
	storesPage.prototype.buildTopLeftStoresAddress = function(tabpane, store) {	
		var fieldnames = new Array("Store Address Line 1", "Store Address Line 2", "Store Address Line 3", "Address City Town", "Postal Code", "Address Type");
		var datanames = new Array("sAddress1", "sAddress2", "sAddress3", "sAddressCityTown", "sPostalCode", "sAddressType");
		var descriptions = ["The address of the store (line 1)", "The address of the store (line 2), can be left blank", "The address of the store (line 3), can be left blank", "The city or town in which the store is located, can be left blank", "The postal code for the store, can be left blank", "The address type for the store, can be left blank"];
		
		var _dropdown = [];
		var _dropdownnames = [""];
		var _textarea = [];
		
		var values = null;
		if (store != null) {
			values = new Array(store["sAddress1"], store["sAddress2"], store["sAddress3"], store["sAddressCityTown"], store["sPostalCode"], store["sAddressType"]);
		}
		
		buildForm(tabpane, fieldnames, datanames, _dropdown, _dropdownnames, _textarea, values, descriptions);	
	}
	storesPage.prototype.buildTopLeftMediaArchiveDetails = function(tabpane, store, right) {
		var fieldlabel = APP.createElement(tabpane, "", "", "label");
		$(fieldlabel).html("Has this " + APP.page.whoAmI() + " been archived?");
		
		buildCheckbox(tabpane, "blsArchived", "Has this " + APP.page.whoAmI() + " been archived?", store == null? null : store["blsArchived"] != "0" ? "True" : null, "Yes", "No");
		
		var fieldnames = new Array("Archive Reason");
		var datanames = new Array("sArchivedReason");
		var descriptions = ["a Reason for archiving the " + APP.page.whoAmI() + ", can be left blank"];
		
		var _dropdown = [];
		var _dropdownnames = [""];
		var _textarea = [0];
		
		var values = null;
		if (store != null) {
			values = new Array(store["sArchivedReason"]);
		}
		
		buildForm(tabpane, fieldnames, datanames, _dropdown, _dropdownnames, _textarea, values, descriptions);	
	}
	storesPage.prototype.buildTopRightFilters = function() {
		var span6 = document.getElementById("top-2");
		$(span6).empty();
		
		//build form
		var block = APP.createElement(span6, "", "block");
		var navbar = APP.createElement(block, "", "navbar navbar-inner block-header");
		var mutedPullLeft = APP.createElement(navbar, "", "muted pull-left");
		
		$(mutedPullLeft).html("Did you know?");
		
		var label = APP.createElement(block, "", "did-you-know", "label");
		$(label).html("" + APP.page.whoAmIPlural() + " are used to separate the sales on the system. You can use the " + APP.page.whoAmI() + " that are added here to filter sales and see sales charts for these " + APP.page.whoAmIPlural() + "");
	}
	storesPage.prototype.buildBottomList = function (header) {
		var fieldnames = ["Store Name", "Store Description", "Store Contact Number", "Store Email", "Store City/Town"];
		var datanames = ["name", "sStoreDescription", "sStoreContactNumber", "sStoreEmail", "sAddressCityTown"];
		var lookups = [null];
		var resultset = APP.homePageResult["stores"];
		buildDatatableWizard(header, resultset, fieldnames, datanames, lookups);
	}	
	storesPage.prototype.buildTopRight = function() {
		APP.page.uuid = "";
		if (current_left == 1) {
			buildTopWizard("Add " + APP.page.whoAmI() + "", "", this.getFormContent(), null, null, "top-2");
		} else {
			buildTopWizard("Add " + APP.page.whoAmI() + "", "", this.getFormContent(), null, null, "top-3");
		}
		this.validate();
		initplugins();
	}
	storesPage.prototype.build = function() {
		APP.page.uuid="";
		APP.page.index = "";
		var contentbody = document.getElementById("contentBody");
		$(contentBody).empty();
		
		APP.buildContainer();
		buildTopWizard("Add " + APP.page.whoAmI() + "", "", this.getFormContent(), null, this.finishClicked);
		this.buildTopRightFilters();
		this.buildBottomList("List " + APP.page.whoAmIPlural() + "");
		this.validate();
		
		initplugins();		
		
		crumbs([{
			title:"" + APP.page.whoAmIPlural() + "",
		},{
			title:"Manage " + APP.page.whoAmIPlural() + ""
		}]);
	}
	storesPage.prototype.reset = function() {
		APP.page.uuid="";
		APP.page.index="";
		buildTopWizard("Add " + APP.page.whoAmI() + "", "", this.getFormContent(), null, this.finishClicked);
		$("#top-1").hide();
		$("#top-1").fadeIn('slow');
		APP.page.buildBottomList("List " + APP.page.whoAmIPlural() + "");	
		this.validate();
		initplugins();
	}
	storesPage.prototype.resetRight = function() {
		removeTab();
		initplugins();
	}
	storesPage.prototype.edit = function(e_id) {
		buildTopWizard("Edit " + APP.page.whoAmI() + "", "", this.getFormContent(), APP.homePageResult["stores"][$("#"+e_id)[0].id], this.finishClicked);
		APP.page.index = $("#"+e_id)[0].id;
		APP.page.uuid = APP.homePageResult["stores"][APP.page.index]["uid"];
		$("#top-1").hide();
		$("#top-1").fadeIn('slow');
		this.validate();
		initplugins();
	}
	storesPage.prototype.drop = function(e_id,rowElem,t_id) {
		APP.page.index = $("#"+e_id)[0].id;
		APP.page.uuid = APP.homePageResult["stores"][APP.page.index]["uid"];
		var postData = JSON.stringify(
		{
				"func" : "deleteStore",
				"pkStoreUID" : APP.page.uuid,
				"session_key" : APP.user.session_key
		});
		APP.callJSON(APP.url, postData, "POST", APP.page.deleteCallback);
	}
	storesPage.prototype.finishClicked = function(event) {
		if(validateForm("" + APP.page.whoAmI() + "wizardform"))
		{			
			var store = new Object();
			store["pkStoreUID"] = APP.page.uuid;
			store["sStoreName"] = $("#StoreName").val();
			store["sStoreDescription"] = $("#StoreDescription").val();
			store["sStoreContactNumber"] = $("#StoreContactNumber").val();
			store["sStoreEmail"] = $("#StoreEmail").val();
			store["sAddress1"] = $("#StoreAddressLine1").val();
			store["sAddress2"] = $("#StoreAddressLine2").val();
			store["sAddress3"] = $("#StoreAddressLine3").val();
			store["sAddressCityTown"] = $("#AddressCityTown").val();
			store["sPostalCode"] = $("#PostalCode").val();
			store["sAddressType"] = $("#AddressType").val();
			store["blsArchived"] = $("#blsArchived").is(':checked') ? 1 : null;
			store["sArchivedReason"] = $("#ArchiveReason").val();
			if(event.target != undefined)
			{
				switch(event.target.innerHTML)
				{
					case "Add":
					case "Update":
					{
						// call create store 
						var postData = JSON.stringify(
						{
								"func" : "addStore", 
								"store" : store,
								"session_key" : APP.user.session_key
						});
						APP.callJSON(APP.url, postData, "POST", APP.page.insertCallback);
						break;
					}
				}
			}
		}
	}
	storesPage.prototype.insertCallback = function(data, textStatus, request){
		if (httpMessage(data, "" + APP.page.whoAmI() + " added successfully", request, true)) {
			var ret_data = JSON.parse(data.responseText);
			APP.homePageResult["stores"] = ret_data["stores"];
			APP.page.reset();
			var postData = JSON.stringify(
			{
					"func" : "updateAllGenerics", 
					"session_key" : APP.user.session_key
			});
			APP.callJSON(APP.url, postData, "POST", APP.page.refreshCallback, true);
		}
    }
	storesPage.prototype.refreshCallback = function(data, textStatus, request){
		if (httpMessage(data, "")) {
			var ret_data = JSON.parse(data.responseText);
			APP.homePageResult["generics"] = ret_data["generics"];
		}
    }
	storesPage.prototype.deleteCallback = function(data, textStatus, request){
		if (httpMessage(data, "" + APP.page.whoAmI() + " successfully deleted", request, true)) {
			var ret_data = JSON.parse(data.responseText);
			APP.homePageResult["stores"] = ret_data["stores"];
			APP.page.reset();
			var postData = JSON.stringify(
			{
					"func" : "updateAllGenerics", 
					"session_key" : APP.user.session_key
			});
			APP.callJSON(APP.url, postData, "POST", APP.page.refreshCallback, true);
		}
	}
}
function mediaPage() {
	this.uuid = null;
	this.index = null;
	mediaPage.prototype.init = function() {
		var postData = JSON.stringify(
		{
			"func" : "getAllMedia",
			"session_key" : APP.user.session_key
		});
		
		APP.callJSON(APP.url, postData, "POST", APP.page.getAllMediaCallBackSuccess);	
	}
	mediaPage.prototype.getAllMediaCallBackSuccess = function(data, textStatus, request) {
		if (httpMessage(data, "")) {
			var ret_data = JSON.parse(data.responseText);
			APP.homePageResult["media"] = ret_data["media"];
			
			APP.page.build();
		}
	}
	mediaPage.prototype.whoAmI = function() {
		return "Media";
	}
	mediaPage.prototype.getFormContent = function() {
		return [this.buildTopLeftMedia, this.buildTopLeftMediaDetails, this.buildTopLeftMediaArchiveDetails];
	}
	mediaPage.prototype.buildTopLeftMedia = function(tabpane, media) {
		var fieldnames = new Array("Media Name","Media Description");
		var datanames = new Array("name","sMediaDescription");
		var descriptions = ["The Name of the Media", "a Description for the Media, can be left blank"];
		
		var _dropdown = [];
		var _dropdownnames = [""];
		var _textarea = [1];
		
		var values = null;
		if (media != null) {
			values = new Array(media["name"], media["sMediaDescription"]);
		}
		
		buildForm(tabpane, fieldnames, datanames, _dropdown, _dropdownnames, _textarea, values, descriptions);		
			
	}
	mediaPage.prototype.validate = function() {	
		$validator = $("#" + APP.page.whoAmI() + "wizardform").validate({
			ignore: ":not(.chzn-done):hidden",
			rules: {
				MediaName: {
					required: true,
					minlength: 3				
				},
				MediaGenre: {
					required: true,
					errorPlacement: function(error, element) {
						$(error).insertAfter("#MediaGenre_chzn");
					}
				},
				MediaChartCategory: {
					required: true,
					errorPlacement: function(error, element) {
						$(error).insertAfter("#MediaChartCategory_chzn");
					}
				}
			},
			messages: {
				MediaName: { 
					required: "Enter the Name of the media",
					minlength: "Enter at least 3 characters for the Media's Name"
				},
				MediaGenre: { 
					required: "Select media's Genre Type from the dropdown"
				},
				MediaChartCategory: { 
					required: "Select media's Chart Category from the dropdown"
				}
			}
		});
		$( "#MediaGenre" ).change(function(){
			$( "#MediaGenre" ).valid();
		});	
		$( "#MediaChartCategory" ).change(function(){
			$( "#MediaChartCategory" ).valid();
		});	
		
	}
	mediaPage.prototype.buildTopLeftMediaDetails = function(tabpane, media, right) {
		var fieldnames = new Array("Media Genre", "Media Chart Category");
		var datanames = new Array("Genre_fkGenreUID", "Chart_fkChartUID");
		var descriptions = ["The Genre to which the media belongs", "The Chart Category in which the media will be listed"];
		
		var _dropdown = new Array(0,1);
		var _dropdownnames = new Array("genres", "chart_categories");
		var _textarea = [];
		
		var values = null;
		if (media != null) {
			values = new Array(media["Genre_fkGenreUID"], media["Chart_fkChartUID"]);
		}
		
		buildForm(tabpane, fieldnames, datanames, _dropdown, _dropdownnames, _textarea, values, descriptions);
	}
	mediaPage.prototype.buildTopLeftMediaArchiveDetails = function(tabpane, media, right) {
		var fieldlabel = APP.createElement(tabpane, "", "", "label");
		$(fieldlabel).html("Has this " + APP.page.whoAmI() + " been archived?");
		
		console.log(media == null? null : media["blsArchived"]);
		
		buildCheckbox(tabpane, "blsArchived", "Has this " + APP.page.whoAmI() + " been archived?", media == null? null : media["blsArchived"] != "0" ? "True" : null, "Yes", "No");
		
		var fieldnames = new Array("Archive Reason");
		var datanames = new Array("sArchivedReason");
		var descriptions = ["a Reason for archiving the " + APP.page.whoAmI() + ", can be left blank"];
		
		var _dropdown = [];
		var _dropdownnames = [""];
		var _textarea = [0];
		
		var values = null;
		if (media != null) {
			values = new Array(media["sArchivedReason"]);
		}
		
		buildForm(tabpane, fieldnames, datanames, _dropdown, _dropdownnames, _textarea, values, descriptions);	
	}
	mediaPage.prototype.buildTopRightFilters = function() {
		var span6 = document.getElementById("top-2");
		$(span6).empty();
		
		//build form
		var block = APP.createElement(span6, "", "block");
		var navbar = APP.createElement(block, "", "navbar navbar-inner block-header");
		var mutedPullLeft = APP.createElement(navbar, "", "muted pull-left");
		$(mutedPullLeft).html("Filter Media");
		
		var blockContent = APP.createElement(block, "", "block-content collapse in overflowshow");
		var legend = APP.createElement(blockContent, "", "","legend");
		$(legend).html("Filter where clause");
		
		var filters = new Array("genres", "chart_categories");
		var fieldnames = new Array("Genre", "Chart Category");
		var filterColumns = new Array("Genre", "Chart Category");
		
		var roots = ["name", "name"];
		var placeholders = ["Select a Genre", "Select a Chart Category"];
		var callbacks = new Array(this.loadDTForFilters, this.loadDTForFilters);
		
		buildFilters(blockContent, filters, fieldnames, roots, placeholders, callbacks);
		
		initplugins();
	}
	mediaPage.prototype.buildBottomList = function (header) {
		var fieldnames = ["Media Name", "Media Description", "Genre", "Chart Category"];
		var datanames = ["name", "sMediaDescription", "Genre_fkGenreUID", "Chart_fkChartUID"];
		var lookups = [null,null,APP.homePageResult["genres"],APP.homePageResult["chart_categories"]];
		var resultset = APP.homePageResult["media"];
		buildDatatableWizard(header, resultset, fieldnames, datanames, lookups);
	}	
	mediaPage.prototype.buildTopRight = function() {
		APP.page.uuid = "";
		if (current_left == 1) {
			buildTopWizard("Add " + APP.page.whoAmI() + "", "", this.getFormContent(), null, null, "top-2");
		} else {
			buildTopWizard("Add " + APP.page.whoAmI() + "", "", this.getFormContent(), null, null, "top-3");
		}
		this.validate();
		initplugins();
	}
	mediaPage.prototype.build = function() {
		APP.page.uuid="";
		APP.page.index = "";
		var contentbody = document.getElementById("contentBody");
		$(contentBody).empty();
		
		APP.buildContainer();
		buildTopWizard("Add " + APP.page.whoAmI() + "", "", this.getFormContent(), null, this.finishClicked);
		this.buildTopRightFilters();
		this.buildBottomList("List " + APP.page.whoAmI() + "");
		this.validate();
		
		initplugins();		
		
		crumbs([{
			title:"Media",
		},{
			title:"Manage Media"
		}]);
	}
	mediaPage.prototype.reset = function() {
		APP.page.uuid="";
		APP.page.index="";
		buildTopWizard("Add " + APP.page.whoAmI() + "", "", this.getFormContent(), null, this.finishClicked);
		$("#top-1").hide();
		$("#top-1").fadeIn('slow');
		APP.page.buildBottomList("List " + APP.page.whoAmI() + "");	
		this.validate();
		initplugins();
	}
	mediaPage.prototype.resetRight = function() {
		removeTab();
		initplugins();
	}
	mediaPage.prototype.edit = function(e_id) {
		event.stopPropagation()
		buildTopWizard("Edit " + APP.page.whoAmI() + "", "", this.getFormContent(), APP.homePageResult["media"][$("#"+e_id)[0].id], this.finishClicked);
		APP.page.index = $("#"+e_id)[0].id;
		APP.page.uuid = APP.homePageResult["media"][APP.page.index]["uid"];
		$("#top-1").hide();
		$("#top-1").fadeIn('slow');
		this.validate();
		initplugins();
	}
	mediaPage.prototype.drop = function(e_id,rowElem,t_id) {
		APP.page.index = $("#"+e_id)[0].id;
		APP.page.uuid = APP.homePageResult["media"][APP.page.index]["uid"];
		var postData = JSON.stringify(
		{
				"func" : "deleteMedia",
				"pkMediaUID" : APP.page.uuid,
				"session_key" : APP.user.session_key
		});
		APP.callJSON(APP.url, postData, "POST", APP.page.deleteCallback);
	}
	mediaPage.prototype.finishClicked = function(event) {
		if(validateForm("" + APP.page.whoAmI() + "wizardform"))
		{			
			var media = new Object();
			media["pkMediaUID"] = APP.page.uuid;
			media["sMediaName"] = $("#MediaName").val();
			media["sMediaDescription"] = $("#MediaDescription").val();
			media["Genre_fkGenreUID"] = $("#MediaGenre").val();
			media["Chart_fkChartUID"] = $("#MediaChartCategory").val();
			media["blsArchived"] = $("#blsArchived").is(':checked') ? 1 : null;
			media["sArchivedReason"] = $("#ArchiveReason").val();
			if(event.target != undefined)
			{
				switch(event.target.innerHTML)
				{
					case "Add":
					case "Update":
					{
						// call create media 
						var postData = JSON.stringify(
						{
								"func" : "addMedia", 
								"media" : media,
								"session_key" : APP.user.session_key
						});
						APP.callJSON(APP.url, postData, "POST", APP.page.insertCallback);
						break;
					}
				}
			}
		}
	}
	mediaPage.prototype.insertCallback = function(data, textStatus, request){
		if (httpMessage(data, "Media added successfully", request, true)) {
			var ret_data = JSON.parse(data.responseText);
			APP.homePageResult["media"] = ret_data["media"];
			APP.page.reset();
			var postData = JSON.stringify(
			{
					"func" : "updateAllGenerics", 
					"session_key" : APP.user.session_key
			});
			APP.callJSON(APP.url, postData, "POST", APP.page.refreshCallback, true);
		}
    }
	mediaPage.prototype.refreshCallback = function(data, textStatus, request){
		if (httpMessage(data, "")) {
			var ret_data = JSON.parse(data.responseText);
			APP.homePageResult["generics"] = ret_data["generics"];
		}
    }
	mediaPage.prototype.setCallback = function(data, textStatus, request){
		if (httpMessage(data, "")) {
			var ret_data = JSON.parse(data.responseText);
			APP.homePageResult["media"] = ret_data["media"];
			APP.page.buildBottomList("List Media");			
		}
	}
	mediaPage.prototype.deleteCallback = function(data, textStatus, request){
		if (httpMessage(data, "Media successfully deleted", request, true)) {
			var ret_data = JSON.parse(data.responseText);
			APP.homePageResult["media"] = ret_data["media"];
			APP.page.reset();
			var postData = JSON.stringify(
			{
					"func" : "updateAllGenerics", 
					"session_key" : APP.user.session_key
			});
			APP.callJSON(APP.url, postData, "POST", APP.page.refreshCallback, true);
		}
	}
	mediaPage.prototype.loadDTForFilters = function () {
		var genre = $("#genres").val();
		var chart = $("#chart_categories").val();
		
		var postData = JSON.stringify(
		{
				"func" : "getMediaByFilter", 
				"genre": genre,
				"chart": chart,
				"session_key" : APP.user.session_key
		});
		APP.callJSON(APP.url, postData, "POST", APP.page.setCallback, false);
	}
}
function categoriesPage(){
	this.uuid = null;
	this.index = null;
	categoriesPage.prototype.whoAmI = function() {
		return "Category";
	}
	categoriesPage.prototype.whoAmIPlural = function() {
		return "Categories";
	}
	categoriesPage.prototype.getFormContent = function() {
		return [this.buildTopLeftCategories, this.buildTopLeftCategoriesArchiveDetails];
	}
	categoriesPage.prototype.buildTopLeftCategories = function(tabpane, category) {
		var fieldnames = new Array("Chart Category Name");
		var datanames = new Array("name");
		var descriptions = ["The name of the chart category"];
		
		var _dropdown = [];
		var _dropdownnames = [""];
		var _textarea = [];
		
		var values = null;
		if (category != null) {
			values = new Array(category["name"]);
		}
		
		buildForm(tabpane, fieldnames, datanames, _dropdown, _dropdownnames, _textarea, values, descriptions);		
			
	}
	categoriesPage.prototype.validate = function() {	
		$validator = $("#" + APP.page.whoAmI() + "wizardform").validate({
			ignore: ":not(.chzn-done):hidden",
			rules: {
				ChartCategoryName: {
					required: true,
					minlength: 2				
				}
			},
			messages: {
				ChartCategoryName: { 
					required: "Enter the name of the Chart Category",
					minlength: "Enter at least 2 characters for the Categories Chart Name"
				}
			}
		});
		
	}
	categoriesPage.prototype.buildTopLeftCategoriesArchiveDetails = function(tabpane, category, right) {
		var fieldlabel = APP.createElement(tabpane, "", "", "label");
		$(fieldlabel).html("Has this " + APP.page.whoAmI() + " been archived?");
		
		buildCheckbox(tabpane, "blsArchived", "Has this " + APP.page.whoAmI() + " been archived?", category == null? null : category["blsArchived"] != "0" ? "True" : null, "Yes", "No");
		
		var fieldnames = new Array("Archive Reason");
		var datanames = new Array("sArchivedReason");
		var descriptions = ["a Reason for archiving the " + APP.page.whoAmI() + ", can be left blank"];
		
		var _dropdown = [];
		var _dropdownnames = [""];
		var _textarea = [0];
		
		var values = null;
		if (category != null) {
			values = new Array(category["sArchivedReason"]);
		}
		
		buildForm(tabpane, fieldnames, datanames, _dropdown, _dropdownnames, _textarea, values, descriptions);	
	}
	categoriesPage.prototype.buildTopRightFilters = function() {
		var span6 = document.getElementById("top-2");
		$(span6).empty();
		
		//build form
		var block = APP.createElement(span6, "", "block");
		var navbar = APP.createElement(block, "", "navbar navbar-inner block-header");
		var mutedPullLeft = APP.createElement(navbar, "", "muted pull-left");
		
		$(mutedPullLeft).html("Did you know?");
		
		var label = APP.createElement(block, "", "did-you-know", "label");
		$(label).html("" + APP.page.whoAmIPlural() + " are used to separate the sales when generating charts. By adding a " + APP.page.whoAmI() + " you will be able to assign media to this chart " + APP.page.whoAmI() + ".");
		
	}
	categoriesPage.prototype.buildBottomList = function (header) {
		var fieldnames = ["Category Chart Name"];
		var datanames = ["name"];
		var lookups = [null];
		var resultset = APP.homePageResult["chart_categories"];
		buildDatatableWizard(header, resultset, fieldnames, datanames, lookups);
	}	
	categoriesPage.prototype.buildTopRight = function() {
		APP.page.uuid = "";
		if (current_left == 1) {
			buildTopWizard("Add " + APP.page.whoAmI() + "", "", this.getFormContent(), null, null, "top-2");
		} else {
			buildTopWizard("Add " + APP.page.whoAmI() + "", "", this.getFormContent(), null, null, "top-3");
		}
		this.validate();
		initplugins();
	}
	categoriesPage.prototype.build = function() {
		APP.page.uuid="";
		APP.page.index = "";
		var contentbody = document.getElementById("contentBody");
		$(contentBody).empty();
		
		APP.buildContainer();
		buildTopWizard("Add " + APP.page.whoAmI() + "", "", this.getFormContent(), null, this.finishClicked);
		this.buildTopRightFilters();
		this.buildBottomList("List " + APP.page.whoAmIPlural() + "");
		this.validate();
		
		initplugins();		
		
		crumbs([{
			title:"" + APP.page.whoAmIPlural() + "",
		},{
			title:"Manage Chart " + APP.page.whoAmIPlural() + ""
		}]);
	}
	categoriesPage.prototype.reset = function() {
		APP.page.uuid="";
		APP.page.index="";
		buildTopWizard("Add " + APP.page.whoAmI() + "", "", this.getFormContent(), null, this.finishClicked);
		$("#top-1").hide();
		$("#top-1").fadeIn('slow');
		APP.page.buildBottomList("List " + APP.page.whoAmIPlural() + "");	
		this.validate();
		initplugins();
	}
	categoriesPage.prototype.resetRight = function() {
		removeTab();
		initplugins();
	}
	categoriesPage.prototype.edit = function(e_id) {
		buildTopWizard("Edit " + APP.page.whoAmI() + "", "", this.getFormContent(), APP.homePageResult["chart_categories"][$("#"+e_id)[0].id], this.finishClicked);
		APP.page.index = $("#"+e_id)[0].id;
		APP.page.uuid = APP.homePageResult["chart_categories"][APP.page.index]["uid"];
		$("#top-1").hide();
		$("#top-1").fadeIn('slow');
		this.validate();
		initplugins();
	}
	categoriesPage.prototype.drop = function(e_id,rowElem,t_id) {
		APP.page.index = $("#"+e_id)[0].id;
		APP.page.uuid = APP.homePageResult["chart_categories"][APP.page.index]["uid"];
		var postData = JSON.stringify(
		{
				"func" : "deleteChartCategory",
				"pkChartCatUID" : APP.page.uuid,
				"session_key" : APP.user.session_key
		});
		APP.callJSON(APP.url, postData, "POST", APP.page.deleteCallback);
	}
	categoriesPage.prototype.finishClicked = function(event) {
		if(validateForm("" + APP.page.whoAmI() + "wizardform"))
		{			
			var chartCategory = new Object();
			chartCategory["pkChartCatUID"] = APP.page.uuid;
			chartCategory["sChartCategory"] = $("#ChartCategoryName").val();
			chartCategory["blsArchived"] = $("#blsArchived").is(':checked') ? 1 : null;
			chartCategory["sArchivedReason"] = $("#ArchiveReason").val();
			if(event.target != undefined)
			{
				switch(event.target.innerHTML)
				{
					case "Add":
					case "Update":
					{
						// call create chartCategory 
						var postData = JSON.stringify(
						{
								"func" : "addChartCategory", 
								"chartCategory" : chartCategory,
								"session_key" : APP.user.session_key
						});
						APP.callJSON(APP.url, postData, "POST", APP.page.insertCallback);
						break;
					}
				}
			}
		}
	}
	categoriesPage.prototype.insertCallback = function(data, textStatus, request){
		if (httpMessage(data, "" + APP.page.whoAmI() + " added successfully", request, true)) {
			var ret_data = JSON.parse(data.responseText);
			APP.homePageResult["chart_categories"] = ret_data["chart_categories"];
			APP.page.reset();
			var postData = JSON.stringify(
			{
					"func" : "updateAllGenerics", 
					"session_key" : APP.user.session_key
			});
			APP.callJSON(APP.url, postData, "POST", APP.page.refreshCallback, true);
		}
    }
	categoriesPage.prototype.refreshCallback = function(data, textStatus, request){
		if (httpMessage(data, "")) {
			var ret_data = JSON.parse(data.responseText);
			APP.homePageResult["generics"] = ret_data["generics"];
		}
    }
	categoriesPage.prototype.deleteCallback = function(data, textStatus, request){
		if (httpMessage(data, "" + APP.page.whoAmI() + " successfully deleted", request, true)) {
			var ret_data = JSON.parse(data.responseText);
			APP.homePageResult["chart_categories"] = ret_data["chart_categories"];
			APP.page.reset();
			var postData = JSON.stringify(
			{
					"func" : "updateAllGenerics", 
					"session_key" : APP.user.session_key
			});
			APP.callJSON(APP.url, postData, "POST", APP.page.refreshCallback, true);
		}
	}
}
function genresPage(){
	this.uuid = null;
	this.index = null;
	genresPage.prototype.whoAmI = function() {
		return "Genre";
	}
	genresPage.prototype.whoAmIPlural = function() {
		return "Genres";
	}
	genresPage.prototype.getFormContent = function() {
		return [this.buildTopLeftCategories, this.buildTopLeftCategoriesArchiveDetails];
	}
	genresPage.prototype.buildTopLeftCategories = function(tabpane, genre) {
		var fieldnames = new Array("Genre Name", "Genre Description");
		var datanames = new Array("name", "sGenreDesc");
		var descriptions = ["The name of the Genre", "A description for the Genre"];
		
		var _dropdown = [];
		var _dropdownnames = [""];
		var _textarea = [1];
		
		var values = null;
		if (genre != null) {
			values = new Array(genre["name"]);
		}
		
		buildForm(tabpane, fieldnames, datanames, _dropdown, _dropdownnames, _textarea, values, descriptions);		
			
	}
	genresPage.prototype.validate = function() {	
		$validator = $("#" + APP.page.whoAmI() + "wizardform").validate({
			ignore: ":not(.chzn-done):hidden",
			rules: {
				GenreName: {
					required: true,
					minlength: 2				
				}
			},
			messages: {
				GenreName: { 
					required: "Enter the name of the Genre",
					minlength: "Enter at least 2 characters for the Genre"
				}
			}
		});
		
	}
	genresPage.prototype.buildTopLeftCategoriesArchiveDetails = function(tabpane, genre, right) {
		var fieldlabel = APP.createElement(tabpane, "", "", "label");
		$(fieldlabel).html("Has this " + APP.page.whoAmI() + " been archived?");
		
		buildCheckbox(tabpane, "blsArchived", "Has this " + APP.page.whoAmI() + " been archived?", genre == null? null : genre["blsArchived"] != "0" ? "True" : null, "Yes", "No");
		
		var fieldnames = new Array("Archive Reason");
		var datanames = new Array("sArchivedReason");
		var descriptions = ["a Reason for archiving the " + APP.page.whoAmI() + ", can be left blank"];
		
		var _dropdown = [];
		var _dropdownnames = [""];
		var _textarea = [0];
		
		var values = null;
		if (genre != null) {
			values = new Array(genre["sArchivedReason"]);
		}
		
		buildForm(tabpane, fieldnames, datanames, _dropdown, _dropdownnames, _textarea, values, descriptions);	
	}
	genresPage.prototype.buildTopRightFilters = function() {
		var span6 = document.getElementById("top-2");
		$(span6).empty();
		
		//build form
		var block = APP.createElement(span6, "", "block");
		var navbar = APP.createElement(block, "", "navbar navbar-inner block-header");
		var mutedPullLeft = APP.createElement(navbar, "", "muted pull-left");
		
		$(mutedPullLeft).html("Did you know?");
		
		var label = APP.createElement(block, "", "did-you-know", "label");
		$(label).html("" + APP.page.whoAmIPlural() + " are used to separate the sales when generating charts. By adding a " + APP.page.whoAmI() + " you will be able to assign media to this chart " + APP.page.whoAmI() + ".");
		
	}
	genresPage.prototype.buildBottomList = function (header) {
		var fieldnames = ["Genre Name", "Genre Description"];
		var datanames = ["name", "sGenreDesc"];
		var lookups = [null];
		var resultset = APP.homePageResult["genres"];
		buildDatatableWizard(header, resultset, fieldnames, datanames, lookups);
	}	
	genresPage.prototype.buildTopRight = function() {
		APP.page.uuid = "";
		if (current_left == 1) {
			buildTopWizard("Add " + APP.page.whoAmI() + "", "", this.getFormContent(), null, null, "top-2");
		} else {
			buildTopWizard("Add " + APP.page.whoAmI() + "", "", this.getFormContent(), null, null, "top-3");
		}
		this.validate();
		initplugins();
	}
	genresPage.prototype.build = function() {
		APP.page.uuid="";
		APP.page.index = "";
		var contentbody = document.getElementById("contentBody");
		$(contentBody).empty();
		
		APP.buildContainer();
		buildTopWizard("Add " + APP.page.whoAmI() + "", "", this.getFormContent(), null, this.finishClicked);
		this.buildTopRightFilters();
		this.buildBottomList("List " + APP.page.whoAmIPlural() + "");
		this.validate();
		
		initplugins();		
		
		crumbs([{
			title:"" + APP.page.whoAmIPlural() + "",
		},{
			title:"Manage " + APP.page.whoAmIPlural() + ""
		}]);
	}
	genresPage.prototype.reset = function() {
		APP.page.uuid="";
		APP.page.index="";
		buildTopWizard("Add " + APP.page.whoAmI() + "", "", this.getFormContent(), null, this.finishClicked);
		$("#top-1").hide();
		$("#top-1").fadeIn('slow');
		APP.page.buildBottomList("List " + APP.page.whoAmIPlural() + "");	
		this.validate();
		initplugins();
	}
	genresPage.prototype.resetRight = function() {
		removeTab();
		initplugins();
	}
	genresPage.prototype.edit = function(e_id) {
		buildTopWizard("Edit " + APP.page.whoAmI() + "", "", this.getFormContent(), APP.homePageResult["genres"][$("#"+e_id)[0].id], this.finishClicked);
		APP.page.index = $("#"+e_id)[0].id;
		APP.page.uuid = APP.homePageResult["genres"][APP.page.index]["uid"];
		$("#top-1").hide();
		$("#top-1").fadeIn('slow');
		this.validate();
		initplugins();
	}
	genresPage.prototype.drop = function(e_id,rowElem,t_id) {
		APP.page.index = $("#"+e_id)[0].id;
		APP.page.uuid = APP.homePageResult["genres"][APP.page.index]["uid"];
		var postData = JSON.stringify(
		{
				"func" : "deleteGenre",
				"pkGenreUID" : APP.page.uuid,
				"session_key" : APP.user.session_key
		});
		APP.callJSON(APP.url, postData, "POST", APP.page.deleteCallback);
	}
	genresPage.prototype.finishClicked = function(event) {
		if(validateForm("" + APP.page.whoAmI() + "wizardform"))
		{			
			var genre = new Object();
			genre["pkGenreUID"] = APP.page.uuid;
			genre["sGenreName"] = $("#GenreName").val();
			genre["sGenreDesc"] = $("#GenreDescription").val();
			genre["blsArchived"] = $("#blsArchived").is(':checked') ? 1 : null;
			genre["sArchivedReason"] = $("#ArchiveReason").val();

			if(event.target != undefined)
			{
				switch(event.target.innerHTML)
				{
					case "Add":
					case "Update":
					{
						// call create genre 
						var postData = JSON.stringify(
						{
								"func" : "addGenre", 
								"genre" : genre,
								"session_key" : APP.user.session_key
						});
						APP.callJSON(APP.url, postData, "POST", APP.page.insertCallback);
						break;
					}
				}
			}
		}
	}
	genresPage.prototype.insertCallback = function(data, textStatus, request){
		if (httpMessage(data, "" + APP.page.whoAmI() + " added successfully", request, true)) {
			var ret_data = JSON.parse(data.responseText);
			APP.homePageResult["genres"] = ret_data["genres"];
			APP.page.reset();
			var postData = JSON.stringify(
			{
					"func" : "updateAllGenerics", 
					"session_key" : APP.user.session_key
			});
			APP.callJSON(APP.url, postData, "POST", APP.page.refreshCallback, true);
		}
    }
	genresPage.prototype.refreshCallback = function(data, textStatus, request){
		if (httpMessage(data, "")) {
			var ret_data = JSON.parse(data.responseText);
			APP.homePageResult["generics"] = ret_data["generics"];
		}
    }
	genresPage.prototype.deleteCallback = function(data, textStatus, request){
		if (httpMessage(data, "" + APP.page.whoAmI() + " successfully deleted", request, true)) {
			var ret_data = JSON.parse(data.responseText);
			APP.homePageResult["genres"] = ret_data["genres"];
			APP.page.reset();
			var postData = JSON.stringify(
			{
					"func" : "updateAllGenerics", 
					"session_key" : APP.user.session_key
			});
			APP.callJSON(APP.url, postData, "POST", APP.page.refreshCallback, true);
		}
	}
}
function usersPage(){
	this.uuid = null;
	this.index = null;
	usersPage.prototype.whoAmI = function() {
		return "User";
	}
	usersPage.prototype.whoAmIPlural = function() {
		return "Users";
	}
	usersPage.prototype.getFormContent = function() {
		return [this.buildTopLeftUser];
	}
	usersPage.prototype.buildTopLeftUser = function(tabpane, user) {
		var fieldnames = new Array("First Name", "Last Name","Email Address","Password", "Contact Number", "User Group");
		var datanames = new Array("sUserFirstName", "sUserLastName","sUserEmail","sUserPassword", "sUserContactNumber", "UserGroup_fkUserGroupUID");
		var descriptions = ["The First Name(s) of the user", "The Last Name of the user", "The Email Address of the user", "The Password to be used by the user", "The Contact Number for the user", "User group to which the user belongs"];
		var _dropdown = new Array(5,6);
		var _dropdownnames = new Array("user_groups");
		var _textarea = [];
		
		var values = null;
		if (user != null) {
			values = new Array(user["sUserFirstName"],user["sUserLastName"],user["sUserEmail"],user["sUserPassword"],user["sUserContactNumber"],user["UserGroup_fkUserGroupUID"]);
		}
		
		buildForm(tabpane, fieldnames, datanames, _dropdown, _dropdownnames, _textarea, values, descriptions);
	}
	usersPage.prototype.validate = function() {
		$validator = $("#" + APP.page.whoAmI() + "wizardform").validate({
			ignore: ":not(.chzn-done):hidden",
			rules: {
				FirstName: {
					required: true,
					minlength: 3
				},
				LastName: {
					required: true,
					minlength: 3
				},
				EmailAddress: {
					required: true,
					email: true
				},
				Password: {
					required: true
				},
				UserGroup: {
					required: true,
					errorPlacement: function(error, element) {
						$(error).insertAfter("#UserGroup_chzn");
					}
				}
			},
			messages: {
				FirstName: {
					required: "Enter the First Name of the user",
					minlength: "Enter at least 3 characters for the User's Name"
				},
				LastName: {
					required: "Enter the Last Name of the user",
					minlength: "Enter at least 3 characters for the User's Last Name"
				},
				EmailAddress: {
					required: "Enter the Email Address for the user",
					email: "The Email Address supplied was invalid"
				},
				Password: {
					required: "Enter a Password for the user"
				},				
				UserGroup: { 
					required: "Select user's User Group from the dropdown"
				}
			}
		});
		
		$( "#UserGroup" ).change(function(){
			$( "#UserGroup" ).valid();
		});	
	}
	usersPage.prototype.buildTopRightFilters = function() {
		var span6 = document.getElementById("top-2");
		$(span6).empty();
		
		//build form
		var block = APP.createElement(span6, "", "block");
		var navbar = APP.createElement(block, "", "navbar navbar-inner block-header");
		var mutedPullLeft = APP.createElement(navbar, "", "muted pull-left");
		
		$(mutedPullLeft).html("Did you know?");
		
		var label = APP.createElement(block, "", "did-you-know", "label");
		$(label).html("User profiles are used to gain access to the system. When you add a user here you will be able to log in with that user and perform all the actions you desire");
	}
	usersPage.prototype.buildBottomList = function (header) {
		var fieldnames = new Array("First Name", "Last Name", "Email Address", "Contact Number", "User Group");
		var datanames = new Array("sUserFirstName", "sUserLastName", "sUserEmail", "sUserContactNumber", "UserGroup_fkUserGroupUID");
		var lookups = [null,null,null, null,APP.homePageResult["user_groups"]];
		var resultset = APP.homePageResult["users"];
		buildDatatableWizard(header, resultset, fieldnames, datanames, lookups);
	}
	usersPage.prototype.build = function() {
		var contentbody = document.getElementById("contentBody");
		$(contentBody).empty();
		
		APP.buildContainer();
		
		buildTopWizard("Add " + APP.page.whoAmI() + "", "", this.getFormContent(), null, this.finishClicked);
		this.buildTopRightFilters();
		this.buildBottomList("List " + APP.page.whoAmIPlural() + "");
		this.validate();
		
		initplugins();

		crumbs([{
			title:"" + APP.page.whoAmIPlural() + "",
		},{
			title:"Manage " + APP.page.whoAmIPlural() + ""
		}]);
		
	}
	usersPage.prototype.reset = function() {
		APP.page.uuid="";
		APP.page.index="";
		buildTopWizard("Add " + APP.page.whoAmI() + "", "", this.getFormContent(), null, this.finishClicked);
		$("#top-1").hide();
		$("#top-1").fadeIn('slow');
		APP.page.buildBottomList("List " + APP.page.whoAmI() + "");	
		this.validate();
		initplugins();
	}
	usersPage.prototype.edit = function(e_id) {
		buildTopWizard("Edit " + APP.page.whoAmI() + "", "", this.getFormContent(), APP.homePageResult["users"][$("#"+e_id)[0].id], this.finishClicked);
		APP.page.index = $("#"+e_id)[0].id;
		APP.page.uuid = APP.homePageResult["users"][APP.page.index]["uid"];
		$("#top-1").hide();
		$("#top-1").fadeIn('slow');
		this.validate();
		initplugins();
	}
	usersPage.prototype.drop = function(e_id,rowElem,t_id) {
		APP.page.index = $("#"+e_id)[0].id;
		APP.page.uuid = APP.homePageResult["users"][APP.page.index]["uid"];
		var postData = JSON.stringify(
		{
				"func" : "deleteUser",
				"pkUserUID" : APP.page.uuid,
				"session_key" : APP.user.session_key
		});
		APP.callJSON(APP.url, postData, "POST", APP.page.deleteUserCallback);
	}
	usersPage.prototype.deleteUserCallback = function(data, textStatus, request){
		if (httpMessage(data, "" + APP.page.whoAmI() + " successfully deleted", request, true)) {
			var ret_data = JSON.parse(data.responseText);
			APP.homePageResult["users"] = ret_data["users"];
			APP.page.reset();
			var postData = JSON.stringify(
			{
					"func" : "updateAllGenerics", 
					"session_key" : APP.user.session_key
			});
			APP.callJSON(APP.url, postData, "POST", APP.page.refreshCallback, true);
		}
	}
	usersPage.prototype.finishClicked = function(event) {
		if(validateForm("" + APP.page.whoAmI() + "wizardform"))
		{
			var user = new Object();
			user["pkUserUID"] = APP.page.uuid;
			user["sUserFirstName"] = $("#FirstName").val();
			user["sUserLastName"] = $("#LastName").val();
			user["sUserEmail"] = $("#EmailAddress").val();
			user["sUserPassword"] = $("#Password").val();
			user["sUserContactNumber"] = $("#ContactNumber").val();
			user["UserGroup_fkUserGroupUID"] = $("#UserGroup").val();
			
			if(event.target != undefined)
			{
				switch(event.target.innerHTML)
				{
					case "Add":
					case "Update":
					{
						// call create users 
						var postData = JSON.stringify(
						{
								"func" : "addUser", 
								"user" : user,
								"session_key" : APP.user.session_key
						});
						APP.callJSON(APP.url, postData, "POST", APP.page.insertCallback);
						break;
					}
				}
			}
		}		
	}
	usersPage.prototype.insertCallback = function(data, textStatus, request){
		if (httpMessage(data, "" + APP.page.whoAmI() + " added successfully", request, true)) {
			var ret_data = JSON.parse(data.responseText);
			APP.homePageResult["users"] = ret_data["users"];
			APP.page.reset();
			var postData = JSON.stringify(
			{
					"func" : "updateAllGenerics", 
					"session_key" : APP.user.session_key
			});
			APP.callJSON(APP.url, postData, "POST", APP.page.refreshCallback, true);
		}
    }
	usersPage.prototype.refreshCallback = function(data, textStatus, request){
		if (httpMessage(data, "")) {
			var ret_data = JSON.parse(data.responseText);
			APP.homePageResult["generics"] = ret_data["generics"];
		}
    }
}
function chartsOverviewPage(){
	chartsOverviewPage.prototype.init = function() {
		var postData = JSON.stringify(
		{
			"func" : "getPieChartData",
			"session_key" : APP.user.session_key
		});
		
		APP.callJSON(APP.url, postData, "POST", APP.page.getPieChartDataCallBackSuccess);	
	}
	chartsOverviewPage.prototype.getPieChartDataCallBackSuccess = function(data, textStatus, request) {
		if (httpMessage(data, "")) {
			APP.homePageResult["sales_data"] = JSON.parse(data.responseText);
			
			var postData = JSON.stringify(
			{
				"func" : "getPieChartCategoryDrilldown",
				"session_key" : APP.user.session_key
			});
			
			APP.callJSON(APP.url, postData, "POST", APP.page.getPieChartCategoryDrilldownCallBackSuccess);
		}
	}
	chartsOverviewPage.prototype.getPieChartCategoryDrilldownCallBackSuccess = function(data, textStatus, request) {
		if (httpMessage(data, "")) {
			APP.homePageResult["sales_data"]["category_drilldown"] =[]
			APP.homePageResult["sales_data"]["category_drilldown"] = JSON.parse(data.responseText);
			
			var postData = JSON.stringify(
			{
				"func" : "getPieChartGenreDrilldown",
				"session_key" : APP.user.session_key
			});
			
			APP.callJSON(APP.url, postData, "POST", APP.page.getPieChartGenreDrilldownCallBackSuccess);	
		}
	}
	chartsOverviewPage.prototype.getPieChartGenreDrilldownCallBackSuccess = function(data, textStatus, request) {
		if (httpMessage(data, "")) {
			APP.homePageResult["sales_data"]["genre_drilldown"] = []
			APP.homePageResult["sales_data"]["genre_drilldown"] = JSON.parse(data.responseText);
			
			APP.page.build();
		}
	}
	chartsOverviewPage.prototype.buildTopLeft = function(){
		var span6 = document.getElementById("top-1");
		$(span6).empty();
		
		//build form
		var block = APP.createElement(span6, "", "block");
		var navbar = APP.createElement(block, "", "navbar navbar-inner block-header");
		var mutedPullLeft = APP.createElement(navbar, "", "muted pull-left");
		$(mutedPullLeft).html("Sales per Store for the last 7 days");

		var storeSalesChart = APP.createElement(block, "storeSalesChart", "chart-size");

		var total_copies_sold = APP.homePageResult.generics.total_copies_sold;
		var _data = [];

		for(i=0; i < APP.homePageResult["sales_data"]["stores_chart"].length; i++){
			var item = APP.homePageResult["sales_data"]["stores_chart"][i];
			var store_object = new Object();
			store_object["name"] = item.name;
			store_object["TotalSales"] = item.TotalSales;
			store_object["y"] = Math.floor((item.TotalSales / total_copies_sold) * 100);
            _data.push(store_object);		
		}

		$('#storeSalesChart').highcharts({
	        chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: 0,
	            plotShadow: false
	        },
			credits:{
				enabled: false
			},
	        title: {
	            text: 'Store<br>Sales',
	            align: 'center',
	            verticalAlign: 'middle',
	            y: 50
	        },
	        tooltip: {
	            formatter: function () {
	                    return this.point.name + " - Total Sales: " + this.point.TotalSales;
	                },
				style: {
					color: '#333333',
					fontSize: '16px',
					padding: '8px'
				}
	        },
	        plotOptions: {
	            pie: {
	                dataLabels: {
	                    enabled: true,
						style: {"color": "#606060", "fontSize": "14px"}
	                },
	                startAngle: -90,
	                endAngle: 90,
					center: ['50%', '75%']
	            }
	        },
	        series: [{
	            type: 'pie',
	            name: 'Store sales',
	            innerSize: '50%',
	            dataLabels: {
	                formatter: function () {
	                    return this.point.name + ":<br/> " + this.y + "%";
	                }
	            },
	            data: _data
	        }]
	    });
	}
	chartsOverviewPage.prototype.buildTopRight = function(){
		var span4 = document.getElementById("top-2");
		$(span4).empty();
		
		//build form
		var block = APP.createElement(span4, "", "block");
		var navbar = APP.createElement(block, "", "navbar navbar-inner block-header");
		var mutedPullLeft = APP.createElement(navbar, "", "muted pull-left");
		$(mutedPullLeft).html("Top 10 Media for the last 7 days");
		
		var top10Container = APP.createElement(block, "", "top10Container");

		if(APP.homePageResult["sales_data"]["media_data"].length > 0){
			for(i=0; i < APP.homePageResult["sales_data"]["media_data"].length; i++){				
				var item = APP.homePageResult["sales_data"]["media_data"][i];				
				var weeklyUpdateItem = APP.createElement(top10Container, "", "media-body well well-small");	
				var icon = APP.createElement(weeklyUpdateItem, "", "icon icon-music", "span");			
				$(weeklyUpdateItem).append("<strong>" + item.name + "</strong> - Total Sales: <strong>" + item.CopiesSold + "</strong> <i class='pull-right'>" + item.genreName + "</i>.");
			}	
			
		}
	}
	chartsOverviewPage.prototype.buildLeftMiddle = function(){
		var span6 = document.getElementById("middle-1");
		$(span6).empty();
		
		//build form
		var block = APP.createElement(span6, "", "block");
		var navbar = APP.createElement(block, "", "navbar navbar-inner block-header");
		var mutedPullLeft = APP.createElement(navbar, "", "muted pull-left");
		$(mutedPullLeft).html("Sales per Category for the last 7 days");

		var categorySalesChart = APP.createElement(block, "categorySalesChart", "chart-size");

		var total_copies_sold = APP.homePageResult.generics.total_copies_sold;
		var _data = [];

		for(i=0; i < APP.homePageResult["sales_data"]["category_data"].length; i++){
			var item = APP.homePageResult["sales_data"]["category_data"][i];
			var cat_object = new Object();
			cat_object["name"] = item.name;
			cat_object["TotalSales"] = item.TotalSales;
			cat_object["y"] = Math.floor((item.TotalSales / total_copies_sold) * 100);
            _data.push(cat_object);		
		}

		$('#categorySalesChart').highcharts({
	        chart: {
                type: 'pie'
            },
			credits:{
				enabled: false
			},
			title: {
				text: null
			},
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}: {point.y:.1f}%',
						style: {"color": "#606060", "fontSize": "14px"}
                    }
                }
            },
            tooltip: {
                formatter: function () {
	                    return this.point.name + " - Total Sales: " + this.point.TotalSales;
	                },
				style: {
					color: '#333333',
					fontSize: '16px',
					padding: '8px'
				}
            },
	        series: [{
	            name: 'Category Sales by Store',
	            colorByPoint: true,
	            data: _data
	        }]
	    });
	}
	chartsOverviewPage.prototype.buildRightMiddle = function(){
		var span6 = document.getElementById("middle-2");
		$(span6).empty();
		
		//build form
		var block = APP.createElement(span6, "", "block");
		var navbar = APP.createElement(block, "", "navbar navbar-inner block-header");
		var mutedPullLeft = APP.createElement(navbar, "", "muted pull-left");
		$(mutedPullLeft).html("Sales per Genre for the last 7 days");

		var genreSalesChart = APP.createElement(block, "genreSalesChart", "chart-size");

		var total_copies_sold = APP.homePageResult.generics.total_copies_sold;
		var _data = [];

		for(i=0; i < APP.homePageResult["sales_data"]["genre_data"].length; i++){
			var item = APP.homePageResult["sales_data"]["genre_data"][i];
			var gen_object = new Object();
			gen_object["name"] = item.name;
			gen_object["TotalSales"] = item.TotalSales;
			gen_object["y"] = Math.floor((item.TotalSales / total_copies_sold) * 100);
            _data.push(gen_object);		
		}

		$('#genreSalesChart').highcharts({
	        chart: {
                type: 'pie'
            },
			credits:{
				enabled: false
			},
			title: {
				text: null
			},
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}: {point.y:.1f}%',
						style: {"color": "#606060", "fontSize": "14px"}
                    }
                }
            },
            tooltip: {
                formatter: function () {
	                    return this.point.name + " - Total Sales: " + this.point.TotalSales;
	                },
				style: {
					color: '#333333',
					fontSize: '16px',
					padding: '8px'
				}
            },
	        series: [{
	            name: 'Genres Sales by Store',
	            colorByPoint: true,
	            data: _data
	        }]
	    });
	}
	chartsOverviewPage.prototype.build = function(){
		var contentbody = document.getElementById("contentBody");
		$(contentBody).empty();
		
		APP.buildChartsContainer();

		this.buildTopLeft();
		this.buildTopRight();
		this.buildLeftMiddle();
		this.buildRightMiddle();
		
		initplugins();

		crumbs([{
			title:"Sales Charts",
		},{
			title:"Sales Charts Overview"
		}]);
	}
}
function chartsStorePage(){
	chartsStorePage.prototype.init = function(){
		this.getAllSales();
	}
	chartsStorePage.prototype.getAllSales = function() {	
		var date = new Date();
		
		var postData = JSON.stringify(
		{
			"func" : "getSalesForStore",
			"stores": null,
			"startDate": new Date((date.getMonth() + 1) + '/' + (date.getDate()-7) + '/' +  date.getFullYear()),
			"endDate": new Date((date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()),
			"session_key" : APP.user.session_key
		});
		
		APP.callJSON(APP.url, postData, "POST", APP.page.getSalesForStoreCallBackSuccess);	
	}
	chartsStorePage.prototype.getSalesForStoreCallBackSuccess = function(data, textStatus, request) {
		if (httpMessage(data, "")) {
			var ret_data = JSON.parse(data.responseText);
			APP.homePageResult["store_sales"] = ret_data;

			APP.page.build();
		}
	}
	chartsStorePage.prototype.build = function() {
		var contentbody = document.getElementById("contentBody");
		$(contentBody).empty();
		
		APP.buildContainer();		
		this.buildTopLeft();
		this.buildTopRight();
		this.buildBottomAll("Sales Graph");
		
		initplugins();

		crumbs([{
			title:"Sales Charts",
		},{
			title:"Sales Charts Per Store"
		}]);
	}
	chartsStorePage.prototype.buildTopLeft = function() {
		var span6 = document.getElementById("top-1");
		
		var block = APP.createElement(span6, "", "block");
		var navbar = APP.createElement(block, "", "navbar navbar-inner block-header");
		var mutedPullLeft = APP.createElement(navbar, "", "muted pull-left");
		$(mutedPullLeft).html("Filter Results");
		
		var blockContent = APP.createElement(block, "", "block-content collapse in overflowshow");
		var legend = APP.createElement(blockContent, "", "","legend");
		$(legend).html("Filter where clause");
		
		var filters = new Array("stores");
		var fieldnames = new Array("Filter sales data by Store");
		
		var roots = ["name"];
		var placeholders = ["Select a Store"];
		
		var callbacks = new Array(this.refreshGraphForFilters);
			
		buildFilters(blockContent, filters, fieldnames, roots, placeholders, callbacks);
	}
	chartsStorePage.prototype.buildTopRight = function() {
		var span6 = document.getElementById("top-2");
		$(span6).empty();
		
		//build form
		var block = APP.createElement(span6, "", "block");
		var navbar = APP.createElement(block, "", "navbar navbar-inner block-header");
		var mutedPullLeft = APP.createElement(navbar, "", "muted pull-left");
		$(mutedPullLeft).html("Sales Date Filter");
		
		var blockContent = APP.createElement(block, "", "block-content collapse in overflowshow");
		var legend = APP.createElement(blockContent, "", "","legend");
		$(legend).html("Filter Sales with Start and End Date");
		
		var date = new Date();
		
		var fieldlabel = APP.createElement(blockContent, "", "", "label");		
		var span = APP.createElement(fieldlabel, "", "input-group-addon", "span");
		var calendarIcon = APP.createElement(span, "", "icon icon-calendar", "span");
		$(fieldlabel).append("Start Date");

		var inputGroup = APP.createElement(blockContent, "", "input-group date");
		var startDatepicker = APP.createElement(inputGroup, "startDate", "startDatepicker datePicker", "input");
		$('.startDatepicker').attr("type", "text").datepicker({
			autoclose: true,
			format: 'mm/dd/yyyy',
			todayHighlight: true,
			clearBtn: true
		});
		$('.startDatepicker').datepicker('setDate', (date.getMonth() + 1) + '/' + (date.getDate()-7) + '/' +  date.getFullYear());
		$('.startDatepicker').datepicker('update');
		
		var fieldlabel = APP.createElement(blockContent, "", "", "label");		
		var span = APP.createElement(fieldlabel, "", "input-group-addon", "span");
		var calendarIcon = APP.createElement(span, "", "icon icon-calendar", "span");
		$(fieldlabel).append("End Date");
		var endDatepicker = APP.createElement(blockContent, "endDate", "endDatepicker datePicker", "input");
		$('.endDatepicker').attr("type", "text").datepicker({
			autoclose: true,
			format: 'mm/dd/yyyy',
			todayHighlight: true,
			clearBtn: true
		});
		$('.endDatepicker').datepicker('setDate',  (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear());
		$('.endDatepicker').datepicker('update');
		
		$(".datePicker").change(function(){
			APP.page.refreshGraphForFilters();
		});
	}
	chartsStorePage.prototype.buildBottomAll = function () {
		var span12 = document.getElementById("bottom-all");
		$(span12).empty();
		
		var block = APP.createElement(span12, "", "block");
		var navbar = APP.createElement(block, "", "navbar navbar-inner block-header");
		var mutedPullLeft = APP.createElement(navbar, "", "muted pull-left");
		$(mutedPullLeft).html("Store Sales Chart");
		
		var salesChart = APP.createElement(block, "salesChart", "chart-size");
		$(salesChart).css("margin-top" , "10px");
		
		var _series = [];

		for(i=0; i < APP.homePageResult["store_sales"]["store_sales"].length; i++){
			var item = APP.homePageResult["store_sales"]["store_sales"][i];
			var object = new Object();
			object["name"] = item.store_name;
			
			object["data"] = [];
			for(p=0; p < item.data.length; p++){	
				var data_item = item.data[p];
				var data_object = new Object();
				var date = new Date(data_item.date)
				data_object["x"] = Date.UTC(date.getFullYear(),date.getMonth()+1,date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
				data_object["y"] = parseInt(data_item.sAmount);
				data_object["chart_category"] = data_item.sChartCategory;
				data_object["genre"] = data_item.sGenreName;
				data_object["media_name"] = data_item.sMediaName;
				
				object["data"].push(data_object);
			}
			
            _series.push(object);		
		}
		
		console.log(_series);
		 $('#salesChart').highcharts({
			chart: {
				type: 'scatter',
				zoomType: 'xy'
			},
			credits:{
				enabled: false
			},
			title: {
				text: null
			},
			xAxis: {
				type: 'datetime',
				dateTimeLabelFormats: { // don't display the dummy year
					month: '%e. %b',
					year: '%b'
				},
				title: {
					text: 'Sale Date'
				}
			},
			yAxis: {
				title: {
					text: 'Number of sales'
				},
				min: 0
			},
			plotOptions: {
				series: {
					cursor: 'pointer'
				}
			},
			tooltip: {
				formatter: function () {
						var date = new Date(this.point.x);
	                    return this.series.name + " - Date: " + ((date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear() +" "+ date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()) + 
						"<br/>Media Name: " + this.point.media_name + 
						"<br/>Copies Sold: " + this.point.y +
						"<br/>Category: " + this.point.chart_category +
						"<br/>Genre: " + this.point.genre;
	               },
				style: {
					color: '#333333',
					fontSize: '16px',
					padding: '8px'
				}
			},
			series: _series
		});
	}
	chartsStorePage.prototype.refreshGraphForFilters = function(){
		var stores = $("#stores").val();
		var startDate = new Date($("#startDate").val());
		var endDate = new Date($("#endDate").val());
		
		var postData = JSON.stringify(
		{
				"func" : "getSalesForStore", 
				"stores": stores,
				"startDate": startDate,
				"endDate": endDate,
				"session_key" : APP.user.session_key
		});
		APP.callJSON(APP.url, postData, "POST", APP.page.setCallback, false);
	}
	chartsStorePage.prototype.setCallback = function(data, textStatus, request){
		if (httpMessage(data, "")) {
			APP.homePageResult["store_sales"] = JSON.parse(data.responseText);
			APP.page.buildBottomAll();	
		}
	}
}
}
{/* auxiliry pages, not specifically data related */
function loginpage() {
	loginpage.prototype.init = function() {
		buildFrameWorkLoggedout();
		var container = APP.createElement(BODY, "login", "container", "");
		var form = APP.createElement(container, "", "form-signin");
		var h2 = APP.createElement(form, "", "form-signin-heading", "h2");
		$(h2).html("Please sign in");
		var input = APP.createElement(form, "loginempnrinput", "input-block-level", "input");
		$(input).attr("type","text").attr("placeholder","Email address").focus();
		var input = APP.createElement(form, "loginpasswordinput", "input-block-level", "input");
		$(input).attr("type","password");
		var button = APP.createElement(form, "", "btn btn-large btn-danger", "button");
		$(button).attr("type","submit").html("Sign in").click(function(){
			var postData = JSON.stringify(
			{
					"func" : "login", 
					"email_address" : $("#loginempnrinput").val(),
					"password" : $("#loginpasswordinput").val()
			});
			APP.callJSON(APP.url, postData, "POST", APP.page.loginCallbackSuccess);		
		});
		
		$('#loginpasswordinput').hideShowPassword({
		  // Make the password visible right away.
		  show: false,
		  // Create the toggle goodness.
		  innerToggle: true,
		  // Give the toggle a custom class so we can style it
		  // separately from the previous example.
		  toggleClass: 'my-toggle-class',
		  // Don't show the toggle until the input triggers
		  // the 'focus' event.
		  hideToggleUntil: 'focus'
		});
		
		$(input).attr("type","password").attr("placeholder","password").keyup(function(e) {
			if(e.which == 13 || e.keyCode == 13) 
			{
				$(button).focus().click();
			}
		});
	}
    loginpage.prototype.loginCallbackSuccess = function(data, textStatus, request) {
		var status;
    	if(data != undefined)
			status = data.status;
		if(request != undefined)
			request = request.status;
		switch(status)
		{
			case 200:
				//successful
				var json = JSON.parse(data.responseText);
				console.log(json);
				APP.user = new user();
				APP.user.details = json["details"];
				APP.user.session_key = json["session_key"];
				APP.user.user_group = json["usergroup"];
				localStorage.setItem("APP.user", data.responseText);
				window.location.hash = "#main";
			break;
			case 204: default:
				var alert = document.getElementById("login");
				var alertSuccess = APP.createElement(alert, "", "alert alert-error");
				var alertClose = APP.createElement(alertSuccess, "", "close");
				$(alertClose).attr("type","button").attr("data-dismiss","alert").html("&times;");
				$(alertSuccess).css("display","none").append(APP.errors.loginError).fadeIn().delay(2000).fadeOut();
			break;
		}
    }  
    loginpage.prototype.loginCallbackError = function(data, textStatus, request)  {
    	var status;
    	if(data != undefined)
			status = data.status;
		if(request != undefined)
			request = request.status;
			
		switch(status)
		{
			case 401:
				//not logged in
				window.location.hash = "";
				showSuccess("API could not be reached.",false);
			break;
		}
	}
}
function clIndexpage() {
	clIndexpage.prototype.init = function () {
		loadpage();		
	}
};
function homePage() {
	homePage.prototype.init = function() {	
		var postData = JSON.stringify(
		{
			"func" : "getWebsiteDetails", 
			"session_key" : APP.user.session_key
		});

		APP.callJSON(APP.url, postData, "POST", APP.page.homeCallbackSucces);	
	}
	homePage.prototype.build = function() {
		var contentbody = document.getElementById("contentBody");
		$(contentBody).empty();
		
		APP.buildContainer();
		this.buildBottomAll();
		
		initplugins();
	}
	homePage.prototype.buildBottomAll = function() {
		var span9 = document.getElementById("bottom-all");
		$(span9).empty();
		
		$("#row-fluid-top").empty();
		$("#row-fluid-middle").empty();
		$("#breadheader").empty();
		
		this.createOverview(span9);				
		this.createTop5Stores(span9);
		this.createTop5Media(span9);
		this.createWeeklyUpdates(span9);
	}
	homePage.prototype.createOverview = function(span9) {
		var block = APP.createElement(span9, "", "block");
		var navbar = APP.createElement(block, "", "navbar navbar-inner block-header");
		var muted = APP.createElement(navbar, "", "muted pull-left");
		$(muted).html("Store Chain Overview");
		
		var tac = APP.createElement(block, "", "tac");
		var a = APP.createElement(tac, "", "quick-btn", "a");
		$(a).attr("href","#stores");
		var i = APP.createElement(a, "", "icon-sitemap");
		var span = APP.createElement(a, "", "");
		$(span).html("Stores");
		var span = APP.createElement(a, "", "label label-inverse");
		$(span).html(APP.homePageResult["generics"]["total_stores"]);
		
		var a = APP.createElement(tac, "", "quick-btn", "a");
		$(a).attr("href","#media");
		var i = APP.createElement(a, "", "icon-music");
		var span = APP.createElement(a, "", "");
		$(span).html("Media");
		var span = APP.createElement(a, "", "label label-inverse");
		$(span).html(APP.homePageResult["generics"]["total_media"]);
		
		var a = APP.createElement(tac, "", "quick-btn", "a");
		$(a).attr("href","#media");
		var i = APP.createElement(a, "", "icon-tasks");
		var span = APP.createElement(a, "", "");
		$(span).html("Categories");
		var span = APP.createElement(a, "", "label label-inverse");
		$(span).html(APP.homePageResult["generics"]["total_chart_categories"]);
		
		var a = APP.createElement(tac, "", "quick-btn", "a");
		$(a).attr("href","#genres");
		var i = APP.createElement(a, "", "icon-tags");
		var span = APP.createElement(a, "", "");
		$(span).html("Genre");
		var span = APP.createElement(a, "", "label label-inverse");
		$(span).html(APP.homePageResult["generics"]["total_genres"]);
		
		var a = APP.createElement(tac, "", "quick-btn", "a");
		$(a).attr("href","#users");
		var i = APP.createElement(a, "", "icon-user");
		var span = APP.createElement(a, "", "");
		$(span).html("Users");
		var span = APP.createElement(a, "", "label label-inverse");
		$(span).html(APP.homePageResult["generics"]["total_users"]);		
	}
	homePage.prototype.createTop5Media = function(span9) {
		var block = APP.createElement(span9, "", "block");
		var navbar = APP.createElement(block, "", "navbar navbar-inner block-header");
		var muted = APP.createElement(navbar, "", "muted pull-left");
		$(muted).html("Top 5 Media Overall Sales over the past week");
		
		var blockcontent = APP.createElement(block, "", "block-content top-sales-block collapse in");
		
		if(parseInt(APP.homePageResult.generics.total_copies_sold) > 0){
			var total_copies_sold = APP.homePageResult.generics.total_copies_sold;
			
			for(i=0; i < APP.homePageResult.generics.weekly_top_5_sold.length; i++){
				var item = APP.homePageResult.generics.weekly_top_5_sold[i];
				var media = APP.createElement(blockcontent, "", "media ");
				var mediaBody = APP.createElement(media, "", "media-body dashboard-updates");
				var mediaHeading = APP.createElement(mediaBody, "", "media-heading", "h4");
								
				var totalPercentageSold = Math.floor((item.CopiesSold / total_copies_sold) * 100);
				
				$(mediaHeading).html(item.name);
				$(mediaBody).append("<strong>" + item.CopiesSold + "</strong> Copies Sold over the past week - <strong>" + totalPercentageSold + "%</strong> of all sales");
				
				
				var bar = APP.createElement(mediaBody, "bar", "progress progress-success progress-striped active");
				var barbar = APP.createElement(bar, "", "bar");
				$(barbar).css("width",  totalPercentageSold + "%");
			}
		}		
	}
	homePage.prototype.createTop5Stores = function(span9){
		//weekly_top_5_store_sales
		var block = APP.createElement(span9, "", "block");
		var navbar = APP.createElement(block, "", "navbar navbar-inner block-header");
		var muted = APP.createElement(navbar, "", "muted pull-left");
		$(muted).html("Top 5 Store Overall Sales over the past week");
		
		var blockcontent = APP.createElement(block, "", "block-content top-sales-block collapse in");
		
		if(parseInt(APP.homePageResult.generics.total_copies_sold) > 0){
			var total_copies_sold = APP.homePageResult.generics.total_copies_sold;
			
			for(i=0; i < APP.homePageResult.generics.weekly_top_5_store_sales.length; i++){
				var item = APP.homePageResult.generics.weekly_top_5_store_sales[i];
				var media = APP.createElement(blockcontent, "", "media ");
				var mediaBody = APP.createElement(media, "", "media-body dashboard-updates");
				var mediaHeading = APP.createElement(mediaBody, "", "media-heading", "h4");
								
				var totalPercentageSold = Math.floor((item.TotalSales / total_copies_sold) * 100);
				
				$(mediaHeading).html(item.name);
				$(mediaBody).append("<strong>" + item.TotalSales + "</strong> Sales over the past week - <strong>" + totalPercentageSold + "%</strong> of all sales");
				
				
				var bar = APP.createElement(mediaBody, "bar", "progress progress-info progress-striped active");
				var barbar = APP.createElement(bar, "", "bar");
				$(barbar).css("width",  totalPercentageSold + "%");
			}
		}
	}
	homePage.prototype.createWeeklyUpdates = function(span9) {
		var block = APP.createElement(span9, "", "block");
		var navbar = APP.createElement(block, "", "navbar navbar-inner block-header");
		var muted = APP.createElement(navbar, "", "muted pull-left");
		$(muted).html("Weekly Updates");
		var muted = APP.createElement(navbar, "expand-recent", "dashboard-expander muted pull-right");
		$("#expand-recent").click(function(){
			if($("#expand-recent > div").hasClass("icon-chevron-up")){
				$("#expand-recent > div").removeClass("icon-chevron-up").addClass("icon-chevron-down");
				$(".recentChangesContainer").slideUp('slow');
			} else {
				$("#expand-recent > div").removeClass("icon-chevron-down").addClass("icon-chevron-up");
				$(".recentChangesContainer").slideDown('slow');
			}
		});
		var i = APP.createElement(muted, "", "icon-chevron-up");
		
		var recentChangesContainer = APP.createElement(block, "", "recentChangesContainer");
		
		var media = APP.createElement(recentChangesContainer, "", "media ");
		
		var mediaBody = APP.createElement(media, "", "media-body dashboard-updates");
		
		if(APP.homePageResult["generics"]["weekly_store_updates"].length > 0){
			
			var mediaHeading = APP.createElement(mediaBody, "", "media-heading", "h4");
			$(mediaHeading).html("Newly Added Stores");
			
			for(i=0; i < APP.homePageResult["generics"]["weekly_store_updates"].length; i++){				
				var item = APP.homePageResult["generics"]["weekly_store_updates"][i];				
				var weeklyUpdateItem = APP.createElement(mediaBody, "", "well well-small");	
				var icon = APP.createElement(weeklyUpdateItem, "", "icon icon-sitemap", "span");
				date = new Date(item.date);				
				$(weeklyUpdateItem).append("<strong>" + (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear() + "</strong> - New Store was added: <strong>" + item.name + "</strong> located in <strong>" + item.city +"</strong>.");
			}			
		}

		if(APP.homePageResult["generics"]["weekly_media_updates"].length > 0){
			var media = APP.createElement(recentChangesContainer, "", "media ");
			var mediaBody = APP.createElement(media, "", "media-body dashboard-updates");
			
			var mediaHeading = APP.createElement(mediaBody, "", "media-heading", "h4");
			$(mediaHeading).html("Newly Added Media");
			
			for(i=0; i < APP.homePageResult["generics"]["weekly_media_updates"].length; i++){				
				var item = APP.homePageResult["generics"]["weekly_media_updates"][i];				
				var weeklyUpdateItem = APP.createElement(mediaBody, "", "well well-small");	
				var icon = APP.createElement(weeklyUpdateItem, "", "icon icon-music", "span");
				date = new Date(item.date);				
				$(weeklyUpdateItem).append("<strong>" + (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear() + "</strong> - New Media was added: <strong>" + item.name + "</strong>. It is a <strong>" + item.genreName + " " + item.categoryName +"</strong>.");
			}	
			
		}
		
		if(APP.homePageResult["generics"]["weekly_category_updates"].length > 0){
			var media = APP.createElement(recentChangesContainer, "", "media ");
			var mediaBody = APP.createElement(media, "", "media-body dashboard-updates");
			
			var mediaHeading = APP.createElement(mediaBody, "", "media-heading", "h4");
			$(mediaHeading).html("Newly Added Categories");
			
			for(i=0; i < APP.homePageResult["generics"]["weekly_category_updates"].length; i++){				
				var item = APP.homePageResult["generics"]["weekly_category_updates"][i];				
				var weeklyUpdateItem = APP.createElement(mediaBody, "", "well well-small");	
				var icon = APP.createElement(weeklyUpdateItem, "", "icon icon-tasks", "span");
				date = new Date(item.date);				
				$(weeklyUpdateItem).append("<strong>" + (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear() + "</strong> - New Category was added: <strong>" + item.name + "</strong>.");
			}	
		}
		
		if(APP.homePageResult["generics"]["weekly_genre_updates"].length > 0){
			var media = APP.createElement(recentChangesContainer, "", "media ");
			var mediaBody = APP.createElement(media, "", "media-body dashboard-updates");
			
			var mediaHeading = APP.createElement(mediaBody, "", "media-heading", "h4");
			$(mediaHeading).html("Newly Added Genres");
			
			for(i=0; i < APP.homePageResult["generics"]["weekly_genre_updates"].length; i++){				
				var item = APP.homePageResult["generics"]["weekly_genre_updates"][i];				
				var weeklyUpdateItem = APP.createElement(mediaBody, "", "well well-small");	
				var icon = APP.createElement(weeklyUpdateItem, "", "icon icon-tags", "span");
				date = new Date(item.date);				
				$(weeklyUpdateItem).append("<strong>" + (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear() + "</strong> - New Genre was added: <strong>" + item.name + "</strong>.");
			}	
		}
		
		if(APP.homePageResult["generics"]["weekly_user_updates"].length > 0){
			var media = APP.createElement(recentChangesContainer, "", "media ");
			var mediaBody = APP.createElement(media, "", "media-body dashboard-updates");
			
			var mediaHeading = APP.createElement(mediaBody, "", "media-heading", "h4");
			$(mediaHeading).html("Newly Added Users");
			
			for(i=0; i < APP.homePageResult["generics"]["weekly_user_updates"].length; i++){				
				var item = APP.homePageResult["generics"]["weekly_user_updates"][i];				
				var weeklyUpdateItem = APP.createElement(mediaBody, "", "well well-small");	
				var icon = APP.createElement(weeklyUpdateItem, "", "icon icon-user", "span");
				date = new Date(item.date);				
				$(weeklyUpdateItem).append("<strong>" + (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear() + "</strong> - New User was added: <strong>" + item.firstName + " " + item.lastName + "</strong> with email as <strong>" + item.emailAddress +"</strong> was added and assigned to the <strong>" + item.userGroup + "</strong> User Group.");
			}	
		}
	}
	homePage.prototype.homeCallbackSucces = function(data, textStatus, request) {
		if (httpMessage(data, "", request)) {
			APP.homePageResult = JSON.parse(data.responseText);	
			APP.page.build();
		}
	}
	homePage.prototype.homeCallbackError = function(data, textStatus, request) {
    	var status;
    	if(data != undefined)
			status = data.status;
		if(request != undefined)
			request = request.status;
			
		switch(status)
		{
			case 401:
				//not logged in
				window.location.hash = "";
				showSuccess("API could not be reached.",false);
			break;
		}
	}
}
}

{/* AJAX functions */
function showLoader() {
	var body = document.getElementById("contentBody");
	var backgroundDim = APP.createElement(body, "", "dimbackground");
	var loaderimg = APP.createElement(body, "", "loaderimg");
}
function removeLoader() {
	$(".dimbackground").remove();
	$(".loaderimg").remove(); 
}
function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#blah').attr('src', e.target.result);
			$("#Preview").attr("src",e.target.result);
			$("#lbPreview").attr("src",e.target.result);
			$("#lbPreview").css("width", "100%");
			$("#lbPreview").css("height", "100%");
        }

        reader.readAsDataURL(input.files[0]);
    }
}
function getTime(time) {
	min = parseInt(time.substring(0,2));
	sec = parseInt(time.substring(2,4));
	mil = time.substring(4,6);
	
	return min*60+sec+"."+mil;
}
function getQuestion(question) {
	//input 1 or 1-1
}
function httpMessage(data, message, request, update) {
	if (update == null) {
		update = false;
	}
	var status;
	var responseText;
	var silent=false;
	if(data != undefined) {
		status = data.status;
	} else if (request != undefined) {
		status = request.status;
	}
	if(data != undefined) {
		try{
			responseText = JSON.parse(data.responseText);
		} catch (ex) {
			console.log(data.responseText);
		}
	} else if (request != undefined) {
		try{
			responseText = JSON.parse(request.responseText);
		} catch (ex) {
			console.log(data.responseText);
		}
	}
	if (message == "") {
		silent=true;
	}
	switch(status)
	{
		case 200:
			if (!silent) {
				showSuccess(message,true);
			}
			return true;
			break;
		case 401:
			showSuccess("Your session is no longer valid, please log in again.",false);
			setTimeout(function () {
				window.location.hash = "";
			}, 3000);
			break;
		case 204:
			$("#infoMessage").html(APP.errors.noData).removeClass("hidden");
			break;
		case 204:
			showSuccess("Incorrect file format, please use a different file.",false);
			break;
		case 400:
			// responseText["media"] delete all media or nothing
			break;
		case 404:
			showSuccess("API could not be reached.",false);
			break;
		case 500:
			if(responseText["error"] != null) {
				$("#errorMessage").removeClass("hidden").html(APP.errors.serverError + "\n" + responseText["error"]);
				$("#errorMessage").delay(10000).fadeOut();
			} else {
				showSuccess(APP.errors.serverError ,false);
			}
			break;
		default:
			$("#infoMessage").html(APP.errors.serverError).removeClass("hidden");
			break;
	}
	return false;
}
function showSuccess(msg,status){
	if(status)
		dd = ["alert-success","Complete"];
	else
		dd = ["alert-error","Error"];
	
	var span12 = document.getElementById("row-fluid-middle");
	var alertSuccess = APP.createElement(span12, "", "alert "+dd[0]);
	$(span12).prepend(alertSuccess);
	var alertClose = APP.createElement(alertSuccess, "", "close");
	$(alertClose).attr("type","button").attr("data-dismiss","alert").html("&times;");
	var alertHeader = APP.createElement(alertSuccess, "", "","h4");
	$(alertHeader).html("Action "+dd[1]);
	$(alertSuccess).css("display","none").append(msg).fadeIn().delay(2000).fadeOut();
}
}
{/* Base functions */
var clearInput = function() {
    $('.form-horizontal').find('input[type=text], input[type=password], input[type=number], input[type=email], textarea').val('');
	APP.page.reset();
};
var clearInputRight = function() {
	APP.page.resetRight();
};
var initplugins = function() {
	 $('#rootwizard-top-1').bootstrapWizard({
		onTabShow: function(tab, navigation, index) {
			var $total = navigation.find('li').length;
			var $current = index+1;
			var $percent = ($current/$total) * 100;
			$('#rootwizard-top-1').find('.bar').css({width:$percent+'%'});
			// If it's the last tab then hide the last button and show the finish instead
			if($current >= $total) {
				$('#rootwizard-top-1').find('.pager .next').hide();
				$('#rootwizard-top-1').find('.pager .finish').show();
				$('#rootwizard-top-1').find('.pager .finish').removeClass('disabled');
			} else {
				$('#rootwizard-top-1').find('.pager .next').show();
				$('#rootwizard-top-1').find('.pager .finish').hide();
			}
		},
		onNext: function(tab, navigation, index) {
			if ($validator != null) {
				var form = $validator["currentForm"]["id"];
				return validateForm(form, index);
			}
		},
		onLast: function(tab, navigation, index) {
			if ($validator != null) {
				var form = $validator["currentForm"]["id"];
				return validateForm(form, index);
			}
		}
	});
	$('#rootwizard-top-2').bootstrapWizard({
		onTabShow: function(tab, navigation, index) {
			var $total = navigation.find('li').length;
			var $current = index+1;
			var $percent = ($current/$total) * 100;
			$('#rootwizard-top-2').find('.bar').css({width:$percent+'%'});
			// If it's the last tab then hide the last button and show the finish instead
			if($current >= $total) {
				$('#rootwizard-top-2').find('.pager .next').hide();
				$('#rootwizard-top-2').find('.pager .finish').show();
				$('#rootwizard-top-2').find('.pager .finish').removeClass('disabled');
			} else {
				$('#rootwizard-top-2').find('.pager .next').show();
				$('#rootwizard-top-2').find('.pager .finish').hide();
			}
		},
		onNext: function(tab, navigation, index) {
			var form = $validator["currentForm"]["id"];
			return validateForm(form, index);
		},
		onLast: function(tab, navigation, index) {
			var form = $validator["currentForm"]["id"];
			return validateForm(form, index);
		}
	});
	$('#rootwizard-top-3').bootstrapWizard({
		onTabShow: function(tab, navigation, index) {
			var $total = navigation.find('li').length;
			var $current = index+1;
			var $percent = ($current/$total) * 100;
			$('#rootwizard-top-3').find('.bar').css({width:$percent+'%'});
			// If it's the last tab then hide the last button and show the finish instead
			if($current >= $total) {
				$('#rootwizard-top-3').find('.pager .next').hide();
				$('#rootwizard-top-3').find('.pager .finish').show();
				$('#rootwizard-top-3').find('.pager .finish').removeClass('disabled');
			} else {
				$('#rootwizard-top-3').find('.pager .next').show();
				$('#rootwizard-top-3').find('.pager .finish').hide();
			}
		},
		onNext: function(tab, navigation, index) {
			var form = $validator["currentForm"]["id"];
			return validateForm(form, index);
		},
		onLast: function(tab, navigation, index) {
			var form = $validator["currentForm"]["id"];
			return validateForm(form, index);
		}
	});
	$('#rootwizard-wizard').bootstrapWizard({
		onTabShow: function(tab, navigation, index) {
			var $total = navigation.find('li').length;
			var $current = index+1;
			var $percent = ($current/$total) * 100;
			$('#rootwizard-wizard').find('.bar').css({width:$percent+'%'});
			// If it's the last tab then hide the last button and show the finish instead
			if($current >= $total) {
				$('#rootwizard-wizard').find('.pager .next').hide();
				$('#rootwizard-wizard').find('.pager .finish').show();
				$('#rootwizard-wizard').find('.pager .finish').removeClass('disabled');
			} else {
				$('#rootwizard-wizard').find('.pager .next').show();
				$('#rootwizard-wizard').find('.pager .finish').hide();
			}
		},
		onNext: function(tab, navigation, index) {
			var form = $validator["currentForm"]["id"];
			return validateForm(form, index);
		},
		onLast: function(tab, navigation, index) {
			var form = $validator["currentForm"]["id"];
			return validateForm(form, index);
		}
	});
	 
	$(".uniform_on").uniform();
	$(".chzn-select").chosen({disable_search_threshold: 10,allow_single_deselect: true});
	$(".datepicker").datepicker({orientation:"top right", autoclose: true});
}
var sidenav = function(selected) {
	$(".sidenav-header").removeClass("active");
	$(".sidenav-indent").removeClass("active");
	$("#sidenav-"+selected).addClass("active");
}
var fade = function() {
	$("#top-1").hide();
	$("#top-1").fadeIn('fast');
	$("#top-2").hide();
	$("#top-2").fadeIn('fast');
}
var loadpage = function() {
	APP.autoTextUpdate();
	APP.autoImageUpdate();
	
	if (localStorage.getItem("APP.user") != null) {
		var json = JSON.parse(localStorage.getItem("APP.user"));
		APP.user = new user();
		APP.user.details = json["details"];
		APP.user.session_key = json["session_key"];
		APP.user.user_group = json["usergroup"];
	}
	
	buildFrameWorkLoggedin();
	current_left = 1;
	
	$("#contentBody").empty();
	var contentbody = document.getElementById("contentBody");
	$("html, body").animate({ scrollTop: 0}, 1000);
	
	if(APP.homePageResult == null && (location.hash != "#login" && location.hash != "#" && location.hash !== "")){
		location.hash = "#main";
	}
	
	if (location.hash == "#login") {
		APP.page = new loginpage();
		APP.page.init();
	}else if (location.hash === ""){
		APP.page = new loginpage();
		APP.page.init();
	}else if (location.hash == "#main"){
		sidenav("dashboard");
		APP.page = new homePage();
		APP.page.init();
	}else if (location.hash == "#sales"){
		sidenav("sales");
		APP.page = new salesPage();
		APP.page.init();		
		APP.page.init();		
	}else if (location.hash == "#stores"){
		sidenav("stores");
		APP.page = new storesPage();
		APP.page.build();
	}else if (location.hash == "#media"){
		sidenav("media");
		APP.page = new mediaPage();
		APP.page.init();		
	}else if (location.hash == "#categories"){
		sidenav("categories");
		APP.page = new categoriesPage();
		APP.page.build();
	}else if (location.hash == "#genres"){
		sidenav("genres");
		APP.page = new genresPage();
		APP.page.build();
	}else if (location.hash == "#users"){
		sidenav("users");
		APP.page = new usersPage();
		APP.page.build();
	}else if (location.hash == "#overviewsalecharts"){
		sidenav("overviewsalecharts");
		APP.page = new chartsOverviewPage();
		APP.page.init();
	}else if (location.hash == "#storesalecharts"){
		sidenav("storesalecharts");
		APP.page = new chartsStorePage();
		APP.page.init();
	}else{
		if(localStorage.getItem("user") != null)
		{
			APP.page = new homePage();
			APP.page.init();
		}
		else
		{
			APP.page = new loginpage();
			APP.page.init();	
		}
	}
	initplugins();
	fade();
}
var buildFrameWorkLoggedout = function() {
  $(BODY).empty();
  var navbar = APP.createElement(BODY, "", "navbar navbar-fixed-top");
  var container = APP.createElement(navbar, "", "container-fluid nav-header");
  var btn = APP.createElement(container, "", "btn btn-navbar", "a");
  $(btn).attr("data-toggle","collapse").attr("data-target","nav-collapse");
  var span = APP.createElement(btn, "", "icon-bar", "span");
  var span = APP.createElement(btn, "", "icon-bar", "span");
  var span = APP.createElement(btn, "", "icon-bar", "span");
  
  var brand = APP.createElement(container, "", "brand", "a");
  $(brand).attr("href","#");
  var img = APP.createElement(brand, "", "", "img");
  $(img).attr("src", "assets/storeviewLogo.png");
  return container;
}
var buildFrameWorkLoggedin = function() {
  var container = buildFrameWorkLoggedout();
  
  var navcollapse = APP.createElement(container, "", "nav-collapse collapse");
  var ul = APP.createElement(navcollapse, "", "nav pull-right", "ul");
  var li = APP.createElement(ul, "", "dropdown", "li");
  var a = APP.createElement(li, "", "dropdown-toggle", "a");
  $(a).attr("role","button").attr("href","#").attr("data-toggle","dropdown");
  //suppose to be user name, need to grab from login object ??
  var i = APP.createElement(a, "", "icon-user top");
  $(a).append(APP.user.details.user_name + " " + APP.user.details.user_lastname);
  var ul = APP.createElement(li, "", "dropdown-menu", "ul");
  var li = APP.createElement(ul, "", "", "li");
  var a = APP.createElement(li, "", "", "a");
  $(a).attr("tabindex","-1").attr("href","#").html("Logout");
  
  var container = APP.createElement(BODY, "", "container-fluid");
  var rowfluid = APP.createElement(container, "", "row-fluid");
  var sidebar = APP.createElement(rowfluid, "sidebar", "span2");
  var menu = APP.createElement(sidebar, "menu", "accordian nav nav-list bs-docs-sidenav nav-collapse collapse", "ul");
  
  var li = APP.createElement(menu, "", "", "li");
  var a = APP.createElement(li, "sidenav-dashboard", "sidenav-header active", "a");
  $(a).attr("href", "#main");
  var i = APP.createElement(a, "", "icon-home", "i");
  $(a).append("Dashboard");
  
  var li = APP.createElement(menu, "", "", "li");
  var a = APP.createElement(li, "sidenav-sales", "sidenav-header", "a");
  $(a).attr("href", "#sales");
  var i = APP.createElement(a, "", "icon-bar-chart", "i");
  $(a).append("Sales");
  
  var li = APP.createElement(menu, "", "", "li");
  var a = APP.createElement(li, "sidenav-stores", "sidenav-header", "a");
  $(a).attr("href", "#stores");
  var i = APP.createElement(a, "", "icon-sitemap", "i");
  $(a).append("Stores");
  
  var li = APP.createElement(menu, "", "", "li");
  var a = APP.createElement(li, "sidenav-media", "sidenav-header", "a");
  $(a).attr("href", "#media");
  var i = APP.createElement(a, "", "icon-music", "i");
  $(a).append("Media");
  
  var li = APP.createElement(menu, "", "", "li");
  var a = APP.createElement(li, "sidenav-categories", "sidenav-header", "a");
  $(a).attr("href", "#categories");
  var i = APP.createElement(a, "", "icon-tasks", "i");
  $(a).append("Categories");
  
  var li = APP.createElement(menu, "", "", "li");
  var a = APP.createElement(li, "sidenav-genres", "sidenav-header", "a");
  $(a).attr("href", "#genres");
  var i = APP.createElement(a, "", "icon-tags", "i");
  $(a).append("Genres");
  
  var li = APP.createElement(menu, "", "", "li");
  var a = APP.createElement(li, "sidenav-users", "sidenav-header", "a");
  $(a).attr("href", "#users");
  var i = APP.createElement(a, "", "icon-user", "i");
  $(a).append("Users");

  var li = APP.createElement(menu, "", "", "li");
  var a = APP.createElement(li, "sidenav-overviewsalecharts", "sidenav-header", "a");
  $(a).attr("href", "#overviewsalecharts");
  var i = APP.createElement(a, "", "icon-user", "i");
  $(a).append("Sales Charts Overview");

  var li = APP.createElement(menu, "", "", "li");
  var a = APP.createElement(li, "sidenav-storesalecharts", "sidenav-header", "a");
  $(a).attr("href", "#storesalecharts");
  var i = APP.createElement(a, "", "icon-user", "i");
  $(a).append("Sales Charts By Store");
  
  var background = APP.createElement(sidebar, "", "background nav-collapse collapse");
  
  var errorMessage = APP.createElement(rowfluid, "errorMessage", "message alert alert-danger alert-dismissable span9 hidden");
  var warningMessage = APP.createElement(rowfluid, "warningMessage", "message alert alert-warning span9 hidden");
  var infoMessage = APP.createElement(rowfluid, "infoMessage", "message alert alert-info span9 hidden");
  var successMessage = APP.createElement(rowfluid, "successMessage", "message alert alert-success span9 hidden");
  var contentBody = APP.createElement(rowfluid, "contentBody", "span9");
}
var generateSidebarNavHeader = function(icon, header, target, container) {
	var li = APP.createElement(container, "", "accordion-group", "li");
	var a = APP.createElement(li, "", "accordion-toggle sidenav-header", "a");
	$(a).attr("data-parent", "").attr("data-toggle","collapse").attr("data-target","#"+target);
	var i = APP.createElement(a, "", icon, "i");
	$(a).append(header);
	var ul = APP.createElement(li, target, "collapse no-indent in", "ul");
	return ul;
}
var generateSidebarNav = function(icon, header, target, listname, listtarget, icons, container) {
	var ul = generateSidebarNavHeader(icon, header, target, container);
	for (i = 0; i < listname.length; i++) {
		var li = APP.createElement(ul, "", "", "li");
		var a = APP.createElement(li, "sidenav-"+listname[i], "sidenav-indent", "a");
		$(a).attr("href",listtarget[i]);
		var icon = APP.createElement(a, "", icons[i], "i");
		$(a).append(listname[i]);
	}
	return ul;
}
function crumbs(links){
	var breadcrumb = $("#crumblist")[0];
	for(cc=0;cc < links.length - 1;cc++){
		var li = APP.createElement(breadcrumb,"","","li");
		var a = APP.createElement(li,"","","a");
		$(a).html(links[cc].title).attr("href",links[cc].link);
		var span = APP.createElement(li,"","divider","span");
		$(span).html("/");
	}
	var li = APP.createElement(breadcrumb,"","active","li");
	$(li).html(links[cc].title);
}
}

/* global updates, should not be needed to change currently */
{/* form components get built here */
function makePasswordField(fieldname) {
	$('#Password').hideShowPassword({
	  // Make the password visible right away.
	  show: false,
	  // Create the toggle goodness.
	  innerToggle: true,
	  // Give the toggle a custom class so we can style it
	  // separately from the previous example.
	  toggleClass: 'my-toggle-class',
	  // Don't show the toggle until the input triggers
	  // the 'focus' event.
	  hideToggleUntil: 'focus'
	});
}
function buildCheckbox(loc, id, label, value, data_on, data_off){
	if (id == "Correct") {
		data_on = "Yes";
		data_off= "No";
	}
	if (data_on == null) {
		data_on = "On";
	}
	if (data_off == null) {
		data_off = "Off";
	}
	var inp = APP.createElement(loc,id,"","input");
	$(inp).attr("type", "checkbox").attr("checked", value == "True" ? true : false);
	
	$(inp).wrap('<div class="make-switch has-switch" data-on="danger" data-on-label="'+data_on+'" data-off-label="'+data_off+'" />').parent().bootstrapSwitch();
	
}
function buildDropdown(loc, id, list){
	var sel = APP.createElement(loc,id,"chzn-select","select");
	for(e = 0; e < list.length; e++){
		var option = APP.createElement(sel,"","","option");
		$(option).attr("value",list[e].uuid).html(list[e].description);
		if ((list[e].description=="English")) {
			$(option).attr("selected","");
		}
	}
}
function buildMultiSelectBox(parent, label, fields, longdescription, id, root, value, lookup){
	if (longdescription == null) {
		longdescription = label;
	}
	var fieldlabel = APP.createElement(parent, "", "", "label");
	$(fieldlabel).html(longdescription);
	var select = APP.createElement(parent, id, "chzn-select span4", "select");
	$(select).attr("data-placeholder", label).attr("multiple", "multiple").attr("placeholder",id).attr("alt", id).attr("name", id);
	
	if (lookup != null) {
		var label = APP.createElement(parent, "", "pull-right", "label");
		var i_el = APP.createElement(label, "", "icon-double-angle-right", "i");
		
		$(label).on("click", function(event, ui) {
			if (current_left > 1) {
				addTab(lookup);
			} else {
				lookup.buildTopRight();
				$("#top-"+(current_left+1)).hide();
				$("#top-"+(current_left+1)).fadeIn('slow');
			}
			initplugins();
			current_left++;
		});
	}
	List = fields;
	if (List != null) {
		for(i=0; i < List.length; i++)
		{
			var option = APP.createElement(select,"","","option");
			$(option).attr("value",List[i]["uid"]).html(List[i][root]);
			
			if ((value != null)&&(value[id] != null)&&(value[id].length > 0)) {
				for(var j = 0; j < value[id].length; j++)
				{
					if(value[id][j]["uid"] == List[i]["uid"])
					{
						$(option).attr("selected", true);
						break;
					}
				}
			}
			/* else {
			}*/	
		}	
	}
}
}

/* Application startup and directives */
function clSite(){
	clSite.prototype.init = function(){
		var indexpage = new clIndexpage();
		indexpage.init();
	}
};
$(window).on('hashchange', loadpage );
$(document).ready (function(){

	APP = new APPLICATION();
	BODY = document.getElementsByTagName("body")[0];
	APP.site = new clSite();
	APP.site.init();
	APP.autoTextInit();
	APP.autoTextUpdate();
	APP.autoImageUpdate();
	window.onresize = function(){
		APP.autoTextUpdate();
		APP.autoImageUpdate();
	}
	var pxShow = 700;//height on which the button will show
	var fadeInTime = 1000;//how slow/fast you want the button to show
	var fadeOutTime = 1000;//how slow/fast you want the button to hide
	var scrollSpeed = 1000;//how slow/fast you want the button to scroll to top. can be a value, 'slow', 'normal' or 'fast'
	jQuery(window).scroll(function(){
		if(jQuery(window).scrollTop() >= pxShow){
			jQuery(".downbutton").fadeIn(fadeInTime);
		}else{
			jQuery(".downbutton").fadeOut(fadeOutTime);
		}
	});	
});
