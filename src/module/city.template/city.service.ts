import { type Schema } from "mongoose";
import { cityModel, regionModel } from "../../models/index";
import { type CityDocument } from "../../models/city";

export class CityService {
  public async getAllCitiesService() {
    const cities = await cityModel.find().sort({
      name: 1,
    });
    return cities;
  }

  public async getAllCitiesByFilter(payload) {
    const { searchValue, pageNo, recordPerPage } = payload;
    const query = cityModel.find({ isDeleted: false }).sort({
      createdAt: -1,
    });
    // Add search functionality
    if (searchValue) {
      void query.or([
        {
          name: {
            $regex: new RegExp(searchValue, "i"),
          },
        },
      ]);
    }

    // Count total documents (for pagination)
    const docs = await cityModel
      .find({
        isDeleted: false,
      })
      .count();

    // Set up pagination
    const limit = parseInt(recordPerPage || "10");
    const skip = (pageNo - 1) * limit;

    // Apply pagination and execute the query
    const result = await query.limit(limit).skip(skip).exec();

    return {
      count: Math.ceil(docs / Number(recordPerPage || 10)),
      result,
    };
  }

  public async getCityByIdService(id: string) {
    const city = await cityModel.findById(id);
    return city;
  }

  public async addCityService(data: CityDocument) {
    const {
      name,
      startTime,
      endTime,
      address,
      zipCode,
      directionLink,
      region,
      popular,
    } = data;
    const newCity = await cityModel.create({
      name,
      region,
      startTime,
      endTime,
      address,
      zipCode,
      directionLink,
      popular,
    });
    return newCity;
  }

  public async updateCityByIdService(
    id: string,
    updatedData: Schema<CityDocument>,
  ) {
    const updatedCity = await cityModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return updatedCity;
  }

  public async deleteCityByIdService(id: string) {
    const deletedCity = await cityModel.findByIdAndDelete(id);
    return deletedCity;
  }

  public async getAllCitiesFrontendService() {
    const cities = await cityModel.find({ status: true }).sort({
      name: 1,
    });
    return cities;
  }

  public async getRegionWithCities() {
    const region = await regionModel.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: cityModel.collection.name,
          let: { regionID: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$region", "$$regionID"],
                },
              },
            },
            {
              $match: {
                isDeleted: false,
              },
            },
          ],
          as: "cities",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          cities: 1,
        },
      },
    ]);
    return region;
  }

  public async getPopularCity() {
    const city = await cityModel.aggregate([
      {
        $match: {
          popular: true,
        },
      },
      // {
      //   $lookup: {
      //     from: cityModel.collection.name,
      //     let: { cityId: "$city" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $in: ["$_id", "$$cityId"],
      //           },
      //         },
      //       },
      //     ],
      //     as: "city",
      //   },
      // },
      // {
      //   $project: {
      //     city: 1,
      //   },
      // },
    ]);
    return city;
    // const isContain: string[] = [];
    // return job
    //   .map((item) => item.city)
    //   .flat()
    //   .filter((item) => {
    //     if (isContain.includes(item._id.toString())) {
    //       return false;
    //     } else {
    //       isContain.push(item._id.toString());
    //       return true;
    //     }
    //   });
  }
}
