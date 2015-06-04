jQuery(document).ready(function($) {

    $('.ui.sidebar').sidebar({

    }).sidebar('attach events', '.xwc-menu');

    $('.popup').popup({
        setFluidWidth: false,
        position: 'bottom right',
        inline: true
    });

    var searchContent = [];

    $('.ui.search').search({
        source: searchContent,
        onSelect: function(result, response) {

            $('.ui.menu.sidebar a.item').each(function(index, el) {
                if($(el).attr('data-href') == result.href){
                    $(el).triggerHandler('click');
                    return false;
                }
            });
        }
    });

    var regexHtml = /.*\.html/i;
    var regexMd = /.*\.md/i;

    var converter = new showdown.Converter();

    $.getJSON("data/articles.json", function(data) {
        $.each(data.articles, function(i, item) {
            if (!item.hasOwnProperty("hidden") || !item.hidden) {
                $('.ui.menu.sidebar').append($('<a class="item"/>').attr({
                    "data-href": item.path,
                    "data-category": item.category,
                    "data-date": item.date,
                    "data-time": item.time
                }).text(item.name));

                searchContent.push({
                    title: item.name,
                    category: item.category,
                    href: item.path,
                    date: item.date,
                    time: item.time
                });
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
                    // highlight code block
                    $('pre code').each(function(i, block) {
                        hljs.highlightBlock(block);
                    });
                });
            } else if (regexMd.test(url)) {
                $.get(url, function(data) {
                    $('<div class="markdown-body"/>').html(converter.makeHtml(data)).appendTo('.xwc-content');
                    // highlight code block
                    $('pre code').each(function(i, block) {
                        hljs.highlightBlock(block);
                    });
                });
            }

        });

    });
});
