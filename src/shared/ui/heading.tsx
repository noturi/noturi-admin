interface HeadingProps {
  title: string;
  description: string;
}

export const Heading = ({ title, description }: HeadingProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
      <p className="line-clamp-1 text-xs break-all text-muted-foreground md:text-sm">{description}</p>
    </div>
  );
};
