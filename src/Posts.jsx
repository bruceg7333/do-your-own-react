import { useState,useEffect } from 'react'

export default function Posts() {
    const endpoint = 'https://jsonplaceholder.typicode.com/posts'
    const [posts, setPosts] = useState([])
  
    useEffect(() => {
      // setTimeout(() => {
        fetch(endpoint)
          .then(response => response.json())
          .then(data => setPosts(data))
          .catch(error => console.error('Error fetching posts:', error))
      // }, 3000)
    }, [])
  
  
    return (
      <div>
        <h1>Posts</h1>
        <ul>
          {posts.map(post => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      </div>
    )
  }
  