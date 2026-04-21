import React from 'react';
import { HelpCircle, Link } from 'lucide-react';

interface ConnectorIconProps {
  icon: any;
  className?: string;
}

/**
 * ConnectorIcon
 * Safely renders either a Lucide component or a fallback string icon.
 * Prevents UI crashes due to invalid icon configurations.
 */
export const ConnectorIcon: React.FC<ConnectorIconProps> = ({ icon, className }) => {
  // If icon is a React Component (Lucide)
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null)) {
    const IconComponent = icon;
    return <IconComponent className={className} />;
  }

  // If icon is a string (e.g. "slack")
  if (typeof icon === 'string') {
    // Custom handling for specific strings if desired
    if (icon === 'slack') {
      return (
        <div className={`flex items-center justify-center bg-purple-500/10 rounded-md ${className}`}>
          <Link className="w-3/4 h-3/4" />
        </div>
      );
    }
  }

  // Default Fallback
  return <HelpCircle className={className} />;
};
