# Data Sets necessary for our application

1. Tours
2. Users
3. Reviews
4. Locations
5. Bookings

## Modeling the Data

### Relationship 1: Users and Reviews

This is a 1:MANY relationship because the user can have many reviews. And the user is the parent with the reviews being the child document. But one review can only be related to one user.

A good choice for this relationship is parent referencing. This is because a user coould write any number of reviews and there are occations where we will want to query just the reviews. The data access pattern is where the data will most likely be written once and then read over and over.

### Relationship 2: Tours and Reviews

This relationship is qute similar to the previous one. It is 1:MANY relationship and again the best option will be Parent Refrerencing. So in the end the Review will carry both who wrote it and what tour it is associated with.

### Relationship 3: Tours and Locations

Each tour will have a few locations. One of the locations could also be the spot for several diffferent tours. So in this case the relationship is FEW:FEW. We could have two-way referncing here but the better choice is to denormalize the locations and embedd them within the tours dataset. This is because there will be a finite number of locations first, second the locations are intrinsically connected to the tours, third we will never be quering the locations separate from the tours. Without the loccations there wouldd be no tours.

### Relationship 4: Tours and Users(Tour Guides)

We are going to have tour guides who are associated with eacch tour so there will be a relationship between the Tours dataset and the Users dataset. This relationship will again be a FEW:FEW relationship. This is because each Tour will have a few Tour Guides associated with it, and each Tour Guide can be associated with a few Tours. In this situation we could either use Child Referencing or Embedding.

### Relationship 5: Bookings

This is a little different because on the outside it looks to be a relationship between the users and the Tours. Because it is the Users who will be purchasing the Tours. But we want to store some information about the Booking itself. SO therefore we will have a relationship betweeen the Tours and the Bookings and the Users and the Bookings. This creates the relationship between the TOurs and the Users with the intermeddiary of the Bookings dataset. Users have the potential to have many Bookings, but a booking will only have one user. And likewise a Tour could have many bookings but each booking will include only one tour. SO they are 1:MANY Relationship. So in this case we will use Parent Referencing, so Each booking will contain the ID of both the User that created it and the Tour it is assiciated with.

# Storing a summary of a related dataset on the main dataset

What we want to do now is store the average rating, and the number of ratings on each tour document.

And we want to do this:

1. When a new review is created
2. When a review is updated
3. When a review is deleted

## When a new review is created

So to do it when a new review is created we do the following

So we will do this by creating a static method on the review model.

    reviewSchema.statics.calcAverageRating = function() {}

And we will capture the data that we need using a aggregate pipeline.

Aggregate pipelines are hard to understand so we will explain it clearly.

When capturing our data we first want to process all the reviews that have the same tourId as the review we just created.

since we are creating a static method on the model the `this` keyword points to the Model.
And we begin by passing an array into the aggregate function. An array of pipes or blocks.

    this.aggregate([])

So we begin with a `$match` block

    {
        $match: {tour: tourId}
    }

So here we are going to match all the reviews that have the same tourId as the one passed to this function.

Then next we want to process each review and talley data and stuff.

So for that we need a `$group` block.

    {
        $group: {
            _id: '$tour'
        }
    }

We want to group the reviews by tour. Making one group because they should all have the same tourID.

And we use the field on the reeview object which is called `tour`.

    {
        $group: {
            _id: '$tour',
            nRatings: { $sum: 1 }
        }
    }

Then we create a variable named `nRatings` for number of ratings, and we will count the number of ratings by adding 1 everytime a ratings is processed through this aggregate pipeline.

    {
        $group: {
            _id: '$tour',
            nRatings: { $sum: 1 },
            avgRating: { $avg: '$rating' }
        }
    }

Then we create another variable called `avgRating` on which we will calculate the average rating by using the `$avg` operator and using the value from the `rating` field of the review being processed.

`this.aggregate()` function returns a promise and mut be awaited and then we can store it into a variable. This variable will be an array of objects.

Then to add the values to the current tour document we will have to import the Tour model and then get the tour using `Tour.findByIdandUpdate()`

Into this function we pass first the tourId and then an object of the corresponding fields and assign to those fields the values that were captured by the aggregate pipeline.

## When a review is updated

This is a more complex option because the mehtods that we would use to get the reviews are:

    Review.findByIdAndUpdate
    Review.findByIdAndDelete

Both of these methods are query middleware and not document middleware. And in the query we actually do not have direct access to the document in order to do somehting similar to what we did with running a static method on the Model.

Because ultimately we need access to the current review so we can extract the tourID and then update the statistics of that tour.

We will get around this by using some pre-middleware on these hooks.

    reviewSchema.pre('/^findOneAnd/')

The `fndByIdAnd`-whatever actually is just short form for `findOneAnd`-whatever.

So the goal is to get access to the review document so that we can get the tourId from there.

But in query middleware the `this` keyword points to the current query. So in order to get the review document we will execute the query. We execute the query to get access to the review document.

So what we end up doing is we have a pre-middleware that uses the query to get the current review that is being modified and then once we get the tourId from that object, then we can use a post-middleware to then run the static method with the tourId and then update the tour document with the new statistics.

Now to pass the tourId from the `pre` to the `post` middleware we need to assign it to a property on the `this` keyword. Because the post-middleware will then have access to that property.
