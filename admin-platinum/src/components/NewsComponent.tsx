import { GripVertical, Pencil, XCircle } from "lucide-react";

import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "./ui/input";
import { Component } from "@/modules/blogPosts/BlogPostCU";
import { useState } from "react";

type NewsComponentProps = {
  component: Component;
  components: Component[];
  setComponents: React.Dispatch<React.SetStateAction<Component[]>>;
};

const NewsComponent = ({
  component,
  components,
  setComponents,
}: NewsComponentProps) => {
  const [editedComponent, setEditedComponent] = useState<number>();
  console.log(editedComponent);

  const deleteNewsComponent = (id: Component["id"]) => {
    let tempArray = components.filter(
      (component: Component) => component.id !== id
    );
    setComponents(tempArray);
  };

  return (
    <Card className="flex justify-between pt-6">
      <CardContent>
        <CardTitle>{component.title}</CardTitle>
        <Input
          placeholder="Test"
          className="rounded-none border border-t-0 border-s-0 border-e-0 p-0 mt-2 focus-visible:ring-0 border-b disabled:border-none"
          disabled={editedComponent !== component.id}
        />
      </CardContent>
      <CardContent className="flex gap-3">
        <Pencil onClick={() => setEditedComponent(component.id)} />
        <XCircle onClick={() => deleteNewsComponent(component.id)} />
        <GripVertical />
      </CardContent>
    </Card>
  );
};

export default NewsComponent;
