import React, { useState, useEffect } from "react";
import { useTable, usePagination } from "react-table";
import { Button, Form, Table } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";

const Inventory3 = () => {
  const [pdfName, setPdfName] = useState("inventory");
  const [pdfLocation, setPdfLocation] = useState("");
  const [tableData, setTableData] = useState([]);
  

  
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3002/refillLogs");
      const data = await response.json();
      
      const formattedData = data.map((item) => ({
        location: item.location,
        consumed: item.consumed,
        timestamp: moment(item.timestamp).format("LLL"),
        gallons: item.gallons,
        remaining: item.remaining,
        
      }));
      setTableData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Fetch data every 10 seconds (adjust the interval as needed)
    const intervalId = setInterval(fetchData, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Location",
        accessor: "location",
      },
      {
        Header: "Consumed",
        accessor: "consumed",
      },
      {
        Header: "Consumed At",
        accessor: "timestamp",
      },
      {
        Header: "Container Logs",
        accessor: "gallons",
      },
      {
        Header: "Updated Gallons",
        accessor: "remaining",
      },
    ],
    []
  );
  

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: tableData,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    usePagination
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new jsPDF instance
    const pdfDoc = new jsPDF();

    const tableDataArray = tableData.map((row) => [
      row.location,
      row.consumed,
      row.timestamp,
      row.gallons,
      row.remaining,
    ]);

    // Add content to the PDF
    pdfDoc.text("Inventory Form", 20, 10);
    pdfDoc.autoTable({
      head: [["Location", "Consumed", "Consumed At","Container Gallons","Updated Gallons"]],
      body: tableDataArray,
    });

    // Set the name and location from the form inputs
    const fileName = pdfName.trim() || "inventory";
    const fileLocation = pdfLocation.trim() || "downloads";

    // Save the PDF or open in a new tab/window
    pdfDoc.save(`${fileLocation}/${fileName}.pdf`);

  };
  

  return (
    <div>
      <Table {...getTableProps()} striped bordered hover responsive>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, rowIndex) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={rowIndex}>
                {row.cells.map((cell, cellIndex) => (
                  <td {...cell.getCellProps()} key={cellIndex}>
                    {cell.render("Cell")}
                  </td>
                  
                ))}
              </tr>
             
            );
            
          })}
        </tbody>
      </Table>
      <div>
        <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </Button>{" "}
        <Button onClick={previousPage} disabled={!canPreviousPage}>
          {"<"}
        </Button>{" "}
        <Button onClick={nextPage} disabled={!canNextPage}>
          {">"}
        </Button>{" "}
        <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </Button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>{" "}
        <span>
          | Go to page:{" "}
          <input
            type="number"
            value={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "50px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <Form onSubmit={handleSubmit}>
        <Button
          variant="primary"
          type="submit"
          style={{ marginTop: "10px", width: "130px" }}
        >
          Generate PDF
        </Button>
      </Form>
    </div>
  );
};

export default Inventory3;
