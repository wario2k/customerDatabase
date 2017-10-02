const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('hw4.db');

const moment = require('moment');


/**
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
    db.run("CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY \
            AUTOINCREMENT, firstName TEXT, lastName TEXT, street TEXT, \
            city TEXT, state TEXT, zip INTEGER)");  

    db.run("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY \
            KEY AUTOINCREMENT, name TEXT, price REAL)");  

    db.run("CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY \
             KEY AUTOINCREMENT, customerID INTEGER, productID INTEGER, date TEXT)");
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
exports.getOrders = function(options, callback) {
    var sql_query='';
    if(options.id)
    {
        sql_query='select orders.id as id,orders.date as orderDate,customers.id as customerID,customers.firstName as firstName,\
                    customers.lastName as lastName,products.id as productID,\
                    products.name as productName, products.price as productPrice from orders\
                    left join customers on orders.customerID=customers.id\
                    left join products on orders.id=products.id\
                    where orders.id='+options.id;


    }
    else
    {
        sql_query='select orders.id as id,orders.date as orderDate,customers.id as customerID,              customers.firstName as firstName,\
                    customers.lastName as lastName,products.id as productID,\
                    products.name as productName, products.price as productPrice from orders\
                    left join customers on orders.customerID=customers.id\
                    left join products on orders.productID=products.id';
    }
    db.all(sql_query,function(err,tuples)
    {
        var return_array=[]
        for(var i=0;i<tuples.length;i++)
        {
            return_array[i]=
            {
                id:tuples[i].id,
                date:tuples[i].orderDate,
                customer:{
                    id:tuples[i].customerID,
                    firstName:tuples[i].firstName,
                    lastName:tuples[i].lastName
                        },
                product:{
                    id:tuples[i].productID,
                    name:tuples[i].productName,
                    price:tuples[i].productPrice
                }
            }
        }
        console.log(return_array);
      callback(null, return_array);
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
    var sql_query=''
    if(options.id)
    {
        sql_query='select * from customers where customers.id='+options.id;
    }
    else
    {
        sql_query='select * from customers'
    }
    db.all(sql_query,function(err,tuples)
    {
        if(err)
        {
            callback(err);
        }
        else
        {
            var return_array=[]
            for(var i=0;i<tuples.length;i++)
            {
                return_array[i]=
                {
                    id:tuples[i].id,
                    firstName:tuples[i].firstName,
                    lastName:tuples[i].lastName,
                    street:tuples[i].street,
                    city:tuples[i].street,
                    state:tuples[i].state,
                    zip:tuples[i].zip
                }
            }
            //console.log(return_array);
            callback(null,return_array);
        }
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
    var sql_query=''
    if(options.id)
    {
        sql_query='select * from products where id='+options.id;
    }
    else
    {
        sql_query='select * from products';
    }
    db.all(sql_query,function(err,tuples)
    {
        if(err)
        {
            callback(err);
        }
        else
        {
            var return_array=[];
            for(var i=0;i<tuples.length;i++)
            {
                return_array[i]=
                {
                    id:tuples[i].id,
                    name:tuples[i].name,
                    price:tuples[i].price
                }
            }
            //console.log(return_array);
            callback(null,return_array);
        }
    });
  

}

/**
 * This function accepts an order object an inserts it into the ORDERS table.
 * 
 * 5 Points
 */
exports.addOrder = function(order, callback) {
    db.run('INSERT INTO orders(customerID, productID,date) VALUES(?,?,?)',order.customerId,order.productId,order.date);
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
    var sql_query=''
    if(customer.id)
    {
        db.run('UPDATE customers set firstName=?, lastName=?, street=?, city=?,state=?,zip=? where id= ?',customer.firstName,
                customer.lastName,customer.street,customer.city,customer.state,customer.zip,customer.id);
    }
    else
    {
        db.run('INSERT INTO customers(firstName,lastName,street,city,state,zip) VALUES(?,?,?,?,?,?)',customer.firstName,customer.lastName,
                customer.street,customer.city,customer.state,customer.zip);
    }
    callback(null,null);
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
        db.run('UPDATE products set name=?, price=? where id= ?',product.name,
                product.price,product.id);
    }
    else
    {
        db.run('INSERT INTO products(name,price) VALUES(?,?)',product.name,product.price);
    }
    callback(null,null);
    
}

