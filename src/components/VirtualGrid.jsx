import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './VirtualGrid.css';

const ROW_HEIGHT = 40;
const BUFFER_SIZE = 10;

const COLUMNS = [
  { key: 'id', label: 'ID', width: 80, pinnable: true },
  { key: 'date', label: 'Date', width: 180, pinnable: true },
  { key: 'merchant', label: 'Merchant', width: 150 },
  { key: 'category', label: 'Category', width: 150 },
  { key: 'amount', label: 'Amount', width: 120 },
  { key: 'status', label: 'Status', width: 120 },
  { key: 'description', label: 'Description', width: 200 }
];

function VirtualGrid({ data }) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({});
  const [quickFilter, setQuickFilter] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [pinnedColumns, setPinnedColumns] = useState(new Set());
  const [modifiedData, setModifiedData] = useState(data);
  
  const scrollContainerRef = useRef(null);
  const filterTimeoutRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    setModifiedData(data);
  }, [data]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      setContainerHeight(scrollContainerRef.current.clientHeight);
    }
  }, []);

  const filteredAndSortedData = useMemo(() => {
    let result = [...modifiedData];

    // Apply quick filter
    if (quickFilter) {
      result = result.filter(row => row.status === quickFilter);
    }

    // Apply column filters
    Object.keys(filters).forEach(key => {
      const filterValue = filters[key];
      if (filterValue) {
        result = result.filter(row => 
          String(row[key]).toLowerCase().includes(filterValue.toLowerCase())
        );
      }
    });

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [modifiedData, sortConfig, filters, quickFilter]);

  const totalHeight = filteredAndSortedData.length * ROW_HEIGHT;
  const visibleRowCount = Math.ceil(containerHeight / ROW_HEIGHT);
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_SIZE);
  const endIndex = Math.min(
    filteredAndSortedData.length,
    startIndex + visibleRowCount + BUFFER_SIZE * 2
  );
  const visibleRows = filteredAndSortedData.slice(startIndex, endIndex);
  const offsetY = startIndex * ROW_HEIGHT;

  const handleScroll = useCallback((e) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      setScrollTop(e.target.scrollTop);
      
      // Update debug info
      window.debugInfo = window.debugInfo || {};
      window.debugInfo.scrollPosition = Math.floor(e.target.scrollTop / ROW_HEIGHT);
      window.debugInfo.totalRows = filteredAndSortedData.length;
    });
  }, [filteredAndSortedData.length]);

  useEffect(() => {
    window.debugInfo = window.debugInfo || {};
    window.debugInfo.renderedRows = visibleRows.length;
  }, [visibleRows.length]);

  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    
    filterTimeoutRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, [key]: value }));
    }, 300);
  }, []);

  const handleQuickFilter = useCallback((status) => {
    setQuickFilter(prev => prev === status ? null : status);
  }, []);

  const handleRowClick = useCallback((index, event) => {
    if (event.ctrlKey || event.metaKey) {
      setSelectedRows(prev => {
        const newSet = new Set(prev);
        if (newSet.has(index)) {
          newSet.delete(index);
        } else {
          newSet.add(index);
        }
        return newSet;
      });
    } else {
      setSelectedRows(new Set([index]));
    }
  }, []);

  const handleCellDoubleClick = useCallback((rowIndex, columnKey, currentValue) => {
    setEditingCell({ rowIndex, columnKey });
    setEditValue(String(currentValue));
  }, []);

  const handleEditComplete = useCallback(() => {
    if (editingCell) {
      const { rowIndex, columnKey } = editingCell;
      setModifiedData(prev => {
        const newData = [...prev];
        newData[rowIndex] = { ...newData[rowIndex], [columnKey]: editValue };
        return newData;
      });
      setEditingCell(null);
    }
  }, [editingCell, editValue]);

  const togglePinColumn = useCallback((columnKey) => {
    setPinnedColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(columnKey)) {
        newSet.delete(columnKey);
      } else {
        newSet.add(columnKey);
      }
      return newSet;
    });
  }, []);

  const formatCellValue = (column, value) => {
    if (column.key === 'date') {
      return new Date(value).toLocaleString();
    }
    if (column.key === 'amount') {
      return `$${value.toFixed(2)}`;
    }
    return value;
  };

  return (
    <div className="virtual-grid">
      <div className="grid-controls">
        <div className="filter-controls">
          <input
            type="text"
            placeholder="Filter by merchant..."
            data-test-id="filter-merchant"
            onChange={(e) => handleFilterChange('merchant', e.target.value)}
            className="filter-input"
          />
          <div className="quick-filters">
            <button
              data-test-id="quick-filter-Completed"
              onClick={() => handleQuickFilter('Completed')}
              className={quickFilter === 'Completed' ? 'active' : ''}
            >
              Completed
            </button>
            <button
              data-test-id="quick-filter-Pending"
              onClick={() => handleQuickFilter('Pending')}
              className={quickFilter === 'Pending' ? 'active' : ''}
            >
              Pending
            </button>
            <button
              data-test-id="quick-filter-Failed"
              onClick={() => handleQuickFilter('Failed')}
              className={quickFilter === 'Failed' ? 'active' : ''}
            >
              Failed
            </button>
          </div>
          <div className="filter-count" data-test-id="filter-count">
            Showing {filteredAndSortedData.length.toLocaleString()} of {data.length.toLocaleString()} rows
          </div>
        </div>
      </div>

      <div className="grid-header">
        {COLUMNS.map(column => (
          <div
            key={column.key}
            className={`header-cell ${pinnedColumns.has(column.key) ? 'pinned-column' : ''}`}
            style={{ width: column.width }}
            data-test-id={`header-${column.key}`}
          >
            <div className="header-content">
              <span onClick={() => handleSort(column.key)} className="header-label">
                {column.label}
                {sortConfig.key === column.key && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}
                  </span>
                )}
              </span>
              {column.pinnable && (
                <button
                  className="pin-button"
                  data-test-id={`pin-column-${column.key}`}
                  onClick={() => togglePinColumn(column.key)}
                  title={pinnedColumns.has(column.key) ? 'Unpin' : 'Pin'}
                >
                  📌
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div
        ref={scrollContainerRef}
        className="grid-scroll-container"
        data-test-id="grid-scroll-container"
        onScroll={handleScroll}
      >
        <div className="grid-sizer" style={{ height: totalHeight }} />
        <div
          className="grid-row-window"
          data-test-id="grid-row-window"
          style={{ transform: `translateY(${offsetY}px)` }}
        >
          {visibleRows.map((row, idx) => {
            const actualIndex = startIndex + idx;
            const isSelected = selectedRows.has(actualIndex);
            
            return (
              <div
                key={row.id}
                className={`grid-row ${isSelected ? 'selected' : ''}`}
                data-test-id={`virtual-row-${actualIndex}`}
                data-selected={isSelected || undefined}
                onClick={(e) => handleRowClick(actualIndex, e)}
              >
                {COLUMNS.map(column => {
                  const isEditing = editingCell?.rowIndex === actualIndex && 
                                   editingCell?.columnKey === column.key;
                  
                  return (
                    <div
                      key={column.key}
                      className={`grid-cell ${pinnedColumns.has(column.key) ? 'pinned-column' : ''}`}
                      style={{ width: column.width }}
                      data-test-id={`cell-${actualIndex}-${column.key}`}
                      onDoubleClick={() => handleCellDoubleClick(actualIndex, column.key, row[column.key])}
                    >
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleEditComplete}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEditComplete();
                            if (e.key === 'Escape') setEditingCell(null);
                          }}
                          autoFocus
                          className="cell-input"
                        />
                      ) : (
                        formatCellValue(column, row[column.key])
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default VirtualGrid;
