// Vehicles, Packages, Drivers share the same CRUD shape.
const express = require("express");
const crud = require("../utils/crud");
const validate = require("../middleware/validate");
const { protect, restrictTo, optionalAuth } = require("../middleware/auth");
const v = require("../validators/resources");

function build({ Model, plural, singular, schema, publicFilter, sort, publicRead = true }) {
  const r = express.Router();
  const h = crud({ Model, plural, singular, publicFilter, sort });
  const admin = [protect, restrictTo("admin")];
  if (publicRead) { r.get("/", optionalAuth, h.list); r.get("/:id", optionalAuth, h.get); }
  else { r.get("/", ...admin, h.list); r.get("/:id", ...admin, h.get); }
  r.post("/", ...admin, validate(schema), h.create);
  r.put("/:id", ...admin, validate(schema.partial ? schema.partial() : schema), h.update);
  r.delete("/:id", ...admin, h.remove);
  return r;
}

exports.vehicles = build({ Model: require("../models/Vehicle"), plural: "vehicles", singular: "vehicle", schema: v.vehicle, publicFilter: { isActive: true }, sort: { pricePerKm: 1 } });
exports.packages = build({ Model: require("../models/Package"), plural: "packages", singular: "package", schema: v.package, publicFilter: { isActive: true }, sort: { price: 1 } });
exports.drivers = build({ Model: require("../models/Driver"), plural: "drivers", singular: "driver", schema: v.driver, sort: { name: 1 }, publicRead: false });

exports.coupons = build({ Model: require("../models/Coupon"), plural: "coupons", singular: "coupon", schema: v.coupon, sort: { createdAt: -1 }, publicRead: false });
