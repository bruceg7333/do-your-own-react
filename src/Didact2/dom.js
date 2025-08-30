
const isProperty = key => key !== 'children'


export function render(element, container) {
    let dom = document.createElement(element.type)
    if(element.type === 'TEXT_ELEMENT') {
        dom = document.createTextNode("")
    }
    Object.keys(element.props)
        .filter(isProperty)
        .forEach(name => {
            dom[name] = element.props[name]
        })

    element.props.children.forEach(child => {
        render(child, dom)
    })

    container.appendChild(dom)
}