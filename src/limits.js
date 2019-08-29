const config = require('./config');

const dbUserLimitsMock = {};

const MINUTE = 60 * 1000;

module.exports = {
  isAllow: async ({ user_id }) => {
    if(!dbUserLimitsMock[user_id]){
      dbUserLimitsMock[user_id] = {};
    }
    
    const userLimits = dbUserLimitsMock[user_id];
    
    if(!userLimits.firstTime || 
        userLimits.firstTime < Date.now() - config.limits.period
    ){
      userLimits.firstTime = Date.now();
      userLimits.count = 0;
    }
    
    userLimits.count++;
    
    return userLimits.count <= config.limits.max;
  },
  _setCurrentCountByUser: async ({ user_id, count }) => {
    dbUserLimitsMock[user_id] = {
      firstTime: Date.now(),
      count
    };
  }
};
