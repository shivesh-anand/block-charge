export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-10 md:py-10">
      <div className="text-center justify-center w-full max-w-screen-md px-8">
        {children}
      </div>
    </section>
  );
}
