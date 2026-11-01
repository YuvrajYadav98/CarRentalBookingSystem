const ApiError = require("../utils/ApiError");

module.exports = (schema) => (req, _res, next) => {
  const r = schema.safeParse(req.body);
  if (!r.success) {
    const details = {};
    for (const i of r.error.issues) details[i.path.join(".") || "body"] ||= i.message;
    return next(new ApiError(400, Object.values(details)[0], details));
  }
  req.body = r.data; // only validated, whitelisted fields continue
  next();
};
