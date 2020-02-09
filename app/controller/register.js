'use strict';

const Controller = require('egg').Controller;

class RegisterController extends Controller {
  async index() {
    const { ctx } = this;
    let ret = ctx.RetCode.SUC_OK;
    let msg = ctx.RetMsg.SUC_OK;
    let subMsg;
    let userInfo;
    let token;
    const stop = false;
    // session_key 换用户信息
    try {
      do {
        ctx.logger.info('register args:', ctx.request.body);
        const phone = ctx.request.body.phone;
        if (!phone || !ctx.request.body.password) {
          ret = ctx.RetCode.ERR_CLIENT_PARAMS_ERR;
          msg = ctx.RetMsg.ERR_CLIENT_PARAMS_ERR;
          break;
        }
        const account = await ctx.service.register.find(phone);
        if (account.length === 0) { // 无
          userInfo = await ctx.service.register.insert(ctx.request.body);
        } else { // 有
          ret = ctx.RetCode.ERR_DATA_REGISTERED;
          msg = ctx.RetMsg.ERR_DATA_REGISTERED;
          break;
        }
        // 生成token
        const tokenData = {
          uid: userInfo.id,
          ac_id: userInfo.ac_id,
        };
        token = this.app.jwt.sign(tokenData, this.app.config.jwt.secret, { expiresIn: -1 });
      } while (stop);
    } catch (error) {
      ctx.logger.error('注册接口有问题 register has error:', error);
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
    ctx.body = result;
  }
}
module.exports = RegisterController;
