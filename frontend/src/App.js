import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { RequireAuth } from "react-auth-kit";
import { AuthProvider } from "react-auth-kit";


import DashboardContent from "./Source/Admin/dashboard";
import Customers from "./Source/Admin/Userlist/customers";
import Products from "./Source/Admin/ProductList/products";
import AddProducts from "./Source/Admin/Additem/ProductAdd/Addproduct";
import Sales from "./Source/Admin/Sales/Sales";
import EditItem from "./Source/Admin/Editproduct/Editproduct";
import Orders from "./Source/Admin/Orders/formorders";
import Pos from "./Source/Admin/POS/Posarchi";
import AddrowProducts from "./Source/Admin/AddrowItem/AddrowItem";
import AddMenu from "./Source/Admin/Addmenu/Addmenu";
import AddStock from "./Source/Admin/AddStock/AddStock";
import EditMenu from "./Source/Admin/Editmenu/EditMenu";
import StockExpenses from "./Source/Admin/Stockexpenses/Stockexpenses";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          
          <Route
            path="/userinterface"
            element={
              <RequireAuth loginPath="/">
              </RequireAuth>
            }
          />
          
          <Route path="/dashboard" element={<DashboardContent />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/additem" element={<AddProducts />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/products/edit/:id?" element={<EditItem />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/pos" element={<Pos />} />
          <Route path="/addrowproduct" element={<AddrowProducts />} />
          <Route path="/addstock" element={<AddStock />} />
          <Route path="/addmenu" element={<AddMenu />} />
          <Route path="/menu" element={<EditMenu />} />
          <Route path="/stockexpenses" element={<StockExpenses />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
