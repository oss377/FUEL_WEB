import AuthForm from '@/components/AuthForm';
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
           <AuthForm type="login" />
    </div>
  );
}