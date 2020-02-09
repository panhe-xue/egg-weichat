'use strict';

module.exports = () => {
  return async function token(ctx, next) {
    const result = {
      ret: ctx.RetCode.TOKEN_EXPIRED,
      msg: ctx.RetMsg.TOKEN_EXPIRED,
      subMsg: '',
    };
    const token = ctx.headers.token || (ctx.query && ctx.query.token);
    ctx.logger.info('middleware login message:', ctx.path, token);
    if (ctx.path === '/login' || ctx.path === '/upload' || ctx.path === '/register') return await next();
    if (token) {
      try {
        const res = await ctx.app.jwt.verify(token);
        ctx.logger.info('get middleware data', res);
        ctx._res = res;
        await next();
      } catch (error) {
        ctx.logger.info('token error', error);
        ctx.body = result;
      }
    } else {
      result.subMsg = '无token';
      ctx.body = result;
      return;
    }
  };
};
