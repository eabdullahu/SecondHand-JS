<script>
import { Line } from "vue-chartjs";
import axios from 'axios';

export default {
  extends: Line,
   data(){
    return{
      labels:[],
      data:[]
    }
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
    await axios.get('api/mng/chart/lineChart').then(res=>{
        this.labels = res.data.labels;
        this.data = res.data.days;
    });

    this.renderChart(
      {
        labels: this.labels,
        datasets: [
          {
            label: "Orders",
            data: this.data,
            backgroundColor: "transparent",
            borderColor: "rgba(1, 116, 188, 0.50)",
            pointBackgroundColor: "rgba(171, 71, 188, 1)"
          }
        ]
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: "Last 7 days data"
        }
      }
    );
  }
};
</script>