import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <header className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-2xl font-bold">yuzutube</h1>
        {/* 検索バーなどをここに追加 */}
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
};

export default Layout;
