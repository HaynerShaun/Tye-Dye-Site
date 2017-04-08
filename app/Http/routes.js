'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')

Route.get('/', 'UserController.index')
Route.get('login', 'UserController.index')
Route.get('register', 'UserController.register')
Route.get('home', 'UserController.home')

Route.post('login', 'UserController.login')
Route.post('register', 'UserController.create')
