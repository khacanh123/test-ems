import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { Graph } from 'iconsax-react';
import { useState } from 'react';

const CardLineChart = () => {
  const [type, setType] = useState('day');
  // data of chart similar to v2, check the migration guide
  let base = +new Date(1968, 9, 3);
  let oneDay = 24 * 3600 * 1000;
  let date = [];

  let data = [Math.random() * 300];

  for (let i = 1; i < 20000; i++) {
    var now = new Date((base += oneDay));
    date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
    data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any, ticket: any, callback: any) {
        const format = `<p><span style='color: ${params[0].color}; font-weight: bold'>${params[0].value}</span> : ${params[0].seriesName}</p> <br/><p><span style='color: ${params[1].color}; font-weight: bold'>${params[1].value}</span> : ${params[1].seriesName}</p>`;
        return format;
      },
    },
    title: {
      show: false,
    },
    toolbox: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
      },
      {
        show: false,
      },
    ],
    series: [
      {
        name: 'Med organic reach',
        type: 'line',
        showSymbol: false,
        itemStyle: {
          color: 'rgb(255, 70, 131)',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(255, 158, 68, 0.692)',
            },
            {
              offset: 1,
              color: 'rgba(255, 158, 68, 0)',
            },
          ]),
        },
        data: [10, 11, 123, 11, 12, 12, 9, 55, 212, 12, 12, 12],
      },
      {
        name: 'High paid reach',
        type: 'line',
        showSymbol: false,
        itemStyle: {
          color: 'rgb(70, 212, 255)',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(117, 199, 253, 0.616)',
            },
            {
              offset: 1,
              color: 'rgba(117, 199, 253, 0)',
            },
          ]),
        },
        data: [20, 30, 50, 80, 100, 150, 130, 140, 150, 155, 150, 155],
      },
    ],
  };

  return (
    <>
      <div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-6 drop-shadow-df rounded'>
        <div className='rounded-t mb-0 px-4 py-3 bg-transparent'>
          <div className='flex flex-wrap justify-between items-center w-full font-[Be Vietnam Pro]'>
            <div className='relative w-full max-w-full flex flex-grow items-center flex-1'>
              <h6 className='uppercase bg-[#017EFA] w-min rounded-full p-2 mb-1 text-xs font-semibold'>
                <Graph size={20} color='white' />
              </h6>
              <h2 className='text-blueGray-700 text-xl pl-5 font-semibold'>
                Số lượng học sinh làm bài
              </h2>
            </div>
            <div className='flex items-center'>
              <p
                onClick={() => setType('day')}
                className={`mx-2 p-2 ${
                  type === 'day'
                    ? 'font-bold bg-ct-blue-100 text-ct-secondary rounded-md'
                    : 'text-ct-gray-400'
                }`}
              >
                Theo ngày
              </p>
              <p
                onClick={() => setType('month')}
                className={`mx-2 p-2 ${
                  type === 'month'
                    ? 'font-bold bg-ct-blue-100 text-ct-secondary rounded-md'
                    : 'text-ct-gray-400'
                }`}
              >
                Theo tuần
              </p>
              <p
                onClick={() => setType('year')}
                className={`mx-2 p-2 ${
                  type === 'year'
                    ? 'font-bold bg-ct-blue-100 text-ct-secondary rounded-md'
                    : 'text-ct-gray-400'
                }`}
              >
                Theo tháng
              </p>
            </div>
          </div>
        </div>
        <div className='p-4 flex-auto'>
          {/* Chart */}
          <div className='relative h-350-px'>
            <ReactECharts option={option} style={{ height: 400 }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CardLineChart;
