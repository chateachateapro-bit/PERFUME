/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingBag,
  Menu,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Package,
  MapPin,
  Check,
  X,
  CreditCard,
  Truck,
  MessageCircle,
  Heart,
  Star,
  ArrowRight
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { FRAGRANCES, STAR_SET, COUNTRIES, PROFILE_QUESTIONS, REVIEWS } from "./constants";
import { Fragrance, Country, OrderData } from "./types";

// --- UTILS ---
const INT_FEE_COP = 20000;

const formatPrice = (priceCOP: number, country: Country, isFinalPrice = false) => {
  // If we are passing a final price (total), it already includes the fee if applicable.
  // Otherwise, we add it here for catalog/display purposes.
  const fee = (!isFinalPrice && country.id !== 'COL') ? INT_FEE_COP : 0;
  const converted = Math.round((priceCOP + fee) * country.rate);
  return `${country.symbol}${converted.toLocaleString('de-DE')}`;
};

const WA_SALES = "12089693393";
const WA_CONFIRM = "573174555271";

const getConfirmationWALink = (data: OrderData & { lastName: string }) => {
    let locationStr = "";
    Object.entries(data.locationDetails).forEach(([key, value]) => {
      locationStr += `\n  📍 ${key.toUpperCase()}: ${value}`;
    });

    const message = `Hola L'Essence, confirmo mi pedido:
  
  📦 PRODUCTO: ${data.product}
  👤 CLIENTE: ${data.name} ${data.lastName}
  📱 TEL: ${data.phone}
  🌍 PAIS: ${data.country}${locationStr}
  🏠 DIRECCIÓN: ${data.address}
  🔍 REF: ${data.reference}
  💳 PAGO: ${data.paymentMethod}
  💰 TOTAL: ${data.price}`;
  
    return `https://wa.me/${WA_CONFIRM}?text=${encodeURIComponent(message)}`;
  };

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES.COL);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Fragrance | typeof STAR_SET | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showTest, setShowTest] = useState(false);
  const [showInitialModal, setShowInitialModal] = useState(false);
  const [testStep, setTestStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [profileResult, setProfileResult] = useState<{name: string, protagonists: string[]} | null>(null);
  const [showMap, setShowMap] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "", 
    lastName: "", 
    phone: "", 
    email: "", 
    address: "", 
    reference: "",
    locationDetails: {} as Record<string, string>,
    paymentMethod: "contra-entrega"
  });

  useEffect(() => {
    // Reset location details when country changes to avoid stale data
    // but ensure standard fields are handled
    setFormData(prev => ({ ...prev, locationDetails: {} }));
  }, [selectedCountry]);

  // Validation Logic
  const isFormValid = () => {
    const requiredLocationKeys = selectedCountry.id === 'COL' ? ['dept', 'city'] : selectedCountry.fields.map(f => f.id);
    const hasAllLocationData = requiredLocationKeys.every(k => formData.locationDetails[k] && formData.locationDetails[k].trim() !== "");
    
    return (
      formData.name.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.address.trim() !== "" &&
      formData.reference.trim() !== "" &&
      hasAllLocationData
    );
  };

  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isCheckoutOpen || showTest) {
      document.body.style.overflow = 'hidden';
      // Fallback for some browsers to ensure the overlay captures everything
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
  }, [isCheckoutOpen, showTest]);

  const toggleWishlist = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const currentPriceBase = activeProduct?.price || STAR_SET.price;
  const internationalFee = selectedCountry.id !== 'COL' ? INT_FEE_COP : 0;
  const currentPrice = currentPriceBase + internationalFee;
  
  const shippingCost = (activeProduct?.id === 'set-completo' || !activeProduct) ? 0 : 10990;
  const discountRate = formData.paymentMethod === 'anticipado' ? 0.2 : 0;
  const discountAmount = currentPrice * discountRate;
  const totalPrice = (currentPrice - discountAmount) + shippingCost;

  const handleTestOption = (tags: string[]) => {
    const newAnswers = [...answers, ...tags];
    setAnswers(newAnswers);
    if (testStep < PROFILE_QUESTIONS.length - 1) {
      setTestStep(testStep + 1);
    } else {
      setProfileResult({ name: "SIGNATURE IDENTITY", protagonists: ["Elegante", "Magnetismo"] });
      setTestStep(PROFILE_QUESTIONS.length);
    }
  };

  const openCheckout = (product: Fragrance | typeof STAR_SET) => {
    setActiveProduct(product);
    setIsCheckoutOpen(true);
  };

  const handleMainCTA = () => {
    if (!isFormValid()) {
      alert("Por favor, complete todos los campos obligatorios (*). Es vital para asegurar su entrega Maison.");
      return;
    }

    const fullPhone = `${selectedCountry.dialCode}${formData.phone.replace(/\s+/g, '')}`;

    if (formData.paymentMethod === 'anticipado') {
      // REDIRECTION TO MERCADO PAGO for Advanced Payment
      window.open('https://link.mercadopago.com.co/lessen', '_blank');
      
      // We also send the manual confirmation to the WA number as a backup of the intent
      const link = getConfirmationWALink({ 
        ...formData, 
        phone: fullPhone, 
        product: activeProduct?.name || STAR_SET.name, 
        price: formatPrice(totalPrice, selectedCountry, true), 
        country: selectedCountry.name 
      });
      
      setTimeout(() => {
        window.open(link, '_blank');
      }, 800);
    } else {
      // STANDARD COD Flow - Just WhatsApp
      const link = getConfirmationWALink({ 
        ...formData, 
        phone: fullPhone, 
        product: activeProduct?.name || STAR_SET.name, 
        price: formatPrice(totalPrice, selectedCountry, true), 
        country: selectedCountry.name 
      });
      window.open(link, '_blank');
    }
  };

  const [scrolledVal, setScrolledVal] = useState(false);
  useEffect(() => {
    // 1. Check for stored country
    const storedCountryId = localStorage.getItem("user-country");
    if (storedCountryId && COUNTRIES[storedCountryId]) {
      setSelectedCountry(COUNTRIES[storedCountryId]);
    } else {
      setShowInitialModal(true);
    }

    // 2. Scroll listener
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      setScrolledVal(window.scrollY > 40);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-luxury-black antialiased custom-scrollbar overflow-x-hidden">
      {/* 1. NAVIGATION - RIGID MINIMALISM */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${scrolled ? "bg-white/95 border-b border-gray-100 py-3" : "bg-white py-6"}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center">
          <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:opacity-50 transition-opacity">
            <Menu size={22} strokeWidth={1.5} />
          </button>

          <div className="flex flex-col items-center max-w-[50%] sm:max-w-none">
            <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-display tracking-[0.2em] md:tracking-[0.5em] font-light leading-none cursor-pointer text-center" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>L'ESSENCE</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[5px] md:text-[7px] tracking-[0.2em] md:tracking-[0.3em] uppercase font-bold text-gray-300">Héritage</span>
              <img src="https://flagcdn.com/w40/fr.png" alt="France" className="w-3 md:w-4 border border-gray-100 transition-all" referrerPolicy="no-referrer" />
              <span className="text-[5px] md:text-[7px] tracking-[0.2em] md:tracking-[0.3em] uppercase font-bold text-gray-300">Français</span>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative">
              <div 
                className="flex items-center gap-1.5 cursor-pointer opacity-80 hover:opacity-100 transition-opacity" 
                onClick={() => setIsCountrySelectorOpen(!isCountrySelectorOpen)}
              >
                <div className="w-8 h-5 border border-gray-100 flex items-center justify-center bg-gray-50">
                  <span className="text-[8px] font-black tracking-tighter uppercase">{selectedCountry.id}</span>
                </div>
                <ChevronDown size={8} className={`transition-transform duration-300 ${isCountrySelectorOpen ? 'rotate-180' : ''}`} />
              </div>
              
              <AnimatePresence>
                {isCountrySelectorOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 bg-white border border-gray-100 shadow-xl py-2 min-w-[150px] z-[200]"
                  >
                    {Object.values(COUNTRIES).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedCountry(c);
                          localStorage.setItem("user-country", c.id);
                          setIsCountrySelectorOpen(false);
                        }}
                        className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${selectedCountry.id === c.id ? 'bg-gold/5' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                            <img src={c.flag} className="w-4 h-3 object-cover" alt="" referrerPolicy="no-referrer" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">{c.name}</span>
                        </div>
                        <span className="text-[8px] font-black text-gray-300">{c.id}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button onClick={() => openCheckout(STAR_SET)} className="p-2 relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {wishlist.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-gold rounded-full" />}
            </button>
          </div>
        </div>
      </nav>

      {/* 2. HERO - ARCHITECTURAL HOOK */}
      <section className="pt-40 pb-20 md:pt-64 md:pb-40 text-center">
        <div className="max-w-5xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
                <span className="premium-label text-gold mb-8 block font-black">Inmersión Sensorial Francesa</span>
                <h2 className="h-hero mb-12"> Hay 4.000 millones de hombres <br className="hidden md:block" /> <span className="font-light normal-case tracking-normal">y la mayoría huele igual.</span> </h2>
                <p className="body-luxury max-w-2xl mx-auto mb-16 uppercase tracking-[0.2em] text-[10px] md:text-[12px] font-black leading-loose text-gray-400"> Únete a los pocos que dominan cada espacio <br className="hidden md:block"/> con un legado importado de Grasse. </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
                    <button onClick={() => openCheckout(STAR_SET)} className="btn-premium w-full sm:w-auto"> ORDENAR SET </button>
                    <button onClick={() => document.getElementById('catalog')?.scrollIntoView({behavior: 'smooth'})} className="btn-outline w-full sm:w-auto"> EXPLORAR COLECCIÓN </button>
                </div>
            </motion.div>
        </div>
      </section>

      {/* 3. PRIMARY OFFER - RIGID SYMMETRY FOR MOBILE */}
      <section id="signature" className="bg-[#FBFBFB] section-padding border-y border-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-12 md:gap-24 items-center">
            <div className="w-full lg:col-span-7 flex justify-center">
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="img-container-premium aspect-[4/3] md:aspect-[4/5] bg-white group shadow-2xl w-full max-w-[500px] lg:max-w-none overflow-hidden">
                    <video 
                        src="https://res.cloudinary.com/drf2kj5cy/video/upload/v1776706491/intro.mp4_ngynpc.mp4"
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                </motion.div>
            </div>
            <div className="w-full lg:col-span-5 text-center md:text-left flex flex-col items-center lg:items-start">
                <div className="bg-gold/10 text-gold px-4 py-2 text-[9px] font-black uppercase tracking-[0.3em] mb-6 rounded-full inline-block">Oferta Especial de Lanzamiento</div>
                <h3 className="h-section mb-10 text-center lg:text-left w-full"> 4 Perfumes <br /> <span className="font-light">al precio de 2</span></h3>
                <p className="body-luxury mb-12 max-w-md mx-auto lg:mx-0 text-center lg:text-left"> Tu arsenal completo para cada ocasión. 4 fórmulas maestras importadas que garantizan que nunca pases desapercibido. </p>
                
                <div className="space-y-6 mb-16 w-full max-w-sm mx-auto lg:mx-0">
                    {[
                        "Set de 4 Fragancias (30ml c/u)", 
                        "Entrega Local e Histórica Grasse", 
                        "Pago Contraentrega Disponible",
                        "Garantía de Satisfacción Total"
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 text-left border-b border-gray-100 pb-4">
                            <Check size={16} className="text-gold shrink-0" />
                            <span className="text-[11px] font-bold uppercase tracking-widest">{item}</span>
                        </div>
                    ))}
                </div>

                <div className="bg-white p-6 sm:p-10 md:p-14 shadow-2xl border border-gray-100 w-full max-w-[480px] lg:max-w-full mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-10 md:gap-12 mb-10 md:mb-16 w-full">
                        <div className="text-center md:text-left flex flex-col items-center md:items-start w-full md:w-auto">
                            <p className="premium-label text-gray-200 mb-6 font-black uppercase tracking-[0.3em]">Precio Maison</p>
                            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-5 justify-center md:justify-start">
                                <span className="text-5xl xs:text-6xl md:text-6xl font-black leading-none tracking-tighter">{formatPrice(STAR_SET.price, selectedCountry)}</span>
                                <span className="text-[10px] font-black text-gold border border-gold/40 px-4 py-2 uppercase tracking-[0.2em] bg-gold/5 block w-fit">4x2 Maison</span>
                            </div>
                            {selectedCountry.id !== 'COL' && (
                                <p className="text-[8px] font-bold text-gray-400 mt-2 uppercase tracking-[0.1em]">Incluye ajuste logístico internacional</p>
                            )}
                        </div>
                        <button onClick={() => openCheckout(STAR_SET)} className="btn-premium w-full md:w-auto shadow-gold/20 py-6"> ORDENAR SET </button>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-4 opacity-40 mt-4 border-t border-gray-50 pt-8">
                        <div className="flex items-center gap-3">
                            <Truck size={14} className="text-gold" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Logística Local Directa</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Package size={14} className="text-gold" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Entrega Aérea Asegurada</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 4. DISCOVERY CALL TO ACTION */}
      <section className="section-padding text-center">
        <div className="max-w-4xl mx-auto">
            <h4 className="font-sans text-[24px] md:text-[42px] font-light leading-snug mb-16 opacity-70 px-4"> “El aroma adecuado en el momento justo es más poderoso que cualquier palabra.” </h4>
            <div className="h-[1px] w-12 bg-gold mx-auto mb-16" />
            <button onClick={() => setShowTest(true)} className="btn-outline mx-auto"> DESCUBRIR MI PERFIL </button>
        </div>
      </section>

      {/* 5. DYNAMIC CATALOG - PERFECTLY CENTRALLY ALIGNED */}
      <section id="catalog" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 md:mb-32 gap-8 text-center md:text-left">
                <div>
                    <span className="premium-label text-gold mb-6 block">Individual Library</span>
                    <h2 className="h-section"> Construye Tu <span className="font-light">Firma Olfativa</span></h2>
                </div>
                <p className="body-luxury max-w-xs md:border-l md:border-gold md:pl-8 text-gray-300"> Selección unitaria para el hombre de gustos específicos. </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
                {FRAGRANCES.map(f => (
                    <div key={f.id} className="group cursor-pointer" onClick={() => openCheckout(f)}>
                        <div className="img-container-premium aspect-square md:aspect-[4/5] mb-8 group-hover:shadow-xl transition-all duration-700 bg-[#FBFBFB]">
                            <img src={f.image} alt={f.name} className="img-contained group-hover:scale-105 transition-transform duration-1000" />
                            <button onClick={(e) => toggleWishlist(f.id, e)} className="absolute top-4 right-4 text-gray-200 z-10 hover:text-gold transition-colors">
                                <Heart size={18} fill={wishlist.includes(f.id) ? "currentColor" : "none"} className={wishlist.includes(f.id) ? "text-gold" : ""} />
                            </button>
                        </div>
                        <div className="text-center">
                            <span className="text-[8px] font-black text-gray-200 uppercase tracking-[0.4em] mb-3 block">Legado {f.name}</span>
                            <h4 className="h-card mb-4">{f.name}</h4>
                            <p className="text-lg md:text-xl font-black tracking-tight mb-2">{formatPrice(f.price, selectedCountry)}</p>
                            {selectedCountry.id !== 'COL' && (
                                <p className="text-[8px] font-bold text-gray-400 mb-6 uppercase tracking-[0.05em] leading-none">Ajuste logístico incluido</p>
                            )}
                            <button className="btn-premium py-3 px-6 text-[8px] opacity-0 group-hover:opacity-100 transition-all">ORDENAR AHORA</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 6. THE ORIGIN - INTERACTIVE EXPERIENCE */}
      <section className="bg-white section-padding overflow-hidden">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-12">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <span className="premium-label text-gold mb-6 block">Le Berceau du Parfum</span>
                        <h2 className="text-[32px] md:text-[60px] font-display tracking-tight leading-[1.1] uppercase mb-10">
                            Descubre el Origen <br /> <span className="font-light text-gold">De Nuestra Inspiración</span>
                        </h2>
                        <p className="body-luxury text-lg max-w-md mb-12">
                            Importamos maestría desde el epicentro mundial de la perfumería fina. Cada gota de L'Essence nace en Grasse, Francia, garantizando una complejidad y fijación inigualables.
                        </p>
                        
                        <div className="flex flex-col items-center text-center w-full pt-10 border-t border-gray-100">
                            <a 
                                href="https://maps.app.goo.gl/raCLk8WoEPxcdhHS6" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn-outline group inline-flex items-center justify-center min-w-[280px]"
                            >
                                DESCUBRIR MAPA →
                            </a>
                            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-gray-400 mt-6 max-w-sm font-medium leading-relaxed">
                                Descubre de dónde provienen las bases de los perfumes que recibirás en casa.
                            </p>
                        </div>
                    </motion.div>
                </div>

                <div className="relative aspect-square lg:aspect-auto lg:h-[700px] overflow-hidden shadow-2xl group">
                    <video 
                        src="https://res.cloudinary.com/drf2kj5cy/video/upload/v1776710706/freepik_create-a-video_2826693728_hsz0d8.mp4"
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-luxury-black/10" />
                    <div className="absolute bottom-10 left-10 text-white z-10">
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] mb-2 block">Atelier Grasse</span>
                        <p className="text-xl font-light italic">Tradición Francesa Pura</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 7. SOCIAL PROOF - ELITE VERDICT */}
      <section className="section-padding bg-[#FBFBFB]">
        <div className="text-center max-w-3xl mx-auto mb-24">
            <span className="premium-label text-gold mb-6 block">The Elite Verdict</span>
            <h2 className="h-section font-black"> Opiniones Reales </h2>
            <div className="flex justify-center gap-1 text-gold mt-10">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                <span className="ml-4 text-[9px] font-black uppercase tracking-[0.3em] pt-0.5 opacity-40">Verificado LATAM</span>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {REVIEWS.map((rev, i) => (
                <div key={i} className="bg-white p-10 md:p-14 border border-gray-50 flex flex-col justify-between hover:shadow-2xl transition-all duration-700">
                    <p className="text-gray-500 font-sans text-sm md:text-base leading-relaxed mb-12 italic"> "{rev.text}" </p>
                    <div className="flex items-center gap-5 pt-8 border-t border-gray-50">
                        <div className="w-10 h-10 bg-gray-50 flex items-center justify-center text-[10px] font-black">{rev.name[0]}</div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest">{rev.name}</p>
                            <span className="text-[8px] font-bold text-gold uppercase tracking-[0.2em] mt-1 block">Cliente VIP</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* 8. FOOTER - ARCHITECTURAL BRANDING */}
      <footer className="bg-white border-t border-gray-100 py-24 md:py-48 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-y-20">
            <div className="col-span-12 lg:col-span-6">
                <h2 className="text-4xl font-display tracking-[0.5em] mb-12 uppercase font-light">L'ESSENCE</h2>
                <p className="body-luxury max-w-sm uppercase text-[10px] font-black tracking-widest leading-loose"> Maison de parfum · Destilando estatus · No es un aroma, es un legado emocional. </p>
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                <span className="premium-label mb-10 block">Explorar</span>
                <ul className="space-y-6">
                    {['Signature Set', 'Catalog Unitario', 'Test Olfativo', 'Maison Grasse'].map(l => (
                        <li key={l} className="text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-luxury-black cursor-pointer transition-all">{l}</li>
                    ))}
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8 text-[8px] font-black uppercase tracking-[0.4em] text-gray-200">
            <p>© 2026 L'ESSENCE · FR · CO · PA · CR · SV</p>
            <div className="flex gap-12">
                <span>Authenticité</span>
                <span>Luxe Absolu</span>
            </div>
        </div>
      </footer>

      {/* STICKY MOBILE CTA */}
      <AnimatePresence>
        {!isCheckoutOpen && scrolled && (
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-0 left-0 right-0 z-[110] md:hidden bg-white border-t border-gray-100 h-20 px-8 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Total Set</span>
                    <p className="text-xl font-black">{formatPrice(STAR_SET.price, selectedCountry)}</p>
                </div>
                <button onClick={() => openCheckout(STAR_SET)} className="bg-luxury-black text-white px-8 py-4 text-[10px] font-black tracking-widest uppercase"> COMPRAR </button>
            </motion.div>
        )}
      </AnimatePresence>

      {/* ONE-PAGE PREMIUM CHECKOUT - CRO OPTIMIZED OVERHAUL */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsCheckoutOpen(false)} 
              className="fixed inset-0 bg-luxury-black/95 backdrop-blur-md z-[500]" 
            />
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }} 
              transition={{ type: "spring", damping: 40, stiffness: 300 }} 
              className="fixed right-0 top-0 h-full w-full max-w-4xl bg-white z-[510] flex flex-col lg:flex-row shadow-2xl overflow-y-auto lg:overflow-hidden"
            >
                {/* Header for Mobile/Global visibility */}
                <div className="lg:hidden sticky top-0 left-0 right-0 p-8 border-b border-gray-100 flex justify-between items-center bg-white z-50">
                    <h3 className="text-lg font-black uppercase tracking-widest">Ritual de Compra</h3>
                    <button onClick={() => setIsCheckoutOpen(false)} className="p-2"><X size={24} /></button>
                </div>

                {/* LEFT SIDE: FORM (70% WIDTH ON DESKTOP) */}
                <div className="flex-1 lg:overflow-y-auto custom-scrollbar bg-white">
                    <div className="p-8 md:p-14 lg:p-20 space-y-20">
                        <div className="hidden lg:flex justify-between items-start mb-20">
                            <div>
                                <h3 className="text-2xl font-black tracking-widest uppercase">One-Page Checkout</h3>
                                <p className="text-[10px] font-bold text-luxury-gold uppercase tracking-[0.4em] mt-3">Experiencia Maison Segura</p>
                            </div>
                            <button onClick={() => setIsCheckoutOpen(false)} className="p-4 hover:bg-gray-50 rounded-full transition-all group">
                                <X size={28} className="group-hover:rotate-90 transition-transform duration-500" />
                            </button>
                        </div>

                        {/* Section 1: Identidad */}
                        <div className="space-y-12">
                            <div className="flex items-center gap-4">
                                <span className="w-8 h-8 rounded-full border border-gold flex items-center justify-center text-[11px] font-black text-gold">01</span>
                                <h4 className="text-[12px] font-black uppercase tracking-[0.3em]">Identidad del Cliente</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Nombres <span className="text-gold">*</span></label>
                                    <input 
                                        className="premium-input text-base" 
                                        placeholder="Ej: Juan Antonio" 
                                        onChange={e=>setFormData({...formData, name: e.target.value})} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Apellidos <span className="text-gold">*</span></label>
                                    <input 
                                        className="premium-input text-base" 
                                        placeholder="Ej: Rodríguez Pérez" 
                                        onChange={e=>setFormData({...formData, lastName: e.target.value})} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">WhatsApp <span className="text-gold">*</span></label>
                                    <div className="flex gap-2">
                                        <div className="w-20 h-[56px] shrink-0 bg-gray-50 border-b-2 border-gray-100 flex flex-col items-center justify-center">
                                            <span className="text-[8px] font-black uppercase text-gray-300 mb-1">Prefijo</span>
                                            <span className="text-[13px] font-black text-luxury-black">{selectedCountry.dialCode}</span>
                                        </div>
                                        <input 
                                            className="premium-input text-base flex-1" 
                                            placeholder="321 000 0000" 
                                            value={formData.phone}
                                            onChange={e=>setFormData({...formData, phone: e.target.value})} 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Email (Opcional)</label>
                                    <input 
                                        className="premium-input text-base" 
                                        placeholder="maison@ejemplo.com" 
                                        onChange={e=>setFormData({...formData, email: e.target.value})} 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Destino */}
                        <div className="space-y-12 border-t border-gray-50 pt-16">
                            <div className="flex items-center gap-4">
                                <span className="w-8 h-8 rounded-full border border-gold flex items-center justify-center text-[11px] font-black text-gold">02</span>
                                <h4 className="text-[12px] font-black uppercase tracking-[0.3em]">Destino de Entrega</h4>
                            </div>
                            <div className="space-y-10">
                                {/* Dynamic Fields based on Country - FIXED VISIBILITY */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 bg-white p-8 border-2 border-gold/5 rounded-sm shadow-sm">
                                    {selectedCountry.id === 'COL' ? (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-luxury-black">Departamento <span className="text-gold">*</span></label>
                                                <input 
                                                    className="premium-input bg-gray-50/50" 
                                                    placeholder="Ej: Antioquia" 
                                                    value={formData.locationDetails.dept || ""}
                                                    onChange={e=>setFormData({...formData, locationDetails: {...formData.locationDetails, dept: e.target.value}})} 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-luxury-black">Ciudad / Municipio <span className="text-gold">*</span></label>
                                                <input 
                                                    className="premium-input bg-gray-50/50" 
                                                    placeholder="Ej: Medellín" 
                                                    value={formData.locationDetails.city || ""}
                                                    onChange={e=>setFormData({...formData, locationDetails: {...formData.locationDetails, city: e.target.value}})} 
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        selectedCountry.fields.map(f => (
                                            <div key={f.id} className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-luxury-black">{f.label} <span className="text-gold">*</span></label>
                                                <input 
                                                    className="premium-input bg-gray-50/50" 
                                                    placeholder={f.placeholder} 
                                                    value={formData.locationDetails[f.id] || ""}
                                                    onChange={e=>setFormData({...formData, locationDetails: {...formData.locationDetails, [f.id]: e.target.value}})} 
                                                />
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Dirección Completa <span className="text-gold">*</span></label>
                                        <input className="premium-input" placeholder="Calle, Carrera, Conjunto, Apto..." onChange={e=>setFormData({...formData, address: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 italic">Punto de Referencia Obligatorio <span className="text-gold font-black">*</span></label>
                                        <textarea 
                                            className="premium-input min-h-[100px] py-4" 
                                            placeholder="Tienda de la esquina, frente al parque, color de fachada, portón eléctrico..." 
                                            onChange={e=>setFormData({...formData, reference: e.target.value})} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Pago */}
                        <div className="space-y-12 border-t border-gray-50 pt-16">
                            <div className="flex items-center gap-4">
                                <span className="w-8 h-8 rounded-full border border-gold flex items-center justify-center text-[11px] font-black text-gold">03</span>
                                <h4 className="text-[12px] font-black uppercase tracking-[0.3em]">Ritual de Pago</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <button 
                                    onClick={()=>setFormData({...formData, paymentMethod: 'anticipado'})} 
                                    className={`p-10 border-2 text-left transition-all duration-500 relative group flex flex-col justify-between h-72 overflow-hidden ${formData.paymentMethod === 'anticipado' ? 'border-gold bg-luxury-black text-white shadow-2xl translate-y-[-8px]' : 'border-gold/20 bg-gold/5 opacity-80 hover:opacity-100 hover:border-gold/50'}`}
                                >
                                    <div className="absolute top-0 right-0 bg-gold text-white px-10 py-4 text-[11px] font-black uppercase transform translate-x-[20%] translate-y-[40%] rotate-45 z-10 shadow-xl border-b-2 border-white/20 tracking-tighter">MEJOR OPCIÓN</div>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-6">
                                            <div className={`p-4 rounded-full transition-colors ${formData.paymentMethod === 'anticipado' ? 'bg-gold/20' : 'bg-gray-100'}`}>
                                                <CreditCard size={32} strokeWidth={1.5} className="text-gold" />
                                            </div>
                                            <div className="pr-16">
                                                <span className="text-[16px] font-black text-gold tracking-tight block">AHORRA 20%</span>
                                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">DESCONTO VIP</span>
                                            </div>
                                        </div>
                                        <h5 className="text-[15px] font-black uppercase tracking-[0.2em] leading-tight mt-2">Pago Adelantado <br/> <span className="text-gold italic font-light lowercase tracking-normal">(Transferencia)</span></h5>
                                    </div>
                                    <div className="space-y-4">
                                        <p className={`text-[10px] uppercase tracking-widest leading-relaxed ${formData.paymentMethod === 'anticipado' ? 'text-gray-400' : 'text-gray-500'}`}>Transfiere ahora y desbloquea el estatus Maison con beneficio inmediato del 20%.</p>
                                        <div className="flex items-center gap-3">
                                            <div className={`text-[10px] font-black px-4 py-2 inline-block rounded-full ${formData.paymentMethod === 'anticipado' ? 'bg-gold text-white shadow-gold/20 shadow-lg' : 'bg-gold/20 text-gold'}`}>-20% APLICADO</div>
                                            {formData.paymentMethod === 'anticipado' && <Check size={18} className="text-gold animate-bounce" />}
                                        </div>
                                    </div>
                                </button>

                                <button 
                                    onClick={()=>setFormData({...formData, paymentMethod: 'contra-entrega'})} 
                                    className={`p-10 border-2 text-left transition-all duration-500 relative group flex flex-col justify-between h-72 ${formData.paymentMethod === 'contra-entrega' ? 'border-luxury-black bg-luxury-black text-white shadow-2xl translate-y-[-8px]' : 'border-gray-100 opacity-60 hover:opacity-100 hover:border-luxury-black/30'}`}
                                >
                                    <div className="space-y-6">
                                        <div className={`p-4 rounded-full transition-colors ${formData.paymentMethod === 'contra-entrega' ? 'bg-luxury-black/40' : 'bg-gray-50'}`}>
                                            <Truck size={32} strokeWidth={1.5} className={formData.paymentMethod === 'contra-entrega' ? 'text-gold' : 'text-gray-300'} />
                                        </div>
                                        <h5 className="text-[15px] font-black uppercase tracking-[0.2em]">Contra Entrega</h5>
                                    </div>
                                    <div className="space-y-4">
                                        <p className={`text-[10px] uppercase tracking-widest leading-relaxed ${formData.paymentMethod === 'contra-entrega' ? 'text-gray-400' : 'text-gray-300'}`}>Paga en efectivo al recibir tu legado. Sin beneficios de preventa ni descuentos adicionales.</p>
                                        <div className="text-[9px] font-black px-3 py-1.5 inline-block rounded-full bg-gray-100 text-gray-400 opacity-40 uppercase">Precio Regular</div>
                                    </div>
                                    {formData.paymentMethod === 'contra-entrega' && <Check size={16} className="absolute top-6 right-6 text-gold" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: SUMMARY (STAYS STICKY IN VIEW) */}
                <div className="w-full lg:w-[420px] bg-gray-50 flex flex-col border-l border-gray-100 lg:h-full lg:overflow-y-auto custom-scrollbar">
                    <div className="p-10 flex-1 space-y-12">
                        <div className="flex items-center gap-6 pb-12 border-b border-gray-200">
                            <div className="w-24 h-32 bg-white flex items-center justify-center p-4 border border-gray-100 shadow-sm relative overflow-hidden group">
                                <img src={activeProduct?.image || STAR_SET.image} alt="Selected Product" className="img-contained transition-transform duration-700 group-hover:scale-110" />
                                {formData.paymentMethod === 'anticipado' && (
                                    <div className="absolute top-0 left-0 bg-gold text-white text-[8px] font-black px-2 py-1 uppercase scale-90 -translate-x-1 -translate-y-1">VIP</div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-[11px] font-black uppercase tracking-widest mb-1">{activeProduct?.name || STAR_SET.name}</h4>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">{activeProduct?.presentation}</p>
                                <p className={`text-xl font-bold mt-4 tracking-tighter ${formData.paymentMethod === 'anticipado' ? 'text-gray-300 line-through' : ''}`}>{formatPrice(currentPrice, selectedCountry, true)}</p>
                                {formData.paymentMethod === 'anticipado' && <p className="text-2xl font-black text-gold tracking-tighter mt-1">{formatPrice(currentPrice - discountAmount, selectedCountry, true)}</p>}
                            </div>
                        </div>

                        <div className="space-y-6 pt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Inversión Bruta</span>
                                <span className="text-lg font-bold tracking-tight">{formatPrice(currentPrice, selectedCountry, true)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Logística Maison</span>
                                <span className={`text-[11px] font-black uppercase tracking-widest ${shippingCost === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                    {shippingCost === 0 ? "Cortesia (Gratis)" : formatPrice(shippingCost, selectedCountry, true)}
                                </span>
                            </div>
                            {formData.paymentMethod === 'anticipado' && (
                                <div className="space-y-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-700">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">Beneficio Maison (-20%)</span>
                                        <span className="text-lg font-black text-gold">-{formatPrice(discountAmount, selectedCountry, true)}</span>
                                    </div>
                                    <div className="bg-gold/5 p-4 border border-gold/10 rounded-sm flex justify-between items-center">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gold">TU AHORRO TOTAL HOY:</span>
                                        <span className="text-xl font-black text-gold">{formatPrice(discountAmount, selectedCountry, true)}</span>
                                    </div>
                                </div>
                            )}
                            {selectedCountry.id !== 'COL' && (
                                <div className="bg-gray-100/50 p-4 rounded-sm">
                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.1em] text-center">Referencia incluye ajuste logístico internacional</p>
                                </div>
                            )}
                        </div>

                        <div className="pt-12 border-t border-gray-200 space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-luxury-black">Legado Total</p>
                                    <span className="text-[9px] font-black text-gray-300 uppercase">{selectedCountry.currency}</span>
                                </div>
                                {formData.paymentMethod === 'anticipado' && (
                                    <span className="px-3 py-1 bg-gold text-white text-[8px] font-black uppercase animate-pulse">Descuento Aplicado</span>
                                )}
                            </div>
                            <p className="text-7xl font-black tracking-tighter leading-none">{formatPrice(totalPrice, selectedCountry, true)}</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-4">Incluye seguro de transporte y logística premium</p>
                        </div>

                        <div className="space-y-4 pt-10">
                            <div className="flex items-center gap-3 opacity-40">
                                <ShieldCheck size={14} />
                                <span className="text-[9px] font-bold uppercase tracking-widest">Servidor 256-bit SSL Encriptado</span>
                            </div>
                            <div className="flex items-center gap-3 opacity-40">
                                <Package size={14} />
                                <span className="text-[9px] font-bold uppercase tracking-widest">Empaque de Lujo Maison Asegurado</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 lg:p-10 bg-white border-t border-gray-200 lg:bg-transparent">
                        <button 
                            onClick={handleMainCTA}
                            className={`btn-premium w-full h-24 group overflow-hidden relative shadow-2xl transition-all duration-300 ${formData.paymentMethod === 'anticipado' ? 'shadow-gold/40 scale-[1.02]' : 'shadow-luxury-black/10'}`}
                        > 
                            <span className="relative z-10 flex flex-col items-center justify-center gap-1 transition-transform group-hover:scale-101">
                                <span className="text-[12px] font-black uppercase tracking-widest">
                                    {formData.paymentMethod === 'anticipado' ? 'PAGAR AHORA CON 20% OFF' : 'FINALIZAR COMPRA'}
                                </span>
                                {formData.paymentMethod === 'anticipado' && (
                                    <span className="text-[8px] font-bold opacity-70 tracking-widest leading-none">REDIRECCIÓN SEGURA A MERCADO PAGO</span>
                                )}
                            </span>
                            <div className={`absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ${formData.paymentMethod === 'anticipado' ? 'bg-[#009EE3]' : 'bg-gold'}`} />
                        </button>
                    </div>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* INITIAL COUNTRY SELECTOR MODAL */}
      <AnimatePresence>
        {showInitialModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-luxury-black/95 backdrop-blur-md p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }} 
              animate={{ scale: 1, y: 0 }} 
              className="bg-white w-full max-w-lg p-10 md:p-16 shadow-2xl text-center"
            >
              <div className="mb-10">
                <span className="text-gold text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Bienvenue à L'Essence</span>
                <h3 className="text-2xl md:text-3xl font-display font-light uppercase tracking-widest leading-tight">¿Desde qué país compras?</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {Object.values(COUNTRIES).map((c) => (
                  <button 
                    key={c.id} 
                    onClick={() => {
                        setSelectedCountry(c);
                        localStorage.setItem("user-country", c.id);
                        setShowInitialModal(false);
                    }}
                    className="group border border-gray-100 p-6 flex items-center justify-between hover:border-gold hover:bg-gold/5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <img src={c.flag} className="w-8 h-6 object-cover shadow-sm" alt="" referrerPolicy="no-referrer" />
                      <span className="text-sm font-black uppercase tracking-widest group-hover:text-gold transition-colors">{c.name}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-200 group-hover:text-gold group-hover:translate-x-2 transition-all" />
                  </button>
                ))}
              </div>

              <div className="mt-12 flex items-center justify-center gap-3 opacity-30">
                <ShieldCheck size={14} />
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Sesión Segura & Entrega Maison</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RITUAL PROFILE TEST */}
      <AnimatePresence>
        {showTest && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[600] flex items-center justify-center bg-luxury-black/95 backdrop-blur-3xl p-6">
            <div className="absolute inset-0" onClick={()=>setShowTest(false)} />
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="relative w-full max-w-xl bg-white p-12 md:p-24 shadow-2xl text-center">
                <button onClick={()=>setShowTest(false)} className="absolute top-10 right-10 opacity-30 hover:opacity-100 hover:rotate-90 transition-all"><X size={24} /></button>
                {testStep < PROFILE_QUESTIONS.length ? (
                    <div>
                        <div className="flex justify-between items-center mb-20">
                            <span className="text-gold text-[9px] font-black tracking-[0.4em] uppercase">Maison Sensoriel</span>
                            <span className="text-[10px] font-black text-gray-200">{testStep + 1} / {PROFILE_QUESTIONS.length}</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-black uppercase mb-16 px-4">{PROFILE_QUESTIONS[testStep].q}</h3>
                        <div className="space-y-4">
                            {PROFILE_QUESTIONS[testStep].options.map((opt, i) => (
                                <button key={i} onClick={()=>handleTestOption(opt.tags)} className="w-full p-8 border border-gray-100 flex justify-between items-center hover:border-gold hover:bg-gold/5 transition-all group">
                                    <span className="text-[11px] font-bold uppercase tracking-widest group-hover:text-gold">{opt.text}</span>
                                    <ChevronRight size={16} className="text-gray-100 group-hover:text-gold group-hover:translate-x-2 transition-all" />
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="w-20 h-20 border border-gold rounded-full flex items-center justify-center mx-auto mb-12 shadow-inner"><Check size={32} className="text-gold" /></div>
                        <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-6 block">Diagnóstico Completo</span>
                        <h3 className="h-section mb-12 uppercase">Perfil: {profileResult?.name}</h3>
                        <p className="body-luxury mb-20 max-w-sm mx-auto"> Tu energía requiere la profundidad del ámbar y la frescura del neroli. El set completo es tu mejor estrategia. </p>
                        <button onClick={()=>{setShowTest(false); openCheckout(STAR_SET);}} className="btn-premium w-full"> APLICAR A MI LEGADO </button>
                    </div>
                )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WHATSAPP FLOATING */}
      <button 
        onClick={() => window.open(`https://wa.me/${WA_SALES}`, '_blank')}
        className="fixed bottom-24 right-6 md:bottom-12 md:right-12 z-[150] w-16 h-16 bg-[#25D366]/60 backdrop-blur-sm text-white flex items-center justify-center rounded-full shadow-2xl hover:bg-[#25D366] hover:scale-110 opacity-70 hover:opacity-100 transition-all active:scale-95 group"
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
          alt="WhatsApp" 
          className="w-8 h-8"
          referrerPolicy="no-referrer"
        />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
        </span>
      </button>

    </div>
  );
}
