const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const prisma = require("../../database/prisma")

exports.login = (username, password) => {
    const user = prisma.user.findUnique({
        where: {
            username: username
        }
    })

}