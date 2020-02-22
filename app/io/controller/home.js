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
    const { socket, logger, service, app } = ctx;
    const id = socket.id;
    const msg = ctx.args[0];
    logger.info(id, msg);
    app.io.of('/').emit('changeSocketId', {
      uid: msg.uid,
      socketId: id,
    });
    await service.user.updateSocketId(msg.uid, id);
  }
  async exchange() {
    const { ctx, app } = this;
    const { socket, logger } = ctx;
    const nsp = app.io.of('/');
    const message = ctx.args[0] || {};
    const client = socket.id;
    try {
      const { target, payload } = message;
      if (!target) return;
      const msg = ctx.helper.parseMsg('exchange', payload, { client, target });
      logger.info('=============================exchange....................', msg);
      nsp.emit(target, msg);
    } catch (error) {
      logger.error(error);
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
      const rec = await ctx.service.user.sendNewFriends(payload.sender, payload.receiver);
      if (!rec) {
        return;
      }
      // 发送client
      const msg = ctx.helper.parseMsg('addFriend', payload, { client, target });
      nsp.emit(target, msg);
    } catch (error) {
      app.logger.error(error);
    }
  }
  // 同意好友
  async agreeNewFriend() {
    const { ctx, app } = this;
    const nsp = app.io.of('/');
    const message = ctx.args[0] || {};
    const socket = ctx.socket;
    const client = socket.id;
    ctx.logger.info('agreeNewFriend begin', message, client);
    try {
      const { requestId, agreeId, nickname, avatar, phone, gender } = message;
      if (!requestId || !agreeId) return;
      const requestUser = await ctx.service.user.findByUid(requestId);
      if (!requestUser) {
        ctx.logger.error('agreeNewFriend, error:', message, requestId, agreeId);
        return;
      }
      const target = requestUser.socket_id;
      const payload = {
        uid: agreeId,
        msg: '我们已经是好友了，开始聊天吧。',
        nickname,
        avatar,
        phone,
        gender,
      };
      await ctx.service.user.addFriend(requestId, agreeId);
      // 发送client
      const msg = ctx.helper.parseMsg('agreeNewFriend', payload, { client, target });
      nsp.emit(target, msg);
    } catch (error) {
      app.logger.error(error);
    }
  }

  // {
  //   meta: {
  //     timestamp: 1582103087782,
  //     client: 'bQoJ35kGgYUs-NZoAAAD',
  //     target: 'LVG9BquFJiwgMf3xAAAC'
  //   },
  //   data: {
  //     action: 'exchange',
  //     payload: {
  //       msg: 'nihao',
  //       uid: 1,
  //       nickname: '佩询',
  //       avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1580378332220&di=4c466a50955148dd597a59a89ea74880&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201809%2F21%2F20180921195352_lmgic.jpg'
  //     }
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
