

const Post = require('../models/post'); 






// get all users
exports.getusers =  (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find()
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
    }

    postQuery.then(documents => {
        fetchedPosts=documents
        return Post.count();
        })
        .then(count => {
            res.status(200).json({
                message: "Post fetching Successful!",
                posts: fetchedPosts,
                maxPosts: count
        })
    })
    .catch(error => {
        res.status(500).json({
            message: "Fetching posts failed!"
        })
    })
}

// get single user
exports.getuser = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post)
        }
        else {
            res.status(404).json({
                message: "Not found!"
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Fetching post failed!"
        })
    })
}

// post 
exports.getPosts = (req, res, next) => {
    const url = req.protocol + "://" + req.get("host")
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post added successfully!',
            post: {
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath
            }
        })
    })
    .catch(error => {
        res.status(500).json({
            message: 'creating a post failed!'
        })
    })
}

// put
exports.getPost = (req,res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host")   
        imagePath = url + "/images/" + req.file.filename   
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        body: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    })
    console.log(post);
    Post.updateOne({_id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
        console.log(result);
        if (result.matchedCount > 0) {
            res.status(200).json({
                message: "Updated successfully!"
            })
        }
        else {
            res.status(401).json({
                message: " unauthorized to do the operation!"
            })
        }

    })
    .catch(error => {
        res.status(500).json({
            message: "couldnt update post!"
        })
    })
}

// delete
exports.deletePost = (req, res, next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId })
    .then(result => {
        console.log(result)
        if (result.deletedCount > 0) {
            res.status(200).json({
                message: "Post deleted!"
            })
        }
        else {
            res.status(401).json({
                message: "Unauthorized!"
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Delete of post failed!"
        })
    })
}