'use strict'

const Review = use('App/Model/Review')
const Database = use('Database')
const Validator = use('Validator')

class ReviewController {

    /*
        delete allows an admin to delete inappropriate reviews
    */

    * delete (request, response) { 
        const role = request.currentUser.role
        const id = request.param('id')

        const affectedRows = yield Database
            .table('reviews')
            .where({ id: id })
            .delete()

        response.redirect('/reviews') 
    }

    //--------------------------------------------------------------------------

    /*
        reviews send a user to the ratings page with a list of the reviews
    */

    * reviews (request, response) { 
        const role = request.currentUser.role
        const reviews = yield Database
            .select('reviews.id as id', 'rating', 'title', 'review', 'display_name')
            .from('reviews')
            .join('users', 'reviews.user_id', 'users.id')

        yield response.sendView('ratings', { reviews, role }) 
    }

    //--------------------------------------------------------------------------

    /*
        create allows a user to post a review 
    */

    * create (request, response) { 
        const reviewData = request.only('title', 'review', 'rating')

        const rules = {
            title: 'required',
            review: 'required',
            rating: 'required'
        }

        const validation = yield Validator.validate(reviewData, rules) 

        if (validation.fails()) {
            yield request
                .withOnly('title', 'review', 'rating')
                .andWith({ errors: validation.messages() })
                .flash() 

            response.redirect('back')
            return
        }

        reviewData.user_id = request.currentUser.id

        yield Review.create(reviewData)
        response.redirect('/reviews')
    }
}

module.exports = ReviewController
