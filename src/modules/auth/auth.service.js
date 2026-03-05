const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secret_key = 'Janaina';

const prisma = require('../../database/prisma');

async function login(email, senha) {
    try {
        const user = await prisma.usuarios.findUnique({
            where: { email: email }
        });
        console.log(email);

        if (!user) {
            throw new Error("email inválido!");
        }

        const passwordIsValid = bcrypt.compareSync(senha, user.senha);

        if (!passwordIsValid) {
            throw new Error("senha inválida!");
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            secret_key,
            { expiresIn: "3h" }
        );

        return {
            message: "login bem sucedido",
            user,
            token: token
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = login;
