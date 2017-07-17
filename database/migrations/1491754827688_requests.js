'use strict'

const Schema = use('Schema')

class RequestsTableSchema extends Schema {

  up () {
    this.create('requests', (table) => {
      table.increments()
      table.integer('user_id').references('id').inTable('users')
      table.integer('color_id').references('id').inTable('colors')
      table.timestamps()
    })
  }

  down () {
    this.drop('requests')
  }

}

module.exports = RequestsTableSchema
