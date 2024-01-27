import axios from "axios"

const getTrends = async () => {
  const url = "https://api.coingecko.com/api/v3/search/trending"

  const response = await axios.get(url)

  if (response.status === 200) {
    return response.data
  } else {
    return []
  }
}

export default { getTrends };