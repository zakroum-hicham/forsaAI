"use client"

import React, { useState } from 'react';
import Link from 'next/link'
import { 
  Menu, 
  X, 
  ArrowRight, 
  Star, 
  Users, 
  BarChart3, 
  Brain, 
  Clock, 
  Shield,
  CheckCircle,
  Play,
  Quote
} from 'lucide-react';
import Logo from './Logo';

const ForsaAILanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Fonctionnalités</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">Tarifs</a>
              <a href="#testimonials" className="text-slate-600 hover:text-slate-900 transition-colors">Témoignages</a>
              <a href="#contact" className="text-slate-600 hover:text-slate-900 transition-colors">Contact</a>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login" className="text-slate-600 hover:text-slate-900 transition-colors">
                Connexion
              </Link>
              <Link href="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">
                Essai gratuit
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Fonctionnalités</a>
                <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">Tarifs</a>
                <a href="#testimonials" className="text-slate-600 hover:text-slate-900 transition-colors">Témoignages</a>
                <a href="#contact" className="text-slate-600 hover:text-slate-900 transition-colors">Contact</a>
                <div className="flex flex-col space-y-2 pt-4 border-t border-slate-200">
                  <button className="text-left text-slate-600 hover:text-slate-900 transition-colors">
                    Connexion
                  </button>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-left">
                    Essai gratuit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                  <Star className="w-4 h-4 mr-1" />
                  Solution IA de nouvelle génération
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  Révolutionnez votre
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> recrutement</span>
                  avec l'IA
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  ForsaAI utilise l'intelligence artificielle pour analyser, classer et sélectionner les meilleurs candidats en quelques secondes. Transformez votre processus de recrutement.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
                  Démarrer gratuitement
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button className="border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-lg font-semibold flex items-center justify-center hover:border-slate-400 transition-all">
                  <Play className="w-5 h-5 mr-2" />
                  Voir la démo
                </button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-slate-600">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Essai gratuit 14 jours
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Aucune carte requise
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Analyse des candidats</h3>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { name: "Sarah Martin", score: 98, skills: "React, Node.js" },
                      { name: "Alex Dubois", score: 94, skills: "Python, ML" },
                      { name: "Marie Chen", score: 91, skills: "Design, UX" }
                    ].map((candidate, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-slate-900">{candidate.name}</div>
                          <div className="text-sm text-slate-600">{candidate.skills}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">{candidate.score}%</div>
                          <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-1000"
                              style={{ width: `${candidate.score}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
              Fonctionnalités puissantes
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Des outils intelligents pour optimiser chaque étape de votre processus de recrutement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "IA Avancée",
                description: "Algorithmes de machine learning pour analyser les CV et identifier les meilleurs profils automatiquement."
              },
              {
                icon: BarChart3,
                title: "Scoring Intelligent",
                description: "Système de notation basé sur vos critères pour classer les candidats objectivement."
              },
              {
                icon: Clock,
                title: "Gain de Temps",
                description: "Réduisez de 90% le temps passé sur le tri initial des candidatures."
              },
              {
                icon: Users,
                title: "Gestion Collaborative",
                description: "Partagez les évaluations avec votre équipe et prenez des décisions ensemble."
              },
              {
                icon: Shield,
                title: "Sécurité Totale",
                description: "Données chiffrées et conformité RGPD pour protéger les informations sensibles."
              },
              {
                icon: CheckCircle,
                title: "Intégrations",
                description: "Connectez vos outils RH préférés via notre API flexible."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-slate-50 p-8 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-slate-600">
              Plus de 500 entreprises utilisent ForsaAI pour leurs recrutements
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sophie Laurent",
                role: "DRH, TechCorp",
                content: "ForsaAI a révolutionné notre processus de recrutement. Nous économisons 15 heures par semaine sur le tri des CV.",
                avatar: "SL"
              },
              {
                name: "Marc Dubois",
                role: "CEO, StartupInc",
                content: "L'IA de ForsaAI nous aide à identifier les talents cachés que nous aurions ratés autrement. Un outil indispensable !",
                avatar: "MD"
              },
              {
                name: "Julie Chen",
                role: "Responsable RH, BigCorp",
                content: "Interface intuitive et résultats impressionnants. Notre taux de réussite des recrutements a augmenté de 40%.",
                avatar: "JC"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-slate-300 mb-4" />
                <p className="text-slate-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-slate-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
              Tarifs simples et transparents
            </h2>
            <p className="text-xl text-slate-600">
              Choisissez le plan qui correspond à vos besoins
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "49",
                period: "/mois",
                description: "Parfait pour les petites équipes",
                features: [
                  "Jusqu'à 100 candidatures/mois",
                  "Scoring IA basique",
                  "Support email",
                  "1 utilisateur"
                ],
                cta: "Commencer",
                popular: false
              },
              {
                name: "Professional",
                price: "149",
                period: "/mois",
                description: "Idéal pour les entreprises en croissance",
                features: [
                  "Jusqu'à 500 candidatures/mois",
                  "IA avancée + analytics",
                  "Support prioritaire",
                  "5 utilisateurs",
                  "Intégrations API"
                ],
                cta: "Essayer gratuitement",
                popular: true
              },
              {
                name: "Enterprise",
                price: "Sur mesure",
                period: "",
                description: "Pour les grandes organisations",
                features: [
                  "Candidatures illimitées",
                  "IA personnalisée",
                  "Support dédié 24/7",
                  "Utilisateurs illimités",
                  "Intégrations sur mesure"
                ],
                cta: "Nous contacter",
                popular: false
              }
            ].map((plan, index) => (
              <div key={index} className={`relative p-8 rounded-xl border-2 ${
                plan.popular 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
              } transition-all hover:shadow-lg`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Plus populaire
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}€</span>
                    <span className="text-slate-600 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Prêt à transformer votre recrutement ?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Rejoignez des centaines d'entreprises qui ont déjà optimisé leur processus de recrutement avec ForsaAI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg">
                Démarrer l'essai gratuit
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all">
                Planifier une démo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">ForsaAI</span>
              </div>
              <p className="text-slate-400">
                La solution IA de nouvelle génération pour révolutionner votre recrutement.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Produit</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Intégrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Entreprise</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Presse</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Statut</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400">
              © 2025 ForsaAI. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Conditions d'utilisation
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ForsaAILanding;