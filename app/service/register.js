'use strict';
const Service = require('egg').Service;

class RegisterService extends Service {
  async find(phone) {
    this.ctx.logger.info('request args:', phone);
    const sql = `select * from ${RegisterService.TABLE_NAME} where phone = ?`;
    const user = await this.app.mysql.query(sql, [ phone ]);
    return user;
  }
  async insert(body) {
    this.ctx.logger.info('request args:', body);
    let user;
    const conn = await this.app.mysql.beginTransaction();
    try {
      const ac_id = await this.insertAccount(conn, body);
      body.ac_id = ac_id;
      user = await this.insertUser(conn, body);
      await conn.commit(); // 提交事务
    } catch (err) {
      // error, rollback
      await conn.rollback(); // 一定记得捕获异常后回滚事务！！
      throw err;
    }
    return user;
  }
  async insertAccount(conn, body) {
    const insertObj = {
      email: body.email,
      phone: body.phone,
      password: this.ctx.helper.genMD5(body.password),
      create_time: new Date(),
    };
    const res = await conn.insert(RegisterService.TABLE_NAME, insertObj);
    return res.insertId;
  }
  async insertUser(conn, body) {
    const insertObj = {
      ac_id: body.ac_id,
      nickname: body.nickname,
      avatar: body.avatar,
      email: body.email,
      phone: body.phone,
      qrcode: body.qrcode,
      gender: body.gender,
      signature: body.signature,
      create_time: new Date(),
    };
    const res = await conn.insert(RegisterService.TABLE_NAME_USER, insertObj);
    insertObj.id = res.insertId;
    return insertObj;
  }
}

RegisterService.TABLE_NAME = 'account';
RegisterService.TABLE_NAME_USER = 'user';
module.exports = RegisterService;
