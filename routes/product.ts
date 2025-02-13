// routes/products.ts
import {Context} from "../main.ts";

export async function get(context: Context) {
    context.res.json([
        { id: 1, name: "Product A", price: 10 },
        { id: 2, name: "Product B", price: 20 }
    ]);
}