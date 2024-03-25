const fs = require('fs');
const superagent = require('superagent');

// We will use this dogtile
// Read the dog breed
// Do an http request to get a random image of a dog with this breed
// Save this image to another textfile

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('Could not find that file!');
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('Could not write file!');
      resolve('success');
    });
  });
};

// Async means, this is special function that keeps runningin the background, while rest of the code runs in the event loop
// Async also automatically returns a promise
const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    await writeFilePro('dog-img.txt', res.body.message);
    console.log('Random dog image saved to file!');
  } catch (err) {
    console.log(err);
  }
};

getDogPic();

/*
readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);

    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);

    return writeFilePro('dog-img.txt', res.body.message);
  })
  .then(() => {
    console.log('Random image saved to file!');
  })
  .catch((err) => {
    console.log(err.message);
  });

/* 
  - readFilePro returns a Promise, on that we can use the .then method, 
  - then the callback function in it will also return a promise
  - We can then chain the next then handler on that
  - The result variable will be the resolved value of the Promise returned by the previous handler
  */
