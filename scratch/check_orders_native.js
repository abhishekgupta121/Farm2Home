const { MongoClient, ObjectId } = require('mongodb');

async function checkOrders() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('farm2home');
        const ordersCol = db.collection('orders');
        
        const allOrders = await ordersCol.find({}).toArray();
        console.log('--- DB AUDIT ---');
        console.log('Total orders in DB:', allOrders.length);
        
        if (allOrders.length > 0) {
            console.log('Sample Order 0 ConsumerId type:', typeof allOrders[0].consumerId);
            console.log('Sample Order 0 ConsumerId value:', allOrders[0].consumerId);
            
            const firstConsumerId = allOrders[0].consumerId;
            const filterByObj = { consumerId: firstConsumerId };
            const matchesObj = await ordersCol.find(filterByObj).toArray();
            console.log(`Matches by direct ID (${firstConsumerId}):`, matchesObj.length);
        }
        
        // Check for specific user ID from logs
        const targetUserId = '6a0069bf83f43201a9e25dfc';
        const matchesTargetStr = await ordersCol.find({ consumerId: targetUserId }).toArray();
        console.log(`Matches for ${targetUserId} (string):`, matchesTargetStr.length);
        
        try {
            const matchesTargetObj = await ordersCol.find({ consumerId: new ObjectId(targetUserId) }).toArray();
            console.log(`Matches for ${targetUserId} (ObjectId):`, matchesTargetObj.length);
        } catch (e) {}

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
        process.exit(0);
    }
}

checkOrders();
