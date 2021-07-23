const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "http://localhost:6069"
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");
db.sequelize.sync();

require("./routes/Chat")(app);

const PORT = process.env.PORT || 6069;
app.listen(PORT, () => {
  console.log(`Server is using PORT: ${PORT}.`);
});