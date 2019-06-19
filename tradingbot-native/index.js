const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/config');
const userRouter = require('./Routers/userRouter');
const balanceRouter = require('./Routers/balanceRouter');
const resourceRouter = require('./Routers/resourceRouter');
const portfolioRouter = require('./Routers/portfolioRouter');
const botRouter = require('./Routers/botRouter');
const mongoUtils = require('./MongoConnection/mongoUtils');
const app = express();


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use('/api/user',userRouter);
app.use('/api/balance',balanceRouter);
app.use('/api/resource',resourceRouter);
app.use('/api/portfolio',portfolioRouter);
app.use('/api/bot',botRouter);

// Mongo connection
mongoUtils.connectToServer(async(err) => {
  if(err) throw err;

});

app.listen(config.PORT, config.HOST, (err, res)=>{
  if (err) throw err;
  console.log(`Server up at ${config.HOST} on port ${config.PORT}`);
});