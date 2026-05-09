import { type Contact } from "../../models/contact";
import { contactModel } from "../../models/index";

export class ContactService {
  public async getAllContacts() {
    const contacts = await contactModel.find();
    return contacts;
  }

  public async getContactById(id: string) {
    const contact = await contactModel.findById(id);
    return contact;
  }

  public async addContact(contactData: Contact) {
    const newContact = await contactModel.create(contactData);
    return newContact;
  }

  public async updateContactById(id: string, updatedContactData: Contact) {
    const updatedContact = await contactModel.findByIdAndUpdate(
      id,
      updatedContactData,
      { new: true },
    );
    return updatedContact;
  }

  public async deleteContactById(id: string) {
    const deletedContact = await contactModel.findByIdAndDelete(id);
    return deletedContact;
  }

  public async getAllContactsByFilter(
    searchValue: string,
    pageNo: number,
    recordPerPage: number,
  ) {
    try {
      let query = contactModel.find();

      // Add search functionality
      if (searchValue) {
        query = query.or([
          {
            name: {
              $regex: new RegExp(searchValue, "i"),
            },
          },
          {
            phoneNumber: {
              $regex: new RegExp(searchValue, "i"),
            },
          },
          {
            email: {
              $regex: new RegExp(searchValue, "i"),
            },
          },
          {
            message: {
              $regex: new RegExp(searchValue, "i"),
            },
          },
        ]);
      }

      // Count total documents (for pagination)
      const totalDocs = await contactModel.countDocuments();

      // Set up pagination
      const limit = recordPerPage || 10;
      const skip = (pageNo - 1) * limit;

      // Apply pagination and execute the query
      const data = await query
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .exec();

      return {
        count: Math.ceil(totalDocs / limit),
        data,
      };
    } catch (error) {
      return error;
    }
  }
}
