import Header from '../Components/Header';
import exercisesData from '../exercisesData';

export default function Exercises() {
    return (
        <>
            <Header />
            {exercisesData.map((ex) => (
                <h3 key={ex.id}> {ex.name}</h3>
            ))}
        </>
    );
}