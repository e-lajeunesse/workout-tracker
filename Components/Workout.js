import styles from './Workout.module.css';
import testData from '../testData';
import exercisesData from '../exercisesData';
import { useState, useEffect } from 'react';
import { StyleRegistry } from 'styled-jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'

export default function Workout() {
    const [title, setTitle] = useState("");
    const [newTitle, setNewTitle] = useState("");
    const [exercises, setExercises] = useState([]);
    const [newExercise, setNewExercise] = useState({});

    useEffect(() => {
        const saved = localStorage.getItem("exercises");
        if (saved) {

            setExercises(prevExercises => JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (exercises.length > 0) {
            localStorage.setItem("exercises", JSON.stringify(exercises));
        }
    }, [exercises])

    const handleTitleChange = (event) => {
        setNewTitle(event.target.value);
    }

    const submitNewTitle = (event) => {
        console.log(newTitle);
        setTitle(newTitle);
        event.preventDefault();
    }

    // see if better way to handle this, make a custom dropdown?
    const handleNameChange = (event) => {
        if (event.target.value === "label") {
            return;
        }
        const target = exercisesData.find(ex => ex.id == event.target.value);
        setNewExercise(prevState => {
            return { ...prevState, id: target.id, name: target.name }
        });
    }

    const handleResistanceChange = (event) => {
        setNewExercise(prevState => {
            return { ...prevState, resistance: event.target.value }
        })

    }

    const handleSetsChange = (event) => {
        let newSets = [];
        for (let i = 1; i <= event.target.value; i++) {
            newSets.push({ number: i, reps: 0 })
        }
        setNewExercise(prevState => {
            return { ...prevState, sets: newSets }
        })
    }

    const newExerciseSubmit = (event) => {
        setExercises(prevState => {
            return [...prevState, newExercise]
        })
        event.preventDefault();
    }

    const deleteExercise = (id) => {
        setExercises(prevExercises => prevExercises.filter((ex) => ex.id !== id));
    }

    const updateReps = (event, exerciseId, setNumber) => {
        let newReps = event.target.value;
        setExercises(prevState => {
            console.log(event.target.value)
            return prevState.map(ex => {
                if (ex.id === exerciseId) {
                    let updatedSets = ex.sets.map(s =>
                        s.number === setNumber ? { ...s, reps: newReps } : { ...s }
                    );
                    return { ...ex, sets: updatedSets }
                }
                return { ...ex };
            })
        })
    }

    return (
        <div className={styles.workout}>
            <div>
                {title.length > 0 ? 
                    <div>
                        <h2>{title}</h2>
                        <FontAwesomeIcon icon={faPenToSquare} onClick={() => setTitle("")} />
                    </div>:
                    <form onSubmit={submitNewTitle}>
                        <input type="text" placeholder="Enter Workout Title" onChange={handleTitleChange}></input>
                        <input type="submit" value="Set Workout Title" />
                    </form>}
            </div>
            <table>
                <tbody>
                    <tr>
                        <th>Exercise</th>
                        <th>Resistance</th>
                        <th>Sets</th>
                        <th></th>
                    </tr>

                    {exercises.map(ex => (
                        <tr key={ex.name}>
                            <td>{ex.name}</td>
                            <td>{ex.resistance} lbs</td>
                            <td className={styles.sets}>
                                {ex.sets.map(set => (
                                    <div key={set.number}>
                                        <input
                                            className={styles.setsInput}
                                            placeholder={`Set ${set.number} reps`}
                                            onChange={(event) => updateReps(event, ex.id, set.number)}
                                            name={ex.id}
                                        >
                                        </input>
                                    </div>
                                ))}
                            </td>
                            <td><FontAwesomeIcon icon={faTrash} onClick={() => deleteExercise(ex.id)} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>


            <form onSubmit={newExerciseSubmit}>
                <select onChange={handleNameChange}>
                    <option value="label">Select Exercise</option>
                    {exercisesData.map(ex => (
                        <option key={ex.id} value={ex.id}> {ex.name} </option>
                    ))}
                </select>
                <input type="number" placeholder="Enter Resistance" onChange={handleResistanceChange}></input>
                <input type="number" placeholder="Enter Sets" onChange={handleSetsChange}></input>
                <input type="submit" value="Add Exercise" />
            </form>
            <div className={styles.workoutButtons}>
                <button> Record Workout </button>
            </div>
        </div >
    )
}