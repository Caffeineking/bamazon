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
  password: "root", // I have a password on  mine
  database: "bamazon"
});
// initiate connection
connection.connect(function (err) {
  // err just incase
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

var total;

var stockQuantity;
var zero = 0; // place holder for the total items
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
      selectQuery();
    });
  });
};
let itemId = "";

function selectQuery() {
  connection.query("SELECT * FROM products WHERE product_name = '" + a + "'",
    function (error, res) {
      if (error) throw error;
      //always First loop over the array to get a single object and then extract it's properties:   
      for (var i = 0; i < res.length; i++) {
        console.log(chalk.green(a + "'s " + "price:$" + res[i].price) + "|" + chalk.yellow("ID number: " + res[i].item_id) + "|" + chalk.blue("Stock Quantity: " + res[i].stock_quantity));
        itemId = res[i].item_id;
      }
      askId();
    })
};

let ask_id;

function askId() {
  inquirer
    .prompt({
      name: "askId",
      type: "input",
      message: chalk.yellow("Enter ID Number to place order")
    })
    .then(function (answer) {
      ask_id = answer.askId;

      if (itemId === parseInt(ask_id)) { // gotta parse it first.. fixed a bug where user can place an order with incorrect ID
        askUnits();
      } else {
        console.log(chalk.red("Enter correct ID number"));
        askId();
      }
    });
};

let unitSold = "";
function askUnits() {
  inquirer
    .prompt({
      name: "askUnits",
      type: "input",
      message: chalk.yellow("Enter the amount of units you would like to purchase")
    }).then(function (answer) {
      unitSold = answer.askUnits;
      console.log(chalk.green("checking inventory..............."));
      stockComparison();
    })
}


function stockComparison() {
  connection.query("SELECT * FROM products WHERE product_name = '" + a + "'",
    function (error, res) {
      var resPrice;
      if (error) throw error;
      stockQuantity = res[0].stock_quantity;
      resPrice = res[0].price;
      // condition if the item is in stock     
      if (stockQuantity > unitSold) { // BUG where it was allowed for the program to continue purchase without a valid id
        stockQuantity = stockQuantity - unitSold;
          total + resPrice;

          
        console.log(typeof(itemId))

        console.log("your total is " + total + "your resPrice is" + resPrice);
        console.log(chalk.green("order placed!"));
        orderFunction();
      } else {
        console.log(chalk.red("item is not in stock, would you like to try again?"));
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
      console.log("order placed successfully!");
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
        console.log(chalk.blue("you spent $" + total));
        chalk.yellow(console.log("Thank you for shopping at Bamazon!"));
      }
    })
}
