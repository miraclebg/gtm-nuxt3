import { defineNuxtPlugin } from "#app";
import { useRuntimeConfig, inject, useRouter, useHead } from "#imports";
const logSyle = "background: #2E495E;border-radius: 0.5em;color: white;font-weight: bold;padding: 2px 0.5em;";
export default defineNuxtPlugin(async (nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  const options = runtimeConfig.public.gtag;
  const { debug, autoInit, layer } = options;
  if (typeof options.id === "function") {
    options.id = await options.id();
  }
  const id = String(options.id);
  const initialized = { [id]: false };
  const $gtm = process.client ? gtmClient() : gtmServer();
  nuxtApp.hook("app:mounted", () => {
    if (options.pageTracking && process.client) {
      const router = useRouter();
      router.afterEach((to) => {
        setTimeout(() => {
          $gtm.push(
            //@ts-expect-error
            to.gtm || {
              routeName: to.name,
              pageType: "PageView",
              // pageUrl: options.routerBase + to.fullPath,
              pageUrl: to.fullPath,
              pageTitle: typeof document !== "undefined" && document.title || "",
              event: options.pageViewEventName
            }
          );
        }, 250);
      });
    }
  });
  if (autoInit) {
    $gtm.init();
  }
  inject("gtm", $gtm);
  function gtmClient() {
    return {
      init() {
        if (initialized[id] || !window._gtm_inject) {
          return;
        }
        window._gtm_inject(id);
        initialized[id] = true;
        log("init", id);
      },
      push(obj) {
        if (!window[layer]) {
          window[layer] = [];
        }
        window[layer].push(obj);
        log("push", obj);
      }
    };
  }
  function gtmServer() {
    const events = [];
    const inits = [];
    nuxtApp.hook("app:created", () => {
      if (!inits.length && !events.length) {
        return;
      }
      let gtmScript = `window['${layer}']=${JSON.stringify(events)};`;
      if (inits.length) {
        gtmScript += `;${JSON.stringify(
          inits
        )}.forEach(function(i){window._gtm_inject(i)})`;
      }
      useHead({
        script: [
          {
            id: `${options.scriptId}-ssr-events`,
            innerHTML: gtmScript
          }
        ]
      });
      if (options.noscript && inits.length) {
        const renderGtagIframe = (id2) => `<iframe src="${options.noscriptURL + "?id=" + id2 + "&" + options.queryString}" height="0" width="0" style="display:none;visibility:hidden" title="gtm"></iframe>`;
        useHead({
          noscript: [
            {
              id: `${options.scriptId}-ssr-noscript`,
              innerHTML: inits.map(renderGtagIframe).join(" ")
            }
          ]
        });
      }
    });
    return {
      init() {
        if (initialized[id]) {
          return;
        }
        inits.push(id);
        initialized[id] = true;
        log("init", id);
      },
      push(obj) {
        events.push(obj);
        log("push", JSON.stringify(obj));
      }
    };
  }
  function log(...args) {
    if (debug) {
      console.log("%cGTM", logSyle, ...args);
    }
  }
});
