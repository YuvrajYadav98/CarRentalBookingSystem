const mongoose = require("mongoose");
const ApiError = require("./ApiError");
const asyncHandler = require("./asyncHandler");

// Generic CRUD handlers. Public reads return only `publicFilter` docs; admins can pass ?all=true.
module.exports = function crud({ Model, plural, singular, publicFilter = {}, sort = { createdAt: -1 } }) {
  const byKey = (k) => (mongoose.isValidObjectId(k) ? { _id: k } : { slug: k });
  const scope = (req) => (req.user?.role === "admin" && req.query.all === "true" ? {} : publicFilter);
  const notFound = () => new ApiError(404, `${singular} not found.`);
  return {
    list: asyncHandler(async (req, res) => {
      const all = req.user?.role === "admin" && req.query.all === "true";
      res.set("Cache-Control", all || !Object.keys(publicFilter).length ? "no-store" : "public, max-age=60");
      res.json({ [plural]: await Model.find(scope(req)).sort(sort).lean() });
    }),
    get: asyncHandler(async (req, res) => {
      const doc = await Model.findOne({ ...byKey(req.params.id), ...scope(req) }).lean();
      if (!doc) throw notFound();
      res.json({ [singular]: doc });
    }),
    create: asyncHandler(async (req, res) => res.status(201).json({ [singular]: await Model.create(req.body) })),
    update: asyncHandler(async (req, res) => {
      const doc = await Model.findOneAndUpdate(byKey(req.params.id), req.body, { new: true, runValidators: true });
      if (!doc) throw notFound();
      res.json({ [singular]: doc });
    }),
    remove: asyncHandler(async (req, res) => {
      const doc = await Model.findOneAndDelete(byKey(req.params.id));
      if (!doc) throw notFound();
      res.json({ message: `${singular} deleted.` });
    }),
  };
};
