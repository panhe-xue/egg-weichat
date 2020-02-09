'use strict';
const Service = require('egg').Service;

class LoginService extends Service {
  async find(phone, password) {
    const user = await this.app.mysql.get(LoginService.TABLE_NAME, { phone, password });
    return user;
  }
//   async update(openid, sessionKey) {
//   }
//   async insert(openid, sessionKey, userData) {
//   }
}

LoginService.TABLE_NAME = 'account';
module.exports = LoginService;
