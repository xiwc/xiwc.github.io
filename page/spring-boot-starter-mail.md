# spring-boot-starter-mail使用总结  

> 通过spring boot来使用mail可以实现该框架自动配置注入`MailSender`单例模式组件(component).

---

### `pom.xml`中引入dependency
```
  <dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-mail</artifactId>
  </dependency>
```

### `application.properties`中加入创建`MailSender`实例需要的配置参数

```
# spring mail
spring.mail.host=smtp.163.com
spring.mail.port=25
spring.mail.username=test@163.com
spring.mail.password=******
spring.mail.default-encoding=UTF-8
```

### 简单针对`MailSender`的发送邮件测试

```java
package com.test.component;

import java.util.Date;

import javax.mail.MessagingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.testng.annotations.Test;

import com.test.Application;

@SpringApplicationConfiguration(classes = Application.class)
public class MailSenderTest extends AbstractTestNGSpringContextTests {

 @Autowired
 MailSender mailSender;

 @Test
 public void sendHtml() throws MessagingException {

  SimpleMailMessage message = new SimpleMailMessage();
  message.setFrom("test@163.com");
  message.setTo("test@yeah.net");
  message.setSubject("Mail Sender测试 " + new Date().getTime());
  message.setText("Mail Sender Test.... 邮件正文内容...");
  message.setCc("test1@yeah.net");
  message.setBcc("test2@yeah.net");

  mailSender.send(message);

 }

}
```

### 自定义封装邮件发送类

```

package com.test.component;

import java.io.File;
import java.io.IOException;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeUtility;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

/**
 * 
 * @author xi
 * 
 * @date 2015年6月14日 上午10:31:32
 * 
 */
@Component("myMailSender2")
// 此处component名称不能使用`mailSender`,这会与spring boot自定配置注入的`MailSender`组件实例名称冲突,导致自动配置注入失败
public class MailSender2 {

 @Autowired
 JavaMailSender mailSender;

 public boolean sendText(String subject, String text, String... toAddr) {

  SimpleMailMessage message = new SimpleMailMessage();
  message.setFrom(((JavaMailSenderImpl) mailSender).getUsername());
  message.setTo(toAddr);
  message.setSubject(subject);
  message.setText(text);

  mailSender.send(message);

  return true;
 }

 public boolean sendHtml(String subject, String html, String... toAddr)
   throws MessagingException {

  MimeMessage mimeMessage = mailSender.createMimeMessage();
  MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false,
    "UTF-8");

  helper.setFrom(((JavaMailSenderImpl) mailSender).getUsername());
  helper.setTo(toAddr);
  helper.setSubject(subject);
  helper.setText(html, true);

  mailSender.send(mimeMessage);

  return true;
 }

 public boolean sendHtmlWithAttachment(String subject, String html,
   String[] attachmentPaths, String... toAddr)
   throws MessagingException, IOException {

  MimeMessage mimeMessage = mailSender.createMimeMessage();
  MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true,
    "UTF-8");

  helper.setFrom(((JavaMailSenderImpl) mailSender).getUsername());
  helper.setTo(toAddr);
  helper.setSubject(subject);
  helper.setText(html, true);

  for (String path : attachmentPaths) {
   helper.addAttachment(MimeUtility.encodeText(
     new File(path).getName(), "UTF-8", "B"),
     new FileSystemResource(path));
  }

  mailSender.send(mimeMessage);

  return true;
 }
}
```

### 自定义封装邮件发送类测试

```java
package com.test.component;

import java.io.IOException;
import java.util.Date;

import javax.mail.MessagingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.testng.annotations.Test;

import com.test.Application;
import com.test.util.MapUtil;
import com.test.util.TemplateUtil;

@SpringApplicationConfiguration(classes = Application.class)
public class MailSender2Test extends AbstractTestNGSpringContextTests {

 @Autowired
 MailSender2 mailSender;

 @Test
 public void sendHtml() throws MessagingException {

  mailSender
    .sendHtml(
      "标题" + new Date().getTime(),
      "<html><head><meta charset='utf-8' /></head><body><h1>邮件标题</h1><p>邮件内容...</p></body></html>",
      "test1@yeah.net", "test2@yeah.net");

 }

 @Test
 public void sendHtmlWithAttachment() throws MessagingException, IOException {

  String html = TemplateUtil.process("templates/test",
    MapUtil.objArr2Map("title", "标题", "header", "消息标题", "message",
      "消息..."));

  mailSender.sendHtmlWithAttachment("标题" + new Date().getTime(), html,
    new String[] { "D:\\xiwc-desktop\\Dropzone-configration.pdf",
      "D:\\xiwc-desktop\\CentOS+nginx+jdk+tomcat.txt",
      "D:\\xiwc-desktop\\xiwc.jpg" }, "test1@yeah.net",
    "test2@yeah.net");
 }

 @Test
 public void sendText() {
  mailSender.sendText("标题" + new Date().getTime(), "内容...",
    "test1@yeah.net", "test2@yeah.net");
 }
}
```

