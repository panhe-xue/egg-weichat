'use strict';

const code = Symbol('Context#code');
const msg = Symbol('Context#msg');
const status = require('../../util/status');
module.exports = {
  get RetCode() {
    if (!this[code]) {
      this[code] = status.RetCode;
    }
    return this[code];
  },
  get RetMsg() {
    if (!this[msg]) {
      this[msg] = status.RetMsg;
    }
    return this[msg];
  },
};

