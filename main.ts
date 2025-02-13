import { serve } from "https://deno.land/std@0.188.0/http/server.ts";
import * as path from "https://deno.land/std@0.188.0/path/mod.ts";
import * as fs from "https://deno.land/std@0.188.0/fs/mod.ts";

interface Response {
    status: number;
    headers: Headers;
    body: string;
    send: (body: string, status?: number) => void;
    json: (body: any, status?: number) => void;
    redirect: (url: string, status?: number) => void;
}

export interface Context {
    req: Request;
    params: Record<string, string>;
    res: Response;
}


class MiniFramework {
    private routes: { [method: string]: { [path: string]: Function } } = {};
    private middleware: Function[] = [];

    use(middleware: Function) {
        this.middleware.push(middleware);
    }

    private addRoute(method: string, path: string, handler: Function) {
        if (!this.routes[method]) {
            this.routes[method] = {};
        }
        this.routes[method][path] = handler;
    }

    private normalizePath(filepath: string): string {
        // Remove file extension
        const filename = filepath.slice(0, filepath.lastIndexOf("."));

        // Handle index routes
        if (filename === "index") {
            return "/";
        }

        // If it contains a parameter (e.g., users[id])
        const paramMatch = filename.match(/(.*?)\[(.*?)\]/);
        if (paramMatch) {
            const [_, prefix, paramName] = paramMatch;
            return `/${prefix}/:${paramName}`;
        }

        // Regular route
        return `/${filename}`;
    }

    async loadRoutesFromDir(routesDir: string) {
        try {
            for await (const entry of fs.walk(routesDir)) {
                if (entry.isFile && (entry.name.endsWith(".ts") || entry.name.endsWith(".js"))) {
                    const routePath = entry.path;
                    console.log(`\nProcessing route file: ${entry.name}`);

                    // Import the route module
                    const relativeRoutePath = "./" + path.relative(Deno.cwd(), routePath).replace(/\\/g, "/");
                    const routeModule = await import(relativeRoutePath);

                    // Generate the URL path from the file path
                    const urlPath = this.normalizePath(entry.name);
                    console.log(`  Generated URL path: ${urlPath}`);

                    // Register each exported method
                    for (const key in routeModule) {
                        if (typeof routeModule[key] === "function") {
                            const methodName = key.toUpperCase();
                            const handler = routeModule[key];
                            console.log(`  Route ${methodName} ${urlPath} loaded`);
                            this.addRoute(methodName, urlPath, handler);
                        }
                    }
                }
            }
        } catch (err) {
            console.error("Error loading routes:", err);
        }
        this.printRoutes();
    }

    private isMatch(routePath: string, requestPath: string): { matched: boolean; params: Record<string, string> } {
        const routeParts = routePath.split("/").filter(Boolean);
        const requestParts = requestPath.split("/").filter(Boolean);

        if (routeParts.length !== requestParts.length) {
            return { matched: false, params: {} };
        }

        const params: Record<string, string> = {};

        for (let i = 0; i < routeParts.length; i++) {
            const routePart = routeParts[i];
            const requestPart = requestParts[i];

            if (routePart.startsWith(":")) {
                // This is a parameter
                const paramName = routePart.substring(1);
                params[paramName] = requestPart;
            } else if (routePart !== requestPart) {
                // Static part doesn't match
                return { matched: false, params: {} };
            }
        }

        return { matched: true, params };
    }

    private async handleRequest(req: Request) {
        const url = new URL(req.url);
        const requestPath = url.pathname;
        const method = req.method;

        console.log(`\n--- Handling Request: ${method} ${requestPath} ---`);

        const methodRoutes = this.routes[method];
        if (methodRoutes) {
            for (const routePath in methodRoutes) {
                const { matched, params } = this.isMatch(routePath, requestPath);
                if (matched) {
                    console.log(`  Matched route: ${routePath}`);
                    console.log(`  Parameters:`, params);

                  const context: Context = {
                        req,
                        params,
                        res: {
                            status: 200,
                            headers: new Headers(),
                            body: "",
                            send: (body: string, status: number = 200) => {
                                context.res.body = body;
                                context.res.status = status;
                            },
                            json: (body: any, status: number = 200) => {
                                context.res.body = JSON.stringify(body);
                                context.res.status = status;
                                context.res.headers.set("Content-Type", "application/json");
                            },
                            redirect: (url: string, status: number = 302) => {
                                context.res.status = status;
                                context.res.headers.set("Location", url);
                            }
                        }
                    };
                    const handler = methodRoutes[routePath];
                    await handler(context);

                    return new Response(context.res.body, {
                        status: context.res.status,
                        headers: context.res.headers,
                    });
                }
            }
        }

        console.log("  No matching route found");
        return new Response("Not Found", { status: 404 });
    }

    async listen(port: number) {
        await serve((req) => this.handleRequest(req), { port });
        console.log(`Server listening on port ${port}`);
    }

    private printRoutes() {
        console.log("\n--- Available Routes ---");
        for (const method in this.routes) {
            for (const path in this.routes[method]) {
                console.log(`${method} ${path}`);
            }
        }
        console.log("--- End of Routes ---\n");
    }
}

export default MiniFramework;