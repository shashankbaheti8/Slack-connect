// models/UserToken.ts
import mongoose from "mongoose";

const userTokenSchema = new mongoose.Schema({
    team_id: {
        type: String,
        required: true,
        unique: true
    },
    team_name: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    access_token: {
        type: String,
        required: true
    },
    scope: String,
}, { timestamps: true });

export default mongoose.model("UserToken", userTokenSchema);
