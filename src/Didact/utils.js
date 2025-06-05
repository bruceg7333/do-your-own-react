export function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === "object" ? child : createTextElement(child);
      }),
    },
  };
}

function createDom(fiber) {
  // render React Element to Real DOM
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  const isProperty = (key) => key !== "children";
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = fiber.props[name];
    });
  fiber.props.children.forEach((child) => {
    render(child, dom);
  });
  return dom;
}

let nextUnitOfWork = null

function performUnitOfWork(fiber) {
    if(!fiber.dom) {
        fiber.dom = createDom(fiber)
    }

    //  this might be interrupted by browser, so that we may get an incomplete UI
    //  so we need to remove the part that mutates the DOM 
    //     instead, we'll keep track of the root of the fiber in render function
    //     which called progress root or wipRoot
    // if(fiber.parent) {
    //     fiber.parent.dom.appendChild(fiber.dom)
    // }

    const elements = fiber.props.children
    let index = 0
    let prevSibling = null

    while(index < elements.length) {
        const element = elements[index]
        const newFiber = {
            type: element.type,
            props: element.props,
            parent: fiber,
            dom: null
        }
        if(index === 0){
            fiber.child = newFiber
        } else {
            prevSibling.sibling = newFiber
        }

        prevSibling = newFiber
        index++
    }
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


function workLoop(deadline=0) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    // shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}
let wipRoot
export function render(element, container) {
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
    }
 }
 nextUnitOfWork = wipRoot
 workLoop()
 commitRoot()
  
//   nextUnitOfWork = {
//     dom: container,
//     props: {
//         children: [element]
//     }
//   }

//   const dom = createDom();
//   container.append(dom);
}

function commitRoot() {
    commitWork(wipRoot.child)
    wipRoot = null
}

function commitWork(fiber) {
    if(!fiber)return 

    const domParent = fiber.parent.dom
    domParent.appendChild(fiber.dom)
    commitWork(fiber.child)
    commitWork(fiber.sibling)
}