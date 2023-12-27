const fs = require("fs");

// Read file command: node filename
const textIn = fs.readFileSync("./starter/txt/input.txt", "utf-8");
console.log(textIn);

const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// This creates a new file called output.txt in the specified path
fs.writeFileSync("./starter/txt/output.txt", textOut);
console.log("File written");
