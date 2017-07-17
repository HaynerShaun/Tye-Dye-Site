'use strict'

const Order = use('App/Model/Order')
const Detail = use('App/Model/Detail')
const Request = use('App/Model/Request')
const Database = use('Database')

class OrderController {

    /*
        completed sends the user to the completed page after completeing an
        order
    */

    * completed (request, response) { 
        const role = request.currentUser.role
        yield response.sendView('completed', { role }) 
    }

    //--------------------------------------------------------------------------

    /*
        design sends the user to the make page with a list of in stock colors
    */

    * design (request, response) { 
        const role = request.currentUser.role
        const colors = yield Database
            .from('colors')
            .where({ in_stock: 1 })
        yield response.sendView('make', { colors, role }) 
    }

    //--------------------------------------------------------------------------

    /*
        request processes a user's request for an out of stock color
    */

    * request (request, response) { 

        var requestData = {
                user_id: request.currentUser.id, 
                color_id: request.param('id')};

        yield Request.create(requestData)
        response.redirect('/colors')
    }

    //--------------------------------------------------------------------------

    /*
        create adds a new order to the orders database and the associated colors
        to the details database
    */

    * create (request, response) {
        const details = request.only('size','design');

        var orderData = {
            user_id: request.currentUser.id,
            size: details.size,
            design: details.design,
            status: "received"};

        yield Order.create(orderData)

        const orderColors = request.only('color')
        const colors = orderColors.color

        const order = yield Database
            .from('orders')
            .where({ user_id: request.currentUser.id })
            .max('id as recent_order')

        if (Array.isArray(colors))
        {
            for (var i = 0; i < colors.length; i++) {
                var colorData = {
                    order_id: order[0].recent_order,
                    color: colors[i]};

                yield Detail.create(colorData)
            }
        } else {
            var colorData = {
                order_id: order[0].recent_order,
                color: colors};

            yield Detail.create(colorData)
        }
        
        response.redirect('completed') 
    }

    //--------------------------------------------------------------------------

    /*
        reorder allows a user to reorder a previous order. 
    */

    * reorder (request, response) { 
        const id = request.param('id')

        const order = yield Database
            .from('orders')
            .where({ id: id })

        var new_order = {
            user_id: order[0].user_id,
            size: order[0].size,
            design: order[0].design,
            status: "received"};

        yield Order.create(new_order)

        const new_order_id = yield Database
            .from('orders')
            .where({ user_id: request.currentUser.id })
            .max('id as recent_order')

        const colors = yield Database
            .select('color')
            .from('details')
            .where({ order_id: id })

        if (Array.isArray(colors))
        {
            for (var i = 0; i < colors.length; i++) {
                var colorData = {
                    order_id: new_order_id[0].recent_order,
                    color: colors[i].color};

                yield Detail.create(colorData)
            }
        } else {
            var colorData = {
                order_id: new_order_id[0].recent_order,
                color: colors};

            yield Detail.create(colorData)
        }

        response.redirect('/custOrders')
    }

    //--------------------------------------------------------------------------

    /*
        editPage takes a page where they view and change order details
    */

    * editPage (request, response) { 
        const id = request.param('id')
        const role = request.currentUser.role

        const orders = yield Database
            .from('orders')
            .where({ id: id })

        const order = orders[0]

        const colors = yield Database
            .from('colors')

        const details = yield Database
            .select('color')
            .from('details')
            .where({ order_id: id })

        yield response.sendView('orderEdit', { colors, details, order, role }) 
    }

    //--------------------------------------------------------------------------

    /*
        edit allows a user to edit the details of an order before it has
        reached the processing stage
    */

    * edit (request, response) { 
        const id = request.param('id')
        const size = request.input('size')
        const design = request.input('design')

        const updated_order = yield Database
            .table('orders')
            .where({ id: id })
            .update({ size: size, 
                    design: design
                })

        const previous_colors = yield Database
            .table('details')
            .where({ order_id: id })
            .delete()

        const orderColors = request.only('color')
        const colors = orderColors.color

        if (Array.isArray(colors))
        {
            for (var i = 0; i < colors.length; i++) {
                var colorData = {
                    order_id: id,
                    color: colors[i]};

                yield Detail.create(colorData)
            }
        } else {
            var colorData = {
                order_id: id,
                color: colors};

            yield Detail.create(colorData)
        }

        return response.redirect('/custOrders')
    }

    //--------------------------------------------------------------------------

    /*
        delete allows a user to delete an order before it has begun processing
    */

    * delete (request, response) { 
        const id = request.param('id')

        const deleted_colors = yield Database
            .table('details')
            .where({ order_id: id })
            .delete()

        const deleted_order = yield Database
            .table('orders')
            .where({ id: id })
            .delete()

        return response.redirect('/custOrders')
    }
}

module.exports = OrderController
