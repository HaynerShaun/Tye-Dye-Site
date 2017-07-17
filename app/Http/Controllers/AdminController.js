'use strict'

const Database = use('Database')

class AdminController {

    //--------------------------------------------------------------------------

    /*
        orders checks if the user is an admin. 
            Non-admin: the user is directed back to the home page. 
            Admin: the database is queried for all the orders and order's colors,
                objets are built with order details and colors, and then those 
                objects are passed to the view. 
    */

    * orders (request, response) { 
        const role = request.currentUser.role

        if (role != "admin"){ response.redirect('/home') }

        const orders_list = yield Database
            .select('display_name', 'size', 'design', 'status', 'orders.id as id', 'orders.created_at as created_at')
            .from('orders')
            .join('users', 'orders.user_id', 'users.id')
            .orderBy('created_at', 'asc')

        var orders = [];

        for(var i = 0; i < orders_list.length; i++){

            const order_colors = yield Database
                .select('color')
                .from('details')
                .where({ order_id: orders_list[i].id })
            
            var colors = [];
            for(var j = 0; j < order_colors.length; j++){
                colors.push(order_colors[j].color);
            }

            var order = {
                id: orders_list[i].id, 
                display_name: orders_list[i].display_name, 
                size: orders_list[i].size, 
                design: orders_list[i].design,
                status: orders_list[i].status,
                created_at: orders_list[i].created_at,
                colors: colors};
            orders.push(order);
        }

        yield response.sendView('orders', { orders, role }) 
    }

    //--------------------------------------------------------------------------

    /*
        inventory checks if the user is an admin. 
            Non-admin: the user is directed back to the home page. 
            Admin: the database is queried for the color inventory and the 
                requests that any out of stock color has, objects are built with
                inventory details and requests, then object is passed to the view
    */

    * inventory (request, response) { 
        const role = request.currentUser.role

        if (role != "admin"){ response.redirect('/home') }

        const colors = yield Database
            .from('colors')

        var stock = [];

        for(var i = 0; i < colors.length; i++){

            const count = yield Database
                .from('requests')
                .where({ color_id: colors[i].id })
                .count('color_id as count')

            var stock_item = {
                color_id: colors[i].id,
                name: colors[i].name,
                color_code: colors[i].color_code,
                in_stock: colors[i].in_stock,
                requests: count[0].count};
            stock.push(stock_item);
        }

        yield response.sendView('inventory', { stock, role }) 
    }

    //--------------------------------------------------------------------------

    /*
        requests checks if the user is an admin. 
            Non-admin: the user is directed back to the home page. 
            Admin: the database is queried for the colors that have requests, 
                objects are built with request details and users that made the 
                requests, then object is passed to the view
    */

    * requests (request, response) { 
        const role = request.currentUser.role

        if (role != "admin"){ response.redirect('/home') }

        const colors_requested = yield Database
            .select('color_id', 'color_code', 'name')
            .from('requests')
            .join('colors', 'requests.color_id', 'colors.id')
            .distinct('color_id')

        var colors = [];

        for(var i = 0; i < colors_requested.length; i++){

            const users_per_color = yield Database
                .select('display_name')
                .from('users')
                .join('requests', 'users.id', 'requests.user_id')
                .where({ color_id: colors_requested[i].color_id })

            var user_names = [];

            for(var j = 0; j < users_per_color.length; j++){
                user_names.push(users_per_color[j].display_name);
            }

            var color = {
                color_id: colors_requested[i].color_id, 
                color_code: colors_requested[i].color_code, 
                name: colors_requested[i].name,
                users: user_names};
            colors.push(color);
        }

        yield response.sendView('requests', { colors, role }) 
    }

    //--------------------------------------------------------------------------

    /*
        process checks if the user is an admin. 
            Non-admin: the user is directed back to the home page. 
            Admin: changes an order's status from received to processing
    */

    * process (request, response) { 
        const role = request.currentUser.role

        if (role != "admin"){ response.redirect('/home') }

        const id = request.param('id')

        const affectedRows = yield Database
            .table('orders')
            .where({ id: id })
            .update('status', 'processing')

        response.redirect('/orders')
    }

    //--------------------------------------------------------------------------

    /*
        complete checks if the user is an admin. 
            Non-admin: the user is directed back to the home page. 
            Admin: changes an order's status from processing to complete
    */

    * complete (request, response) { 
        const role = request.currentUser.role

        if (role != "admin"){ response.redirect('/home') }

        const id = request.param('id')

        const affectedRows = yield Database
            .table('orders')
            .where({ id: id })
            .update('status', 'completed')

        response.redirect('/orders')
    }

    //--------------------------------------------------------------------------

    /*
        in_stock checks if the user is an admin. 
            Non-admin: the user is directed back to the home page. 
            Admin: updates the database for current inventory status
    */

    * in_stock (request, response) { 
        const role = request.currentUser.role

        if (role != "admin"){ response.redirect('/home') }

        const id = request.param('id')
        
        const updatedRows = yield Database
            .table('colors')
            .where({ id: id })
            .update('in_stock', 1)

        const deletedRows = yield Database
            .table('requests')
            .where({ color_id: id })
            .delete()

        response.redirect('/inventory')
    }

    //--------------------------------------------------------------------------

    /*
        out_of_stock checks if the user is an admin. 
            Non-admin: the user is directed back to the home page. 
            Admin: updates the database for current inventory status
    */

    * out_of_stock (request, response) { 
        const role = request.currentUser.role

        if (role != "admin"){ response.redirect('/home') }

        const id = request.param('id')
        
        const affectedRows = yield Database
            .table('colors')
            .where({ id: id })
            .update('in_stock', 0)

        response.redirect('/inventory')
    }

    //--------------------------------------------------------------------------

    /*
        users checks if the user is an admin. 
            Non-admin: the user is directed back to the home page. 
            Admin: queries the database for all users, so admin can view a list
                of all the website accounts
    */

    * users (request, response) { 
        const role = request.currentUser.role

        if (role != "admin"){ response.redirect('/home') }

        const id = request.currentUser.id

        const users = yield Database
            .from('users')

        yield response.sendView('users', { users, role, id }) 
    }

    //--------------------------------------------------------------------------

    /*
        add_admin checks if the user is an admin. 
            Non-admin: the user is directed back to the home page. 
            Admin: updates the database to make a user into an admin
    */

    * add_admin (request, response) { 
        const role = request.currentUser.role

        if (role != "admin"){ response.redirect('/home') }

        const id = request.param('id')
        
        const affectedRows = yield Database
            .table('users')
            .where({ id: id })
            .update('role', "admin")

        response.redirect('/users')
    }

    //--------------------------------------------------------------------------

    /*
        remove_admin checks if the user is an admin. 
            Non-admin: the user is directed back to the home page. 
            Admin: updates the database to make an admin into a regular user
    */

    * remove_admin (request, response) { 
        const role = request.currentUser.role

        if (role != "admin"){ response.redirect('/home') }

        const id = request.param('id')
        
        const affectedRows = yield Database
            .table('users')
            .where({ id: id })
            .update('role', "user")

        response.redirect('/users')
    }

}

module.exports = AdminController
