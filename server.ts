// server.ts
import MiniFramework from "./main.ts";

const app = new MiniFramework();


// Load routes from the 'routes' directory
await app.loadRoutesFromDir("./routes");

// Start the server on port 3000
await app.listen(3000);