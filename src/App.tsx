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
const formatPrice = (price: number, country: Country) => {
  const converted = Math.round(price * country.rate);
  return `${country.symbol}${converted.toLocaleString('de-DE')}`;
};

const WA_SALES = "12089693393";
const WA_CONFIRM = "573174555271";

const getConfirmationWALink = (data: OrderData & { lastName: string }) => {
    const message = `Hola L'Essence, confirmo mi pedido:
  
  📦 PRODUCTO: ${data.product}
  👤 CLIENTE: ${data.name} ${data.lastName}
  📱 TEL: ${data.phone}
  🌍 PAIS: ${data.country}
  📍 DIRECCIÓN: ${data.address}
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
  const [testStep, setTestStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [profileResult, setProfileResult] = useState<{name: string, protagonists: string[]} | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "", lastName: "", phone: "", email: "", address: "", reference: "",
    locationDetails: {} as Record<string, string>,
    paymentMethod: "contra-entrega"
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleWishlist = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const currentPrice = activeProduct?.id === 'set-completo' ? STAR_SET.price : 59900;
  const shippingCost = activeProduct?.id === 'set-completo' ? 0 : 10990;
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
            <span className="text-[5px] md:text-[7px] tracking-[0.2em] md:tracking-[0.3em] uppercase font-bold text-gray-300 mt-2">Héritage 🇫🇷 Français</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 cursor-pointer opacity-40 hover:opacity-100 transition-opacity" onClick={() => setIsMenuOpen(true)}>
              <span className="text-[9px] font-black tracking-widest uppercase">{selectedCountry.id}</span>
              <ChevronDown size={10} />
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
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="img-container-premium aspect-[4/3] md:aspect-[4/5] bg-white group shadow-2xl w-full max-w-[500px] lg:max-w-none">
                    <img 
                        src={STAR_SET.image} 
                        alt="Signature Collection" 
                        className="img-contained group-hover:scale-105 transition-transform duration-1000" 
                        referrerPolicy="no-referrer" 
                    />
                </motion.div>
            </div>
            <div className="w-full lg:col-span-5 text-center md:text-left flex flex-col items-center lg:items-start">
                <span className="premium-label text-gold mb-8 block font-black">Exclusive Selection</span>
                <h3 className="h-section mb-10 text-center lg:text-left w-full"> Tu Legado Completo <br /> <span className="font-light">Maison Heritage</span></h3>
                <p className="body-luxury mb-12 max-w-md mx-auto lg:mx-0 text-center lg:text-left"> No es una casualidad, es una estrategia. Cuatro fórmulas maestras para que nunca pases desapercibido. </p>
                
                <div className="space-y-6 mb-16 w-full max-w-sm mx-auto lg:mx-0">
                    {["4 Perfumes de 30ml (Set Completo)", "Envío Prioritario Gratis", "Garantía de Autenticidad Grasse"].map((item, i) => (
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
                                <span className="text-[10px] font-black text-gold border border-gold/40 px-4 py-2 uppercase tracking-[0.2em] bg-gold/5 block w-fit">50% OFF</span>
                            </div>
                        </div>
                        <button onClick={() => openCheckout(STAR_SET)} className="btn-premium w-full md:w-auto shadow-gold/20 py-6"> ORDENAR SET </button>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-4 opacity-30 mt-4">
                        <Truck size={14} className="text-gold" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">Entrega Aérea Asegurada</span>
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
                    <div key={f.id} className="group cursor-pointer" onClick={() => setActiveProduct(f)}>
                        <div className="img-container-premium aspect-square md:aspect-[4/5] mb-8 group-hover:shadow-xl transition-all duration-700 bg-[#FBFBFB]">
                            <img src={f.image} alt={f.name} className="img-contained group-hover:scale-105 transition-transform duration-1000" />
                            <button onClick={(e) => toggleWishlist(f.id, e)} className="absolute top-4 right-4 text-gray-200 z-10 hover:text-gold transition-colors">
                                <Heart size={18} fill={wishlist.includes(f.id) ? "currentColor" : "none"} className={wishlist.includes(f.id) ? "text-gold" : ""} />
                            </button>
                        </div>
                        <div className="text-center">
                            <span className="text-[8px] font-black text-gray-200 uppercase tracking-[0.4em] mb-3 block">Legado {f.name}</span>
                            <h4 className="h-card mb-4">{f.name}</h4>
                            <p className="text-lg md:text-xl font-black tracking-tight mb-6">{formatPrice(59900, selectedCountry)}</p>
                            <button className="text-[9px] font-black uppercase tracking-widest text-gold underline underline-offset-8 decoration-gold/20 hover:decoration-gold transition-all">Detalles</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 6. MAISON HISTORY - FRENCH ORIGIN */}
      <section className="bg-luxury-black text-white min-h-[600px] flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 min-h-[400px]">
            <img 
                src="https://images.unsplash.com/photo-1582211594533-268f4f1edcb9?q=80&w=2600&auto=format&fit=crop" 
                alt="Maison Grasse" 
                className="w-full h-full object-cover grayscale opacity-40 hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
            />
        </div>
        <div className="w-full md:w-1/2 p-12 md:p-32 flex flex-col justify-center">
            <span className="premium-label text-gold mb-8 block">Grasse · Côte d'Azur</span>
            <h2 className="text-[32px] md:text-[60px] font-light leading-none mb-12 uppercase tracking-tighter"> El Arte de la <br /> <span className="text-gold font-bold">Destilación Francesa</span></h2>
            <p className="body-luxury text-gray-400 text-lg mb-16 max-w-sm"> Importamos maestría. Cada gota nace en el epicentro mundial de la perfumería fina, garantizando una fijación y complejidad inigualables en el mercado latino. </p>
            <div className="grid grid-cols-2 gap-12 pt-12 border-t border-white/10">
                <div>
                    <span className="premium-label text-gold opacity-100">LOGÍSTICA</span>
                    <p className="text-xl font-bold uppercase tracking-widest">Aérea Directa</p>
                </div>
                <div>
                    <span className="premium-label text-gold opacity-100">CALIDAD</span>
                    <p className="text-xl font-bold uppercase tracking-widest">ISO 9001 Grasse</p>
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
            {REVIEWS.slice(0, 6).map((rev, i) => (
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
            <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                <span className="premium-label mb-10 block">Región Aktive</span>
                <div className="flex gap-6">
                    {Object.values(COUNTRIES).map(c => (
                        <button key={c.id} onClick={() => setSelectedCountry(c)} className={`text-3xl transition-transform ${selectedCountry.id === c.id ? 'scale-125' : 'opacity-20 grayscale'}`}> {c.flag} </button>
                    ))}
                </div>
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

      {/* ONE-PAGE PREMIUM CHECKOUT */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCheckoutOpen(false)} className="fixed inset-0 bg-luxury-black/90 backdrop-blur-md z-[500]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 35 }} className="fixed right-0 top-0 h-full w-full max-w-xl bg-white z-[510] flex flex-col shadow-2xl overflow-hidden">
                <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-black tracking-widest uppercase">One-Page Checkout</h3>
                        <p className="text-[9px] font-bold text-gold uppercase tracking-[0.3em] mt-2">Maison L'Essence Secure Server</p>
                    </div>
                    <button onClick={() => setIsCheckoutOpen(false)} className="p-2 hover:rotate-90 transition-transform"><X size={24} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 md:p-14 custom-scrollbar space-y-16">
                    {/* Item Summary */}
                    <div className="flex items-center gap-8 pb-10 border-b border-gray-50">
                        <div className="w-24 h-32 bg-[#FBFBFB] flex items-center justify-center p-4">
                            <img src={activeProduct?.image || STAR_SET.image} className="img-contained" />
                        </div>
                        <div>
                            <h4 className="text-[12px] font-black uppercase mb-1">{activeProduct?.name || STAR_SET.name}</h4>
                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest leading-loose">{activeProduct?.presentation}</p>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-12">
                        <div className="space-y-8">
                            <h5 className="premium-label text-gold border-b border-gold/10 pb-4">Identidad & Contacto</h5>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1"><label className="premium-label">Nombre</label><input className="premium-input" placeholder="Nombre" onChange={e=>setFormData({...formData, name: e.target.value})} /></div>
                                <div className="space-y-1"><label className="premium-label">Apellidos</label><input className="premium-input" placeholder="Apellidos" onChange={e=>setFormData({...formData, lastName: e.target.value})} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1"><label className="premium-label">Teléfono WhatsApp</label><input className="premium-input" placeholder="+57 ---" onChange={e=>setFormData({...formData, phone: e.target.value})} /></div>
                                <div className="space-y-1"><label className="premium-label">País de Destino</label><div className="premium-input text-gray-200">{selectedCountry.flag} {selectedCountry.name}</div></div>
                            </div>
                        </div>

                        <div className="space-y-8 pt-8">
                            <h5 className="premium-label text-gold border-b border-gold/10 pb-4">Logística de Entrega</h5>
                            {selectedCountry.id === 'COL' && (
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1"><label className="premium-label">Departamento</label><input className="premium-input" placeholder="Departamento" onChange={e=>setFormData({...formData, locationDetails: {...formData.locationDetails, dept: e.target.value}})} /></div>
                                    <div className="space-y-1"><label className="premium-label">Ciudad</label><input className="premium-input" placeholder="Ciudad" onChange={e=>setFormData({...formData, locationDetails: {...formData.locationDetails, city: e.target.value}})} /></div>
                                </div>
                            )}
                            {selectedCountry.id !== 'COL' && (
                                <div className="grid grid-cols-2 gap-8">
                                    {selectedCountry.fields.map(f => (
                                        <div key={f.id} className="space-y-1"><label className="premium-label">{f.label}</label><input className="premium-input" placeholder={f.placeholder} onChange={e=>setFormData({...formData, locationDetails: {...formData.locationDetails, [f.id]: e.target.value}})} /></div>
                                    ))}
                                </div>
                            )}
                            <div className="space-y-1"><label className="premium-label">Dirección Exacta</label><input className="premium-input" placeholder="Calle, Carrera, Conjunto, Apto..." onChange={e=>setFormData({...formData, address: e.target.value})} /></div>
                            <div className="space-y-1"><label className="premium-label">Punto de Referencia <span className="text-gold font-black">*Obligatorio</span></label><input className="premium-input" placeholder="Tienda cercana, color casa, etc..." onChange={e=>setFormData({...formData, reference: e.target.value})} /></div>
                        </div>

                        <div className="space-y-8 pt-8">
                            <h5 className="premium-label text-gold border-b border-gold/10 pb-4">Ritual de Pago</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button onClick={()=>setFormData({...formData, paymentMethod: 'contra-entrega'})} className={`p-8 border flex flex-col gap-4 text-left group transition-all ${formData.paymentMethod === 'contra-entrega' ? 'border-gold bg-gold/5' : 'border-gray-100 opacity-40 hover:opacity-100 hover:border-gray-300 pointer-events-auto'}`}>
                                    <Truck size={24} className={formData.paymentMethod === 'contra-entrega' ? 'text-gold' : 'text-gray-300'} />
                                    <div><span className="text-[10px] font-black uppercase tracking-widest">Contra Entrega</span><p className="text-[8px] text-gray-300 uppercase tracking-widest mt-1">Efectivo al recibir</p></div>
                                </button>
                                <button onClick={()=>setFormData({...formData, paymentMethod: 'anticipado'})} className={`p-8 border flex flex-col gap-4 text-left relative overflow-hidden transition-all ${formData.paymentMethod === 'anticipado' ? 'border-gold bg-gold/5' : 'border-gray-100 opacity-40 hover:opacity-100 hover:border-gray-300 pointer-events-auto'}`}>
                                    <div className="absolute top-0 right-0 bg-gold text-white px-2 py-1 text-[7px] font-black uppercase transform translate-x-2 translate-y-2 rotate-45">OFF 20%</div>
                                    <CreditCard size={24} className={formData.paymentMethod === 'anticipado' ? 'text-gold' : 'text-gray-300'} />
                                    <div><span className="text-[10px] font-black uppercase tracking-widest">Pago Adelantado</span><p className="text-[8px] text-gray-300 uppercase tracking-widest mt-1">Transferencia / Tarjeta</p></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-10 md:p-14 bg-white border-t border-gray-100 flex flex-col gap-10">
                    <div className="space-y-4">
                        <div className="flex justify-between items-end opacity-20"><span className="text-[10px] font-black uppercase tracking-[0.2em]">Merchandise Subtotal</span><span className="text-xl font-sans tracking-tight">{formatPrice(currentPrice, selectedCountry)}</span></div>
                        <div className="flex justify-between items-end"><span className={`text-[10px] font-black uppercase tracking-[0.2em] ${shippingCost === 0 ? 'text-gold' : 'opacity-20'}`}>Maison Courier Priority</span><span className={`text-xl font-sans tracking-tight ${shippingCost === 0 ? 'text-gold font-black' : 'opacity-20'}`}>{shippingCost === 0 ? "GRATIS" : formatPrice(shippingCost, selectedCountry)}</span></div>
                        {formData.paymentMethod === 'anticipado' && (
                            <div className="flex justify-between items-end"><span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold animate-pulse">Descuento Anticipado (-20%)</span><span className="text-xl font-black text-gold">-{formatPrice(discountAmount, selectedCountry)}</span></div>
                        )}
                    </div>
                    <div className="flex justify-between items-end border-t border-gray-100 pt-10">
                        <div><p className="premium-label text-gray-200 mb-2">Total Inversión</p><p className="text-5xl font-black tracking-tighter leading-none">{formatPrice(totalPrice, selectedCountry)}</p></div>
                        <p className="text-[9px] font-black text-gray-200 uppercase tracking-[0.3em] mb-1">{selectedCountry.currency}</p>
                    </div>
                    <button 
                        onClick={()=>{
                            const link = getConfirmationWALink({ ...formData, product: activeProduct?.name || STAR_SET.name, price: formatPrice(totalPrice, selectedCountry), country: selectedCountry.name });
                            window.open(link, '_blank');
                        }}
                        className="btn-premium h-24"
                    > CONFIRMAR PEDIDO <ArrowRight size={20} /> </button>
                </div>
            </motion.div>
          </>
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
        className="fixed bottom-24 right-6 md:bottom-12 md:right-12 z-[150] w-16 h-16 bg-luxury-black text-white flex items-center justify-center rounded-full shadow-2xl hover:bg-gold transition-all active:scale-90 group"
      >
        <MessageCircle size={30} strokeWidth={1.5} />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-gold"></span>
        </span>
      </button>

    </div>
  );
}
