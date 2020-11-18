window.onload = init;

function init() {
    getUser();
    renderNavbar();
    sendGetAllPostsRequest();
    setPageEvents();
}

function sendGetAllPostsRequest() {
    $.ajax({
        url: 'http://localhost:3000/api/post/all',
        type: 'GET',
        success: function (result) {
            renderPosts(result, sendGetAllPostsRequest);
        },
        error: function (error) {
          toastr['error']('Failed to retrieve posts!', 'Error', toastrOptions);
        },
    });
}

function setPageEvents() {
    $('.btn-add-new').on('click', function () {
        checkPagePermission(() => {
            const postText = $('.post-input').val();

            if (postText.trim() != '') {
                sendAddPostRequest(postText);
            }
            $('.post-input').val('');
        });
    });
}

function sendAddPostRequest(postText) {

  const post = {
    text: postText,
    userId: activeUser._id
  }

  $.ajax({
    url: 'http://localhost:3000/api/post/',
    type: 'POST',
    data: JSON.stringify(post),
    contentType: "application/json; charset=utf-8",
    success: function (result) {
        toastr['success']('Post created successfully!', 'Success', toastrOptions);
        sendGetAllPostsRequest();
    },
    error: function (error) {
        toastr['error']('Failed to create new post!', 'Error', toastrOptions);
    }
  });
}

