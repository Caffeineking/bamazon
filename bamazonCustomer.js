var mysql = require("mysql");
var inquirer = require("inquirer");
const chalk = require('chalk');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});
// initiate connection
connection.connect(function (err) {
  // err just incase
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

function start() {
  inquirer
    .prompt({
      name: "welcome",
      type: "list",
      message: chalk.yellow("Welcome to Bamazon!"),
      choices: ["ENTER", "EXIT"]
    })
    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.welcome.toUpperCase() === "ENTER") {
        // askId(); // first fork
        showItems();

      } else {
        console.log(chalk.blue("good-bye!"));
      }
    });
}
//
let a = "";
function showItems() {
  connection.query("SELECT * FROM products", function (error, res) {
    if (error) throw error;
    inquirer.prompt([{
      name: "itemChoice",     
      type: "list",
      choices: function () {
        let itemArray = [];
        for (let i = 0; i < res.length; i++) {
          itemArray.push(res[i].product_name);
        }
        return itemArray;
      }
    }]).then(function (data) {
      a = data.itemChoice;
      // console.log(a);
      selectQuery();
    });
  });
};

function selectQuery() {
  connection.query("SELECT * FROM products WHERE product_name = '" + a + "'",
    function (error, res) {
      if (error) throw error;
      //always First loop over the array to get a single object and then extract it's properties:
      // var itemArray = [];
      for (var i = 0; i < res.length; i++) {
        // itemArray.push(res[i]);
        console.log(res[i]);
      }
      askId();
    })
};

let ask_id = "";

function askId() {
  inquirer
    .prompt({
      name: "askId",
      type: "input",
      message: chalk.yellow("Please enter item_id number")
    })
    .then(function (answer) {
      ask_id = answer.askId;
      console.log(ask_id);
      askUnits();
    });
};

let unitSold = ""; // to hold ln 107
function askUnits() {
  inquirer
    .prompt({
      name: "askUnits",
      type: "input",
      message: chalk.yellow("Please enter how many units you would like to purchase")
    }).then(function (answer) {
      unitSold = answer.askUnits;
      console.log("checking inventory...............");
      console.log(unitSold);
      stockComparison();
    })
}

var stockQuantity;

var total; // place holder for the total items
function stockComparison() {
  connection.query("SELECT * FROM products WHERE product_name = '" + a + "'",
    function (error, res) {
      if (error) throw error;
      //always First loop over the array to get a single object and then extract it's properties:
      // var itemArray = [];    
      stockQuantity = res[0].stock_quantity;
      total = res[0].price;
      // condition if the item is on stock
      if (stockQuantity > unitSold) {
        stockQuantity = stockQuantity - unitSold;
        total = res[0].price + total;
        console.log("order placed!");
        // orderFunction();
        // console.log(stockQuantity);  
        orderFunction();
        
      } else {
        console.log("item is not on stock, would you like to try again?");
        inquirer
          .prompt({
            name: "continue",
            type: "list",        
            choices: ["YES", "EXIT"]
          }).then(function (answer) {
            if (answer.continue === "YES") {
              showItems();
            } else {
              console.log("Thank you for shopping at Bamazon!");
            }
          })
      }

    })
}
function orderFunction() {
  console.log(stockQuantity);
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [{
        stock_quantity: stockQuantity
      },
      {
        item_id: ask_id
      }
    ],
    function (error) {
      if (error) throw error;
      // your total is
      console.log("order placed successfully!");
      // console.log("placeholder" + res[0].stock_quantity);
    }
  );
  inquirer
    .prompt({
      name: "continue",
      type: "list",
      message: chalk.yellow("Shop more?"),
      choices: ["YES", "EXIT"]
    }).then(function (answer) {
      if (answer.continue === "YES") {       
        showItems();
      } else {   
        chalk.yellow(console.log("Thank you for shopping at Bamazon!"));
        console.log(chalk.blue("you spend  " + total));
      }
    })
}
