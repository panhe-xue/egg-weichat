'use strict';

const Controller = require('egg').Controller;
const pump = require('mz-modules/pump');
const fs = require('mz/fs');
const path = require('path');
class UploadController extends Controller {
  async index() {
    const { ctx } = this;
    let ret = ctx.RetCode.SUC_OK;
    let msg = ctx.RetMsg.SUC_OK;
    let subMsg;
    let avatar;
    const stop = false;
    try {
      const file = ctx.request.files[0];
      ctx.logger.info('uploads args', ctx.request.body, file);
      do {
        const dataBaseAdd = ctx.app.config.uploads.dataBaseAddr + 'avatar_' + file.filename;
        const targetPath = path.join(ctx.app.config.uploads.uploadAddr, 'avatar_' + file.filename);
        const source = fs.createReadStream(file.filepath);
        const target = fs.createWriteStream(targetPath);
        ctx.logger.info('=======uploads=======:', targetPath, dataBaseAdd);
        await pump(source, target);
        avatar = dataBaseAdd;
      } while (stop);
    } catch (error) {
      ctx.logger.error('上传头像接口有问题 upload avatar has error:', error);
      ret = ctx.RetCode.ERR_SERVER_EXCEPTION;
      msg = ctx.RetMsg.ERR_SERVER_EXCEPTION;
      subMsg = error.message;
    }
    ctx.cleanupRequestFiles();
    const result = {
      ret,
      msg,
      subMsg,
      avatar,
    };
    ctx.body = result;
  }
}

module.exports = UploadController;
