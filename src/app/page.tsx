"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";

const useIntersectionObserver = (
  options = {}
): [React.RefObject<HTMLDivElement | null>, boolean] => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsIntersecting(true);
          setHasAnimated(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      }
    );

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasAnimated, options]);

  return [targetRef, isIntersecting];
};

type FadeInSectionProps = {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
};

const FadeInSection = ({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: FadeInSectionProps) => {
  const [ref, isVisible] = useIntersectionObserver();

  const getTransformClass = () => {
    switch (direction) {
      case "up":
        return "translate-y-8";
      case "down":
        return "-translate-y-8";
      case "left":
        return "translate-x-8";
      case "right":
        return "-translate-x-8";
      default:
        return "translate-y-8";
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible
          ? "opacity-100 translate-x-0 translate-y-0"
          : `opacity-0 ${getTransformClass()}`
      } ${className}`}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
};

const AgeVerificationModal = ({
  isOpen,
  onAccept,
  onReject,
}: {
  isOpen: boolean;
  onAccept: () => void;
  onReject: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white border border-gray-100 p-12 max-w-md mx-4 text-center shadow-sm">
        <h2 className="text-2xl font-light text-gray-900 mb-8">
          Verificación de Edad
        </h2>
        <p className="text-gray-600 mb-12 leading-relaxed">
          ¿Eres mayor de edad legal para consumir alcohol?
        </p>
        <div className="space-y-4">
          <button
            onClick={onAccept}
            className="w-full border border-[var(--catalan-black)] text-[var(--catalan-black)] py-3 px-8 hover:bg-[var(--catalan-black)] hover:text-white transition-all duration-300"
          >
            Sí, soy mayor de edad
          </button>
          <button
            onClick={onReject}
            className="w-full text-gray-400 py-3 px-8 hover:text-gray-600 transition-colors duration-300"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const navigation = [
    { name: "Productos", id: "productos" },
    { name: "Historia", id: "historia" },
    { name: "Contacto", id: "contacto" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <button
          onClick={() => scrollToSection("inicio")}
          className="text-xl font-light tracking-[0.2em] text-gray-900"
        >
          <Image
            src="/logo.png"
            alt="Catalán Logo"
            width={100}
            height={50}
            className="mx-auto mb-2 md:mb-0"
          />
        </button>

        <div className="hidden md:flex space-x-12">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.id)}
              className="text-md text-gray-600 hover:text-gray-900 transition-colors duration-300"
            >
              {item.name}
            </button>
          ))}
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Bars3Icon className="h-5 w-5 text-gray-900" />
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex items-center justify-between px-8 py-6">
            <span className="text-xl font-light tracking-[0.2em] text-gray-900">
              <Image
                src="/logo.png"
                alt="Catalán Logo"
                width={100}
                height={50}
                className="mx-auto mb-8"
              />
            </span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2">
              <XMarkIcon className="h-5 w-5 text-gray-900" />
            </button>
          </div>
          <div className="px-8 py-12 space-y-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className="block text-lg text-gray-600 hover:text-gray-900 transition-colors duration-300"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

const HeroSection = () => {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="inicio"
      className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/barrels.png')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-white/50"></div>
      </div>

      <div className="text-center max-w-4xl mx-auto px-8 relative z-10">
        <div
          className={`transition-all duration-1500 ease-out ${
            heroVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          <Image
            src="/logo.png"
            alt="Catalán Logo"
            width={700}
            height={350}
            className="mx-auto mb-8"
          />
        </div>

        <div
          className={`transition-all duration-1200 ease-out delay-300 ${
            heroVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="h-px w-24 bg-[var(--catalan-yellow)] mx-auto mb-8"></div>
        </div>

        <div
          className={`transition-all duration-1200 ease-out delay-500 ${
            heroVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-lg md:text-xl text-gray-900 mb-4 font-light tracking-wide">
            Sidra & Chicha
          </p>
        </div>

        <div
          className={`transition-all duration-1200 ease-out delay-700 ${
            heroVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-sm text-gray-200 mb-16 tracking-widest">
            DESDE 1850
          </p>
        </div>

        <div
          className={`transition-all duration-1200 ease-out delay-1000 ${
            heroVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-95"
          }`}
        >
          <button
            onClick={() =>
              document
                .getElementById("productos")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="border border-gray-900 text-gray-900 py-4 px-12 hover:bg-gray-900 hover:text-white transition-all duration-500 text-sm tracking-widest transform hover:scale-105"
          >
            DESCUBRIR
          </button>
        </div>
      </div>
    </section>
  );
};


const ProductsSection = () => {
  const products = [
    {
      name: "Sidra Catalán Green Label",
      description:
        "Blend de 3 manzanas, Northem Spy, Reineta y Jonathan. Sabor dulce, acidez equilibrada y notas agrias. Hecha con manzanas ancestrales de la Region de los Rios, Valdivia, Chile.",
      number: "01",
      image: "/green_label.png",
    },
    {
      name: "Sidra Catalán Yellow Label",
      description:
        "Blend de 3 manzanas, 80% Manzana Limona (LemonApple y 20% entre) Northem Spy y Reineta. Sabor dulce, equilibrado con notas citricas. Hecha con manzanas ancestrales de la Region de los Rios, Valdivia, Chile.",
      number: "02",
      image: "/yellow_label.png",
    },
    {
      name: "Sidra Catalán Black Label",
      description:
        "Sidra 100% de manzana limona, Dulce, citrica, mantiene el sabor intacto de la manzana limona. Hecha con manzanas ancestrales y unicas de la Region de los Rios, Valdivia, Chile.",
      number: "03",
      image: "/black_label.png",
    },
  ];

  return (
    <section id="productos" className="py-32 bg-gray-50">
      <div className="max-w-6xl mx-auto px-8">
        <FadeInSection className="mb-24 text-center">
          <h2 className="text-4xl md:text-5xl font-extralight tracking-wide text-gray-900 mb-4">
            Productos
          </h2>
          <div className="h-px w-16 bg-[var(--catalan-yellow)] mx-auto"></div>
        </FadeInSection>

        <div className="space-y-24">
          {products.map((product, index) => (
            <FadeInSection
              key={product.name}
              delay={index * 200}
              direction={index % 2 === 0 ? "left" : "right"}
            >
              <div className="grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-2">
                  <span className="text-6xl font-extralight text-gray-200">
                    {product.number}
                  </span>
                </div>
                <div className="md:col-span-6">
                  <h3 className="text-3xl font-light text-gray-900 mb-4 tracking-wide">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed max-w-md">
                    {product.description}
                  </p>
                </div>
                <div className="md:col-span-4">
                  <div className="flex items-center justify-center">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={300}
                      height={240}
                      className="object-contain transition-transform duration-300 hover:scale-105 rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section id="historia" className="py-32 bg-white">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-24 items-center">
          <FadeInSection direction="left">
            <h2 className="text-4xl md:text-5xl font-extralight tracking-wide text-gray-900 mb-8">
              Historia
            </h2>
            <div className="h-px w-16 bg-[var(--catalan-yellow)] mb-12"></div>

            <div className="space-y-8 text-gray-600 leading-relaxed">
              <p>
                Desde 1850, Catalán representa la excelencia en la elaboración
                artesanal de sidra y chicha en la región de Los Ríos.
              </p>
              <p>
                Seis generaciones han perfeccionado nuestros métodos,
                preservando la tradición mientras innovamos con respeto al
                terroir único de nuestra tierra.
              </p>
              <p>
                Cada botella es testimonio de más de 170 años de dedicación a la
                calidad y la autenticidad.
              </p>
            </div>
          </FadeInSection>

          <FadeInSection direction="right" delay={300}>
            <div className="space-y-12">
              <div className="text-center border-l-2 border-[var(--catalan-yellow)] pl-8">
                <div className="text-4xl font-extralight text-gray-900 mb-2">
                  175+
                </div>
                <div className="text-sm text-gray-600 tracking-widest">
                  AÑOS DE TRADICIÓN
                </div>
              </div>
              <div className="text-center border-l-2 border-[var(--catalan-yellow)] pl-8">
                <div className="text-4xl font-extralight text-gray-900 mb-2">
                  6
                </div>
                <div className="text-sm text-gray-600 tracking-widest">
                  GENERACIONES
                </div>
              </div>
              <div className="text-center border-l-2 border-[var(--catalan-yellow)] pl-8">
                <div className="text-4xl font-extralight text-gray-900 mb-2">
                  100%
                </div>
                <div className="text-sm text-gray-600 tracking-widest">
                  ARTESANAL
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Mensaje enviado. Te contactaremos pronto.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contacto" className="py-32 bg-gray-50">
      <div className="max-w-4xl mx-auto px-8">
        <FadeInSection className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-extralight tracking-wide text-gray-900 mb-4">
            Contacto
          </h2>
          <div className="h-px w-16 bg-[var(--catalan-yellow)] mx-auto"></div>
        </FadeInSection>

        <div className="grid md:grid-cols-2 gap-24">
          <FadeInSection direction="left" delay={200}>
            <div className="space-y-12">
              <div>
                <h3 className="text-lg font-light text-gray-900 mb-4 tracking-wide">
                  Dirección
                </h3>
                <p className="text-gray-600">Los Ríos, Chile</p>
              </div>

              <div>
                <h3 className="text-lg font-light text-gray-900 mb-4 tracking-wide">
                  Contacto
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p>+56 9 5653 2975</p>
                  <p>info@sidracatalan.cl</p>
                </div>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection direction="right" delay={400}>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Nombre"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border-0 border-b border-gray-200 bg-transparent py-4 text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-0 transition-colors duration-300"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full border-0 border-b border-gray-200 bg-transparent py-4 text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-0 transition-colors duration-300"
                />
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="Mensaje"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full border-0 border-b border-gray-200 bg-transparent py-4 text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-0 resize-none transition-colors duration-300"
                />
              </div>

              <button
                type="submit"
                className="border border-gray-900 text-gray-900 py-4 px-12 hover:bg-gray-900 hover:text-white transition-all duration-500 text-sm tracking-widest transform hover:scale-105"
              >
                ENVIAR
              </button>
            </form>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-8 py-16">
        <FadeInSection>
          <div className="grid md:grid-cols-3 gap-12 items-start">
            <div>
              <div className="text-xl font-light tracking-[0.2em] text-gray-900 mb-4">
                <Image
                  src="/logo.png"
                  alt="Catalán Logo"
                  width={150}
                  height={75}
                  className="mb-4"
              />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Sidra & Chicha artesanal desde 1850.
                <br />
                Manzanas ancestrales de Los Ríos.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 tracking-wide">
                Productos
              </h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Sidra Tradicional</p>
                <p>Chicha Premium</p>
                <p>Edición Especial</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 tracking-wide">
                Síguenos
              </h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Instagram</p>
                <p>Facebook</p>
              </div>
            </div>
          </div>
        </FadeInSection>

        <FadeInSection delay={300}>
          <div className="border-t border-gray-100 mt-16 pt-8 text-center">
            <p className="text-xs text-gray-400 tracking-wide">
              © 2025 CATALÁN. TRADICIÓN DESDE 1850.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Consume responsablemente. Prohibida su venta a menores de edad.
            </p>
          </div>
        </FadeInSection>
      </div>
    </footer>
  );
};

const Home = () => {
  const [showAgeModal, setShowAgeModal] = useState(true);

  useEffect(() => {
    const ageVerified = localStorage.getItem("ageVerified");
    if (ageVerified === "true") {
      setShowAgeModal(false);
    }
  }, []);

  const handleAcceptAge = () => {
    localStorage.setItem("ageVerified", "true");
    setShowAgeModal(false);
  };

  const handleRejectAge = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <>
      <AgeVerificationModal
        isOpen={showAgeModal}
        onAccept={handleAcceptAge}
        onReject={handleRejectAge}
      />

      <Header />
      <HeroSection />
      <ProductsSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </>
  );
};

export default Home;
