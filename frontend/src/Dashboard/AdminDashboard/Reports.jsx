import Sidebar from "./SideBar";
const Reports = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        width: "100%",
        background: "#f9f9f9",
        borderRadius: "16px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
        margin: "2rem 0",
      }}
    >
      <div className="fixed inset-y-0 left-0 z-40 md:relative md:z-auto">
        <Sidebar />
      </div>
      <span
        style={{
          fontSize: "3rem",
          fontWeight: 700,
          letterSpacing: "0.05em",
          color: "#222",
          marginBottom: "1rem",
        }}
      >
        Coming Soon
      </span>
      <span
        style={{
          fontSize: "1.25rem",
          color: "#666",
          fontWeight: 400,
          maxWidth: "600px",
          textAlign: "center",
        }}
      >
        The Reports feature is under development and will be available soon.
        Stay tuned for updates!
      </span>
    </div>
  );
};

export default Reports;
