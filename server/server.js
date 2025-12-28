import configuration from "./config.js";

import express from "express";

const app = express();
app.listen(configuration.PORT, function(){
    console.log(`Server Running on PORT: ${ configuration.PORT }`);
})


//handle wrong requests
app.use(function (req, res){
    res.status(404).json({ "message": "Not a Valid Route ~!"  })
})

