import React, { useEffect, useState } from "react";
import { Review } from "../Review/ReviewComponent";
import "./TaskStyle.css"
import YouTubePlayer from "../YoutubePlayer/YoutubePlayerComponent";

interface TaskAttributes{
    movie: string
    movieJsonData: any
}

export const Task: React.FC<TaskAttributes> = (TaskAttributes) => {
  const [jsonData] = useState({ name: "", rating: "", description: "", imageData: "", youtubeId: "", source:""});
  const [showPopup, setShowPopup] = useState(false);
  const [rating, setRating] = useState(Number(localStorage.getItem("rating" + TaskAttributes.movie)));
  const [isWatched, setIsWatched] = useState(localStorage.getItem('isWatched' + TaskAttributes.movie) === 'true');
  const [showImage, setShowImage] = useState(false)

  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        jsonData.name = TaskAttributes.movieJsonData["name"];
        jsonData.description = TaskAttributes.movieJsonData["description"];
        jsonData.imageData = TaskAttributes.movieJsonData["imageData"];
        jsonData.rating = TaskAttributes.movieJsonData["rating"];
        jsonData.youtubeId = TaskAttributes.movieJsonData["youtubeId"];
        jsonData.source = TaskAttributes.movieJsonData["source"];

        setShowImage(true)
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
        <a className="source" href={jsonData.source}>לצפייה</a>
        <button type="button" className="reviewButton" onClick={handlePopUp}>פרטים</button>
        <br />
        <button type="button" className="status" onClick={() => setIsWatched(!isWatched)} style={{color: isWatched ? 'green' : 'red'}}>{isWatched ? '✔' : '✖'}</button>
        {[...Array(5)].map((_, index)=> {
                                const ratingValue = index + 1;
                                return (
                                <button
                                    className="stars"
                                    key={ratingValue}
                                    onClick={() => {setRating(ratingValue); localStorage.setItem("rating" + TaskAttributes.movie, String(ratingValue));}}
                                    onTouchStart={() => { setRating(ratingValue); localStorage.setItem("rating" + TaskAttributes.movie, String(ratingValue)); }} // onTouchStart event to handle touch interactions on mobile devices
                                    style={{
                                        color: ratingValue <= Number(rating) ? 'gold' : 'grey',
                                        cursor: "pointer",
                                        transition: "color 0.3s", // Transition for color change
                                        WebkitTapHighlightColor: "transparent", // Disable tap highlight on mobile
                                    }}
                                >
                                    ★
                                </button>
                                );
                            })}
        <img className="image" src={jsonData["imageData"]}></img>
        
        </div>
        {showPopup && <Review name={jsonData.name} description={jsonData.description} rating={Number(jsonData.rating)} youtubeId={jsonData.youtubeId} onClose={handlePopUp}/>}
    </center>

  );
}