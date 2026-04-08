import AdminSidebar from '@/components/admin/admin-sidebar';
import AdminHeader from '@/components/admin/admin-header';
import AdminProtected from '@/components/admin/admin-protected';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtected>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <AdminHeader />
          </div>
          {children}
        </main>
      </div>
    </AdminProtected>
  );
}