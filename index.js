//Författare Filip Dennryd

const express = require("express");
const app = express();
const indexRoutes = require("./routes/indexRoutes.js");


const port = 1337;


app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");



app.use(indexRoutes);

app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});


