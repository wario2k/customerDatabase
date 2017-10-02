const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('hw4.db');

const moment = require('moment');



//  REMOVE THESE ARRAYS, THEY ARE HERE AS MOCK DATA ONLY.
/*
var customers = [
    {id: 0, firstName: "Kasandra", lastName: "Cryer", street:"884 Meadow Lane", city:"Bardstown", state:"KY", zip:  "4004"},
    {id: 1, firstName: "Ferne", lastName: "Linebarger", street:"172 Academy Street", city:"Morton Grove", state:"IL", zip:  "60053"},
    {id: 2, firstName: "Britany", lastName: "Manges", street:"144 Fawn Court", city:"Antioch", state:"TN", zip:  "37013"}
]
var products = [
    {id:0, name: "Product A", price: 5}, 
    {id:1, name: "Product B", price: 10}, 
    {id:2, name: "Product C", price: 2.5}, 
]
var orders = [
    {id:0, customerId: 0, productId:0, date:"2017-04-12"},
    {id:1, customerId: 2, productId:1, date:"2015-08-13"},
    {id:2, customerId: 0, productId:2, date:"2019-10-18"},
    {id:3, customerId: 1, productId:0, date:"2011-03-30"},
    {id:4, customerId: 0, productId:1, date:"2017-09-01"},
    {id:5, customerId: 1, productId:2, date:"2017-12-17"},
]
*/
//

/*
 * This function is called at application startup.  
 * You must create the PRODUCTS, CUSTOMERS, and ORDERS tables here.
 * Be sure to use the necessary SQL commands such that if the tables
 * already exist, the statements do not cause any errors, or any
 * data to be lost.
 * 
 * 
 * 10 Points
 */
exports.build = function() {
    console.log("--- Initializing database");
    
    db.serialize(function() {
    	//create Customers
   	 	db.run("CREATE TABLE IF NOT EXISTS customers (id  INTEGER PRIMARY KEY, firstName Varchar(15), lastName Varchar(15), street Varchar(35), city Varchar(15), state Char(3), zip INTEGER)");
    	//create Orders
    	db.run("CREATE TABLE if not exists orders (id  INTEGER  PRIMARY KEY, customerId INTEGER, productId INTEGER, date Varchar (10))");
    	//create Products
    	db.run("CREATE TABLE if not exists products (id INTEGER PRIMARY KEY , name Varchar(15), price INTEGER)");
	}	
)};

/**
 * This function retrieves orders and constructs an array 
 * of objects with additional details about the order's
 * customer and product.  You'll need to use JOIN to 
 * bring in all the necessary data.
 * 
 * The options object MAY include an "id" property.  If it does, 
 * this function should only return one order (of matching id). 
 * If the "id" property in "options" is not defined, return all orders.
 * 
 * Required return value:
 * An array of objects with the following structure:
 * 
 *   id (order ID)
 *   date (order Date)
 *   customer {hjl 
 *      id (customer ID)
 *      firstName (customer's first name)
 *      lastName (customer's last name)
 *   }
 *   product {
 *     id (product ID)
 *     name (product name)
 *     price (product price)
 *   }
 * 
 *  You are permitted to include additional data in the customer/product sub-objects
 *  as you wish.
 * 
 * 10 Points
 */
