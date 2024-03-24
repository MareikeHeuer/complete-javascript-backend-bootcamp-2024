const fs = require('fs');
const superagent = require('superagent');

// We will use this dogtile
// Read the dog breed
// Do an http request to get a random image of a dog with this breed
// Save this image to another textfile

// By the end, we will see the problem using all the callback functions

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed: ${data}`);

  // To get the data, we have to call the end method
  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .then((res) => {
      console.log(res.body.message);

      fs.writeFile('dog-img.txt', res.body.message, (err) => {
        console.log('Random dog image saved to file');
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
});
