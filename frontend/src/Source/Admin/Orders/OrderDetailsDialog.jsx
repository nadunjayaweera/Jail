import React from "react";
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
    padding: "5px", // Reduce padding
    marginBottom: "10px",
    display: "flex",
    justifyContent: "center", // Center the order details text
    flexDirection: "column",
    fontSize: "12px", // Increase the base font size
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
                  <strong>Mexican Hoppers</strong>
                </div>

                <div style={{ textAlign: "center", margin: "auto" }}>
                  <strong>Order ID:</strong> {order.orderid}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={listItemStyles}>
                    Time & Date: <span>{order.time}</span>
                  </li>

                  <li style={listItemStyles}>
                    <table style={{ width: "100%" }}>
                      <thead>
                        <th>#</th>
                        <th>Item</th>
                        <th>Qty</th>
                
                      </thead>
                      <tbody>
                      {order &&
                          order.products.map((item, index) => (
                            <tr>
                              <td>{index + 1}</td>
                              <td>
                                <span>{item.productName}</span>
                              </td>
                              <td>{item.quantity}</td>
                  
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
