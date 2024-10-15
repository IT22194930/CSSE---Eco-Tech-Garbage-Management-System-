import { useEffect, useState } from "react";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { BlobProvider } from "@react-pdf/renderer";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import * as XLSX from "xlsx";
import { writeFile } from "xlsx";
import { MdDelete } from "react-icons/md";
import PaymentReport from "./Reports/PaymentReports";

const PaymentDetails = () => {
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setpaymentFilter] = useState("");

  useEffect(() => {
    axiosFetch
      .get("/api/payments/")
      .then((res) => {
        const data = Array.isArray(res.data.transactionLogs)
          ? res.data.transactionLogs
          : []; // Access the transactionLogs key
        setPaymentDetails(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const generateExcelFile = () => {
    const filteredDataList = filteredPayment.map((payment) => ({
      Id: payment._id,
      Amount: payment.amount,
      TransactionType: payment.transactionType,
      Date: new Date(payment.date).toLocaleString(),
    }));

    if (filteredDataList.length === 0) {
      Swal.fire({
        title: "No Data",
        text: "There are no records to export.",
        icon: "info",
      });
      return;
    }

    const ws = XLSX.utils.json_to_sheet(filteredDataList);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payment Details Report");
    writeFile(wb, "payment_details_report.xlsx");
  };

  const handleButtonClick = () => {
    generateExcelFile();
  };

  const filteredPayment = Array.isArray(paymentDetails)
    ? paymentDetails.filter((payment) => {
        const matchesSearch = payment.transactionType
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

        const matchesPayment = paymentFilter
          ? payment?.transactionType?.toLowerCase() ===
            paymentFilter.toLowerCase()
          : true;

        return matchesSearch && matchesPayment;
      })
    : [];

  return (
    <div className="px-4 sm:px-0">
      <h1 className="text-center text-4xl font-bold my-7">Financial Details</h1>

      {/* Search and Filter Inputs */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search payment by user name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />

        <div
          className="flex space-x-4"
          data-aos="flip-up"
          data-aos-duration="1000"
        >
          <select
            value={paymentFilter}
            onChange={(e) => setpaymentFilter(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="">All Types</option>
            <option value="cashback">Cashback</option>
            <option value="monthly fee">Monthly Fee</option>
            <option value="bill payment">Bill Payment</option>
          </select>
          <BlobProvider
            document={<PaymentReport dataList={filteredPayment} />}
            fileName="PaymentDetailReport.pdf"
          >
            {({ url }) => (
              <li className="flex items-center">
                <a href={url} target="_blank" className="flex items-center">
                  <FaFilePdf className="text-3xl text-red-600" />
                </a>
              </li>
            )}
          </BlobProvider>

          <li className="flex items-center">
            <a
              href="#"
              onClick={handleButtonClick}
              className="flex items-center"
            >
              <FaFileExcel className="text-3xl text-green-600" />
            </a>
          </li>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex flex-col">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              {filteredPayment.length === 0 ? (
                <p className="text-center text-gray-500">No payment found</p>
              ) : (
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium hidden md:table-header-group">
                    <tr>
                      <th scope="col" className="px-4 py-4">
                        #
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Amount
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Transaction Type
                      </th>
                      <th scope="col" className="px-4 py-4">
                        Date
                      </th>
                      {/* <th scope="col" className="px-4 py-4">
                        DELETE
                      </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayment.map((payment, idx) => (
                      <tr
                        key={payment._id}
                        className="border-b transition duration-300 ease-in-out hover:bg-neutral-100"
                      >
                        <td className="whitespace-nowrap px-4 py-4 font-medium">
                          {idx + 1}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          {payment?.amount}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          {payment?.transactionType}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          {payment?.date}
                        </td>
                        {/* <td className="whitespace-nowrap px-4 py-4">
                          <span
                            onClick={() => handleDelete(payment._id)}
                            className="inline-flex items-center gap-2 cursor-pointer bg-red-600 py-1 rounded-md px-2 text-white"
                          >
                            Delete <MdDelete className="text-white" />
                          </span>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
