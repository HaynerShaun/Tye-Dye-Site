'use strict'

const User = use('App/Model/User')
const Database = use('Database')
const Validator = use('Validator')

class AuthController {

    //--------------------------------------------------------------------------

    /*
        index sends users to the login page
    */

    * index (request, response) { 
        yield response.sendView('login') 
    }

    //--------------------------------------------------------------------------

    /*
        register sends users to the register page
    */

    * register (request, response) { 
        yield response.sendView('register') 
    }

    //--------------------------------------------------------------------------

    /*
        create adds a new user to the database
    */

    * create (request, response) { 
        const userData = request.only('email', 'password', 'display_name', 'first_name', 'last_name')

        const rules = {
            email: 'required',
            password: 'required',
            display_name: 'required',
            first_name: 'required',
            last_name: 'required'
        }

        const validation = yield Validator.validate(userData, rules) 

        if (validation.fails()) {
            yield request
                .withOnly('email', 'password', 'display_name', 'first_name', 'last_name')
                .andWith({ errors: validation.messages() })
                .flash() 

            response.redirect('back')
            return
        }

        userData.role = "user"

        yield User.create(userData)
        response.redirect('/')
    }

    //--------------------------------------------------------------------------

    /*
        login processes the authentication for users to log into their account
    */

    * login (request, response) { 
        const userData = request.only('email', 'password') 

        const rules = {
            email: 'required',
            password: 'required'
        }

        const validation = yield Validator.validate(userData, rules) 

        if (validation.fails()) {
            yield request
            .withOnly('email', 'password')
            .andWith({ errors: validation.messages() })
            .flash() 

            response.redirect('back')
            return
        }

        const loginError = 'Invalid Credentials'

        try {
            const authCheck = yield request.auth.attempt(userData.email, userData.password)
            if (authCheck) {
                const current = yield Database.from('users').where({ email: userData.email })
                yield request.session.put({ id: current.id })
                yield request.session.put({ email: current.email })
                yield request.session.put({ display_name: current.display_name })
                yield request.session.put({ first_name: current.first_name })
                yield request.session.put({ last_name: current.last_name })
                yield request.session.put({ role: current.role })
                return response.redirect('home')
            }
        } catch (e) {
            yield response.sendView('login', { loginError })
        }
    }

    //--------------------------------------------------------------------------

    /*
        logout logs a user out of their account and redirects to the login page
    */

    * logout(request, response) {
        yield request.auth.logout()
        return response.redirect('/')
    }

    //--------------------------------------------------------------------------

    /*
        delete deletes a user from the database
    */

    * delete (request, response) { 

        const affectedRows = yield Database
            .table('users')
            .where({ email: request.currentUser.email })
            .delete()

        yield request.auth.logout()
        response.redirect('/')
    }

}

module.exports = AuthController
