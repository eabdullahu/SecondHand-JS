<script>
import { Bar } from "vue-chartjs";
import axios from 'axios';
export default {
  extends: Bar,
  data() {
    return {
      gradient: null,
      gradient2: null,
      sold: 0,
      new : 0
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
    await axios.get('api/mng/chart/barChart').then(res=>{
        this.sold = res.data.stock[0].total;
        this.new = res.data.available[0].total
        
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

    this.gradient2.addColorStop(0, "rgba(0, 231, 255, 0.9)");
    this.gradient2.addColorStop(0.5, "rgba(0, 231, 255, 0.25)");
    this.gradient2.addColorStop(1, "rgba(0, 231, 255, 0)");

    this.renderChart(
      {
        labels: [
          "SOLD",
          "IN STOCK",
        ],
        datasets: [
          {
            label: "No.Products",
            borderColor: "#FC2525",
            pointBackgroundColor: "white",
            pointBorderColor: "white",
            backgroundColor: this.gradient,
            data: [this.sold, this.new,0]
          },
          
        ]
      },
      { responsive: true, maintainAspectRatio: false }
    );
  }
};
</script>
