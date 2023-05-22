import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Table from "react-bootstrap/Table";
import { refreshToken, fetchCalls } from "../../api/Auth";
import TableItem from "../../components/TableItem";

const Home = () => {
  const [accessToken, setAccessToken] = useState("");
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [filter, setFilter] = useState("All");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Function to refresh the token
  const refreshTokenFn = async () => {
    try {
      const response = await refreshToken(localStorage.getItem("token"));
      const { access_token } = response.data;
      setAccessToken(access_token);
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
  };

  // Function to fetch data using the access token
  const fetchData = async () => {
    try {
      const res = await fetchCalls(currentPage, itemsPerPage, filter);
      setData(res.nodes);
      setTotalItems(res.totalCount);
      // Process the response data
    } catch (error) {
      console.error("Data fetch failed:", error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Generate an array of page numbers for pagination
  const getPageNumbers = () => {
    const pageRange = 2; // Number of pages to show before and after the current page
    const pageNumbers = [];

    if (totalPages > 5) {
      let startPage = Math.max(1, currentPage - pageRange);
      let endPage = Math.min(totalPages, currentPage + pageRange);

      // Add first page
      pageNumbers.push(1);

      // Add pages within the range
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add last page
      pageNumbers.push(totalPages);

      // Add ellipsis if needed
      if (currentPage > pageRange + 2) {
        if (currentPage > pageRange + 3) {
          pageNumbers.splice(1, 1, "...");
        } else {
          pageNumbers.splice(1, 0, currentPage - 1);
        }
      }
      if (currentPage < totalPages - pageRange - 1) {
        if (currentPage < totalPages - pageRange - 2) {
          pageNumbers.splice(pageNumbers.length - 1, 1, "...");
        } else {
          pageNumbers.splice(pageNumbers.length - 1, 0, currentPage + 1);
        }
      }
    } else {
      // Add all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  useEffect(() => {
    // Refresh the token every 10 minutes
    const interval = setInterval(() => {
      refreshTokenFn();
    }, 10 * 60 * 1000); // 10 minutes in milliseconds

    // Cleanup function to clear the interval when the component is unmounted
    return () => {
      clearInterval(interval);
    };
  }, []); // Empty dependency array to run the effect only once on mount

  useEffect(() => {
    // Fetch data using the access token and pagination parameters
    fetchData();
  }, [accessToken, currentPage, itemsPerPage, filter]);

  useEffect(() => {
    // Fetch data whenever the currentPage changes
    fetchData();
  }, [currentPage]);

  return (
    <div className="mx-5">
      <h2>Turing Technologies Frontend Test</h2>
      <div className="row mt-5">
        <div className="col-auto">
          <p className="h5 mt-1">Filter By: </p>
        </div>
        <div className="col-auto">
          <Dropdown>
            <Dropdown.Toggle
              id="dropdown-basic"
              className="border border-white"
              style={{ backgroundColor: "#ffffff", color: "#4F46F8" }}
            >
              {filter}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setFilter("All")}>
                All
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter("Archived")}>
                Archived
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter("Unarchived")}>
                Unarchived
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <Table bordered hover className="mt-2">
        <thead>
          <tr className="bg-light">
            <th>CALL TYPE</th>
            <th>DIRECTION</th>
            <th>DURATION</th>
            <th>FROM</th>
            <th>TO</th>
            <th>VIA</th>
            <th>CREATED AT</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => {
            return (
              <TableItem
                item={item}
                key={index}
                handleShow={handleShow}
                show={show}
                handleClose={handleClose}
                updateData={fetchData}
              />
            );
          })}
        </tbody>
      </Table>
      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            {getPageNumbers().map((pageNumber, index) => (
              <li
                key={index}
                className={`page-item ${
                  pageNumber === currentPage ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Home;
