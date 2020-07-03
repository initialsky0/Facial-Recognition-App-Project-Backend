const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const smartBrainDB = knex({
   client: 'pg',
   connection: {
     host : '127.0.0.1',
     user : 'postgres',
     password : '-smart-brain-',
     database : 'smart_brain'
   }
 });

const app = express();
const saltRound = 10;
app.use(express.json());
// make sure to include above in-middle-operation to decipher json
app.use(cors());

app.get('/', (req, res) => {
   res.send(dataBase.users);
});

app.post('/signin', (req, res) => {
   smartBrainDB.select('email', 'hash').from('login')
      .where('email', '=', req.body.email)
      .then(data => {
         bcrypt.compare(req.body.password, data[0].hash, (err, result) => {
            if(result) {
               return smartBrainDB.select('*').from('users')
                  .where('email', '=', data[0].email)
                  .then(user => res.json(user[0]))
                  .catch(err => res.status(400).json('error occured during login.'));
            } else {res.status(400).json('incorrect credential.')}
         });
      })
      .catch(err => res.status(400).json('incorrect credential.'));
});

app.post('/register', (req, res) => {
   const { email, name, password } = req.body;
   
   smartBrainDB.transaction(trx => {
      bcrypt.hash(password, saltRound, (err, hash) => {
         trx.insert({
            hash: hash,
            email: email
         })
         .into('login')
         .returning('email')
         .then(loginEmail => {
            return trx('users')
               .returning('*')
               .insert({
                  email: loginEmail[0],
                  name: name,
                  joined:  new Date()
               })
               .then(user => res.json(user[0]));
         })
         .then(trx.commit)
         .catch(trx.rollback);
      });
   })
   .catch(err => res.status(400).json('Unable to register, try again later.'));   
   // res.json(dataBase.users[dataBase.users.length - 1]);
});

app.get('/profile/:id', (req, res) => {
   const { id } = req.params;
   // :id => can be read with req.params.
   smartBrainDB.select('*').from('users')
      .where({id})
      .then(user => {
         if(user.length){
            res.json(user[0]);
         } else {
            res.status(400).json('User not found.');
         }
      })
      .catch(err => res.status(400).json('error accessing user.'));
})

app.put('/img', (req, res) => {
   const { id } = req.body;
   smartBrainDB('users')
      .where('id', '=', id)
      .increment('entries', 1)
      .returning('entries')
      .then( entries => res.json(entries[0]))
      .catch(err => res.status(400).json('Something went wrong.'));
});

app.listen('3000', () => {
   console.log('connection established at localhost:3000');
});

