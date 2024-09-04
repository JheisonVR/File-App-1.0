import { ConvexError, v } from "convex/values"
import {mutation, MutationCtx, query, QueryCtx} from "./_generated/server"
import { getUser } from "./users";


export const generateUploadUrl = mutation(async (ctx)=>{
    const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new ConvexError("User not authenticated")
        }

    return await ctx.storage.generateUploadUrl()
})


async function hasAccesToOrg(ctx: QueryCtx | MutationCtx, orgId:string, tokenIdentifier:string){
    
    const user = await getUser(ctx, tokenIdentifier);
    
    const hasAccess = user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);

    return hasAccess;
}



export const createFile = mutation({
    args:{
        name: v.string(),
        fileId: v.id("_storage"),
        orgId: v.string()
    },
    async handler(ctx, args){
        // throw new Error("You have no access yet")

        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new ConvexError("User not authenticated")
        }

        const hasAccess = await hasAccesToOrg(ctx, args.orgId, identity.tokenIdentifier);

        if(!hasAccess){
            throw new ConvexError("You don't have permission to create a file in this organization")
        }

        await ctx.db.insert("files", {
            name: args.name,
            orgId: args.orgId,
            fileId: args.fileId

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
            .query("files")
            .withIndex('by_orgId', q=> q.eq("orgId", args.orgId))
            .collect()
    }
})