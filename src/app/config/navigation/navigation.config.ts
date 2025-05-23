export interface NavChild {
  label: string;
  path: string;
  icon?: string;
  labelColor?: string;
}

export interface NavItem {
  type: 'link' | 'heading';
  label: string;
  path?: string;
  icon?: string;
  labelColor?: string;
  hoverLabelColor?: string;
  hoverLinkAnimation?: string;
  children?: NavChild[];
}

export const hoverLinkAnimations = [
  {
    type: 'underline',
    animation:
      'after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#0d9488] after:transition-all after:duration-300 hover:after:w-full',
  },
];

export const NavigationConfig: NavItem[] = [
  // { type: 'heading', label: 'Main Section' },
  {
    type: 'link',
    label: 'NAVIGATION_LINK_1',
    path: '/',
    labelColor: 'text-[#000]',
    hoverLabelColor: 'hover:!text-[#e1b609] transition duration-200',
  },
  {
    type: 'link',
    label: 'NAVIGATION_LINK_2',
    path: '/templates',
    labelColor: 'text-[#000]',
    hoverLabelColor: 'hover:!text-[#e1b609] transition duration-200',
  },
  {
    type: 'link',
    label: 'NAVIGATION_LINK_3',
    path: '/features',
    labelColor: 'text-[#000]',
    hoverLabelColor: 'hover:!text-[#e1b609] transition duration-200',
  },
  {
    type: 'link',
    label: 'NAVIGATION_LINK_4',
    path: '/pricing',
    labelColor: 'text-[#000]',
    hoverLabelColor: 'hover:!text-[#e1b609] transition duration-200',
  },
  {
    type: 'link',
    label: 'NAVIGATION_LINK_5',
    path: '/contact',
    labelColor: 'text-[#000]',
    hoverLabelColor: 'hover:!text-[#e1b609] transition duration-200',
  },
  {
    type: 'link',
    label: 'Cart',
    icon: 'shopping_cart',
    path: '/cart',
    labelColor: 'text-[#000]',
    hoverLabelColor: 'hover:!text-[#000] transition duration-200',
  },
];
