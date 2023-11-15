import mongoose, { ObjectId, Schema, model } from "mongoose";

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  address: string;
  isAdmin: boolean;
  favorites: string[];
}

export const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
  favorites: [{ type: Schema.Types.ObjectId, ref: 'food' }]
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

export const UserModel = model<User>('user', UserSchema)