const MongoClient = require('mongodb').MongoClient;
const config = require('../config/config');
var dbServerUri = `mongodb://${config.dbHOST}:${config.dbPORT}/`
var _db;

module.exports = {
    connectToServer : async (callback) => {
        try {
            MongoClient.connect(dbServerUri, {useNewUrlParser : true}, (err, db) =>{
                console.log(`Database connected at port ${config.dbPORT}`);
                _db = db.db(config.dbName);
                return callback(err);
            });
        }
        catch (e){
            throw e;
        }
    },

    getDB : () =>{
        return _db;
    },

    disconnectDB : () => {
        _db.close();
    }
}