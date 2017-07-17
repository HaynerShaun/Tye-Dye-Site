'use strict'

const Schema = use('Schema')

class OrdersTableSchema extends Schema {

  up () {
    this.create('orders', (table) => {
      table.increments()
      table.integer('user_id').references('id').inTable('users')
      table.string('size')
      table.string('design')
      table.string('status')
      table.timestamps()
    })
  }

  down () {
    this.drop('orders')
  }

}

module.exports = OrdersTableSchema
