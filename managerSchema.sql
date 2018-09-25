-- schema for the first question
SELECT item_id,product_name,price,stock_quantity,
 COUNT(*) FROM products GROUP BY product_name
HAVING stock_quantity > 1 ORDER BY product_name DESC;

-- schema for the second question 

SELECT item_id,product_name,price,stock_quantity,
 COUNT(*) FROM products GROUP BY product_name
HAVING stock_quantity < 5 ORDER BY product_name DESC;

-- schema for the third

 "UPDATE products SET ? WHERE ?",
    [{
        stock_quantity: stockQuantity
      },
      {
        item_id: ask_id
      }
    ],



-- create a function where the manager can manually add the number into the quanity



-- schema for the fourth


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("adidas nmd", "shoes", 180, 30);