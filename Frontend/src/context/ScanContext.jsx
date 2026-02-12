import React, { createContext, useContext, useState } from "react";

const ScanContext = createContext(null);

export const ScanProvider = ({ children }) => {
  const [scanId, setScanId] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [SATSresults, SATSsetResults] = useState([]);
  return (
    <ScanContext.Provider
      value={{
        scanId,
        setScanId,
        SATSresults,
        SATSsetResults
      }}
    >
      {children}
    </ScanContext.Provider>
  );
};

/* Custom Hook (BEST PRACTICE) */
export const useScanContext = () => {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error("useScanContext must be used inside ScanProvider");
  }
  return context;
};
