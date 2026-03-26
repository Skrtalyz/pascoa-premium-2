/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Heart,
  Share2,
  Search,
  Menu,
  User,
  Package,
  Clock,
  CreditCard,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Components ---

const CACHE_BUSTER = new Date().getTime();

const appendUrlParams = (url: string) => {
  if (typeof window === 'undefined') return url;
  const search = window.location.search;
  if (!search || !url || url === '#' || url.startsWith('javascript:') || url.startsWith('tel:') || url.startsWith('mailto:')) return url;
  
  try {
    const urlObj = new URL(url.startsWith('http') ? url : window.location.origin + (url.startsWith('/') ? url : '/' + url));
    const currentParams = new URLSearchParams(search);
    
    currentParams.forEach((value, key) => {
      urlObj.searchParams.set(key, value);
    });
    
    // Se a URL original era relativa, tenta retornar relativa se possível, 
    // mas para links externos (checkout) retornará absoluta corretamente.
    return urlObj.toString();
  } catch (e) {
    return url;
  }
};

const CustomVideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isEnded, setIsEnded] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleInteraction = () => {
    if (!videoRef.current) return;
    if (!hasInteracted) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      setIsMuted(false);
      setHasInteracted(true);
      videoRef.current.play();
      setIsPlaying(true);
      setIsEnded(false);
    } else {
      togglePlay();
    }
  };

  const handleReplay = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
    setIsEnded(false);
  };

  return (
    <div 
      className="relative w-full h-full group cursor-pointer"
      onClick={() => handleInteraction()}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-auto block"
        autoPlay
        muted={isMuted}
        playsInline
        onEnded={() => {
          setIsEnded(true);
          setIsPlaying(false);
        }}
      />
      
      {/* Overlay: Click to unmute */}
      {!hasInteracted && !isEnded && (
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white transition-opacity group-hover:bg-black/50">
          <div className="bg-stone-900/80 p-4 rounded-full mb-4 animate-bounce">
            <VolumeX size={32} />
          </div>
          <p className="font-black text-lg uppercase tracking-widest text-center px-6">
            Clique para ouvir o depoimento
          </p>
        </div>
      )}

      {/* Controls: Play/Pause (only shown after interaction and if not ended) */}
      {hasInteracted && !isEnded && (
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => togglePlay()}
            className="bg-stone-900/80 p-2 rounded-full text-white hover:bg-stone-900"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </div>
      )}

      {/* End State: Watch Again */}
      {isEnded && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
          <button 
            onClick={() => handleReplay()}
            className="bg-white text-stone-900 font-black px-8 py-4 rounded-md flex items-center gap-3 hover:scale-105 transition-transform uppercase tracking-widest text-sm"
          >
            <RotateCcw size={20} />
            Ver Novamente
          </button>
        </div>
      )}
    </div>
  );
};

