const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: false }));

let userList = [{
    uuid: 'user964',
    userId: 'hello123',
    name: 'john',
    email: 'john@abc.com',
    age: 30
},
{
    uuid: 'user245',
    userId: 'mikey12',
    name: 'mike',
    email: 'mike34@gmail.com',
    age: 19
}];
let currentEditUser;

app.get('/', (req, res) => {
    res.render('new');
});

app.get('/listing', (req, res) => {
    res.render('listing', { userList });
});

app.get('/edit/:uuid', (req, res) => {
    temp = userList.filter(user => user.uuid == req.params.uuid);
    currentEditUser = temp[0];
    res.render('edit.pug', { currentEditUser });
});

app.post('/listing', (req, res) => {
    userList.push({
        uuid: `user${Math.floor(Math.random() * 1000)}`,
        userId: req.body.userId,
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    });
    fs.writeFile('/userList.txt', userList, err => {
        if (err) throw err
    });
    res.render('listing');
});

app.post('/finished', (req, res) => {
    let obj = userList.find(user => user.uuid === currentEditUser.uuid);
    let index = userList.indexOf(obj);
    userList[index] = {
        uuid: currentEditUser.uuid,
        userId: req.body.userId,
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    }
    res.redirect('/listing');
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});