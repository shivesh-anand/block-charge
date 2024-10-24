export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-10 md:py-10">
      <div className="text-center justify-center lg:w-4/12 md:8/12 w-full px-8">
        {children}
      </div>
    </section>
  );
}
