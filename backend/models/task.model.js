import mongoose from "mongoose";

export const PRIORITIES = ["", "Low", "Medium", "High"];

const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        desc: { type: String, default: "" },
        date: { type: String, required: true },
        start: { type: String, required: true },
        end: { type: String, default: "" },
        pri: { type: String, enum: PRIORITIES, default: "" },
        done: { type: Boolean, default: false },
        weekStart: { type: String, required: true },
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
        transform(_doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.weekStart;
            return ret;
        },
        },
    },
);

taskSchema.index({ date: 1, start: 1 });

export const Task = mongoose.model("Task", taskSchema);