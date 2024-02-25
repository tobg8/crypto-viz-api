import init from "../repository/init.js";
import repository from "../repository/prices.js";

const getPrices = async (req, response) => {
  const { symbol, chartType, range } = req.params;

  if (!symbol || !chartType || !range) {
    return response.status(400).send("need symbol, chartype and range")
  }
  const PB = init.createPocketBaseClient();
  const headers = init.createHeaders();
  response.writeHead(200, headers);

  const rangeInt = parseInt(range, 10)
  let defaultRange = "1D"
  if (rangeInt === 1) {
    defaultRange = "1D"
  }

  if (rangeInt > 1 && rangeInt < 90) {
    defaultRange = "90D"
  }

  if (rangeInt > 90) {
    defaultRange = "ALL"
  }

 
  await repository.handlePricesListening(PB, response, symbol, defaultRange, range);

};

const getOhlc = async (req, response) => {
  const { symbol, chartType, range } = req.params;

  if (!symbol || !chartType || !range) {
    return response.status(400).send("need symbol, chartype and range")
  }
  const PB = init.createPocketBaseClient();
  const headers = init.createHeaders();
  response.writeHead(200, headers);

  const rangeInt = parseInt(range, 10)
  let defaultRange = "1D"
  if (rangeInt === 1) {
    defaultRange = "1D"
  }

  if (rangeInt > 1 && rangeInt < 90) {
    defaultRange = "90D"
  }

  if (rangeInt > 90) {
    defaultRange = "ALL"
  }

  
  await repository.handleOhlcListening(PB, response, symbol, defaultRange, range)
 
};

export default {
  getPrices,
  getOhlc
};
