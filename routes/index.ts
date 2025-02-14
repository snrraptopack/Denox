// routes/index.ts
import {Context} from "../main.ts"

export async function get(context: Context) {
    context.res.html("<h1>Welcome to MiniFramework</h1>");
}