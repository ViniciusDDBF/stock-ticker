import React from 'react';
import type { ButtonProps } from '../types';

/* ---------------- Loaders ---------------- */
const Loaders = {
  spinner: ({ size = 16, color }: { size?: number; color: string }) => (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="animate-spin absolute inset-0"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          className="opacity-25"
        />
        <path
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
             5.291A7.962 7.962 0 014 12H0c0 3.042 
             1.135 5.824 3 7.938l3-2.647z"
          fill={color}
        />
      </svg>
    </div>
  ),
  dots: ({ size = 16, color }: { size?: number; color: string }) => (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-full animate-bounce"
          style={{
            width: size * 0.25,
            height: size * 0.25,
            backgroundColor: color,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  ),
  pulse: ({ size = 16, color }: { size?: number; color: string }) => (
    <div
      className="rounded-full animate-pulse"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        animationDuration: '1s',
      }}
    />
  ),
  bars: ({ size = 16, color }: { size?: number; color: string }) => (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse"
          style={{
            width: size * 0.125,
            height: size * 0.75,
            backgroundColor: color,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1.2s',
          }}
        />
      ))}
    </div>
  ),
};

/* ---------------- Sizes ---------------- */
const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm font-medium min-h-[32px] gap-1',
  md: 'px-4 py-2 text-base font-semibold min-h-[40px] gap-2',
  lg: 'px-6 py-3 text-lg font-semibold min-h-[48px] gap-2',
};

