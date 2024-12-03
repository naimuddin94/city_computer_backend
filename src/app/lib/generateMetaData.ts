const generateMetaData = (
  totalDataLength: number,
  page: number,
  limit: number
) => {
  return {
    page,
    limit,
    total: totalDataLength,
    totalPages: Math.ceil(totalDataLength / limit),
  };
};

export default generateMetaData;
