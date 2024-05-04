import React, { useEffect, useState } from "react"
import { Task } from "../Task/TaskComponent"
import { IP_ADDRESS } from "../../consts"

export const MovieTaskList: React.FC = () => {
    const [movies, setMovies] = useState(new Array<string>)
    useEffect(() => {
        const fetchMovies = async () =>{
            try {
                const response = await fetch('https://' + IP_ADDRESS + ':3443/movies');
                console.log(response)
                if (response.ok) {
                    console.log('Registration successful');
                    const jsonResponse = await response.json();
                    setMovies(jsonResponse)
                } else {
                    console.error('Registration failed');
                    return <a href={'https://' + IP_ADDRESS + ':3443/movies'} target="_blank">click the link to allow the movies server</a>
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