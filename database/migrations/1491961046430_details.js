'use strict'

const Schema = use('Schema')

class DetailsTableSchema extends Schema {

  up () {
    this.create('details', (table) => {
      table.increments()
      table.integer('order_id').references('id').inTable('orders')
      table.string('color').references('name').inTable('colors')
      table.timestamps()
    })
  }

  down () {
    this.drop('details')
  }

}

module.exports = DetailsTableSchema
