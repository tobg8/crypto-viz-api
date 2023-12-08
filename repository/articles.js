const handleArticlesListening = async (PB, response) => {
  console.log("articles connection opened");

  const sendInitialRecords = async () => {
    const initialRecords = await PB.collection('articles').getFullList({ sort: '-created' });
    initialRecords.forEach((e) => response.write(`data: ${JSON.stringify(e)}\n\n`));
  };

  await sendInitialRecords();

  const subscriptionCallback = (e) => {
    console.log(e.record);
    const article = {
      id: e.record.id,
      collectionName: e.record.collectionName,
      kind: e.record.kind,
      currencies: e.record.currencies,
      source: e.record.source,
      title: e.record.title,
      url: e.record.url,
      created: e.record.created,
      updated: e.record.updated,
    };
    response.write(`data: ${JSON.stringify(article)}\n\n`);
  };

  PB.collection('articles').subscribe('*', subscriptionCallback);

  const closeListener = () => {
    console.log("articles connection closed");
    PB.collection('articles').unsubscribe('*', subscriptionCallback);
  };

  response.on('close', closeListener);
  response.on('error', (err) => {
    console.error("SSE response error:", err);
    PB.collection('articles').unsubscribe('*', subscriptionCallback);
  });
};

export default { handleArticlesListening };