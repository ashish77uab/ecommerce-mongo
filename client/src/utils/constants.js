import { reactIcons } from "./icons";
export const links = [
  {
    path: ".",
    title: "Dashboard",
    icon: reactIcons.home,
  },
  {
    path: "categories",
    title: "Categories",
    icon: reactIcons.list,
  },
  {
    path: "products",
    title: "Products",
    icon: reactIcons.product,
  },
  {
    path: "orders",
    title: "Orders",
    icon: reactIcons.inventory,
  },
];
export const colorsOptions=[
    '#c4b5fd',
    '#bef264',
    '#fbbf24',
    '#7dd3fc',
    '#5eead4',
    '#fca5a5',
    '#f9a8d4',
    '#fde047',
    '#a3e635'
]
export const sortBy=[
    { id: 1, value:'', name: 'Sort By',  },
    { id: 2, value:'desc', name: 'High to low',  },
    { id: 3, value:'asc', name: 'Low to high',  },
      
]


export const getUserToken=()=>{
  return localStorage.getItem("ashishToken")
}
