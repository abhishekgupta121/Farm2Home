const { MongoClient, ObjectId } = require('mongodb');

async function checkUser() {
    const uri = "mongodb://yashvishk_db_user:kQ3YnGYLrowzWCVY@ac-whqxks9-shard-00-00.dlyvktd.mongodb.net:27017,ac-whqxks9-shard-00-01.dlyvktd.mongodb.net:27017,ac-whqxks9-shard-00-02.dlyvktd.mongodb.net:27017/farm2home?ssl=true&authSource=admin&replicaSet=atlas-fkixbp-shard-0&retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('farm2home');
        const usersCol = db.collection('users');
        
        const targetUserId = '6a0069bf83f43201a9e25dfc';
        const user = await usersCol.findOne({ _id: new ObjectId(targetUserId) });
        console.log('USER_FOUND:', JSON.stringify(user, null, 2));

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
        process.exit(0);
    }
}

checkUser();
