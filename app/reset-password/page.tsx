import AuthForm from '@/components/AuthForm';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <AuthForm type="reset" />
    </div>
  );
}