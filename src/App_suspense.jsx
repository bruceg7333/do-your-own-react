import { Suspense } from 'react'
import './App.css'

// Create a resource for fetching posts
function createResource(asyncFn) {
  let status = 'pending'
  let result
  let suspender = asyncFn().then(
    (data) => {
      status = 'success'
      result = data
    },
    (error) => {
      status = 'error'
      result = error
    }
  )
  return {
    read() {
      if (status === 'pending') {
        throw suspender
      } else if (status === 'error') {
        throw result
      } else if (status === 'success') {
        return result
      }
    }
  }
}

// Create the posts resource
const postsResource = createResource(async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  return response.json()
})

function Posts() {
  const posts = postsResource.read()

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

function App() {
  return (
    <Suspense fallback={<div>Loading posts...</div>}>
      <Posts />
    </Suspense>
  )
}

export default App
