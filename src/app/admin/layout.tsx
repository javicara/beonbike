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

  // Si hay sesión y estamos en login, redirigir a admin (solo si es admin)
  if (session && pathname.includes("/admin/login")) {
    if (session.user.role === "admin") {
      redirect("/admin");
    }
  }

  // Si estamos en la página de login, mostrar sin sidebar
  if (!session) {
    return <>{children}</>;
  }

  // Verificar que el usuario sea admin
  if (session.user.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Acceso Denegado</h1>
          <p className="text-slate-400">No tienes permisos de administrador.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <AdminSidebar user={session.user} />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
