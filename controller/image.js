const Clarifai = require('clarifai');

const app = new Clarifai.App({
   apiKey: process.env.REACT_APP_CLARIFAI_API_KEY
});

const handleApiCall = (req, res) => {
   app.models
      .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
      .then(data => res.json(data))
      .catch(err => res.status(400).json('API connection failed'));
}

const handleImg = (smartBrainDB) => (req, res) => {
   const { id } = req.body;
   smartBrainDB
      .from('users')
      .where('id', '=', id)
      .increment('entries', 1)
      .returning('entries')
      .then( entries => res.json(entries[0]))
      .catch(err => res.status(400).json('Something went wrong.'));
}

module.exports = {
   handleImg: handleImg,
   handleApiCall: handleApiCall
};