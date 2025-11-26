import { GripVertical, XCircle } from "lucide-react";

import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "./ui/input";
import { Component } from "@/modules/blogPosts/BlogPostCU";

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
  const deleteNewsComponent = (id: Component["id"]) => {
    const filteredComponents = components.filter((comp) => comp.id !== id);
    setComponents(filteredComponents);
  };

  return (
    <Card className="flex justify-between pt-6">
      <CardContent className="flex-grow">
        <CardTitle>{component.title}</CardTitle>
        <Input
          placeholder={component.content || "Type here..."}
          value={component.content}
          onChange={(e) => {
            const updatedComponents = components.map((comp) =>
              comp.id === component.id
                ? { ...comp, content: e.target.value }
                : comp
            );
            setComponents(updatedComponents);
          }}
          className="rounded-none border border-t-0 border-s-0 border-e-0 p-0 mt-2 focus-visible:ring-0 border-b"
        />
      </CardContent>
      <CardContent className="flex gap-3">
        <XCircle
          className="hover:cursor-pointer"
          onClick={() => deleteNewsComponent(component.id)}
        />
        <GripVertical />
      </CardContent>
    </Card>
  );
};

export default NewsComponent;
