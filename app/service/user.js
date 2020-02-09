'use strict';
const Service = require('egg').Service;

class UserService extends Service {
  async find(ac_id) {
    this.ctx.logger.info('UserService args:', ac_id);
    const user = await this.app.mysql.get(UserService.TABLE_NAME, { ac_id });
    return user;
  }
  async getRelationship(uid) {
    const sql = `
      select
        B.id as id,
        B.nickname as nickname,
        B.avatar as avatar,
        B.socket_id as socketId,
        B.phone as phone,
        B.gender as gender,
        A.remark as remark
      from ${UserService.TABLE_NAME_RELATIONSHIP} A
      left join ${UserService.TABLE_NAME} B
      on A.f_uid = B.id
      where A.uid = ?
    `;
    const user = await this.app.mysql.query(sql, [ uid ]);
    return user;
  }
  async getChatMsg(uid) {
    const sql = `
      select
        any_value(B.nickname) as nickname,
        any_value(B.avatar) as avatar,
        any_value(B.id) as uid,
        any_value(B.socket_id) as socketId,
        any_value(A.msg) as msg,
        any_value(A.create_time) as create_time
      from (
        select * from ${UserService.TABLE_NAME_CHATMSG} where sender = ? order by create_time desc limit 15
      ) A
      left join ${UserService.TABLE_NAME} B
      on A.receiver = B.id
      group by A.receiver order by any_value(A.create_time) desc
    `;
    const user = await this.app.mysql.query(sql, [ uid ]);
    return user;
  }
  async searchFriend(phone) {
    const user = await this.app.mysql.get(UserService.TABLE_NAME, { phone });
    return user;
  }
  async updateSocketId(uid, socket_id) {
    const user = await this.app.mysql.update(UserService.TABLE_NAME, { id: uid, socket_id });
    return user;
  }
  async isFriends(uid, f_uid) {
    let res = false;
    const user = await this.app.mysql.get(UserService.TABLE_NAME_RELATIONSHIP, { uid, f_uid });
    if (user !== null) {
      res = true;
    }
    return res;
  }
  async addFriend(uid, f_uid) {
    const row1 = {
      uid,
      f_uid,
    };
    const row2 = {
      uid: f_uid,
      f_uid: uid,
    };
    const conn = await this.app.mysql.beginTransaction(); // 初始化事务
    try {
      await conn.update(UserService.TABLE_NAME_NEW_FRIENDS, { status: 1 }, { where: { sender: f_uid, receiver: uid } });
      await conn.insert(UserService.TABLE_NAME_RELATIONSHIP, row1); // 第一步操作
      await conn.insert(UserService.TABLE_NAME_RELATIONSHIP, row2); // 第二步操作
      await conn.commit(); // 提交事务
    } catch (err) {
      // error, rollback
      await conn.rollback(); // 一定记得捕获异常后回滚事务！！
      throw err;
    }
  }
  async sendNewFriends(sender, receiver) {
    const row = {
      sender,
      receiver,
      status: 0,
      delete: 0,
      create_time: new Date(),
      update_time: new Date(),
    };
    const res = await this.app.mysql.insert(UserService.TABLE_NAME_NEW_FRIENDS, row);
    return res;
  }
  async getNewFriendList(uid) {
    const sql = `
      select A.sender as uid, A.status as status, B.nickname as nickname, B.avatar as avatar
      from ${UserService.TABLE_NAME_NEW_FRIENDS} A
      left join
      ${UserService.TABLE_NAME} B
      on A.sender = B.id
      where A.receiver = ? and A.delete = 0
    `;
    const res = await this.app.mysql.query(sql, [ uid ]);
    return res;
  }
}

UserService.TABLE_NAME = 'user';
UserService.TABLE_NAME_RELATIONSHIP = 'relationship';
UserService.TABLE_NAME_CHATMSG = 'chat_msg';
UserService.TABLE_NAME_NEW_FRIENDS = 'new_friends';
module.exports = UserService;
