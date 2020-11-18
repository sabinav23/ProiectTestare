const userDatastore = require("../user/user.dataStore");
const postDatastore = require("./post.datastore");
const commentDatastore = require("../Comments/comment.datastore");

const postManager = {

    getAll: (success, fail) => {
        postDatastore.getAll(success, fail);
    },
    getById: (id, success, fail) => {
        postDatastore.getById(id, success, fail);
    },
    create: (value, success, fail) => {
        postDatastore.create(value, success, fail);
    },
    updateById: (id, newPost, success, fail) => {
        postDatastore.updateById(id, newPost, success, fail);
    },
    manageLikePost: (userId, postId, success, fail) => {
        postDatastore.getPostById(
            postId,
            (post) => {
                if (post && post._id) {
                    userDatastore.findUserById(userId,
                        (user) => {
                            if (user && user._id) {
                                let found = false;
                                for (let i = 0; i < user.likedPosts.length; i++) {
                                    if (user.likedPosts[i]._id.equals(postId)) {
                                        user.likedPosts.splice(i, 1);
                                        // Decrement number of likes of the post
                                        post.likes--;
                                        found = true;
                                        break;
                                    }
                                }
                                if (!found) {
                                    user.likedPosts.push(post._id);
                                    // Increment number of likes of the post
                                    post.likes++;
                                }

                                userDatastore.updateById(user._id, user, (newUser) => {
                                    postDatastore.updateById(post._id, post, (newPost) => {
                                        success(newPost);
                                    }, () => {
                                        fail({error: "SERVER_ERROR"});
                                    });
                                }, () => {
                                    fail({error: "SERVER_ERROR"});
                                });

                            } else {
                                fail({error: "USER_NOT_FOUND"});
                            }
                        },
                        (error) => {
                            fail({error: "SERVER_ERROR"});
                        })
                } else {
                    fail("POST_NOT_FOUND");
                }
            },
            (error) => {
                fail({error: "SERVER_ERROR"});
            })
    },
    deleteOne: (postId, success, fail) => {
        postDatastore.remove(postId, (data) => {
            commentDatastore.removeManyByPostId(postId, (rez) => {
                success(rez);
            }, (error) => {
                faild({error: "SERVER_ERROR_DEL_MANY_COMMS"});
            })
        }, (error) => {
            fail({error: "SERVER_ERROR_DEL_POST"});
        })
    }
}

module.exports = postManager;