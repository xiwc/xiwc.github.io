jQuery(document).ready(function($) {

    $('.ui.sidebar').sidebar({

    }).sidebar('attach events', '.xwc-menu');


    $.get("data/articles.json", function(data) {
        $.each(data.articles, function(i, item) {
            $('.ui.menu').append($('<a class="item"/>').attr('data-href', item.path).text(item.name));
        });

        $('.ui.menu a.item').click(function(event) {
            $('.xwc-title').text($(this).text());
            $('.xwc-content').load($(this).attr('data-href'));
        });

    });

});