exports.getOrders = function(options, callback) {
    var sql_getOrders = ''
        if(options.id)
        {
            sql_getOrders ='SELECT orders.id AS id,orders.date AS orderDate,customers.id AS customerID, customers.firstName AS firstName, \
            		customers.lastName AS lastName,products.id AS productID, \
            		products.name AS Name, products.price AS Price FROM orders\
                    LEFT JOIN customers ON orders.customerID = customers.id LEFT JOIN products ON orders.id=products.id\
                    WHERE orders.id = ' + options.id;
        }
        else
        {
            sql_getOrders ='SELECT orders.id AS id, orders.date AS order_Date, customers.id AS customerID, \
                            customers.firstName AS firstName, customers.lastName AS lastName, products.id AS productID,\
                   	        products.name AS productName, products.price AS productPrice FROM orders\
                    	    LEFT JOIN customers ON orders.customerID = customers.id\
                    	    LEFT JOIN products ON orders.productID = products.id';
        }
        db.all(sql_getOrders,function(err,arr_orders)
        {
            var _arrayOrder = []

            for(var i = 0; i < arr_orders.length; i++)
            {
                _arrayOrder[i] =  
                {
                id:arr_orders[i].id,
                date:arr_orders[i].order_Date,
                customer:
                {
                    id:arr_orders[i].customerID,
                    firstName:arr_orders[i].firstName,
                    lastName:arr_orders[i].lastName
                },
                
                product:
                {
                    id:arr_orders[i].productID,
                    name:arr_orders[i].productName,
                    price:arr_orders[i].productPrice
                }
            
        
    			}
    		}		
    console.log(_arrayOrder);
    callback(null, _arrayOrder);

    });
 }       

/**
 * This function retrieves customers and returns them as an array. 
 * 
 * The options object MAY include an "id" property.  If it does, 
 * this function should only return (an array of) one customer (of matching id). 
 * If the "id" property in "options" is not defined, return all orders.
 * 
 * Required return value: array of customer objects (with all customer data)
 * 
 * 5 Points
 */

exports.getCustomers = function(options, callback) {
    var sqlGetCust=''
    if(options.id)
    {
        sqlGetCust='SELECT * FROM customers WHERE customers.id ='+ options.id;
    }
    else
    {
        sqlGetCust='SELECT * FROM customers'
    }

    db.all(sqlGetCust,function(err,arr)
    {
        console.log(arr);
        callback(null,arr);
    });
}
/**
 * This function retrieves products and returns them as an array. 
 * 
 * The options object MAY include an "id" property.  If it does, 
 * this function should only return (an array of) one product (of matching id). 
 * If the "id" property in "options" is not defined, return all orders.
 * 
 * Required return value: array of product objects (with all product data)
 * 
 * 5 Points
 */
 
exports.getProducts = function(options, callback) {
    var getProdSql=''
    if(options.id)
    {
        getProdSql = 'SELECT * FROM products WHERE id ='+options.id;
    }
    else
    {
        getProdSql = 'SELECT * FROM products';
    }
    db.all(getProdSql,function(err,prods)
    {
        if(!err)
        {      
            var productsArray=[];
            for(var i=0 ; i<prods.length; i++)
            {
                productsArray[i]=
                {
                    id:prods[i].id,
                    name:prods[i].name,
                    price:prods[i].price
                }
            }
            console.log(productsArray);
            callback(null,productsArray);
        }
    });
  

}


/**
 * This function accepts an order object an inserts it into the ORDERS table.
 * 
 * 5 Points
 */
exports.addOrder = function(order, callback) {
	if(order.id)
	{
		//var inputOrder = [req.order.id, req.order.customerId, req.order.productId, req.order.Date];
		var _date1 = order.date;
		var formatDate = moment(_date1).format('YYYY-MM-DD');
		
		db.run("Update orders SET id = ?, customerId = ?, productId = ? , Date = ?",order.id,order.customerId,order.productId,formatDate);
	}
	else
	{
		var _date = order.date
		var formatDate = moment(_date).format('YYYY-MM-DD');
		db.run("INSERT INTO orders (id,customerId,productId,Date) Values (?,?,?,?)",order.id,order.customerId,order.productId,formatDate
		);
	}

    callback(null, null);
}

/**
 * This function accepts a customer object an inserts or updates it into the CUSTOMERS table.
 * 
 * If customer.id is defined, the customer object represents an existing customer, and you 
 * must issue an update command.  Otherwise, insert.
 * 
 * 5 Points
 */
