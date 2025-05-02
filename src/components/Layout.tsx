
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ChevronDown, Menu, X, Globe, Search } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import PromotionalBanner from "./checkout/PromotionalBanner";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useSupabaseAuth();
  
  // Função para determinar para onde o cliente deve ser direcionado
  const getClientAreaLink = () => {
    if (!user) return "/register";
    
    // Verificar se o usuário é admin (você pode ajustar a lógica conforme necessário)
    const isAdmin = user.user_metadata?.role === 'admin' || user.email?.endsWith('@admin.com');
    
    return isAdmin ? '/admin' : '/client';
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top promotional banner */}
      <PromotionalBanner 
        message="Economize até 75% na Hospedagem Web | Oferta por tempo limitado!" 
        isSticky={true}
        className="text-sm py-2"
      />

      <header className="bg-white sticky top-12 z-50 shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="font-bold text-2xl text-[#345990]">
                <img 
                  src="/ANGOHOST-01.png" 
                  alt="AngoHost Logo" 
                  className="h-10" 
                />
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <NavigationMenu>
                <NavigationMenuList className="space-x-1">
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-gray-700 hover:bg-gray-100">Hospedagem</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/cpanel-hosting"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100"
                            >
                              <div className="text-sm font-medium leading-none text-gray-900">Hospedagem cPanel</div>
                              <p className="text-xs leading-snug text-gray-500">
                                Hospedagem compartilhada com painel cPanel
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/wordpress-hosting"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100"
                            >
                              <div className="text-sm font-medium leading-none text-gray-900">WordPress Hosting</div>
                              <p className="text-xs leading-snug text-gray-500">
                                Hospedagem otimizada para WordPress
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/vps-hosting"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100"
                            >
                              <div className="text-sm font-medium leading-none text-gray-900">VPS</div>
                              <p className="text-xs leading-snug text-gray-500">
                                Servidores privados virtuais
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/dedicated-servers"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100"
                            >
                              <div className="text-sm font-medium leading-none text-gray-900">Servidores Dedicados</div>
                              <p className="text-xs leading-snug text-gray-500">
                                Servidores físicos exclusivos
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-gray-700 hover:bg-gray-100">Domínios</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/domains"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100"
                            >
                              <div className="text-sm font-medium leading-none text-gray-900">Registro de Domínios</div>
                              <p className="text-xs leading-snug text-gray-500">
                                Registre seu domínio .ao e outras extensões
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/domain-transfer"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100"
                            >
                              <div className="text-sm font-medium leading-none text-gray-900">Transferência de Domínios</div>
                              <p className="text-xs leading-snug text-gray-500">
                                Transfira seu domínio para a nossa empresa
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-gray-700 hover:bg-gray-100">Email</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/professional-email"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100"
                            >
                              <div className="text-sm font-medium leading-none text-gray-900">Email Profissional</div>
                              <p className="text-xs leading-snug text-gray-500">
                                Solução de email profissional para empresas
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/exchange-online"
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100"
                            >
                              <div className="text-sm font-medium leading-none text-gray-900">Microsoft 365</div>
                              <p className="text-xs leading-snug text-gray-500">
                                Microsoft Exchange Online e Microsoft 365
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link to="/contact" className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md block">
                      Contacto
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <div className="flex items-center space-x-4 ml-4">
                <button className="text-gray-700 hover:text-gray-900">
                  <Search className="h-5 w-5" />
                </button>
                
                <button className="text-gray-700 hover:text-gray-900 flex items-center">
                  <Globe className="h-5 w-5 mr-1" />
                  <span className="text-sm">PT</span>
                </button>
                
                <Link to="/cart">
                  <Button variant="outline" size="icon" className="text-gray-700 border-gray-300 hover:bg-gray-100">
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </Link>
                
                <Link to={getClientAreaLink()}>
                  <Button className="bg-[#673de6] hover:bg-[#5025d1] text-white">Área do Cliente</Button>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="container py-3 space-y-3">
              <div className="py-2 border-b">
                <div className="font-medium mb-1 text-gray-900">Hospedagem</div>
                <ul className="pl-3 space-y-1">
                  <li><Link to="/cpanel-hosting" className="block py-1 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Hospedagem cPanel</Link></li>
                  <li><Link to="/wordpress-hosting" className="block py-1 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>WordPress Hosting</Link></li>
                  <li><Link to="/vps-hosting" className="block py-1 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>VPS</Link></li>
                  <li><Link to="/dedicated-servers" className="block py-1 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Servidores Dedicados</Link></li>
                </ul>
              </div>
              
              <div className="py-2 border-b">
                <div className="font-medium mb-1 text-gray-900">Domínios</div>
                <ul className="pl-3 space-y-1">
                  <li><Link to="/domains" className="block py-1 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Registro de Domínios</Link></li>
                  <li><Link to="/domain-transfer" className="block py-1 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Transferência de Domínios</Link></li>
                </ul>
              </div>
              
              <div className="py-2 border-b">
                <div className="font-medium mb-1 text-gray-900">Email</div>
                <ul className="pl-3 space-y-1">
                  <li><Link to="/professional-email" className="block py-1 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Email Profissional</Link></li>
                  <li><Link to="/exchange-online" className="block py-1 text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Microsoft 365</Link></li>
                </ul>
              </div>
              
              <div className="py-2">
                <Link to="/contact" className="block py-1 text-gray-900 font-medium" onClick={() => setMobileMenuOpen(false)}>Contacto</Link>
              </div>

              <div className="pt-4 flex flex-col space-y-2">
                <Link to={getClientAreaLink()} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="default" className="w-full bg-[#673de6] hover:bg-[#5025d1] text-white">Área do Cliente</Button>
                </Link>
                <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-gray-300 text-gray-700">
                    <ShoppingCart className="h-4 w-4 mr-2" /> Carrinho
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto py-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <img 
                src="/ANGOHOST-03.png" 
                alt="AngoHost Logo" 
                className="h-10 mb-4 brightness-200 contrast-200 invert"
              />
              <p className="text-sm text-gray-300 mb-4">
                Soluções em hospedagem web confiáveis e de alta performance para o seu negócio online.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-lg mb-4 text-white">Hospedagem</h5>
              <ul className="space-y-2">
                <li><Link to="/cpanel-hosting" className="text-sm text-gray-300 hover:text-white">Hospedagem cPanel</Link></li>
                <li><Link to="/wordpress-hosting" className="text-sm text-gray-300 hover:text-white">WordPress Hosting</Link></li>
                <li><Link to="/vps-hosting" className="text-sm text-gray-300 hover:text-white">Servidores VPS</Link></li>
                <li><Link to="/dedicated-servers" className="text-sm text-gray-300 hover:text-white">Servidores Dedicados</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium text-lg mb-4 text-white">Domínios e Email</h5>
              <ul className="space-y-2">
                <li><Link to="/domains" className="text-sm text-gray-300 hover:text-white">Registro de Domínios</Link></li>
                <li><Link to="/domain-transfer" className="text-sm text-gray-300 hover:text-white">Transferência de Domínios</Link></li>
                <li><Link to="/professional-email" className="text-sm text-gray-300 hover:text-white">Email Profissional</Link></li>
                <li><Link to="/exchange-online" className="text-sm text-gray-300 hover:text-white">Microsoft 365</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium text-lg mb-4 text-white">Empresa</h5>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-sm text-gray-300 hover:text-white">Sobre nós</Link></li>
                <li><Link to="/contact" className="text-sm text-gray-300 hover:text-white">Contacto</Link></li>
                <li><Link to={getClientAreaLink()} className="text-sm text-gray-300 hover:text-white">Área do Cliente</Link></li>
                <li><Link to="/blog" className="text-sm text-gray-300 hover:text-white">Blog</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} AngoHost. Todos os direitos reservados.
              </p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <Link to="/terms" className="text-sm text-gray-400 hover:text-white">Termos e Condições</Link>
                <Link to="/privacy" className="text-sm text-gray-400 hover:text-white">Política de Privacidade</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
