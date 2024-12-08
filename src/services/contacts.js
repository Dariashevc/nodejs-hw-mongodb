import Contacts from '../db/models/Contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

const allowedSortFields = ['name', 'phoneNumber', 'email'];
export const getContacts = async ({ page = 1, perPage = 10,  sortBy = 'name', sortOrder = 'asc', filter = {} }) => {
  try {
    if (!allowedSortFields.includes(sortBy)) {
      sortBy = 'name';
    }

    if (sortOrder !== 'asc' && sortOrder !== 'desc') {
      sortOrder = 'asc';
    }
    
    const query = Contacts.find(filter);  

    const skip = (page - 1) * perPage;

    const sort = {};

    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const contacts = await query.skip(skip).limit(perPage).sort(sort); 

    const totalItems = await Contacts.countDocuments(filter);
    const paginationData = calculatePaginationData({ totalItems, page, perPage });


    return {
      data: contacts,
      ...paginationData,
      
    };
  } catch (error) {
    throw new Error('Error fetching contacts: ' + error.message);
  }
};

export const getContactById = async (contactId) => {
  try {
    const contact = await Contacts.findById(contactId);
    return contact;
  } catch (error) {
    throw new Error('Error fetching contact from database: ' + error.message);
  }
};

export const createContact = async (contactData) => {
  const newContact = new Contacts(contactData);

  await newContact.save();

  return newContact;
};

export const updateContact = async (contactId, updateData) => {
  try {
    const contact = await Contacts.findByIdAndUpdate(contactId, updateData, {
      new: true,
    });

    return contact;
  } catch (error) {
    throw new Error('Error updating contact');
  }
};

export const deleteContact = async (contactId) => {
  try {
    const contact = await Contacts.findByIdAndDelete(contactId);

    return contact;
  } catch (error) {
    throw new Error('Error deleting contact');
  }
};
