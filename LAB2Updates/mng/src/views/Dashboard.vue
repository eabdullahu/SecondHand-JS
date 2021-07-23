<template>
  <div>
    <div class="outterContainer">
        <div class="container m-t-20">
            <h4 class="title">Last week Sale & Posts</h4>
            <AreaChart/>
        </div>
        <div class="container m-t-20">
            <h4 class="title">Orders for the last 7 days</h4>
            <LineChart/>
        </div>
    </div>
    <div class="outterContainer">
       <div class="container m-t-20">
            <h4 class="title">Number of products for each category</h4>
            <PieChart/>
        </div>
        <div class="container m-t-20">
            <h4 class="title">All Products</h4>
            <BarChart/>
        </div>
    </div>
  </div>

</template>
<script>
import AreaChart  from "../components/charts/AreaChart";
import LineChart from "../components/charts/LineChart";
import PieChart from "../components/charts/PieChart"
import BarChart from "../components/charts/BarChart"
export default {

    name: "dashboard",
    components: {
        AreaChart,
        LineChart,
        PieChart,
        BarChart
    }


};
</script>
