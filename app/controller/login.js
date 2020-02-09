'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {
  async index() {
    const { ctx } = this;
    let ret = ctx.RetCode.SUC_OK;
    let msg = ctx.RetMsg.SUC_OK;
    let subMsg;
    let token;
    let userInfo;
    const stop = false;
    // session_key 换用户信息
    try {
      do {
        const nickname = ctx.request.body.nickname;
        const password = ctx.helper.genMD5(ctx.request.body.password);
        const account = await ctx.service.login.find(nickname, password);
        this.ctx.logger.info('login params:', ctx.request.body, account);
        if (account && account.id) { // 有
          userInfo = await ctx.service.user.find(account.id);
        } else { // 无
          ret = ctx.RetCode.ERR_DATA_NOT_FOUNT;
          msg = ctx.RetMsg.ERR_DATA_NOT_FOUNT;
          break;
        }

        const tokenData = {
          uid: userInfo.id,
          ac_id: userInfo.ac_id,
          phone: userInfo.phone,
        };
        token = this.app.jwt.sign(tokenData, this.app.config.jwt.secret, {
          expiresIn: '10d',
        });
      } while (stop);
    } catch (error) {
      ctx.logger.error('登录接口有问题 login has error:', error);
      ret = ctx.RetCode.ERR_SERVER_EXCEPTION;
      msg = ctx.RetMsg.ERR_SERVER_EXCEPTION;
      subMsg = error.message;
    }
    const result = {
      ret,
      msg,
      subMsg,
      token,
      userInfo,
    };
    this.ctx.logger.info('login api res:', result);
    ctx.body = result;
  }
}
module.exports = LoginController;
