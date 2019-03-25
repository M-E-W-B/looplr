module.exports = async (pagination, query) => {
  if (!pagination) return null;

  const { pageSize, pageNumber } = pagination;
  const [{ totalCount }] = await query.clearSelect().count(`id AS totalCount`);

  const totalPages = Math.ceil(totalCount / pageSize);
  const hasPreviousPage = pageNumber > 1;
  const hasNextPage = totalPages > pageNumber;

  return {
    totalPages,
    hasPreviousPage,
    hasNextPage,
    totalCount
  };
};
