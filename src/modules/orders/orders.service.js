// src/modules/orders/order.service.js

let orders = [];
let idCounter = 1;

class OrderService {

    create(data) {
        const newOrder = {
            id: idCounter++,
            user_id: data.user_id,
            status: data.status || "PENDING",
            total_amount: data.total_amount || 0,
            created_at: new Date()
        };

        orders.push(newOrder);

        return newOrder;
    }

    findAll() {
        return orders;
    }

    findById(id) {
        const order = orders.find(order => order.id === Number(id));

        if (!order) {
            throw new Error("Order not found");
        }

        return order;
    }
}

module.exports = new OrderService();