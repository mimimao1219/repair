
woshishi 
bback
./mongodump -h 127.0.0.1:27017 -d repair_dev -o /Users/lee/git/fyrepair/

./mongorestore -h 127.0.0.1:27017 -d repair_dev –directoryperdb /Users/lee/git/fyrepair/repair_dev/

http://repair.ittun.com

## 安装部署

*不保证 Windows 系统的兼容性*

线上跑的是 [io.js](https://iojs.org) v2.3.3，[MongoDB](https://www.mongodb.org) 是 v2.6，[Redis](http://redis.io) 是 v2.8.9。

```
1. 安装 `Node.js/io.js[必须]` `MongoDB[必须]` `Redis[必须]`
2. 启动 MongoDB 和 Redis
3. `$ make install` 安装 Nodeclub 的依赖包
4. `cp config.default.js config.js` 请根据需要修改配置文件
5. `$ make test` 确保各项服务都正常
6. `$ node app.js`
7. visit `http://localhost:3000`
8. done!
```
安装：npm install -g pm2
启动程序：pm2 start <app_name|id|all>    pm2 start app.js --name "repair"
列举进程：pm2 list
退出程序：pm2 stop <app_name|id|all>
重起应用：pm2 restart
程序信息：pm2 describe id|all
监控：pm2 monit
实时集中log处理: pm2 logs
API:pm2 web (端口：9615 )
## 测试

跑测试

```bash
$ make test
```

跑覆盖率测试

```bash
$ make test-cov
```
