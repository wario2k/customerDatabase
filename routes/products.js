const express = require('express');
const router = express.Router();
const database = require("../database");

module.exports = router;

router.get('/', function(req, res) {
    database.getProducts({}, function(err, products) {
        if (err) {
            console.error(err);
            res.status(500).send("Error - see console");
            return;
        }
        res.render("products/index", {products:products});
    });
});

router.get('/new', function(req, res) {
    res.render("products/new", {});
})

router.post('/new', function(req, res) {
    var product = req.body;
    database.upsertProduct(product, function(err, result) {
        if (err) {
            console.error(err);
            res.status(500).send("Error - see console");
            return;
        }
        res.redirect("/product");
    })
})

router.get('/edit/:id', function(req, res) {
    database.getProducts({id:req.params.id}, function(err, products) {
        if (err) {
            console.error(err);
            res.status(500).send("Error - see console");
            return;
        }
        res.render("products/edit", {product:products[0]});
    });
});

router.post('/edit/:id', function(req, res) {
    var product = req.body;
    product.id = req.params.id;
    database.upsertProduct(product, function(err, result) {
        if (err) {
            console.error(err);
            res.status(500).send("Error - see console");
            return;
        }
        res.redirect("/product");
    })
});

router.get('/delete/:id', function(req, res) {
    database.getProducts({id:req.params.id}, function(err, products) {
        if (err) {
            console.error(err);
            res.status(500).send("Error - see console");
            return;
        }
        res.render("products/delete", {product:products[0]});
    });
});

router.post('/delete/:id', function(req, res) {
    database.deleteProduct(req.params.id, function(err, result) {
        if (err) {
            console.error(err);
            res.status(500).send("Error - see console");
            return;
        }
        res.redirect("/product");
    })
})

router.get('/report/:id', function(req, res) {
    database.productReport({productId:req.params.id}, function(err, report) {
        if (err) {
            console.error(err);
            res.status(500).send("Error - see console");
            return;
        }
        res.render("products/report", {product:report});
    });
});