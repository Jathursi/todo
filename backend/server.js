
import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import jwt from 'jsonwebtoken'
const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the allowed HTTP methods
    credentials: true // Enable credentials (cookies, authorization headers, etc.)
  }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "Todo"
});
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.json({Message: "we need token please provide it."})
    } else {
        jwt.verify(token, "our-jsonwebtoken-secret-key", (err, decoded) =>{
            if(err) {
                return res.json({Message: "Authentication Error."})
    } else {
        req.userID = decoded.userID;
        req.name = decoded.name;
        next();
    }
 })
}
}
app.get('/', verifyUser, (req, res) => {
    return res.json({Status: "Success", name: req.name, userID: req.userID})
});
app.get('/list',  (req, res) => {
    const userID = req.query.userID; 
    const sql = "SELECT * FROM login WHERE userID = ?";
     db.query(sql,[userID],(err, data) => {
        if (err) {
            console.error('Error querying database:', err);
           res.status(500).json({ error: 'Internal server error' });
            return;
         }
         res.json(data);
     });
 });
 app.post('/list', (req, res) => {
    const sql = "INSERT INTO login (task, description, date, time, userID) VALUES (?, ?, ?, ?, ?)";
    console.log(req.body);
    const values = [
        req.body.task,
        req.body.description,
        req.body.date,
        req.body.time,
        req.body.userID, // Include name in the database query
    ];
    
    db.query(sql, values, (err, result) => {
        if (err)
            return res.json(err);
        
        const insertedId = result.insertId;
        // Fetch the inserted data from the database
        db.query("SELECT * FROM login WHERE ID = ?", [insertedId], (err, data) => {
            if (err)
                return res.json(err);

            const insertedData = data[0];
            res.json(insertedData); // Return the inserted data along with the response
        });
    });
});
app.delete('/delete/:id', (req, res) => {
    const sql = 'DELETE FROM login WHERE ID=?';
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting item:', err);
            return res.status(500).json({ Message: 'Error inside server' });
        }
        console.log('Item deleted successfully');
        return res.json(result);
    });
});
app.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const { task, description , date, time} = req.body;

    const sql = "UPDATE login SET task = ?, description = ?, date = ?, time = ? WHERE ID = ?";
    db.query(sql, [task, description, date, time, id], (err, result) => {
        if (err) {
            console.error('Error updating task:', err);
            res.status(500).json({ error: 'Internal server error' });
        return;
        }
        res.json({ message: 'Task updated successfully' });
    });
});
app.put('/updateComplete/:id', (req, res) => {
    const id = req.params.id;
    const { complete } = req.body;
    const sql = "UPDATE login SET complete = ? WHERE ID = ?";
    
    db.query(sql, [complete, id], (err, result) => {
        if (err) {
            console.error("Error updating completion status:", err);
            res.status(500).json({ error: "Error updating completion status" });
            return;
        }
        res.status(200).json({ message: "Task completion status updated successfully" });
    });
});
app.get('/Sign',  (req, res) => {
    const sql = "SELECT * FROM signup";
     db.query(sql,(err, data) => {
        if (err) {
            console.error('Error querying database:', err);
           res.status(500).json({ error: 'Internal server error' });
            return;
         }
         res.json(data);
     });
 });

app.post('/Sign',(req,res) =>{
    if (!req.body.name || !req.body.email || !req.body.password) {  // checking for empty input in textboxes
        return res.status(400).json({ error: "All fields are required" });
    }
    // Check if the email already exists
    const checkUseremailQuery = "SELECT * FROM signup WHERE `email`=?";
    db.query(checkUseremailQuery, [req.body.email], (err, existingAccount) => {
        if(err) {
            return res.status(500).json({ error: "Internal server error" });
        }
        if(existingAccount.length > 0) {
            return res.status(400).json({ error: "already have an account" });
        }        const sql = "INSERT INTO signup (`name`,`email`,`password`) VALUES (?)";    //insert your register values into the table login
        const values = [
            req.body.name,
            req.body.email,
            req.body.password
        ];
        db.query(sql,[values],(err,data) =>{     //Execute query
            if(err){
                return res.json("Error");
            }
            return res.json(data);
        });
    });
});
app.post('/Log', (req, res) => {
    const checkUseremailQuery = "SELECT * FROM signup WHERE `email`=?";
    db.query(checkUseremailQuery, [req.body.email], (err, existingAccount) => {
        if (err) {
            return res.status(500).json({ error: "Internal server error" });
        }
        if (existingAccount.length === 0) {
            return res.status(400).json({ error: "No account found with this email" });  }
        const sql = "SELECT * FROM signup WHERE `email`=? AND `password` =?";
        db.query(sql, [req.body.email, req.body.password], (err, data) => {
            if (err) {
                return res.status(500).json({ error: "Internal server error" });
            }
            if (data.length > 0) {
                const userID = data[0].userID;
                const name = data[0].name;
                const token = jwt.sign({userID: userID, name: name}, "our-jsonwebtoken-secret-key", {expiresIn: '1d'});
                res.cookie("token", token);
                return res.json({Status: "Success", token});
            } else {
                return res.json({Message: "no record exist" });
            }
        });
    });
});
app.listen(8081, () => {
    console.log("Running");
 });
 