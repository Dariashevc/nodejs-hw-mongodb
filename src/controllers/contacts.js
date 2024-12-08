import * as contactServices from '../services/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import createError from 'http-errors';
import mongoose from "mongoose";
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseContactFilterParams } from '../utils/parseContactFilterParams.js';

export const getAllContacts = ctrlWrapper(async (req, res) => {
  const { _id: userId } = req.user;
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, ['name', 'phoneNumber', 'email']);
  const filter = parseContactFilterParams(req.query);

  const contacts = await contactServices.getContacts({
    userId,
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
});

export const getContactById = ctrlWrapper(async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(400, "Invalid contact ID format");
  }

  const contact = await contactServices.getContactById(userId, contactId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
});

export const createContact = ctrlWrapper(async (req, res) => {
  const { _id: userId } = req.user;
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createError(
      400,
      'Missing required fields: name, phoneNumber, or contactType',
    );
  }

  const newContact = await contactServices.createContact(userId, {
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });

  const contactWithoutVersion = newContact.toObject();
  delete contactWithoutVersion.__v;

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contactWithoutVersion,
  });
});

export const patchContact = ctrlWrapper(async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  const updatedContact = await contactServices.updateContact(userId, contactId, {
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
});

export const deleteContact = ctrlWrapper(async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;

  const deletedContact = await contactServices.deleteContact(userId, contactId);

  if (!deletedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
});
