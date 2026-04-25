export function adminPath(segment = "") {
  return `/${segment}`.replace(/\/+$/, "").replace("//", "/") || "/";
}

export function adminLoginPath() {
  return "/login";
}

export function userPath(segment = "") {
  return `/${segment}`.replace(/\/+$/, "").replace("//", "/") || "/";
}

export function userLoginPath(tenant = "cgu") {
  return `/${tenant}/login`;
}
