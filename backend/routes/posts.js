const express = require('express')
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const PostController = require('../controllers/posts');

const extractFile = require('../middleware/file')


// get
router.get("", PostController.getusers)

// get request for id persistent load in ui
router.get("/:id", PostController.getuser)

// post
router.post('', checkAuth, extractFile, PostController.getPosts)

//put
router.put("/:id", checkAuth, extractFile, PostController.getPost)

// delete
router.delete("/:id", checkAuth, PostController.deletePost)


// router.use('/api/posts', (req, res, next) => {
//     const posts = [
//         {
//             id: "fbururrrrfhrr",
//             title: "First Server-side post",
//             content: "This is coming from the server"
//         },
//         {
//             id: "bwburfrbiurru",
//             title: "Second server-side post",
//             content: "This is coming from the server!"
//         }
//     ];
//     res.status(200).json({
//         message: "Post fetched successfully!",
//         posts: posts
//     })
// })

module.exports = router;