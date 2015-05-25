jQuery(document).ready(function($) {

    $('.ui.sidebar').sidebar({

    }).sidebar('attach events', '.xwc-menu');

    var regexHtml = /.*\.html/gi;
    var regexMd = /.*\.md/gi;
    var regexPdf = /.*\.pdf/gi;


    $.getJSON("data/articles.json", function(data) {
        $.each(data.articles, function(i, item) {
            $('.ui.menu.sidebar').append($('<a class="item"/>').attr('data-href', item.path).text(item.name));
        });

        $('.ui.menu.sidebar a.item').click(function(event) {
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
            } else if (regexPdf.test(url)) {
                $('.xwc-content').html('<canvas id="the-canvas" style="border:1px solid black;"/>')
                PDFJS.getDocument(url).then(function(pdf) {
                    // Using promise to fetch the page
                    pdf.getPage(1).then(function(page) {
                        var scale = 1.5;
                        var viewport = page.getViewport(scale);

                        //
                        // Prepare canvas using PDF page dimensions
                        //
                        var canvas = document.getElementById('the-canvas');
                        var context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        //
                        // Render PDF page into canvas context
                        //
                        var renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        page.render(renderContext);
                    });
                });
            }
        });

    });

});
