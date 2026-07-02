class APIFilters {
  query: any;
  queryStr: any;

  constructor(query: any, queryStr: any) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search(): APIFilters {
    const location = this.queryStr?.location
      ? {
          $or: [
            { address: { $regex: this.queryStr.location, $options: "i" } },
            { "location.city": { $regex: this.queryStr.location, $options: "i" } },
            {
              "location.formattedAddress": {
                $regex: this.queryStr.location,
                $options: "i",
              },
            },
          ],
        }
      : {};

    this.query = this.query.find({ ...location });
    return this;
  }

  filter(): APIFilters {
    const queryCopy = { ...this.queryStr };
    const removeFields = ["location", "page", "lat", "lng", "maxDistance", "nearMe", "checkInDate", "checkOutDate"];
    removeFields.forEach((el) => delete queryCopy[el]);

    Object.keys(queryCopy).forEach((key) => {
      if (queryCopy[key] === "" || queryCopy[key] === undefined) {
        delete queryCopy[key];
      }
    });

    if (queryCopy.guestCapacity) {
      queryCopy.guestCapacity = { $gte: Number(queryCopy.guestCapacity) };
    }

    this.query = this.query.find(queryCopy);
    return this;
  }

  pagination(resPerPage: number): APIFilters {
    const currentPage = Math.max(1, Number(this.queryStr?.page) || 1);
    const skip = resPerPage * (currentPage - 1);
    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

export default APIFilters;
