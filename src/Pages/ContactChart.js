import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const ContactChart = (props) => {
  const state = {
    series: [
      {
        name: 'Contact',
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
          fontSize: '20px',
          colors: ['#ffffff'],
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
              colorFrom: '#04BCFF',
              colorTo: '#FFFFFF',
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
        },
        yaxis: {
          lines: {
            show: false,
          },
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
      //   title: {
      //     text: 'Contact',
      //     floating: true,
      //     offsetY: 330,
      //     align: 'center',
      //     style: {
      //       color: '#444'
      //     }
      //   }
    },
  };

  return (
    <div className='react-chart'>
      <ReactApexChart options={state.options} series={state.series} type='bar' height={350} />
    </div>
  );
};

export default ContactChart;
