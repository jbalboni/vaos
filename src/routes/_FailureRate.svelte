<script>
  export let data;
  import Line from 'svelte-chartjs/src/Line.svelte';
  import 'chartjs-adapter-moment';

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            min: 0
          }
        }
      ]
    }
  };

  const failureRate = data.bugs.map((b, i) =>
    data.changes[i].y ? b.y / data.changes[i].y : 0
  );
  const chartData = {
    labels: data.bugs.map((c) => c.x),
    datasets: [
      {
        label: 'Bug to change ratio',
        data: failureRate,
        fill: false,
        borderColor: 'rgb(75, 192, 192)'
      }
    ]
  };
</script>

<Line data={chartData} {options} />
