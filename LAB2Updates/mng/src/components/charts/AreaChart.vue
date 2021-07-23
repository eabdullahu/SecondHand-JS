<script>
import { Line } from "vue-chartjs";
import axios from 'axios';
export default {
  extends: Line,
  data() {
    return {
      gradient: null,
      gradient2: null,
        labels: [],
        datasets: [],
        borderColors: ["#FC2525", "#05CBE1", "pink","blue","purple"],
        datasets_data: []
    };
  },
  options :{
    responsive: true,
    maintainAspectRatio: false,
    cutoutPercentage: 80,
    legend: {
      display: false
    },
    tooltips: {
      enabled: false
    },
    hover: {
      mode: false
    }
  },
  async mounted() {
      await axios.post('api/mng/chart/user_demography').then(res=>{
        console.log(res.data);
        this.labels = res.data.dates;
        this.datasets_data = res.data.datasets
    });
    this.gradient = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient2 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);

    this.gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
    this.gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
    this.gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

    function randomInteger(min, max) {
       return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    this.datasets_data.forEach(d => {
        this.datasets.push(
        {
            label: d.name,
            borderColor: this.borderColors[randomInteger(0,5)],
            pointBackgroundColor: "white",
            borderWidth: 1,
            pointBorderColor: "white",
            backgroundColor: this.gradient[randomInteger(0,2)],
            data: d.data,
        })
    })
    this.renderChart(
      {
        labels: this.labels,
        datasets: this.datasets
      },
      { responsive: true, maintainAspectRatio: false }
    );
  }
};
</script>
