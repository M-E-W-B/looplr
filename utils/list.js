// @TODO: Support multiple operators for filtering
const partialMatchColumns = ['first_name', 'last_name', 'description'];
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
          `${operatorMapping[operator]}`,
          `${operatorMapping[operator] === 'in' ? value : value[0]}`
        ]),
      []
    );

    const filterQuery = filters
      .map(({ column, value }) =>
        partialMatchColumns.indexOf(column) !== -1
          ? `( ?? ? %?% )`
          : `( ?? ? ? )`
      )
      .join(' and ');

    query.joinRaw(`and ${filterQuery}`, filterParams);
  }

  if (orderings.length) {
    const orderingParams = orderings.reduce(
      (acc, { column, direction }) =>
        acc.concat([`${tableName}.${column}`, `${direction}`]),
      []
    );

    const orderingsQuery = orderings
      .map(({ column, direction }) => '?? ?')
      .join(', ');

    query.joinRaw(`order by ${orderingsQuery}`, orderingParams);
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
