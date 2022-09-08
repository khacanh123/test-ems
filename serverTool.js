const express = require('express');
const path = require('path');
const app = express();
const PORT = 4613;

// Adds json parsing middleware
app.use(express.json());
// Setup static directory to serve
const root = require('path').join(__dirname, '/dist/');
// app.use(express.static(`${__dirname}/views/tool/build/`));
app.use(express.static(root));
// app.use('/favicon.ico', express.static(`${__dirname}/views/tool/build/favicon.ico`));

app.get('*', (req, res) => {
  res.sendFile('index.html', { root });
});

// //console.log that your server is up and running
app.listen(PORT);

console.log(`trang quản lý on port ${PORT}`);
