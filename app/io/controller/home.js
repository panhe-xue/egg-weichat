'use strict';

const Controller = require('egg').Controller;

class DefaultController extends Controller {
  async server() {
    const { ctx } = this;
    const { socket } = ctx;
    const message = ctx.args[0];
    const id = socket.id;
    ctx.logger.info('====================>>>', id);
    await socket.emit(id, `Hi! I've got your message: ${message}`);
  }
  async login() {
    const { ctx } = this;
    const { socket, logger, service } = ctx;
    const id = socket.id;
    const msg = ctx.args[0];
    logger.info(id, msg, '=================>');
    await service.user.updateSocketId(msg.uid, id);
  }
  async exchange() {
    const { ctx, app } = this;
    const nsp = app.io.of('/');
    const message = ctx.args[0] || {};
    const socket = ctx.socket;
    const client = socket.id;

    try {
      const { target, payload } = message;
      if (!target) return;
      const msg = ctx.helper.parseMsg('exchange', payload, { client, target });
      nsp.emit(target, msg);
    } catch (error) {
      app.logger.error(error);
    }
  }

  async addFriend() {
    const { ctx, app } = this;
    const nsp = app.io.of('/');
    const message = ctx.args[0] || {};
    const socket = ctx.socket;
    const client = socket.id;
    console.log('addFriend.......................', message, client);
    try {
      const { target, payload } = message;
      if (!target) return;

      // 插入一条数据到 new_friends表
      await ctx.service.user.sendNewFriends(payload.sender, payload.receiver);
      // 发送client
      const msg = ctx.helper.parseMsg('addFriend', payload, { client, target });
      nsp.emit(target, msg);
    } catch (error) {
      app.logger.error(error);
    }
  }

  // {
  //   client: '',
  //   target: '',
  //   timestamp: '',
  //   data: {
  //     action: 'exchange',
  //     payload: {
  //        'uid' : id,
  //        'nickname' : nickname,
  //        'avatar' : avatar
  //     },
  //   }
  // }

  // 1, 登录获取socket.id 发送服务器 存或者修改socket.id
  // 2，添加好友，发送socket.id对应，同意后加入一条数据
  // 3, ------私聊------
  // 1，发到对应的socket.id 客户端监听接受信息.
  // 2，客户端接受到的id进行消息分类，
  // 3，在好友列表监听事件更新数字，在聊天界面监听事件更新聊天信息
}

module.exports = DefaultController;
