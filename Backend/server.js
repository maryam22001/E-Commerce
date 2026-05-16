const app = require('./app.js');
const connectDB = require('./config/connectDB.js');
const port = process.env.PORT || 8080;
connectDB();
app.set("query parser", "extended")
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
