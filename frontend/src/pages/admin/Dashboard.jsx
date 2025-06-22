// import { useState, useEffect } from 'react';
// import { Bar, Pie, Line } from 'react-chartjs-2';
// import { Chart, registerables } from 'chart.js';
// import { 
//   FiAlertCircle, 
//   FiCheckCircle, 
//   FiClock, 
//   FiDownload,
//   FiTrendingUp,
//   FiTrendingDown,
//   FiUsers,
//   FiMap,
//   FiLogOut,
//   FiActivity,
//   FiAlertTriangle
// } from 'react-icons/fi';
// import { useNavigate } from 'react-router-dom';

// Chart.register(...registerables);

// // Generate 50 dummy complaints
// const generateDummyComplaints = () => {
//   const categories = ['Garbage', 'Potholes', 'Drainage', 'Streetlights', 'Public Nuisance', 'Water Supply', 'Sewage'];
//   const wards = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4'];
//   const statuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
//   const priorities = ['Critical', 'High', 'Medium', 'Low'];
  
//   const complaints = [];
//   const today = new Date();
  
//   for (let i = 1; i <= 50; i++) {
//     const daysAgo = Math.floor(Math.random() * 30);
//     const date = new Date(today);
//     date.setDate(date.getDate() - daysAgo);
    
//     complaints.push({
//       id: 100 + i,
//       ward: wards[Math.floor(Math.random() * wards.length)],
//       category: categories[Math.floor(Math.random() * categories.length)],
//       status: statuses[Math.floor(Math.random() * statuses.length)],
//       priority: priorities[Math.floor(Math.random() * priorities.length)],
//       date: date.toISOString().split('T')[0]
//     });
//   }
  
//   return complaints;
// };

// // Mock ML Service
// const MLService = {
//   calculatePriority: (complaints) => {
//     const categoryCounts = complaints.reduce((acc, complaint) => {
//       acc[complaint.category] = (acc[complaint.category] || 0) + 1;
//       return acc;
//     }, {});

//     return complaints.map(complaint => {
//       const frequency = categoryCounts[complaint.category];
//       let priority;
      
//       if (frequency > 15) priority = 'Critical';
//       else if (frequency > 8) priority = 'High';
//       else if (frequency > 3) priority = 'Medium';
//       else priority = 'Low';
      
//       return { ...complaint, priority };
//     });
//   },

//   predictResolutionTime: (complaint) => {
//     const baseTimes = {
//       'Garbage': 2, 'Potholes': 5, 'Drainage': 4, 
//       'Streetlights': 3, 'Public Nuisance': 1,
//       'Water Supply': 4, 'Sewage': 5
//     };
    
//     const priorityMultipliers = {
//       'Critical': 0.7, 'High': 1, 'Medium': 1.3, 'Low': 1.8
//     };
    
//     const days = baseTimes[complaint.category] * priorityMultipliers[complaint.priority];
//     return Math.round(days * 10) / 10;
//   },

//   detectAnomalies: (complaints) => {
//     const today = new Date().toISOString().split('T')[0];
//     const todayComplaints = complaints.filter(c => c.date === today).length;
//     const avgLast7Days = complaints.filter(c => {
//       const diffDays = Math.floor((new Date() - new Date(c.date)) / (1000 * 60 * 60 * 24));
//       return diffDays <= 7 && diffDays > 0;
//     }).length / 7;

//     return todayComplaints > (avgLast7Days * 1.5) ? 
//       `Alert: ${todayComplaints} complaints today (${Math.round(avgLast7Days)} daily avg)` : 
//       null;
//   },

