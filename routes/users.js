const express = require('express');
const router = express.Router();

//const path = require("path");

const userController = require("../controllers/userController");
const authenticationService = require("../services/authentication");

router.use(authenticationService.authenticateJWT);

router.delete('/:id', userController.deleteUser);

router.get('/add', userController.addUser);
router.post('/add', userController.createUser);

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);

router.get('/:id/edit', userController.editUser);
router.post('/:id', userController.updateUser);



router.route('/tony/picture')
    // GET request for /tony/picture
    .get(function (req, res) {
        res.send('Received GET for tonys picture!');
    })
    // POST request for /tony/picture
    .post(function (req, res) {
        res.send('Received POST for tonys picture!');
    });

router.route('/:id/picture')
    .get(function (req, res) {
        let uId = req.params.id;

        const filename = uId + '.jpg';
        const options = {
            root: path.join(__dirname, '../uploads'),
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };
        res.sendFile(filename, options, function (err) {
            if (err) {
                console.log(err);
                res.status(err.status).end();
            }
            else {
                console.log('Sent:', filename);
            }
        });
    })
    .post(function (req, res) {
        try {
            if (!req.files) {
                res.send({
                    status: false,
                    message: 'No file uploaded'
                })
            } else {
                let picture = req.files.picture;

                let filename = './uploads/' + req.params.id + '.jpg';
                picture.mv(filename);
                console.log('File uploaded to ' + filename);

                res.send({
                    status: true,
                    message: 'File is uploaded',
                    data: {
                        name: picture.name,
                        mimetype: picture.mimetype,
                        size: picture.size
                    }
                });
            }
        } catch (err) {
            console.log(err);
        }
    });

module.exports = router;
