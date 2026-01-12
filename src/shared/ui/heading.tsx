interface HeadingProps {
  title: string;
  description: string;
}

export const Heading = ({ title, description }: HeadingProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
      <p className="text-muted-foreground text-xs md:text-sm">{description}</p>
    </div>
  );
};
