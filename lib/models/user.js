// /server/models/User.js
import pool from '../db';
import { hash } from 'bcrypt';

class User {
  static async findByEmail(email) {
    const query = 'SELECT * FROM admin WHERE email = ?';
    const values = [email];
    return new Promise((resolve, reject) => {
      pool.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  static async findById(id) {
    const query = 'SELECT * FROM admin WHERE id = ?';
    const values = [id];
    return new Promise((resolve, reject) => {
      pool.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });
  }

  static async createUser(name, email, password) {
    const query = 'INSERT INTO admin (name, email, password) VALUES (?, ?, ?)';
    const hashedPassword = await hash(password, 10);
    const values = [name, email, hashedPassword];

    return new Promise((resolve, reject) => {
      pool.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.insertId);
        }
      });
    });
  }

  static async fetchUsers() {
    const query = 'SELECT * FROM admin';
    return new Promise((resolve, reject) => {
      pool.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  static async deleteUser(userId) {
    const query = 'DELETE FROM admin WHERE id = ?';
    const values = [userId];

    return new Promise((resolve, reject) => {
      pool.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows);
        }
      });
    });
  }

  static async updateUser(userId, userData) {
    const { name, password } = userData;
    const hashedPassword = await hash(password, 10);
    const query = 'UPDATE admin SET name = ?, password = ? WHERE id = ?';
    const values = [name, hashedPassword, userId];

    return new Promise((resolve, reject) => {
      pool.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows);
        }
      });
    });
  }
}

export default User;