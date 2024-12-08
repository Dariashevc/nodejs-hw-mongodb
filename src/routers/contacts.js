import express from 'express';
import {
  getAllContacts,
  getContactById,
  createContact,
  patchContact,
  deleteContact,
} from '../controllers/contacts.js';

const router = express.Router();

router.get('/', getAllContacts);

router.get('/:contactId', getContactById);

router.post('/', createContact);

router.patch('/:contactId', patchContact);

router.delete('/:contactId', deleteContact);

export default router;
