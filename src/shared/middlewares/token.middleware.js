const jwt = require("jsonwebtoken");

function rotaProtegida(req, res, next) {
    let token = req.headers.authorization;
    if (!token) {
        res.status(401).send({
            mensagem: "Token é obrigatório"
        });
        return;
    } else {
        token = token.split(" ")[1];
        // token = jwt.sign({ foo: 'bar' }, process.env.SEGREDO);
        // console.log(token);
        
        jwt.verify(token, process.env.SEGREDO, function (err, decoded) {
            if (err) {
                res.status(401).send({
                    mensagem: "Token inválido"
                });
                return;
            }
            next();
        });
    }
}

module.exports = { rotaProtegida };