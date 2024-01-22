import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Modal, Button, IconButton, Pagination } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import "react-calendar/dist/Calendar.css";
const Food = () => {
  const location = useLocation();
  const category = new URLSearchParams(location.search).get("category");
  const [productData, setProductData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [productDates, setProductDates] = useState({}); // Track selected dates for each product
  const itemsPerPage = 4;
  useEffect(() => {
    const fetchData = async (pageNumber) => {
      try {
        const response = await axios.get(
          `http://localhost:8084/api/v1/itempart?pageNumber=${pageNumber}&itemsPerPage=${itemsPerPage}&category=${category}`
        );
        const formattedProductData = response.data.map((product) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          description: product.description,
          image: `data:image/jpeg;base64,${product.image}`,
        }));
        setProductData(formattedProductData);
        setTotalPages(Math.ceil(response.data.totalItems / itemsPerPage));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData(currentPage);
  }, [currentPage, category]);
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const handleCloseScheduleModal = () => {
    setScheduleModalOpen(false);
  };
  const handleScheduleMeal = () => {
    if (selectedProduct) {
      setScheduleModalOpen(true);
    }
  };
  const renderDateButtons = () => {
    const currentDate = new Date();
    const dateButtons = [];
    for (let i = 0; i < 3; i++) {
      const buttonDate = new Date();
      buttonDate.setDate(currentDate.getDate() + i);
      const formattedDate = `${buttonDate.getDate()} ${buttonDate.toLocaleString(
        "default",
        { month: "short" }
      )}`;
      dateButtons.push(
        <Button
          key={i}
          variant="contained"
          onClick={() => handleScheduleMealOnDate(buttonDate)}
        >
          {formattedDate}
        </Button>
      );
    }
    return (
      <div className="flex justify-center space-x-4 mt-4">{dateButtons}</div>
    );
  };
  const handleScheduleMealOnDate = (date) => {
    const productId = selectedProduct.id;
    const formattedDate = date.toISOString().split("T")[0];
    setProductDates((prevDates) => ({
      ...prevDates,
      [productId]: prevDates[productId]
        ? [...prevDates[productId], formattedDate]
        : [formattedDate],
    }));
    handleCloseScheduleModal();
  };
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };
  return (
    <div className="max-w-[1640px] m-auto px-4 py-12">
      <h1 className="font-bold text-3xl text-center mb-8">
        <span className="text-orange-600">SAVORFULL</span>
        <span className="text-black"> SELECTIONS</span>
      </h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {productData.map((product, index) => (
          <div
            key={index}
            className="border shadow-lg rounded-lg hover:scale-105 duration-300 flex flex-col"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[200px] object-cover rounded-t-lg"
            />
            <div className="flex justify-between px-2 py-4 items-center">
              <div>
                <p className="font-bold text-black">{product.name}</p>
                <p>
                  <span className="bg-orange-500 text-white p-1 rounded-full">
                    {product.price}
                  </span>
                </p>
              </div>
              <button
                className="bg-black text-white px-2 rounded-full sm:px-1"
                onClick={() => handleOpenModal(product)}
              >
                <ShoppingCartOutlinedIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-center">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="absolute inset-0" onClick={handleCloseModal}></div>
          <div className="max-w-[400px] m-auto px-4 py-12 text-center relative">
            <h2 className="text-2xl font-bold mb-4 text-white">
              {selectedProduct?.name}
            </h2>
            <IconButton
              className="ml-4"
              style={{ color: "white" }}
              onClick={handleCloseModal}
            >
              <CloseIcon />
            </IconButton>
            <img
              src={selectedProduct?.image}
              alt={selectedProduct?.name}
              className="w-full h-[200px] object-cover rounded-lg mb-4"
            />
            <p className="text-white mb-4">{selectedProduct?.description}</p>
            <Button variant="contained" onClick={handleScheduleMeal}>
              Add to Cart
            </Button>
            {scheduleModalOpen && renderDateButtons()}
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default Food;
