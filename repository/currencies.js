const getCurrencies = async (PB) => {
  const initialRecords = await PB.collection('currencies').getFullList({ sort: '-created' });
  return initialRecords
}