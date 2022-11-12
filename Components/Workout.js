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
    const [allExercises, setAllExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState({ value: "default", name: "" });
    const [resistance, setResistance] = useState("");
    const [sets, setSets] = useState("");



    useEffect(() => {
        const savedExercises = localStorage.getItem("exercises");
        const savedTitle = localStorage.getItem("title");
        if (savedExercises) {

            setExercises(prevExercises => JSON.parse(savedExercises));
        }
        if (savedTitle) {
            setTitle(savedTitle);
        }

        const getExercises = async () => {
            const response = await fetch("./api/exercises");
            setAllExercises(await response.json());
        }
        getExercises();
    }, []);

    useEffect(() => {
        if (exercises.length > 0) {
            localStorage.setItem("exercises", JSON.stringify(exercises));
        }
    }, [exercises])

    useEffect(() => {
        if (title.length > 0) {
            localStorage.setItem("title", title);
        }
    }, [title])

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
        if (event.target.value === "default") {
            return;
        }
        const target = exercisesData.find(ex => ex.id == event.target.value);
        setSelectedExercise({ value: target.id, name: target.name });
    }

    const handleResistanceChange = (event) => {
        setResistance(event.target.value);
    }

    const handleSetsChange = (event) => {
        let newSets = [];
        for (let i = 1; i <= event.target.value; i++) {
            newSets.push({ number: i, reps: 0 })
        }
        setSets(newSets);
    }

    const newExerciseSubmit = (event) => {
        if (selectedExercise.value === "default") {
            return;
        }
        const resist = resistance === "" ? 0 : resistance;
        const newExercise = { id: selectedExercise.value, name: selectedExercise.name, resistance: resist, sets: sets };
        setExercises(prevExercises => {
            return [...prevExercises, newExercise];
        })
        setSelectedExercise({ value: "default", name: "" })
        event.preventDefault();
    }

    const deleteExercise = (id) => {
        setExercises(prevExercises => prevExercises.filter((ex) => ex.id !== id));
    }

    const updateReps = (event, exerciseId, setNumber) => {
        let newReps = event.target.value;
        setExercises(prevState => {
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

    const recordWorkout = () => {
        const finishedWorkout = {
            date: new Date(),
            title: title,
            exercises: exercises
        }
        localStorage.clear();
        localStorage.setItem("finishedWorkout", JSON.stringify(finishedWorkout));
        setTitle("");
        setNewTitle("");
        setExercises([]);
        setSelectedExercise({ vale: "default", name: "" });
        setResistance("");
        setSets("");
    }

    return (
        <div className={styles.workout}>
            <div className={styles.title}>
                {title.length > 0 ?
                    <div className={styles.titleEdit}>
                        <h1>{title}</h1>
                        <FontAwesomeIcon icon={faPenToSquare} className={styles.editIcon} onClick={() => setTitle("")} />
                    </div> :
                    <form className={styles.titleSet} onSubmit={submitNewTitle}>
                        <input type="text" placeholder={newTitle.length > 0 ? newTitle : "Enter Workout Title"} onChange={handleTitleChange}></input>
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
                                            value={set.reps > 0 ? set.reps : ""}
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

            <div className={styles.workoutAddRecord}>
                <form className={styles.workoutAdd} onSubmit={newExerciseSubmit}>
                    <select title="select exercise" onChange={handleNameChange} value={selectedExercise.value}>
                        <option value="default" >Select Exercise</option>
                        {exercisesData.map(ex => (
                            <option
                                key={ex.id}
                                value={ex.id}
                                disabled={exercises.map(e => e.id).includes(ex.id)}
                            >
                                {ex.name}
                            </option>
                        ))}
                    </select>
                    <input type="number" step="any" placeholder="Enter Resistance" onChange={handleResistanceChange}></input>
                    <input type="number" placeholder="Enter Sets" onChange={handleSetsChange}></input>
                    <input type="submit" value="Add Exercise" />
                </form>
                <div className={styles.workoutRecord}>
                    <button onClick={recordWorkout}> Record Workout </button>
                </div>
            </div>

        </div >
    )
}