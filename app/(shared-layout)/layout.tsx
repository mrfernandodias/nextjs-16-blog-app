import Navbar from '@/components/web/navbar';
import React from 'react';

const SharedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default SharedLayout;
