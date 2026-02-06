import ProtectedRoute from '@/components/ProtectedRoute';
// ... rest of the component

export default function ReportsPage() {
  return (
    <ProtectedRoute children={undefined}>
      {/* Your reports content */}
    </ProtectedRoute>
  );
}