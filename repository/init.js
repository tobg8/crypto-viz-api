import PocketBase from 'pocketbase';

const createPocketBaseClient = () => {
  return new PocketBase(process.env.POCKETBASE_URL);
};

const createHeaders = () => {
  return {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
};

export default {
  createPocketBaseClient,
  createHeaders
}