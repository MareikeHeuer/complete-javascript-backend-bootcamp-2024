class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    // POSTMAN:127.0.0.1:3000/api/v1/tours?fields=name,duration,difficulty,price
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // - means excluding, everything except the v field
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // 127.0.0.1:3000/api/v1/tours?page=2&limit=10
    // 1-10 page 1, 11-20, page 2, 21-30 page 3 etc.
    // Skip: Amount of results that should be skipped before querying data
    // Limit: Amount of results that we want in the query

    // * 1 converts string to number
    // || 1 be default page number 1
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    // page=2&limit=10
    // 1-10 page 1, 11-20, page 2, 21-30 page 3 etc.
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
