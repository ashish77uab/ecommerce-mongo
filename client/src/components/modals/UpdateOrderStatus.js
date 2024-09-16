import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { addCategory, updateCategory, updateOrderStatus } from "../../api/api";
import { toast } from "react-toastify";
import ToastMsg from "../toast/ToastMsg";
import { colorsOptions } from "../../utils/constants";
import ReactSelect from "../forms/ReactSelect";
const statusArray=[
  {
  value: 'Pending',
  label: 'Pending'
},{
  value: 'Processed',
  label: 'Processed'
},
{
  value: 'Delivered',
  label: 'Delivered'
},
{
  value: 'Rejected',
  label: 'Rejected'
}
]

const UpdateOrderStatus = ({ isOpen, closeModal, formData, fetchData }) => {
  const [status, setStatus] = useState({ label: formData?.status, value: formData?.status })

  const handleReset = () => {
    closeModal();
  };
  useEffect(( )=>{
    if (formData && formData.status) {
      setStatus({ label: formData?.status, value: formData?.status })
    }
  }, [formData])
  const handleSubmit = async (value) => {
    try {
      const res = await updateOrderStatus({ status: value, id: formData.id});
      const { status, data } = res;
      if (status >= 200 && status < 300) {
        toast.success(<ToastMsg title={`Updated Successfully`} />);
        handleReset();
        fetchData()
      } else {
        toast.error(<ToastMsg title={data.message} />);
      }
    } catch (error) {
      console.log(error, "error");
      toast.error(<ToastMsg title={error?.response?.data?.message} />);
    }
  };
 

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[1000]" onClose={handleReset}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                onSubmit={handleSubmit}
                as="form"
                className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
              >
                <Dialog.Title as="h4" className="heading-4 text-center">
                  Change order status
                </Dialog.Title>
                <div className="mt-2 min-h-[400px]">
                  <div className=" w-full">
                    <div className="grid grid-cols-1 gap-x-4 gap-y-2 py-6">
                      
                      <div className="flex flex-col gap-1">
                        <ReactSelect
                          label={"Choose order status to"}
                          options={statusArray}
                          value={status || statusArray[0]}
                          onChange={(e) => {
                            setStatus(e);
                            handleSubmit(e.value)
                          }}
                        />
                      </div>
                      
                    </div>
                  </div>
                </div>

                
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UpdateOrderStatus;
