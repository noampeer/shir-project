import React, { useEffect, useState } from "react"
import { Task } from "../Task/TaskComponent"

export const MovieTaskList: React.FC = () => {
    const [movies, setMovies] = useState(new Array<string>)
    useEffect(() => {
        const fetchMovies = async () =>{
            try {
                const response = await fetch('http://192.168.1.176:4000/movies');
                console.log(response)
                if (response.ok) {
                    console.log('Registration successful');
                    const jsonResponse = await response.json();
                    setMovies(jsonResponse)
                } else {
                    console.error('Registration failed');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchMovies()
    }, [])

    return(
        <div>
            {movies.map((movie, index) => <Task key={index} movie={movie}></Task>)}
        </div>
    )
}