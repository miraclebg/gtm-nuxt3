import * as _nuxt_schema from '@nuxt/schema';

interface ModuleOptions {
    enabled: boolean;
    debug: boolean;
    id?: string | (() => Promise<string>);
    layer: string;
    variables: Record<string, string>;
    pageTracking: boolean;
    pageViewEventName: string;
    autoInit: boolean;
    respectDoNotTrack: boolean;
    scriptId: string;
    scriptDefer: boolean;
    scriptURL: string;
    crossOrigin: boolean;
    noscript: boolean;
    noscriptId: string;
    noscriptURL: string;
    queryString?: string;
}
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions>;

export { type ModuleOptions, _default as default };
