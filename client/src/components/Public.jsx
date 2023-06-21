import React, { useContext, useEffect, useState } from "react";
import SneakersList from "./SneakersList";
import { UserContext } from "../../context/UserProvider";
import Pagination from "./Pagination";

export default function Public() {
  const [currentPage, setCurrentPage] = useState(1);
  const sneakersPerPage = 12; 
  const {allSneakers, getAllSneakers} = useContext(UserContext)


const sorted = allSneakers.sort((a,b) => b.likes.length - a.likes.length)

const indexOfLastSneaker = currentPage * sneakersPerPage;
const indexOfFirstSneaker = indexOfLastSneaker - sneakersPerPage;

const currentSneakers = sorted.slice(indexOfFirstSneaker, indexOfLastSneaker);

const paginate = (pageNumber) => setCurrentPage(pageNumber);

useEffect(() => {
  getAllSneakers();
}, []);


  return (
    <div className="public">
      <SneakersList sneakers={currentSneakers} />
      <div className="pagination-container">
      <Pagination
        sneakersPerPage={sneakersPerPage}
        totalSneakers={sorted.length}
        paginate={paginate}
      />
      </div>
    </div>
  );
}
