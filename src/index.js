const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');


const config = require('./config');
const users = require('./users');
const sessions = require('./sessions');
const limits = require('./limits');
const speller = require('./speller');

const app = express();

app.use(fileUpload({
  limits: { 
    fileSize: config.fileSizeLimit
  }
}));
app.use(bodyParser.json());


app.post('/auth/registrate', async (req, res, next) => {
  const { login, password } = req.body;
  
  if(!login){
    res.status(500).send({ error: "login required" }); return;
  }
  
  if(!password){
    res.status(500).send({ error: "password required" }); return;
  }
  
  const user = await users.registrate({ login, password });
  if(user.error){
    res.status(500).send(user);
  } else {
    res.send(user);
  }
});

app.post('/auth/login', async (req, res, next) => {
  const { login, password } = req.body;
  
  if(!login){
    res.status(500).send({ error: "login required" }); return;
  }
  
  if(!password){
    res.status(500).send({ error: "password required" }); return;
  }
  
  const user = await users.auth({ login, password });
  if(user.error){
    res.status(500).send(user);
  } else {
    const session_id = await sessions.create({ session: { user_id: user.user_id } });
    res.send({
      session_id
    });
  }
});


app.use(async function getSession(req, res, next){
  const { session_id } = req.headers;
  if(session_id){
    req.session = await sessions.get({ session_id });
  }
  next();
});

app.post('/check', async (req, res, next) => {
  const { session } = req;
  
  if(!session || !session.user_id){
    res.status(500).send({ error: "No auth" });
  } else if(!(await limits.isAllow({ user_id: session.user_id }))) {
    res.status(500).send({ error: "You exceed the usage limits" });
  } else {
    next();
  }
}, async (req, res, next) => {
  
  const { text } = req.body;
  
  let file_text = (req.files || {}).text;
  if(file_text){
    file_text = file_text.data.toString('utf-8');
  }

  res.send({
    corrected_text: await speller.correctText({ text: text || file_text })
  });
  
});

app.use(async function saveSession(req, res, next){
  const { session_id } = req.headers;
  if(session_id){
    const { session } = req;
    await sessions.save({ session_id, session });
  }
});

app.listen(config.port);

module.exports = app;
