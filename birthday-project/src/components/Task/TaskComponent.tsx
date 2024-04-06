import React, { useEffect, useState } from "react";
import { Review } from "../Review/ReviewComponent";
import "./TaskStyle.css"

interface TaskAttributes{
    movie: string
    
}

export const Task: React.FC<TaskAttributes> = (TaskAttributes) => {
  const [jsonData] = useState({ name: "", rating: "", description: "", imageData: "" });
  const [showPopup, setShowPopup] = useState(false);
  const [rating, setRating] = useState(Number(localStorage.getItem("rating" + TaskAttributes.movie)));
  const [isWatched, setIsWatched] = useState(localStorage.getItem('isWatched' + TaskAttributes.movie) === 'true');
  const [showImage, setShowImage] = useState(false)

  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const response = await fetch('https://192.168.1.176:3443/movies' + TaskAttributes.movie);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        jsonData.name = data["name"];
        jsonData.description = data["description"];
        jsonData.imageData = data["imageData"];
        jsonData.rating = data["rating"];
        setShowImage(true)
        console.log(jsonData)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchJsonData();
  }, [TaskAttributes.movie]);

  useEffect(() => {
    localStorage.setItem('isWatched' + TaskAttributes.movie, String(isWatched));
    localStorage.setItem('rating' + TaskAttributes.movie, String(rating));
  }, [isWatched]);

  const handlePopUp = () => {
    setShowPopup(!showPopup)
  }

  if(!showImage){
    return <p></p>
  }

  return (
    <center>
        <div className="task">
        <p className="title">{TaskAttributes.movie}</p>
        <button type="button" className="reviewButton" onClick={handlePopUp}>Review</button>
        <button type="button" className="status" onClick={() => setIsWatched(!isWatched)}>{isWatched ? '😊' : '😢'}</button>
        {[...Array(5)].map((_, index)=> {
                                const ratingValue = index + 1;
                                return (
                                <span
                                    className="stars"
                                    key={ratingValue}
                                    onClick={() => {setRating(ratingValue); localStorage.setItem("rating" + TaskAttributes.movie, String(ratingValue));}}
                                    style={{color: ratingValue <= Number(rating) ? 'gold' : 'grey', cursor:"pointer"}}
                                >
                                    ★
                                </span>
                                );
                            })}
        <img className="image" src={jsonData["imageData"]}></img>
        </div>
        {showPopup && <Review name={jsonData.name} description={jsonData.description} rating={Number(jsonData.rating)} onClose={handlePopUp}/>}
    </center>

  );
}