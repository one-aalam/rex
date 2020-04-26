export const h = (type:string, props: any, children: any) => ({
    type,
    props,
    children,
});

export const createElm = (type:string, props: any, ...children: any) => ({
    type,
    props: {
        ...props,
        children: children.map((child: any) => {
            typeof child === 'object' ? child : createElmText(child)
        })
    }
});

const createElmText = (text: any) => ({
    type: 'TEXT_ELEMENT',
    props: {
        nodeValue: text,
        children: []
    }
});

  export const mount = (vnode: any, container: any) => {
    const el = (vnode.el = document.createElement(vnode.type));
    for (const key in vnode.props) {
      el.setAttribute(key, vnode.props[key])
    }
    if (typeof vnode.children === 'string') {
      el.textContent = vnode.children;
    }else {
      vnode.children.forEach((child: any) => {
      mount(child, el) })
    }
    container.appendChild(el);
  }

  export function render(
      element: { type: string; props: { [x: string]: any; children: any[]; }; },
      container: { appendChild: (arg0: any) => void; }) {
    const dom: any = element.type == "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(element.type);
    const isProperty = (key: string) => key !== "children";
    Object.keys(element.props).filter(isProperty) .forEach(name => {
        dom[name] = element.props[name];
    })
    element.props.children.forEach(child => render(child, dom))
    container.appendChild(dom)
 }

  export const unmount = (vnode: any) => {
    vnode.el.parentNode.removeChild(vnode.el)
  }

  export const patch = (n2: any, n1: any) => {
    const el = (n2.el = n1.el);
    if (n1.type !== n2.type) {
      mount(n2, el.parentNode)
      unmount(n1)
    } else {
      if (typeof n2.children === 'string') {
        el.textContent = n2.children;
      } else {
        const c1 = n1.children;
        const c2 = n2.children;
        const commonLength = Math.min(c1.length, c2.length);
        for (let i = 0; i < commonLength; i++) {
          patch(c1[i], c2[i])
        }
        if (c1.length > c2.length) { c1.slice(c2.length).forEach((child: any) => {
          unmount(child) })
        }else if (c2.length > c1.length) { c2.slice(c1.length).forEach((child: any) => {
          mount(child, el) })
        }
      }
    }
  }