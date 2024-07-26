import { createContext, useContext, useState } from "react";
import { faker } from "@faker-js/faker";



function createRandomPost() {
    return {
      title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
      body: faker.hacker.phrase(),
    };
  }


// 1) create context
const PostContext = createContext();

const PostProvider = ({children}) => {
    
    const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
    );
    const [searchQuery, setSearchQuery] = useState("");
    // Derived state. These are the posts that will actually be displayed
    const searchedPosts =
    searchQuery.length > 0
        ? posts.filter((post) =>
            `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
        : posts;

    function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
    }

    function handleClearPosts() {
    setPosts([]);
    }

    return(
         // 2)providing value for the context
        <PostContext.Provider value={{
            posts: searchedPosts,
            onAddPost: handleAddPost,
            onClearPosts: handleClearPosts,
            searchQuery,
            setSearchQuery,
        }}>
            {children}

        </PostContext.Provider>
    )
}

const usePosts = () => {
    const context = useContext(PostContext);
    if(context === undefined) throw new Error("context is used outside the context provider")
    return context;
}

export {PostProvider, usePosts};