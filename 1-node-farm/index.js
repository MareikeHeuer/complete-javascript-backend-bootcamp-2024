const fs = require("fs");
// gives us capability to build http server
const http = require("http");
const url = require("url");

///////////// FILES ////////////////
//// Blocking, synchronous way

// Read file command: node filename
/*
const textIn = fs.readFileSync("./starter/txt/input.txt", "utf-8");
console.log(textIn);

const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// This creates a new file called output.txt in the specified path
fs.writeFileSync("./starter/txt/output.txt", textOut);
console.log("File written");

//// Non-blocking, asynchronous way

// First output to console is 'will read file', and only when data from callback function has been read, will the data be logged to the console
fs.readFile("./starter/txt/start.txt", "utf-8", (err, data) => {
  if (err) return console.log("ERROR");
  console.log(data);
});
console.log("Will read file!"); */

// Another example: Callback hell
/*
fs.readFile("./starter/txt/start.txt", "utf-8", (err, data1) => {
  fs.readFile(`./starter/txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile("./starter/txt/append.txt", "utf-8", (err, data3) => {
      console.log(data3);

      // no data as 2nd argument, because no data is read
      fs.writeFile(
        "./starter/txt/final.txt",
        `${data2}\n${data3}`,
        "utf-8",
        (err) => {
          console.log("File has been written");
        }
      );
    });
  });
});

console.log("Will read file 2"); */

//////// SERVER ////////

const replaceTemplate = (template, product) => {
  // use regular expression, because in case there are multiple instances of this placeholder with the g flag, this will replace all placeholders
  let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }
  return output;
};

const templateOverview = fs.readFileSync(
  `${__dirname}/starter/templates/template-overview.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/starter/templates/template-card.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/starter/templates/template-product.html`,
  "utf-8"
);

// Read data from file, parse json to JS
const data = fs.readFileSync(
  `${__dirname}/starter/dev-data/data.json`,
  "utf-8"
);
const dataObj = JSON.parse(data);
// console.log(dataObj);

const server = http.createServer((req, res) => {
  // console.log(req.url);
  const pathName = req.url;

  // Overview page
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(templateCard, el))
      .join("");
    const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);
    // Product page
  } else if (pathName === "/product") {
    res.end("This is the PRODUCT");
    // API
  } else if (pathName === "/api") {
    // Send back result to the client
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
    // Not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found</h1>");
  }
});

// port: sub address on a certain host
// localhost: current computer (default ip address 127.0.0.1)
server.listen(8000, "127.0.0.1", () => {
  //http://127.0.0.1:8000/
  console.log("Listening to requests on port 8000");
});
// Created server using createServer, passed in callback fc, which is executed each time a new request hits the server. Started listening for incoming requests on localhost IP port 8000
