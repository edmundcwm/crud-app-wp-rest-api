const url         = 'http://localhost:8888/restapi/wp-json/wp/v2/posts';
const btn         = $('#fetch-post');
const spinner     = '<img class="spinner" width="70" src="http://localhost:8888/restapiapp/assets/images/ajax-loader.gif" />';
const form        = $('#post-submit-form');
const postContent = $('#post-content');

(function() {
    const contentLimit = postContent.prop('maxLength');
    const contentCounter = $('#content-counter');

    contentCounter.html(`${contentLimit} characters remaining`);
    
    postContent.on('input', function() {
        //length of textarea content
        let length = postContent.val().length;
        //remaining characters allowed
        let remaining = contentLimit - length;
    
        if ( length > contentLimit ) {
            return false;
        }
    
        contentCounter.html(`${remaining} characters remaining`);
    });
})();

//Fetch Posts
btn.on('click', function(e) {
    const wrapper   = $('.post-wrapper');
    
    wrapper.html('');

    wrapper.append(spinner);

    //retrieve posts using WP REST API
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8888/restapi/wp-json/wp/v2/posts',
    })
    .done(function(response) {
        posts = getPost(response);
        wrapper.append(posts);
    })
    .fail(function(response) {
        console.log(response);
    })
    .always(function() {
        $('.spinner').remove();
    })
});

//Submit Post
form.on('submit', function(e) {
    e.preventDefault();
    
    form.append(spinner);

    const postData = {
        "title"   : `${$('#post-content').val().slice(0, 10)}...`,
        "content" : $('#post-content').val(),
        "status"  : "publish"
    }

    //create post using WP REST API
    $.ajax({
        method: 'POST',
        data: postData,
        url: 'http://localhost:8888/restapi/wp-json/wp/v2/posts',
        beforeSend: function ( xhr ) {
            xhr.setRequestHeader( 'Authorization', 'Basic ' + window.btoa('admin:password') );
        },
    })
    .done(function(response) {
        form.append('<p>Post successfully submitted</p>');
        btn.trigger('click');
        //empty textarea
        postContent.val('');
    })
    .fail(function(response) {
        console.log(response);
    })
    .always(function() {
        $('.spinner').remove();
    })
});

//Delete Post
$('body').on('click', '.delete-post', function() {
    const postID = $(this).data('id');

    //delete post using WP REST API
    $.ajax({
        method: 'DELETE',
        url: 'http://localhost:8888/restapi/wp-json/wp/v2/posts/' + $(this).data('id'),
        beforeSend: function(xhr) {
            xhr.setRequestHeader( 'Authorization', 'Basic ' + window.btoa('admin:password') );
        }
    })
    .done(function(response) {
        btn.trigger('click');
    })
    .fail(function(response) {
        console.log(response);
    })
});

//Update Post
$('body').on('click', '.edit-save-post', function() {

    //Edit mode
    if ( ! $(this).hasClass('edit-mode') ) {
        $(this).text('Save');
        $(this).siblings('.cancel-edit').show();
        $(this).addClass('edit-mode');

        convertToEditable($(this));
    } else {
        const newContent = $(this).siblings('.content-area').val();
        const postData = {
            "title": newContent,
            "content": newContent,
        }

        //cache the edit button
        const that = $(this);

        if ( ! newContent ) {
            console.log('please enter your content');
            return;
        }

        //disable textarea
        $(this).siblings('.content-area').prop('disabled', true);
        
        //update post using WP REST API
        $.ajax({
            method: 'POST',
            data: postData,
            url: 'http://localhost:8888/restapi/wp-json/wp/v2/posts/' + $(this).data('id'),
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Basic ' + window.btoa('admin:password'));
            }
        })
        .done(function(response) {
            that.text('Edit');
            that.siblings('.cancel-edit').hide();
            $('#fetch-post').trigger('click');
            convertToUneditable(that);

            //re-enable textarea
            $(this).siblings('.content-area').prop('disabled', false);
            console.log(response);
        })
        .fail(function(response) {
            console.log(response);
        })
    }    
});

//Cancel Edit
$('body').on('click', '.cancel-edit', function() {
    $(this).hide();
    $(this).siblings('.edit-save-post').removeClass('edit-mode').text('Edit');
    convertToUneditable($(this));
});

function getPost(posts) {
    let postListing = '';
    posts.forEach(post => {
        console.log(post);
        postListing += 
            `<div class="inner-post">
                ${post.content.rendered}
                <button type="button" class="delete-post" data-id=${post.id}>Delete</button>
                <button type="button" class="edit-save-post" data-id=${post.id}>Edit</button>
                <button type="button" class="cancel-edit is-inactive" data-id=${post.id}>Cancel</button>
            </div>`;
    });

    return postListing;
}

function convertToEditable(btn) {
    const content = btn.siblings('p').html();
    const editContent =`<textarea class="content-area">${content}</textarea>`;

    btn.siblings('p').replaceWith(editContent);
}

function convertToUneditable(btn) {
    const content = btn.siblings('textarea').html();
    const uneditedContent = `<p>${content}</p>`;

    btn.siblings('.content-area').replaceWith(uneditedContent);
}