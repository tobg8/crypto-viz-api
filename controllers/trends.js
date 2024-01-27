import repository from "../repository/trends.js";

const getCurrencies = async (_, response) => {
  const trendsCurrencies = await repository.getTrends()
  if (trendsCurrencies.length === 0) {
    return response.status(400).json([])
  }

  return response.status(200).send(trendsCurrencies)
};

export default {
  getCurrencies,
};
