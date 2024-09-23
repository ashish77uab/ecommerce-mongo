import React, { useEffect, useState } from "react";
import TextInput from "../../components/forms/TextInput";
import { createVoucher, getVoucher, updateVoucher } from "../../api/api";
import { toast } from "react-toastify";
import ToastMsg from "../../components/toast/ToastMsg";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { reactIcons } from "../../utils/icons";
const initialState = {
    name:'',
    discountValue: '',
    maxDiscountValue: '',
    isActive: true,
    usageLimit: '',
    date: '',
    time: '',
};

const CreateAndUpdateVoucher = () => {
    const { voucherId } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };
    const handleReset = () => {
        setForm(initialState);
    };
    const areFieldsNotEmpty = (state) => {
        for (const key in state) {
            if (state.hasOwnProperty(key)) {
                const value = state[key];

                // Check if the value is empty, ignoring isFeatured since it's boolean
                if (key !== 'isActive' && key !== 'isUsed' && !value && value?.trim() === "") {
                    return false;  // Return false if any field is empty
                }
            }
        }
        return true; // All fields are non-empty
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = areFieldsNotEmpty(form);
        if (!isValid) {
            toast.error(<ToastMsg title="Please fill all required fields" />);
            return;
        }

        
        const combinedDateTime = `${form.date} ${form.time}`;
        const formattedDateTime = moment(combinedDateTime, 'YYYY-MM-DD HH:mm').toLocaleString();

        const formData ={
            name:form?.name,
            discountValue:Number(form?.discountValue),
            maxDiscountValue:Number(form?.maxDiscountValue),
            isActive:form.isActive,
            expirationDate: formattedDateTime,
            usageLimit:Number(form?.usageLimit),
           
        }
        setLoading(true)
        console.log(formData,'formData')
        try {
            const res = voucherId ? await updateVoucher(voucherId, formData) : await createVoucher(formData);
            const { status, data } = res;
            if (status >= 200 && status < 300) {
                toast.success(<ToastMsg title={`${voucherId ? 'Updated' : 'Created'} Successfully`} />);
                handleReset();
                navigate("/dashboard/vouchers");
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
    const getVoucherData = async (id) => {
        try {
            const res = await getVoucher(id);
            const { status, data } = res;
            if (status >= 200 && status <= 300) {
                setForm({
                    discountValue: data?.discountValue || '',
                    name: data?.name || '',
                    maxDiscountValue:data?.maxDiscountValue|| '' ,
                    isActive:data?.isActive|| '' ,
                    usageLimit: data?.usageLimit || '' ,
                    expirationDate:data?.expirationDate|| '' ,
                    date: moment(data?.expirationDate)?.format('YYYY-MM-DD') || '',
                    time: moment(data?.expirationDate)?.format('HH:mm') || '',
                });
            } else {
                toast.error(<ToastMsg title={data.message} />);
            }
        } catch (error) {
            console.log(error)
            toast.error(<ToastMsg title={error?.response?.data?.message} />);
        }
    };
    useEffect(() => {
        if (voucherId) {
            getVoucherData(voucherId);
        }
    }, [voucherId]);

    return (
        <div className="py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <h2 className="heading-3 flex items-center gap-1 mb-6"><span className="md:text-4xl text-2xl" role="button" onClick={() => {
                    navigate(-1)
                }}>{reactIcons.goback}</span> {voucherId? 'Update Voucher' : 'Create Voucher'}</h2>
                <form
                    onSubmit={handleSubmit}
                    className="w-full"
                >
                    <div className="grid grid-cols-2 gap-6">
                        <TextInput
                            type="test"
                            name="name"
                            label={"Voucher name"}
                            placeholder="Enter voucher name"
                            value={form.name}
                            onChange={handleChange}
                        />
                        <TextInput
                            min={1}
                            type="number"
                            name="discountValue"
                            label={" Discount percentage"}
                            placeholder="Enter discount value in percent"
                            max={100}
                            value={form.discountValue}
                            onChange={handleChange}
                        />


                        <TextInput
                            type="number"
                            name="maxDiscountValue"
                            label={"Maximum Discount Value"}
                            placeholder="Enter Maximum discount value "
                            value={form.maxDiscountValue}
                            onChange={handleChange}
                        />
                        <TextInput
                            type="number"
                            name="usageLimit"
                            label={"Maximum usage limit"}
                            placeholder="Enter Maximum usage limit "
                            value={form.usageLimit}
                            onChange={handleChange}
                        />
                        <TextInput
                            type="date"
                            name="date"
                            label={"Expiry date"}
                            placeholder="Enter expiry date "
                            value={form.date}
                            onChange={handleChange}
                        />
                        <TextInput
                            type="time"
                            name="time"
                            label={"Expiry time"}
                            placeholder="Enter expiry time"
                            value={form.time}
                            onChange={handleChange}
                        />




                        <div className="flex gap-2 col-span-2">
                            <label
                                htmlFor="isActive"
                                className="flex items-center gap-4"
                            >
                                <input
                                    checked={form.isActive}
                                    onChange={(e) => {
                                        setForm({
                                            ...form,
                                            isActive: e.target.checked,
                                        });
                                    }}
                                    className="w-5 h-5 accent-amber-500"
                                    type="checkbox"
                                    name=""
                                    id=""
                                />
                                <span>
                                    Active ?
                                </span>
                            </label>
                        </div>
                        <div className="col-span-2">
                            <button type="submit" className="btn-primary">
                                {loading ? 'Loading...' : voucherId ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
           
        </div>
    );
};

export default CreateAndUpdateVoucher;
