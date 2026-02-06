import UnionLayout from '@/components/union/UnionLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UnionLayout>
      {children}
    </UnionLayout>
  );
}