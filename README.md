# RESTFUL APIs

## Rest Architecture

REST stands for "Representational State Transfer"

A logical way of building an api to have them be simple to interact with.

### Broad Overview

1. We need to separate the API into logical resources

For example: Users, Tours, Articles, Entries (most of the time these are plural)

2. Expose structured, resource-based URLs

3. Use HTTP Methods to perform actions and not to label the endpoint.
   Endpoints should only contain the name of the resource and not the action that is being performed!

To POST a new Tour: `/tours` **CREATE**

To GET all Tours: `/tours` **READ**
To GET a Specific Tour: `/tours/3`

to update:
to PUT (change) a tour: `/tours/3` **UPDATE**
to PATCH (update) a tour: `/tours/3`

To DELETE a tour: `/tours/3` **DELETE**

Examples when using two resources at once:

GET tours by user: `/users/3/tours`
DELETE tours by user: `/users/3/tours/9`

4. Send data as JSON

Example of JSON data formatted as a JSend Responce:

```
{
    "status": "success",
    "data":
        {
        "id": 5,
        "tourName": "The West Nile",
        "rating": "4.9",
        "guides": [
            {
                "name": "Steve Miller",
                "role": "Lead Guide"
            },
            {
                "name": "Lisa Brown",
                "role": "Tour Guide"
            }
        ]
    }
}
```

5. Be Stateless

All state is handled by the CLIENT and not by the SERVER

Every request should contain all the information needed to process the current request.

## Backend Architecture MVC

#### Model (Business Logic)

#### Controller (Application Logic)

#### View (Presentation Logic)

### Everything Starts with a Request

The request is made and then the first thing that will hit is a Router.

The Router is middleware and the request also will pass through each middleware that is necessary before or while it is in the Router.

Then that Router will point to a certain controller.

Then depending on the incomming request the controller might have to interact with one of the Models.

For example to retrieve some data from the database.

Then with the data the controller will choose a View to then Populate with the Data

Within the View layer there is usually one view for each page or resource.

Then the View with the data will be sent back to the client as the Response.

### Application Logic

Code that is only concerned about the application's implementation, not the underlying business problem we're trying to solve, or the whole purpose of the application.

Basically the Application logic would be the same no matter what the overall goal of the application would be. Because it would still need to handle requests and communicate and pass data between the Model and then View.

The Application logic is the Brains of the Application.

Application logic works without knowing the specifics of What the data is that it is retrieving and or what the application actually looks like.

### Business Logic

Code that actually solves the business problem we set out to solve.

This code is dependent upon the actual purpose of the Application.

This is also where the User Authentication happens and Where we validate the User Input because these are things specific to this one particular application.

Another example would be to ensure that only users who bought a tour can review it.

### The Truth

It is almost impossible to keep the application logic and the business logic completely separate from each other. So at times they may overlap. But as much as possible we want to keep the application logic in the Controller and the business logic in the Model.

#### Fat Models/Thin Controllers

You should offload as much logic as possible into the Model, and keep the controller as simple and lean as possible.

## Querying with Mongoose

The key to keeping your query as flexible as possible is to build your query first and then execute it(with await) only
after the specified options are established.

### filtering the query string from the URL

In order to filter the query string from the URL so that we can decide what to use where. We need to fist make a new object
from the object returned from `req.query` and we do that using destructuring. `const queryObj = {...req.query};`

This uses destructuring to parse the fields from the original object and then we surround it in brackets to then turn it
back into an object.

Then you have an array of fields you would like to exclude and you can loop over the array using `forEach` and delete them
from the created query object. `excludedFields.forEach(item=> delete queryObject[item])`

### Advanced Filtering

`{difficulty: 'easy', duration: { $gte: 5 }}`

How it is written in the url

`192.168.1.104:3000/api/v1/tours?duration[gte]=5&difficulty=easy`

It is important to document your api so that people know how to use it.

