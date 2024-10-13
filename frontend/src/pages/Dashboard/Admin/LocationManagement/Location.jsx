import React, { useEffect, useState } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const TrackingMap = ({ userId }) => {
  const [marker, setMarker] = useState(null);
  const [map, setMap] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [routeLine, setRouteLine] = useState(null);
  const axiosSecure = useAxiosSecure();

  // Destination coordinates (example purposes)
  const destination = { lat: 34.0522, lng: -118.2437 }; // Los Angeles

  // Fetch user's garbage request by userId
  useEffect(() => {
    const fetchGarbageRequest = async () => {
      console.log("Fetching garbage request for user ID:", userId);

      try {
        // Adjust the endpoint to fetch the garbage request for the specific userId
        const response = await axiosSecure.get(
          `/api/garbageRequests?userId=${userId}`
        );

        // Ensure the response contains data
        if (response.data.length > 0) {
          const { latitude: lat, longitude: lng } = response.data[0]; // Assuming we get an array of requests

          // Log the latitude and longitude to the console
          console.log(`User Latitude: ${lat}, User Longitude: ${lng}`);

          setLatitude(lat);
          setLongitude(lng);

          if (map) {
            // Update marker position or add a new one if it doesn't exist
            if (!marker) {
              console.log("Creating a new marker on the map");
              const newMarker = new tt.Marker()
                .setLngLat([lng, lat])
                .addTo(map);
              setMarker(newMarker);
            } else {
              console.log("Updating marker position on the map");
              marker.setLngLat([lng, lat]);
            }

            // Center the map to the new location
            console.log("Centering map to:", { lng, lat });
            map.setCenter([lng, lat]);

            // Request route from current location to destination
            console.log(
              "Requesting route from:",
              { lat, lng },
              "to destination:",
              destination
            );
            getRoute(lat, lng, destination.lat, destination.lng);
          }
        } else {
          console.error("No garbage requests found for this user.");
          setError("No garbage requests found for this user.");
        }
      } catch (error) {
        console.error("Error fetching garbage request:", error);
        setError("Unable to fetch location for the provided user.");
      }
    };

    if (userId) {
      fetchGarbageRequest();
    }
  }, [userId, map, marker, axiosSecure]);

  // Initialize the map after component has mounted
  useEffect(() => {
    if (!map) {
      const container = document.getElementById("map");
      if (container) {
        console.log("Initializing map...");
        const initialMap = tt.map({
          key: "zpWMpFIL0L2YfyAwnfXY3PTNQezdw9RV", // Insert your TomTom API key here
          container: container,
          center: [0, 0], // Initial center of the map (you can change this if needed)
          zoom: 15,
        });
        setMap(initialMap);

        return () => {
          console.log("Cleaning up map...");
          initialMap.remove(); // Clean up the map on unmount
        };
      } else {
        console.error("Map container not found!");
      }
    }
  }, [map]);

  // Function to get the route
  const getRoute = (startLat, startLng, endLat, endLng) => {
    const url = `https://api.tomtom.com/routing/1/calculateRoute/${startLat},${startLng}:${endLat},${endLng}/json?key=zpWMpFIL0L2YfyAwnfXY3PTNQezdw9RV`;

    console.log("Fetching route from TomTom API with URL:", url);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.routes.length > 0) {
          const route = data.routes[0];
          const geoJson = route.legs[0].points.map((point) => [
            point.longitude,
            point.latitude,
          ]);

          console.log("Route fetched successfully:", geoJson);

          // Remove existing routeLine if it exists
          if (routeLine) {
            console.log("Removing existing route line from the map");
            map.removeLayer("route");
            map.removeSource("route");
          }

          // Create a LineString to represent the route
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

          console.log("Adding route line to the map");
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

  return (
    <div>
      <h3>Vehicle Tracking Map</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div
        id="map"
        style={{
          width: "100%",
          height: "500px",
          position: "relative",
        }}
      ></div>
    </div>
  );
};

export default TrackingMap;
