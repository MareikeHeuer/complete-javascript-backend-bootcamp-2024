/* Eg: In our app, we need to read a large text file from file system and send it to the client
Multiple ways to do it */

const fs = require('fs');
const server = require('http').createServer();

// SOLUTION 1
// Easiest way, simply read the file into a variable and once that's done send it to the client

/*

server.on('request', (req, res) => {
  fs.readFile('test-file.txt', (err, data) => {
    if (err) console.log(err);
    res.end(data);
  });
});

*/

/*
    Problem with this solution:
      Node will have to load the entire file into memory, because only after its ready it can then send data
      Large files or when there are ton of requests hitting the server, the node process will run out of resources,
      app may crash
    This solution cannot be used in production ready code 
*/

// SOLUTION 2
// We don't need to read the data into a variable and having to store than in memory, we create a readable stream
// As we receive each chunk of data, we send it to the client as a response (writable stream)

/*
    const readable = fs.createReadStream('test-file.txt');
    readable.on('data', (chunk) => {
      res.write(chunk);
    });
    // To finish, we have to handle the event when all the data is read, then stream is finished reading data from the file
    readable.on('end', () => {
      res.end();
    });
    readable.on('error', (err) => {
      console.log(err);
      res.statusCode(500);
      res.end('File not found');
    });
    */

/* 
    Problem with this solution: 
      Our readable stream is much faster than actually sending the result with the response writebale stream over the network
      This will overwhelm the response stream, which cant hanle all this incomcing data so fast
    This is called BACK-PRESSURE: Happens when respnse can't send data nearly as fast as it is receiving it from the file 
    */

// SOLUTION 3
// Pipe operator is available on a readable streams
// & allows us to pipe output of readable stream into input of a writeable stream

server.on('request', (req, res) => {
  const readable = fs.createReadStream('test-file.txt');
  // response is the writeable stream
  readable.pipe(res);
  // readableSource.pipe(writeableDest)
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening...');
});

// Visit http://127.0.0.1:8000
