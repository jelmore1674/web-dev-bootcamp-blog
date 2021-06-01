/** @format */

// Import Modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const _ = require('lodash');
const app = express();
const ejs = require('ejs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Check connection to mongoDB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('We connected to mongoDB');
});

// Create Schema
const postSchema = mongoose.Schema({
    title: String,
    body: String,
});

// Create Model
const Post = mongoose.model('Post', postSchema);

// Default Content
const homeStartingContent =
    'Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.';
const aboutContent =
    'Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.';
const contactContent =
    'Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.';

// Initialize EJS
app.set('view engine', 'ejs');
// Initialize bodyParser and set express to look directory files.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Create Root Page
const post = app.get('/', (req, res) => {
    Post.find({}, (err, posts) => {
        res.render('home', {
            homeContent: homeStartingContent,
            blogPosts: posts,
        });
    });
});

// Create Individual Post Page
app.get('/posts/:postName', (req, res) => {
    {
        Post.find({}, (err, posts) => {
            const reqName = _.lowerCase(req.params.postName);
            posts.forEach((post) => {
                const storeTitle = _.lowerCase(post._id);
                if (reqName === storeTitle) {
                    const title = post.title;
                    const body = post.body;
                    res.render('post', { postTitle: title, postBody: body });
                }
            });
        });
    }
});

// Create About Page
app.get('/about', (req, res) => {
    res.render('about', { homeContent: aboutContent });
});

// Create Contact page
app.get('/contact', (req, res) => {
    res.render('contact', { homeContent: contactContent });
});

// Create Compose Page
app.get('/compose', (req, res) => {
    res.render('compose');
});

// Compose Form, add to db.
app.post('/compose', (req, res) => {
    const postTitle = req.body.blogTitle;
    const postBody = req.body.blogContent;
    let post = new Post({
        title: postTitle,
        body: postBody,
    });
    post.save((err) => {
        if (!err) {
            res.redirect('/');
        }
    });
});

app.listen(3000, function() {
    console.log('Server started on port 3000');
});