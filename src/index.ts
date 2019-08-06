import AppMode from "./AppMode";
import Config from "./Config";
import Logger from "./Logger";
import Server from "./Server";

// Handle unhandled errors
process.on("uncaughtException", (err) => {
	Logger.err(err);
}).on("unhandledRejection", (err) => {
	throw err;
});

// Auto receive connection every 20 minutes to avoid heroku's 30 minutes limitation.
if (Config.MODE === AppMode.PRODUCTION)
	require("heroku-self-ping")(Config.URL);

Logger.init();

// Start server
const server = new Server();
server.start();
