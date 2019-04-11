-- List all collections of a user
SELECT
  id, name, description, tags
FROM collection
WHERE owner_id = 1;

-- List all products of a collection
SELECT
  cp.collection_id AS collection, p.id AS product, p.name, p.category, p.storename
FROM collection_product AS cp
INNER JOIN product AS p
ON cp.product_id = p.id
WHERE cp.collection_id = 3 AND cp.is_deleted = 0 AND p.is_deleted = 0;

-- List all products along with skus
SELECT
  p.name, p.storename,
  s.stock, s.price, s.discount, s.is_active,
  s.sku_attribute_id AS sku_id,
  c.hexcode AS color,
  sz.name AS size
FROM product AS p
INNER JOIN sku AS s
ON p.id = s.product_id
LEFT JOIN color AS c
ON c.id = s.sku_attribute_id
LEFT JOIN size AS sz
ON sz.id = s.sku_attribute_id
WHERE p.is_deleted = 0;

-- List all addresses of a user
SELECT
  id, street_address, landmark, city, state, postal_code
FROM address
WHERE user_id = 1 AND is_deleted = 0;

-- List all comments of a user
SELECT
  u.handle, c.rating, c.txt
FROM comment AS c
INNER JOIN user AS u
ON u.id = c.user_id
WHERE c.entity_id = 3 AND c.is_deleted = 0 AND u.is_deleted = 0;

-- List all followers of a user
SELECT
  follower_id
FROM follow
WHERE followed_id = 2 AND is_deleted = 0;
