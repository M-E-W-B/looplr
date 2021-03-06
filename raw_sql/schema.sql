-- @TODO: Delivery will combine pincode and product to deduce
    -- return policy
    -- payment method
    -- delivery date

-- @TODO: Campaigns

SET FOREIGN_KEY_CHECKS=0;

DROP DATABASE IF EXISTS looplr;
CREATE DATABASE looplr;
USE looplr;

DROP TABLE IF EXISTS entity;
CREATE TABLE entity (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE NOW(),
  is_deleted INT UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS user;
CREATE TABLE user (
  id INT UNSIGNED NOT NULL,
  first_name VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  last_name VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  handle VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  email VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  gender ENUM('M','F') NULL,
  password BINARY(60) NOT NULL,
  image VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  phonenumber CHAR(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  about VARCHAR(800) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  reset_password_token VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  reset_password_expires_at TIMESTAMP NULL,
  is_active BOOLEAN NOT NULL DEFAULT 1,
  is_admin BOOLEAN NOT NULL DEFAULT 0,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE NOW(),
  is_deleted INT UNSIGNED NOT NULL DEFAULT 0,

  
  PRIMARY KEY (id),
  UNIQUE KEY `uc_phonenumber`(phonenumber, is_deleted),
  UNIQUE KEY `uc_email`(email, is_deleted),
  UNIQUE KEY `uc_handle`(handle, is_deleted),
  FOREIGN KEY (id) REFERENCES entity(id)
);

DROP TABLE IF EXISTS collection;
CREATE TABLE collection (
  id INT UNSIGNED NOT NULL,
  name VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  -- owner can be a user
  owner_id INT UNSIGNED NULL,
  image VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  description VARCHAR(500) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  tags JSON NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE NOW(),
  is_deleted INT UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES entity(id),
  FOREIGN KEY (owner_id) REFERENCES user(id)
);

DROP TABLE IF EXISTS category;
CREATE TABLE category (
  id INT UNSIGNED NOT NULL,
  name VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,  
  parent_category_id INT UNSIGNED NULL,
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE NOW(),
  is_deleted INT UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES entity(id),
  FOREIGN KEY (parent_category_id) REFERENCES category(id)
);

DROP TABLE IF EXISTS collection_product;
CREATE TABLE collection_product (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  collection_id INT UNSIGNED NOT NULL,
  product_id INT UNSIGNED NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE NOW(),
  is_deleted INT UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY (id),
  UNIQUE KEY `uc_product_in_collection` (collection_id, product_id, is_deleted),
  FOREIGN KEY (collection_id) REFERENCES collection(id),
  FOREIGN KEY (product_id) REFERENCES product(id)
);

DROP TABLE IF EXISTS product;
CREATE TABLE product (
  id INT UNSIGNED NOT NULL,
  name VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  subcategory_id INT UNSIGNED NOT NULL,  
  description VARCHAR(500) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  image JSON NULL,
  sizechart VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  storename VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  gender ENUM('M', 'F', 'U') NULL,
  tags JSON NULL,
  promotional_text VARCHAR(500) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE NOW(),
  is_deleted INT UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES entity(id),
  FOREIGN KEY (subcategory_id) REFERENCES category(id)
);

DROP TABLE IF EXISTS sku;
CREATE TABLE sku (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id INT UNSIGNED NOT NULL,
  sku_attribute_id INT UNSIGNED NOT NULL,
  stock SMALLINT UNSIGNED NOT NULL,
  price DOUBLE PRECISION(10, 2) NULL,
  discount DOUBLE PRECISION(10, 2) NULL,
  is_active TINYINT NOT NULL DEFAULT 1,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE NOW(),
  is_deleted INT UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY (id),
  UNIQUE KEY `uc_sku_in_product`(product_id, sku_attribute_id, is_deleted),
  FOREIGN KEY (product_id) REFERENCES product(id),
  FOREIGN KEY (sku_attribute_id) REFERENCES sku_attribute(id)
);

DROP TABLE IF EXISTS sku_attribute;
CREATE TABLE sku_attribute (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE NOW(),
  is_deleted INT UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY(id)
);

DROP TABLE IF EXISTS color;
CREATE TABLE color (
  id INT UNSIGNED NOT NULL,
  hexcode CHAR(7) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE NOW(),
  is_deleted INT UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY (id),
  UNIQUE KEY `uc_color`(hexcode, is_deleted),
  FOREIGN KEY (id) REFERENCES sku_attribute(id)
);

DROP TABLE IF EXISTS size;
CREATE TABLE size (
  id INT UNSIGNED NOT NULL,
  name VARCHAR(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE NOW(),
  is_deleted INT UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY (id),  
  UNIQUE KEY `uc_size`(name, is_deleted),
  FOREIGN KEY (id) REFERENCES sku_attribute(id)
);

DROP TABLE IF EXISTS address;
CREATE TABLE address (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  street_address VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  landmark VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  city VARCHAR(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  state VARCHAR(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  postal_code CHAR(6) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  type ENUM(
    'home',
    'office',    
    'other'
  ) NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE NOW(),
  is_deleted INT UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY(id),
  FOREIGN KEY (user_id) REFERENCES user(id)
);

DROP TABLE IF EXISTS comment;
CREATE TABLE comment (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  -- collection, product, order
  entity_id INT UNSIGNED NOT NULL,
  rating TINYINT UNSIGNED NULL CHECK(rating >= 0 AND rating <= 10),
  txt VARCHAR(400) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE NOW(),
  is_deleted INT UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY (id),  
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (entity_id) REFERENCES entity(id)
);

DROP TABLE IF EXISTS follow;
CREATE TABLE follow (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  follower_id INT UNSIGNED NOT NULL,
  followed_id INT UNSIGNED NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE NOW(),
  is_deleted INT UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY (id),
  UNIQUE (follower_id, followed_id, is_deleted),
  FOREIGN KEY (follower_id) REFERENCES user(id),
  FOREIGN KEY (followed_id) REFERENCES user(id)
);

DROP TABLE IF EXISTS wishlist;
CREATE TABLE wishlist (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  sku_id INT UNSIGNED NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE NOW(),
  is_deleted INT UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (sku_id) REFERENCES sku(id)
);

DROP TABLE IF EXISTS cart;
CREATE TABLE cart (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE NOW(),
  is_deleted INT UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES user(id)
);

DROP TABLE IF EXISTS cart_item;
CREATE TABLE cart_item (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  cart_id INT UNSIGNED NOT NULL,
  sku_id INT UNSIGNED NOT NULL,
  quantity TINYINT UNSIGNED NOT NULL DEFAULT 1,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE NOW(),
  is_deleted INT UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY (id),
  UNIQUE KEY `uc_sku_in_cart` (cart_id, sku_id, is_deleted),
  FOREIGN KEY (cart_id) REFERENCES cart(id),
  FOREIGN KEY (sku_id) REFERENCES sku(id)
);

DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  address_id INT UNSIGNED NOT NULL,
  coupon_id INT UNSIGNED NOT NULL,
  -- For now, shipping_charge is based on total order value
  shipping_charge DOUBLE PRECISION(10, 2) NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE NOW(),
  is_deleted INT UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (address_id) REFERENCES address(id),
  FOREIGN KEY (coupon_id) REFERENCES coupon(id)
);

-- Remove user's entry from cart after the order has been placed
DROP TABLE IF EXISTS order_item;
CREATE TABLE order_item (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id INT UNSIGNED NOT NULL,
  sku_id INT UNSIGNED NOT NULL,
  quantity TINYINT UNSIGNED NOT NULL DEFAULT 1,
  status ENUM(
    'ON_HOLD',
    'PLACED',
    'CANCELLED',
    'REJECTED',
    'CONFIRMED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'RETURNED'
  ) NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE NOW(),
  is_deleted INT UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY (id),
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (sku_id) REFERENCES sku(id)
);

DROP TABLE IF EXISTS coupon;
CREATE TABLE coupon (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  code VARCHAR(8) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  description VARCHAR(500) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  max_uses INT UNSIGNED NULL,
  max_uses_per_user TINYINT UNSIGNED NULL,
  min_order INT UNSIGNED NULL,
  is_percentage TINYINT UNSIGNED NOT NULL DEFAULT 0,
  discount DOUBLE PRECISION(10, 2) NULL,
  starts_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE NOW(),
  is_deleted INT UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY (id),
  UNIQUE KEY `uc_code`(code, is_deleted)
);

DROP TABLE IF EXISTS badge;
CREATE TABLE badge (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  description VARCHAR(500) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE NOW(),
  is_deleted INT UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS user_badge;
CREATE TABLE user_badge (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  badge_id INT UNSIGNED NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NULL ON UPDATE NOW(),
  is_deleted INT UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY (id),
  UNIQUE KEY `uc_badge_for_user`(user_id, badge_id, is_deleted),
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (badge_id) REFERENCES badge(id)
);

-- DELIMITER //
-- CREATE TRIGGER tr_badge_user_insert
-- AFTER INSERT ON user
-- FOR EACH ROW BEGIN
--   IF NEW.phonenumber IS NOT NULL
--   THEN
--     INSERT INTO user_badge (
--       user_id, badge_id
--     ) VALUES (
--       NEW.id,
--       1
--     );
--   END IF;
-- END;//
-- DELIMITER ;

-- DELIMITER //
-- CREATE TRIGGER tr_badge_user_update
-- AFTER UPDATE ON user
-- FOR EACH ROW BEGIN
--   IF OLD.phonenumber IS NULL AND NEW.phonenumber IS NOT NULL
--   THEN
--     INSERT INTO user_badge (
--       user_id, badge_id
--     ) VALUES (
--       NEW.id,
--       1
--     );
--   END IF;
-- END;//
-- DELIMITER ;
