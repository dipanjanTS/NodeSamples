//user index.js
const ObjectID = require('mongodb').ObjectID

const createUser = async (users,user) => {
    //here users is collection
    try {
        const results = await users.insertOne(user);
        return results.ops[0];
    }
    catch (e){
        throw e;
    }
}


const finduserByName = async (users, uName) => {
    //here users is collection
    var lowercasedUname = await uName.toLowerCase();
    try {
        const results = await users.findOne({
            _userName : lowercasedUname
        });
        return results;
    }
    catch (e){
        throw e;
    }
}

module.exports = {createUser,finduserByName};

// other samples for queries

/*

 const getUsers = async (users) => {
     try {
         const results = await users.find().toArray()
         return results
     } catch (e) {
         throw e
     }
 }

 const findUserById = async (users, id) => {
     try {
         if (!ObjectID.isValid(id)) throw 'Invalid MongoDB ID.'
         const results = await users.findOne(ObjectID(id))
         return results
     } catch (e) {
         throw e
     }
 }

*/