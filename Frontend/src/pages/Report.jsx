import React from "react";

const Report = () => {
  return (
    <div className="container" style={{ paddingTop: "6rem" }}>
      <h1>Global Styles Test</h1>

      <p>
        If background, text color, and spacing look correct,
        App.css is working.
      </p>

      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <button className="btn btn-primary">Primary Button</button>
        <button className="btn btn-outline">Outline Button</button>
      </div>

      <div
        className="bg-slate-900"
        style={{ marginTop: "2rem" }}
      >
        This is a global card style
      </div>
    </div>
  );
};

export default Report;
