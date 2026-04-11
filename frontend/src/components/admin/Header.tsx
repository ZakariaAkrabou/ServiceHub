import React, { useState, useRef, useEffect } from 'react';
import { Menu, User, LogOut, ChevronDown, Bell, Search } from 'lucide-react';

interface HeaderProps {
    onToggleSidebar: () => void;
    user: {
        name: string;
        email: string;
    };
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, user }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getInitials = (name: string) =>
        name.split(' ').map((n) => n[0]).filter(Boolean).join('').toUpperCase().slice(0, 2);

    return (
        <header
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '64px',
                backgroundColor: '#081D3A',
                borderBottom: '1px solid rgba(0,126,255,0.15)',
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            }}
        >
            {/* Left: Toggle + Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                    onClick={onToggleSidebar}
                    style={{
                        background: 'rgba(0,126,255,0.08)',
                        border: '1px solid rgba(0,126,255,0.2)',
                        borderRadius: '10px',
                        padding: '8px',
                        cursor: 'pointer',
                        color: '#007EFF',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.2s',
                    }}
                    aria-label="Toggle Sidebar"
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(0,126,255,0.18)';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(0,126,255,0.08)';
                    }}
                >
                    <Menu size={20} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Yellow accent bar */}
                    <div style={{
                        width: '4px',
                        height: '28px',
                        backgroundColor: '#F6E304',
                        borderRadius: '2px',
                    }} />
                    <span style={{
                        fontSize: '20px',
                        fontWeight: 800,
                        color: '#F3F3F3',
                        letterSpacing: '-0.5px',
                        fontFamily: 'system-ui, sans-serif',
                    }}>
                        Service<span style={{ color: '#F6E304' }}>Hub</span>
                    </span>
                </div>
            </div>

            {/* Center: Search bar */}
            <div style={{
                flex: 1,
                maxWidth: '420px',
                margin: '0 32px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '0 14px',
                height: '38px',
            }}>
                <Search size={15} color="rgba(243,243,243,0.3)" />
                <input
                    type="text"
                    placeholder="Rechercher..."
                    style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: '#F3F3F3',
                        fontSize: '13px',
                        width: '100%',
                        fontFamily: 'inherit',
                    }}
                />
            </div>

            {/* Right: Bell + Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Notification Bell */}
                <button
                    style={{
                        position: 'relative',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                        padding: '8px',
                        cursor: 'pointer',
                        color: 'rgba(243,243,243,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,126,255,0.3)';
                        (e.currentTarget as HTMLElement).style.color = '#007EFF';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                        (e.currentTarget as HTMLElement).style.color = 'rgba(243,243,243,0.6)';
                    }}
                >
                    <Bell size={18} />
                    {/* Badge */}
                    <span style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        width: '7px',
                        height: '7px',
                        background: '#F6E304',
                        borderRadius: '50%',
                        border: '1.5px solid #081D3A',
                    }} />
                </button>

                {/* Divider */}
                <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.08)' }} />

                {/* Profile Dropdown */}
                <div style={{ position: 'relative' }} ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = 'transparent';
                        }}
                        aria-expanded={isDropdownOpen}
                    >
                        {/* Name + email */}
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#F3F3F3', lineHeight: 1.2 }}>
                                {user.name}
                            </span>
                            <span style={{ fontSize: '11px', color: 'rgba(243,243,243,0.4)', lineHeight: 1.2 }}>
                                {user.email}
                            </span>
                        </div>

                        {/* Avatar */}
                        <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #007EFF 0%, #0050CC 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '13px',
                            border: '2px solid rgba(0,126,255,0.3)',
                            flexShrink: 0,
                        }}>
                            {getInitials(user.name)}
                        </div>

                        <ChevronDown
                            size={14}
                            color="rgba(243,243,243,0.4)"
                            style={{ transition: 'transform 0.2s', transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        />
                    </button>

                    {/* Dropdown */}
                    {isDropdownOpen && (
                        <div
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: 'calc(100% + 10px)',
                                width: '240px',
                                background: '#17171A',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '14px',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                                overflow: 'hidden',
                                zIndex: 100,
                            }}
                        >
                            {/* Top user info */}
                            <div style={{
                                padding: '14px 16px',
                                borderBottom: '1px solid rgba(255,255,255,0.06)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #007EFF, #0050CC)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: '14px',
                                    flexShrink: 0,
                                }}>
                                    {getInitials(user.name)}
                                </div>
                                <div>
                                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#F3F3F3', margin: 0 }}>{user.name}</p>
                                    <p style={{ fontSize: '11px', color: 'rgba(243,243,243,0.4)', margin: 0 }}>{user.email}</p>
                                </div>
                            </div>

                            {/* Menu items */}
                            <div style={{ padding: '8px' }}>
                                <DropdownItem icon={<User size={16} />} label="Mon profil" sub="Gérer vos informations" color="#007EFF" />
                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
                                <DropdownItem icon={<LogOut size={16} />} label="Déconnexion" sub="Quitter la session" color="#ef4444" danger />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

/* Small reusable dropdown item */
const DropdownItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    sub: string;
    color: string;
    danger?: boolean;
}> = ({ icon, label, sub, color, danger }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <button
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                background: hovered ? `${color}15` : 'transparent',
                color: hovered ? color : 'rgba(243,243,243,0.7)',
                textAlign: 'left',
                transition: 'all 0.15s',
            }}
        >
            <div style={{
                padding: '6px',
                borderRadius: '8px',
                background: hovered ? `${color}25` : 'rgba(255,255,255,0.05)',
                color: hovered ? color : 'rgba(243,243,243,0.5)',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.15s',
            }}>
                {icon}
            </div>
            <div>
                <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: hovered ? color : '#F3F3F3' }}>
                    {label}
                </span>
                <span style={{ display: 'block', fontSize: '11px', color: hovered ? `${color}99` : 'rgba(243,243,243,0.3)' }}>
                    {sub}
                </span>
            </div>
        </button>
    );
};

export default Header;