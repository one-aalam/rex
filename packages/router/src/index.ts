import { Route } from './types';
import { NAV_SELECTOR, EVT_HISTORY_PUSH } from './constants';
import { extractUrlParams, addRoute, navigateHash, navigateHistory, noop, isRelative } from './utils';


export const createRouter: any = (options: any = { hash: false, routes: [], notFound: () => {} }) => {
  let _routes: Route[] = options.routes.map((route: any) => addRoute(route.fragment, route.component))
  let lastPathname: string;
  let notFoundComponent:any = options.notFound || noop;

  const navigate = (fragment: string) => !options.hash && !!(history.pushState) ? navigateHistory(fragment) : navigateHash(fragment) ;
  const getPath = () => {
    const { hash, pathname } = window.location;
    return (options.hash ? hash : (pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1): pathname)).replace('#', '') ;
  }
  const onLinkClickHandler = (e: any) => {
    const { target } = e;
    if (target && target.matches(NAV_SELECTOR)) {
      const navTo = target.attributes.href.value;
      if (isRelative(navTo)) {
        e.preventDefault();
        navigate(target.attributes.href.value)
      }
    }
  }

  const checkRoutes = () => {
    const pathname = getPath(); console.log(pathname)
    if (options.before && typeof options.before === 'function') {
      options.before({
        from: lastPathname,
        to: pathname
      })
    }
    if (lastPathname === pathname) {
      return
    }
    lastPathname = pathname;

    const currentRoute = _routes.find(route => {
      const { testRegExp } = route;
      return testRegExp.test(pathname);
    })

    if (!currentRoute) {
      notFoundComponent()
      return
    }
    const urlParams = extractUrlParams(currentRoute, pathname)

    currentRoute.component(urlParams);
    if (options.after && typeof options.after === 'function') {
      options.after({
        path: lastPathname,
        params: urlParams
      })
    }
  }

  const initHashRouting = () => {
    checkRoutes();
    window.addEventListener('hashchange', checkRoutes);
      if (!window.location.hash) { window.location.hash = '#/' }
  }

  const initHistoryRouting = () => {
    checkRoutes();
    document.addEventListener(EVT_HISTORY_PUSH, checkRoutes, false);
    window.onpopstate = checkRoutes;
  }

  const init = () => options.hash ? initHashRouting() : initHistoryRouting();

  return {
    navigate,
    start: () => {
      document.body.addEventListener('click', onLinkClickHandler);
      init()
    }
  }
}
