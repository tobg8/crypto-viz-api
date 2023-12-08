import init from "../repository/init.js";

const getCurrencies = async (_, response) => {
  const PB = init.createPocketBaseClient();
  const currencies = await PB.collection('currency').getFullList({ sort: '-created' });
  return response.status(200).json(currencies)
};

export default {
  getCurrencies
};