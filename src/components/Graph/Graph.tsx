import { LineChart } from "@mui/x-charts";
import "./Graph.css";
export default function Graph({
  xAxis,
  yAxis,
  type,
  units,
  handleViewChange,
}: any) {
  return (
    <LineChart
      height={500}
      width={800}
      xAxis={[{ scaleType: "point", data: xAxis, label: type }]}
      series={[
        {
          data: yAxis,
          label: `Average Temperature (${units})`,
          area: true,
          color: "#6ea8e5",
        },
      ]}
      grid={{ vertical: true, horizontal: true }}
      onMarkClick={handleViewChange}
    />
  );
}
