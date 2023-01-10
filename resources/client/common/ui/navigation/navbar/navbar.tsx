import {ReactElement, ReactNode} from 'react';
import clsx from 'clsx';
import {Link} from 'react-router-dom';
import {useAuth} from '@common/auth/use-auth';
import {Button} from '@common/ui/buttons/button';
import {ButtonBase} from '@common/ui/buttons/button-base';
import {ArrowDropDownIcon} from '@common/icons/material/ArrowDropDown';
import {ExitToAppIcon} from '@common/icons/material/ExitToApp';
import {NotificationDialogTrigger} from '@common/notifications/dialog/notification-dialog-trigger';
import {
  Menu,
  MenuItem,
  MenuTrigger,
} from '@common/ui/navigation/menu/menu-trigger';
import {useCustomMenu} from '@common/menus/use-custom-menu';
import {createSvgIconFromTree} from '@common/icons/create-svg-icon';
import {DarkModeIcon} from '@common/icons/material/DarkMode';
import {LightModeIcon} from '@common/icons/material/LightMode';
import {useLogout} from '@common/auth/requests/logout';
import {useTrans} from '@common/i18n/use-trans';
import {Trans} from '@common/i18n/trans';
import {IconButton} from '@common/ui/buttons/icon-button';
import {PersonIcon} from '@common/icons/material/Person';
import {useIsMobileMediaQuery} from '@common/utils/hooks/is-mobile-media-query';
import {NotificationsIcon} from '@common/icons/material/Notifications';
import {Badge} from '@common/ui/badge/badge';
import {PaymentsIcon} from '@common/icons/material/Payments';
import {Item} from '@common/ui/forms/listbox/item';
import {useNavigate} from '@common/utils/hooks/use-navigate';
import {useIsDarkMode} from '@common/ui/themes/use-is-dark-mode';
import {useThemeSelector} from '@common/ui/themes/theme-selector-context';
import {CustomMenu} from '@common/menus/custom-menu';
import {useSettings} from '@common/core/settings/use-settings';
import {ButtonColor} from '@common/ui/buttons/get-shared-button-style';
import {MenuIcon} from '@common/icons/material/Menu';
import {MenuItemConfig} from '@common/core/settings/settings';

type NavbarColor = 'primary' | 'bg' | 'bg-alt' | 'transparent';

export interface NavbarProps {
  toggleButton?: ReactElement;
  children?: ReactNode;
  className?: string;
  color?: NavbarColor;
  darkModeColor?: NavbarColor;
  logoColor?: 'dark' | 'light';
  textColor?: string;
  primaryButtonColor?: ButtonColor;
  border?: string;
  size?: 'xs' | 'sm' | 'md';
  rightChildren?: ReactNode;
  menuPosition?: string;
}
export function Navbar({
  toggleButton,
  children,
  className,
  border,
  size = 'md',
  color = 'primary',
  darkModeColor = 'bg-alt',
  textColor,
  rightChildren,
  menuPosition,
  logoColor,
  primaryButtonColor,
}: NavbarProps) {
  const isMobile = useIsMobileMediaQuery();
  const isDarkMode = useIsDarkMode();
  const {notifications} = useSettings();
  const {isLoggedIn} = useAuth();

  const showNotifButton = !isMobile && isLoggedIn && notifications?.integrated;

  if (isDarkMode) {
    color = darkModeColor;
  }

  return (
    <div
      className={clsx(
        'flex items-center gap-10 py-8',
        isMobile ? 'pl-14 pr-8' : 'px-20',
        color === 'primary' &&
          `bg-primary ${textColor || 'text-on-primary'} border-b-primary`,
        color === 'bg' && `bg ${textColor || 'text-main'} border-b`,
        color === 'bg-alt' && `bg-alt ${textColor || 'text-main'} border-b`,
        color === 'transparent' &&
          `bg-transparent ${textColor || 'text-white'}`,
        size === 'md' && 'h-64 py-8',
        size === 'sm' && 'h-54 py-4',
        size === 'xs' && 'h-48 py-4',
        border,
        className
      )}
    >
      <Logo isMobile={isMobile} color={color} logoColor={logoColor} />
      {toggleButton}
      {children}
      {isMobile ? (
        <MobileMenu position={menuPosition} />
      ) : (
        <DesktopMenu position={menuPosition} />
      )}
      <div
        className={clsx(
          'ml-auto flex items-center',
          isMobile ? 'gap-4' : 'gap-14'
        )}
      >
        {rightChildren}
        {showNotifButton && <NotificationDialogTrigger />}
        {isLoggedIn ? (
          <AuthMenuTrigger />
        ) : (
          <AuthButtons
            navbarColor={color}
            primaryButtonColor={primaryButtonColor}
          />
        )}
      </div>
    </div>
  );
}

