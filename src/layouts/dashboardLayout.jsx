function DashboardLayout({ children, user }) {
  return (
    <div className="flex flex-col">
      <p>سلام عزیزم</p>
      <main>{children}</main>
      <p>خداحافظ عزیزم</p>
    </div>
  );
}

export default DashboardLayout;
