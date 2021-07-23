<script>
import { Pie } from "vue-chartjs";
import axios from 'axios';
export default {
  extends: Pie,
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
    await axios.get('api/mng/chart/pieChart').then(res=>{
      for (var key in res.data) {
        this.labels.push(res.data[key].count);
        this.data.push(res.data[key]._id);
        }
    });
    
    this.gradient = this.$refs.canvas.getContext("2d").createLinearGradient(0, 0, 0, 450);
    this.gradient2 = this.$refs.canvas.getContext("2d") .createLinearGradient(0, 0, 0, 450);
    this.gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
    this.gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
    this.gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
    this.gradient2.addColorStop(0, "rgba(0, 231, 255, 0.9)");
    this.gradient2.addColorStop(0.5, "rgba(0, 231, 255, 0.25)");
    this.gradient2.addColorStop(1, "rgba(0, 231, 255, 0)");
    this.renderChart(
      {
        labels: this.data,
        datasets: [
          {
            backgroundColor: [this.gradient, this.gradient2, "#00D8FF"],
            data: this.labels
          }
        ]
      },
      { responsive: true, maintainAspectRatio: false }
    );
  }
};
</script>