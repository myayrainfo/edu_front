export function slugifyTenant(value = "") {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}
