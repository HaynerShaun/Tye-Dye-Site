'use strict'

const Schema = use('Schema')

class UsersTableSchema extends Schema {

  up () {
    this.create('users', table => {
      table.increments()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('display_name', 80).notNullable().unique()
      table.string('first_name')
      table.string('last_name')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }

}

module.exports = UsersTableSchema
