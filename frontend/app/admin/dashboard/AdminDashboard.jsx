import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Recycle, LogOut } from "lucide-react";
import "./AdminDashboard.css";

const sampleRatings = [
  { area: "Area 1", recycled: 4.2, unrecycled: 3.5, wet: 4.0 },
  { area: "Area 2", recycled: 3.8, unrecycled: 2.9, wet: 3.5 },
  { area: "Area 3", recycled: 4.5, unrecycled: 4.0, wet: 4.3 },
  { area: "Area 4", recycled: 2.9, unrecycled: 2.5, wet: 3.0 },
];

const sampleCollectors = [
  { name: "Raj Kumar", allocated: 50, collected: 48 },
  { name: "Priya Sharma", allocated: 60, collected: 59 },
  { name: "Amit Singh", allocated: 40, collected: 32 },
  { name: "Sunita Rao", allocated: 55, collected: 54 },
];

const sampleInsights = {
  totalHouses: 203,
  avgRating: 4.1,
  topCollectors: ["Priya Sharma", "Sunita Rao"],
  lowestArea: "Area 4",
};

function AdminDashboard() {
  const [tab, setTab] = useState("ratings");
  const [collectors, setCollectors] = useState([]);
  const [averageRatings, setAverageRatings] = useState([]);
  const [collectorReport, setCollectorReport] = useState([]);
  const [insights, setInsights] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchOverallReport().then((data) => {
      if (data) {
        setAverageRatings(data.average_ratings);
        setCollectorReport(data.daily_report);
        setInsights(data.overall_metrics);
      }
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  async function fetchOverallReport() {
    try {
      const response = await fetch("http://localhost:8000/overall_report");
      if (!response.ok) {
        throw new Error("Failed to fetch overall report");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching report:", error);
      return null;
    }
  }
  
  // useEffect(() => {
  //   // Simulate fetching data
  //   setTimeout(() => {
  //     setRatings(sampleRatings);
  //     setCollectors(sampleCollectors);
  //     setInsights(sampleInsights);
  //   }, 500);
  // }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Recycle className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold">Waste Samaritan</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user.name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="admin-dashboard">
          <h1 className="admin-title">Admin Dashboard</h1>
          <div className="admin-tabs">
            <button className={tab === "ratings" ? "active" : ""} onClick={() => setTab("ratings")}>Citizen Ratings</button>
            <button className={tab === "collectors" ? "active" : ""} onClick={() => setTab("collectors")}>Collector Analytics</button>
            <button className={tab === "insights" ? "active" : ""} onClick={() => setTab("insights")}>Admin Insights</button>
          </div>
          <div className="admin-content">
            {tab === "ratings" && (
              <div className="ratings-section">
                <h2>Citizen Ratings by Area</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={averageRatings} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="area" />
                    <YAxis domain={[1, 5]} ticks={[1,2,3,4,5]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="recycled" fill="#4caf50" name="Recycled" />
                    <Bar dataKey="unrecycled" fill="#f44336" name="Unrecycled" />
                    <Bar dataKey="wet" fill="#2196f3" name="Wet" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {tab === "collectors" && (
              <div className="collectors-section">
                <h2>Collector Analytics</h2>
                <table className="collectors-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Houses Allocated</th>
                      <th>Houses Collected</th>
                      <th>Efficiency (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collectors.map((c, i) => {
                      const efficiency = ((c.collected / c.allocated) * 100).toFixed(1);
                      return (
                        <tr key={i} className={efficiency < 85 ? "low-efficiency" : ""}>
                          <td>{c.name}</td>
                          <td>{c.allocated}</td>
                          <td>{c.collected}</td>
                          <td>{efficiency}% {efficiency < 85 ? <span className="warn">(Low)</span> : null}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {tab === "insights" && (
              <div className="insights-section">
                <h2>Admin Insights</h2>
                <div className="insights-cards">
                  <div className="insight-card">
                    <h3>Total Houses Covered Today</h3>
                    <p>{insights?.totalHouses}</p>
                  </div>
                  <div className="insight-card">
                    <h3>Average Citizen Segregation Rating</h3>
                    <p>{insights?.avgRating}</p>
                  </div>
                  {/* <div className="insight-card">
                    <h3>Top Performing Collector(s)</h3>
                    <p>{insights.topCollectors.first_name}</p>
                  </div> */}
                  <div className="insight-card">
                    <h3>Area with Lowest Segregation Compliance</h3>
                    <p>{insights?.lowestArea?.pincode}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;