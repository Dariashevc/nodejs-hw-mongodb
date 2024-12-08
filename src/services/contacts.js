
import Contacts from "../db/models/Contacts.js";

export const getContacts = async () => {
    try {
        const contacts = await Contacts.find();  
        return contacts;
    } catch (error) {
        throw new Error("Error fetching contacts");
    }
};

export const getContactById = async (contactId) => {
    try {
        const contact = await Contacts.findById(contactId);
        return contact;
    } catch (error) {
        throw new Error("Error fetching contact from database: " + error.message);
    }
};
