const express = require('express');
var cors = require('cors')
const multer = require('multer');
const upload = multer({
    dest: 'uploads/' // this saves your file into a directory called "uploads"
});

const app = express();

app.use(cors())

app.get('/', (req, res) => {
    console.log('hi')
    res.sendFile(__dirname + '/index.html');
});

// It's very crucial that the file name matches the name attribute in your html
app.post('/', upload.single('file-to-upload'), (req, res) => {
    res.send('done');
});

app.listen(8080);