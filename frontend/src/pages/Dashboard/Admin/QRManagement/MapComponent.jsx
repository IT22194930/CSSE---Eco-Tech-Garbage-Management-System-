import React, { useEffect, useState } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";

const TrackingMap = () => {
  const [marker, setMarker] = useState(null);
  const [map, setMap] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [routeLine, setRouteLine] = useState(null);

  // Destination coordinates (for example purposes, you can set your destination)
  const destination = { lat: 34.0522, lng: -118.2437 }; // Example: Los Angeles

  // Initialize the map
  useEffect(() => {
    const container = document.getElementById("map");

    if (container) {
      const initialMap = tt.map({
        key: "zpWMpFIL0L2YfyAwnfXY3PTNQezdw9RV",
        container: container,
        center: [0, 0], // Center initially at (0, 0)
        zoom: 15,
      });
      setMap(initialMap);

      return () => {
        initialMap.remove();
      };
    } else {
      console.error("Map container not found!");
    }
  }, []); // Dependency array is empty, so this runs once on mount

  // Handle location updates
  useEffect(() => {
    const updateLocation = (position) => {
      const { latitude: lat, longitude: lng } = position.coords;

      setLatitude(lat);
      setLongitude(lng);

      if (map) {
        // Update marker position
        if (!marker) {
          const newMarker = new tt.Marker().setLngLat([lng, lat]).addTo(map);
          setMarker(newMarker);
        } else {
          marker.setLngLat([lng, lat]);
        }

        map.setCenter([lng, lat]);

        // Request route from current location to destination
        getRoute(lat, lng, destination.lat, destination.lng);
      }
    };

    const handleError = (error) => {
      console.error("Error getting location:", error.message);
      setError(error.message);
    };

    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        updateLocation,
        handleError,
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 10000,
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      console.error("Geolocation is not supported by this browser.");
      setError("Geolocation is not supported by this browser.");
    }
  }, [map, marker]);

  // Function to get the route
  const getRoute = (startLat, startLng, endLat, endLng) => {
    const url = `https://api.tomtom.com/routing/1/calculateRoute/${startLat},${startLng}:${endLat},${endLng}/json?key=zpWMpFIL0L2YfyAwnfXY3PTNQezdw9RV`;

    console.log(url);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.routes.length > 0) {
          const route = data.routes[0];
          const geoJson = route.legs[0].points.map((point) => [
            point.longitude,
            point.latitude,
          ]);

          // Create a LineString to represent the route
          if (routeLine) {
            map.removeLayer(routeLine);
          }

          const lineLayer = {
            id: "route",
            type: "line",
            source: {
              type: "geojson",
              data: {
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: geoJson,
                },
              },
            },
            layout: {
              "line-cap": "round",
              "line-join": "round",
            },
            paint: {
              "line-color": "#888",
              "line-width": 6,
            },
          };

          map.addSource("route", lineLayer.source);
          map.addLayer(lineLayer);
          setRouteLine(lineLayer);
        } else {
          console.error("No routes found");
        }
      })
      .catch((error) => {
        console.error("Error fetching route:", error);
      });
  };

  // Check if latitude and longitude are valid before rendering the map
  if (latitude === null || longitude === null) {
    return <p>Loading your location...</p>;
  }

  return (
    <div>
      <h3>Vehicle Tracking Map</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div id="map" style={{ width: "100%", height: "500px" }}></div>
    </div>
  );
};

export default TrackingMap;
