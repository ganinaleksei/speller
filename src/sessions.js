const md5 = require('md5');

const dbSessionMock = {};

module.exports = {
  
  create: async ({ session }) => {
    const session_id = md5(Math.random());
    dbSessionMock[session_id] = session || {};
    return session_id;
  },
  
  get: async({ session_id }) => {
    return dbSessionMock[session_id];
  },
  
  save: async ({ session, session_id }) => {
    dbSessionMock[session_id] = session;
  }
  
};