/**
* The following delete methods all accept an ID, and should delete the Order/Customer/Product
* out of the corresponding table with the matching ID.  

*  Total 15 points for all three
*/
exports.deleteOrder = function(id, callback) {
    db.run('delete from orders where id='+id);
    callback(null, null);
}
exports.deleteCustomer = function(id, callback) {
    db.run('delete from customers where id='+id);
    callback(null, null);
}
exports.deleteProduct = function(id, callback) {    
    db.run('delete from products where id='+id);
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
        sql_query='select customers.id as id, customers.firstName as firstName,\
                    customers.lastName as lastName,\
                    orders.id as orderID, orders.date as orderDate,\
                    products.id as productID, products.name as productName,\
                    products.price as productPrice\
                    from customers\
                    left join orders on customers.id=orders.customerID\
                    left join products on orders.productID=products.id\
                    where customers.id='+options.customerId;
        db.all(sql_query,function(err,tuples)
        {
            if(err)
            {
                callback(err);
            }
            else
            {
               var return_array= {
                id:tuples[0].id,
                firstName:tuples[0].firstName,
                lastName:tuples[0].lastName,
                orders:''
               };
               var order=[]
                for(var i=0;i<tuples.length;i++)
                {
                    order[i]=
                    {
                        id:tuples[i].orderID,
                        date:tuples[i].orderDate,
                        product:
                        {
                            id:tuples[i].productID,
                            name:tuples[i].productName,
                            price:tuples[i].productPrice,
                        }
                    }
                }
                return_array['orders']=order;

                //return_array[orders]=order;
                console.log(return_array)
                callback(null,return_array);
               
            }
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
exports.productReport = function(options, callback) {
    sql_query='select products.id as id, products.name as productName,\
                products.price as productPrice,\
                orders.id as orderID, orders.date as orderDate,\
                customers.id as customerID, customers.firstName as firstName,\
                customers.lastName as lastName from products\
                left join orders on products.id=orders.productID\
                left join customers on orders.customerID=customers.id\
                where products.id='+options.productId;
    db.all(sql_query,function(err,tuples)
    { 
        if(err)
        {
            callback(err);
        }
        else
        {
           var return_array= {
            id:tuples[0].id,
            name:tuples[0].productName,
            price:tuples[0].productPrice,
            orders:''
           };
           var order=[]
            for(var i=0;i<tuples.length;i++)
            {
                order[i]=
                {
                    id:tuples[i].orderID,
                    date:tuples[i].orderDate,
                    customer:
                    {
                        id:tuples[i].customerID,
                        firstName:tuples[i].firstName,
                        lastName:tuples[i].lastName
                    }
                }
            }
            return_array['orders']=order;

            //return_array[orders]=order;
            console.log(return_array)
            callback(null,return_array);
           
        }
    });
       
    
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
    sql_query='select products.id, products.name,products.price,\
                count(products.id) as sales, orders.date as lastDate\
                from products \
                inner join orders on products.id=orders.productID\
                group by products.id;'
    db.all(sql_query,function(err,tuples)
    {
        if(err)
        {
            callback(err);
        }
        else
        {
            return_array=[]
            for(var i=0;i<tuples.length;i++)
            {
                return_array[i]=
                {
                    id:tuples[i].id,
                    name:tuples[i].name,
                    price:tuples[i].price,
                    sales:tuples[i].sales,
                    lastDate:tuples[i].lastDate

                }
            }
            console.log(return_array);
            callback(null,return_array);
        }

    });
};

exports.purchaseReport = function(options,callback)
{
    sql_query='select customers.id as ID,customers.firstName||" "||customers.lastName as Name,\
                count(orders.id) as numPurchase,\
                sum(products.price) as TotalSpent\
                from customers\
                inner join orders on customers.id=orders.customerID\
                inner join products on orders.productID=products.id\
                group by customers.id;'
    db.all(sql_query,function(err,tuples)
    {
        if(err)
        {
            callback(err);
        }
        else
        {
            return_array=[]
            for(var i=0;i<tuples.length;i++)
            {
                return_array[i]=
                {
                    id:tuples[i].ID,
                    name:tuples[i].Name,
                    numPurchase:tuples[i].numPurchase,
                    spent:tuples[i].TotalSpent,
                }
            }
            console.log(return_array);
            callback(null,return_array);
        }

    });

}