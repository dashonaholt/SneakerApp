import React, {useContext, useState, useEffect} from "react"
import Sneakers from "./Sneakers.jsx";

export default function SneakersList(props) {
    const { sneakers } = props;
    
  if (!sneakers) {
    // Handle the case where sneakerss is undefined or null
    return null;
  }
    return (
      <div className="sneakers-wrapper">
            {sneakers.map((sneaker) => (
              // <div className="sneakers-list">
        <Sneakers
          key={sneaker._id}
          sneaker={sneaker}
          comment={sneaker.content}
        />
        // </div>
      ))}
        </div>
    )
}