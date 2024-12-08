import express from 'express';
import {
  getAllContacts,
  getContactById,
  createContact,
  patchContact,
  deleteContact,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';

import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getAllContacts));

router.get('/:contactId', isValidId, ctrlWrapper(getContactById));

router.post('/', upload.single('photo'), validateBody(createContactSchema), ctrlWrapper(createContact));

router.patch('/:contactId', isValidId,  upload.single('photo'), validateBody(updateContactSchema), ctrlWrapper(patchContact));

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

export default router;
