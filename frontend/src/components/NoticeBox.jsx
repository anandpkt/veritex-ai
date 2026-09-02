import React from 'react';
import { Info, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function NoticeBox({
  type = 'info', // 'info', 'warning', 'danger', 'success'
  title = '',
  children,
  className = ''
}) {
  const getStyles = () => {
    switch (type) {
      case 'warning':
        return {
          wrapper: 'gov-notice-warning',
          icon: AlertTriangle,
          iconColor: 'text-gov-saffron',
          titleColor: 'text-[#B94A00]',
        };
      case 'danger':
        return {
          wrapper: 'gov-notice-danger',
          icon: AlertCircle,
          iconColor: 'text-gov-danger',
          titleColor: 'text-[#B71C1C]',
        };
      case 'success':
        return {
          wrapper: 'gov-notice-success',
          icon: CheckCircle2,
          iconColor: 'text-gov-green',
          titleColor: 'text-[#1B5E20]',
        };
      case 'info':
      default:
        return {
          wrapper: 'gov-notice-info',
          icon: Info,
          iconColor: 'text-gov-primary',
          titleColor: 'text-gov-primary',
        };
    }
  };

  const style = getStyles();
  const Icon = style.icon;

  return (
    <div className={`${style.wrapper} ${className} rounded-sm flex items-start space-x-3`}>
      <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
      <div className="space-y-1 text-[13.5px] leading-relaxed flex-1">
        {title && (
          <h4 className={`font-bold ${style.titleColor} text-[14px]`}>
            {title}
          </h4>
        )}
        <div className="text-gov-text">
          {children}
        </div>
      </div>
    </div>
  );
}
