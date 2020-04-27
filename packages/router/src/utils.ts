import { ROUTE_PARAMETER_REGEXP, URL_FRAGMENT_REGEXP } from './constants';
import { Route, RouteParams, RouteComponent } from './types';

export const extractUrlParams = (route: Route, windowHash: string) => {
    const params: RouteParams = {}
    if (route.params && route.params.length === 0) {
      return {}
    }
    const matches = windowHash.match(route.testRegExp);

    matches?.shift();

    matches?.forEach((paramValue, index) => {
      const paramName = route.params[index];
      // @ts-ignore
      params[paramName] = paramValue;
    });
    return params
}

export const addRoute = (fragment: string, component: RouteComponent) => {

    const params: string[] = [];

    const parsedFragment = fragment.replace(
      ROUTE_PARAMETER_REGEXP,
      (_: any, paramName: string) => {
        params.push(paramName);
        return URL_FRAGMENT_REGEXP
      })
      .replace(/\//g, '\\/');

    return {
      testRegExp: new RegExp(`^${parsedFragment}$`),
      fragment,
      component,
      params
    }
}

export const navigateHash = (fragment: string) => window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + fragment;
export const navigateHistory = (path: string) => window.history.pushState(null, '', path);

export const noop = () => {}