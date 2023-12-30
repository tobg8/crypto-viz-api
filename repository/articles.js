const handleArticlesListening = async (PB, response) => {
  console.log("articles connection opened");

  const sendInitialRecords = async () => {
    try {
      const initialRecords = await PB.collection("articles").getFullList({
        sort: "-created",
      });

      response.write(`data: ${JSON.stringify(initialRecords)}\n\n`);
    } catch (error) {
      console.error("Error fetching initial records:", error);
    }
  };

  await sendInitialRecords();

  const subscriptionCallback = (e) => {
    const record = e.record;

    const article = {
      id: record?.id,
      collectionName: record?.collectionName,
      kind: record?.kind,
      currencies: record?.currencies,
      source: record?.source,
      title: record?.title,
      url: record?.url,
      created: record?.created,
      updated: record?.updated,
    };
    response.write(`data: ${JSON.stringify([article])}\n\n`); // Envoie un tableau avec un seul élément
  };

  PB.collection("articles").subscribe("*", subscriptionCallback);

  const closeListener = () => {
    console.log("articles connection closed");
    PB.collection("articles").unsubscribe("*", subscriptionCallback);
  };

  response.on("close", closeListener);
  response.on("error", (err) => {
    console.error("SSE response error:", err);
    PB.collection("articles").unsubscribe("*", subscriptionCallback);
  });
};

export default { handleArticlesListening };
