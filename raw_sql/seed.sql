USE looplr;

INSERT INTO badge
  (name, description)
VALUES
  ('verified_phonenumber', 'when a user verifies phonenumber.'),
  ('verified_email', 'when a user verifies email.'),
  ('added_profile_picture', 'when a user adds profile picture.'),
  ('1st_order', 'when a user orders for the 1st time'),
  ('1st_collection', 'when a user creates 1st collection'),
  ('50th_collection', 'when a user creates 50th collection'),
  ('100th_order', 'when a user orders for the 100th time'),
  ('total_order_price_above_Rs2000', 'when a user''s order value is more than Rs. 2000');

-- password is `password`
INSERT INTO entity(id) VALUES (NULL), (NULL);
INSERT INTO user
  (id, first_name, last_name, handle, phonenumber, gender, image, email, password, is_active, is_admin)
VALUES
  (1, 'John', 'Doe', 'johhny21', '9876382710', 'M', 'https://picsum.photos/600/600/?random', 'john@example.com', '$2a$08$48a/.H6UBWo1pOEIHHl47u1o8uxBsYzklAww9X1XQBh11UTOwT9Mq', 1, 1),
  (2, 'Eli', 'Barkovich', 'elie', '9385002793', 'F', 'https://picsum.photos/600/600/?random', 'eli@example.com', '$2a$08$48a/.H6UBWo1pOEIHHl47u1o8uxBsYzklAww9X1XQBh11UTOwT9Mq', 1, 0);

INSERT INTO follow
  (follower_id, followed_id)
VALUES
  (1, 2);

INSERT INTO entity(id) VALUES (NULL), (NULL);
INSERT INTO collection
  (id, name, image, owner_id, description, tags)
VALUES
  (3, 'Winter Collection', 'https://picsum.photos/600/600/?random', 1, 'Gear up for a warm and cosy winter with winter wear online.', JSON_ARRAY('men', 'women', 'kids')),
  (4, 'Summer Collection', 'https://picsum.photos/600/600/?random', 1, 'Select from our unique summer collection.', JSON_ARRAY('men', 'women', 'kids'));

INSERT INTO sku_attribute(id) VALUES (NULL), (NULL);
INSERT INTO color
  (id, hexcode)
VALUES
  (1, '#61CDEC'),
  (2, '#EBB860');

INSERT INTO sku_attribute(id) VALUES (NULL), (NULL), (NULL), (NULL);
INSERT INTO size
  (id, name)
VALUES
  (3, 'XS'),
  (4, 'S'),
  (5, 'M'),
  (6, 'L'),
  (7, 'XL'),
  (8, 'XXL');

INSERT INTO address
  (user_id, street_address, landmark, city, state, postal_code, type)
VALUES
  (1, '15A/56, WEA Karol Bagh', 'Opposite Lane to Roopak Store', 'New Delhi', 'Delhi', '110005', 'home'),
  (1, 'GF-25,29, Paramount Spectrum', 'Crossing Republic', 'Ghaziabad', 'Uttar Pradesh', '201016', 'other'),
  (2, 'Shyama Prasad Mukherji Marg', 'Bees Dukaan', 'Jaipur', 'Rajasthan', '302004', 'other');

INSERT INTO category
  (id, name, parent_category_id)
VALUES
  (1, 'Electronics', NULL), 
  (2, 'Clothing', NULL),
  (3, 'T-Shirt', 2),
  (4, 'Trouser', 2);

INSERT INTO entity(id) VALUES (NULL), (NULL);
INSERT INTO product
  (id, name, subcategory_id, description, storename, gender, sizechart, image, tags, promotional_text)
VALUES
  (5, 'Greysh Green Jogger Pants', 4, 'Jogger Pants in Greysh Green Colour', 'ATORSe', 'M', 'https://picsum.photos/600/600/?random', JSON_ARRAY('https://picsum.photos/600/600/?random', 'https://picsum.photos/600/600/?random'), JSON_ARRAY('joggers', 'blue'), 'This offer is only for a couple of days.'),
  (6, 'Charcoal Solid Slim Fit Long Sleeve T-Shirt', 3, 'Don ''t be like the rest of the guys, wear unique and stylish outfits from #PAUSE and be different from rest of the crowd', 'Pause', 'M', 'https://picsum.photos/600/600/?random', JSON_ARRAY('https://picsum.photos/600/600/?random', 'https://picsum.photos/600/600/?random'), JSON_ARRAY('tshirt', 'slim'), NULL),
  (7, 'Maroon Solid Slim Fit Long Sleeve T-Shirt', 3, 'Don ''t be like the rest of the guys, wear unique and stylish outfits from #PAUSE and be different from rest of the crowd', 'Pause', 'U', 'https://picsum.photos/600/600/?random', JSON_ARRAY('https://picsum.photos/600/600/?random', 'https://picsum.photos/600/600/?random'), JSON_ARRAY('tshirt', 'slim'), NULL);

INSERT INTO sku
  (product_id, sku_attribute_id, stock, price, discount)
VALUES
  (5, 1, 24, 890.00, 10.00),
  (5, 3, 12, 1200.00, 90.00),
  (5, 4, 0, 3400.50, 25.90),
  (6, 5, 17, 678.80, 0.00);

INSERT INTO collection_product
  (collection_id, product_id)
VALUES
  (4, 5),
  (3, 6),
  (3, 7);

INSERT INTO comment
  (user_id, entity_id, rating, txt)
VALUES
  (1, 3, 3, 'This collection sucks!'),
  (2, 4, 8, 'This collection rocks!'),
  (2, 3, 3, 'This collection sucks!'),
  (2, 5, 8, 'This product rocks!'),
  (1, 5, 8, 'This product rocks!'),
  (2, 6, 3, 'This product sucks!'),
  (1, 6, 1, 'This product sucks!');

INSERT INTO coupon
  (code, description, max_uses, max_uses_per_user, min_order, is_percentage, discount, starts_at, expires_at)
VALUES
  ('BOGO', 'This is applicable only on your first order.', 1, 1, 0, 1, 50, '2019-03-26 14:29:38', '2019-09-2 14:29:38');

INSERT INTO wishlist
  (user_id, sku_id)
VALUES
  (1, 1),
  (2, 3);
