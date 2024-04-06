import React, { MouseEventHandler } from "react";
import "./ReviewStyle.css"

export interface ReviewAttributes{
    description:string,
    name: string,
    rating: number
    onClose: any
}

export const Review: React.FC<ReviewAttributes> = (ReviewAttributes) => {
    return(
        <div className="popup">
            <center>
                    <div className="reviewBlock">
                        <div className="head">
                            <p className="reviewHeader">{ReviewAttributes.name}</p>
                            <p className="description">{ReviewAttributes.description}</p>
                        </div>
                        <div className="body">
                            <br />
                            {[...Array(5)].map((_, index)=> {
                                const ratingValue = index + 1;
                                return (
                                <span
                                    className="stars"
                                    key={ratingValue}
                                    style={{color: ratingValue <= ReviewAttributes.rating ? 'gold' : 'grey' }}
                                >
                                    ★
                                </span> 
                                );
                            })}
                        </div>
                    </div>
            </center>
            <button className="close-button" onClick={ReviewAttributes.onClose}>X</button>
        </div>
    )
}