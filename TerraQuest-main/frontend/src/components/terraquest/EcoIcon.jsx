import React from 'react';
import { Leaf, Recycle, Sun, Droplet, Globe, TreePine } from 'lucide-react';

const EcoIcon = ({ name, className = 'w-6 h-6', ...props }) => {
  const icons = {
    leaf: Leaf,
    recycle: Recycle,
    sun: Sun,
    water: Droplet,
    earth: Globe,
    tree: TreePine,
  };

  const IconComponent = icons[name] || Leaf;

  return <IconComponent className={className} {...props} />;
};

// Emoji-based icons for badges and decorative elements
export const EcoEmoji = {
  Leaf: '🌿',
  Recycle: '♻️',
  Sun: '🌞',
  Water: '💧',
  Earth: '🌎',
  Tree: '🌳',
  Trophy: '🏆',
  Gift: '🎁',
  Award: '🏅',
  Sparkles: '✨',
  Planet: '🌍',
};

export default EcoIcon;

