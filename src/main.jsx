
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createElement,render } from './Didact2'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


// function Counter() {
//   const [state, setState] = Didact.useState(1)
//   return (
//     <h1 onClick={() => setState(c => c + 1)}>
//       Count: {state}
//     </h1>
//   )
// }
// const element = <Counter />



// function App(props){
//   return <h1>hello {props.name}</h1>
// }
// const element = <App name="foo" />

const eleUnit = <div style="background: salmon">
    <h1 onClick={()=>{console.log('click h1')}}>Hello World</h1>
    <h2 style="text-align:right">from Didact</h2>
  </div>



/**@jsx createElement */
const element = (
  <div style="background: salmon">
    <h1 onClick={()=>{console.log('click h1')}}>Hello World</h1>
    <h2 style="text-align:right">from Didact</h2>
  </div>
)

console.log("createElement outputs:", element)
const container = document.getElementById('root')
render(element, container)

 


