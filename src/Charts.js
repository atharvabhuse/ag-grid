import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c', '#8dd1e1'];

const EmployeeCharts = ({ employees }) => {
  // Data for Employees by Department Bar Chart
  const departmentData = employees.reduce((acc, employee) => {
    acc[employee.department] = (acc[employee.department] || 0) + 1;
    return acc;
  }, {});
  const departmentChartData = Object.keys(departmentData).map(department => ({
    name: department,
    employees: departmentData[department],
  }));

  // Data for Employees by Location Pie Chart
  const locationData = employees.reduce((acc, employee) => {
    acc[employee.location] = (acc[employee.location] || 0) + 1;
    return acc;
  }, {});
  const locationChartData = Object.keys(locationData).map(location => ({
    name: location,
    employees: locationData[location],
  }));

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
      <div className="chart-card">
        <h3>Employees by Department</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={departmentChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="employees" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>Employees by Location</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <Pie
              data={locationChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="employees"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {locationChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmployeeCharts;