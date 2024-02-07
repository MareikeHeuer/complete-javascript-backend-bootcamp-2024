const fs = require("fs");
// gives us capability to build http server
const http = require("http");
const url = require("url");

const slugify = require("slugify");

const replaceTemplate = require("./modules/replaceTemplate");

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

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  //   console.log(req.url);
  //   console.log(url.parse(req.url, true));
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(templateCard, el))
      .join("");
    const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);
    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    // console.log(query);
    // dataObj is an array, we then retrieve the element at the position that's coming from the query id
    const product = dataObj[query.id];
    const output = replaceTemplate(templateProduct, product);
    res.end(output);
    // API
  } else if (pathname === "/api") {
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