### 使用到的MapUtil

```java
package com.test.util;

import java.util.HashMap;
import java.util.Map;

/**
 * Map处理工具类.
 * 
 * @creation 2013-10-10 下午3:05:53
 * @modification 2013-10-10 下午3:05:53
 * @company Canzs
 * @author xiweicheng
 * @version 1.0
 * 
 */
public final class MapUtil {

 // private static Logger logger = Logger.getLogger(MapUtil.class);

 private MapUtil() {
  super();
 }

 public static Map<String, Object> convert2Object(Map<String, String> map) {

  Map<String, Object> newMap = new HashMap<>();
  newMap.putAll(map);

  return newMap;
 }

 public static Map<String, String> convert2String(Map<String, Object> map) {

  Map<String, String> newMap = new HashMap<>();

  for (String key : map.keySet()) {
   newMap.put(key, String.valueOf(map.get(key)));
  }

  return newMap;
 }

 /**
  * 字符串数组转化为Map<String, Object>
  * 
  * @author xiweicheng
  * @creation 2013年11月30日 下午6:22:26
  * @modification 2013年11月30日 下午6:22:26
  * @param values
  * @return
  */
 public static Map<String, Object> objArr2Map(Object... values) {

  Map<String, Object> map = new HashMap<>();

  if (values.length > 0) {

   for (int i = 0; i < values.length; i += 2) {

    if (i + 1 < values.length) {
     map.put(String.valueOf(values[i]), values[i + 1]);
    }
   }
  }

  return map;
 }

 /**
  * 字符串数组转化为Map<String, Object>
  * 
  * @author xiweicheng
  * @creation 2013年11月30日 下午6:22:26
  * @modification 2013年11月30日 下午6:22:26
  * @param values
  * @return
  */
 public static Map<String, String> strArr2Map(String... values) {

  Map<String, String> map = new HashMap<>();

  if (values.length > 0) {

   for (int i = 0; i < values.length; i += 2) {

    if (i + 1 < values.length) {
     map.put(values[i], values[i + 1]);
    }
   }
  }

  return map;
 }

}
```

### 使用到的TemplateUtil

```java
package com.test.util;

import java.util.Locale;
import java.util.Map;

import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.thymeleaf.templateresolver.TemplateResolver;

/**
 * Template工具类.
 * 
 * @author xi
 * 
 * @date 2015年6月14日 上午11:09:34
 * 
 */
public class TemplateUtil {

 public static TemplateEngine templateEngine;

 static {

  templateEngine = new TemplateEngine();

  TemplateResolver resolver = new ClassLoaderTemplateResolver();
  resolver.setTemplateMode("LEGACYHTML5");
  resolver.setCharacterEncoding("UTF-8");
  resolver.setSuffix(".html");
  resolver.setCacheable(false);

  templateEngine.setTemplateResolver(resolver);
 }

 /**
  * thymeleaf template engine handle template.
  * 
  * @param templateName
  * @param modelMap
  * @return
  */
 public static String process(String templateName,
   Map<String, Object> modelMap) {

  return templateEngine.process(templateName,
    new Context(Locale.getDefault(), modelMap));
 }

}
```

### 模板技术使用的是thymeleaf

> 该模板技术是基于java的,最大的牛叉之处就是,可以在绑定数据到视图页面的后,不破坏静态页面的显示效果.极大的方便页面设计.

---

### `pom.xml`引入dependency

```
  <dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-thymeleaf</artifactId>
  </dependency>
```

### 结语

> spring boot starter中提供大量的自动化配置模块,只要引入对应的`dependency`,然后配置对应配置参数到`application.properites`就可以使用自动化配置的对象实例.  
> 体现的原则:`规约犹豫配置`