### Sorting

Enable the user to sort the results by a certain field.

## Accessign the MongoDB

Normally there is no authentication for mongodbs but I have setup authentication and I did it this way

first you must go onto the docker container and edit the file /etc/mongod.config and add:

```
security:
authorization: enabled
```

Then you must use mongosh and make sure to `use` the database that you wish to access, and then create the user on that database.

```
> use natours
> db.createUser(
{
user: "bluejet",
pwd: "myNewPassword",
roles: [ { role: "readWrite", db: "natours" } ]
}
)

```

If you want to access the log of the mongodb then you mut be admin and `use` the admin db, and then type:

```
db.adminCommand( { getLog:'global'} ).log.forEach(x => {print(x)})
```

## Getting rid of the Try/Catch Block

These try/catch blocks inside are not ideal

What we want to do is take the try catch block out of the async functions and put it in its own function.
And then wrap all the async functions in this new function.

Async functions return Promises, and when there is an error in an Async function then the Promise is Rejected.

This is the function that will handle catching any errors that are thrown if the promise is rejected. And then it will
propigate those errors to our global error handling function.

```
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
```

First we create a function catchAsync that will take a function as a parameter. Then we have this function return an anonymous
function in which the original function that was passed will be called. But the important thing is that our route controlled gets
assigned to the function and not the result of the function.

# Data Modeling

the file is called a BSON File.

## Different types of relationships between Data

There are Three major types of relationships between data.

- One To One [1:1]
- One to Many [1:MANY]
- Many to Many [MANY:MANY]

### ONE TO ONE

This is where one field can only have one value. For example, with a Movie Database, a single movie will only ever have one Name. This is an example of a 1:1 relationship.

### ONE TO MANY

The most IMPORTANT relationships in data modeling are the ONE TO MANY relationships. They are so Important that we actually distiguish three different types of ONE to MANY ralationships.

1. One to Few [1:FEW]
2. One to Many [1:MANY]
3. One to Ton [1:TON]

The difference here is based on the relative amount of the many.

For example a movie can win awards but not thousands of awards. So it is an example of a One To Few Relationship.

In Relational Databases(MYSQL) there is no distinction between the various levels of One to Many. But in NoSQL Databases, like MongoDB, there is a clear distiction between the various levels of One to Many. It is these distictions that determine whether we should normalize or denormalize data.

### MANY TO MANY

An example of this type of relationship is where you can have Many actors in one movie but each actor can also play in MANY different movies. The relationship basically goes in both directions.

## Referencing/Normalization vs. Embedding/Denormalization

Probably the most important aspect to learn regarding NoSQL Databases, like MongoDB is Referencing and Embeddding two Data Sets.

Each time we have two related datasets we can either represent that related data in a referenced or normalized for or in an embedded or denormalized form.

In the referenced form we keep the two related datasets and all the documents separated. So continuing the movie database example, in a referenced form we would have a document for each movie and then documents for each actor. So to link the actors with the movies we would have an array of actor ids in the movie document.

this type of referncing is called child referencing. Because it is the parent the movie document that references its children the actor documents. So we are creating a form of hierarchy here.

there is also a thing called Parent Referencing that will be discussed later.

In relational databases data is always represented in a Normalized form.

But in a NoSQL Database like MOngoDB we can DeNormalize the Data, simply by embedding the data into the
original document.

The only downside is that we cannot query the imbedded information on its own.

## Embedding or Referencing other Documents

To know whether to Embed or reference your dataset you need to consider these three things.

1. Relationship Type

How are the two datasets related to one another? Are they one:few, one:many, or Many:Many? The first
two include datasets that are relatively small and so they are a better candidate for embedding the
dataset, but if the relation is many:many , then it is best to Reference them.

2. Data Access Patterns

How often is the data read or written? Data that has a high read/write ratio, meaning it is only written
once and then read several times, is a good candidate for embedding, however if the dataset is writen to
often or the data is constantly changing then you would be better off referencing it.

