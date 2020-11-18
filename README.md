# 在这里记录

这个项目已经 **停止开发和维护**。

数据库课程设计，一个数据记录应用，计划做成可以自己部署的 Web 应用程序。

## 写在前面

本来就一直想做一个自己的“记录”应用，像一个人的微博（或者说饭否？）和日记本，正好赶上上数据库课程设计这门课，就打算实现一下这个想法。

最初计划了很多功能，像是用 Docker 部署、实现多平台自适应、数据备份等等，但是由于时间和技术的限制，没有办法来完成，不过也实现了很多的功能，在当时也算是比较满意了。

课程结束后，又赶上暑假实习和开学，就一直没有继续开发。

再到后来的后来，又接触和了解了很多新的技术，也有了更多的想法，再回头看一下之前的这个项目，果然还是有很多的不足。这是我第一次用 React 和 Next.js 做项目，一边看文档一边写，代码和实现都做得不太好（虽然现在也没有太多进步），所以还是有很多不成熟的地方。

所以我打算“放弃”这个项目，不过这个项目的本意——数据记录，应该会在不久之后的另一个项目中出现，希望到时候可以做得更好一些，敬请期待。

写于 2020 年 11 月 18 日。

## 用到的技术

- React

- Next.js

- Material-UI

- SQLite3

更多技术可以查看 package.json。

## 目前已经实现的功能

- 登录验证

- 基本的服务端渲染

- Markdown 的编辑与展示

- 记录的发布，包括图片的插入和标签的插入

- 记录的喜欢、附言和删除功能

- 标签的添加和删除，以及分类查看

- 喜欢的记录的查看

- 用户数据的统计功能

## 预览

![登录页面](docs/screenshot-login.jpg "登录页面")

![页面布局](docs/screenshot-overview.jpg "页面布局")

![一条记录](docs/screenshot-record.png "一条记录")

![新建一个记录](docs/screenshot-new-record.jpg "新建一个记录")

![编辑一个记录](docs/screenshot-record-edit.jpg "编辑一个记录")

![编辑标签](docs/screenshot-tag-edit.jpg "编辑标签")

![某个标签页](docs/screenshot-tag-page.png "某个标签页")

![喜欢页](docs/screenshot-like.png "喜欢页")

![统计信息页](docs/screenshot-info.png "统计信息页")

## 开发与配置

启动项目之前，需要编写两个配置文件（在项目根目录下的 `configs` 文件夹）：

1. `/configs/config.json` 存放使用者的基本信息，以及 OSS 配置，格式如下：
   
   ```json
   {
     "name": "Record",
     "description": "在这里记录。",
     "user": {
       "name": "Lifeni",
       "avatar": "https://example.com/avatar.jpg"
     },
     "oss": {
       "region": "...",
       "accessKeyId": "...",
       "accessKeySecret": "...",
       "bucket": "..."
     }
   }
   ```

2. `/configs/password.json` 存放登录密码和 JWT 加密秘钥，格式如下：
   
   ```json
   {
     "loginPassword": "1234",
     "jwtPassword": "1234"
   }
   ```

除了 Node.js 环境，编译 SQLite 还需要 Python2 环境。~~建议使用 cnpm 进行安装~~。

```bash
$ cnpm i
$ npm run dev
```

现在建议使用 Yarn 进行安装：

```bash
$ yarn
$ yarn dev
```