exports.upsertCustomer = function(customer, callback) {
    if(customer.id)
    {
    	db.run('UPDATE customers SET firstName = ?, lastName = ?, street = ?, city = ?,state = ?,zip = ? where id= ?',customer.firstName, customer.lastName,customer.street,customer.city,customer.state,customer.zip,customer.id);
    }
    else
    {
        db.run('INSERT INTO customers(firstName,lastName,street,city,state,zip) VALUES(?,?,?,?,?,?)',customer.firstName,customer.lastName, customer.street,customer.city,customer.state,customer.zip);
    }

    callback(null, null);
}

/**
 * This function accepts a product object an inserts or updates it into the PRODUCTS table.
 * 
 * If product.id is defined, the product object represents an product customer, and you 
 * must issue an update command.  Otherwise, insert.
 * 
 * 5 Points
 */
exports.upsertProduct = function(product, callback) {
	if(product.id)
    {
        db.run('UPDATE products SET name = ?, price = ? WHERE id = ?',product.name, product.price,product.id);
    }
    else
    {
        db.run('INSERT INTO products(name,price) VALUES(?,?)',product.name,product.price);
    }
    
    callback(null, null);
}

/**
* The following delete methods all accept an ID, and should delete the Order/Customer/Product
* out of the corresponding table with the matching ID.  

*  Total 15 points for all three
*/
exports.deleteOrder = function(id, callback) {
   	 db.run('DELETE FROM orders WHERE orders.id =' + id);
     callback(null, null);
}
exports.deleteCustomer = function(id, callback) {
    db.run('DELETE FROM customers WHERE customers.id =' + id);
 	callback(null, null);
}
exports.deleteProduct = function(id, callback) {
    db.run('DELETE FROM products WHERE products.id =' + id);
    callback(null, null);
}


/**
 * This function builds a customer report.  The options
 * object MUST have a customerId property.  You must build a report 
 * object that contains the customer data (id, first/last name) along
 * with a list of all orders (order ID, order date, product ID, 
 * product name, and product price) and return it.
 * 
 * Note:  If the customer hasn't purchased anything, just return an empty orders
 *        array.  Hint:  LEFT JOIN will be your friend...
 * 
 * Required return value:
 * An object with the following structure:
 * 
 *   id (customer ID)
 *   firstName (customer's first name)
 *   lastName (customer's last name)
 *   orders [  // list of these....
 *      {   
 *          id (order id)
 *          date (order date)
 *          product {
 *            id (product ID)
 *            name (product name)
 *            price (product price)
 *          }
 *      }
 *   ]
 * 
 *  You are permitted to include additional data in the customer/product sub-objects
 *  as you wish.
 * 
 * 10 Points
 */
exports.customerReport = function(options, callback) {
	custReportSql=' SELECT customers.id AS id, customers.firstName AS firstName, customers.lastName AS lastName,\
                orders.id AS orderID, orders.date AS orderDate,\
                products.id AS productID, products.name AS productName, products.price AS productPrice\
                FROM customers LEFT JOIN orders ON customers.id = orders.customerID\
                LEFT JOIN products ON orders.productID=products.id\
                where customers.id='+options.customerId;
    db.all(custReportSql,function(err,custRep)
    {
    
           var custRepArray= {
            id:custRep[0].id,
            firstName:custRep[0].firstName,
            lastName:custRep[0].lastName,
            orders:''
           };
           var order_details = []
            for(var i=0;i<custRep.length;i++)
            {
                order_details[i]=
                {
                    id:custRep[i].orderID,
                    date:custRep[i].orderDate,
                    product:
                    {
                        id:custRep[i].productID,
                        name:custRep[i].productName,
                        price:custRep[i].productPrice,
                    }
                }
            }
            custRepArray['orders']= order_details;

            console.log(custRepArray)

            callback(null,custRepArray);
           
        
    });
}
/**
 * This function builds a product report.  The options
 * object MUST have a productId property.  You must build a report 
 * object that contains the product data (id, name, price) along
 * with a list of all orders (order ID, order date, customer ID, 
 * customer first/last name) and return it.
 * 
 * Note:  If the product hasn't been purchased, just return an empty orders
 *        array.  Hint:  LEFT JOIN will be your friend...
 
 * 
 * Required return value:
 * An object with the following structure:
 * 
 *   id (product ID)
 *   name (product name)
 *   price (product price)
 *   orders [  // list of these....
 *      {   
 *          id (order id)
 *          date (order date)
 *          customer {
 *            id (customer ID)
 *            firstName (customer's first name)
 *            lastName (customer's last name)
 *          }
 *      }
 *   ]
 * 
 *  You are permitted to include additional data in the customer/product sub-objects
 *  as you wish.
 * 
 * 10 Points

 */

