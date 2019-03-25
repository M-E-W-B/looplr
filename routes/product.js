const router = require('express').Router();
// @TODO: delegation: skus, images, sizechart

module.exports = ({ productRepository }) => {
  // { name, category, subcategory, description, storename, gender, tags, promotional_text }
  router.post('/', async (req, res, next) => {
    try {
      const id = await productRepository.create(fields);
      const product = await productRepository.getProductById(id);
      return res.json(product);
    } catch (err) {
      next(
        new Error({
          message: 'Unable to create the product.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id }
  router.delete('/:id', async (req, res, next) => {
    try {
      await productRepository.delete(id);
      return res.status(200).end();
    } catch (err) {
      next(
        new Error({
          message: 'Unable to delete the product.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { name, category, subcategory, description, storename, gender, tags, promotional_text }
  router.put('/:id', async (req, res, next) => {
    try {
      await productRepository.update(id, fields);
      const product = await productRepository.getProductById(id);
      return res.json(product);
    } catch (err) {
      next(
        new Error({
          message: 'Unable to update the product.',
          data: { extra: err.message }
        })
      );
    }
  });

  // { id, name, category, subcategory, description, storename, gender, tags, promotional_text, created_at, updated_at, deleted_at }
  router.get('/:id', async (req, res, next) => {
    let product;

    try {
      // @TODO
      product = await productRepository.getProductById(id);
    } catch (err) {
      next(
        new Error({
          message: 'Unable to fetch the product.',
          data: { extra: err.message }
        })
      );
    }

    if (product) return res.json(product);
    else
      next(
        new Error({
          message: 'Product not found.',
          data: { extra: err.message }
        })
      );
  });

  router.get('/', async (req, res, next) => {
    try {
      let edges;
      let pageInfo = null;

      if (collection_id) {
        edges = await productRepository.getProductsByCollectionId(
          collection_id,
          pagination,
          orderings,
          filters
        );
      } else {
        edges = await productRepository.getProducts(
          pagination,
          orderings,
          filters
        );

        pageInfo = productRepository.getPageInfo(
          pagination,
          orderings,
          filters
        );
      }

      return {
        edges,
        pageInfo
      };
    } catch (err) {
      next(
        new Error({
          message: 'Unable to fetch products.',
          data: { extra: err.message }
        })
      );
    }
  });

  return router;
};
