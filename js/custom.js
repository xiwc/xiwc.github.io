jQuery(document).ready(function($) {

    $('.ui.sidebar').sidebar({

    }).sidebar('attach events', '.xwc-menu');

    $('.ui.sidebar a.item').click(function(event) {

    	$('.xwc-title').text($(this).text());
        $('.xwc-content').load($(this).attr('data-href'));

    });

});
