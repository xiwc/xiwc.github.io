```java
package org.xiwc.tool;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Application {

	static Logger logger = LoggerFactory.getLogger(Application.class);

	@Bean
	public CommandLineRunner initDBRunner() {
		return new CommandLineRunner() {

			@Override
			public void run(String... arg0) throws Exception {
				logger.info("Do some initial operation.");
			}
		};
	}

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}

```
---
```javascript
jQuery(document).ready(function($) {

    $('.ui.sidebar').sidebar({

    }).sidebar('attach events', '.xwc-menu');

    $('.popup').popup({
        setFluidWidth: false,
        position: 'bottom right',
        inline: true
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
                    $('<div class="markdown-body"/>').html(converter.makeHtml(data)).appendTo('.xwc-content');
                });
            }

            $('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
            });
        });

    });
});
```
---
```html
<!DOCTYPE html>
<html lang="zh">

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
    <title>xiwc.github.io</title>
    <link rel="stylesheet" type="text/css" href="lib/semantic/semantic.css">
    <link rel="stylesheet" type="text/css" href="lib/highlight/styles/default.css">
    <link rel="stylesheet" type="text/css" href="css/md-github.css">
    <link rel="stylesheet" type="text/css" href="css/custom.css">
    <script type="text/javascript" src="lib/jquery-1.11.2.js"></script>
    <script type="text/javascript" src="lib/semantic/semantic.js"></script>
    <script type="text/javascript" src="lib/highlight/highlight.pack.js"></script>
    <script type="text/javascript" src="lib/showdown.js"></script>
    <script type="text/javascript" src="js/custom.js"></script>
</head>

<body>
    <div class="ui inverted left vertical sidebar menu">
        <div class="item">
            <div class="ui input">
                <input type="text" placeholder="Search...">
            </div>
        </div>
    </div>
    <div class="ui inverted top fixed menu">
        <a class="item xwc-menu">
            <i class="content icon"></i> 菜单
        </a>
        <a class="item" href="lib/pdfjs/web/viewer.html">PDF VIEW</a>
        <div class="right menu">
            <a class="popup icon item" data-variation="inverted" data-content="Markdown写作" target="_blank" href="editor.html">
                <i class="write icon"></i>
            </a>
            <a class="popup icon item" data-variation="inverted" data-content="在GitHub上查看项目" target="_blank" href="https://github.com/xiwc/xiwc.github.io">
                <i class="alternate github icon"></i>
            </a>
        </div>
    </div>
    <div class="pusher">
        <div class="ui basic segment"></div>
        <div class="ui basic segment xwc-body">
            <h3 class="ui top attached header">
              <span class="xwc-title">标题</span>
              <div class="sub header xwc-sub-header">
                  <span>发布日期:</span><span class="xwc-datetime">2015/05/27 12:00:00</span>
                  <span>分类:</span><span class="xwc-category">Linux</span>
              </div>
            </h3>
            <div class="ui bottom attached segment">
                <p class="xwc-content">内容</p>
            </div>
        </div>
    </div>
</body>

</html>
```
