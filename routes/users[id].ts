import {Context} from "../main.ts";

export async function get(ctx: Context){
    const { id } = ctx.params;
    ctx.res.json({
        message: `User details for ID: ${id}`,
        userId: id
    });
}