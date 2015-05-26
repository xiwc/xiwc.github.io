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
            } else if (regexPdf.test(url)) {
                pdfPageView(url);
            }
        });

    });

    function pdfPageView(url) {

        $('.xwc-content').html('<div id="pageContainer" class="pdfPage"></div>');
        
        var PAGE_TO_VIEW = 1;
        var SCALE = 1.0;

        var container = document.getElementById('pageContainer');

        // Loading document.
        PDFJS.getDocument(url).then(function(pdfDocument) {
            // Document loaded, retrieving the page.
            return pdfDocument.getPage(PAGE_TO_VIEW).then(function(pdfPage) {
                // Creating the page view with default parameters.
                var pdfPageView = new PDFJS.PDFPageView({
                    container: container,
                    id: PAGE_TO_VIEW,
                    scale: SCALE,
                    defaultViewport: pdfPage.getViewport(SCALE),
                    // We can enable text/annotations layers, if needed
                    textLayerFactory: new PDFJS.DefaultTextLayerFactory(),
                    annotationsLayerFactory: new PDFJS.DefaultAnnotationsLayerFactory()
                });
                // Associates the actual page with the view, and drawing it
                pdfPageView.setPdfPage(pdfPage);
                return pdfPageView.draw();
            });
        });
    }

    function pdfView(url) {

        $('.xwc-content').html('<canvas id="the-canvas" style="width:100%; border:1px solid black;"/>');
        $('.xwc-content').prepend('<div> <button id="prev">Previous</button> <button id="next">Next</button> &nbsp; &nbsp; <span>Page: <span id="page_num"></span> / <span id="page_count"></span></span> </div>')


        var pdfDoc = null,
            pageNum = 1,
            pageRendering = false,
            pageNumPending = null,
            scale = 1.0,
            canvas = document.getElementById('the-canvas'),
            ctx = canvas.getContext('2d');

        /**
         * Get page info from document, resize canvas accordingly, and render page.
         * @param num Page number.
         */
        function renderPage(num) {
            pageRendering = true;
            // Using promise to fetch the page
            pdfDoc.getPage(num).then(function(page) {
                var viewport = page.getViewport(scale);
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                // Render PDF page into canvas context
                var renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                };
                var renderTask = page.render(renderContext);
                // Wait for rendering to finish
                renderTask.promise.then(function() {
                    pageRendering = false;
                    if (pageNumPending !== null) {
                        // New page rendering is pending
                        renderPage(pageNumPending);
                        pageNumPending = null;
                    }
                });
            });
            // Update page counters
            document.getElementById('page_num').textContent = pageNum;
        };

        /**
         * If another page rendering in progress, waits until the rendering is
         * finised. Otherwise, executes rendering immediately.
         */
        function queueRenderPage(num) {
            if (pageRendering) {
                pageNumPending = num;
            } else {
                renderPage(num);
            }
        };

        /**
         * Displays previous page.
         */
        function onPrevPage() {
            if (pageNum <= 1) {
                return;
            }
            pageNum--;
            queueRenderPage(pageNum);
        };

        /**
         * Displays next page.
         */
        function onNextPage() {
            if (pageNum >= pdfDoc.numPages) {
                return;
            }
            pageNum++;
            queueRenderPage(pageNum);
        };

        document.getElementById('prev').addEventListener('click', onPrevPage);
        document.getElementById('next').addEventListener('click', onNextPage);

        /**
         * Asynchronously downloads PDF.
         */
        PDFJS.getDocument(url).then(function(pdfDoc_) {
            pdfDoc = pdfDoc_;
            document.getElementById('page_count').textContent = pdfDoc.numPages;
            // Initial/first page rendering
            renderPage(pageNum);
        });
    }

});
