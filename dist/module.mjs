import { defu } from 'defu';
import { defineNuxtModule, createResolver, addPlugin } from '@nuxt/kit';

const dnt = "(function(w,n,d,m,e,p){w[d]=(w[d]==1||n[d]=='yes'||n[d]==1||n[m]==1||(w[e]&&w[e][p]&&w[e][p]()))?1:0})(window,navigator,'doNotTrack','msDoNotTrack','external','msTrackingProtectionEnabled')";
const module = defineNuxtModule({
  meta: {
    name: "gtm-nuxt3",
    configKey: "gtag"
  },
  // Default configuration options of the Nuxt module
  defaults: {
    enabled: true,
    debug: false,
    id: void 0,
    layer: "dataLayer",
    variables: {},
    pageTracking: false,
    pageViewEventName: "nuxtRoute",
    autoInit: true,
    respectDoNotTrack: false,
    scriptId: "gtm-script",
    scriptDefer: false,
    scriptURL: "https://www.googletagmanager.com/gtm.js",
    crossOrigin: false,
    noscript: true,
    noscriptId: "gtm-noscript",
    noscriptURL: "https://www.googletagmanager.com/ns.html"
  },
  async setup(options, nuxt) {
    if (typeof options.id === "function") {
      options.id = await options.id();
    }
    const query = {
      // Default is dataLayer for google
      l: options.layer !== "dataLayer" ? options.layer : void 0,
      ...options.variables
    };
    const queryString = Object.keys(query).filter((key) => query[key] !== null && query[key] !== void 0).map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`
    ).join("&");
    const injectScript = `var f=d.getElementsByTagName(s)[0],j=d.createElement(s);${options.crossOrigin ? "j.crossOrigin='" + options.crossOrigin + "';" : ""}j.${options.scriptDefer ? "defer" : "async"}=true;j.src='${options.scriptURL + "?id='+i" + (queryString ? `+'&${queryString}'` : "")};f.parentNode.insertBefore(j,f)`;
    const doNotTrackScript = ""; //options.respectDoNotTrack ? "if(w.doNotTrack||w[x][i])return;" : "";
    const initLayer = "w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'})";
    let script = `w[x]={};w._gtm_inject=function(i){${doNotTrackScript}w[x][i]=1;${initLayer};${injectScript};}`;
    if (options.autoInit && options.id) {
      script += `;w[y]('${options.id}')`;
    }
    script = `${dnt};(function(w,d,s,l,x,y){${script}})(window,document,'script','${options.layer}','_gtm_ids','_gtm_inject')`;
    script = `if(!window._gtm_init){window._gtm_init=1;${script}}`;
    const renderGtagIframe = (id) => `<iframe src="${options.noscriptURL + "?id=" + id + "&" + queryString}" height="0" width="0" style="display:none;visibility:hidden" title="gtm"></iframe>`;
    if (!nuxt.options.app.head.script) {
      nuxt.options.app.head.script = [];
    }
    nuxt.options.app.head.script.push({
      key: options.scriptId,
      innerHTML: script
    });
    if (options.noscript) {
      if (!nuxt.options.app.head.noscript) {
        nuxt.options.app.head.noscript = [];
      }
      nuxt.options.app.head.noscript.push({
        key: options.noscriptId,
        // pbody: true,
        innerHTML: options.id ? renderGtagIframe(options.id) : ""
      });
    }
    options.queryString = queryString;
    nuxt.options.runtimeConfig.public.gtag = defu(
      nuxt.options.runtimeConfig.public.gtag,
      options
    );
    const resolver = createResolver(import.meta.url);
    addPlugin(resolver.resolve("./runtime/plugin"));
  }
});

export { module as default };
