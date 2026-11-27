import Navigation from "@/components/admin/Navigation";

export default function EspaceAdmin({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col lg:flex-row">
      <Navigation />
      <div className="flex-1 lg:pl-64">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
