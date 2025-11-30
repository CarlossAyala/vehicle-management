export const TailwindDevtools = () => {
  return (
    <section className="bg-primary text-primary-foreground fixed top-2 left-1/2 z-[9999] flex -translate-x-1/2 items-center justify-center rounded px-2 py-1 font-mono text-xs leading-3">
      <span className="block sm:hidden">xs</span>
      <span className="hidden sm:block md:hidden">sm</span>
      <span className="hidden md:block lg:hidden">md</span>
      <span className="hidden lg:block xl:hidden">lg</span>
      <span className="hidden xl:block 2xl:hidden">xl</span>
      <span className="hidden 2xl:block">2xl</span>
    </section>
  );
};
