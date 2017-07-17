'use strict'

const Schema = use('Schema')

class ReviewsTableSchema extends Schema {

  up () {
    this.create('reviews', (table) => {
      table.increments()
      table.integer('user_id').references('id').inTable('users')
      table.integer('rating')
      table.string('title')
      table.text('review')
      table.timestamps()
    })
  }

  down () {
    this.drop('reviews')
  }

}

module.exports = ReviewsTableSchema
