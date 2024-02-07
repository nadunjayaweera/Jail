import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Badge } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { useSignOut } from "react-auth-kit";

const Navbar = ({ items }) => {
  const signOut = useSignOut();
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const calculateTotalQuantity = () => {
    if (!Array.isArray(items)) {
      return 0; // Return 0 if items is not an array
    }

    let totalQuantity = 0;
    items.forEach((item) => {
      if (item && item.quantity) {
        totalQuantity += item.quantity;
      }
    });

    return totalQuantity;
  };

  return (
    <AppBar sticky="top" position="sticky" color="primary">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <img
            src="/images/logo.png"
            alt="Logo"
            style={{ height: "50px", marginRight: "8px" }}
          />
          Mexican Hoppers
        </Typography>

        <div>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
            style={{ marginRight: "10px" }}
          >
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            PaperProps={{
              style: {
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                zIndex: 1,
                width: "100%",
                backgroundColor: "weight",
                color: "black",
              },
            }}
          >
            <MenuItem
              onClick={handleMenuClose}
              component={Link}
              to="/userinterface"
            >
              Menu
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              component={Link}
              to="/promointerface"
            >
              Promotion
            </MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to="/myorders">
              My Orders
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              component={Link}
              to="/contactus"
            >
              Contact
            </MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to="/aboutus">
              About Us
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose("logout");
                signOut();
              }}
              component={Link}
              to="/"
            >
              Logout
            </MenuItem>
          </Menu>
        </div>

        <Link to="/cartpage">
          {" "}
          <IconButton color="inherit" style={{ color: "black" }}>
            <Badge badgeContent={calculateTotalQuantity()} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
