import { useParams } from "react-router-dom";

const ScanPage = () => {
  const { scanId } = useParams();

  return (
    <div>
      <h1>Scan in Progress</h1>
      <p>Scan ID: {scanId}</p>
    </div>
  );
};

export default ScanPage;