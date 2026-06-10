function ProgressBar({ value }) {
  return (
    <div
      style={{
        width: "100%",
        height: "12px",
        background: "#e0e0e0",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${value}%`,
          height: "100%",
          background: value === 100 ? "green" : "orange",
          transition: "0.4s",
        }}
      ></div>
    </div>
  );
}

export default ProgressBar;