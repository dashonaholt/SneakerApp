import React from "react";

const Pagination = ({ sneakersPerPage, totalSneakers, paginate }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalSneakers / sneakersPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((pageNumber) => (
          <li key={pageNumber} className="page-item">
            <a
              href="#!"
              className="page-link"
              onClick={() => paginate(pageNumber)}
            >
              {pageNumber}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;