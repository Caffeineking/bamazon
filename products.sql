DROP DATABASE IF EXISTS bamazon


CREATE DATABASE bamazon

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR (45) NULL,
  price DECIMAL(8,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);



SELECT * FROM products

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("nvidia 2080 ti", "electronics", 1300, 50);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("nike off-white presto", "shoes", 350, 50);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iphone xs", "electronics", 1300, 50);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("samsung washer", "appliance", 800, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("samsung fridge", "appliance", 2450, 60);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("nike air yeezy 2", "shoes", 5240, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("adidas nmd", "shoes", 180, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("amd threadripper", "electronics", 500, 80);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("macbook pro", "electronics", 2099, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("samsung drier", "appliance", 800, 60);


SELECT product_name FROM products
