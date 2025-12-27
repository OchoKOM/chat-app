import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";


import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

import AuthImagePattern from "../components/AuthImagePattern.jsx";
import toast from "react-hot-toast";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Le nom complet est obligatoire");
    if (!formData.email.trim()) return toast.error("L'adresse email est obligatoire");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Format d'email invalide");
    if (!formData.password) return toast.error("Mot de passe requis");
    if (formData.password.length < 6)
      return toast.error("Mot de passe doit contenir au moins 6 caractères");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowPassword(false);

    const success = validateForm();
    if (!success) return;
    await signup(formData);
  };
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
            group-hover:bg-primary/20 transition-colors"
              >
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Créer un compte</h1>
              <p className="text-base-content/60">
                Commencez avec votre compte gratuit
              </p>
            </div>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Nom Complet</span>
              </label>
              <div className="input input-bordered w-full">
                <div className="flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Adresse email</span>
              </label>
              <div className="input input-bordered w-full">
                <div className="flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  placeholder="vous@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Mot de passe</span>
              </label>
              <div className="input input-bordered w-full">
                <div className="flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  title={
                    (showPassword ? "Masquer" : "Afficher") + " le mot de passe"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Patientez...
                </>
              ) : (
                "Créer un compte"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Déjà un compte ?{" "}
              <Link to="/login" className="link link-primary">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Right side */}
      <AuthImagePattern
        title="Rejoignez notre communauté"
        subtitle="Créez un compte et commencez à discuter avec des amis et des collègues dès aujourd'hui."
      />
    </div>
  );
};

export default SignupPage;
