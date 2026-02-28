import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
    Home,
    PlayCircle,
    Briefcase,
    Users,
    Menu,
    Zap,
    HelpCircle,
    BarChart3,
    Settings,
    X,
    Award,
} from 'lucide-react';
import { useDashboardStore } from '@/stores';
import { AllCertificatesModal } from '@/features/certificates';
import { CertificateModal as UICertificateModal } from '@/components/ui/CertificateModal';
import { useUserStore } from '@/stores/userStore';

interface MobileNavProps {
    activeItem: string;
    onNavigate: (path: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeItem, onNavigate }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { courses } = useDashboardStore();
    const user = useUserStore((state) => state.user);

    const completedCourses = (courses || []).filter(c => c.status === 'completed' || c.progress === 100);
    const [isAllCertModalOpen, setIsAllCertModalOpen] = useState(false);
    const [selectedCert, setSelectedCert] = useState<any>(null);

    const mainTabs = [
        { id: 'dashboard', label: 'Home', icon: Home, path: '/dashboard' },
        { id: 'learning', label: 'Learn', icon: PlayCircle, path: '/dashboard/learning' },
        { id: 'jobs', label: 'Jobs', icon: Briefcase, path: '/dashboard/jobs' },
        { id: 'community', label: 'Community', icon: Users, path: '/dashboard/community' },
    ];

    const moreItems = [
        { id: 'skillgap', label: 'Skill Gap', icon: Zap, path: '/dashboard/skill-gap' },
        { id: 'quizzes', label: 'Quizzes', icon: HelpCircle, path: '/dashboard/quizzes' },
        { id: 'progress', label: 'Progress', icon: BarChart3, path: '/dashboard/progress' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings' },
    ];

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black z-50 md:hidden flex items-center justify-around h-16 shadow-[0_-4px_0_0_rgba(0,0,0,1)]">
                {mainTabs.map((tab) => {
                    const isActive = activeItem === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onNavigate(tab.path)}
                            className={cn(
                                'flex flex-col items-center justify-center w-full h-full transition-all border-x-2 border-transparent',
                                isActive ? 'text-black bg-brutal-yellow border-black shadow-[inset_0_4px_0_0_rgba(0,0,0,1)]' : 'text-black/60 hover:text-black hover:bg-slate-50'
                            )}
                        >
                            <Icon className="w-5 h-5 mb-1" strokeWidth={isActive ? 3 : 2} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
                        </button>
                    );
                })}

                <button
                    onClick={() => setIsMenuOpen(true)}
                    className={cn(
                        'flex flex-col items-center justify-center w-full h-full transition-all border-x-2 border-transparent text-black/60 hover:text-black hover:bg-slate-50',
                        isMenuOpen && 'text-black bg-slate-100 border-black shadow-[inset_0_4px_0_0_rgba(0,0,0,1)]'
                    )}
                >
                    <Menu className="w-5 h-5 mb-1" strokeWidth={isMenuOpen ? 3 : 2} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">More</span>
                </button>
            </div>

            {isMenuOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden flex flex-col justify-end animate-in fade-in duration-200">
                    <div className="bg-white border-t-4 border-black w-full min-h-[50vh] max-h-[85vh] p-4 slide-in-from-bottom animate-in flex flex-col shadow-[0_-8px_0_0_rgba(0,0,0,1)]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black uppercase tracking-wider">More Options</h2>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black hover:bg-brutal-pink hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all"
                            >
                                <X className="w-6 h-6" strokeWidth={3} />
                            </button>
                        </div>

                        <div className="space-y-3 flex-1 overflow-y-auto pb-4 custom-scrollbar">
                            {moreItems.map((item) => {
                                const isActive = activeItem === item.id;
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            onNavigate(item.path);
                                            setIsMenuOpen(false);
                                        }}
                                        className={cn(
                                            'w-full flex items-center gap-4 p-4 border-2 transition-all font-bold group',
                                            isActive ? 'bg-brutal-yellow border-black shadow-[4px_4px_0_0_#000]' : 'border-slate-200 hover:border-black hover:bg-slate-50 hover:shadow-[4px_4px_0_0_#000] bg-white text-slate-700 hover:text-black'
                                        )}
                                    >
                                        <Icon className={cn('w-6 h-6 transition-transform group-hover:scale-110')} strokeWidth={isActive ? 3 : 2} />
                                        <span className="text-sm uppercase tracking-wider">{item.label}</span>
                                    </button>
                                );
                            })}

                            {completedCourses.length > 0 && (
                                <button
                                    onClick={() => {
                                        setIsAllCertModalOpen(true);
                                    }}
                                    className="w-full flex items-center gap-4 p-4 border-2 border-slate-200 hover:border-black hover:bg-slate-50 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] bg-white text-slate-700 hover:text-black transition-all font-bold group mt-6"
                                >
                                    <Award className="w-6 h-6 text-brutal-purple transition-transform group-hover:scale-110" strokeWidth={2.5} />
                                    <span className="text-sm uppercase tracking-wider">My Certificates</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modals outside main layout flow */}
            <AllCertificatesModal
                open={isAllCertModalOpen}
                onClose={() => setIsAllCertModalOpen(false)}
                onViewCertificate={(course) => setSelectedCert(course)}
            />

            {selectedCert && (
                <UICertificateModal
                    open={!!selectedCert}
                    onClose={() => setSelectedCert(null)}
                    courseName={selectedCert.title}
                    userName={user?.fullName || "Student"}
                    completionDate={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    skills={selectedCert.skills || []}
                />
            )}
        </>
    );
};
