maptilersdk.config.apiKey = mapToken;

const coordinates = listing.geometry.coordinates;

const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.STREETS,
  center: coordinates,
  zoom: 10,
});

new maptilersdk.Marker({ color: "#FE424D" })
  .setLngLat(coordinates)
  .addTo(map);