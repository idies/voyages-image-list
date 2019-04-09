<?php
/*
Plugin Name: Voyages Image List
Plugin URI: https://github.com/idies/voyages-image-list/blob/master/README.md
Description: Process SQL query of DR14 database and use results to display images.
Version: 1.0.0
Author: William Harrington
Author URI: https://github.com/wharrington12
License: MIT
*/

// Only allow this script to be run within WordPress
defined('ABSPATH') or die("Unknown Access Error");

define( 'VIL_DIR_PATH' , plugin_dir_path( __FILE__ ) );
define( 'VIL_DIR_URL' , plugin_dir_url( __FILE__ ) );
define( 'VIL_DEVELOP' , TRUE );

// load the class file
require_once( VIL_DIR_PATH . 'lib/voyages-image-list.php' );

// Let's roll!
vil_plugin();
