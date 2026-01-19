import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Chart,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

Chart.defaults.borderColor = '#FFFFFF11';
Chart.defaults.color = '#FFFFFF';
Chart.defaults.font = {size: 12, family: 'monospace', style: 'normal', lineHeight: 1.2}

interface Props {
  title:    string;
  labels:   string[];
  datasets: SimpleDataset[];
}

interface SimpleDataset {
  label:  string;
  data:   number[];
  color:  string;
}

class ChartDataset {
  label:            string;
  data:             number[];
  borderColor:      string;
  backgroundColor:  string;
  borderWidth:      number;
  pointRadius:      number;
  tension:          number;
  constructor(d: SimpleDataset) {
    this.label            = d.label;
    this.data             = d.data;
    this.borderColor      = d.color;
    this.backgroundColor  = d.color;
    this.borderWidth      = 3;
    this.pointRadius      = 60 / this.data.length;
    this.tension          = 0.33;
  }
}

function GraphElement({title, labels, datasets}: Props) {

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        ticks: {
          callback: (val: any) => {
            if (val < 0) {
              return '-$' + (val * -1).toFixed(2);
            }
            return '$' + val.toFixed(2);
          }
        }
      }
    }
  };

  return (
    <Line 
      options = {options} 
      data = {{
        labels: labels,
        datasets: datasets.map((datasetProp) => new ChartDataset(datasetProp))
      }}
    />
  );
}

// datasets: [
//   {
//     label: 'Dataset 1',
//     data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
//     borderColor: 'rgb(255, 99, 132)',
//     backgroundColor: 'rgba(255, 99, 132, 0.5)',
//   },
//   {
//     label: 'Dataset 2',
//     data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
//     borderColor: 'rgb(53, 162, 235)',
//     backgroundColor: 'rgba(53, 162, 235, 0.5)',
//   },
// ],

export { GraphElement };
export type { SimpleDataset };