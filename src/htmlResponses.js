const fs = require('fs'); // pull in the file system module

// Load our index fully into memory.
// THIS IS NOT ALWAYS THE BEST IDEA.
// We are using this for simplicity. Ideally we won't have
// synchronous operations or load entire files into memory.
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const csvData = fs.readFileSync(`${__dirname}/../src/user_fitbit_data.txt`);
const userDat = fs.readFileSync(`${__dirname}/../src/user_profile_data.json`);

// function to handle the index page
const getIndex = (request, response) => {
  // set status code (200 success) and content type
  response.writeHead(200, { 'Content-Type': 'text/html' });
  // write an HTML string or buffer to the response
  response.write(index);
  // send the response to the client.
  response.end();
};

const getData = (request, response) => {
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(csvData);
  response.end();
}

const getCss = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const getJson = (request, response) => {
  console.log("returning json");
  console.log(userDat);
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.write(userDat);
  response.end();
};

// exports to set functions to public.
// In this syntax, you can do getIndex:getIndex, but if they
// are the same name, you can short handle to just getIndex,
module.exports = {
  getIndex,
  getCss,
  getData,
  getJson,
};
