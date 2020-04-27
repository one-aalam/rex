import { Route } from './types';
import { NAV_SELECTOR, EVT_HISTORY_PUSH } from './constants';
import { extractUrlParams, addRoute, navigateHash, navigateHistory, noop, isRelative } from './utils';


export const createRouter: any = (options: any = { hash: false, routes: [], notFound: () => {} }) => {
  let _routes: Route[] = options.routes.map((route: any) => addRoute(route.fragment, route.component))
  let lastPathname: string;
  let notFoundComponent:any = options.notFound || noop;
  let _outlet = options.outlet

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


  // function animate(oldContent: any, newContent: any) {
  //   oldContent.style.position = 'absolute';

  //   oldContent.animate({
  //     opacity: [1, 0]
  //   }, 1000);

  //   var fadeIn = newContent.animate({
  //     opacity: [0, 1]
  //   }, 1000);

  //   fadeIn.onfinish = function() {
  //     oldContent.parentNode.removeChild(oldContent);
  //   };
  // }

  const checkRoutes = () => {
    const pathname = getPath();

    // @TODO: Emit custom events (pre)
    if (options.before && typeof options.before === 'function') {
      options.before({
        from: lastPathname,
        to: pathname
      })
    }
    if (lastPathname === pathname) {
      return
    }
    // const prevRoute = _routes.find(route => {
    //   const { testRegExp } = route;
    //   return testRegExp.test(lastPathname);
    // })
    lastPathname = pathname;
    const currentRoute = _routes.find(route => {
      const { testRegExp } = route;
      return testRegExp.test(pathname);
    })

    if (!currentRoute) {
      _outlet.innerHTML = notFoundComponent()
      return
    }
    const urlParams = extractUrlParams(currentRoute, pathname)

    // @TODO: Add route guards
    // @TODO: Check resolve cb presence for making API calls based on parameters

    var wrapper = document.createElement('div');
        // @ts-ignore
        wrapper.innerHTML = currentRoute.component(urlParams);

        // var oldContent = document.querySelector('.cc');
        // var newContent = wrapper.querySelector('.cc');

        _outlet.innerHTML = currentRoute.component(urlParams);
        // _outlet.appendChild(newContent);
        // if (oldContent) {
        //   animate(oldContent, newContent);
        // }

    // @TODO: Emit custom events (post routing)
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
