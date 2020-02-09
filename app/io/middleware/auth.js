'use strict';

module.exports = () => {
  return async (ctx, next) => {
    const { socket, helper } = ctx;
    const handshake = socket.handshake;
    const headers = handshake.headers;
    const id = socket.id;
    const token = headers.token || null;
    // const nsp = app.io.of('/');
    try {
      const res = await ctx.app.jwt.verify(token);
      ctx.logger.info('get middleware data', res);
      ctx._res = res;
      await next();
    } catch (error) {
      // 踢出用户前发送消息
      socket.emit(id, helper.parseMsg('deny', '登录过期'));
      // nsp.adapter.remoteDisconnect(id, true, err => {
      //   logger.error(err);
      // });
    }
    // await next();
  };
};
