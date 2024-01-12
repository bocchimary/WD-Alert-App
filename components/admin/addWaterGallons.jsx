import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Table } from "react-bootstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";

const InventoryForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [pdfName, setPdfName] = useState("inventory");
  const [pdfLocation, setPdfLocation] = useState("");
  const [tableData, setTableData] = useState([]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/gallons");
      const data = await response.json();
      const formattedData = data.map((item) => ({
        date:moment(item.date).format("LLL"),
        containers: item.containers,}));
      setTableData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new jsPDF instance
    const pdfDoc = new jsPDF();

    const tableDataArray = tableData.map((row) => [
      row.date,
      row.containers,
    
    ]);

    // Add content to the PDF
    pdfDoc.text("Inventory Form", 20, 10);
    pdfDoc.autoTable({
      head: [["Date", "Containers"]],
      body: tableDataArray,
    });

    // Set the name and location from the form inputs
    const fileName = pdfName.trim() || "inventory";
    const fileLocation = pdfLocation.trim() || "downloads";

    // Save the PDF or open in a new tab/window
    pdfDoc.save(`${fileLocation}/${fileName}.pdf`);

    handleClose();
  };

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Open Inventory
      </Button>

      <Modal
        show={showModal}
        onHide={handleClose}
        dialogClassName="modal-90w"
        backdrop="static"
      >
        <Modal.Header
          style={{ backgroundColor: "gray", color: "white" }}
          closeButton
        >
          <Modal.Title>Water Gallons</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxHeight: "50vh",
          }}
        >
          <div
            style={{
              overflowY: "auto",
            }}
          >
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Containers</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.date}</td>
                    <td>{row.containers}</td>
                  
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <Form onSubmit={handleSubmit} style={{ marginTop: "auto" }}>
            <Button
              variant="primary"
              type="submit"
              style={{ marginTop: "10px", marginLeft: "290px", width: "130px" }}
            >
              Generate PDF
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default InventoryForm;