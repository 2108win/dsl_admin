import { Icons } from "../icons";

interface HeadingProps {
  icon?: keyof typeof Icons;
  title: string;
  description?: string;
}

export const Heading: React.FC<HeadingProps> = ({ icon, title, description }) => {
  const Icon = Icons[icon || "arrowRight"];
  return (
    <div>
      <div className="flex items-center">
        {icon && <Icon className="h-8 w-8 mr-2" />}
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
