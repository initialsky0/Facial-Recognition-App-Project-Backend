const getProfile = (smartBrainDB) => (req, res) => {
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
}

module.exports = {
   getProfile: getProfile
};