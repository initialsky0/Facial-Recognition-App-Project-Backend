const handleSignin = (bcrypt, smartBrainDB) => (req, res) => {
   // Require first two parameter, req and res will be passed in when callback
   const { email, password } = req.body;
   
   if(!email || !password) {
      return res.status(400).json('Incorrect form submission.');
   }
   
   smartBrainDB.select('email', 'hash').from('login')
      .where('email', '=', email)
      .then(data => {
         bcrypt.compare(password, data[0].hash, (err, result) => {
            if(result) {
               return smartBrainDB.select('*').from('users')
                  .where('email', '=', data[0].email)
                  .then(user => res.json(user[0]))
                  .catch(err => res.status(400).json('error occured during login.'));
            } else {res.status(400).json('incorrect credential.')}
         });
      })
      .catch(err => res.status(400).json('incorrect credential.'));
}

module.exports = {
   handleSignin: handleSignin
};