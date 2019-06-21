const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    uuid: String,
    userId: String,
    name: String,
    email: String,
    age: Number,
    createdDate: { type: Date, default: Date.now }
});
const user = mongoose.model('userCollection', userSchema);
const port = process.env.PORT || 8080;
mongoose.connect('mongodb://localhost/userManagement',
    { useNewUrlParser: true }); // "userManagement" is the db name
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('db connected');
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let currentEditUser;

app.get('/', (req, res) => {
    res.render('new');
});

app.get('/listing', (req, res) => {
    user.find({}, (err, data) => {
        if (err) throw err;
        res.render('listing', { data });
    });
});

app.get('/edit/:uuid', (req, res) => {
    user.findOne({ uuid: req.params.uuid }, (err, data) => {
        currentEditUser = data.uuid;
        res.render('edit.pug', { data });
    });
});

app.get('/user/:name', (req, res) => {
    let userName = req.params.name;
    console.log(`GET /user/:name: ${JSON.stringify(req.params)}`);
    user.findOne({ name: userName }, (err, data) => {
        if (err) return console.log(`Oops! ${err}`);
        console.log(`data -- ${JSON.stringify(data)}`);
        let returnMsg = `user name : ${userName} email : ${data.email} userId : ${data.userId} age : ${data.age}`;
        console.log(returnMsg);
        res.send(returnMsg);
    });
});

app.post('/newUser', (req, res) => {
    const newUser = new user()
    newUser.uuid = `user${Math.floor(Math.random() * 1000)}`;
    newUser.userId = req.body.userId;
    newUser.name = req.body.name;
    newUser.email = req.body.email;
    newUser.age = req.body.age;
    newUser.save((err, data) => {
        if (err) {
            return console.error(err);
        }
        console.log(`new user save: ${data}`);
    });
    res.redirect('/listing');
});

app.post('/finished', (req, res) => {
    console.log(currentEditUser);
    let matchedName = currentEditUser;
    let newUserId = req.body.userId;
    let newName = req.body.name;
    let newEmail = req.body.email;
    let newAge = req.body.age;
    user.findOneAndUpdate({ uuid: matchedName }, { userId: newUserId, name: newName, email: newEmail, age: newAge },
        { new: true, useFindAndModify: false },
        (err, data) => {
            if (err) return console.log(`errer: ${err}`);
            let returnMsg = `uuid : ${matchedName}, has been updated. new data: ${newUserId, newName, newEmail, newAge}`;
            console.log(returnMsg);
            res.redirect('/listing');
        })
});

app.post('/delete/:uuid', (req, res) => {
    let deleteUser = req.params.uuid;
    user.findOneAndDelete({ uuid: deleteUser }, { useFindAndModify: false },
        (err, data) => {
            if (err) throw err;
            console.log(`${data.name} has been removed`);
            res.redirect('/listing');
        }
    )
})

app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`listening on port ${port}`);
});