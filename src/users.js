const md5 = require('md5');
const dbUsersMock = {};

module.exports = {
  registrate: async ({ login, password }) => {
    const user_id = md5(login);
    if(dbUsersMock[user_id]){
      return { error: "A user with this login is already registered" };
    }
    dbUsersMock[user_id] = {
      user_id,
      login,
      password: md5(password)
    };
    return { user_id, login };
  },
  auth: async ({ login, password }) => {
    const user_id = md5(login);
    const user = dbUsersMock[user_id];
    if(!user){
      return { error: "A user with this login is not found" };
    }
    if(user.password !== md5(password)){
      return { error: "A bad password" };
    }
    return { user_id: user.user_id, login: user.login };
  },
  
  removeAll: async () => {
    for(let user_id in dbUsersMock) {
      delete dbUsersMock[user_id];
    }
  }
  
};
