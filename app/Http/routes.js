'use strict'

/*
    Routes.js handles all the routing for the website
*/

const Route = use('Route')

/*
    Get Routes that direct requests to the AuthController
*/

Route.get('/', 'AuthController.index')
Route.get('login', 'AuthController.index')
Route.get('register', 'AuthController.register')
Route.get('logout', 'AuthController.logout')
Route.get('delete', 'AuthController.delete')

//------------------------------------------------------------------------------

/*
    Get Routes that direct requests to the GeneralController
*/

Route.get('home', 'GeneralController.home').middleware('auth')
Route.get('colors', 'GeneralController.colors').middleware('auth')
Route.get('profile', 'GeneralController.profile').middleware('auth')
Route.get('custOrders', 'GeneralController.custOrders').middleware('auth')

//------------------------------------------------------------------------------

/*
    Get Routes that direct requests to the ReviewController
*/

Route.get('reviews', 'ReviewController.reviews').middleware('auth')
Route.get('deleteReview/:id', 'ReviewController.delete').middleware('auth')

//------------------------------------------------------------------------------

/*
    Get Routes that direct requests to the AdminController
*/

Route.get('requests', 'AdminController.requests').middleware('auth')
Route.get('users', 'AdminController.users').middleware('auth')
Route.get('orders', 'AdminController.orders').middleware('auth')
Route.get('inventory', 'AdminController.inventory').middleware('auth')
Route.get('process/:id', 'AdminController.process').middleware('auth')
Route.get('complete/:id', 'AdminController.complete').middleware('auth')
Route.get('in_stock/:id', 'AdminController.in_stock').middleware('auth')
Route.get('out_of_stock/:id', 'AdminController.out_of_stock').middleware('auth')
Route.get('add_admin/:id', 'AdminController.add_admin').middleware('auth')
Route.get('remove_admin/:id', 'AdminController.remove_admin').middleware('auth')

//------------------------------------------------------------------------------

/*
    Get Routes that direct requests to the OrderController
*/

Route.get('colorRequest/:id', 'OrderController.request').middleware('auth')
Route.get('make', 'OrderController.design').middleware('auth')
Route.get('reorder/:id', 'OrderController.reorder').middleware('auth')
Route.get('orderEdit/:id', 'OrderController.editPage').middleware('auth')
Route.get('orderDelete/:id', 'OrderController.delete').middleware('auth')
Route.get('completed', 'OrderController.completed').middleware('auth')

//------------------------------------------------------------------------------

/*
    Post Routes requested from submitting forms
*/

Route.post('login', 'AuthController.login')
Route.post('register', 'AuthController.create')
Route.post('profile', 'GeneralController.edit').middleware('auth')
Route.post('custOrders', 'GeneralController.editOrder').middleware('auth')
Route.post('ratings', 'ReviewController.create').middleware('auth')
Route.post('make', 'OrderController.create').middleware('auth')
Route.post('orderEdit/:id', 'OrderController.edit').middleware('auth')

