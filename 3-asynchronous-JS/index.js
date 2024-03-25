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

// Async means, this is special function that keeps running in the background, while rest of the code runs in the event loop
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
    throw err;
  }
  return '2: READY';
};

// FINAL CODE
// Declare a function inside paranthesis and call it right away without declaring a named function which has to be called later on
(async () => {
  try {
    console.log('1: Will get dog pics');
    const x = await getDogPic();
    console.log(x);
    console.log('3: Done getting dog pics');
  } catch (err) {
    console.log('ERROR');
  }
})();

/////// UNDERSTANDING HOW ASYNC WORKS ///////

///////EXAMPLE ///////////
/* 
console.log('1: Will get dog pics');
getDogPic();
console.log('2: Done getting dog pics');

Output 
1: Will get dog pics
2: Done getting dog pics
Breed: corgi
https://images.dog.ceo/breeds/corgi-cardigan/n02113186_5841.jpg
Random dog image saved to file!

Async function ran in the background
When JS engine sees the getDogPic() function, it gets sent to the background and rest of the code continues running
When the data is all resolved, it will start printing all the logs. 

*/

/////// EXAMPLE 2 /////////

/*
console.log('1: Will get dog pics');
const x = getDogPic();
console.log(x);
console.log('2: Done getting dog pics');

/* 
Output

1: Will get dog pics
Promise { <pending> }
2: Done getting dog pics
Breed: corgi
https://images.dog.ceo/breeds/corgi-cardigan/n02113186_4536.jpg
Random dog image saved to file!


Why is x variable Promise {pending} ?
An async function returns a promise automatically. 
Instead of logging '2: READY', it tells us that its a Promise which is still pending. 
JS cannot know that x will be the READY string at some point. So it simply moves on. 
At the time that JS knows that x should be the string, the code has long finished executing.
But what if we really wanted return that string and log it to the console?
Then we would have to treat the async function as a proimise, use the then or async/await method on it. 
*/

/////////// EXAMPLE 3 //////////
/*
console.log('1: Will get dog pics');
getDogPic()
  .then((x) => {
    console.log(x);
    console.log('2: Done getting dog pics');
  })
  .catch((err) => {
    console.log('ERROR');
  });

/* 
Output
1: Will get dog pics
Breed: corgi
https://images.dog.ceo/breeds/corgi-cardigan/n02113186_10972.jpg
Random dog image saved to file!
2: READY
2: Done getting dog pics

- getDogPic returns a promise
- We can use .then medhod to get acces to its value


//////// Previous example
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
