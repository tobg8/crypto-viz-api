
const getCurrencies = async (PB) => {
  const initialRecords = await PB.collection('currency').getFullList({ sort: '-created' });
  return initialRecords
}

const getCurrencyIDBySymbol = async (PB, symbol) => {
  try {
    const initialRecords = await PB.collection('currency').getFullList({ sort: '-created', filter:`symbol = '${symbol}'`});
    return initialRecords[0]?.id || "b2tcsymh4sr503g"
 } catch (error) {
  
 }
}

const handleListingsListening = async (PB, response) => {
  console.log("listings connection opened");

  try {
    // Fetch all listings
    const allListings = await PB.collection("listing").getFullList({
      sort: "-created",
    });

    const currencyListingMap = new Map();
    allListings.forEach((listing) => {
      if (listing.currency_id) {
        const existingListing = currencyListingMap.get(listing.currency_id);

        if (!existingListing || listing.created > existingListing.created) {
          currencyListingMap.set(listing.currency_id, listing);
        }
      }
    });

    const sendInitialRecords = async () => {
      const initialData = Array.from(currencyListingMap.values()).sort(
        (a, b) => a.market_cap_rank - b.market_cap_rank
      );
      response.write(`data: ${JSON.stringify(initialData)}\n\n`);
    };
    await sendInitialRecords();


    let buffer = []; // Buffer to store records to be sent after 3 minutes
    const sendBufferedRecords = () => {
      if (buffer.length > 0) {
        response.write(`data: ${JSON.stringify(buffer)}\n\n`);
        buffer = []; // Clear the buffer after sending
      }
    };

    const subscriptionCallback = (e) => {
      const listing = {
        id: e.record.id,
        collectionName: e.record.collectionName,
        current_price: e.record.current_price,
        market_cap: e.record.market_cap,
        market_cap_rank: e.record.market_cap_rank,
        fully_diluted_valuation: e.record.fully_diluted_valuation,
        total_volume: e.record.total_volume,
        high_24h: e.record.high24h,
        low_24h: e.record.low_24h,
        price_change_24h: e.record.price_change_24h,
        price_change_percentage: e.record.price_change_percentage,
        circulating_supply: e.record.circulating_supply,
        total_supply: e.record.total_supply,
        max_supply: e.record.max_supply,
        ath: e.record.ath,
        ath_change_percentage: e.record.ath_change_percentage,
        ath_date: e.record.ath_date,
        atl: e.record.atl,
        atl_change_percentage: e.record.atl_change_percentage,
        atl_date: e.record.atl_date,
        currency_id: e.record.currency_id,
        created: e.record.created,
        updated: e.record.updated,
      };
      buffer.push(listing)
    };

    PB.collection("listing").subscribe("*", subscriptionCallback);
    const intervalID = setInterval(sendBufferedRecords, 1 * 10 * 1000);

    const closeListener = () => {
      console.log("listings connection closed");
      PB.collection("listing").unsubscribe("*", subscriptionCallback);
      clearInterval(intervalID);
      buffer = []
    };

    response.on("close", closeListener);
    response.on("error", (err) => {
      console.error("SSE response error:", err);
      PB.collection("listing").unsubscribe("*", subscriptionCallback);
      handleListingsListening(pb, response)
    });
  } catch (error) {
    // Handle errors
    console.error("Error fetching data on listings:", error);
  }
};

export default {
  getCurrencies,
  handleListingsListening,
  getCurrencyIDBySymbol
};
