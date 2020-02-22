'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io } = app;
  router.get('/', controller.home.index);
  router.post('/login', controller.login.index);
  router.post('/upload', controller.upload.index);
  router.post('/register', controller.register.index);
  router.get('/getRelationship', controller.user.getRelationship);
  router.get('/getChatMsg', controller.user.getChatMsg);
  router.get('/searchFriend', controller.user.searchFriend);
  router.get('/addFriend', controller.user.addFriend);
  router.get('/getNewFriendList', controller.user.getNewFriendList);

  // socket.io
  io.of('/').route('server', io.controller.home.server);
  io.of('/').route('login', io.controller.home.login);
  io.of('/').route('exchange', io.controller.home.exchange);
  io.of('/').route('addFriend', io.controller.home.addFriend);
  io.of('/').route('agreeNewFriend', io.controller.home.agreeNewFriend);
};
