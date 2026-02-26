const userService = require ("../auth/auth.service")

exports.login = (request, response) => {
    const {username, password} = request.body
    const result = userService.login(username, password)
    response.json(result)
}