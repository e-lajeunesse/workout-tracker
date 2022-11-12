import Header from '../Components/Header';
import exercisesData from '../exercisesData';
import { useState, useEffect } from "react";


export default function Exercises() {
    const [exercises, setExercises] = useState([]);
    const [newExercise, setNewExercise] = useState("");

    const handleChange = (event) => {
        setNewExercise(event.target.value);
    }

    const addExercise = async () => {
        const exerciseToAdd = {
            name: newExercise
        };

        const response = await fetch("/api/exercises", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(exerciseToAdd)
        });
        if (!response.ok) {
            throw new Error("POST request failed");
        }
    }

    useEffect(() => {
        const getExercises = async () => {
            const response = await fetch("./api/exercises");
            setExercises(await response.json());
        }
        getExercises();
    }, []);

    return (
        <>
            <Header />
            <div>
                {exercises.map((ex) => (
                    <h3 key={ex._id}> {ex.name}</h3>
                ))}
            </div>
            <form onSubmit={addExercise}>
                <input type="text" placeholder="Enter new exercise" onChange={handleChange}></input>
                <input type="submit" value="Add Exercise" />
            </form>
        </>
    );
}