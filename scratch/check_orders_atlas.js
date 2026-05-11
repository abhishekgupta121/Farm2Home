const { MongoClient, ObjectId } = require('mongodb');

async function checkOrders() {
    const uri = "mongodb://yashvishk_db_user:kQ3YnGYLrowzWCVY@ac-whqxks9-shard-00-00.dlyvktd.mongodb.net:27017,ac-whqxks9-shard-00-01.dlyvktd.mongodb.net:27017,ac-whqxks9-shard-00-02.dlyvktd.mongodb.net:27017/farm2home?ssl=true&authSource=admin&replicaSet=atlas-fkixbp-shard-0&retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('farm2home');
        const ordersCol = db.collection('orders');
        
        const targetUserId = '69ff412fb970cdcb502b4222'; // Yash Vishwakarma
        
        const matchesStr = await ordersCol.find({ consumerId: targetUserId }).toArray();
        console.log(`Matches for ${targetUserId} as STRING:`, matchesStr.length);
        
        const matchesObj = await ordersCol.find({ consumerId: new ObjectId(targetUserId) }).toArray();
        console.log(`Matches for ${targetUserId} as OBJECTID:`, matchesObj.length);
        
        if (matchesObj.length > 0) {
            console.log('Sample Match ConsumerId Type:', typeof matchesObj[0].consumerId);
            console.log('Sample Match ConsumerId Value:', matchesObj[0].consumerId);
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
        process.exit(0);
    }
}

checkOrders();
