<?php 
$result .= '<div class="row">
	<div class="col-lg-12">
		<div class="vil-messages-wrap">
			<div class="vil-messages">
			</div>
		</div>
	</div>
	<div class="col-xs-12">
		<div class="vil-instructions-wrap well well-sm"> 
			<h2><a name="instruct" role="button" data-toggle="collapse" href="#vil-instructions" aria-expanded="true" aria-controls="vil-instructions">Instructions</a></h2>
			<div id="vil-instructions" class="vil-instructions collapse">
			</div> 
		</div>
		<div class="vil-form-wrap well well-sm">
			<h2><a name="search" role="button" data-toggle="collapse" href="#vil-form" aria-expanded="true" aria-controls="vil-form">Image List</a></h2>
			<div class="form vil-form">
				<form id="vil-form" class="vil-form collapse">
				<div class="row">
					<div class="col-xs-12 col-sm-12 col-md-6 text-center">
						<div class="row">
							<div class="col-xs-12 col-sm-12 col-md-6 text-center">
								<button id="vil-edit" name="vil-edit" class ="vil-edit btn btn-primary btn-dr14" data-unlock="yes">Unlock</button>
							</div>
							<div class="col-xs-12 col-sm-12 col-md-6 text-center">
								<button id="vil-syntax" name="vil-syntax" data-vil-submitto="http://skyserver.sdss.org/dr14/en/tools/search/x_results.aspx?searchtool=SQL&TaskName=Skyserver.Search.SQL&ReturnHtml=true&format=html&syntax=Syntax&cmd=" class="vil-syntax btn btn-warning btn-dr14">Check Syntax</button>
							</div>
						</div>
						<div class="row">
							<div class="col-xs-12 col-sm-12 col-md-12 text-center">
								<p><strong>QUERY DR15</strong></p>
								<div id="vil-lock" class="vil-lock" style=""><span class="glyphicon glyphicon-lock"></span></div>
								<textarea id="vil-query" name="cmd" class="vil-query" data-colnum=60 rows=10 cols=30 disabled>select top 10 specobjid as name, ra, dec from SpecObj</textarea>
							</div>
						</div>
						<div class="row">
							<div class="col-xs-12 col-sm-12 col-md-6 text-center">
								<button id="vil-reset" name="vil-reset" class="vil-reset btn btn-danger btn-dr14">Reset</button>
							</div>
							<div class="col-xs-12 col-sm-12 col-md-6 text-center">
								<button id="vil-submit" name="vil-submit" class="vil-submit btn btn-success btn-dr14">Submit</button>
								<div class="checkbox">
									<label><input type="checkbox" id="vil-newWindow" class="vil-newWindow" data-value="no">Open in New Tab</label>
									<a name="mode" href="#" data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-info-sign"></span></a>
								</div>
								<div class="modal fade" id="myModal" role="dialog">
									<div class="modal-dialog modal-sm vil-modal-dialog">
    
										<!-- Modal content-->
										<div class="modal-content">
											<div class="modal-header">
												<button type="button" class="close" data-dismiss="modal">&times;</button>
												<h4 class="modal-title">Important</h4>
											</div>
											<div class="modal-body">
												Be sure to enable pop-ups on this site to allow results to open in a new tab.
											</div>
											<div class="modal-footer">
												<button type="button" class="btn btn-default btn-primary btn-dr14" data-dismiss="modal">Close</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-xs-12 col-sm-12 col-md-6 text-center">
						<div class="vil-results-wrap">
							<a name="result" role="button" data-toggle="collapse" href="#vil-results-outer" aria-expanded="false" aria-controls="vil-results"><strong>RESULTS</strong></a>
							<div id="vil-hour" class="vil-hour" style="display: none;"><span class="glyphicon glyphicon-hourglass"></span></div>
							<div id="vil-results-outer" class="vil-results-outer collapse">
								<div id="vil-results" class="vil-results"></div>
								<button id="vil-download" style="display:none;" name="vil-download" class ="vil-download btn btn-primary btn-dr14">Download</button>
							</div>
						</div>
					</div>
				</div>
				</form>
			</div>
		</div>
	</div>
</div>'
?>