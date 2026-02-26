const bcrypt = require("bcrypt")

const jwt = require("jsonwebtoken")

const secret_key = 'Janaina';

const prisma = require('../../database/prisma')

exports.login = (username, password) => {
    const user = prisma.user.findUnique({
    where: {
        username: username
    }
    })

    const passwordIsvalid = bcrypt.compareSync

    return jwt.sign({id: user.id, name: user.name}, secret_key,{expiresIn:"3h"})

}

