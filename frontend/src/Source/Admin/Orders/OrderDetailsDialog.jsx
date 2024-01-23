import React from "react";
import moment from "moment";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useReactToPrint } from "react-to-print";

const OrderDetailsDialog = ({ open, onClose, orders }) => {
  const dialogContentStyles = {
    width: "3in",
    // Remove maxHeight to make the content height fit its content
    "@media print": {
      overflow: "hidden",
      padding: "0", // Remove padding for printing
    },
  };

  const receiptStyles = {
    margin: "auto",
    display: "block",
    overflow: "hidden",
    border: "1px solid #000",
    padding: "15px", // Increased padding
    marginBottom: "30px", // Increased margin
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    fontSize: "12px",
  };

  const printRef = React.useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const listItemStyles = {
    listStyle: "none",
    padding: 0,
    fontSize: "12px", // Increase the font size for list items
    whiteSpace: "nowrap", // Prevent text wrapping within list items
    marginBottom: "3px", // Adjust the margin between list items
    display: "flex",
    justifyContent: "space-between", // Justify content between left and right sides
    borderBottom: "1px solid #ccc", // Add bottom border to separate list items
  };

  const printStyles = `
    @page {
      size: 3in;
      margin: 0;
    }

    body {
      margin: 0;
      font-size: 17px; /* Adjust font size if necessary */
    }

    @media print {
      /* Custom font size for printing */
      div[role="presentation"] {
        font-size: 12px; /* Set the base font size for printing */
      }
    }
  `;
  const currentTime = moment().format("HH:mm:ss");
  return (
    <Dialog open={open} onClose={onClose}>
      <style media="print">{printStyles}</style>
      <DialogTitle>Order Details For Kitchen</DialogTitle>

      <DialogContent ref={printRef} style={dialogContentStyles}>
        {orders && (
          <div style={{ padding: "2px 0" }}>
            {orders.map((order) => (
              <div key={order.id} style={{ ...receiptStyles }}>
                <div style={{ textAlign: "center", margin: "auto" }}>
                  <strong>Prison Food</strong>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={listItemStyles}>
                    {/* Customer Name: <span>{order.customerName}</span> */}
                    Customer Name: <span>{order.name}</span>
                  </li>
                </ul>
                <thead>
                  <th>Customer Details</th>
                </thead>
                <tbody>
                  <tbody>
                    {order &&
                      order.customerdetails.map((item, index) => (
                        <tr key={index} style={{ marginBottom: "12px" }}>
                          {Object.keys(item).map((key) => (
                            <td key={key}>
                              <span>
                                {key}: {item[key]}
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </tbody>
                <div style={{ textAlign: "center", margin: "auto" }}>
                  <strong>Order ID:</strong> {order.orderid}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={listItemStyles}>
                    Print Time: <span>{currentTime}</span>
                  </li>
                  <li style={listItemStyles}>
                    <table style={{ width: "100%" }}>
                      <thead>
                        <th>#</th>
                        <th>Item</th>
                      </thead>
                      <tbody>
                        {order &&
                          order.products.map((item, index) => (
                            <tr>
                              <td>{index + 1}</td>
                              <td>
                                <span>{item.productName}</span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handlePrint} color="primary">
          Print
        </Button>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsDialog;
