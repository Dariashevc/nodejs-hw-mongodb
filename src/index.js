import { setupServer } from "./server.js";
import { initMongoConnections } from "./db/initMongoConnection.js";
const boostrap = async()=> {
    await initMongoConnections();
    setupServer();
};

boostrap();