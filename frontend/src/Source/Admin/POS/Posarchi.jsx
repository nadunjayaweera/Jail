import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { mainListItems } from "../listitems";
import { AppBar, Drawer, mdTheme } from "../Structure";
import Button from "@mui/material/Button";
import Itemcard from "./Itemcard";
import ShoppingCart from "./ShoppingCart";

function Item(props) {
  return (
    <Paper sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
      {props.children}
    </Paper>
  );
}

export default function Posarchi() {
  const [open, setOpen] = React.useState(true);
  const [cart, setCart] = React.useState([]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              POS
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">{mainListItems}</List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Item>
                <div>
                  <div>
                    <div>
                      <Button
                        variant="contained"
                        style={{
                          marginRight: "10px",
                          width: "320px",
                          height: "100px",
                          borderRadius: "10px",
                        }}
                      >
                        Breakfast
                      </Button>
                      <Button
                        variant="contained"
                        style={{
                          marginRight: "10px",
                          width: "320px",
                          height: "100px",
                          borderRadius: "10px",
                        }}
                      >
                        Lunch
                      </Button>
                      <Button
                        variant="contained"
                        style={{
                          width: "320px",
                          height: "100px",
                          borderRadius: "10px",
                        }}
                      >
                        Dinner
                      </Button>
                    </div>
                    <br />

                    <div className="items">
                      <Itemcard
                        addToCart={addToCart}
                        removeFromCart={removeFromCart}
                        cart={cart}
                      />
                    </div>
                  </div>
                  <br />
                  <br />
                  <br />
                </div>
              </Item>
            </Grid>
            <Grid item xs={4}>
              <Item>
                <Box sx={{ display: "flex" }}>
                  <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    sx={{ flexGrow: 1 }}
                  >
                    Cart
                  </Typography>
                  <ShoppingCart cart={cart} removeFromCart={removeFromCart} />
                </Box>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
