<?php 
$result .= '<div class="row">
	<div class="col-lg-12">
		<div class="sqls-messages-wrap">
			<div class="sqls-messages">
			</div>
		</div>
	</div>
	<div class="col-xs-12">';
	if($instructions === 'show') {
		$result.= 
		'<div class="sqls-instructions-wrap well well-sm"> 
			<h2><a name="instruct" role="button" data-toggle="collapse" href="#sqls-instructions-'.$num.'" aria-expanded="true" aria-controls="sqls-instructions">Instructions</a></h2>
			<div id="sqls-instructions-'.$num.'" class="sqls-instructions collapse">
			</div> 
		</div>';
	}
		$result .= '<div class="sqls-form-wrap well well-sm">
			<h2><a name="search" role="button" data-toggle="collapse" href="#sqls-form-'.$num.'" aria-expanded="true" aria-controls="sqls-form">SQL Search</a></h2>
			<div class="form sqls-form">
				<form id="sqls-form-'.$num.'" class="sqls-form collapse">
				<div class="row">
					<div class="col-xs-12 col-sm-12 col-md-6 text-center">
						<div class="row">
							<div class="col-xs-12 col-sm-12 col-md-6 text-center">
								<button id="sqls-edit-'.$num.'" name="sqls-edit" class ="sqls-edit btn btn-primary btn-dr14" data-unlock="yes">Unlock</button>
							</div>
							<div class="col-xs-12 col-sm-12 col-md-6 text-center">
								<button id="sqls-syntax-'.$num.'" name="sqls-syntax" data-sqls-submitto="http://skyserver.sdss.org/dr14/en/tools/search/x_results.aspx?searchtool=SQL&TaskName=Skyserver.Search.SQL&ReturnHtml=true&format=html&syntax=Syntax&cmd=" class="sqls-syntax btn btn-warning btn-dr14">Check Syntax</button>
							</div>
						</div>
						<div class="row">
							<div class="col-xs-12 col-sm-12 col-md-12 text-center">
								<p><strong>QUERY DR14</strong></p>
								<div id="sqls-lock-'.$num.'" class="sqls-lock" style=""><span class="glyphicon glyphicon-lock"></span></div>
								<textarea id="sqls-query-'.$num.'" name="cmd" class="sqls-query" style="color: '.$color.'" data-colnum=60 rows=10 cols=30 disabled>'.$default.'</textarea>
							</div>
						</div>
						<div class="row">
							<div class="col-xs-12 col-sm-12 col-md-6 text-center">
								<button id="sqls-reset-'.$num.'" name="sqls-reset" class="sqls-reset btn btn-danger btn-dr14">Reset</button>
							</div>
							<div class="col-xs-12 col-sm-12 col-md-6 text-center">
								<button id="sqls-submit-'.$num.'" name="sqls-submit" class="sqls-submit btn btn-success btn-dr14">Submit</button>
								<div class="checkbox">
									<label><input type="checkbox" id="sqls-newWindow-'.$num.'" class="sqls-newWindow" data-value="no">Open in New Tab</label>
									<a name="mode" href="#" data-toggle="modal" data-target="#myModal-'.$num.'"><span class="glyphicon glyphicon-info-sign"></span></a>
								</div>
								<div class="modal fade" id="myModal-'.$num.'" role="dialog">
									<div class="modal-dialog modal-sm sqls-modal-dialog">
    
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
						<div class="sqls-results-wrap">
							<a name="result" role="button" data-toggle="collapse" href="#sqls-results-outer-'.$num.'" aria-expanded="false" aria-controls="sqls-results"><strong>RESULTS</strong></a>
							<div id="sqls-hour-'.$num.'" class="sqls-hour" style="display: none;"><span class="glyphicon glyphicon-hourglass"></span></div>
							<div id="sqls-results-outer-'.$num.'" class="sqls-results-outer collapse">
								<div id="sqls-results-'.$num.'" class="sqls-results"></div>
								<button id="sqls-download-'.$num.'" style="display:none;" name="sqls-download" class ="sqls-download btn btn-primary btn-dr14">Download</button>
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