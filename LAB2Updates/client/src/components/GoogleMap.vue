<template>
  <div>
    <div class="mapouter">
        <div class="gmap_canvas">
            <iframe width="600" height="600" id="gmap_canvas" src="https://maps.google.com/maps?q=prishtin&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'GoogleMap',
    data() {
        return {
            center: { lat: 45.508, lng: -73.587 },
        }
    },
    mounted() {
        this.geolocate();
    },
    methods: {
        geolocate: function() {
        navigator.geolocation.getCurrentPosition(position => {
            this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            };
        });
        },
    }, 
}
</script>