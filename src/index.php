<?php
/*
Plugin Name: Lame Game
Plugin URI: 52webdesigns.co.uk
Description: A simple canvas game
Version: 1.0
Author: Jesse Baker
Author URI: jcb121.com
*/


/*
 * URL REDIRECTION
 */

 include( plugin_dir_path( __FILE__ ) . 'redirector.php');
 

// shortcode [lameGame]
function lameGame_preheader() { 
    if ( !is_admin() ) { 
        global $post; 
 
        if ( !empty( $post->post_content ) 
        &&  strpos( $post->post_content, "[lameGame]" ) !== false ) { 
        
        /* Put your preheader code here. */ 
			
			
			wp_enqueue_script('satjs', plugins_url('sat-js/SAT.js', __FILE__), array(), '', false);
			
			wp_enqueue_script('gameLoading', plugins_url('js/gameLoading.js', __FILE__), array(), '', false);
			wp_enqueue_script('sound', plugins_url('js/sound.js', __FILE__), array(), '', false);
			wp_enqueue_script('functions', plugins_url('js/functions.js', __FILE__), array(), '', false);
			
			wp_enqueue_script('worldProp', plugins_url('js/worldProp.js', __FILE__), array(), '', false);
			wp_enqueue_script('playerAnimations', plugins_url('js/config/playerAnimations.js', __FILE__), array(), '', false);
			wp_enqueue_script('controls', plugins_url('js/controls.js', __FILE__), array(), '', false);
			
			wp_enqueue_script('weapons', plugins_url('js/config/weapons.js', __FILE__), array(), '', false);
			wp_enqueue_script('props', plugins_url('js/config/props.js', __FILE__), array(), '', false);
			wp_enqueue_script('tool', plugins_url('js/tool.js', __FILE__), array(), '', false);
			wp_enqueue_script('player', plugins_url('js/player.js', __FILE__), array(), '', false);
			wp_enqueue_script('mouse', plugins_url('js/mouse.js', __FILE__), array(), '', false);
			wp_enqueue_script('menus', plugins_url('js/menu.js', __FILE__), array(), '', false);
			wp_enqueue_script('ai', plugins_url('js/ai.js', __FILE__), array(), '', false);
			wp_enqueue_script('loadScreen', plugins_url('js/loadScreen.js', __FILE__), array(), '', false);
			
			wp_enqueue_script('game', plugins_url('js/game.js', __FILE__), array('jquery'), '', true);
		
        } 
    } 
} 
 
add_action( 'wp', 'lameGame_preheader', 1 );


function lameGame_shortcode() {  
    
    ob_start(); ?>
		
    <!-- HTML CODE HERE -->
	<div id="lameGame"></div>
    
    <?php 
    $temp_content = ob_get_contents(); 
    ob_end_clean(); 
    return $temp_content; 
}

add_shortcode( 'lameGame', 'lameGame_shortcode' );