### Recap of the project:
1- app > create server (server.js) > (morgan package) > (envfile to save the important credentials)
       > middleware of error
    app > for middleware only
    server.js > Run the app
2- Connect to the database > config
  config > function that connects to the database (config/connectDb.js)
# E-Commerce API

3- Create model (model/product.js) > create the blueprint of schema that I would validate the collection on
> make table > `const Product = mongoose.model('Product', productSchema);` > Product (the model I will use and I will export to Controllers)
4- Export the `Product` in controllers >
> (controllers/product.js) is responsible for the functions of the CRUD
This is a RESTful API for a basic e-commerce platform built with Node.js, Express, and MongoDB.

5- Now we have the functions in controllers > go to the routes
6- Call middleware of the router
## Project Structure
```
.
├── app.js              # Express app configuration (middleware, routes)
├── server.js           # Server entry point (connects to DB, starts the server)
├── package.json        # Project dependencies and scripts
├── .env                # Environment variables (DB_URI, PORT, etc.)
├── config/
│   └── connectDb.js    # Database connection logic
├── controllers/
│   └── products.js     # Business logic for product-related operations (CRUD)
├── models/
│   └── product.js      # Mongoose schema and model for products
├── routes/
│   └── products.js     # API routes for the /products endpoint
└── views/
    └── err.html        # Generic error page for unhandled routes
```

## Progress So Far

### Cases to be handled:
---------------------------
The project is set up with a modular structure, separating concerns into different directories (routes, controllers, models).

>> Errors should all have the same blueprint
>> Handle try and catch for all the functions (promises)
>> getAllProduct: handles the utils: filter, search, select specific fields, pagination
>> Authentication 
1.  **Server Setup**: The main server is configured in `app.js` and started in `server.js`. It uses:
    *   `express` as the web framework.
    *   `morgan` for HTTP request logging in development.
    *   `dotenv` to manage environment variables securely.
    *   `express.json()` middleware to parse JSON request bodies.

2.  **Database Connection**: A dedicated function in `config/connectDb.js` handles the connection to the MongoDB database using `mongoose`.

3.  **Product Model**: The `models/product.js` file defines the `productSchema` with fields like `name`, `price`, `category`, etc., including validation rules. It also compiles this schema into a Mongoose model.

4.  **API Endpoints (CRUD)**: The core CRUD (Create, Read, Update, Delete) functionality for products has been implemented:
    *   **Routes**: Defined in `routes/products.js`, mapping HTTP methods and URL paths to specific controller functions.
    *   **Controllers**: The logic for each route is in `controllers/products.js`. This includes functions to get all products, get a single product, add, update, and delete products (both hard and soft delete).

5.  **Error Handling**: Basic `try...catch` blocks are used in controller functions to handle errors and send appropriate JSON responses. A fallback middleware in `app.js` serves a static HTML error page for unhandled routes.

## Next Steps / Cases to Handle

*   **Centralized Error Handling**: Implement a global error handling middleware to avoid repetitive `try...catch` blocks and create a consistent error response format.
*   **Advanced Querying**: Enhance the `GetAllProducts` function to support filtering, sorting, field selection, and pagination via query parameters.
*   **Authentication & Authorization**: Add user authentication (e.g., with JWT) and authorization to protect routes.
*   **Input Validation**: Add a robust validation layer (e.g., using a library like `joi` or `express-validator`) before the controller logic is executed.
