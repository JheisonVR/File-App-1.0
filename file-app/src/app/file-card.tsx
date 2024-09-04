import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Doc } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";

const FileCard = ( { file }: {file: Doc<"files"> }  ) => {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle> {file.name} </CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      {/* <CardContent>
        <p>Card Content</p>
      </CardContent> */}
      <CardFooter>
        {/* <p>Card Footer</p> */}
        <Button>Download</Button>
      </CardFooter>
    </Card>
  );
};

export default FileCard