import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { roleConfigs } from '@/constants/navigation';
import { useAuth } from '@/features/authentication/context/AuthContext';
import { UserRole } from '@/features/authentication/context/AuthContext';
import { cn } from '@/lib/utils';
import { filterNavigationByRole } from '@/utils/role';
import { Link, useMatches } from '@tanstack/react-router';
import { ChevronDown, ChevronUp, Menu, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface SidebarProps {
  isInsideSheet?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  defaultCollapsed?: boolean;
}

export function Sidebar({
  isInsideSheet = false,
  onCollapsedChange,
  defaultCollapsed = false,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const matches = useMatches();
  const { user, isLoading } = useAuth();

  const userRole = user?.user_type || 'member';

  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    onCollapsedChange?.(newState);
  };

  useEffect(() => {
    if (isInsideSheet && collapsed) {
      setCollapsed(false);
    }
  }, [isInsideSheet, collapsed]);

  // Get filtered navigation items based on user role - memoized for performance
  const filteredNavigation = useMemo(() => {
    return filterNavigationByRole(userRole);
  }, [userRole]);

  useEffect(() => {
    const currentPath = matches[matches.length - 1]?.pathname;
    if (!currentPath) return;

    // Use the filtered navigation items to check path matches
    filteredNavigation.forEach((group) => {
      group.items.forEach((item) => {
        if (item.children?.some((child) => currentPath.startsWith(child.path))) {
          setExpandedItems((prev) => (prev.includes(item.path) ? prev : [...prev, item.path]));
        }
      });
    });
  }, [matches, filteredNavigation]);

  const isActive = (path: string) => {
    return matches.some((match) => match.pathname.startsWith(path));
  };

  const toggleExpanded = (path: string) => {
    setExpandedItems((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path],
    );
  };

  const normalizedRole = userRole.toLowerCase() as UserRole;
  const roleConfig = roleConfigs[normalizedRole] || { title: userRole };

  if (isLoading) {
    return (
      <div
        className={cn(
          'h-screen transition-all duration-300 bg-gradient-to-b from-primary to-primary/95 text-foreground flex flex-col border-r border-border/40 shadow-sm',
          isInsideSheet ? 'w-full' : collapsed ? 'w-16' : 'w-64',
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border/40 bg-primary/60 backdrop-blur-sm">
          <div className="flex items-center">
            <img
              src="/images/DigistarClub_white.png"
              alt="DigistarClub"
              className={cn(
                'h-8 object-contain',
                collapsed && !isInsideSheet && 'hidden',
              )}
            />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  // If no navigation items after filtering, show a message
  if (filteredNavigation.length === 0) {
    return (
      <div
        className={cn(
          'h-screen transition-all duration-300 bg-gradient-to-b from-primary to-primary/95 text-foreground flex flex-col border-r border-border/40 shadow-sm',
          isInsideSheet ? 'w-full' : 'w-64',
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border/40 bg-primary/60 backdrop-blur-sm">
          <div className="flex flex-col items-start">
            <img
              src="/images/DigistarClub_white.png"
              alt="DigistarClub"
              className="h-8 object-contain"
            />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center p-4 text-center">
          <p className="text-muted-foreground">No menu items available for your role.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'h-screen transition-all duration-300 bg-gradient-to-b from-primary to-primary/95 text-foreground flex flex-col border-r border-border/40 shadow-sm',
        isInsideSheet ? 'w-full' : collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border/40 bg-primary/60 backdrop-blur-sm">
        <div className="flex flex-col items-start">
          <img
            src="/images/DigistarClub_white.png"
            alt="DigistarClub"
            className={cn(
              'h-8 object-contain',
              collapsed && !isInsideSheet && 'hidden',
            )}
          />
        </div>
        {!isInsideSheet && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            className="text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <TooltipProvider delayDuration={200}>
          {filteredNavigation.map((group, index) => (
            <div key={index} className="mb-6">
              {group.groupName && (!collapsed || isInsideSheet) && (
                <h2 className="px-4 mb-2 text-xs uppercase font-semibold tracking-wider text-white/70">
                  {group.groupName}
                </h2>
              )}
              <div className="space-y-1 px-2">
                {group.items.map((item) => (
                  <div key={item.path}>
                    {item.children && item.children.length > 0 ? (
                      <Collapsible open={expandedItems.includes(item.path)}>
                        <CollapsibleTrigger asChild>
                          {collapsed && !isInsideSheet ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className={cn(
                                    'w-full flex items-center justify-center px-3 py-2 rounded-md transition-all duration-200',
                                    isActive(item.path)
                                      ? 'bg-white/15 text-white shadow-sm'
                                      : 'hover:bg-white/10 hover:text-white text-white/80',
                                  )}
                                  onClick={() => toggleExpanded(item.path)}
                                >
                                  <item.icon className="h-5 w-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="font-medium">
                                {item.title}
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <Button
                              variant="ghost"
                              className={cn(
                                'w-full flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200',
                                isActive(item.path)
                                  ? 'bg-white/15 text-white shadow-sm font-medium'
                                  : 'hover:bg-white/10 hover:text-white text-white/80',
                              )}
                              onClick={() => toggleExpanded(item.path)}
                            >
                              <div className="flex items-center">
                                <item.icon className="mr-3 h-5 w-5" />
                                <span className="font-medium">{item.title}</span>
                              </div>
                              {expandedItems.includes(item.path) ? (
                                <ChevronUp className="h-4 w-4 opacity-70" />
                              ) : (
                                <ChevronDown className="h-4 w-4 opacity-70" />
                              )}
                            </Button>
                          )}
                        </CollapsibleTrigger>
                        <CollapsibleContent
                          className={cn('space-y-1 pt-1', collapsed ? 'pl-2' : 'pl-9')}
                        >
                          {item.children.map((child) =>
                            collapsed && !isInsideSheet ? (
                              <Tooltip key={child.path}>
                                <TooltipTrigger asChild>
                                  <Link
                                    to={child.path}
                                    className={cn(
                                      'flex items-center justify-center h-9 px-3 py-2 rounded-md transition-all duration-200',
                                      isActive(child.path)
                                        ? 'bg-white/20 text-white shadow-sm'
                                        : 'hover:bg-white/10 text-white/70 hover:text-white',
                                    )}
                                  >
                                    <child.icon className="h-4 w-4" />
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="font-medium">
                                  {child.title}
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <Link
                                key={child.path}
                                to={child.path}
                                className={cn(
                                  'flex items-center h-9 px-3 py-2 rounded-md transition-all duration-200',
                                  isActive(child.path)
                                    ? 'bg-white/20 text-white shadow-sm font-medium'
                                    : 'hover:bg-white/10 text-white/70 hover:text-white',
                                )}
                              >
                                <child.icon className="mr-3 h-4 w-4" />
                                <span>{child.title}</span>
                              </Link>
                            ),
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <>
                        {collapsed && !isInsideSheet ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                to={item.path}
                                className={cn(
                                  'flex items-center justify-center px-3 py-2 rounded-md transition-all duration-200',
                                  isActive(item.path)
                                    ? 'bg-white/15 text-white shadow-sm'
                                    : 'hover:bg-white/10 text-white/80 hover:text-white',
                                )}
                              >
                                <item.icon className="h-5 w-5" />
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="font-medium">
                              {item.title}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Link
                            to={item.path}
                            className={cn(
                              'flex items-center px-3 py-2 rounded-md transition-all duration-200',
                              isActive(item.path)
                                ? 'bg-white/15 text-white shadow-sm'
                                : 'hover:bg-white/10 text-white/80 hover:text-white',
                            )}
                          >
                            <item.icon className="mr-3 h-5 w-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </TooltipProvider>
      </nav>

      {(!collapsed || isInsideSheet) && (
        <div className="p-4 border-t border-border/40 text-xs text-white/60 bg-primary/60 backdrop-blur-sm">
          <div className="font-medium">Copyright © Digistar Club {new Date().getFullYear()}</div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
