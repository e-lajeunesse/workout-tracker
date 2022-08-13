import styles from './Workout.module.css';

export default function Workout() {
    return (
        <>
            <ul className={styles.exercises}>
                <li>Bench</li>
                <li> 55 </li>
                <li><input placeholder="Set 1"></input></li>
                <li><input placeholder="Set 2"></input></li>
                <li><input placeholder="Set 3"></input></li>
                <button>Save</button>
            </ul>
        </>
    )
}