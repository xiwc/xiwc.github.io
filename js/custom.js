jQuery(document).ready(function($) {

    $('.ui.sidebar').sidebar({

    }).sidebar('attach events', '.xwc-menu');


    $('.ui.sidebar a.item').click(function(event) {

        $('.xwc-content').load($(this.attr('data-href')),
            function() {
                
            });

    });

});
