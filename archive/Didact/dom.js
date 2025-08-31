export const isEvent = key => key.startsWith("on")

export const isProperty = (key) => key !== "children" && !isEvent(key);
export const isNew = (prev, next) => key =>
  prev[key] !== next[key]
export const isGone = (prev, next) => key => !(key in next)

export function createDom(fiber) {
    // render React Element to Real DOM
    const dom =
      fiber.type == "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(fiber.type);
    updateDom(dom, {}, fiber.props)
    // Object.keys(fiber.props)
    //   .filter(isProperty)
    //   .forEach((name) => {
    //     dom[name] = fiber.props[name];
    //   });
  //   fiber.props.children.forEach((child) => {
  //     render(child, dom);
  //   });
    return dom;
  }
  

export  function updateDom(dom, prevProps, nextProps){
  // remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => {
      !(key in nextProps) || isNew(prevProps, nextProps)(key)
    })
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.removeEventlistener(eventType, prevProps[name])
    })
    // then we add the new event handlers
    Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      console.log('event name', name)
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.addEventListener(
        eventType,
        nextProps[name]
      )
    })


    // remove old properties
    Object.keys(prevProps)
      .filter(isProperty)
      .filter(isGone(prevProps, nextProps))
      .forEach(name => {
        dom[name] = ""
      })
    // Set new or changed properties
    Object.keys(nextProps)
      .filter(isProperty)
      .filter(isNew(prevProps, nextProps))
      .forEach(name => {
        dom[name] = nextProps[name]
      })
  }