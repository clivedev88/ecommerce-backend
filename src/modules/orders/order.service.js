let currentId = 1;
const orders = [];

class OrderService {
    create(data) {
        const newOrder = {
            id: currentId++,
            user_id: data.user_id,
            status: data.status || "pending",
            valor_total: data.valor_total || 0,
            logradouro: data.logradouro,
            numero: data.numero,
            bairro: data.bairro,
            cidade: data.cidade,
            estado: data.estado,
            cep: data.cep,
            created_at: new Date()
        };
        orders.push(newOrder);
        return newOrder;
    }

    findAll() {
        return orders;
    }

    findById(id) {
        return orders.find(order => order.id === parseInt(id)) || null;
    }

    update(id, data) {
        const order = this.findById(id);
        if (!order) return null;
        Object.assign(order, data);
        return order;
    }

    delete(id) {
        const index = orders.findIndex(order => order.id === parseInt(id));
        if (index === -1) return false;
        orders.splice(index, 1);
        return true;
    }
}

module.exports = new OrderService();