import {db} from "../db.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signUp = (req, res) => {
    const sql = "SELECT * FROM users WHERE username = ? OR email = ?";

    db.query(sql, [req.body.username, req.body.email], (err, data) => {
        if (err) return res.json(err);
        if (data.length) return res.status(409).json("Користувач вже існує");

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const sql = "INSERT INTO users(`username`, `email`, `password`) VALUES (?)";
        const values = [
            req.body.username,
            req.body.email,
            hash
        ]
        db.query(sql, [values], (err, data) => {
            if (err) return res.json(err);
            return res.status(200).json("User has been created!")
        })
    })
}

export const login = (req, res) => {
    const sql = "SELECT * FROM users WHERE username = ?";

    db.query(sql, [req.body.username], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(404).json("Користувача не знайдено");

        const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password);

        if (!isPasswordCorrect) return res.status(400).json("Некоректне ім'я користувача або пароль");

        const token = jwt.sign({_id: data[0]._id}, "jwtsecretkey");
        const {id, role, currency, ...otherData} = data[0];

        res.cookie("access_token", token, {
            httpOnly: true
        }).status(200).json({id, role, currency});
    })
}

export const logout = (req, res) => {
    res.clearCookie("access_token",{
        sameSite:"none",
        secure:true
    }).status(200).json("User has been logged out.")
};