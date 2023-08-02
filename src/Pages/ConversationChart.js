import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const ConversationChart = (props) => {
  const state = {
    series: [
      {
        name: 'Conversation',
        data: props?.data?.data,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'bar',
        toolbar: {
          show: true,
          tools: {
            download: false,
          },
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val;
        },
        offsetY: 0,
        style: {
          fontSize: '18px',
          colors: ['#ffffff'],
        },
      },
      fill: {
        type: 'gradient',
        colors: ['#04BCFF', '#ffffff'],
        opacity: 0.9,
        gradient: {
          shadeIntensity: 0,
          type: 'vertical',
          opacityFrom: 1,
          opacityTo: 0.3,
          stops: [0, 100, 100],
        },
      },
      grid: {
        xaxis: {
          lines: {
            show: false,
          },
          labels: {
            style: {
              fontSize: '25px',
              fontWeight: 500,
            },
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
      xaxis: {
        categories: props?.data?.category,
        position: 'bottom',
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val;
          },
        },
      },
    },
  };

  return (
    <div className='react-chart'>
      <ReactApexChart options={state.options} series={state.series} type='bar' height={350} />
    </div>
  );
};

export default ConversationChart;