/* ---------------- Component ---------------- */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      loaderType = 'spinner',
      startIcon,
      endIcon,
      selected = false,
      disabled = false,
      className = '',
      type = 'button',
      style,
      ...props
    },
    ref
  ) => {
    const getDynamicStyles = (): React.CSSProperties => {
      const baseStyles = (() => {
        switch (variant) {
          case 'primary':
            return selected
              ? {
                  background: `linear-gradient(to bottom right, var(--color-600), var(--color-700))`,
                  borderColor: 'var(--color-400)',
                  color: '#fff',
                  boxShadow:
                    '0 0 0 2px var(--color-500)30, 0 4px 12px var(--color-500)40',
                }
              : {
                  background: `linear-gradient(to bottom right, var(--color-500), var(--color-600))`,
                  borderColor: 'var(--color-500)',
                  color: '#fff',
                };
          case 'secondary':
            return selected
              ? {
                  backgroundColor: 'var(--color-700)',
                  borderColor: 'var(--color-400)',
                  color: 'var(--color-50)',
                  boxShadow:
                    '0 0 0 2px var(--color-500)30, inset 0 1px 0 var(--color-400)40',
                }
              : {
                  backgroundColor: 'var(--color-800)',
                  borderColor: 'var(--color-600)',
                  color: 'var(--color-100)',
                };
          case 'outline':
            return selected
              ? {
                  backgroundColor: 'var(--color-50)',
                  borderColor: 'var(--color-500)',
                  color: 'var(--color-700)',
                  boxShadow:
                    '0 0 0 2px var(--color-500)20, inset 0 1px 0 var(--color-500)10',
                }
              : {
                  backgroundColor: 'transparent',
                  borderColor: 'var(--color-300)',
                  color: 'var(--color-600)',
                };
          case 'ghost':
            return selected
              ? {
                  backgroundColor: 'var(--color-100)',
                  borderColor: 'var(--color-300)',
                  color: 'var(--color-700)',
                  boxShadow: 'inset 0 1px 0 var(--color-500)20',
                }
              : {
                  backgroundColor: 'transparent',
                  borderColor: 'transparent',
                  color: 'var(--color-600)',
                };
          default:
            return {};
        }
      })();

      return baseStyles;
    };

    const dynamicCSS = `
      .dynamic-button-${variant}${
      selected ? '-selected' : ''
    }:hover:not(:disabled) {
        ${
          variant === 'primary'
            ? selected
              ? `background: linear-gradient(to bottom right, var(--color-700), var(--color-800)) !important; 
                 box-shadow: 0 0 0 2px var(--color-500)40, 0 6px 16px var(--color-500)50 !important;
                 transform: translateY(-1px) !important;`
              : `background: linear-gradient(to bottom right, var(--color-600), var(--color-700)) !important; 
                 box-shadow: 0 4px 12px var(--color-500)40 !important;`
            : ''
        }
        ${
          variant === 'secondary'
            ? selected
              ? `background-color: var(--color-600) !important; 
                 border-color: var(--color-300) !important;
                 box-shadow: 0 0 0 2px var(--color-500)40, inset 0 1px 0 var(--color-300)50 !important;
                 transform: translateY(-1px) !important;`
              : `background-color: var(--color-700) !important; border-color: var(--color-500) !important;`
            : ''
        }
        ${
          variant === 'outline'
            ? selected
              ? `background-color: var(--color-100) !important;
                 border-color: var(--color-600) !important; 
                 color: var(--color-800) !important;
                 box-shadow: 0 0 0 2px var(--color-500)30, inset 0 1px 0 var(--color-500)20 !important;
                 transform: translateY(-1px) !important;`
              : `border-color: var(--color-500) !important; 
                 color: var(--color-700) !important; 
                 background-color: var(--color-25) !important;`
            : ''
        }
        ${
          variant === 'ghost'
            ? selected
              ? `background-color: var(--color-200) !important;
                 border-color: var(--color-400) !important;
                 color: var(--color-800) !important;
                 box-shadow: inset 0 1px 0 var(--color-500)30 !important;
                 transform: translateY(-1px) !important;`
              : `background-color: var(--color-50) !important;`
            : ''
        }
      }

      .dynamic-button-${variant}${
      selected ? '-selected' : ''
    }:active:not(:disabled) {
        transform: translateY(0px) !important;
        ${
          selected
            ? `box-shadow: 0 0 0 2px var(--color-500)50, inset 0 2px 4px rgba(0,0,0,0.1) !important;`
            : `box-shadow: inset 0 2px 4px rgba(0,0,0,0.1) !important;`
        }
      }

      .dynamic-button-${variant}${
      selected ? '-selected' : ''
    }:focus-visible:not(:disabled) {
        box-shadow: 0 0 0 3px var(--color-500)40 !important;
        outline: none !important;
      }
    `;

    const classes = [
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-out',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 whitespace-nowrap select-none border-2',
      'hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md cursor-pointer',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
      'disabled:hover:translate-y-0 disabled:hover:shadow-none',
      buttonSizes[size],
      fullWidth ? 'w-full' : '',
      loading ? 'cursor-wait' : '',
      `dynamic-button-${variant}${selected ? '-selected' : ''}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const isDisabled = disabled || loading;
    const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;
    const LoaderComponent = Loaders[loaderType];
    const loaderColor =
      variant === 'primary'
        ? '#fff'
        : getDynamicStyles().color || 'var(--color-600)';

    return (
      <>
        <style>{dynamicCSS}</style>
        <button
          ref={ref}
          type={type}
          disabled={isDisabled}
          className={classes}
          style={{ ...getDynamicStyles(), ...style }}
          {...props}
        >
          {loading ? (
            <LoaderComponent size={iconSize} color={loaderColor as string} />
          ) : (
            startIcon && (
              <span className="flex items-center justify-center flex-shrink-0">
                {startIcon}
              </span>
            )
          )}
          {children && (
            <span
              className={`flex items-center justify-center flex-1 min-w-0 ${
                loading ? 'opacity-70' : ''
              }`}
            >
              {children}
            </span>
          )}
          {!loading && endIcon && (
            <span className="flex items-center justify-center flex-shrink-0">
              {endIcon}
            </span>
          )}
        </button>
      </>
    );
  }
);

Button.displayName = 'Button';

export default Button;
