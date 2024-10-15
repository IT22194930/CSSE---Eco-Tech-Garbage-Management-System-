import React, { useEffect, useRef, useState } from "react";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import tt from "@tomtom-international/web-sdk-maps";

const MapComponent = () => {
  const mapContainer = useRef(null);
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    // Get current location using Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback location (optional)
          setCoordinates({ latitude: 37.7749, longitude: -122.4194 }); // San Francisco
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Fallback location (optional)
      setCoordinates({ latitude: 37.7749, longitude: -122.4194 }); // San Francisco
    }
  }, []);

  useEffect(() => {
    // Initialize the map only if coordinates are available
    if (coordinates.latitude && coordinates.longitude) {
      console.log("Initializing map with coordinates:", coordinates); // Log the coordinates
      const map = tt.map({
        key: "zpWMpFIL0L2YfyAwnfXY3PTNQezdw9RV", // Your TomTom API key
        container: mapContainer.current,
        style: "tomtom://vector/1/basic-main", // Map style
        center: [coordinates.longitude, coordinates.latitude], // Set the initial center of the map
        zoom: 14, // Set the initial zoom level
      });

      // Add a marker at the user's location
      new tt.Marker()
        .setLngLat([coordinates.longitude, coordinates.latitude]) // Set the longitude and latitude
        .addTo(map); // Add the marker to the map

      // Clean up on component unmount
      return () => map.remove();
    } else {
      console.log("Waiting for coordinates..."); // Log if coordinates are not yet available
    }
  }, [coordinates]); // Update map when coordinates change

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "400px" }} // Set the map container size
    />
  );
};

export default MapComponent;
