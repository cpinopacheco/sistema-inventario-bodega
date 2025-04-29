"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaLock, FaIdCard } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [employeeCode, setEmployeeCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Validación del formato del código de funcionario (6 dígitos + 1 letra minúscula)
  const validateEmployeeCode = (code: string) => {
    const regex = /^\d{6}[a-z]$/;
    return regex.test(code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!employeeCode.trim() || !password.trim()) {
      setError("Por favor, ingrese su código de funcionario y contraseña");
      return;
    }

    if (!validateEmployeeCode(employeeCode)) {
      setError(
        "El código de funcionario debe tener 6 dígitos seguidos de una letra minúscula"
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      await login(employeeCode, password);
    } catch (error) {
      setError("Ocurrió un error al iniciar sesión");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-green-800";

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-lightest">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-neutral-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="mb-4 flex justify-center"
          >
            <img
              src="/cenpecar-logo.png"
              alt="CENPECAR Logo"
              className="h-24 w-auto mx-auto"
            />
          </motion.div>
          <h2 className="text-2xl font-bold text-primary">
            Sistema de Inventario
          </h2>
          <p className="text-neutral-medium mt-1">
            Gestión de bódega y control de inventario
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-state-error bg-opacity-10 border border-state-error text-state-error px-4 py-3 rounded mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="employeeCode"
              className="block text-sm font-medium text-neutral-dark mb-1"
            >
              Código de Funcionario
            </label>
            <div className="relative">
              <input
                id="employeeCode"
                type="text"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                className={inputClasses}
                style={
                  {
                    "--tw-ring-color": "rgb(1, 58, 26, 0.5)",
                  } as React.CSSProperties
                }
                placeholder="123456a"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <FaIdCard className="text-neutral-medium" size={14} />
              </div>
            </div>
            <p className="text-xs text-neutral-medium mt-1">
              Formato: 6 dígitos + 1 letra minúscula (ej: 123456a)
            </p>
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-dark mb-1"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClasses}
                style={
                  {
                    "--tw-ring-color": "rgb(1, 58, 26, 0.5)",
                  } as React.CSSProperties
                }
                placeholder="••••••••"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <FaLock className="text-neutral-medium" size={14} />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-light text-neutral-white font-semibold py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-medium">
          <p>Para propósitos de demo:</p>
          <p>
            Código: <strong>123456a</strong>
          </p>
          <p>
            Contraseña: <strong>password</strong>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
