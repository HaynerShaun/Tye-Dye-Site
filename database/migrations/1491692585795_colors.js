'use strict'

const Schema = use('Schema')

class ColorsTableSchema extends Schema {

  up () {
    this.create('colors', (table) => {
      table.increments()
      table.string('name')
      table.string('color_code')
      table.integer('in_stock')
    })
  }

  down () {
    this.drop('colors')
  }

}

module.exports = ColorsTableSchema
