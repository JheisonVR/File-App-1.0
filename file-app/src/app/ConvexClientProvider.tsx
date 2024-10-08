"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {

  return( 
//   <ConvexProvider client={convex}></ConvexProvider>;
    <ClerkProvider publishableKey= {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            {/* <App /> */}
            {children}
        </ConvexProviderWithClerk>
    </ClerkProvider>

    )
}