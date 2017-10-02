const express = require('express');
const router = express.Router();
const database = require("../database");
module.exports = router;

router.get('/', function(req, res) {
    database.getCustomers({}, function(err, customers) {
        if (err) {
            console.error(err);
            res.status(500).send("Error - see console");
            return;
        }
        res.render("customers/index", {customers:customers});
    });
});

router.get('/new', function(req, res) {
    res.render("customers/new", {});
});

router.post('/new', function(req, res) {
    var customer = req.body;
    database.upsertCustomer(customer, function(err, result) {
        if (err) {
            console.error(err);
            res.status(500).send("Error - see console");
            return;
        }
        res.redirect("/customer");
    })
});

router.get('/edit/:id', function(req, res) {
    database.getCustomers({id:req.params.id}, function(err, customers) {
        if (err) {
            console.error(err);
            res.status(500).send("Error - see console");
            return;
        }
        res.render("customers/edit", {customer:customers[0]});
    });
});

router.post('/edit/:id', function(req, res) {
    var customer = req.body;
    customer.id = req.params.id;
    database.upsertCustomer(customer, function(err, result) {
        if (err) {
            console.error(err);
            res.status(500).send("Error - see console");
            return;
        }
        res.redirect("/customer");
    })
});

router.get('/delete/:id', function(req, res) {
    database.getCustomers({id:req.params.id}, function(err, customers) {
        if (err) {
            console.error(err);
            res.status(500).send("Error - see console");
            return;
        }
        res.render("customers/delete", {customer:customers[0]});
    });
});

router.post('/delete/:id', function(req, res) {
    database.deleteCustomer(req.params.id, function(err, result) {
        if (err) {
            console.error(err);
            res.status(500).send("Error - see console");
            return;
        }
        res.redirect("/customer");
    })
})

router.get('/report/:id', function(req, res) {
    database.customerReport({customerId:req.params.id}, function(err, report) {
        if (err) {
            console.error(err);
            res.status(500).send("Error - see console");
            return;
        }
        res.render("customers/report", {customer:report});
    });
});