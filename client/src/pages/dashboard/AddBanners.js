import React, { useEffect, useState } from "react";

import ReactSelect from "../../components/forms/ReactSelect";
import {
    updateBanner,
    addBanner,
    deleteBannerImage
} from "../../api/api";
import { toast } from "react-toastify";
import ToastMsg from "../../components/toast/ToastMsg";
import MultipleFileUpload from "../../components/forms/MultipleFileUpload";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { imageRender } from "../../utils/helpers";
import { reactIcons } from "../../utils/icons";
import { BANNERS_VALUE, bannerTypes } from "../../utils/constants";

const AddBanners = () => {
    const{state}=useLocation()
    const bannerId = state?.banner?.id;
    const bannerImages = state?.banner?.images;
    const fetchedBannerType = state?.banner?.type;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [updateImages, setUpdateImages] = useState([]);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const handleReset = () => {
        setImages(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData();
        for (const [key, value] of Object.entries({ type: selectedBanner?.value })) {
            formData.append(key, value);
        }
        if (bannerId) {
            if (updateImages && updateImages.length > 0) {
                updateImages.forEach((f) => {
                    formData.append("images", f);
                });
            }
        } else {
            if (images.length > 0) {
                images.forEach((f) => {
                    formData.append("images", f);
                });
            }

        }
        try {
            const res = bannerId ? await updateBanner(bannerId, formData) : await addBanner(formData);
            const { status, data } = res;
            if (status >= 200 && status < 300) {
                toast.success(<ToastMsg title={`${bannerId ? 'Updated' : 'Added'} Successfully`} />);
                handleReset();
                navigate("/dashboard/banners");
            } else {
                toast.error(<ToastMsg title={data.message} />);
            }
        } catch (error) {
            console.log(error, "error");
            toast.error(<ToastMsg title={error?.response?.data?.message} />);
        } finally {
            setLoading(false)
        }
    };

    const handleRemoveImage = async (url) => {
        setDeleteLoading(true)
        try {
            const res = await deleteBannerImage(bannerId, { imgPath: url, type: fetchedBannerType });
            const { status, data } = res;
            if (status >= 200 && status < 300) {
                toast.success(<ToastMsg title={`Deleted Successfully`} />);
                setImages(images.filter(image => image !== url))
            } else {
                toast.error(<ToastMsg title={data.message} />);
            }
        } catch (error) {
            console.log(error, "error");
            toast.error(<ToastMsg title={error?.response?.data?.message} />);
        } finally {
            setDeleteLoading(false)
        }

    }
    useEffect(()=>{
        if(bannerId) {
            setImages(bannerImages);
            setSelectedBanner({ label: BANNERS_VALUE[fetchedBannerType], value: fetchedBannerType })
        }

    },[bannerId])

    return (
        <div className="py-10 px-4">
            <form
                onSubmit={handleSubmit}
                action=" "
                className="max-w-5xl mx-auto"
            >
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <ReactSelect
                            label={"Choose Banner Types"}
                            options={bannerTypes}
                            value={selectedBanner || bannerTypes[0]}
                            onChange={(e) => {
                                setSelectedBanner(e);
                            }}
                        />
                    </div>
                    <div className="col-span-2">
                        <MultipleFileUpload
                            setImages={bannerId ? setUpdateImages : setImages}
                            images={bannerId ? updateImages : images}
                        />
                        <div className="flex gap-4  flex-wrap my-4">
                            {bannerId && images?.length > 0 && (
                                images?.map((url, index) => (
                                    <div key={index} className="flex flex-col gap-1 relative bg-gray-300 p-1 rounded-md">
                                        {/* <button type="button" onClick={()=>handleFrontImage(index)} className="text-2xl flex-center bg-pink-100 rounded-full w-8 h-8 text-red-500 absolute top-2 right-2">{ isFront===index? reactIcons.heartFill :  reactIcons.heartOutline}</button> */}
                                        <button type="button" onClick={() => handleRemoveImage(url)} className="text-xl flex-center bg-pink-100 rounded-full w-8 h-8 text-red-500 absolute left-2 top-2">{reactIcons.delete}</button>
                                        <img className="w-32 h-32 object-contain cursor-pointer" src={imageRender(url)} alt="" />
                                    </div>
                                ))
                            )}
                        </div>
                        {deleteLoading && <div className="text-red-600 py-2">Deleting please wait...</div>}
                    </div>
                    <div className="col-span-2">
                        <button type="submit" className="btn-primary">
                            {loading ? 'Loading...' : bannerId ? 'Update' : 'Add'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddBanners;
