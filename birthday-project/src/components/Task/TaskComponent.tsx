import React, { useEffect, useState } from "react";
import { Review } from "../Review/ReviewComponent";
import "./TaskStyle.css";
import YouTubePlayer from "../YoutubePlayer/YoutubePlayerComponent";

interface TaskAttributes {
    movie: string;
    movieJsonData: any;
}

export const Task: React.FC<TaskAttributes> = ({ movie, movieJsonData }) => {
    const [jsonData, setJsonData] = useState({ name: "", rating: "", description: "", imageData: "", youtubeId: "", source: "" });
    const [showPopup, setShowPopup] = useState(false);
    const [rating, setRating] = useState(Number(localStorage.getItem("rating" + movie)));
    const [isWatched, setIsWatched] = useState(localStorage.getItem('isWatched' + movie) === 'true');
    const [showImage, setShowImage] = useState(false);

    useEffect(() => {
        const fetchJsonData = async () => {
            try {
                setJsonData({
                    name: movieJsonData.name,
                    description: movieJsonData.description,
                    imageData: movieJsonData.imageData,
                    rating: movieJsonData.rating,
                    youtubeId: movieJsonData.youtubeId,
                    source: movieJsonData.source,
                });
                setShowImage(true);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchJsonData();
    }, [movie, movieJsonData]);

    useEffect(() => {
        localStorage.setItem('isWatched' + movie, String(isWatched));
        localStorage.setItem('rating' + movie, String(rating));
    }, [isWatched, rating]);

    const handlePopUp = () => {
        setShowPopup(!showPopup);
    };

    if (!showImage) {
        return <p></p>;
    }

    return (
        <div className="task">
            <div className="container">
                <p className="title">{movie}</p>
                <div className="buttons-container">
                    <a className="source" href={jsonData.source}>▶</a>
                    <button type="button" className="reviewButton" onClick={handlePopUp}>פרטים</button>
                    <button
                        type="button"
                        className="status"
                        onClick={() => setIsWatched(!isWatched)}
                        style={{ color: isWatched ? 'green' : 'red' }}
                    >
                        {isWatched ? '✔' : '✖'}
                    </button>
                </div>       
                <div className="stars-container">
                        {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                                <button
                                    className="stars"
                                    key={ratingValue}
                                    onClick={() => { setRating(ratingValue); localStorage.setItem("rating" + movie, String(ratingValue)); }}
                                    onTouchStart={() => { setRating(ratingValue); localStorage.setItem("rating" + movie, String(ratingValue)); }} // onTouchStart event to handle touch interactions on mobile devices
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
                    </div>         
            </div>
            <img className="image" src={jsonData.imageData} alt="Movie" />
            {showPopup && <Review name={jsonData.name} description={jsonData.description} rating={Number(jsonData.rating)} youtubeId={jsonData.youtubeId} onClose={handlePopUp} />}
        </div>
    );
};
