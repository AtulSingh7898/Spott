// import { v } from "convex/values";
// import { query } from "./_generated/server";

// export const searchEvents = query({
//     args: {
//         query: v.string(),
//         limit: v.optional(v.number()),
//     },
//     handler: async (ctx, args) => {
//         if (!args.query || args.query.trim().length < 2) {
//           return [];
//     }
//     const now = Date.now();

//     const searchResults = await ctx.db
//       .query("events")
//       .withSearchIndex("search_title", (q) => q.search("title", args.query))
//       .filter((q) => q.gte(q.field("startDate"), now))
//       .take(args.limit ?? 5);

//     return searchResults;
//    }
// })
import { v } from "convex/values";
import { query } from "./_generated/server";

export const searchEvents = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const q = args.query.trim();

    if (q.length < 2) return [];

    const now = Date.now();

    const events = await ctx.db
      .query("events")
      .withSearchIndex("search_title", (index) =>
        index.search("title", q)
      )
      .filter((q) => q.gte(q.field("startDate"), now))
      .take(args.limit ?? 5);

    return events;
  },
});
