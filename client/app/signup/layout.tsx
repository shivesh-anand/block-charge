export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-4 md:py-4">
      <div className="text-center justify-center lg:w-4/12 md:8/12 w-full px-8">
        {children}
      </div>
    </section>
  );
}
