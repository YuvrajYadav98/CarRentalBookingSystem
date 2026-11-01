const slugify = (s) => String(s).toLowerCase().trim().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
// Mongoose plugin: derive a stable slug from `name` on first save.
const slugPlugin = (schema) => schema.pre("validate", function (next) { if (!this.slug && this.name) this.slug = slugify(this.name); next(); });
module.exports = { slugify, slugPlugin };
