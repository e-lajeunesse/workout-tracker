import connectDB from "../../db";
import { Exercise } from "../../models/exerciseModel";

export default async (req, res) => {
    await connectDB();


    switch (req.method) {
        // GETs all Exercises
        case "GET":
            try {
                const exercises = await Exercise.find();
                res.json(exercises);
            } catch (error) {
                res.status(400);
                console.error(error);
            }
            break;

        // Adds new Exercise
        case "POST":
            try {
                if (!req.body.name) {                    
                    res.status(400);
                    throw new Error("Please add name");
                }
                await Exercise.create({
                    name: req.body.name,
                    categories: req.body.categories
                });
                res.status(200).json({ message: "Added new exercise" })
            } catch (error) {
                console.error(error);
            }
        default:
            break;
    }

}