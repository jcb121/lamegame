<?php
	register_deactivation_hook( __FILE__, 'flush_rewrite_rules' );
	register_activation_hook( __FILE__, 'myplugin_flush_rewrites' );
	function myplugin_flush_rewrites() {
		
		custom_rewrite_basic();
		flush_rewrite_rules();
	}  

	//Rewrite Rule
	add_action('init', 'custom_rewrite_basic');
	function custom_rewrite_basic() {
		
		add_rewrite_rule( 'lame-game/images/([^/]+)/?', 'index.php?image=$matches[1]', 'top' );
		add_rewrite_rule( 'lame-game/sounds/([^/]+)/?', 'index.php?sound=$matches[1]', 'top' );

	}

	// Query Vars 
	add_filter( 'query_vars', 'lameGame_register_query_var' );
	function lameGame_register_query_var( $vars ) {
		$vars[] = 'image';
		$vars[] = 'sound';
		
		return $vars;
	}


	add_action('template_redirect', "lameGameReDir");
	function lameGameReDir(){
	   
	   global $wp_query; //Load $wp_query object
		
		$page_value = $wp_query->query_vars['image']; //Check for query var "blah"
		if ( !empty($page_value)){
			
			wp_redirect("http://cardiffappdevelopment.com/wp-content/plugins/lameGame/images/$page_value");
		}
		
		$page_value = $wp_query->query_vars['sound']; //Check for query var "blah"
		if ( !empty($page_value)){ 
			
			wp_redirect("http://cardiffappdevelopment.com/wp-content/plugins/lameGame/sounds/$page_value");
		}

	} 
?>