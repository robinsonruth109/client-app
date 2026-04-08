import ClientProtected from '@/components/client/client-protected';
import ClientBottomNav from '@/components/client/client-bottom-nav';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientProtected>
      <div className="min-h-screen bg-[#f3f3f3] pb-20">
        <div className="mx-auto min-h-screen max-w-md bg-[#f3f3f3]">
          {children}
        </div>
        <ClientBottomNav />
      </div>
    </ClientProtected>
  );
}