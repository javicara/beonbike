import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Si no hay sesión y no estamos en login, redirigir a login
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  if (!session && !pathname.includes("/admin/login")) {
    redirect("/admin/login");
  }

  // Si hay sesión y estamos en login, redirigir a admin
  if (session && pathname.includes("/admin/login")) {
    redirect("/admin");
  }

  // Si estamos en la página de login, mostrar sin sidebar
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <AdminSidebar user={session.user} />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
