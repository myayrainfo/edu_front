export function withLeadingSlash(value = "") {
  return value.startsWith("/") ? value : `/${value}`;
}
