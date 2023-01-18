import mongoose from "mongoose";
import { getModelForClass, prop, pre } from "@typegoose/typegoose";
import { Cart } from "./cart.model";
import { generateUsername } from "unique-username-generator"
import { object, string, TypeOf, } from "zod";
import  * as bcrypt from "bcrypt"
import crypto from "crypto";



export const registerUserSchema = {
    body:
        object({
            firstname: string({
                required_error: "firstname is required"
            }),
            lastname: string({
                required_error: "lastname is required"
            }),
            username: string(),
            email: string({
                required_error: "email is required "
            }).email("Please Enter Valid Email"),
            password: string({
                required_error: "Password is required"
            }).min(8, "password must be atleast 8 characters").max(64, "password cannot be more than 64 charatcers"),
            confirmPassword: string({
                required_error: "confirm Password is required"
            }),
            address: string({
                required_error: "address must be provided"
            })


        })
}

export type RegisterUserBody = TypeOf<typeof registerUserSchema.body>


export const loginBodySchema = {
    body:
        object({
            username: string({
                required_error: "Username is required"
            })
            , password: string({
                required_error: "Password is required"
            })
                .min(8, "password cannot be lower than 8 charactes")
                .max(64, "password cannot be more than 64 characters")
        })
}

export type LoginType = TypeOf<typeof loginBodySchema.body>







@pre<User>("save", async function (next) {
    if (this.isModified("password") || this.isNew) {
        const hash = await bcrypt.hash(this.password, 10);

        this.password = hash;

        return next();
    }
})
export class User {

    @prop({ required: true })
    firstname: string
    @prop({ required: true })
    lastname: string
    @prop({ required: true, unique: true })
    email: string
    @prop({ required: true, default: generateUsername(), unique: true })
    username: string
    @prop({ required: true })
    password: string
    @prop({ required: true })
    address: string
    @prop({default:crypto.randomBytes(12).toString('hex')})
    resetPassword: string
    public async comparePassword(password: string): Promise<boolean> {
        return   await bcrypt.compare(password, this.password);
    }
    public  compareToken(token:string):Boolean{
        return (token ===this.resetPassword)
    }
}


export const UserModel = getModelForClass(User, {
    schemaOptions: {
        timestamps: true
    }
})