import React from 'react';
import { TopBanner, Header, Footer } from './';
import FloatingButtons from './FloatingButtons';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <TopBanner />
      <Header />
      <main className="layout-main">
        {children}
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Layout;
