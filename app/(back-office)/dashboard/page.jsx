import { redirect } from 'next/navigation';

export default function DashboardPage() {
  redirect('/dashboard/home/overview');
  
  // This part will not be rendered because of the redirect
  return null;
} 