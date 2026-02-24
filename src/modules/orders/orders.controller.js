// src/modules/orders/order.controller.js

const orderService = require("./order.service");

class OrderController {

    create(req, res) {
        try {
            const order = orderService.create(req.body);
            return res.status(201).json(order);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    findAll(req, res) {
        try {
            const orders = orderService.findAll();
            return res.status(200).json(orders);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    findById(req, res) {
        try {
            const { id } = req.params;
            const order = orderService.findById(id);
            return res.status(200).json(order);
        } catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }
}

module.exports = new OrderController();