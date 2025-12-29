import { LineChart } from "@mui/x-charts/LineChart";

const Charts = () => {
  const xLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const salesData = [4000, 3000, 2000, 2780, 1890, 2390];

  return (
    <div style={{ width: "100%", height: 400 }}>
      <LineChart
        xAxis={[{ data: xLabels }]}
        series={[{ data: salesData, label: "Sales", color: "#e455c5" }]}
        width={600}
        height={400}
      />
    </div>
  );
};

export default Charts;
