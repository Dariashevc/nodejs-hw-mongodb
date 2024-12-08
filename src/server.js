import express from "express";
import cors from "cors";
import pino from "pino-http";
import {env} from "./utils/env.js";
import * as contactServices from "./services/contacts.js";


export const setupServer = () => {
    const app = express();

    app.use(cors());
    const logger = pino({
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true,
            }
        }
    });
    app.use(logger);

    
    app.get("/contacts", async (req, res) => {
        try {
            const contacts = await contactServices.getContacts();
            res.json({
                status: 200,
                message: "Successfully found contacts!",
                data: contacts
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: error.message,
            });
        }
    });

    
    app.get("/contacts/:contactId", async (req, res) => {
        const { contactId } = req.params; 
        try {
            const contact = await contactServices.getContactById(contactId);

            if (!contact) {
                return res.status(404).json({
                    status: 404,
                    message: 'Contact not found',
                });
            }

            res.json({
                status: 200,
                message: `Successfully found contact with id ${contactId}!`,
                data: contact,
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    });

  

    app.use((req, res)=>{
        res.status(404).json({
            message: `${req.url} not found`
        })

    });

    const port = Number(env("PORT", 3000)); 

    app.listen(port, ()=> console.log(`Server running on port ${port}`));
}