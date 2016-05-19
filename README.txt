windows安装
试试
1、安装mongodb-win32-x86_64-3.2.4-signed 数据库放到d盘，再新建d:\data\db 数据库存放路径。
2、安装node-v5.10.1-x64.msi 直接点击下一步安装 也装到d盘。
3、启动mongoDB：  启动mongoDB安装包服务端mongod.exe
4、将fyrepair.zip 解压到d盘。其中repair_dev目录是数据库备份目录，需要修改的文件是config.js
   // 设置域名
  host: 'localhost',
  // 程序运行的端口
  port: 3000,
   //微信
  weixin: {
  		appId: 'wxc6459c121f2e6399',
        appSecret: 'ae9b79a09a05aef3ff0b72e21174a2d0',
        appToken: 'mimimao',
        jsdkToken: '',
        templateId:'ValECG0NODDNWsthxekCyJ_ux90KyZrz7rEZ2hLAGmI',
 	},

 	主要这几个参数更据需要修改。

 5、导入数据库，在cmd命令行输入
cd d:\MongoDB\Server\3.2\bin
mongorestore.exe -h 127.0.0.1:27017 /d repair_dev /dir d:\fyrepair\repair_dev

6、启动app.js，在cmd命令行输入
cd d:\fyrepair
node app.js
