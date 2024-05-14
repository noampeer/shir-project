import React, { useEffect, useState } from 'react';
import { IP_ADDRESS } from '../../consts';
import { Task } from '../Task/TaskComponent';

export const MovieTaskList: React.FC = () => {
    const [movies, setMovies] = useState<{movie:string, data: any}[]>([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch(`https://${IP_ADDRESS}:3443/movies`);

                if (response.ok) {
                    const jsonResponse = await response.json();
                    return jsonResponse; 
                } else {
                    console.error('Failed to fetch movies');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        const fetchData = async (movie: string) => {
            try {
                const response = await fetch(`https://${IP_ADDRESS}:3443/movies/${movie}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Error fetching data:', error);
                return null; // Return null if there's an error
            }
        };
        const fetchRatingsAndSortMovies = async (returnedMovies: string[]) => {
            const ratingPromises = returnedMovies.map(async (movie) => {
                const data = await fetchData(movie);
                return { movie, data };
            });

            const ratings = await Promise.all(ratingPromises);

            const sortedMovies = ratings
                .sort((a, b) => {
                    // Handle null ratings
                    if (a.data['rating'] === null && b.data['rating'] === null) {
                        return 0;
                    } else if (a.data['rating'] === null) {
                        return 1; // Move null-rated movies to the end
                    } else if (b.data['rating'] === null) {
                        return -1; // Move null-rated movies to the end
                    } else {
                        return b.data['rating'] - a.data['rating']; // Sort by descending ratings
                    }
                })

            setMovies(sortedMovies);
        };

        fetchMovies().then((returnedMovies: string[]) => fetchRatingsAndSortMovies(returnedMovies));

    }, []);

    if(movies.length == 0){
        return (<p></p>)
    }

    return (
        <div>
            {movies.map((movie, index) => (
                <Task key={index} movie={movie.movie} movieJsonData={movie.data}></Task>
            ))}
        </div>
    );
};