3. Data Closeness

How much is the data realated to one another. If for example it is a username and an email, then its probably a good idea to embed it. If however the data is related but eacch set could be queried independently of the other then reference is the way to go.

## Types of Referencing

Three different types of referencing.

1. Child Referencing
2. Parent Referencing
3. Two-Way Referencing

### Child Referencing

This is where we keep references to the related child documents in the Parent document. Usually it is the id
that is referenced.

The problem is that the Array that is used to reference the child documents could become very large if the number od child documents is large or continues to grow over time.

### Parent referencing

Parent referencing is the opposite of child. We keep a reference to the parent inside each child document. This is handy if the number of child documents is likely to grow very large. In this case the parent knows nothing about the children like who they are or how many there are. It is the child that knows who its parent is.

An array should never be allowed to grow indefinitely.

### Two-Way referencing

This referencing is used to define Many:Many relationships. An example of this is when you have actors in movies and in the movie document you reference the actor and also in the actor document you will reference the movie.

This makes it easy to query the actors and movies separately and also show the relationships between the actors and the movies.

### summary

1. the most important principle is: Structure your data to match the ways that your application queries and updates data.
2. In other words: Identify the questions that arise from your application's use cases first, and then model your data so that the questions can get answered in the most efficient way.
3. In general, always favor embeddding, unless there is a good reason not to embed. Especially on 1:FEW and 1:Many relationships
4. A 1:TON or a Many:Many relationship is usually a good reason to reference instead of embeddding.
5. Also, favor referencing when data is updated a lot and if you need to frequently access a dataset on its own.
6. Use Embedding when data is mostly read but rarely updated, and when two datasets belong intrinsically together.
7. Don't allow arrays to grow indefinitely. Therefore, if you need to normalize, use child referencing for 1:MANY relationships and parent referencing for 1:TON relationships.
8. Use two-way referencing for MANY:MANY relationships.

# Embedding User Object into a Newly created Tour

So to do this first we create the apporpriate field in the toursModel. And in this case it will jst need to be an array.

        guides: Array

And then when we create a new tour we will pass an array of the IDs of the Users/Tour Guides that will be the guides on this tour.

We are passing just the IDs so we will need to do something to actually embedd the user documents associated with these ids in the tour document.

For this we will use a Pre-Save Document Middleware

```
        tourSchema.pre('save', function(next){
            const guides = this.guides.map(async id => await User.findById(id))
            next()
        })


```

Now here we have a problem because the guides variable in this case will be populated with Promises from the async function in the Map. So to fix this we will need to go get all those promises at once. We do this with the `Promise.all()` function. Then we can assign the result of those resolved promises to the `this.guides` property.

```
        tourSchema.pre('save', async function(next){
            const guidesPromises = this.guides.map(async id => await User.findById(id))
            this.guides = await Promise.all(guidesPromises)
            next()
        })


```

# Nested Routing with creating a Review

When creating a review we dont want to have to manually put the user and tour information into the req.body. we first want the user to be the ccurrently logged in user and then we want the tour to be the current tour. So the tour will be passed within the url. Therefor the url might look somehting like this:

    // POST /tour/<tourId>/reviews

So this is the end point that wee are shooting for. A url with the tour id already in it.

So what we see here, is what is called a Nested Route. The `reviews/` route is nested in the
`get tour by Id` route. This can be seen as a parent child relationship. The reviews resource being a child of the parent resource tours. So we want to access the reviews resource on the tours resource.

In the same way we will acccess the reviews for the tour with a GET request:

    // GET /tour/<tourId>/reviews

And we can go one step further and also access a single review by providing its ID.

    // GET /tour/<tourId>/reviews/<reviewId>

# Update Postman Routes

At some point you need to make sure that you have all the routes setup correctly and the
authorization is setup correctly through postman.
