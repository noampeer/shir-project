import React from 'react';
import './YoutubePlayerStyle.css'

interface YouTubePlayerAttributes{
    videoId : string
}

export const YouTubePlayer: React.FC<YouTubePlayerAttributes> = ( YouTubePlayerAttributes ) => {
    return (
        <>
        <h4>טריילר</h4>
        <div className="video-container">
            <iframe 
                width="100%"
                height="200vh"
                src={`https://www.youtube.com/embed/${YouTubePlayerAttributes.videoId}`} 
                title="YouTube video player"  
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" 
                allowFullScreen
            ></iframe>
        </div>
        </> 
    );
}

export default YouTubePlayer;