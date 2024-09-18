import React, { useEffect, useState } from "react";
import { getBanners } from "../../api/api";
import { toast } from "react-toastify";
import ToastMsg from "../../components/toast/ToastMsg";
import { imageRender } from "../../utils/helpers";
import ActionButton from "../../components/button/ActionButton";
import { reactIcons } from "../../utils/icons";
import { Link, useNavigate } from "react-router-dom";
import RenderNoData from "../../components/layout/RenderNoData";
import { BANNERS_VALUE } from "../../utils/constants";
const Banners = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [banners, setBanners] = useState(null);
  const getAllBanners = async () => {
    setFetchLoading(true)
    try {
      const res = await getBanners();
      const { status, data } = res;
      if (status >= 200 && status <= 300) {
        setBanners(data);
      } else {
        toast.error(<ToastMsg title={data.message} />);
      }
    } catch (error) {
      console.log(error, 'error')
      toast.error(<ToastMsg title={error?.response?.data?.message} />);
    } finally {
      setFetchLoading(false)
    }
  };
  useEffect(() => {
    getAllBanners();
  }, []);


  return (
    <>
      <div>
        <header className="mb-4 flex items-center justify-between">
          <h3 className="heading-3">All Banners </h3>
          <Link to='add' className="btn-primary">Add Banner </Link>
        </header>
        <div>
          <div className="overflow-x-auto w-full">
            <table>
              <thead>
                <tr>
                  <th className="w-[80px]">Sr.No</th>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {banners?.map((banner, index) => (
                  <tr>
                    <td className="w-[80px]">{index + 1}</td>
                    <td>{BANNERS_VALUE[banner?.type]}</td>
                    <td>
                      <div className="flex justify-center items-center flex-col gap-1">
                        {banner?.images?.map((url,index)=>(
                          <div className="h-14 ">
                            <img
                              className="w-full h-full object-contain"
                              src={imageRender(url)}
                              alt={banner.name}
                            />
                          </div>
                        ))}
                        
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center gap-2">
                        <ActionButton onClick={() => navigate(`update/${banner.id}`,{
                          state:{
                            banner
                          }
                        })}>{reactIcons.edit}</ActionButton>
                       
                      </div>
                    </td>
                  </tr>
                ))}
                {banners?.length < 1 && !fetchLoading && <RenderNoData title={'No banners available'} />}
                {fetchLoading && <div className="py-8 text-center font-semibold">Loading please wait....</div>}

              </tbody>
            </table>
          </div>
        </div>
      </div>
     
    </>
  );
};

export default Banners;
