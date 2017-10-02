const http = require('http');
const express = require('express');
const app = express();
const busboy = require('express-busboy');
const port = process.env.PORT || 3000;

// bootstrap the database schema
require("./database").build();

app.set('port', port);
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
busboy.extend(app,{});

const root = require("./routes/index");
const orders = require("./routes/orders");
const customers = require("./routes/customers");
const products = require("./routes/products");
const reports = require("./routes/reports");
app.use(function(req, res, next){
    res.locals.moment = require("moment");
    next();
})
app.use("/", root);
app.use("/order", orders);
app.use("/customer", customers);
app.use("/product", products);
app.use("/reports", reports);


http.createServer(app).listen(port);
console.log("Web application running @ http://localhost:" + port);