exports.productReport = function(options, callback) 
{
	 sql_prodReport='SELECT products.id AS id, products.name AS itemName, products.price as Price,\
                orders.id AS orderID, orders.date AS Date,\
                customers.id AS customerID, customers.firstName AS firstName, customers.lastName as lastName \
                FROM products LEFT JOIN orders ON products.id = orders.productID\
                left join customers on orders.customerID=customers.id\
                WHERE products.id = ' + options.productId;
    db.all(sql_query,function(err,prodRep)
    { 
           var prodReportArray = 
           {
            id 		:prodRep[0].id,
            name 	:prodRep[0].Name,
            price 	:prodRep[0].Price,
            orders 	:''
           };
           var orderDet= []
            for(var i = 0 ; i < prodRep.length; i++)
            {
                orderDet[i]=
                {
                    id:prodRep[i].orderID,
                    date:prodRep[i].Date,
                    customer:
                    {
                        id:prodRep[i].customerID,
                        firstName:prodRep[i].firstName,
                        lastName:prodRep[i].lastName
                    }
                }
            }
            prodReportArray['orders']=orderDet;
            
            console.log(prodReportArray)
            callback(null,prodReportArray);
           
        }
    );
}


/**
 * This function builds a sales report.  The options object is currently unused.
 * 
 * The function should return a list of products, where each product object
 * contains the following:
 * 
 *   id (product ID)
 *   name (product name)
 *   price (product price)
 *   sales (number of sales made)
 *   lastDate (date of last sale)
 * 
 * 10 Points
 */
exports.salesReport = function(options, callback) {
    salesQuery='SELECT products.id, products.name, products.price, count(products.id) as totalSales, orders.date as orderDate\
                FROM products INNER JOIN orders ON products.id = orders.productID\
                GROUP BY products.id;'
    db.all(salesQuery,function(err,sales)
    {
    	if(!err){
            saleArray=[]
            for(var i=0 ; i<sales.length;i++)
            {
                saleArray[i]=
                {
                    id:sales[i].id,
                    name:sales[i].name,
                    price:sales[i].price,
                    sales:sales[i].totalSales,
                    lastDate:sales[i].orderDate

                }
            }
            console.log(saleArray);
            callback(null,saleArray);
        
        }	
    });

};

//final function for extension of app

exports.purchaseReport = function(options,callback)
{
    query = '   SELECT customers.id AS ID,customers.firstName||" "||customers.lastName AS Name,\
                count(orders.id) as totPurchased,\
                sum(products.price) as totalSpent\
                FROM customers\
                INNER JOIN orders ON customers.id = orders.customerID\
                INNER JOIN products ON orders.productID=products.id\
                GROUP BY customers.id;'
    db.all(query,function(err,customerStuff)
    {
        if(!err)
        {
            customerArray=[]
            for(var i = 0 ; i<customerStuff.length; i++)
            {
                customerArray[i]=
                {
                    id:customerStuff[i].ID,
                    name:customerStuff[i].Name,
                    numPurchased:customerStuff[i].totPurchased,
                    spentAmt:customerStuff[i].totalSpent,
                }
            }
            console.log(customerArray);
            callback(null,customerArray);
        }

    });

}