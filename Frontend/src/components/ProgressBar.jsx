function ProgressBar({ value }) {
  return (
    <div
      style={{
        width: "100%",
        height: "14px",
        background: "#e0e0e0",
        borderRadius: "20px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${value}%`,
          height: "100%",
          background:
            value === 100
              ? "linear-gradient(90deg, #10b981c8, #00bf46)"
              : "linear-gradient(90deg, #ff4141, #f525009c)",
          borderRadius: "20px",
          transition: "all 0.5s ease",
        }}
      ></div>
    </div>
  );
}

export default ProgressBar;