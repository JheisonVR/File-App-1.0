import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  file: defineTable({ name: v.string(), orgId: v.optional(v.string()) }).index(
    "by_orgId",
    ["orgId"]
  ),
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
  }),
  });