-- @TODO: Revisit the existing tables after adding order, payment, cart.
-- @TODO: Wishlist

SET FOREIGN_KEY_CHECKS=0;

DROP DATABASE IF EXISTS looplr;
CREATE DATABASE looplr;
USE looplr;

DROP TABLE IF EXISTS entity;
CREATE TABLE entity (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
  deleted_at TIMESTAMP NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS user;
CREATE TABLE user (
  id INT UNSIGNED NOT NULL,
  first_name VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  last_name VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  handle VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  email VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  gender ENUM('M','F'),
  password BINARY(60) NULL,
  phonenumber CHAR(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  about VARCHAR(800) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  reset_password_token VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  reset_password_expires_at TIMESTAMP NULL,
  is_active BOOLEAN NOT NULL DEFAULT 1,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
  deleted_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES entity(id),
  UNIQUE(phonenumber),
  UNIQUE(email)
);

DROP TABLE IF EXISTS collection;
CREATE TABLE collection (
  id INT UNSIGNED NOT NULL,
  name VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  owner_id INT UNSIGNED NULL,
  description VARCHAR(500) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  tags JSON NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
  deleted_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES entity(id),
  FOREIGN KEY (owner_id) REFERENCES user(id)
);

DROP TABLE IF EXISTS collection_product;
CREATE TABLE collection_product (
  id INT UNSIGNED NOT NULL,
  collection_id INT UNSIGNED NOT NULL,
  product_id INT UNSIGNED NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
  deleted_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (collection_id) REFERENCES collection(id),
  FOREIGN KEY (product_id) REFERENCES product(id)
);

DROP TABLE IF EXISTS product;
CREATE TABLE product (
  id INT UNSIGNED NOT NULL,
  name VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  category VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  subcategory VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  description VARCHAR(500) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  storename VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  gender ENUM('M', 'F', 'U'),
  tags JSON NULL,
  promotional_text VARCHAR(500) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
  deleted_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES entity(id)
);

DROP TABLE IF EXISTS sku;
CREATE TABLE sku (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id INT UNSIGNED NOT NULL,
  sku_attribute_id INT UNSIGNED NOT NULL,
  stock SMALLINT UNSIGNED NOT NULL,
  price DOUBLE PRECISION(10, 2) DEFAULT NULL,
  discount DOUBLE PRECISION(10, 2) DEFAULT NULL,
  is_active TINYINT NOT NULL DEFAULT 1,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
  deleted_at TIMESTAMP NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS sku_attribute;
CREATE TABLE sku_attribute (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
  deleted_at TIMESTAMP NULL,
  PRIMARY KEY(id)
);

DROP TABLE IF EXISTS color;
CREATE TABLE color (
  id INT UNSIGNED NOT NULL,
  name VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
  deleted_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES sku_attribute(id)
);

DROP TABLE IF EXISTS size;
CREATE TABLE size (
  id INT UNSIGNED NOT NULL,
  name VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
  deleted_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id) REFERENCES sku_attribute(id)
);

DROP TABLE IF EXISTS address;
CREATE TABLE address (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  street_address VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  landmark VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  city VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  state VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  postal_code CHAR(6) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
  deleted_at TIMESTAMP NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (user_id) REFERENCES user(id)
);

DROP TABLE IF EXISTS image;
CREATE TABLE image (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  -- collection, product, user
  entity_id INT UNSIGNED NOT NULL,
  type ENUM(
    'product',
    'collection',
    'product_sizechart',
    'user'
  ) NOT NULL,
  url VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  thumbnail_url VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  description VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
  deleted_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (entity_id) REFERENCES entity(id)
);

DROP TABLE IF EXISTS comment;
CREATE TABLE comment (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  -- collection, product, order
  entity_id INT UNSIGNED NOT NULL,
  rating TINYINT UNSIGNED NULL,
  txt VARCHAR(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
  deleted_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (entity_id) REFERENCES entity(id)
);

DROP TABLE IF EXISTS follow;
CREATE TABLE follow (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  follower_id INT UNSIGNED NOT NULL,
  followed_id INT UNSIGNED NOT NULL,

  PRIMARY KEY (id),
  FOREIGN KEY (follower_id) REFERENCES user(id),
  FOREIGN KEY (followed_id) REFERENCES user(id)
);
