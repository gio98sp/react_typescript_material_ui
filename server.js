// JSON Server module
import * as jsonServer from 'json-server'

const server = jsonServer.create();
const router = jsonServer.router('mock/database.json');
// const middlewares = jsonServer.defaults();

// server.use(middlewares);
// Add this before server.use(router)
// server.use(
//   // Add custom route here if needed
//   jsonServer.rewriter({
//     '/*': '/$1',
//   })
// );
server.use(router);
server.listen(3333, () => {
  console.log('JSON Server is running');
});

// Export the Server API
export {server} 
