/* ========================================================================
 * sqlsearchwp v1.0.0
 * ========================================================================
 *
 * What it does:
 * 		Creates a sql search form that submits the form's query to 
 *		skyserverws.
 * 
 * Licensed under MIT 
 * ======================================================================== */
(function($) {
	'use strict';

	// PUBLIC CLASS DEFINITION
	// ================================

	var SQLSDEBUG = true;

	var sqlsearchwp = {

		context: "body",
		
		targets: {
		casjobs:{
			//put back in https:
		    url:"//skyserver.sdss.org/casjobs/RestAPI/contexts/dr14/query",
		    ContentType:"application/json",
		    type: "POST",
		    data:{"Query":"","Accept":"application/xml"},
		    success: function (data) {
			sqlsearchwp.showResults( data , false , true, true );
		    }
		}
		},
		
		newWin: [],
		
		currentID: '0',
			
		init: function(count){
			// get base url of files, test or prod query, target query location, and how to show results.
			for(var i = 0; i < count; i++) {
				sqlsearchwp.newWin.push(false);
			}
			var webroot = $( "#sqls-container-0" ).data('sqls-webroot');
			var which = $( "#sqls-container-0" ).data('sqls-which');
			var target = sqlsearchwp.targets[which];
			// Show the Search Page
			this.showInstructions( webroot+"includes/" );
			this.showForm( sqlsearchwp.context , false , true );
			this.showInitialResults( '<br>Results Empty!<br><br><strong>Check Syntax</strong> or <strong>Submit</strong> to get results' , count);
			
			// Prevent form submitting/reloading page
			$(".sqls-form", sqlsearchwp.context).on( "submit" , function( e ){ e.preventDefault(); });
			$(".sqls-searchform", sqlsearchwp.context).on( "submit" , function( e ){ e.preventDefault(); });
			
			// Add (delegated) click event handlers to buttons
			$(".sqls-edit", sqlsearchwp.context).on('click', sqlsearchwp.enableQuery);
			$(".sqls-query", sqlsearchwp.context).on('input', sqlsearchwp.doQueryUpdate);
			$(".sqls-download", sqlsearchwp.context).on('click', sqlsearchwp.download);
			$(".sqls-newWindow", sqlsearchwp.context).on('change', sqlsearchwp.updateCheckbox);
			$(".sqls-submit", sqlsearchwp.context).on( "click" , { target:target , which:which } , sqlsearchwp.doSubmit );
			$(".sqls-syntax", sqlsearchwp.context).on( "click" , sqlsearchwp.doSyntax );
			$(".sqls-reset", sqlsearchwp.context).on( "click" , sqlsearchwp.doReset );
			
		},
		
		showInitialResults: function(results, count) {
			for(var i = 0; i < count; i++) {
				sqlsearchwp.currentID = i.toString();
				sqlsearchwp.showResults( results , false , false, false, false );
				sqlsearchwp.showForm( sqlsearchwp.context , false , true );
			}
		},
		
		updateCheckbox: function(e) {
			var id = e.currentTarget.id;
			var index = Number(id.slice(-1));
			var setting = e.currentTarget.dataset.value;
			if (setting === "no") {
				setting = "yes";
				sqlsearchwp.newWin[index] = true;
				e.currentTarget.dataset.value = setting;
			} else {
				setting = "no";
				sqlsearchwp.newWin[index] = false;
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
		
		download: function(e) {
			var id = e.currentTarget.id;
			var docText = sessionStorage.getItem('queryResults' + id.slice(-1));
			var lines = docText.split('\n');
			docText = '';
			for (var i = 0; i < lines.length-1; i++) {
				var values = lines[i].split(',');
				for (var x = 0; x < values.length; x++) {
					values[x] = '\"'.concat(values[x]);
					values[x] += '\"';
					docText += values[x];
					if (x !== values.length - 1) {
						docText += ',';
					}
				}
				if (i !== lines.length - 1) {
					docText += '\n';
				}
			}
			var name = 'results.csv';
			var type = 'text/csv';
            var a = document.createElement("a");
			var file = new Blob([docText], {type: type});
			a.href = URL.createObjectURL(file);
			a.download = name;
			a.click();
		},

		enableQuery: function(e) {
			var id = e.currentTarget.id;
		if(e.currentTarget.dataset.unlock === "yes") {
		    $("#sqls-query-" + id.slice(-1)).prop("disabled", false);
		    e.currentTarget.dataset.unlock = "no";
			e.currentTarget.innerHTML = 'Lock';
			$("#sqls-lock-" + id.slice(-1)).prop("style", "display: none;");
		}
		else {
		    $("#sqls-query-" + id.slice(-1)).prop("disabled", true);
		    e.currentTarget.dataset.unlock = "yes";
			e.currentTarget.innerHTML='Unlock';
			$("#sqls-lock-" + id.slice(-1)).prop("style", "");
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
		   $("#sqls-query-" + id.slice(-1)).val(textValue);

	    },
		
		/**
		 * @summary Submits form data to target db
		 * 
		 * @param Object e Event Object
		**/
		doSubmit: function( e ) {
			var id = e.currentTarget.id;
			sqlsearchwp.currentID = id.slice(-1);	
			$("#sqls-hour-" + sqlsearchwp.currentID).prop("style", "");
			var query = $("#sqls-query-" + sqlsearchwp.currentID).val();
			var target = e.data.target;
			var which = e.data.which;
			target.data = {"Query":query};
			$.ajax( target );
		},
		
		/**
		 * @summary Sends form data to skyserverws for syntax review
		 * 
		 * @param Object e Event Object
		**/
		doSyntax: function( e ) {
			if (SQLSDEBUG) { console.log('doSyntax'); }
			var id = e.currentTarget.id;
			sqlsearchwp.currentID = id.slice(-1);
			$("#sqls-hour-" + id.slice(-1)).prop("style", "");
			// Get target db from form data
			var display = $( "#sqls-container-0" ).data('sqls-display');
			var _query = e.currentTarget.dataset.sqlsSubmitto +
				encodeURI( $("#sqls-query-" + id.slice(-1)).val() );

			if ( display === 'div' ) {				
				//send query from form to skyserverws and listen for return
				var xhttp;
				xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState === 4 && this.status === 200) {
						var response = this.responseText;
						sqlsearchwp.showResults( response , false , true, false );
					}
				};
				xhttp.open("GET", _query, true);
				xhttp.send();
				
			} else if ( display === 'iframe' ) {
				
			    sqlsearchwp.showResults( '' , false , true, false);
				$(sqlsearchwp.context + " .sqls-results").append('<div class="embed-responsive embed-responsive-4by3"><iframe  class="embed-responsive-item" src="' + _query + '" name="sqls-iframe" id="sqls-iframe-' + sqlsearchwp.identity + '"></iframe></div>');
				sqlsearchwp.showForm( '' , true , false );
				
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
			// Reset query - don't do this while testing...
			var id = e.currentTarget.id;
			sqlsearchwp.currentID = id.slice(-1);
			sqlsearchwp.showResults( '<br>Results Empty!<br><br><strong>Check Syntax</strong> or <strong>Submit</strong> to get results' , false , false, false, false );
			sqlsearchwp.showForm( sqlsearchwp.context , false , true );
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
			var instContainer = $(".sqls-instructions", sqlsearchwp.context);
			var instWrapper = $(".sqls-instructions-wrap", sqlsearchwp.context);
			var which = $( "#sqls-container-0" ).data('sqls-which');

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
			var toggle = $('.sqls-form-wrap>h2>a[data-toggle]', sqlsearchwp.context);
			var container = $(".sqls-form-wrap", sqlsearchwp.context);
			if (SQLSDEBUG) { console.log(  $( toggle ).attr('href') ); }
			
			var contents = ( append !== undefined && append ) ? $(container).html() : '' ;
			
			sqlsearchwp.doCollapse(sqlsearchwp.context + ' .sqls-form-wrap>h2>a[data-toggle]', container, show );
			
		},
		
		/**
		 * @summary Appends or updates the displayed Results.
		 * 
		 * @param String $results Results to display
		 * @param Boolean $append Append or replace current message(s)
		**/
		showResults: function( results , append , show, format) {
			var index = Number(sqlsearchwp.currentID);
			if(format) {
				sessionStorage.setItem('queryResults' + sqlsearchwp.currentID, results);
				$("#sqls-download-" + sqlsearchwp.currentID).prop("style", "");
			} else {
				$("#sqls-download-" + sqlsearchwp.currentID).prop("style", "display:none;");
			}
			var container = $("#sqls-results-" + sqlsearchwp.currentID);

			var contents = ( append !== undefined && append ) ? $(container).html() : '' ;
			
			contents += ( results !== undefined ) ? results : '' ;
			if (format) {
			    contents = sqlsearchwp.formatResults(contents);
			} 
			$("#sqls-hour-" + sqlsearchwp.currentID).prop("style", "display: none;");
			$(container).html(contents);
			if (sqlsearchwp.newWin[index]) {
				sqlsearchwp.openWindow(contents);
			}
			sqlsearchwp.doCollapse(sqlsearchwp.context + ' .sqls-results-wrap>h2>a[data-toggle]', $("#sqls-results-outer-" + sqlsearchwp.currentID), show );
		},

		formatResults: function(data) {
		        var output = '<pre><table class="table-bordered table-responsive">';
		        var lines = data.split('\n');
			for(var i = 0; i < lines.length - 1; i++) {
			    output += '<tr>';
			    var items = lines[i].split(',');
			    var symbolBegin = '<td>';
			    var symbolEnd = '</td>';
			    if (i === 0) {
				symbolBegin = '<th>';
				symbolEnd = '</th>';
			    }
			    for (var x = 0; x < items.length; x++) {
				output += symbolBegin;
				output += items[x];
				output += symbolEnd;
			    }
			    output += '</tr>';
			}
			output += '</table></pre>';
			return output;
			
	        }
	};

	$(document).ready( function(  ) {
		var divs = document.getElementsByClassName("sqls-wrap");
		sqlsearchwp.init(divs.length);
	} );
	
})(jQuery);