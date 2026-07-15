function LoadingSpinner({ message = "Processing...", fullPage = true }) {
  if (!fullPage) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: 40 }}>
        <img src="/screen.svg" className="animate-spin" alt="Loading" style={{ width: 32, height: 32 }} />
        <span style={{ color: "#003c90", fontSize: 14, fontWeight: 500 }}>{message}</span>
      </div>
    );
  }

  return (
    <div className="loading-overlay">
      <img src="/screen.svg" className="animate-spin" alt="Loading" />
      <p>{message}</p>
    </div>
  );
}

export default LoadingSpinner;
