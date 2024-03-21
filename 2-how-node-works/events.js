// Built-in events node module
const EventEmitter = require('events');
const http = require('http');

// ES6 syntax for class inheritance
// EventEmitter is a class and, Sales class is new class, which inherits everything from EventsEmittler class
// EventEmitter is parent/super class, Sales is the child class, hence it has to be called to get access to all methods from parent class
class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

/* Create an instance of the class we just imported
Event emitters can emit named events and we can then listen to them and react accordingly 
(Similar to eventlistener on DOM element )
*/
const myEmitter = new Sales();
// emit here is similar to clicking on a button, and we have to set up the listeners
myEmitter.on('newSale', () => {
  console.log('There was a new sale');
});

myEmitter.on('newSale', () => {
  console.log('Customer name: Mell');
});

myEmitter.on('newSale', (stock) => {
  console.log(`There are now ${stock} items left instock`);
});

myEmitter.emit('newSale', 9);

//////////////////////////////// Another example ///////////////////////
/* Create small web-server and then listen to the event that it emits
"emit" refers to the process of triggering an event in Node.js. 
When you emit an event, you're essentially signaling that a certain action or state has occurred, 
and any listeners that are registered for that event will be notified. */

const server = http.createServer();

// Listen to different events the serve will emit
server.on('request', (req, res) => {
  console.log('Request received!');
  console.log(req.url);
  res.end('Request reveiced!');
});

server.on('request', (req, res) => {
  console.log('Another request 😎');
});

server.on('close', () => {
  res.end('Server closed!');
});

// Start the server (server, address(localhost in this case), )
server.listen(8000, '127.0.0.1', () => {
  console.log('Waiting for requests...');
});

// Visit http://127.0.0.1:8000/ to see console output