interface DesktopMenuProps {
  position: NavbarProps['menuPosition'];
}
function DesktopMenu({position}: DesktopMenuProps) {
  return (
    <CustomMenu
      className="text-sm mx-14"
      itemClassName={isActive =>
        clsx(
          'opacity-90 hover:underline hover:opacity-100',
          isActive && 'opacity-100'
        )
      }
      menu={position}
    />
  );
}

interface MobileMenuProps {
  position: NavbarProps['menuPosition'];
}
function MobileMenu({position}: MobileMenuProps) {
  const navigate = useNavigate();
  const menu = useCustomMenu(position);

  if (!menu?.items.length) {
    return null;
  }

  const handleItemClick = (item: MenuItemConfig) => {
    if (item.type === 'route') {
      navigate(item.action);
    } else {
      window.open(item.action, item.target)?.focus();
    }
  };

  return (
    <MenuTrigger>
      <IconButton>
        <MenuIcon />
      </IconButton>
      <Menu>
        {menu.items.map(item => {
          const Icon = item.icon && createSvgIconFromTree(item.icon);
          return (
            <Item
              value={item.action}
              onSelected={() => handleItemClick(item)}
              key={item.id}
              startIcon={Icon && <Icon />}
            >
              <Trans message={item.label} />
            </Item>
          );
        })}
      </Menu>
    </MenuTrigger>
  );
}

interface LogoProps {
  isMobile: boolean | null;
  color: NavbarProps['color'];
  logoColor: NavbarProps['logoColor'];
}
function Logo({color, isMobile, logoColor}: LogoProps) {
  const {trans} = useTrans();
  const {branding} = useSettings();
  const isDarkMode = useIsDarkMode();
  const {getRedirectUri} = useAuth();

  let desktopLogo: string;
  let mobileLogo: string;
  if (
    isDarkMode ||
    !branding.logo_dark ||
    (logoColor !== 'dark' && (color === 'primary' || color === 'transparent'))
  ) {
    desktopLogo = branding.logo_light;
    mobileLogo = branding.logo_light_mobile;
  } else {
    desktopLogo = branding.logo_dark;
    mobileLogo = branding.logo_dark_mobile;
  }

  const logoUrl = isMobile ? mobileLogo || desktopLogo : desktopLogo;
  if (!logoUrl) {
    return null;
  }

  return (
    <Link
      to="/"
      className="block mr-4 md:mr-24 flex-shrink-0"
      aria-label={trans({message: 'Go to homepage'})}
    >
      <img
        className={clsx('block w-auto', isMobile ? 'max-h-26' : 'max-h-36')}
        data-logo="navbar"
        src={logoUrl}
        alt={trans({message: 'Site logo'})}
      />
    </Link>
  );
}