const Accordion = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-stone-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex justify-between items-center text-left hover:text-brand-pink transition-colors"
      >
        <span className="font-bold text-stone-800 tracking-tight">{title}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-stone-600 text-sm leading-relaxed font-light">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [selectedSize, setSelectedSize] = useState<string>('36');
  const [mainImage, setMainImage] = useState('https://i.postimg.cc/zGhM3j0F/Gemini-Generated-Image-7so3nx7so3nx7so3.png');
  
  const handleReviewClick = () => {
    // Função vazia para evitar processamento de eventos complexos
  };

  const handleSizeSelect = (size: string) => {
    if (typeof size === 'string') {
      setSelectedSize(size);
    }
  };

  const handleImageSelect = (imgUrl: string) => {
    if (typeof imgUrl === 'string') {
      setMainImage(imgUrl);
    }
  };

  const sizes = ['31', '32', '33', '34', '35', '36', '37', '38', '39', 'Personalizado'];
  
  // URLs das imagens do kit (Perfume, Ovo, Pantufa, Combo)
  const thumbnails = [
    'https://i.postimg.cc/zGhM3j0F/Gemini-Generated-Image-7so3nx7so3nx7so3.png', // Perfume Yara
    'https://i.postimg.cc/sx86gQSx/Gemini-Generated-Image-3eydlo3eydlo3eyd.png', // Ovo de Páscoa
    'https://i.postimg.cc/Nf9CPDqM/Gemini-Generated-Image-qf6n60qf6n60qf6n.png', // Pantufa Ursinhos
    'https://i.postimg.cc/P513dqqX/Gemini-Generated-Image-ivxvnwivxvnwivxv.png'  // Kit Completo
  ];

  useEffect(() => {
    const search = window.location.search;
    if (!search) return;

    const updateLinks = () => {
      const links = document.querySelectorAll('a');
      links.forEach(link => {
        const url = link.getAttribute('href');
        if (url && !url.startsWith('#') && !url.startsWith('javascript:') && !url.startsWith('tel:') && !url.startsWith('mailto:')) {
          const newUrl = appendUrlParams(url);
          if (newUrl !== url && link.getAttribute('href') !== newUrl) {
            link.setAttribute('href', newUrl);
          }
        }
      });
    };

    updateLinks();
    // Observer para capturar links adicionados dinamicamente
    const observer = new MutationObserver(updateLinks);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-stone-900 selection:bg-rose-100">
      {/* Announcement Bar */}
      <div className="bg-brand-pink text-white py-2.5 px-4 text-center text-[11px] font-bold uppercase tracking-[0.2em]">
        Frete Grátis para todo o Brasil • Envio Imediato
      </div>

      {/* Navigation */}
      <nav className="border-b border-stone-100 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-28 flex items-center justify-between">
          <div className="flex items-center gap-6 lg:hidden">
            <Menu size={24} />
          </div>
          
          <img 
            src="https://i.postimg.cc/pV6pzJGC/Design-sem-nome-(21).png" 
            alt="Outlet de Luxo" 
            className="h-20 w-auto absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
          />

          <div className="flex items-center gap-5">
            <Search size={20} className="hidden sm:block cursor-pointer hover:text-brand-pink transition-colors" />
            <User size={20} className="hidden sm:block cursor-pointer hover:text-brand-pink transition-colors" />
            <div className="relative cursor-pointer group">
              <ShoppingBag size={22} className="group-hover:text-brand-pink transition-colors" />
              <span className="absolute -top-2 -right-2 bg-brand-pink text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[11px] text-stone-400 uppercase font-bold tracking-widest mb-8">
          <a href="#" className="hover:text-stone-900">Início</a>
          <ChevronRight size={10} />
          <a href="#" className="hover:text-stone-900">Páscoa</a>
          <ChevronRight size={10} />
          <span className="text-stone-900">Combo Premium Páscoa de Luxo</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-stone-50 rounded-lg overflow-hidden border border-stone-100 relative min-h-[300px] md:h-[600px] flex items-center justify-center">
              <img 
                src={`${mainImage}${mainImage.includes('?') ? '&' : '?'}v=${CACHE_BUSTER}`} 
                alt="Combo Bella Donna" 
                className="max-w-full max-h-full block"
                fetchPriority="high"
                loading="eager"
                decoding="sync"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {thumbnails.map((thumb, i) => (
                <button 
                  key={i}
                  type="button"
                  onClick={() => handleImageSelect(thumb)}
                  className={`relative rounded-md overflow-hidden border-2 transition-all bg-stone-50 flex items-center justify-center w-full h-20 sm:h-24 md:h-32 ${mainImage === thumb ? 'border-brand-pink' : 'border-transparent hover:border-stone-200'}`}
                >
                  <img 
                    src={`${thumb}${thumb.includes('?') ? '&' : '?'}v=${CACHE_BUSTER}`} 
                    alt="" 
                    className="max-w-full max-h-full object-contain block" 
                    loading="eager"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-brand-pink uppercase tracking-widest bg-rose-50 px-3 py-1 rounded">Oferta Exclusiva</span>
              </div>
              
              <h2 className="text-4xl font-black leading-tight text-stone-900 tracking-tight">
                Combo Premium Páscoa de Luxo: Perfumes + Chocolates + Pantufa
              </h2>

              <div className="flex items-center gap-3">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <span className="text-sm font-bold text-stone-500 underline underline-offset-4 cursor-pointer">4.9/5 (1.284 avaliações)</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-stone-400 line-through text-xl">R$ 99,90</span>
                <span className="text-4xl font-black text-brand-pink">R$ 49,92</span>
              </div>
              <p className="text-emerald-600 text-sm font-bold flex items-center gap-1">
                <CheckCircle2 size={16} /> Economia de 50% • Em estoque
              </p>
            </div>

            <div className="h-px bg-stone-100" />

            {/* Size Selector */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Tamanho da Pantufa</label>
                <button className="text-[10px] font-bold text-stone-400 underline uppercase tracking-wider">Guia de Tamanhos</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    className={`min-w-[60px] h-12 flex items-center justify-center border-2 text-xs font-bold transition-all rounded-md ${
                      selectedSize === size 
                        ? 'border-stone-900 bg-stone-900 text-white' 
                        : 'border-stone-200 hover:border-stone-400 text-stone-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {selectedSize === 'Personalizado' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-2"
                >
                  <input 
                    type="text" 
                    placeholder="Digite seu tamanho (ex: 40, 42...)"
                    className="w-full p-4 rounded-md border border-stone-200 focus:border-stone-900 outline-none text-sm"
                  />
                </motion.div>
              )}
            </div>

            {/* CTA */}
            <div className="space-y-6">
              <div className="space-y-4">
                <a 
                  href={appendUrlParams("https://pagar.belladonna.cyou/checkout/v3/GIlhk4A5ifZZ3BCma5zc")}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-6 rounded-md transition-all shadow-lg active:scale-[0.98] text-sm uppercase tracking-widest flex items-center justify-center"
                >
                  COMPRAR AGORA
                </a>
              </div>

              <div className="flex flex-col items-center gap-4 pt-4">
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-500" /> Pagamento 100% Seguro e Criptografado
                </p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-stone-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-stone-50 rounded-full">
                  <Truck size={18} className="text-stone-600" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider">
                  <p className="text-stone-900">Frete Grátis</p>
                  <p className="text-stone-400">Todo o Brasil</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-stone-50 rounded-full">
                  <Package size={18} className="text-stone-600" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider">
                  <p className="text-stone-900">Devolução</p>
                  <p className="text-stone-400">Até 7 dias</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section (Accordions) */}
        <div className="mt-20 max-w-3xl">
          <Accordion title="DESCRIÇÃO" defaultOpen={true}>
            <p className="mb-4">
              Celebre a Páscoa com o máximo de sofisticação. Este combo exclusivo foi montado para proporcionar uma experiência sensorial completa, unindo a alta perfumaria árabe e nacional com o melhor do chocolate premium.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Lattafa Yara (100ml):</strong> O perfume árabe mais viral do TikTok. Uma fragrância gourmand viciante com notas de orquídea, heliotrópio e tangerina.</li>
              <li><strong>Eudora EDP:</strong> Elegância atemporal com fixação impecável.</li>
              <li><strong>Ovo Cacau Show Ursinhos Carinhosos:</strong> Chocolate ao leite com uma pantufa exclusiva e ultra macia.</li>
              <li><strong>Ovo laCreme 360g:</strong> A linha mais cremosa da Cacau Show para os verdadeiros amantes de chocolate.</li>
            </ul>
          </Accordion>
          
          <Accordion title="ESPECIFICAÇÕES TÉCNICAS">
            <div className="grid grid-cols-2 gap-y-4 text-xs">
              <div className="font-bold text-stone-400 uppercase tracking-wider">Marca Perfume 1</div>
              <div className="text-stone-900 font-bold">Lattafa (Importado)</div>
              
              <div className="font-bold text-stone-400 uppercase tracking-wider">Volume</div>
              <div className="text-stone-900 font-bold">100ml</div>
              
              <div className="font-bold text-stone-400 uppercase tracking-wider">Marca Chocolate</div>
              <div className="text-stone-900 font-bold">Cacau Show</div>
              
              <div className="font-bold text-stone-400 uppercase tracking-wider">Material Pantufa</div>
              <div className="text-stone-900 font-bold">Pelúcia Premium (Antialérgica)</div>
              
              <div className="font-bold text-stone-400 uppercase tracking-wider">Garantia</div>
              <div className="text-stone-900 font-bold">90 dias contra defeitos</div>
            </div>
          </Accordion>

          <Accordion title="POLÍTICAS DE ENTREGA">
            <p className="mb-4">
              Trabalhamos com os melhores parceiros logísticos para garantir que seu presente de Páscoa chegue impecável e dentro do prazo.
            </p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Truck size={18} className="text-brand-pink shrink-0" />
                <div>
                  <p className="font-bold text-stone-800 text-sm">Prazo de Postagem</p>
                  <p className="text-stone-500 text-xs">Seu pedido será despachado em até 24h úteis após a confirmação do pagamento.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock size={18} className="text-brand-pink shrink-0" />
                <div>
                  <p className="font-bold text-stone-800 text-sm">Prazo de Entrega</p>
                  <p className="text-stone-500 text-xs">Capitais: 3 a 7 dias úteis. Interior: 5 a 12 dias úteis.</p>
                </div>
              </div>
            </div>
          </Accordion>
        </div>

        {/* Reviews Section - REWRITTEN FROM ZERO */}
        <section className="mt-32 border-t border-stone-100 pt-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h3 className="text-3xl font-black text-stone-900 tracking-tight">Avaliações de Clientes</h3>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex text-amber-400">
                  <Star size={20} fill="currentColor" />
                  <Star size={20} fill="currentColor" />
                  <Star size={20} fill="currentColor" />
                  <Star size={20} fill="currentColor" />
                  <Star size={20} fill="currentColor" />
                </div>
                <span className="font-bold text-stone-900">4.9 de 5 estrelas</span>
              </div>
            </div>
            <button 
              onClick={() => handleReviewClick()}
              className="bg-white border-2 border-stone-900 text-stone-900 font-black px-8 py-4 rounded-md hover:bg-stone-900 hover:text-white transition-all text-xs uppercase tracking-widest"
            >
              ESCREVER UMA AVALIAÇÃO
            </button>
          </div>

          {/* Video Review Container */}
          <div className="mb-16 max-w-2xl mx-auto overflow-hidden rounded-2xl border-4 border-stone-900 shadow-2xl">
            <CustomVideoPlayer src="https://www.dropbox.com/scl/fi/dtto950uslbod2j749ij8/depoimento-perfume-pascoa-1.mp4?rlkey=i7cj173zv7ngmhs2y0bkh7ewl&st=dpd0djdn&raw=1" />
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img 
                  src="https://i.postimg.cc/nh7kB9Dh/image.png" 
                  className="w-12 h-12 rounded-full object-cover" 
                  alt="User" 
                />
                <div>
                  <p className="font-bold text-stone-900">Ana Paula M.</p>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">12 de Março, 2026</p>
                </div>
              </div>
              <div className="flex text-amber-400">
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
              </div>
              <p className="text-stone-600 text-sm leading-relaxed italic font-light">"Simplesmente apaixonada por esse kit! O perfume Yara é maravilhoso e a pantufa é super confortável. A entrega foi muito rápida."</p>
              <div className="mt-4 rounded-lg overflow-hidden border border-stone-100 flex items-center justify-center bg-stone-50">
                <img 
                  src="https://i.postimg.cc/sgZWbFjk/novo.webp" 
                  className="max-w-full h-auto block" 
                  alt="Review" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img 
                  src="https://i.postimg.cc/gk7SvPtM/image.png" 
                  className="w-12 h-12 rounded-full object-cover" 
                  alt="User" 
                />
                <div>
                  <p className="font-bold text-stone-900">Ricardo S.</p>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">10 de Março, 2026</p>
                </div>
              </div>
              <div className="flex text-amber-400">
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
              </div>
              <p className="text-stone-600 text-sm leading-relaxed italic font-light">"Comprei para minha namorada e ela amou. O chocolate laCreme é o melhor que existe. Recomendo muito!"</p>
              <div className="mt-4 rounded-lg overflow-hidden border border-stone-100 flex items-center justify-center bg-stone-50">
                <img 
                  src="https://i.postimg.cc/hj86r3Qr/nv.webp" 
                  className="max-w-full h-auto block" 
                  alt="Review" 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-12">
            <button className="flex flex-col items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">+ Ver Mais Avaliações (147)</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stone-50 border-t border-stone-100 py-20 px-4 mt-32">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <img 
              src="https://i.postimg.cc/pV6pzJGC/Design-sem-nome-(21).png" 
              alt="Bella Donna" 
              className="h-24 w-auto"
            />
            <p className="text-xs text-stone-500 leading-relaxed font-light">
              Sua curadoria exclusiva de presentes premium. Unindo o luxo da perfumaria internacional com a doçura da Páscoa brasileira.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-900">Atendimento</h4>
            <ul className="text-xs text-stone-500 space-y-3">
              <li className="hover:text-brand-pink cursor-pointer transition-colors">Fale Conosco</li>
              <li className="hover:text-brand-pink cursor-pointer transition-colors">WhatsApp: (11) 92948-1859</li>
              <li className="hover:text-brand-pink cursor-pointer transition-colors">E-mail: suporte@belladonna.com</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-900">Institucional</h4>
            <ul className="text-xs text-stone-500 space-y-3">
              <li className="hover:text-brand-pink cursor-pointer transition-colors">Sobre Nós</li>
              <li className="hover:text-brand-pink cursor-pointer transition-colors">Políticas de Privacidade</li>
              <li className="hover:text-brand-pink cursor-pointer transition-colors">Termos de Serviço</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">© 2026 Bella Donna. Todos os direitos reservados.</p>
          <div className="flex gap-4 opacity-30 grayscale">
            <CreditCard size={20} />
            <ShoppingBag size={20} />
            <ShieldCheck size={20} />
          </div>
        </div>
      </footer>
    </div>
  );
}
