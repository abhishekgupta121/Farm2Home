const mongoose = require('mongoose');
require('./lib/models/Order'); // Register model

async function testApiLogic() {
    const uri = "mongodb://yashvishk_db_user:kQ3YnGYLrowzWCVY@ac-whqxks9-shard-00-00.dlyvktd.mongodb.net:27017,ac-whqxks9-shard-00-01.dlyvktd.mongodb.net:27017,ac-whqxks9-shard-00-02.dlyvktd.mongodb.net:27017/farm2home?ssl=true&authSource=admin&replicaSet=atlas-fkixbp-shard-0&retryWrites=true&w=majority";
    try {
        await mongoose.connect(uri);
        const Order = mongoose.model('Order');
        const userId = '69ff412fb970cdcb502b4222';
        
        const orders = await Order.find({ consumerId: new mongoose.Types.ObjectId(userId) })
            .populate("items.productId", "cropName pricePerKg")
            .populate("items.farmerId", "name farmName address mobileNumber")
            .sort({ createdAt: -1 });
            
        console.log('RESULTS_COUNT:', orders.length);
        if (orders.length > 0) {
            console.log('FIRST_ORDER_JSON:', JSON.stringify(orders[0], null, 2));
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testApiLogic();
