import React from "react";
import { Bar } from "react-chartjs-2";

const options = {
  maintainAspectRatio: false,
  responsive: false,
  indexAxis: "y",
  // Elements options apply to all of the options unless overridden in a dataset
  // In this case, we are setting the border of each horizontal bar to be 2px wide
  scales: {
    x: {
      display: false,
      grid: {
        display: false,
      },
      ticks: {
        stepSize: 1,
      },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        autoSkip: false,
        stepSize: 2,
      },
    },
  },
  elements: {
    bar: {
      borderWidth: 2,
      borderRadius: 100,
    },
  },
  plugins: {
    legend: {
      display: false,
      position: "right",
    },
    title: {
      display: false,
      text: "Chart.js Horizontal Bar Chart",
    },
  },
};

const areEqual = (prev, cur) => {
  return JSON.stringify(prev.data) == JSON.stringify(cur.data);
};

const BarChart = React.memo(({ getElementAtEvent, data }) => {
  return (
    <Bar
      data={data}
      options={options}
      style={{
        width: "80%",
        marginLeft: "auto",
        marginRight: "auto",
        overflow: "hidden",
      }}
    />
  );
}, areEqual);

export default BarChart;
