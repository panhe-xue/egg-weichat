'use strict';
const path = require('path');

module.exports = () => {
  const config = exports = {};
  config.mysql = {
    client: {
      host: '127.0.0.1',
      port: '3306',
      user: 'root',
      password: '123456',
      database: 'wechat',
      charset: 'utf8mb4',
      debug: true,
    },
  };
  config.cluster = {
    listen: {
      port: 7002,
      hostname: '127.0.0.1',
      // path: '/var/run/egg.sock',
    },
  };
  config.logger = {
    consoleLevel: 'DEBUG',
    disableConsoleAfterReady: false,
    level: 'INFO', // 避免记录数据库执行语句
    dir: path.join(__dirname, '../../logs/pro/'),
  };
  // 性能分析配置
  config.alinode = {
    server: 'wss://agentserver.node.aliyun.com:8080',
    appid: '83784',
    secret: '771de395d0ef91054dddf46eadf5eef079dfbd03',
    // logdir: path.join(__dirname, '../logs/test/'),
    // error_log: [],
    // agentidMode:'IP' '可选，如果设置，则在实例ID中添加部分IP信息，用于多个实例 hostname 相同的场景（以容器为主）'
  };
  config.uploads = {
    uploadAddr: path.join(__dirname, '../../uploads/'),
    dataBaseAddr: 'http://47.113.111.181/static/',
  };
  config.io = {
    namespace: {
      '/': {
        connectionMiddleware: [ 'auth' ],
        packetMiddleware: [ ], // 针对消息的处理暂时不实现
      },
    },
  };
  return {
    ...config,
  };
};
