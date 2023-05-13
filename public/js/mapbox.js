export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYmx1ZWpldCIsImEiOiJjbGdyNGRqdzkwOWR1M2VyenlvMnE0Z2Q1In0.u5x4QvCXQKFR40LZ5JvcBg';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/bluejet/clgr6g9bd001s01pdhclgacnr',
    scrollZoom: false,
    // center: [-118.113491, 34.111745],
    // zoom: 6,
    // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //create marker
    const el = document.createElement('div');
    el.className = 'marker';
    // add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extends map bounds to include sevveral locations
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
