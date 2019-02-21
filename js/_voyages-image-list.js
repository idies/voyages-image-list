/* ========================================================================
 * voyages-image-list v1.0.0
 * ========================================================================
 *
 * What it does:
 * 		Creates a sql search form that submits the form's query to 
 *		skyserverw and uses the results to display a list of images
 * 
 * Licensed under MIT 
 * ======================================================================== */
(function($) {
	'use strict';

	// PUBLIC CLASS DEFINITION
	// ================================

	var VILDEBUG = true;

	var voyages_image_list = {

		context: "body",
		
		targets: {
		imagelist:{
			//put back in https:
		    url:"//skyserver.sdss.org/casjobs/RestAPI/contexts/dr14/query",
		    ContentType:"application/json",
		    type: "POST",
		    data:{"Query":"","Accept":"application/xml"},
		    success: function (data) {
			voyages_image_list.showResults( data , false , true, true );
		    }
		}
		},
		
		newWin: [],
		
		currentID: '0',
			
		init: function(count){
			for(var i = 0; i < count; i++) {
				voyages_image_list.newWin.push(false);
			}
			// get base url of files, test or prod query, target query location, and how to show results.
			var webroot = $( "#vil-container-0" ).data('vil-webroot');
			var which = $( "#vil-container-0" ).data('vil-which');
			var target = voyages_image_list.targets[which];
			// Show the Search Page
			this.showInstructions( webroot+"includes/" );
			this.showForm( voyages_image_list.context , false , true );
			this.showInitialResults( '<br>Results Empty!<br><br><strong>Check Syntax</strong> or <strong>Submit</strong> to get results', count);
			
			// Prevent form submitting/reloading page
			$(".vil-form", voyages_image_list.context).on( "submit" , function( e ){ e.preventDefault(); });
			$(".vil-searchform", voyages_image_list.context).on( "submit" , function( e ){ e.preventDefault(); });
			
			// Add (delegated) click event handlers to buttons
			$(".vil-edit", voyages_image_list.context).on('click', voyages_image_list.enableQuery);
			$(".vil-query", voyages_image_list.context).on('input', voyages_image_list.doQueryUpdate);
			$(".vil-newWindow", voyages_image_list.context).on('change', voyages_image_list.updateCheckbox);
			$(".vil-submit", voyages_image_list.context).on( "click" , { target:target , which:which } , voyages_image_list.doSubmit );
			$(".vil-syntax", voyages_image_list.context).on( "click" , voyages_image_list.doSyntax );
			$(".vil-reset", voyages_image_list.context).on( "click" , voyages_image_list.doReset );
			
		},
		
		showInitialResults: function(results, count) {
			for(var i = 0; i < count; i++) {
				voyages_image_list.currentID = i.toString();
				voyages_image_list.showResults( results , false , false, false);
				voyages_image_list.showForm( voyages_image_list.context , false , true );
			}
		},
		
		updateCheckbox: function(e) {
			var id = e.currentTarget.id;
			var index = Number(id.slice(-1));
			var setting = e.currentTarget.dataset.value;
			if (setting === "no") {
				setting = "yes";
				voyages_image_list.newWin[index] = true;
				e.currentTarget.dataset.value = setting;
			} else {
				setting = "no";
				voyages_image_list.newWin[index] = false;
				e.currentTarget.dataset.value = setting;
			}
		},
		
		openWindow: function(content) {
			var type = 'text/html';
			var a = document.createElement("a");
			var file = new Blob([content], {type: type});
			a.href = URL.createObjectURL(file);
			a.target = "_blank";
			a.click();
		},
		
		enableQuery: function(e) {
			var id = e.currentTarget.id;
			if(e.currentTarget.dataset.unlock === "yes") {
				$("#vil-query-" + id.slice(-1)).prop("disabled", false);
				e.currentTarget.dataset.unlock = "no";
				e.currentTarget.innerHTML = 'Lock';
				$("#vil-lock-" + id.slice(-1)).prop("style", "display: none;");
			}
			else {
				$("#vil-query-" + id.slice(-1)).prop("disabled", true);
				e.currentTarget.dataset.unlock = "yes";
				e.currentTarget.innerHTML='Unlock';
				$("#vil-lock-" + id.slice(-1)).prop("style", "");
			}
	    },

		/**
		 *@summary Update the inner html of the query textarea with what the user enters
		 *
		 *@param Object e Event Object
		 **/
		doQueryUpdate: function(e) {
			var id = e.currentTarget.id;
			var textValue = e.target.value;
		    $("#vil-query-" + id.slice(-1)).val(textValue);

	    },
		
		/**
		 * @summary Submits form data to target db
		 * 
		 * @param Object e Event Object
		**/
		doSubmit: function( e ) {
			var id = e.currentTarget.id;
			voyages_image_list.currentID = id.slice(-1);	
			$("#vil-hour-" + voyages_image_list.currentID).prop("style", "");
			var query = $("#vil-query-" + voyages_image_list.currentID).val();
			var target = e.data.target;
			var which = e.data.which;
			target.data.Query = query;
			$.ajax( target );
		},
		
		/**
		 * @summary Sends form data to skyserverws for syntax review
		 * 
		 * @param Object e Event Object
		**/
		doSyntax: function( e ) {
			if (VILDEBUG) { console.log('doSyntax'); }
			var id = e.currentTarget.id;
			voyages_image_list.currentID = id.slice(-1);
			$("#vil-hour-" + voyages_image_list.currentID).prop("style", "");
			// Get target db from form data
			var display = $( "#vil-container-0" ).data('vil-display');
			var _query = e.currentTarget.dataset.vilSubmitto + encodeURI( $("#vil-query-" + id.slice(-1)).val() );

			if ( display === 'div' ) {				
				//send query from form to skyserverws and listen for return
				var xhttp;
				xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState === 4 && this.status === 200) {
						var response = this.responseText;
						voyages_image_list.showResults( response , false , true, false );
					}
				};
				xhttp.open("GET", _query, true);
				xhttp.send();
				
			} else if ( display === 'iframe' ) {
				
			    voyages_image_list.showResults( '' , false , true, false);
				$(voyages_image_list.context + " .vil-results").append('<div class="embed-responsive embed-responsive-4by3"><iframe  class="embed-responsive-item" src="' + _query + '" name="vil-iframe" id="vil-iframe-' + voyages_image_list.currentID + '"></iframe></div>');
				voyages_image_list.showForm( '' , true , false );
				
			} else {
				
				console.log( "Display type not supported: " + display + "." );
				
			}
		},
		
		/**
		 * @summary Resets form data
		 * 
		 * @param Object e Event Object
		**/
		doReset: function( e ) {
			// Reset query - don't do this while testing
			var id = e.currentTarget.id;
			voyages_image_list.currentID = id.slice(-1);
			voyages_image_list.showResults( '<br>Results Empty!<br><br><strong>Check Syntax</strong> or <strong>Submit</strong> to get results' , false , false, false, false );
			voyages_image_list.showForm( voyages_image_list.context , false , true );
		},
		
		doCollapse: function( toggle, container, show ) {
			$('.collapse').collapse();
			if ( show === true ) {
				$(container).collapse('show');
			} else {
				$(container).collapse('hide');
			}
		},
		
		showInstructions: function( instructions ) {
			var instContainer = $(".vil-instructions", voyages_image_list.context);
			var instWrapper = $(".vil-instructions-wrap", voyages_image_list.context);
			var which = $( "#vil-container-0" ).data('vil-which');

			var xhttp;
			xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState === 4 && this.status === 200) {
					var response = this.responseText;
					$( instContainer ).html(response);
				}
			};
			xhttp.open("GET", instructions + 'instructions-' + which + '.txt' , true);
			xhttp.send();
		},
		
		showForm: function( context , append , show ) {
			var toggle = $('.vil-form-wrap>h2>a[data-toggle]', voyages_image_list.context);
			var container = $(".vil-form-wrap", voyages_image_list.context);
			if (VILDEBUG) { console.log(  $( toggle ).attr('href') ); }
			
			var contents = ( append !== undefined && append ) ? $(container).html() : '' ;
			
			voyages_image_list.doCollapse(voyages_image_list.context + ' .vil-form-wrap>h2>a[data-toggle]', container, show );
			
		},
		
		/**
		 * @summary Appends or updates the displayed Results.
		 * 
		 * @param String $results Results to display
		 * @param Boolean $append Append or replace current message(s)
		**/
		showResults: function( results , append , show, isSubmit) {
			var index = Number(voyages_image_list.currentID);
			var container = $("#vil-results-" + voyages_image_list.currentID);

			var contents = ( append !== undefined && append ) ? $(container).html() : '' ;
			
			if(isSubmit) {
				results = voyages_image_list.getImages(results);
			}
			
			contents += ( results !== undefined ) ? results : '' ;
			$("#vil-hour-" + voyages_image_list.currentID).prop("style", "display: none;");
			$(container).html(contents);
			if (voyages_image_list.newWin[index]) {
				voyages_image_list.openWindow(contents);
			}
			voyages_image_list.doCollapse(voyages_image_list.context + ' .vil-results-wrap>h2>a[data-toggle]', $("#vil-results-outer-" + voyages_image_list.currentID), show );
		},
	
	getImages: function(data) {
		var display = $( "#vil-container-0" ).data('vil-display');
		var href_prepend = '<a target="_blank" href="http://skyserver.sdss.org/dr15/en/tools/chart/navi.aspx?';
		var append = '&width=128&height=128&opt=OG" width="128" height="128"></a></td>';
		var prepend = '&scale=0.2&width=128&height=128"><img style="-webkit-user-select: none;cursor: zoom-in;" src="http://skyserver.sdss.org/dr15/SkyServerWS/ImgCutout/getjpeg?';
		var queryImages = '<pre><table>';

		if ( display === 'div' ) {				
			var lines = data.split('\n');
			if (lines[0] === 'name,ra,dec') {
				var count = 0;
				for(var i = 1; i < lines.length - 1; i++) {
					var line = lines[i];
					var items = line.split(',');
					if (count%5 === 0) {
						queryImages += '<tr>';
					}
					queryImages += ('<td><strong>name: </strong>' + items[0] + '<br><strong>ra: </strong>' + items[1] + '<br><strong>dec: </strong>' + items[2] + '<br>');
					queryImages += (href_prepend + 'ra=' + items[1] + '&dec=' + items[2] + prepend + 'ra=' + items[1] + '&dec=' + items[2] + append);
					if(count%5 === 4 || i === lines.length - 2) {
						queryImages += '</tr>';
					}
					count++;
				}
				queryImages += '</table></pre>';
			} else {
				queryImages = "<pre><strong>QUERY ERROR</strong>: Make sure your query selects for name, ra, and dec in that order</pre>";
			}
		}
		return queryImages;
	}};

	$(document).ready( function(  ) {
		var divs = document.getElementsByClassName("vil-wrap");
		voyages_image_list.init(divs.length);
	} );
	
})(jQuery);