USE looplr;

INSERT INTO entity(id) VALUES (NULL), (NULL);
INSERT INTO user
  (id, first_name, last_name, handle, phonenumber, gender, email, password, is_active)
VALUES
  (1, 'John', 'Doe', 'johhny21', '9876382710', 'M', 'john@example.com', '$2a$08$3BxHbhf0LX..5gMuzhP9nehnbeeKKTQ7qzu5byemoeJFD6blEtLWa', 1),
  (2, 'Eli', 'Barkovich', 'elie', '9385002793', 'F', 'eli@example.com', '$2a$08$3BxHbhf0LX..5gMuzhP9nehnbeeKKTQ7qzu5byemoeJFD6blEtLWa', 1);

INSERT INTO follow
  (follower_id, followed_id)
VALUES
  (1, 2);

INSERT INTO entity(id) VALUES (NULL), (NULL);
INSERT INTO collection
  (id, name, owner_id, description, tags)
VALUES
  (101, 'Winter Collection', 1, 'Gear up for a warm and cosy winter with winter wear online.', 'men, women, kids'),
  (102, 'Summer Collection', 1, 'Select from our unique summer collection.', 'men, women, kids');

INSERT INTO sku_attribute(id) VALUES (NULL), (NULL);
INSERT INTO color
  (id, hexcode)
VALUES
  (1, '61CDEC'),
  (2, 'EBB860');

INSERT INTO sku_attribute(id) VALUES (NULL), (NULL), (NULL), (NULL);
INSERT INTO size
  (id, name)
VALUES
  (101, 'XS'),
  (102, 'S'),
  (103, 'M'),
  (104, 'L'),
  (105, 'XL'),
  (106, 'XXL');

INSERT INTO address
  (user_id, street_address, landmark, city, state, postal_code)
VALUES
  (1, '15A/56, WEA Karol Bagh', 'Opposite Lane to Roopak Store', 'New Delhi', 'Delhi', '110005'),
  (1, 'GF-25,29, Paramount Spectrum', 'Crossing Republic', 'Ghaziabad', 'Uttar Pradesh', '201016'),
  (2, 'Shyama Prasad Mukherji Marg', 'Bees Dukaan', 'Jaipur', 'Rajasthan', '302004');

INSERT INTO entity(id) VALUES (NULL), (NULL);
INSERT INTO product
  (id, name, category, subcategory, description, storename, gender, tags, promotional_text)
VALUES
  (201, 'Greysh Green Jogger Pants', 'Clothing', 'Joggers and tracks', 'Jogger Pants in Greysh Green Colour', 'ATORSe', 'M', 'joggers, blue', 'This offer is only for a couple of days.'),
  (202, 'Charcoal Solid Slim Fit Long Sleeve T-Shirt', 'Clothing', 'T-Shirt', 'Don\'t be like the rest of the guys, wear unique and stylish outfits from #PAUSE and be different from rest of the crowd', 'Pause', 'M', 'tshirt, slim', NULL),
  (203, 'Maroon Solid Slim Fit Long Sleeve T-Shirt', 'Clothing', 'T-Shirt', 'Don\'t be like the rest of the guys, wear unique and stylish outfits from #PAUSE and be different from rest of the crowd', 'Pause', 'U', 'tshirt, slim', NULL);

INSERT INTO sku
  (product_id, sku_attribute_id, stock, price, discount)
VALUES
  (201, 1, 24, 890.00, 10.00),
  (201, 101, 12, 1200.00, 90.00),
  (201, 102, 0, 3400.50, 25.90),
  (202, 103, 17, 678.80, 0.00);

INSERT INTO collection_product
  (collection_id, product_id)
VALUES
  (102, 201),
  (101, 202),
  (101, 203);

INSERT INTO comment
  (user_id, entity_id, rating, txt)
VALUES
  (1, 101, 3, 'This collection sucks!'),
  (2, 102, 8, 'This collection rocks!'),
  (2, 101, 3, 'This collection sucks!'),
  (2, 201, 8, 'This collection rocks!'),
  (1, 201, 8, 'This collection rocks!'),
  (2, 202, 3, 'This collection sucks!'),
  (1, 202, 1, 'This collection sucks!');

INSERT INTO image
  (entity_id, type, url, thumbnail_url, description)
VALUES
  (101, 'collection', 'http://placehold.it/300X300', 'http://placehold.it/20X20', NULL),
  (102, 'collection', 'http://placehold.it/300X300', 'http://placehold.it/20X20', NULL),
  (201, 'product', 'http://placehold.it/300X300', 'http://placehold.it/20X20', NULL),
  (201, 'product_sizechart', 'http://placehold.it/300X300', 'http://placehold.it/20X20', NULL),
  (202, 'product', 'http://placehold.it/300X300', 'http://placehold.it/20X20', NULL),
  (202, 'product_sizechart', 'http://placehold.it/300X300', 'http://placehold.it/20X20', NULL),
  (203, 'product', 'http://placehold.it/300X300', 'http://placehold.it/20X20', NULL),
  (203, 'product_sizechart', 'http://placehold.it/300X300', 'http://placehold.it/20X20', NULL),
  (1, 'user', 'http://placehold.it/300X300', 'http://placehold.it/20X20', NULL),
  (2, 'user', 'http://placehold.it/300X300', 'http://placehold.it/20X20', NULL);
