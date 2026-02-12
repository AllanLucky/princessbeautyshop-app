import { LineChart } from "@mui/x-charts/LineChart";

const Charts = () => {
  
  return (
    <div className="w-full h-[400px] p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Monthly Sales</h2>
      <LineChart
          xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
          series={[{ data: [2, 5.5, 2, 8.5, 1.5, 5] }]}
          height={300}
        />
    </div>
  );
};

export default Charts;

