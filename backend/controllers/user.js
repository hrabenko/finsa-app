import {db} from "../db.js";
import bcrypt from 'bcryptjs';

export const getUser = (req, res) => {
    const sql = "SELECT * FROM users WHERE id = ?";

    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(404).json("Користувача не знайдено");

        const {password, ...otherData} = data[0];

        return res.status(200).json(otherData);
    })
}

export const updateUser = (req, res) => {

    const sql = "SELECT * FROM users WHERE (username = ? OR email = ?) AND id != ?"

    db.query(sql, [req.body.username, req.body.email, req.body.id], (err, data) => {
        if (err) return res.json(err);
        if (data.length) return res.status(409).json("Користувач вже існує")

        const sql = "UPDATE users SET username = ?, email = ?, currency = ? WHERE id = ?"
        const values = [req.body.username, req.body.email, req.body.currency, req.body.id]

        db.query(sql, values, (err, data) => {
            if (err) return res.json(err);
            return res.status(200).json("Profile data have been changed");
        })
    })
}

export const updatePassword = (req, res) => {
    const sql = "SELECT * FROM users WHERE id = ?";

    db.query(sql, [req.body.id], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(404).json("Користувача не знайдено");

        const isPasswordCorrect = bcrypt.compareSync(req.body.currentPassword, data[0].password);

        if (!isPasswordCorrect) return res.status(400).json("Некоректний пароль");

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.newPassword, salt);

        const sql = "UPDATE users SET password = ? WHERE id = ?";

        db.query(sql, [hash, req.body.id], (err, data) => {
            if (err) return res.json(err);
            return res.status(200).json("Password has been changed!")
        })

    })
}

export const checkUser = (req, res) => {
    const sql = "SELECT * FROM users WHERE username = ?";

    db.query(sql, [req.params.username], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(404).json("Користувача не знайдено");

        const {password, id, ...otherData} = data[0];

        return res.status(200).json(id);
    })
}