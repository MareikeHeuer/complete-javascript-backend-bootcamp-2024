const fs = require('fs');
const crypto = require('crypto');

/* Based on the code below, the top level log statement should be displayed first, 
then the rest of the functions. The order doesn't matter at this point because they 
are not executed in the event loop

Hello from the top-level code // expected, as top level code executes immediately
Timer 1 finished
I/O finished
Immediate 1 finished


setTimeout(() => console.log('Timer 1 finished'), 0);
setImmediate(() => console.log('Immediate 1 finished'));

fs.readFile('test -file.txt', () => {
  console.log('I/O finished');
});

// Top-level, because it's the only one not inside a callback
console.log('Hello from the top-level code');

 */

// SECOND EXAMPLE

/* 
Based on this code the output is

Hello from the top-level code
Timer 1 finished
I/O finished
----------------
Immediate 1 finished
Immediate 2 finished
Timer 2 finished
Timer 3 finished

 

setTimeout(() => console.log('Timer 1 finished'), 0);
setImmediate(() => console.log('Immediate 1 finished'));

fs.readFile('test -file.txt', () => {
  console.log('I/O finished');
  console.log('----------------');

  setTimeout(() => console.log('Timer 2 finished'), 0);
  setTimeout(() => console.log('Timer 3 finished'), 3000);
  setImmediate(() => console.log('Immediate 2 finished'));
});

// Top-level, because it's the only one not inside a callback
console.log('Hello from the top-level code');

*/

// Example 3

/* 
Hello from the top-level code
Timer 1 finished
I/O finished
----------------
Process.nextTick
Immediate 1 finished
Immediate 2 finished
Timer 2 finished
Timer 3 finished

Why is Process.nextTick executed first? next tick is part of the microtasks queue, which gets executed after each event loop phase
setTimeout(() => console.log('Timer 1 finished'), 0);
setImmediate(() => console.log('Immediate 1 finished'));

fs.readFile('test -file.txt', () => {
  console.log('I/O finished');
  console.log('----------------');

  setTimeout(() => console.log('Timer 2 finished'), 0);
  setTimeout(() => console.log('Timer 3 finished'), 3000);
  setImmediate(() => console.log('Immediate 2 finished'));

  process.nextTick(() => console.log('Process.nextTick'));
});

// Top-level, because it's the only one not inside a callback
console.log('Hello from the top-level code'); */

// Example: Thread Pool
setTimeout(() => console.log('Timer 1 finished'), 0);
setImmediate(() => console.log('Immediate 1 finished'));

fs.readFile('test -file.txt', () => {
  console.log('I/O finished');
  console.log('----------------');

  setTimeout(() => console.log('Timer 2 finished'), 0);
  setTimeout(() => console.log('Timer 3 finished'), 3000);
  setImmediate(() => console.log('Immediate 2 finished'));

  process.nextTick(() => console.log('Process.nextTick'));

  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log('Password encrypted');
  });
});

// Top-level, because it's the only one not inside a callback
console.log('Hello from the top-level code');
