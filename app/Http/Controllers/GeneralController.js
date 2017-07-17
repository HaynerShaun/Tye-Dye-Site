'use strict'

const Database = use('Database')

class GeneralController {

    /*
        home sends users to the home page
    */

    * home (request, response) { 
        const role = request.currentUser.role
        yield response.sendView('home', { role }) 
    }

    //--------------------------------------------------------------------------

    /*
        profile sends users to the profile page
    */

    * profile (request, response) { 
        const role = request.currentUser.role
        yield response.sendView('profile', { role }) 
    }

    //--------------------------------------------------------------------------

    /*
        edit allows users to update their profile information
    */

    * edit (request, response) {
        const email = request.input('email')
        const display_name = request.input('display_name')
        const first_name = request.input('first_name')
        const last_name = request.input('last_name')

        const affectedRows = yield Database
            .table('users')
            .where({ id: request.currentUser.id })
            .update({ email: email, 
                    display_name: display_name, 
                    first_name: first_name, 
                    last_name: last_name 
                })

        yield request.session.put({ email: email })
        yield request.session.put({ display_name: display_name })
        yield request.session.put({ first_name: first_name })
        yield request.session.put({ last_name: last_name })

        return response.redirect('profile')
    }

    //--------------------------------------------------------------------------

    /*
        custOrders queries the database and shows the user all their current and
        previous orders
    */

    * custOrders (request, response) { 
        const role = request.currentUser.role

        const order_list = yield Database
            .select('display_name', 'size', 'design', 'status', 'orders.id as id', 'orders.created_at as created_at')
            .from('orders')
            .join('users', 'orders.user_id', 'users.id')
            .orderBy('created_at', 'asc')
            .where({ user_id: request.currentUser.id })

        var orders = [];

        for(var i = 0; i < order_list.length; i++){

            const order_colors = yield Database
                .select('color')
                .from('details')
                .where({ order_id: order_list[i].id })
            
            var colors = [];
            for(var j = 0; j < order_colors.length; j++){
                colors.push(order_colors[j].color);
            }

            var order = {
                id: order_list[i].id, 
                display_name: order_list[i].display_name, 
                size: order_list[i].size, 
                design: order_list[i].design,
                status: order_list[i].status,
                created_at: order_list[i].created_at,
                colors: colors};
            orders.push(order);
        }

        yield response.sendView('custOrders', { orders, role }) 
    }

    //--------------------------------------------------------------------------

    /*
        colors allows users to view all the colors available and make requests 
        for colors that are not in the database
    */

    * colors (request, response) { 
        const role = request.currentUser.role
        const colors = yield Database
            .from('colors')

        const user = yield Database
            .select('color_code')
            .from('requests')
            .join('colors', 'requests.color_id', 'colors.id')
            .where({ user_id: request.currentUser.id })
        
        var requests = [];

        for(var i = 0; i < user.length; i++){
            requests.push(user[i].color_code);
        }

        yield response.sendView('colors', { colors, role, requests }) 
    }
}

module.exports = GeneralController
