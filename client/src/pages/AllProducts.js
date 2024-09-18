import React, { useEffect, useState } from "react";
import {  getCategories, getProducts } from "../api/api";
import { toast } from "react-toastify";
import ToastMsg from "../components/toast/ToastMsg";
import ProductCardSkeleton from "../components/cards/ProductCardSkeleton";
import ProductCard from "../components/cards/ProductCard";
import { reactIcons } from "../utils/icons";
import { Listbox, Transition } from "@headlessui/react";
import { sortBy } from "../utils/constants";
import TextInput from "../components/forms/TextInput";
import { useSearchParams } from "react-router-dom";

const AllProducts = () => {
    const [searchParams]=useSearchParams()
    const category=searchParams.get('category')
    const initialCategory = category ? [category]:[]
    const [categories, setCategories] = useState([]);
    console.log(categories)
    const [priceFilter, setPriceFilter] = useState({
        min:'',
        max:''
    });
    const [products, setProducts] = useState([]);
    const [skeletonLoading, setSkeletonLoading] = useState(true);
    const [selectedSort, setSelectedSort] = useState(sortBy[0]);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const handleApplyFilter=()=>{
        getAllProducts({ category: selectedCategory, min: priceFilter?.min, max: priceFilter?.max, sort: selectedSort?.value });
    }
    const handleResetFilter =()=>{
        getAllProducts({ category: [], min: '', max: '', sort: '' });
        setPriceFilter({
            min: '',
            max: ''
        })
        setSelectedSort(sortBy[0])
        setSelectedCategory([])
    }
    const handleSelectCategory = (e,categoryId)=>{
        if (!selectedCategory?.includes(categoryId)){
            setSelectedCategory([...selectedCategory, categoryId]);
        }else{
            setSelectedCategory(selectedCategory.filter((item) => item !== categoryId));

        }
    }
    const getAllCategories = async () => {
        try {
            const res = await getCategories();
            const { status, data } = res;
            if (status >= 200 && status <= 300) {
                setCategories(data);
            } else {
                toast.error(<ToastMsg title={data.message} />);
            }
        } catch (error) {
            toast.error(<ToastMsg title={error?.response?.data?.message} />);
        }
    };
    
    const getAllProducts = async (params) => {
        try {
            const res = await getProducts(params);
            const { status, data } = res;
            if (status >= 200 && status <= 300) {
                setProducts(data);
            } else {
                toast.error(<ToastMsg title={data.message} />);
            }
        } catch (error) {
            toast.error(<ToastMsg title={error?.response?.data?.message} />);
        } finally {
            setSkeletonLoading(false);
        }
    };
    useEffect(() => {
        getAllCategories();
    }, []);

    useEffect(()=>{
        getAllProducts({ category: selectedCategory, min: priceFilter?.min, max: priceFilter?.max, sort: selectedSort?.value });
    }, [selectedSort])
    return (
        <section>
            <div className="container  flex md:flex-row flex-col  md:gap-8 gap-10 py-10 items-start">
                <div className="lg:w-80 md:w-60 w-full  border-c flex-shrink-0 rounded-md ">
                    <header className="py-4 px-4 border-b border-b-zinc-200 mb-2">
                        <h4 className="heading-4">Filter By</h4>
                    </header>
                    <div className="px-4 mb-4">
                        <header>
                            <h5 className="heading-6 mb-2">Categories</h5>
                            <ul className="space-y-2">
                                {categories.map((item, index) => (
                                    <li key={index} className="font-medium">
                                     <label htmlFor={item._id} className="flex gap-2 items-center">
                                            <input className="accent-amber-500 w-4 h-4" type="checkbox" name="category" value={item?._id} checked={selectedCategory?.includes(item?._id)} id={item._id} onChange={(e)=>handleSelectCategory(e,item?._id)}/>
                                           {item.name}
                                     </label>
                                    </li>
                                ))}
                            </ul>
                        </header>
                    </div>
                    <div className="px-4 pb-10">
                        <div>
                            <h5 className="heading-6 mb-2">Price</h5>
                            <div className="flex gap-2">
                                <TextInput value={priceFilter.min} onChange={(e)=>setPriceFilter({...priceFilter,min:e.target.value})} placeholder='Min'/>
                                <TextInput value={priceFilter.max} onChange={(e)=>setPriceFilter({...priceFilter,max:e.target.value})} placeholder='Max'/>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-col gap-2">
                            <button onClick={handleApplyFilter} className="btn-primary w-full">Apply Filter</button>
                            <button onClick={handleResetFilter} className="btn-secondary w-full">Reset Filter</button>
                        </div>
                    </div>
                </div>
                <div className="flex-1 w-full">
                    <header className="mb-4 flex justify-between gap-8">
                        <h4 className="heading-3">All Products</h4>
                        <div className="md:w-[250px] min-w-[150px]">
                            <Listbox
                                value={selectedSort}
                                onChange={(value) => {
                                    setSelectedSort(value);
                                }}
                            >
                                <div className="relative">
                                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 h-10 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                        <span className="block truncate">
                                            {selectedSort.name ||
                                                "Select a category"}
                                        </span>
                                        <span className="pointer-events-none absolute text-gray-400 text-20 inset-y-0 right-0 flex items-center pr-2">
                                            {reactIcons.arrowDown}
                                        </span>
                                    </Listbox.Button>
                                    <Transition
                                        as={React.Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="absolute mt-1 max-h-60 z-[100] w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {sortBy?.map((sort, index) => (
                                                <Listbox.Option
                                                    key={index}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                            active
                                                                ? "bg-amber-100 text-amber-900"
                                                                : "text-gray-900"
                                                        }`
                                                    }
                                                    value={sort}
                                                >
                                                    {({ selected }) => (
                                                        <>
                                                            <span
                                                                className={`block truncate ${
                                                                    selected
                                                                        ? "font-medium"
                                                                        : "font-normal"
                                                                }`}
                                                            >
                                                                {sort.name}
                                                            </span>
                                                            {selected ? (
                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                                    {
                                                                        reactIcons.check
                                                                    }
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </Listbox>
                        </div>
                    </header>
                    <div className="grid md:grid-cols-1 grid-cols-2 lg:grid-cols-3 md:gap-4 gap-1">
                        {skeletonLoading
                            ? Array(12)
                                  .fill(2)
                                  .map((_item, index) => (
                                      <ProductCardSkeleton key={index} />
                                  ))
                            : products?.length >0 ?  products.map((product) => (
                                  <ProductCard product={product} />
                              )) : <div className="text-center col-span-full py-8 text-xl">Not found any product</div>}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AllProducts;
