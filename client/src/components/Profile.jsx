import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserProvider";
import Pagination from "./Pagination";
import SneakersList from "./SneakersList";
import SneakersForm from "./SneakersForm.jsx"

export default function Profile() {
  const {
    user: { username },
    user,
    addSneakers,
    sneakers,
    getUserSneakers,
  } = useContext(UserContext);

  const [currentPage, setCurrentPage] = useState(1)
  const sneakersPerPage = 12; 
  const sortedSneakers = sneakers.sort((a, b) => b.likes.length - a.likes.length);
  const indexOfLastSneaker = currentPage * sneakersPerPage;
  const indexOfFirstSneaker = indexOfLastSneaker - sneakersPerPage;

  const currentSneakers = sortedSneakers.slice(
    indexOfFirstSneaker,
    indexOfLastSneaker
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    getUserSneakers();
  }, []);

  return (
    <div className="profile">
      <h1>Welcome {username}!</h1>
      <p>
        Share with us your favorite kicks! Don't forget to show some love by
        liking the sneakers you believe deserve the top spot. Let the finest
        kicks take the crown!
      </p>
      <h3>Add kicks you want, have or think are cool below:</h3>
      <SneakersForm submit={addSneakers} btnText="add sneakers" />
      <br />
      <h3 className="profile-yoursneakers">Your Sneakers:</h3>
      <SneakersList sneakers={currentSneakers} />
      <div className="pagination-container">
        <Pagination
          sneakersPerPage={sneakersPerPage}
          totalSneakers={sortedSneakers.length}
          paginate={paginate}
        />
      </div>
    </div>
  );
}