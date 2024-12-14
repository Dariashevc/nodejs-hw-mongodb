import { ContactsCollection } from '../db/models/Contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  userId,
}) => {
  const skip = (page - 1) * perPage;
  const query = userId ? { userId } : {};
  const data = await ContactsCollection.find(query)
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder })
    .exec();
  const totalItems = await ContactsCollection.countDocuments(query);
  const paginationData = calculatePaginationData({ totalItems, page, perPage });
  return {
    data,
    ...paginationData,
  };
};

export const getContactById = async ({ contactId, userId }) => {
  const query = { _id: contactId, userId };

  const data = await ContactsCollection.findOne(query);
  return data;
};

export const createContact = (payload) => ContactsCollection.create(payload);

export const updateContact = async (
  contactId,
  userId,
  payload,
  options = {},
) => {
  const query = { _id: contactId, userId };

  const data = await ContactsCollection.findOneAndUpdate(query, payload, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  if (!data || !data.value) return null;

  return data.value;
};
export const deleteContact = async (contactId, userId) => {
  const query = { _id: contactId, userId };

  const data = await ContactsCollection.findOneAndDelete(query);
  return data;
};
