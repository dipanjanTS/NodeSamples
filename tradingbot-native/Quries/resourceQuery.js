const addResource = async (resources,resource) => {
    try{
        const results = await resources.insertOne(resource);
        return results.ops[0];
    }
    catch (e){
        return e;
    }
}

const findResourcesByName = async (resources, uName) => {
    var lowercasedUname = uName.toLowerCase();
    try{
        const result = await resources.findOne({username : lowercasedUname});
        return result;
    }
    catch (e){
        return e;
    }
}

module.exports = {addResource,findResourcesByName};