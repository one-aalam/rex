import { Route } from './types';
import { TICKTIME, NAV_SELECTOR } from './constants';
import { extractUrlParams, addRoute, navigateHash, navigateHistory, noop } from './utils';


export const createRouter: any = (options: any = { hash: false, routes: [], notFound: () => {} }) => {
  let _routes: Route[] = options.routes.map((route: any) => addRoute(route.fragment, route.component))
  let lastPathname: string;
  let notFoundComponent:any = options.notFound || noop;

  const navigate = (fragment: string) => options.hash ? navigateHash(fragment) : navigateHistory(fragment);
  const getPath = () => {
    const { hash, pathname } = window.location;
    return (options.hash ? hash : pathname).replace('#', '') ;
  }
  const onLinkClickHandler = (e: any) => {
    e.preventDefault();
    const { target } = e;
    if (target && target.matches(NAV_SELECTOR)) {
      navigate(target.attributes.href.value)
    }
  }

  const checkRoutes = () => {
    const pathname = getPath();

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
  }

  const initHashRouting = () => {
    checkRoutes();
    window.addEventListener('hashchange', checkRoutes);
      if (!window.location.hash) { window.location.hash = '#/' }
  }

  const initHistoryRouting = () => {
    checkRoutes();
    window.setInterval(checkRoutes, TICKTIME)
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
