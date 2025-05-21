import React, { useState, useEffect } from "react";
import '../../styles/dispatcher_styles.css';
import NavBar from "../../components/NavBar";

function DispatcherDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(2); // Track how many incidents are loaded
  const token = localStorage.getItem("token");

  // In-memory cache to avoid redundant geocoding requests
  const locationCache = {};

  // Function to get location name using reverse geocoding with Nominatim API
  const getLocationName = async (lat, lon) => {
    const coordinatesKey = `${lat},${lon}`;

    // Check if we already have the location name cached
    if (locationCache[coordinatesKey]) {
      return locationCache[coordinatesKey];
    }

    try {
      // Log coordinates before making the API call
      console.log("Fetching location for coordinates:", lat, lon);

      // Ensure coordinates are within valid range
      if (Math.abs(lat) > 90 || Math.abs(lon) > 180) {
        return "Invalid coordinates";
      }

      // Try geocoding with the original order
      let response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      let data = await response.json();

      // If there's an error or no location found, try swapping lat and lon
      if (data.error || !data.display_name) {
        console.log("Failed to get location with the original coordinates, trying swapped coordinates...");
        response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lon}&lon=${lat}&format=json`
        );
        data = await response.json();
      }

      // If still no result, return error
      if (data.error || !data.display_name) {
        console.error("Geocoding error:", data.error);
        return "Unable to geocode";
      }

      // Log response to verify
      console.log('Reverse Geocoding Response:', data);

      const locationName = data.display_name || "Address not found"; // Return address if found

      // Cache the location name
      locationCache[coordinatesKey] = locationName;

      return locationName;
    } catch (error) {
      console.error("Error fetching location name:", error);
      return "Error retrieving location";
    }
  };

  // Fetch all incidents
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/incidents", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          // Map through incidents and fetch location name using reverse geocoding
          const incidentsWithLocationNames = await Promise.all(
            data.incidents.map(async (incident) => {
              const locationName = await getLocationName(
                incident.location.coordinates[1],
                incident.location.coordinates[0]
              );
              return { ...incident, locationName };
            })
          );
          setIncidents(incidentsWithLocationNames || []);
        } else {
          console.error("Failed to fetch incidents", data.message);
        }
      } catch (error) {
        console.error("Error fetching incidents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, [token]);

  // Function to handle loading more incidents
  const loadMoreIncidents = () => {
    setLoaded((prevLoaded) => Math.min(prevLoaded + 2, incidents.length));
  };

  // Approve incident
  const handleApprove = async (incidentId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/incidents/${incidentId}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setIncidents((prevIncidents) =>
          prevIncidents.map((incident) =>
            incident._id === incidentId ? { ...incident, status: "dispatched" } : incident
          )
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error approving incident:", error);
    }
  };

  // Revoke incident
  const handleRevoke = async (incidentId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/incidents/${incidentId}/revoke`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setIncidents((prevIncidents) =>
          prevIncidents.map((incident) =>
            incident._id === incidentId ? { ...incident, status: "request-denied" } : incident
          )
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error revoking incident:", error);
    }
  };

  if (loading) {
    return <div className="dispatcher_loading">Loading incidents...</div>;
  }

  return (
    <>
    <NavBar/>
    <div className="dispatcher_dashboard">
      <h2 className="dispatcher_heading">Dispatcher Dashboard</h2>
      <table className="dispatcher_table">
        <thead>
          <tr>
            <th>Incident Type</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Phone</th>
            <th>Ambulance</th>
            <th>Location (Address)</th>
            <th>Reported Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incidents.slice(0, loaded).map((incident) => (
            <tr key={incident._id}>
              <td>{incident.incident_type}</td>
              <td>{incident.status}</td>
              <td>{incident.priority}</td>
              <td>{incident.phone}</td>
              <td>
                {incident.ambulance ? (
                  <>
                    <p>Plate: {incident.ambulance.license_plate}</p>
                    <p>Status: {incident.ambulance.status}</p>
                    <p>Hospital: {incident.ambulance.hospital_name}</p>
                  </>
                ) : (
                  "N/A"
                )}
              </td>
              <td>{incident.locationName}</td>
              <td>{new Date(incident.reported_time).toLocaleString()}</td>
              <td>
                {incident.status !== "dispatched" && (
                  <button className="dispatcher_button" onClick={() => handleApprove(incident._id)}>Approve</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loaded < incidents.length && (
        <button className="dispatcher_button" onClick={loadMoreIncidents}>Load More</button>
      )}
    </div>
    </>
  );
}

export default DispatcherDashboard;
