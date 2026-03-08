interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

const SectionHeading = ({ title, subtitle, centered = true }: SectionHeadingProps) => (
  <div className={`mb-10 md:mb-14 ${centered ? "text-center" : ""}`}>
    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold uppercase">
      <span className="text-gradient">{title}</span>
    </h2>
    {subtitle && (
      <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
        {subtitle}
      </p>
    )}
  </div>
);

export default SectionHeading;
