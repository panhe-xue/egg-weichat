'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async getRelationship() {
    const { ctx } = this;
    let ret = ctx.RetCode.SUC_OK;
    let msg = ctx.RetMsg.SUC_OK;
    let subMsg;
    let data;
    const stop = false;
    // session_key 换用户信息
    try {
      do {
        data = await ctx.service.user.getRelationship(ctx._res.uid);
      } while (stop);
    } catch (error) {
      ctx.logger.error('获取关系列表口有问题 has error:', error);
      ret = ctx.RetCode.ERR_SERVER_EXCEPTION;
      msg = ctx.RetMsg.ERR_SERVER_EXCEPTION;
      subMsg = error.message;
    }
    const result = {
      ret,
      msg,
      subMsg,
      data,
    };
    this.ctx.logger.info('getRelationship api res:', result);
    ctx.body = result;
  }
  async getChatMsg() {
    const { ctx } = this;
    let ret = ctx.RetCode.SUC_OK;
    let msg = ctx.RetMsg.SUC_OK;
    let subMsg;
    let data;
    const stop = false;
    // session_key 换用户信息
    try {
      do {
        data = await ctx.service.user.getChatMsg(ctx._res.uid);
      } while (stop);
    } catch (error) {
      ctx.logger.error('获取最新消息列表口有问题 has error:', error);
      ret = ctx.RetCode.ERR_SERVER_EXCEPTION;
      msg = ctx.RetMsg.ERR_SERVER_EXCEPTION;
      subMsg = error.message;
    }
    const result = {
      ret,
      msg,
      subMsg,
      data,
    };
    this.ctx.logger.info('getChatMsg api res:', result);
    ctx.body = result;
  }
  async searchFriend() {
    const { ctx } = this;
    let ret = ctx.RetCode.SUC_OK;
    let msg = ctx.RetMsg.SUC_OK;
    let subMsg;
    let data;
    const stop = false;
    // session_key 换用户信息
    try {
      do {
        const keyword = ctx.query.keyword;
        if (!keyword || keyword === ctx._res.phone) {
          data = [];
          break;
        }

        data = await ctx.service.user.searchFriend(keyword);
        if (data) {
          const { uid } = ctx._res;
          data.isFriends = await ctx.service.user.isFriends(uid, data.id);
        }
      } while (stop);
    } catch (error) {
      ctx.logger.error('查询好友有问题 has error:', error);
      ret = ctx.RetCode.ERR_SERVER_EXCEPTION;
      msg = ctx.RetMsg.ERR_SERVER_EXCEPTION;
      subMsg = error.message;
    }
    const result = {
      ret,
      msg,
      subMsg,
      data,
    };
    this.ctx.logger.info('getChatMsg api res:', result);
    ctx.body = result;
  }
  async addFriend() {
    const { ctx } = this;
    let ret = ctx.RetCode.SUC_OK;
    let msg = ctx.RetMsg.SUC_OK;
    let subMsg;
    const stop = false;
    // session_key 换用户信息
    try {
      do {
        const uid = ctx.query.uid;
        ctx.logger.info('add Friend args......', uid);
        if (!uid) {
          ret = ctx.RetCode.ERR_CLIENT_PARAMS_ERR;
          msg = ctx.RetMsg.ERR_CLIENT_PARAMS_ERR;
          break;
        }
        await ctx.service.user.addFriend(ctx._res.uid, uid);
      } while (stop);
    } catch (error) {
      ctx.logger.error('添加好友 has error:', error);
      ret = ctx.RetCode.ERR_SERVER_EXCEPTION;
      msg = ctx.RetMsg.ERR_SERVER_EXCEPTION;
      subMsg = error.message;
    }
    const result = {
      ret,
      msg,
      subMsg,
    };
    this.ctx.logger.info('getChatMsg api res:', result);
    ctx.body = result;
  }
  async getNewFriendList() {
    const { ctx } = this;
    let ret = ctx.RetCode.SUC_OK;
    let msg = ctx.RetMsg.SUC_OK;
    let subMsg;
    let data;
    const stop = false;
    // session_key 换用户信息
    try {
      do {
        data = await ctx.service.user.getNewFriendList(ctx._res.uid);
      } while (stop);
    } catch (error) {
      ctx.logger.error('getNewFriendList has error:', error);
      ret = ctx.RetCode.ERR_SERVER_EXCEPTION;
      msg = ctx.RetMsg.ERR_SERVER_EXCEPTION;
      subMsg = error.message;
    }
    const result = {
      ret,
      msg,
      subMsg,
      data,
    };
    this.ctx.logger.info('getNewFriendList api res:', result);
    ctx.body = result;
  }
}
module.exports = UserController;
