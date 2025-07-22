import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Desenvolvido por</span>
            <a 
              href="#" 
              className="font-semibold text-primary hover:text-primary-hover transition-colors duration-200 flex items-center gap-1"
            >
              Cezi Cola Tecnologia
              <ExternalLink className="h-3 w-3" />
            </a>
            <span>•</span>
            <span>CEO Bio Code Technology</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Todos os Direitos Reservados</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-primary">Minebea Flow</span>
              <span>2025</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>Built with</span>
              <Heart className="h-3 w-3 text-error fill-current" />
              <span>for Enterprise Excellence</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span>Enterprise Resource Planning System</span>
              <span>•</span>
              <span>Multi-Tenant Architecture</span>
              <span>•</span>
              <span>RBAC Security</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};