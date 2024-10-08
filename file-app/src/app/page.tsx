'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignOutButton, useOrganization, useSession, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
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
import { useToast } from "@/components/hooks/use-toast"
import { Loader2 } from "lucide-react";
import FileCard from "./file-card";

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files)=> files.length > 0, "Required")
})


export default function Home() {

  const { toast } = useToast();
  const session = useSession();
  const organization = useOrganization();
  const user = useUser();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })

  const fileRef = form.register("file");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    
    
    if (!orgId) return

    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: 'POST',
      headers: {"content-type": values.file[0].type},
      body: values.file[0]
    })
    
    const {storageId} = await result.json();

    try{
      await createFile({
        name: values.title,
        fileId: storageId,
        orgId,
      })
  
      form.reset();
      setIsFileDialogOpen(false);
  
      toast({
        variant: "default",
        title: "File uploaded",
        description: "Your file has been uploaded successfully"
      })

    }catch(e){
      toast({
        variant: "destructive",
        title: "Someting went wrong",
        description: `Communicate with the administrator error ${e}` 
      })
    } 
  }

  let orgId: string | undefined = undefined;
    
  if(organization.isLoaded && user.isLoaded ){
    orgId = organization.organization?.id ?? user.user?.id;
  }
  
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);


  const files = useQuery(
    api.files.getFiles, 
    orgId ? {orgId} : "skip"
  );
  const createFile= useMutation(api.files.createFile);


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {
        files?.map(file => {
          return (
            <FileCard key={file._id} file={file} />
          )
        })
      }

      <Dialog open={isFileDialogOpen} onOpenChange={ (isOpen) => {
        setIsFileDialogOpen(isOpen);
        form.reset();
      } }>
        <DialogTrigger>
          <Button>
            Upload File
          </Button>
        </DialogTrigger>
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
                  <Button type="submit"
                    disabled={form.formState.isLoading}
                    className="flex gap-2">
                    {form.formState.isSubmitting && ( 
                      <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                    )}
                    Submit
                  </Button>
                </form>
              </Form>
            </div>
        </DialogContent>
      </Dialog>


      {/* <Button onClick={()=>{ 
        console.log(identity)
        }
      }>
        Create File
      </Button> */}
    </main>
  );
}
