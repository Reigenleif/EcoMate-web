import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { storageRouter } from "./routers/storage";
import { profileRouter } from "./routers/profile";
import { newsRouter } from "./routers/news";
import { flashCardRouter } from "./routers/flashcard";
import { marketPlaceRouter } from "./routers/marketplace";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  storage: storageRouter,
  profile: profileRouter,
  admin: createTRPCRouter({
    news: newsRouter,
    flashcard: flashCardRouter,
    marketplace: marketPlaceRouter,
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
