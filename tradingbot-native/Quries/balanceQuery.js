
const addBalance = async (balances,balance) => {
    try{
        const results = await balances.insertOne(balance);
        return results.ops[0];
    }
    catch (e){
        return e;
    }
}

const findBalanceByName = async (balances, uName) => {
    var lowercasedUname = uName.toLowerCase();
    try{
        const result = await balances.findOne({username : lowercasedUname});
        return result;
    }
    catch (e){
        return e;
    }
}

module.exports = {addBalance,findBalanceByName};