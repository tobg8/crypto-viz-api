import init from "../repository/init.js";
import repository from "../repository/articles.js";

const getArticles = async (_, response) => {
  const PB = init.createPocketBaseClient();
  const headers = init.createHeaders();
  response.writeHead(200, headers);

  await repository.handleArticlesListening(PB, response);
};

export default {
  getArticles,
};
