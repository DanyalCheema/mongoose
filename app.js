const mongoos = require('mongoose');
const User = require('./models/User');
const express = require('express');
const app = express();
const bodyPaarser = require('body-parser');


//Middle ware
app.use(bodyPaarser.json());
app.use(bodyPaarser.urlencoded({ extended: true }));


mongoos.Promise = global.Promise;

mongoos.connect('mongodb://localhost:27017/mongoose');
mongoos.connection
    .on('open', () => {
        console.log("conected");
    })
    .on('error', (err) => {
        console.log(`could not connected`, err);
    })

app.get('/', (req, res) => {
    res.send('ROOT');
});



// Hard code methed to save data in mongoose

// app.post('/users', (req, res) => {

//     const newUser = new User({
//         firstName: 'Talha',
//         lastName: 'cheema',
//         isActive: 1
//     });
//});

// get data from external sourse and save

app.post('/users', (req, res) => {
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        isActive: req.body.isActive
    });

    newUser.save().then(saveData => {
        res.send('saved user successfully');
    }).catch(err => {
        res.status(404).send('USER NOT SAVED DUE TO.....');

    });

});

//Fetch Data

app.get('/users', (req, res) => {

    User.find({}).then(result => {
        res.send(result);
    })
})


//Patch and Put

// app.patch('/users/:id', (req, res) => {
//     const id = req.params.id;
//     const firstName = req.body.firstName;

//     User.findByIdAndUpdate({ _id: id }, { $set: { firstName: firstName } }, { new: true }).then(result => {
//         res.send(result);
//     })
// })



// app.put('/users/:id', (req, res) => {
//     const id = req.params.id;
//     const firstName = req.body.firstName;
//     const lastName = req.body.lastName;

//     User.findByIdAndUpdate(id, { $set: { firstName: firstName, lastName: lastName } }, { new: true }).then(result => {
//         res.send(result);
//     })
// })


//Other Put method

app.put('/users/:id', (req, res) => {

    User.findOne({ _id: req.params.id }).then(user => {
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;

        user.save().then(result => {
            res.send(result);
        }).catch(err => {
            console.log(err);
        });

    });
});


// DELETE data


// app.delete('/users/:id', (req, res) => {

//     User.findOne({ _id: req.params.id }).then(user => {
//         user.remove().then(result => {
//             res.send(`Deleted Data ${result}`);
//         }).catch(err => {
//             console.log(err);
//         });
//     });
// });


//      OTHER method

// app.delete('/users/:id', (req, res) => {
//     User.findByIdAndRemove(req.params.id).then(result => {
//         res.send(`User ${result.firstName} remove`);
//     }).catch(err => {
//         console.log(err);
//     });
// });


// ONE more way


app.delete('/users/:id', (req, res) => {
    User.remove({ _id: req.params.id }).then(result => {
        res.send(`User ${result.firstName} remove`);
    }).catch(err => {
        console.log(err);
    });
});





//one way
// newUser.save((err, dataSaved) => {
//     if (err) throw err;

//     console.log(dataSaved);
// })


//CREATING A PORT AND RUN A SERVER
const port = 4444 || process.env.PORT;
app.listen(port, () => {
    console.log(`Listening on ${port}`);
});