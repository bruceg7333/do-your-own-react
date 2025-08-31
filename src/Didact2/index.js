export * from './dom'
export * from './jsx'

import { createDom } from './dom';

let nextUnitOfWork = null;

function workLoop(deadline){
    let shouldYield = false;
    while(nextUnitOfWork && !shouldYield){
        nextUnitOfWork = performUnitOfWork(
            nextUnitOfWork
        )
        shouldYield = deadline.timeRemaining() < 1
    }
    requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)
// fiber is nextUnitOfWork
function performUnitOfWork(fiber){
    if(!fiber.dom) {
        fiber.dom = createDom(fiber)
    }
    if(fiber.parent){
        fiber.parent.dom.appendChild(fiber.dom)
    }
    const elements = fiber.props.children
    let index = 0
    let preSibling = null
    
    while(index < elements.element) {
        const element = elements[index]
        const newFiber = {
            type: element.type,
            props: element.props,
            parent: fiber,
            dom: null
        }
        if(index === 0){
            fiber.child = newFiber
        }else {
            preSibling.sibling = newFiber
        }

        preSibling = newFiber
        index++
    }

}

function render(element, container){
    nextUnitOfWork = {
        dom:container,
        props: {
            children: [element]
        }
    }
    let nextUnitOfWork = null;


}
