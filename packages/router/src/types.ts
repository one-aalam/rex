export type RouteParams = {[x: string]: any; }

export type RouteComponent = (x: RouteParams) => void

export type RouterConfig = {
    useHash: boolean,
    root: string,
    routes: []
}

export type Route = {
  params: RouteParams,
  fragment: string,
  component: RouteComponent,
  testRegExp: RegExp
}

export type Router = Route[];