<?php
/*
Plugin Name: SQLSearchWP CasJobs
Plugin URI: https://github.com/idies/SQLSearchWP-Casjobs/blob/master/README.md
Description: Query Casjobs
Version: 1.0.0
Author: William Harrington, Bonnie Souter
Author URI: https://github.com/wharrington12
License: MIT
*/

/**
 * Singleton class for setting up the plugin.
 *
 */
final class SQLSearchWP {

	public $dir_path = '';
	public $dir_uri = '';
	public $lib_dir = '';
	public $includes_dir = '';
	public $css_uri = '';
	public $js_uri = '';
	public $bootstrap_uri = '';
	
	public $whichs=array( );
	public $displays=array( );
	public $wheres=array( );

	/**
	 * Returns the instance.
	 */
	public static function get_instance() {

		// THERE CAN ONLY BE ONE
		static $instance = null;
		if ( is_null( $instance ) ) {
			
			$instance = new SQLSearchWP;
			$instance->setup();
			$instance->includes();
			$instance->setup_actions();
		}
		return $instance;
	}
	
	/**
	 * Constructor method.
	 */
	private function __construct() {
		
		//Add Scripts
		add_action( 'wp_enqueue_scripts', array( $this , 'register_sqlswp_script' ) );
		
		//Add Shortcodes
		add_shortcode( 'sqlsearchwp-casjobs' , array( $this , 'sqlsearchwp_shortcode' ) );
		
		//Add page(s) to the Admin Menu
		add_action( 'admin_menu' , array( $this , 'sqls_menu' ) );

	}
	
	 /**
	 * Add shortcodes menu
	**/
	function sqls_menu() {

		// Add a submenu item and page to Tools 
		add_management_page( 'SQLSearchWP Settings', 'SQLSearchWP Settings', 'export', 'sqlswp-tools-page' , array( 	$this , 'sqlswp_tools_page' ) );
		
	}

	/**
	 * Add shortcodes page
	**/
	function sqlswp_tools_page() {
		
		if ( !current_user_can( 'export' ) )  {
				wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
		}
		echo '<div class="sqls-tools-wrap">';
		echo '<h2>SQLSearchWP Settings</h2>';
		echo '</div>';	
	}

	//
	function register_sqlswp_script() {
		
		//Scripts to be Registered, but not enqueued. This example requires jquery
	  if(defined('WP_ENV')) {
	    if(WP_ENV == 'development') {
		wp_register_script( 'sqlsearchwp-script', $this->js_uri . "sqlsearchwp.js" , array() , '1.0.0', true );
		
		//Styles to be Registered, but not enqueued
		wp_register_style( 'sqlsearchwp-style', $this->css_uri . "sqlsearchwp.css" );
	    } else {
	        wp_register_script( 'sqlsearchwp-script', $this->js_uri . "sqlsearchwp.min.js", array() , '1.0.0', true );
		wp_register_style( 'sqlsearchwp-style', $this->css_uri . "sqlsearchwp.min.css");
	    }
	  }
		
	}

	public function sqlsearchwp_shortcode( $atts = array() ) {

		$webroot = $this->dir_uri;
		
		$which = ( !empty( $atts) && array_key_exists( 'form' , $atts ) && 
			in_array( $atts['form'] , $this->whichs ) ) ? $atts['form'] : $this->whichs[0] ; 
		$display = ( !empty( $atts) && array_key_exists( 'display' , $atts ) && 
			in_array( $atts['display'] , $this->displays ) ) ? $atts['display'] : $this->displays[0] ; 
			
		$num = $atts['num']; 
		$color = "";
		if(!empty( $atts) && array_key_exists( 'color' , $atts )) {
			$color = $atts['color'];
		}
		else {
			$color = "black";
		}
		$instructions = "";
		if(!empty( $atts) && array_key_exists( 'instructions' , $atts )) {
			$instructions = $atts['instructions'];
		}
		else {
			$instructions = "show";
		}
		$default = "";
		if (!empty( $atts) && array_key_exists( 'default' , $atts )) {
			$default = $atts['default'];
		}
		else {
			$default = 'select top 10 p.objid, p.ra, p.dec, p.g, p.r, s.z from photoObj p join specObj s on s.bestobjid = p.objid where p.ra between -0.1 and 0.1 and p.dec between -0.1 and 0.1';
		}
		
		//Shortcode loads scripts and styles
		wp_enqueue_script( 'sqlsearchwp-script' );
		wp_enqueue_style( 'sqlsearchwp-style' );
		
		if ( defined( 'SQLS_DEVELOP' ) && SQLS_DEVELOP ) 
			wp_enqueue_script( 'bootstrap' );
		else
			wp_enqueue_script( 'bootstrap-min' );
		
		return $this->getForm( $which , $display , $webroot, $num , $color, $instructions, $default);
	}
	
