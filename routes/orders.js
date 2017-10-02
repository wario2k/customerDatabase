const express = require('express');
const router = express.Router();
const database = require("../database");
const async = require('async');
const moment = require('moment');
module.exports = router;

router.get('/', function(req, res) {
    database.getOrders({}, function(err, orders) {
        if (err) {
            console.error(err);
            res.status(500).send("Error - see console");
            return;
        }
        res.render("orders/index", {orders:orders});
    });
});

router.get('/new', function(req, res) {
    var customers, products;
    var gets = [];
    gets.push(function(done) {
        database.getCustomers({}, function(err, _customers) {
            if ( err )  console.error(err);
            else customers = _customers;
            done();
        })
    });
    gets.push(function(done) {
        database.getProducts({}, function(err, _products) {
            if ( err )  console.error(err);
            else products = _products;
            done();
        })
    });
    async.parallel(gets, function() {
        res.render("orders/new", {customers:customers, products:products});
    })
});

router.post('/new', function(req, res) {
    function pad (str, max) {
        str = str.toString();
        return str.length < max ? pad("0" + str, max) : str;
    }
    var order_data = req.body;
    var order = {
        customerId : order_data.customer,
        productId : order_data.product,
        date : moment(`${order_data.year}-${pad(order_data.month, 2)}-${pad(order_data.day, 2)})`, "YYYY-MM-DD")
    }
    database.addOrder(order, function(err, result) {
        if (err) {
            console.error(err);
            res.status(500).send("Error - see console");
            return;
        }
        res.redirect("/order");
    })
});


router.get('/delete/:id', function(req, res) {
    database.getOrders({id:req.params.id}, function(err, orders) {
        if (err) {
            console.error(err);
            res.status(500).send("Error - see console");
            return;
        }
        res.render("orders/delete", {order:orders[0]});
    });
});

router.post('/delete/:id', function(req, res) {
    database.deleteOrder(req.params.id, function(err, result) {
        if (err) {
            console.error(err);
            res.status(500).send("Error - see console");
            return;
        }
        res.redirect("/order");
    })
})