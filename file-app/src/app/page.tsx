'use client';
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignOutButton, useOrganization, useSession, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../../convex/_generated/api";

export default function Home() {

  const session = useSession();
  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined = undefined;
  if(organization.isLoaded && user.isLoaded ){
    orgId = organization.organization?.id ?? user.user?.id;
  } 


  const files = useQuery(
    api.files.getFiles, 
    orgId ? {orgId} : "skip"
  );
  const createFile= useMutation(api.files.createFile);


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignedIn>
        <SignOutButton><Button>Sign Out</Button></SignOutButton>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal"><Button>Sign In</Button></SignInButton>
      </SignedOut>

      {
        files?.map(file => {
          return (
            <div key={file._id}>
              <p className="font-light">{file.name}</p> 
            </div>
          )
        })
      }

      <Button onClick={()=>{ 
        if (!orgId) return
        createFile({
          name: 'New File' ,
          orgId,
        })
        }
      }>
        Create File
      </Button>
      {/* <Button onClick={()=>{ 
        console.log(identity)
        }
      }>
        Create File
      </Button> */}
    </main>
  );
}
