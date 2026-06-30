class APIFilters{
    query: any
    queryStr: any
    constructor (query: any, queryStr: any){
        this.query=query;
        this.queryStr=queryStr;

    }
    search(): APIFilters{
        const location=this.queryStr?.location?{
address:{
    $regex:this.queryStr.location,
    //Room.find({
//   address: { $regex: "Kathmandu", $options: "i" }
// })

    $options:"i"
    //case insensitive
}
        }:{};
        //location nahuda
        // Room.find({})
// APIFilters only changes the query sent to MongoDB.
        this.query=this.query.find({...location});
        //this.query =

// Saves the result (a Mongoose Query object) back into this.query.

// Now this.query is no longer just the model; it’s a ready-to-run query.
        return this;
//         returns sth like: [
//   { "_id": "1", "address": "Kathmandu, Nepal", "price": 100 },
//   { "_id": "4", "address": "Kathmandu - Thamel Area", "price": 150 },
//   { "_id": "5", "address": "Bhaktapur, Kathmandu Valley", "price": 110 }
// ]

    }
    filter():APIFilters{
const queryCopy={...this.queryStr}
// console.log('queryCopy',queryCopy)
const removeFields=['location','page','lat','lng','maxDistance','nearMe']
    removeFields.forEach((el)=> delete queryCopy[el])
//   console.log('querycopy2',queryCopy)
this.query=this.query.find(queryCopy)
    return this
}
pagination(resPerPage:number):APIFilters{
const currentPage = Math.max(1, Number(this.queryStr?.page) || 1);
const skip = resPerPage * (currentPage - 1);
this.query = this.query.limit(resPerPage).skip(skip);

    // In pagination()
console.log("currentPage in pagination:", currentPage, "skip:", skip);

    return this
    //Example:

// /api/rooms?page=3 → currentPage = 3

// /api/rooms (no page given) → currentPage = 1

// const skip = resPerPage * (currentPage - 1);


// Calculates how many results to skip before starting the current page.

// Formula:

// skip = itemsPerPage × (pageNumber - 1)


// Example with resPerPage = 8:

// Page 1: skip = 8 × (1 - 1) = 0 → start from first result.

// Page 2: skip = 8 × (2 - 1) = 8 → skip first 8 results.

// Page 3: skip = 8 × (3 - 1) = 16 → skip first 16 results.
}

}
export default  APIFilters;