// require("dotenv").config();
// const { createClient } = require("redis");

// const client = createClient({
//   username: process.env.REDIS_USERNAME,
//   password: process.env.REDIS_PASSWORD,
//   socket: {
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//   },
// });

// client.on("error", (err) => {
//   console.log("Redis Error:", err);
// });

// (async () => {
//   try {
//     await client.connect();
//     console.log("*** Redis Connected ***");
//   } catch (err) {
//     console.error("Redis Connection Failed:", err);
//   }
// })();

// module.exports = client;
