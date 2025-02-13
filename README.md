# Project Overview

This project is a simple TypeScript-based web server with various file based routes to handle different HTTP requests. The project includes routes for handling user and product data.

## Project Structure

- `main.ts`: Contains the `Context` and `Response` interfaces.
- `routes/index.ts`: Handles the root route.
- `routes/products.ts`: Handles product-related routes.
- `routes/users.ts`: Handles user-related routes.
- `routes/users[id].ts`: Handles user-specific routes.

## Getting Started

### Prerequisites

- Node.js
- Deno (if using Deno runtime)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-repo/project-name.git
    cd project-name
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

### Running the Server

To start the server, run:
```sh
deno run --allow-net main.ts
```

### Usage

#### Root Route

- **GET** `/`
    ```sh
    curl http://localhost:8000/
    ```
  Response:
    ```json
    {
        "message": "Hello World"
    }
    ```

#### Products Route

- **GET** `/products`
    ```sh
    curl http://localhost:8000/products
    ```
  Response:
    ```json
    [
        { "id": 1, "name": "Product A", "price": 10 },
        { "id": 2, "name": "Product B", "price": 20 }
    ]
    ```

#### Users Route

- **GET** `/users`
    ```sh
    curl http://localhost:8000/users
    ```
  Response:
    ```json
    {
        "message": "Get users endpoint"
    }
    ```

- **POST** `/users`
    ```sh
    curl -X POST -H "Content-Type: application/json" -d '{"name": "John Doe"}' http://localhost:8000/users
    ```
  Response:
    ```json
    {
        "message": "Create a new user",
        "data": { "name": "John Doe" }
    }
    ```

#### User Details Route

- **GET** `/users/:id`
    ```sh
    curl http://localhost:8000/users/1
    ```
  Response:
    ```json
    {
        "message": "User details for ID: 1",
        "userId": 1
    }
    ```

## License

This project is licensed under the MIT License.