import { jsx as u, Fragment as g } from "react/jsx-runtime";
import { useRef as w, useEffect as d, useLayoutEffect as p, useState as a } from "react";
var l = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, O = typeof l == "object" && l && l.Object === Object && l, v = typeof self == "object" && self && self.Object === Object && self;
O || v || Function("return this")();
var E = typeof window < "u" ? p : d;
function $(t, o, s, i) {
  const n = w(o);
  E(() => {
    n.current = o;
  }, [o]), d(() => {
    const r = window;
    if (!(r && r.addEventListener))
      return;
    const c = (f) => {
      n.current(f);
    };
    return r.addEventListener(t, c, i), () => {
      r.removeEventListener(t, c, i);
    };
  }, [t, s, i]);
}
function x({
  projectToken: t,
  onSucess: o,
  ssoDomain: s = "https://sso.baray.io",
  consumerDomain: i = window.location.origin
}) {
  const n = w(null), [r, c] = a(!0), [f, L] = a(!1), [b, m] = a(!1), [S, y] = a();
  return $("message", (e) => {
    e.origin === s && e.data.name === "login_status" && (L(e.data.isLogin), y(e.data.user), c(!1));
  }), d(() => {
    t && n && n.current && setTimeout(() => {
      n.current.contentWindow.postMessage({ name: "check" }, "*", []), m(!0);
    }, 500);
  }, [t, b, n]), d(() => {
    const h = new URLSearchParams(window.location.search).get("token");
    h && setTimeout(() => o(h), 100);
  }, [o]), {
    Detector: () => t ? /* @__PURE__ */ u(
      "iframe",
      {
        src: `${s}/?token=${t}&origin=${i}`,
        ref: n,
        hidden: !0
      }
    ) : null,
    LoadingSSO: (e) => r ? /* @__PURE__ */ u(g, { children: e.children }) : null,
    ConnectDetectedAccount: (e) => !r && f ? /* @__PURE__ */ u(g, { children: e.children(S, () => {
      n.current.contentWindow.postMessage(
        { name: "yes" },
        "*",
        []
      );
    }) }) : null,
    LoginWithSSO: (e) => !r && !f ? /* @__PURE__ */ u(g, { children: e.children(() => {
      window.location.replace(
        `${s}/?token=${t}&origin=${i}`
      );
    }) }) : null
  };
}
export {
  x as useSSO
};
