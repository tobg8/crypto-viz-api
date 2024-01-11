import init from "../repository/init.js";
import repository from "../repository/currencies.js"

const getCurrencies = async (_, response) => {
  const PB = init.createPocketBaseClient();
  const currencies = await repository.getCurrencies(PB)
  return response.status(200).json(currencies)
};

const getListings = async (_, response) => {
  const PB = init.createPocketBaseClient();
  const headers = init.createHeaders();
  response.writeHead(200, headers);

  await repository.handleListingsListening(PB, response);
}

export default {
  getCurrencies,
  getListings
};