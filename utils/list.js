const knex = require('knex');

// @TODO: Support multiple operators for filtering
// const partialMatchColumns = ['first_name', 'last_name', 'description'];
const operatorMapping = {
  GREATER_THAN: '>',
  GREATER_THAN_OR_EQUAL: '>=',
  LESSER_THAN: '<',
  LESSER_THAN_OR_EQUAL: '<=',
  EQUAL: '=',
  NOT_EQUAL: '<>',
  IN: 'in',
  LIKE: 'like'
};

module.exports = (
  pagination,
  orderings = [],
  filters = [],
  query,
  tableName
) => {
  if (filters.length) {
    const filterParams = filters.reduce(
      (acc, { column, operator, value }) =>
        acc.concat([
          `${tableName}.${column}`,
          knex.raw(`${operatorMapping[operator]}`),
          `${operatorMapping[operator] === 'in' ? value : value[0]}`
        ]),
      []
    );

    const filterQuery = filters
      .map(({ column, value }) => `( ?? ? ? )`)
      .join(' and ');

    query.joinRaw(`and ${filterQuery}`, filterParams);
  }

  if (orderings.length) {
    const orderingsParams = orderings.reduce(
      (acc, { column, direction }) =>
        acc.concat([`${tableName}.${column}`, knex.raw(direction)]),
      []
    );

    const orderingsQuery = orderings
      .map(({ column, direction }) => '?? ?')
      .join(', ');

    query.joinRaw(`order by ${orderingsQuery}`, orderingsParams);
  }

  if (pagination) {
    const { pageNumber, pageSize } = pagination;
    const offset = (pageNumber - 1) * pageSize;

    query.joinRaw('limit ?', [pageSize]);
    query.joinRaw('offset ?', [offset]);
  }

  // console.log(query.toString());

  return query;
};
