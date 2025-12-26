import NewPassword from '@/components/user/newPassword';
import React from 'react';

export const metadata = {
  title: 'Reset Password',
};

interface Props {
  params: Promise<{ token: string }>; // ✅ params is a Promise
}

const Resetpage = async ({ params }: Props) => {
  const { token } = await params; // ✅ await params to extract token
  console.log('token from URL:', token);

  return <NewPassword token={token} />;
};

export default Resetpage;
