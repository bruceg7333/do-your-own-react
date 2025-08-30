### What is React Component
- a class or a function that outputs an element tree
    - if a function, it is what the function returns
    - if a class, it is the return value  of `render` function

- when we render out component in the JSX like `<App />`, React is in fact calling it **behind the scenes** 在后台调用它
    - if a function, react will directly call it with the assigned props
    _ if a class, React will create a new instance of the class and call its render method


### React Reconciliation
    - making changes to the DOM is quite demanding // it's very difficult to make changes 


### The Diffing algorithm assumptions
  1. Two elements of different types will produce different trees 
    - if the type of element changed, recreate the component
    - if just the props are changed, just update the props
  2. when we have a list of child elements which often changes, we should provide an unique **key** as a prop 


### Rendering

### React Fiber
  - Fiber focuses on animations and responsiveness
      - it has the ability to split work into chunks and prioritize tasks
      - pause work and come back to it later
      - reuse work or abort it if it's not needed

### Fiber Implementation
  - it's just a plain javascript object, that represents an unit of work
  - React processed **Fiber(unit of work)** and we end up with **FINISHED WORK**
  - This work is later **committed**, resulting in visible changes in the DOM
  - Two Phases
    - 1 **render** phase (processing)
    - 2 **commit** phase (committing)

  - **Render** Phase
    - this phase is **asynchronous**
    - tasks can be **prioritized**, work can be **paused**, even discarded
    - internal functions like **beginWork()** and **completeWork()** are being called
 - **Commit** Phase
    - **commitWork()** is being called
    - this phase is **Synchronous** and **cannot be interrupted**
- **Fiber Properties**
  - Fiber always has a 1-1 relationship with **something**
    - component instance, DOM node, etc.
  - type of something is stored inside the `tag` property,
    number from 0 to 24
  - the `stateNode` property holds the reference
  - **child**, **sibling**, **return**(Fiber relationships)
    - single child - reference to the first child
    - other children will be reference by sibling

div --(child)--> h1 --(sibling)--> h2 --(sibling)--> h3 
 ^                |                 |                 |
 |                |                 |                 |
 |                V                 V                 Y
 ^-<--------<--(return)             |                 |
 ^------<-----------<--(return)-----+                 |
 ^------<-----------<--(return)-----------------------+

- Aren't Fibers really similar to React Elements?
  - Fibers are often created from React Elements
  - They even share the `type` and `key` properties
  - While React elements are re-created every time, Fibers are being `reused` as often as possible
  - Most Fibers are created during the `initial mount`
    - `createFiberFromElement()  createFiberFromFragment() CreateFiberFromText()`

- What Exactly is **WORK**
  - **requestAnimationFrame()**: schedules a **high priority** function
  - **requestIdleCallback()**: schedules a **low priority** function





