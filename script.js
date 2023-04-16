const postsList = document.querySelector('.posts__list');
const getPostsBtn = document.querySelector('.posts__get-posts');

const postTitle = document.querySelector('.new-post__title');
const postBody = document.querySelector('.new-post__body');
const addNewPost = document.querySelector('.new-post__add');


const URL = 'https://jsonplaceholder.typicode.com/posts?_limit=10';

const state = {
    posts: [],
    newPost: {
        title: '',
        body: '',
    },
    editPost: {},
}

const editPost = (index) => {
    const editeablePost = state.posts[index];
    state.editPost = editeablePost;  

    postTitle.value = state.editPost.title;
    postBody.value = state.editPost.body;
}

const deletePost = (index) => {
    const editeablePost = state.posts[index];
    removePostRequest(editeablePost.id)

    state.posts.splice(index, 1);

    fillPostsList(state.posts);
}

const cleanData = () => {
    state.newPost.title = "";
    state.newPost.body = "";

    postTitle.value = "";
    postBody.value = "";
}

postTitle.addEventListener('change', (e) => state.newPost.title = e.target.value);
postBody.addEventListener('change', (e) => state.newPost.body = e.target.value);

postTitle.addEventListener('change', (e) => {
    if(!!state.editPost.title) {
        return state.editPost.title = e.target.value;
    }
    return state.newPost.title = e.target.value;
})

postBody.addEventListener('change', (e) => {
    if (!!state.editPost.title){
        return state.editPost.body = e.target.value;
    }
    return state.newPost.body = e.target.value;
})

function updatePostRequest() {
    return fetch(`https://jsonplaceholder.typicode.com/posts/${state.editPost.id}`, {
        method: 'PUT',
        body: JSON.stringify(state.editPost),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(res => res.json())
        .then(data => data)
} 

function removePostRequest(id) {
    return fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'DELETE',
    })
} 

addNewPost.addEventListener('click', async (e) => {
    if(!!state.editPost.title || !!state.editPost.body){
        await updatePostRequest();
    } else {
        await createPostRequest();
    }
    await createPostRequest();
    fillPostsList(state.posts);
    cleanData();
})

function createPostRequest() {
    return fetch(URL, {
        method: 'POST',
        body: JSON.stringify(state.newPost),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(res => res.json())
        .then(post => state.posts.push(post))
} 

const createPost = (post, index) => `
    <div class="post">
        <div class="post__wrapper">
            <h1 class="wrapper__title">${post.title}</h1>
            <div class="wrapper__body">${post.body}</div>
        </div>
    </div>

    <div class="post__buttons">
        <button class="buttons__edit" onClick="editPost(${index})">Edit</button>
        <button class="buttons__delete" onClick="deletePost(${index})">Delete</button>
    </div>
`

const fillPostsList = (posts) => {
    postsList.innerHTML = "";

    if(posts.length){
        posts.forEach((post, index) => {
            postsList.innerHTML += createPost(post, index) 
        });
    };
};

getPostsBtn.addEventListener('click', async (e) => {
    await getPostsRequest();
    fillPostsList(state.posts);
});

function getPostsRequest(){
    return fetch(URL, {
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(res => res.json())
        .then(posts => state.posts = state.posts.concat(posts))
};






