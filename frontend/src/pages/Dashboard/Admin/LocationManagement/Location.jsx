import React, { useEffect, useRef, useState } from "react";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import tt from "@tomtom-international/web-sdk-maps";

const LiveLocationMap = () => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [userCoordinates, setUserCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  // Function to detect if the device is mobile or tablet
  const isMobileOrTablet = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  // Get the user's current location
  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoordinates({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback location (San Francisco)
          setUserCoordinates({ latitude: 37.7749, longitude: -122.4194 });
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Fallback location (San Francisco)
      setUserCoordinates({ latitude: 37.7749, longitude: -122.4194 });
    }
  };

  // Initialize the map
  useEffect(() => {
    const mapInstance = tt.map({
      key: "zpWMpFIL0L2YfyAwnfXY3PTNQezdw9RV", // Your TomTom API key
      container: mapContainer.current,
      dragPan: !isMobileOrTablet(), // Disable drag on mobile/tablet
      zoom: 14, // Set initial zoom level
      center: [userCoordinates.longitude, userCoordinates.latitude], // Center the map on user's location
    });

    // Add Fullscreen and Navigation controls to the map
    mapInstance.addControl(new tt.FullscreenControl());
    mapInstance.addControl(new tt.NavigationControl());

    setMap(mapInstance);

    // Cleanup function to remove the map when component unmounts
    return () => mapInstance.remove();
  }, []);

  // Update the marker position whenever userCoordinates change
  useEffect(() => {
    if (map && userCoordinates.latitude && userCoordinates.longitude) {
      // Update the map center
      map.setCenter([userCoordinates.longitude, userCoordinates.latitude]);

      // Remove existing marker (if any)
      const existingMarker = document.getElementById("user-marker");
      if (existingMarker) {
        existingMarker.remove();
      }

      // Add a marker for the user's current location
      new tt.Marker({ element: createMarker() })
        .setLngLat([userCoordinates.longitude, userCoordinates.latitude])
        .addTo(map);
    }
  }, [map, userCoordinates]);

  // Create a marker element
  const createMarker = () => {
    const markerDiv = document.createElement("div");
    markerDiv.id = "user-marker";
    markerDiv.style.width = "20px";
    markerDiv.style.height = "20px";
    markerDiv.style.backgroundColor = "red"; // Customize the marker style
    markerDiv.style.borderRadius = "50%";
    markerDiv.style.boxShadow = "0 0 2px rgba(0,0,0,0.5)";
    return markerDiv;
  };

  // Update location every 5 seconds
  useEffect(() => {
    const interval = setInterval(updateLocation, 5000); // Update location every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div>
      <h3>Live Location Map</h3>
      <div
        ref={mapContainer}
        id="map"
        style={{ width: "100%", height: "500px", marginBottom: "20px" }}
      />
    </div>
  );
};

export default LiveLocationMap;
