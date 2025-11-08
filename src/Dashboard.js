import React, { useState, useCallback, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { employees } from "./data";
import "./App.css";
import EmployeeCharts from "./Charts";
import EmployeeTable from "./EmployeeTable";

const SkillsCellRenderer = (props) => {
  if (!props.value) return null;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "4px",
        alignItems: "center",
        height: "100%",
      }}
    >
      {props.value.map((skill, index) => (
        <span key={index} className="skill-badge">
          {skill}
        </span>
      ))}
    </div>
  );
};

const IsActiveCellRenderer = (props) => {
  return (
    <span
      style={{
        display: "inline-block",
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        backgroundColor: props.value ? "#4caf50" : "#f44336",
        marginLeft: "10px",
        boxShadow: `0 0 5px ${props.value ? "#4caf50" : "#f44336"}`,
      }}
    ></span>
  );
};

const Dashboard = () => {
  const [rowData] = useState(employees);
  const [gridApi, setGridApi] = useState(null);

  const summaryData = useMemo(() => {
    if (!rowData) return {};
    const totalEmployees = rowData.length;
    const totalSalary = rowData.reduce((acc, curr) => acc + curr.salary, 0);
    const avgSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0;
    const departments = [...new Set(rowData.map((emp) => emp.department))];
    const locations = [...new Set(rowData.map((emp) => emp.location))];

    return {
      totalEmployees,
      avgSalary,
      departmentCount: departments.length,
      locationCount: locations.length,
    };
  }, [rowData]);

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const onFilterTextBoxChanged = useCallback(() => {
    if (gridApi) {
      gridApi.setQuickFilter(document.getElementById("filter-text-box").value);
    }
  }, [gridApi]);

  const [colDefs] = useState([
    {
      headerName: "#",
      field: "id",
      width: 80,
      pinned: "left",
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    { field: "firstName", filter: "agTextColumnFilter" },
    { field: "lastName", filter: "agTextColumnFilter" },
    {
      field: "email",
      cellRenderer: (params) => (
        <a href={`mailto:${params.value}`}>{params.value}</a>
      ),
    },
    {
      field: "department",
      filter: "agSetColumnFilter",
    },
    { field: "position", editable: true },
    {
      field: "salary",
      valueFormatter: (params) => `$${params.value.toLocaleString()}`,
      filter: "agNumberColumnFilter",
      aggFunc: "avg",
    },
    {
      field: "hireDate",
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
      filter: "agDateColumnFilter",
    },
    { field: "age", filter: "agNumberColumnFilter" },
    { field: "location", filter: "agSetColumnFilter" },
    {
      field: "performanceRating",
      filter: "agNumberColumnFilter",
      cellRenderer: (params) => (
        <>
          {params.value}
          <span
            style={{
              marginLeft: "5px",
              color:
                params.value >= 4.5
                  ? "green"
                  : params.value >= 4
                  ? "orange"
                  : "red",
            }}
          >
            ★
          </span>
        </>
      ),
    },
    { field: "projectsCompleted", filter: "agNumberColumnFilter" },
    {
      field: "isActive",
      cellRenderer: IsActiveCellRenderer,
      filter: "agSetColumnFilter",
      headerName: "Active",
      width: 100,
    },
    {
      field: "skills",
      cellRenderer: SkillsCellRenderer,
      autoHeight: true,
      filter: "agTextColumnFilter",
    },
    { field: "manager", filter: "agTextColumnFilter" },
  ]);

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 150,
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        padding: "20px",
        backgroundColor: "#f4f6f8",
        overflowY: "auto",
      }}
    >
      {" "}
      {/* Added overflowY */}
      <h1 style={{ marginBottom: "20px", color: "#1a2027" }}>
        Employee Dashboard
      </h1>
      <div className="summary-cards">
        <div className="card">
          <h2>Total Employees</h2>
          <p>{summaryData.totalEmployees}</p>
        </div>
        <div className="card">
          <h2>Average Salary</h2>
          <p>${Math.round(summaryData.avgSalary).toLocaleString()}</p>
        </div>
        <div className="card">
          <h2>Departments</h2>
          <p>{summaryData.departmentCount}</p>
        </div>
        <div className="card">
          <h2>Locations</h2>
          <p>{summaryData.locationCount}</p>
        </div>
      </div>
      <EmployeeCharts employees={rowData} />{" "}
      {/* Integrate the charts component */}
      {/* <div
        className="dashboard-controls"
        style={{
          marginTop: "30px",
          marginBottom: "20px",
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <input
          type="text"
          id="filter-text-box"
          placeholder="Search across all columns..."
          onInput={onFilterTextBoxChanged}
          style={{
            padding: "10px 15px",
            width: "100%",
            border: "1px solid #d1d5db",
            borderRadius: "4px",
          }}
        />
      </div> */}
      <h2 style={{ marginBottom: "15px", color: "#1a2027" }}>
        Employee Data Table
      </h2>
      <div
        className="ag-theme-alpine"
        style={{
          height: "calc(100vh - 600px)",
          width: "100%",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <EmployeeTable onGridReady={onGridReady} />
      </div>
    </div>
  );
};

export default Dashboard;
