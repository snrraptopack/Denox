// routes/index.ts
import {Context} from "../main.ts"

export async function get(context: Context) {
    context.res.send("Hello World",200);
}