interface AuthButtonsProps {
  primaryButtonColor?: ButtonColor;
  navbarColor?: NavbarProps['color'];
}
function AuthButtons({primaryButtonColor, navbarColor}: AuthButtonsProps) {
  const {registration} = useSettings();
  const isMobile = useIsMobileMediaQuery();
  const navigate = useNavigate();

  if (!primaryButtonColor) {
    primaryButtonColor = navbarColor === 'primary' ? 'paper' : 'primary';
  }

  if (isMobile) {
    return (
      <MenuTrigger>
        <IconButton size="md">
          <PersonIcon />
        </IconButton>
        <Menu>
          <Item value="login" onSelected={() => navigate('/login')}>
            <Trans message="Login" />
          </Item>
          {!registration.disable && (
            <Item value="register" onSelected={() => navigate('/register')}>
              <Trans message="Register" />
            </Item>
          )}
        </Menu>
      </MenuTrigger>
    );
  }

  return (
    <div className="text-sm">
      {!registration.disable && (
        <Link to="/register">
          <Button variant="text" className="mr-10">
            <Trans message="Register" />
          </Button>
        </Link>
      )}
      <Link to="/login">
        <Button variant="raised" color={primaryButtonColor}>
          <Trans message="Login" />
        </Button>
      </Link>
    </div>
  );
}

function AuthMenuTrigger() {
  const {user, isSubscribed} = useAuth();
  const navigate = useNavigate();
  const logout = useLogout();
  const menu = useCustomMenu('auth-dropdown');
  const {selectedTheme, selectTheme} = useThemeSelector();
  const isMobile = useIsMobileMediaQuery();
  const {notifications} = useSettings();
  if (!selectedTheme || !user) return null;
  const hasUnreadNotif = !!user.unread_notifications_count;

  const mobileButton = (
    <Badge
      badgeLabel={user?.unread_notifications_count}
      badgeIsVisible={hasUnreadNotif}
    >
      <IconButton size="md">
        <PersonIcon />
      </IconButton>
    </Badge>
  );
  const desktopButton = (
    <ButtonBase className="flex items-center">
      <img
        className="w-32 h-32 object-cover flex-shrink-0 rounded mr-12"
        src={user.avatar}
        alt=""
      />
      <span className="block text-sm mr-2">{user.display_name}</span>
      <ArrowDropDownIcon className="block icon-sm" />
    </ButtonBase>
  );

  const notifMenuItem = (
    <MenuItem
      value="notifications"
      startIcon={<NotificationsIcon />}
      onSelected={() => {
        navigate('/notifications');
      }}
    >
      <Trans message="Notifications" />
      {hasUnreadNotif ? ` (${user.unread_notifications_count})` : undefined}
    </MenuItem>
  );

  const billingMenuItem = (
    <MenuItem
      value="billing"
      startIcon={<PaymentsIcon />}
      onSelected={() => {
        navigate('/billing');
      }}
    >
      <Trans message="Billing" />
    </MenuItem>
  );

  return (
    <MenuTrigger>
      {isMobile ? mobileButton : desktopButton}
      <Menu>
        {menu &&
          menu.items.map(item => {
            const Icon = item.icon && createSvgIconFromTree(item.icon);
            return (
              <MenuItem
                value={item.id}
                key={item.id}
                startIcon={Icon && <Icon />}
                onSelected={() => {
                  navigate(item.action);
                }}
              >
                <Trans message={item.label} />
              </MenuItem>
            );
          })}
        {isMobile && notifications?.integrated ? notifMenuItem : undefined}
        {isSubscribed && billingMenuItem}
        {!selectedTheme.is_dark && (
          <MenuItem
            value="light"
            startIcon={<DarkModeIcon />}
            onSelected={() => {
              selectTheme('dark');
            }}
          >
            <Trans message="Dark mode" />
          </MenuItem>
        )}
        {selectedTheme.is_dark && (
          <MenuItem
            value="dark"
            startIcon={<LightModeIcon />}
            onSelected={() => {
              selectTheme('light');
            }}
          >
            <Trans message="Light mode" />
          </MenuItem>
        )}
        <MenuItem
          value="logout"
          startIcon={<ExitToAppIcon />}
          onSelected={() => {
            logout.mutate();
          }}
        >
          <Trans message="Log out" />
        </MenuItem>
      </Menu>
    </MenuTrigger>
  );
}
