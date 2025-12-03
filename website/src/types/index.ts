export interface Route {
  path: string;
  component: React.ComponentType;
  title: string;
}

export interface NavItem {
  label: string;
  path?: string;
  dropdown?: NavItem[];
}
