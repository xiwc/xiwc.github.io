jQuery(document).ready(function($) {

    $('.ui.sidebar').sidebar({

    }).sidebar('attach events', '.xwc-menu');

    var regexHtml = /.*\.html/i;
    var regexMd = /.*\.md/i;

    $.getJSON("data/articles.json", function(data) {
        $.each(data.articles, function(i, item) {
            $('.ui.menu.sidebar').append($('<a class="item"/>').attr('data-href', item.path).text(item.name));
        });

        $('.ui.menu.sidebar a.item').click(function(event) {

            $(this).parent().find('a.item').removeClass('active');
            $(this).addClass('active');

            $('.xwc-title').text($(this).text());
            var url = $(this).attr('data-href');

            if (regexHtml.test(url)) {
                $.get(url, function(data) {
                    $('.xwc-content').html(data);
                });
            } else if (regexMd.test(url)) {
                $.get(url, function(data) {
                    $('.xwc-content').html(markdown.toHTML(data));
                });
            }
        });

    });
});
