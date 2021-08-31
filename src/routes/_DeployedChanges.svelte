<script>
  export let data;

  import Line from 'svelte-chartjs/src/Line.svelte';
  import 'chartjs-adapter-moment';

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            min: 0,
            suggestedMax: 20
          }
        }
      ]
    }
  };
  const chartData = {
    labels: data.map((c) => c.x),
    datasets: [
      {
        label: 'Deployed changes',
        data: data.map((c) => c.y),
        fill: false,
        borderColor: 'rgb(75, 192, 192)'
      }
    ]
  };
</script>

<Line data={chartData} {options} />
