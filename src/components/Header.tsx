'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { ACADEMY_PRESETS, AcademyInfo } from '@/types/webinar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sparkles, ChevronDown, Check, GraduationCap } from 'lucide-react';

interface HeaderProps {
  currentAcademy: AcademyInfo;
  onAcademyChange: (academy: AcademyInfo) => void;
  onRegisterClick: () => void;
}

export function Header({ currentAcademy, onAcademyChange, onRegisterClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* LOGO & BRANDING CUSTOMIZER */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-border/80 hover:border-primary/50 bg-card hover:bg-muted/60 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-primary/20">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-base group-hover:scale-105 transition-transform">
                  {currentAcademy.logoIcon}
                </span>
                <div>
                  <div className="font-display font-bold text-sm sm:text-base text-foreground leading-tight flex items-center gap-1.5">
                    {currentAcademy.name}
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-[10px] text-muted-foreground block truncate max-w-[130px] sm:max-w-[200px]">
                    Switch Academy Profile
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 p-2 bg-card border-border">
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Select Academy Preset
              </div>
              {ACADEMY_PRESETS.map((preset) => (
                <DropdownMenuItem
                  key={preset.name}
                  onClick={() => onAcademyChange(preset)}
                  className="flex items-center justify-between p-2.5 rounded-lg cursor-pointer focus:bg-muted/80"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base font-bold text-primary">{preset.logoIcon}</span>
                    <div>
                      <div className="font-semibold text-sm text-foreground">{preset.name}</div>
                      <div className="text-[11px] text-muted-foreground line-clamp-1">{preset.tagline}</div>
                    </div>
                  </div>
                  {currentAcademy.name === preset.name && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#overview" className="hover:text-foreground transition-colors">
            Overview
          </a>
          <a href="#curriculum" className="hover:text-foreground transition-colors">
            What You Learn
          </a>
          <a href="#agenda" className="hover:text-foreground transition-colors">
            Agenda
          </a>
          <a href="#mentor" className="hover:text-foreground transition-colors">
            Speaker
          </a>
          <a href="#faq" className="hover:text-foreground transition-colors">
            FAQ
          </a>
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <Button
            onClick={onRegisterClick}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm transition-all rounded-lg px-4"
          >
            <GraduationCap className="w-4 h-4 mr-1.5 hidden sm:inline-block" />
            Register Free
          </Button>
        </div>

      </div>
    </header>
  );
}
