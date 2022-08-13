import styles from './Header.module.css';
import Link from 'next/link';

export default function Header() {
    return (
        <div className={styles.headerContainer}>
            <h1>Workout Tracker</h1>
            <ul className={styles.headerNav} >
                <li> <Link href="/">New Workout</Link></li>
                <li> <Link href="/exercises"> Exercises </Link></li>
                <li> <Link href="/workout-history"> Workout History </Link></li>
            </ul>
        </div>
    )
}