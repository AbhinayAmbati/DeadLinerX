export default function SignOutButton() {
  return (
    <a href="/api/auth/sign-out" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 px-4 py-2 rounded-lg">
      Sign Out
    </a>
  );
} 