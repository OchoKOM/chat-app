import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res)=>{
    const {fullName, email, password} = req.body;
    try {
        if (!fullName.trim() || !email.trim() || !password)  return res.status(400).json({message: "Veuillez remplir tous les champs obligatoires"});
        if (password.length < 6)  return res.status(400).json({message: "Votre mot de passe dois avoir au moins 6 caractères"})
        
        const user = await User.findOne({email})
        
        if (user) return res.status(400).json({message: "Cette adresse email est déjà utilisée"});

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashPassword,
        })

        if (!newUser) return res.status(400).json({message: "Quelque chose s'est mal passé"});

        generateToken(newUser._id, res);
        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });

    } catch (error) {
        console.log("Error in the signup controller", error.message);
        res.status(500).json({message: "Erreur interne du serveur"});
    }
}
export const login = async (req, res)=>{
    const { email, password} = req.body;
    try {
        if (!email.trim() || !password)  return res.status(400).json({message: "Veuillez remplir tous les champs obligatoires"});
        const user = await User.findOne({email})
        
        if (!user) return res.status(400).json({message: "Email ou mot de passe invalide"});

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) return res.status(400).json({message: "Email ou mot de passe invalide"});

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.log("Error in the login controller", error.message);
        res.status(500).json({message: "Erreur interne du serveur"});
    }
}
export const logout = (req, res)=>{
    try {
        res.cookie("jwt", "", {maxAge: 0});
        return res.status(200).json({message: "Déconnexion reussie"})
    } catch (error) {
        console.log("Error in the logout controller", error.message);
        res.status(500).json({message: "Erreur interne du serveur"});
    }
}
export const updateProfile = async (req, res)=>{
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if (!profilePic) return res.status(400).json({message: "La photo de profile est obligatoire"});

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true});

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error in update profile controller", error.message);
        res.status(500).json({message: "Erreur interne du serveur"});
    }
}
export const checkAuth = async (req, res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in check auth controller", error.message);
        res.status(500).json({message: "Erreur interne du serveur"});
    }
}

