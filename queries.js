// to create a database
use books_store;

// to create a collection
db.createCollection("books");

// to find all books in a specific genre
db.books.find({genre:"Fantasy"})

//to find a book published in a particular year
db.books.find({published_year:1937})

//to find a books by specific author
db.books.find({author:"F. Scott Fitzgerald"})

//to udpate the price of a particular book
db.books.updateOne({_id:ObjectId('683e36d912c170799d6c4bd4')},{$set:{price:20.23}})

//to delete a book by it title
db.books.deleteOne({title: 'To Kill a Mockingbird'})

//to find books in_stock and is published after 2010
 db.books.find({$and:[{published_year:{$gt:2010}},{in_stock:true}]})

//  Using projection to return only the title, author, and price fields.
 db.books.find({},{author:true,title:true,price:true,_id:false})

  // sorting to display books by price (both ascending and descending)
  db.books.find({},{price:true,_id:false}).sort({price:1})
  db.books.find({},{price:true,_id:false}).sort({price:-1})


// Using the limit and skip methods to implement pagination (5 books per page)
  db.books.find().skip(0).limit(5)
  db.books.find().skip(5).limit(5)

// Creating an aggregation pipeline to calculate the average price of books by genre.
 db.books.aggregate([{$group:{_id:"$genre",averagePrice:{$avg:"$price"}}}])

//  Creating an aggregation pipeline to find the author with the most books in the collection
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      bookCount: { $sum: 1 }
    }
  },
  {
    $sort: { bookCount: -1 }
  },
  {
    $limit: 1
  },
  {
    $project: {
      _id: 0,
      author: "$_id",
      bookCount: 1
    }
  }
])

// Implementing a pipeline that groups books by publication decade and counts them
db.books.aggregate([
  {
    $project: {
      decade: {
        $concat: [
          { $toString: { $multiply: [ { $floor: { $divide: ["$published_year", 10] } }, 10 ] } },
          "s"
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      bookCount: { $sum: 1 }
    }
  },
  {
    $sort: { _id: 1 } // Sort by decade ascending
  },
  {
    $project: {
      _id: 0,
      decade: "$_id",
      bookCount: 1
    }
  }
])


// Creating an index on the title field for faster searches
db.books.createIndex({ title: 1 })


// Creating a compound index on author and published_year
db.books.createIndex({ author: 1, published_year: 1 })


// Using the explain() method to demonstrate the performance improvement with my indexes
db.books.find({ author: "George Orwell", published_year: 1949 }).explain("executionStats")


