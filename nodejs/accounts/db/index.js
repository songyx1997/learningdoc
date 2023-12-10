const mongoose = require('mongoose');
const config = require('../config/db');

/**
 * @param success 成功回调
 */
module.exports = (success) => {
  mongoose.connect(`mongodb://${config.host}:${config.port}/${config.name}`)
    .then(() => {
      success();
    }).catch((e) => {
      throw e;
    })
}