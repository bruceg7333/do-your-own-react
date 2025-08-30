import {updateDom, createDom} from "./dom"
let wipRoot
let hookIndex = null
let wipFiber = null
let loopCount = 0

function updateFunctionComponent(fiber){
  wipFiber = fiber
  hookIndex = 0
  wipFiber.hoos = []
  // invoke App(props), it returns h1 element
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}

export function updateHostComponent(fiber) {
  if(!fiber.dom){
     fiber.dom = createDom(fiber)
  }
  reconcileChildren(fiber,fiber.props.children)
}



let nextUnitOfWork = null

function performUnitOfWork(fiber) {
  
  const isFunctionComponent = fiber.type instanceof Function
  if(isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

    // if(!fiber.dom) {
    //     fiber.dom = createDom(fiber)
    // }

    //  this might be interrupted by browser, so that we may get an incomplete UI
    //  so we need to remove the part that mutates the DOM 
    //     instead, we'll keep track of the root of the fiber in render function
    //     which called progress root or wipRoot
    // if(fiber.parent) {
    //     fiber.parent.dom.appendChild(fiber.dom)
    // }

    const elements = fiber.props.children
    reconcileChildren(fiber, elements)

    if(fiber.child) {
        return fiber.child
    }

    let nextFiber = fiber

    while(nextFiber) {
        if(nextFiber.sibling) {
            return nextFiber.sibling
        }
        nextFiber = nextFiber.parent
    }
}


export function workLoop(deadline=0) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    console.log(wipRoot, 'loopCount', loopCount)
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    loopCount++

    // shouldYield = deadline.timeRemaining() < 1
  }
  if(!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  requestIdleCallback(()=>{
    // console.log('idleCallback')
    workLoop()
  })
}

function reconcileChildren(wipFiber, elements){
  let index = 0
  let prevSibling = null

  let oldFiber = wipFiber.alternate && wipFiber.alternate.child



  while(index < elements.length || oldFiber != null) {
      const element = elements[index]

      let newFiber = null

      const sameType = oldFiber && element && element.type === oldFiber.type

      if(sameType) {
        newFiber = {
          type: oldFiber.type,
          props: element.props,
          dom: oldFiber.dom,
          parent: wipFiber,
          alternate: oldFiber,
          effectTag: "UPDATE" // this tag will be used during the commit phase
        }
      }
      if(oldFiber && !sameType) {
        oldFiber.effectTag = "DELETION"
        deletions.push(oldFiber)
      }

      newFiber = {
          type: element.type,
          props: element.props,
          parent: wipFiber,
          dom: null
      }
      if(index === 0){
        wipFiber.child = newFiber
      } else {
          prevSibling.sibling = newFiber
      }

      prevSibling = newFiber
      index++
  }
}
let deletions = []
export function render(element, container) {
  deletions = []
    console.log('call render')
  // Inside the render, we create the root fiber, and set it as the **nextUnitOfWork**\
  // the rest of work will happen on the **performUnitOfWork**, there we
  //     will do three things for each fiber
  //             1. add the element to the DOM
  //             2. create the fibers for the element's children
  //             3. select the next unit of work


 wipRoot = {
    dom: container,
    props: {
        children: [element]
    },
    // a link to the old fiber, 
    // the fiber that we committed to the DOM in the previous commit phase
 
    alternate: currentRoot
  }
 nextUnitOfWork = wipRoot
 workLoop()
  
//   nextUnitOfWork = {
//     dom: container,
//     props: {
//         children: [element]
//     }
//   }

//   const dom = createDom();
//   container.append(dom);
}

/** 
 * save a reference to that "last fiber tree we committed to the DOM"
 * after we finish the commit
 * 
 */
let currentRoot = null  

function commitRoot() {
  deletions.forEach(commitWork)
    commitWork(wipRoot.child)
    currentRoot = wipRoot
    wipRoot = null
}

function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child, domParent)
  }
}

function useState(initialValue) {
  const oldHook = wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex]

  const hook = {
    state: oldHook ? oldHook.state : initialValue,
    queue: []
  }

  
  const actions = oldHook ? oldHook.queue : []
  actions.forEach(action => {
    hook.state = action(hook.state)
  })

  // useState also return a function to update the state
  const setState = action => {
    hook.queue.push(action)
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot
    }
    nextUnitOfWork = wipRoot
    deletions = []
  }

  wipFiber.hooks.push(hook)
  hookIndex++
  return [hook.state, setState]
}



function commitWork(fiber) {
    if(!fiber)return 

    let domParentFiber = fiber.parent
    while(!domParentFiber.dom) {
      domParentFiber = domParentFiber.parent
    }

    // const domParent = fiber.parent.dom
    const domParent = domParentFiber.dom

    if (
      fiber.effectTag === "PLACEMENT" &&
      fiber.dom != null
    ) {
      domParent.appendChild(fiber.dom)
    } else if (fiber.effectTag === "DELETION") {
      domParent.removeChild(fiber.dom)
    } else if (
      fiber.effectTag === "UPDATE" &&
      fiber.dom != null
    ) {
      updateDom(
        fiber.dom,
        fiber.alternate.props,
        fiber.props
      )
    }

    domParent.appendChild(fiber.dom)
    commitWork(fiber.child)
    commitWork(fiber.sibling)
}