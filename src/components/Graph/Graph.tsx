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
      width={500}
      height={300}
      xAxis={[{ scaleType: "point", data: xAxis, label: type }]}
      series={[
        { data: yAxis, label: `Average Temperature (${units})`, area: true },
      ]}
      onMarkClick={handleViewChange}
    />
  );
}
