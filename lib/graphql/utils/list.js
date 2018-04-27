// @TODO: Support multiple operators for filtering
const partialMatchColumns = ["first_name", "last_name", "description"];

module.exports = (
  pagination,
  orderings = [],
  filters = [],
  query,
  tableName
) => {
  if (filters.length) {
    const filterParams = filters.reduce(
      (acc, { column, value }) =>
        acc.concat([`${tableName}.${column}`, `${value}`]),
      []
    );

    const filterQuery = filters
      .map(
        ({ column, value }) =>
          partialMatchColumns.indexOf(column) !== -1
            ? `( ?? like '%?%' )`
            : `( ?? = ? )`
      )
      .join(" and ");

    query.joinRaw(`and ${filterQuery}`, filterParams);
  }

  if (orderings.length) {
    const orderingParams = orderings.reduce(
      (acc, { column, direction }) =>
        acc.concat([`${tableName}.${column}`, `${direction}`]),
      []
    );

    const orderingsQuery = orderings
      .map(({ column, direction }) => "?? ?")
      .join(", ");

    query.joinRaw(`order by ${orderingsQuery}`, orderingParams);
  }

  if (pagination) {
    const { pageNumber, pageSize } = pagination;
    const offset = (pageNumber - 1) * pageSize;

    query.joinRaw("limit ?", [pageSize]);
    query.joinRaw("offset ?", [offset]);
  }

  // console.log(query.toString());

  return query;
};