	public function getContextName() {
		return $this->context_name;
	}

	/**
	 * Generate HTML for this form
	 */
	public function getForm( $which , $display , $webroot, $num, $color, $instructions, $default ) {
		//Content 
		$result = '<div id="sqls-container-'. $num . '" class="sqls-wrap" data-sqls-webroot="' . $webroot . '" data-sqls-which="' . $which . '" data-sqls-display="' . $display . '" >';
		require($this->includes_dir . 'form-'. $which . '.php'); 
		
		$result .= '</div>';
		return $result;
	}

	/**
	 * Magic method to output a string if trying to use the object as a string.
	 */
	public function __toString() {
		return 'sqlsearchwp';
	}

	/**
	 * Magic method to keep the object from being cloned.
	 */
	public function __clone() {
		_doing_it_wrong( __FUNCTION__, esc_html__( 'Sorry, no can do.', 'sqlsearchwp' ), '1.0' );
	}

	/**
	 * Magic method to keep the object from being unserialized.
	 */
	public function __wakeup() {
		_doing_it_wrong( __FUNCTION__, esc_html__( 'Sorry, no can do.', 'sqlsearchwp' ), '1.0' );
	}

	/**
	 * Magic method to prevent a fatal error when calling a method that doesn't exist.
	 */
	public function __call( $method = '', $args = array() ) {
		_doing_it_wrong( "SQLSearchWP::{$method}", esc_html__( 'Method does not exist.', 'sqlsearchwp' ), '1.0' );
		unset( $method, $args );
		return null;
	}

	/**
	 * Sets up globals.
	 */
	private function setup() {

		// Main plugin directory path and URI.
		$this->dir_path = trailingslashit( SQLS_DIR_PATH );
		$this->dir_uri  = trailingslashit( SQLS_DIR_URL );

		// Plugin directory paths.
		$this->lib_dir       = trailingslashit( $this->dir_path . 'lib'       );
		$this->includes_dir = trailingslashit( $this->dir_path . 'includes' );

		// Plugin directory URIs.
		$this->css_uri = trailingslashit( $this->dir_uri . 'css' );
		$this->js_uri  = trailingslashit( $this->dir_uri . 'js'  );
		$this->bootstrap_uri  = trailingslashit( $this->dir_uri . 'vendor/bootstrap/dist/js'  );
		
		$this->whichs=array( 
			'casjobs'
		);
		$this->displays=array( 
			'div' , 
			'iframe' 
		);
		$this->wheres=array( 
			'skyserverws' , 
			'casjobs' 
		);

	}

	/**
	 * Loads files needed by the plugin.
	 */
	private function includes() {}

	/**
	 * Sets up main plugin actions and filters.
	 */
	private function setup_actions() {

		// Register activation hook.
		register_activation_hook( __FILE__, array( $this, 'activation' ) );
	}

	/**
	 * Method that runs only when the plugin is activated.
	 */
	public function activation() {}
	
}

/**
 * Gets the instance of the `SQLSearchWP` class.  This function is useful for quickly grabbing data
 * used throughout the plugin.
 */
function sqlswp_plugin() {
	return SQLSearchWP::get_instance();
}
