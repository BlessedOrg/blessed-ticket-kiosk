import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CardWrapper = ({ title, description, children }: any) => {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default CardWrapper;