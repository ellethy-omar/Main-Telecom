const { createPool } = require('mysql2/promise');
const DatabaseManager = require('../../shared/databaseManager');

const dbManager = new DatabaseManager(createPool);

class Contact {
  constructor(data) {
    this.phone = data.phone;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.company = data.company;
    this.position = data.position;
    this.notes = data.notes;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
  
  static async create(contactData) {
    try {
      const sql = `
        INSERT INTO contacts (phone, firstName, lastName, email, company, position, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        contactData.phone,
        contactData.firstName,
        contactData.lastName,
        contactData.email,
        contactData.company,
        contactData.position,
        contactData.notes,
      ];

      await dbManager.query(sql, values);
      return await Contact.findByPhone(contactData.phone);
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  static async findByPhone(phone) {
    try {
      const sql = `SELECT * FROM contacts WHERE phone = ?`;
      const [rows] = await dbManager.query(sql, [phone]);
      return rows.length ? new Contact(rows[0]) : null;
    } catch (error) {
      console.error('Error finding contact by phone:', error);
      throw error;
    }
  }

  static async findAll(limit = 50, offset = 0) {
    try {
      const sql = `
        SELECT * FROM contacts 
        ORDER BY lastName, firstName
        LIMIT ? OFFSET ?
      `;
      const [rows] = await dbManager.query(sql, [limit, offset]);
      return rows.map(row => new Contact(row));
    } catch (error) {
      console.error('Error retrieving all contacts:', error);
      throw error;
    }
  }

  static async update(phone, updatedData) {
    try {
      const sql = `
        UPDATE contacts
        SET firstName = ?, lastName = ?, email = ?, company = ?, position = ?, notes = ?, updatedAt = NOW()
        WHERE phone = ?
      `;
      const values = [
        updatedData.firstName,
        updatedData.lastName,
        updatedData.email,
        updatedData.company,
        updatedData.position,
        updatedData.notes,
        phone,
      ];

      const [result] = await dbManager.query(sql, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  static async updateNotes(phone, updatedNotes) {
    try {
      const sql = `
        UPDATE contacts
        SET notes = ?, updatedAt = NOW()
        WHERE phone = ?
      `;
      const values = [
        updatedNotes,
        phone,
      ];

      const [result] = await dbManager.query(sql, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating contact notes:', error);
      throw error;
    }
  }

  static async delete(phone) {
    try {
      const sql = `DELETE FROM contacts WHERE phone = ?`;
      const [result] = await dbManager.query(sql, [phone]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }

  async save() {
    return await Contact.update(this.phone, this);
  }
}

module.exports = Contact;