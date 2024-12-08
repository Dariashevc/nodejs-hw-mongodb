import Contacts from '../db/models/Contacts.js';

export const getContacts = async () => {
  try {
    const contacts = await Contacts.find();
    return contacts;
  } catch (error) {
    throw new Error('Error fetching contacts');
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
