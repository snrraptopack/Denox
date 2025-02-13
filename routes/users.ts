// routes/users.ts

export async function get(context: string) {
    context.res.json({ message: "Get users endpoint" });
}

export async function post(context: string) {
    try {
        const body = await context.req.json();
        context.res.json({ message: "Create a new user", data: body }, 201);
    } catch (error) {
        context.res.json({ error: "Invalid JSON payload" }, 400);
    }
}