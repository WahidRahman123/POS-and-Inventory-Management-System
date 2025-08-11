if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 4000;

app.use('/', (req, res) => {
    res.json({
        message: "Hello World"
    })
})

app.listen(port, () => {
    console.log(`LISTENING TO THE PORT ${port}`);
})