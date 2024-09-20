import { io } from "socket.io-client";
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
  {
    path: "banners",
    title: "Banners",
    icon: reactIcons.gallery,
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
export const BANNERS_VALUE={
  homeBanner:'Home homeBanner'
}
export const BANNERS_VALUES_ONLY={
  homeBanner:'homeBanner'
}
export const bannerTypes=[
    { id: 1, value:'', label: 'Select Banner Type',  },
  { id: 2, value: BANNERS_VALUE.homeBanner, label: 'Home Banner',  },
      
]


export const getUserToken=()=>{
  return localStorage.getItem("ashishToken")
}


