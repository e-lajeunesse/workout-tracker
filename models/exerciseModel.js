import mongoose from "mongoose";

const exerciseSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add the exercise name"]
    },
    categories: [],
});

//module.exports = mongoose.models.Exercise || mongoose.model("Exercise", exerciseSchema);
export const Exercise = mongoose.models.Exercise || mongoose.model("Exercise", exerciseSchema);

