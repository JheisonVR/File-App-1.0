import { ConvexError, v } from "convex/values"
import {mutation, MutationCtx, query, QueryCtx} from "./_generated/server"
import { getUser } from "./users";


async function hasAccesToOrg(ctx: QueryCtx | MutationCtx, orgId:string, tokenIdentifier:string){
    
    const user = await getUser(ctx, tokenIdentifier);
    
    const hasAccess = user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);

    return hasAccess;
}



export const createFile = mutation({
    args:{
        name: v.string(),
        orgId: v.string()
    },
    async handler(ctx, args){

        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new ConvexError("User not authenticated")
        }

        const hasAccess = await hasAccesToOrg(ctx, args.orgId, identity.tokenIdentifier);

        if(!hasAccess){
            throw new ConvexError("You don't have permission to create a file in this organization")
        }

        await ctx.db.insert("file", {
            name: args.name,
            orgId: args.orgId

        })
    }
})

export const getFiles = query({
    args: {
        orgId: v.string(),
    },
    async handler(ctx, args){

        const identity = await ctx.auth.getUserIdentity();
         if(!identity){
            return []
         }

        const hasAccess = await hasAccesToOrg(ctx, args.orgId, identity.tokenIdentifier);

        if(!hasAccess){
            return []
         }

        return ctx.db
            .query("file")
            .withIndex('by_orgId', q=> q.eq("orgId", args.orgId))
            .collect()
    }
})