import React from 'react'
import ReactApexChart from "react-apexcharts";


function Graph() {

  const [example,setExample]=React.useState({
    series: [{
      name: "Highest",
      data: [44, 55, 41, 64, 22, 43, 21],
      color: '#6F42C1'
    }, {
      name: "Average",
      data: [53, 32, 33, 52, 13, 44, 32],
      color: '#007BFF'
    }, {
      name: "Median",
      data: [50, 3, 23, 25, 53, 94, 30],
      color:'#00CCCC'
    }
  ],
    options: {
      chart: {
        type: 'bar',
        height: 430
      },
      plotOptions: {
        bar: {
          vertical: true,
          dataLabels: {
            position: 'top',
          },
        }
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: '12px',
          colors: ['#fff']
        }
      },
      stroke: {
        show: true,
        width: 1,
        colors: ['#fff']
      },
      tooltip: {
        shared: true,
        intersect: false
      },
      xaxis: {
        categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
      },
    },
  });


  return (
    <>
      <h1>graph</h1>

      <ReactApexChart 
      options={example.options} 
      series={example.series} 
      type="bar" 
      height={430} />
    </>
  )
}

export default Graph;
