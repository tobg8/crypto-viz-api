import currencyRepository from './currencies.js'

const handlePricesListening = async (PB, response, symbol, defaultRange, range) => {
  console.log(`price connection opened for currency ${symbol} on range ${defaultRange}`)

  const currencyID = await currencyRepository.getCurrencyIDBySymbol(PB, symbol)

  const filter = `range = '${defaultRange}' && currency = '${currencyID}' `;

  const sendInitialRecords = async () => {
    try {
      const initialRecords = await PB.collection("prices").getFullList({
        sort: "-timestamp",
        filter: filter
      });

      response.write(`data: ${JSON.stringify(initialRecords)}\n\n`);
    } catch (error) {
      console.error("Error fetching initial records:", error);
    }
  };

  await sendInitialRecords();

  const subscriptionCallback = async (e) => {
    const record = e.record;
    const currencyID = await currencyRepository.getCurrencyIDBySymbol(PB, symbol)


    if (record.currency === currencyID && record.range === defaultRange ) {
      const currency = {
        id: record?.id,
        collectionName: record?.collectionName,
        value: record?.value,
        type: record?.type,
        range: record?.range,
        timestamp: record?.timestamp,
        currency_id: record?.currency,
        created: record?.created,
        updated: record?.updated,
      };
      response.write(`data: ${JSON.stringify([currency])}\n\n`); // Envoie un tableau avec un seul élément
    }
  };

  PB.collection("prices").subscribe("*", subscriptionCallback);

  const closeListener = () => {
    console.log("prices connection closed");
    PB.collection("prices").unsubscribe("*", subscriptionCallback);
  };

  response.on("close", closeListener);
  response.on("error", (err) => {
    console.error("SSE response error:", err);
    PB.collection("prices").unsubscribe("*", subscriptionCallback);
  });
};

const handleOhlcListening = async (PB, response, symbol, defaultRange, range) => {
  console.log(`ohlc connection opened for currency ${symbol} on range ${defaultRange}`)

  const currencyID = await currencyRepository.getCurrencyIDBySymbol(PB, symbol)

  const filter = `range = '${defaultRange}' && currency = '${currencyID}' `;
  PB.autoCancellation(false);
  const sendInitialRecords = async () => {
    console.log(filter)
    try {
      const initialRecords = await PB.collection("ohlc").getFullList({
        sort: "-timestamp",
        filter: filter
      });

      response.write(`data: ${JSON.stringify(initialRecords)}\n\n`);
    } catch (error) {
      console.error("Error fetching initial records:", error);
    }
  };

  await sendInitialRecords();

  const subscriptionCallback = async (e) => {
    const record = e.record;
    const currencyID = await currencyRepository.getCurrencyIDBySymbol(PB, symbol)


    if (record.currency === currencyID && record.range === defaultRange ) {
      const ohlc = {
        id: record?.id,
        collectionName: record?.collectionName,
        open: record?.open,
        high: record?.high,
        low: record?.low,
        close: record?.close,
        type: "ohlc",
        range: record?.range,
        timestamp: record?.timestamp,
        currency_id: record?.currency,
        created: record?.created,
        updated: record?.updated,
      };
      response.write(`data: ${JSON.stringify([ohlc])}\n\n`); // Envoie un tableau avec un seul élément
    }
  };

  PB.collection("ohlc").subscribe("*", subscriptionCallback);

  const closeListener = () => {
    console.log("ohlc connection closed");
    PB.collection("ohlc").unsubscribe("*", subscriptionCallback);
  };

  response.on("close", closeListener);
  response.on("error", (err) => {
    console.error("SSE response error:", err);
    PB.collection("ohlc").unsubscribe("*", subscriptionCallback);
  });
};

export default { handlePricesListening, handleOhlcListening};
