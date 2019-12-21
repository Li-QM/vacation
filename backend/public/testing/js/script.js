/*global $, window, document, jQuery*/
/*
-------------------------------------------------------------------

Version: 1.0.0 (07/02/2019)
*/

/*------------------------------------------------------------------*/

jQuery(document).on('ready', function () {

    'use strict';    
   
    // Make images undraggable
    $('img').attr('draggable', 'false');

    // Smooth Scroll
    $('.nav-link').on('click', function(event) {
        var $anchor = jQuery(this);
        $('html, body').stop().animate({
            scrollTop: jQuery($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
    
});