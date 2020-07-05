const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const register = require('./controller/register');
const signin = require('./controller/signin');
const profile = require('./controller/profile');
const image = require('./controller/image');
const PORT = process.env.PORT;

const smartBrainDB = knex({
   client: 'pg',
   connection: {
     host : '127.0.0.1',
     user : 'postgres',
     password : process.env.REACT_APP_SERVER_PASSWORD,
     database : 'smart_brain'
   }
 });

const app = express();
// make sure to include above in-middle-operation to decipher json
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
   res.send('Welcome to SmartBrain');
});

// app.post('/signin', (req, res) => { signin.handleSignin(req, res, bcrypt, smartBrainDB) }); The same as below
app.post('/signin', signin.handleSignin(bcrypt, smartBrainDB));

app.post('/register', register.handleRegister(bcrypt, smartBrainDB));

app.get('/profile/:id', profile.getProfile(smartBrainDB));

app.put('/img', image.handleImg(smartBrainDB));

app.post('/imgURL', image.handleApiCall);
// Handle API keys in backend

app.listen(PORT, () => {
   console.log(`connection established at localhost:${PORT}`);
});

