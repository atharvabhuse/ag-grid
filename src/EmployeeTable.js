import React, { useState, useMemo } from "react";
import { employees } from "./data";

const useSortableData = (items, config = { key: 'id', direction: 'ascending' }) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};


const EmployeeTable = () => {
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleFilterChange = (column, value) => {
    setFilters(prev => ({ ...prev, [column]: value }));
  };

  const filteredItems = useMemo(() => {
    return employees.filter(item => {
      return Object.keys(filters).every(key => {
        const filterValue = filters[key].toLowerCase();
        if (!filterValue) return true;
        if (key === 'name') {
          const name = `${item.firstName} ${item.lastName}`;
          return name.toLowerCase().includes(filterValue);
        }
        return String(item[key]).toLowerCase().includes(filterValue);
      });
    });
  }, [filters]);

  const { items: sortedItems, requestSort, sortConfig } = useSortableData(filteredItems, { key: 'id', direction: 'ascending' });

  const paginatedItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  }, [sortedItems, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  return (
    <div style={{ overflowX: "auto", padding: "20px" }}>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          minWidth: "1000px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <thead>
          <tr style={{ background: "#f2f2f2" }}>
            <th style={thStyle} onClick={() => requestSort('id')} className={getClassNamesFor('id')}>ID</th>
            <th style={thStyle} onClick={() => requestSort('firstName')} className={getClassNamesFor('firstName')}>Name</th>
            <th style={thStyle} onClick={() => requestSort('email')} className={getClassNamesFor('email')}>Email</th>
            <th style={thStyle} onClick={() => requestSort('department')} className={getClassNamesFor('department')}>Department</th>
            <th style={thStyle} onClick={() => requestSort('position')} className={getClassNamesFor('position')}>Position</th>
            <th style={thStyle} onClick={() => requestSort('location')} className={getClassNamesFor('location')}>Location</th>
            <th style={thStyle} onClick={() => requestSort('salary')} className={getClassNamesFor('salary')}>Salary</th>
            <th style={thStyle} onClick={() => requestSort('hireDate')} className={getClassNamesFor('hireDate')}>Hire Date</th>
            <th style={thStyle} onClick={() => requestSort('performanceRating')} className={getClassNamesFor('performanceRating')}>Performance</th>
            <th style={thStyle} onClick={() => requestSort('projectsCompleted')} className={getClassNamesFor('projectsCompleted')}>Projects</th>
            <th style={thStyle} onClick={() => requestSort('isActive')} className={getClassNamesFor('isActive')}>Active</th>
            <th style={thStyle} onClick={() => requestSort('manager')} className={getClassNamesFor('manager')}>Manager</th>
            <th style={thStyle}>Skills</th>
          </tr>
          <tr>
            <th><input type="text" placeholder="Filter ID" onChange={e => handleFilterChange('id', e.target.value)} style={filterInputStyle} /></th>
            <th><input type="text" placeholder="Filter Name" onChange={e => handleFilterChange('name', e.target.value)} style={filterInputStyle} /></th>
            <th><input type="text" placeholder="Filter Email" onChange={e => handleFilterChange('email', e.target.value)} style={filterInputStyle} /></th>
            <th><input type="text" placeholder="Filter Department" onChange={e => handleFilterChange('department', e.target.value)} style={filterInputStyle} /></th>
            <th><input type="text" placeholder="Filter Position" onChange={e => handleFilterChange('position', e.target.value)} style={filterInputStyle} /></th>
            <th><input type="text" placeholder="Filter Location" onChange={e => handleFilterChange('location', e.target.value)} style={filterInputStyle} /></th>
            <th><input type="text" placeholder="Filter Salary" onChange={e => handleFilterChange('salary', e.target.value)} style={filterInputStyle} /></th>
            <th><input type="text" placeholder="Filter Hire Date" onChange={e => handleFilterChange('hireDate', e.target.value)} style={filterInputStyle} /></th>
            <th><input type="text" placeholder="Filter Performance" onChange={e => handleFilterChange('performanceRating', e.target.value)} style={filterInputStyle} /></th>
            <th><input type="text" placeholder="Filter Projects" onChange={e => handleFilterChange('projectsCompleted', e.target.value)} style={filterInputStyle} /></th>
            <th><input type="text" placeholder="Filter Active" onChange={e => handleFilterChange('isActive', e.target.value)} style={filterInputStyle} /></th>
            <th><input type="text" placeholder="Filter Manager" onChange={e => handleFilterChange('manager', e.target.value)} style={filterInputStyle} /></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map((emp) => (
            <tr key={emp.id}>
              <td style={tdStyle}>{emp.id}</td>
              <td style={tdStyle}>{`${emp.firstName} ${emp.lastName}`}</td>
              <td style={tdStyle}>{emp.email}</td>
              <td style={tdStyle}>{emp.department}</td>
              <td style={tdStyle}>{emp.position}</td>
              <td style={tdStyle}>{emp.location}</td>
              <td style={tdStyle}>₹{emp.salary.toLocaleString()}</td>
              <td style={tdStyle}>{emp.hireDate}</td>
              <td style={tdStyle}>{emp.performanceRating}</td>
              <td style={tdStyle}>{emp.projectsCompleted}</td>
              <td style={tdStyle}>{emp.isActive ? "✅" : "❌"}</td>
              <td style={tdStyle}>{emp.manager}</td>
              <td style={tdStyle}>{emp.skills?.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

// Reusable cell styles
const thStyle = {
  border: "1px solid #ddd",
  textAlign: "left",
  padding: "8px",
  fontWeight: "bold",
  cursor: "pointer"
};

const tdStyle = {
  border: "1px solid #ddd",
  textAlign: "left",
  padding: "8px",
};

const filterInputStyle = {
  width: '100%',
  padding: '4px',
  boxSizing: 'border-box'
};

export default EmployeeTable;