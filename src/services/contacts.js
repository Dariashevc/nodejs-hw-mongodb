import Contacts from '../db/models/Contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

const allowedSortFields = ['name', 'phoneNumber', 'email'];

export const getContacts = async ({ userId, page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', filter = {} }) => {
  try {
    if (!allowedSortFields.includes(sortBy)) {
      sortBy = 'name';
    }

    if (sortOrder !== 'asc' && sortOrder !== 'desc') {
      sortOrder = 'asc';
    }

    const query = Contacts.find({ ...filter, userId });

    const skip = (page - 1) * perPage;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const contacts = await query.skip(skip).limit(perPage).sort(sort);

    const totalItems = await Contacts.countDocuments({ ...filter, userId });
    const paginationData = calculatePaginationData({ totalItems, page, perPage });

    return {
      data: contacts,
      ...paginationData,
    };
  } catch (error) {
    throw new Error('Error fetching contacts: ' + error.message);
  }
};

export const getContactById = async (userId, contactId) => {
  try {
    const contact = await Contacts.findOne({ _id: contactId, userId });
    return contact;
  } catch (error) {
    throw new Error('Error fetching contact from database: ' + error.message);
  }
};

export const createContact = async (userId, contactData) => {
  const newContact = new Contacts({ ...contactData, userId });

  await newContact.save();

  return newContact;
};

export const updateContact = async (userId, contactId, updateData) => {
  try {
    const contact = await Contacts.findOneAndUpdate(
      { _id: contactId, userId },
      updateData,
      { new: true }
    );

    return contact;
  } catch (error) {
    throw new Error('Error updating contact');
  }
};

export const deleteContact = async (userId, contactId) => {
  try {
    const contact = await Contacts.findOneAndDelete({ _id: contactId, userId });

    return contact;
  } catch (error) {
    throw new Error('Error deleting contact');
  }
};
