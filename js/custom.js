jQuery(document).ready(function($) {

    $('.ui.sidebar').sidebar({

    }).sidebar('attach events', '.xwc-menu');

    $('.popup').popup({
        setFluidWidth: false,
        inline: true
    });

    var regexHtml = /.*\.html/i;
    var regexMd = /.*\.md/i;

    $.getJSON("data/articles.json", function(data) {
        $.each(data.articles, function(i, item) {
            if (!item.hasOwnProperty("hidden") || !item.hidden) {
                $('.ui.menu.sidebar').append($('<a class="item"/>').attr({
                    "data-href": item.path,
                    "data-category": item.category,
                    "data-date": item.date,
                    "data-time": item.time
                }).text(item.name));
            }
        });

        $('.ui.menu.sidebar a.item').click(function(event) {

            $(this).parent().find('a.item').removeClass('active');
            $(this).addClass('active');

            $('.xwc-title').text($(this).text());
            $('.xwc-datetime').text($(this).attr('data-date') + " " + $(this).attr('data-time'));
            $('.xwc-category').text($(this).attr('data-category'));
            var url = $(this).attr('data-href');

            $('.xwc-content').empty();

            if (regexHtml.test(url)) {
                $.get(url, function(data) {
                    $('.xwc-content').html(data);
                });
            } else if (regexMd.test(url)) {
                $.get(url, function(data) {
                    $('<div class="markdown-body"/>').html(markdown.toHTML(data)).appendTo('.xwc-content');
                });
            }
        });

    });
});
