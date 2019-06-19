const addPortfolio = async (portfolios,portfolio) => {
    try{
        const results = await portfolios.insertOne(portfolio);
        return results.ops[0];
    }
    catch (e){
        return e;
    }
}

const findPortfolioByName = async (portfolios, uName) => {
    var lowercasedUname = uName.toLowerCase();
    try{
        const result = await portfolios.findOne({username : lowercasedUname});
        return result;
    }
    catch (e){
        return e;
    }
}

module.exports = {addPortfolio,findPortfolioByName};