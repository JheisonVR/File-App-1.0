'use client';
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignOutButton, useOrganization, useSession, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../../convex/_generated/api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files)=> files.length > 0, "Required")
})


export default function Home() {

  const session = useSession();
  const organization = useOrganization();
  const user = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })

  const fileRef = form.register("file");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }


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

      <Dialog>
        <DialogTrigger>Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload your file</DialogTitle>
            <DialogDescription>
             {/* data from our servers. */}
            </DialogDescription>
          </DialogHeader>
          
          <div >  
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Type a title..." {...field} />
                        </FormControl>
                        {/* <FormDescription>
                          This is your public display name.
                        </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="file"
                    render={() => (
                      <FormItem>
                        <FormLabel>File</FormLabel>
                        <FormControl>
                          <Input
                            type="file" {...fileRef} />
                        </FormControl>
                        <FormDescription>
                            {/* Your File */}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </div>
        </DialogContent>
      </Dialog>


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
