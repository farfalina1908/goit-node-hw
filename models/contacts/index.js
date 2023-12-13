import fs from "fs/promises"
import path from "path"
import { nanoid } from "nanoid"

const contactsPath = path.resolve("models/contacts", "contacts.json")

const listContacts = async () => {
   const data = await fs.readFile(contactsPath)
   const contacts = JSON.parse(data)
   return contacts
}

const getContactById = async (contactId) => {
   const contacts = await listContacts()
   const result = contacts.find((item) => contactId === item.id)
   if (!result) {
      return null
   }
   return { result }
}

const removeContact = async (contactId) => {
   const contacts = await listContacts()
   const idx = contacts.findIndex((item) => contactId === item.id)

   if (idx === -1) {
      return null
   }
   const newContacts = contacts.filter((_, index) => index !== idx)

   await fs.writeFile(contactsPath, JSON.stringify(newContacts))

   return contacts[idx]
}

const addContact = async (name, email, phone) => {
   const contacts = await listContacts()
   const newContact = { id: nanoid(), name, email, phone }
   contacts.push(newContact)
   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))

   return newContact
}

const updateContact = async (contactId, body) => {
   const contacts = await listContacts()
   const idx = contacts.findIndex((contact) => contact.id === contactId)
   if (idx === -1) {
      return null
   }
   contacts[idx] = { ...contacts[idx], ...body }
   await fs.writeFile(contactsPath, JSON.stringify(contacts))
   return contacts[idx]
}

export default {
   listContacts,
   getContactById,
   removeContact,
   addContact,
   updateContact,
}
