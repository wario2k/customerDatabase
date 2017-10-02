const express = require('express');
const router = express.Router();
const database = require("../database");
const async = require('async');
const moment = require('moment');
module.exports = router;

router.get('/product', function(req, res) {
    database.salesReport({}, function(err, products) {
        if (err) {
            console.error(err);
            res.status(500).send("Error - see console");
            return;
        }
        res.render("reports/product", {products:products});
    });
});

router.get('/customer', function(req, res) {
    database.purchaseReport({}, function(err, customers) {
        if (err) {
            console.error(err);
            res.status(500).send("Error - see console");
            return;
        }
        res.render("reports/customer", {customers:customers});
    });
});