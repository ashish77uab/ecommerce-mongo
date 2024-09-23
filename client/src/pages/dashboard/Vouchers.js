import React, { useEffect, useState } from "react";
import { deleteVoucher, getAllVouchers } from "../../api/api";
import { toast } from "react-toastify";
import ToastMsg from "../../components/toast/ToastMsg";
import { numberWithCommas } from "../../utils/helpers";
import { reactIcons } from "../../utils/icons";
import Pagination from "../../components/Pagination";
import UpdateOrderStatus from "../../components/modals/UpdateOrderStatus";
import RenderNoData from "../../components/layout/RenderNoData";
import { Link, useNavigate } from "react-router-dom";
import ActionButton from "../../components/button/ActionButton";
import moment from "moment";
import DeleteConfirmation from "../../components/modals/DeleteConfirmation";
import DeleteButton from "../../components/button/DeleteButton";

const Vouchers = () => {
  const navigate=useNavigate()
  const limit = 10
  const [isConfirmedOpen, setIsConfirmedOpen] = useState(false);
  const [vouchers, setVouchers] = useState(null);
  const [page, setPage] = useState(1);
  const [voucherId, setVoucherId] = useState(null)
  const [fetchLoading, setFetchLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const getAllVouchersList = async () => {
    setFetchLoading(true)
    try {
      const res = await getAllVouchers({ limit, page });
      const { status, data } = res;
      if (status >= 200 && status <= 300) {
        setVouchers(data);
      } else {
        toast.error(<ToastMsg title={data.message} />);
      }
    } catch (error) {
      toast.error(<ToastMsg title={error?.response?.data?.message} />);
    } finally {
      setFetchLoading(false)
    }
  };
  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      const res = await deleteVoucher(voucherId);
      const { status, data } = res;
      if (status >= 200 && status <= 300) {
        setIsConfirmedOpen(false)
        toast.success(<ToastMsg title={'Deleted Successfully'} />);
        getAllVouchersList()
      } else {
        toast.error(<ToastMsg title={data.message} />);
      }
    } catch (error) {
      toast.error(<ToastMsg title={error?.response?.data?.message} />);
    } finally {
      setDeleteLoading(false)
    }
  };
const handleCloseModal=()=>{
  setIsConfirmedOpen(false)
  setVoucherId(null)
}

  useEffect(() => {
    getAllVouchersList();
  }, [page]);
  return (
    <>
      <div>
        <header className="mb-4 flex items-center justify-between">
          <h3 className="heading-3">All Vouchers </h3>
          <Link to='/dashboard/create/vouchers' className="btn-primary">Add New Voucher </Link>
        </header>
        <div>
          <div className="overflow-x-auto w-full">
            <table>
              <thead>
                <tr>
                  <th className="w-[80px]">Sr.No</th>
                  <th>Name of voucher</th>
                  <th>code</th>
                  <th>Discount percentage</th>
                  <th>Maximum Discount Value</th>
                  <th>Maximum usage limit</th>
                  <th>Expiry date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {vouchers?.vouchers?.map((voucher, index) => (
                  <tr>
                    <td className="w-[80px]">{index + 1}</td>
                    <td>{voucher.name}</td>
                    <td>{voucher.code}</td>
                    <td>{voucher.discountValue}</td>
                    <td>Rs.{numberWithCommas(voucher.maxDiscountValue)}</td>
                    <td>{voucher.usageLimit}</td>
                    <td>{moment(voucher.expirationDate).format('DD, MMM YYYY hh:mm a')}</td>
                    <td>
                      <div className="flex justify-center gap-2">

                        <ActionButton
                          onClick={() => {
                            navigate(`/dashboard/update/vouchers/${voucher?._id}`);
                          }}

                        >
                          {reactIcons.edit}
                        </ActionButton>
                        <DeleteButton
                          onClick={() => {
                            setVoucherId(voucher._id);
                            setIsConfirmedOpen(true);
                          }}

                        >
                          {reactIcons.trash}
                        </DeleteButton>
                      </div>
                    </td>
                  </tr>
                ))}
                {vouchers?.vouchers?.length < 1 && !fetchLoading && <RenderNoData title="No vouchers found." />}
                {fetchLoading && <div className="py-8 text-center font-semibold">Loading please wait....</div>}
              </tbody>
            </table>
          </div>
          <div className="my-4">
            <Pagination handlePageClick={(page) => {
              console.log(page?.selected)
              setPage(page?.selected + 1)
            }} pageCount={vouchers?.totalPages} />

          </div>
        </div>
      </div>
      <DeleteConfirmation
        isOpen={isConfirmedOpen}
        closeModal={handleCloseModal}
        title={"Delete Voucher"}
        handleDelete={handleDelete}
        loading={deleteLoading}
      />
    </>
  );
};

export default Vouchers;
