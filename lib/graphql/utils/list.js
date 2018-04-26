module.exports = (pagination, orderings, filters, query, tableName) => {
  query.joinRaw(`where ${tableName}.deleted_at is null`);

  if (filters.length) {
    const filterQuery = filters
      .map(
        ({ column, value }) => `( ${tableName}.${column} like '%${value}%' )`
      )
      .join(" and ");

    query.joinRaw(`and ${filterQuery}`);
  }

  if (orderings.length) {
    const orderingsQuery = orderings
      .map(({ column, direction }) => `${tableName}.${column} ${direction}`)
      .join(", ");

    query.joinRaw(`order by ${orderingsQuery}`);
  }

  if (pagination) {
    const { pageNumber, pageSize } = pagination;

    query.joinRaw(`limit ${pageSize}`);
    query.joinRaw(`offset ${(pageNumber - 1) * pageSize}`);
  }

  // console.log(query.toString());
  return query;
};