//   suggestOptimizations: (wardsData) => {
//     const sortedWards = [...wardsData].sort((a, b) => b.complaints - a.complaints);
//     return `Allocate more resources to ${sortedWards[0].name} (${sortedWards[0].complaints} complaints)`;
//   }
// };

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [mlInsights, setMlInsights] = useState({
//     anomalies: null,
//     optimizations: '',
//     predictedTimes: {}
//   });

//   // Generate wards data based on complaints
//   const generateWardsData = (complaints) => {
//     const wards = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4'];
//     return wards.map((ward, i) => {
//       const wardComplaints = complaints.filter(c => c.ward === ward);
//       return {
//         id: i + 1,
//         name: ward,
//         complaints: wardComplaints.length,
//         resolved: wardComplaints.filter(c => c.status === 'Resolved').length,
//         population: [24500, 18700, 32100, 15400][i],
//         area: ['12.5 sq km', '9.2 sq km', '15.8 sq km', '7.6 sq km'][i]
//       };
//     });
//   };

//   // Initialize with 50 dummy complaints
//   const [recentComplaints, setRecentComplaints] = useState(() => {
//     const complaints = generateDummyComplaints();
//     return MLService.calculatePriority(complaints);
//   });

//   const [wardsData, setWardsData] = useState(() => 
//     generateWardsData(recentComplaints)
//   );

//   // Calculate ML insights
//   useEffect(() => {
//     const predictedTimes = {};
//     recentComplaints.forEach(complaint => {
//       predictedTimes[complaint.id] = MLService.predictResolutionTime(complaint);
//     });

//     setMlInsights({
//       anomalies: MLService.detectAnomalies(recentComplaints),
//       optimizations: MLService.suggestOptimizations(wardsData),
//       predictedTimes
//     });
//   }, [recentComplaints, wardsData]);

//   // Handle status change
//   const handleStatusChange = (id, newStatus) => {
//     const updatedComplaints = recentComplaints.map(complaint => 
//       complaint.id === id ? { ...complaint, status: newStatus } : complaint
//     );
    
//     setRecentComplaints(updatedComplaints);
//     setWardsData(generateWardsData(updatedComplaints));
//   };

//   // Function to convert data to CSV
//   const convertToCSV = (data) => {
//     const headers = Object.keys(data[0]).join(',');
//     const rows = data.map(obj => 
//       Object.values(obj).map(value => 
//         typeof value === 'string' && value.includes(',') ? `"${value}"` : value
//       ).join(',')
//     );
//     return [headers, ...rows].join('\n');
//   };

//   // Handle export to CSV
//   const handleExport = () => {
//     // Prepare the data for export
//     const exportData = recentComplaints.map(complaint => ({
//       ID: complaint.id,
//       Ward: complaint.ward,
//       Category: complaint.category,
//       Priority: complaint.priority,
//       Status: complaint.status,
//       'Predicted Resolution (days)': mlInsights.predictedTimes[complaint.id],
//       Date: complaint.date
//     }));

//     // Convert to CSV
//     const csvData = convertToCSV(exportData);
    
//     // Create a download link
//     const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', `complaints_report_${new Date().toISOString().split('T')[0]}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     navigate('/login');
//   };

//   // Calculate metrics
//   const totalComplaints = wardsData.reduce((sum, ward) => sum + ward.complaints, 0);
//   const totalResolved = recentComplaints.filter(c => c.status === 'Resolved').length;
//   const resolutionRate = Math.round((totalResolved / totalComplaints) * 100);
//   const avgResponseTime = 2.3;
//   const trendPercentage = 12;

//   // Charts configuration
//   const complaintsByWardData = {
//     labels: wardsData.map(ward => ward.name),
//     datasets: [{
//       label: 'Complaints by Ward',
//       data: wardsData.map(ward => ward.complaints),
//       backgroundColor: [
//         'rgba(59, 130, 246, 0.7)',
//         'rgba(156, 163, 175, 0.7)',
//         'rgba(16, 185, 129, 0.7)',
//         'rgba(245, 158, 11, 0.7)'
//       ],
//       borderWidth: 1
//     }]
//   };

//   const statusCounts = {
//     Resolved: recentComplaints.filter(c => c.status === 'Resolved').length,
//     Pending: recentComplaints.filter(c => c.status === 'Pending').length,
//     'In Progress': recentComplaints.filter(c => c.status === 'In Progress').length,
//     Rejected: recentComplaints.filter(c => c.status === 'Rejected').length
//   };

//   const resolutionData = {
//     labels: Object.keys(statusCounts),
//     datasets: [{
//       data: Object.values(statusCounts),
//       backgroundColor: [
//         'rgba(16, 185, 129, 0.7)',
//         'rgba(245, 158, 11, 0.7)',
//         'rgba(59, 130, 246, 0.7)',
//         'rgba(239, 68, 68, 0.7)'
//       ],
//       borderWidth: 1
//     }]
//   };

//   const trendData = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//     datasets: [
//       {
//         label: 'Complaints Received',
//         data: [124, 98, 156, 132, 187, recentComplaints.length],
//         borderColor: 'rgba(59, 130, 246, 1)',
//         backgroundColor: 'rgba(59, 130, 246, 0.1)',
//         tension: 0.3,
//         fill: true
//       },
//       {
//         label: 'Resolution Rate %',
//         data: [65, 68, 72, 70, 75, resolutionRate],
//         borderColor: 'rgba(16, 185, 129, 1)',
//         backgroundColor: 'rgba(16, 185, 129, 0.1)',
//         tension: 0.3,
//         fill: true
//       }
//     ]
//   };

//   return (
//     <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
//         <div className="flex items-center space-x-4">
//           <button 
//             onClick={handleLogout}
//             className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//           >
//             <FiLogOut className="mr-2" />
//             Logout
//           </button>
//           <button 
//             onClick={handleExport}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             <FiDownload className="mr-2" />
//             Export Report
//           </button>
//         </div>
//       </div>

//       {/* ML Insights Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {mlInsights.anomalies && (
//           <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
//             <div className="flex items-center">
//               <FiAlertTriangle className="text-yellow-500 mr-2" />
//               <h3 className="text-lg font-medium text-yellow-800">Anomaly Detected</h3>
//             </div>
//             <p className="mt-1 text-sm text-yellow-700">{mlInsights.anomalies}</p>
//           </div>
//         )}
        
//         <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
//           <div className="flex items-center">
//             <FiActivity className="text-blue-500 mr-2" />
//             <h3 className="text-lg font-medium text-blue-800">Optimization Suggestion</h3>
//           </div>
//           <p className="mt-1 text-sm text-blue-700">{mlInsights.optimizations}</p>
//         </div>
//       </div>

//       {/* Key Metrics */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <MetricCard 
//           title="Total Complaints" 
//           value={totalComplaints} 
//           change={`${trendPercentage}% from last month`} 
//           trend="up"
//           icon={<FiAlertCircle className="text-blue-500" size={20} />}
//         />
//         <MetricCard 
//           title="Resolved Rate" 
//           value={`${resolutionRate}%`} 
//           change="+5% improvement" 
//           trend="up"
//           icon={<FiCheckCircle className="text-green-500" size={20} />}
//         />
//         <MetricCard 
//           title="Avg. Response Time" 
//           value={`${avgResponseTime} days`} 
//           change="-0.5 days faster" 
//           trend="down"
//           icon={<FiClock className="text-yellow-500" size={20} />}
//         />
//         <MetricCard 
//           title="Wards Covered" 
//           value={wardsData.length} 
//           change="100% coverage" 
//           trend="neutral"
//           icon={<FiMap className="text-indigo-500" size={20} />}
//         />
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <ChartCard title="Complaints Trend (Last 6 Months)">
//           <Line 
//             data={trendData} 
//             options={{ 
//               responsive: true, 
//               maintainAspectRatio: false,
//               plugins: {
//                 legend: { position: 'top' }
//               }
//             }}
//             height={300}
//           />
//         </ChartCard>
        
//         <ChartCard title="Resolution Status">
//           <Pie 
//             data={resolutionData} 
//             options={{ 
//               responsive: true, 
//               maintainAspectRatio: false,
//               plugins: {
//                 legend: { position: 'right' }
//               }
//             }}
//             height={300}
//           />
//         </ChartCard>
//       </div>

//       {/* Recent Complaints with ML predictions */}
//       <div className="bg-white rounded-xl shadow overflow-hidden">
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-semibold text-gray-800">Recent Complaints (50)</h2>
//             <button 
//               onClick={handleExport}
//               className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
//             >
//               <FiDownload className="mr-1" /> Export Data
//             </button>
//           </div>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ward</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Predicted Resolution</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {recentComplaints.map(complaint => (
//                 <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{complaint.id}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.ward}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.category}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <PriorityBadge priority={complaint.priority} />
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <select
//                       value={complaint.status}
//                       onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
//                       className={`text-xs font-medium rounded-full px-3 py-1 ${
//                         complaint.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
//                         complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
//                         complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
//                         'bg-gray-100 text-gray-800'
//                       }`}
//                     >
//                       <option value="Pending">Pending</option>
//                       <option value="In Progress">In Progress</option>
//                       <option value="Resolved">Resolved</option>
//                       <option value="Rejected">Rejected</option>
//                     </select>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {mlInsights.predictedTimes[complaint.id]} days
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.date}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
//           <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
//             View All Complaints →
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Reusable Components
// const MetricCard = ({ title, value, change, trend, icon }) => (
//   <div className="bg-white p-6 rounded-xl shadow">
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-sm font-medium text-gray-500">{title}</p>
//         <p className="text-2xl font-bold mt-1">{value}</p>
//       </div>
//       <div className="p-3 rounded-full bg-gray-100 text-gray-600">
//         {icon}
//       </div>
//     </div>
//     <div className={`mt-4 flex items-center text-sm ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
//       {trend === 'up' ? <FiTrendingUp className="mr-1" /> : trend === 'down' ? <FiTrendingDown className="mr-1" /> : null}
//       {change}
//     </div>
//   </div>
// );

// const ChartCard = ({ title, children }) => (
//   <div className="bg-white p-6 rounded-xl shadow">
//     <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
//     <div className="h-80">
//       {children}
//     </div>
//   </div>
// );

// const StatusBadge = ({ status }) => {
//   const statusConfig = {
//     'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
//     'Resolved': { bg: 'bg-green-100', text: 'text-green-800' },
//     'In Progress': { bg: 'bg-blue-100', text: 'text-blue-800' },
//     'Rejected': { bg: 'bg-red-100', text: 'text-red-800' },
//   };
  
//   const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
  
//   return (
//     <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
//       {status}
//     </span>
//   );
// };

// const PriorityBadge = ({ priority }) => {
//   const priorityConfig = {
//     'Critical': { bg: 'bg-red-100', text: 'text-red-800' },
//     'High': { bg: 'bg-orange-100', text: 'text-orange-800' },
//     'Medium': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
//     'Low': { bg: 'bg-gray-100', text: 'text-gray-800' },
//   };
  
//   const config = priorityConfig[priority] || { bg: 'bg-gray-100', text: 'text-gray-800' };
  
//   return (
//     <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
//       {priority}
//     </span>
//   );
// };

// export default AdminDashboard;

"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiDownload,
  FiUsers,
  FiLogOut,
  FiAlertTriangle,
  FiHome,
} from "react-icons/fi"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      if (parsedUser.role === "admin") {
        fetchComplaints()
      } else {
        navigate("/home")
      }
    } else {
      navigate("/login")
    }
  }, [navigate])

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/complaints", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const complaintsData = data.complaints || []
        setComplaints(complaintsData)

        // Calculate stats
        setStats({
          total: complaintsData.length,
          pending: complaintsData.filter((c) => c.status === "Pending").length,
          inProgress: complaintsData.filter((c) => c.status === "In Progress").length,
          resolved: complaintsData.filter((c) => c.status === "Resolved").length,
          rejected: complaintsData.filter((c) => c.status === "Rejected").length,
        })
      }
    } catch (error) {
      console.error("Error fetching complaints:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/complaints/${complaintId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        alert("Status updated successfully")
        fetchComplaints() // Refresh data
      } else {
        throw new Error("Failed to update status")
      }
    } catch (error) {
      alert("Error: " + error.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  const handleExport = () => {
    // Prepare the data for export
    const exportData = complaints.map((complaint) => ({
      ID: complaint._id,
      Title: complaint.title,
      Category: complaint.category,
      Status: complaint.status,
      Priority: complaint.priority,
      Location: complaint.location,
      "User Name": complaint.user.name,
      "User Ward": complaint.user.ward,
      "Date Filed": new Date(complaint.createdAt).toLocaleDateString(),
    }))

    // Convert to CSV
    const headers = Object.keys(exportData[0] || {}).join(",")
    const rows = exportData.map((obj) =>
      Object.values(obj)
        .map((value) => (typeof value === "string" && value.includes(",") ? `"${value}"` : value))
        .join(","),
    )
    const csvData = [headers, ...rows].join("\n")

    // Create a download link
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `complaints_report_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiHome className="mr-2" />
            Home
          </button>
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FiDownload className="mr-2" />
            Export Report
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Complaints</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? "..." : stats.total}</p>
            </div>
            <div className="p-3 rounded-full bg-gray-100">
              <FiAlertCircle className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{loading ? "..." : stats.pending}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <FiClock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{loading ? "..." : stats.inProgress}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <FiUsers className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{loading ? "..." : stats.resolved}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <FiCheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{loading ? "..." : stats.rejected}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <FiAlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">All Complaints</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage and track all user complaints</p>
        </div>

        {loading ? (
          <div className="px-4 py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading complaints...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No complaints</h3>
            <p className="mt-1 text-sm text-gray-500">No complaints have been filed yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Complaint
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {complaints.map((complaint) => (
                  <tr key={complaint._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{complaint.user.name}</div>
                      <div className="text-sm text-gray-500">{complaint.user.ward}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{complaint.title}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">{complaint.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(complaint.priority)}`}
                      >
                        {complaint.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={complaint.status}
                        onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-3 py-1 border-0 ${getStatusColor(complaint.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
