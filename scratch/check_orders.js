const mongoose = require('mongoose');

async function checkOrders() {
    try {
        await mongoose.connect('mongodb://localhost:27017/farm2home');
        const Order = mongoose.connection.collection('orders');
        const userId = '6a0069bf83f43201a9e25dfc';
        
        const allOrders = await Order.find({}).toArray();
        console.log('ALL_ORDERS_COUNT:', allOrders.length);
        
        const userOrders = await Order.find({ consumerId: new mongoose.Types.ObjectId(userId) }).toArray();
        console.log('USER_ORDERS_COUNT:', userOrders.length);
        
        const userOrdersString = await Order.find({ consumerId: userId }).toArray();
        console.log('USER_ORDERS_STRING_COUNT:', userOrdersString.length);

        console.log('FIRST_ORDER_SAMPLE:', JSON.stringify(allOrders[0], null, 2));
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkOrders();
