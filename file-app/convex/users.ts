import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const createUser = internalMutation({
    args: { 
        tokenIdentifier: v.string(),
        name: v.string(),
        image: v.optional(v.string())

    },
    async handler(ctx, args) {
        await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            name: args.name,
            image: args.image
        })
    }

})