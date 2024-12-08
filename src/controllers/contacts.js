import * as contactServices from '../services/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import  httpErrors from 'http-errors';
import createError from 'http-errors';
import mongoose from "mongoose";
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseContactFilterParams } from '../utils/parseContactFilterParams.js';

export const getAllContacts = ctrlWrapper(async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  console.log('Request query:', req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, ['name', 'phoneNumber', 'email']);
  const filter = parseContactFilterParams(req.query);

  console.log('Sort params:', { sortBy, sortOrder });

  const contacts = await contactServices.getContacts({
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
  const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createError(400, "Invalid contact ID format");
}
  const contact = await contactServices.getContactById(contactId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
});

export const createContact = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    if (!name || !phoneNumber || !contactType) {
      throw httpErrors(
        400,
        'Missing required fields: name, phoneNumber, or contactType',
      );
    }

    const newContact = await contactServices.createContact({
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
  } catch (error) {
    next(error);
  }
};

export const patchContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  try {
    const updatedContact = await contactServices.updateContact(contactId, {
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
    });

    if (!updatedContact) {
      throw httpErrors(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const deletedContact = await contactServices.deleteContact(contactId);

    if (!deletedContact) {
      throw httpErrors(404, 'Contact not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
